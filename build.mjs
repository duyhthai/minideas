// Builds the static site into dist/:
//   index.html                       picks a language (saved choice, then browser language)
//   <lang>/index.html                home: tiles for collections and standalone ideas, then book reviews
//   <lang>/<collection>/index.html   a collection: one tile per idea
//   <lang>/<slug>/index.html         one idea or one book review, as a swipeable card stack
//   <lang>/<slug>/full/index.html    a book's full review as an article
//   Paths are the same in every language; only the /<lang>/ prefix changes.
//   og/<lang>/<name>.png             one link preview per page (home, collection, idea, book)
//   photos/<book>/<file>             a book reviewer's own photos, copied from src/books/photos/
//   <lang>/follow/index.html         how to follow new card stacks (the home page links here, not to the raw feed)
//   <lang>/feed.xml                  RSS: everything on the shelves, newest first
//   404.html                         for addresses that don't exist (hosts serve it at any depth)
//   sitemap.xml, robots.txt          every page's address, for search engines
//
//   node build.mjs                    normal build (directory-style links)
//   node build.mjs --explicit-index   links end in index.html (for file hosts without directory indexes)
//   The site's address is https://minideas.com, used for canonical/hreflang links and preview-image tags (social
//   sites only accept absolute image URLs). SITE_URL=https://other.example overrides it, e.g. for a pages.dev test.
import { mkdir, rm, writeFile, copyFile, rename, readFile } from "node:fs/promises";
import { readFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ART, E } from "./src/draw.js";
import { renderOg } from "./src/og.js";
import { Resvg } from "@resvg/resvg-js";
import { SHELF } from "./src/stacks.js";
import { BOOKS } from "./src/books/index.js";
import en from "./src/i18n/en.js";
import vi from "./src/i18n/vi.js";

const LANGS = [en, vi];
const ROOT = dirname(fileURLToPath(import.meta.url));
// OUT_DIR=<folder> builds somewhere else, e.g. to check a change while the dev server owns dist/
const OUT = process.env.OUT_DIR ? resolve(process.env.OUT_DIR) : join(ROOT, "dist");
const TMP = `${OUT}-tmp`; // built here first, then swapped in, so a running preview never sees a half-built site
const CACHE = join(ROOT, "node_modules/.cache/og"); // preview images keyed by their inputs; most rebuilds render none
const INDEX = process.argv.includes("--explicit-index") ? "index.html" : "";
const SITE_URL = (process.env.SITE_URL || "https://minideas.com").replace(/\/$/, "");

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Lexend:wght@400;600;700&family=Patrick+Hand&display=swap">`;

const ROUGH = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <filter id="rough" filterUnits="userSpaceOnUse" x="-20" y="-20" width="360" height="260">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4"/>
    <feDisplacementMap in="SourceGraphic" scale="1.8"/>
  </filter>
</svg>`;

// The icon (src/assets/icon.svg, a bulb with an "m" filament) becomes the favicon, app icons and web manifest; BRAND_MARK is the header's logo (a small card stack with the same "m" bulb on top),
// drawn with theme colors so it works on light and dark backgrounds.
const iconLinks = rel => `<link rel="icon" href="${rel}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${rel}favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${rel}apple-touch-icon.png">
<link rel="manifest" href="${rel}site.webmanifest">`;
const BRAND_MARK = `<svg class="mark" viewBox="0 0 32 32" width="40" height="40" aria-hidden="true"><g stroke="var(--ink)" stroke-width="1.3" stroke-linejoin="round"><rect x="8" y="4" width="17" height="24" rx="3" fill="var(--f-blue)" transform="rotate(-17 16.5 30)"/><rect x="8" y="4" width="17" height="24" rx="3" fill="var(--f-mint)" transform="rotate(-8.5 16.5 30)"/><rect x="8" y="4" width="17" height="24" rx="3" fill="var(--fk)"/><path d="M16.5 7.6a5.2 5.2 0 0 1 3.1 9.4c-.55.45-.85 1.05-.85 1.75v.3h-4.5v-.3c0-.7-.3-1.3-.85-1.75A5.2 5.2 0 0 1 16.5 7.6z" fill="var(--f-yellow)"/></g><path d="M14.2 15.2v-2.4a1.15 1.15 0 0 1 2.3 0v2.4M16.5 12.8a1.15 1.15 0 0 1 2.3 0v2.4" fill="none" stroke="var(--on)" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.7 21.3h3.6M15.3 23.4h2.4" stroke="var(--ink)" stroke-width="1.3" stroke-linecap="round"/></svg>`;

// Shelf icons on the home page, in the header logo's style (ink outline, pastel fill, theme colors).
const SHELF_ICONS = {
  tech: `<svg class="shelf-icon" viewBox="0 0 32 32" width="36" height="36" aria-hidden="true"><rect x="3.5" y="5.5" width="25" height="21" rx="4" fill="var(--f-blue)" stroke="var(--ink)" stroke-width="1.4"/><path d="M12 12l-4.2 4 4.2 4M20 12l4.2 4-4.2 4M17.6 10.6l-3.2 10.8" fill="none" stroke="var(--on)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  books: `<svg class="shelf-icon" viewBox="0 0 32 32" width="36" height="36" aria-hidden="true"><path d="M16 8.5C13 6.6 8.6 6 3.5 6.6v17.6c5.1-.6 9.5 0 12.5 1.9 3-1.9 7.4-2.5 12.5-1.9V6.6C23.4 6 19 6.6 16 8.5z" fill="var(--f-yellow)" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"/><path d="M16 8.5v17.6" stroke="var(--ink)" stroke-width="1.4"/><path d="M7 11.2c2.3-.2 4.4.1 6 .8M7 15c2.3-.2 4.4.1 6 .8M19 12c1.6-.7 3.7-1 6-.8M19 15.8c1.6-.7 3.7-1 6-.8" fill="none" stroke="var(--on)" stroke-width="1.3" stroke-linecap="round"/></svg>`,
};

