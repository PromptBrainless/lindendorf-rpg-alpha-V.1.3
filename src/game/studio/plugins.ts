// Portiert aus worldforge-studio/src/core/plugins.ts, Schemas an Lindendorf-Begriffe angepasst.
import { z, type ZodType } from "zod";
import type { Entity, ValidationFinding } from "./model";

export type SchemaRegistration = { type: string; version: number; schema: ZodType<Record<string, unknown>>; label: string };
export type WorldForgePlugin = { id: string; version: string; apiVersion: "1"; schemas: SchemaRegistration[]; validate?: (entity: Entity) => ValidationFinding[] };

const registry = new Map<string, SchemaRegistration>();
export function registerPlugin(plugin: WorldForgePlugin) {
  if (plugin.apiVersion !== "1") throw new Error("Nicht unterstuetzte Plugin-API");
  for (const schema of plugin.schemas) registry.set(schema.type, schema);
}
export function schemaFor(type: string) {
  return registry.get(type);
}
export function registeredSchemas() {
  return [...registry.values()];
}

registerPlugin({
  id: "lindendorf.core",
  version: "1.0.0",
  apiVersion: "1",
  schemas: [
    { type: "medium", version: 1, label: "Medium", schema: z.object({ assetId: z.string().optional(), assetKey: z.string().optional(), assetKind: z.string().optional(), format: z.string().optional(), mediaType: z.enum(["image", "video", "audio"]).optional(), src: z.string().optional(), sourceProject: z.string().optional(), libraryEntryId: z.string().optional(), librarySource: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "abschnitt", version: 1, label: "Questabschnitt", schema: z.object({ sourceQuestId: z.string().optional(), sourceQuest: z.string().optional(), sourceSectionId: z.string().optional(), sceneCount: z.number().int().nonnegative().optional(), sourceSceneIds: z.array(z.string()).optional(), sourceProject: z.string().optional(), libraryEntryId: z.string().optional(), librarySource: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "szene", version: 1, label: "Szene", schema: z.object({ szeneId: z.string().optional(), sourceId: z.string().optional(), quest: z.string().optional(), sourceQuest: z.string().optional(), sourceTeil: z.string().optional(), art: z.string().optional(), artSrc: z.string().optional(), portrait: z.string().optional(), portraitSrc: z.string().optional(), stimmeSrc: z.string().optional(), lines: z.array(z.string()).optional(), choices: z.array(z.string()).optional(), endingChoices: z.array(z.number().int().nonnegative()).optional(), probe: z.object({ attribut: z.enum(["Stärke", "Geschicklichkeit", "Charisma"]), schwierigkeit: z.number().int().min(1).max(30), beschreibung: z.string(), nebel: z.boolean(), erfolgText: z.array(z.string()).optional(), misserfolgText: z.array(z.string()).optional(), erfolgLp: z.number().int().min(-10).max(10).optional(), misserfolgLp: z.number().int().min(-10).max(10).optional(), erfolgGold: z.number().int().min(-1000).max(1000).optional(), misserfolgGold: z.number().int().min(-1000).max(1000).optional() }).optional(), successLines: z.array(z.string()).optional(), failureLines: z.array(z.string()).optional(), passLines: z.array(z.string()).optional(), notizen: z.string().optional(), sourceProject: z.string().optional(), libraryEntryId: z.string().optional(), librarySource: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "figur", version: 1, label: "Figur", schema: z.object({ sourceId: z.string().optional(), portrait: z.string().optional(), portraitSrc: z.string().optional(), rolle: z.string().optional(), ort: z.string().optional(), weltbild: z.string().optional(), angst: z.string().optional(), ziel: z.string().optional(), sourceProject: z.string().optional(), libraryEntryId: z.string().optional(), librarySource: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "wissen", version: 1, label: "Wissenstafel", schema: z.object({ sourceId: z.string().optional(), text: z.string().optional(), lines: z.array(z.string()).optional(), bild: z.string().optional(), szenen: z.string().optional(), sourceSceneIds: z.array(z.string()).optional(), sourceProject: z.string().optional(), libraryEntryId: z.string().optional(), librarySource: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "gegenstand", version: 1, label: "Gegenstand", schema: z.object({ sourceId: z.string().optional(), beschreibung: z.string().optional(), sourceProject: z.string().optional(), libraryEntryId: z.string().optional(), librarySource: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "ort", version: 1, label: "Ort", schema: z.object({ beschreibung: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "notiz", version: 1, label: "Notiz", schema: z.object({ text: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
  ],
});
