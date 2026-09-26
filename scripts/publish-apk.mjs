import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(projectRoot, "android/app/build/outputs/apk/debug/app-debug.apk");
const destination = resolve(projectRoot, "public/download/lindendorf.apk");

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);
console.log(`APK für den Vercel-Deploy aktualisiert: ${destination}`);