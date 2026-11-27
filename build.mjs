// Builds the static site into dist/:
//   index.html                       picks a language (saved choice, then browser language)
//   <lang>/index.html                home: tiles for collections and standalone ideas, then book reviews
//   <lang>/<collection>/index.html   a collection: one tile per idea
//   <lang>/<slug>/index.html         one idea or one book review, as a swipeable card stack
//   <lang>/<slug>/full/index.html    a book's full review as an article
//   Paths are the same in every language; only the /<lang>/ prefix changes.
//   og/<lang>/<name>.png             one link preview per page (home, collection, idea, book)
//   photos/<book>/<file>             a book reviewer's own photos, copied from src/books/<book>/photos/
//   <lang>/follow/index.html         how to follow new card stacks: an email sign-up (Kit), then the RSS feed
//   <lang>/follow/confirmed/index.html  where Kit sends new subscribers after they confirm (not in the sitemap)
//   <lang>/suggest/index.html        a form for suggesting a topic or sending an article's link (Web3Forms emails it)
//   <lang>/feed.xml                  RSS: everything on the shelves, newest first
//   404.html                         for addresses that don't exist (hosts serve it at any depth)
//   sitemap.xml, robots.txt          every page's address, for search engines
//   Outside dist/, never deployed: node_modules/.cache/newsletter.html, ready-to-paste emails for the newest stacks
//   (the dev server shows it at /newsletter/)
//
//   node build.mjs                    normal build (directory-style links)
//   node build.mjs --explicit-index   links end in index.html (for file hosts without directory indexes)
//   The site's address is https://minideas.com, used for canonical/hreflang links and preview-image tags (social
//   sites only accept absolute image URLs). SITE_URL=https://other.example overrides it, e.g. for a pages.dev test.
//
// This file runs the steps: check the content, make every page, then write them with the assets, icons, photos and
// pictures. The parts are in src/build/: config.js (settings), checks.js, pages.js and site-pages.js (the pages),
// layout.js (what pages share), pictures.js (sketches and preview images), feed.js (RSS and newsletter drafts),
// shelves.js and icons.js. The content comes from src/content.js, which loads src/tech/ and src/books/.
import { E } from "./src/draw.js";
import { BOOKS, LANGS, en } from "./src/content.js";
import { Resvg } from "@resvg/resvg-js";
import { mkdir, rm, writeFile, copyFile, rename } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { ROOT, OUT, TMP, SITE_URL, SUGGEST_KEY } from "./src/build/config.js";
import { siteLinks } from "./src/build/layout.js";
import { COLLECTIONS, ALL_IDEAS, shelfIn, BOOK_PARTS, bookPhotos, photoSource, booksIn } from "./src/build/shelves.js";
import { problems, fail, checkContent } from "./src/build/checks.js";
import { sketches, images, writePictures } from "./src/build/pictures.js";
import { homePage, collectionPage, bookStackPage, ideaPage, bookPage } from "./src/build/pages.js";
import { followPage, confirmedPage, suggestPage, notFoundPage, rootPage } from "./src/build/site-pages.js";
import { feed, NEWSLETTER, newsletterPage } from "./src/build/feed.js";

/* ---------- check ---------- */
checkContent();
if (problems.length) fail();

/* ---------- pages ---------- */
const files = { "404.html": notFoundPage() };
for (const t of LANGS) {
  files[`${t.lang}/index.html`] = homePage(t);
  files[`${t.lang}/follow/index.html`] = followPage(t);
  files[`${t.lang}/follow/confirmed/index.html`] = confirmedPage(t);
  files[`${t.lang}/suggest/index.html`] = suggestPage(t);
  for (const item of shelfIn(t)) {
    if (!item.ideas) { files[`${t.lang}/${item.slug}/index.html`] = ideaPage(t, item); continue; }
    files[`${t.lang}/${item.id}/index.html`] = collectionPage(t, item);
    item.ideas.forEach((idea, i) => files[`${t.lang}/${idea.slug}/index.html`] = ideaPage(t, idea, item, i));
  }
  for (const b of booksIn(t)) {
    files[`${t.lang}/${b.slug}/index.html`] = b.panels ? bookStackPage(t, b) : bookPage(t, b);
    if (b.panels && b.full?.[t.lang]) files[`${t.lang}/${b.slug}/full/index.html`] = bookPage(t, b.full, b);
  }
}
files["index.html"] = rootPage(); // after the home pages: its preview is the Vietnamese home page's
for (const t of LANGS) files[`${t.lang}/feed.xml`] = feed(t);
for (const [lang, slug] of siteLinks) if (!files[`${lang}/${slug}/index.html`]) problems.push(`${lang}: a card links to "${slug}", which isn’t a page in that language`);
// every page (the root only picks a language), at the same addresses as the canonical links
const pageUrls = Object.keys(files).filter(p => p.endsWith("index.html") && p !== "index.html" && !p.endsWith("follow/confirmed/index.html")).map(p => `${SITE_URL}/${p.replace(/index\.html$/, "")}`);
files["sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls.map(u => `<url><loc>${E(u)}</loc></url>`).join("\n")}
</urlset>
`;
files["robots.txt"] = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
if (problems.length) fail();

/* ---------- write ---------- */
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
  await mkdir(join(TMP, "photos", b.slug), { recursive: true });
  await copyFile(photoSource(b, file), join(TMP, "photos", b.slug, file));
}
const rendered = await writePictures(TMP);
await rm(OUT, { recursive: true, force: true });
await rename(TMP, OUT);
await writeFile(NEWSLETTER, newsletterPage());

console.log(`Built ${Object.keys(files).filter(p => p.endsWith(".html")).length} pages, ${Object.keys(images).length} preview images and ${Object.keys(sketches).length} sketches, ${rendered} re-rendered (${ALL_IDEAS.length} ideas, ${COLLECTIONS.length} collection${COLLECTIONS.length === 1 ? "" : "s"}, ${BOOKS.length} book${BOOKS.length === 1 ? "" : "s"}) for ${LANGS.map(t => t.lang).join(", ")} into ${OUT.startsWith(ROOT) ? relative(ROOT, OUT) : OUT}/`);
if (!SUGGEST_KEY) console.log("Note: the suggestion form has no Web3Forms key yet (SUGGEST_KEY in src/build/config.js), so it can't send.");
if (!SITE_URL) console.log("Note: SITE_URL is not set, so pages don't point to their preview images yet. Set it when you deploy.");
