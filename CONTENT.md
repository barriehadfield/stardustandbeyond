# Stardush — Site Content

Human content manifest. Keep this in sync with `scripts/site-data.mjs` when content
changes. This is a fresh scaffold — fill in the real content below.

## Site meta
- **Name:** Stardush _(placeholder — set `SITE.name`)_
- **Role / tagline:** Painter & Photographer _(placeholder — set `SITE.role`)_
- **Domain:** stardush.com _(placeholder — set `SITE.url` and add a `CNAME`)_
- **Logo / favicon:** `public/images/site/logo.jpg` _(add)_
- **Portrait (About + JSON-LD):** `public/images/site/portrait.jpg` _(add)_
- **Navigation:** Home · Paintings · Photography · Fashion · Interiors · For Sale · About

## Social links
- Instagram: _(set `SOCIAL.instagram`)_
- Bluesky: _(set `SOCIAL.bluesky`)_

## Pages

### Home
Landing: hero + section cards. Hero cover = first item of the first non-empty
section. Cards driven by the `SECTIONS` registry in `build-pages.mjs`.

### Paintings
Gallery. Originals in `source/images/paintings/`. _(empty)_

### Photography
Gallery. Originals in `source/images/photography/`. _(empty)_

### Fashion
Article-led gallery — first item is the editorial lead. Originals in
`source/images/fashion/`. _(empty)_

### Interiors
Gallery. Originals in `source/images/interiors/`. _(empty)_

### For Sale
Works available to purchase, each with `title`, `meta`, `price`, `sold`. _(empty)_

### About
Biography paragraphs in `ABOUT_PARAS` + portrait. _(empty)_
