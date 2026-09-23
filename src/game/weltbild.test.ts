import assert from "node:assert/strict";
import test from "node:test";
import { WELTBILD, weltbildFuerSzene, weltbildZeile } from "./weltbild.ts";

test("jede Szene hängt an genau einem Ort", () => {
  const gesehen = new Set<string>();
  for (const ort of WELTBILD) {
    for (const id of ort.szenen) {
      assert.equal(gesehen.has(id), false, id);
      gesehen.add(id);
      assert.equal(weltbildFuerSzene(id)?.id, ort.id);
    }
  }
});

test("die Ankunft bekommt die Spur, nicht den Pakt", () => {
  const zeile = weltbildZeile("intro-weg");
  assert.match(zeile, /Ankunft/);
  assert.doesNotMatch(zeile, /Kesseljahr|Dennek|Grovin|Ilse|Pakt/);
});

test("die Zisterne darf die Abzweigung, der Krug nicht", () => {
  assert.match(weltbildZeile("an-der-zisterne"), /Abzweigung/);
  assert.match(weltbildZeile("brunnen-krug"), /nicht vorwegnehmen/);
  assert.doesNotMatch(weltbildZeile("brunnen-krug"), /Grovin/);
});

test("unbekannte Seiten bleiben leer", () => {
  assert.equal(weltbildFuerSzene("gibt-es-nicht"), null);
  assert.equal(weltbildZeile(""), "");
});
