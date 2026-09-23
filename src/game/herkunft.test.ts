import assert from "node:assert/strict";
import test from "node:test";
import { goldNieNegativ, klemme, zustandFifo } from "./herkunft-fifo.ts";
import { urteilAusrichtung } from "./herkunft-urteil.ts";
import { grundwerteAusSaat } from "./herkunft-wurf.ts";
import { zieheMitSaat } from "./intro-zug.ts";

const LAGE_IDS = [
  "soldateska",
  "feind",
  "ernte",
  "verraeter",
  "brot",
  "seuche",
  "spion",
  "waffe",
  "burg",
  "ausweg",
];

test("Grundwerte sind 2W6−2 und bleiben an der Saat", () => {
  const a = grundwerteAusSaat(42);
  const b = grundwerteAusSaat(42);
  assert.deepEqual(a, b);
  for (const wert of [a.staerke, a.geschick, a.charisma]) {
    assert.ok(wert >= 0 && wert <= 10, String(wert));
  }
  assert.notDeepEqual(grundwerteAusSaat(1), grundwerteAusSaat(2));
});

test("FIFO: der vierte Zustand nimmt den ältesten", () => {
  assert.deepEqual(zustandFifo(["a", "b", "c"], ["d"]), ["b", "c", "d"]);
});

test("FIFO: derselbe Zustand rutscht ans Ende", () => {
  assert.deepEqual(zustandFifo(["a", "b", "c"], ["a"]), ["b", "c", "a"]);
});

test("LP bleibt im Korridor 4–10, Zurückbleiben setzt 4", () => {
  assert.equal(klemme(8 - 2), 6);
  assert.equal(klemme(8 - 6), 4);
  assert.equal(klemme(8 + 4), 10);
  assert.equal(4, 4);
});

test("Gold fällt nicht unter 0", () => {
  assert.equal(goldNieNegativ(0, -1), 0);
  assert.equal(goldNieNegativ(2, -1), 1);
});

test("Gleichstand bricht Lage 10", () => {
  const lesung = urteilAusrichtung([
    "gnade",
    "ordnung",
    "gnade",
    "ordnung",
    "gnade",
    "ordnung",
    "gnade",
    "nutzen",
    "nutzen",
    "ordnung",
  ]);
  assert.equal(lesung.art, "ordnung");
  assert.equal(lesung.zwiespalt, false);
});

test("Gleichstand bricht die letzte von drei Lagen", () => {
  const lesung = urteilAusrichtung(["gnade", "ordnung", "ordnung"]);
  assert.equal(lesung.art, "ordnung");
  assert.equal(lesung.zwiespalt, false);
});

test("zieht drei Lagen aus zehn, in Kanon-Reihenfolge", () => {
  const zug = zieheMitSaat(LAGE_IDS, 3, 42);
  assert.equal(zug.length, 3);
  assert.equal(new Set(zug).size, 3);
  const indizes = zug.map((id) => LAGE_IDS.indexOf(id));
  assert.deepEqual(indizes, [...indizes].sort((a, b) => a - b));
});

test("dieselbe Saat zieht dieselben Lagen", () => {
  assert.deepEqual(zieheMitSaat(LAGE_IDS, 3, 7), zieheMitSaat(LAGE_IDS, 3, 7));
});
