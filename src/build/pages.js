// The reading pages: home, a collection, an idea's card stack, a book's card stack and its full review.
import { E } from "../draw.js";
import { LANGS } from "../content.js";
import { HOME_PREVIEW } from "./config.js";
import { tile, newMark, relatedCard, linker, shell, shareButton, deeper, rich, linked, dateline, readMinutes } from "./layout.js";
import { BRAND_MARK, SHELF_ICONS, SERIES_ICON } from "./icons.js";
import { shelfIn, langsOf, photoSource, jpegSize, booksIn } from "./shelves.js";
import { art, sketchPicture, drawing, images, ideaImage, bookArt, bookImage, homePreviewTile, collectionImage, tileDrawing, bookTileArt } from "./pictures.js";

// home-page tiles, for a page `depth` folders below the site root: one per shelf item (a collection's ideas are on its
// own page), one per book with a review in this language
const tileCaption = (count, html, icon = "") => `<span class="tile-caption"><span class="count">${icon}${E(count)}</span>${html}</span>`;
// shown only when the tile is the wide first one on a home shelf (see .shelf-grid in style.css)
const tileGo = t => `<span class="btn primary tile-go">${E(t.ui.startReading)}</span>`;
export function shelfTile(t, item, depth) {
  const to = linker(depth), first = (item.ideas ? item.ideas[0] : item).panels[0];
  const pic = tileDrawing(art(t, first, `${t.lang}/${item.id || item.slug} tile`));
  if (!item.ideas) {
    const it = t.ideas[item.slug];
    return tile(to(t.lang, item.slug), pic, it.title, tileCaption(t.ui.panelCount(item.panels.length), E(it.gist)) + tileGo(t), newMark(t, item));
  }
  const ct = t.collections[item.id];
  return tile(to(t.lang, item.id), pic, ct.title, tileCaption(t.ui.ideaCount(item.ideas.length), E(ct.lede), SERIES_ICON) + tileGo(t), newMark(t, item));
}
export const bookTile = (t, b, depth) => tile(linker(depth)(t.lang, b.slug), bookTileArt(t, b, "../".repeat(depth)), b[t.lang].title,
  tileCaption(b.panels ? `${b.author} · ${t.ui.panelCount(b.panels.length)}` : b.author, rich(b[t.lang].abstract)) + tileGo(t), newMark(t, b));

export function homePage(t) {
  const ideaTiles = shelfIn(t).map(item => shelfTile(t, item, 1)).join("");
  const books = booksIn(t);
  const bookTiles = books.map(b => bookTile(t, b, 1)).join("");
  const tiles = !books.length ? `<ul class="tile-grid shelf-grid shelf">${ideaTiles}</ul>` :
    `<h2 class="shelf-label">${SHELF_ICONS.tech}<span>${E(t.ui.shelfTech)}</span></h2><ul class="tile-grid shelf-grid">${ideaTiles}</ul>
<h2 class="shelf-label">${SHELF_ICONS.books}<span>${E(t.ui.shelfBooks)}</span></h2><ul class="tile-grid shelf-grid">${bookTiles}</ul>`;
  const body = `<main class="shelves">
<section class="hero">
  <h1 class="visually-hidden">${E(t.ui.site)}</h1>
  <p class="lede home-lede">${t.ui.lede.split(/(?<=,) /).map(part => `<span>${E(part)}</span>`).join(" ")}</p>
</section>
${tiles}
</main>`;
  const og = `og/${t.lang}/home.png`;
  images[og] = { home: true, title: t.ui.site, text: t.ui.lede, mark: BRAND_MARK, tiles: HOME_PREVIEW.map(name => homePreviewTile(t, name, og)) };
  return shell({ t, depth: 1, segs: [], title: t.ui.site, desc: t.ui.lede, body, og });
}

// An idea's title where its chapter name is already shown (under the chapter heading, or after it in the eyebrow):
// "Claude Code: getting started" in the Claude Code chapter reads "Getting started". Elsewhere (tab, link preview,
// pager, feed) the full title stands alone.
const titleIn = (t, title, chapter) => !chapter || !title.startsWith(chapter + ": ") ? title
  : title[chapter.length + 2].toLocaleUpperCase(t.lang) + title.slice(chapter.length + 3);

