/**
 * Shared content data for the Stardush site — the single source of truth for
 * all page copy, galleries, prices and links. Consumed by scripts/build-pages.mjs.
 *
 * Each gallery item is { file, title? }. `title` is optional — an item without
 * one is an untitled work (no caption / generic alt). Array order = display order.
 *
 * This is a fresh scaffold: the arrays are empty. Drop originals into
 * source/images/<section>/, run `npm run optimize`, then list them here (by
 * filename without extension) and run `npm run build`.
 */

export const SITE = {
  name: "Stardush",              // display name / wordmark
  role: "Painter & Photographer", // tagline shown in the browser title + hero eyebrow
  url: "https://stardush.com",    // live custom domain (no trailing slash) — used for canonical + OG + sitemap
};

export const SOCIAL = {
  instagram: "",
  bluesky: "",
};

export const PAINTINGS = [
  // { file: "example-work", title: "Example Work" },
];

export const PHOTOGRAPHY = [
  // { file: "example-photo", title: "Example Photo" },
];

export const FASHION = [
  // { file: "fashion-01" },
];

export const INTERIORS = [
  // { file: "example-room", title: "Example Room" },
];

export const ABOUT_PARAS = [
  // "First paragraph of the about / biography copy.",
];

export const FOR_SALE = [
  // {
  //   file: "example-work",
  //   title: "Example Work",
  //   meta: "Oil on linen canvas · 50 × 60 cm",
  //   price: "£2,000",
  //   sold: false,
  // },
];
