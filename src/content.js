// Everything on the shelves, loaded from its folders: the tech topics in src/tech/ (in the order of src/tech/index.js) and
// the books in src/books/ (in the order of src/books/index.js). Their drawings are gathered into ART, and each
// language's words into one table: the site's own words (src/i18n/<lang>.js) plus every topic's collections, ideas
// and drawing labels (src/tech/<topic>/<lang>.js). A name may be used only once: two drawings, ideas or label
// groups with the same name stop the build. Problems found here (a listed folder that's missing, a folder named
// differently from its slug, a name used twice) go in LOAD_PROBLEMS, which the build lists with the others.
import { existsSync } from "node:fs";
import { SHELF as TOPICS } from "./tech/index.js";
import { BOOKS as BOOK_NAMES } from "./books/index.js";
import enUi from "./i18n/en.js";
import viUi from "./i18n/vi.js";

// a folder's file, or null if it has none
async function load(path) {
  const url = new URL(path, import.meta.url);
  return existsSync(url) ? (await import(url)).default : null;
}
export const LOAD_PROBLEMS = [];
// adds a drawing, idea or label group to its table, unless the name is taken; from: the file it comes from
const origin = new Map();
function add(table, name, value, what, from) {
  if (name in table) { LOAD_PROBLEMS.push(`two ${what} are called "${name}": in ${origin.get(table)[name]} and ${from}`); return; }
  table[name] = value;
  if (!origin.has(table)) origin.set(table, {});
  origin.get(table)[name] = from;
}

const UIS = [enUi, viUi];
export const SHELF = [], BOOKS = [], ART = {};
export const LANGS = UIS.map(ui => ({ ...ui, collections: {}, ideas: {}, art: {} }));

for (const name of TOPICS) {
  const stack = await load(`./tech/${name}/stack.js`);
  if (!stack) { LOAD_PROBLEMS.push(`src/tech/index.js lists "${name}", but src/tech/${name}/stack.js doesn't exist`); continue; }
  if ((stack.id || stack.slug) !== name) { LOAD_PROBLEMS.push(`src/tech/${name}/stack.js: its ${stack.id ? "id" : "slug"} should be "${name}", like its folder`); continue; }
  SHELF.push(stack);
  for (const [n, draw] of Object.entries(await load(`./tech/${name}/draw.js`) || {})) add(ART, n, draw, "drawings", `src/tech/${name}/draw.js`);
  for (const t of LANGS) {
    const words = await load(`./tech/${name}/${t.lang}.js`) || {};
    for (const part of ["collections", "ideas", "art"])
      for (const [n, value] of Object.entries(words[part] || {})) add(t[part], n, value, `${t.lang} ${part === "art" ? "label groups (art)" : part}`, `src/tech/${name}/${t.lang}.js`);
  }
}
for (const name of BOOK_NAMES) {
  const book = await load(`./books/${name}/book.js`);
  if (!book) { LOAD_PROBLEMS.push(`src/books/index.js lists "${name}", but src/books/${name}/book.js doesn't exist`); continue; }
  if (book.slug !== name) { LOAD_PROBLEMS.push(`src/books/${name}/book.js: its slug should be "${name}", like its folder`); continue; }
  BOOKS.push(book);
  for (const [n, draw] of Object.entries(await load(`./books/${name}/draw.js`) || {})) add(ART, n, draw, "drawings", `src/books/${name}/draw.js`);
}
// A book's `date` is when the review was written, if not the day it went on the site (`added`); a full review shares
// its card stack's slug, author, date and cover unless it sets its own.
for (const b of BOOKS) {
  b.date ||= b.added;
  if (b.full) for (const k of ["slug", "author", "date", "cover"]) b.full[k] ??= b[k];
}
export const [en, vi] = LANGS;
