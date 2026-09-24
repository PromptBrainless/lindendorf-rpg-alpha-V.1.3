import { INTRO_ARTIFACT_CONTENT, INTRO_WEG_CONTENT } from "../content";
import { karte, type SzeneJson, type TeilJson } from "./schema";
import { wissenDatei } from "./wissen";

export const INTRO_TAL = karte("intro-tal", "Das Tal", "forest", [
  "Der Wald steht dicht an den Hängen, so eng, dass sich die Stämme beinahe berühren. Der Weg wird zwischen ihnen zu einem schmalen, nassen Streifen Erde, als habe er sich nur mit Mühe selbst durch dieses Dickicht gegraben.",
  "Zwischen den Bäumen hängen Nebelfetzen, die nicht weggehen. Sie hängen dort, als würde etwas im Wald sie zurückhalten und ihnen nicht erlauben, zu verschwinden.",
  "Weiter unten steigt Rauch auf, senkrecht und ohne Bewegung. Kein Wind fasst ihn an, und ein Rauch, der so gerade steht, ist selten ein gutes Zeichen.",
  "Jemand hat die Felder abgeerntet und dabei die Zäune vergessen. Das wirkt nicht nach Nachlässigkeit, sondern nach Angst. Als hätte das Tal eine Arbeit begonnen und den Mut verloren, sie zu Ende zu bringen.",
  "Am Waldrand liegen kleine Bündel aus nassem Reisig, sorgfältig aufgeschichtet und doch unberührt. Daneben steckt ein einzelner Kinderschuh im Schlamm, schräg im Boden wie ein vergessenes Zeichen.",
  "Kein Vogel ruft. Weit oben im Hang bricht ein Ast, und danach wartet das Tal still wie ein Mensch, der einen Schritt nach dem anderen auf der Schwelle zum Reden macht.",
  "Du verstehst noch nicht, was hier geschehen ist. Aber du erkennst die Handschrift einer Gegend, in der Menschen gelernt haben, ihre Fragen leise zu stellen. Nicht aus Furcht, sondern aus Gewohnheit.",
]);

export const INTRO_RAUCH_GRABEN = karte("intro-rauch-graben", "Rauch und Graben", "ditch", [
  "Weiter unten steigt Rauch auf, steil und ohne Bewegung. Kein Wind fasst ihn an.",
  "Er bleibt, wo er ist, eine graue Säule über den Hängen. Er trägt nassen Brand und kalte Asche nicht fort.",
  "Vom Steinbruch her, sagst du dir. Auch wenn du ihn noch nicht gesehen hast. Nur die Richtung. Osten.",
  "Ein Rauch, der so gerade steht, gehört keinem Herd. Herdfeuer wackeln. Dieses hier tut es nicht.",
  "Unterhalb der Kapelle klafft ein trockener Graben im Hang. Einst muss dort Wasser gelaufen sein; jetzt ist die Mulde glatt gewaschen und tot, als hätte die Erde selbst beschlossen, nichts mehr durchzulassen.",
  "Darin liegen die Knochen von Tieren, sauber aufgereiht und ausgebleicht. Es wirkt nicht nach Zufall, sondern nach Ordnung.",
  "Kein Geruch von Fäulnis mehr. Nur Kalk und Kälte. Wer so etwas auflegt, zählt nicht nur Tiere. Er zählt auch die Leute, die es nicht sehen wollen.",
]);

export const INTRO_HANG = karte("intro-hang", "Am Hang", "chapel", [
  "Oberhalb des Dorfes zieht ein alter Weg den Hang hinauf, hart und schmal. Der Schotter unter deinen Sohlen knirscht nassen Kies, und bei jedem Schritt gibt er leicht nach, als traue er dir nicht.",
  "Hier oben steht eine Kapelle, ihr Dach dunkler als der Himmel darüber. Als hätte man das Holz extra gegen das Licht gewählt.",
  "Eine kleine Glocke bewegt sich einmal über dem Geröll. Du kennst den Pfad noch nicht, aber du merkst dir den Laut.",
  "Über dem Türsturz klebt ein Streifen rotes Wachs, frisch gebrochen. Dasselbe Zeichen, das du unten im Dorf wiederfinden wirst. Jemand markiert Türen, die niemand öffnen soll.",
  "Die Glocke schweigt wieder. Trotzdem hast du das Gefühl, dass etwas im Tal jetzt weiß, dass du angekommen bist. Und dass es diese Kenntnis nicht wieder aus dem Gedächtnis verlieren wird, nur weil du weitergehst.",
]);

