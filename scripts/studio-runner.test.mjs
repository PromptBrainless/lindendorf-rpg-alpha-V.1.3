import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let vite;
let runner;
let studioModel;
let gameTypes;
let studioStore;
let studioLibrary;
let studioPreview;
let storage;
const previousStorage = globalThis.localStorage;

class MemoryStorage {
  values = new Map();

  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

before(async () => {
  vite = await createServer({
    configFile: "vite.config.ts",
    server: { middlewareMode: true },
    appType: "custom",
  });
  [runner, studioModel, gameTypes, studioLibrary, studioPreview] = await Promise.all([
    vite.ssrLoadModule("/src/game/studio/runner.ts"),
    vite.ssrLoadModule("/src/game/studio/model.ts"),
    vite.ssrLoadModule("/src/game/types.ts"),
    vite.ssrLoadModule("/src/game/studio/library.ts"),
    vite.ssrLoadModule("/src/components/welt/StudioVorschau.tsx"),
  ]);
  studioStore = await vite.ssrLoadModule("/src/game/studio/store.ts");
  storage = new MemoryStorage();
  globalThis.localStorage = storage;
});

after(async () => {
  await vite?.close();
  if (previousStorage === undefined) delete globalThis.localStorage;
  else globalThis.localStorage = previousStorage;
});

function scene(id, data = {}) {
  return {
    id,
    workspaceId: "workspace-1",
    type: "szene",
    schemaVersion: 1,
    title: id,
    data,
    tags: [],
    revision: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

function workspaceWith(entities, relations = []) {
  return { ...studioModel.newWorkspace("Testprojekt"), entities, relations };
}

test("neues Maker-Projekt startet leer statt mit einer Lindendorf-Demo", () => {
  const workspace = studioModel.newWorkspace();
  assert.equal(workspace.name, "Neues RPG-Projekt");
  assert.deepEqual(workspace.entities, []);
  assert.equal(workspace.startSceneId, undefined);
});

test("Lindendorf-Bibliothek enthält Medien und einzeln auswählbare Spielbausteine", () => {
  const entries = studioLibrary.lindendorfLibrary();
  const categories = new Set(entries.map((entry) => entry.category));
  assert.ok(entries.filter((entry) => entry.category === "medium").length >= 100);
  for (const category of ["abschnitt", "szene", "figur", "wissen", "gegenstand"]) assert.ok(categories.has(category));
});

test("Maker-Szenen werden als SceneView mit Standardwerten dargestellt", () => {
  const view = runner.makerSceneView(scene("start"), gameTypes.createHeld("Vorschau", 8, 8, 8));
  assert.ok(view);
  assert.equal(view.title, "start");
  assert.equal(view.art, "village");
  assert.deepEqual(view.lines, ["Du stehst in deiner neuen Szene."]);
  assert.deepEqual(view.choices, ["Weiter"]);
});

test("Vollbildvorschau rendert echte SceneStage-Inhalte und den Rückweg", () => {
  const workspace = workspaceWith([scene("start", { lines: ["Dein erster Absatz."], choices: ["Weiter"] })]);
  const startSceneId = workspace.entities[0].id;
  const markup = renderToStaticMarkup(React.createElement(studioPreview.StudioVorschau, {
    workspace,
    startSceneId,
    onClose() {},
  }));
  assert.match(markup, /start/);
  assert.match(markup, /Dein erster Absatz/);
  assert.match(markup, /Werkstatt/);
});

test("Wahlziel löst nur explizite Szenenrelationen auf", () => {
  const start = scene("start", { choices: ["Weiter"] });
  const end = scene("end");
  const workspace = workspaceWith([start, end], [{
    id: "choice-1",
    workspaceId: "workspace-1",
    fromId: start.id,
    toId: end.id,
    kind: "choice",
    data: { choiceIndex: 0 },
  }]);
  assert.equal(runner.wahlZiel(workspace, "start", 0), "end");
  assert.equal(runner.wahlZiel(workspace, "start", 1), null);
});

test("explizite Endwahlen sind keine fehlenden Szenenziele", () => {
  const ending = scene("ending", { choices: ["Das Dorf verlassen"], endingChoices: [0] });
  const workspace = workspaceWith([ending]);
  assert.equal(runner.wahlIstEnde(ending, 0), true);
  assert.equal(runner.wahlZiel(workspace, ending.id, 0), null);
  assert.equal(studioModel.validateWorkspace(workspace).findings.length, 0);
});

test("Workspace-Validator weist ungültige Startszene und Wahlposition zurück", () => {
  const start = scene("start", { choices: ["Weiter"] });
  const end = scene("end");
  const workspace = {
    ...workspaceWith([start, end], [{
      id: "choice-invalid",
      workspaceId: "workspace-1",
      fromId: start.id,
      toId: end.id,
      kind: "choice",
      data: { choiceIndex: 2 },
    }]),
    startSceneId: "missing-scene",
  };
  const findings = studioModel.validateWorkspace(workspace).findings;
  assert.ok(findings.some((finding) => finding.message.includes("Startszene")));
  assert.ok(findings.some((finding) => finding.message.includes("Wahlposition")));
});

test("Workspace-Validator prüft Entitätsdaten gegen das registrierte Schema", () => {
  const malformed = scene("malformed", { lines: "kein Zeilenarray" });
  const findings = studioModel.validateWorkspace(workspaceWith([malformed])).findings;
  assert.ok(findings.some((finding) => finding.entityId === malformed.id && finding.message.startsWith("lines:")));
});

test("Mehrprojekt-Store übernimmt den alten Workspace und erhält ihn beim Neuanlegen", () => {
  const legacy = studioModel.newWorkspace("Altes Projekt");
  storage.setItem("lindendorf.studio.workspace.v1", JSON.stringify(legacy));
  const store = new studioStore.LocalWorkspaceStore();
  assert.equal(store.list()[0].id, legacy.id);

  const next = studioModel.newWorkspace("Neues Projekt");
  store.save(next);
  assert.deepEqual(new Set(store.list().map((workspace) => workspace.id)), new Set([legacy.id, next.id]));
  assert.equal(store.load()?.id, next.id);
  assert.equal(store.loadById(legacy.id)?.name, "Altes Projekt");
});

test("Bibliothek markiert alte Sammelimporte als bereits übernommen", () => {
  const legacyScene = scene("old-scene", { szeneId: "dorf-platz" });
  const legacyKnowledge = { ...scene("old-knowledge"), type: "wissen", data: { tafelId: "am-brunnen" } };
  const ids = studioLibrary.importedLibraryEntryIds([legacyScene, legacyKnowledge]);
  assert.equal(ids.has("lindendorf:szene:dorf-platz"), true);
  assert.equal(ids.has("lindendorf:wissen:am-brunnen"), true);
});

test("Maker-Probe verwendet dieselbe W10-Berechnung und die Szeneinstellungen", () => {
  const entity = scene("probe", {
    probe: { attribut: "Stärke", schwierigkeit: 12, beschreibung: "Tür öffnen", nebel: true },
  });
  const result = runner.wuerfleMakerProbe(entity, gameTypes.createHeld("Vorschau", 8, 8, 8), () => 10);
  assert.ok(result);
  assert.equal(result.wurf, 10);
  assert.equal(result.schwierigkeit, 12);
  assert.equal(result.beschreibung, "Tür öffnen");
  assert.equal(result.nebel, -2);
});

test("Maker-Probeerfolg wendet nur Erfolgsfolgen auf eine Heldenkopie an", () => {
  const entity = scene("success", {
    probe: {
      attribut: "Stärke",
      schwierigkeit: 12,
      beschreibung: "Prüfung",
      erfolgText: ["Die Tür gibt nach."],
      misserfolgText: ["Das Holz hält."],
      erfolgLp: 1,
      misserfolgLp: -2,
      erfolgGold: 4,
      misserfolgGold: -1,
    },
  });
  const held = gameTypes.createHeld("Vorschau", 8, 8, 8);
  const result = runner.wuerfleMakerProbe(entity, held, () => 10);
  const outcome = runner.wendeMakerProbeFolgeAn(entity, held, result);
  assert.ok(outcome);
  assert.deepEqual(outcome.lines.slice(0, 1), ["Die Tür gibt nach."]);
  assert.equal(outcome.held.lp, 9);
  assert.equal(outcome.held.gold, 4);
  assert.equal(held.lp, 8);
  assert.equal(held.gold, 0);
});

test("Maker-Probenmisserfolg wendet ausschließlich Misserfolgsfolgen an und begrenzt Gold/LP", () => {
  const entity = scene("failure", {
    probe: {
      attribut: "Stärke",
      schwierigkeit: 12,
      beschreibung: "Prüfung",
      erfolgText: ["Erfolg."],
      misserfolgText: ["Du stürzt."],
      erfolgLp: 2,
      misserfolgLp: -10,
      erfolgGold: 10,
      misserfolgGold: -100,
    },
  });
  const held = gameTypes.createHeld("Vorschau", 8, 8, 8);
  const result = runner.wuerfleMakerProbe(entity, held, () => 1);
  const outcome = runner.wendeMakerProbeFolgeAn(entity, held, result);
  assert.ok(outcome);
  assert.deepEqual(outcome.lines.slice(0, 1), ["Du stürzt."]);
  assert.equal(outcome.held.lp, 0);
  assert.equal(outcome.held.lebend, false);
  assert.equal(outcome.held.gold, 0);
  assert.equal(held.lp, 8);
  assert.equal(held.gold, 0);
});