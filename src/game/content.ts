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
    "Der Weg nach Lindendorf ist kein Weg, den man vergisst. Er ist schmal, nass und durch die Jahre so abgetragen, dass die Fugen zwischen den Steinen wie offene Wunden aussehen.",
    "Du gehst allein. Das ist nicht besonders auffällig, aber es fühlt sich an, als sei es schon immer so gewesen: kein Wagen, kein Laden, kein Freund, der dir aus dem Nebel entgegenkommt.",
    "Der Regen der Nacht ist weg, aber die Kälte sitzt noch in den Stiefeln. Sie zieht sich durch die Nähte, bis jeder Schritt auf dem Pfad ein kleines, hartes Erinnerungsstück wird.",
    "Auf der Karte war Lindendorf kaum mehr als ein Tintenfleck am Rand des Tals. Ein Name, den man aus der Ferne kaum lesen konnte. Wenn du ehrlich bist, war es genau das, was dich hergeführt hat.",
    "Im grauen Licht wirkt das Tal größer, als es auf der Karte gewesen ist. Als hätte der Nebel das Dorf mit einer zweiten, stilleren Version von sich selbst überzogen, die man nicht eintragen kann.",
    "Unter deinen Sohlen lockern sich Steine, und schwarzes Gras drängt durch die Fugen. Wer hier schon einmal gefahren ist, hat den Weg nicht mehr als Weg gesehen, sondern als Gewohnheit.",
    "Seit Tagen hast du das Gefühl, dass niemand diese Straße wirklich benutzt. Kein Händler. Kein Bauer. Nicht einmal ein Bettler. Diese Art von Ort hält Menschen nicht nur fern — sie macht sie vorsichtig.",
    "Der Wind begleitet dich, aber er riecht nicht nur nach nassem Holz. Unter dem Geruch liegt etwas Süßliches, das du zu gut kennst, um es mit einem Namen zu nennen.",
    "Du bleibst nicht stehen. Rückwärtsgehen ist keine Richtung. Es ist nur derselbe Weg noch einmal, nur mit dem gleichen Regen in denselben Nähten.",
    "Also setzt du einen Fuß vor den anderen. Und manchmal ist Mut nur ein Wort für Gewohnheit, die noch nicht aufgehört hat, sich wie eine Wahl anzufühlen.",
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
    "Etwa fünfzig Schritte vor dir steht eine Gestalt im Regen. Ein Mann, so mager, dass der Wind an seinem Mantel zerrt, als habe er an ihm etwas zu bemängeln.",
    "Er geht ungleichmäßig, nicht wie ein Verletzter, sondern wie jemand, der schon zu lange wach ist und nicht mehr zuverlässig auf seinen eigenen Beinen steht.",
    "Nasses Haar klebt ihm an der Stirn. Der linke Ärmel ist dunkel verfärbt. Das Blut darauf ist schon trocken und schwarz wie altes Harz.",
    "Er stolpert kurz, und sein Mantel reißt auf. Unter dem Stoff blitzt etwas Silbernes, klein und schmal, ein Zeichen wie ein offenes Auge über drei geschwungenen Strichen.",
    "Kirchensilber.",
    "Du hast dieses Zeichen schon einmal am Nordpass gesehen, in einen Grenzstein geritzt, halb unter Eis verborgen. Händler spuckten darüber und bekreuzigten sich, ohne zu erklären, warum.",
    "Heute gibt es keinen Schnee. Nur Regen, Schlamm und einen Fremden, der etwas bei sich trägt, das ihm weder gut noch sicher zu gehören scheint.",
    "Der Mann hat dich noch nicht bemerkt. Hinter ihm verschluckt der Nebel den Weg, vor ihm liegt Lindendorf. Zwischen euch stehen nur wenige Schritte, schlechtes Wetter und die Frage, wem das Blut an seinem Ärmel gehört.",
  ],
  choices: [
    { label: "(Stärke – mittel) Der Mann wirkt geschwächt. Wenn er sich wehrt, wird es kurz, aber nicht unmöglich.", attribute: "Stärke", difficulty: 12, route: "kampf" },
    { label: "(Geschick – schwer) Der Regen dämpft Geräusche, der Nebel deckt Bewegungen zu. Ein solches Zeichen trägt man selten achtlos.", attribute: "Geschicklichkeit", difficulty: 15, route: "schleich" },
    { label: "(Charisma – mittel) Vielleicht ist er verletzt. Vielleicht ist er nur zu erschöpft, um noch zu kämpfen.", attribute: "Charisma", difficulty: 12, route: "ueberreden" },
    { label: "Vorübergehen — manche Dinge bringen Unglück, noch bevor man sie berührt." },
  ],
  successLines: [
    "Du packst den Mann am Mantel und reißt ihm das silberne Zeichen aus der Hand. Der Stoff geht mit einem trockenen Laut auf. Er taumelt zurück, tastet nach dem Leeren und verschwindet dann in der Dunkelheit.",
    "Deine Finger lösen den Riemen, ohne dass er es bemerkt. Erst im Nebel greift er vergeblich nach dem Silber und flucht leise, als hätte er seine letzte gute Idee verloren.",
    "Du sprichst ruhig auf ihn ein. Er senkt den Blick, atmet einmal schwer und legt dir das Artefakt in die Hand. Seine Finger bleiben noch einen Moment länger darauf, als wolle er sich von einem schlechten Gedanken verabschieden.",
  ],
  failureLines: [
    "Der Mann bemerkt deine Absicht. Für einen Augenblick wirkt er schwach. Dann ist er schneller, als du erwartest. Etwas Hartes trifft deine Hand, der Schmerz bleibt, und als du den Kopf hebst, ist er schon im Nebel verschwunden.",
    "Er nimmt das Silber mit sich in den Dunst. Deine erste Probe misslingt, aber der Weg bleibt offen. Nur das Zeichen bleibt dir im Kopf, klarer als alles andere im grauen Morgenlicht.",
  ],
  passLines: [
    "Du lässt den Mann vorbeigehen. Das Silber verschwindet unter seinem Mantel, bevor der Nebel ihn schluckt. Für einen Moment wendet er den Kopf, als habe er deine Entscheidung trotzdem gehört.",
    "Du gewinnst nichts. Aber du entscheidest dich dafür, fremde Not nicht sofort in deinen Vorteil zu verwandeln. Später wirst du nicht wissen, ob das ein Maßstab war oder nur Selbstschutz.",
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