// sun shows in dark mode (switch to light), moon in light mode (switch to dark); CSS picks which
const THEME_ICONS = `<svg class="moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
// share menu: the two sites' own marks in their colors, and a link for copying
const SHARE_ICONS = {
  facebook: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#1877F2" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
};
// a bell for "follow" (the home page link), in the share icon's line style so it follows the theme
const FOLLOW_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.5a6 6 0 0 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5"/><path d="M10.3 20.5a1.9 1.9 0 0 0 3.4 0"/></svg>`;
// the usual feed icon, in its usual orange, so people who use RSS recognise it
const RSS_ICON = `<svg class="rss" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#f26f21"/><circle cx="6.8" cy="17.2" r="2" fill="#fff"/><path d="M5 10.6a8.4 8.4 0 0 1 8.4 8.4M5 5.4A13.6 13.6 0 0 1 18.6 19" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`;
const SHARE_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>`;

/* ---------- checks ---------- */
const COLLECTIONS = SHELF.filter(item => item.ideas);
const STANDALONE = SHELF.filter(item => !item.ideas);
const ALL_IDEAS = SHELF.flatMap(item => item.ideas || [item]);
const problems = [];
const seen = new Set(); // collections and ideas share one URL space
for (const name of [...SHELF.flatMap(item => item.ideas ? [item.id, ...item.ideas.map(i => i.slug)] : [item.slug]), ...BOOKS.map(b => b.slug)]) {
  if (seen.has(name) || ["home", "follow"].includes(name)) problems.push(`the name "${name}" is used twice or is taken by the site (collections and ideas need different names)`);
  seen.add(name);
}
for (const t of LANGS) {
  for (const c of COLLECTIONS) {
    const ct = t.collections[c.id];
    if (!ct) { problems.push(`${t.lang}: no text for collection "${c.id}"`); continue; }
    for (const ch of c.chapters || []) if (!ct.chapters?.[ch]) problems.push(`${t.lang}/${c.id}: no name for chapter "${ch}"`);
    for (const r of c.resources) if (!ct.links?.[r.key]) problems.push(`${t.lang}/${c.id}: no description for link "${r.key}"`);
  }
  for (const idea of ALL_IDEAS) {
    const it = t.ideas[idea.slug];
    if (!it) problems.push(`${t.lang}: no text for "${idea.slug}"`);
    else if (it.panels.length !== idea.panels.length) problems.push(`${t.lang}/${idea.slug}: ${it.panels.length} panels of text, ${idea.panels.length} drawings`);
  }
  for (const idea of STANDALONE) for (const r of idea.resources || []) if (!t.ideas[idea.slug]?.links?.[r.key]) problems.push(`${t.lang}/${idea.slug}: no description for link "${r.key}"`);
}
// each shelf item shows when it was published: a collection on its own page (not on each idea), a standalone idea on its page
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
for (const item of SHELF) if (!ISO_DATE.test(item.date || "")) problems.push(`"${item.id || item.slug}": no date (YYYY-MM-DD)`);
// A book is a card stack (panels) that may carry its full review in `full` (an article: intro + sections), or an
// article on its own. Vietnamese is required (the original review); other languages are optional but must match.
const BOOK_PARTS = BOOKS.flatMap(b => [b, ...(b.full ? [b.full] : [])]);
for (const b of BOOK_PARTS) {
  if (!b.vi) { problems.push(`book "${b.slug}": no Vietnamese text`); continue; }
  if (!ISO_DATE.test(b.date || "")) problems.push(`book "${b.slug}": no date (YYYY-MM-DD) for when the review was published`);
  const parts = b.panels ? ["panels"] : ["intro", "sections"];
  for (const t of LANGS) {
    const bl = b[t.lang];
    if (!bl) continue;
    for (const k of ["title", "abstract", ...parts]) if (!bl[k]) problems.push(`book "${b.slug}" (${t.lang}): missing ${k}`);
    if (b.panels && bl.panels?.length !== b.panels.length) problems.push(`book "${b.slug}" (${t.lang}): ${bl.panels?.length} panels of text, ${b.panels.length} pictures`);
    if (!b.panels && bl.sections?.length !== b.vi.sections.length) problems.push(`book "${b.slug}" (${t.lang}): ${bl.sections?.length} sections, the Vietnamese review has ${b.vi.sections.length}`);
  }
  for (const n of Object.keys(b.art?.sections || {})) if (!b.vi.sections?.[n - 1]) problems.push(`book "${b.slug}": a drawing is set for section ${n}, which doesn't exist`);
  for (const file of bookPhotos(b)) {
    if (!existsSync(photoSource(b, file))) problems.push(`book "${b.slug}": photo src/books/photos/${photoDir(b)}/${file} not found`);
    for (const t of LANGS) if (b[t.lang] && !b[t.lang].captions?.[file]) problems.push(`book "${b.slug}" (${t.lang}): no caption for ${file}`);
  }
}
// every photo a book uses: cover, gallery, photo panels, section photos and photos in the text ({ photo: file } blocks),
// all in src/books/photos/<slug>/ (photosFrom overrides)
function bookPhotos(b) {
  const photo = specs => specs.filter(p => p[0] === "photo").map(p => p[1]);
  const inText = [...(b.vi.intro || []), ...(b.vi.sections || []).flatMap(s => s.body)].map(x => x?.photo);
  return [b.cover, ...(b.photos || []), ...photo(b.panels || []), ...photo(Object.values(b.art?.sections || {})), ...inText].filter(Boolean);
}
// the first section with a drawing (not a photo), for a book without a cover photo
const firstDrawing = b => Object.keys(b.art?.sections || {}).filter(n => b.art.sections[n][0] !== "photo").sort((x, y) => x - y)[0];
function photoDir(b) { return b.photosFrom || b.slug; }
function photoSource(b, file) { return join(ROOT, "src/books/photos", photoDir(b), file); }
// width × height from a JPEG's frame header, so the page reserves the right space before the photo loads
function jpegSize(file) {
  const buf = readFileSync(file);
  for (let i = 2; i + 9 < buf.length;) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return [0, 0];
}
const booksIn = t => BOOKS.filter(b => b[t.lang]);
// When something went on the site: a collection's or standalone idea's `date`, a book's `added` (a book's `date` is
// when the review first appeared on Sâu Sách). Things added after launch day (the earliest of these) are marked "New".
for (const b of BOOKS) if (!ISO_DATE.test(b.added || "")) problems.push(`book "${b.slug}": no added date (YYYY-MM-DD) for when it went on the site`);
const siteDate = item => item.added || item.date;
const LAUNCH = [...SHELF, ...BOOKS].map(siteDate).sort()[0];
const NEW_DAYS = 14;
// `related`: one stack worth reading next (an idea, a collection or a book, on either shelf), shown at the end of a
// standalone idea or a book, and after a collection's last idea
for (const item of [...SHELF, ...BOOKS]) if (item.related && !seen.has(item.related)) problems.push(`"${item.id || item.slug}": related "${item.related}" isn't a collection, idea or book`);
if (problems.length) fail();

