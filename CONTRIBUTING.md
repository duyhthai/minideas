# Contributing to Minideas

Thanks for helping. Minideas is a bilingual (English / Vietnamese) site of illustrated explainers and book reviews. This guide says what you can add and how.

## What you can contribute

- **Fixes:** typos, awkward Vietnamese or English, broken links, drawings that look wrong. These are always welcome.
- **Topic ideas:** open an issue or use the "Suggest or send an article" page on the site (its form also takes a link to a draft you wrote, if you'd rather not use GitHub).
- **New tech explainers:** a short illustrated stack on one idea, or a collection of them.
- **Your own book reviews:** written your way, in your own structure and voice. Ratings are fine if you want to give one.

The reviews imported from the old Sâu Sách site are Duy's. Please don't rewrite them; a typo report is welcome. Only Duy's Sâu Sách reviews are in this repo.

## First time

You need [Node 22](https://nodejs.org/), [git](https://git-scm.com/) and a GitHub account. You don't need any accounts or keys for the site's services: the build works offline with what's in the repo.

1. On GitHub, click **Fork** on this repo to make your own copy.
2. Download your copy and install what the build uses:

   ```sh
   git clone https://github.com/<your-name>/minideas.git
   cd minideas
   git remote add upstream https://github.com/duyhthai/minideas.git
   git fetch upstream
   git checkout -b dev upstream/dev
   npm install
   ```

## How to send a change

1. Start a branch from **`dev`** for each article or fix, after getting the latest changes from Minideas:

   ```sh
   git checkout dev
   git pull upstream dev
   git checkout -b my-topic
   ```

2. Run `npm run dev` and open <http://localhost:4321>. The first build takes about 40 seconds; after that, every save rebuilds in a second and reloads the page.
3. Make your change. There are no tests: the build is the check, and it stops with a list of problems (a missing panel or label, a photo that isn't there, a drawing that outputs `NaN`).
4. Look at your pages in light and dark mode, on a wide and a narrow window.
5. Save your work and send it to your copy on GitHub:

   ```sh
   git add -A
   git commit -m "Add an explainer on QR payments"
   git push -u origin my-topic
   ```

6. On GitHub, open a pull request from your branch into **`dev`**, not `main`. Every change to `main` goes live on minideas.com, so only the owner merges into it.

**[docs/adding-content.md](docs/adding-content.md) walks through adding an explainer or a book review, with examples to copy.** [CLAUDE.md](CLAUDE.md) goes deeper into how the site is built; it is written for AI coding assistants but works for people too.

You can write in English or Vietnamese, or both. A page in one language appears only on that language's site, and we can translate it later.

## Explainers

- The panels go in `src/stacks.js`, the words in `src/i18n/en.js` or `src/i18n/vi.js` (or both), and new drawings in `src/draw.js`.
- Write for a general curious reader. Read "Writing explainers" and "Vietnamese text" in [CLAUDE.md](CLAUDE.md) first. In short: one idea builds on the last, use concrete scenes rather than definitions, introduce jargon once, and leave out vendor product lists.
- "Go deeper" links must open without an account.

## Book reviews

- A book is `src/books/<slug>.js`, listed in `src/books/index.js`: a stack of cards, one per idea, each with a drawing or a photo. A full-length review behind it is optional.
- It must be your own writing. Don't paste reviews from other sites.
- Only add photos you took or have the right to use, with a caption in each language you write.

## License

Code contributions are under the MIT License. Writing and drawings are published under CC BY-NC 4.0, and you keep the copyright to your own reviews. See [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
