#!/usr/bin/env node
/**
 * Page generator for the Stardush site (image-first dark design).
 *
 * Writes the pages at the repo root (index, paintings, photography, fashion,
 * interiors, for-sale, about) from the shared content in site-data.mjs. Output
 * is plain static HTML served directly by GitHub Pages.
 *
 * Written to be robust to empty data: on a fresh scaffold (no images / empty
 * arrays) it still builds every page — galleries come out empty and the home
 * hero falls back to a copy-only layout. Fill in site-data.mjs to populate.
 *
 * Regenerate with: npm run build
 */
import { writeFile, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { SITE, SOCIAL, PAINTINGS, PHOTOGRAPHY, FASHION, INTERIORS, ABOUT_PARAS, FOR_SALE } from "./site-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = ROOT;

// Live custom domain (GitHub Pages). Used for canonical + absolute OG/Twitter
// image URLs and the sitemap. No trailing slash. Set in site-data.mjs (SITE.url).
const SITE_URL = SITE.url;

// content-hashed asset versions so browsers/CDN always fetch fresh css/js when
// they change (filenames stay stable, so without this old copies get cached).
const ASSET = { css: "1", js: "1" };
async function assetVersion(rel) {
  try { return createHash("sha1").update(await readFile(join(ROOT, rel))).digest("hex").slice(0, 8); }
  catch { return "1"; }
}

const NAV = [
  { href: "paintings.html", label: "Paintings" },
  { href: "photography.html", label: "Photography" },
  { href: "fashion.html", label: "Fashion" },
  { href: "interiors.html", label: "Interiors" },
  { href: "for-sale.html", label: "For Sale" },
  { href: "about.html", label: "About" },
];

/* ---------- helpers ---------- */
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function dims(kind, file) {
  const m = await sharp(join(ROOT, "public", "images", kind, `${file}-thumb.jpg`)).metadata();
  return { w: m.width, h: m.height };
}

// full-size image dimensions — PhotoSwipe needs these to size the zoom correctly
async function fullDims(kind, file) {
  const m = await sharp(join(ROOT, "public", "images", kind, `${file}.jpg`)).metadata();
  return { w: m.width, h: m.height };
}

async function tile(kind, item, altKind, eager) {
  const { w, h } = await dims(kind, item.file);
  const f = await fullDims(kind, item.file);
  const base = `public/images/${kind}/${item.file}`;
  const title = item.title || "";
  const alt = title ? `${title}, ${altKind} by ${SITE.name}` : `${altKind} by ${SITE.name}`;
  const dataTitle = title ? ` data-title="${esc(title)}"` : "";
  const cap = title ? `\n      <span class="cap">${esc(title)}</span>` : "";
  const load = eager ? "eager" : "lazy";
  return `    <a class="tile" href="${base}.jpg" data-pswp-width="${f.w}" data-pswp-height="${f.h}"${dataTitle}>
      <picture>
        <source srcset="${base}-thumb.webp" type="image/webp">
        <img src="${base}-thumb.jpg" alt="${esc(alt)}" loading="${load}" width="${w}" height="${h}">
      </picture>${cap}
    </a>`;
}

async function gallery(kind, items, altKind) {
  const tiles = await Promise.all(items.map((it, i) => tile(kind, it, altKind, i < 4)));
  return `  <div class="grid">\n${tiles.join("\n")}\n  </div>`;
}

async function roomCard(kind, file, label, count, href) {
  const { w, h } = await dims(kind, file);
  const base = `public/images/${kind}/${file}`;
  return `      <a class="room" href="${href}">
        <picture>
          <source srcset="${base}-thumb.webp" type="image/webp">
          <img src="${base}-thumb.jpg" alt="${esc(label)}" loading="lazy" width="${w}" height="${h}">
        </picture>
        <span class="cap"><span class="t">${esc(label)}</span><span class="n">${count}</span></span>
      </a>`;
}

const DEFAULT_DESC = `${SITE.name} — ${SITE.role}. An image-first portfolio of paintings, photography, fashion and interiors.`;
// Dedicated 1200x630 branded share card (source: source/og-card.html). Used for
// the home page and any page without its own representative image.
const DEFAULT_OG_IMAGE = "public/images/site/og-card.jpg";

function layout({ title, active, main, home, desc, image }) {
  const links = NAV.map((n) => {
    const cur = n.href === active ? ' aria-current="page"' : "";
    const cls = n.cls ? ` class="${n.cls}"` : "";
    return `<a href="${n.href}"${cls}${cur}>${n.label}</a>`;
  }).join("\n        ");
  const pageTitle = home ? `${SITE.name} · ${SITE.role}` : `${title} · ${SITE.name}`;
  const description = desc || DEFAULT_DESC;
  const canonical = `${SITE_URL}/${active === "index.html" ? "" : active}`;
  const ogImage = `${SITE_URL}/${image || DEFAULT_OG_IMAGE}`;

  // WebSite + Person entity graph, on the home page only (one canonical source).
  const jsonLd = home
    ? `\n  <script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE.name, description: DEFAULT_DESC, inLanguage: "en" },
          { "@type": "Person", "@id": `${SITE_URL}/#person`, name: SITE.name, url: `${SITE_URL}/`, jobTitle: SITE.role, image: `${SITE_URL}/public/images/site/portrait.jpg`, sameAs: Object.values(SOCIAL).filter(Boolean) },
        ],
      })}</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#191a1d">
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
  <link rel="icon" href="public/images/site/logo.jpg">
  <link rel="apple-touch-icon" href="public/images/site/logo.jpg">
  <link rel="stylesheet" href="js/vendor/photoswipe/photoswipe.css">
  <link rel="stylesheet" href="css/style.css?v=${ASSET.css}">${jsonLd}