function fail() {
  console.error("Build stopped:\n  " + problems.join("\n  "));
  process.exit(1);
}

function art(t, [fn, ...args], where) {
  if (!ART[fn]) { problems.push(`${where}: no drawing called "${fn}"`); return ""; }
  const svg = ART[fn](t.art, ...args);
  if (/undefined|NaN/.test(svg)) problems.push(`${where}: drawing "${fn}" is missing a label or has a bad number`);
  return svg;
}
const drawing = (t, spec, label, where) => `<svg viewBox="0 0 320 220" role="img" aria-label="${E(label)}">${art(t, spec, where)}</svg>`;

// preview images, rendered after the pages: path → renderOg() options
const images = {};
// One image per idea and per collection: title + a drawing. Social sites print the summary as text under it.
function ideaImage(t, idea) {
  const path = `og/${t.lang}/${idea.slug}.png`;
  images[path] ??= { title: t.ideas[idea.slug].title, footer: t.ui.site, drawing: art(t, idea.panels[0], path) };
  return path;
}
// A book's drawings get its facts and its own labels as lb.book.
function bookArt(t, b, spec, where) {
  const bl = b[t.lang];
  return art({ ...t, art: { ...t.art, book: { ...bl.labels, title: bl.title, author: b.author, facts: bl.facts || [] } } }, spec, where);
}
// tile and share image: the title with the reviewer's photo of the book, else the first section drawing
function bookImage(t, b, name = b.slug) {
  const path = `og/${t.lang}/${name}.png`, first = firstDrawing(b);
  images[path] ??= { title: b[t.lang].title, footer: `${b.author} · ${t.ui.site}`,
    ...(b.cover ? { photo: { file: photoSource(b, b.cover), ...sizeOf(photoSource(b, b.cover)) } }
      : { drawing: first ? bookArt(t, b, b.art.sections[first], path) : "" }) };
  return path;
}
const sizeOf = file => { const [width, height] = jpegSize(file); return { width, height }; };
function collectionImage(t, c) {
  const path = `og/${t.lang}/${c.id}.png`;
  images[path] ??= { title: t.collections[c.id].title, footer: `${t.ui.ideaCount(c.ideas.length)} · ${t.ui.site}`, drawing: art(t, c.ideas[0].panels[0], path) };
  return path;
}
// A tile: a picture, the title as text, then a caption. The picture is a drawing inline (theme colors, so it suits
// light and dark) or a book's cover photo; the title says what it is, so the picture is decorative.
const tile = (href, pic, title, caption = "", mark = "") =>
  `<li><a class="tile" href="${href}"><span class="tile-art dw">${pic}${mark}</span><span class="tile-body"><h3 class="tile-title">${E(title)}</h3>${caption}</span></a></li>`;
// "New" for NEW_DAYS after something is added; site.js shows it only until then, so an old build doesn't keep saying it
const addDays = (iso, n) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
const newMark = (t, item) => siteDate(item) > LAUNCH ? `<span class="new-mark" data-until="${addDays(siteDate(item), NEW_DAYS)}" hidden>${E(t.ui.new)}</span>` : "";
const tileDrawing = svg => `<svg viewBox="0 0 320 220" aria-hidden="true">${svg}</svg>`;
function bookTileArt(t, b, rel) {
  if (b.cover) { const { width, height } = sizeOf(photoSource(b, b.cover)); return `<img src="${rel}photos/${photoDir(b)}/${b.cover}" alt="" width="${width}" height="${height}" loading="lazy" decoding="async">`; }
  const first = firstDrawing(b);
  return first ? tileDrawing(bookArt(t, b, b.art.sections[first], `${t.lang}/${b.slug} tile`)) : "";
}

/* ---------- links ---------- */
// the title of a collection, idea or book in this language (a book may not have one)
function titleOf(t, name) {
  if (COLLECTIONS.some(c => c.id === name)) return t.collections[name].title;
  return t.ideas[name]?.title || BOOKS.find(b => b.slug === name)?.[t.lang]?.title;
}
// a card for item.related; extra classes place it in the pager
function relatedCard(t, item, to, cls = "related") {
  const title = item.related && titleOf(t, item.related);
  return title ? `<a class="${cls}" href="${to(t.lang, item.related)}"><small>${E(t.ui.related)}</small><strong>${E(title)}</strong></a>` : "";
}

// path segments ("en", "ai-family") → a link relative to the current page's depth
const linker = depth => (...seg) => "../".repeat(depth) + (seg.length ? seg.join("/") + "/" + INDEX : INDEX || "./");

