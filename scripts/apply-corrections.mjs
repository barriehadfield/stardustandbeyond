#!/usr/bin/env node
/**
 * Apply a corrections file (exported from corrections.html) back into
 * source/people.md, rewriting the Roster and Overrides tables in place while
 * leaving the surrounding prose untouched.
 *
 * Corrections JSON shape (see js/corrections.js buildCorrections):
 *   {
 *     overrides: [ { section, file, people:[display], note? } ],
 *     roster: { rename:[{from,to}], merge:[{from,into}], delete:[display], add:[display] },
 *     notes?: string
 *   }
 *
 * Usage:
 *   node scripts/apply-corrections.mjs <corrections.json>           # dry-run summary
 *   node scripts/apply-corrections.mjs <corrections.json> --apply   # write source/people.md
 *
 * After --apply:  npm run build
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePeopleMd } from "./people.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PEOPLE_MD = join(ROOT, "source", "people.md");

const lc = (s) => String(s).trim().toLowerCase();
const uniq = (arr) => {
  const seen = new Set(), out = [];
  for (const x of arr) { const k = lc(x); if (x && !seen.has(k)) { seen.add(k); out.push(x); } }
  return out;
};

function rosterRows(roster) {
  const head = "| Name | Aliases | Primary |\n|------|---------|---------|";
  const rows = roster.map((r) => `| ${r.display} | ${(r.aliases || []).join("; ")} | ${r.primary ? "yes" : ""} |`);
  return [head, ...rows].join("\n");
}
function overrideRows(overrides) {
  const head = "| Section | File | People |\n|---------|------|--------|";
  const rows = overrides.map((o) => `| ${o.section} | ${o.file} | ${o.people.join("; ")} |`);
  return [head, ...rows].join("\n");
}

// Replace the markdown table that follows the given "## <heading>" with `block`.
function spliceTable(md, heading, block) {
  const lines = md.split(/\r?\n/);
  let i = 0;
  for (; i < lines.length; i++) if (/^#{1,6}\s/.test(lines[i]) && lc(lines[i]).includes(heading)) { i++; break; }
  // find first table line
  let start = -1;
  for (; i < lines.length; i++) { if (lines[i].trim().startsWith("|")) { start = i; break; } if (/^#{1,6}\s/.test(lines[i])) break; }
  if (start === -1) throw new Error(`table under "${heading}" not found`);
  let end = start;
  while (end < lines.length && lines[end].trim().startsWith("|")) end++;
  return [...lines.slice(0, start), ...block.split("\n"), ...lines.slice(end)].join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const file = args.find((a) => !a.startsWith("--"));
  if (!file) { console.error("usage: apply-corrections.mjs <corrections.json> [--apply]"); process.exit(1); }

  const corr = JSON.parse(await readFile(file, "utf-8"));
  const md = await readFile(PEOPLE_MD, "utf-8");
  const { roster, overrides } = parsePeopleMd(md);

  // Prefer an exact-case match, then fall back to case-insensitive, so entries
  // that differ only by case (e.g. two typo variants) don't collide.
  const findIdx = (display) => {
    const exact = roster.findIndex((r) => r.display === display);
    return exact >= 0 ? exact : roster.findIndex((r) => lc(r.display) === lc(display));
  };
  const log = [];

  // 1) renames
  for (const { from, to } of corr.roster?.rename || []) {
    const i = findIdx(from);
    if (i < 0) { log.push(`skip rename (not found): ${from}`); continue; }
    roster[i].aliases = uniq([...(roster[i].aliases || []), from]).filter((a) => lc(a) !== lc(to));
    roster[i].display = to;
    log.push(`rename: ${from} -> ${to}`);
  }
  // 2) merges: fold `from` into `into` as an alias, drop the `from` row
  for (const { from, into } of corr.roster?.merge || []) {
    const fi = findIdx(from), ti = findIdx(into);
    if (ti < 0) { log.push(`skip merge (target missing): ${from} -> ${into}`); continue; }
    if (fi < 0) { log.push(`skip merge (source missing): ${from}`); continue; }
    roster[ti].aliases = uniq([...(roster[ti].aliases || []), roster[fi].display, ...(roster[fi].aliases || [])])
      .filter((a) => lc(a) !== lc(roster[ti].display));
    roster.splice(fi, 1);
    log.push(`merge: ${from} -> ${into}`);
  }
  // 3) deletes
  for (const display of corr.roster?.delete || []) {
    const i = findIdx(display);
    if (i < 0) { log.push(`skip delete (not found): ${display}`); continue; }
    roster.splice(i, 1);
    log.push(`delete: ${display}`);
  }
  // 4) adds
  for (const display of corr.roster?.add || []) {
    if (findIdx(display) >= 0) { log.push(`skip add (exists): ${display}`); continue; }
    roster.push({ display, aliases: [], primary: false });
    log.push(`add: ${display}`);
  }

  // 5) overrides: upsert by section/file
  const ovMap = new Map(overrides.map((o) => [`${o.section}/${o.file}`, o]));
  for (const o of corr.overrides || []) {
    const key = `${o.section}/${o.file}`;
    const people = uniq(o.people); // drop case-insensitive duplicates within a photo
    ovMap.set(key, { section: o.section, file: o.file, people });
    log.push(`override: ${key} = ${people.join("; ") || "(nobody)"}`);
  }
  const newOverrides = [...ovMap.values()];

  let out = spliceTable(md, "roster", rosterRows(roster));
  out = spliceTable(out, "overrides", overrideRows(newOverrides));

  console.log(`corrections: ${file}`);
  console.log(log.length ? log.map((l) => "  " + l).join("\n") : "  (no changes)");
  if (corr.notes) console.log(`\nnotes from session:\n  ${corr.notes.replace(/\n/g, "\n  ")}`);
  console.log(`\nresult: ${roster.length} roster people, ${newOverrides.length} overrides`);

  if (!apply) { console.log("\nDRY RUN. Re-run with --apply to write source/people.md, then `npm run build`."); return; }
  await writeFile(PEOPLE_MD, out.endsWith("\n") ? out : out + "\n", "utf-8");
  console.log("\nwrote source/people.md.  Next: npm run build");
}

main().catch((e) => { console.error(e); process.exit(1); });
