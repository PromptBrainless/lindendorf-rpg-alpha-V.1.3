import { readdir, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artRoot = resolve(root, "public/art");
const output = resolve(root, "src/game/studio/assets.generated.ts");
const allowedExtensions = new Set([
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

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return collect(path);
      if (!entry.isFile() || !allowedExtensions.has(extname(entry.name).toLowerCase())) return [];
      return [path];
    }),
  );
  return files.flat();
}

const files = (await collect(artRoot))
  .map((path) => {
    const pathFromArt = relative(artRoot, path).split("\\").join("/");
    const id = pathFromArt;
    const title = id.split("/").at(-1)?.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") ?? id;
    return {
      id,
      title,
      src: `/art/${pathFromArt}`,
      format: extname(path).slice(1).toLowerCase(),
    };
  })
  .sort((left, right) => left.id.localeCompare(right.id, "de"));

const source = `export const STUDIO_MEDIA = ${JSON.stringify(files, null, 2)} as const;\n`;
await writeFile(output, source, "utf8");
console.log(`Studio-Medienmanifest: ${files.length} Dateien erfasst.`);