export function collectionPage(t, c) {
  const ct = t.collections[c.id], to = linker(2);
  const grid = ideas => `<ol class="tile-grid">${ideas.map(idea =>
    tile(to(t.lang, idea.slug), tileDrawing(art(t, idea.panels[0], `${t.lang}/${idea.slug} tile`)), titleIn(t, t.ideas[idea.slug].title, ct.chapters?.[idea.chapter]),
      `<span class="tile-caption">${E(t.ideas[idea.slug].gist)}</span>`)).join("")}</ol>`;
  const groups = c.chapters
    ? c.chapters.map((ch, k) => `<h2 class="chapter-label"><span class="chapter-num">${k + 1}</span>${E(ct.chapters[ch])}</h2>${grid(c.ideas.filter(idea => idea.chapter === ch))}`).join("\n")
    : grid(c.ideas);
  const body = `<main>
<a class="back" href="${to(t.lang)}">← ${E(t.ui.allTopics)}</a>
<section class="hero">
  <p class="eyebrow">${E(t.ui.ideaCount(c.ideas.length))}</p>
  <h1>${E(ct.title)}</h1>
  <p class="lede">${E(ct.lede)}</p>
  ${dateline(t, c)}
</section>
${groups}
</main>
${deeper(t, c.resources, ct)}`;
  return shell({ t, depth: 2, segs: [c.id], title: `${ct.title} · ${t.ui.site}`, desc: ct.lede, body, og: collectionImage(t, c), langs: langsOf(c) });
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
      <div class="art">${art}</div>
      <div class="count">${j + 1} / ${n}</div>
      <h2>${E(h)}</h2>
      <p>${linked(p, t)}</p>
    </section>`).join("\n")}
  </div></div>
  <div class="controls" hidden>
    <button class="btn" id="prev" type="button">${E(t.ui.back)}</button>
    <div class="dots" role="group" aria-label="${E(t.ui.dotsLabel)}">${slides.map((_, j) => `<button class="dot" type="button" aria-label="${E(t.ui.panelN(j + 1))}"></button>`).join("")}</div>
    <button class="btn primary" id="next" type="button">${E(t.ui.next)}</button>
  </div>
  <div class="hint-row"><p class="hint">${E(t.ui.hint)}</p>${shareButton(t, gist, "share-row")}</div>
  </div>
  <div class="stack-next">
  ${pager}
  </div>
</main>`;
}

// A book review as a card stack: one panel per idea from the review, ending with a link to the full review.
export function bookStackPage(t, b) {
  const bl = b[t.lang], to = linker(2), where = `${t.lang}/${b.slug}`, full = b.full?.[t.lang];
  const fullUrl = full ? to(t.lang, b.slug, "full") : to(t.lang);
  const slides = b.panels.map((spec, j) => {
    const [h, p] = bl.panels[j];
    const art = spec[0] === "photo"
      ? `<img class="photo-panel" src="../../photos/${b.slug}/${spec[1]}" alt="${E(bl.captions[spec[1]].replace(/\*/g, ""))}" loading="${j ? "lazy" : "eager"}">`
      : sketchPicture(bookArt(t, b, spec, `${where}#${j + 1}`), { label: h });
    return { art, h, p };
  });
  const data = { "prev-url": "", "next-url": fullUrl, "t-back": t.ui.back, "t-prev-idea": t.ui.prevIdea, "t-next": t.ui.next,
    "t-next-idea": full ? t.ui.fullReviewNext : t.ui.done, "t-done": t.ui.done };
  const top = `<a class="back" href="${to(t.lang)}">← ${E(t.ui.allTopics)}</a>
  <p class="eyebrow">${E(t.ui.bookReview)} · ${E(b.author)}</p>`;
  const pager = (full ? `<a class="next" href="${fullUrl}"><small>${E(t.ui.fullReview)}</small><strong>${E(full.title)}</strong></a>` : "") + relatedCard(t, b, to);

  const body = `<div class="layout solo">
${cardStack({ t, slides, data, top, title: bl.title, gist: bl.abstract.replace(/\*/g, ""), meta: dateline(t, b), pager: pager && `<nav class="pager">${pager}</nav>` })}
</div>`;
  return shell({ t, depth: 2, segs: [b.slug], title: `${bl.title} · ${t.ui.site}`, desc: bl.abstract.replace(/\*/g, ""), body, og: bookImage(t, b), langs: LANGS.filter(o => b[o.lang]) });
}

