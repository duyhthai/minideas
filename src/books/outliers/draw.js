// Outliers: the drawings in its card stack and full review. lb.book holds the book's labels (book.js).
import { T, L, C, R, P, EL, A, pillW, pill, fig } from "../../draw.js";

export default {
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
    // the hard times, on two lines (broken at the "·" nearest the middle) when one line would have to shrink
    const parts = t.hardTimes.split(" · "), half = t.hardTimes.length / 2;
    let k = 1;
    for (let i = 1, run = parts[0].length; i < parts.length; run += 3 + parts[i++].length) if (Math.abs(run - half) < Math.abs(parts.slice(0, k).join(" · ").length - half)) k = i;
    const hard = t.hardTimes.length > 28 && parts.length > 1 ? `${parts.slice(0, k).join(" · ")}\n${parts.slice(k).join(" · ")}` : t.hardTimes;
    s += T((x(1914) + x(1945)) / 2, hard.includes("\n") ? 168 : 162, hard, { c: "sm cor b", max: 170 });
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
};
