// The Second World War: the drawings in its card stack and full review. lb.book holds the book's labels (book.js).
import { f1, T, L, C, R, P, EL, A, fig } from "../../draw.js";

export default {
  wwMachines(lb) {
    const t = lb.book;
    const gear = (cx, cy, r, n, turn) => {
      const st = 2 * Math.PI / n, pt = (a, rr) => `${f1(cx + rr * Math.cos(a))},${f1(cy + rr * Math.sin(a))}`;
      let d = "";
      for (let k = 0; k < n; k++) { const a = turn + k * st; d += `${k ? "L" : "M"}${pt(a - st * .3, r)} L${pt(a - st * .17, r + 9)} L${pt(a + st * .17, r + 9)} L${pt(a + st * .3, r)} `; }
      return P(d + "Z", "fk") + C(cx, cy, 9, "fi");
    };
    let s = gear(104, 120, 46, 12, 0) + gear(216, 120, 46, 12, Math.PI / 12);
    // small people squeezed in the gap under the gears
    [146, 160, 174].forEach((x, i) => s += C(x, 158 + i % 2 * 3, 4.5, "fk", "thin") + L(x, 163 + i % 2 * 3, x, 176) + L(x, 176, x - 4, 186, "thin") + L(x, 176, x + 4, 186, "thin") +
      L(x, 168 + i % 2 * 3, x - 6, 160 + i % 2 * 3, "thin") + L(x, 168 + i % 2 * 3, x + 6, 160 + i % 2 * 3, "thin"));
    // the three sides, each with a drop of blood
    t.sides.forEach((side, i) => {
      const x = 60 + i * 100, w = side.length * 13 * .52 + 24;
      s += R(x - w / 2, 14, w, 28, "fk", "thin", 6) + T(x, 33, side, { size: 13, max: 90 }) + P(`M${x},46 q-6,9 0,13 q6,-4 0,-13 Z`, "fc", "thin");
    });
    return s + T(160, 208, t.caught, { c: "sm b", max: 300 });
  },
  wwHuman(lb) {
    const t = lb.book;
    let s = "";
    t.traits.forEach((row, r) => {
      const w = row.map(([word]) => word.length * 14 * .52 + 26), gap = 12;
      let x = 160 - (w.reduce((a, b) => a + b) + gap * (row.length - 1)) / 2;
      row.forEach(([word, good], i) => { s += R(x, 28 + r * 46, w[i], 30, good ? "fm" : "fc", "thin", 6) + T(x + w[i] / 2, 48 + r * 46, word, { size: 14, c: "on" }); x += w[i] + gap; });
    });
    return s + T(160, 196, t.tragedy, { c: "sm b", max: 300 });
  },
  wwPoland(lb) {
    const t = lb.book, cx = 120, cy = 100, r = 60;
    // a cake cut in two and pulled apart
    let s = P(`M${cx - 6},${cy - r} A${r},${r} 0 0 0 ${cx - 6},${cy + r} Z`, "fb") + P(`M${cx + 6},${cy - r} A${r},${r} 0 0 1 ${cx + 6},${cy + r} Z`, "fc");
    s += P(`M${cx - 6},${cy - r + 14} A${r - 14},${r - 14} 0 0 0 ${cx - 6},${cy + r - 14}`, "", "dash thin") + P(`M${cx + 6},${cy - r + 14} A${r - 14},${r - 14} 0 0 1 ${cx + 6},${cy + r - 14}`, "", "dash thin");
    s += A(cx - 40, cy + 74, cx - 70, cy + 74, "thin") + A(cx + 40, cy + 74, cx + 70, cy + 74, "thin");
    s += T(cx - 31, cy + 5, t.germany, { c: "b on", max: 36 }) + T(cx + 31, cy + 5, t.soviets, { c: "b on", max: 36 }) + T(cx, cy + 79, t.poland, { c: "b", max: 76 });
    // the promise that never came
    s += R(232, 46, 56, 38, "", "dash thin", 4) + P("M235,50 L260,68 L285,50", "", "dash thin") + T(260, 106, t.promise, { c: "sm", max: 100 }) + T(260, 146, t.unkept, { c: "sm b cor", max: 100 });
    return s + T(160, 206, t.cake, { c: "sm mut", max: 300 });
  },
  wwBombs(lb) {
    const t = lb.book;
    const house = (x, y) => R(x, y - 22, 26, 22, "fk", "thin", 2) + P(`M${x - 3},${y - 22} L${x + 13},${y - 36} L${x + 29},${y - 22} Z`, "fk", "thin");
    const flame = (x, y) => P(`M${x},${y} q-8,-10 -2,-20 q2,8 6,4 q-1,-10 6,-14 q-2,12 6,18 q2,8 -6,12 Z`, "fy", "thin");
    // a plane, its bombs falling on two towns
    let s = EL(160, 34, 34, 8, "fk") + P("M150,34 L134,52 L146,52 L170,34 Z", "fk", "thin") + P("M128,34 L120,20 L130,20 L140,32", "fk", "thin") + L(195, 26, 195, 42, "thin");
    s += P("M140,46 Q110,70 92,104", "", "dash thin") + P("M180,46 Q210,70 228,104", "", "dash thin");
    s += EL(106, 82, 4, 7, "fi") + EL(214, 82, 4, 7, "fi") + T(160, 66, t.alliedBombs, { c: "sm b halo", max: 120 });
    s += L(16, 148, 304, 148);
    s += house(40, 148) + house(74, 148) + house(108, 148) + flame(87, 110) + house(186, 148) + house(220, 148) + house(254, 148) + flame(233, 110);
    s += T(82, 168, t.french, { c: "sm b", max: 140 }) + T(240, 168, t.german, { c: "sm b", max: 140 });
    // not a "strategic target"
    const w = t.target.length * 12 * .52 + 24;
    return s + R(160 - w / 2, 192, w, 24, "", "dash thin", 6) + T(160, 208, t.target, { size: 12 }) + L(160 - w / 2 + 6, 204, 160 + w / 2 - 6, 204, "coral-s thin");
  },
  wwStalin(lb) {
    const t = lb.book;
    // a mushroom cloud stops the arrow that was meant to go on west
    let s = L(14, 166, 306, 166) + R(70, 82, 12, 84, "fy", "thin", 3) + EL(76, 164, 30, 7, "fy", "thin");
    s += C(60, 64, 16, "fy") + C(92, 64, 16, "fy") + C(76, 50, 20, "fy") + EL(76, 72, 30, 9, "fy");
    s += A(300, 122, 184, 122, "w3") + C(176, 122, 6, "fi") + T(176, 146, "Berlin", { c: "sm b" });
    s += A(166, 122, 108, 122, "dash") + T(100, 128, "×", { c: "b cor", size: 22 });
    s += T(242, 108, t.beatHitler, { c: "sm b", max: 110 }) + T(242, 142, t.redArmy, { c: "sm mut", max: 110 });
    s += T(138, 98, t.goOn, { c: "sm cor b", max: 64 });
    return s + T(82, 192, t.bombTest, { c: "sm b", max: 150 });
  },
  wwCellar(lb) {
    const t = lb.book;
    const burst = (cx, cy, r) => {
      let d = "";
      for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, rr = i % 2 ? r * .5 : r; d += `${i ? "L" : "M"}${f1(cx + rr * Math.cos(a))},${f1(cy + rr * Math.sin(a))} `; }
      return P(d + "Z", "fy", "thin");
    };
    let s = burst(80, 32, 20) + burst(236, 28, 16) + L(10, 58, 310, 58) + R(36, 70, 248, 124, "ft", "", 4);
    // cracks and falling plaster
    s += P("M112,70 L118,82 L110,90 L116,100", "", "thin") + P("M178,70 L172,80 L180,88", "", "thin");
    [[116, 110], [111, 122], [119, 134], [176, 98], [180, 112], [174, 126]].forEach(([x, y]) => s += C(x, y, 1.6, "fi"));
    // shaking walls
    [96, 116, 136].forEach(y => s += L(24, y, 30, y + 6, "thin") + L(290, y, 296, y + 6, "thin"));
    // a dead light bulb
    s += L(226, 70, 226, 84, "thin") + C(226, 92, 8, "fk", "thin") + T(226, 118, t.powerOut, { c: "sm", max: 80 });
    // someone sitting on the floor, hugging their knees
    s += C(146, 146, 8, "fk") + L(148, 154, 154, 182) + L(154, 182, 172, 164) + L(172, 164, 176, 184) + L(150, 162, 170, 168, "thin") + L(124, 186, 196, 186, "thin faint");
    s += T(76, 146, t.shaking, { c: "sm", max: 70 }) + T(248, 160, t.oxygen, { c: "sm", max: 64 });
    return s + T(160, 212, t.cellar, { c: "sm mut", max: 300 });
  },
  wwQuestions(lb) {
    const t = lb.book;
    let s = R(18, 30, 68, 100, "fb", "", 6) + L(30, 30, 30, 130, "thin") + T(58, 74, "WW II", { c: "b on", size: 15 }) + T(58, 96, "783", { c: "sm on" });
    t.questions.forEach((q, i) => s += R(100, 18 + i * 42, 208, 32, "fk", "thin", 6) + T(110, 39 + i * 42, q, { a: "start", size: 13, max: 164 }) + T(300, 40 + i * 42, "?", { a: "end", c: "b cor", size: 16 }));
    // a tiny map under a magnifying glass
    s += R(28, 146, 40, 28, "fm", "thin", 3) + P("M34,166 L44,154 L50,162 L62,152", "", "thin") + C(70, 166, 12, "", "thin") + L(79, 175, 86, 182, "w3");
    return s + T(56, 206, t.tinyMaps, { c: "sm b", max: 100 });
  },
  wwNames(lb) {
    const t = lb.book;
    let s = "";
    for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) s += C(30 + c * 13, 40 + r * 15, 4.5, "fi", "faint");
    s += T(69, 150, t.numbers, { c: "sm mut", max: 120 }) + A(130, 76, 166, 76, "w3");
    // three people, each one different
    s += fig(198, 132, "walk") + fig(240, 132, "walk") + fig(282, 132, "walk");
    s += P("M188,66 L208,66 M192,66 L194,58 L202,58 L204,66", "", "thin");
    s += P("M232,64 Q240,52 248,64", "", "w3") + P("M275,62 Q282,74 289,62", "", "thin");
    s += T(240, 150, t.people, { c: "sm b", max: 140 });
    return s + T(160, 194, t.duty, { c: "sm", max: 300 }) + T(160, 212, "— Vasily Grossman", { c: "sm mut" });
  },
};
