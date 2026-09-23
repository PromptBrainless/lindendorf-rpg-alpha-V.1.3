/**
 * Weltbeschreibung als Grenze, nicht als Spieltext.
 * Pro Seite nur die öffentliche Funktion des Orts.
 * Die private Schuld bleibt in lore.ts und darf hier nicht vorweggenommen werden.
 */
export type WeltOrt = {
  id: string;
  name: string;
  funktion: string;
  szenen: readonly string[];
};

export const WELTBILD: readonly WeltOrt[] = [
  {
    id: "weg",
    name: "Tal und Weg",
    funktion: "Ankunft zu Fuß in ein armes Tal. Rauch, Schlamm und der Kinderschuh sind Spur. Nicht erklären, was fehlt.",
    szenen: ["intro-weg", "intro-tal", "intro-rauch-graben", "intro-hang", "intro-lindendorf", "intro-ankunft"],
  },
  {
    id: "fremder",
    name: "Fremder am Weg",
    funktion: "Hier darf das Auge über drei Linien am Silber stehen. Es ist ein Rest, kein Mythos und kein Name.",
    szenen: ["intro-fremder-am-weg"],
  },
  {
    id: "platz",
    name: "Dorfplatz",
    funktion: "Nabe. Rathaus, Taverne, Brunnen, Mühle und der Rauch im Osten sind sichtbar. Keine Ursache nennen.",
    szenen: ["dorf-platz"],
  },
  {
    id: "rathaus",
    name: "Rathaus",
    funktion: "Holms Sitz. Laut benennt das Amt nur die Banditen im Steinbruch.",
    szenen: ["rathaus"],
  },
  {
    id: "taverne",
    name: "Zum letzten Fass",
    funktion: "Maras Haus. Treffpunkt und Gerücht. Nicht die Mühle und nicht der Rat.",
    szenen: ["zum-letzten-fass"],
  },
  {
    id: "schmied",
    name: "Schmiede",
    funktion: "Rand. Keine eigene Schuld und kein eigener Ausgang.",
    szenen: ["beim-schmied", "schmiede-apotheke"],
  },
  {
    id: "brunnen",
    name: "Brunnen",
    funktion: "Das trübe Wasser ist das Symptom. Die private Abzweigung nicht vorwegnehmen.",
    szenen: ["brunnen-krug", "brunnen-hub", "brunnenschacht", "ablaufgraben", "mehlsack-am-brunnen", "ratsherr-dennek", "bei-witwe-kern", "bei-witwe-kern-dorf"],
  },
  {
    id: "zisterne",
    name: "Zisterne",
    funktion: "Grovins Speicher am Waldrand. Hier darf die Abzweigung stehen, weil die Seite dort ist.",
    szenen: ["an-der-zisterne", "grovins-zisterne"],
  },
  {
    id: "brunnen-ende",
    name: "Brunnen, Ausgang",
    funktion: "Das Wasser kann klarer werden. Die Schuld bleibt eine Form, keine Reinigung.",
    szenen: ["wasser-mit-einem-riss", "klares-wasser", "zwei-brunnen-ein-dorf"],
  },
  {
    id: "muehle",
    name: "Mühle",
    funktion: "Das Rad läuft, die Mühle steht still. Das Versteck nicht vorwegnehmen.",
    szenen: ["muehle-stumm", "wasserrad", "uferpfad", "morscher-steg"],
  },
  {
    id: "muehle-innen",
    name: "Mühle, innen",
    funktion: "Versteckte Arbeit nur ausführen, wenn der Text sie schon zeigt. Kein Heilungsende.",
    szenen: [
      "bertok-am-mahlwerk",
      "kornkammer",
      "lene-in-der-kornkammer",
      "hinter-der-nische",
      "lagerhaus-am-fluss",
      "renniks-kontor",
      "sicheres-mehl-leere-blicke",
      "mehl-mit-rauen-haenden",
      "stilles-mehl",
    ],
  },
  {
    id: "gasse",
    name: "Verschwundene Gasse",
    funktion: "Überwachsener Tatort. Strichlisten und Spielzeug sind Spur. Den Pakt nicht dozieren.",
    szenen: ["gasse-hub", "gerbereigasse", "fenn", "fenn-an-der-kirchmauer", "gretes-kate", "grete"],
  },
  {
    id: "kirche",
    name: "Kirche",
    funktion: "Hier liegt, was offiziell nicht existieren darf. Der Zugang ist bewacht.",
    szenen: ["gasse-kirche", "kirchengewoelbe", "unter-der-kirche", "im-gewoelbe", "hinter-dem-stein"],
  },
  {
    id: "vahl",
    name: "Vahls Stube",
    funktion: "Vahl rechnet. Er ist nicht Holm. Die Liste ist Gewicht, keine Predigt.",
    szenen: [
      "vahls-stube",
      "ratsherr-vahl",
      "vahls-stube-abend",
      "was-die-liste-wiegt",
      "ein-zweites-schweigen",
      "was-ausgegraben-bleibt",
      "ein-name-unter-vielen",
      "stille-rechnung",
    ],
  },
  {
    id: "kapelle",
    name: "Kapelle am Hang",
    funktion: "Die Glocke ist ein Signalwerkzeug, kein Glaubensobjekt. Die Grube darunter nicht erklären.",
    szenen: ["die-kapellenglocke"],
  },
  {
    id: "glockenweg",
    name: "Alter Glockenweg",
    funktion: "Ehemaliger Versorgungsweg für Salz, Mehl und Nachrichten. Heute Vorwarnung und Transport, nicht Gebet.",
    szenen: ["glockenweg", "wald", "jorren-im-geroell"],
  },
  {
    id: "steinbruch",
    name: "Steinbruch",
    funktion: "Kess' Lager auf dem alten Weg. Die Kirchenkiste bindet nur, wenn die Seite sie schon öffnet.",
    szenen: ["lager-hub", "lager-schleich", "lager-reden", "lager-kampf", "lager-tor"],
  },
  {
    id: "ende",
    name: "Ende",
    funktion: "Welche Form von Schuld das Dorf weiterträgt. Keine Rettung und keine Reinigung.",
    szenen: ["ende"],
  },
];

const NACH_SZENE = new Map<string, WeltOrt>();
for (const ort of WELTBILD) {
  for (const szene of ort.szenen) {
    if (NACH_SZENE.has(szene)) throw new Error(`Weltbild: ${szene} hängt an zwei Orten.`);
    NACH_SZENE.set(szene, ort);
  }
}

export function weltbildFuerSzene(id?: string): WeltOrt | null {
  if (!id) return null;
  return NACH_SZENE.get(id) ?? null;
}

/** Eine Zeile für Stimme und Spielleitung. Kein Katalog, kein Pakt. */
export function weltbildZeile(id?: string): string {
  const ort = weltbildFuerSzene(id);
  if (!ort) return "";
  return `${ort.name}: ${ort.funktion}`;
}
