// AI Fundamentals: the drawings. Their labels are in en.js and vi.js, under `art`.
import { f1, T, L, C, R, P, EL, head, A, pillW, pill, crPath, axes, fig, wave, brain, env, tick } from "../../draw.js";

/* the house-price dots and lines the learning ideas share */
const EP = [[80, 120], [125, 145], [170, 95], [215, 105], [260, 35]];
const lineY = x => 165 - .48 * (x - 40);
const FP = [[50, 112], [65, 148], [85, 138], [105, 160], [125, 146], [145, 162], [165, 140], [185, 148], [205, 122], [225, 128], [240, 100], [260, 104], [275, 62], [295, 70]];
const GOOD = "M45,122 C90,165 150,165 200,130 S270,70 300,55";

/* an AI as a chip, a square with pins on every side; h is its size */
const aiChip = (cx, cy, h = 36, label = 15) => {
  const r = h / 2, d = h * .28, n = h / 6;
  const pins = [-d, 0, d].map(o => L(cx - r - n, cy + o, cx - r, cy + o, "thin") + L(cx + r, cy + o, cx + r + n, cy + o, "thin") +
    L(cx + o, cy - r - n, cx + o, cy - r, "thin") + L(cx + o, cy + r, cx + o, cy + r + n, "thin")).join("");
  return pins + R(cx - r, cy - r, h, h, "fb", "", h / 6) + T(cx, cy + label * .4, "AI", { c: "on b", size: label });
};

