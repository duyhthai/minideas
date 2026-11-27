// Clean code and refactoring: the drawings. Their labels are in en.js and vi.js, under `art`.
import { f1, T, L, C, R, P, EL, A, pill, crPath, axes, fig, tick } from "../../draw.js";

export default {
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
