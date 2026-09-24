import { z } from "zod";

const FigurSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  rolle: z.string(),
  ort: z.string(),
  weltbild: z.string(),
  angst: z.string(),
  ziel: z.string(),
  notizen: z.string(),
});

export type WerkstattFigur = z.infer<typeof FigurSchema>;

const SPEICHER = "lindendorf.spielleiter.werkstatt.v1";

const KANON_FIGUREN: WerkstattFigur[] = [
  {
    id: "holm",
    name: "Holm",
    rolle: "Bürgermeister und Ratsherr",
    ort: "Rathaus",
    weltbild: "Ordnung verhindert größeres Leid.",
    angst: "Dass das Dorf offen zerfällt.",
    ziel: "Die Versorgung reparieren, ohne den alten Pakt zu öffnen.",
    notizen: "Kanonfigur. Seine öffentliche Aufgabe ist der Auftrag gegen die Banditen.",
  },
  {
    id: "dennek",
    name: "Dennek",
    rolle: "Ratsherr",
    ort: "Brunnen",
    weltbild: "Eine Schuld darf nicht öffentlich werden, wenn sie die Ordnung bricht.",
    angst: "Dass Grovins Rechnung auf den Rat zurückfällt.",
    ziel: "Den Wasserlauf und seine eigene Verantwortung verbergen.",
    notizen: "Kanonfigur. Er hält am Satz vom trockenen Jahr fest.",
  },
  {
    id: "vahl",
    name: "Vahl",
    rolle: "Ratsherr und Grundbesitzer",
    ort: "Vahls Stube",
    weltbild: "Wer besitzt, trägt Verantwortung und entscheidet.",
    angst: "Dass seine Familie als Profiteur des Kesseljahrs sichtbar wird.",
    ziel: "Die leere Gasse bebauen und die alte Ordnung befestigen.",
    notizen: "Kanonfigur. Die Liste bringt ihn nicht zum Geständnis, sondern zum Rechnen.",
  },
  {
    id: "grovin",
    name: "Grovin",
    rolle: "Brunnenbauer",
    ort: "Zisterne am Waldrand",
    weltbild: "Eigentum ist die letzte Form von Würde.",
    angst: "Wieder Arbeit zu verlieren, ohne gehört zu werden.",
    ziel: "Anerkennung und Bezahlung für den Brunnen.",
    notizen: "Kanonfigur. Er zieht Wasser ab, weil Dennek ihn nicht bezahlt hat.",
  },
  {
    id: "bertok",
    name: "Bertok",
    rolle: "Müller",
    ort: "Mühle",
    weltbild: "Schutz beginnt mit Verschweigen.",
    angst: "Dass die Menschen in der Mühle entdeckt werden.",
    ziel: "Die Mühle als Schutzraum erhalten.",
    notizen: "Kanonfigur. Die Mühle steht wegen Menschen und Gut still.",
  },
  {
    id: "fenn",
    name: "Fenn",
    rolle: "Zeitzeuge und Bettler",
    ort: "Kirchmauer",
    weltbild: "Erinnern ist Widerstand.",
    angst: "Dass niemand mehr zuhört.",
    ziel: "Die Gasse und ihre Namen bewahren.",
    notizen: "Kanonfigur. Er sitzt an der Mauer. Der Held handelt, nicht Fenn.",
  },
  {
    id: "lene",
    name: "Lene",
    rolle: "Müllerin und Bertoks Tochter",
    ort: "Kornkammer",
    weltbild: "Solange sie zählt, sind die Versteckten nicht ganz verschwunden.",
    angst: "Eine falsche Zahl zu übersehen und die Menschen hinter der Wand zu verlieren.",
    ziel: "Die Familie und die Versteckten in der Mühle schützen.",
    notizen: "Kanonfigur. Sie zählt die Säcke und bewacht die Nische.",
  },
  {
    id: "grete",
    name: "Grete",
    rolle: "Zeitzeugin am Rand der Gasse",
    ort: "Gretes Kate",
    weltbild: "Namen sind wichtiger als Körper.",
    angst: "Dass ihre Erinnerung versagt, bevor die Liste gelesen wird.",
    ziel: "Ilses Liste an jemanden übergeben, der sie nicht sofort vernichtet.",
    notizen: "Kanonfigur. Geduld öffnet ihr Gedächtnis; Drängen verschließt es.",
  },
  {
    id: "rennik",
    name: "Rennik",
    rolle: "Gläubiger und Kaufmann",
    ort: "Kontor am Fluss",
    weltbild: "Alles hat einen Preis.",
    angst: "Dass seine Macht nur geliehen ist.",
    ziel: "Mühle und Transportweg weiter kontrollieren.",
    notizen: "Kanonfigur. Bertoks Schuldschein ist sein Werkzeug.",
  },
  {
    id: "pfarrer",
    name: "Der Pfarrer",
    rolle: "Hüter der Kirche",
    ort: "Kirche und Gewölbe",
    weltbild: "Schweigen schützt die Lebenden, auch wenn es die Wahrheit belastet.",
    angst: "Dass die Kirche als Komplizin des Kesseljahrs sichtbar wird.",
    ziel: "Artefakt und Grube verschlossen halten.",
    notizen: "Kanonfigur. Er kennt Teile dessen, was unter der Kapelle liegt.",
  },
  {
    id: "mara",
    name: "Mara",
    rolle: "Wirtin",
    ort: "Zum letzten Fass",
    weltbild: "Wer zuhört, muss wissen, wann Schweigen billiger ist.",
    angst: "Dass ihr Haus zum Ort einer falschen Anschuldigung wird.",
    ziel: "Das Wirtshaus offen halten und den richtigen Leuten einen Weg zeigen.",
    notizen: "Kanonfigur. Sie kennt den Schleichpfad hinter der Taverne.",
  },
  {
    id: "sanna",
    name: "Sanna",
    rolle: "Botin",
    ort: "Alter Glockenweg",
    weltbild: "Eine Nachricht ist Ware, solange sie jemand erwartet.",
    angst: "Dass ihr Siegel in falsche Hände fällt.",
    ziel: "Brief und Weg nicht an die falsche Seite verlieren.",
    notizen: "Kanonfigur. Sie verliert am Hang eine versiegelte Nachricht.",
  },
  {
    id: "jorren",
    name: "Jorren",
    rolle: "Salzträger",
    ort: "Geröll am Glockenweg",
    weltbild: "Eine Last gehört dem, der für sie haftet.",
    angst: "Für Ware und Schuld anderer bezahlen zu müssen.",
    ziel: "Das Salz bergen und den Weg heil hinaufbringen.",
    notizen: "Kanonfigur. Seine Salzspur bestätigt später den Transportweg.",
  },
  {
    id: "kess",
    name: "Kess",
    rolle: "Anführer der Bande",
    ort: "Steinbruch",
    weltbild: "Wer überlebt, braucht keine saubere Geschichte.",
    angst: "Dass er für Menschen im Dorf entbehrlich wird.",
    ziel: "Den Transportweg offen halten und am Leben bleiben.",
    notizen: "Kanonfigur. Er bewacht den alten Weg für jemanden aus Lindendorf.",
  },
];

