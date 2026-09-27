import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Download, Play, Plus, Search, ShieldCheck, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newEntity, newWorkspace, validateWorkspace, type Entity, type Workspace } from "@/game/studio/model";
import { downloadWorkspace, LocalWorkspaceStore } from "@/game/studio/store";
import { registeredSchemas } from "@/game/studio/plugins";
import { importedLibraryEntryIds, lindendorfLibrary, type LibraryCategory, type LibraryEntry } from "@/game/studio/library";
import { neueSzenendaten } from "@/game/studio/runner";
import { StudioBibliothek } from "./StudioBibliothek";
import { StudioSzeneneditor } from "./StudioSzeneneditor";
import { StudioVorschau } from "./StudioVorschau";

const store = new LocalWorkspaceStore();
const ENTITY_TYPES: Record<LibraryCategory, string> = {
  medium: "medium",
  abschnitt: "abschnitt",
  szene: "szene",
  figur: "figur",
  wissen: "wissen",
  gegenstand: "gegenstand",
};

/**
 * WorldForge-Studio, eingebettet als eigener Bereich der Spielleiter-Werkstatt.
 * Verwaltet Autorenmaterial (Entities/Relationen) getrennt vom Kanon; siehe docs/EDITOR.md.
 */
export function WeltStudio() {
  const [workspace, setWorkspace] = useState<Workspace>(() => store.load() ?? newWorkspace());
  const [projekte, setProjekte] = useState<Workspace[]>(() => store.list());
  const [selected, setSelected] = useState("");
  const [suche, setSuche] = useState("");
  const [typ, setTyp] = useState("alle");
  const [neuerTyp, setNeuerTyp] = useState("szene");
  const [bereich, setBereich] = useState<"material" | "bibliothek">("material");
  const [vorschauOffen, setVorschauOffen] = useState(false);
  const [meldung, setMeldung] = useState("");
  const bibliothek = useMemo(() => lindendorfLibrary(), []);
  const importedIds = useMemo(() => importedLibraryEntryIds(workspace.entities), [workspace.entities]);
  const projektListe = projekte.some((project) => project.id === workspace.id) ? projekte : [...projekte, workspace];

  const selectedEntity = workspace.entities.find((entity) => entity.id === selected) ?? null;
  const startSceneId = workspace.entities.some((entity) => entity.id === workspace.startSceneId && entity.type === "szene")
    ? workspace.startSceneId!
    : workspace.entities.find((entity) => entity.type === "szene")?.id ?? "";
  const previewSceneId = selectedEntity?.type === "szene" ? selectedEntity.id : startSceneId;
  const sichtbar = workspace.entities.filter(
    (entity) => (typ === "alle" || entity.type === typ) && `${entity.title} ${entity.type}`.toLowerCase().includes(suche.toLowerCase()),
  );
  const validation = useMemo(() => validateWorkspace(workspace), [workspace]);

  function aktualisiere(next: Workspace) {
    const mitStempel = { ...next, updatedAt: new Date().toISOString() };
    setWorkspace(mitStempel);
    store.save(mitStempel);
    setProjekte(store.list());
  }

  function neuesProjekt() {
    const vorhandene = store.list().length;
    const project = newWorkspace(vorhandene ? `Neues RPG-Projekt ${vorhandene + 1}` : "Neues RPG-Projekt");
    store.save(project);
    setWorkspace(project);
    setProjekte(store.list());
    setSelected("");
    setBereich("material");
    setVorschauOffen(false);
    setMeldung("");
  }

  function wechsleProjekt(id: string) {
    const project = store.loadById(id);
    if (!project) return;
    setWorkspace(project);
    setProjekte(store.list());
    setSelected("");
    setBereich("material");
    setVorschauOffen(false);
    setMeldung("");
  }

  function neueEntity(entityType = neuerTyp) {
    const schema = registeredSchemas().find((item) => item.type === entityType);
    const initialData = entityType === "szene"
      ? neueSzenendaten()
      : entityType === "figur"
        ? { rolle: "", ort: "", weltbild: "", angst: "", ziel: "" }
        : entityType === "wissen"
          ? { text: "", szenen: "" }
          : entityType === "gegenstand"
            ? { beschreibung: "" }
            : entityType === "medium"
              ? { assetId: "", assetKind: "buehnenbild", format: "", mediaType: "image", src: "" }
              : entityType === "abschnitt"
                ? { sourceQuest: "", sourceSectionId: "", sceneCount: 0, sourceSceneIds: [] }
                : entityType === "ort"
                  ? { beschreibung: "" }
                  : { text: "" };
    const entity = newEntity(workspace.id, entityType, schema?.label ?? "Neue Notiz", initialData);
    const next = { ...workspace, entities: [...workspace.entities, entity] };
    if (entityType === "szene" && !startSceneId) next.startSceneId = entity.id;
    aktualisiere(next);
    setSelected(entity.id);
  }

  function bearbeite(patch: Partial<Entity>) {
    if (!selectedEntity) return;
    aktualisiere({
      ...workspace,
      entities: workspace.entities.map((entity) => (entity.id === selected ? { ...entity, ...patch, revision: entity.revision + 1, updatedAt: new Date().toISOString() } : entity)),
    });
  }

  function loesche(id: string) {
    const entities = workspace.entities.filter((entity) => entity.id !== id);
    const relations = workspace.relations.filter((relation) => relation.fromId !== id && relation.toId !== id);
    const next = { ...workspace, entities, relations };
    if (workspace.startSceneId === id) next.startSceneId = entities.find((entity) => entity.type === "szene")?.id;
    aktualisiere(next);
    if (selected === id) setSelected("");
  }

  function importiereDatei(file: File) {
    file.text().then((text) => {
      const result = validateWorkspace(JSON.parse(text));
      if (!result.workspace || result.findings.some((f) => f.severity === "error")) {
        setMeldung("Import abgelehnt: Workspace ist ungültig.");
        return;
      }
      aktualisiere(result.workspace);
      setMeldung("Workspace importiert.");
    });
  }

  function uebernehmeEintrag(entry: LibraryEntry) {
    if (importedIds.has(entry.id)) {
      setMeldung("Dieser Eintrag ist bereits in deinem Projekt.");
      return;
    }
    const entity = newEntity(workspace.id, ENTITY_TYPES[entry.category], entry.title, {
      ...entry.data,
      libraryEntryId: entry.id,
      librarySource: entry.sourceLabel,
    });
    const next = { ...workspace, entities: [...workspace.entities, entity] };
    if (entry.category === "szene" && !startSceneId) next.startSceneId = entity.id;
    aktualisiere(next);
    setSelected(entity.id);
    setBereich("material");
    setMeldung(`„${entry.title}“ wurde als Projektkopie übernommen.`);
  }

  function setzeWahlziel(sceneId: string, choiceIndex: number, targetId: string) {
    const relations = workspace.relations.filter(
      (relation) => !(relation.kind === "choice" && relation.fromId === sceneId && relation.data.choiceIndex === choiceIndex),
    );
    const istEnde = targetId === "__ending__";
    if (targetId && !istEnde) {
      relations.push({
        id: crypto.randomUUID(),
        workspaceId: workspace.id,
        fromId: sceneId,
        toId: targetId,
        kind: "choice",
        data: { choiceIndex },
      });
    }
    const entities = workspace.entities.map((entity) => {
      if (entity.id !== sceneId) return entity;
      const existing = Array.isArray(entity.data.endingChoices)
        ? entity.data.endingChoices.filter((index): index is number => Number.isInteger(index))
        : [];
      const endings = new Set(existing);
      if (istEnde) endings.add(choiceIndex);
      else endings.delete(choiceIndex);
      return {
        ...entity,
        data: { ...entity.data, endingChoices: [...endings].sort((left, right) => left - right) },
        revision: entity.revision + 1,
        updatedAt: new Date().toISOString(),
      };
    });
    aktualisiere({ ...workspace, entities, relations });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-2xl space-y-2">
          <p className="text-sm text-muted-fg">
            {bereich === "bibliothek"
              ? "Durchsuche Lindendorfs Medien und Spielbausteine. Einträge werden nur einzeln und auf deine Auswahl hin in dein Projekt kopiert."
              : "Dein Projekt startet unabhängig und leer. Hier bearbeitest du eigene Szenen, Figuren, Wissen und Notizen."}
          </p>
          <Input aria-label="Projektname" value={workspace.name} onChange={(event) => aktualisiere({ ...workspace, name: event.target.value })} className="h-10 max-w-sm" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Projekt wechseln" className="h-11 max-w-48 rounded-sm border border-border bg-surface px-3 text-sm" value={workspace.id} onChange={(event) => wechsleProjekt(event.target.value)}>
            {projektListe.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select>
          <Button type="button" variant="secondary" size="default" onClick={neuesProjekt}>
            <Plus size={16} /> Neues Projekt
          </Button>
          {bereich === "bibliothek" ? (
            <Button variant="secondary" size="default" onClick={() => setBereich("material")}>
              <ArrowLeft size={16} /> Projektmaterial
            </Button>
          ) : (
            <Button variant="secondary" size="default" onClick={() => setBereich("bibliothek")}>
              <BookOpen size={16} /> Lindendorf-Bibliothek
            </Button>
          )}
          <Button variant="secondary" size="default" onClick={() => downloadWorkspace(workspace)} title="Studio exportieren">
            <Download size={16} /> Export
          </Button>
          <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-sm border border-border bg-surface px-4 text-sm hover:bg-surface-2">
            <Upload size={16} /> Import
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) importiereDatei(file);
                event.target.value = "";
              }}
            />
          </label>
          {bereich === "material" ? (
            <>
              <select aria-label="Typ des neuen Eintrags" className="h-11 rounded-sm border border-border bg-surface px-3 text-sm" value={neuerTyp} onChange={(event) => setNeuerTyp(event.target.value)}>
                {registeredSchemas().map((schema) => <option key={schema.type} value={schema.type}>{schema.label}</option>)}
              </select>
              <Button variant="secondary" size="default" onClick={() => neueEntity()}>
                <Plus size={16} /> Neu
              </Button>
              <Button variant="default" size="default" onClick={() => setVorschauOffen(true)} disabled={!previewSceneId}>
                <Play size={16} /> Spielen
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-fg">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck size={14} /> {validation.findings.length ? `${validation.findings.length} Befunde` : "Workspace valide"}
        </span>
        <span>{workspace.entities.length} Einträge</span>
        {bereich === "bibliothek" ? <span>{bibliothek.length} Bibliothekseinträge</span> : null}
      </div>

      {bereich === "material" ? <>
      <div className="flex flex-wrap gap-2">
        <button className={`rounded-sm border px-3 py-1.5 text-xs ${typ === "alle" ? "border-accent bg-accent text-accent-fg" : "border-border text-muted-fg hover:bg-surface-2"}`} onClick={() => setTyp("alle")}>
          Alle
        </button>
        {registeredSchemas().map((schema) => (
          <button
            key={schema.type}
            className={`rounded-sm border px-3 py-1.5 text-xs ${typ === schema.type ? "border-accent bg-accent text-accent-fg" : "border-border text-muted-fg hover:bg-surface-2"}`}
            onClick={() => setTyp(schema.type)}
          >
            {schema.label} <span className="opacity-70">{workspace.entities.filter((e) => e.type === schema.type).length || ""}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)]">
        <div className="space-y-2">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <Input className="pl-9" value={suche} onChange={(event) => setSuche(event.target.value)} placeholder="Projektmaterial suchen..." />
          </div>
          <div className="max-h-[28rem] overflow-y-auto rounded-sm border border-border">
            {sichtbar.length === 0 ? (
              <div className="p-4 text-sm text-muted-fg">Noch keine Einträge. Lege eine Notiz an oder übernimm Lindendorf-Daten.</div>
            ) : (
              sichtbar.map((entity) => (
                <button
                  key={entity.id}
                  className={`flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left text-sm last:border-b-0 ${selected === entity.id ? "bg-accent text-accent-fg" : "hover:bg-surface-2"}`}
                  onClick={() => setSelected(entity.id)}
                >
                  <span className="min-w-0 truncate">
                    <strong className="block truncate">{entity.title}</strong>
                    <span className="block truncate text-xs opacity-70">{registeredSchemas().find((s) => s.type === entity.type)?.label ?? entity.type} · Rev. {entity.revision}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

              <div className="rounded-sm border border-border p-4">
          {!selectedEntity ? (
            <p className="text-sm text-muted-fg">Wähle einen Eintrag links oder lege einen neuen an.</p>
          ) : selectedEntity.type === "szene" ? (
            <StudioSzeneneditor
              entity={selectedEntity}
              workspace={workspace}
              isStart={startSceneId === selectedEntity.id}
              onTitle={(title) => bearbeite({ title })}
              onData={(patch) => bearbeite({ data: { ...selectedEntity.data, ...patch } })}
              onSetStart={() => aktualisiere({ ...workspace, startSceneId: selectedEntity.id })}
              onChoiceTarget={(choiceIndex, targetId) => setzeWahlziel(selectedEntity.id, choiceIndex, targetId)}
              onPreview={() => setVorschauOffen(true)}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Input value={selectedEntity.title} onChange={(event) => bearbeite({ title: event.target.value })} className="text-base font-semibold" />
                <Button variant="ghost" size="default" onClick={() => loesche(selectedEntity.id)} title="Eintrag löschen">
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(selectedEntity.data).map(([feld, wert]) => {
                  const istListe = Array.isArray(wert);
                  return (
                    <label key={feld} className="block text-sm">
                      <span className="mb-1 block text-xs uppercase tracking-wide text-subtle-fg">{feld}</span>
                      <textarea
                        className="min-h-16 w-full rounded-sm border border-border bg-ink/70 p-2 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={istListe ? wert.join("\n") : typeof wert === "string" ? wert : JSON.stringify(wert)}
                        onChange={(event) => bearbeite({ data: { ...selectedEntity.data, [feld]: istListe ? event.target.value.split("\n") : event.target.value } })}
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      </> : <StudioBibliothek importedIds={importedIds} onImport={uebernehmeEintrag} />}

      {meldung ? <p className="text-sm text-muted-fg">{meldung}</p> : null}
      {vorschauOffen && previewSceneId ? <StudioVorschau workspace={workspace} startSceneId={previewSceneId} onClose={() => setVorschauOffen(false)} /> : null}
    </div>
  );
}
