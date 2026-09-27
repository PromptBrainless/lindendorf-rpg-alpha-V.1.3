import { z } from "zod";
import { probe } from "../engine";
import { ART, PORTRAITS } from "../art";
import { cloneHeld, type ArtKey, type Held, type PortraitKey, type ProbeResult, type SceneView } from "../types";
import type { Entity, Workspace } from "./model";
import { heilen, schaden } from "../engine";

export const MakerProbeSchema = z.object({
  attribut: z.enum(["Stärke", "Geschicklichkeit", "Charisma"]),
  schwierigkeit: z.number().int().min(1).max(30).default(12),
  beschreibung: z.string().default(""),
  nebel: z.boolean().default(false),
  erfolgText: z.array(z.string()).default([]),
  misserfolgText: z.array(z.string()).default([]),
  erfolgLp: z.number().int().min(-10).max(10).default(0),
  misserfolgLp: z.number().int().min(-10).max(10).default(0),
  erfolgGold: z.number().int().min(-1000).max(1000).default(0),
  misserfolgGold: z.number().int().min(-1000).max(1000).default(0),
});

export const MakerSceneDataSchema = z.object({
  art: z.string().default("village"),
  artSrc: z.string().optional(),
  portrait: z.string().optional(),
  portraitSrc: z.string().optional(),
  stimmeSrc: z.string().optional(),
  lines: z.array(z.string()).default(["Du stehst in deiner neuen Szene."]),
  choices: z.array(z.string()).default(["Weiter"]),
  endingChoices: z.array(z.number().int().nonnegative()).default([]),
  probe: MakerProbeSchema.optional(),
}).passthrough();

export type MakerSceneData = z.infer<typeof MakerSceneDataSchema>;

export function neueSzenendaten(): MakerSceneData {
  return MakerSceneDataSchema.parse({});
}

export function makerSceneView(
  entity: Entity | null | undefined,
  held: Held,
  probeResult?: ProbeResult,
  folgeText: string[] = [],
): SceneView | null {
  if (!entity || entity.type !== "szene") return null;
  const parsed = MakerSceneDataSchema.safeParse(entity.data);
  if (!parsed.success) return null;

  const data = parsed.data;
  const art = data.art in ART ? (data.art as ArtKey) : "village";
  const portrait = data.portrait && data.portrait in PORTRAITS
    ? (data.portrait as PortraitKey)
    : undefined;
  const lines = [...data.lines, ...folgeText];
  const original = { title: entity.title, lines, choices: data.choices };
  return {
    id: entity.id,
    idStabil: true,
    title: entity.title,
    art,
    artSrc: data.artSrc,
    portrait,
    portraitSrc: data.portraitSrc,
    stimmeSrc: data.stimmeSrc,
    lines,
    choices: data.choices,
    held: cloneHeld(held),
    probe: probeResult,
    textKey: `${entity.id}:${entity.revision}`,
    original,
  };
}

export function wahlZiel(workspace: Workspace, sceneId: string, choiceIndex: number): string | null {
  const source = szeneNachId(workspace, sceneId);
  if (source && wahlIstEnde(source, choiceIndex)) return null;
  const relation = workspace.relations.find(
    (candidate) => candidate.kind === "choice" && candidate.fromId === sceneId && candidate.data.choiceIndex === choiceIndex,
  );
  if (!relation) return null;
  return workspace.entities.some((entity) => entity.id === relation.toId && entity.type === "szene")
    ? relation.toId
    : null;
}

export function wahlIstEnde(entity: Entity, choiceIndex: number): boolean {
  if (entity.type !== "szene") return false;
  const parsed = MakerSceneDataSchema.safeParse(entity.data);
  return parsed.success && parsed.data.endingChoices.includes(choiceIndex);
}

export function wuerfleMakerProbe(
  entity: Entity,
  held: Held,
  wurfFn?: () => number,
): ProbeResult | null {
  if (entity.type !== "szene") return null;
  const parsed = MakerSceneDataSchema.safeParse(entity.data);
  if (!parsed.success || !parsed.data.probe) return null;
  const probeDaten = parsed.data.probe;
  const attributWert = probeDaten.attribut === "Stärke"
    ? held.staerke
    : probeDaten.attribut === "Geschicklichkeit"
      ? held.geschick
      : held.charisma;
  return probe(
    held,
    probeDaten.attribut,
    attributWert,
    probeDaten.schwierigkeit,
    probeDaten.beschreibung,
    probeDaten.nebel ? "nebel" : undefined,
    undefined,
    wurfFn,
  );
}

export function wendeMakerProbeFolgeAn(
  entity: Entity,
  held: Held,
  result: ProbeResult,
): { held: Held; lines: string[] } | null {
  if (entity.type !== "szene") return null;
  const parsed = MakerSceneDataSchema.safeParse(entity.data);
  if (!parsed.success || !parsed.data.probe) return null;

  const data = parsed.data.probe;
  const next = cloneHeld(held);
  const lpAenderung = result.erfolg ? data.erfolgLp : data.misserfolgLp;
  const goldAenderung = result.erfolg ? data.erfolgGold : data.misserfolgGold;
  const folgeText = result.erfolg ? data.erfolgText : data.misserfolgText;
  const lines = [...folgeText];

  if (lpAenderung < 0) {
    lines.push(schaden(next, -lpAenderung, "Probe"));
  } else if (lpAenderung > 0) {
    lines.push(heilen(next, lpAenderung));
  }
  if (goldAenderung !== 0) {
    const vorher = next.gold;
    next.gold = Math.max(0, next.gold + goldAenderung);
    const differenz = next.gold - vorher;
    if (differenz !== 0) lines.push(`${differenz > 0 ? "+" : ""}${differenz} Gold. Beutel: ${next.gold} Gold.`);
  }
  return { held: next, lines };
}

export function szeneNachId(workspace: Workspace, id: string | undefined): Entity | null {
  if (!id) return null;
  return workspace.entities.find((entity) => entity.id === id && entity.type === "szene") ?? null;
}