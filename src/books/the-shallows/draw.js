// The Shallows: the drawings in its card stack and full review. lb.book holds the book's labels (book.js).
import { T, L, C, R, P, EL, head, A, fig, env, f1 } from "../../draw.js";

// a person's brain seen from the side, front to the left (the shared brain() is half circuit: AI Fundamentals' picture).
// spots: [dx, dy, rx, ry, fill], coloured patches where something has left its mark (offsets at k = 1)
function brain(cx, cy, k = 1, spots = []) {
  const at = d => d.replace(/(-?[\d.]+),(-?[\d.]+)/g, (_, x, y) => `${f1(cx + x * k)},${f1(cy + y * k)}`);
  let s = P(at("M8,24 L14,52 L24,52 L22,26 Z"), "ft", "thin") + EL(f1(cx + 30 * k), f1(cy + 28 * k), f1(18 * k), f1(11 * k), "ft", "thin");
  s += P(at("M-56,6 C-64,-20 -44,-44 -14,-44 C0,-52 28,-50 40,-40 C58,-36 68,-16 62,2 C66,18 50,30 34,26 C20,34 0,32 -10,26 C-26,34 -48,28 -56,6 Z"), "ft");
  s += ["M4,-42 C-2,-28 10,-16 2,-2", "M-38,10 C-20,2 0,6 18,2", "M-30,-32 C-34,-20 -24,-14 -30,-4", "M36,-32 C28,-22 40,-12 32,0", "M-14,-20 Q-10,-12 -16,-6", "M24,10 Q36,14 44,8"]
    .map(d => P(at(d), "", "thin")).join("");
  return s + spots.map(([x, y, rx, ry, f]) => EL(f1(cx + x * k), f1(cy + y * k), f1(rx * k), f1(ry * k), f, "thin")).join("");
}

