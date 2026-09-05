#!/usr/bin/env node
/**
 * Image optimize step for the Stardush static site.
 *
 * Reads full-resolution originals from  source/images/{paintings,photography,site}/
 * and writes web-ready derivatives to    public/images/{paintings,photography,site}/
 *
 * For each source image it emits:
 *   - <name>.webp        full-size web version (max edge FULL_MAX px)
 *   - <name>-thumb.webp  gallery thumbnail    (max edge THUMB_MAX px)
 *   - <name>.jpg         full-size JPEG fallback (max edge FULL_MAX px)
 *
 * Originals in source/images are the archive and are never modified.
 * Run with: npm run optimize
 */
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, parse, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_ROOT = join(ROOT, "source", "images");
const OUT_ROOT = join(ROOT, "public", "images");

const FULL_MAX = 2000; // longest edge for full-size web images
const THUMB_MAX = 800; // longest edge for gallery thumbnails
const WEBP_QUALITY = 80;
const JPEG_QUALITY = 82;

const SUBDIRS = ["the-stardust", "the-boudoir", "steven", "70s", "80s", "90s", "2000", "site"];
const IMG_RE = /\.(jpe?g|png)$/i;

async function processImage(srcPath, outDir, name) {
  await mkdir(outDir, { recursive: true });
  const base = sharp(srcPath, { failOn: "none" }).rotate(); // respect EXIF orientation

  const full = base.clone().resize(FULL_MAX, FULL_MAX, {
    fit: "inside",
    withoutEnlargement: true,
  });

  const thumb = base.clone().resize(THUMB_MAX, THUMB_MAX, {
    fit: "inside",
    withoutEnlargement: true,
  });

  await Promise.all([
    full.clone().webp({ quality: WEBP_QUALITY }).toFile(join(outDir, `${name}.webp`)),
    full.clone().jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(join(outDir, `${name}.jpg`)),
    thumb.clone().webp({ quality: WEBP_QUALITY }).toFile(join(outDir, `${name}-thumb.webp`)),
    thumb.clone().jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(join(outDir, `${name}-thumb.jpg`)),
  ]);
}

async function run() {
  let count = 0;
  for (const sub of SUBDIRS) {
    const srcDir = join(SRC_ROOT, sub);
    let entries;
    try {
      entries = await readdir(srcDir);
    } catch {
      continue;
    }
    const outDir = join(OUT_ROOT, sub);
    for (const entry of entries) {
      if (!IMG_RE.test(entry)) continue;
      const srcPath = join(srcDir, entry);
      if (!(await stat(srcPath)).isFile()) continue;
      const { name } = parse(entry);
      process.stdout.write(`  ${sub}/${entry} → `);
      await processImage(srcPath, outDir, name);
      process.stdout.write("ok\n");
      count++;
    }
  }
  console.log(`\nDone. Optimized ${count} image(s) into public/images/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
