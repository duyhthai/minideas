// Pictures: drawings, shown as pencil sketches, and link-preview images. Pages register the pictures they use while
// they are made; writePictures() then renders them, taking unchanged ones from the cache.
import { E } from "../draw.js";
import { SHELF, BOOKS, ART } from "../content.js";
import { renderOg, renderHomeOg, drawingViewBox } from "../og.js";
import { renderSketch, sketchShapes, sketchLabels } from "../sketch.js";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { ROOT, CACHE, SITE_URL } from "./config.js";
import { BRAND_MARK } from "./icons.js";
import { ALL_IDEAS, firstDrawing, photoSource, sizeOf } from "./shelves.js";
import { problems } from "./checks.js";

export function art(t, [fn, ...args], where) {
  if (!ART[fn]) { problems.push(`${where}: no drawing called "${fn}"`); return ""; }
  const svg = ART[fn](t.art, ...args);
  if (/undefined|NaN/.test(svg)) problems.push(`${where}: drawing "${fn}" is missing a label or has a bad number`);
  return svg;
}
// Drawings are pencil sketches: a drawing's shapes are a picture, rendered at build time by src/sketch.js, one per
// theme, with its labels on top as real text so readers can copy them. Pictures are named after their shapes, so a
// drawing that looks the same in both languages is one file. In a card stack the picture is a CSS background
// (style.css, .sk): every card shows at once (Chrome doesn't reliably load lazy images in a sideways scroller) and
// only the current theme's picture downloads; its path starts at the site root, because a url() in a custom property
// resolves against the stylesheet that uses it. Elsewhere (lazy) it's a pair of lazy images, and the hidden theme's
// one never loads.
export const sketches = {}; // path → what to render; written after the pages, cached like the preview images
export function sketchPicture(svg, { viewBox = "0 0 320 220", label = "", lazy = false } = {}) {
  const [, , w, h] = viewBox.split(" ").map(Number), shapes = sketchShapes(svg), url = {};
  const id = createHash("sha1").update(viewBox + shapes).digest("hex").slice(0, 12);
  for (const theme of ["light", "dark"]) {
    const path = `sketch/${id}-${theme}.webp`;
    sketches[path] = { drawing: shapes, theme, viewBox };
    url[theme] = `/${path}`;
  }
  const labels = `<svg viewBox="${viewBox}">${sketchLabels(svg)}</svg>`, a11y = label ? `role="img" aria-label="${E(label)}"` : 'aria-hidden="true"';
  if (lazy) return `<span class="sk" ${a11y} style="aspect-ratio:${w}/${h}">` +
    ["light", "dark"].map(theme => `<img class="sk-${theme}" src="${url[theme]}" alt="" width="${w * 2}" height="${h * 2}" loading="lazy" decoding="async">`).join("") + `${labels}</span>`;
  return `<span class="sk" ${a11y} style="--sk-light:url(${url.light});--sk-dark:url(${url.dark});aspect-ratio:${w}/${h}">${labels}</span>`;
}
export const drawing = (t, spec, label, where) => sketchPicture(art(t, spec, where), { label });

