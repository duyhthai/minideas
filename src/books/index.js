// Book reviews on the home page, in shelf order. Each name is a folder in src/books/ that holds one book:
//   book.js    the quick-read card stack, which imports its full review as `full` (or the full review on its own)
//   full.js    the full review, written by tools/import-review.mjs
//   draw.js    its drawings (optional), built from the helpers in src/draw.js
//   photos/    the reviewer's photos
export const BOOKS = ["the-shallows", "outliers", "steal-like-an-artist"];
// Ready but not shown: the-second-world-war (later), the-hobbit (fiction; the shelf is non-fiction only).
// Add one to BOOKS to publish it.
