import assert from "node:assert/strict";
import test from "node:test";
import { gesetzteAnbieter, waehleZiel } from "./modelle.ts";

test("ohne Schlüssel keine Wahl", () => {
  const fund = waehleZiel({});
  assert.equal("error" in fund, true);
});

test("auto nimmt den ersten gesetzten Anbieter", () => {
  const fund = waehleZiel({ GROQ_API_KEY: "gsk", OPENROUTER_API_KEY: "sk" });
  assert.equal("error" in fund, false);
  if ("error" in fund) return;
  assert.equal(fund.id, "groq");
  assert.equal(fund.key, "gsk");
  assert.deepEqual(gesetzteAnbieter({ GROQ_API_KEY: "gsk", OPENROUTER_API_KEY: "sk" }), ["groq", "openrouter"]);
});

test("TEXT_ANBIETER wählt fest, fehlender Schlüssel bleibt ein Fehler", () => {
  const fest = waehleZiel({ TEXT_ANBIETER: "gemini", GEMINI_API_KEY: "ai", XAI_API_KEY: "x" });
  assert.equal("error" in fest, false);
  if (!("error" in fest)) assert.equal(fest.id, "gemini");
  const fehlt = waehleZiel({ TEXT_ANBIETER: "openrouter", XAI_API_KEY: "x" });
  assert.match("error" in fehlt ? fehlt.error : "", /OPENROUTER_API_KEY/);
});

test("Modellname aus der Umgebung schlägt die Vorgabe", () => {
  const fund = waehleZiel({ TEXT_ANBIETER: "xai", XAI_API_KEY: "x", XAI_MODEL: "grok-test" });
  if ("error" in fund) assert.fail(fund.error);
  assert.equal(fund.model, "grok-test");
});
