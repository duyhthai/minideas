// What the build checks before writing anything: names, text in each language, panel and section counts, dates,
// photos and captions, and links between stacks. Each problem is collected, so the build can list them all at once;
// drawings and links in card text add theirs while the pages are made (pictures.js, layout.js).
import { SHELF, BOOKS, LANGS, LOAD_PROBLEMS } from "../content.js";
import { existsSync } from "node:fs";
import { KIT_FORMS, HOME_PREVIEW } from "./config.js";
import { COLLECTIONS, STANDALONE, inLang, shelfIn, langsOf, BOOK_PARTS, original, bookPhotos, photoSource } from "./shelves.js";

export const problems = [];
export function fail() {
  console.error("Build stopped:\n  " + problems.join("\n  "));
  process.exit(1);
}

export function checkContent() {
  problems.push(...LOAD_PROBLEMS);
  const seen = new Set(); // collections and ideas share one URL space
  for (const name of [...SHELF.flatMap(item => item.ideas ? [item.id, ...item.ideas.map(i => i.slug)] : [item.slug]), ...BOOKS.map(b => b.slug)]) {
    if (seen.has(name) || ["home", "follow", "suggest"].includes(name)) problems.push(`the name "${name}" is used twice or is taken by the site (collections and ideas need different names)`);
    seen.add(name);
  }
  for (const item of SHELF) if (!langsOf(item).length) problems.push(`"${item.id || item.slug}": no text in any language (src/tech/<topic>/en.js or vi.js)`);
  for (const t of LANGS) {
    if (!KIT_FORMS[t.lang]) problems.push(`${t.lang}: no Kit form for the email sign-up (KIT_FORMS in src/build/config.js)`);
    for (const c of COLLECTIONS.filter(c => inLang(t, c))) {
      const ct = t.collections[c.id];
      for (const ch of c.chapters || []) if (!ct.chapters?.[ch]) problems.push(`${t.lang}/${c.id}: no name for chapter "${ch}"`);
      for (const r of c.resources) if (!ct.links?.[r.key]) problems.push(`${t.lang}/${c.id}: no description for link "${r.key}"`);
    }
    for (const idea of shelfIn(t).flatMap(item => item.ideas || [item])) {
      const it = t.ideas[idea.slug];
      if (!it) problems.push(`${t.lang}: no text for "${idea.slug}"`);
      else if (it.panels.length !== idea.panels.length) problems.push(`${t.lang}/${idea.slug}: ${it.panels.length} panels of text, ${idea.panels.length} drawings`);
    }
    for (const idea of STANDALONE.filter(i => inLang(t, i))) for (const r of idea.resources || []) if (!t.ideas[idea.slug].links?.[r.key]) problems.push(`${t.lang}/${idea.slug}: no description for link "${r.key}"`);
  }
  // each shelf item shows when it was published: a collection on its own page (not on each idea), a standalone idea on its page
  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
  for (const item of SHELF) if (!ISO_DATE.test(item.date || "")) problems.push(`"${item.id || item.slug}": no date (YYYY-MM-DD)`);
  // A book needs text in one language at least (the other can be translated later); a translation must match the
  // original's panels and sections.
  for (const b of BOOK_PARTS) {
    if (!original(b)) { problems.push(`book "${b.slug}": no text in any language (vi or en)`); continue; }
    if (!ISO_DATE.test(b.date || "")) problems.push(`book "${b.slug}": no date (YYYY-MM-DD) for when the review was published`);
    const parts = b.panels ? ["panels"] : ["intro", "sections"];
    for (const t of LANGS) {
      const bl = b[t.lang];
      if (!bl) continue;
      for (const k of ["title", "abstract", ...parts]) if (!bl[k]) problems.push(`book "${b.slug}" (${t.lang}): missing ${k}`);
      if (b.panels && bl.panels?.length !== b.panels.length) problems.push(`book "${b.slug}" (${t.lang}): ${bl.panels?.length} panels of text, ${b.panels.length} pictures`);
      if (!b.panels && bl.sections?.length !== original(b).sections.length) problems.push(`book "${b.slug}" (${t.lang}): ${bl.sections?.length} sections, the original has ${original(b).sections.length}`);
    }
    for (const n of Object.keys(b.art?.sections || {})) if (!original(b).sections?.[n - 1]) problems.push(`book "${b.slug}": a drawing is set for section ${n}, which doesn't exist`);
    for (const file of bookPhotos(b)) {
      if (!existsSync(photoSource(b, file))) problems.push(`book "${b.slug}": photo src/books/${b.slug}/photos/${file} not found`);
      for (const t of LANGS) if (b[t.lang] && !b[t.lang].captions?.[file]) problems.push(`book "${b.slug}" (${t.lang}): no caption for ${file}`);
    }
  }
  for (const b of BOOKS) if (!ISO_DATE.test(b.added || "")) problems.push(`book "${b.slug}": no added date (YYYY-MM-DD) for when it went on the site`);
  // `related`: one stack worth reading next (an idea, a collection or a book, on either shelf), shown at the end of a
  // standalone idea or a book, and after a collection's last idea
  for (const name of HOME_PREVIEW) if (!seen.has(name)) problems.push(`HOME_PREVIEW: "${name}" isn't a collection, idea or book`);
  for (const item of [...SHELF, ...BOOKS]) if (item.related && !seen.has(item.related)) problems.push(`"${item.id || item.slug}": related "${item.related}" isn't a collection, idea or book`);
}