export default {
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
  // a person hands an AI the four-part brief, as they would a new colleague
  handOff(lb) {
    const fills = ["fb", "fy", "fm", "fc"];
    let s = P("M18,148 Q18,124 40,124 Q62,124 62,148 Z", "fy", "thin") + C(40, 104, 14, "fk", "thin") + A(62, 120, 76, 120, "thin");
    s += R(80, 14, 166, 192, "fk", "", 8);
    lb.prompt.parts.forEach((lab, i) => {
      const y = 50 + i * 44;
      s += R(94, y - 18, 7, 30, fills[i], "", 3) + T(110, y, lab, { a: "start", c: "b", size: 14, max: 126 }) + L(110, y + 9, 196 - i * 10, y + 9, "thin faint");
    });
    return s + A(248, 110, 262, 110, "thin") + aiChip(286, 110);
  },
  // the same brief filled in: the stock check, with its data and the table it should return
  brief(lb) {
    const t = lb.prompt.example, fills = ["fb", "fy", "fm", "fc"];
    let s = R(14, 10, 292, 200, "fk", "", 8) + [57, 106, 157].map(y => L(14, y, 306, y, "thin")).join("");
    [34, 82, 132, 182].forEach((y, i) => s += R(26, y - 15, 7, 30, fills[i], "", 3) + T(42, y + 5, lb.prompt.parts[i], { a: "start", c: "b", size: 14, max: 94 }));
    s += T(148, 39, t.ask, { a: "start", size: 13.5, max: 138 }) + T(148, 82, t.why, { a: "start", c: "sm", size: 12.5, max: 146 });
    // the order and the stock, as two little tables
    const table = (x, w, title, rows) => R(x, 111, w, 42, "ft", "thin", 6) + T(x + w / 2, 123, title, { c: "sm b", size: 11 }) + L(x, 127, x + w, 127, "thin") +
      rows.map((r, k) => T(x + w / 2, 139 + k * 11, r, { c: "sm", size: 11 })).join("");
    s += table(148, 68, t.order, ["A × 5", "B × 3"]) + table(226, 68, t.stock, ["A: 8", "B: 4"]);
    // the answer's shape: an empty table with its two columns
    s += R(148, 161, 148, 42, "", "thin", 6) + L(198, 161, 198, 203, "thin") + L(148, 181, 296, 181, "thin") +
      T(173, 175, t.cols[0], { c: "sm b", size: 11, max: 37 }) + T(247, 175, t.cols[1], { c: "sm b", size: 11, max: 76 }) +
      L(156, 193, 190, 193, "thin faint") + L(208, 193, 286, 193, "thin faint");
    return s;
  },
  // the same question asked twice: alone it gets a chatty reply, after two examples just the word
  shots(lb) {
    const t = lb.prompt;
    const ask = (x, y, w, h) => R(x, y, w, h, "ft", "", 12) + P(`M${x + w - 18},${y + h} l6,10 l-16,-10`, "ft");
    const reply = (x, y, w, h) => R(x, y, w, h, "fy", "", 12) + P(`M${x + 18},${y + h} l-6,10 l16,-10`, "fy");
    let s = L(160, 10, 160, 210, "dash thin faint") + T(80, 20, "zero-shot", { c: "b" }) + T(240, 20, "few-shot", { c: "b" });
    s += ask(12, 32, 140, 48) + T(22, 52, t.translate, { a: "start", c: "sm", size: 12.5, max: 120 }) + T(22, 70, t.cheese, { a: "start", c: "sm b", size: 12.5 });
    s += reply(12, 94, 140, 76) + t.reply.map((line, k) => T(22, 112 + k * 16, line, { a: "start", c: "sm on", size: 12, max: 120 })).join("");
    s += ask(168, 32, 140, 84);
    [t.translate, ...t.examples, t.cheese].forEach((line, k) => s += T(178, 52 + k * 18, line, { a: "start", c: `sm ${k === 3 ? "b" : ""}`, size: 12.5, max: 120 }));
    s += reply(196, 130, 90, 34) + T(241, 152, "fromage", { c: "b on" }) + tick(300, 146);
    return s + T(80, 204, t.chatty, { c: "sm mut", size: 12.5, max: 140 }) + T(240, 204, t.exact, { c: "sm b blu", size: 12.5, max: 140 });
  },
  // the egg question asked straight gets a guess; asked to think step by step, it writes the steps and builds on them
  cot(lb) {
    const t = lb.prompt;
    let s = R(14, 8, 292, 50, "ft", "", 12) + T(160, 37, t.question, { size: 14, max: 276 }) + L(160, 68, 160, 210, "dash thin faint");
    s += T(80, 82, t.straight, { c: "sm b mut", size: 12.5, max: 140 }) + R(24, 92, 112, 68, "", "dash thin faint", 12) + T(80, 126, t.noSteps, { c: "sm mut", size: 12.5, max: 100 }) +
      pill(80, 188, `${t.answer}: 41`, "fc", { size: 14, on: true }) + T(138, 197, "?", { c: "cor b", size: 24 });
    s += T(240, 82, t.think, { c: "sm b blu", size: 12.5, max: 140 });
    s += pill(240, 104, "3 × 12 = 36", "fk", { size: 14 }) + pill(240, 146, "36 − 5 = 31", "fk", { size: 14 }) + pill(240, 188, `${t.answer}: 31`, "fm", { size: 14, on: true });
    return s + A(240, 120, 240, 131, "thin", 7) + A(240, 162, 240, 173, "thin", 7) + tick(300, 188);
  },
  tricks(lb) {
    const t = lb.prompt;
    let s = L(160, 12, 160, 208, "dash thin faint") + L(12, 110, 308, 110, "dash thin faint");
    // ask a few times: the egg answer three times, two agree
    s += pill(50, 36, "31", "fm", { on: true, w: 30 }) + pill(80, 36, "31", "fm", { on: true, w: 30 }) + pill(110, 36, "30", "fc", { on: true, w: 30 });
    s += P("M37,54 v6 h56 v-6", "", "blue-s") + tick(66, 72) + T(80, 98, t.tricks[0], { c: "sm", size: 12.5, max: 144 });
    // ask for options: three cards, one picked
    ["A", "B", "C"].forEach((k, i) => s += R(194 + i * 34, 20, 28, 38, i === 1 ? "fm" : "fk", "", 5) + T(208 + i * 34, 45, k, { c: `b ${i === 1 ? "on" : ""}` }));
    s += tick(242, 72) + T(240, 98, t.tricks[1], { c: "sm", size: 12.5, max: 144 });
    // give it sources: your document goes in with the question
    s += R(30, 128, 34, 44, "fk", "", 4) + L(37, 140, 57, 140, "thin") + L(37, 148, 57, 148, "thin") + L(37, 156, 51, 156, "thin");
    s += A(70, 150, 94, 150, "thin") + aiChip(118, 150, 28, 12) + T(80, 202, t.tricks[2], { c: "sm", size: 12.5, max: 144 });
    // let it use tools: a calculator and a magnifying glass
    s += R(206, 122, 40, 52, "fk", "", 6) + R(212, 128, 28, 12, "ft", "thin", 2);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) s += C(216 + c * 10, 150 + r * 12, 3, "fi");
    s += C(274, 142, 12, "ft") + L(283, 151, 294, 162, "w3");
    return s + T(240, 202, t.tricks[3], { c: "sm", size: 12.5, max: 144 });
  },

  /* why AI makes things up */
  madeUp(lb) {
    const t = lb.trust;
    let s = R(104, 10, 202, 54, "ft", "", 12) + P("M290,64 l4,10 l-18,-10", "ft") + T(118, 37, t.ask, { a: "start", max: 176 });
    s += R(14, 86, 234, 62, "fb", "", 12) + P("M34,148 l-4,10 l14,-10", "fb") + T(28, 117, t.claim, { a: "start", c: "on", max: 212 });
    s += `<g transform="rotate(-8 240 170)">` + R(186, 152, 108, 36, "", "coral-s w3", 6) + T(240, 176, t.stamp, { c: "b cor", size: 18, max: 96 }) + "</g>";
    return s + T(16, 208, t.sure, { a: "start", c: "sm mut", size: 12.5, max: 160 });
  },
  fillShape(lb) {
    const t = lb.trust;
    let s = T(20, 20, t.shapeTag, { a: "start", c: "sm b blu", size: 12.5 }) + R(14, 28, 292, 40, "ft", "", 12) + T(160, 54, t.shape, { max: 240 });
    t.fills.forEach(([word, fits], i) => {
      const y = 96 + i * 36;
      s += pill(76, y, word, "fy", { on: true, size: 14, w: 124 }) + A(144, y, 168, y, "thin") + T(176, y + 5, fits, { a: "start", c: "mut", max: 130 });
    });
    return s + T(160, 208, t.noCheck, { c: "sm b cor", size: 12.5, max: 290 });
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
  examGuess(lb) {
    const t = lb.trust;
    let s = R(14, 8, 292, 172, "fk", "", 10) + T(160, 34, t.examTitle, { c: "sm b", size: 12.5, max: 260 }) + L(30, 48, 290, 48, "thin faint");
    t.scored.forEach(([answer, score], i) => {
      const y = 84 + i * 60;
      s += R(28, y - 19, 142, 38, "fb", "", 10) + T(99, y + 5, answer, { c: "on", max: 128 }) + A(176, y, 196, y, "thin") +
        T(202, y + 5, score, { a: "start", c: `b ${i ? "blu" : "cor"}`, max: 92 });
    });
    return s + T(160, 206, t.examCaption, { c: "sm mut", size: 12.5, max: 290 });
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

  /* responsible AI: one hiring model, four questions */
  biasHire(lb) {
    const t = lb.resp;
    // head and shoulders; a woman (coral) has long hair
    const person = (x, y, f) => (f === "fc" ? P(`M${x - 8},${y + 1} C${x - 11},${y - 22} ${x + 11},${y - 22} ${x + 8},${y + 1} Z`, f, "thin") : "") +
      C(x, y - 9, 6, f === "fc" ? "fk" : f) + P(`M${x - 9},${y + 9} Q${x - 9},${y} ${x},${y} Q${x + 9},${y} ${x + 9},${y + 9} Z`, f);
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
    let s = R(12, 14, 166, 170, "fk", "", 12) + T(26, 33, t.chatbot, { a: "start", c: "sm mut b", size: 12.5, max: 136 }) + L(12, 42, 178, 42, "thin");
    s += R(28, 52, 136, 118, "ft", "", 10) + P("M150,170 l8,9 l-18,-9", "ft") + T(40, 70, t.paste, { a: "start", c: "sm", size: 12.5, max: 112 });
    s += R(40, 80, 112, 82, "fk", "coral-s dash", 6) + T(50, 99, "CV", { a: "start", c: "sm b", size: 12.5 }) +
      R(122, 86, 22, 26, "ft", "thin", 3) + C(133, 95, 4, "fk", "thin") + P("M126,112 Q126,103 133,103 Q140,103 140,112", "", "thin");
    t.card.forEach((line, i) => s += T(50, 122 + i * 15, line, { a: "start", c: "sm", size: 12, max: 96 }));
    [46, 100, 154].forEach((y, i) => s += A(182, 100, 198, y, "thin") + R(202, y - 18, 104, 36, "fk", "", 10) + T(254, y + 5, t.where[i], { c: "sm b", size: 12.5, max: 94 }));
    return s + T(160, 207, t.leakCaption, { c: "sm mut", size: 12.5, max: 290 });
  },
  blackBox(lb) {
    const t = lb.resp;
    let s = R(16, 40, 60, 80, "fk", "", 4) + R(24, 48, 16, 20, "ft", "thin", 2) + L(46, 54, 68, 54, "w3") + L(46, 63, 62, 63, "thin");
    for (let i = 0; i < 4; i++) s += L(24, 82 + i * 10, i === 3 ? 50 : 68, 82 + i * 10, "thin");
    s += T(46, 140, t.application, { c: "sm b", size: 12.5, max: 90 });
    // the model's reasons: a tangle of weights
    const cols = [[128, [60, 80, 100]], [154, [54, 70, 90, 106]], [180, [80]]];
    s += A(82, 80, 108, 80) + R(112, 42, 84, 76, "fk", "w3", 10);
    cols.slice(1).forEach(([x, ys], c) => ys.forEach(y => cols[c][1].forEach(y0 => s += L(cols[c][0], y0, x, y, "thin faint"))));
    cols.forEach(([x, ys]) => ys.forEach(y => s += C(x, y, 4, "fb", "thin")));
    s += T(154, 140, t.model, { c: "sm b", size: 12.5, max: 90 });
    s += A(200, 80, 222, 80) + pill(266, 80, t.denied, "fc", { on: true, size: 15 });
    s += fig(214, 206, "walk") + R(232, 136, 72, 32, "ft", "", 12) + P("M240,168 l-6,8 l14,-8", "ft") + T(268, 157, t.why, { c: "b cor", max: 62 });
    return s + T(20, 190, t.noReason, { a: "start", c: "sm mut", size: 12.5, max: 160 });
  },
  inCharge(lb) {
    const t = lb.resp, w = pillW(t.reject, 14);
    let s = T(62, 46, t.suggests, { c: "sm b mut", size: 12.5, max: 110 }) + pill(62, 74, t.reject, "fc", { on: true, size: 14 }) +
      L(62 - w / 2 - 4, 84, 62 + w / 2 + 4, 64, "w3") + T(62, 112, t.override, { c: "sm b cor", size: 12.5, max: 110 });
    s += A(102, 74, 136, 74) + fig(160, 140, "walk") + T(160, 160, t.person, { c: "sm b", size: 12.5, max: 120 });
    s += A(184, 74, 218, 74) + T(262, 46, t.decision, { c: "sm b mut", size: 12.5, max: 100 }) + pill(262, 74, t.interview, "fm", { on: true, size: 14 });
    return s + T(160, 202, t.owner, { c: "sm mut", size: 12.5, max: 290 });
  },
};