// preview images, rendered after the pages: path → renderOg() options
export const images = {};
// What a preview image is drawn from: the renderer, its options and any photos' bytes. It names the image in the
// render cache, and its start is the image's version in links (ogUrl).
const OG_RENDERER = readFileSync(join(ROOT, "src/og.js"), "utf8") + readFileSync(join(ROOT, "src/sketch.js"), "utf8");
const ogKey = o => {
  // photos by their bytes, not their path, so the version is the same wherever the site is built or the photo sits
  const hash = createHash("sha1").update(OG_RENDERER + JSON.stringify(o, (k, v) => k === "file" ? undefined : v));
  for (const p of [o.photo, ...(o.tiles || []).map(x => x.photo)].filter(Boolean)) hash.update(readFileSync(p.file));
  return hash.digest("hex");
};
// A preview image's address with ?v=<version>. Facebook and LinkedIn keep images by address, even after "Scrape
// Again", so a changed picture needs a new one; the version changes only when the picture does.
export const ogUrl = path => `${SITE_URL}/${path}?v=${ogKey(images[path]).slice(0, 10)}`;
// One image per idea, collection and book: the logo and site name, where it sits (Bài 3/15 · Nền tảng AI, or the
// author), the title, and its first drawing or the book's cover, centred so Facebook's square crop keeps them (og.js)
const brand = t => ({ mark: BRAND_MARK, site: t.ui.site });
export function ideaImage(t, idea) {
  const path = `og/${t.lang}/${idea.slug}.png`, c = SHELF.find(item => item.ideas?.includes(idea));
  const where = c ? [...(c.ideas.length > 1 ? [t.ui.ideaOf(c.ideas.indexOf(idea) + 1, c.ideas.length)] : []), t.collections[c.id].title].join(" · ") : "";
  images[path] ??= { title: t.ideas[idea.slug].title, footer: where, drawing: art(t, idea.panels[0], path), ...brand(t) };
  return path;
}
// A book's drawings get its facts and its own labels as lb.book.
export function bookArt(t, b, spec, where) {
  const bl = b[t.lang];
  return art({ ...t, art: { ...t.art, book: { ...bl.labels, title: bl.title, author: b.author, facts: bl.facts || [] } } }, spec, where);
}
// tile and share image: the title with the reviewer's photo of the book, else the first section drawing
export function bookImage(t, b, name = b.slug) {
  const path = `og/${t.lang}/${name}.png`, first = firstDrawing(b);
  images[path] ??= { title: b[t.lang].title, footer: b.author, ...brand(t),
    ...(b.cover ? { photo: { file: photoSource(b, b.cover), ...sizeOf(photoSource(b, b.cover)) } }
      : { drawing: first ? bookArt(t, b, b.art.sections[first], path) : "" }) };
  return path;
}
// One stack in the home page's preview: its first drawing and title, or a book's cover and its title up to any colon
export function homePreviewTile(t, name, where) {
  const b = BOOKS.find(b => b.slug === name);
  if (b) return { title: b[t.lang].title.split(":")[0], photo: { file: photoSource(b, b.cover), ...sizeOf(photoSource(b, b.cover)) } };
  const item = SHELF.find(item => (item.id || item.slug) === name) || ALL_IDEAS.find(i => i.slug === name);
  const idea = item.ideas ? item.ideas[0] : item;
  return { title: item.ideas ? t.collections[item.id].title : t.ideas[item.slug].title, drawing: art(t, idea.panels[0], where) };
}
export function collectionImage(t, c) {
  const path = `og/${t.lang}/${c.id}.png`;
  images[path] ??= { title: t.collections[c.id].title, footer: t.ui.ideaCount(c.ideas.length), drawing: art(t, c.ideas[0].panels[0], path), ...brand(t) };
  return path;
}
// cropped to what is drawn, so the drawing shows as large as the tile allows
export const tileDrawing = svg => sketchPicture(svg, { viewBox: drawingViewBox(svg), lazy: true });
export function bookTileArt(t, b, rel) {
  if (b.cover) { const { width, height } = sizeOf(photoSource(b, b.cover)); return `<img src="${rel}photos/${b.slug}/${b.cover}" alt="" width="${width}" height="${height}" loading="lazy" decoding="async">`; }
  const first = firstDrawing(b);
  return first ? tileDrawing(bookArt(t, b, b.art.sections[first], `${t.lang}/${b.slug} tile`)) : "";
}
// Writes the preview images and sketches into dir, rendering only the ones not in the cache. Returns how many it rendered.
export async function writePictures(dir) {
  // a preview image is re-rendered only when its inputs change (text, drawing, photo, or the renderer itself)
  let rendered = 0;
  await mkdir(CACHE, { recursive: true });
  for (const [path, o] of Object.entries(images)) {
    const cached = join(CACHE, `${ogKey(o)}.png`);
    if (!existsSync(cached)) { await writeFile(cached, o.home ? renderHomeOg(o) : renderOg(o)); rendered++; }
    await mkdir(dirname(join(dir, path)), { recursive: true });
    await writeFile(join(dir, path), await readFile(cached));
  }
  const sketcher = readFileSync(join(ROOT, "src/sketch.js"), "utf8");
  for (const [path, o] of Object.entries(sketches)) {
    const key = createHash("sha1").update(sketcher + JSON.stringify(o)).digest("hex");
    const cached = join(CACHE, `${key}.webp`);
    if (!existsSync(cached)) { await writeFile(cached, await renderSketch(o.drawing, o.theme, o.viewBox)); rendered++; }
    await mkdir(dirname(join(dir, path)), { recursive: true });
    await writeFile(join(dir, path), await readFile(cached));
  }
  return rendered;
}