function lese(): WerkstattFigur[] {
  if (typeof window === "undefined") return KANON_FIGUREN;
  try {
    const roh = JSON.parse(window.localStorage.getItem(SPEICHER) ?? "null") as unknown;
    if (!Array.isArray(roh)) return KANON_FIGUREN;
    const eigene = roh.flatMap((wert) => {
      const parsed = FigurSchema.safeParse(wert);
      return parsed.success ? [parsed.data] : [];
    });
    return [...KANON_FIGUREN, ...eigene.filter((figur) => !KANON_FIGUREN.some((kanon) => kanon.id === figur.id))];
  } catch {
    return KANON_FIGUREN;
  }
}

export function ladeWerkstattFiguren(): WerkstattFigur[] {
  return lese();
}

export function speichereWerkstattFigur(figur: WerkstattFigur) {
  const eigene = lese().filter((eintrag) => !KANON_FIGUREN.some((kanon) => kanon.id === eintrag.id));
  const next = [...eigene.filter((eintrag) => eintrag.id !== figur.id), figur];
  try {
    window.localStorage.setItem(SPEICHER, JSON.stringify(next));
  } catch {
    /* Privater Modus oder voller Speicher. */
  }
}

export function istKanonfigur(id: string) {
  return KANON_FIGUREN.some((figur) => figur.id === id);
}

export function leereWerkstattFigur(): WerkstattFigur {
  return { id: "", name: "", rolle: "", ort: "", weltbild: "", angst: "", ziel: "", notizen: "" };
}