</head>
<body>
  <header class="hdr">
    <div class="hdr-inner">
      <a class="mark" href="index.html">${esc(SITE.name)}<b>.</b></a>
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
      <a class="mark" href="index.html">${esc(SITE.name)}<b>.</b></a>
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
// Section registry — drives the home "rooms" grid. Each cover is the first item
// of the matching array, so populating site-data.mjs populates the home page too.
const SECTIONS = [
  { kind: "paintings", items: PAINTINGS, label: "Paintings", href: "paintings.html", unit: "works" },
  { kind: "photography", items: PHOTOGRAPHY, label: "Photography", href: "photography.html", unit: "works" },
  { kind: "fashion", items: FASHION, label: "Fashion", href: "fashion.html", unit: "images" },
  { kind: "interiors", items: INTERIORS, label: "Interiors", href: "interiors.html", unit: "rooms" },
];

async function buildHome() {
  const hero = SECTIONS.map((s) => ({ ...s, cover: s.items[0] })).find((s) => s.cover);
  const rooms = await Promise.all(
    SECTIONS.filter((s) => s.items.length).map((s) =>
      roomCard(s.kind, s.items[0].file, s.label, `${s.items.length} ${s.unit}`, s.href)
    )
  );

  let heroFig = "";
  if (hero) {
    const d = await dims(hero.kind, hero.cover.file);
    const base = `public/images/${hero.kind}/${hero.cover.file}`;
    const cap = hero.cover.title ? `\n        <figcaption>${esc(hero.cover.title)}</figcaption>` : "";
    heroFig = `
      <figure class="hero-fig">
        <picture>
          <source srcset="${base}.webp" type="image/webp">
          <img src="${base}.jpg" alt="${esc(hero.cover.title || SITE.name)}" width="${d.w}" height="${d.h}" fetchpriority="high">
        </picture>${cap}
      </figure>`;
  }

  const [first, ...rest] = SITE.name.split(" ");
  const heading = rest.length ? `${esc(first)}<br>${esc(rest.join(" "))}` : esc(SITE.name);

  const main = `    <section class="hero reveal">
      <div class="hero-copy">
        <p class="eyebrow">${esc(SITE.role)}</p>
        <h1>${heading}<span class="last">.</span></h1>
        <p class="tag">An image-first portfolio. One body of work, made over a lifetime of looking.</p>
        <div class="hero-cta">
          <a class="btn primary" href="paintings.html">View the work</a>
          <a class="btn ghost" href="about.html">About</a>
        </div>
      </div>${heroFig}
    </section>${rooms.length ? `

    <section class="rooms reveal">
      <h2 class="label">Explore the work</h2>
      <div class="room-grid">
${rooms.join("\n")}
      </div>
    </section>` : ""}`;
  return layout({ title: "Home", active: "index.html", main, home: true });
}

