/** Server only. Schlüssel bleiben in process.env, nie im Client. */
import "../lib/env.server.ts";

export type AnbieterId = "xai" | "gemini" | "groq" | "openrouter";

type ZielVorlage = {
  id: AnbieterId;
  name: string;
  url: string;
  model: string;
  schluessel: string;
  modellEnv: string;
};

const ZIELE: readonly ZielVorlage[] = [
  {
    id: "xai",
    name: "xAI",
    url: "https://api.x.ai/v1/chat/completions",
    model: "grok-4.5",
    schluessel: "XAI_API_KEY",
    modellEnv: "XAI_MODEL",
  },
  {
    id: "gemini",
    name: "Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    model: "gemini-2.0-flash",
    schluessel: "GEMINI_API_KEY",
    modellEnv: "GEMINI_MODEL",
  },
  {
    id: "groq",
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "openai/gpt-oss-120b",
    schluessel: "GROQ_API_KEY",
    modellEnv: "GROQ_MODEL",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    model: "meta-llama/llama-3.3-70b-instruct",
    schluessel: "OPENROUTER_API_KEY",
    modellEnv: "OPENROUTER_MODEL",
  },
];

export type EnvQuelle = Record<string, string | undefined>;

export type GewaehltesZiel = {
  id: AnbieterId;
  name: string;
  url: string;
  model: string;
  key: string;
};

export function gesetzteAnbieter(env: EnvQuelle = process.env): AnbieterId[] {
  return ZIELE.filter((ziel) => env[ziel.schluessel]?.trim()).map((ziel) => ziel.id);
}

/** Leer oder „auto“: erster gesetzter Schlüssel, Reihenfolge xAI, Gemini, Groq, OpenRouter. */
export function waehleZiel(env: EnvQuelle = process.env): GewaehltesZiel | { error: string } {
  const wollen = String(env.TEXT_ANBIETER ?? "").trim().toLowerCase();
  const gesetzt = ZIELE.filter((ziel) => env[ziel.schluessel]?.trim());
  if (!gesetzt.length) {
    return { error: "Kein Modellschlüssel. In .env XAI_API_KEY, GEMINI_API_KEY, GROQ_API_KEY oder OPENROUTER_API_KEY setzen." };
  }
  const explizit = wollen && wollen !== "auto";
  const vorlage = explizit ? ZIELE.find((ziel) => ziel.id === wollen) : gesetzt[0];
  if (!vorlage) return { error: `TEXT_ANBIETER „${wollen}“ ist keiner von xai, gemini, groq, openrouter.` };
  const key = env[vorlage.schluessel]?.trim();
  if (!key) return { error: `${vorlage.schluessel} fehlt. Gesetzt sind: ${gesetzt.map((ziel) => ziel.id).join(", ")}.` };
  return {
    id: vorlage.id,
    name: vorlage.name,
    url: vorlage.url,
    model: env[vorlage.modellEnv]?.trim() || vorlage.model,
    key,
  };
}

export async function sprich(
  system: string,
  user: string,
  json = true,
  env: EnvQuelle = process.env,
): Promise<{ ok: true; text: string; anbieter: AnbieterId } | { ok: false; error: string }> {
  const ziel = waehleZiel(env);
  if ("error" in ziel) return { ok: false, error: ziel.error };
  try {
    const res = await fetch(ziel.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ziel.key}`,
        "User-Agent": "lindendorf/1.0",
      },
      body: JSON.stringify({
        model: ziel.model,
        temperature: 0.65,
        max_tokens: 8000,
        ...(json ? { response_format: { type: "json_object" } } : {}),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      const roh = await res.text().catch(() => "");
      return { ok: false, error: `${ziel.name} ${res.status}${roh ? `: ${roh.slice(0, 160)}` : ""}` };
    }
    const body = (await res.json()) as {
      choices?: { message?: { content?: string; reasoning?: string } }[];
    };
    const message = body.choices?.[0]?.message;
    const text = (message?.content || message?.reasoning || "").trim();
    if (!text.trim()) return { ok: false, error: `${ziel.name} hat nichts zurückgegeben.` };
    return { ok: true, text, anbieter: ziel.id };
  } catch (fehler) {
    return { ok: false, error: fehler instanceof Error ? fehler.message : `${ziel.name} nicht erreichbar.` };
  }
}
