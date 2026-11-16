# Minideas

Static, bilingual (English / Vietnamese) site of illustrated explainers and book reviews, at https://minideas.com. Product notes: `minideas.md`.

## Commands

- `npm run build`: builds everything into `dist/` (pages, preview images, photos). Preview images are cached in `node_modules/.cache/og/`, so a rebuild takes about a second; a cold build takes about 10s.
- `npm run dev` (or `npm run preview`): serves `dist/` at http://localhost:4321, rebuilds when `src/` or `build.mjs` changes, and reloads open pages. The owner keeps it running: **never kill port 4321**. To check changes, wait for the rebuild and screenshot http://localhost:4321 with `?noreload` (the reload connection never settles, so headless Chrome would hang); for one-off pages, write them into `dist/` (the next rebuild removes them). Don't run `npm run build` while the dev server is running: both builds delete `dist/` and can leave it half empty. Edit `src/`, then wait for the rebuilt file to appear. To see build errors without touching `dist/`, build somewhere else: `OUT_DIR=<scratch folder> node build.mjs`.
- The site address defaults to https://minideas.com (absolute `og:image`, canonical and hreflang links). Override it with `SITE_URL=https://… npm run build`, e.g. for a `pages.dev` test deploy.
- `node build.mjs --explicit-index`: links end in `index.html`, for hosts without directory indexes.
- `node tools/import-review.mjs <id> <slug>`: turns a Sâu Sách review into `src/books/<slug>-full.js`.

There are no tests. The build is the check: it stops and lists problems (missing text in a language, panel or section counts that don't match, drawings that output `undefined`/`NaN`, missing photos or captions, duplicate names). Never edit `dist/`; it is deleted on every build.

## How content is organised

- `src/stacks.js` holds `SHELF`, the home page "Tech" (Công nghệ) shelf in order; books form the "Books" (Sách) shelf. Shelf icons are `SHELF_ICONS` in `build.mjs`. An item is either a **collection** (`id`, `chapters`, `resources`, `ideas`) or a **standalone idea** (`slug`, `panels`, `resources`). Any item, and any book, can name one `related` stack (a slug on either shelf), shown as a card at the end; a collection's shows after its last idea. Each panel is `[drawingName, ...args]` pointing at a function in `src/draw.js`.
- `src/i18n/en.js` and `src/i18n/vi.js` hold all words: `ui`, `collections[id]`, `ideas[slug]` (title, gist, one `[heading, text]` per panel, `links` for a standalone idea's resources), and `art`, the labels used inside drawings.
- `src/books/<slug>.js` is a book: a card stack of `panels` (one per idea of the review, with `vi` / `en` text), listed in `src/books/index.js`. It can carry the full review in `full` (imported from `<slug>-full.js`, an article: intro, sections, quotes, conclusion, gallery), published at `/<lang>/<slug>/full/`. A book without `en` appears only on the Vietnamese site.
- `src/draw.js` is the drawing vocabulary. Every drawing is a 320×220 SVG fragment built from helpers (`T`, `L`, `C`, `R`, `P`, `A`, `pill`, `fig`). It receives the language's label table as `lb`.
- `src/og.js` renders 1200×630 PNGs with resvg: one per page (home, idea, collection, book), used as link previews. Tiles on the site draw the first panel inline instead, so they follow the theme.
- `build.mjs` produces pages at `/<lang>/`, `/<lang>/<collection>/` and `/<lang>/<slug>/`. Collections, ideas and books share one URL namespace. Paths are the same in every language, only the `/<lang>/` prefix differs: don't translate slugs (a book's full review is `/<lang>/<slug>/full/`, never `/vi/<slug>/day-du/`). It also writes an RSS feed per language (`/<lang>/feed.xml`), `sitemap.xml` and `robots.txt`.
- `src/assets/icon.svg` is the logo: a lightbulb whose filament is a lowercase "m". The build turns it into `favicon.svg`/`.ico`/`-32.png`, `apple-touch-icon.png`, `icon-192/512.png` and `site.webmanifest` at the site root. `brand/` holds a copy and a 1024px profile picture for social accounts. The header logo is a different mark, a small card stack with the same "m" bulb, drawn in `build.mjs` (`BRAND_MARK`) with theme colors.
- `ideas/` is source material (PDFs, the Sâu Sách backup and export, photos). It is not part of the site.

## Adding things

- **Idea:** add panels to `stacks.js`, the words to **both** i18n files, and any new drawing to `draw.js`. Every visible string must exist in both languages.
- **Dates:** every page shows when it was published. Collections and standalone ideas carry `date` (YYYY-MM-DD) in `stacks.js`. A collection's date shows on its own page, not on each idea in it. Books take `date` from the full review (the Sâu Sách publish date, `reviewedDate` in the export). Books also carry `added`, the day they went on Minideas, which orders the RSS feed. Anything added after launch day (the earliest `date`/`added`) gets a "New" mark on its home tile for 14 days. Set the Tech dates and the books' `added` to the launch day when you publish. Full reviews also show reading time (`wordsPerMinute` in each i18n file).
- **Book review:** run the importer, which writes the full review to `<slug>-full.js`. Then write the card stack in `<slug>.js` (see `outliers.js`): one panel per idea, each 2–3 sentences condensed from the reviewer's text, with a drawing or `["photo", file]`. It reuses the full review's labels and captions. Copy the photos from the review's folder in `ideas/sausach/Images/` (the `PhotosFolder` of the review, or a folder named after the book) into `src/books/photos/<slug>/` without their metadata, set `cover` and the full review's `photos` gallery, and add a caption per language for each photo. Section pictures in the full review are optional: `art.sections: { <section number>: [drawing] }` with labels in `vi.labels` / `en.labels`, or `["photo", file]` for a picture the review showed at the start of that section. A picture the review put between paragraphs is a `{ photo: file }` block at that spot in `intro` or a section's `body`. Either way it leaves the gallery. New books can be card-stack only.
- After visual changes, render and look at them. For drawings, put every panel on one contact sheet and screenshot it with headless Chrome: a page in `dist/` that fetches the built idea pages and copies out each `.slide .art svg` works well. For pages, screenshot at about 1100px and 390px wide (use an iframe for 390px, because headless Chrome enforces a minimum window width). Check Vietnamese too: its labels run longer. Don't combine an iframe with `--virtual-time-budget`, which can hang Chrome. macOS has no `timeout`, so run Chrome in the background and kill it after about 40s.

## Writing explainers

Explainers are for a **general curious reader**, not for exam prep or vendor training. AI Fundamentals started as a mirror of the owner's slide deck (one idea per slide, in slide order, chapters taken from the deck's section headers) and had to be rewritten. When the source is slides or a course:

