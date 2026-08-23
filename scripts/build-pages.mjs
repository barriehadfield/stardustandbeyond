#!/usr/bin/env node
/**
 * Page generator for the Stardust & Beyond site - a 1970s disco photo archive.
 *
 * Writes the pages at the repo root (index + one page per section) from the
 * shared content in site-data.mjs. Output is plain static HTML served directly
 * by GitHub Pages. Regenerate with: npm run build
 */
import { writeFile, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { SITE, SOCIAL, LEAD, SECTIONS, STARDUST_TEXT, BOUDOIR_TEXT, GALLERIES } from "./site-data.mjs";

// Intro prose shown above a section's gallery, keyed by section slug.
const SECTION_TEXT = { "the-stardust": STARDUST_TEXT, "the-boudoir": BOUDOIR_TEXT };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = ROOT;
const SITE_URL = SITE.url;

// content-hashed asset versions so browsers always fetch fresh css/js on change.
const ASSET = { css: "1", js: "1" };
async function assetVersion(rel) {
  try { return createHash("sha1").update(await readFile(join(ROOT, rel))).digest("hex").slice(0, 8); }
  catch { return "1"; }
}

const NAV = SECTIONS.map((s) => ({ href: s.href, label: s.label }));

/* ---------- helpers ---------- */
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function dims(kind, file) {
  const m = await sharp(join(ROOT, "public", "images", kind, `${file}-thumb.jpg`)).metadata();
  return { w: m.width, h: m.height };
}
async function fullDims(kind, file) {
  const m = await sharp(join(ROOT, "public", "images", kind, `${file}.jpg`)).metadata();
  return { w: m.width, h: m.height };
}

async function tile(kind, item, eager) {
  const { w, h } = await dims(kind, item.file);
  const f = await fullDims(kind, item.file);
  const base = `public/images/${kind}/${item.file}`;
  const title = item.title || "";
  const alt = title ? esc(title) : `Photograph from ${SITE.name}`;
  const dataTitle = title ? ` data-title="${esc(title)}"` : "";
  const cap = title ? `\n      <span class="cap">${esc(title)}</span>` : "";
  const load = eager ? "eager" : "lazy";
  return `    <a class="tile" href="${base}.jpg" data-pswp-width="${f.w}" data-pswp-height="${f.h}"${dataTitle}>
      <picture>
        <source srcset="${base}-thumb.webp" type="image/webp">
        <img src="${base}-thumb.jpg" alt="${alt}" loading="${load}" width="${w}" height="${h}">
      </picture>${cap}
    </a>`;
}

async function gallery(kind, items) {
  const tiles = await Promise.all(items.map((it, i) => tile(kind, it, i < 6)));
  return `  <div class="grid">\n${tiles.join("\n")}\n  </div>`;
}

async function roomCard(kind, file, label, count, href, blurb) {
  const { w, h } = await dims(kind, file);
  const base = `public/images/${kind}/${file}`;
  return `      <a class="room" href="${href}">
        <picture>
          <source srcset="${base}-thumb.webp" type="image/webp">
          <img src="${base}-thumb.jpg" alt="${esc(label)}" loading="lazy" width="${w}" height="${h}">
        </picture>
        <span class="cap"><span class="t">${esc(label)}</span><span class="b">${esc(blurb)}</span><span class="n">${count}</span></span>
      </a>`;
}

const DEFAULT_DESC = "Stardust & Beyond - a photographic archive of The Stardust disco and the friends who lived it, from 1970s Durban and Johannesburg onward.";
const DEFAULT_OG_IMAGE = "public/images/site/og-card.jpg";

function totalPhotos(kind) {
  return GALLERIES[kind].length + (kind === LEAD.kind ? 1 : 0);
}

function layout({ title, active, main, home, desc, image }) {
  const links = NAV.map((n) => {
    const cur = n.href === active ? ' aria-current="page"' : "";
    return `<a href="${n.href}"${cur}>${esc(n.label)}</a>`;
  }).join("\n        ");
  const pageTitle = home ? `${SITE.name}` : `${title} · ${SITE.name}`;
  const description = desc || DEFAULT_DESC;
  const canonical = `${SITE_URL}/${active === "index.html" ? "" : active}`;
  const ogImage = `${SITE_URL}/${image || DEFAULT_OG_IMAGE}`;

  const jsonLd = home
    ? `\n  <script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`,
        name: SITE.name, description: DEFAULT_DESC, inLanguage: "en",
        sameAs: Object.values(SOCIAL).filter(Boolean),
      })}</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#140a1e">
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:type" content="${home ? "website" : "article"}">
  <meta property="og:site_name" content="${esc(SITE.name)}">
  <meta property="og:title" content="${esc(pageTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(pageTitle)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(ogImage)}">
  <link rel="icon" href="public/images/site/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="public/images/site/icon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="public/images/site/icon-180.png">
  <link rel="stylesheet" href="js/vendor/photoswipe/photoswipe.css">
  <link rel="stylesheet" href="css/style.css?v=${ASSET.css}">${jsonLd}