async function buildPaintings() {
  const g = await gallery("paintings", PAINTINGS, "painting");
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">Oil on canvas</p>
        <h1>Paintings</h1>
        <p class="sub">Portraits, still life and abstracts.</p>
      </div>
      <span class="count">${PAINTINGS.length} works</span>
    </div>
${g}`;
  return layout({
    title: "Paintings", active: "paintings.html", main,
    desc: `Original oil paintings by ${SITE.name} — portraits, still life and abstracts.`,
    image: PAINTINGS[0] ? `public/images/paintings/${PAINTINGS[0].file}.jpg` : undefined,
  });
}

async function buildPhotography() {
  const g = await gallery("photography", PHOTOGRAPHY, "photograph");
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">Photography</p>
        <h1>Photography</h1>
        <p class="sub">Travel and landscape work.</p>
      </div>
      <span class="count">${PHOTOGRAPHY.length} works</span>
    </div>
${g}`;
  return layout({
    title: "Photography", active: "photography.html", main,
    desc: `Travel and landscape photography by ${SITE.name}.`,
    image: PHOTOGRAPHY[0] ? `public/images/photography/${PHOTOGRAPHY[0].file}.jpg` : undefined,
  });
}

async function buildFashion() {
  const lead = FASHION[0];
  let hero = "";
  if (lead) {
    const { w, h } = await dims("fashion", lead.file);
    const lf = await fullDims("fashion", lead.file);
    const leadBase = `public/images/fashion/${lead.file}`;
    const leadTitle = lead.title || `${SITE.name}, feature`;
    hero = `    <figure class="fashion-lead reveal">
      <p class="tag">Feature</p>
      <a class="tile" href="${leadBase}.jpg" data-pswp-width="${lf.w}" data-pswp-height="${lf.h}" data-title="${esc(leadTitle)}">
        <picture>
          <source srcset="${leadBase}.webp" type="image/webp">
          <img src="${leadBase}.jpg" alt="${esc(leadTitle)}" width="${w}" height="${h}">
        </picture>
      </a>
    </figure>
`;
  }
  const g = await gallery("fashion", FASHION.slice(1), "fashion image");
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">Feature</p>
        <h1>Fashion</h1>
        <p class="sub">A selection of menswear and womenswear.</p>
      </div>
      <span class="count">${FASHION.length} images</span>
    </div>
${hero}${g}`;
  return layout({
    title: "Fashion", active: "fashion.html", main,
    desc: `The ${SITE.name} fashion archive — a selection of menswear and womenswear.`,
    image: FASHION[0] ? `public/images/fashion/${FASHION[0].file}.jpg` : undefined,
  });
}

async function buildInteriors() {
  const g = await gallery("interiors", INTERIORS, "interior");
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">Interiors</p>
        <h1>Interiors</h1>
        <p class="sub">Interior schemes and styling.</p>
      </div>
      <span class="count">${INTERIORS.length} rooms</span>
    </div>
${g}`;
  return layout({
    title: "Interiors", active: "interiors.html", main,
    desc: `Interior schemes and styling by ${SITE.name}.`,
    image: INTERIORS[0] ? `public/images/interiors/${INTERIORS[0].file}.jpg` : undefined,
  });
}