// langs: the languages this page exists in (the switcher sends the others to their home page)
// segs: the page's path below /<lang>/ (the same in every language)
function shell({ t, depth, segs, title, desc, body, og, langs = LANGS }) {
  const to = linker(depth);
  const alternates = SITE_URL ? langs.map(o => `<link rel="alternate" hreflang="${o.lang}" href="${SITE_URL}/${[o.lang, ...segs].join("/")}/">`).join("\n") +
    `\n<link rel="alternate" hreflang="x-default" href="${SITE_URL}/">\n<link rel="canonical" href="${SITE_URL}/${[t.lang, ...segs].join("/")}/">` : "";
  const switcher = LANGS.map(o => `<a href="${langs.includes(o) ? to(o.lang, ...segs) : to(o.lang)}" hreflang="${o.lang}" lang="${o.lang}" aria-current="${o === t}"><span class="lang-long">${o.name}</span><span class="lang-short" aria-hidden="true">${o.lang.toUpperCase()}</span></a>`).join("");
  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${E(title)}</title>
<meta name="description" content="${E(desc)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${E(title)}">
<meta property="og:description" content="${E(desc)}">
<meta property="og:locale" content="${t.locale}">
${SITE_URL ? `<meta property="og:url" content="${SITE_URL}/${[t.lang, ...segs].join("/")}/">
<meta property="og:image" content="${SITE_URL}/${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">` : ""}
${alternates}
${FONTS}
<script>(function () { var t = "light"; try { t = localStorage.getItem("theme") || "light"; } catch (e) {} document.documentElement.setAttribute("data-theme", t); })();</script>
${iconLinks("../".repeat(depth))}
<link rel="stylesheet" href="${"../".repeat(depth)}assets/style.css">
<link rel="alternate" type="application/rss+xml" title="${E(t.ui.site)}" href="${"../".repeat(depth)}${t.lang}/feed.xml">
<script src="${"../".repeat(depth)}assets/site.js" defer></script>
</head>
<body>
${ROUGH}
<div class="wrap">
<header class="topbar">
  <a class="brand" href="${to(t.lang)}">${BRAND_MARK}<span>${E(t.ui.site)}</span></a>
  <div class="top-tools">
    <button class="theme-toggle" id="theme" type="button" hidden data-light="${E(t.ui.themeLight)}" data-dark="${E(t.ui.themeDark)}">${THEME_ICONS}</button>
    <nav class="lang" aria-label="${E(t.ui.language)}">${switcher}</nav>
  </div>
</header>
${body}
</div>
</body>
</html>
`;
}

// "Thấy hay?": one box with the two things a reader can do once they like something, share and follow.
// Share: the share sheet on phones and tablets; on computers (whose share sheets only offer system apps) a menu
// of Facebook, LinkedIn and copy link. Plain share links, no scripts from either site; site.js fills in the address
// and shows the button (it does nothing without the script). Follow opens the Follow page.
const actBox = (t, text, to) => `<aside class="act-box">
  <p>${E(t.ui.actPrompt)}</p>
  <div class="acts">
    <div class="share-wrap">
      <button class="act share" id="share" type="button" hidden aria-expanded="false" aria-controls="share-menu" data-text="${E(text)}" data-copied="${E(t.ui.copied)}" data-copy-prompt="${E(t.ui.copyPrompt)}">${SHARE_ICON}<span>${E(t.ui.share)}</span></button>
      <div class="share-menu" id="share-menu" hidden>
        <a data-to="https://www.facebook.com/sharer/sharer.php?u=" target="_blank" rel="noopener">${SHARE_ICONS.facebook}Facebook</a>
        <a data-to="https://www.linkedin.com/sharing/share-offsite/?url=" target="_blank" rel="noopener">${SHARE_ICONS.linkedin}LinkedIn</a>
        <button type="button" data-copy>${SHARE_ICONS.copy}${E(t.ui.copyLink)}</button>
      </div>
    </div>
    <a class="act follow-act" href="${to(t.lang, "follow")}">${FOLLOW_ICON}<span>${E(t.ui.followButton)}</span></a>
  </div>
</aside>`;

// "Go deeper": resources come from stacks.js, their descriptions (and an optional source note) from i18n
function deeper(t, resources, text) {
  return `<section class="deeper">
  <h2>${E(t.ui.deeperTitle)}</h2>
  <p>${E(t.ui.deeperIntro)}</p>
  <div class="links">
    ${resources.map(r => `<a href="${r.url}" target="_blank" rel="noopener"><strong>${E(r.name)}</strong><span>${E(text.links[r.key])}</span></a>`).join("\n    ")}
  </div>
  ${text.source ? `<p class="source">${E(text.source)}</p>` : ""}
</section>`;
}

// *italic* and **bold** in book text
const rich = s => E(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");

// "Published 8 November 2026" (or where a review first appeared), plus any extras such as reading time
function dateline(t, date, source, ...extra) {
  const line = E(source ? t.ui.publishedOn(source, "\0") : t.ui.published("\0")).replace("\0", `<time datetime="${date}">${E(t.ui.date(date))}</time>`);
  return `<p class="dateline">${[line, ...extra.map(E)].join(" · ")}</p>`;
}
// minutes to read an article, at the language's reading speed in words per minute
function readMinutes(t, bl) {
  const text = [...bl.intro, ...bl.sections.flatMap(s => [s.h, ...s.body]), bl.conclusion || ""].map(x => typeof x === "string" ? x : x.quote || x.text || "").join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / t.ui.wordsPerMinute));
}

/* ---------- pages ---------- */
function homePage(t) {
  // Ideas: one tile per shelf item (a collection's ideas are on its own page). Books: reviews in this language.
  const to = linker(1);
  const caption = (count, html) => `<span class="tile-caption"><span class="count">${E(count)}</span>${html}</span>`;
  const ideaTiles = SHELF.map(item => {
    const first = (item.ideas ? item.ideas[0] : item).panels[0];
    const pic = tileDrawing(art(t, first, `${t.lang}/${item.id || item.slug} tile`));
    if (!item.ideas) {
      const it = t.ideas[item.slug];
      return tile(to(t.lang, item.slug), pic, it.title, caption(t.ui.panelCount(item.panels.length), E(it.gist)), newMark(t, item));
    }
    const ct = t.collections[item.id];
    return tile(to(t.lang, item.id), pic, ct.title, caption(t.ui.ideaCount(item.ideas.length), E(ct.lede)), newMark(t, item));
  }).join("");
  const books = booksIn(t);
  const bookTiles = books.map(b => tile(to(t.lang, b.slug), bookTileArt(t, b, "../"), b[t.lang].title,
    caption(b.panels ? `${b.author} · ${t.ui.panelCount(b.panels.length)}` : b.author, rich(b[t.lang].abstract)), newMark(t, b))).join("");
  const tiles = !books.length ? `<ul class="tile-grid shelf">${ideaTiles}</ul>` :
    `<h2 class="shelf-label">${SHELF_ICONS.tech}<span>${E(t.ui.shelfTech)}</span></h2><ul class="tile-grid">${ideaTiles}</ul>
<h2 class="shelf-label">${SHELF_ICONS.books}<span>${E(t.ui.shelfBooks)}</span></h2><ul class="tile-grid">${bookTiles}</ul>`;
  const body = `<main>
<section class="hero">
  <h1 class="visually-hidden">${E(t.ui.site)}</h1>
  <p class="lede">${E(t.ui.lede)}</p>
</section>
${tiles}
<p class="follow"><a href="${to(t.lang, "follow")}">${FOLLOW_ICON}<span>${E(t.ui.followTitle)}</span></a></p>
</main>`;
  const og = `og/${t.lang}/home.png`, first = ALL_IDEAS[0];
  const titles = SHELF.map(item => item.ideas ? t.collections[item.id].title : t.ideas[item.slug].title);
  images[og] = { title: t.ui.site, text: t.ui.lede, footer: titles.join(" · "), drawing: art(t, first.panels[0], og) };
  return shell({ t, depth: 1, segs: [], title: t.ui.site, desc: t.ui.lede, body, og });
}

function collectionPage(t, c) {
  const ct = t.collections[c.id], to = linker(2);
  const grid = ideas => `<ol class="tile-grid">${ideas.map(idea =>
    tile(to(t.lang, idea.slug), tileDrawing(art(t, idea.panels[0], `${t.lang}/${idea.slug} tile`)), t.ideas[idea.slug].title,
      `<span class="tile-caption">${E(t.ideas[idea.slug].gist)}</span>`)).join("")}</ol>`;
  const groups = c.chapters
    ? c.chapters.map(ch => `<h2 class="chapter-label">${E(ct.chapters[ch])}</h2>${grid(c.ideas.filter(idea => idea.chapter === ch))}`).join("\n")
    : grid(c.ideas);
  const body = `<main>
<a class="back" href="${to(t.lang)}">← ${E(t.ui.allTopics)}</a>
<section class="hero">
  <p class="eyebrow">${E(t.ui.ideaCount(c.ideas.length))}</p>
  <h1>${E(ct.title)}</h1>
  <p class="lede">${E(ct.lede)}</p>
  ${dateline(t, c.date)}
</section>
${groups}
</main>
${deeper(t, c.resources, ct)}`;
  return shell({ t, depth: 2, segs: [c.id], title: `${ct.title} · ${t.ui.site}`, desc: ct.lede, body, og: collectionImage(t, c) });
}

// The swipeable card stack shared by ideas and quick-read reviews. slides: [{ art, h, p }], where art is the
// markup inside the picture box; data: URLs and button labels for site.js; top: what goes above the title;
// meta: the line under the gist. Three blocks: the title, the stack itself (card, buttons, hint), and what next
// (pager: where to go, then share and follow).
function cardStack({ t, slides, data, top, title, gist, meta = "", pager = "" }) {
  const n = slides.length;
  return `<main class="viewer" id="viewer" ${Object.entries(data).map(([k, v]) => `data-${k}="${E(v)}"`).join(" ")}>
  <div class="stack-head">
  ${top}
  <h1 class="stack-title">${E(title)}</h1>
  <p class="gist">${E(gist)}</p>
  ${meta}
  </div>
  <div class="stack-main">
  <div class="card"><div class="track" id="track" tabindex="0" aria-label="${E(t.ui.trackLabel)}">
${slides.map(({ art, h, p }, j) => `<section class="slide" aria-roledescription="slide" aria-label="${j + 1} / ${n}">
      <div class="art dw">${art}</div>
      <div class="count">${j + 1} / ${n}</div>
      <h2>${E(h)}</h2>
      <p>${E(p)}</p>
    </section>`).join("\n")}
  </div></div>
  <div class="controls" hidden>
    <button class="btn" id="prev" type="button">${E(t.ui.back)}</button>
    <div class="dots" role="group" aria-label="${E(t.ui.dotsLabel)}">${slides.map((_, j) => `<button class="dot" type="button" aria-label="${E(t.ui.panelN(j + 1))}"></button>`).join("")}</div>
    <button class="btn primary" id="next" type="button">${E(t.ui.next)}</button>
  </div>
  <p class="hint">${E(t.ui.hint)}</p>
  </div>
  <div class="stack-next">
  ${pager}
  ${actBox(t, gist, linker(2))}
  </div>
</main>`;
}

// A book review as a card stack: one panel per idea from the review, ending with a link to the full review.
function bookStackPage(t, b) {
  const bl = b[t.lang], to = linker(2), where = `${t.lang}/${b.slug}`, full = b.full?.[t.lang];
  const fullUrl = full ? to(t.lang, b.slug, "full") : to(t.lang);
  const slides = b.panels.map((spec, j) => {
    const [h, p] = bl.panels[j];
    const art = spec[0] === "photo"
      ? `<img class="photo-panel" src="../../photos/${photoDir(b)}/${spec[1]}" alt="${E(bl.captions[spec[1]].replace(/\*/g, ""))}" loading="${j ? "lazy" : "eager"}">`
      : `<svg viewBox="0 0 320 220" role="img" aria-label="${E(h)}">${bookArt(t, b, spec, `${where}#${j + 1}`)}</svg>`;
    return { art, h, p };
  });
  const data = { "prev-url": "", "next-url": fullUrl, "t-back": t.ui.back, "t-prev-idea": t.ui.prevIdea, "t-next": t.ui.next,
    "t-next-idea": full ? t.ui.fullReviewNext : t.ui.done, "t-done": t.ui.done };
  const top = `<a class="back" href="${to(t.lang)}">← ${E(t.ui.allTopics)}</a>
  <p class="eyebrow">${E(t.ui.bookReview)} · ${E(b.author)}</p>`;
  const pager = (full ? `<a class="next" href="${fullUrl}"><small>${E(t.ui.fullReview)}</small><strong>${E(full.title)}</strong></a>` : "") + relatedCard(t, b, to);

  const body = `<div class="layout solo">
${cardStack({ t, slides, data, top, title: bl.title, gist: bl.abstract.replace(/\*/g, ""), meta: dateline(t, b.date, b.source), pager: pager && `<nav class="pager">${pager}</nav>` })}
</div>`;
  return shell({ t, depth: 2, segs: [b.slug], title: `${bl.title} · ${t.ui.site}`, desc: bl.abstract.replace(/\*/g, ""), body, og: bookImage(t, b), langs: LANGS.filter(o => b[o.lang]) });
}

// An idea inside collection c (at position i), or a standalone idea when c is null.
function ideaPage(t, idea, c = null, i = 0) {
  const ct = c && t.collections[c.id], it = t.ideas[idea.slug], n = idea.panels.length, to = linker(2);
  const before = c?.ideas[i - 1], after = c?.ideas[i + 1], total = c ? c.ideas.length : 1;
  const slides = idea.panels.map((spec, j) => ({ art: drawing(t, spec, it.panels[j][0], `${t.lang}/${idea.slug}#${j + 1}`), h: it.panels[j][0], p: it.panels[j][1] }));
  const item = (s, k) => `<li><a href="${to(t.lang, s.slug)}"${k === i ? ' aria-current="page"' : ""}>${total > 1 ? `<span class="n">${k + 1}</span>` : ""}<span>${E(t.ideas[s.slug].title)}</span></a></li>`;
  const toc = !c ? "" : `<nav class="toc" aria-label="${E(ct.title)}">
  <a class="home" href="${to(t.lang, c.id)}">← ${E(ct.title)}</a>
  ${c.chapters
    ? c.chapters.map(ch => `<h2>${E(ct.chapters[ch])}</h2><ol>${c.ideas.map((s, k) => s.chapter === ch ? item(s, k) : "").join("")}</ol>`).join("")
    : `<h2>${E(ct.title)}</h2><ol>${c.ideas.map(item).join("")}</ol>`}
</nav>`;
  const pager = [
    before ? `<a class="prev" href="${to(t.lang, before.slug)}"><small>${E(t.ui.pagerPrev)}</small><strong>${E(t.ideas[before.slug].title)}</strong></a>` : "",
    after ? `<a class="next" href="${to(t.lang, after.slug)}"><small>${E(t.ui.pagerNext)}</small><strong>${E(t.ideas[after.slug].title)}</strong></a>`
      : c ? relatedCard(t, c, to, "next related") : relatedCard(t, idea, to),
  ].join("");
  const data = {
    "prev-url": before ? `${to(t.lang, before.slug)}#p${before.panels.length}` : "",
    "next-url": after ? to(t.lang, after.slug) : to(t.lang),
    "t-back": t.ui.back, "t-prev-idea": t.ui.prevIdea, "t-next": t.ui.next, "t-next-idea": after ? t.ui.nextIdea : t.ui.done, "t-done": t.ui.done,
  };
  const eyebrow = !c ? "" : total > 1 ? [t.ui.ideaOf(i + 1, total), ...(c.chapters ? [ct.chapters[idea.chapter]] : [])].map(E).join(" · ") : E(ct.title);
  const top = c ? `<p class="eyebrow">${eyebrow}</p>` : `<a class="back" href="${to(t.lang)}">← ${E(t.ui.allTopics)}</a>`;
  const body = `<div class="layout${c ? "" : " solo"}">
${cardStack({ t, slides, data, top, title: it.title, gist: it.gist, meta: c ? "" : dateline(t, idea.date), pager: pager && `<nav class="pager">${pager}</nav>` })}
${toc}
</div>
${c ? deeper(t, c.resources, ct) : idea.resources?.length ? deeper(t, idea.resources, it) : ""}`;
  return shell({ t, depth: 2, segs: [idea.slug], title: `${it.title} · ${t.ui.site}`, desc: it.gist, body, og: ideaImage(t, idea) });
}