export default {
  shlCraving(lb) {
    const t = lb.book, fills = ["fy", "fb", "fm", "fc"], hops = [[196, 30], [272, 66], [196, 102], [272, 138], [196, 174]];
    // an open book: the reading line follows the text, breaks off mid-line and hops from one new thing to the next, with no end
    let s = P("M14,54 Q48,45 82,54 L82,158 Q48,149 14,158 Z", "fk") + P("M82,54 Q116,45 150,54 L150,158 Q116,149 82,158 Z", "fk");
    for (let k = 0; k < 7; k++) {
      const y = 70 + k * 12;
      s += L(22, y, 74, y, "thin faint") + (k > 2 ? L(90, y, 142, y, "thin faint") : k === 2 ? L(116, y, 142, y, "thin faint") : "");
    }
    s += L(90, 70, 142, 70, "blue-s") + L(90, 82, 142, 82, "blue-s") + P("M90,94 L112,94 Q166,94 169,52", "", "blue-s") + head(170, 46, -1.5, "blue-s", 8);
    hops.forEach(([x, y], i) => {
      s += i < 4 ? R(x - 32, y - 13, 64, 26, fills[i], "thin", 6) + T(x, y + 5, t.feeds[i], { size: 13, max: 56, c: "on" }) + C(x + 31, y - 12, 4.5, "fc", "thin")
        : R(x - 32, y - 13, 64, 26, "", "thin dash faint", 6) + T(x, y + 6, "…", { size: 22, c: "mut" });
      if (i) { const [px, py] = hops[i - 1], d = x > px ? 1 : -1; s += A(px + d * 18, py + 15, x - d * 18, y - 15, "thin blue-s" + (i < 4 ? "" : " faint"), 7); }
    });
    return s + T(82, 182, t.cantFocus, { c: "sm b cor", max: 136 }) + T(234, 208, t.newFast, { c: "b blu", max: 150 });
  },
  shlBrainBook(lb) {
    const t = lb.book, ys = [44, 96, 148];
    // the book, and the three strands it follows
    let s = R(28, 34, 86, 118, "fy", "", 4) + L(38, 34, 38, 152, "thin") + brain(76, 92, .42) + L(52, 132, 104, 132, "thin") + L(60, 140, 96, 140, "thin");
    ys.forEach(y => s += A(118, 93, 140, y, "thin", 7));
    // a nerve cell, a scroll, a screen
    s += C(160, ys[0], 7, "fm", "thin") + [0, 1, 2, 3, 4].map(k => { const a = k * 1.256 - 1.57; return L(160 + 7 * Math.cos(a), ys[0] + 7 * Math.sin(a), 160 + 15 * Math.cos(a), ys[0] + 15 * Math.sin(a), "thin"); }).join("");
    s += R(148, ys[1] - 10, 26, 20, "fk", "thin", 2) + EL(148, ys[1], 4, 11, "fk", "thin") + EL(174, ys[1], 4, 11, "fk", "thin") + L(154, ys[1] - 3, 168, ys[1] - 3, "thin") + L(154, ys[1] + 3, 166, ys[1] + 3, "thin");
    s += R(145, ys[2] - 13, 30, 20, "fb", "thin", 3) + L(160, ys[2] + 7, 160, ys[2] + 12, "thin") + L(152, ys[2] + 13, 168, ys[2] + 13, "thin");
    ys.forEach((y, i) => s += T(188, y + 5, t.strands[i], { a: "start", c: "sm", max: 124 }));
    return s + T(160, 186, t.amazon, { c: "sm mut", max: 300 }) + T(160, 206, t.series, { c: "sm mut", max: 300 });
  },
  shlRewire(lb) {
    const t = lb.book;
    // a violin, braille, the web, a book: each one leaves its own mark on the brain, in its own colour
    let s = brain(160, 94, 1, [[-26, -26, 14, 9, "fy"], [32, -22, 13, 9, "fm"], [-32, 8, 13, 8, "fb"], [38, 6, 12, 8, "fc"]]);
    s += L(20, 17, 32, 63, "thin") + R(29, 57, 6, 8, "fi", "thin", 1);
    s += R(50, 11, 4, 16, "fi", "thin", 1) + C(52, 10, 3.5, "fi") + P("M52,25 C44,25 40,30 41,35 C42,39 46,41 46,44 C46,47 39,49 39,56 C39,63 46,66 52,66 C58,66 65,63 65,56 C65,49 58,47 58,44 C58,41 62,39 63,35 C64,30 60,25 52,25 Z", "fy", "thin");
    s += R(50, 25, 4, 22, "fi", "thin", 1) + P("M46,47 q-2,4 0,8", "", "thin") + P("M58,47 q2,4 0,8", "", "thin") + L(47, 55, 57, 55, "thin") + P("M49,59 L55,59 L53,65 L51,65 Z", "fi", "thin");
    s += R(246, 22, 44, 40, "fm", "thin", 4);
    [[256, 32, 1], [264, 32, 0], [256, 42, 1], [264, 42, 1], [256, 52, 0], [264, 52, 0], [274, 32, 1], [282, 32, 1], [274, 42, 0], [282, 42, 0], [274, 52, 1], [282, 52, 0]]
      .forEach(([x, y, on]) => s += C(x, y, 2.6, on ? "fi" : "fk", on ? "" : "thin faint"));
    s += C(52, 130, 15, "fb", "thin") + EL(52, 130, 6, 15, "", "thin") + L(37, 130, 67, 130, "thin") + P("M40,122 Q52,126 64,122", "", "thin") + P("M40,138 Q52,134 64,138", "", "thin");
    s += P("M240,122 Q254,116 268,122 L268,144 Q254,138 240,144 Z", "fc", "thin") + P("M268,122 Q282,116 296,122 L296,144 Q282,138 268,144 Z", "fc", "thin");
    s += A(80, 44, 118, 62, "thin", 7) + A(240, 44, 205, 64, "thin", 7) + A(76, 124, 114, 106, "thin", 7) + A(238, 126, 211, 106, "thin", 7);
    [[52, 78], [268, 78], [52, 162], [268, 162]].forEach(([x, y], i) => s += T(x, y, t.who[i], { c: "sm b", max: 100 }));
    return s + T(160, 198, t.newState, { c: "sm mut", max: 300 });
  },
  shlNoSpaces(lb) {
    const t = lb.book, xs = [36, 98, 160, 222, 284];
    // clay, a scroll, parchment, a wax tablet, a book
    let s = R(20, 30, 32, 34, "fc", "thin", 7) + [0, 1, 2].map(k => L(27, 39 + k * 8, 33, 39 + k * 8, "thin") + L(37, 39 + k * 8, 44, 39 + k * 8, "thin")).join("");
    s += R(86, 35, 24, 24, "fy", "thin", 1) + EL(85, 47, 4, 14, "fy", "thin") + EL(111, 47, 4, 14, "fy", "thin") + L(92, 43, 104, 43, "thin") + L(92, 51, 102, 51, "thin");
    s += P("M146,30 Q160,26 174,30 Q171,47 174,64 Q160,60 146,64 Q149,47 146,30 Z", "fm", "thin") + L(153, 40, 167, 40, "thin") + L(153, 47, 167, 47, "thin") + L(153, 54, 163, 54, "thin");
    s += R(206, 30, 32, 34, "fk", "thin", 3) + R(211, 35, 22, 24, "fy", "thin", 2) + P("M215,42 l4,4 l4,-4 l4,4", "", "thin");
    s += R(270, 30, 28, 34, "fb", "thin", 3) + L(276, 30, 276, 64, "thin");
    for (let k = 0; k < 4; k++) s += A(xs[k] + 20, 47, xs[k + 1] - 20, 47, "thin faint", 6);
    xs.forEach((x, i) => s += T(x, 84, t.media[i], { c: "sm", max: 60 }));
    s += R(16, 102, 288, 30, "fk", "", 6) + T(160, 122, t.joined, { max: 270 });
    s += A(70, 136, 70, 160, "blue-s", 8) + T(84, 153, t.invented, { a: "start", c: "sm b blu", max: 210 });
    s += R(16, 164, 288, 30, "fb", "", 6) + T(160, 184, t.spaced, { c: "on", max: 270 });
    return s + T(160, 211, t.easier, { c: "sm mut", max: 300 });
  },
  shlPaperKindle(lb) {
    const t = lb.book;
    let s = R(52, 18, 38, 52, "fy", "thin", 3) + L(58, 18, 58, 70, "thin") + L(64, 32, 84, 32, "thin") + L(64, 40, 80, 40, "thin");
    s += R(229, 14, 42, 60, "fk", "", 6) + R(234, 20, 32, 40, "ft", "thin", 2) + [0, 1, 2, 3].map(k => L(238, 27 + k * 8, 262 - (k % 2) * 6, 27 + k * 8, "thin")).join("") + R(244, 64, 12, 4, "fi", "thin", 2);
    s += T(160, 54, "+", { size: 30, c: "b" }) + L(160, 104, 160, 176, "thin dash faint");
    s += T(71, 92, t.paper, { c: "b", max: 130 }) + T(250, 92, t.reader, { c: "b", max: 130 });
    t.paperPros.forEach((p, i) => s += C(24, 117 + i * 20, 2.5, "fi") + T(32, 121 + i * 20, p, { a: "start", c: "sm", max: 118 }));
    t.readerPros.forEach((p, i) => s += C(176, 117 + i * 20, 2.5, "fi") + T(184, 121 + i * 20, p, { a: "start", c: "sm", max: 128 }));
    return s + T(160, 206, t.both, { c: "sm b", max: 300 });
  },
  shlInterrupt(lb) {
    const t = lb.book, badge = (x, y, n) => C(x, y, 8, "fc", "thin") + T(x, y + 4, n, { size: 11, c: "on b" });
    // a screen surrounded by things that ping, and a train of thought that keeps breaking
    let s = R(112, 52, 96, 66, "fb", "", 6) + L(160, 118, 160, 130) + L(140, 130, 180, 130);
    s += env(28, 26, 44, 28) + badge(72, 26, "3");
    s += R(244, 22, 52, 30, "fy", "thin", 10) + P("M256,52 L252,62 L266,52", "fy", "thin") + L(254, 33, 286, 33, "thin") + L(254, 41, 278, 41, "thin") + badge(296, 22, "9");
    s += R(34, 82, 24, 40, "fk", "", 4) + L(42, 116, 50, 116, "thin") + badge(58, 82, "5");
    s += P("M258,108 Q258,88 270,88 Q282,88 282,108 L286,114 L254,114 Z", "fm", "thin") + C(270, 118, 3, "fi") + badge(286, 90, "!");
    s += A(76, 46, 108, 64, "thin coral-s dash", 7) + A(240, 46, 212, 62, "thin coral-s dash", 7) + A(62, 104, 108, 96, "thin coral-s dash", 7) + A(250, 106, 212, 98, "thin coral-s dash", 7);
    const zig = x => P(`M${x},164 l5,-8 l6,16 l6,-16 l5,8`, "", "coral-s");
    s += L(24, 164, 80, 164) + zig(80) + L(102, 164, 172, 164) + zig(172) + L(194, 164, 236, 164) + zig(236) + L(258, 164, 296, 164);
    return s + T(160, 200, t.ecosystem, { c: "b", max: 300 });
  },
  shlBalance(lb) {
    const t = lb.book;
    let s = t.upsides.map((u, i) => T(24, 24 + i * 20, "+", { a: "start", c: "b blu" }) + T(38, 24 + i * 20, u, { a: "start", c: "sm", max: 270 })).join("");
    // a scale balanced on a clock: screens on one side, everything else on the other
    s += L(160, 82, 160, 176) + L(128, 176, 192, 176, "w3") + L(66, 82, 254, 82, "w3");
    s += L(66, 82, 44, 130, "thin") + L(66, 82, 88, 130, "thin") + P("M36,130 Q66,148 96,130 Z", "ft");
    s += L(254, 82, 232, 130, "thin") + L(254, 82, 276, 130, "thin") + P("M224,130 Q254,148 284,130 Z", "ft");
    s += C(160, 82, 13, "fk") + L(160, 82, 160, 74, "thin") + L(160, 82, 166, 86, "thin");
    s += R(48, 108, 26, 20, "fb", "thin", 3) + R(76, 116, 18, 12, "fm", "thin", 4);
    s += R(230, 108, 20, 22, "fy", "thin", 2) + L(234, 108, 234, 130, "thin") + R(254, 114, 24, 16, "fm", "thin", 3) + P("M261,114 L261,110 L271,110 L271,114", "", "thin");
    s += T(66, 166, t.screens, { c: "sm", max: 120 }) + T(254, 166, t.rest, { c: "sm", max: 120 });
    return s + T(160, 204, t.balance, { c: "b", max: 300 });
  },
  shlParadox(lb) {
    const t = lb.book;
    let s = L(14, 172, 306, 172, "thin faint") + fig(52, 172, "walk");
    // a distracted reader: a scribble over the head
    s += P("M40,90 q6,-10 12,0 t12,0 q-4,8 -12,4 q-8,-4 -4,-10", "", "thin coral-s");
    s += R(136, 144, 48, 28, "fy", "thin", 3) + L(142, 144, 142, 172, "thin");
    s += R(232, 50, 64, 122, "fb", "", 4) + L(242, 50, 242, 172, "thin") + L(252, 74, 286, 74, "thin") + L(252, 84, 280, 84, "thin");
    // straight to the big book: blocked; one step via the simpler book
    s += P("M70,96 Q140,30 214,48", "", "thin coral-s dash") + L(206, 40, 220, 54, "coral-s") + L(220, 40, 206, 54, "coral-s");
    s += P("M70,128 Q110,104 140,132", "", "blue-s") + head(140, 134, 1.1, "blue-s", 8) + P("M184,140 Q204,100 226,104", "", "blue-s") + head(228, 104, 0.1, "blue-s", 8);
    s += T(52, 196, t.distracted, { c: "sm", max: 96 }) + T(160, 190, t.simpler, { c: "sm", max: 110 }) + T(264, 196, t.academic, { c: "sm", max: 110 });
    return s + T(160, 18, t.step, { c: "sm b blu", max: 300 });
  },
};
