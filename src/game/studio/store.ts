// Portiert aus worldforge-studio/src/core/store.ts, eigener localStorage-Schluessel fuer Lindendorf.
import { WorkspaceSchema, type Workspace } from "./model";

const KEY = "lindendorf.studio.workspace.v1";
const PROJECTS_KEY = "lindendorf.studio.projects.v1";
const ACTIVE_KEY = "lindendorf.studio.active-project.v1";
export interface WorkspaceStore {
  load(): Workspace | null;
  loadById(id: string): Workspace | null;
  list(): Workspace[];
  save(workspace: Workspace): void;
  clear(): void;
}
export class LocalWorkspaceStore implements WorkspaceStore {
  private parse(raw: string | null): Workspace | null {
    if (!raw) return null;
    try {
      const parsed = WorkspaceSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }

  list() {
    let stored: unknown = [];
    try {
      stored = JSON.parse(localStorage.getItem(PROJECTS_KEY) ?? "[]");
    } catch {
      stored = [];
    }
    const parsed = Array.isArray(stored)
      ? stored.flatMap((value) => {
          const workspace = WorkspaceSchema.safeParse(value);
          return workspace.success ? [workspace.data] : [];
        })
      : [];
    const ids = new Set(parsed.map((workspace) => workspace.id));
    const legacy = this.parse(localStorage.getItem(KEY));
    if (legacy && !ids.has(legacy.id)) parsed.push(legacy);
    return parsed.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  load() {
    const activeId = localStorage.getItem(ACTIVE_KEY);
    const workspaces = this.list();
    return workspaces.find((workspace) => workspace.id === activeId) ?? workspaces[0] ?? null;
  }

  loadById(id: string) {
    return this.list().find((workspace) => workspace.id === id) ?? null;
  }

  save(workspace: Workspace) {
    const workspaces = this.list().filter((candidate) => candidate.id !== workspace.id);
    workspaces.push(workspace);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(workspaces));
    localStorage.setItem(KEY, JSON.stringify(workspace));
    localStorage.setItem(ACTIVE_KEY, workspace.id);
  }

  clear() {
    const active = this.load();
    if (active) {
      const remaining = this.list().filter((workspace) => workspace.id !== active.id);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(remaining));
    }
    localStorage.removeItem(KEY);
    localStorage.removeItem(ACTIVE_KEY);
  }
}
export function downloadWorkspace(workspace: Workspace) {
  const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${workspace.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "rpg-projekt"}.worldforge.json`;
  link.click();
  URL.revokeObjectURL(url);
}