// A book review as one article, in the reviewer's own words: intro, their sections (with drawings where set),
// quotes, and the conclusion. With parent, it is that card stack's full review, one level below it.
function bookPage(t, b, parent = null) {
  const bl = b[t.lang], depth = parent ? 3 : 2, to = linker(depth), rel = "../".repeat(depth), where = `${t.lang}/${b.slug}${parent ? "/full" : ""}`;
  // one of the reviewer's photos where the review put it in the text, with its caption; it opens full size
  const photoFigure = file => {
    const [w, h] = jpegSize(photoSource(b, file)), src = `${rel}photos/${photoDir(b)}/${file}`, caption = bl.captions[file];
    return `<figure class="photo"><a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${E(caption.replace(/\*/g, ""))}" width="${w}" height="${h}" loading="lazy" decoding="async"></a><figcaption>${rich(caption)}</figcaption></figure>`;
  };
  const block = x => typeof x === "string" ? `<p>${rich(x)}</p>`
    : x.photo ? photoFigure(x.photo)
    : x.link ? `<p class="watch"><a href="${E(x.link)}" target="_blank" rel="noopener">${rich(x.text)} ↗</a></p>`
    : `<blockquote><p>${rich(x.quote)}</p></blockquote>`;
  // the reviewer's other photos, together in one gallery before the conclusion; each opens full size
  const gallery = !b.photos?.length ? "" : `<section class="gallery">
    <h2>${E(t.ui.photos)}</h2>
    <ul>${b.photos.map(file => {
      const [w, h] = jpegSize(photoSource(b, file)), src = `${rel}photos/${photoDir(b)}/${file}`, caption = bl.captions[file];
      return `<li><a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${E(caption.replace(/\*/g, ""))}" width="${w}" height="${h}" loading="lazy" decoding="async"></a><span>${rich(caption)}</span></li>`;
    }).join("")}</ul>
  </section>`;
  // a section opens with a drawing, or with one of the reviewer's photos (["photo", file]) where the review had one
  const figure = n => {
    const spec = b.art.sections?.[n];
    if (!spec) return "";
    if (spec[0] === "photo") return photoFigure(spec[1]);
    return `<figure><div class="art dw">${`<svg viewBox="0 0 320 220" role="img" aria-label="${E(bl.sections[n - 1].h)}">${bookArt(t, b, spec, `${where} §${n}`)}</svg>`}</div></figure>`;
  };
  const sections = bl.sections.map((s, i) => `<section>
    <h2>${rich(s.h)}</h2>
    ${figure(i + 1)}
    ${s.body.map(block).join("\n    ")}
  </section>`).join("\n");
  const about = [bl.originalTitle && bl.originalTitle !== bl.title ? `${t.ui.originalTitle}: ${bl.originalTitle}` : "", bl.edition].filter(Boolean).join(" · ");
  const body = `<main class="book">
  <a class="back" href="${to(t.lang)}">← ${E(t.ui.allTopics)}</a>
  <p class="eyebrow">${[t.ui.bookReview, parent && t.ui.fullReview, b.author].filter(Boolean).map(E).join(" · ")}</p>
  <h1 class="stack-title">${E(bl.title)}</h1>
  ${about ? `<p class="edition">${E(about)}</p>` : ""}
  ${dateline(t, b.date, b.source, t.ui.readTime(readMinutes(t, bl)))}
  ${parent ? `<a class="quick-link" href="${to(t.lang, parent.slug)}">${E(t.ui.quickLink(parent.panels.length))}</a>` : ""}
  <div class="book-head${b.cover ? "" : " no-photo"}">
    ${b.cover ? (() => {
      const [w, h] = jpegSize(photoSource(b, b.cover));
      return `<figure class="book-photo"><img src="${rel}photos/${photoDir(b)}/${b.cover}" alt="${E(bl.captions[b.cover].replace(/\*/g, ""))}" width="${w}" height="${h}"></figure>`;
    })() : ""}
    <div>
      <p class="abstract">${rich(bl.abstract)}</p>
      ${bl.facts?.length ? `<ul class="facts">${bl.facts.map(f => `<li>${E(f)}</li>`).join("")}</ul>` : ""}
    </div>
  </div>
  <article class="review">
    ${bl.intro.map(block).join("\n    ")}
    ${sections}
    ${gallery}
    ${bl.conclusion ? `<aside class="verdict"><h2>${E(t.ui.conclusion)}</h2><p>${rich(bl.conclusion)}</p></aside>` : ""}
    ${bl.note ? `<p class="note">${E(bl.note)}</p>` : ""}
    ${actBox(t, bl.abstract.replace(/\*/g, ""), to)}
  </article>
