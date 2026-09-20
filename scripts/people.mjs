/**
 * People index for the Stardust & Beyond archive.
 *
 * The photo captions in site-data.mjs name the people in each shot, in free
 * prose. This module turns that into a browsable per-person index, driven by a
 * hand-edited master index at source/people.md (see parsePeopleMd):
 *
 *   - a ROSTER (allow-list): only people listed there become links, so caption
 *     noise - place/event names - is excluded for free. Aliases merge spelling
 *     variants ("Stephen" -> Steven Roche); a Primary flag picks the default
 *     owner of a first name shared by several people.
 *   - per-photo OVERRIDES: the definitive people for a given photo, used to fix
 *     ambiguous or mis-named shots. An override replaces auto-matching.
 *
 * computePeople() matches every caption against the roster + overrides and
 * returns, per person, their photos grouped by section - plus a review report
 * (unmatched candidate names, and every ambiguous bare-first-name photo) that
 * drives the human curation loop.
 *
 * Pure data + string work; no filesystem or sharp here (the caller owns I/O).
 */

/* ---------- name tokenising ---------- */

// Title/honorific and place/event words that can PREFIX a real name in a caption
// (e.g. "Miss South Africa Ian ..."). Stripped from the front of a name run so we
// find the actual name. Lowercased. Tunable - the roster allow-list is the real
// noise filter; this only helps locate the leading name and tidy the report.
const STOPWORDS = new Set([
  "the", "a", "an", "at", "in", "on", "of", "and", "with", "as", "aka", "for",
  "miss", "mr", "mrs", "ms", "mister", "sir", "dr", "dj",
  "south", "africa", "african", "natal", "sunshine", "stardust", "boudoir",
  "world", "universe", "gay", "sa", "rsa", "queen", "king",
]);

// Split on list connectors AND sentence punctuation (. ; :) - captions often put
// a place/context sentence right before the people ("Sandy Bay. Henry Davies, ..."),
// and without the period split the leading place name swallows the real name.
const CONNECTOR_RE = /\s*(?:[,.;:&\/]|\band\b|\bwith\b|\baka\b|\bas\b|\bplus\b)\s*/gi;

const isCapWord = (w) => /^[A-Z][a-zA-Z'’.-]*$/.test(w);

// Lowercase surname particles - kept inside a name run when followed by a
// capitalised word, so "Jean de Cruz" / "Michael van Rensburg" stay whole.
const PARTICLES = new Set(["de", "du", "da", "van", "von", "der", "den", "di", "del", "la", "le", "mc", "mac"]);

// Trim a mention word to its bare name: drop a trailing possessive ('s / ’s) and
// any leading/trailing punctuation, so "Steven's", "Basson." and "Louis'" match.
const cleanWord = (w) => w.replace(/[’']s$/i, "").replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");

/**
 * Extract candidate name mentions from a caption. Splits on connectors, then
 * from each fragment takes the leading run of Capitalised words with leading
 * stopwords removed. Returns an array of word-arrays, e.g.
 *   "Miss SA Ian, Gary Moore winning" -> [["Ian"], ["Gary","Moore"]]
 */
export function mentions(caption) {
  const out = [];
  for (const frag of String(caption).split(CONNECTOR_RE)) {
    const words = frag.trim().split(/\s+/);
    // leading run of capitalised words (through surname particles), trimmed to bare name
    const run = [];
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (isCapWord(w)) { const c = cleanWord(w); if (c) run.push(c); continue; }
      const lw = w.toLowerCase().replace(/[^a-z]/g, "");
      if (run.length && PARTICLES.has(lw) && words[i + 1] && isCapWord(words[i + 1])) { run.push(lw); continue; }
      break;
    }
    // drop leading stopwords (Miss / SA / South Africa ...)
    while (run.length && STOPWORDS.has(run[0].toLowerCase())) run.shift();
    // drop trailing stopwords too (rare, e.g. a stray "The")
    while (run.length && STOPWORDS.has(run[run.length - 1].toLowerCase())) run.pop();
    if (run.length) out.push(run);
  }
  return out;
}

export function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------- master index (source/people.md) parsing ---------- */

// Parse the first GitHub-style markdown table found after a heading whose text
// contains `heading` (case-insensitive). Returns array of row objects keyed by
// lowercased column header. Tolerant of extra whitespace and a missing trailing
// separator row.
function parseTable(md, heading) {
  const lines = md.split(/\r?\n/);
  let i = 0;
  // find the heading
  const h = heading.toLowerCase();
  for (; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i]) && lines[i].toLowerCase().includes(h)) { i++; break; }
  }
  if (i >= lines.length) return [];
  // find the header row of the next table
  for (; i < lines.length; i++) {
    if (lines[i].trim().startsWith("|")) break;
    if (/^#{1,6}\s/.test(lines[i])) return []; // hit the next heading first
  }
  if (i >= lines.length) return [];
  const cells = (row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  const headers = cells(lines[i]).map((c) => c.toLowerCase());
  i++;
  if (i < lines.length && /^[\s|:-]+$/.test(lines[i])) i++; // skip |---|---| separator
  const rows = [];
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim().startsWith("|")) break;
    const c = cells(line);
    const row = {};
    headers.forEach((hd, k) => { row[hd] = c[k] ?? ""; });
    rows.push(row);
  }
  return rows;
}

