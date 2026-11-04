# Ideas Illustrated

Static, bilingual (English / Vietnamese) site of illustrated explainers and book reviews. Product notes: `ideas-illustrated.md`.

## Commands

- `npm run build`: builds everything into `dist/` (pages, preview images, photos). Takes about 10s, mostly PNG rendering.
- `npm run preview`: build, then serve `dist/` at http://localhost:4321.
- `SITE_URL=https://domain npm run build`: needed for real deploys. Social sites only accept absolute `og:image` URLs; without it the image tags are left out.
- `node build.mjs --explicit-index`: links end in `index.html`, for hosts without directory indexes.
- `node tools/import-review.mjs <id> <slug>`: turns a Sâu Sách review into `src/books/<slug>.js`.

There are no tests. The build is the check: it stops and lists problems (missing text in a language, panel or section counts that don't match, drawings that output `undefined`/`NaN`, missing photos or captions, duplicate names). Never edit `dist/`; it is deleted on every build.

## How content is organised

- `src/stacks.js` holds `SHELF`, the home page "Ideas" list in order. An item is either a **collection** (`id`, `chapters`, `resources`, `ideas`) or a **standalone idea** (`slug`, `panels`, `resources`). Each panel is `[drawingName, ...args]` pointing at a function in `src/draw.js`.
- `src/i18n/en.js` and `src/i18n/vi.js` hold all words: `ui`, `collections[id]`, `ideas[slug]` (title, gist, one `[heading, text]` per panel, `links` for a standalone idea's resources), and `art`, the labels used inside drawings.
- `src/books/<slug>.js` holds one book review each, with `vi` and an optional `en`, listed in `src/books/index.js`. A book without `en` appears only on the Vietnamese site.
- `src/draw.js` is the drawing vocabulary. Every drawing is a 320×220 SVG fragment built from helpers (`T`, `L`, `C`, `R`, `P`, `A`, `pill`, `fig`). It receives the language's label table as `lb`.
- `src/og.js` renders 1200×630 PNGs with resvg: one per idea, collection and book, used both as home tiles and as link previews.
- `build.mjs` produces pages at `/<lang>/`, `/<lang>/<collection>/` and `/<lang>/<slug>/`. Collections, ideas and books share one URL namespace.
- `ideas/` is source material (PDFs, the Sâu Sách backup and export, photos). It is not part of the site.

## Adding things

- **Idea:** add panels to `stacks.js`, the words to **both** i18n files, and any new drawing to `draw.js`. Every visible string must exist in both languages.
- **Book review:** run the importer. Copy the reviewer's photos into `src/books/photos/<slug>/`, set `cover` (the reviewer's own photo of the book) and the `photos` gallery list, and add a caption per language for each photo. Section drawings are optional, set in `art.sections: { <section number>: [drawing] }`, with their labels in `vi.labels` / `en.labels`.
- After visual changes, render and look at them. For drawings, put every panel on one contact sheet and screenshot it with headless Chrome. For pages, screenshot at about 1100px and 390px wide (use an iframe for 390px, because headless Chrome enforces a minimum window width). Check Vietnamese too: its labels run longer.

## Drawing pitfalls

- CSS class rules override SVG presentation attributes, so `T()` sets font size as an inline `style`. Don't switch it back to `font-size="…"`.
- Use `T(..., { max: width })` for any label that may run long in Vietnamese; it shrinks the font to fit. Use `\n` for line breaks.
- Text on pastel fills needs the `on` class (dark in both themes). Every color is a token in `style.css`, with light and dark values.
- Patrick Hand has no ← → glyphs. Browsers fall back per character, but resvg switches the whole label to another font, so `og.js` swaps arrows for ASCII. If you add other special characters to labels, check them against the font's cmap with fontTools.
- Fonts must cover Vietnamese: Bricolage Grotesque (display), Lexend (body), Patrick Hand (drawings). The TTFs in `src/fonts/` are only for resvg; pages load the fonts from Google Fonts.

## Owner preferences

- **Book reviews keep the reviewer's own words**: their sections, paragraphs and quotes, in their order. Don't write new opinions, verdicts, comparisons or reading-time claims. English versions are faithful translations, with a note that quotes are translated back from the Vietnamese edition. Point out typos in the original, but don't fix them silently.
- **No scores or ratings** anywhere.
- **Book pages** read as one article: drawn section illustrations inline, and the reviewer's photos together in one gallery before the conclusion, never scattered through the text. The header, tile and share image use the reviewer's own photo of the book. Don't use publisher cover images or author portraits.
- **"Go deeper" links** must be publicly accessible. No login-gated or vendor training portals.
- **Keep it simple:** static files, no database, no runtime dependencies. `@resvg/resvg-js` is the only (build-time) package.
- **Home page stays compact:** one tile per collection, standalone idea or book. A collection's ideas are listed on its own page.
- Vietnamese text should be checked by a native speaker before launch.

## Data and privacy

`ideas/sausach/SauSach2.bak` is a SQL Server 2012 backup that includes member emails and password hashes. Never publish it or copy member data into the site. `ideas/sausach/sausach-reviews.json` is the export used by the importer: published reviews only, book and review fields only. To re-export, restore the backup into a temporary `mcr.microsoft.com/mssql/server:2022-latest` container (`--platform linux/amd64`, backup folder mounted read-only), query the `Reviews`, `Authors`, `Publishers` and `Genres` tables, then remove the container.
