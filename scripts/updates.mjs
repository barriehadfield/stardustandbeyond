#!/usr/bin/env node
/**
 * Updates feed for Stardust & Beyond - "what's new since you last looked".
 *
 * Groups every current photo into the deploy on which it first appeared, so the
 * Updates page can show new photographs batch-by-batch and a red dot can nudge
 * returning visitors toward pictures they haven't seen yet.
 *
 * Dating is by IMAGE CONTENT, not filename. A fresh Google-Docs export renumbers
 * every image (image1, image2, …) and the early re-imports also re-encoded the
 * whole archive, so a filename is NOT a stable photo id across history. Git, by
 * contrast, tracks content: the same photo keeps its blob id (OID) even when it is
 * renamed or re-copied into another tab. So we walk history and record, for each
 * current photo's blob, the first commit its bytes appeared in under source/images.
 *
 *  - PAST: everything first committed on or before STABLE_FROM (when the byte→name
 *    manifest began and filenames became stable - see "Filename stability" in
 *    CLAUDE.md) is folded into one "original archive" baseline. Before that date the
 *    archive was re-encoded wholesale on each import, so per-deploy history there is
 *    not meaningful; after it, each import only adds genuinely-new bytes.
 *  - GOING FORWARD (automatic): a photo whose bytes aren't committed yet (added to
 *    the working tree, not yet committed) is stamped today - so the batch forms the
 *    moment you add photos and rebuild, then locks to its commit date next build. An
 *    unchanged photo keeps its original date because its bytes (blob id) don't change.
 *
 * Batches are keyed by date (one per deploy-day) and returned newest-first. A batch
 * may carry `baseline: true` (the folded pre-stable archive, rendered as a summary,
 * not a gallery). `latest` is the newest non-baseline date - the id the red dot
 * compares against a visitor's "last seen" value.
 */
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// The day stable, content-keyed filenames began (source/image-names.json was first
// committed). Everything first seen on or before this is the "original archive"
// baseline; genuinely-new photos are only tracked per-deploy after it.
const STABLE_FROM = "2026-09-20";

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

// "2026-10-20" -> "20 October 2026"
export function formatBatchDate(d) {
  const [y, m, day] = d.split("-").map(Number);
  return `${day} ${MONTHS[(m || 1) - 1]} ${y}`;
}

function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
}

// Every photo in the current site data, in display order, deduped by CONTENT (blob
// id): byte-identical copies shown in two tabs merge into one photo, while distinct
// photos that happen to share a base name (base names are reused across folders and
// across exports) stay separate. `blobOf` maps "<kind>/<base>" -> blob id.
function currentPhotos({ GALLERIES, SECTIONS, LEAD }, blobOf) {
  const seenOid = new Set();
  const seenPath = new Set();
  const out = [];
  const add = (kind, file, title) => {
    const oid = blobOf.get(`${kind}/${file}`);
    if (!oid) {                                   // not committed yet -> unique by path
      const key = `${kind}/${file}`;
      if (seenPath.has(key)) return;
      seenPath.add(key);
      out.push({ kind, file, title: title || "", oid: null });
      return;
    }
    if (seenOid.has(oid)) return;
    seenOid.add(oid);
    out.push({ kind, file, title: title || "", oid });
  };
  if (LEAD) add(LEAD.kind, LEAD.file, "");
  for (const s of SECTIONS)
    for (const it of GALLERIES[s.kind] || [])
      add(s.kind, it.file, it.title);
  return out;
}

// "<kind>/<base>" -> blob id for every source image at HEAD.
function headBlobs() {
  const map = new Map();
  const tree = git(["ls-tree", "-r", "HEAD", "--", "source/images"]).trim();
  if (!tree) return map;
  for (const line of tree.split("\n")) {
    const [meta, path] = line.split("\t");
    if (!path) continue;
    const oid = meta.split(/\s+/)[2];
    const m = path.match(/^source\/images\/([^/]+)\/(.+)\.(?:jpe?g|png)$/i);
    if (m) map.set(`${m[1]}/${m[2]}`, oid);
  }
  return map;
}

// blob id -> date (YYYY-MM-DD) its bytes first appeared under source/images.
function firstSeenByContent() {
  const log = git(["log", "--reverse", "--format=%H%x09%cs"]).trim();
  const firstSeen = new Map();
  if (!log) return firstSeen;
  for (const line of log.split("\n")) {
    const [sha, date] = line.split("\t");
    if (!sha) continue;
    let tree;
    try { tree = git(["ls-tree", "-r", sha, "--", "source/images"]); } catch { continue; }
    for (const l of tree.trim().split("\n")) {
      if (!l) continue;
      const oid = l.split(/\s+/)[2];
      if (oid && !firstSeen.has(oid)) firstSeen.set(oid, date);
    }
  }
  return firstSeen;
}

export function buildUpdates({ GALLERIES, SECTIONS, LEAD }, { today } = {}) {
  const now = today || new Date().toISOString().slice(0, 10);

  let blobOf, firstSeen;
  try {
    blobOf = headBlobs();
    firstSeen = firstSeenByContent();
  } catch (err) {
    // No git / shallow checkout: degrade to a single baseline batch dated today.
    console.warn("  updates: git history unavailable, using a single baseline batch -", err.message);
    const photos = currentPhotos({ GALLERIES, SECTIONS, LEAD }, new Map());
    return { batches: [{ date: now, label: "The original archive", baseline: true, photos }], latest: "" };
  }

  const photos = currentPhotos({ GALLERIES, SECTIONS, LEAD }, blobOf);

  // Bucket each photo by the date its bytes first appeared; pre-stable -> baseline.
  const byDate = new Map();
  const baseline = [];
  for (const p of photos) {
    const date = p.oid ? firstSeen.get(p.oid) : undefined;
    if (!date || date > now) { byDate.set(now, (byDate.get(now) || []).concat(p)); continue; } // uncommitted -> today
    if (date <= STABLE_FROM) { baseline.push(p); continue; }
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(p);
  }

  const dates = [...byDate.keys()].sort().reverse();   // newest first
  const batches = dates.map((date) => ({ date, label: "", photos: byDate.get(date) }));
  if (baseline.length)
    batches.push({ date: STABLE_FROM, label: "The original archive", baseline: true, photos: baseline });

  const latestBatch = batches.find((b) => !b.baseline);
  return { batches, latest: latestBatch ? latestBatch.date : "" };
}
