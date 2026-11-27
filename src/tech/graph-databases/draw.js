// Graph databases: the drawings. Their labels are in en.js and vi.js, under `art`.
import { T, L, C, R, P, head, A, pillW, pill, codeChip } from "../../draw.js";

/* graphs: a node is a circle with its name inside (people blue, films yellow); a link is an arrow from rim to rim */
const G = { tom: "Tom\nHanks", tim: "Tim\nAllen", toy: "Toy\nStory", apollo: "Apollo\n13", kevin: "Kevin\nBacon" };
const CHAIN = [[42, 64, "fb", G.tim], [101, 148, "fy", G.toy], [160, 64, "fb", G.tom], [219, 148, "fy", G.apollo], [278, 64, "fb", G.kevin]];
const gNode = (x, y, r, fill, name, sz = 13) => C(x, y, r, fill) + T(x, y + sz * .35, name, { size: sz, max: r * 1.7, c: "on" });
function gLink(a, b, c = "") { // a, b: [x, y, r]
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), ux = Math.cos(ang), uy = Math.sin(ang);
  return A(a[0] + a[2] * ux, a[1] + a[2] * uy, b[0] - (b[2] + 2) * ux, b[1] - (b[2] + 2) * uy, c);
}

export default {
  /* graph databases: one running example, a small graph of actors and films */
  graphIntro(lb) {
    const n = CHAIN.map(([x, y]) => [x, y, 28]);
    return gLink(n[0], n[1]) + gLink(n[2], n[1]) + gLink(n[2], n[3]) + gLink(n[4], n[3]) +
      CHAIN.map(([x, y, f, s]) => gNode(x, y, 28, f, s)).join("") + T(160, 206, lb.graph.intro, { c: "b", max: 300 });
  },
  graphLabels(lb) {
    const t = lb.graph, tag = (x, y, s) => R(x - 32, y - 12, 64, 24, "ft", "thin", 6) + T(x, y + 5, s, { size: 13, max: 54 });
    const a = [60, 136, 34], b = [160, 136, 34], c = [260, 136, 34];
    return gLink(a, b) + gLink(b, c) + gNode(60, 136, 34, "fb", G.tom) + gNode(160, 136, 34, "fy", G.toy) + gNode(260, 136, 34, "fc", t.genre) +
      tag(60, 46, "Actor") + tag(60, 78, "Person") + tag(160, 78, "Movie") + tag(260, 78, "Genre") + T(160, 204, t.labelCap, { c: "b", max: 300 });
  },
  graphRel(lb) {
    const t = lb.graph;
    return gNode(62, 92, 36, "fb", G.tom, 14) + gNode(258, 92, 36, "fy", G.toy, 14) + A(100, 92, 220, 92, "w3") +
      T(160, 82, "ACTED_IN", { c: "b", size: 14 }) + L(160, 42, 160, 64, "thin dash") + T(160, 34, t.type, { c: "sm mut" }) +
      L(214, 102, 214, 114, "thin dash") + T(214, 128, t.dir, { c: "sm mut" }) +
      T(160, 170, t.sentence, { c: "b blu", max: 300 }) + T(160, 194, t.reads, { c: "sm mut", max: 300 });
  },
  graphProps(lb) {
    const t = lb.graph;
    const card = (x, y, w, lines) => R(x, y, w, 20 * lines.length + 12, "fk", "thin", 6) + lines.map((s, i) => T(x + 10, y + 22 + i * 20, s, { a: "start", size: 13, max: w - 16 })).join("");
    return gNode(56, 56, 30, "fb", G.tom) + gNode(264, 56, 30, "fy", G.toy) + A(88, 56, 232, 56) + T(160, 46, "ACTED_IN", { c: "b", size: 12 }) +
      L(160, 60, 160, 76, "thin dash") + card(108, 76, 104, ['role: "Woody"']) +
      L(56, 88, 56, 118, "thin dash") + card(6, 118, 128, ['name: "Tom Hanks"', "born: 1956"]) +
      L(264, 88, 264, 118, "thin dash") + card(186, 118, 128, ['title: "Toy Story"', "year: 1995"]) +
      T(160, 204, t.props, { c: "b", max: 300 });
  },
  graphTables(lb) {
    const t = lb.graph;
    const tbl = (x, y, w, head, rows) => T(x + w / 2, y - 7, head, { c: "sm b halo", max: w + 12 }) +
      rows.map((r, i) => R(x, y + i * 20, w, 20, "fk", "thin", 2) + T(x + 6, y + 14 + i * 20, r, { a: "start", size: 12, max: w - 10 })).join("");
    let s = L(160, 12, 160, 208, "dash thin faint");
    s += [[52, 130, 24, 74], [52, 150, 40, 74], [86, 130, 104, 54], [86, 150, 120, 54]].map(([x1, y1, x2, y2]) => L(x1, y1, x2, y2, "thin dash coral-s")).join("");
    s += tbl(8, 34, 62, t.people, ["1 Tom", "2 Tim"]) + tbl(86, 34, 66, t.films, ["7 Toy Story"]) + tbl(44, 120, 72, t.cast, ["1 · 7", "2 · 7"]);
    const tom = [204, 60, 24], tim = [204, 148, 24], toy = [282, 104, 26];
    s += gLink(tom, toy, "blue-s") + gLink(tim, toy, "blue-s") + gNode(...tom, "fb", G.tom, 12) + gNode(...tim, "fb", G.tim, 12) + gNode(...toy, "fy", G.toy, 12);
    return s + T(80, 194, t.match, { c: "b cor", max: 150 }) + T(240, 194, t.follow, { c: "b blu", max: 150 });
  },
  graphPattern(lb) {
    const t = lb.graph;
    let s = codeChip(54, 26, "(p:Person)", 96) + codeChip(160, 26, "-[:ACTED_IN]->", 108) + codeChip(266, 26, "(m:Movie)", 92);
    s += L(54, 40, 54, 66, "thin dash") + L(160, 40, 160, 86, "thin dash") + L(266, 40, 266, 64, "thin dash");
    s += C(54, 94, 26, "fb") + T(54, 102, "?", { c: "on b", size: 22 }) + A(82, 94, 234, 94) + gNode(266, 94, 28, "fy", G.toy);
    s += T(16, 146, t.found, { a: "start", c: "sm mut", max: 120 });
    let x = 16;
    for (const name of ["Tom Hanks", "Tim Allen", "Don Rickles", "…"]) {
      const w = pillW(name, 12);
      s += pill(x + w / 2, 170, name, "fb", { on: true, size: 12 });
      x += w + 8;
    }
    return s + T(160, 208, t.fits, { c: "b", max: 300 });
  },
  graphHops(lb) {
    const t = lb.graph, cx = 160, cy = 104;
    const pt = (r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];
    const films = [-90, 30, 150].map(d => pt(48, d)), stars = [-120, -60, 0, 60, 120, 180].map(d => pt(84, d));
    const more = [-155, -25, 20, 160].map(d => pt(122, d));
    let s = C(cx, cy, 48, "", "dash thin faint") + C(cx, cy, 84, "", "dash thin faint");
    s += films.map(p => L(cx, cy, ...p, "thin")).join("") + stars.map((p, i) => L(...films[Math.floor(i / 2)], ...p, "thin")).join("");
    s += more.map((p, i) => L(...stars[[5, 1, 2, 5][i]], ...p, "thin faint")).join("");
    s += more.map(([x, y]) => C(x, y, 7, "fy", "faint")).join("") + stars.map(([x, y]) => C(x, y, 9, "fb")).join("") + films.map(([x, y]) => C(x, y, 10, "fy")).join("");
    return s + gNode(cx, cy, 24, "fb", G.tim, 12) + codeChip(44, 22, "*1..4", 64) + T(160, 210, t.rings, { c: "b", max: 300 });
  },
  graphPath(lb) {
    const n = CHAIN.map(([x, y]) => [x, y, 28]);
    const extra = [[101, 22, 0, 2], [219, 22, 2, 4], [304, 150, 4], [16, 150, 0], [160, 184, 1, 3]];
    let s = extra.map(([x, y, ...to]) => to.map(i => L(x, y, n[i][0], n[i][1], "thin faint")).join("") + C(x, y, 8, "fy", "faint")).join("");
    s += gLink(n[0], n[1], "blue-s w3") + gLink(n[2], n[1], "blue-s w3") + gLink(n[2], n[3], "blue-s w3") + gLink(n[4], n[3], "blue-s w3");
    return s + CHAIN.map(([x, y, f, name]) => gNode(x, y, 28, f, name)).join("") + T(160, 212, lb.graph.fewest, { c: "b blu", max: 300 });
  },
  graphRecommend(lb) {
    const t = lb.graph;
    const you = [40, 150, 24], toy = [114, 62, 28], other = [196, 150, 24], up = [278, 62, 28];
    const step = (a, b, k) => { const x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2; return C(x, y, 10, "fk", "thin") + T(x, y + 5, k, { c: "b", size: 13 }); };
    return gLink(you, toy) + gLink(other, toy) + gLink(other, up) + C(278, 62, 37, "", "dash thin blue-s") +
      gNode(...you, "fm", t.you) + gNode(...toy, "fy", G.toy) + gNode(...other, "fm", t.other) + gNode(...up, "fy", "Up", 15) +
      step(you, toy, "1") + step(toy, other, "2") + step(other, up, "3") +
      T(278, 120, t.suggest, { c: "b blu", max: 84 }) + T(160, 208, t.walk, { c: "b", max: 300 });
  },
  graphMerge(lb) {
    const t = lb.graph;
    let s = L(160, 12, 160, 208, "dash thin faint");
    s += codeChip(80, 26, "CREATE", 84) + codeChip(240, 26, "MERGE", 84) + T(80, 58, t.twice, { c: "sm mut", max: 140 }) + T(240, 58, t.twice, { c: "sm mut", max: 140 });
    s += gNode(58, 104, 30, "fy", G.toy) + gNode(104, 122, 30, "fy", G.toy) + gNode(240, 112, 30, "fy", G.toy);
    s += P("M276,86 L282,93 L294,80", "", "blue-s w3");
    return s + T(80, 180, t.dup, { c: "b cor", max: 150 }) + T(80, 200, t.always, { c: "sm mut", max: 150 }) +
      T(240, 180, t.one, { c: "b blu", max: 150 }) + T(240, 200, t.ifMissing, { c: "sm mut", max: 150 });
  },
  graphIndex(lb) {
    const t = lb.graph;
    let s = L(160, 12, 160, 208, "dash thin faint") + P("M12,34 H140 V64 H12 V94 H140 V124 H110", "", "thin dash coral-s");
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) s += C(24 + c * 26, 34 + r * 30, 8, r === 3 && c === 3 ? "fb" : "fk", "thin");
    s += T(212, 30, t.idx, { c: "sm b", max: 80 }) + R(178, 40, 68, 88, "fk", "", 6) + R(182, 100, 60, 22, "fy", "thin", 4);
    s += ["Kevin B.", "Tim A.", "Tom H."].map((name, i) => T(188, 64 + i * 26, name, { a: "start", size: 12, max: 52, c: i === 2 ? "on b" : "" })).join("");
    s += A(246, 111, 268, 100, "blue-s") + gNode(292, 92, 22, "fb", G.tom, 11);
    return s + T(80, 168, t.scan, { c: "b cor", max: 150 }) + T(80, 188, t.scanSub, { c: "sm mut", max: 150 }) +
      T(240, 168, t.jump, { c: "b blu", max: 150 }) + T(240, 188, t.jumpSub, { c: "sm mut", max: 150 });
  },
  graphWhen(lb) {
    const t = lb.graph;
    let s = L(160, 12, 160, 208, "dash thin faint");
    const accts = [[22, 98], [80, 98], [138, 98]];
    s += accts.map(([x, y]) => L(x, y, 80, 44, "thin") + L(x, y, 80, 152, "thin")).join("");
    s += gNode(80, 44, 22, "fy", t.phone, 12) + gNode(80, 152, 22, "fy", t.addr, 12) + accts.map(([x, y], i) => gNode(x, y, 14, "fc", "ABC"[i], 13)).join("");
    s += R(186, 26, 108, 120, "fk", "", 6) + L(194, 118, 286, 118, "thin");
    t.months.forEach((m, i) => s += T(198, 52 + i * 24, m, { a: "start", size: 13 }) + T(282, 52 + i * 24, ["120", "95", "140"][i], { a: "end", size: 13 }));
    s += T(198, 136, t.total, { a: "start", c: "b", size: 13, max: 50 }) + T(282, 136, "355", { a: "end", c: "b", size: 13 });
    return s + T(80, 192, t.graphQ, { c: "b blu", max: 150 }) + T(80, 210, t.graphSub, { c: "sm mut", max: 150 }) +
      T(240, 192, t.tableQ, { c: "b", max: 150 }) + T(240, 210, t.tableSub, { c: "sm mut", max: 150 });
  },
};
