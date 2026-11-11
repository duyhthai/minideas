// Book reviews on the home page, in shelf order. Each book is a quick-read card stack (src/books/<slug>.js)
// that may link to a full review (<slug>-full.js). A full review can also be listed here on its own.
import outliers from "./outliers.js";
import theHobbit from "./the-hobbit.js";

export const BOOKS = [outliers, theHobbit];
// Ready but not shown yet: the-second-world-war.js (add it to BOOKS to publish)
