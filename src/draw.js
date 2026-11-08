// Drawing vocabulary for the illustrated panels.
// Every drawing is 320 × 220 and receives the language's label table (lb), so the
// same picture renders in any language. Labels live in src/i18n/<lang>.js under `art`.

export const E = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const f1 = n => +(+n).toFixed(1);

/* ---------- primitives ---------- */
// Text; "\n" splits lines (centred on y). o.max shrinks the font so the longest line fits that width.
function T(x, y, s, o = {}) {
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
const L = (x1, y1, x2, y2, c = "") => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="s ${c}"/>`;
const C = (cx, cy, r, fill = "", c = "") => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" class="${fill ? "sf " + fill : "s"} ${c}"/>`;
const R = (x, y, w, h, fill = "", c = "", rx = 8) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" class="${fill ? "sf " + fill : "s"} ${c}"/>`;
const P = (d, fill = "", c = "") => `<path d="${d}" class="${fill ? "sf " + fill : "s"} ${c}"/>`;
const EL = (cx, cy, rx, ry, fill = "", c = "") => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="${fill ? "sf " + fill : "s"} ${c}"/>`;

function head(x, y, ang, c = "", hs = 9) {
  const bx = x - hs * Math.cos(ang), by = y - hs * Math.sin(ang), k = hs * .55;
  return `<polygon points="${f1(x)},${f1(y)} ${f1(bx + k * Math.sin(ang))},${f1(by - k * Math.cos(ang))} ${f1(bx - k * Math.sin(ang))},${f1(by + k * Math.cos(ang))}" class="head ${c}"/>`;
}
function A(x1, y1, x2, y2, c = "", hs = 9) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return L(x1, y1, x2 - hs * .8 * Math.cos(a), y2 - hs * .8 * Math.sin(a), c) + head(x2, y2, a, c, hs);
}
const pillW = (text, sz) => Math.max(...String(text).split("\n").map(l => l.length)) * sz * .5 + 20;
function pill(cx, cy, text, fill = "fk", o = {}) {
  const lines = String(text).split("\n"), sz = o.size || 13;
  const w = o.w || pillW(text, sz);
  const h = o.h || lines.length * sz * 1.18 + 12;
  return R(cx - w / 2, cy - h / 2, w, h, fill, o.rc || "", Math.min(h / 2, 12)) +
         T(cx, cy + sz * .35, text, { size: sz, c: (o.tc || "") + (o.on ? " on" : "") });
}
function crPath(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]},${p2[1]}`;
  }
  return d;
}
const axes = (x0 = 40, y0 = 196, x1 = 302, yTop = 14) => L(x0, y0, x1, y0) + L(x0, y0, x0, yTop);

/* little people */
function fig(x, y, pose) {
  const hd = (hx, hy) => C(hx, hy, 8, "fk");
  if (pose === "walk") return L(x, y - 55, x, y - 26) + L(x, y - 26, x - 9, y) + L(x, y - 26, x + 9, y) + L(x, y - 48, x - 9, y - 32) + L(x, y - 48, x + 8, y - 33) + hd(x, y - 64);
  if (pose === "run") return L(x + 4, y - 53, x - 2, y - 27) + L(x - 2, y - 27, x - 18, y - 6) + L(x - 2, y - 27, x + 12, y - 14) + L(x + 12, y - 14, x + 10, y) + L(x + 3, y - 46, x + 18, y - 38) + L(x + 3, y - 46, x - 12, y - 40) + hd(x + 6, y - 62);
  if (pose === "bike") return C(x - 17, y - 12, 12) + C(x + 17, y - 12, 12) + L(x - 17, y - 12, x, y - 12) + L(x, y - 12, x - 4, y - 30) + L(x - 17, y - 12, x - 4, y - 30) + L(x - 4, y - 30, x + 12, y - 32) + L(x + 12, y - 32, x + 17, y - 12) + L(x + 12, y - 32, x + 15, y - 38) +
    L(x - 4, y - 34, x + 3, y - 54) + L(x + 2, y - 50, x + 14, y - 38) + L(x - 4, y - 34, x + 5, y - 24) + L(x + 5, y - 24, x, y - 12) + hd(x + 6, y - 62);
  /* golf */
  return L(x, y - 55, x, y - 26) + L(x, y - 26, x - 11, y) + L(x, y - 26, x + 11, y) + L(x, y - 48, x - 12, y - 60) + L(x, y - 48, x - 8, y - 59) + L(x - 12, y - 60, x + 16, y - 82, "w3") + hd(x, y - 64);
}
function wave(x, y, w, amp, freq, spike) {
  let d = "";
  for (let i = 0; i <= 12; i++) {
    const a = spike ? (i > 7 && i < 11 ? 10 : 1.5) : amp;
    d += `${i ? "L" : "M"}${f1(x + 4 + i * (w - 8) / 12)},${f1(y + Math.sin(i * freq + 1) * a)} `;
  }
  return P(d, "", "thin blue-s");
}
function brain(cx, cy, k = 1) {
  const q = n => f1(n * k);
  return EL(cx, cy, q(52), q(44), "fb") +
    P(`M${cx},${f1(cy - 44 * k)} C${f1(cx - 12 * k)},${f1(cy - 14 * k)} ${f1(cx + 12 * k)},${f1(cy + 14 * k)} ${cx},${f1(cy + 44 * k)}`) +
    P(`M${f1(cx - 40 * k)},${f1(cy - 12 * k)} Q${f1(cx - 26 * k)},${f1(cy - 30 * k)} ${f1(cx - 12 * k)},${f1(cy - 16 * k)}`) +
    P(`M${f1(cx - 38 * k)},${f1(cy + 16 * k)} Q${f1(cx - 22 * k)},${f1(cy)} ${f1(cx - 10 * k)},${f1(cy + 20 * k)}`) +
    L(cx + 8 * k, cy - 16 * k, cx + 32 * k, cy - 16 * k, "thin") + C(cx + 35 * k, cy - 16 * k, f1(3.5 * k), "fi") +
    L(cx + 6 * k, cy + 6 * k, cx + 24 * k, cy + 6 * k, "thin") + L(cx + 24 * k, cy + 6 * k, cx + 30 * k, cy + 20 * k, "thin") + C(cx + 31 * k, cy + 23 * k, f1(3.5 * k), "fi");
}

/* ---------- shared data ---------- */
const EP = [[80, 120], [125, 145], [170, 95], [215, 105], [260, 35]];
const lineY = x => 165 - .48 * (x - 40);
const FP = [[50, 112], [65, 148], [85, 138], [105, 160], [125, 146], [145, 162], [165, 140], [185, 148], [205, 122], [225, 128], [240, 100], [260, 104], [275, 62], [295, 70]];
const GOOD = "M45,122 C90,165 150,165 200,130 S270,70 300,55";
const env = (x, y, w = 48, h = 32) => R(x, y, w, h, "fk", "", 4) + P(`M${x + 3},${y + 4} L${x + w / 2},${y + h * .55} L${x + w - 3},${y + 4}`);