</main>`;
  return shell({ t, depth, segs: parent ? [parent.slug, "full"] : [b.slug], title: `${bl.title} · ${parent ? `${t.ui.fullReview} · ` : ""}${t.ui.site}`,
    desc: bl.abstract.replace(/\*/g, ""), body, og: bookImage(t, b, parent ? `${parent.slug}-full` : b.slug), langs: LANGS.filter(o => b[o.lang]) });
}

// Follow: how to get new card stacks. Browsers don't show RSS feeds (they save or dump the XML), so people read this
// page instead: the feed's address to copy, and links that add it to a feed reader. A newsletter can join it later.
function followPage(t) {
  const to = linker(2), feedUrl = `${SITE_URL}/${t.lang}/feed.xml`, q = encodeURIComponent(feedUrl);
  const reader = (name, url) => `<a href="${url}" target="_blank" rel="noopener"><strong>${name}</strong><span>${E(t.ui.followIn(name))}</span></a>`;
  const body = `<main>
<a class="back" href="${to(t.lang)}">← ${E(t.ui.allTopics)}</a>
<section class="hero">
  <h1>${E(t.ui.followTitle)}</h1>
  <p class="lede">${E(t.ui.followLede)}</p>
</section>
<section class="follow-way">
  <h2>${RSS_ICON}<span>${E(t.ui.rssTitle)}</span></h2>
  <p>${E(t.ui.rssText)}</p>
  <div class="feed-url"><code>${E(feedUrl)}</code><button class="btn" type="button" data-copy-text="${E(feedUrl)}" data-done="${E(t.ui.copiedShort)}">${E(t.ui.copyFeed)}</button></div>
  <div class="links">
    ${reader("Feedly", `https://feedly.com/i/subscription/feed/${q}`)}
    ${reader("Inoreader", `https://www.inoreader.com/?add_feed=${q}`)}
  </div>
