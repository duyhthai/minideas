// Book reviews on the home page, in shelf order. Each book is a quick-read card stack (src/books/<slug>.js)
// that may link to a full review (<slug>-full.js). A full review can also be listed here on its own.
import theShallows from "./the-shallows.js";
import outliers from "./outliers.js";
import stealLikeAnArtist from "./steal-like-an-artist.js";

export const BOOKS = [theShallows, outliers, stealLikeAnArtist];
// Ready but not shown: the-second-world-war.js (later), the-hobbit.js (fiction; the shelf is non-fiction only).
// Add one to BOOKS to publish it.
