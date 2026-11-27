// What's new, announced: the RSS feed for each language and the newsletter drafts.
import { E } from "../draw.js";
import { LANGS } from "../content.js";
import { join } from "node:path";
import { ROOT, SITE_URL } from "./config.js";
import { feedTitle } from "./layout.js";
import { shelfIn, booksIn } from "./shelves.js";
import { ogUrl, ideaImage, bookImage, collectionImage } from "./pictures.js";

// what the RSS feed and the newsletter drafts announce: collections, standalone ideas and books, newest first
function newsItems(t) {
  return [
    ...shelfIn(t).map(item => item.ideas
      ? { name: item.id, date: item.date, title: t.collections[item.id].title, text: t.collections[item.id].lede, og: collectionImage(t, item) }
      : { name: item.slug, date: item.date, title: t.ideas[item.slug].title, text: t.ideas[item.slug].gist, og: ideaImage(t, item) }),
    ...booksIn(t).map(b => ({ name: b.slug, date: b.added, book: true, title: b[t.lang].title, text: b[t.lang].abstract.replace(/\*/g, ""), og: bookImage(t, b) })),
  ].sort((a, b) => b.date.localeCompare(a.date));
}
// RSS, one feed per language, each item with its preview image. The channel names the bulb icon twice: RSS's own
// <image>, which most readers use, and Feedly's webfeeds tags (icon, logo, accent color), which it prefers.
export function feed(t) {
  const items = newsItems(t);
  const home = `${SITE_URL}/${t.lang}/`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:webfeeds="http://webfeeds.org/rss/1.0">
<channel>
<title>${E(feedTitle(t))}</title>
<link>${home}</link>
<description>${E(t.ui.lede)}</description>
<language>${t.lang}</language>
<atom:link href="${home}feed.xml" rel="self" type="application/rss+xml"/>
<image><url>${SITE_URL}/icon-192.png</url><title>${E(feedTitle(t))}</title><link>${home}</link></image>
<webfeeds:icon>${SITE_URL}/icon-192.png</webfeeds:icon>
<webfeeds:logo>${SITE_URL}/favicon.svg</webfeeds:logo>
<webfeeds:accentColor>1c2333</webfeeds:accentColor>
${items.map(x => `<item>
  <title>${E(x.title)}</title>
  <link>${home}${x.name}/</link>
  <guid isPermaLink="true">${home}${x.name}/</guid>
  <pubDate>${new Date(`${x.date}T00:00:00Z`).toUTCString()}</pubDate>
  <description>${E(`<p><img src="${ogUrl(x.og)}" alt="" width="1200" height="630"></p><p>${E(x.text)}</p>`)}</description>
</item>`).join("\n")}
</channel>
</rss>
`;
}
// Newsletter drafts: Kit's free plan can't send from the feed, so each new stack is sent by hand. This page has the
// newest stacks in each language as ready-to-paste emails (subject, preview text, body with the preview image, a
// link and a sign-off). It's written outside dist/ so it's never deployed; the dev server shows it at /newsletter/. The copied email
// loads its picture from SITE_URL, so deploy before sending; the preview here uses the local copy.
export const NEWSLETTER = join(ROOT, "node_modules/.cache/newsletter.html");
export function newsletterPage() {
  let n = 0;
  const draft = (t, x) => {
    const url = `${SITE_URL}/${t.lang}/${x.name}/`, id = `mail${++n}`;
    const subject = x.book ? t.ui.emailBookSubject(x.title) : x.title;
    const html = `<p><a href="${url}"><img src="${ogUrl(x.og)}" alt="${E(x.title)}" width="600" style="max-width:100%;height:auto;border-radius:8px"></a></p>
<h2><a href="${url}">${E(x.title)}</a></h2>
<p>${E(x.text)}</p>
<p><a href="${url}"><strong>${E(t.ui.emailRead)}</strong></a></p>
<p>${E(t.ui.emailSignOff)}<br>Duy, Minideas</p>`;
    const field = (label, value) => `<div class="field"><span>${label}</span><input readonly value="${E(value)}"><button type="button" data-text="${E(value)}">Copy</button></div>`;
    return `<article>
  <h3>${E(x.title)} <small>${x.date}</small></h3>
  ${field("Subject", subject)}
  ${field("Preview text", x.text)}
  <div class="field"><span>Email</span><button type="button" data-html="${id}" data-plain="${E(`${x.title}\n\n${x.text}\n\n${url}\n\n${t.ui.emailSignOff}\nDuy, Minideas`)}">Copy email</button></div>
  <template id="${id}">${html}</template>
  <div class="mail">${html.replace(`${SITE_URL}/og/`, "/og/")}</div>
</article>`;
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Newsletter drafts · Minideas</title>
<style>
body { font: 16px/1.5 system-ui, sans-serif; max-width: 720px; margin: 0 auto; padding: 24px 16px 64px; color: #1c2333; background: #f6f7fb; }
h1 { margin: 0 0 4px; } h2 { margin: 40px 0 8px; } .note { color: #55607a; margin: 0 0 8px; }
article { background: #fff; border: 1px solid #dde2ec; border-radius: 12px; padding: 16px; margin: 16px 0; }
h3 { margin: 0 0 12px; } h3 small { font-weight: 400; color: #55607a; margin-left: 8px; }
.field { display: flex; gap: 8px; align-items: center; margin: 8px 0; }
.field span { width: 96px; flex: none; color: #55607a; font-size: 14px; }
.field input { flex: 1; min-width: 0; font: inherit; padding: 6px 8px; border: 1px solid #dde2ec; border-radius: 6px; }
button { font: inherit; padding: 6px 12px; border: 1px solid #1c2333; border-radius: 6px; background: #1c2333; color: #fff; cursor: pointer; }
.mail { border-top: 1px dashed #dde2ec; margin-top: 12px; padding-top: 12px; }
.mail img { display: block; }
</style>
</head>
<body>
<h1>Newsletter drafts</h1>
<p class="note">One email per new stack, sent from Kit to the subscribers who signed up in that language. Deploy first: the copied email loads its picture from ${E(SITE_URL)}.</p>
<p class="note">In Kit: new broadcast, paste the subject and preview text, click into the email and paste. Send it to the subscribers of that language's form.</p>
${LANGS.slice().reverse().map(t => `<h2>${E(t.name)}</h2>\n${newsItems(t).slice(0, 3).map(x => draft(t, x)).join("\n")}`).join("\n")}
<script>
document.addEventListener("click", async e => {
  const b = e.target.closest("button");
  if (!b) return;
  try {
    if (b.dataset.text != null) await navigator.clipboard.writeText(b.dataset.text);
    else {
      const html = document.getElementById(b.dataset.html).innerHTML;
      await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([b.dataset.plain], { type: "text/plain" }) })]);
    }
    const label = b.textContent;
    b.textContent = "Copied";
    setTimeout(() => b.textContent = label, 1500);
  } catch (err) { b.textContent = "Couldn’t copy"; }
});
</script>
</body>
</html>
`;
}