</section>
</main>`;
  return shell({ t, depth: 2, segs: ["follow"], title: `${t.ui.followTitle} · ${t.ui.site}`, desc: t.ui.followLede, body, og: `og/${t.lang}/home.png` });
}

// 404.html: the host serves it for any address that doesn't exist, at any depth, so every link starts at the site
// root. It can't know the reader's language, so it speaks both, Vietnamese first.
function notFoundPage() {
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${E(vi.ui.notFound)} · ${E(vi.ui.site)}</title>
${FONTS}
<script>(function () { var t = "light"; try { t = localStorage.getItem("theme") || "light"; } catch (e) {} document.documentElement.setAttribute("data-theme", t); })();</script>
${iconLinks("/")}
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<main class="wrap picker not-found">
  <a class="brand" href="/${INDEX}">${BRAND_MARK}<span>${E(vi.ui.site)}</span></a>
  <h1>${E(vi.ui.notFound)}</h1>
  <p>${E(vi.ui.notFoundText)}</p>
  <p lang="en">${E(en.ui.notFound)}. ${E(en.ui.notFoundText)}</p>
  <nav class="lang" aria-label="${E(vi.ui.homeLink)} / ${E(en.ui.homeLink)}">${[vi, en].map(o => `<a href="/${o.lang}/${INDEX}" hreflang="${o.lang}" lang="${o.lang}">${E(o.ui.homeLink)}</a>`).join("")}</nav>
</main>
</body>
</html>
`;
}