/* ---------- the drawings ---------- */
export const ART = {
  /* the AI family: k = highlighted ring, -1 = all */
  nested(lb, k) {
    const t = lb.family;
    const rings = [
      { r: 104, cy: 108, f: "ft", lab: t.ai, ly: 40, max: 150, pastel: false },
      { r: 78, cy: 134, f: "fb", lab: t.ml, ly: 84, max: 116, pastel: true },
      { r: 54, cy: 158, f: "fm", lab: t.dl, ly: 134, max: 92, pastel: true },
      { r: 30, cy: 182, f: "fy", lab: t.gen, ly: 188, max: 54, pastel: true },
    ];
    let s = "";
    rings.forEach((g, i) => { const on = k < 0 || i >= k; s += C(160, g.cy, g.r, on ? g.f : "fk", on ? "" : "dash"); });
    rings.forEach((g, i) => {
      const on = k < 0 || i >= k, multi = g.lab.includes("\n");
      s += T(160, multi ? g.ly - 4 : g.ly, g.lab, { size: i === 0 ? 14 : multi ? 13 : 15, max: g.max, c: `${on && g.pastel ? "on" : ""} ${i === k ? "b" : ""} ${on ? "" : "mut"}` });
    });
    return s;
  },

  /* rules vs learning */
  flow(lb, ml) {
    const t = lb.rules;
    const [a, b, box, out] = ml ? [t.answers, t.data, t.mlBox, t.rules] : [t.rules, t.data, t.progBox, t.answers];
    return A(16, 90, 116, 90) + A(16, 136, 116, 136) + A(222, 113, 304, 113) +
      T(18, 80, a, { a: "start", max: 96, c: ml ? "blu b" : "" }) + T(18, 126, b, { a: "start", max: 96 }) +
      T(263, 102, out, { max: 80, c: ml ? "blu b" : "b" }) +
      R(120, 72, 98, 82, ml ? "fy" : "fb", "", 14) + T(169, 118, box, { max: 86, c: "on b" });
  },
  people(lb) {
    const t = lb.rules, xs = [42, 120, 200, 278], poses = ["walk", "run", "bike", "golf"];
    let s = "";
    xs.forEach((x, i) => {
      s += fig(x, 140, poses[i]) + T(x, 168, t.names[i], { c: "b", max: 74 }) + T(x, 188, t.speeds[i], { max: 74, c: `sm ${i === 3 ? "cor b" : "mut"}`, size: 12.5 });
    });
    return s + T(304, 66, "?", { size: 32, c: "cor b" });
  },
  labelled(lb) {
    const t = lb.rules, xs = [42, 120, 200, 278], poses = ["walk", "run", "bike", "golf"];
    const waves = [[4, .9], [9, 1.5], [3, .5], [0, 0, true]];
    let s = "";
    xs.forEach((x, i) => {
      s += fig(x, 108, poses[i]) + R(x - 30, 122, 60, 30, "fk", "", 6) + wave(x - 30, 137, 60, ...waves[i]) + pill(x, 176, t.tags[i], "fy", { on: true, size: 12, w: 68 });
    });
    return s + T(160, 210, t.sensor, { c: "sm mut", size: 12.5 });
  },

  /* how a model knows it's wrong */
  errPlot(lb, st) {
    const t = lb.error;
    let s = axes() + T(300, 213, t.x, { a: "end", c: "sm mut", size: 12.5 }) + T(46, 12, t.y, { a: "start", c: "sm mut", size: 12.5 });
    if (st >= 4) EP.forEach(([x, y]) => { const e = Math.abs(y - lineY(x)); s += `<rect x="${x}" y="${f1(Math.min(y, lineY(x)))}" width="${f1(e)}" height="${f1(e)}" class="sq"/>`; });
    if (st >= 2) s += L(40, 165, 290, 45, "blue-s w3");
    if (st >= 3) EP.forEach(([x, y]) => s += L(x, y, x, lineY(x), "coral-s w3"));
    EP.forEach(([x, y]) => s += C(x, y, 6, "fm"));
    s += C(60, 31, 5, "fm") + T(72, 35, t.real, { a: "start", c: "sm", size: 12.5 });
    if (st >= 2) s += L(52, 51, 68, 51, "blue-s w3") + T(72, 55, t.guess, { a: "start", c: "sm", size: 12.5 });
    if (st >= 3) s += L(60, 64, 60, 78, "coral-s w3") + T(72, 75, t.off, { a: "start", c: "sm", size: 12.5 });
    if (st >= 4) s += T(242, 158, t.mse, { c: "sm b cor", size: 12.5, max: 140 }) + T(242, 175, t.mseSub, { c: "sm mut", size: 12.5, max: 140 });
    return s;
  },

  /* too simple, too fussy, just right */
  fitPlot(lb, mode) {
    const t = lb.fit;
    let s = axes();
    const tags = { under: [t.under, "fc"], over: [t.over, "fc"], right: [t.right, "fm"], test: [t.test, "fy"] };
    if (mode === "under") s += L(45, 150, 300, 88, "blue-s w3");
    if (mode === "over") s += P(crPath(FP), "", "blue-s w3");
    if (mode === "right") s += P(GOOD, "", "blue-s w3");
    if (mode === "test") s += P(crPath(FP), "", "coral-s dash faint") + P(GOOD, "", "blue-s w3");
    FP.forEach(([x, y]) => s += C(x, y, 5, "fb", mode === "test" ? "faint" : ""));
    if (mode === "test") {
      [[75, 140], [135, 158], [195, 136], [255, 92]].forEach(([x, y]) => s += C(x, y, 6.5, "fy"));
      s += C(186, 26, 6.5, "fy") + T(198, 30, t.newData, { a: "start", c: "sm", size: 12.5, max: 116 });
    }
    const [label, fill] = tags[mode];
    const w = Math.min(pillW(label, 14), 150);
    return s + pill(48 + w / 2, 28, label, fill, { on: true, size: 14, w });
  },

  /* clean data first */
  table(lb, st) {
    const t = lb.data, num = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, t.sep);
    const yr = n => `${num(n)} / ${t.yr}`;
    const cx = [24, 74, 196, 296], top = 14, hh = 28, rh = 30;
    const rows = [["39", yr(45000), "NY"], ["23", `${num(1500)} / ${t.mo}`, "MN"], ["78", num(47000), ""], ["20", yr(3000000), "CA"], ["", yr(53000), ""]];
    const fixed = {};
    if (st >= 2) { rows[1][1] = yr(18000); rows[2][1] = yr(47000); fixed["1,1"] = fixed["2,1"] = 1; }
    if (st >= 3) { rows[2][2] = t.unknown; fixed["2,2"] = 1; }
    const marks = { 1: [[1, 1], [2, 1], [2, 2], [3, 1], [4, 0], [4, 2]], 2: [[1, 1], [2, 1]], 3: [[2, 2]], 4: [[3, 1]] }[st];
    let s = R(24, top, 272, hh + rh * 5, "fk", "", 8) + R(24, top, 272, hh, "ft", "", 8);
    for (let r = 1; r < 5; r++) s += L(24, top + hh + r * rh, 296, top + hh + r * rh, "grid");
    s += L(74, top, 74, top + hh + rh * 5, "grid") + L(196, top, 196, top + hh + rh * 5, "grid");
    t.headers.forEach((h, c) => s += T((cx[c] + cx[c + 1]) / 2, top + 19, h, { c: "b", size: 14, max: cx[c + 1] - cx[c] - 8 }));
    rows.forEach((row, r) => row.forEach((v, c) => {
      const dropped = st >= 4 && r === 4;
      s += T((cx[c] + cx[c + 1]) / 2, top + hh + r * rh + 20, v, { size: 14, max: cx[c + 1] - cx[c] - 10, c: dropped ? "mut faint" : fixed[r + "," + c] ? "blu b" : "" });
    }));
    marks.forEach(([r, c]) => s += R(cx[c] + 3, top + hh + r * rh + 3, cx[c + 1] - cx[c] - 6, rh - 6, "", st === 1 || st === 4 ? "coral-s dash" : "blue-s", 5));
    if (st >= 4) s += L(30, top + hh + 4 * rh + 15, 290, top + hh + 4 * rh + 15, "coral-s w3");
    if (st === 4) s += T(135, 210, t.typo, { c: "sm cor b", size: 12.5 });
    return s;
  },

  /* three ways machines learn */
  supervised(lb) {
    const t = lb.types;
    let s = "";
    [[24, t.spam, "fc"], [84, t.notSpam, "fm"], [144, t.spam, "fc"]].forEach(([y, label, fl]) => s += env(14, y) + pill(100, y + 16, label, fl, { on: true, size: 12, w: Math.min(pillW(label, 12), 66) }));
    s += P("M138,40 Q148,40 148,60 L148,152 Q148,172 138,172") + A(148, 106, 166, 106);
    s += R(168, 80, 64, 52, "fb", "", 12) + T(200, 111, t.model, { c: "on b", max: 56 });
    s += A(236, 106, 256, 106) + env(260, 90, 46, 32) + T(283, 78, t.spamQ, { c: "b cor" });
    return s + T(16, 206, t.examples, { a: "start", c: "sm mut", size: 12.5 });
  },
  classReg(lb) {
    const t = lb.types;
    let s = axes(16, 170, 148, 24) + L(22, 62, 148, 150, "dash blue-s");
    [[36, 140], [50, 120], [62, 150], [78, 135], [45, 104], [96, 158]].forEach(([x, y]) => s += C(x, y, 5, "fm"));
    [[70, 40], [100, 60], [125, 92], [92, 30], [135, 120], [122, 50]].forEach(([x, y]) => s += C(x, y, 5, "fc"));
    s += axes(172, 170, 304, 24) + L(178, 158, 300, 62, "blue-s w3");
    [[186, 150], [200, 136], [215, 142], [230, 118], [245, 112], [260, 94], [275, 92], [292, 70]].forEach(([x, y]) => s += C(x, y, 5, "fb"));
    return s + T(82, 192, t.classification, { c: "b", max: 140 }) + T(82, 210, t.whichGroup, { c: "sm mut", size: 12.5 }) +
      T(238, 192, t.regression, { c: "b", max: 140 }) + T(238, 210, t.whatNumber, { c: "sm mut", size: 12.5 });
  },
  clusters(lb) {
    const off = [[-18, -8], [4, -16], [17, 3], [-6, 11], [-21, 13], [10, 17], [22, -9]];
    let s = "";
    [[84, 72, "fb"], [232, 66, "fy"], [160, 158, "fm"]].forEach(([cx, cy, fl]) => {
      s += EL(cx, cy, 42, 33, "", "dash thin");
      off.forEach(([dx, dy]) => s += C(cx + dx, cy + dy, 5, fl));
    });
    return s + T(160, 212, lb.types.unnamed, { c: "sm mut", size: 12.5 });
  },
  reinforce(lb) {
    const t = lb.types;
    let s = "";
    for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) s += R(60 + c * 40, 40 + r * 40, 40, 40, "fk", "thin", 0);
    const X = (x, y) => L(x - 9, y - 9, x + 9, y + 9, "coral-s w3") + L(x + 9, y - 9, x - 9, y + 9, "coral-s w3");
    s += X(160, 100) + X(200, 140);
    s += P("M86,140 L186,140", "", "coral-s dash") + P("M80,128 L80,60", "", "blue-s w3") + A(80, 60, 224, 60, "blue-s");
    const star = [];
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 6 : 14, a = -Math.PI / 2 + i * Math.PI / 5; star.push(`${f1(240 + r * Math.cos(a))},${f1(60 + r * Math.sin(a))}`); }
    s += `<polygon points="${star.join(" ")}" class="sf fy"/>`;
    s += C(80, 140, 12, "fb") + C(76, 137, 1.8, "fi") + C(84, 137, 1.8, "fi");
    s += T(240, 30, t.treat, { c: "sm b blu", size: 12.5 }) + T(222, 145, "−1", { a: "start", c: "b cor" }) + T(160, 206, t.tryFail, { c: "sm mut", size: 12.5 });
    return s;
  },

  /* from idea to working model */
  mlLoop(lb, hl, back) {
    const t = lb.loop, cx = 175, cy = 118, rx = 95, ry = 70;
    const nodes = [["data", -90], ["train", -18], ["test", 54], ["launch", 126], ["monitor", 198]];
    const pt = d => { const a = d * Math.PI / 180; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; };
    let s = EL(cx, cy, rx, ry, "", "thin");
    [-54, 18, 90, 162, 234].forEach(d => {
      const a = d * Math.PI / 180, [x, y] = pt(d);
      s += head(x, y, Math.atan2(ry * Math.cos(a), -rx * Math.sin(a)), "", 10);
    });
    s += A(98, 34, 140, 44);
    if (back) s += A(222, 160, 186, 68, "coral-s dash") + T(194, 120, t.notYet, { c: "sm cor b halo", size: 12.5 });
    const isHl = n => !hl || hl.includes(n);
    s += pill(56, 28, t.problem, !hl ? "ft" : isHl("problem") ? "fy" : "fk", { size: 14, on: !!hl && isHl("problem"), w: Math.max(76, pillW(t.problem, 14)) });
    nodes.forEach(([n, d]) => {
      const [x, y] = pt(d), fill = !hl ? "fb" : isHl(n) ? "fy" : "fk";
      s += pill(x, y, t[n], fill, { size: 14, on: fill !== "fk", w: Math.max(64, pillW(t[n], 14)) });
    });
    return s;
  },

  /* neural networks */
  net(lb, mode) {
    const t = lb.net, train = mode === "train";
    const layers = [{ x: 44, n: 3, f: "fy" }, { x: 124, n: 4, f: "fk" }, { x: 204, n: 4, f: "fk" }, { x: 280, n: 1, f: "fc" }];
    const ys = n => Array.from({ length: n }, (_, i) => 108 + (i - (n - 1) / 2) * 42);
    let s = "";
    if (mode === "layers") s += R(26, 34, 36, 148, "", "dash thin", 10) + R(104, 28, 120, 160, "", "dash thin", 10) + R(262, 84, 36, 48, "", "dash thin", 10);
    for (let l = 0; l < 3; l++) ys(layers[l].n).forEach(a => ys(layers[l + 1].n).forEach(b => s += L(layers[l].x, a, layers[l + 1].x, b, "thin faint")));
    layers.forEach((ly, l) => ys(ly.n).forEach(y => s += train && l === 3 ? "" : C(ly.x, y, 11, ly.f)));
    if (mode === "layers") s += T(44, 206, t.input, { c: "b", max: 80 }) + T(164, 206, t.hidden, { c: "b", max: 130 }) + T(282, 206, t.output, { c: "b", max: 70 });
    else if (train) s += C(280, 108, 17, "fc") + T(280, 113, "62%", { c: "on b sm", size: 12.5 }) + T(280, 80, t.guess, { c: "sm b halo", size: 12.5, max: 70 }) +
      L(280, 127, 280, 141, "coral-s w3") + pill(280, 156, "100%", "fm", { on: true, size: 13, w: 52 }) + T(280, 186, t.right, { c: "sm mut", size: 12.5, max: 74 }) +
      A(258, 24, 60, 24, "coral-s dash") + T(160, 14, t.nudge, { c: "sm b cor", size: 12.5, max: 200 }) + T(150, 210, t.repeat, { c: "sm mut", size: 12.5, max: 200 });
    else s += A(70, 206, 250, 206, "thin") + T(160, 199, t.flow, { c: "sm mut halo", size: 12.5 });
    return s;
  },
  demand(lb, unknown) {
    const t = lb.demand, ins = [40, 85, 130, 175], hid = [52, 108, 164];
    let s = "";
    ins.forEach(a => hid.forEach(b => s += L(96, a, 190, b, "thin faint")));
    hid.forEach(b => s += L(190, b, 278, 108, "thin faint"));
    t.inputs.forEach((label, i) => s += C(96, ins[i], 10, "fy") + T(80, ins[i] + 5, label, { a: "end", max: 76 }));
    t.hidden.forEach((label, i) => {
      s += C(190, hid[i], 11, "fb") + T(190, hid[i] - 17, unknown ? "?" : label, { c: `halo b ${unknown ? "cor" : "sm"}`, size: unknown ? 18 : 12.5, max: unknown ? 0 : 104 });
    });
    s += C(278, 108, 17, "fc") + T(278, 113, unknown ? "?" : "82%", { c: "on b sm", size: 12.5 }) + T(278, 144, t.out, { c: "sm b halo", size: 12.5, max: 76 });
    return s + T(70, 210, t.facts, { c: "sm mut", size: 12.5 }) + T(190, 210, t.ideas, { c: "sm mut", size: 12.5 }) + T(278, 210, t.answer, { c: "sm mut", size: 12.5 });
  },

  /* foundation models */
  pretrain(lb) {
    const t = lb.found;
    const doc = (x, y) => R(x, y, 26, 34, "fk", "", 3) + L(x + 6, y + 10, x + 20, y + 10, "thin") + L(x + 6, y + 17, x + 20, y + 17, "thin") + L(x + 6, y + 24, x + 15, y + 24, "thin");
    const video = (x, y) => R(x, y, 40, 28, "fk", "", 4) + P(`M${x + 16},${y + 8} L${x + 27},${y + 14} L${x + 16},${y + 20} Z`, "fi");
    const book = (x, y) => P(`M${x},${y + 4} Q${x + 15},${y - 2} ${x + 30},${y + 4} L${x + 30},${y + 32} Q${x + 15},${y + 26} ${x},${y + 32} Z`, "fy") + L(x + 15, y + 1, x + 15, y + 29, "thin");
    const db = (x, y) => P(`M${x},${y + 5} L${x},${y + 27} A14,5 0 0 0 ${x + 28},${y + 27} L${x + 28},${y + 5}`, "fm") + EL(x + 14, y + 5, 14, 5, "fm");
    const code = (x, y) => R(x, y, 40, 28, "fk", "", 4) + T(x + 20, y + 19, "</>", { size: 13, c: "b" });
    const img = (x, y) => R(x, y, 36, 28, "fk", "", 4) + P(`M${x + 4},${y + 24} L${x + 14},${y + 12} L${x + 21},${y + 19} L${x + 26},${y + 14} L${x + 32},${y + 24}`) + C(x + 27, y + 8, 3, "fc");
    return doc(18, 34) + video(58, 28) + book(16, 88) + db(66, 84) + code(14, 140) + img(66, 140) +
      A(122, 110, 174, 110) + T(148, t.pretrain.includes("\n") ? 90 : 98, t.pretrain, { c: "sm b", size: 12.5, max: 60 }) + brain(240, 108) +
      T(62, 198, t.pile1, { c: "sm mut", size: 12.5, max: 118 }) + T(62, 213, t.pile2, { c: "sm mut", size: 12.5, max: 118 }) + T(240, 180, t.model, { c: "b", max: 140 });
  },
  adapt(lb) {
    let s = brain(64, 110, .78);
    lb.found.tasks.forEach((label, i) => { const y = 26 + i * 34; s += A(108, 110, 152, y, "thin") + T(158, y + 5, label, { a: "start", max: 156 }); });
    return s;
  },
  rentOrRun(lb) {
    const t = lb.found;
    const laptop = (cx, cy) => R(cx - 26, cy - 18, 52, 34, "fk", "", 3) + P(`M${cx - 34},${cy + 16} L${cx + 34},${cy + 16} L${cx + 30},${cy + 23} L${cx - 30},${cy + 23} Z`, "fk");
    let s = L(160, 14, 160, 170, "dash thin faint");
    s += P("M42,84 C24,84 22,60 40,58 C40,34 72,28 82,46 C92,30 122,38 118,60 C134,62 132,84 116,84 Z", "ft") + brain(80, 64, .28);
    s += A(64, 90, 54, 118, "thin") + A(96, 90, 112, 110, "thin") + laptop(50, 140) + R(104, 114, 24, 44, "fk", "", 5) + L(111, 151, 121, 151, "thin");
    s += brain(240, 48, .42) + A(240, 74, 240, 114, "w3") + laptop(240, 140);
    return s + T(80, 190, t.online, { c: "b", max: 140 }) + T(80, 208, t.onlineSub, { c: "sm mut", size: 12.5, max: 150 }) +
      T(240, 190, t.local, { c: "b", max: 140 }) + T(240, 208, t.localSub, { c: "sm mut", size: 12.5, max: 150 });
  },

  /* how a chatbot writes */
  nextWord(lb) {
    const t = lb.gen, pct = [62, 18, 12, 1];
    let s = R(14, 8, 292, 42, "ft", "", 12) + T(160, 35, `${t.start.join(" ")} …`, { size: 16, max: 270 });
    t.options.forEach((w, i) => {
      const y = 66 + i * 32, bw = Math.max(4, pct[i] * 2.4);
      s += T(98, y + 16, w, { a: "end", c: i ? "" : "b", max: 84 }) + R(108, y, bw, 22, i ? "fb" : "fy", "thin", 5) + T(116 + bw, y + 16, `${pct[i]}%`, { a: "start", c: "sm b", size: 12.5 });
    });
    return s + T(160, 210, t.scores, { c: "sm mut", size: 12.5, max: 290 });
  },
  wordLoop(lb) {
    const t = lb.gen, x0 = 34, gap = 4, pad = 10;
    const rows = t.next.map((_, i) => [...t.start, ...t.next.slice(0, i + 1)]);
    let sz = 15;
    const cw = w => w.length * sz * .52 + pad;
    const width = ws => ws.reduce((a, w) => a + cw(w), 0) + (ws.length - 1) * gap;
    while (width(rows[rows.length - 1]) > 304 - x0 && sz > 10) sz -= .5;
    let s = "";
    rows.forEach((ws, r) => {
      const y = 38 + r * 62;
      let x = x0;
      s += T(18, y + 5, String(r + 1), { c: "sm mut b", size: 12.5 });
      ws.forEach((w, i) => {
        const last = i === ws.length - 1;
        s += R(x, y - 14, cw(w), 28, last ? "fy" : "fk", "thin", 6) + T(x + cw(w) / 2, y + 5, w, { size: sz, c: last ? "on b" : "" });
        if (last && r < rows.length - 1) s += A(x + cw(w) / 2, y + 16, x + cw(w) / 2, y + 46, "thin");
        x += cw(w) + gap;
      });
    });
    return s + T(160, 210, t.loopCaption, { c: "sm mut", size: 12.5, max: 290 });
  },
  sampling(lb) {
    const t = lb.gen;
    let s = R(14, 8, 292, 40, "ft", "", 12) + T(160, 34, `${t.start.join(" ")} …`, { size: 15, max: 270 });
    s += A(60, 52, 60, 86, "thin") + R(36, 92, 48, 48, "fk", "", 10);
    [[48, 104], [72, 104], [60, 116], [48, 128], [72, 128]].forEach(([x, y]) => s += C(x, y, 3.5, "fi"));
    s += A(90, 104, 120, 86, "thin") + A(90, 128, 120, 152, "thin");
    [[84, 0], [158, 1]].forEach(([y, i]) =>
      s += T(124, y - 24, t.tries[i], { a: "start", c: "sm mut b", size: 12.5 }) + R(124, y - 16, 182, 34, "fb", "", 12) + T(136, y + 6, t.endings[i], { a: "start", c: "on", max: 160 }));
    return s + T(160, 208, t.samplingCaption, { c: "sm mut", size: 12.5, max: 290 });
  },
  chatTurns(lb) {
    const t = lb.gen;
    const block = (y, who, cls, lens) => T(36, y, who, { a: "start", c: `sm b ${cls}`, size: 12.5 }) + lens.map((w, i) => L(36, y + 14 + i * 12, 36 + w, y + 14 + i * 12, "thin")).join("");
    let s = R(22, 8, 200, 204, "fk", "", 8);
    s += block(30, t.you, "blu", [150, 96]) + block(80, t.ai, "cor", [168, 160, 120]) + block(142, t.you, "blu", [110]);
    s += T(36, 180, t.ai, { a: "start", c: "sm b cor", size: 12.5 }) + L(36, 194, 110, 194, "thin") + R(116, 186, 14, 16, "fy", "thin", 3);
    s += P("M232,14 Q242,14 242,24 L242,100 L250,110 L242,120 L242,196 Q242,206 232,206", "", "thin");
    return s + T(287, 110, t.readsAll, { c: "sm", size: 12.5, max: 62 });
  },

  /* words as points on a map */
  vecs(lb) {
    const t = lb.embed, fmt = v => (v < 0 ? "−" : "") + Math.abs(v).toFixed(1).replace(".", t.dec);
    const rows = [[t.cat, [.6, .9, .1, .4, -.7, -.3, -.2], "cor"], [t.dog, [.7, -.1, .4, .3, -.4, -.1, -.3], "blu"]];
    let s = R(84 + 31, 82, 30, 98, "", "coral-s dash", 6);
    t.traits.forEach((h, i) => s += T(84 + i * 31 + 11, 74, h, { a: "start", rot: -40, c: "sm mut", size: 12.5 }));
    rows.forEach(([w, vals, c], r) => {
      const y = 90 + r * 50;
      s += T(76, y + 20, w, { a: "end", c: `b ${c}`, size: 18, max: 66 });
      vals.forEach((v, i) => s += R(84 + i * 31 + 2, y, 26, 30, v >= .6 ? "fy" : "fk", "thin", 5) + T(84 + i * 31 + 15, y + 20, fmt(v), { size: 12, c: v >= .6 ? "on" : "" }));
    });
    return s + T(160, 206, t.caption, { c: "sm mut", size: 12.5 });
  },
  wordMap(lb) {
    const t = lb.embed;
    let s = R(14, 10, 292, 198, "fk", "", 12) + EL(142, 138, 44, 42, "", "dash thin");
    [[130, 128, t.cat, "fc", -12], [154, 140, t.kitten, "fm", 22], [92, 164, t.dog, "fb", 22], [262, 44, t.houses, "ft", -12]].forEach(([x, y, w, fl, dy]) => s += C(x, y, 6, fl) + T(x, y + dy, w, { c: "b" }));
    return s + T(296, 196, t.close, { a: "end", c: "sm mut", size: 12.5 });
  },
  analogy(lb) {
    const t = lb.embed;
    let s = R(14, 10, 292, 198, "fk", "", 12);
    const v = (x1, y1, x2, y2) => A(x1 + 6, y1 - 9, x2 - 4, y2 + 7, "coral-s w3", 10);
    s += v(64, 128, 112, 52) + v(196, 176, 244, 100);
    [[64, 128, t.man, "fb", 26], [112, 52, t.woman, "fc", -14], [196, 176, t.king, "fy", 24], [244, 100, t.queen, "fm", -14]].forEach(([x, y, w, fl, dy]) => s += C(x, y, 6, fl) + T(x, y + dy, w, { c: "b" }));
    return s + T(158, 120, t.same, { c: "sm cor b", size: 12.5 });
  },
  meaningSearch(lb) {
    const t = lb.embed;
    let s = R(14, 10, 292, 198, "fk", "", 12) + EL(112, 132, 52, 38, "", "dash thin");
    s += C(92, 120, 7, "fy") + T(92, 102, t.query, { c: "b halo", max: 150 }) + C(134, 146, 6, "fm") + T(134, 172, t.near, { c: "sm halo", size: 12.5, max: 150 });
    s += C(236, 44, 6, "ft") + T(236, 66, t.far[0], { c: "sm mut", size: 12.5, max: 110 }) + C(252, 112, 6, "ft") + T(252, 134, t.far[1], { c: "sm mut", size: 12.5, max: 96 });
    return s + T(296, 198, t.noShared, { a: "end", c: "sm b blu", size: 12.5, max: 270 });
  },

  /* making a model yours: k = highlighted band (0 bottom … 3 top), -1 = all */
  pyramid(lb, k) {
    const t = lb.custom, half = y => 120 * (y - 14) / 190, cx = 170;
    const bands = [[160, 204, "fm", t.prompt, 188, 196], [116, 160, "fy", t.rag, 144, 140], [70, 116, "fb", t.fine, 99, 96], [14, 70, "fc", t.scratch, 54, 50]];
    let s = "";
    bands.forEach(([y0, y1, fl, lab, ly, max], i) => {
      const on = k < 0 || k === i, a = half(y0), b = half(y1), top = i === bands.length - 1;
      const pts = top ? `${cx},${y0} ${f1(cx + b)},${y1} ${f1(cx - b)},${y1}` : `${f1(cx - a)},${y0} ${f1(cx + a)},${y0} ${f1(cx + b)},${y1} ${f1(cx - b)},${y1}`;
      s += `<polygon points="${pts}" class="sf ${on ? fl : "fk"} ${on ? "" : "dash"}"/>`;
      s += T(cx, ly, lab, { size: top ? 13 : 15, max, c: on ? `on ${k === i ? "b" : ""}` : "mut" });
    });
    return s + A(28, 196, 28, 24, "thin") + T(16, 110, t.effort, { rot: -90, c: "sm mut", size: 12.5 }) +
      A(302, 196, 302, 24, "thin") + T(313, 110, t.special, { rot: 90, c: "sm mut", size: 12.5 });
  },

  /* writing a good prompt */
  brief(lb, which) {
    const rows = lb.prompt[which], fills = ["fb", "fy", "fm", "fc"];
    let s = R(26, 8, 268, 204, "fk", "", 12);
    rows.forEach(([lab, sub], i) => {
      const y = 16 + i * 48;
      s += R(38, y + 6, 7, 34, fills[i], "", 3) + T(56, y + 21, lab, { a: "start", c: "b", size: 14 }) + T(56, y + 38, sub, { a: "start", c: "sm mut", size: 12.5, max: 228 });
    });
    return s;
  },
  shots(lb) {
    const t = lb.prompt;
    const bubble = (x, y, w, h, fl) => R(x, y, w, h, fl, "", 12) + P(`M${x + 16},${y + h} l-4,10 l14,-10`, fl);
    let s = T(85, 22, "zero-shot", { c: "b" }) + T(235, 22, "few-shot", { c: "b" });
    s += bubble(14, 34, 142, 50, "ft") + T(24, 54, t.translate, { a: "start", c: "sm", size: 12.5, max: 124 }) + T(24, 72, t.cheese, { a: "start", c: "sm b", size: 12.5 });
    s += bubble(164, 34, 142, 104, "ft");
    [t.translate, ...t.examples, t.cheese].forEach((line, i) => s += T(174, 54 + i * 21, line, { a: "start", c: `sm ${i === 3 ? "b" : ""}`, size: 12.5, max: 124 }));
    s += R(22, 110, 134, 52, "fy", "", 12) + T(32, 131, t.reply[0], { a: "start", c: "sm on", size: 12.5, max: 116 }) + T(32, 149, t.reply[1], { a: "start", c: "sm on", size: 12.5, max: 116 });
    s += R(222, 164, 84, 34, "fy", "", 12) + T(264, 186, "fromage", { c: "b on" });
    return s;
  },
  cot(lb) {
    const t = lb.prompt;
    let s = R(14, 8, 292, 50, "ft", "", 12) + T(160, 37, t.question, { size: 14, max: 276 });
    s += T(160, 80, t.think, { c: "sm b blu", size: 12.5 });
    s += pill(80, 106, "3 × 12 = 36", "fk", { size: 14 }) + pill(164, 146, "36 − 5 = 31", "fk", { size: 14 }) + pill(244, 188, t.answer, "fm", { size: 14, on: true });
    return s + A(104, 120, 132, 134, "thin") + A(190, 160, 216, 174, "thin");
  },
  tricks(lb) {
    const t = lb.prompt;
    let s = L(160, 12, 160, 208, "dash thin faint") + L(12, 110, 308, 110, "dash thin faint");
    s += pill(50, 42, "31", "fm", { on: true, w: 30 }) + pill(80, 42, "31", "fm", { on: true, w: 30 }) + pill(110, 42, "30", "fc", { on: true, w: 30 }) + P("M68,68 l8,8 l14,-16", "", "blue-s w3");
    s += T(80, 98, t.tricks[0], { c: "sm", size: 12.5, max: 144 });
    s += L(240, 24, 210, 54) + L(240, 24, 240, 54) + L(240, 24, 270, 54, "blue-s w3") + L(270, 54, 258, 80) + L(270, 54, 284, 80, "blue-s w3");
    [[240, 24], [210, 54], [240, 54], [270, 54], [258, 80], [284, 80]].forEach(([x, y]) => s += C(x, y, 5, "fk"));
    s += T(240, 98, t.tricks[1], { c: "sm", size: 12.5, max: 144 });
    s += R(52, 124, 36, 46, "fk", "", 4) + L(59, 136, 81, 136, "thin") + L(59, 144, 81, 144, "thin") + L(59, 152, 74, 152, "thin") + C(94, 154, 13, "ft") + L(103, 163, 114, 174, "w3");
    s += T(80, 202, t.tricks[2], { c: "sm", size: 12.5, max: 144 });
    s += R(222, 122, 40, 52, "fk", "", 6) + R(228, 128, 28, 12, "ft", "thin", 2);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) s += C(232 + c * 10, 150 + r * 12, 3, "fi");
    return s + T(242, 202, t.tricks[3], { c: "sm", size: 12.5, max: 144 });
  },

  /* why AI makes things up */
  madeUp(lb) {
    const t = lb.trust;
    let s = R(104, 10, 202, 54, "ft", "", 12) + P("M290,64 l4,10 l-18,-10", "ft") + T(118, 37, t.ask, { a: "start", max: 176 });
    s += R(14, 86, 234, 62, "fb", "", 12) + P("M34,148 l-4,10 l14,-10", "fb") + T(28, 117, t.claim, { a: "start", c: "on", max: 212 });
    s += `<g transform="rotate(-8 240 170)">` + R(186, 152, 108, 36, "", "coral-s w3", 6) + T(240, 176, t.stamp, { c: "b cor", size: 18, max: 96 }) + "</g>";
    return s + T(16, 208, t.sure, { a: "start", c: "sm mut", size: 12.5, max: 160 });
  },
  likelyTrue(lb) {
    const t = lb.trust;
    const row = (y, tag, tagC, prompt, ans, fill, seen, mark) => {
      const w = pillW(ans, 14), px = 306 - w / 2;
      return T(20, y - 28, tag, { a: "start", c: `sm b ${tagC}`, size: 12.5 }) + T(20, y + 5, prompt, { a: "start", max: 306 - w - 54 }) +
        A(306 - w - 30, y, 306 - w - 8, y, "thin") + pill(px, y, ans, fill, { on: true, size: 14, w }) +
        T(20, y + 36, seen, { a: "start", c: "sm mut", size: 12.5, max: 200 }) + mark(px, y + 32);
    };
    const tick = (x, y) => P(`M${x - 9},${y - 2} l6,6 l12,-14`, "", "blue-s w3");
    const ask = (x, y) => T(x, y + 8, "?", { c: "cor b", size: 24 });
    return row(52, t.famous[0], "blu", t.famous[1], t.famous[2], "fm", t.famous[3], tick) + L(14, 106, 306, 106, "dash thin faint") +
      row(156, t.rare[0], "cor", t.rare[1], t.rare[2], "fc", t.rare[3], ask);
  },
  checkIt(lb) {
    const t = lb.trust;
    let s = R(56, 20, 208, 190, "fk", "", 10) + R(130, 10, 60, 20, "ft", "", 6);
    t.checks.forEach((item, i) => {
      const y = 66 + i * 52;
      s += R(74, y - 13, 26, 26, "ft", "thin", 5) + P(`M80,${y} l6,6 l12,-14`, "", "blue-s w3") + T(114, y + 5, item, { a: "start", max: 138 });
    });
    return s;
  },

  /* responsible AI */
  biasHire(lb) {
    const t = lb.resp;
    const person = (x, y, f) => C(x, y - 9, 6, f) + P(`M${x - 9},${y + 9} Q${x - 9},${y} ${x},${y} Q${x + 9},${y} ${x + 9},${y + 9} Z`, f);
    let s = T(60, 28, t.past, { c: "sm b", size: 12.5, max: 100 }) + R(14, 38, 92, 104, "fk", "", 10);
    [29, 49, 69, 89].forEach((x, i) => s += person(x, 72, "fb") + person(x, 116, i === 1 ? "fc" : "fb"));
    s += A(110, 90, 134, 90) + R(138, 66, 60, 48, "fb", "", 10) + T(168, 95, t.model, { c: "on b", max: 52 }) + A(202, 90, 222, 90);
    s += T(266, 28, t.ranked, { c: "sm b", size: 12.5, max: 96 });
    [["fb", 44], ["fb", 40], ["fc", 16], ["fc", 10]].forEach(([f, w], i) => {
      const y = 56 + i * 34;
      s += T(232, y + 5, String(i + 1), { c: "sm mut b", size: 12.5 }) + person(250, y, f) + R(264, y - 6, w, 12, f, "thin", 3);
    });
    return s + T(160, 204, t.copies, { c: "sm mut", size: 12.5, max: 290 });
  },
  dataLeak(lb) {
    const t = lb.resp;
    let s = R(14, 26, 158, 140, "ft", "", 12) + T(26, 46, t.paste, { a: "start", c: "sm mut", size: 12.5, max: 134 });
    s += R(26, 58, 134, 94, "fk", "coral-s dash", 6);
    t.card.forEach((line, i) => s += T(38, 82 + i * 24, line, { a: "start", c: "sm", size: 12.5, max: 112 }));
    [44, 96, 148].forEach((y, i) => s += A(176, 96, 198, y, "thin") + R(202, y - 18, 104, 36, "fk", "", 10) + T(254, y + 5, t.where[i], { c: "sm b", size: 12.5, max: 94 }));
    return s + T(160, 204, t.leakCaption, { c: "sm mut", size: 12.5, max: 290 });
  },
  blackBox(lb) {
    const t = lb.resp;
    let s = R(16, 44, 60, 76, "fk", "", 4);
    for (let i = 0; i < 4; i++) s += L(26, 62 + i * 14, i === 3 ? 50 : 66, 62 + i * 14, "thin");
    s += T(46, 140, t.application, { c: "sm b", size: 12.5, max: 90 });
    s += A(82, 82, 108, 82) + R(112, 46, 84, 72, "fk", "w3", 10) + T(154, 96, "?", { c: "cor b", size: 40 }) + T(154, 140, t.model, { c: "sm b", size: 12.5, max: 90 });
    s += A(200, 82, 222, 82) + pill(266, 82, t.denied, "fc", { on: true, size: 15 });
    s += fig(214, 206, "walk") + R(232, 136, 72, 32, "ft", "", 12) + P("M240,168 l-6,8 l14,-8", "ft") + T(268, 157, t.why, { c: "b cor", max: 62 });
    return s + T(20, 190, t.noReason, { a: "start", c: "sm mut", size: 12.5, max: 160 });
  },
  inCharge(lb) {
    const t = lb.resp;
    let s = pill(62, 52, t.suggests, "fb", { on: true, size: 14 }) + A(116, 52, 140, 52) + fig(162, 100, "walk") + T(162, 122, t.person, { c: "sm b", size: 12.5, max: 110 });
    s += A(184, 52, 208, 52) + pill(262, 52, t.decision, "fm", { on: true, size: 14 });
    s += P("M162,136 Q66,166 62,84", "", "coral-s dash") + head(62, 72, -Math.PI / 2, "coral-s", 10) + T(84, 172, t.override, { a: "start", c: "sm b cor", size: 12.5, max: 150 });
    return s + T(160, 206, t.owner, { c: "sm mut", size: 12.5, max: 290 });
  },

  /* book reviews: lb.book holds the book's labels (from src/books/<slug>.js) */
  outBirthMonths(lb) {
    const t = lb.book, h = [96, 90, 82, 66, 58, 50, 44, 38, 34, 30, 26, 22];
    let s = L(30, 176, 300, 176);
    h.forEach((v, i) => s += R(36 + i * 22, 176 - v, 16, v, i < 3 ? "fy" : "fb", "thin", 3) + T(44 + i * 22, 192, t.months[i], { c: "sm mut", size: 11 }));
    s += P("M36,64 L36,58 L96,58 L96,64", "", "thin") + T(66, 50, t.early, { c: "sm b", max: 120 });
    return s + T(160, 22, t.birthCaption, { c: "sm mut", max: 290 }) + T(160, 212, t.birthNote, { c: "sm", max: 300 });
  },
  outHours(lb) {
    const t = lb.book;
    let s = T(160, 50, t.hours, { c: "b", size: 34 }) + T(160, 74, t.mastery, { c: "sm mut", max: 290 });
    for (let d = 0; d < 7; d++) {
      for (let k = 0; k < 8; k++) s += R(66 + d * 28, 166 - k * 9, 20, 7, "fy", "thin", 2);
      s += T(76 + d * 28, 184, t.days[d], { c: "sm mut", size: 11 });
    }
    return s + T(46, 136, t.perDay, { a: "end", c: "sm b", max: 44 }) + T(160, 208, t.hamburg, { c: "sm", max: 300 });
  },
  outIQ(lb) {
    const t = lb.book, x = v => 30 + (v - 100) * 2.6;
    let s = R(x(120), 76, x(200) - x(120), 34, "ft", "", 4) + T((x(120) + x(200)) / 2, 98, t.enough, { c: "sm", max: 200 });
    s += L(x(100), 110, x(200), 110);
    [100, 120, 140, 160, 180, 200].forEach(v => s += L(x(v), 106, x(v), 114, "thin") + T(x(v), 130, String(v), { c: "sm mut", size: 12 }));
    s += L(x(120), 60, x(120), 114, "dash coral-s") + T(x(120), 52, t.threshold, { c: "sm b cor", max: 120 });
    s += C(x(195), 110, 7, "fc") + T(x(195) - 4, 152, t.langan, { a: "end", c: "sm b", max: 160 });
    return s + T(160, 190, t.iqLine1, { c: "sm", max: 300 }) + T(160, 208, t.iqLine2, { c: "sm", max: 300 });
  },
  outEra(lb) {
    const t = lb.book, x = y => 20 + (y - 1820) * 1.867;
    let s = R(x(1914), 126, x(1945) - x(1914), 20, "fc", "thin faint", 4) + A(16, 120, 306, 120);
    s += T((x(1914) + x(1945)) / 2, 162, t.hardTimes, { c: "sm cor b", max: 170 });
    // role labels sit at different heights so neighbours don't overlap, and stay inside the frame
    [[1835, t.roles[2], 52], [1930, t.roles[0], 26], [1955, t.roles[1], 62]].forEach(([y, role, py]) => {
      const w = pillW(role, 12), px = Math.min(Math.max(x(y), w / 2 + 6), 314 - w / 2);
      s += L(x(y), 114, x(y), py + 12, "thin") + C(x(y), 120, 6, "fy") + pill(px, py, role, "fm", { on: true, size: 12, w }) +
        T(x(y) + 6, 104, y === 1930 ? "1930s" : String(y), { a: "start", c: "b", size: 13 });
    });
    return s + T(160, 206, t.eraCaption, { c: "sm", max: 300 });
  },
  outHonor(lb) {
    const t = lb.book;
    let s = L(160, 14, 160, 176, "dash thin faint");
    s += P("M14,124 L40,84 L58,104 L84,64 L110,100 L132,82 L150,124 Z", "ft");
    s += EL(56, 144, 16, 10, "fk") + C(73, 139, 5, "fk") + L(48, 153, 48, 162, "thin") + L(64, 153, 64, 162, "thin");
    s += EL(100, 150, 13, 9, "fk") + C(114, 146, 4.5, "fk") + L(94, 158, 94, 166, "thin") + L(106, 158, 106, 166, "thin");
    s += fig(138, 170, "walk");
    s += R(176, 94, 132, 54, "ft", "thin", 4);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) s += L(186 + c * 14, 106 + r * 16, 186 + c * 14, 100 + r * 16, "thin");
    s += fig(208, 176, "walk") + fig(240, 176, "walk") + fig(272, 176, "walk");
    return s + T(80, 194, t.herder, { c: "b", max: 140 }) + T(80, 212, t.herderSub, { c: "sm mut", max: 150 }) +
      T(240, 194, t.farmer, { c: "b", max: 140 }) + T(240, 212, t.farmerSub, { c: "sm mut", max: 150 });
  },
  outContents(lb) {
    const t = lb.book;
    let s = R(24, 26, 94, 128, "fk", "", 4) + T(71, 48, t.contentsTitle, { c: "b", size: 13, max: 80 });
    for (let i = 0; i < 5; i++) { const y = 68 + i * 18; s += L(36, y, 92 - (i % 2) * 14, y, "thin") + T(106, y + 5, "?", { c: "cor b", size: 15 }); }
    s += A(130, 90, 168, 90);
    s += P("M180,54 Q212,46 244,58 L244,150 Q212,140 180,146 Z", "ft") + P("M244,58 Q276,46 308,54 L308,146 Q276,140 244,150 Z", "ft");
    s += L(196, 70, 204, 104, "w3") + L(204, 104, 214, 104, "w3") + EL(210, 112, 6, 2.5, "fi");
    s += L(231, 108, 231, 80, "w3") + EL(231, 128, 10, 9, "fy") + EL(231, 113, 8, 7, "fy") + C(231, 124, 2.5, "fi");
    s += P("M258,92 L296,84 L300,87 L299,90 L262,99 Z", "fb") + P("M276,88 L268,74 L274,74 L288,86 Z", "fb");
    s += T(276, 130, "10.000", { c: "b", size: 13 });
    return s + T(71, 180, t.cryptic, { c: "sm b", max: 130 }) + T(244, 180, t.inside, { c: "sm b", max: 140 });
  },
  outTrades(lb) {
    const t = lb.book;
    let s = R(28, 94, 70, 48, "fy", "", 6) + P("M50,94 L50,84 L76,84 L76,94") + L(46, 94, 46, 142, "thin") + L(80, 94, 80, 142, "thin");
    s += A(106, 118, 136, 118) + A(194, 118, 224, 118);
    s += L(150, 74, 176, 52, "w3") + C(173, 55, 3, "fk") + P("M173,55 Q190,64 178,76 T186,92", "", "thin blue-s");
    s += R(146, 100, 30, 10, "fb", "", 2) + L(161, 110, 161, 132, "w3");
    s += R(144, 146, 38, 10, "fk", "thin", 2) + [0, 1, 2, 3, 4].map(i => L(150 + i * 7, 146, 150 + i * 7, 151, "thin")).join("");
    s += fig(256, 156, "walk") + R(266, 128, 22, 16, "fc", "", 3) + L(272, 128, 272, 124, "thin") + L(282, 128, 282, 124, "thin") + L(272, 124, 282, 124, "thin");
    return s + T(160, 26, t.flomCaption, { c: "sm mut", max: 290 }) + T(63, 172, t.hardship, { c: "sm b", max: 110 }) +
      T(163, 184, t.trades, { c: "sm", max: 100 }) + T(258, 184, t.professional, { c: "sm b", max: 110 });
  },
  outMore(lb) {
    const t = lb.book;
    let s = R(22, 62, 84, 50, "ft", "thin", 4);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) s += L(32 + c * 13, 76 + r * 14, 32 + c * 13, 69 + r * 14, "thin");
    s += R(132, 76, 56, 38, "fk") + P("M126,76 L160,52 L194,76 Z", "fb") + R(153, 94, 14, 20, "fy", "thin", 2) + L(160, 52, 160, 38, "thin") + P("M160,38 l12,4 l-12,4 Z", "fc");
    s += C(262, 86, 16, "fy");
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += L(262 + 22 * Math.cos(a), 86 + 22 * Math.sin(a), 262 + 30 * Math.cos(a), 86 + 30 * Math.sin(a), "thin"); }
    t.more.forEach((label, i) => s += T([64, 160, 262][i], 142, label, { c: "sm b", max: 96 }));
    return s + pill(160, 184, t.price, "fm", { on: true, size: 14 });
  },
  outPlanes(lb) {
    const t = lb.book;
    let s = P("M64,16 L256,16 L290,62 L30,62 Z", "ft") + L(160, 16, 160, 62, "thin") + R(30, 62, 260, 14, "fk", "thin", 3);
    s += C(110, 102, 13, "fk") + P("M86,134 Q110,112 134,134") + R(97, 86, 26, 6, "fi", "", 2);
    s += C(210, 102, 13, "fk") + P("M186,134 Q210,112 234,134");
    s += R(232, 82, 58, 26, "fk", "", 10) + P("M240,108 l-6,10 l14,-10", "fk") + T(261, 100, "…", { c: "b", size: 18 });
    s += T(110, 150, t.captain, { c: "b", max: 120 }) + T(210, 150, t.officer, { c: "b", max: 120 });
    ["fm", "fm", "fy", "fc", "fc"].forEach((f, i) => s += R(60 + i * 40, 164, 40, 12, f, "thin", 2));
    return s + T(60, 192, t.pdiLow, { a: "start", c: "sm", max: 110 }) + T(260, 192, t.pdiHigh, { a: "end", c: "sm", max: 110 }) + T(160, 212, t.pdi, { c: "sm mut", max: 300 });
  },

  /* clean code */
  readMore(lb) {
    const t = lb.clean;
    const card = (x, y) => R(x, y, 76, 92, "fk", "", 8) + [0, 1, 2, 3, 4, 5].map(i => L(x + 12, y + 16 + i * 12, x + 64 - (i % 3) * 12, y + 16 + i * 12, "thin")).join("");
    const eye = (x, y) => EL(x, y, 12, 7, "fk", "thin") + C(x, y, 3.5, "fi");
    let s = L(160, 16, 160, 206, "dash thin faint") + card(42, 40);
    s += P("M112,40 L128,24 L136,32 L120,48 Z", "fy", "thin") + P("M112,40 L108,52 L120,48", "fk", "thin");
    s += card(202, 64) + [[188, 44], [240, 34], [292, 44], [184, 92], [296, 92], [192, 168], [290, 168]].map(([x, y]) => eye(x, y)).join("");
    return s + T(80, 162, t.once, { c: "b", max: 140 }) + T(80, 182, "×1", { c: "sm mut" }) +
      T(240, 190, t.many, { c: "b blu", max: 150 }) + T(240, 208, t.later, { c: "sm mut", max: 150 });
  },
  goodNames(lb) {
    const t = lb.clean;
    const chip = (y, text, fill) => R(24, y - 18, 150, 36, fill, "thin", 6) + T(36, y + 5, text, { a: "start", max: 128 });
    const tick = (x, y) => P(`M${x - 8},${y} L${x - 2},${y + 7} L${x + 9},${y - 8}`, "", "blue-s w3");
    return chip(44, t.bad, "ft") + T(194, 51, "?", { c: "cor b", size: 24 }) + T(212, 49, t.guess, { a: "start", c: "b cor", max: 96 }) +
      chip(108, t.good, "ft") + tick(194, 108) + T(212, 113, t.clear, { a: "start", c: "b blu", max: 96 }) +
      R(24, 154, 276, 32, "", "dash thin", 6) + T(36, 175, t.comment, { a: "start", c: "mut", max: 252 }) + T(160, 208, t.why, { c: "sm b" });
  },
  oneJob(lb) {
    const t = lb.clean;
    let s = L(160, 12, 160, 208, "dash thin faint") + R(30, 18, 100, 150, "fk", "", 8);
    for (let i = 0; i < 15; i++) s += L(42 + (i % 4) * 4, 30 + i * 9, 116 - (i * 7 % 30), 30 + i * 9, "thin");
    s += T(80, 190, t.giant, { c: "b cor", max: 140 });
    t.steps.forEach((step, i) => {
      const y = 22 + i * 54;
      s += R(176, y, 128, 36, ["fb", "fm", "fy"][i], "thin", 6) + T(240, y + 23, step, { c: "on b", size: 14, max: 116 });
      if (i < 2) s += A(240, y + 38, 240, y + 52);
    });
    return s + T(240, 190, t.small, { c: "b blu", max: 150 });
  },
  sayOnce(lb) {
    const t = lb.clean;
    const block = (x, y, fill) => R(x, y, 40, 30, fill, "thin", 4) + L(x + 7, y + 10, x + 33, y + 10, "thin") + L(x + 7, y + 20, x + 26, y + 20, "thin");
    const bug = (x, y) => EL(x, y, 6, 8, "fi") + L(x - 10, y - 4, x + 10, y - 4, "thin") + L(x - 10, y + 3, x + 10, y + 3, "thin") + L(x - 4, y - 8, x - 7, y - 13, "thin") + L(x + 4, y - 8, x + 7, y - 13, "thin");
    const tick = (x, y) => P(`M${x - 7},${y} L${x - 2},${y + 6} L${x + 8},${y - 7}`, "", "blue-s w3");
    let s = L(160, 12, 160, 208, "dash thin faint");
    [["fm", tick], ["fc", bug], ["fc", bug]].forEach(([fill, mark], i) => s += block(50, 26 + i * 50, fill) + mark(112, 41 + i * 50));
    s += block(220, 30, "fm") + tick(278, 45);
    [190, 240, 290].forEach((x, i) => s += A(240, 64, x, 112, "thin") + R(x - 20, 116, 40, 26, "ft", "thin", 4) + T(x, 134, String.fromCharCode(65 + i), { c: "sm mut" }));
    return s + T(80, 196, t.copied, { c: "b cor", max: 140 }) + T(80, 213, t.missed, { c: "sm mut", max: 150 }) +
      T(240, 174, t.oneHome, { c: "b blu", max: 150 }) + T(240, 192, t.fixedAll, { c: "sm mut", max: 150 });
  },
  onlyNeed(lb) {
    const t = lb.clean;
    let s = L(160, 12, 160, 208, "dash thin faint") + R(26, 24, 108, 120, "fk", "", 10);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const x = 44 + c * 24, y = 44 + r * 26;
      s += (r + c) % 2 ? C(x, y, 7, ["fb", "fy", "fc", "fm"][(r + c * 3) % 4], "thin") : R(x - 8, y - 5, 16, 10, ["fy", "fm", "fb", "fc"][(r * 3 + c) % 4], "thin", 5);
    }
    s += R(196, 54, 88, 70, "fk", "", 10) + C(240, 89, 16, "fm");
    return s + T(80, 168, t.justInCase, { c: "b cor", max: 140 }) + T(80, 188, t.carry, { c: "sm mut", max: 150 }) +
      T(240, 168, t.now, { c: "b blu", max: 150 }) + T(240, 188, t.later2, { c: "sm mut", max: 150 });
  },
  aiWrites(lb) {
    const t = lb.clean;
    const card = (x, y) => R(x, y, 64, 84, "fk", "", 6) + [0, 1, 2, 3, 4].map(i => L(x + 10, y + 14 + i * 13, x + 54 - (i % 3) * 10, y + 14 + i * 13, "thin")).join("");
    let s = R(14, 20, 64, 40, "fb", "", 12) + P("M60,60 l14,14 l-2,-14", "fb") + T(46, 46, "AI", { c: "on b", size: 17 });
    s += [100, 114, 128].map((y, i) => L(36 + i * 12, y, 100, y, "thin blue-s")).join("");
    s += card(128, 60) + card(120, 52) + card(112, 44);
    s += C(232, 104, 15, "ft") + L(243, 115, 267, 138, "w3") + fig(276, 170, "walk");
    return s + T(110, 192, t.fast, { c: "b", max: 190 }) + T(252, 194, t.you, { c: "b blu", max: 136 });
  },
  littleCleaner(lb) {
    const t = lb.clean;
    let s = "";
    for (let i = 0; i < 4; i++) {
      const x = 22 + i * 74;
      s += R(x, 40, 60, 80, "fk", "", 6);
      for (let j = 0; j < 5; j++) s += j < 4 - i
        ? P(`M${x + 8},${52 + j * 14} q8,-8 14,0 t14,0 t14,0`, "", "thin coral-s")
        : L(x + 10, 52 + j * 14, x + 50, 52 + j * 14, "thin blue-s");
      s += T(x + 30, 140, t.visits[i], { c: "sm mut", max: 64 });
      if (i < 3) s += A(x + 62, 80, x + 72, 80, "thin", 7);
    }
    return s + T(160, 26, t.habit, { c: "sm b", max: 290 }) + T(160, 180, t.noRewrite, { c: "b blu", max: 280 });
  },

  sameResult(lb) {
    const t = lb.clean;
    const tangle = P(crPath([[94, 40], [190, 52], [102, 72], [186, 88], [118, 36], [172, 78], [98, 90], [190, 38], [140, 60]]), "", "thin coral-s");
    const tidy = R(96, 138, 92, 14, "fb", "thin", 4) + R(96, 157, 92, 14, "fm", "thin", 4) + R(96, 176, 92, 14, "fy", "thin", 4);
    const row = (y, label, inner) => T(20, y - 8, t.input, { a: "start", c: "sm mut", max: 60 }) + A(20, y, 80, y) +
      T(142, y - 42, label, { c: "sm b" }) + R(84, y - 36, 116, 72, "fk", "", 12) + inner + A(204, y, 252, y) + pill(276, y, "42", "fy", { on: true, size: 16, w: 40, h: 30 });
    return row(66, t.before, tangle) + row(162, t.after, tidy) + T(276, 116, t.same, { c: "sm b blu" });
  },
  stamina(lb) {
    const t = lb.clean, x0 = 44, x1 = 296;
    const messy = u => 172 - 140 * Math.pow(u, 2.2), tidy = u => 152 - 30 * u;
    const path = fn => Array.from({ length: 41 }, (_, i) => `${i ? "L" : "M"}${f1(x0 + i / 40 * (x1 - x0))},${f1(fn(i / 40))}`).join(" ");
    let u = 0;
    while (messy(u) > tidy(u) && u < 1) u += .005; // messy code is quicker at first, until the lines cross
    const cx = x0 + u * (x1 - x0), cy = tidy(u);
    return axes() + T(300, 213, t.x, { a: "end", c: "sm mut" }) + T(46, 12, t.y, { a: "start", c: "sm mut" }) +
      L(cx, cy, cx, 196, "dash thin") + P(path(messy), "", "coral-s w3") + P(path(tidy), "", "blue-s w3") + C(cx, cy, 5, "fy") +
      T(cx + 10, cy + 24, t.payoff, { a: "start", c: "sm b" }) + T(284, 30, t.messy, { a: "end", c: "sm b cor" }) + T(296, 112, t.tidy, { a: "end", c: "sm b blu" });
  },
  safetyNet(lb) {
    const t = lb.clean;
    let s = pill(80, 40, t.change, "fb", { on: true, size: 14 }) + A(134, 40, 184, 40) + pill(244, 40, t.run, "fy", { on: true, size: 14 });
    for (let i = 0; i < 5; i++) s += C(212 + i * 16, 80, 6, "fm");
    s += A(262, 92, 262, 140, "blue-s") + T(270, 120, t.pass, { a: "start", c: "sm b blu" }) + pill(250, 162, t.save, "fm", { on: true, size: 14 });
    s += A(222, 92, 124, 146, "coral-s dash") + T(170, 108, t.fail, { c: "sm b cor" }) + pill(100, 162, t.undo, "fc", { on: true, size: 14 }) + A(84, 146, 84, 58, "coral-s dash");
    return s + T(160, 210, t.caption, { c: "sm mut" });
  },
};
