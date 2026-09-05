#!/usr/bin/env python3
"""Import the Stardust & Beyond content from a Google-Docs .docx export.

A .docx is a zip; this reads word/document.xml (+ its relationships) and the
embedded images in word/media/, and rebuilds the site's content:

  - The seven `sz=52` headings are the sections/tabs (in document order).
  - Each image's alt-text (docPr `descr`) becomes its caption.
  - The first uncaptioned image under "The Stardust" is the club LEAD.
  - A photo may appear in more than one tab; an exact repeat within the SAME
    tab is skipped (it would look like a bug in one gallery).

It copies each image into source/images/<slug>/ and regenerates
scripts/site-data.mjs. STARDUST_TEXT / BOUDOIR_TEXT narrative blocks are
preserved from the existing site-data.mjs (they are hand-written, not in the doc).

Usage:
  python3 scripts/import-docx.py "source/Stardust and Beyond.docx"          # dry-run report
  python3 scripts/import-docx.py "source/Stardust and Beyond.docx" --apply  # write changes

After --apply:  npm run optimize  &&  npm run build
"""
import re, os, sys, html, shutil, json, zipfile, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECTIONS = [                      # display name -> slug ; order = nav/site order
    ("The Stardust", "the-stardust"),
    ("The Boudoir",  "the-boudoir"),
    ("Steven",       "steven"),
    ("70’s",    "70s"),
    ("80’s",    "80s"),
    ("90’s",    "90s"),
    ("2000’s",  "2000"),
]
# Heading matching ignores apostrophe style ("2000's" vs "2000’s") and case, so a
# re-styled heading in a later export still maps to the right tab.
def norm_head(s):
    return s.replace("’", "").replace("'", "").strip().lower()
NORM2SLUG = {norm_head(n): s for n, s in SECTIONS}
# Display label per slug when it should differ from the docx heading text.
LABELS = {"2000": "2000s"}
VARMAP = [("the-stardust", "THE_STARDUST"), ("the-boudoir", "THE_BOUDOIR"),
          ("steven", "STEVEN"), ("70s", "SEVENTIES"), ("80s", "EIGHTIES"),
          ("90s", "NINETIES"), ("2000", "TWOTHOUSANDS")]
BLURB = {
    "the-stardust": "The club, 1975.",
    "the-boudoir": "Steven's bedroom, and The Onion Ring.",
    "steven": "Steven Roche, aka Margot.",
    "70s": "The decade it all began.",
    "80s": "Bigger, brighter, bolder.",
    "90s": "The friends, years on.",
    "2000": "Into the new century.",
}


# Caption fixups applied on every import (the source doc spells some names
# inconsistently). Whole-word, case-sensitive.
NAME_FIXES = {"Aydee": "Adi", "Adee": "Adi"}


