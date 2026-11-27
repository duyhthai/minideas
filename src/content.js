// Everything on the shelves, loaded from its folders: the tech topics in src/tech/ (in the order of src/tech/index.js) and
// the books in src/books/ (in the order of src/books/index.js). Their drawings are gathered into ART, and each
// language's words into one table: the site's own words (src/i18n/<lang>.js) plus every topic's collections, ideas
// and drawing labels (src/tech/<topic>/<lang>.js). A name may be used only once: two drawings, ideas or label
// groups with the same name stop the build.
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
function add(table, name, value, what) {
  if (name in table) throw new Error(`two ${what} are called "${name}"`);
  table[name] = value;
}

const UIS = [enUi, viUi];
export const SHELF = [], BOOKS = [], ART = {};
export const LANGS = UIS.map(ui => ({ ...ui, collections: {}, ideas: {}, art: {} }));

for (const name of TOPICS) {
  const stack = await load(`./tech/${name}/stack.js`);
  if (!stack) throw new Error(`src/tech/index.js lists "${name}", but src/tech/${name}/stack.js doesn't exist`);
  if ((stack.id || stack.slug) !== name) throw new Error(`src/tech/${name}/stack.js: its ${stack.id ? "id" : "slug"} should be "${name}", like its folder`);
  SHELF.push(stack);
  for (const [n, draw] of Object.entries(await load(`./tech/${name}/draw.js`) || {})) add(ART, n, draw, "drawings");
  for (const t of LANGS) {
    const words = await load(`./tech/${name}/${t.lang}.js`) || {};
    for (const part of ["collections", "ideas", "art"])
      for (const [n, value] of Object.entries(words[part] || {})) add(t[part], n, value, `${t.lang} ${part}`);
  }
}
for (const name of BOOK_NAMES) {
  const book = await load(`./books/${name}/book.js`);
  if (!book) throw new Error(`src/books/index.js lists "${name}", but src/books/${name}/book.js doesn't exist`);
  if (book.slug !== name) throw new Error(`src/books/${name}/book.js: its slug should be "${name}", like its folder`);
  BOOKS.push(book);
  for (const [n, draw] of Object.entries(await load(`./books/${name}/draw.js`) || {})) add(ART, n, draw, "drawings");
}
export const [en, vi] = LANGS;
