import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const artRoot = resolve(root, "public/art");
const generatedPath = resolve(root, "src/game/studio/assets.generated.ts");
const extensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".m4a",
  ".mp3",
  ".mp4",
  ".ogg",
  ".png",
  ".wav",
  ".webm",
  ".webp",
]);

async function listMedia(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return listMedia(path);
      return entry.isFile() && extensions.has(extname(entry.name).toLowerCase()) ? [path] : [];
    }),
  );
  return paths.flat();
}

test("generiertes Studio-Manifest bildet alle Medien unter public/art ab", async () => {
  const source = await readFile(generatedPath, "utf8");
  const json = source.match(/^export const STUDIO_MEDIA = (.*) as const;\s*$/s)?.[1];
  assert.ok(json, "generierte TypeScript-Datei enthält kein Medienarray");
  const manifest = JSON.parse(json);
  const expectedIds = (await listMedia(artRoot))
    .map((path) => relative(artRoot, path).split("\\").join("/"))
    .sort((left, right) => left.localeCompare(right, "de"));

  assert.deepEqual(manifest.map((entry) => entry.id), expectedIds);
  assert.equal(new Set(manifest.map((entry) => entry.id)).size, manifest.length);
});