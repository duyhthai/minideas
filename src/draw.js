// The drawing kit: primitives and the small pictures several topics share.
// Every drawing is a 320 × 220 SVG fragment built from these.

export const E = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const f1 = n => +(+n).toFixed(1);

/* ---------- primitives ---------- */
// Text; "\n" splits lines (centred on y). o.max shrinks the font so the longest line fits that width.
export function T(x, y, s, o = {}) {
  const lines = String(s).split("\n");
  let sz = o.size || (/\bsm\b/.test(o.c || "") ? 12.5 : 15);
  if (o.max) sz = Math.min(sz, o.max / (Math.max(...lines.map(l => l.length)) * .48));
  sz = f1(sz);
  const lh = o.lh || 1.18;
  const attrs = `class="lbl ${o.c || ""}" text-anchor="${o.a || "middle"}"${sz !== 15 ? ` style="font-size:${sz}px"` : ""}${o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : ""}`;
  if (lines.length === 1) return `<text x="${f1(x)}" y="${f1(y)}" ${attrs}>${E(s)}</text>`;
  const y0 = f1(y - (lines.length - 1) * lh * sz / 2);
  return `<text x="${f1(x)}" y="${y0}" ${attrs}>${lines.map((l, i) => `<tspan x="${f1(x)}" dy="${i ? lh + "em" : 0}">${E(l)}</tspan>`).join("")}</text>`;
}
export const L = (x1, y1, x2, y2, c = "") => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="s ${c}"/>`;
export const C = (cx, cy, r, fill = "", c = "") => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" class="${fill ? "sf " + fill : "s"} ${c}"/>`;
export const R = (x, y, w, h, fill = "", c = "", rx = 8) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" class="${fill ? "sf " + fill : "s"} ${c}"/>`;
export const P = (d, fill = "", c = "") => `<path d="${d}" class="${fill ? "sf " + fill : "s"} ${c}"/>`;
export const EL = (cx, cy, rx, ry, fill = "", c = "") => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="${fill ? "sf " + fill : "s"} ${c}"/>`;

export function head(x, y, ang, c = "", hs = 9) {
  const bx = x - hs * Math.cos(ang), by = y - hs * Math.sin(ang), k = hs * .55;
  return `<polygon points="${f1(x)},${f1(y)} ${f1(bx + k * Math.sin(ang))},${f1(by - k * Math.cos(ang))} ${f1(bx - k * Math.sin(ang))},${f1(by + k * Math.cos(ang))}" class="head ${c}"/>`;
}
export function A(x1, y1, x2, y2, c = "", hs = 9) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return L(x1, y1, x2 - hs * .8 * Math.cos(a), y2 - hs * .8 * Math.sin(a), c) + head(x2, y2, a, c, hs);
}
export const pillW = (text, sz) => Math.max(...String(text).split("\n").map(l => l.length)) * sz * .5 + 20;
export function pill(cx, cy, text, fill = "fk", o = {}) {
  const lines = String(text).split("\n"), sz = o.size || 13;
  const w = o.w || pillW(text, sz);
  const h = o.h || lines.length * sz * 1.18 + 12;
  return R(cx - w / 2, cy - h / 2, w, h, fill, o.rc || "", Math.min(h / 2, 12)) +
         T(cx, cy + sz * .35, text, { size: sz, c: (o.tc || "") + (o.on ? " on" : "") });
}
export function crPath(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]},${p2[1]}`;
  }
  return d;
}
export const axes = (x0 = 40, y0 = 196, x1 = 302, yTop = 14) => L(x0, y0, x1, y0) + L(x0, y0, x0, yTop);

// a round face: mood "up" (smile), "down" (frown) or "flat"
export function face(x, y, mood, r = 11) {
  const k = r / 11, mouth = mood === "flat" ? L(x - 4 * k, y + 5 * k, x + 4 * k, y + 5 * k, "thin")
    : P(mood === "up" ? `M${f1(x - 5 * k)},${f1(y + 3 * k)} Q${x},${f1(y + 8 * k)} ${f1(x + 5 * k)},${f1(y + 3 * k)}` : `M${f1(x - 5 * k)},${f1(y + 7 * k)} Q${x},${f1(y + 2 * k)} ${f1(x + 5 * k)},${f1(y + 7 * k)}`, "", "thin");
  return C(x, y, r, "fk") + C(x - 4 * k, y - 2 * k, 1.5, "fi") + C(x + 4 * k, y - 2 * k, 1.5, "fi") + mouth;
}

