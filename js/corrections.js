/* Corrections console (local tool).
   Reads public/editor-data.json, lets you fix per-photo people (-> overrides) and
   roster names (rename / merge / delete / add), persists to localStorage, and
   exports a JSON file that gets applied back to source/people.md.
   Vanilla JS, event-delegated for the ~900-photo list. */

const KEY = "stardust-corrections-v2";
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let DATA = null;
let ROSTER = new Set();          // lowercased known display names (from data)
let ROSTER_LIST = [];            // display names, sorted
let PHOTO_INDEX = new Map();     // "section/file" -> photo object
let SECTION_LABEL = {};

const blank = () => ({ photos: {}, roster: {}, add: [], notes: "" });
// state.photos: { "section/file": { people:[...], note:"" } }  (only if changed)
// state.roster: { "<original display>": { rename?:string, mergeInto?:string, del?:true } }
// state.add:    [ "New Name", ... ]  (people to add to roster)
let state = load();

function load() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); if (v && v.photos) return v; } catch {}
  return blank();
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); renderBadge(); }

/* ---------- photo helpers ---------- */
const pkey = (p) => `${p.section}/${p.file}`;
function currentPeople(key) {
  const e = state.photos[key];
  if (e && e.people) return e.people;
  return PHOTO_INDEX.get(key).people;
}
function photoNote(key) { return (state.photos[key] && state.photos[key].note) || ""; }
function sameSet(a, b) { return a.length === b.length && [...a].sort().join("|") === [...b].sort().join("|"); }
function photoChanged(key) {
  const e = state.photos[key];
  if (!e) return false;
  const orig = PHOTO_INDEX.get(key).people;
  return (e.people && !sameSet(e.people, orig)) || (e.note && e.note.trim());
}
function ensurePhoto(key) {
  if (!state.photos[key]) state.photos[key] = { people: currentPeople(key).slice(), note: photoNote(key) };
  return state.photos[key];
}
function addPersonTo(key, name) {
  name = name.trim(); if (!name) return;
  const e = ensurePhoto(key);
  if (!e.people.some((n) => n.toLowerCase() === name.toLowerCase())) e.people.push(name);
  save();
}
function removePersonFrom(key, name) {
  const e = ensurePhoto(key);
  e.people = e.people.filter((n) => n !== name);
  save();
}
function setPhotoNote(key, text) { ensurePhoto(key).note = text; save(); }
function resetPhoto(key) { delete state.photos[key]; save(); }
const isKnown = (name) => ROSTER.has(name.toLowerCase()) || state.add.some((n) => n.toLowerCase() === name.toLowerCase());

/* ---------- roster helpers ---------- */
function rosterChanged(display) { const r = state.roster[display]; return !!(r && (r.rename || r.mergeInto || r.del)); }
function setRosterEdit(display, patch) {
  const cur = state.roster[display] || {};
  const next = { ...cur, ...patch };
  Object.keys(next).forEach((k) => { if (next[k] === "" || next[k] == null || next[k] === false) delete next[k]; });
  if (Object.keys(next).length) state.roster[display] = next; else delete state.roster[display];
  save();
}

/* ---------- counts ---------- */
function counts() {
  let pc = 0; for (const k in state.photos) if (photoChanged(k)) pc++;
  let rc = 0; for (const d in state.roster) if (rosterChanged(d)) rc++;
  rc += state.add.length;
  return { pc, rc };
}
function renderBadge() {
  const { pc, rc } = counts();
  $("#badge").textContent = `${pc} photo edit${pc === 1 ? "" : "s"} · ${rc} name change${rc === 1 ? "" : "s"}`;
}

/* ================= PHOTOS TAB ================= */
let photoFilter = { section: "", q: "", chip: "all" };

function photosTab() {
  const app = $("#app");
  const secOpts = ['<option value="">All sections</option>']
    .concat(DATA.sections.map((s) => `<option value="${s.kind}">${esc(s.label)}</option>`)).join("");
  app.innerHTML = `
    <div class="controls">
      <select id="f-sec">${secOpts}</select>
      <input type="search" id="f-q" placeholder="Search caption or person…" value="${esc(photoFilter.q)}">
      <div class="chip-filter">
        <button data-chip="all">All</button>
        <button data-chip="untagged">No people</button>
        <button data-chip="changed">Edited</button>
      </div>
    </div>
    <div class="cards" id="cards"></div>`;
  $("#f-sec").value = photoFilter.section;
  $("#f-sec").onchange = (e) => { photoFilter.section = e.target.value; renderCards(); };
  let t; $("#f-q").oninput = (e) => { clearTimeout(t); t = setTimeout(() => { photoFilter.q = e.target.value; renderCards(); }, 180); };
  app.querySelectorAll(".chip-filter button").forEach((b) => {
    b.classList.toggle("on", b.dataset.chip === photoFilter.chip);
    b.onclick = () => { photoFilter.chip = b.dataset.chip; app.querySelectorAll(".chip-filter button").forEach((x) => x.classList.toggle("on", x === b)); renderCards(); };
  });
  wireCardEvents($("#cards"));
  renderCards();
}

