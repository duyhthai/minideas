// The site's other pages: Follow, You're subscribed, Suggest, 404 and the root page that picks a language.
import { E } from "../draw.js";
import { LANGS, en, vi } from "../content.js";
import { INDEX, SITE_URL, SUGGEST_KEY, KIT_FORMS, CONTRIBUTE_URL } from "./config.js";
import { FONTS, iconLinks, SITE_LD, linker, shell, feedTitle, THEME_SCRIPT } from "./layout.js";
import { BRAND_MARK, DONE_ICON, MAIL_ICON, RSS_ICON, GITHUB_ICON } from "./icons.js";
import { shelfIn, booksIn } from "./shelves.js";
import { ogUrl } from "./pictures.js";
import { shelfTile, bookTile } from "./pages.js";

// Follow: how to get new card stacks. First by email: a plain form that posts to the language's Kit form; site.js sends
// it in the background and shows the thanks here (without the script, Kit shows its own page). Kit then emails a link
// to confirm. Then one line for the few who use RSS: the feed's address to copy (browsers don't show feeds, they save
// or dump the XML, so the site links here rather than to the feed). Feed reader users need no explanation.
export function followPage(t) {
  const to = linker(2), u = t.ui, feedUrl = `${SITE_URL}/${t.lang}/feed.xml`;
  const body = `<main>
<a class="back" href="${to(t.lang)}">← ${E(t.ui.allTopics)}</a>
<section class="hero">
  <h1>${E(t.ui.followTitle)}</h1>
  <p class="lede">${E(t.ui.followLede)}</p>
</section>
<section class="follow-way">
  <h2>${MAIL_ICON}<span>${E(u.emailTitle)}</span></h2>
  <p>${E(u.emailText)}</p>
  <form class="email-form" id="email-form" action="https://app.kit.com/forms/${KIT_FORMS[t.lang]}/subscriptions" method="POST" data-sending="${E(u.suggestSending)}" data-error="${E(u.emailError)}">
    <label class="visually-hidden" for="f-email">${E(u.emailLabel)}</label>
    <div class="email-row">
      <input id="f-email" name="email_address" type="email" required maxlength="200" autocomplete="email" placeholder="${E(u.emailLabel)}">
      <button class="btn primary" type="submit">${E(u.emailSubscribe)}</button>
    </div>
    <p class="form-status" role="status" aria-live="polite"></p>
    <p class="field-note">${E(u.emailVia)}</p>
  </form>
  <div class="form-thanks" id="email-thanks" hidden>${DONE_ICON}<p>${E(u.emailThanks)}</p></div>
</section>
<p class="rss-line" id="rss">${RSS_ICON}<span>${E(u.rssLine)}</span><code>${E(feedUrl)}</code><button class="btn copy-btn" type="button" data-copy-text="${E(feedUrl)}"><span>${E(u.copyFeed)}</span><span class="done" aria-hidden="true">${E(u.copiedShort)}</span></button><span class="visually-hidden" role="status"></span></p>
</main>`;
  return shell({ t, depth: 2, segs: ["follow"], title: `${t.ui.followTitle} · ${t.ui.site}`, desc: t.ui.followLede, body, og: `og/${t.lang}/home.png` });
}

// Where Kit sends new subscribers after they click the link in its confirmation email (each language's Kit form
// points at its own). It says it worked, then offers the three newest stacks. Not in the sitemap or search results.
export function confirmedPage(t) {
  const to = linker(3), u = t.ui;
  const newest = [...shelfIn(t).map(item => ({ date: item.date, html: shelfTile(t, item, 3) })), ...booksIn(t).map(b => ({ date: b.added, html: bookTile(t, b, 3) }))]
    .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const body = `<main>
<a class="back" href="${to(t.lang)}">← ${E(u.allTopics)}</a>
<section class="hero">
  <h1>${E(u.confirmedTitle)}</h1>
  <p class="lede">${E(u.confirmedText)}</p>
</section>
<h2 class="shelf-label"><span>${E(u.confirmedNewest)}</span></h2>
<ul class="tile-grid">${newest.map(x => x.html).join("")}</ul>
</main>`;
  return shell({ t, depth: 3, segs: ["follow", "confirmed"], title: `${u.confirmedTitle} · ${u.site}`, desc: u.confirmedText, body, og: `og/${t.lang}/home.png`, noindex: true });
}

