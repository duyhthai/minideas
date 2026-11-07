// Builds the static site into dist/:
//   index.html                       picks a language (saved choice, then browser language)
//   <lang>/index.html                home: tiles for collections and standalone ideas, then book reviews
//   <lang>/<collection>/index.html   a collection: one tile per idea
//   <lang>/<slug>/index.html         one idea or one book review, as a swipeable card stack
//   <lang>/<slug>/<full>/index.html  a book's full review as an article ("full" / "day-du")
//   og/<lang>/<name>.png             one image per collection and per idea: its tile and its link preview
//   photos/<book>/<file>             a book reviewer's own photos, copied from src/books/photos/
//
//   node build.mjs                    normal build (directory-style links)
//   node build.mjs --explicit-index   links end in index.html (for file hosts without directory indexes)
//   The site's address is https://minideas.com, used for canonical/hreflang links and preview-image tags (social
//   sites only accept absolute image URLs). SITE_URL=https://other.example overrides it, e.g. for a pages.dev test.
import { mkdir, rm, writeFile, copyFile, rename, readFile } from "node:fs/promises";
import { readFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
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
const OUT = join(ROOT, "dist");
const TMP = join(ROOT, "dist-tmp"); // built here first, then swapped in, so a running preview never sees a half-built site
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

// sun shows in dark mode (switch to light), moon in light mode (switch to dark); CSS picks which
const THEME_ICONS = `<svg class="moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
const SHARE_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>`;

/* ---------- checks ---------- */
const COLLECTIONS = SHELF.filter(item => item.ideas);
const STANDALONE = SHELF.filter(item => !item.ideas);
const ALL_IDEAS = SHELF.flatMap(item => item.ideas || [item]);
const problems = [];
const seen = new Set(); // collections and ideas share one URL space
for (const name of [...SHELF.flatMap(item => item.ideas ? [item.id, ...item.ideas.map(i => i.slug)] : [item.slug]), ...BOOKS.map(b => b.slug)]) {
  if (seen.has(name) || name === "home") problems.push(`the name "${name}" is used twice (collections and ideas need different names)`);
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
// A book is a card stack (panels) that may carry its full review in `full` (an article: intro + sections), or an
// article on its own. Vietnamese is required (the original review); other languages are optional but must match.
const BOOK_PARTS = BOOKS.flatMap(b => [b, ...(b.full ? [b.full] : [])]);
for (const b of BOOK_PARTS) {
  if (!b.vi) { problems.push(`book "${b.slug}": no Vietnamese text`); continue; }
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
// every photo a book uses: cover, gallery and photo panels, all in src/books/photos/<slug>/ (photosFrom overrides)
function bookPhotos(b) { return [b.cover, ...(b.photos || []), ...(b.panels || []).filter(p => p[0] === "photo").map(p => p[1])].filter(Boolean); }
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
  const path = `og/${t.lang}/${name}.png`, first = Object.keys(b.art?.sections || {}).sort((x, y) => x - y)[0];
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
const tile = (href, img, alt, hint, caption = "") =>
  `<li><a class="tile" href="${href}" title="${E(hint)}"><img src="${img}" alt="${E(alt)}" width="1200" height="630" loading="lazy" decoding="async">${caption}</a></li>`;

/* ---------- links ---------- */
// path segments ("en", "ai-family") → a link relative to the current page's depth
const linker = depth => (...seg) => "../".repeat(depth) + (seg.length ? seg.join("/") + "/" + INDEX : INDEX || "./");

// langs: the languages this page exists in (the switcher sends the others to their home page)
// segs: the page's path below /<lang>/, or a function lang → path when it differs by language
function shell({ t, depth, segs, title, desc, body, og, langs = LANGS }) {
  const to = linker(depth), segsOf = o => (typeof segs === "function" ? segs(o) : segs);
  const alternates = SITE_URL ? langs.map(o => `<link rel="alternate" hreflang="${o.lang}" href="${SITE_URL}/${[o.lang, ...segsOf(o)].join("/")}/">`).join("\n") +
    `\n<link rel="alternate" hreflang="x-default" href="${SITE_URL}/">\n<link rel="canonical" href="${SITE_URL}/${[t.lang, ...segsOf(t)].join("/")}/">` : "";
  const switcher = LANGS.map(o => `<a href="${langs.includes(o) ? to(o.lang, ...segsOf(o)) : to(o.lang)}" hreflang="${o.lang}" lang="${o.lang}" aria-current="${o === t}"><span class="lang-long">${o.name}</span><span class="lang-short" aria-hidden="true">${o.lang.toUpperCase()}</span></a>`).join("");
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
${SITE_URL ? `<meta property="og:url" content="${SITE_URL}/${[t.lang, ...segsOf(t)].join("/")}/">
<meta property="og:image" content="${SITE_URL}/${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">` : ""}
${alternates}
${FONTS}
<script>(function () { var t = "light"; try { t = localStorage.getItem("theme") || "light"; } catch (e) {} document.documentElement.setAttribute("data-theme", t); })();</script>
${iconLinks("../".repeat(depth))}
<link rel="stylesheet" href="${"../".repeat(depth)}assets/style.css">
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

/* ---------- pages ---------- */
function homePage(t) {
  // Ideas: one tile per shelf item (a collection's ideas are on its own page). Books: reviews in this language.
  const to = linker(1);
  const caption = (count, text) => `<span class="tile-caption"><span class="count">${E(count)}</span>${E(text)}</span>`;
  const ideaTiles = SHELF.map(item => {
    if (!item.ideas) {
      const it = t.ideas[item.slug];
      return tile(to(t.lang, item.slug), `../${ideaImage(t, item)}`, it.title, it.gist, caption(t.ui.panelCount(item.panels.length), it.gist));
    }
    const ct = t.collections[item.id];
    return tile(to(t.lang, item.id), `../${collectionImage(t, item)}`, ct.title, ct.lede, caption(t.ui.ideaCount(item.ideas.length), ct.lede));
  }).join("");
  const books = booksIn(t);
  const bookTiles = books.map(b => tile(to(t.lang, b.slug), `../${bookImage(t, b)}`, b[t.lang].title, b[t.lang].abstract,
    caption(b.panels ? `${b.author} · ${t.ui.panelCount(b.panels.length)}` : b.author, b[t.lang].abstract))).join("");
  const tiles = !books.length ? `<ul class="tile-grid shelf">${ideaTiles}</ul>` :
    `<h2 class="shelf-label">${E(t.ui.shelfIdeas)}</h2><ul class="tile-grid">${ideaTiles}</ul>
<h2 class="shelf-label">${E(t.ui.shelfBooks)}</h2><ul class="tile-grid">${bookTiles}</ul>`;
  const body = `<main>
<section class="hero">
  <h1 class="visually-hidden">${E(t.ui.site)}</h1>
  <p class="lede">${E(t.ui.lede)}</p>
</section>
${tiles}
</main>`;
  const og = `og/${t.lang}/home.png`, first = ALL_IDEAS[0];
  const titles = SHELF.map(item => item.ideas ? t.collections[item.id].title : t.ideas[item.slug].title);
  images[og] = { title: t.ui.site, text: t.ui.lede, footer: titles.join(" · "), drawing: art(t, first.panels[0], og) };
  return shell({ t, depth: 1, segs: [], title: t.ui.site, desc: t.ui.lede, body, og });
}

function collectionPage(t, c) {
  const ct = t.collections[c.id], to = linker(2);
  const grid = ideas => `<ol class="tile-grid">${ideas.map(idea =>
    tile(to(t.lang, idea.slug), `../../${ideaImage(t, idea)}`, t.ideas[idea.slug].title, t.ideas[idea.slug].gist)).join("")}</ol>`;
  const groups = c.chapters
    ? c.chapters.map(ch => `<h2 class="chapter-label">${E(ct.chapters[ch])}</h2>${grid(c.ideas.filter(idea => idea.chapter === ch))}`).join("\n")
    : grid(c.ideas);
  const body = `<main>
<a class="back" href="${to(t.lang)}">← ${E(t.ui.allTopics)}</a>
<section class="hero">
  <p class="eyebrow">${E(t.ui.ideaCount(c.ideas.length))}</p>
  <h1>${E(ct.title)}</h1>
  <p class="lede">${E(ct.lede)}</p>
</section>
${groups}
</main>
${deeper(t, c.resources, ct)}`;
  return shell({ t, depth: 2, segs: [c.id], title: `${ct.title} · ${t.ui.site}`, desc: ct.lede, body, og: collectionImage(t, c) });
}

// The swipeable card stack shared by ideas and quick-read reviews. slides: [{ art, h, p }], where art is the
// markup inside the picture box; data: URLs and button labels for site.js; top: what goes above the title.
function cardStack({ t, slides, data, top, title, gist, after = "" }) {
  const n = slides.length;
  return `<main class="viewer" id="viewer" ${Object.entries(data).map(([k, v]) => `data-${k}="${E(v)}"`).join(" ")}>
  ${top}
  <h1 class="stack-title">${E(title)}</h1>
  <p class="gist">${E(gist)}</p>
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
  <div class="share-row">
    <p class="hint">${E(t.ui.hint)}</p>
    <button class="btn share" id="share" type="button" hidden data-text="${E(gist)}" data-copied="${E(t.ui.copied)}" data-copy-prompt="${E(t.ui.copyPrompt)}">${SHARE_ICON}<span>${E(t.ui.share)}</span></button>
  </div>
  ${after}
</main>`;
}

// A book review as a card stack: one panel per idea from the review, ending with a link to the full review.
function bookStackPage(t, b) {
  const bl = b[t.lang], to = linker(2), where = `${t.lang}/${b.slug}`, full = b.full?.[t.lang];
  const fullUrl = full ? to(t.lang, b.slug, t.ui.fullSlug) : to(t.lang);
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
  const after = (full ? `<nav class="pager"><a class="next" href="${fullUrl}"><small>${E(t.ui.fullReview)}</small><strong>${E(full.title)}</strong></a></nav>` : "") +
    (b.source ? `<p class="source">${E(t.ui.originallyOn(b.source))}</p>` : "");
  const body = `<div class="layout solo">
${cardStack({ t, slides, data, top, title: bl.title, gist: bl.abstract.replace(/\*/g, ""), after })}
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
    after ? `<a class="next" href="${to(t.lang, after.slug)}"><small>${E(t.ui.pagerNext)}</small><strong>${E(t.ideas[after.slug].title)}</strong></a>` : "",
  ].join("");
  const data = {
    "prev-url": before ? `${to(t.lang, before.slug)}#p${before.panels.length}` : "",
    "next-url": after ? to(t.lang, after.slug) : to(t.lang),
    "t-back": t.ui.back, "t-prev-idea": t.ui.prevIdea, "t-next": t.ui.next, "t-next-idea": after ? t.ui.nextIdea : t.ui.done, "t-done": t.ui.done,
  };
  const eyebrow = !c ? "" : total > 1 ? [t.ui.ideaOf(i + 1, total), ...(c.chapters ? [ct.chapters[idea.chapter]] : [])].map(E).join(" · ") : E(ct.title);
  const top = c ? `<p class="eyebrow">${eyebrow}</p>` : `<a class="back" href="${to(t.lang)}">← ${E(t.ui.allTopics)}</a>`;
  const body = `<div class="layout${c ? "" : " solo"}">
${cardStack({ t, slides, data, top, title: it.title, gist: it.gist, after: pager ? `<nav class="pager">${pager}</nav>` : "" })}
${toc}
</div>
${c ? deeper(t, c.resources, ct) : idea.resources?.length ? deeper(t, idea.resources, it) : ""}`;
  return shell({ t, depth: 2, segs: [idea.slug], title: `${it.title} · ${t.ui.site}`, desc: it.gist, body, og: ideaImage(t, idea) });
}

// A book review as one article, in the reviewer's own words: intro, their sections (with drawings where set),
// quotes, and the conclusion. With parent, it is that card stack's full review, one level below it.
function bookPage(t, b, parent = null) {
  const bl = b[t.lang], depth = parent ? 3 : 2, to = linker(depth), rel = "../".repeat(depth), where = `${t.lang}/${b.slug}${parent ? "/full" : ""}`;
  const block = x => typeof x === "string" ? `<p>${rich(x)}</p>` : `<blockquote><p>${rich(x.quote)}</p></blockquote>`;
  // the reviewer's own photos, together in one gallery before the conclusion; each opens full size
  const gallery = !b.photos?.length ? "" : `<section class="gallery">
    <h2>${E(t.ui.photos)}</h2>
    <ul>${b.photos.map(file => {
      const [w, h] = jpegSize(photoSource(b, file)), src = `${rel}photos/${photoDir(b)}/${file}`, caption = bl.captions[file];
      return `<li><a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${E(caption.replace(/\*/g, ""))}" width="${w}" height="${h}" loading="lazy" decoding="async"></a><span>${rich(caption)}</span></li>`;
    }).join("")}</ul>
  </section>`;
  const figure = n => b.art.sections?.[n] ? `<figure><div class="art dw">${`<svg viewBox="0 0 320 220" role="img" aria-label="${E(bl.sections[n - 1].h)}">${bookArt(t, b, b.art.sections[n], `${where} §${n}`)}</svg>`}</div></figure>` : "";
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
    <div class="share-row">
      ${b.source ? `<p class="source">${E(t.ui.originallyOn(b.source))}</p>` : "<span></span>"}
      <button class="btn share" id="share" type="button" hidden data-text="${E(bl.abstract.replace(/\*/g, ""))}" data-copied="${E(t.ui.copied)}" data-copy-prompt="${E(t.ui.copyPrompt)}">${SHARE_ICON}<span>${E(t.ui.share)}</span></button>
    </div>
  </article>
</main>`;
  return shell({ t, depth, segs: parent ? o => [parent.slug, o.ui.fullSlug] : [b.slug], title: `${bl.title} · ${parent ? `${t.ui.fullReview} · ` : ""}${t.ui.site}`,
    desc: bl.abstract.replace(/\*/g, ""), body, og: bookImage(t, b, parent ? `${parent.slug}-full` : b.slug), langs: LANGS.filter(o => b[o.lang]) });
}

