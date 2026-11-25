// Link-preview images (1200 × 630 PNG) for Facebook, Zalo, LinkedIn, X and chat apps.
// Rendered at build time from the same drawings as the pages, in the light theme: the pencil sketch picture
// (src/sketch.js) with the labels drawn on top.
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { E } from "./draw.js";
import { sketchDocument, sketchShapes, sketchLabels } from "./sketch.js";

const FONT_DIR = join(dirname(fileURLToPath(import.meta.url)), "fonts");
const FONTS = ["PatrickHand-Regular", "Lexend-Regular", "Lexend-Bold", "BricolageGrotesque-ExtraBold"].map(f => join(FONT_DIR, f + ".ttf"));

// Light-theme colors from assets/style.css, written out because the renderer has no CSS variables. art and
// sketchInk are the drawings' paper and pencil.
const C = { paper: "#edf0f6", card: "#ffffff", art: "#fbf9f3", ink: "#1c2333", ink2: "#56607a", line: "#d8deea", blue: "#2f58d6", coral: "#d4462c",
  sketchInk: "#2c3038" };
const DRAWING_CSS = `
.s{fill:none;stroke:${C.ink};stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;filter:url(#rough)}
.sf{stroke:${C.ink};stroke-width:2.4;stroke-linejoin:round;filter:url(#rough)}
.head{fill:${C.ink};stroke:${C.ink};stroke-width:1.5;stroke-linejoin:round}
.fb{fill:#a9bcff}.fy{fill:#ffd466}.fm{fill:#86dcc1}.fc{fill:#ffa595}.ft{fill:#e1e7f6}.fk{fill:#ffffff}.fi{fill:${C.ink}}
.thin{stroke-width:1.5}.w3{stroke-width:3.2}.dash{stroke-dasharray:5 6}.faint{opacity:.28}
.grid{stroke:${C.ink2};stroke-width:1;opacity:.5}
.blue-s{stroke:${C.blue}}.head.blue-s{fill:${C.blue}}.coral-s{stroke:${C.coral}}.head.coral-s{fill:${C.coral}}
.sq{fill:${C.coral};fill-opacity:.2;stroke:${C.coral};stroke-width:1.4}
.lbl{font-family:"Patrick Hand";font-size:15px;fill:${C.sketchInk}}
.lbl.on{fill:${C.ink}}.lbl.mut{fill:${C.ink2}}.lbl.cor{fill:${C.coral}}.lbl.blu{fill:${C.blue}}
.lbl.halo{paint-order:stroke;stroke:${C.art};stroke-width:5px;stroke-linejoin:round}`;

// Greedy word wrap by estimated character width; the last line gets "…" if the text runs over. Non-breaking spaces hold words together.
function wrap(text, perLine, maxLines) {
  const lines = [];
  let line = "";
  for (const word of String(text).split(/[ \t\n]+/)) {
    if (line && (line + " " + word).length > perLine) { lines.push(line); line = word; }
    else line = line ? line + " " + word : word;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/[\s,.;:]*\S*$/, "") + "…";
  }
  return lines;
}

// Patrick Hand has no arrow glyphs, and the renderer switches the whole label to another font
// when one character is missing (browsers fall back per character). Draw arrows as ASCII here.
const withArrows = svg => svg.replace(/→/g, "->").replace(/←/g, "&lt;-");

const ROUGH = `<filter id="rough" filterUnits="userSpaceOnUse" x="-20" y="-20" width="360" height="260">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4"/>
    <feDisplacementMap in="SourceGraphic" scale="1.8"/>
  </filter>`;

// The part of a 320 × 220 drawing that has something on it, as a viewBox, so a tile can show the drawing larger.
// A margin covers strokes, and a sparse drawing keeps at least 220 × 150 so it isn't blown up.
export function drawingViewBox(drawing, pad = 8, minW = 220, minH = 150) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><defs>${ROUGH}<style>${DRAWING_CSS}</style></defs>${withArrows(drawing)}</svg>`;
  const b = new Resvg(svg, { font: { fontFiles: FONTS.slice(0, 1), loadSystemFonts: false, defaultFontFamily: "Patrick Hand" } }).getBBox();
  if (!b) return "0 0 320 220";
  // grow [lo, hi] to at least min around its centre, then slide it back inside [0, max]
  const span = (lo, hi, min, max) => {
    const w = Math.min(max, Math.max(hi - lo, min)), a = Math.min(Math.max(0, (lo + hi - w) / 2), max - w);
    return [Math.round(a), Math.round(w)];
  };
  const [x, w] = span(b.x - pad, b.x + b.width + pad, minW, 320), [y, h] = span(b.y - pad, b.y + b.height + pad, minH, 220);
  return `${x} ${y} ${w} ${h}`;
}

// A drawing as a pencil sketch (light theme) with its labels on top, filling a w × h box at x, y.
function sketchPanel(drawing, x, y, w, h, id) {
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.round(w / 28)}"/></clipPath>
<image x="${x}" y="${y}" width="${w}" height="${h}" clip-path="url(#${id})" href="data:image/svg+xml;base64,${Buffer.from(sketchDocument(sketchShapes(drawing || ""), "light")).toString("base64")}"/>
<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 320 220">${withArrows(sketchLabels(drawing || ""))}</svg>`;
}

