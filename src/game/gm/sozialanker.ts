import { z } from "zod";

export const SozialankerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  szeneId: z.string().min(1),
  ausloeser: z.enum(["dialog", "probe"]),
  erforderlicherRang: z.enum(["Messing", "Silber", "Gold"]),
  belohnung: z.enum(["zugang", "wissen", "weg", "ansehen"]),
  beschreibung: z.string(),
});

export type Sozialanker = z.infer<typeof SozialankerSchema>;

const SPEICHER = "lindendorf.spielleiter.soziale-anker.v1";

const KANON_ANker: Sozialanker[] = [
  {
    id: "rathaus-silberstatus",
    name: "Amtliche Anhörung",
    szeneId: "rathaus",
    ausloeser: "dialog",
    erforderlicherRang: "Silber",
    belohnung: "zugang",
    beschreibung: "Ein Silberstatus öffnet im Rathaus einen zusätzlichen Dialogweg und schreibt den Anker in die Partie.",
  },
];

function lese(): Sozialanker[] {
  if (typeof window === "undefined") return KANON_ANker;
  try {
    const roh = JSON.parse(window.localStorage.getItem(SPEICHER) ?? "null") as unknown;
    if (!Array.isArray(roh)) return KANON_ANker;
    const eigene = roh.flatMap((wert) => {
      const parsed = SozialankerSchema.safeParse(wert);
      return parsed.success ? [parsed.data] : [];
    });
    return [...KANON_ANker, ...eigene.filter((anker) => !KANON_ANker.some((kanon) => kanon.id === anker.id))];
  } catch {
    return KANON_ANker;
  }
}

export function ladeSozialanker(): Sozialanker[] {
  return lese();
}

export function speichereSozialanker(anker: Sozialanker) {
  const eigene = lese().filter((eintrag) => !KANON_ANker.some((kanon) => kanon.id === eintrag.id));
  const next = [...eigene.filter((eintrag) => eintrag.id !== anker.id), anker];
  try {
    window.localStorage.setItem(SPEICHER, JSON.stringify(next));
  } catch {
    /* Privater Modus oder voller Speicher. */
  }
}

export function istKanonanker(id: string): boolean {
  return KANON_ANker.some((anker) => anker.id === id);
}

export function leererSozialanker(): Sozialanker {
  return {
    id: "",
    name: "",
    szeneId: "",
    ausloeser: "dialog",
    erforderlicherRang: "Silber",
    belohnung: "zugang",
    beschreibung: "",
  };
}
