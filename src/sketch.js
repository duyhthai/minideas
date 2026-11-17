// Pencil sketch drawings as pictures. The shapes of a drawing in the sketch look (SKETCH in build.mjs) are rendered at
// build time, once per theme, into a WebP the page simply shows: graphite lines gone over a few times with paper
// grain, colour shaded in loosely with coloured pencil, a little off the outline. The labels stay real text on top
// (sketchLabels), so readers can select and copy them. The light theme has three passes; the dark theme
// a lighter touch, like chalk, with denser colour so labels on it stay readable. Each picture is drawn on its theme's
// paper (--art in style.css), which keeps the file small. resvg draws it (it has no CSS variables, so each
// theme's colours are written out here) and sharp encodes it.
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
// colours from assets/style.css; paper is --art, ink is --sketch-ink
const THEMES = {
  light: { paper: "#fbf9f3", ink: "#2c3038", ink2: "#56607a", on: "#1c2333", blue: "#2f58d6", coral: "#d4462c",
    fy: "#ffd466", fb: "#a9bcff", fm: "#86dcc1", fc: "#ffa595", ft: "#e1e7f6", wash: .3, filter: "pencil", sw: 1.8 },
  dark: { paper: "#1b2030", ink: "#e4e2dc", ink2: "#a3abc0", on: "#141927", blue: "#8ba5ff", coral: "#ff8d77",
    fy: "#f0c75a", fb: "#8ea5f7", fm: "#6cd1b1", fc: "#f59a87", ft: "#283150", wash: .78, filter: "pencil-light", sw: 1.9 },
};

const FILTERS = `
<filter id="pencil" filterUnits="userSpaceOnUse" x="-20" y="-20" width="360" height="260">
  <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="3" result="w1"/>
  <feDisplacementMap in="SourceGraphic" in2="w1" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="a"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="11" result="w2"/>
  <feDisplacementMap in="SourceGraphic" in2="w2" scale="5.5" xChannelSelector="G" yChannelSelector="R" result="b0"/>
  <feComponentTransfer in="b0" result="b"><feFuncA type="linear" slope=".55"/></feComponentTransfer>
  <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="1" seed="29" result="w3"/>
  <feDisplacementMap in="SourceGraphic" in2="w3" scale="4.5" xChannelSelector="B" yChannelSelector="R" result="c0"/>
  <feComponentTransfer in="c0" result="c"><feFuncA type="linear" slope=".3"/></feComponentTransfer>
  <feMerge result="lines"><feMergeNode in="c"/><feMergeNode in="b"/><feMergeNode in="a"/></feMerge>
  <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="7" result="grain"/>
  <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -.5" result="mask"/>
  <feComposite in="lines" in2="mask" operator="in"/>
</filter>
<filter id="pencil-light" filterUnits="userSpaceOnUse" x="-20" y="-20" width="360" height="260">
  <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="3" result="w1"/>
  <feDisplacementMap in="SourceGraphic" in2="w1" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="a"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="11" result="w2"/>
  <feDisplacementMap in="SourceGraphic" in2="w2" scale="4.5" xChannelSelector="G" yChannelSelector="R" result="b0"/>
  <feComponentTransfer in="b0" result="b"><feFuncA type="linear" slope=".4"/></feComponentTransfer>
  <feMerge result="lines"><feMergeNode in="b"/><feMergeNode in="a"/></feMerge>
  <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="7" result="grain"/>
  <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.4 0 0 0 -.45" result="mask"/>
  <feComposite in="lines" in2="mask" operator="in"/>
</filter>`;

// coloured pencil: a pale wash under diagonal strokes of uneven pressure
const pattern = (id, colour, wash) => `<pattern id="pen-${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">` +
  `<rect width="14" height="14" fill="${colour}" opacity="${wash}"/><g stroke="${colour}" stroke-linecap="round">` +
  `<path d="M0 1.6L14 1.3" stroke-width="3"/><path d="M0 5.8L14 6.2" stroke-width="2.2" opacity=".75"/>` +
  `<path d="M0 10L14 9.6" stroke-width="2.7"/><path d="M-2 12.6L9 12.8" stroke-width="1.6" opacity=".6"/></g></pattern>`;