/* little people */
export function fig(x, y, pose) {
  const hd = (hx, hy) => C(hx, hy, 8, "fk");
  if (pose === "walk") return L(x, y - 55, x, y - 26) + L(x, y - 26, x - 9, y) + L(x, y - 26, x + 9, y) + L(x, y - 48, x - 9, y - 32) + L(x, y - 48, x + 8, y - 33) + hd(x, y - 64);
  if (pose === "run") return L(x + 4, y - 53, x - 2, y - 27) + L(x - 2, y - 27, x - 18, y - 6) + L(x - 2, y - 27, x + 12, y - 14) + L(x + 12, y - 14, x + 10, y) + L(x + 3, y - 46, x + 18, y - 38) + L(x + 3, y - 46, x - 12, y - 40) + hd(x + 6, y - 62);
  if (pose === "bike") return C(x - 17, y - 12, 12) + C(x + 17, y - 12, 12) + L(x - 17, y - 12, x, y - 12) + L(x, y - 12, x - 4, y - 30) + L(x - 17, y - 12, x - 4, y - 30) + L(x - 4, y - 30, x + 12, y - 32) + L(x + 12, y - 32, x + 17, y - 12) + L(x + 12, y - 32, x + 15, y - 38) +
    L(x - 4, y - 34, x + 3, y - 54) + L(x + 2, y - 50, x + 14, y - 38) + L(x - 4, y - 34, x + 5, y - 24) + L(x + 5, y - 24, x, y - 12) + hd(x + 6, y - 62);
  /* golf */
  return L(x, y - 55, x, y - 26) + L(x, y - 26, x - 11, y) + L(x, y - 26, x + 11, y) + L(x, y - 48, x - 12, y - 60) + L(x, y - 48, x - 8, y - 59) + L(x - 12, y - 60, x + 16, y - 82, "w3") + hd(x, y - 64);
}
export function wave(x, y, w, amp, freq, spike) {
  let d = "";
  for (let i = 0; i <= 12; i++) {
    const a = spike ? (i > 7 && i < 11 ? 10 : 1.5) : amp;
    d += `${i ? "L" : "M"}${f1(x + 4 + i * (w - 8) / 12)},${f1(y + Math.sin(i * freq + 1) * a)} `;
  }
  return P(d, "", "thin blue-s");
}
export function brain(cx, cy, k = 1) {
  const q = n => f1(n * k);
  return EL(cx, cy, q(52), q(44), "fb") +
    P(`M${cx},${f1(cy - 44 * k)} C${f1(cx - 12 * k)},${f1(cy - 14 * k)} ${f1(cx + 12 * k)},${f1(cy + 14 * k)} ${cx},${f1(cy + 44 * k)}`) +
    P(`M${f1(cx - 40 * k)},${f1(cy - 12 * k)} Q${f1(cx - 26 * k)},${f1(cy - 30 * k)} ${f1(cx - 12 * k)},${f1(cy - 16 * k)}`) +
    P(`M${f1(cx - 38 * k)},${f1(cy + 16 * k)} Q${f1(cx - 22 * k)},${f1(cy)} ${f1(cx - 10 * k)},${f1(cy + 20 * k)}`) +
    L(cx + 8 * k, cy - 16 * k, cx + 32 * k, cy - 16 * k, "thin") + C(cx + 35 * k, cy - 16 * k, f1(3.5 * k), "fi") +
    L(cx + 6 * k, cy + 6 * k, cx + 24 * k, cy + 6 * k, "thin") + L(cx + 24 * k, cy + 6 * k, cx + 30 * k, cy + 20 * k, "thin") + C(cx + 31 * k, cy + 23 * k, f1(3.5 * k), "fi");
}

/* ---------- shared pictures ---------- */
export const env = (x, y, w = 48, h = 32) => R(x, y, w, h, "fk", "", 4) + P(`M${x + 3},${y + 4} L${x + w / 2},${y + h * .55} L${x + w - 3},${y + 4}`);
export const codeChip = (cx, cy, s, w) => R(cx - w / 2, cy - 13, w, 26, "ft", "thin", 6) + T(cx, cy + 5, s, { size: 13, max: w - 12 });
export const tick = (x, y) => P(`M${x - 8},${y} L${x - 2},${y + 7} L${x + 9},${y - 8}`, "", "blue-s w3");