export const INTRO_LINDENDORF = karte("intro-lindendorf", "Lindendorf", "village", [
  "Häuser drücken sich so eng aneinander, als könnten sie dadurch wärmer werden. Ihre Dächer hängen tief herab wie Kapuzen über gesenkten Köpfen.",
  "Am Brunnen stehen Frauen mit verschränkten Armen und sehen dir nach, bis du vorbei bist. Nicht neugierig. Prüfend. Wie man ein Wetter prüft, das sich zum Umsturz entschließen könnte.",
  "In der Taverne wird eine Lampe mit einer hastigen Bewegung ausgeblasen. Jede Flamme scheint hier mehr zu kosten, als sie an Licht zurückgibt.",
  "Auch über der Rathaustür klebt ein Zeichen aus rotem Wachs, wie du es schon am Hang gesehen hast. Hier ist es alt und unversehrt, als wäre es seit Jahren niemandem mehr gelungen, den Sinn zu brechen.",
  "Ein Gerber deckt sein Leder mit einer viel zu kleinen Plane zu. Einige Felle bleiben im Regen liegen. Er sieht kurz hin und wendet sich ab. Es lohnt sich nicht mehr, sie zu retten.",
  "Hinter einem offenen Fenster hustet ein alter Mann. Eine Stimme dahinter zählt Münzen, so leise, als könnte lautes Zählen sie kosten.",
  "Lindendorf wirkt nicht verlassen. Es wirkt schlimmer. Es wirkt wie ein Dorf, das sich daran gewöhnt hat, dass keiner kommt — und das plötzlich bemerkt, dass doch einer gekommen ist.",
]);

export const INTRO_ANKUNFT = karte("intro-ankunft", "Ankunft", "village", [
  "Du bleibst am Rand des Platzes stehen. Niemand fragt, wer du bist.",
  "Das ist am Anfang höflich. Dann merkst du, dass es Vorsicht ist: die Art von Höflichkeit, die man sich aneignet, wenn Fragen in der Vergangenheit selten gut endeten.",
  "Du könntest weitergehen. Der Weg nach Osten führt am Steinbruch vorbei, und aus dem Steinbruch steigt Rauch, genau so steil und gerade wie der im Tal.",
  "In Lindendorf wartet niemand auf einen Helden. Trotzdem beginnt hier dein Weg — in einem Dorf, das sich seit Langem entschieden hat, auf Wunder nicht mehr zu hoffen.",
  "Hinter dir schließt sich das Tal wie ein nasser Kragen. Vor dir liegen Türen, hinter denen jeder etwas verloren hat und nicht jeder bereit ist, es beim Namen zu nennen.",
  "Du spürst die Blicke erst, als sie aufhören. Die Leute hier sehen Fremde nicht lange an. Sie wissen, dass ein Gesicht allein kaum genug ist, um die Angst zu teilen.",
  "Am Brunnen schlägt ein Tropfen auf den Stein. Dann noch einer. So beginnt in Lindendorf vieles: nicht mit einem Ruf, sondern mit einem Geräusch, das nicht aufhört.",
]);

function ausWissen(id: string, art: string) {
  const datei = wissenDatei(id);
  return karte(id, datei?.title ?? id, art, datei?.lines ?? []);
}

export const INTRO_RAUCH = ausWissen("intro-rauch", "forest");
export const INTRO_KINDERSCHUH = ausWissen("intro-kinderschuh", "forest");
export const INTRO_SIEGEL = ausWissen("intro-siegel", "evidence");
export const INTRO_GRABEN = ausWissen("intro-graben", "ditch");

const weg: SzeneJson = {
  id: INTRO_WEG_CONTENT.id,
  title: INTRO_WEG_CONTENT.title,
  art: INTRO_WEG_CONTENT.art,
  portrait: null,
  lines: INTRO_WEG_CONTENT.lines,
  choices: INTRO_WEG_CONTENT.choices,
};

const fremder: SzeneJson = {
  id: INTRO_ARTIFACT_CONTENT.id,
  title: INTRO_ARTIFACT_CONTENT.title,
  art: INTRO_ARTIFACT_CONTENT.art,
  portrait: null,
  lines: INTRO_ARTIFACT_CONTENT.lines,
  choices: INTRO_ARTIFACT_CONTENT.choices.map((item) => item.label),
  successLines: INTRO_ARTIFACT_CONTENT.successLines,
  failureLines: INTRO_ARTIFACT_CONTENT.failureLines,
  passLines: INTRO_ARTIFACT_CONTENT.passLines,
};

function teil(id: string, titel: string, szenen: SzeneJson[]): TeilJson {
  return { id, titel, quest: "ankunft", datei: `ankunft/${id}.json`, szenen };
}

export const ANKUNFT_TEILE: TeilJson[] = [
  teil("weg", "Der Weg", [weg]),
  teil("fremder", "Der Fremde", [fremder]),
  teil("tal", "Tal und Dorf", [
    INTRO_TAL,
    INTRO_RAUCH_GRABEN,
    INTRO_RAUCH,
    INTRO_KINDERSCHUH,
    INTRO_HANG,
    INTRO_SIEGEL,
    INTRO_GRABEN,
    INTRO_LINDENDORF,
    INTRO_ANKUNFT,
  ]),
];