async function buildForSale() {
  const works = [];
  for (const w of FOR_SALE) {
    const { w: iw, h: ih } = await dims("paintings", w.file);
    const wf = await fullDims("paintings", w.file);
    const base = `public/images/paintings/${w.file}`;
    const badge = w.sold ? '<span class="badge">Sold</span>' : "";
    const price = w.sold ? `<p class="price"><s>${w.price}</s></p>` : `<p class="price">${w.price}</p>`;
    const enquireHref = SOCIAL.instagram || "about.html";
    works.push(`      <article class="work">
        <a class="tile" href="${base}.jpg" data-pswp-width="${wf.w}" data-pswp-height="${wf.h}" data-title="${esc(w.title)}">
          <picture>
            <source srcset="${base}-thumb.webp" type="image/webp">
            <img src="${base}-thumb.jpg" alt="${esc(w.title)}, painting by ${SITE.name}" loading="lazy" width="${iw}" height="${ih}">
          </picture>
        </a>
        <div>
          <h2>${esc(w.title)}${badge}</h2>
          <p class="meta">${esc(w.meta)}</p>
          ${price}
          ${w.sold ? "" : `<p class="enquire">To purchase, <a href="${enquireHref}" target="_blank" rel="noopener">enquire</a>.</p>`}
        </div>
      </article>`);
  }
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">Original works</p>
        <h1>For Sale</h1>
        <p class="sub">Original works available to purchase.</p>
      </div>
      <span class="count">${FOR_SALE.length} works</span>
    </div>
    <div class="works">
${works.join("\n")}
    </div>`;
  return layout({
    title: "For Sale", active: "for-sale.html", main,
    desc: `Original works by ${SITE.name} available to purchase.`,
    image: FOR_SALE[0] ? `public/images/paintings/${FOR_SALE[0].file}.jpg` : undefined,
  });
}

async function buildAbout() {
  const paras = ABOUT_PARAS.map((p) => `        <p>${esc(p)}</p>`).join("\n");
  const main = `    <div class="page-intro reveal">
      <div>
        <p class="eyebrow">About</p>
        <h1>About</h1>
      </div>
    </div>
    <div class="about reveal">
      <img src="public/images/site/portrait.jpg" alt="Portrait of ${esc(SITE.name)}" width="600" loading="lazy">
      <div class="prose">
${paras}
      </div>
    </div>`;
  return layout({
    title: "About", active: "about.html", main,
    desc: `About ${SITE.name} and the influences behind the work.`,
    image: "public/images/site/portrait.jpg",
  });
}

async function run() {
  ASSET.css = await assetVersion("css/style.css");
  ASSET.js = await assetVersion("js/site.js");
  const pages = [
    ["index.html", await buildHome()],
    ["paintings.html", await buildPaintings()],
    ["photography.html", await buildPhotography()],
    ["fashion.html", await buildFashion()],
    ["interiors.html", await buildInteriors()],
    ["for-sale.html", await buildForSale()],
    ["about.html", await buildAbout()],
  ];
  for (const [name, html] of pages) {
    await writeFile(join(OUT, name), html, "utf-8");
    console.log(`  wrote ${name}`);
  }

  // sitemap.xml — every real page.
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages.map(([name]) => `${SITE_URL}/${name === "index.html" ? "" : name}`);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;
  await writeFile(join(OUT, "sitemap.xml"), sitemap, "utf-8");
  console.log("  wrote sitemap.xml");

  // robots.txt — allow everything, point crawlers at the sitemap.
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  await writeFile(join(OUT, "robots.txt"), robots, "utf-8");
  console.log("  wrote robots.txt");

  console.log(`\nDone. Built ${pages.length} pages.`);
}

run().catch((err) => { console.error(err); process.exit(1); });