// An idea inside collection c (at position i), or a standalone idea when c is null.
export function ideaPage(t, idea, c = null, i = 0) {
  const ct = c && t.collections[c.id], it = t.ideas[idea.slug], n = idea.panels.length, to = linker(2);
  const before = c?.ideas[i - 1], after = c?.ideas[i + 1], total = c ? c.ideas.length : 1;
  const slides = idea.panels.map((spec, j) => ({ art: drawing(t, spec, it.panels[j][0], `${t.lang}/${idea.slug}#${j + 1}`), h: it.panels[j][0], p: it.panels[j][1] }));
  const item = (s, k) => `<li><a href="${to(t.lang, s.slug)}"${k === i ? ' aria-current="page"' : ""}>${total > 1 ? `<span class="n">${k + 1}</span>` : ""}<span>${E(titleIn(t, t.ideas[s.slug].title, ct.chapters?.[s.chapter]))}</span></a></li>`;
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
${cardStack({ t, slides, data, top, title: total > 1 ? titleIn(t, it.title, ct.chapters?.[idea.chapter]) : it.title, gist: it.gist, meta: c ? "" : dateline(t, idea), pager: pager && `<nav class="pager">${pager}</nav>` })}
${toc}
</div>
${c ? deeper(t, c.resources, ct) : idea.resources?.length ? deeper(t, idea.resources, it) : ""}`;
  return shell({ t, depth: 2, segs: [idea.slug], title: `${it.title} · ${t.ui.site}`, desc: it.gist, body, og: ideaImage(t, idea), langs: langsOf(c || idea) });
}

// A book review as one article, in the reviewer's own words: intro, their sections (with drawings where set),
// quotes, and the conclusion. With parent, it is that card stack's full review, one level below it.
export function bookPage(t, b, parent = null) {
  const bl = b[t.lang], depth = parent ? 3 : 2, to = linker(depth), rel = "../".repeat(depth), where = `${t.lang}/${b.slug}${parent ? "/full" : ""}`;
  // one of the reviewer's photos where the review put it in the text, with its caption; it opens full size
  const photoFigure = file => {
    const [w, h] = jpegSize(photoSource(b, file)), src = `${rel}photos/${b.slug}/${file}`, caption = bl.captions[file];
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
      const [w, h] = jpegSize(photoSource(b, file)), src = `${rel}photos/${b.slug}/${file}`, caption = bl.captions[file];
      return `<li><a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${E(caption.replace(/\*/g, ""))}" width="${w}" height="${h}" loading="lazy" decoding="async"></a><span>${rich(caption)}</span></li>`;
    }).join("")}</ul>
  </section>`;
  // a section opens with a drawing, or with one of the reviewer's photos (["photo", file]) where the review had one
  const figure = n => {
    const spec = b.art.sections?.[n];
    if (!spec) return "";
    if (spec[0] === "photo") return photoFigure(spec[1]);
    return `<figure><div class="art">${sketchPicture(bookArt(t, b, spec, `${where} §${n}`), { label: bl.sections[n - 1].h, lazy: true })}</div></figure>`;
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
  ${dateline(t, b, t.ui.readTime(readMinutes(t, bl)))}
  ${parent ? `<a class="quick-link" href="${to(t.lang, parent.slug)}">${E(t.ui.quickLink(parent.panels.length))}</a>` : ""}
  <div class="book-head${b.cover ? "" : " no-photo"}">
    ${b.cover ? (() => {
      const [w, h] = jpegSize(photoSource(b, b.cover));
      return `<figure class="book-photo"><img src="${rel}photos/${b.slug}/${b.cover}" alt="${E(bl.captions[b.cover].replace(/\*/g, ""))}" width="${w}" height="${h}"></figure>`;
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
    ${shareButton(t, bl.abstract.replace(/\*/g, ""))}
  </article>
</main>`;
  return shell({ t, depth, segs: parent ? [parent.slug, "full"] : [b.slug], title: `${bl.title} · ${parent ? `${t.ui.fullReview} · ` : ""}${t.ui.site}`,
    desc: bl.abstract.replace(/\*/g, ""), body, og: bookImage(t, b, parent ? `${parent.slug}-full` : b.slug), langs: LANGS.filter(o => b[o.lang]) });
}
