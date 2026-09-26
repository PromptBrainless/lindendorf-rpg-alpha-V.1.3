const SPEICHER = "lindendorf.wiki.auflagen";

const roh = import.meta.glob("../../wiki/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export type WikiSeite = {
  datei: string;
  titel: string;
  kanon: string;
};

function dateiname(pfad: string) {
  const teile = pfad.split("/");
  return teile[teile.length - 1] ?? pfad;
}

function titelAus(datei: string, text: string) {
  const zeile = text.split("\n").find((satz) => satz.startsWith("# "));
  return zeile?.replace(/^#\s+/, "").trim() || datei.replace(/\.md$/, "");
}

const SEITEN: WikiSeite[] = Object.entries(roh)
  .map(([pfad, text]) => {
    const datei = dateiname(pfad);
    return { datei, titel: titelAus(datei, text), kanon: text.replace(/\r\n/g, "\n") };
  })
  .sort((a, b) => a.titel.localeCompare(b.titel, "de"));

const NACH_DATEI = new Map(SEITEN.map((seite) => [seite.datei, seite]));

export function wikiSeiten() {
  return SEITEN;
}

export function wikiSeite(datei: string) {
  return NACH_DATEI.get(datei) ?? null;
}

function auflagen(): Record<string, string> {
  try {
    const wert = JSON.parse(localStorage.getItem(SPEICHER) ?? "{}") as unknown;
    if (!wert || typeof wert !== "object") return {};
    return Object.fromEntries(Object.entries(wert).filter((eintrag): eintrag is [string, string] => typeof eintrag[1] === "string"));
  } catch {
    return {};
  }
}

export function wikiText(datei: string) {
  const seite = wikiSeite(datei);
  if (!seite) return "";
  return auflagen()[datei] ?? seite.kanon;
}

export function wikiGeaendert(datei: string) {
  return Object.prototype.hasOwnProperty.call(auflagen(), datei);
}

export function merkeWiki(datei: string, text: string) {
  const seite = wikiSeite(datei);
  if (!seite) return;
  const stand = auflagen();
  if (text === seite.kanon) delete stand[datei];
  else stand[datei] = text;
  localStorage.setItem(SPEICHER, JSON.stringify(stand));
}

export function wikiZurueck(datei: string) {
  const stand = auflagen();
  delete stand[datei];
  localStorage.setItem(SPEICHER, JSON.stringify(stand));
}
