# Contributing to Minideas

Thanks for helping. Minideas is a bilingual (English / Vietnamese) site of illustrated explainers and book reviews. This guide says what you can add and how.

## What you can contribute

- **Fixes:** typos, awkward Vietnamese or English, broken links, drawings that look wrong. These are always welcome.
- **Topic ideas:** open an issue or use the "Suggest a topic" page on the site.
- **New tech explainers:** a short illustrated stack on one idea, or a collection of them.
- **Your own book reviews:** written your way, in your own structure and voice. Ratings are fine if you want to give one.

The reviews imported from the old Sâu Sách site are Duy's. Please don't rewrite them; a typo report is welcome. Only Duy's Sâu Sách reviews are in this repo.

## How to send a change

1. Fork the repo and branch off **`dev`**.
2. Make your change and run `npm install` then `npm run build`. There are no tests: the build is the check, and it stops with a list of problems (missing text in one language, panel counts that don't match, drawings that output `NaN`, missing photos).
3. Run `npm run dev` and look at your pages at http://localhost:4321, in light and dark mode, on a wide and a narrow window.
4. Open a pull request into **`dev`**, not `main`. Every change to `main` goes live on minideas.com, so only the owner merges into it.

[CLAUDE.md](CLAUDE.md) explains how the site is built and where everything lives. It is written for AI coding assistants but works as a guide for people too.

## Explainers

- Every visible word needs both languages: the words go in `src/i18n/en.js` **and** `src/i18n/vi.js`, the panels in `src/stacks.js`, and new drawings in `src/draw.js`. If you only write one language, open the pull request anyway and say so.
- Write for a general curious reader. Read "Writing explainers" and "Vietnamese text" in [CLAUDE.md](CLAUDE.md) first. In short: one idea builds on the last, use concrete scenes rather than definitions, introduce jargon once, and leave out vendor product lists.
- "Go deeper" links must open without an account.

## Book reviews

- A book is `src/books/<slug>.js`, listed in `src/books/index.js`: a stack of cards, one per idea, each with a drawing or a photo. A full-length review can sit behind it. See `src/books/outliers.js` for an example.
- A review can be in both languages or in Vietnamese only; a book without English text appears only on the Vietnamese site.
- It must be your own writing. Don't paste reviews from other sites.
- Only add photos you took or have the right to use, with a caption in each language.

## License

Code contributions are under the MIT License. Writing and drawings are published under CC BY-NC 4.0, and you keep the copyright to your own reviews. See [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
