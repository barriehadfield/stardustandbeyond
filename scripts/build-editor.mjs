#!/usr/bin/env node
/**
 * Data generator for the local corrections console (corrections.html + js/corrections.js).
 *
 * Emits public/editor-data.json: every photo with its caption and currently
 * attributed people, plus the full roster (with counts) and section labels. The
 * browser tool reads this to let you fix attributions and names, then exports a
 * corrections file that gets applied back to source/people.md.
 *
 * Runs as part of `npm run build` (via buildEditorData) and standalone as
 * `npm run editor`. No sharp/image work - fast.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GALLERIES, SECTIONS, LEAD } from "./site-data.mjs";
import { parsePeopleMd, computePeople } from "./people.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export async function buildEditorData() {
  const md = await readFile(join(ROOT, "source", "people.md"), "utf-8");
  const { roster, overrides } = parsePeopleMd(md);
  const { people } = computePeople({ GALLERIES, SECTIONS, LEAD, roster, overrides });

  // Invert person -> photos into photo -> [display], and note which photos an
  // explicit override already covers (so the tool can flag them).
  const byPhoto = new Map();
  for (const p of people)
    for (const [kind, list] of Object.entries(p.sections))
      for (const it of list) {
        const k = `${kind}/${it.file}`;
        if (!byPhoto.has(k)) byPhoto.set(k, []);
        byPhoto.get(k).push(p.display);
      }
  const overridden = new Set(overrides.map((o) => `${o.section}/${o.file}`));

  const photos = [];
  for (const s of SECTIONS)
    for (const it of GALLERIES[s.kind]) {
      const k = `${s.kind}/${it.file}`;
      photos.push({
        section: s.kind, file: it.file, caption: it.title || "",
        people: (byPhoto.get(k) || []).slice().sort(),
        overridden: overridden.has(k),
      });
    }

  const counts = Object.fromEntries(people.map((p) => [p.display, p.count]));
  const rosterOut = roster
    .map((r) => ({ display: r.display, slug: r.slug, count: counts[r.display] || 0 }))
    .sort((a, b) => a.display.localeCompare(b.display));

  const data = { sections: SECTIONS.map((s) => ({ kind: s.kind, label: s.label })), roster: rosterOut, photos };
  await writeFile(join(ROOT, "public", "editor-data.json"), JSON.stringify(data), "utf-8");
  return { photos: photos.length, people: rosterOut.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await buildEditorData();
  console.log(`  wrote public/editor-data.json (${r.photos} photos, ${r.people} people)`);
  console.log("  open the tool at:  http://localhost:8000/corrections.html  (run `npm run dev` if needed)");
}