def clean(t):
    t = html.unescape(t).replace("\xa0", " ")
    t = re.sub(r"\s+", " ", t).strip()
    t = t.replace("—", "-").replace("–", "-")   # no em/en dashes (house style)
    for wrong, right in NAME_FIXES.items():
        t = re.sub(rf"\b{re.escape(wrong)}\b", right, t)
    return t.strip(" -")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    apply = "--apply" in sys.argv
    if not args:
        sys.exit("usage: import-docx.py <file.docx> [--apply]")
    docx = args[0] if os.path.isabs(args[0]) else os.path.join(ROOT, args[0])
    if not os.path.isfile(docx):
        sys.exit(f"not found: {docx}")

    tmp = tempfile.mkdtemp(prefix="stardust-docx-")
    with zipfile.ZipFile(docx) as z:
        z.extractall(tmp)
    word = os.path.join(tmp, "word")
    xml = open(os.path.join(word, "document.xml"), encoding="utf-8").read()
    rels = open(os.path.join(word, "_rels", "document.xml.rels"), encoding="utf-8").read()
    rid2media = {m.group(1): m.group(2) for m in
                 re.finditer(r'<Relationship Id="([^"]+)"[^>]*Target="media/([^"]+)"', rels)}

    # section boundaries: <w:t> equal to a section name, preceded by sz=52
    heads, seen_h = [], set()
    for m in re.finditer(r'<w:t[^>]*>([^<]*)</w:t>', xml):
        key = norm_head(html.unescape(m.group(1)))
        if key in NORM2SLUG and '<w:sz w:val="52"/>' in xml[max(0, m.start() - 240):m.start()]:
            if key not in seen_h:
                seen_h.add(key)
                heads.append((m.start(), NORM2SLUG[key]))   # store slug directly
    heads.sort()

    def section_at(pos):
        cur = None
        for bpos, slug in heads:
            if bpos <= pos:
                cur = slug
            else:
                break
        return cur

    buckets = {s: [] for _, s in SECTIONS}
    seen_ms, dups = set(), []
    for m in re.finditer(r'<wp:docPr\b([^>]*)/>.*?<a:blip r:embed="([^"]+)"', xml, re.S):
        attrs, rid = m.group(1), m.group(2)
        media = rid2media.get(rid)
        sec = section_at(m.start())
        if not media or not sec:
            continue
        descr = re.search(r'descr="([^"]*)"', attrs)
        name = re.search(r'name="([^"]*)"', attrs)
        cap = clean(descr.group(1)) if descr else ""
        if (sec, media) in seen_ms:           # dedupe within the same tab only
            dups.append((sec, media, cap))
            continue
        seen_ms.add((sec, media))
        base = os.path.splitext(name.group(1))[0] if name else os.path.splitext(media)[0]
        ext = os.path.splitext(media)[1].lower()
        existing = {b["base"] for b in buckets[sec]}
        ob, k = base, 2
        while ob in existing:
            ob, k = f"{base}-{k}", k + 1
        buckets[sec].append({"base": ob, "ext": ext, "cap": cap, "media": media})

    stardust = buckets["the-stardust"]
    lead = next((it for it in stardust if not it["cap"]), stardust[0] if stardust else None)

    # ---- report ----
    print(f"docx: {docx}")
    print(f"media in doc: {len(rid2media)}   tabs: {[s for _, s in heads]}")
    print(f"lead: {lead['base']}{lead['ext']} (media {lead['media']})")
    total = 0
    for name, slug in SECTIONS:
        items = buckets[slug]
        total += len(items)
        capped = sum(1 for it in items if it["cap"])
        note = " (incl. lead)" if slug == "the-stardust" else ""
        print(f"  {slug:14} {len(items):3} imgs, {capped:3} captioned{note}")
    print(f"TOTAL placed: {total}   same-tab duplicates skipped: {len(dups)}")

    if not apply:
        print("\nDRY RUN. Re-run with --apply to copy images and write site-data.mjs.")
        shutil.rmtree(tmp, ignore_errors=True)
        return

    # ---- apply: repopulate content image dirs (keep 'site'), clear stale public ----
    for _, slug in SECTIONS:
        for base in (os.path.join(ROOT, "source", "images", slug),
                     os.path.join(ROOT, "public", "images", slug)):
            shutil.rmtree(base, ignore_errors=True)
        os.makedirs(os.path.join(ROOT, "source", "images", slug), exist_ok=True)

    copied = 0
    for _, slug in SECTIONS:
        for it in buckets[slug]:
            shutil.copy2(os.path.join(word, "media", it["media"]),
                         os.path.join(ROOT, "source", "images", slug, it["base"] + it["ext"]))
            copied += 1
    print(f"copied {copied} images into source/images/")

    # preserve hand-written narrative blocks from the current site-data
    cur_path = os.path.join(ROOT, "scripts", "site-data.mjs")
    cur = open(cur_path, encoding="utf-8").read() if os.path.exists(cur_path) else ""

    def grab(const, default="[]"):
        m = re.search(rf'export const {const} = (\[.*?\]);', cur, re.S)
        return m.group(1) if m else default

    def js_items(items, skip=None):
        out = []
        for it in items:
            if skip and it["base"] == skip:
                continue
            if it["cap"]:
                out.append(f'  {{ file: {json.dumps(it["base"])}, title: {json.dumps(it["cap"], ensure_ascii=False)} }},')
            else:
                out.append(f'  {{ file: {json.dumps(it["base"])} }},')
        return "\n".join(out)

    sec_js = ",\n".join(
        f'  {{ kind: "{slug}", label: {json.dumps(LABELS.get(slug, name), ensure_ascii=False)}, href: "{slug}.html", unit: "photos", blurb: {json.dumps(BLURB[slug], ensure_ascii=False)} }}'
        for name, slug in SECTIONS)
    arrays = "\n\n".join(
        f'export const {var} = [\n{js_items(buckets[slug], skip=(lead["base"] if slug=="the-stardust" else None))}\n];'
        for slug, var in VARMAP)
    gal_js = ",\n".join(f'  "{slug}": {var}' for slug, var in VARMAP)

    out = f'''/**
 * Content for the Stardust & Beyond site - a 1970s disco photo archive.
 * Generated from the .docx export by scripts/import-docx.py.
 * Each gallery item is {{ file, title? }} - `title` is the photo caption.
 * Array order = display order.
 */

export const SITE = {{
  name: "Stardust & Beyond",
  role: "A 1970s disco, and the friends who lived it",
  url: "https://stardustandbeyond.com",
}};

export const SOCIAL = {{
  instagram: "",
  bluesky: "",
  whatsapp: "https://chat.whatsapp.com/FGV5V4qmuPYJjy2lxdZZcV?s=sw&p=a&mlu=4",
}};

// The club photo that leads the site (first uncaptioned image in The Stardust).
export const LEAD = {{ kind: "the-stardust", file: {json.dumps(lead["base"])} }};

// Section registry - drives the nav, the home "rooms" grid, and page builders.
export const SECTIONS = [
{sec_js},
];

export const STARDUST_TEXT = {grab("STARDUST_TEXT")};

export const BOUDOIR_TEXT = {grab("BOUDOIR_TEXT")};

{arrays}

export const GALLERIES = {{
{gal_js},
}};
'''
    open(cur_path, "w", encoding="utf-8").write(out)
    print("wrote scripts/site-data.mjs")
    print("\nNext:  npm run optimize  &&  npm run build")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
