import { WissenTafelSchema, type WissenTafelJson } from "./wissen-schema";

const LOKALER_BESTAND = "lindendorf.spielleiter.wissen.v1";

function ladeRoh(): Record<string, unknown> {
  try {
    return import.meta.glob("./wissen/*.json", { eager: true, import: "default" }) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export const WISSEN_DATEIEN: Record<string, WissenTafelJson> = {};

for (const [pfad, wert] of Object.entries(ladeRoh())) {
  const gelesen = WissenTafelSchema.safeParse(wert);
  if (!gelesen.success) continue;
  const id = gelesen.data.id || pfad.replace(/^.*\//, "").replace(/\.json$/, "");
  WISSEN_DATEIEN[id] = gelesen.data;
}

function ladeLokalenBestand() {
  if (typeof window === "undefined") return;
  try {
    const roh = JSON.parse(window.localStorage.getItem(LOKALER_BESTAND) ?? "null") as unknown;
    if (!Array.isArray(roh)) return;
    for (const wert of roh) {
      const tafel = WissenTafelSchema.safeParse(wert);
      if (tafel.success) WISSEN_DATEIEN[tafel.data.id] = tafel.data;
    }
  } catch {
    /* Privater Modus oder beschädigter lokaler Bestand. */
  }
}

function speichereLokalenBestand() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOKALER_BESTAND, JSON.stringify(Object.values(WISSEN_DATEIEN)));
  } catch {
    /* Privater Modus oder voller Speicher. */
  }
}

ladeLokalenBestand();

export function wissenDatei(id: string): WissenTafelJson | null {
  return WISSEN_DATEIEN[id] ?? null;
}

export function merkeWissenDatei(tafel: WissenTafelJson) {
  WISSEN_DATEIEN[tafel.id] = tafel;
  speichereLokalenBestand();
}

export function loescheWissenDatei(id: string) {
  delete WISSEN_DATEIEN[id];
  speichereLokalenBestand();
}

export function wissenIds(): string[] {
  return Object.keys(WISSEN_DATEIEN).sort((a, b) => a.localeCompare(b, "de"));
}
