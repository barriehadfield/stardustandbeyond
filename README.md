# Stardust & Beyond

A static, image-first photographic archive of **The Stardust** — a 1970s Durban
disco — and the friends who lived it, kept across four decades. Served from GitHub
Pages. Plain HTML/CSS/JS, no runtime dependencies. 1970s-disco design: deep-aubergine
night ground, gold + magenta accents, and a swipe / pinch-zoom lightbox.

Content was imported from a Google-Docs export (`source/Stardust and Beyond/`); the
six document sections became the site's tabs and the image alt-text became captions.

## Sections

```
index.html          Home — club hero + section cards
the-stardust.html   The Stardust (the club, 1975)   — 38 photos
the-boudoir.html    The Boudoir (Steven's back-room) — 19 photos + intro
steven.html         Steven (Steven Roche, aka Margot) — 24 photos
70s.html            70's — 82 photos
80s.html            80's — 198 photos
90s.html            90's — 175 photos
```

## Structure

```
css/style.css               Styles (1970s-disco dark theme)
js/site.js                  Mobile nav + swipe/pinch-zoom lightbox (PhotoSwipe, vendored)

scripts/site-data.mjs       Content: SITE, SECTIONS, LEAD, BOUDOIR_TEXT, GALLERIES
scripts/build-pages.mjs     Generates the HTML pages from site-data
scripts/optimize-images.mjs Generates public/ derivatives from source/
scripts/dev-serve.py        No-cache static dev server

public/images/<slug>/       Web-optimized images served to visitors (generated)
source/images/<slug>/       Full-resolution originals (archive)
source/og-card.html         Design source for the 1200x630 social share card
```

## Editing

- **Caption / order / copy:** edit `scripts/site-data.mjs`, then `npm run build`.
- **Add or replace a photo:** drop the original into `source/images/<slug>/`, run
  `npm run optimize`, add it to the matching array in `scripts/site-data.mjs`
  (`{ file: "name", title: "caption" }`), then `npm run build`.

## Commands

```bash
npm install        # once, installs sharp (build-time only)
npm run optimize   # source/images -> public/images (webp + jpg + thumbnails)
npm run build      # regenerate the HTML pages
npm run dev        # preview at http://localhost:8000 (no-cache)
```

## Deploying to GitHub Pages

Serve from the repository root of the default branch (Settings → Pages → Source:
Deploy from a branch → `main` / `/root`). `.nojekyll` is present. Add a `CNAME` file
with your custom domain, set `SITE.url` in `scripts/site-data.mjs` to match, rebuild,
and point DNS at GitHub Pages.
