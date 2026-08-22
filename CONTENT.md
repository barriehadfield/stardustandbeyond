# Stardust & Beyond — Site Content

Human content manifest. Keep in sync with `scripts/site-data.mjs` when content changes.

Imported from `source/Stardust and Beyond/StardustandBeyond.html` (a Google-Docs
export). The six `c4` headings became the tabs; each `<img alt>` became a caption.

## Site meta
- **Name:** Stardust & Beyond
- **Tagline:** A 1970s disco, and the friends who lived it
- **Domain:** stardustandbeyond.com _(live — GitHub Pages custom domain)_
- **Lead image (hero):** `the-stardust/image472` — the club, Durban 1975
- **Logo / favicon:** `public/images/site/logo.jpg` _(to add)_
- **Share card:** render `source/og-card.html` → `public/images/site/og-card.jpg` _(to add)_
- **Navigation:** The Stardust · The Boudoir · Steven · 70's · 80's · 90's

## Social links
- Instagram: _(set `SOCIAL.instagram`)_
- Bluesky: _(set `SOCIAL.bluesky`)_

## Sections

| Tab | Slug / page | Photos | Notes |
|-----|-------------|--------|-------|
| The Stardust | `the-stardust` | 38 | The club, 1975. Leads with `image472` (the club). |
| The Boudoir | `the-boudoir` | 19 | Steven Roche's back-room; "The Onion Ring". Opens with `BOUDOIR_TEXT`. |
| Steven | `steven` | 24 | Steven Roche, aka Margot. |
| 70's | `70s` | 82 | The decade it all began. |
| 80's | `80s` | 198 | |
| 90's | `90s` | 175 | The friends, years on. |

Captions live on each gallery item as `title` in `scripts/site-data.mjs`. Photos with
no caption in the source are shown untitled.

## The Boudoir intro (`BOUDOIR_TEXT`)

> The boudoir was the name given to Steven Roche's bedroom. It was an annex at the
> back of the Roche family home where a group of very close knit friends used to
> congregate and hang out all the time. This group was eventually nicknamed The
> Onion Ring. …
