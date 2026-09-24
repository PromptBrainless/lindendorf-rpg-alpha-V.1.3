import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Fehlende Schlüssel aus der lokalen .env. Gesetzte Umgebungsvariablen bleiben. */
function ladeDateiEnv(): void {
  const marke = globalThis as { __lindendorfEnv?: boolean };
  if (marke.__lindendorfEnv) return;
  marke.__lindendorfEnv = true;
  try {
    const wurzel = join(dirname(fileURLToPath(import.meta.url)), "../..");
    const text = readFileSync(join(wurzel, ".env"), "utf8");
    for (const zeile of text.split("\n")) {
      const roh = zeile.trim();
      if (!roh || roh.startsWith("#")) continue;
      const gleich = roh.indexOf("=");
      if (gleich < 1) continue;
      const key = roh.slice(0, gleich).trim();
      if (!/^[A-Z0-9_]+$/.test(key) || process.env[key]?.trim()) continue;
      let wert = roh.slice(gleich + 1).trim();
      if (
        (wert.startsWith('"') && wert.endsWith('"')) ||
        (wert.startsWith("'") && wert.endsWith("'"))
      ) {
        wert = wert.slice(1, -1);
      }
      if (wert) process.env[key] = wert;
    }
  } catch {
    // Keine .env. Die Plattform setzt die Variablen dann selbst.
  }
}

ladeDateiEnv();

export function env(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v || undefined;
}

/**
 * Workspace preview vs deployed app. The deployer writes GROK_PROJECT_ID on
 * every publish; the sandbox preview never has it. Single source of truth for
 * the split — gate audience, gate endpoints and connector-token semantics all
 * key off this predicate.
 */
export function isWorkspacePreview(): boolean {
  return !env("GROK_PROJECT_ID");
}