</head>
<body>
  <header class="hdr">
    <div class="hdr-inner">
      <a class="mark" href="index.html">Stardust<b> &amp; </b>Beyond</a>
      <nav class="nav" aria-label="Primary">
        ${links}
      </nav>
      <div class="hdr-tools">
        <button class="menu-btn" aria-label="Menu" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></svg>
        </button>
      </div>
    </div>
  </header>

  <main class="wrap">
${main}
  </main>

  <footer class="ftr">
    <div class="ftr-inner">
      <a class="mark" href="index.html">Stardust<b> &amp; </b>Beyond</a>
      <div class="social">
        ${SOCIAL.instagram ? `<a href="${SOCIAL.instagram}" target="_blank" rel="noopener">Instagram</a>` : ""}
        ${SOCIAL.bluesky ? `<a href="${SOCIAL.bluesky}" target="_blank" rel="noopener">Bluesky</a>` : ""}
      </div>
      <div class="cr">© 2026 ${esc(SITE.name)} · ${esc(SITE.role)}</div>
    </div>
  </footer>

  <script type="module" src="js/site.js?v=${ASSET.js}"></script>
</body>
</html>
`;
}

/* ---------- pages ---------- */
async function buildHome() {
  const d = await dims(LEAD.kind, LEAD.file);
  const leadBase = `public/images/${LEAD.kind}/${LEAD.file}`;
  const rooms = await Promise.all(
    SECTIONS.map((s) => {
      const cover = s.kind === LEAD.kind ? LEAD.file : (GALLERIES[s.kind][0] || {}).file;
      return roomCard(s.kind, cover, s.label, `${totalPhotos(s.kind)} ${s.unit}`, s.href, s.blurb);
    })
  );
  const main = `    <section class="hero reveal">
      <div class="hero-copy">
        <p class="eyebrow">Durban · 1975</p>
        <h1>Stardust<span class="amp"> &amp; </span>Beyond<span class="last">.</span></h1>
        <p class="tag">Durban's only gay club, found down a dark alleyway in 1975. A new and often shocking world, and the friendships that changed everything.</p>
      </div>
      <figure class="hero-fig">
        <picture>
          <source srcset="${leadBase}.webp" type="image/webp">
          <img src="${leadBase}.jpg" alt="The Stardust club, 1975" width="${d.w}" height="${d.h}" fetchpriority="high">
        </picture>
        <figcaption>The Stardust, 1975</figcaption>
      </figure>
    </section>

    <section class="rooms reveal">
      <h2 class="label">The archive</h2>
      <div class="room-grid">
${rooms.join("\n")}
      </div>
    </section>`;
  return layout({ title: "Home", active: "index.html", main, home: true, image: `${leadBase}.jpg` });
}

async function buildSection(sec) {
  const items = GALLERIES[sec.kind];
  const isLead = sec.kind === LEAD.kind;

  let hero = "";
  if (isLead) {
    const { w, h } = await dims(LEAD.kind, LEAD.file);
    const lf = await fullDims(LEAD.kind, LEAD.file);
    const b = `public/images/${LEAD.kind}/${LEAD.file}`;
    hero = `    <figure class="lead reveal">
      <a class="tile" href="${b}.jpg" data-pswp-width="${lf.w}" data-pswp-height="${lf.h}" data-title="The Stardust, 1975">
        <picture>
          <source srcset="${b}.webp" type="image/webp">
          <img src="${b}.jpg" alt="The Stardust club, 1975" width="${w}" height="${h}">
        </picture>
      </a>
      <figcaption>The Stardust - Durban, 1975</figcaption>
    </figure>
`;
  }

  const paras = SECTION_TEXT[sec.kind];
  const intro = paras && paras.length
    ? `    <div class="prose reveal">\n${paras.map((p) => `      <p>${esc(p)}</p>`).join("\n")}\n    </div>\n`
    : "";

  const g = await gallery(sec.kind, items);
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">The archive</p>
        <h1>${esc(sec.label)}</h1>
        <p class="sub">${esc(sec.blurb)}</p>
      </div>
      <span class="count">${totalPhotos(sec.kind)} ${sec.unit}</span>
    </div>
${intro}${hero}${g}`;

  const cover = isLead ? LEAD.file : (items[0] || {}).file;
  return layout({
    title: sec.label, active: sec.href, main,
    desc: `${sec.label} - ${sec.blurb} From the Stardust & Beyond archive.`,
    image: cover ? `public/images/${sec.kind}/${cover}.jpg` : undefined,
  });
}

async function run() {
  ASSET.css = await assetVersion("css/style.css");
  ASSET.js = await assetVersion("js/site.js");

  const pages = [["index.html", await buildHome()]];
  for (const sec of SECTIONS) pages.push([sec.href, await buildSection(sec)]);

  for (const [name, html] of pages) {
    await writeFile(join(OUT, name), html, "utf-8");
    console.log(`  wrote ${name}`);
  }

  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages.map(([name]) => `${SITE_URL}/${name === "index.html" ? "" : name}`);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;
  await writeFile(join(OUT, "sitemap.xml"), sitemap, "utf-8");
  console.log("  wrote sitemap.xml");

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  await writeFile(join(OUT, "robots.txt"), robots, "utf-8");
  console.log("  wrote robots.txt");

  console.log(`\nDone. Built ${pages.length} pages.`);
}

run().catch((err) => { console.error(err); process.exit(1); });
