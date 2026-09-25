import assert from "node:assert/strict";
import test from "node:test";
import { charakterAusLagen, charakterRang, KLASSEN, sichereCharakterauswahl } from "./charakter.ts";

test("jede Klasse hat einen eigenen Karrierezweig auf Stufe 1", () => {
  for (const klasse of KLASSEN) {
    const wahl = sichereCharakterauswahl({
      klasse: klasse.id,
      karriere: klasse.karrieren.at(-1)!.id,
      ep: 0,
    });
    assert.equal(wahl.klasse, klasse.id);
    assert.equal(wahl.karriere, klasse.karrieren.at(-1)!.id);
  }
});

test("eine fremde Karriere wird auf den gewählten Klassenzweig begrenzt", () => {
  const wahl = sichereCharakterauswahl({ klasse: "landvolk", karriere: "advokat", ep: -10 });
  assert.equal(wahl.klasse, "landvolk");
  assert.equal(wahl.karriere, "bergmann");
  assert.equal(wahl.ep, 0);
});

test("Lagen bestimmen genau eine Klasse und einen Beruf", () => {
  const wahl = charakterAusLagen(
    [
      { id: "soldateska", art: "ordnung" },
      { id: "waffe", art: "ordnung" },
      { id: "feind", art: "nutzen" },
    ],
    12,
    "lagen",
  );
  const klasse = KLASSEN.find((eintrag) => eintrag.id === wahl.klasse)!;
  assert.ok(klasse.karrieren.some((karriere) => karriere.id === wahl.karriere));
  assert.equal(charakterRang(wahl.klasse), "Messing");
});