function rootPage() {
  const langs = LANGS.map(o => o.lang);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${E(en.ui.site)}</title>
<script>
(function () {
  var langs = ${JSON.stringify(langs)}, pick = null;
  try { pick = localStorage.getItem("lang"); } catch (e) {}
  if (langs.indexOf(pick) < 0) {
    var prefs = navigator.languages || [navigator.language || ""];
    pick = "en";
    for (var i = 0; i < prefs.length; i++) { var p = String(prefs[i]).slice(0, 2).toLowerCase(); if (langs.indexOf(p) >= 0) { pick = p; break; } }
  }
  location.replace(pick + "/${INDEX}" + location.hash);
})();
</script>
<noscript><meta http-equiv="refresh" content="0; url=en/${INDEX}"></noscript>
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
const files = { "index.html": rootPage() };
for (const t of LANGS) {
  files[`${t.lang}/index.html`] = homePage(t);
  for (const item of SHELF) {
    if (!item.ideas) { files[`${t.lang}/${item.slug}/index.html`] = ideaPage(t, item); continue; }
    files[`${t.lang}/${item.id}/index.html`] = collectionPage(t, item);
    item.ideas.forEach((idea, i) => files[`${t.lang}/${idea.slug}/index.html`] = ideaPage(t, idea, item, i));
  }
  for (const b of booksIn(t)) {
    files[`${t.lang}/${b.slug}/index.html`] = b.panels ? bookStackPage(t, b) : bookPage(t, b);
    if (b.panels && b.full?.[t.lang]) files[`${t.lang}/${b.slug}/${t.ui.fullSlug}/index.html`] = bookPage(t, b.full, b);
  }
}
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

console.log(`Built ${Object.keys(files).length} pages and ${Object.keys(images).length} preview images, ${rendered} re-rendered (${ALL_IDEAS.length} ideas, ${COLLECTIONS.length} collection${COLLECTIONS.length === 1 ? "" : "s"}, ${BOOKS.length} book${BOOKS.length === 1 ? "" : "s"}) for ${LANGS.map(t => t.lang).join(", ")} into dist/`);
if (!SITE_URL) console.log("Note: SITE_URL is not set, so pages don't point to their preview images yet. Set it when you deploy.");
