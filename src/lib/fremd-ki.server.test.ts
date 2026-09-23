import assert from "node:assert/strict";
import test from "node:test";
import { fremdBereit, fremdStand, frageFremd, frageFremdFlexibel } from "./fremd-ki.server.ts";

test("Stand meldet nur, ob der Schlüssel da ist", () => {
  const vorher = {
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    openrouter: process.env.OPENROUTER_API_KEY,
  };
  delete process.env.GEMINI_API_KEY;
  process.env.GROQ_API_KEY = "gsk_test";
  delete process.env.OPENROUTER_API_KEY;
  try {
    assert.deepEqual(fremdStand(), { gemini: false, groq: true, openrouter: false });
    assert.deepEqual(fremdBereit(), ["groq"]);
  } finally {
    for (const [name, wert] of Object.entries(vorher)) {
      const key = name === "gemini" ? "GEMINI_API_KEY" : name === "groq" ? "GROQ_API_KEY" : "OPENROUTER_API_KEY";
      if (wert == null) delete process.env[key];
      else process.env[key] = wert;
    }
  }
});

test("fehlender Schlüssel geht nicht ins Netz", async () => {
  delete process.env.GEMINI_API_KEY;
  let gerufen = false;
  const fund = await frageFremd("gemini", "Hallo", "", async () => {
    gerufen = true;
    throw new Error("nicht rufen");
  });
  assert.equal(gerufen, false);
  assert.equal(fund.ok, false);
  if (!fund.ok) assert.match(fund.error, /GEMINI_API_KEY/);
});

test("parallel nur die gesetzten Anbieter", async () => {
  delete process.env.GEMINI_API_KEY;
  process.env.GROQ_API_KEY = "gsk_test";
  process.env.OPENROUTER_API_KEY = "sk-or-test";
  const gerufen: string[] = [];
  const fund = await frageFremdFlexibel("alle", "ein Satz", "", async (url) => {
    gerufen.push(String(url));
    return new Response(JSON.stringify({ choices: [{ message: { content: "zurück" } }] }), { status: 200 });
  });
  assert.deepEqual(
    fund.map((item) => item.anbieter),
    ["groq", "openrouter"],
  );
  assert.equal(gerufen.length, 2);
  assert.equal(fund.every((item) => item.ok && item.text === "zurück"), true);
  delete process.env.GROQ_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
});
