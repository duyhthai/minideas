// The Hobbit: the drawings in its card stack and full review. lb.book holds the book's labels (book.js).
import { T, L, C, R, P, EL, pill, crPath, face, fig } from "../../draw.js";

export default {
  hbWorld(lb) {
    const t = lb.book;
    let s = P("M70,44 Q115,32 160,48 L160,162 Q115,150 70,158 Z", "ft") + P("M160,48 Q205,32 250,44 L250,158 Q205,150 160,162 Z", "ft");
    for (let i = 0; i < 7; i++) s += L(82, 64 + i * 13, 148 - (i % 2) * 14, 64 + i * 13, "thin");
    s += P("M172,104 L188,76 L198,92 L214,62 L238,104 Z", "fk", "thin") + C(186, 62, 6, "fy", "thin");
    s += P("M174,146 Q188,120 206,130 T234,114", "", "dash thin") + T(236, 146, "×", { c: "b cor", size: 18 });
    const w = t.craft.map(c => c.length * 13 * .52 + 24), gap = 10;
    let x = 160 - (w.reduce((a, b) => a + b) + gap * (w.length - 1)) / 2;
    t.craft.forEach((c, i) => { s += R(x, 178, w[i], 28, "fk", "thin", 6) + T(x + w[i] / 2, 197, c, { size: 13 }); x += w[i] + gap; });
    return s + T(160, 22, t.world, { c: "b", max: 220 });
  },
  hbGolf(lb) {
    const t = lb.book, hx = 170, hy = 62;
    let s = L(16, 186, 304, 186) + fig(58, 186) + P("M84,104 Q170,-6 252,176", "", "dash thin");
    s += P(`M${hx - 8},${hy - 6} L${hx - 18},${hy - 16} L${hx - 3},${hy - 10} Z`, "fm") + P(`M${hx + 8},${hy - 6} L${hx + 18},${hy - 16} L${hx + 3},${hy - 10} Z`, "fm");
    s += C(hx, hy, 11, "fm") + C(hx - 4, hy - 2, 1.6, "fi") + C(hx + 4, hy - 2, 1.6, "fi") + P(`M${hx - 4},${hy + 5} L${hx + 4},${hy + 5}`, "", "thin");
    s += EL(258, 187, 24, 6, "fi");
    return s + T(hx, 30, t.golfimbul, { c: "sm b", max: 150 }) + T(226, 96, t.yards, { a: "start", c: "sm halo", max: 90 }) +
      pill(146, 150, t.golf, "fy", { on: true, size: 15 }) + T(258, 206, t.rabbitHole, { c: "sm", max: 110 });
  },
  hbNotInBook(lb) {
    const t = lb.book;
    let s = R(28, 36, 84, 108, "fb", "", 6) + L(40, 36, 40, 144, "thin") + T(76, 92, "The\nHobbit", { c: "b on", size: 15 });
    s += T(70, 174, t.pages, { c: "sm b", max: 120 });
    t.notIn.forEach((name, i) => {
      const y = 40 + i * 56;
      s += R(150, y - 18, 146, 36, "fk", "thin", 6) + T(223, y + 5, name, { c: "b", max: 120 }) + L(162, y + 9, 284, y - 9, "coral-s w3") +
        T(223, y + 32, t.notes[i], { c: "sm mut", size: 12, max: 160 });
    });
    return s;
  },
  hbJourney(lb) {
    const t = lb.book;
    // a hobbit-hole door, a long winding road with moods along it, the mountain and its hoard
    let s = L(10, 170, 310, 170) + P("M14,170 A26,26 0 0 1 66,170 Z", "fm") + P("M26,170 A14,14 0 0 1 54,170 Z", "fy", "thin") + C(46, 162, 2, "fi");
    s += P("M232,170 L272,70 L312,170 Z", "ft", "thin") + EL(272, 162, 20, 6, "fy", "thin");
    s += P(crPath([[68, 166], [104, 152], [110, 118], [142, 100], [176, 120], [204, 98], [198, 68], [228, 58], [244, 96], [250, 150]]), "", "dash");
    s += face(110, 118, "up") + face(176, 120, "down") + face(228, 58, "flat");
    return s + T(160, 24, t.journey, { c: "b", max: 290 }) + T(160, 196, t.slow, { c: "sm mut", max: 300 });
  },
  hbWits(lb) {
    const t = lb.book;
    let s = face(60, 106, "up", 14) + P("M42,96 L60,54 L78,96 Z", "fb") + L(36, 96, 84, 96) + P("M50,113 Q60,140 70,113", "fk", "thin");
    s += face(160, 108, "up", 14) + C(160, 64, 11, "fy") + R(155, 74, 10, 7, "fk", "thin", 2);
    for (const a of [-2.4, -1.57, -0.74]) s += L(160 + 15 * Math.cos(a), 64 + 15 * Math.sin(a), 160 + 21 * Math.cos(a), 64 + 21 * Math.sin(a), "thin");
    s += face(260, 80, "up", 9) + R(232, 88, 56, 32, "fy", "", 12) + L(248, 88, 248, 120, "thin") + L(272, 88, 272, 120, "thin");
    s += P("M222,116 q10,-6 20,0 t20,0 t20,0 t20,0", "", "thin blue-s");
    t.wits.forEach(([who, how], i) => s += T(60 + i * 100, 156, who, { c: "b", max: 96 }) + T(60 + i * 100, 176, how, { c: "sm mut", max: 96 }));
    return s + T(160, 208, t.witsLine, { c: "sm", max: 300 });
  },
};
