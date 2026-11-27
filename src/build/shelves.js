// What's on the shelves, as the pages need it: collections and standalone ideas and the languages each is in, books
// and their photos, and when each went on the site.
import { SHELF, BOOKS, LANGS } from "../content.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./config.js";

export const COLLECTIONS = SHELF.filter(item => item.ideas);
export const STANDALONE = SHELF.filter(item => !item.ideas);
export const ALL_IDEAS = SHELF.flatMap(item => item.ideas || [item]);
// A collection or standalone idea is published in each language that has its text (a collection's own text): one
// language is enough, the other can be translated later. A collection in a language needs all its ideas in it.
export const inLang = (t, item) => !!(item.ideas ? t.collections[item.id] : t.ideas[item.slug]);
export const shelfIn = t => SHELF.filter(item => inLang(t, item));
export const langsOf = item => LANGS.filter(o => inLang(o, item));
export const BOOK_PARTS = BOOKS.flatMap(b => [b, ...(b.full ? [b.full] : [])]);
// the language a book was written in (Vietnamese for the Sâu Sách reviews): its photos and sections are counted from it
export const original = b => b.vi || b.en;
// every photo a book uses: cover, gallery, photo panels, section photos and photos in the text ({ photo: file } blocks),
// all in src/books/<slug>/photos/
export function bookPhotos(b) {
  const photo = specs => specs.filter(p => p[0] === "photo").map(p => p[1]);
  const inText = [...(original(b).intro || []), ...(original(b).sections || []).flatMap(s => s.body)].map(x => x?.photo);
  return [b.cover, ...(b.photos || []), ...photo(b.panels || []), ...photo(Object.values(b.art?.sections || {})), ...inText].filter(Boolean);
}
// the first section with a drawing (not a photo), for a book without a cover photo
export const firstDrawing = b => Object.keys(b.art?.sections || {}).filter(n => b.art.sections[n][0] !== "photo").sort((x, y) => x - y)[0];
export function photoSource(b, file) { return join(ROOT, "src/books", b.slug, "photos", file); }
// width × height from a JPEG's frame header, so the page reserves the right space before the photo loads
export function jpegSize(file) {
  const buf = readFileSync(file);
  for (let i = 2; i + 9 < buf.length;) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return [0, 0];
}
export const booksIn = t => BOOKS.filter(b => b[t.lang]);
// When something went on the site: a collection's or standalone idea's `date`, a book's `added` (a book's `date` is
// when the review was written, e.g. when it first appeared on Sâu Sách). Things added after launch day (the earliest of these) are marked "New".
export const siteDate = item => item.added || item.date;
export const LAUNCH = [...SHELF, ...BOOKS].map(siteDate).sort()[0];
export const NEW_DAYS = 14;
export const sizeOf = file => { const [width, height] = jpegSize(file); return { width, height }; };