const css = t => `
.s{fill:none;stroke:${t.ink};stroke-width:${t.sw};stroke-linecap:round;stroke-linejoin:round}
.sf{stroke:${t.ink};stroke-width:${t.sw};stroke-linejoin:round}
.head{fill:${t.ink};stroke:${t.ink};stroke-width:1.5;stroke-linejoin:round}
.fk{fill:${t.paper}}.fi{fill:${t.ink}}
.cf{stroke:none}.cf.fy{fill:url(#pen-y)}.cf.fb{fill:url(#pen-b)}.cf.fm{fill:url(#pen-m)}.cf.fc{fill:url(#pen-c)}.cf.ft{fill:url(#pen-t)}
.sf.fy,.sf.fb,.sf.fm,.sf.fc,.sf.ft{fill:none}
.thin{stroke-width:1.2}.w3{stroke-width:2.4}.dash{stroke-dasharray:5 6}.faint{opacity:.28}
.grid{stroke:${t.ink2};stroke-width:1;opacity:.5}
.blue-s{stroke:${t.blue}}.head.blue-s{fill:${t.blue}}.coral-s{stroke:${t.coral}}.head.coral-s{fill:${t.coral}}
.sq{fill:${t.coral};fill-opacity:.2;stroke:${t.coral};stroke-width:1.4}`;

// A drawing split in two: its shapes (for the picture) and its labels (real text on the page). A drawing's own
// group (a tilted stamp) stays in both, so its labels still turn with it.
const LABEL = /<text[\s\S]*?<\/text>/g, SHAPE = /<(?:line|rect|circle|ellipse|path|polygon)\b[^>]*\/>/g;
export const sketchShapes = drawing => drawing.replace(LABEL, "");
export const sketchLabels = drawing => drawing.replace(SHAPE, "");

// Each group of shapes gets the pencil filter, with each coloured shape split into a colour layer, nudged off its
// outline, and the outline itself.
const GROUP = /(<g [^>]*>)([\s\S]*?)<\/g>/g;
const layer = (s, filter) => `<g filter="url(#${filter})">${s.replace(/<(rect|circle|path|ellipse|polygon) ([^>]*?)class="sf (f[ybmct])\b([^"]*)"\/>/g,
  `<$1 $2class="cf $3" transform="translate(1.8 1.4)"/><$1 $2class="sf $3$4"/>`)}</g>`;
const pencil = (shapes, filter) => layer(shapes.replace(GROUP, ""), filter) +
  [...shapes.matchAll(GROUP)].map(([, open, inner]) => `${open}${layer(inner, filter)}</g>`).join("");

// A drawing's shapes (sketchShapes) in the sketch look, as a standalone SVG for resvg: the theme's paper, then the
// pencil-filtered shapes. Share images (og.js) embed this; renderSketch turns it into the page's picture.
export function sketchDocument(shapes, theme, viewBox = "0 0 320 220") {
  const t = THEMES[theme], [, , w, h] = viewBox.split(" ").map(Number);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${viewBox}"><defs>${FILTERS}` +
    Object.entries({ y: t.fy, b: t.fb, m: t.fm, c: t.fc, t: t.ft }).map(([k, v]) => pattern(k, v, t.wash)).join("") +
    `<style>${css(t)}</style></defs><rect x="-20" y="-20" width="360" height="260" fill="${t.paper}"/>${pencil(shapes, t.filter)}</svg>`;
}

// The page's picture: sketchDocument as a WebP, `scale` times the size of its viewBox.
export async function renderSketch(shapes, theme, viewBox = "0 0 320 220", scale = 2) {
  const png = new Resvg(sketchDocument(shapes, theme, viewBox), { fitTo: { mode: "zoom", value: scale }, font: { loadSystemFonts: false } }).render().asPng();
  return sharp(png).webp({ quality: 75, effort: 6 }).toBuffer();
}
