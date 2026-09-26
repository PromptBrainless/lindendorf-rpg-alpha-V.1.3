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
    { type: "szene", version: 1, label: "Szene", schema: z.object({ szeneId: z.string().optional(), quest: z.string().optional(), notizen: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "figur", version: 1, label: "Figur", schema: z.object({ rolle: z.string().optional(), ort: z.string().optional(), weltbild: z.string().optional(), angst: z.string().optional(), ziel: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "wissen", version: 1, label: "Wissenstafel", schema: z.object({ text: z.string().optional(), szenen: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "ort", version: 1, label: "Ort", schema: z.object({ beschreibung: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
    { type: "notiz", version: 1, label: "Notiz", schema: z.object({ text: z.string().optional() }) as unknown as ZodType<Record<string, unknown>> },
  ],
});
