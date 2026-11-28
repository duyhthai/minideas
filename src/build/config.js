// The build's settings: where it writes, the site's address, and the public ids of the services the site uses.
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
// OUT_DIR=<folder> builds somewhere else, e.g. to check a change while the dev server owns dist/
export const OUT = process.env.OUT_DIR ? resolve(process.env.OUT_DIR) : join(ROOT, "dist");
export const TMP = `${OUT}-tmp`; // built here first, then swapped in, so a running preview never sees a half-built site
export const CACHE = join(ROOT, "node_modules/.cache/og"); // preview images keyed by their inputs; most rebuilds render none
export const INDEX = process.argv.includes("--explicit-index") ? "index.html" : "";
export const SITE_URL = (process.env.SITE_URL || "https://minideas.com").replace(/\/$/, "");
// The "Suggest or send an article" form posts to Web3Forms (web3forms.com), which emails each suggestion to the owner. Its
// access key is meant to be public. Until it's set the form can't send, and the build says so.
export const SUGGEST_KEY = "5981853d-1fdd-4f7f-9c1b-21ab1c13822a";
// The newsletter: one Kit (kit.com) sign-up form per language, so each email goes only to readers of its language
// (Kit's free plan sends a broadcast to the subscribers of chosen forms). Form ids are public, like the key above.
export const KIT_FORMS = { en: 10201800, vi: 10201799 };
// The site's code, public on GitHub (linked from the footer), and its guide for writing for Minideas (linked from the
// bottom of the Suggest page, whose form also takes the link to an article someone wrote)
export const REPO_URL = "https://github.com/duyhthai/minideas";
export const CONTRIBUTE_URL = `${REPO_URL}/blob/main/CONTRIBUTING.md`;
// The home page's preview shows these three stacks (a collection, standalone idea or book each), chosen by hand so the
// picture says what the site is, tech and books, and doesn't change with every new stack (apps cache previews for weeks)
export const HOME_PREVIEW = ["ai-fundamentals", "the-shallows", "graph-databases"];
// Pages whose slug changed after they went live: old slug → new slug. The build writes dist/_redirects, which
// Cloudflare reads (it isn't served), so links already shared still open, in every language. The old slug stays
// reserved: the build stops if a page takes it again.
export const MOVED = { "next-word": "how-chatbots-write" };