// Suggest or send an article: a plain form that Web3Forms emails to the owner (a topic, and optionally the link to
// something the reader wrote about it; the GitHub way to contribute is a note under it). site.js sends it in the background and shows the
// thanks here; without the script it still posts, and Web3Forms shows its own thank-you page. botcheck is a
// honeypot: hidden from people, filled in by bots, and Web3Forms drops those. Every field but the topic is optional.
export function suggestPage(t) {
  const to = linker(2), u = t.ui;
  const field = (name, label, input, optional = true, note = "") => `<label for="s-${name}">${E(label)}${optional ? ` <span class="opt">(${E(u.optional)})</span>` : ""}</label>
    ${input}${note ? `<p class="field-note">${E(note)}</p>` : ""}`;
  const body = `<main>
<a class="back" href="${to(t.lang)}">← ${E(u.allTopics)}</a>
<section class="hero">
  <h1>${E(u.suggestTitle)}</h1>
  <p class="lede">${E(u.suggestLede)}</p>
</section>
<form class="suggest-form" id="suggest-form" action="https://api.web3forms.com/submit" method="POST" data-ready="${SUGGEST_KEY ? "yes" : "no"}" data-sending="${E(u.suggestSending)}" data-error="${E(u.suggestError)}">
  <input type="hidden" name="access_key" value="${E(SUGGEST_KEY)}">
  <input type="hidden" name="subject" value="${E(`Minideas: ${u.suggestTitle} (${t.lang})`)}">
  <input type="hidden" name="from_name" value="Minideas">
  <input type="checkbox" name="botcheck" class="botcheck" tabindex="-1" autocomplete="off">
  ${field("topic", u.suggestTopic, `<input id="s-topic" name="topic" type="text" required maxlength="200">`, false)}
  <div class="examples" hidden><p class="field-note">${E(u.suggestExamplesLabel)}</p>${u.suggestExamples.map(q => [].concat(q)).map(([label, start = label]) => `<button type="button" data-example="${E(start)}">${E(label)}</button>`).join("")}</div>
  ${field("details", u.suggestDetails, `<textarea id="s-details" name="details" rows="4" maxlength="2000"></textarea>`)}
  ${field("link", u.suggestLink, `<input id="s-link" name="link" type="url" maxlength="500" placeholder="https://">`)}
  ${field("email", u.suggestEmail, `<input id="s-email" name="email" type="email" maxlength="200" autocomplete="email">`, true, u.suggestEmailNote)}
  <button class="btn primary" type="submit">${E(u.suggestSend)}</button>
  <p class="form-status" role="status" aria-live="polite"></p>
  <p class="field-note">${E(u.suggestVia)}</p>
</form>
<div class="suggest-thanks" id="suggest-thanks" hidden>
  ${DONE_ICON}
  <div><p>${E(u.suggestThanks)}</p><p class="thanks-next">${E(u.suggestFollowAsk)} <a href="${to(t.lang, "follow")}">${E(u.followTitle)}</a></p><button class="btn" type="button" id="suggest-again">${E(u.suggestAgain)}</button></div>
</div>
<p class="write-own">${GITHUB_ICON}<span><strong>${E(u.writeGit[0])}</strong> ${E(u.writeGit[1])} <a href="${CONTRIBUTE_URL}" target="_blank" rel="noopener">${E(u.writeHow)}</a></span></p>
</main>`;
  return shell({ t, depth: 2, segs: ["suggest"], title: `${u.suggestTitle} · ${u.site}`, desc: u.suggestLede, body, og: `og/${t.lang}/home.png` });
}

// 404.html: the host serves it for any address that doesn't exist, at any depth, so every link starts at the site
// root. It can't know the reader's language, so it speaks both, Vietnamese first.
export function notFoundPage() {
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${E(vi.ui.notFound)} · ${E(vi.ui.site)}</title>
${FONTS}
${THEME_SCRIPT}
${iconLinks("/")}
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<main class="wrap picker not-found">
  <a class="brand" href="/${INDEX}">${BRAND_MARK}<span>${E(vi.ui.site)}</span></a>
  <h1>${E(vi.ui.notFound)}</h1>
  <p>${E(vi.ui.notFoundText)}</p>
  <p lang="en">${E(en.ui.notFound)}. ${E(en.ui.notFoundText)}</p>
  <nav class="lang" aria-label="${E(vi.ui.homeLink)} / ${E(en.ui.homeLink)}">${[vi, en].map(o => `<a href="/${o.lang}/${INDEX}" hreflang="${o.lang}" lang="${o.lang}">${E(o.ui.homeLink)}</a>`).join("")}</nav>
</main>
</body>
</html>
`;
}

// Vietnamese readers come first. A saved choice wins; then Vietnamese if it is anywhere in the browser's languages
// or the clock is on Vietnam time (many Vietnamese phones are set to English); everyone else gets English.
// Link previews (Facebook, LinkedIn) don't run the script, so the page carries its own: the Vietnamese home page's
// image, with the tagline in both languages, for a bare minideas.com shared anywhere.
export function rootPage() {
  const langs = LANGS.map(o => o.lang), desc = `${vi.ui.lede} · ${en.ui.lede}`;
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${E(en.ui.site)}</title>
<meta name="description" content="${E(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${E(en.ui.site)}">
<meta property="og:title" content="${E(en.ui.site)}">
<meta property="og:description" content="${E(desc)}">
<meta property="og:locale" content="${vi.locale}">
<meta property="og:locale:alternate" content="${en.locale}">
${SITE_URL ? `<meta property="og:url" content="${SITE_URL}/">
<meta property="og:image" content="${ogUrl("og/vi/home.png")}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">` : ""}
<script>
(function () {
  var langs = ${JSON.stringify(langs)}, pick = null, zone = "";
  try { pick = localStorage.getItem("lang"); } catch (e) {}
  if (langs.indexOf(pick) < 0) {
    var prefs = navigator.languages || [navigator.language || ""];
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    pick = /^Asia\\/(Ho_Chi_Minh|Saigon)$/.test(zone) ? "vi" : "en";
    for (var i = 0; i < prefs.length; i++) if (String(prefs[i]).slice(0, 2).toLowerCase() === "vi") pick = "vi";
  }
  location.replace(pick + "/${INDEX}" + location.hash);
})();
</script>
<noscript><meta http-equiv="refresh" content="0; url=vi/${INDEX}"></noscript>
${SITE_LD}
${[vi, en].map(t => `<link rel="alternate" type="application/rss+xml" title="${E(feedTitle(t))}" href="${t.lang}/feed.xml">`).join("\n")}
${FONTS}
${THEME_SCRIPT}
${iconLinks("")}
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<main class="wrap picker">
  <h1>${E(en.ui.site)}</h1>
  <nav class="lang" aria-label="Language / Ngôn ngữ">${LANGS.map(o => `<a href="${o.lang}/${INDEX}" hreflang="${o.lang}" lang="${o.lang}">${o.name}</a>`).join("")}</nav>
</main>
</body>
</html>
`;
}
