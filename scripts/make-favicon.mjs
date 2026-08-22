#!/usr/bin/env node
/**
 * Render the favicon design source (source/images/site/favicon.svg) into the
 * assets referenced by the pages:
 *   public/images/site/favicon.svg  (scalable, primary)
 *   public/images/site/icon-32.png  (PNG fallback)
 *   public/images/site/icon-180.png (apple-touch-icon)
 *
 * Run with: npm run favicon   (re-run only if the favicon design changes)
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "source", "images", "site", "favicon.svg");
const OUT = join(ROOT, "public", "images", "site");

const svg = await readFile(SRC);
await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, "favicon.svg"), svg);

for (const size of [32, 180]) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(join(OUT, `icon-${size}.png`));
  console.log(`  wrote icon-${size}.png`);
}
console.log("  wrote favicon.svg");
console.log("\nDone.");
