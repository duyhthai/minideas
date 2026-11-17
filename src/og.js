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

// A photo, uncropped and right-aligned, scaled to fit a 544 × 470 box, with rounded corners.
function photoPanel({ file, width, height }) {
  const k = Math.min(544 / width, 470 / height), w = Math.round(width * k), h = Math.round(height * k);
  const x = 1168 - w, y = Math.round((630 - h) / 2);
  const data = `data:image/jpeg;base64,${readFileSync(file).toString("base64")}`;
  return `<clipPath id="ph"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22"/></clipPath>
<image href="${data}" x="${x}" y="${y}" width="${w}" height="${h}" clip-path="url(#ph)" preserveAspectRatio="xMidYMid meet"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="none" stroke="${C.line}" stroke-width="2"/>`;
}

/**
 * @param {object} o
 * @param {string} o.title
 * @param {string} [o.text]       one-sentence summary; without it the title is bigger and centred
 * @param {string} [o.footer]     small line at the bottom
 * @param {string} [o.drawing]    inner markup of a 320 × 220 drawing from draw.js
 * @param {object} [o.photo]      { file, width, height }: a JPEG shown whole on the right instead of a drawing
 */
export function renderOg({ title, text, footer, drawing, photo }) {
  const colW = 528;
  let size = 64, titleLines;
  for (size of text ? [64, 54, 46] : [84, 72, 60]) {
    const perLine = Math.floor(colW / (size * .58));
    titleLines = wrap(title, perLine, 3);
    const last = titleLines.at(-1), orphan = titleLines.length > 1 && !last.includes(" ") && last.length < 4;
    const tooLong = titleLines.some(l => l.length > perLine); // a single word wider than the column
    if (!last.endsWith("…") && !orphan && !tooLong) break;
  }
  // without a summary, centre the title block vertically
  const top = text ? 110 : (630 - (titleLines.length - 1) * size * 1.08) / 2 - size * .62;
  const titleSvg = titleLines.map((l, i) =>
    `<text x="64" y="${top + size + i * size * 1.08}" font-family="Bricolage Grotesque" font-weight="800" font-size="${size}" fill="${C.ink}">${E(l)}</text>`).join("");
  const textTop = top + size + (titleLines.length - 1) * size * 1.08 + 56;
  const textSvg = !text ? "" : wrap(text, Math.floor(colW / (26 * .58)), 4).map((l, i) =>
    `<text x="64" y="${textTop + i * 37}" font-family="Lexend" font-size="26" fill="${C.ink2}">${E(l)}</text>`).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <style>${DRAWING_CSS}</style>
</defs>
<rect width="1200" height="630" fill="${C.paper}"/>
${titleSvg}
${textSvg}
${footer ? `<text x="64" y="568" font-family="Patrick Hand" font-size="30" fill="${C.ink2}">${E(footer)}</text>` : ""}
${photo ? photoPanel(photo) : `<rect x="624" y="123" width="544" height="384" rx="28" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>
<clipPath id="art"><rect x="640" y="139" width="512" height="352" rx="18"/></clipPath>
<image x="640" y="139" width="512" height="352" clip-path="url(#art)" href="data:image/svg+xml;base64,${Buffer.from(sketchDocument(sketchShapes(drawing || ""), "light")).toString("base64")}"/>
<svg x="640" y="139" width="512" height="352" viewBox="0 0 320 220">${withArrows(sketchLabels(drawing || ""))}</svg>`}
</svg>`;
  return new Resvg(svg, { font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: "Lexend" } }).render().asPng();
}
