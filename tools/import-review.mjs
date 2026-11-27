// Turns one Sâu Sách review into a book file for the site, keeping the original words.
//
//   node tools/import-review.mjs <review id> <slug>     e.g.  node tools/import-review.mjs 2 outliers
//
// Reads ideas/sausach/sausach-reviews.json (exported from the SauSach2 database: book and review fields only)
// and writes src/books/<slug>/full.js with the Vietnamese text split into intro, sections (your headings),
// paragraphs and quotes. *text* marks italics, **text** bold. English is left as null until written.
// date: when the review was published on Sâu Sách (reviewedDate in the export).
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const [id, slug] = process.argv.slice(2);
if (!id || !/^[a-z0-9-]+$/.test(slug || "")) {
  console.error("Usage: node tools/import-review.mjs <review id> <slug>   (slug: lowercase letters, digits, dashes)");
  process.exit(1);
}

const reviews = JSON.parse(await readFile(join(ROOT, "ideas/sausach/sausach-reviews.json"), "utf8"));
const r = reviews.find(x => String(x.id) === String(id));
if (!r) { console.error(`No published review with id ${id}. Ids: ${reviews.map(x => x.id).join(", ")}`); process.exit(1); }
const out = join(ROOT, "src/books", slug, "full.js");
if (await access(out).then(() => true, () => false)) { console.error(`${out} already exists; delete it first to re-import.`); process.exit(1); }

/* ---------- HTML → text blocks ---------- */
const ENTITIES = {
  nbsp: 160, amp: 38, lt: 60, gt: 62, quot: 34, apos: 39, hellip: 8230, ndash: 8211, mdash: 8212,
  lsquo: 8216, rsquo: 8217, ldquo: 8220, rdquo: 8221, laquo: 171, raquo: 187, ccedil: 231, Ccedil: 199,
  agrave: 224, aacute: 225, acirc: 226, atilde: 227, auml: 228, egrave: 232, eacute: 233, ecirc: 234, euml: 235,
  igrave: 236, iacute: 237, icirc: 238, ograve: 242, oacute: 243, ocirc: 244, otilde: 245, ouml: 246,
  ugrave: 249, uacute: 250, ucirc: 251, uuml: 252, yacute: 253,
  Agrave: 192, Aacute: 193, Acirc: 194, Atilde: 195, Egrave: 200, Eacute: 201, Ecirc: 202,
  Igrave: 204, Iacute: 205, Ograve: 210, Oacute: 211, Ocirc: 212, Otilde: 213, Ugrave: 217, Uacute: 218, Yacute: 221,
};
const unknown = new Set();
const decode = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : +e.slice(1));
  if (ENTITIES[e]) return String.fromCodePoint(ENTITIES[e]);
  unknown.add(m); return m;
});
// inline HTML → plain text with *italic* / **bold**
const inline = html => decode(html
  .replace(/<(strong|b|em|i)\b[^>]*>(\s|&nbsp;)*<\/\1>/gi, " ") // empty formatting
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/<\/?strong[^>]*>/gi, "**").replace(/<\/?b>/gi, "**")
  .replace(/<\/?em[^>]*>/gi, "*").replace(/<\/?i>/gi, "*")
  .replace(/<[^>]+>/g, ""))
  .replace(/ /g, " ").replace(/[ \t\r\n]+/g, " ").trim();

const intro = [], sections = [];
let current = null;
const add = block => (current ? current.body : intro).push(block);
// paragraphs are <p>, or sometimes a <div> with no blocks inside (review #6)
for (const m of (r.content || "").matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>|<p[^>]*>([\s\S]*?)<\/p>|<div[^>]*>((?:(?!<\/?(?:div|p|blockquote)\b)[\s\S])*?)<\/div>/gi)) {
  if (m[1] !== undefined) {
    const parts = [...m[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(p => inline(p[1])).filter(Boolean);
    for (const q of parts.length ? parts : [inline(m[1])].filter(Boolean)) add({ quote: q });
    continue;
  }
  const raw = m[2] ?? m[3], text = inline(raw);
  if (!text || /^\**$/.test(text)) continue; // e.g. an image wrapped in <strong>
  const size = +(raw.match(/font-size:\s*(\d+)px/i) || [])[1] || 0;
  const allBold = /^\*\*[^*]+\*\*$/.test(text);
  if (allBold && size >= 18) { current = { h: text.replace(/\*\*/g, ""), body: [] }; sections.push(current); }
  else add(text);
}

/* ---------- write the book file ---------- */
const clean = s => (s ? inline(s) : null);
const vi = {
  title: clean(r.title),
  originalTitle: clean(r.originalTitle),
  abstract: clean(r.abstract),
  edition: [r.publisher && `NXB ${r.publisher}`, r.translator && `${r.translator} dịch`].filter(Boolean).join(" · ") || null,
  facts: [r.pages && `${r.pages} trang`, r.level && `Độ khó: ${r.level}`, r.format, r.price].filter(Boolean),
  intro,
  sections,
  conclusion: clean(r.conclusion),
  labels: {},
};
const file = `// Imported from Sâu Sách review #${r.id} by tools/import-review.mjs. The Vietnamese text is the original review.
// cover (optional): file name of your photo of the book in photos/ (next to this file), used in the page header,
// the home tile and the share image. art.sections (optional): { <section number>: [drawing, ...args] }; their words
// go in vi.labels / en.labels. photos (optional): more of your photos for the gallery before the conclusion.
// Every photo needs a caption per language in vi.captions / en.captions, keyed by file name.
// en: null until the English version is written; the book then only appears on the Vietnamese site.
export default ${JSON.stringify({
  slug, author: r.author, genres: r.genres || null, source: "Sâu Sách", date: r.reviewedDate || null,
  cover: null,
  art: {},
  photos: [],
  vi,
  en: null,
}, null, 2)};
`;
await mkdir(dirname(out), { recursive: true });
await writeFile(out, file);
console.log(`Wrote src/books/${slug}/full.js: ${intro.length} intro paragraphs, ${sections.length} sections${vi.conclusion ? ", conclusion" : ""}.`);
if (unknown.size) console.log(`Check these entities by hand: ${[...unknown].join(" ")}`);
console.log(`Next: copy the photos into src/books/${slug}/photos/, write the card stack in src/books/${slug}/book.js (see
src/books/outliers/book.js; it imports ./full.js as \`full\`), add "${slug}" to BOOKS in src/books/index.js, then run
npm run build. To publish only the full review, make book.js just: export { default } from "./full.js";`);
