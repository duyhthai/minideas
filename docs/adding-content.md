# Adding an explainer or a book review

This guide walks through adding content to Minideas. Read [CONTRIBUTING.md](../CONTRIBUTING.md) first for what's welcome and how to send it.

You can write in English or Vietnamese, or both. A page in one language appears only on that language's site, and the other can be translated later.

| | You're adding | Folder | Start by copying |
| --- | --- | --- | --- |
| 🧩 | [An explainer](#an-explainer) | `src/tech/<slug>/` | `src/tech/graph-databases/` |
| 📚 | [A book review](#a-book-review) | `src/books/<slug>/` | `src/books/outliers/` |

> [!TIP]
> Run `npm run dev` while you work. It rebuilds on every save, reloads the page, and stops with a list of problems when something doesn't fit (a missing panel, a label that doesn't exist, a photo that isn't there).

## An explainer

An explainer is a card stack: 3 to 12 panels, each with a drawing, a short heading and one or two sentences. It is either **standalone** (one stack) or part of a **collection** (several stacks in order, like AI Fundamentals). Most new explainers should be standalone; `clean-code-refactoring` is a good one to copy.

Pick a slug: lowercase words joined by dashes, in English, used in every language (`/en/my-topic/` and `/vi/my-topic/`). It can't be `home`, `follow` or `suggest`, or any name already used.

Everything about a topic lives in one folder, `src/tech/<slug>/`:

```
src/tech/how-qr-payments-work/
  stack.js   the panels and links (step 1)
  en.js      the English words (step 2)
  vi.js      the Vietnamese words (step 2), or leave it out
  draw.js    the drawings (step 3)
```

The easiest start is to copy a small topic, such as `src/tech/graph-databases/`, rename the folder to your slug and replace what's inside. Then add the slug to `SHELF` in `src/tech/index.js`. Its place in that list is its place on the home page; a folder that isn't listed isn't published.

### 🃏 1. The panels: `stack.js`

```js
export default {
  slug: "how-qr-payments-work",       // the same as the folder's name
  date: "2026-12-01",                  // the day it goes on the site
  related: "graph-databases",          // optional: one stack to read next
  panels: [["qrScan"], ["qrBank", 1], ["qrBank", 2]],
  resources: [                         // "Go deeper" links; pages must open without an account
    { key: "napas", name: "NAPAS", url: "https://napas.com.vn/" },
  ],
};
```

Each panel is `[drawingName, ...arguments]`. The drawing is a function in `draw.js` (step 3), and the arguments let one drawing show several steps.

### 💬 2. The words: `en.js` and/or `vi.js`

One file per language you write. Under `ideas`, add an entry with the slug: one `[heading, text]` per panel, in the same order as the drawings. Put the words inside the drawings under `art`, in a group of your own.

```js
export default {
  ideas: {
    "how-qr-payments-work": {
      title: "How paying by QR code works",
      gist: "One short sentence that sums it up; it shows on the home page and in link previews.",
      panels: [
        ["The code is just an address", "…"],
        ["Your bank sends the money", "…"],
        ["The shop hears back in seconds", "…"],
      ],
      links: { napas: "Who runs the network behind Vietnam’s QR payments" },
    },
  },

  art: {
    qr: { phone: "your phone", shop: "shop", bank: "bank", paid: "paid" },
  },
};
```

If you write both languages, keep `en.js` and `vi.js` line for line, so a translator can read them side by side.

A panel’s text can link to a page with `[words](https://…)`. Keep that for the odd card that sends readers to an official page, such as installation steps; other links go in `links`. To point to another stack on Minideas, use its slug, `[How a chatbot writes](how-chatbots-write)`: it links to that stack in the same language, and the build stops if the slug doesn’t exist there. Wrap something the reader types or presses, such as a command, a path or a key, in backticks (`` `/clear` ``) to show it as code.

> [!NOTE]
> Every text the reader sees comes from these files, never from the drawings, so the same drawing works in every language.

### ✏️ 3. The drawings: `draw.js`

Import the helpers you use from `src/draw.js` and export your drawings:

```js
import { T, R, A } from "../../draw.js";

export default {
  qrScan(lb) { … },
  qrBank(lb, step) { … },
};
```

> [!WARNING]
> Drawing names, idea slugs and `art` groups are shared across every topic and book, so pick names that won't clash (start them with your topic, like `qrScan`): the build stops if two have the same name.

Each drawing is a function that returns SVG for a **320 × 220** box (x to the right, y down). It receives `lb`, the language's `art` labels.

```js
qrScan(lb) {
  const t = lb.qr;
  return R(30, 50, 80, 130, "fk") + T(70, 200, t.phone) +
    A(120, 115, 200, 115, "blue-s") +
    R(210, 70, 80, 80, "fy") + T(250, 115, t.shop, { c: "on", max: 70 });
},
```

The helpers, from `src/draw.js`:

| Helper | Draws |
| --- | --- |
| `T(x, y, text, { c, max, size, a })` | a label, centred on x (`a: "start"` or `"end"` to align); `\n` breaks lines; `max` shrinks the font to fit that width |
| `L(x1, y1, x2, y2, cls)` | a line |
| `A(x1, y1, x2, y2, cls)` | an arrow |
| `R(x, y, w, h, fill, cls, radius)` | a box |
| `C(cx, cy, r, fill, cls)` / `EL(cx, cy, rx, ry, fill, cls)` | a circle / an ellipse |
| `P(d, fill, cls)` | an SVG path |
| `pill(cx, cy, text, fill)` | a rounded label |
| `fig(x, y, pose)` / `face(x, y, mood)` | a little person (`"walk"`, `"run"`, `"bike"`) / a face (`"up"`, `"down"`, `"flat"`) |

Fills are coloured pencil: `fy` yellow, `fb` blue, `fm` mint, `fc` coral, `ft` a pale tint, `fk` plain paper, `fi` solid ink. Lines take `thin`, `w3` (thick), `dash`, `faint`, `blue-s` or `coral-s`. Labels take `b` (bold), `sm` (small), `mut` (grey), `blu`, `cor`, `on` (for text on a coloured fill) and `halo` (for text that sits on a line, so the line doesn't strike through it).

💡 Tips:

- Vietnamese labels run longer. Give any label that might not fit a `max` width.
- The drawing font has no ← → arrows or other unusual symbols; draw arrows with `A()`.
- Copy a drawing you like: `readMore`, `goodNames` and the `graph…` drawings are short and readable.
- The first panel is also the home-page tile and the link preview, so it should make sense on its own.

### 👀 4. Check it

Open your stack on the dev server and look at it:

- [ ] in light and dark mode (the moon button)
- [ ] in each language you wrote
- [ ] on a wide window and a narrow one

The drawings appear as pencil sketches, and that look is applied at build time, so what you see is what readers get.

### A collection

> [!IMPORTANT]
> Talk to us in an issue before starting one.

A collection groups several stacks that build on each other. Its folder is named after its `id`. In `stack.js` it has an `id`, a `date`, optional `chapters`, `resources` and a list of `ideas` (each a `slug`, a `chapter` and `panels`). In `en.js` / `vi.js` it gets `collections[id]` (`title`, `lede`, `chapters`, `links`) plus one `ideas[slug]` entry per idea. See `src/tech/ai-fundamentals/` for the full shape. An idea's title can start with its chapter's name, like “Claude Code: getting started”, so it still makes sense on its own in a link preview; under the chapter's heading (the collection page, its contents list, the idea's own heading) the site leaves that part out.

## A book review

A book is a card stack too: one panel per idea from your review, each with a drawing or a photo. A full-length review behind it is optional. Everything about it lives in one folder, `src/books/<slug>/`:

```
src/books/atomic-habits/
  book.js    the review (step 2)
  draw.js    its drawings, if it has any
  photos/    its photos, if it has any (step 1)
  full.js    the full review, if you write one
```

### 📷 1. Photos (optional)

Put your photos in `src/books/<slug>/photos/` as JPEGs, with their metadata removed (for example `exiftool -all= photo.jpg`). Every photo needs a caption in each language you write.

> [!WARNING]
> Only use photos you took or have the right to use.

### 📝 2. The review: `book.js`

```js
export default {
  slug: "atomic-habits",
  author: "James Clear",                 // the book's author
  added: "2026-12-01",                   // the day it goes on the site
  date: "2026-11-20",                    // optional: when you wrote it, if earlier
  cover: "cover.jpg",                    // optional: the tile and preview picture
  related: "outliers",                   // optional: one stack to read next
  panels: [["photo", "cover.jpg"], ["habitLoop"], ["habitOnePercent"]],
  en: {
    title: "Atomic Habits",
    abstract: "One or two sentences on what the book is about and why it’s worth reading.",
    panels: [
      ["Small changes, big results", "…"],
      ["Cue, craving, response, reward", "…"],
      ["1% better every day", "…"],
    ],
    labels: { loop: ["cue", "craving", "response", "reward"] },
    captions: { "cover.jpg": "The cover of the first edition" },
  },
  // vi: { … the same shape, if you write Vietnamese too }
};
```

Write it your way: your opinions, your structure, a rating if you want to give one (put it in the text).

The book's drawings go in `draw.js` next to it, written like an explainer's (prefix their names with the book, e.g. `habitLoop`). They read their labels from `lb.book`, which holds your `labels` plus the book's `title`, `author` and `facts`.

### 📚 3. Put it on the shelf: `src/books/index.js`

Add the slug to `BOOKS`. Its place in the list is its place on the home page.

### A full review (optional)

For a long review, put the article in `full.js`, import it in `book.js` (`import full from "./full.js";`) and add it as `full`. It shares the card stack's slug, author, date and cover unless it sets its own. Its language blocks hold `title`, `abstract`, `intro` (paragraphs), `sections` (each `{ h: heading, body: [paragraphs] }`) and an optional `conclusion`. A paragraph can also be `{ quote: "…" }` or `{ photo: "file.jpg" }`. `art.sections` can put a drawing or photo at the top of a section by its number, and `photos` lists a gallery shown before the conclusion. `*italic*` and `**bold**` work in the text. The card stack then ends with a link to the full review. See `src/books/steal-like-an-artist/full.js` for a complete example.