const splitList = (s) => String(s || "").split(";").map((x) => x.trim()).filter(Boolean);

/**
 * Parse source/people.md into { roster, overrides }.
 *   roster:    [ { display, first, surname, slug, aliases:[], primary:bool } ]
 *   overrides: [ { section, file, people:[displayName] } ]
 */
export function parsePeopleMd(md) {
  const peopleRows = parseTable(md, "roster");
  const overrideRows = parseTable(md, "overrides");

  const roster = peopleRows
    .filter((r) => (r.name || "").trim())
    .map((r) => {
      const display = r.name.trim();
      const parts = display.split(/\s+/);
      return {
        display,
        first: parts[0],
        surname: parts.slice(1).join(" "),
        slug: slugify(display),
        aliases: splitList(r.aliases),
        primary: /^(y|yes|true|1|x|\*)$/i.test((r.primary || "").trim()),
      };
    });

  const overrides = overrideRows
    .filter((r) => (r.section || "").trim() && (r.file || "").trim())
    .map((r) => ({
      section: r.section.trim(),
      file: r.file.trim(),
      people: splitList(r.people),
    }));

  return { roster, overrides };
}

/* ---------- matching ---------- */

function buildLookups(roster) {
  const exact = new Map();       // lowercased full name / alias -> slug
  const firstToSlugs = new Map(); // lowercased first name -> [slug]
  const primaryByFirst = new Map(); // lowercased first name -> slug
  const bySlug = new Map();      // slug -> person
  const surnameless = new Set(); // slugs of people known only by a first name

  for (const p of roster) {
    bySlug.set(p.slug, p);
    if (!/\s/.test(p.display)) surnameless.add(p.slug);
    const add = (map, key, val) => {
      const k = key.toLowerCase();
      if (!map.has(k)) map.set(k, val);
    };
    add(exact, p.display, p.slug);
    for (const a of p.aliases) add(exact, a, p.slug);

    const fk = p.first.toLowerCase();
    if (!firstToSlugs.has(fk)) firstToSlugs.set(fk, []);
    if (!firstToSlugs.get(fk).includes(p.slug)) firstToSlugs.get(fk).push(p.slug);
    // single-word aliases are also bare-first-name routes to this person
    for (const a of p.aliases) {
      if (!/\s/.test(a)) {
        const ak = a.toLowerCase();
        if (!firstToSlugs.has(ak)) firstToSlugs.set(ak, []);
        if (!firstToSlugs.get(ak).includes(p.slug)) firstToSlugs.get(ak).push(p.slug);
      }
    }
    if (p.primary) primaryByFirst.set(fk, p.slug);
  }
  return { exact, firstToSlugs, primaryByFirst, bySlug, surnameless };
}

/**
 * Resolve one mention (array of words) to a slug.
 * Returns { slug } on a match, or { ambiguousFirst, candidates } when a bare
 * first name is shared and has no Primary, or { unmatched: token } otherwise.
 */