// Facebook's phone app sometimes crops a preview to the square in its middle (x 285–915), so everything that matters
// sits in a centred column inside it; the sides only carry decoration: a fanned stack of cards on each side, in the
// header logo's style, faint enough to stay out of the way.
const CX = 600, COL = 580;
function sideStacks() {
  const card = (x, y, rot, fill, front) => `<g transform="rotate(${rot} ${x} ${y})">
<rect x="${x - 70}" y="${y - 200}" width="140" height="200" rx="16" fill="${fill}" stroke="${C.ink}" stroke-width="2.5"/>${!front ? "" :
    `<rect x="${x - 52}" y="${y - 182}" width="104" height="78" rx="9" fill="#ffd466" stroke="${C.ink}" stroke-width="2"/>` +
    [0, 1, 2].map(i => `<line x1="${x - 52}" y1="${y - 82 + i * 22}" x2="${x + 52 - (i === 2) * 38}" y2="${y - 82 + i * 22}" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>`).join("")}</g>`;
  const stack = (x, y, dir) => card(x, y, dir * 16, "#a9bcff") + card(x, y, dir * 8, "#86dcc1") + card(x, y, 0, "#ffffff", true);
  return `<g opacity=".38">${stack(150, 450, -1)}${stack(1050, 450, 1)}</g>`;
}

// A photo, uncropped and centred, scaled to fit a w × h box at the given top, with rounded corners.
function photoPanel({ file, width, height }, top, boxW, boxH) {
  const k = Math.min(boxW / width, boxH / height), w = Math.round(width * k), h = Math.round(height * k);
  const x = Math.round(CX - w / 2), y = Math.round(top + (boxH - h) / 2);
  const data = `data:image/jpeg;base64,${readFileSync(file).toString("base64")}`;
  return `<clipPath id="ph"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/></clipPath>
<image href="${data}" x="${x}" y="${y}" width="${w}" height="${h}" clip-path="url(#ph)" preserveAspectRatio="xMidYMid meet"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="none" stroke="${C.line}" stroke-width="2"/>`;
}

// The logo and the site name, centred on a row whose top is y
function brandRow(mark, site, y, size) {
  const textW = String(site || "").length * size * .62, w = size * 1.25 + size * .3 + textW, x = CX - w / 2;
  return `<svg x="${x}" y="${y}" width="${size * 1.25}" height="${size * 1.25}" viewBox="0 0 32 32">${brandMark(mark)}</svg>
<text x="${x + size * 1.55}" y="${y + size * 1.02}" font-family="Bricolage Grotesque" font-weight="800" font-size="${size}" fill="${C.ink}">${E(site || "")}</text>`;
}

/**
 * A page's preview, in a centred column (see sideStacks): the logo and site name, where the page sits as a small
 * capitalised line, the title, then the drawing or the book's cover as large as the rest allows. The page's summary
 * isn't drawn: link previews print it (og:description) under the picture.
 * @param {object} o
 * @param {string} o.title
 * @param {string} [o.footer]     where the page sits ("Bài 3/15 · Nền tảng AI", "15 bài", the book's author)
 * @param {string} [o.drawing]    inner markup of a 320 × 220 drawing from draw.js
 * @param {object} [o.photo]      { file, width, height }: a JPEG shown whole instead of a drawing
 * @param {string} [o.mark]       the header logo's SVG
 * @param {string} [o.site]       the site name next to the logo
 */
