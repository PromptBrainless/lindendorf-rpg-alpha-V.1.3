export type KlasseId =
  | "akademiker"
  | "buerger"
  | "flussvolk"
  | "freisassen"
  | "gesetzlose"
  | "hoeflinge"
  | "krieger"
  | "landvolk";

export type Karriere = { id: string; name: string; klasse: KlasseId };
export type Klassenprofil = { id: KlasseId; name: string; karrieren: Karriere[] };
export type Charakterauswahl = { klasse: KlasseId; karriere: string; ep: number };
export type Charakterwahlmodus = "lagen" | "zufall";
export type LageCharakterHinweis = { id: string; art: "gnade" | "ordnung" | "nutzen" };

const eintrag = (klasse: KlasseId, werte: [string, string][]): Karriere[] =>
  werte.map(([id, name]) => ({ id, name, klasse }));

export const KLASSEN: Klassenprofil[] = [
  { id: "akademiker", name: "Akademiker", karrieren: eintrag("akademiker", [["advokat", "Advokat"], ["apotheker", "Apotheker"], ["gelehrter", "Gelehrter"], ["medicus", "Medicus"], ["moench", "Mönch"], ["priester", "Priester"], ["technicus", "Technicus"], ["zauberer", "Zauberer"]]) },
  { id: "buerger", name: "Bürger", karrieren: eintrag("buerger", [["agitator", "Agitator"], ["bettler", "Bettler"], ["ermittler", "Ermittler"], ["handwerker", "Handwerker"], ["kaufmann", "Kaufmann"], ["rattenfaenger", "Rattenfänger"], ["staedter", "Städter"], ["wachmann", "Wachmann"]]) },
  { id: "flussvolk", name: "Flussvolk", karrieren: eintrag("flussvolk", [["flussbewohner", "Flussbewohner"], ["flussschiffer", "Flussschiffer"], ["flusswaechter", "Flusswächter"], ["lotse", "Lotse"], ["schmuggler", "Schmuggler"], ["seemann", "Seemann"], ["stauer", "Stauer"], ["strandraeuber", "Strandräuber"]]) },
  { id: "freisassen", name: "Freisassen", karrieren: eintrag("freisassen", [["bote", "Bote"], ["flagellant", "Flagellant"], ["hausierer", "Hausierer"], ["hexenjaeger", "Hexenjäger"], ["kopfgeldjaeger", "Kopfgeldjäger"], ["kutscher", "Kutscher"], ["schausteller", "Schausteller"], ["strassenwaechter", "Straßenwächter"]]) },
  { id: "gesetzlose", name: "Gesetzlose", karrieren: eintrag("gesetzlose", [["bandit", "Bandit"], ["dieb", "Dieb"], ["grabraeuber", "Grabräuber"], ["halunke", "Halunke"], ["hehler", "Hehler"], ["hexer", "Hexer"], ["kuppler", "Kuppler"], ["scharlatan", "Scharlatan"]]) },
  { id: "hoeflinge", name: "Höflinge", karrieren: eintrag("hoeflinge", [["adeliger", "Adeliger"], ["berater", "Berater"], ["diener", "Diener"], ["duellist", "Duellist"], ["gesandter", "Gesandter"], ["kuenstler", "Künstler"], ["meier", "Meier"], ["spion", "Spion"]]) },
  { id: "krieger", name: "Krieger", karrieren: eintrag("krieger", [["gedungener", "Gedungener"], ["grubenkaempfer", "Grubenkämpfer"], ["kavallerist", "Kavallerist"], ["kriegerpriester", "Kriegerpriester"], ["ritter", "Ritter"], ["slayer", "Slayer"], ["soldat", "Soldat"], ["waechter", "Wächter"]]) },
  { id: "landvolk", name: "Landvolk", karrieren: eintrag("landvolk", [["bergmann", "Bergmann"], ["buettel", "Büttel"], ["doerfler", "Dörfler"], ["heckenhexer", "Heckenhexer"], ["jaeger", "Jäger"], ["kraeuterkundiger", "Kräuterkundiger"], ["kundschafter", "Kundschafter"], ["mystiker", "Mystiker"]]) },
];