- **Build a learning path, not a slide order.** Each idea should rely only on earlier ideas. Before ordering, ask what a reader must already know for each panel. For example, regression has to come before the house-price error plot, prompting before "customize a model", and next-word prediction before foundation models.
- **Connect ideas explicitly.** Refer back by title or by the example ("the same trick as the line through the house dots"), and point forward when a later idea builds on this one. Reuse a running example where you can, instead of a new one every time.
- **Cover what readers actually wonder about**, even if the source skips it. For AI that meant "how does a chatbot write?" and "why does it make things up?".
- **Drop vendor material:** product catalogues, company or logo lists, and a vendor's own frameworks or terms (e.g. AWS's eight Responsible AI dimensions). They date quickly and aren't ideas.
- **Concrete scenes beat definition lists.** A panel that defines three terms in a row reads like a glossary. Show one situation instead: a hiring model copying past bias, a loan denied with no reason given.
- **Jargon once:** plain words first, then "experts call this X". Don't stack several terms in one panel.
- **No claims that date**, such as "most AI today is…" or market-share charts.
- **Balance chapters.** A chapter with a single idea usually means the grouping came from the source, not from the reader's needs.
- The first panel of each idea is also its home tile and share image, so it should stand on its own.

## Vietnamese text

Write Vietnamese the way a Vietnamese tech writer would, not as a word-for-word translation of the English. Translated titles are the most common slip:

- **Titles:** "Gia đình AI" (The AI family) → "Phân biệt AI, học máy, học sâu". "Biến mô hình thành của bạn" (Making a model yours) → "Tùy chỉnh mô hình cho riêng bạn". "Quy tắc và học hỏi" → "Lập trình truyền thống và học máy".
- **Words that mean something else:**
  - "ý tưởng" is an idea you come up with, not a topic you learn. The site calls an idea in a collection "bài" (Bài 3/15, 15 bài).
  - "máy tính tí hon" means tiny computers, not calculators.
  - "kỹ tính" describes a fussy person.
- **Use familiar idioms when they fit:** "học vẹt" (overfitting), "rác vào, rác ra", "nói chắc như đinh đóng cột", "thi được mở tài liệu" (open-book exam).
- **Technical terms:** give the Vietnamese term, then the English in brackets the first time: "quá khớp (overfitting)", "ảo giác (hallucination)". Terms used so far:
  - học máy, học sâu, AI tạo sinh, mô hình nền tảng
  - huấn luyện, huấn luyện thêm (fine-tuning), trọng số, embedding (vector nhúng), token
  - định kiến (bias against people), độ chệch / phương sai (model bias / variance)
  - code, not "mã" (which readers take as mã giảm giá, mã OTP): "code sạch", "viết code", "review code"; tái cấu trúc (refactoring)