function resolveMention(run, L) {
  const { exact, firstToSlugs, primaryByFirst } = L;
  // longest-first exact match (multi-word alias / full name / nickname)
  for (let n = Math.min(run.length, 3); n >= 1; n--) {
    const key = run.slice(0, n).join(" ").toLowerCase();
    if (exact.has(key)) return { slug: exact.get(key) };
  }
  // bare first name
  const fk = run[0].toLowerCase();
  const slugs = firstToSlugs.get(fk);
  if (!slugs) return { unmatched: run.join(" ") };
  if (slugs.length === 1) return { slug: slugs[0] };
  // doc-grounded: the doc now writes a surname when it means a surnamed person, so
  // a bare first name belongs to the person known ONLY by that first name. If
  // exactly one candidate is surname-less, it's them (confident).
  const bare = slugs.filter((s) => L.surnameless.has(s));
  if (bare.length === 1) return { slug: bare[0] };
  // otherwise genuinely shared - left for the co-occurrence resolver (pass 2)
  return { ambiguous: { first: fk, candidates: slugs, primary: primaryByFirst.get(fk) || null } };
}

/**
 * Match all captions against the roster + overrides.
 *
 * @param {object} a
 * @param {object} a.GALLERIES  - { <slug>: [ { file, title? } ] }
 * @param {Array}  a.SECTIONS   - [ { kind, label, ... } ] in site order
 * @param {object} a.LEAD       - { kind, file } (the uncaptioned club photo)
 * @param {Array}  a.roster
 * @param {Array}  a.overrides
 * @returns {{ people, report }}
 *   people: [ { display, first, slug, count, sections: { <slug>: [ {file,title} ] } } ]
 *
 * A bare first name shared by several roster people is resolved probabilistically:
 * from the people confidently identified in the same photo (full names, unique
 * first names, and overrides), we pick the candidate who most often co-occurs with
 * those same people **within the same section (timeframe)**. Overrides therefore
 * act as training signal. If there's no co-occurrence signal we fall back to the
 * roster `Primary`, and only then leave it unresolved.
 */
