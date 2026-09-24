import { z } from "zod";
import { exportiereModul } from "./export-modul";
import type { SceneView } from "./types";

const AttributeSchema = z.enum(["Stärke", "Geschicklichkeit", "Charisma"]);
const RouteSchema = z.enum(["kampf", "schleich", "ueberreden"]);

export const IntroWegSchema = z.object({
  id: z.literal("intro-weg"),
  title: z.string().min(1),
  art: z.literal("road"),
  lines: z.array(z.string().min(1)).min(3),
  choices: z.array(z.string().min(1)).length(1),
});

export const INTRO_WEG_CONTENT = IntroWegSchema.parse({
  id: "intro-weg",
  title: "Der Weg nach Lindendorf",
  art: "road",
  lines: [
    "Der Weg ins Tal ist alt. Er ist älter als die Furchen, die ihn noch halten. Er ist so schmal, dass zwei Wagen sich nur begegnen, wenn einer weicht. Meist ist das der Schwächere.",
    "Du gehst allein.",
    "Der Regen hat in der Nacht aufgehört, doch er hängt noch in der Luft wie ein Versprechen, das niemand eingelöst hat. Er sammelt sich in den Fugen des Steins und sucht einen Weg unter deine Sohlen. Die Kälte dringt in die Nähte deiner Stiefel ein und bleibt dort. Sie bleibt gleichgültig gegen jeden Schritt, der folgt.",
    "Auf der Karte war Lindendorf kaum mehr als ein Tintenfleck am Rand des Tals. Es war ein Name, zwischen Hügel und Wald gequetscht. Der Kartenschreiber hoffte, dass niemand jemals dorthin gehen würde.",
    "In der Dämmerung wirkt es größer. Oder näher. Als hätte die Dunkelheit hier ein zweites Dorf über das erste gelegt, eines, das man auf keiner Karte einträgt.",
    "Unter deinen Sohlen lockern sich die Steine. Schwarzes Gras wächst aus den Fugen. Es ist niedergetreten von Rädern und Hufen. Die Spuren wirken älter, als die Jahreszeit erlaubt.",
    "Seit Tagen glaubst du, dass niemand diesen Pfad betritt. Kein Händler wandert hier. Kein Bauer folgt ihm. Nicht einmal ein Bettler, und Bettler gehen gewöhnlich überallhin, wo andere sich fürchten.",
    "Nur der Wind wandert mit dir. Er streicht über die Hänge und trägt den Geruch von nassem Holz. Unter dem Geruch liegt etwas Süßes, das du kennst, doch du willst es nicht benennen.",
    "Du bleibst nicht stehen. Umkehren ist keine Richtung. Es ist nur die Entscheidung, dieselbe Strecke ein zweites Mal zu gehen, mit demselben Regen in denselben Nähten.",
    "Also setzt du einen Fuß vor den anderen. Manchmal besteht der einzige Unterschied zwischen Mut und Gewohnheit darin, dass niemand mehr weiß, warum er überhaupt weiterläuft.",
  ],
  choices: ["Weiter"],
});

export const IntroArtifactContentSchema = z.object({
  id: z.literal("intro-fremder-am-weg"),
  title: z.string().min(1),
  art: z.literal("stranger"),
  lines: z.array(z.string().min(1)).min(3),
  choices: z.array(
    z.object({
      label: z.string().min(1),
      attribute: AttributeSchema.optional(),
      difficulty: z.number().int().positive().optional(),
      route: RouteSchema.optional(),
    }),
  ).length(4),
  successLines: z.array(z.string().min(1)).length(3),
  failureLines: z.array(z.string().min(1)).min(2),
  passLines: z.array(z.string().min(1)).min(2),
});