- **Introduce a term plainly**, without crediting a group: "Đó chính là tái cấu trúc (refactoring)", "theo nguyên tắc DRY (…)", "Nguyên tắc này có tên là YAGNI (…)". "Giới lập trình gọi đây là…", "Dân lập trình…" and "Lập trình viên hay nhắc nhau…" sound stiff or forced, especially when repeated within one idea.
- **Check that short labels can't be misread.** "không có lý do để kiểm tra" was meant as "no reason anyone can check" but reads as "there's no reason to check". "Máy học như thế nào" collides with "máy học", a common name for machine learning, so use "Máy tính học…".
- **Keep cross-references in step.** When an idea's title changes, search both i18n files for other text that quotes it.

## Drawing pitfalls

- CSS class rules override SVG presentation attributes, so `T()` sets font size as an inline `style`. Don't switch it back to `font-size="…"`.
- Use `T(..., { max: width })` for any label that may run long in Vietnamese; it shrinks the font to fit. Use `\n` for line breaks.
- Labels that sit on top of lines or dashed outlines need the `halo` class, or the line looks like a strikethrough.
- `pill()` turns narrow boxes into circles. For word chips, use `R(..., 6)` plus `T`, and allow about 0.52 em per character (Vietnamese diacritics included) so text clears the edges.
- resvg (share images) handles `<g transform="rotate(…)">`, e.g. for a tilted stamp.
- Text on pastel fills needs the `on` class (dark in both themes). Every color is a token in `style.css`, with light and dark values.
- Patrick Hand has no ← → glyphs. Browsers fall back per character, but resvg switches the whole label to another font, so `og.js` swaps arrows for ASCII. If you add other special characters to labels, check them against the font's cmap with fontTools.
- Fonts must cover Vietnamese: Bricolage Grotesque (display), Lexend (body), Patrick Hand (drawings). The TTFs in `src/fonts/` are only for resvg; pages load the fonts from Google Fonts.

## Owner preferences

- **Only the owner's (Duy's) reviews, non-fiction only.** Sâu Sách had several reviewers, and the export doesn't say who wrote what (the backup does: `Reviews.ReviewerID` → `AspNetUsers.DisplayName`). Duy's published reviews are ids 1, 2, 3, 6, 22, 26, 29, 43 and 46; of those, 29 (The Hobbit) and 46 (The Alchemist) are fiction. Never import another member's review.
- **Book reviews keep the reviewer's own words**: their sections, paragraphs and quotes, in their order. Card-stack panels condense that text and add nothing. Don't write new opinions, verdicts, comparisons or reading-time claims. English versions are faithful translations, with a note that quotes are translated back from the Vietnamese edition. Point out typos in the original, but don't fix them silently.
- **No scores or ratings** anywhere.
- **Books lead with the short card stack**, with one tile per book on the home page, and the full article one tap away. The full article shows the pictures the reviewer put in the text inside their sections (`art.sections: { <n>: ["photo", file] }`), in place of a drawing; sections without one may get a drawn illustration. All the reviewer's other photos go together in one gallery before the conclusion, never scattered through the text. Any photo from the review's folder can be used, including publisher cover scans, the author's portrait and the author's own illustrations. The front cover is the usual `cover` (header, tile and share image), and the gallery should include every photo the owner picks, so ask before leaving one out.
- **"Go deeper" links** must be publicly accessible. No login-gated or vendor training portals.
- **Keep it simple:** static files, no database, no runtime dependencies. `@resvg/resvg-js` is the only (build-time) package.
- **Home page stays compact:** one tile per collection, standalone idea or book. A collection's ideas are listed on its own page.
- Vietnamese text should be checked by a native speaker before launch.

## Data and privacy

`ideas/sausach/SauSach2.bak` is a SQL Server 2012 backup that includes member emails and password hashes. Never publish it or copy member data into the site. `ideas/sausach/sausach-reviews.json` is the export used by the importer: published reviews only, book and review fields only. To re-export, restore the backup into a temporary `mcr.microsoft.com/mssql/server:2022-latest` container (`--platform linux/amd64`, backup folder mounted read-only), query the `Reviews` (including `ReviewedDate`, exported as `reviewedDate`), `Authors`, `Publishers` and `Genres` tables, then remove the container.