const KLASSEN_NACH_LAGE: Record<string, KlasseId> = {
  soldateska: "krieger", feind: "freisassen", ernte: "landvolk", verraeter: "gesetzlose", brot: "landvolk",
  seueche: "akademiker", spion: "hoeflinge", waffe: "krieger", burg: "buerger", ausweg: "freisassen",
};

const KLASSE_NACH_RANG: Record<KlasseId, "Messing" | "Silber" | "Gold"> = {
  akademiker: "Silber", buerger: "Silber", flussvolk: "Messing", freisassen: "Messing",
  gesetzlose: "Messing", hoeflinge: "Silber", krieger: "Messing", landvolk: "Messing",
};

export function klasseMitId(id: KlasseId): Klassenprofil {
  return KLASSEN.find((klasse) => klasse.id === id) ?? KLASSEN[0]!;
}

export function karriereMitId(id: string): Karriere | undefined {
  return KLASSEN.flatMap((klasse) => klasse.karrieren).find((karriere) => karriere.id === id);
}

export function sichereCharakterauswahl(auswahl: Charakterauswahl): Charakterauswahl {
  const klasse = klasseMitId(auswahl.klasse);
  const karriere = klasse.karrieren.find((eintrag) => eintrag.id === auswahl.karriere) ?? klasse.karrieren[0]!;
  return { klasse: klasse.id, karriere: karriere.id, ep: Math.max(0, auswahl.ep) };
}

export function charakterRang(klasse: KlasseId): "Messing" | "Silber" | "Gold" {
  return KLASSE_NACH_RANG[klasse];
}

export function hatSozialenZugang(
  rang: "Messing" | "Silber" | "Gold",
  erforderlich: "Messing" | "Silber" | "Gold",
): boolean {
  const wert = { Messing: 0, Silber: 1, Gold: 2 };
  return wert[rang] >= wert[erforderlich];
}

export function charakterAusLagen(
  lagen: LageCharakterHinweis[],
  saat: number,
  modus: Charakterwahlmodus,
): Charakterauswahl {
  if (modus === "zufall") {
    const klasse = KLASSEN[Math.abs(saat) % KLASSEN.length]!;
    const karriere = klasse.karrieren[Math.abs(Math.floor(saat / KLASSEN.length)) % klasse.karrieren.length]!;
    return { klasse: klasse.id, karriere: karriere.id, ep: 50 };
  }

  const punkte = new Map<KlasseId, number>(KLASSEN.map((klasse) => [klasse.id, 0]));
  const moralKlasse: Record<LageCharakterHinweis["art"], KlasseId> = {
    gnade: "landvolk", ordnung: "buerger", nutzen: "gesetzlose",
  };
  for (const lage of lagen) {
    const lageKlasse = KLASSEN_NACH_LAGE[lage.id];
    if (lageKlasse) punkte.set(lageKlasse, (punkte.get(lageKlasse) ?? 0) + 3);
    const ausrichtungKlasse = moralKlasse[lage.art];
    punkte.set(ausrichtungKlasse, (punkte.get(ausrichtungKlasse) ?? 0) + 1);
  }
  const hoechste = Math.max(...punkte.values());
  const kandidaten = KLASSEN.filter((klasse) => punkte.get(klasse.id) === hoechste);
  const klasse = kandidaten[Math.abs(saat) % kandidaten.length]!;
  const karriereIndex = lagen.reduce((summe, lage) => summe + lage.id.length, 0) + Math.abs(saat);
  const karriere = klasse.karrieren[karriereIndex % klasse.karrieren.length]!;
  return { klasse: klasse.id, karriere: karriere.id, ep: 0 };
}