export function computePeople({ GALLERIES, SECTIONS, LEAD, roster, overrides }) {
  const L = buildLookups(roster);
  const sectionOrder = SECTIONS.map((s) => s.kind);
  const disp = (slug) => L.bySlug.get(slug)?.display || slug;

  const overrideMap = new Map(overrides.map((o) => [`${o.section}/${o.file}`, o.people]));
  const overridesUnknown = [];
  const unmatched = new Map(); // token -> { count, examples }

  // ---- classify every photo: confident people + any ambiguous bare names ----
  const photos = []; // { section, file, item, caption, confident:Set<slug>, ambiguous:[{first,candidates,primary}] }
  for (const section of sectionOrder) {
    for (const it of (GALLERIES[section] || [])) {
      const caption = it.title || "";
      const rec = { section, file: it.file, item: { file: it.file, title: caption }, caption, confident: new Set(), ambiguous: [] };
      const key = `${section}/${it.file}`;
      if (overrideMap.has(key)) {
        for (const dn of overrideMap.get(key)) {
          const slug = L.exact.get(dn.toLowerCase());
          if (slug) rec.confident.add(slug);
          else overridesUnknown.push({ section, file: it.file, name: dn });
        }
      } else if (caption) {
        for (const run of mentions(caption)) {
          const res = resolveMention(run, L);
          if (res.slug) rec.confident.add(res.slug);
          else if (res.ambiguous) rec.ambiguous.push(res.ambiguous);
          else if (res.unmatched) {
            const t = res.unmatched;
            if (!unmatched.has(t)) unmatched.set(t, { count: 0, examples: [] });
            const u = unmatched.get(t);
            u.count++;
            if (u.examples.length < 3) u.examples.push({ section, file: it.file, caption });
          }
        }
      }
      photos.push(rec);
    }
  }

  // ---- pass 1: co-occurrence stats from confident attributions ----
  const bump = (map, a, b) => { if (!map.has(a)) map.set(a, new Map()); const m = map.get(a); m.set(b, (m.get(b) || 0) + 1); };
  const cooc = new Map();        // slug -> slug -> count (all sections)
  const coocSec = new Map();     // section -> (slug -> slug -> count)
  const presenceSec = new Map(); // section -> slug -> count
  for (const p of photos) {
    const ppl = [...p.confident];
    if (!coocSec.has(p.section)) coocSec.set(p.section, new Map());
    if (!presenceSec.has(p.section)) presenceSec.set(p.section, new Map());
    const ps = presenceSec.get(p.section), cs = coocSec.get(p.section);
    for (const x of ppl) ps.set(x, (ps.get(x) || 0) + 1);
    for (let i = 0; i < ppl.length; i++) for (let j = 0; j < ppl.length; j++) {
      if (i === j) continue;
      bump(cooc, ppl[i], ppl[j]);
      bump(cs, ppl[i], ppl[j]);
    }
  }
  // score a candidate for a photo: co-occurrence with the photo's confident people,
  // weighting same-section (timeframe) co-occurrence over global.
  const scoreCand = (cand, section, coPresent) => {
    const cs = coocSec.get(section)?.get(cand), g = cooc.get(cand);
    let s = 0;
    for (const y of coPresent) { if (cs) s += 3 * (cs.get(y) || 0); if (g) s += (g.get(y) || 0); }
    return s;
  };

  // ---- pass 2: resolve ambiguous bare names ----
  const unresolved = [];               // no signal and no primary
  const resolvedByCooccurrence = [];   // for the report
  const resolvedByPrimary = [];        // fell back to the Primary default (a guess)
  const priByFirst = {}, cooByFirst = {}, unresByFirst = {};
  for (const p of photos) {
    for (const amb of p.ambiguous) {
      const coPresent = [...p.confident];
      let best = null, bestScore = 0, tie = [];
      for (const cand of amb.candidates) {
        const sc = scoreCand(cand, p.section, coPresent);
        if (sc > bestScore) { bestScore = sc; best = cand; tie = [cand]; }
        else if (sc === bestScore && sc > 0) tie.push(cand);
      }
      let chosen = null, method = null;
      if (bestScore > 0) {
        chosen = tie.length === 1 ? best
          : tie.sort((a, b) => (presenceSec.get(p.section)?.get(b) || 0) - (presenceSec.get(p.section)?.get(a) || 0))[0];
        method = "cooccurrence";
      } else if (amb.primary) { chosen = amb.primary; method = "primary"; }
      if (chosen) {
        p.confident.add(chosen);
        if (method === "cooccurrence") {
          cooByFirst[amb.first] = (cooByFirst[amb.first] || 0) + 1;
          resolvedByCooccurrence.push({ section: p.section, file: p.file, first: amb.first, chosen: disp(chosen), candidates: amb.candidates.map(disp), caption: p.caption });
        } else {
          priByFirst[amb.first] = (priByFirst[amb.first] || 0) + 1;
          resolvedByPrimary.push({ section: p.section, file: p.file, first: amb.first, chosen: disp(chosen), candidates: amb.candidates.map(disp), caption: p.caption });
        }
      } else {
        unresByFirst[amb.first] = (unresByFirst[amb.first] || 0) + 1;
        unresolved.push({ section: p.section, file: p.file, first: amb.first, candidates: amb.candidates.map(disp), caption: p.caption, assigned: null });
      }
    }
  }

  // ---- place photos onto people (gallery order preserved) ----
  const acc = new Map();
  for (const p of photos) for (const slug of p.confident) {
    if (!acc.has(slug)) acc.set(slug, new Map());
    const secMap = acc.get(slug);
    if (!secMap.has(p.section)) secMap.set(p.section, []);
    secMap.get(p.section).push(p.item);
  }
  const people = [];
  for (const pr of roster) {
    const secMap = acc.get(pr.slug);
    if (!secMap) continue;
    const sections = {};
    let count = 0;
    for (const section of sectionOrder) if (secMap.has(section)) { sections[section] = secMap.get(section); count += sections[section].length; }
    people.push({ display: pr.display, first: pr.first, slug: pr.slug, count, sections });
  }
  const bySlugCount = new Map(people.map((p) => [p.slug, p.count]));
  const pageSlugs = new Set(people.map((p) => p.slug));

  // "Also seen with" - co-occurrence from the FINAL attributions (includes the
  // ambiguous names resolved in pass 2), for cross-navigation on each person page.
  const coSeen = new Map(); // slug -> Map(slug -> count)
  for (const p of photos) {
    const ppl = [...p.confident];
    for (let i = 0; i < ppl.length; i++) for (let j = 0; j < ppl.length; j++) {
      if (i === j) continue;
      if (!coSeen.has(ppl[i])) coSeen.set(ppl[i], new Map());
      const mm = coSeen.get(ppl[i]);
      mm.set(ppl[j], (mm.get(ppl[j]) || 0) + 1);
    }
  }
  for (const person of people) {
    const mm = coSeen.get(person.slug);
    person.alsoWith = mm
      ? [...mm.entries()].filter(([s]) => pageSlugs.has(s))
          .sort((a, b) => b[1] - a[1] || disp(a[0]).localeCompare(disp(b[0])))
          .slice(0, 60)
          .map(([s, n]) => ({ slug: s, display: disp(s), count: n }))
      : [];
  }

  // shared first names, with how each was resolved
  const sharedNames = [];
  for (const [fk, slugs] of L.firstToSlugs) {
    if (slugs.length < 2) continue;
    const primarySlug = L.primaryByFirst.get(fk);
    sharedNames.push({
      first: fk,
      candidates: slugs.map(disp),
      primary: primarySlug ? disp(primarySlug) : null,
      byCooccurrence: cooByFirst[fk] || 0,
      byPrimary: priByFirst[fk] || 0,
      unresolved: unresByFirst[fk] || 0,
    });
  }
  sharedNames.sort((a, b) => (b.byCooccurrence + b.byPrimary + b.unresolved) - (a.byCooccurrence + a.byPrimary + a.unresolved));

  // people carried in the roster without a surname (single-word display) that
  // appear in photos - listed with their top co-occurring people to help identify
  // and surname them.
  const surnameless = [];
  for (const pr of roster) {
    if (/\s/.test(pr.display)) continue;
    const count = bySlugCount.get(pr.slug);
    if (!count) continue;
    const g = cooc.get(pr.slug);
    const top = g ? [...g.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([s, n]) => `${disp(s)} (${n})`) : [];
    surnameless.push({ display: pr.display, count, topCooc: top });
  }
  surnameless.sort((a, b) => b.count - a.count);

  const report = {
    unmatched: [...unmatched.entries()].map(([token, v]) => ({ token, count: v.count, examples: v.examples })).sort((a, b) => b.count - a.count),
    unresolved,
    resolvedByCooccurrence,
    resolvedByPrimary,
    sharedNames,
    surnameless,
    overridesUnknown,
  };

  return { people, report };
}

