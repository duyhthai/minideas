// The shell every page shares (head, top bar, Follow and Suggest cards, footer), and the small pieces pages are built
// from: links, tiles, the share button, "Go deeper", datelines and text formatting.
import { E } from "../draw.js";
import { BOOKS, LANGS, en } from "../content.js";
import { INDEX, SITE_URL, REPO_URL } from "./config.js";
import { BRAND_MARK, THEME_ICONS, SHARE_ICONS, MAIL_ICON, SUGGEST_ICON, GITHUB_ICON, SHARE_ICON } from "./icons.js";
import { COLLECTIONS, siteDate, LAUNCH, NEW_DAYS } from "./shelves.js";
import { ogUrl } from "./pictures.js";

export const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Lexend:wght@400;600;700&family=Patrick+Hand&display=swap">`;
// The icon (src/assets/icon.svg, a bulb with an "m" filament) becomes the favicon, app icons and web manifest
// (written by build.mjs); every page links them.
// Sets the saved light or dark theme before the page draws, so it doesn't flash the other one first.
export const THEME_SCRIPT = `<script>(function () { var t = "light"; try { t = localStorage.getItem("theme") || "light"; } catch (e) {} document.documentElement.setAttribute("data-theme", t); })();</script>`;
export const iconLinks = rel => `<link rel="icon" href="${rel}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${rel}favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${rel}icon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="${rel}apple-touch-icon.png">
<link rel="manifest" href="${rel}site.webmanifest">`;
// Tells Google the site's name ("Minideas", not "minideas.com") for search results; it reads it from the home pages.
export const SITE_LD = SITE_URL ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: en.ui.site, url: `${SITE_URL}/` })}</script>` : "";
// A tile: a picture, the title as text, then a caption. The picture is a drawing inline (theme colors, so it suits
// light and dark) or a book's cover photo; the title says what it is, so the picture is decorative.
export const tile = (href, pic, title, caption = "", mark = "") =>
  `<li><a class="tile" href="${href}"><span class="tile-art">${pic}</span><span class="tile-body">${mark}<h3 class="tile-title">${E(title)}</h3>${caption}</span></a></li>`;
// "New" for NEW_DAYS after something is added; site.js shows it only until then, so an old build doesn't keep saying it
const addDays = (iso, n) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
export const newMark = (t, item) => siteDate(item) > LAUNCH ? `<span class="new-mark" data-until="${addDays(siteDate(item), NEW_DAYS)}" hidden>${E(t.ui.new)}</span>` : "";
// the title of a collection, idea or book in this language (a book may not have one)
function titleOf(t, name) {
  if (COLLECTIONS.some(c => c.id === name)) return t.collections[name]?.title;
  return t.ideas[name]?.title || BOOKS.find(b => b.slug === name)?.[t.lang]?.title;
}
// a card for item.related; extra classes place it in the pager
export function relatedCard(t, item, to, cls = "related") {
  const title = item.related && titleOf(t, item.related);
  return title ? `<a class="${cls}" href="${to(t.lang, item.related)}"><small>${E(t.ui.related)}</small><strong>${E(title)}</strong></a>` : "";
}
// path segments ("en", "ai-family") → a link relative to the current page's depth
export const linker = depth => (...seg) => "../".repeat(depth) + (seg.length ? seg.join("/") + "/" + INDEX : INDEX || "./");

// langs: the languages this page exists in (the switcher sends the others to their home page)
// segs: the page's path below /<lang>/ (the same in every language)
// Every page ends with two cards, Follow (by email) and Suggest, each with its one-line pitch, then the footer: a small
// link to the code on GitHub and the small print. The RSS feed has no footer link: the Follow page gives its address,
// and every page names it in <head>, so feed readers find it from any page's address. A page doesn't
// link to itself (segs[0] is its own name).
export function shell({ t, depth, segs, title, desc, body, og, langs = LANGS, noindex = false }) {
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
<meta name="description" content="${E(desc)}">${noindex ? `\n<meta name="robots" content="noindex">` : ""}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${E(t.ui.site)}">
<meta property="og:title" content="${E(title)}">
<meta property="og:description" content="${E(desc)}">
<meta property="og:locale" content="${t.locale}">
${SITE_URL ? `<meta property="og:url" content="${SITE_URL}/${[t.lang, ...segs].join("/")}/">
<meta property="og:image" content="${ogUrl(og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">` : ""}
${alternates}${segs.length ? "" : `\n${SITE_LD}`}
${FONTS}
${THEME_SCRIPT}
${iconLinks("../".repeat(depth))}
<link rel="stylesheet" href="${"../".repeat(depth)}assets/style.css">
<link rel="alternate" type="application/rss+xml" title="${E(feedTitle(t))}" href="${"../".repeat(depth)}${t.lang}/feed.xml">
<script src="${"../".repeat(depth)}assets/site.js" defer></script>
</head>
<body>
<div class="wrap">
<header class="topbar">
  <a class="brand" href="${to(t.lang)}">${BRAND_MARK}<span>${E(t.ui.site)}</span></a>
  <div class="top-tools">
    <button class="theme-toggle" id="theme" type="button" hidden data-light="${E(t.ui.themeLight)}" data-dark="${E(t.ui.themeDark)}">${THEME_ICONS}</button>
    <nav class="lang" aria-label="${E(t.ui.language)}">${switcher}</nav>
  </div>
</header>
${body}
<aside class="more-band">
  ${segs[0] === "follow" ? "" : `<a class="more-card" href="${to(t.lang, "follow")}">${MAIL_ICON}<span><strong>${E(t.ui.followTitle)}</strong><small>${E(t.ui.followLede)}</small></span></a>`}
  ${segs[0] === "suggest" ? "" : `<a class="more-card" href="${to(t.lang, "suggest")}">${SUGGEST_ICON}<span><strong>${E(t.ui.suggestTitle)}</strong><small>${E(t.ui.suggestShort)}</small></span></a>`}
</aside>
<footer class="site-foot">
  <a class="foot-link" href="${REPO_URL}" target="_blank" rel="noopener">${GITHUB_ICON}<span>GitHub</span></a>
  <p>© ${new Date().getUTCFullYear()} ${E(t.ui.site)} · ${E(t.ui.madeBy)}</p>
</footer>
</div>
</body>
</html>
`;
}

