// Portiert aus worldforge-studio/src/core/model.ts (siehe docs/EDITOR.md, Abschnitt "Studio").
import { z } from "zod";
import { schemaFor } from "./plugins";

export const EntityTypeSchema = z.string().min(1).regex(/^[a-z][a-z0-9_.-]*$/);
export const RelationSchema = z.object({ id: z.string(), workspaceId: z.string(), fromId: z.string(), toId: z.string(), kind: z.string().min(1), data: z.record(z.string(), z.unknown()).default({}) });
export const EntitySchema = z.object({ id: z.string(), workspaceId: z.string(), type: EntityTypeSchema, schemaVersion: z.number().int().positive(), title: z.string().min(1), data: z.record(z.string(), z.unknown()), tags: z.array(z.string()).default([]), revision: z.number().int().nonnegative(), createdAt: z.string(), updatedAt: z.string() });
export const WorkspaceSchema = z.object({ id: z.string(), name: z.string().min(1), schemaVersion: z.number().int().positive(), createdAt: z.string(), updatedAt: z.string(), startSceneId: z.string().optional(), entities: z.array(EntitySchema), relations: z.array(RelationSchema) });
export type Entity = z.infer<typeof EntitySchema>;
export type Relation = z.infer<typeof RelationSchema>;
export type Workspace = z.infer<typeof WorkspaceSchema>;
export type ValidationFinding = { severity: "error" | "warning" | "info"; message: string; entityId?: string };

export function newWorkspace(name = "Neues RPG-Projekt"): Workspace {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), name, schemaVersion: 1, createdAt: now, updatedAt: now, entities: [], relations: [] };
}
export function newEntity(workspaceId: string, type: string, title: string, data: Record<string, unknown> = {}): Entity {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), workspaceId, type, schemaVersion: 1, title, data, tags: [], revision: 0, createdAt: now, updatedAt: now };
}
export function validateWorkspace(input: unknown): { workspace?: Workspace; findings: ValidationFinding[] } {
  const parsed = WorkspaceSchema.safeParse(input);
  if (!parsed.success) return { findings: parsed.error.issues.map((issue) => ({ severity: "error", message: issue.path.join(".") + ": " + issue.message })) };
  const workspace = parsed.data;
  const entitiesById = new Map(workspace.entities.map((entity) => [entity.id, entity]));
  const findings: ValidationFinding[] = [];
  for (const entity of workspace.entities) {
    const registration = schemaFor(entity.type);
    if (!registration) {
      findings.push({ severity: "warning", message: `Für den Typ ${entity.type} ist kein Prüfschema registriert.`, entityId: entity.id });
      continue;
    }
    const dataResult = registration.schema.safeParse(entity.data);
    if (!dataResult.success) {
      for (const issue of dataResult.error.issues) {
        findings.push({ severity: "error", message: `${issue.path.join(".") || "data"}: ${issue.message}`, entityId: entity.id });
      }
    }
  }
  if (workspace.startSceneId) {
    const start = entitiesById.get(workspace.startSceneId);
    if (!start || start.type !== "szene") findings.push({ severity: "error", message: "Startszene verweist nicht auf eine vorhandene Szene.", entityId: workspace.startSceneId });
  }
  for (const entity of workspace.entities) {
    if (entity.type !== "szene" || !Array.isArray(entity.data.endingChoices)) continue;
    const choices = entity.data.choices;
    for (const choiceIndex of entity.data.endingChoices) {
      if (!Number.isInteger(choiceIndex) || (choiceIndex as number) < 0 || !Array.isArray(choices) || (choiceIndex as number) >= choices.length) {
        findings.push({ severity: "error", message: "Endwahl verweist auf eine ungültige Wahlposition.", entityId: entity.id });
      }
    }
  }
  for (const relation of workspace.relations) {
    const source = entitiesById.get(relation.fromId);
    const target = entitiesById.get(relation.toId);
    if (!source) findings.push({ severity: "error", message: `Relation verweist auf unbekannte Entity ${relation.fromId}`, entityId: relation.id });
    if (!target) findings.push({ severity: "error", message: `Relation verweist auf unbekannte Entity ${relation.toId}`, entityId: relation.id });
    if (relation.kind !== "choice") continue;
    if (source?.type !== "szene" || target?.type !== "szene") {
      findings.push({ severity: "error", message: "Eine Wahl muss von einer Szene zu einer Szene führen.", entityId: relation.id });
      continue;
    }
    const choices = source.data.choices;
    const choiceIndex = relation.data.choiceIndex;
    if (!Array.isArray(choices) || !Number.isInteger(choiceIndex) || (choiceIndex as number) < 0 || (choiceIndex as number) >= choices.length) {
      findings.push({ severity: "error", message: "Wahlverbindung verweist auf eine ungültige Wahlposition.", entityId: relation.id });
    }
  }
  return { workspace, findings };
}