export const INTRO_ARTIFACT_CONTENT = IntroArtifactContentSchema.parse({
  id: "intro-fremder-am-weg",
  title: "Der Fremde am Weg",
  art: "stranger",
  lines: [
    "Etwa fünfzig Schritte voraus erscheint eine Gestalt im Regen. Ein Mann, so mager, dass der Wind an seinem Mantel zerrt, und der Stoff scheint mehr dem Wetter zu gehören als ihm.",
    "Sein Gang ist ungleichmäßig. Er hinkt nicht wie ein Verletzter, sondern stolpert wie ein Mensch, der zu lange wach blieb. Er hat zu viel verloren, um noch auf seine eigenen Füße zu vertrauen.",
    "Nasses Haar klebt an seiner Stirn. Der linke Ärmel ist dunkel verfärbt, das Blut darauf längst getrocknet und schwarz geworden wie altes Harz.",
    "Er gerät kurz ins Straucheln, und sein Mantel reißt auf. Unter dem Stoff blitzt etwas Silbernes – klein, handtellergroß. Selbst aus dieser Entfernung erkennst du das Zeichen: ein offenes Auge über drei eingeritzten Linien.",
    "Kirchensilber.",
    "Du hast das Symbol schon einmal am Nordpass gesehen, vor Jahren, in einen Grenzstein geschlagen und halb unter Eis verborgen. Händler spuckten darüber und bekreuzigten sich, doch sie erklärten nicht, warum.",
    "Heute gibt es keinen Schnee. Nur Regen, Schlamm, und einen Fremden, der etwas bei sich trägt, das ihm kaum gehören dürfte.",
    "Der Mann hat dich noch nicht bemerkt. Hinter ihm verschluckt der Nebel den Weg, vor ihm liegt Lindendorf. Zwischen euch stehen nur wenige Schritte, schlechtes Wetter und die Frage, wem das Blut auf seinem Ärmel gehört.",
  ],
  choices: [
    { label: "(Stärke – mittel) Der Mann wirkt geschwächt. Falls er Widerstand leistet, dürfte der Kampf kurz sein. Dennoch tragen auch Sterbende Messer.", attribute: "Stärke", difficulty: 12, route: "kampf" },
    { label: "(Geschick – schwer) Der Regen dämpft Geräusche. Der Nebel verbirgt Bewegungen. Doch Kirchenartefakte werden selten achtlos getragen.", attribute: "Geschicklichkeit", difficulty: 15, route: "schleich" },
    { label: "(Charisma – mittel) Vielleicht ist er verängstigt. Vielleicht verletzt. Vielleicht sucht er Hilfe mehr als Streit.", attribute: "Charisma", difficulty: 12, route: "ueberreden" },
    { label: "Vorübergehen - Manche Dinge bringen Unglück, lange bevor man sie berührt." },
  ],
  successLines: [
    "Du packst den Mann am Mantel und entreißt ihm das Artefakt. Der Stoff reißt mit einem trockenen Laut. Er stolpert zurück, greift nach dem leeren Riemen und verschwindet schließlich im Nebel.",
    "Deine Finger lösen den Riemen, ohne dass der Mann den Verlust bemerkt. Erst im Nebel tastet er vergeblich nach dem Silber. Sein Fluchen wird leiser, bis der Regen es nimmt.",
    "Du sprichst ruhig auf ihn ein. Der Mann senkt den Blick und legt dir das Artefakt in die Hand. Seine Finger bleiben einen Augenblick länger darauf liegen, als würde er sich von etwas verabschieden.",
  ],
  failureLines: [
    "Der Mann bemerkt deine Absicht. Für einen Augenblick wirkt er schwach. Dann ist er schneller, als du es erwartest. Etwas Hartes schlägt gegen deine Hand, und der Schmerz bleibt, obwohl der Mann bereits zurückweicht.",
    "Er verschwindet mit dem silbernen Artefakt im Nebel. Deine erste Probe ist gescheitert, aber der Weg bleibt offen. Nur das Zeichen bleibt dir im Kopf, heller als es im grauen Licht gewesen sein dürfte.",
  ],
  passLines: [
    "Du lässt den Mann passieren. Das Silber verschwindet unter seinem Mantel, bevor der Nebel ihn schluckt. Für einen Moment dreht er den Kopf, als hätte er deine Entscheidung trotzdem gehört.",
    "Du hast nichts gewonnen. Aber du hast dich entschieden, nicht jede fremde Not zu deinem Vorteil zu machen. Später wirst du nicht wissen, ob das ein Maßstab oder nur Bequemlichkeit war.",
  ],
});

export function exportiereIntro() {
  return exportiereModul("intro-fremder.json", IntroArtifactContentSchema, INTRO_ARTIFACT_CONTENT);
}

export function exportiereIntroWeg() {
  return exportiereModul("intro-weg.json", IntroWegSchema, INTRO_WEG_CONTENT);
}

export function introAlsSzene(): SceneView {
  return {
    id: INTRO_WEG_CONTENT.id,
    title: INTRO_WEG_CONTENT.title,
    art: INTRO_WEG_CONTENT.art,
    lines: INTRO_WEG_CONTENT.lines,
    choices: INTRO_WEG_CONTENT.choices,
    textKey: INTRO_WEG_CONTENT.id,
    original: { title: INTRO_WEG_CONTENT.title, lines: INTRO_WEG_CONTENT.lines, choices: INTRO_WEG_CONTENT.choices },
  };
}
