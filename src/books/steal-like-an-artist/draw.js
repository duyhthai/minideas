// Steal Like an Artist: the drawings in its card stack and full review. lb.book holds the book's labels (book.js).
import { f1, T, L, C, R, P, EL, A, fig } from "../../draw.js";

export default {
  slaMashup(lb) {
    const t = lb.book;
    // what you take in (a book, music, an idea, a picture) goes into one bowl and comes out as a new idea
    let s = R(30, 24, 40, 28, "fb", "thin", 3) + L(50, 24, 50, 52, "thin");
    s += EL(44, 84, 7, 5, "fi") + L(51, 84, 51, 64) + P("M51,64 Q60,68 62,76", "", "thin");
    s += C(50, 120, 10, "fy", "thin") + R(45, 130, 10, 6, "fk", "thin", 2);
    s += R(30, 152, 40, 28, "fm", "thin", 3) + P("M34,176 L46,162 L54,170 L66,158", "", "thin");
    [38, 76, 122, 166].forEach(y => s += A(78, y, 122, 104 + (y - 100) * .12, "thin"));
    s += P("M118,98 Q160,150 202,98 Z", "ft") + P("M140,110 q8,-8 16,0 t16,0", "", "thin");
    s += A(210, 104, 236, 104);
    s += C(268, 92, 20, "fy") + R(259, 110, 18, 12, "fk", "thin", 3) + T(268, 99, "m", { c: "b on", size: 18 });
    for (const a of [-2.6, -1.57, -0.54]) s += L(268 + 26 * Math.cos(a), 92 + 26 * Math.sin(a), 268 + 33 * Math.cos(a), 92 + 33 * Math.sin(a), "thin");
    return s + T(160, 146, t.mix, { c: "sm b", max: 90 }) + T(268, 142, t.newIdea, { c: "sm b", max: 90 }) + T(50, 202, t.sources, { c: "sm mut", max: 92 }) +
      T(214, 202, t.sum, { c: "sm", max: 180 });
  },
  slaDesks(lb) {
    const t = lb.book;
    const desk = x => L(x, 136, x + 120, 136, "w3") + L(x + 10, 136, x + 10, 184) + L(x + 110, 136, x + 110, 184);
    let s = desk(18) + desk(182) + A(144, 112, 176, 112);
    // analog: a notebook, a pencil and some cut paper
    s += R(32, 106, 46, 30, "fk", "thin", 2) + [0, 1, 2].map(i => L(38, 114 + i * 7, 70 - i * 6, 114 + i * 7, "thin")).join("");
    s += P("M84,132 L114,100 L119,104 L89,136 Z", "fy", "thin") + R(100, 116, 30, 20, "fm", "thin", 2);
    // digital: a screen and a keyboard
    s += R(208, 74, 70, 48, "fb") + L(243, 122, 243, 130) + R(218, 128, 50, 7, "fk", "thin", 2);
    return s + T(78, 54, t.analog, { c: "b" }) + T(242, 54, t.digital, { c: "b" }) + T(78, 204, t.start, { c: "sm", max: 130 }) + T(242, 204, t.edit, { c: "sm", max: 130 });
  },
  slaHobbies(lb) {
    const t = lb.book;
    let s = C(132, 78, 44) + C(188, 78, 44) + C(160, 124, 44);
    // a pencil, a note and a camera, one per passion; a heart where they meet
    s += P("M104,86 L126,58 L132,62 L110,90 Z", "fy", "thin") + P("M104,86 L102,94 L110,90", "fk", "thin");
    s += EL(198, 80, 7, 5, "fi") + L(205, 80, 205, 58) + P("M205,58 Q214,62 216,70", "", "thin");
    s += R(146, 136, 30, 20, "fb", "thin", 4) + C(161, 146, 6, "fk", "thin") + R(152, 132, 10, 4, "fk", "thin", 1);
    s += P("M160,104 C150,94 146,86 154,84 C158,83 160,88 160,88 C160,88 162,83 166,84 C174,86 170,94 160,104 Z", "fc", "thin");
    return s + T(160, 190, t.interact, { c: "sm b", max: 300 }) + T(160, 210, t.happy, { c: "sm mut", max: 300 });
  },
  slaRoom(lb) {
    const t = lb.book;
    const star = (cx, cy, r) => P(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; return `${i ? "L" : "M"}${f1(cx + rr * Math.cos(a))},${f1(cy + rr * Math.sin(a))}`; }).join(" ") + " Z", "fy", "thin");
    let s = R(12, 30, 132, 132, "ft", "", 6) + R(176, 30, 132, 132, "ft", "", 6) + A(148, 96, 172, 96);
    s += fig(46, 146, "walk") + fig(78, 146, "walk") + fig(110, 146, "walk") + star(78, 60, 11);
    s += fig(210, 146, "walk") + fig(242, 146, "walk") + fig(274, 146, "walk") + star(210, 60, 11) + star(274, 60, 11);
    s += T(78, 158, t.you, { c: "sm b blu" }) + T(242, 158, t.you, { c: "sm b blu" });
    return s + T(78, 182, t.best, { c: "sm b", max: 130 }) + T(242, 182, t.other, { c: "sm b", max: 130 }) + T(160, 208, t.asGood, { c: "sm mut", max: 300 });
  },
  slaBoring(lb) {
    const t = lb.book;
    // someone on a bench with a book; an idea turns up in a thought bubble
    let s = R(46, 138, 80, 7, "fk", "thin", 2) + L(52, 145, 52, 176) + L(120, 145, 120, 176) + L(20, 176, 300, 176, "thin faint");
    s += C(76, 84, 10, "fk") + L(76, 94, 76, 136) + L(76, 136, 102, 136) + L(102, 136, 102, 172) + L(76, 106, 98, 114) + R(94, 100, 24, 18, "fb", "thin", 2);
    s += C(96, 66, 3, "fk", "thin") + C(110, 54, 5, "fk", "thin") + EL(160, 38, 38, 24, "fk") + C(160, 34, 10, "fy", "thin") + R(155, 44, 10, 6, "fk", "thin", 2);
    // what he always carries
    s += R(214, 120, 34, 46, "fy", "thin", 3) + [0, 1, 2, 3].map(i => L(220, 132 + i * 8, 242, 132 + i * 8, "thin")).join("") + P("M256,166 L282,124 L287,127 L261,169 Z", "fk", "thin");
    return s + T(254, 40, t.bored, { c: "sm b", max: 100 }) + T(86, 198, t.spare, { c: "sm", max: 150 }) + T(250, 198, t.carry, { c: "sm", max: 120 });
  },
  slaSubtract(lb) {
    const t = lb.book;
    // a lot goes into the funnel, little comes out, the rest is left out
    let s = P("M96,74 L224,74 L174,128 L174,156 L146,156 L146,128 Z", "ft");
    [[112, 58, "fb"], [134, 46, "fy"], [158, 60, "fc"], [180, 44, "fm"], [204, 58, "fb"], [146, 28, "fm"], [170, 22, "fc"], [194, 32, "fy"], [122, 30, "fc"]]
      .forEach(([x, y, f], i) => s += i % 3 === 0 ? R(x - 7, y - 7, 14, 14, f, "thin", 2) : i % 3 === 1 ? C(x, y, 7, f, "thin") : P(`M${x},${y - 8} L${x + 8},${y + 6} L${x - 8},${y + 6} Z`, f, "thin"));
    s += C(160, 178, 9, "fy", "thin");
    s += A(226, 82, 252, 108, "thin") + C(266, 118, 6, "fb", "faint") + R(276, 128, 12, 12, "fc", "faint", 2) + C(262, 140, 6, "fm", "faint");
    return s + T(52, 50, t.overload, { c: "sm b", max: 90 }) + T(274, 166, t.dropped, { c: "sm b cor", max: 80 }) + T(160, 208, t.matters, { c: "sm b", max: 300 });
  },
};
