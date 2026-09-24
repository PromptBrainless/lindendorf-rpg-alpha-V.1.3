import { env } from "./env.server.ts";

/** Externe Textschnittstellen. Schlüssel bleiben auf dem Server. */
export const FREMD_KI = {
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
} as const;

export type FremdAnbieter = keyof typeof FREMD_KI;

const MODEL: Record<FremdAnbieter, string> = {
  gemini: "gemini-2.0-flash",
  groq: "openai/gpt-oss-120b",
  openrouter: "openrouter/auto",
};

export type FremdAntwort =
  | { ok: true; anbieter: FremdAnbieter; text: string }
  | { ok: false; anbieter: FremdAnbieter; error: string };

export function fremdSchluessel(anbieter: FremdAnbieter): string | undefined {
  return env(FREMD_KI[anbieter]);
}

/** Nur ob ein Schlüssel da ist. Nie der Schlüssel selbst. */
export function fremdStand(): Record<FremdAnbieter, boolean> {
  return {
    gemini: Boolean(fremdSchluessel("gemini")),
    groq: Boolean(fremdSchluessel("groq")),
    openrouter: Boolean(fremdSchluessel("openrouter")),
  };
}

export function fremdBereit(): FremdAnbieter[] {
  return (Object.keys(FREMD_KI) as FremdAnbieter[]).filter((name) => fremdStand()[name]);
}

function textAusOpenAi(body: unknown): string {
  const choice = (body as { choices?: { message?: { content?: unknown; reasoning?: unknown } }[] })?.choices?.[0];
  const inhalt = choice?.message?.content;
  if (typeof inhalt === "string" && inhalt.trim()) return inhalt.trim();
  const denken = choice?.message?.reasoning;
  return typeof denken === "string" ? denken.trim() : "";
}

function textAusGemini(body: unknown): string {
  const teile = (body as { candidates?: { content?: { parts?: { text?: unknown }[] } }[] })?.candidates?.[0]?.content
    ?.parts;
  return (teile ?? [])
    .map((teil) => (typeof teil.text === "string" ? teil.text : ""))
    .join("")
    .trim();
}

export async function frageFremd(
  anbieter: FremdAnbieter,
  text: string,
  system = "",
  fetchFn: typeof fetch = fetch,
): Promise<FremdAntwort> {
  const key = fremdSchluessel(anbieter);
  if (!key) return { ok: false, anbieter, error: `${FREMD_KI[anbieter]} fehlt in .env.` };
  const prompt = text.trim();
  if (!prompt) return { ok: false, anbieter, error: "Kein Text." };

  try {
    const res =
      anbieter === "gemini"
        ? await fetchFn(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL.gemini}:generateContent?key=${encodeURIComponent(key)}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: system ? { parts: [{ text: system }] } : undefined,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
              }),
            },
          )
        : await fetchFn(
            anbieter === "groq"
              ? "https://api.groq.com/openai/v1/chat/completions"
              : "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${key}`,
                "User-Agent": "lindendorf/1.0",
              },
              body: JSON.stringify({
                model: MODEL[anbieter],
                temperature: 0.4,
                messages: [
                  ...(system ? [{ role: "system", content: system }] : []),
                  { role: "user", content: prompt },
                ],
              }),
            },
          );
    if (!res.ok) {
      const roh = await res.text().catch(() => "");
      return { ok: false, anbieter, error: `${anbieter} ${res.status}${roh ? `: ${roh.slice(0, 160)}` : ""}` };
    }
    const body: unknown = await res.json();
    const antwort = anbieter === "gemini" ? textAusGemini(body) : textAusOpenAi(body);
    if (!antwort) return { ok: false, anbieter, error: `${anbieter} lieferte keinen Text.` };
    return { ok: true, anbieter, text: antwort };
  } catch (fehler) {
    return { ok: false, anbieter, error: fehler instanceof Error ? fehler.message : `${anbieter} nicht erreichbar.` };
  }
}

/** Ein Anbieter, oder alle gesetzten Schlüssel zugleich. */
export async function frageFremdFlexibel(
  ziel: FremdAnbieter | "alle",
  text: string,
  system = "",
  fetchFn: typeof fetch = fetch,
): Promise<FremdAntwort[]> {
  const liste = ziel === "alle" ? fremdBereit() : [ziel];
  if (!liste.length) {
    return (Object.keys(FREMD_KI) as FremdAnbieter[]).map((anbieter) => ({
      ok: false as const,
      anbieter,
      error: `${FREMD_KI[anbieter]} fehlt in .env.`,
    }));
  }
  return Promise.all(liste.map((anbieter) => frageFremd(anbieter, text, system, fetchFn)));
}