// Vietnamese readers come first. A saved choice wins; then Vietnamese if it is anywhere in the browser's languages
// or the clock is on Vietnam time (many Vietnamese phones are set to English); everyone else gets English.
function rootPage() {
  const langs = LANGS.map(o => o.lang);
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${E(en.ui.site)}</title>
<script>
(function () {
  var langs = ${JSON.stringify(langs)}, pick = null, zone = "";
  try { pick = localStorage.getItem("lang"); } catch (e) {}
  if (langs.indexOf(pick) < 0) {
    var prefs = navigator.languages || [navigator.language || ""];
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    pick = /^Asia\\/(Ho_Chi_Minh|Saigon)$/.test(zone) ? "vi" : "en";
    for (var i = 0; i < prefs.length; i++) if (String(prefs[i]).slice(0, 2).toLowerCase() === "vi") pick = "vi";
  }
  location.replace(pick + "/${INDEX}" + location.hash);
})();
</script>
<noscript><meta http-equiv="refresh" content="0; url=vi/${INDEX}"></noscript>
${FONTS}
<script>(function () { var t = "light"; try { t = localStorage.getItem("theme") || "light"; } catch (e) {} document.documentElement.setAttribute("data-theme", t); })();</script>
${iconLinks("")}
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<main class="wrap picker">
  <h1>${E(en.ui.site)}</h1>
  <nav class="lang" aria-label="Language / Ngôn ngữ">${LANGS.map(o => `<a href="${o.lang}/${INDEX}" hreflang="${o.lang}" lang="${o.lang}">${o.name}</a>`).join("")}</nav>
</main>
</body>
</html>
`;
}

/* ---------- write ---------- */
const files = { "index.html": rootPage(), "404.html": notFoundPage() };
for (const t of LANGS) {
  files[`${t.lang}/index.html`] = homePage(t);
  files[`${t.lang}/follow/index.html`] = followPage(t);
  for (const item of SHELF) {
    if (!item.ideas) { files[`${t.lang}/${item.slug}/index.html`] = ideaPage(t, item); continue; }
    files[`${t.lang}/${item.id}/index.html`] = collectionPage(t, item);
    item.ideas.forEach((idea, i) => files[`${t.lang}/${idea.slug}/index.html`] = ideaPage(t, idea, item, i));
  }
  for (const b of booksIn(t)) {
    files[`${t.lang}/${b.slug}/index.html`] = b.panels ? bookStackPage(t, b) : bookPage(t, b);
    if (b.panels && b.full?.[t.lang]) files[`${t.lang}/${b.slug}/full/index.html`] = bookPage(t, b.full, b);
  }
}
// RSS, one feed per language: collections, standalone ideas and books, newest first, each with its preview image
function feed(t) {
  const items = [
    ...SHELF.map(item => item.ideas
      ? { name: item.id, date: item.date, title: t.collections[item.id].title, text: t.collections[item.id].lede, og: collectionImage(t, item) }
      : { name: item.slug, date: item.date, title: t.ideas[item.slug].title, text: t.ideas[item.slug].gist, og: ideaImage(t, item) }),
    ...booksIn(t).map(b => ({ name: b.slug, date: b.added, title: b[t.lang].title, text: b[t.lang].abstract.replace(/\*/g, ""), og: bookImage(t, b) })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const home = `${SITE_URL}/${t.lang}/`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${E(t.ui.site)}</title>
<link>${home}</link>
<description>${E(t.ui.lede)}</description>
<language>${t.lang}</language>
<atom:link href="${home}feed.xml" rel="self" type="application/rss+xml"/>
${items.map(x => `<item>
  <title>${E(x.title)}</title>
  <link>${home}${x.name}/</link>
  <guid isPermaLink="true">${home}${x.name}/</guid>
  <pubDate>${new Date(`${x.date}T00:00:00Z`).toUTCString()}</pubDate>
  <description>${E(`<p><img src="${SITE_URL}/${x.og}" alt="" width="1200" height="630"></p><p>${E(x.text)}</p>`)}</description>
</item>`).join("\n")}
</channel>
</rss>
`;
}
for (const t of LANGS) files[`${t.lang}/feed.xml`] = feed(t);
// every page (the root only picks a language), at the same addresses as the canonical links
const pageUrls = Object.keys(files).filter(p => p.endsWith("index.html") && p !== "index.html").map(p => `${SITE_URL}/${p.replace(/index\.html$/, "")}`);
files["sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls.map(u => `<url><loc>${E(u)}</loc></url>`).join("\n")}
</urlset>
`;
files["robots.txt"] = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
if (problems.length) fail();

await rm(TMP, { recursive: true, force: true });
for (const [path, html] of Object.entries(files)) {
  await mkdir(dirname(join(TMP, path)), { recursive: true });
  await writeFile(join(TMP, path), html);
}
await mkdir(join(TMP, "assets"), { recursive: true });
for (const f of ["style.css", "site.js"]) await copyFile(join(ROOT, "src/assets", f), join(TMP, "assets", f));
// icons at the site root, where browsers and phones look for them
const iconSvg = readFileSync(join(ROOT, "src/assets/icon.svg"));
const iconPng = size => new Resvg(iconSvg, { fitTo: { mode: "width", value: size } }).render().asPng();
await writeFile(join(TMP, "favicon.svg"), iconSvg);
for (const [file, size] of [["favicon-32.png", 32], ["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) await writeFile(join(TMP, file), iconPng(size));
{ // favicon.ico for browsers that ask for it by name: one 32px PNG wrapped in an ICO header
  const png = iconPng(32), head = Buffer.alloc(22);
  head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4); head[6] = 32; head[7] = 32;
  head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(png.length, 14); head.writeUInt32LE(22, 18);
  await writeFile(join(TMP, "favicon.ico"), Buffer.concat([head, png]));
}
await writeFile(join(TMP, "site.webmanifest"), JSON.stringify({
  name: en.ui.site, short_name: en.ui.site, start_url: "/", display: "standalone", background_color: "#edf0f6", theme_color: "#1c2333",
  icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
}, null, 2));
for (const b of BOOK_PARTS) for (const file of bookPhotos(b)) {
  await mkdir(join(TMP, "photos", photoDir(b)), { recursive: true });
  await copyFile(photoSource(b, file), join(TMP, "photos", photoDir(b), file));
}
// a preview image is re-rendered only when its inputs change (text, drawing, photo, or the renderer itself)
const renderer = readFileSync(join(ROOT, "src/og.js"), "utf8");
let rendered = 0;
await mkdir(CACHE, { recursive: true });
for (const [path, o] of Object.entries(images)) {
  const key = createHash("sha1").update(renderer + JSON.stringify(o) + (o.photo ? statSync(o.photo.file).mtimeMs : "")).digest("hex");
  const cached = join(CACHE, `${key}.png`);
  if (!existsSync(cached)) { await writeFile(cached, renderOg(o)); rendered++; }
  await mkdir(dirname(join(TMP, path)), { recursive: true });
  await writeFile(join(TMP, path), await readFile(cached));
}
await rm(OUT, { recursive: true, force: true });
await rename(TMP, OUT);

console.log(`Built ${Object.keys(files).filter(p => p.endsWith(".html")).length} pages and ${Object.keys(images).length} preview images, ${rendered} re-rendered (${ALL_IDEAS.length} ideas, ${COLLECTIONS.length} collection${COLLECTIONS.length === 1 ? "" : "s"}, ${BOOKS.length} book${BOOKS.length === 1 ? "" : "s"}) for ${LANGS.map(t => t.lang).join(", ")} into ${OUT.startsWith(ROOT) ? relative(ROOT, OUT) : OUT}/`);
if (!SITE_URL) console.log("Note: SITE_URL is not set, so pages don't point to their preview images yet. Set it when you deploy.");