/* ---------- draft roster generator (seeding source/people.md) ---------- */

/**
 * Scan captions and return candidate people to seed the roster: distinct first
 * names with frequency and the surnames observed next to them. Printed by
 * `node scripts/people.mjs --draft`.
 */
export function draftRoster(captions) {
  const firsts = new Map(); // first -> { count, surnames: Map<surname,count> }
  for (const c of captions) {
    for (const run of mentions(c)) {
      const first = run[0];
      if (!firsts.has(first)) firsts.set(first, { count: 0, surnames: new Map() });
      const rec = firsts.get(first);
      rec.count++;
      if (run.length >= 2) {
        const sur = run[1];
        rec.surnames.set(sur, (rec.surnames.get(sur) || 0) + 1);
      }
    }
  }
  return [...firsts.entries()]
    .map(([first, v]) => ({
      first,
      count: v.count,
      surnames: [...v.surnames.entries()].sort((a, b) => b[1] - a[1]),
    }))
    .sort((a, b) => b.count - a.count);
}

/* ---------- CLI: draft mode ---------- */
if (import.meta.url === `file://${process.argv[1]}`) {
  const { GALLERIES, SECTIONS } = await import("./site-data.mjs");
  const caps = [];
  for (const s of SECTIONS) for (const it of GALLERIES[s.kind]) if (it.title) caps.push(it.title);
  const draft = draftRoster(caps);
  console.log(`# Draft roster candidates (${caps.length} captions, ${draft.length} distinct first names)\n`);
  console.log(`freq  first        surnames seen (freq)`);
  for (const d of draft) {
    const surs = d.surnames.map(([s, n]) => `${s}(${n})`).join(", ");
    console.log(`${String(d.count).padStart(4)}  ${d.first.padEnd(12)} ${surs}`);
  }
}