function filteredPhotos() {
  const q = photoFilter.q.trim().toLowerCase();
  return DATA.photos.filter((p) => {
    if (photoFilter.section && p.section !== photoFilter.section) return false;
    const key = pkey(p);
    if (photoFilter.chip === "untagged" && currentPeople(key).length) return false;
    if (photoFilter.chip === "changed" && !photoChanged(key)) return false;
    if (q) {
      const hay = (p.caption + " " + currentPeople(key).join(" ")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function cardHTML(p) {
  const key = pkey(p);
  const people = currentPeople(key);
  const chips = people.map((n) =>
    `<span class="chip${isKnown(n) ? "" : " new"}">${esc(n)}<button data-act="rm" data-name="${esc(n)}" title="remove">×</button></span>`
  ).join("");
  const note = photoNote(key);
  const changed = photoChanged(key);
  return `<div class="card${changed ? " changed" : ""}" data-key="${esc(key)}">
    <img loading="lazy" src="public/images/${p.section}/${p.file}-thumb.jpg" alt="" data-full="public/images/${p.section}/${p.file}.jpg">
    <div class="body">
      <div class="meta"><span>${esc(SECTION_LABEL[p.section] || p.section)} · ${esc(p.file)}</span>${p.overridden ? '<span class="tag-ovr">override</span>' : ""}</div>
      <div class="cap${p.caption ? "" : " empty"}">${p.caption ? esc(p.caption) : "(no caption)"}</div>
      <div class="chips">${chips || '<span class="was">nobody yet</span>'}</div>
      <div class="addrow">
        <input class="add-input" list="roster-names" placeholder="+ add person" data-act="addfield">
      </div>
      <input class="note-input" placeholder="note (e.g. who is 2nd from left?)" value="${esc(note)}" data-act="note">
      <div class="foot">
        <span class="was">${changed ? "edited" : ""}</span>
        ${changed ? '<button class="reset" data-act="reset">reset</button>' : ""}
      </div>
    </div>
  </div>`;
}

function renderCards() {
  const list = filteredPhotos();
  const box = $("#cards");
  if (!list.length) { box.innerHTML = '<p class="empty-state">No photos match.</p>'; return; }
  box.innerHTML = list.map(cardHTML).join("");
}

function refreshCard(key) {
  const card = document.querySelector(`.card[data-key="${cssEsc(key)}"]`);
  if (card) card.outerHTML = cardHTML(PHOTO_INDEX.get(key));
}
const cssEsc = (s) => (window.CSS && CSS.escape ? CSS.escape(s) : s.replace(/"/g, '\\"'));

function wireCardEvents(box) {
  box.addEventListener("click", (e) => {
    const card = e.target.closest(".card"); if (!card) return;
    const key = card.dataset.key;
    const act = e.target.dataset.act;
    if (e.target.tagName === "IMG") { window.open(e.target.dataset.full, "_blank"); return; }
    if (act === "rm") { removePersonFrom(key, e.target.dataset.name); refreshCard(key); }
    else if (act === "reset") { resetPhoto(key); refreshCard(key); }
  });
  box.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (e.target.dataset.act === "addfield") {
      const key = e.target.closest(".card").dataset.key;
      addPersonTo(key, e.target.value); e.target.value = ""; refreshCard(key);
      // keep focus flowing: focus the new add field
      const nf = document.querySelector(`.card[data-key="${cssEsc(key)}"] [data-act="addfield"]`); if (nf) nf.focus();
    }
  });
  box.addEventListener("change", (e) => {
    if (e.target.dataset.act === "note") {
      const key = e.target.closest(".card").dataset.key;
      setPhotoNote(key, e.target.value); refreshCard(key);
    }
  });
}

/* ================= PEOPLE TAB ================= */
let pplFilter = "";
function peopleTab() {
  const app = $("#app");
  app.innerHTML = `
    <div class="controls">
      <input type="search" id="p-q" placeholder="Filter names…" value="${esc(pplFilter)}">
      <div class="addrow" style="flex:1">
        <input class="add-input" id="p-add" placeholder="+ add a person missing from the list (full name)">
        <button class="btn ghost" id="p-add-btn">Add</button>
      </div>
    </div>
    <p class="hint">Fix a name in place (add a missing surname, correct a spelling), <b>merge</b> a wrong duplicate into the right person, or <b>remove</b> an entry that isn't a real person. Changes here rewrite the roster in <code>source/people.md</code>.</p>
    ${state.add.length ? `<p class="hint">Added this session: ${state.add.map(esc).join(", ")}</p>` : ""}
    <div class="ppl" id="ppl"></div>`;
  let t; $("#p-q").oninput = (e) => { clearTimeout(t); t = setTimeout(() => { pplFilter = e.target.value; renderPeople(); }, 150); };
  $("#p-add-btn").onclick = () => {
    const v = $("#p-add").value.trim();
    if (v && !isKnown(v)) { state.add.push(v); save(); peopleTab(); }
    else if (v) { $("#p-add").value = ""; }
  };
  $("#p-add").onkeydown = (e) => { if (e.key === "Enter") $("#p-add-btn").click(); };
  renderPeople();
}

function otherPeopleOptions(exclude) {
  return ROSTER_LIST.filter((n) => n !== exclude)
    .map((n) => `<option value="${esc(n)}">${esc(n)}</option>`).join("");
}

function prowHTML(p) {
  const r = state.roster[p.display] || {};
  const changed = rosterChanged(p.display);
  const cls = "prow" + (r.del ? " deleted" : changed ? " changed" : "");
  return `<div class="${cls}" data-name="${esc(p.display)}">
    <div class="top">
      <input class="name-input" data-act="rename" value="${esc(r.rename || p.display)}" ${r.del ? "disabled" : ""}>
      <span class="cnt">${p.count} photo${p.count === 1 ? "" : "s"}</span>
    </div>
    <div class="acts">
      <label class="was">merge into:</label>
      <select data-act="merge" ${r.del ? "disabled" : ""}>
        <option value="">— keep separate —</option>
        ${otherPeopleOptions(p.display)}
      </select>
      <button class="linkbtn" data-act="del">${r.del ? "undo remove" : "remove (not a person)"}</button>
      ${changed ? '<button class="linkbtn" data-act="undo">undo</button>' : ""}
    </div>
    ${r.rename && r.rename !== p.display ? `<div class="was">was: ${esc(p.display)}</div>` : ""}
    ${r.mergeInto ? `<div class="was">→ merge into <b>${esc(r.mergeInto)}</b></div>` : ""}
  </div>`;
}

function renderPeople() {
  const q = pplFilter.trim().toLowerCase();
  const list = DATA.roster.filter((p) => !q || p.display.toLowerCase().includes(q));
  const box = $("#ppl");
  box.innerHTML = list.length ? list.map(prowHTML).join("") : '<p class="empty-state">No names match.</p>';
  if (box.dataset.wired) return;
  box.dataset.wired = "1";
  box.addEventListener("change", (e) => {
    const row = e.target.closest(".prow"); if (!row) return;
    const name = row.dataset.name;
    if (e.target.dataset.act === "rename") { const v = e.target.value.trim(); setRosterEdit(name, { rename: v && v !== name ? v : "" }); refreshProw(name); }
    else if (e.target.dataset.act === "merge") { setRosterEdit(name, { mergeInto: e.target.value }); refreshProw(name); }
  });
  box.addEventListener("click", (e) => {
    const row = e.target.closest(".prow"); if (!row) return;
    const name = row.dataset.name;
    if (e.target.dataset.act === "del") { const cur = state.roster[name] || {}; setRosterEdit(name, { del: !cur.del }); refreshProw(name); }
    else if (e.target.dataset.act === "undo") { delete state.roster[name]; save(); refreshProw(name); }
  });
}
function refreshProw(name) {
  const row = document.querySelector(`.prow[data-name="${cssEsc(name)}"]`);
  const p = DATA.roster.find((x) => x.display === name);
  if (row && p) row.outerHTML = prowHTML(p);
}

/* ================= EXPORT TAB ================= */
function buildCorrections() {
  const overrides = [];
  const newPeople = new Set();
  for (const key in state.photos) {
    if (!photoChanged(key)) continue;
    const [section, file] = key.split("/");
    const p = PHOTO_INDEX.get(key);
    const people = currentPeople(key);
    people.forEach((n) => { if (!isKnown(n)) newPeople.add(n); });
    overrides.push({ section, file, people, caption: p.caption, note: (photoNote(key) || "").trim() || undefined });
  }
  const rename = [], merge = [], del = [];
  for (const display in state.roster) {
    const r = state.roster[display];
    if (r.del) del.push(display);
    else { if (r.rename && r.rename !== display) rename.push({ from: display, to: r.rename }); if (r.mergeInto) merge.push({ from: display, into: r.mergeInto }); }
  }
  return {
    generatedAt: new Date().toISOString(),
    overrides,
    roster: { rename, merge, delete: del, add: [...state.add, ...newPeople] },
    notes: state.notes.trim() || undefined,
  };
}

function overridesMarkdown(c) {
  if (!c.overrides.length) return "";
  return "| Section | File | People |\n|---------|------|--------|\n" +
    c.overrides.map((o) => `| ${o.section} | ${o.file} | ${o.people.join("; ")} |`).join("\n");
}

function exportTab() {
  const app = $("#app");
  const c = buildCorrections();
  const json = JSON.stringify(c, null, 2);
  const { pc, rc } = counts();
  app.innerHTML = `
    <div class="exp">
      <p class="summary">
        <b>${pc}</b> photo attribution edit${pc === 1 ? "" : "s"} → override rows<br>
        <b>${c.roster.rename.length}</b> rename${c.roster.rename.length === 1 ? "" : "s"} ·
        <b>${c.roster.merge.length}</b> merge${c.roster.merge.length === 1 ? "" : "s"} ·
        <b>${c.roster.delete.length}</b> removal${c.roster.delete.length === 1 ? "" : "s"} ·
        <b>${c.roster.add.length}</b> new / added name${c.roster.add.length === 1 ? "" : "s"}
      </p>
      <label class="hint" style="display:block;margin-top:1rem">Session notes (anything else you want me to know)</label>
      <textarea id="notes" style="min-height:70px" placeholder="e.g. 'Steven Kent and Rene Kent are brothers'">${esc(state.notes)}</textarea>
      <div class="row">
        <button class="btn" id="copy">Copy corrections</button>
        <button class="btn ghost" id="download">Download file</button>
        <button class="btn danger" id="clear">Clear everything</button>
      </div>
      <p class="hint">Then paste the copied text to me, <b>or</b> click Download (saves <code>stardust-corrections.json</code> to your Downloads) and tell me — I'll read it and update <code>source/people.md</code>.</p>
      <label class="hint" style="display:block;margin-top:1rem">Corrections (JSON)</label>
      <textarea id="jsonout" readonly>${esc(json)}</textarea>
      ${c.overrides.length ? `<label class="hint" style="display:block;margin-top:1rem">Preview: override rows</label><textarea readonly style="min-height:120px">${esc(overridesMarkdown(c))}</textarea>` : ""}
    </div>`;
  $("#notes").oninput = (e) => { state.notes = e.target.value; save(); };
  $("#copy").onclick = async () => {
    try { await navigator.clipboard.writeText(JSON.stringify(buildCorrections(), null, 2)); $("#copy").textContent = "Copied ✓"; setTimeout(() => ($("#copy").textContent = "Copy corrections"), 1500); }
    catch { $("#jsonout").select(); document.execCommand("copy"); }
  };
  $("#download").onclick = () => {
    const blob = new Blob([JSON.stringify(buildCorrections(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "stardust-corrections.json"; a.click();
    URL.revokeObjectURL(a.href);
  };
  $("#clear").onclick = () => {
    if (confirm("Clear all your corrections? This can't be undone.")) { state = blank(); save(); exportTab(); }
  };
}

/* ================= tabs / boot ================= */
const TABS = { photos: photosTab, people: peopleTab, export: exportTab };
function setTab(name) {
  if (!TABS[name]) name = "photos";
  if (location.hash.slice(1) !== name) location.hash = name;
  document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === name));
  TABS[name]();
}

fetch("public/editor-data.json")
  .then((r) => { if (!r.ok) throw new Error("no data"); return r.json(); })
  .then((data) => {
    DATA = data;
    ROSTER = new Set(data.roster.map((p) => p.display.toLowerCase()));
    ROSTER_LIST = data.roster.map((p) => p.display);
    SECTION_LABEL = Object.fromEntries(data.sections.map((s) => [s.kind, s.label]));
    data.photos.forEach((p) => PHOTO_INDEX.set(pkey(p), p));
    $("#roster-names").innerHTML = ROSTER_LIST.map((n) => `<option value="${esc(n)}">`).join("");
    document.querySelectorAll(".tabs button[data-tab]").forEach((b) => (b.onclick = () => setTab(b.dataset.tab)));
    renderBadge();
    setTab(location.hash.slice(1) || "photos");
  })
  .catch(() => {
    $("#app").innerHTML = '<p class="empty-state">Could not load <code>public/editor-data.json</code>. Run <code>npm run editor</code> (and <code>npm run dev</code>), then reload.</p>';
  });
