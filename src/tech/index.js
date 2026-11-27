// The Tech shelf on the home page, in order. Each name is a folder next to this file that holds one topic:
//   stack.js       its shape, shared by every language: either a collection (`id`, `chapters`, `resources` and
//                  `ideas`, each idea a `slug`, a `chapter` and its `panels`) or a standalone idea (`slug`, `panels`,
//                  `resources`). A panel is [drawing, ...args]: a drawing from the topic's draw.js plus its
//                  arguments. Collections and standalone ideas carry their own "Go deeper" links (`resources`).
//                  date (YYYY-MM-DD): when it was published on the site, shown on the collection's page or the
//                  standalone idea. related (optional): the slug of one stack to read next, on either shelf (shown
//                  at the end; for a collection, after its last idea).
//   draw.js        its drawings, built from the helpers in src/draw.js
//   en.js, vi.js   its words: ideas[slug] has one entry per panel (plus `links` for a standalone idea),
//                  collections[id] the collection's title, chapter names and link descriptions, and art the labels
//                  inside the drawings. A topic is published in each language that has its words.
// A folder that isn't listed here isn't published. Book reviews live in src/books/.
export const SHELF = ["building-with-claude", "ai-fundamentals", "clean-code-refactoring", "graph-databases"];