export function renderOg({ title, footer, drawing, photo, mark, site }) {
  let y = 34, out = "";
  if (mark) { out += brandRow(mark, site, y, 30); y += 52; }
  if (footer) {
    out += `<text x="${CX}" y="${y + 30}" text-anchor="middle" font-family="Lexend" font-weight="700" font-size="19" letter-spacing="1.5" fill="${C.ink2}">${E(footer.toLocaleUpperCase("vi"))}</text>`;
    y += 38;
  }
  // the largest size that fits the title in two lines, else three smaller ones
  let size, lines;
  for ([size, lines] of [[58, 2], [50, 2], [44, 3], [38, 3]]) {
    const perLine = Math.floor(COL / (size * .56)), wrapped = wrap(title, perLine, lines);
    const tooLong = wrapped.some(l => l.length > perLine); // a single word wider than the column
    if (!wrapped.at(-1).endsWith("…") && !tooLong) { lines = wrapped; break; }
    lines = wrapped;
  }
  out += lines.map((l, i) => `<text x="${CX}" y="${y + 12 + size * .92 + i * size * 1.06}" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="${size}" fill="${C.ink}">${E(l)}</text>`).join("");
  y += 12 + lines.length * size * 1.06;
  const top = y + 22, boxH = 630 - 32 - top;
  let picture;
  if (photo) picture = photoPanel(photo, top, COL, boxH);
  else {
    const h = Math.min(boxH, 340), w = h * 320 / 220, x = CX - w / 2, pad = Math.round(h / 24);
    picture = `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="${Math.round(h / 12)}" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>
${sketchPanel(drawing, x + pad, top + pad, w - 2 * pad, h - 2 * pad, "art")}`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <style>${DRAWING_CSS}</style>
</defs>
<rect width="1200" height="630" fill="${C.paper}"/>
${sideStacks()}
${out}
${picture}
</svg>`;
  return new Resvg(svg, { font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: "Lexend" } }).render().asPng();
}

// Light-theme values of the CSS tokens the header logo uses (assets/style.css)
const TOKENS = { ink: C.ink, on: C.ink, fk: "#ffffff", "f-blue": "#a9bcff", "f-yellow": "#ffd466", "f-mint": "#86dcc1" };
// the header logo's inner markup, with its theme colors written out
const brandMark = mark => mark.replace(/^<svg[^>]*>|<\/svg>$/g, "").replace(/var\(--([\w-]+)\)/g, (m, k) => TOKENS[k] || m);

/**
 * The home page's preview: the logo and site name and the tagline, centred, then a row of three stacks, each a card
 * with its picture (a drawing, or a book's cover photo shown whole) and its title. The middle card sits in the centre
 * square that Facebook's phone app may crop to (see sideStacks), with the other two peeking in at its sides.
 * @param {object} o
 * @param {string} o.title   the site name
 * @param {string} o.text    the tagline
 * @param {string} o.mark    the header logo's SVG (viewBox 0 0 32 32), colored with var(--token)
 * @param {{ title: string, drawing?: string, photo?: { file, width, height } }[]} o.tiles
 */
export function renderHomeOg({ title, text, mark, tiles }) {
  const textSvg = text.split(/(?<=,) /).flatMap(part => wrap(part, Math.floor(COL / (26 * .55)), 1)).slice(0, 2).map((l, i) =>
    `<text x="${CX}" y="${178 + i * 36}" text-anchor="middle" font-family="Lexend" font-size="26" fill="${C.ink2}">${E(l)}</text>`).join("");
  const cardW = 334, gap = 35, top = 262, pic = { w: 310, h: 213 };
  const cards = tiles.map((tile, i) => {
    const x = 64 + i * (cardW + gap), px = x + 12, py = top + 12;
    let picture;
    if (tile.photo) {
      const { file, width, height } = tile.photo, k = Math.min((pic.w - 24) / width, (pic.h - 24) / height);
      const w = Math.round(width * k), h = Math.round(height * k), ix = px + Math.round((pic.w - w) / 2), iy = py + Math.round((pic.h - h) / 2);
      picture = `<rect x="${px}" y="${py}" width="${pic.w}" height="${pic.h}" rx="11" fill="${C.art}"/>
<clipPath id="tp${i}"><rect x="${ix}" y="${iy}" width="${w}" height="${h}" rx="6"/></clipPath>
<image href="data:image/jpeg;base64,${readFileSync(file).toString("base64")}" x="${ix}" y="${iy}" width="${w}" height="${h}" clip-path="url(#tp${i})" preserveAspectRatio="xMidYMid meet"/>`;
    } else picture = sketchPanel(tile.drawing, px, py, pic.w, pic.h, `ta${i}`);
    const caption = wrap(tile.title, Math.floor((cardW - 24) / (24 * .6)), 2).map((l, j) =>
      `<text x="${x + cardW / 2}" y="${py + pic.h + 40 + j * 30}" text-anchor="middle" font-family="Lexend" font-weight="700" font-size="24" fill="${C.ink}">${E(l)}</text>`).join("");
    return `<rect x="${x}" y="${top}" width="${cardW}" height="306" rx="20" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>\n${picture}\n${caption}`;
  }).join("\n");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <style>${DRAWING_CSS}</style>
</defs>
<rect width="1200" height="630" fill="${C.paper}"/>
${brandRow(mark, title, 40, 64)}
${textSvg}
${cards}
</svg>`;
  return new Resvg(svg, { font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: "Lexend" } }).render().asPng();
}