// Share, on its own under a stack or a full review: the share sheet on phones and tablets; on computers (whose share
// sheets only offer system apps) a menu of Facebook, LinkedIn and copy link. Plain share links, no scripts from either
// site; site.js fills in the address and shows the button (without the script there is nothing to show).
export const shareButton = (t, text, cls = "share-solo") => `<div class="share-wrap ${cls}">
  <button class="btn share" id="share" type="button" hidden aria-expanded="false" aria-controls="share-menu" data-text="${E(text)}" data-copied="${E(t.ui.copied)}" data-copy-prompt="${E(t.ui.copyPrompt)}">${SHARE_ICON}<span>${E(t.ui.share)}</span></button>
  <div class="share-menu" id="share-menu" hidden>
    <a data-to="https://www.facebook.com/sharer/sharer.php?u=" target="_blank" rel="noopener">${SHARE_ICONS.facebook}Facebook</a>
    <a data-to="https://www.linkedin.com/sharing/share-offsite/?url=" target="_blank" rel="noopener">${SHARE_ICONS.linkedin}LinkedIn</a>
    <button type="button" data-copy>${SHARE_ICONS.copy}${E(t.ui.copyLink)}</button>
  </div>
</div>`;

// "Go deeper": resources come from a topic's stack.js, their descriptions (and an optional source note) from its en.js / vi.js
export function deeper(t, resources, text) {
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
export const rich = s => E(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
// card text: `…` is code (a command, a path, a key), [words](https://…) a link to an official page and [words](slug) a
// link to another stack on Minideas in the same language (checked once every page exists). Card stacks sit at /<lang>/<slug>/.
export const siteLinks = [];
export const linked = (s, t) => E(s).replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
  .replace(/\[([^\]]+)\]\(([a-z0-9-]+)\)/g, (_, words, slug) => { siteLinks.push([t.lang, slug]); return `<a href="${linker(2)(t.lang, slug)}">${words}</a>`; });

// "Published 8 November 2026" (or where a review first appeared), plus any extras such as reading time.
// item: a collection, standalone idea or book, with its date and, for a book, any `source`.
export function dateline(t, { date, source }, ...extra) {
  const line = E(source ? t.ui.publishedOn(source, "\0") : t.ui.published("\0")).replace("\0", `<time datetime="${date}">${E(t.ui.date(date))}</time>`);
  return `<p class="dateline">${[line, ...extra.map(E)].join(" · ")}</p>`;
}
// minutes to read an article, at the language's reading speed in words per minute
export function readMinutes(t, bl) {
  const text = [...bl.intro, ...bl.sections.flatMap(s => [s.h, ...s.body]), bl.conclusion || ""].map(x => typeof x === "string" ? x : x.quote || x.text || "").join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / t.ui.wordsPerMinute));
}
// a feed's name in readers, with its language, so readers who follow both can tell them apart
export function feedTitle(t) { return `${t.ui.site} (${t.name})`; }
