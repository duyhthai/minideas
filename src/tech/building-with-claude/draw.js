// Building with Claude: the drawings. Their labels are in en.js and vi.js, under `art`.
import { f1, T, L, C, R, P, head, A, pillW, pill, crPath, axes, env, codeChip, tick } from "../../draw.js";

// one line of an API request, shown under a drawing: the field that turns a feature on
const reqLine = (y, s) => R(10, y, 300, 24, "ft", "thin", 6) + T(20, y + 16, s, { a: "start", size: 11, max: 282 });

/* AI agents: a little robot, and the tools it reaches for */
// the antenna ends in a coral asterisk, a nod to the ✻ Claude Code shows in its terminal (not Anthropic's logo)
const spark8 = (x, y, r) => [0, 45, 90, 135].map(d => { const c = Math.cos(d * Math.PI / 180) * r, n = Math.sin(d * Math.PI / 180) * r; return L(x - c, y - n, x + c, y + n, "coral-s w3"); }).join("");
const bot = (x, y) => L(x, y - 18, x, y - 24) + spark8(x, y - 30, 6) + R(x - 22, y - 18, 44, 36, "fb", "", 10) +
  C(x - 8, y - 3, 3, "fi") + C(x + 8, y - 3, 3, "fi") + L(x - 6, y + 8, x + 6, y + 8, "thin");
// a small robot head, for "a call to Claude" inside a box
const miniBot = (x, y) => R(x - 9, y - 7, 18, 15, "fb", "thin", 4) + C(x - 3.5, y, 1.6, "fi") + C(x + 3.5, y, 1.6, "fi") + L(x, y - 7, x, y - 11, "thin") + C(x, y - 12, 1.8, "fc");
const ico = {
  search: (x, y) => C(x - 3, y - 3, 9, "ft") + L(x + 4, y + 4, x + 11, y + 11, "w3"),
  sheet: (x, y) => R(x - 14, y - 11, 28, 22, "fk", "thin", 3) + L(x - 14, y - 4, x + 14, y - 4, "thin") + L(x - 14, y + 3, x + 14, y + 3, "thin") + L(x - 4, y - 11, x - 4, y + 11, "thin"),
  calc: (x, y) => R(x - 10, y - 13, 20, 26, "fk", "thin", 4) + R(x - 6, y - 9, 12, 6, "ft", "thin", 1) + [[-4, 3], [4, 3], [-4, 9], [4, 9]].map(([dx, dy]) => C(x + dx, y + dy, 2, "fi")).join(""),
  mail: (x, y) => env(x - 14, y - 10, 28, 20),
  cal: (x, y) => R(x - 12, y - 11, 24, 22, "fk", "thin", 3) + R(x - 12, y - 11, 24, 7, "fc", "thin", 3) + [[-5, 3], [1, 3], [7, 3], [-5, 8]].map(([dx, dy]) => C(x + dx, y + dy, 1.5, "fi")).join(""),
};
// a fishing hook: eye at (x, y), shank, bend, point and barb
const fishHook = (x, y) => P(`M${x},${y + 3.5} V${y + 15} a6.5,6.5 0 0 1 -13,0 V${y + 8}`, "", "w3") + P(`M${x - 13},${y + 8} l3.5,4`, "", "w3") + C(x, y, 3.5, "fk", "w3");

export default {
  /* Building with Claude: the API, MCP and skills chapters; running example, a small shop's support assistant */
  apiRequest(lb) {
    const t = lb.api;
    let s = T(104, 14, t.request, { c: "sm b", max: 170 }) + R(14, 22, 180, 116, "fk", "", 8);
    ["model: …", "max_tokens: 1024", "messages:", `  user: “${t.ask}”`].forEach((l, i) => s += T(26, 48 + i * 24, l, { a: "start", size: 13, max: 162 }));
    s += A(198, 80, 236, 80, "thin") + bot(266, 84) + A(262, 106, 250, 146, "thin");
    s += T(16, 176, t.reply, { a: "start", c: "sm b", max: 74 }) + R(96, 152, 210, 40, "fb", "", 12) + T(108, 177, `“${t.answer}”`, { a: "start", c: "on", size: 13, max: 188 });
    return s;
  },
  apiMemory(lb) {
    const t = lb.api, seq = ["fb", "fm", "fb", "fm", "fb"];
    let s = "";
    [1, 3, 5].forEach((n, r) => {
      const y = 40 + r * 54;
      s += T(16, y + 5, t.reqs[r], { a: "start", c: "sm b mut", max: 70 });
      for (let i = 0; i < n; i++) {
        const x = 92 + i * 44, last = i === n - 1;
        s += R(x, y - 13, 40, 26, last ? "fy" : seq[i], last ? "" : "thin", 6) + T(x + 20, y + 5, i % 2 ? t.ai : t.you, { c: "on", size: 12, max: 34 });
      }
    });
    return s + T(160, 206, t.memCap, { c: "sm mut", max: 300 });
  },
  apiSystem(lb) {
    const t = lb.api;
    let s = T(16, 20, t.sysLabel, { a: "start", c: "sm b", max: 200 }) + R(14, 28, 292, 58, "fy", "", 8) + T(26, 57, t.sys, { a: "start", c: "on", size: 12.5, max: 272 });
    s += R(14, 100, 292, 86, "fk", "", 8) + A(160, 88, 160, 104, "thin");
    s += R(26, 112, 170, 26, "fb", "", 10) + T(38, 130, t.u1, { a: "start", c: "on", size: 12.5, max: 150 });
    s += R(124, 148, 170, 26, "fm", "", 10) + T(136, 166, t.a1, { a: "start", c: "on", size: 12.5, max: 150 });
    return s + T(160, 206, t.sysCap, { c: "sm mut", max: 300 });
  },
  apiTemp(lb) {
    const t = lb.api;
    let s = T(160, 22, t.temp, { c: "sm mut", max: 140 }) + L(40, 40, 280, 40, "w3") + T(28, 45, "0", { c: "b" }) + T(292, 45, "1", { c: "b" });
    s += C(56, 40, 8, "fb") + C(262, 40, 8, "fy") + L(56, 50, 56, 62, "dash thin") + L(262, 50, 262, 62, "dash thin");
    [0, 1, 2].forEach(i => s += R(16, 70 + i * 32, 128, 26, "fb", "thin", 8) + T(80, 88 + i * 32, t.same, { c: "on", size: 12.5, max: 116 }) +
      R(198, 70 + i * 32, 104, 26, "fy", "thin", 8) + T(250, 88 + i * 32, t.names[i], { c: "on", size: 13, max: 92 }));
    return s + T(80, 188, t.steady, { c: "b blu", max: 140 }) + T(80, 206, t.steadySub, { c: "sm mut", max: 150 }) +
      T(250, 188, t.varied, { c: "b", max: 130 }) + T(250, 206, t.variedSub, { c: "sm mut", max: 136 });
  },
  apiShape(lb) {
    const t = lb.api;
    let s = L(160, 12, 160, 208, "dash thin faint") + R(14, 36, 134, 92, "ft", "", 12);
    t.streamLines.forEach((l, i) => s += T(26, 58 + i * 22, l, { a: "start", size: 13, max: 112 }));
    // a text caret after the words written so far, then the next words still to come, faint
    const y = 58 + t.streamLines.length * 22;
    s += L(27, y - 12, 27, y + 3, "blue-s w3") + T(34, y, t.streamNext, { a: "start", size: 13, max: 104, c: "mut" });
    s += R(172, 36, 134, 92, "fk", "", 8);
    [["{", 0], ['"order": 418,', 1], ['"status": "shipped"', 1], ["}", 0]].forEach(([l, ind], i) => s += T(182 + ind * 12, 58 + i * 20, l, { a: "start", size: 12.5, max: 112 - ind * 12 }));
    return s + T(80, 160, t.stream, { c: "b", max: 140 }) + T(80, 180, t.streamSub, { c: "sm mut", max: 146 }) +
      T(240, 160, t.json, { c: "b blu", max: 146 }) + T(240, 180, t.jsonSub, { c: "sm mut", max: 146 });
  },
  evalOne(lb) {
    const t = lb.evals, fails = [3, 9, 14, 17];
    let s = L(160, 12, 160, 208, "dash thin faint") + R(16, 50, 128, 34, "ft", "", 10) + T(80, 72, t.q, { size: 13, max: 116 }) + tick(80, 112);
    for (let i = 0; i < 20; i++) s += R(180 + (i % 5) * 25, 30 + Math.floor(i / 5) * 25, 20, 20, fails.includes(i) ? "fc" : "fm", "thin", 4);
    return s + T(80, 168, t.oneTry, { c: "b", max: 140 }) + T(80, 188, t.oneSub, { c: "sm mut", max: 140 }) +
      T(240, 168, t.many, { c: "b blu", max: 140 }) + T(240, 188, t.manySub, { c: "sm mut", max: 140 });
  },
  evalSet(lb) {
    const t = lb.evals, tagFill = ["", "fc", "fb", "fy", "ft"];
    // Claude drafts a stack of questions; you read them, keep the good ones and strike a duplicate
    let s = bot(46, 52);
    for (let i = 2; i >= 0; i--) s += R(16 + i * 5, 92 + i * 6, 56, 40, "fk", "thin", 4) + [0, 1, 2].map(j => L(24 + i * 5, 104 + i * 6 + j * 9, 64 + i * 5 - (j % 2) * 10, 104 + i * 6 + j * 9, "thin faint")).join("");
    s += T(46, 168, t.drafts, { c: "sm mut", size: 11.5, max: 84 }) + A(88, 114, 100, 114, "thin", 7);
    s += R(104, 6, 208, 174, "fk", "", 8) + R(104, 6, 208, 22, "ft", "", 8) + T(208, 22, t.sheet, { c: "sm b", max: 196 });
    t.cases.forEach((c, i) => {
      const y = 48 + i * 30, drop = i === 4, tag = t.tags[i], w = tag ? tag.length * 6 + 16 : 0, room = 306 - (w ? w + 6 : 0) - 132;
      s += R(112, y - 9, 14, 14, "fk", "thin", 3) + (drop ? L(115, y - 6, 123, y + 2, "coral-s w3") + L(123, y - 6, 115, y + 2, "coral-s w3") : P(`M114,${y - 1} l3,4 l7,-8`, "", "blue-s w3"));
      s += T(132, y + 4, c, { a: "start", size: 12, max: room, c: drop ? "mut" : "" }) + (drop ? L(130, y, 132 + Math.min(room, c.length * 5.8), y, "coral-s") : "");
      if (tag) s += R(306 - w, y - 9, w, 16, tagFill[i], "", 8) + T(306 - w / 2, y + 3, tag, { c: drop ? "mut" : "on", size: 10.5 });
    });
    return s + T(160, 206, t.setCap, { c: "sm b", max: 300 });
  },
  evalGrade(lb) {
    const t = lb.evals;
    let s = T(69, 58, t.answerLabel, { c: "sm b", max: 110 }) + R(14, 66, 110, 74, "fb", "", 10) + T(24, 103, t.answer, { a: "start", c: "on", size: 12.5, max: 92 });
    s += A(128, 88, 148, 58, "thin") + A(128, 118, 148, 146, "thin");
    s += R(152, 14, 154, 70, "fk", "", 8) + T(229, 34, t.byCode, { c: "sm b", max: 140 });
    t.codeChecks.forEach((c, i) => s += tick(170, 52 + i * 20) + T(186, 57 + i * 20, c, { a: "start", size: 12.5, max: 112 }));
    s += T(229, 108, t.byModel, { c: "sm b", max: 140 }) + bot(176, 150) + R(206, 118, 100, 62, "fy", "", 10) + T(256, 138, t.score, { c: "on b", size: 16 }) + T(256, 162, t.why, { c: "on", size: 12, max: 90 });
    return s + T(160, 208, t.gradeCap, { c: "sm mut", max: 300 });
  },
  evalLoop(lb) {
    const t = lb.evals, vals = [6.1, 7.4, 6.9];
    let s = axes(40, 186, 302, 36) + T(46, 26, t.avg, { a: "start", c: "sm mut", max: 200 });
    vals.forEach((v, i) => {
      const x = 90 + i * 80, h = v * 14;
      s += R(x - 24, 186 - h, 48, h, i === 1 ? "fm" : "fk", "thin", 4) + T(x, 180 - h, String(v).replace(".", t.dec), { c: `sm b ${i === 1 ? "blu" : ""}` }) + T(x, 204, `v${i + 1}`, { c: "sm mut" });
    });
    return s + T(170, 50, t.kept, { c: "sm b blu", max: 120 });
  },
  toolSchema(lb) {
    const t = lb.tools, sz = 10.5, cw = 5.15; // code font size and its width per character
    // a line of code from [text, style] pieces: "key" is bold blue, "name" is ink on a mint highlight
    const code = (x, y, parts) => parts.map(([txt, k]) => {
      const pad = k === "name" ? 3 : 0, w = txt.length * cw * (k === "key" ? 1.18 : 1) + pad * 2;
      const out = (pad ? R(x, y - 10.5, w, 14, "fm", "", 3) : "") + T(x + pad, y, txt, { a: "start", size: sz, c: k === "key" ? "b blu" : k === "name" ? "on" : "" });
      x += w + (pad ? 1 : 0); return out;
    }).join("");
    // the function stays in your code; only its description travels in the request, next to the messages
    let s = R(8, 26, 112, 78, "fk", "", 8) + T(64, 18, t.yourCode, { c: "sm b", max: 110 });
    s += code(16, 48, [["def "], ["get_order_status", "name"]]) + T(28, 64, "(order_id):", { a: "start", size: sz }) + T(28, 86, t.lookup, { a: "start", c: "mut", size: sz, max: 88 });
    s += A(122, 62, 142, 62, "thin", 7) + R(146, 26, 166, 152, "fk", "", 8) + T(229, 18, t.reqTitle, { c: "sm b", max: 164 }) + R(150, 76, 158, 36, "fy", "", 4);
    s += code(156, 46, [["tools", "key"], [": [{"]]) + code(164, 65, [["name: \""], ["get_order_status", "name"], ["\","]]);
    s += T(164, 84, "description:", { a: "start", size: sz, c: "on" }) + T(172, 103, `"${t.descShort}"`, { a: "start", size: sz, max: 132, c: "on" });
    s += T(164, 122, "input_schema: {order_id: int}", { a: "start", size: sz, max: 140 }) + T(156, 141, "}],", { a: "start", size: sz }) + code(156, 162, [["messages", "key"], [": [ … ]"]]);
    return s + T(64, 136, t.stays, { c: "sm mut", max: 120 }) + T(160, 202, t.schemaCap, { c: "sm b", max: 300 });
  },
  toolBuiltIn(lb) {
    const t = lb.tools;
    let s = T(84, 22, t.byAnthropic, { c: "sm b", max: 136 }) + R(14, 30, 140, 140, "ft", "dash thin", 10);
    s += ico.search(44, 68) + T(66, 73, t.web, { a: "start", size: 13, max: 82 });
    s += R(30, 112, 30, 24, "fk", "thin", 4) + T(45, 129, ">_", { c: "sm b" }) + T(66, 129, t.codeExec, { a: "start", size: 13, max: 82 });
    s += T(236, 22, t.byYou, { c: "sm b", max: 136 }) + R(166, 30, 140, 140, "ft", "dash thin", 10);
    s += R(198, 56, 52, 66, "fk", "thin", 4) + [0, 1, 2, 3].map(i => L(207, 70 + i * 12, 241 - (i % 2) * 12, 70 + i * 12, "thin")).join("");
    s += P("M246,104 L266,84 L274,92 L254,112 Z", "fy", "thin") + P("M246,104 L242,116 L254,112", "fk", "thin") + T(236, 148, t.editor, { size: 13, max: 126 });
    return s + T(160, 200, t.builtCap, { c: "sm mut", max: 300 });
  },
  toolEditor(lb) {
    const t = lb.tools, num = (x, y, n) => C(x, y, 9, "fy", "thin") + T(x, y + 4.5, n, { c: "on b", size: 12 });
    // 1. you declare it by type; 2. Claude asks for a command; 3. your code does it to the file
    let s = R(10, 8, 300, 46, "fk", "", 8) + T(26, 25, t.edReq, { a: "start", c: "sm mut", size: 11, max: 270 });
    s += T(26, 44, 'tools: [{ type: "text_editor_20250728" }]', { a: "start", size: 11.5, max: 270 });
    s += R(10, 62, 300, 80, "fb", "", 8) + T(26, 79, t.edAsks, { a: "start", c: "sm on", size: 11, max: 270 });
    [['command: "str_replace", path: "cart.js",', 96], ['old_str: "total - discount - discount"', 113], ['new_str: "total - discount"', 130]].forEach(([l, y]) =>
      s += T(26, y, l, { a: "start", c: "on", size: 11.5, max: 276 }));
    s += R(10, 150, 300, 36, "fk", "", 8) + T(26, 172, t.edRuns, { a: "start", size: 12, max: 220 }) + pill(274, 168, t.edDone, "fm", { on: true, size: 11.5 });
    return s + num(12, 12, "1") + num(12, 66, "2") + num(12, 154, "3") + T(160, 208, t.edCap, { c: "sm mut", max: 300 });
  },
  ragChunk(lb) {
    const t = lb.rag;
    let s = R(16, 14, 72, 172, "fk", "", 6);
    for (let i = 0; i < 13; i++) s += L(26, 28 + i * 12, 78 - (i * 7 % 20), 28 + i * 12, "thin");
    s += T(52, 206, t.pages, { c: "sm mut", max: 90 }) + A(96, 100, 120, 100, "thin");
    [[128, 14], [220, 14], [128, 104], [220, 104]].forEach(([x, y], i) => {
      s += R(x, y, 84, 76, "fk", "thin", 6) + C(x + 84, y + 2, 8, "fm", "thin") + T(x + 84, y + 6, String(i + 1), { c: "on b", size: 10 });
      for (let j = 0; j < 4; j++) {
        const ly = y + 18 + j * 15, over = (j === 0 && i > 0) || (j === 3 && i < 3);
        if (over) s += R(x + 6, ly - 6, 72, 12, "fy", "", 3);
        s += L(x + 10, ly, x + 74 - (j % 2) * 14, ly, "thin");
      }
    });
    return s + T(216, 206, t.chunkCap, { c: "sm mut", max: 190 });
  },
  ragTwoSearch(lb) {
    const t = lb.rag;
    let s = R(60, 10, 200, 28, "fy", "", 10) + T(160, 29, t.question, { c: "on", size: 13, max: 186 }) + A(130, 40, 86, 62, "thin") + A(190, 40, 234, 62, "thin");
    s += T(80, 80, t.meaning, { c: "sm b blu", max: 130 }) + T(80, 96, t.meaningSub, { c: "sm mut", max: 130 }) + R(14, 106, 132, 28, "fm", "", 8) + T(80, 125, t.found1, { c: "on", size: 12.5, max: 120 });
    s += T(240, 80, t.words, { c: "sm b", max: 130 }) + T(240, 96, "(BM25)", { c: "sm mut" }) + R(174, 106, 132, 28, "fy", "", 8) + T(240, 125, t.found2, { c: "on", size: 12.5, max: 120 });
    return s + A(84, 138, 132, 166, "thin") + A(236, 138, 188, 166, "thin") + R(96, 168, 128, 32, "fb", "", 10) + T(160, 189, t.merged, { c: "on b", size: 14, max: 116 });
  },
  ragContext(lb) {
    const t = lb.rag;
    // in the document the line sits under its heading; cut out, it loses it; Claude adds it back
    let s = T(80, 14, t.inDoc, { c: "sm mut", size: 11, max: 140 }) + R(8, 20, 144, 54, "fk", "", 8) + T(16, 40, t.heading, { a: "start", c: "b", size: 11.5, max: 118 }) + T(16, 60, t.bare, { a: "start", size: 11, max: 130 });
    s += A(156, 47, 170, 47, "thin", 6) + T(240, 14, t.cutOut, { c: "sm mut", size: 11, max: 140 }) + R(174, 30, 138, 34, "fk", "coral-s dash", 8) + T(182, 51, t.bare, { a: "start", size: 11, max: 124 });
    s += T(243, 80, t.whatIt, { c: "sm b cor", max: 140 });
    s += A(243, 88, 243, 104, "thin", 6) + T(236, 98, t.addLine, { a: "end", c: "sm mut", size: 11, max: 150 });
    s += R(64, 108, 248, 58, "fk", "", 8) + R(64, 108, 248, 24, "fy", "", 8) + T(74, 125, t.ctx, { a: "start", c: "on b", size: 11.5, max: 230 }) + T(74, 152, t.bare, { a: "start", size: 11.5, max: 230 });
    s += tick(34, 120) + T(34, 150, t.findable, { c: "sm b blu", size: 11, max: 56 });
    return s + T(160, 196, t.ctxCap, { c: "sm mut", max: 300 });
  },
  ragFlow(lb) {
    const t = lb.rag;
    // question → search → the best chunks (numbered like the chunks in the first card) → Claude → an answer citing them
    let s = R(8, 22, 98, 42, "fy", "", 10) + T(57, 43, t.q, { c: "on", size: 11.5, max: 88, lh: 1.15 }) + A(110, 43, 124, 43, "thin", 6);
    s += pill(156, 43, t.search, "fb", { on: true, size: 12, w: 58 }) + A(187, 43, 202, 43, "thin", 6);
    s += T(258, 12, t.top, { c: "sm b", size: 11.5, max: 108 });
    t.chunks.forEach((c, i) => {
      const y = 20 + i * 28;
      s += R(206, y, 100, 22, "fk", "thin", 4) + L(212, y + 17, 296 - (i % 2) * 14, y + 17, "thin faint") + T(214, y + 12, c, { a: "start", size: 10.5, max: 80 }) +
        C(306, y + 2, 8, "fm", "thin") + T(306, y + 6, String(i + 1), { c: "on b", size: 10 });
    });
    s += A(252, 106, 222, 132, "thin") + bot(200, 152) + A(174, 150, 158, 150, "thin", 7);
    s += R(8, 112, 146, 70, "fm", "", 10) + T(18, 147, t.answer, { a: "start", c: "on", size: 11.5, max: 130, lh: 1.2 });
    return s + T(160, 206, t.flowCap, { c: "sm mut", max: 300 });
  },
  featThink(lb) {
    const t = lb.feat;
    let s = R(12, 40, 96, 56, "ft", "", 10) + T(60, 68, t.hardQ, { size: 13, max: 84 }) + A(112, 68, 128, 68, "thin");
    s += R(132, 16, 104, 112, "fk", "dash thin", 8) + T(184, 36, t.thinking, { c: "sm b mut", max: 92 });
    for (let i = 0; i < 5; i++) s += P(`M${144},${54 + i * 14} q8,-6 14,0 t14,0 t14,0 t14,0 t${i % 2 ? 10 : 14},0`, "", "thin faint");
    s += A(240, 68, 256, 68, "thin") + pill(284, 68, t.ans, "fm", { on: true, size: 14, w: 52 });
    return s + reqLine(146, 'thinking: {type: "adaptive"}, output_config: {effort: "high"}') + T(160, 196, t.thinkCap, { c: "sm b", max: 300 });
  },
  featFiles(lb) {
    const t = lb.feat;
    // a screenshot: a small window showing an error, and a PDF report
    let s = R(20, 14, 104, 72, "fk", "", 6) + R(20, 14, 104, 14, "ft", "thin", 6) + [30, 38, 46].map(x => C(x, 21, 2.2, "ft", "thin")).join("") +
      R(30, 38, 84, 18, "fc", "", 4) + T(72, 51, "Error E-1042", { c: "on b", size: 10.5 }) + L(32, 66, 104, 66, "thin faint") + L(32, 75, 90, 75, "thin faint");
    s += R(200, 14, 64, 84, "fk", "", 4) + [0, 1, 2, 3, 4].map(i => L(210, 44 + i * 10, 254 - (i % 2) * 14, 44 + i * 10, "thin")).join("") + R(200, 14, 36, 18, "fc", "", 4) + T(218, 27, "PDF", { c: "on b", size: 11 });
    s += T(72, 104, t.photo, { c: "sm mut", max: 120 }) + T(300, 116, t.pdf, { a: "end", c: "sm mut", max: 110 });
    s += A(110, 112, 138, 126, "thin", 7) + A(214, 112, 184, 126, "thin", 7) + bot(160, 140);
    return s + reqLine(166, 'content: [{type: "image", …}, {type: "document", …}]') + T(160, 210, t.filesCap, { c: "sm mut", max: 300 });
  },
  featCite(lb) {
    const t = lb.feat;
    let s = R(14, 12, 150, 110, "fb", "", 10);
    t.citeAns.forEach((l, i) => s += T(24, 36 + i * 24, l, { a: "start", c: "on", size: 12.5, max: 132 }));
    s += R(190, 8, 116, 134, "fk", "", 6);
    for (let i = 0; i < 8; i++) {
      const y = 22 + i * 15, hl = i === 2 || i === 5;
      if (hl) s += R(196, y - 6, 104, 12, "fy", "", 3);
      s += L(202, y, 294 - (i % 3) * 12, y, "thin");
    }
    s += L(150, 60, 194, 52, "dash thin blue-s") + L(150, 108, 194, 97, "dash thin blue-s");
    return s + reqLine(152, '{type: "document", …, citations: {enabled: true}}') + T(160, 202, t.citeCap, { c: "sm mut", max: 300 });
  },
  featCache(lb) {
    const t = lb.feat;
    let s = "";
    [0, 1, 2].forEach(r => {
      const y = 26 + r * 46;
      s += T(18, y + 15, String(r + 1), { c: "sm b mut" }) + R(34, y, 186, 22, "fy", r ? "dash" : "", 6) + T(127, y + 15, t.policy, { c: "on", size: 12.5, max: 170 }) +
        R(226, y, 80, 22, "fb", "", 6) + T(266, y + 15, t.question, { c: "on", size: 12.5, max: 70 }) +
        T(36, y - 11, r ? t.reused : t.stored, { a: "start", c: `sm b ${r ? "blu" : "mut"}`, size: 11, max: 184 });
    });
    return s + reqLine(162, '{type: "text", text: manual, cache_control: {type: "ephemeral"}}') + T(160, 206, t.cacheCap, { c: "sm mut", max: 300 });
  },
  wfChain(lb) {
    const t = lb.wf;
    // three calls to Claude in a row; each output is the next one's input, and your code checks it in between
    let s = "";
    t.chain.forEach((c, i) => {
      const y = 12 + i * 60;
      s += R(28, y, 150, 34, ["fb", "fm", "fy"][i], "", 10) + miniBot(46, y + 18) + T(62, y + 22, c, { a: "start", c: "on b", size: 13, max: 110 });
      if (i < 2) s += A(103, y + 36, 103, y + 58, "thin", 7) + T(114, y + 51, t.passed[i], { a: "start", c: "sm", size: 11.5, max: 90 }) + tick(212, y + 46) + T(226, y + 51, t.checked, { a: "start", c: "sm mut", size: 11, max: 84 });
    });
    return s + T(160, 210, t.chainCap, { c: "sm b", max: 300 });
  },
  wfRoute(lb) {
    const t = lb.wf;
    let s = env(12, 86, 52, 36) + A(70, 104, 98, 104, "thin") + R(102, 80, 80, 48, "fy", "", 10) + T(142, 109, t.sort, { c: "on b", max: 70 });
    [42, 104, 166].forEach((y, i) => s += A(186, 104, 200, y + (1 - i) * -2, "thin") + R(206, y - 16, 100, 32, ["fb", "fm", "fc"][i], "", 10) + T(256, y + 5, t.routes[i], { c: "on b", size: 13, max: 88 }));
    return s + T(160, 208, t.routeCap, { c: "sm mut", max: 300 });
  },
  wfParallel(lb) {
    const t = lb.wf;
    let s = R(136, 6, 48, 52, "fk", "", 4) + [0, 1, 2].map(i => L(144, 20 + i * 11, 176 - (i % 2) * 10, 20 + i * 11, "thin")).join("");
    [60, 160, 260].forEach((x, i) => s += A(160, 62, x, 78, "thin") + bot(x, 110) + T(x, 146, t.checks[i], { c: "sm b", max: 96 }) + A(x, 154, 160 + (x - 160) * .4, 174, "thin"));
    return s + pill(160, 192, t.combined, "fm", { on: true, size: 13 });
  },
  mcpAdd(lb) {
    const t = lb.mcp;
    let s = R(10, 8, 300, 76, "fk", "", 8);
    s += T(20, 28, "$ claude mcp add --transport http github \\", { a: "start", size: 12, max: 284 }) + T(34, 46, "https://api.githubcopilot.com/mcp/", { a: "start", size: 12, max: 270 });
    s += tick(26, 64) + T(40, 69, "Added HTTP MCP server github", { a: "start", c: "sm mut", size: 11.5, max: 260 });
    s += R(10, 94, 300, 90, "fk", "", 8) + codeChip(44, 112, "/mcp", 56) + T(82, 117, t.panel, { a: "start", c: "sm mut", max: 220 });
    s += C(26, 142, 5, "fm") + T(38, 147, "github", { a: "start", c: "b", size: 13 }) + T(296, 147, "connected", { a: "end", c: "sm b blu", size: 12 });
    s += C(26, 168, 5, "fy") + T(38, 173, "notion", { a: "start", c: "b", size: 13 }) + T(296, 173, t.needsAuth, { a: "end", c: "sm b cor", size: 12, max: 196 });
    return s + T(160, 208, t.addCap, { c: "sm mut", max: 300 });
  },
  mcpClientServer(lb) {
    const t = lb.mcp;
    let s = T(160, 26, t.csCap, { c: "sm b", max: 300 }) + bot(36, 96) + T(36, 136, "Claude", { c: "sm b" }) + A(62, 92, 86, 92, "thin");
    s += R(90, 64, 100, 58, "fb", "", 10) + T(140, 88, t.app, { c: "on b", size: 13, max: 90 }) + T(140, 108, "MCP client", { c: "on", size: 12 });
    s += A(194, 92, 212, 92, "thin") + R(216, 64, 90, 58, "fy", "", 10) + T(261, 88, "MCP server", { c: "on b", size: 13, max: 80 }) + T(261, 108, t.wraps, { c: "on", size: 12, max: 80 });
    return s + L(261, 124, 261, 148, "thin") + ico.sheet(261, 162) + T(261, 194, t.orders, { c: "sm mut", max: 110 });
  },
  mcpBuild(lb) {
    const t = lb.mcp, sz = 11.5, cw = 5.9; // code font size, and its width per character
    const num = (x, y, n) => C(x, y, 9, "fy", "thin") + T(x, y + 4.5, n, { c: "on b", size: 12 });
    // a line of code from [text, highlight] pieces; highlighted pieces are dark ink on their colour
    const code = (x, y, parts) => parts.map(([txt, fill]) => {
      const w = txt.length * cw + (fill ? 4 : 0), out = (fill ? R(x - 1, y - 12, w, 16, fill, "", 3) : "") + T(x + (fill ? 2 : 0), y, txt, { a: "start", size: sz, c: fill ? "on" : "" });
      x += fill ? 2 : 0;
      x += w; return out;
    }).join("");
    // 1. write: the name, docstring and type hint become the schema's name, description and input
    let s = R(10, 8, 206, 90, "fk", "", 8) + T(28, 26, "server.py", { a: "start", c: "sm mut", size: 11 });
    s += T(28, 44, "@mcp.tool()", { a: "start", c: "b blu", size: sz });
    s += code(28, 62, [["def "], ["get_order", "fy"], ["("], ["order_id: int", "fm"], ["):"]]);
    s += code(42, 82, [[`"""${t.doc}"""`, "fb"]]);
    s += A(218, 53, 228, 53, "thin", 6) + R(230, 8, 80, 90, "ft", "dash thin", 8) + T(270, 26, t.schema, { c: "sm b", max: 70 });
    [["name", "fy"], ["description", "fb"], ["input", "fm"]].forEach(([f, fill], i) => s += R(236, 36 + i * 20, 68, 16, fill, "", 4) + T(270, 48 + i * 20, f, { c: "on", size: 11.5, max: 62 }));
    // 2. test
    s += R(10, 110, 300, 34, "fk", "", 8) + [30, 40, 50].map(x => C(x, 127, 3, "ft", "thin")).join("") + T(64, 132, "MCP Inspector", { a: "start", c: "sm b" }) + pill(250, 127, t.run, "fm", { on: true, size: 12, w: 96, h: 22 });
    // 3. connect
    s += R(10, 156, 300, 30, "fk", "", 8) + T(28, 176, "$ claude mcp add shop -- python server.py", { a: "start", size: 12, max: 274 });
    s += num(12, 12, "1") + num(12, 114, "2") + num(12, 160, "3");
    return s + T(160, 208, t.inspCap, { c: "sm mut", max: 300 });
  },
  mcpThree(lb) {
    const t = lb.mcp, examples = ["get_order(418)", "@shop:docs://\nhandbook", "/shop:format"];
    let s = R(80, 4, 160, 22, "fk", "", 8) + T(160, 20, t.serverHead, { c: "sm b", max: 150 });
    [56, 160, 264].forEach((x, i) => {
      s += L(160, 26, x, 38, "thin") + pill(x, 50, t.kinds[i], ["fb", "fm", "fy"][i], { on: true, size: 14, w: 96 }) + T(x, 136, t.by[i], { c: "b", size: 13.5, max: 94 }) + T(x, 152, t.what[i], { c: "sm mut", max: 96 });
      s += R(x - 48, 164, 96, 38, "ft", "thin", 6) + T(x, 187, examples[i], { size: 11.5, max: 86, lh: 1.15 });
    });
    s += bot(56, 104) + R(136, 80, 48, 38, "fk", "", 4) + L(136, 90, 184, 90, "thin") + L(144, 102, 176, 102, "thin faint") + L(144, 110, 168, 110, "thin faint");
    return s + C(264, 86, 9, "fk") + P("M250,120 Q250,98 264,98 Q278,98 278,120 Z", "fk");
  },
  mcpResources(lb) {
    const t = lb.mcp;
    let s = R(10, 8, 300, 78, "fk", "", 8) + T(22, 24, "server.py", { a: "start", c: "sm mut", size: 11 });
    s += T(22, 44, '@mcp.resource("docs://handbook")', { a: "start", c: "b blu", size: 12, max: 280 }) + T(22, 61, "def handbook():", { a: "start", size: 12 }) + T(38, 78, 'return read("handbook.md")', { a: "start", size: 12 });
    s += A(160, 90, 160, 104, "thin", 7) + R(10, 108, 300, 32, "ft", "", 10) + T(22, 129, t.typed, { a: "start", size: 13, max: 280 });
    return s + T(160, 172, t.added, { c: "sm b blu", max: 300 });
  },
  mcpPrompts(lb) {
    const t = lb.mcp;
    let s = R(10, 8, 300, 78, "fk", "", 8) + T(22, 24, "server.py", { a: "start", c: "sm mut", size: 11 });
    s += T(22, 44, "@mcp.prompt()", { a: "start", c: "b blu", size: 12 }) + T(22, 61, "def format(document):", { a: "start", size: 12 }) + T(38, 78, `return f"${t.promptRet}"`, { a: "start", size: 12, max: 264 });
    s += A(80, 90, 80, 104, "thin", 7) + R(10, 108, 140, 62, "fk", "", 8) + R(14, 112, 132, 24, "fy", "", 4);
    s += T(22, 129, "/shop:format", { a: "start", c: "on b", size: 13 }) + T(22, 158, "/shop:summarize", { a: "start", c: "mut", size: 13 });
    s += A(154, 124, 170, 124, "thin", 7) + R(174, 110, 136, 30, "ft", "dash thin", 6) + T(242, 130, t.fill, { size: 12.5, max: 124 });
    return s + T(160, 200, t.promptCap, { c: "sm mut", max: 300 });
  },
  ccReview(lb) {
    const t = lb.agent;
    let s = R(14, 14, 196, 180, "fk", "", 8) + R(14, 14, 196, 28, "ft", "", 8) + T(24, 33, t.prTitle, { a: "start", c: "sm b", max: 180 });
    [["", 62], ["-", 86], ["+", 110], ["+", 134], ["", 158]].forEach(([k, y]) => {
      if (k) s += R(20, y - 12, 184, 20, k === "+" ? "fm" : "fc", "", 3) + T(28, y + 3, k, { c: "sm b on" });
      s += L(42, y - 2, 180 - (y % 3) * 14, y - 2, "thin");
    });
    // the comment is Claude's: a speech bubble whose tail points up at the robot, and an arrow to the line it's about
    s += bot(270, 40) + R(218, 82, 92, 70, "fy", "", 10) + P("M252,86 L268,62 L278,86", "fy") + T(264, 117, t.comment, { c: "on", size: 12.5, max: 82 });
    s += A(218, 112, 206, 112, "thin", 7);
    return s + T(160, 212, t.reviewCap, { c: "sm mut", max: 300 });
  },
  skillFile(lb) {
    const t = lb.skill;
    let s = R(28, 10, 264, 182, "fk", "", 8) + R(28, 10, 264, 26, "ft", "", 8) + T(40, 28, "release/SKILL.md", { a: "start", c: "sm b" }) + R(36, 86, 248, 24, "fy", "", 4);
    ["---", "name: release", `description: ${t.desc}`, "---", `1. ${t.s1}`, `2. ${t.s2}`, "…"].forEach((l, i) =>
      s += T(44, 58 + i * 22 + (i > 3 ? 6 : 0), l, { a: "start", size: 12.5, max: 236, c: i === 0 || i === 3 ? "mut" : i === 2 ? "on" : "" }));
    return s + T(160, 210, t.fileCap, { c: "sm mut", max: 300 });
  },
  ccInstall(lb) {
    const t = lb.agent;
    let s = R(10, 10, 300, 172, "fk", "", 10) + R(10, 10, 300, 24, "ft", "", 10) + L(10, 34, 310, 34, "thin");
    s += C(26, 22, 4.5, "fc", "thin") + C(40, 22, 4.5, "fy", "thin") + C(54, 22, 4.5, "fm", "thin") + T(160, 27, t.terminal, { c: "sm b mut", size: 12 });
    s += T(22, 52, "# " + t.macLinux, { a: "start", c: "sm mut", size: 12, max: 276 }) + T(22, 70, "curl -fsSL https://claude.ai/install.sh | bash", { a: "start", c: "b", size: 12.5, max: 280 });
    s += T(22, 92, "# " + t.windows, { a: "start", c: "sm mut", size: 12, max: 276 }) + T(22, 110, "irm https://claude.ai/install.ps1 | iex", { a: "start", c: "b", size: 12.5, max: 280 });
    s += L(22, 124, 298, 124, "thin faint dash") + T(22, 146, "cd my-shop", { a: "start", size: 13 }) + T(22, 168, "claude", { a: "start", c: "b blu", size: 14 });
    s += A(80, 164, 112, 164, "thin") + R(118, 150, 180, 26, "fy", "", 8) + T(208, 168, t.signIn, { c: "on", size: 12.5, max: 168 });
    return s + T(160, 204, t.installCap, { c: "sm mut", max: 300 });
  },
  ccVSCode(lb) {
    const t = lb.agent;
    const spark = (x, y, r) => P(`M${x},${y - r} Q${x},${y} ${x + r},${y} Q${x},${y} ${x},${y + r} Q${x},${y} ${x - r},${y} Q${x},${y} ${x},${y - r} Z`, "fc", "thin");
    let s = R(8, 8, 304, 176, "fk", "", 8) + R(8, 8, 304, 20, "ft", "", 8) + L(8, 28, 312, 28, "thin") + C(20, 18, 3.5, "fc", "thin") + C(31, 18, 3.5, "fy", "thin") + C(42, 18, 3.5, "fm", "thin");
    s += T(160, 23, "cart.js", { c: "sm mut", size: 11 }) + R(8, 28, 22, 156, "ft", "thin", 0) + [44, 66, 88].map(y => R(13, y - 6, 12, 12, "fk", "thin", 2)).join("") + spark(19, 112, 7);
    s += R(36, 60, 150, 30, "fy", "", 3);
    for (let i = 0; i < 9; i++) {
      const y = 42 + i * 14;
      if (i === 5) s += R(36, y - 7, 150, 13, "fc", "", 2) + T(41, y + 4, "−", { c: "sm b on", size: 11 });
      if (i === 6) s += R(36, y - 7, 150, 13, "fm", "", 2) + T(41, y + 4, "+", { c: "sm b on", size: 11 });
      s += L(52, y, 176 - (i * 23 % 70), y, "thin");
    }
    s += R(104, 160, 36, 18, "fm", "thin", 5) + tick(122, 168) + R(146, 160, 36, 18, "fc", "thin", 5) + L(159, 164, 169, 174, "w3") + L(169, 164, 159, 174, "w3");
    s += L(192, 28, 192, 184, "thin") + spark(206, 42, 6) + T(216, 47, "Claude Code", { a: "start", c: "sm b", size: 12 });
    s += R(198, 60, 108, 52, "fb", "", 8) + [74, 86, 98].map((y, i) => L(206, y, 296 - i * 16, y, "thin")).join("");
    s += R(198, 122, 108, 56, "fk", "thin", 6) + T(206, 140, "@cart.js#3-4", { a: "start", c: "sm b blu", size: 11.5, max: 94 }) + T(206, 160, t.vsAsk, { a: "start", size: 12, max: 94 });
    return s + T(160, 206, t.vsCap, { c: "sm mut", max: 300 });
  },
  ccAgentFile(lb) {
    const t = lb.agent;
    let s = R(18, 8, 284, 170, "fk", "", 8) + R(18, 8, 284, 26, "ft", "", 8) + T(30, 26, ".claude/agents/code-reviewer.md", { a: "start", c: "sm b", max: 260 }) + R(26, 85, 268, 20, "fy", "", 4);
    ["---", "name: code-reviewer", `description: ${t.agDesc}`, "tools: Read, Grep, Glob", "---"].forEach((l, i) =>
      s += T(34, 58 + i * 20, l, { a: "start", size: 12.5, max: 252, c: i === 0 || i === 4 ? "mut" : i === 2 ? "on" : "" }));
    s += T(34, 166, t.agPrompt, { a: "start", size: 12.5, max: 252 });
    return s + T(160, 204, t.agCap, { c: "sm mut", max: 300 });
  },
  skillVsAgent(lb) {
    const t = lb.skill;
    let s = pill(82, 20, "skill", "fy", { on: true, size: 14, w: 80 }) + R(14, 36, 136, 126, "fk", "", 8) + R(24, 46, 90, 20, "fb", "", 8);
    for (let i = 0; i < 5; i++) s += C(30, 82 + i * 16, 3, "fm") + L(40, 82 + i * 16, 136 - (i % 2) * 22, 82 + i * 16, "thin");
    s += L(160, 12, 160, 196, "dash thin faint") + pill(238, 20, "subagent", "fb", { on: true, size: 14, w: 96 });
    s += R(188, 34, 112, 66, "ft", "dash thin", 8) + T(244, 48, t.svOwn, { c: "sm mut", size: 11.5, max: 100 });
    for (let i = 0; i < 4; i++) s += L(198, 60 + i * 10, 290 - (i * 17 % 40), 60 + i * 10, "thin faint");
    s += A(244, 102, 244, 118, "thin") + R(170, 120, 136, 42, "fk", "", 8) + R(180, 128, 60, 18, "fb", "", 8) + pill(262, 150, t.svSummary, "fm", { on: true, size: 12 });
    return s + T(82, 180, t.svSkill, { c: "b", size: 13, max: 132 }) + T(238, 180, t.svAgent, { c: "b blu", size: 13, max: 132 }) + T(160, 206, t.svCap, { c: "sm mut", max: 300 });
  },
  ccPipe(lb) {
    const t = lb.agent;
    const doc = (x, y, fill) => R(x, y, 44, 54, fill, "thin", 4) + [0, 1, 2, 3].map(i => L(x + 8, y + 13 + i * 10, x + 36 - (i % 2) * 10, y + 13 + i * 10, "thin")).join("");
    let s = R(8, 8, 304, 40, "fk", "", 8) + T(20, 33, `$ git diff main | claude -p "${t.pPrompt}" > report.txt`, { a: "start", size: 12, max: 284 });
    s += doc(20, 64, "fk") + T(42, 134, t.pIn, { c: "sm mut", max: 80 }) + A(68, 91, 102, 91, "thin");
    s += R(106, 70, 108, 42, "fb", "", 10) + T(160, 96, "claude -p", { c: "on b", size: 14 }) + A(218, 91, 252, 91, "thin");
    s += doc(256, 64, "fy") + T(278, 134, "report.txt", { c: "sm mut", max: 84 });
    s += pill(84, 166, t.exitL, "fm", { on: true, size: 12.5 }) + T(84, 192, t.exitSub, { c: "sm mut", max: 140 });
    return s + codeChip(232, 166, "--allowedTools", 124) + T(232, 192, t.allowSub, { c: "sm mut", max: 150 });
  },
  ccHookFlow(lb) {
    const t = lb.agent;
    let s = T(74, 16, t.hookHead[0], { c: "sm b mut", max: 120 }) + T(167, 16, t.hookHead[1], { c: "sm b mut", max: 64 }) + T(253, 16, t.hookHead[2], { c: "sm b mut", max: 104 });
    t.hookFlow.forEach(([step, event, result], i) => {
      const y = 48 + i * 58, fill = ["fm", "fc", "fy"][i];
      s += R(14, y - 16, 120, 32, "fb", "", 10) + T(74, y + 5, step, { c: "on", size: 12.5, max: 108 });
      s += L(136, y, 198, y, "thin") + head(200, y, 0, "", 8) + T(167, y - 16, event, { c: "sm mut", size: 11, max: 62 }) + fishHook(174, y);
      s += R(204, y - 18, 102, 36, fill, "", 10) + T(255, y + 5, result, { c: "on b", size: result.includes("\n") ? 11.5 : 13, max: 90 });
    });
    return s + T(160, 210, t.hooksCap, { c: "sm mut", max: 300 });
  },
  ccHookJson(lb) {
    const t = lb.agent;
    let s = R(14, 10, 292, 166, "fk", "", 8) + R(14, 10, 292, 24, "ft", "", 8) + T(26, 27, ".claude/settings.json", { a: "start", c: "sm b" });
    [[0, '"hooks": {'], [1, '"PostToolUse": [{', "fy"], [2, '"matcher": "Edit|Write",', "fb"], [2, '"hooks": [{ "type": "command",'],
     [3, '"command": "npx prettier --write …" }]', "fm"], [1, "}]"], [0, "}"]].forEach(([ind, line, fill], i) => {
      const x = 28 + ind * 14, y = 54 + i * 18;
      if (fill) s += R(x - 5, y - 13, Math.min(line.length * 6.4 + 10, 300 - x), 18, fill, "", 4);
      s += T(x, y, line, { a: "start", size: 12, max: 296 - x, c: fill ? "on" : "" });
    });
    let x = 14;
    t.hookParts.forEach((part, i) => { const w = pillW(part, 12.5); s += pill(x + w / 2, 196, part, ["fy", "fb", "fm"][i], { on: true, size: 12.5 }); x += w + 8; });
    return s;
  },
  skillUse(lb) {
    const t = lb.skill;
    let s = codeChip(160, 24, ".claude/skills/release/SKILL.md", 250) + A(120, 40, 84, 60, "thin") + A(200, 40, 236, 60, "thin") + L(160, 60, 160, 170, "dash thin faint");
    s += R(14, 66, 138, 32, "ft", "", 10) + T(83, 87, `“${t.say}”`, { size: 13, max: 126 }) + A(83, 102, 83, 122, "thin") + pill(83, 140, t.loads, "fm", { on: true, size: 12.5 });
    s += R(170, 66, 136, 30, "fk", "", 6) + T(182, 86, "/rel", { a: "start", size: 13 }) + R(207, 75, 2, 14, "fi", "", 1);
    s += R(170, 100, 136, 58, "fk", "thin", 6) + R(174, 104, 128, 24, "fy", "", 4) + T(184, 121, "/release", { a: "start", c: "on b", size: 13 }) + T(184, 149, "/review", { a: "start", c: "mut", size: 13 });
    return s + T(83, 182, t.auto, { c: "b", max: 140 }) + T(238, 182, t.byName, { c: "b blu", max: 140 }) + T(160, 206, t.useCap, { c: "sm mut", max: 300 });
  },
  skillDesc(lb) {
    const t = lb.skill;
    let s = R(70, 10, 180, 30, "ft", "", 10) + T(160, 30, `“${t.say}”`, { size: 13, max: 168 });
    s += L(126, 44, 96, 66, "dash thin coral-s") + L(104, 50, 116, 62, "coral-s w3") + L(116, 50, 104, 62, "coral-s w3") + A(194, 44, 222, 66, "blue-s w3");
    s += R(14, 70, 138, 76, "fk", "coral-s dash", 8) + T(83, 108, t.vague, { size: 13, max: 122 }) + R(168, 70, 138, 76, "fk", "blue-s", 8) + T(237, 108, t.specific, { size: 12.5, max: 126 });
    return s + T(83, 170, t.vagueL, { c: "b cor", max: 140 }) + T(237, 170, t.specL, { c: "b blu", max: 140 }) + T(160, 204, t.descCap, { c: "sm mut", max: 300 });
  },
  skillFiles(lb) {
    const t = lb.skill;
    let s = R(14, 14, 30, 20, "fy", "thin", 3) + T(52, 30, "release/", { a: "start", c: "b" }) + L(28, 36, 28, 168, "thin");
    ["SKILL.md", "reference.md", "templates/", "check.sh"].forEach((f, i) => {
      const y = 62 + i * 36;
      s += L(28, y, 40, y, "thin") + R(42, y - 13, 112, 26, i ? "fk" : "fy", "thin", 6) + T(52, y + 5, f, { a: "start", size: 13, c: i ? "" : "on b" }) +
        T(166, y + 5, t.when[i], { a: "start", c: `sm ${i === 0 ? "b" : i === 3 ? "b blu" : "mut"}`, max: 146 });
    });
    return s + T(160, 210, t.filesCap, { c: "sm mut", max: 300 });
  },
  ccSkillFix(lb) {
    const t = lb.skill;
    const cross = (x, y) => L(x - 4, y - 4, x + 4, y + 4, "coral-s w3") + L(x + 4, y - 4, x - 4, y + 4, "coral-s w3");
    const ask = y => R(14, y - 12, 70, 24, "ft", "", 10) + T(49, y + 4, `“${t.sayShort}”`, { size: 11, max: 62 });
    const chip = (x, y, w, name, fill, c = "") => R(x, y - 12, w, 24, fill, c, 6) + T(x + w / 2, y + 4, name, { size: 11, max: w - 6, c: fill === "fc" ? "on b" : "mut" });
    const scenes = [
      y => ask(y) + L(86, y, 96, y, "thin dash faint") + chip(100, y, 62, "release", "fk", "dash thin") + T(166, y - 10, "zz", { a: "start", c: "sm b mut", size: 11 }),
      y => ask(y) + chip(92, y, 36, "release", "fk", "thin") + chip(132, y, 38, "review", "fc") + P(`M84,${y - 6} Q118,${y - 30} 146,${y - 13}`, "", "thin coral-s") + head(148, y - 12, .6, "coral-s", 7),
      y => [0, 1, 2].map(i => R(14 + i * 52, y - 12, 44, 24, ["fm", "fc", "fk"][i], i === 2 ? "dash thin" : "thin", 6) + T(26 + i * 52, y + 4, String(i + 1), { c: `b ${i < 2 ? "on" : "mut"}`, size: 12 })).join("") + tick(46, y) + L(94, y - 4, 102, y + 4, "w3") + L(102, y - 4, 94, y + 4, "w3"),
    ];
    const fs = f1(Math.min(12.5, ...t.fixes.map(([, fix]) => 92 / (fix.length * .48))));
    let s = "";
    t.fixes.forEach(([problem, fix], i) => {
      const y = 44 + i * 62;
      s += T(14, y - 22, problem, { a: "start", c: "sm b cor", max: 160 }) + scenes[i](y) + A(176, y, 200, y, "thin", 7) +
        R(204, y - 15, 102, 30, "fm", "", 10) + T(255, y + 5, fix, { c: "on b", size: fs });
    });
    return s + T(160, 210, t.fixesCap, { c: "sm mut", max: 300 });
  },
  skillWhich(lb) {
    const t = lb.skill;
    const icons = [
      (x, y) => R(x - 11, y - 14, 22, 28, "fy", "thin", 3) + C(x, y - 14, 3.5, "fc", "thin") + [0, 1, 2].map(i => L(x - 6, y - 5 + i * 7, x + 6 - (i % 2) * 4, y - 5 + i * 7, "thin")).join(""),
      (x, y) => P(`M${x - 15},${y - 9} q7,-4 15,0 q8,-4 15,0 v20 q-7,-4 -15,0 q-8,-4 -15,0 Z`, "fk", "thin") + L(x, y - 9, x, y + 11, "thin") + [0, 1].map(i => L(x - 11, y - 3 + i * 6, x - 4, y - 4 + i * 6, "thin") + L(x + 4, y - 4 + i * 6, x + 11, y - 3 + i * 6, "thin")).join(""),
      (x, y) => fishHook(x + 6, y - 13),
      (x, y) => L(x, y - 8, x, y - 13) + spark8(x, y - 17, 4) + R(x - 15, y - 8, 30, 24, "fk", "", 7) + C(x - 6, y + 2, 2.2, "fi") + C(x + 6, y + 2, 2.2, "fi") + L(x - 4, y + 9, x + 4, y + 9, "thin"),
    ];
    let s = "";
    [[14, 12], [166, 12], [14, 106], [166, 106]].forEach(([x, y], i) => s += R(x, y, 140, 84, ["fk", "fy", "fc", "fb"][i], i ? "" : "thin", 10) + icons[i](x + 26, y + 42) +
      T(x + 88, y + 32, t.which[i], { c: `b ${i ? "on" : ""}`, size: 14.5, max: 96 }) + T(x + 88, y + 60, t.whichSub[i], { c: `sm ${i ? "on" : "mut"}`, size: 12, max: 98 }));
    return s + T(160, 210, t.whichCap, { c: "sm mut", max: 300 });
  },
  agTool(lb, ns = "agent") {
    const t = lb[ns];
    // the question in plain words that the tool call starts from (the user's message), if there is one
    let s = t.ask ? C(14, 58, 6, "fy") + P("M5,76 Q5,66 14,66 Q23,66 23,76 Z", "fy") +
      R(16, 4, 66, 40, "fy", "", 10) + P("M24,44 l-6,8 l14,-8", "fy") + T(49, 24, t.ask, { c: "on", size: 11, max: 58, lh: 1.15 }) + A(18, 80, 26, 90, "thin", 6) : "";
    // the point of the card, in the middle of the loop
    if (t.center) s += T(158, 118, t.center, { c: "sm b mut", size: 12.5, max: 120, lh: 1.25 });
    s += bot(42, 112) + codeChip(172, 40, t.call, 176) + T(172, 72, t.request, { c: "sm mut", max: 176 });
    s += R(236, 98, 72, 54, "fk", "", 10) + T(272, 125, t.app, { size: 13, max: 64 });
    s += R(84, 156, 152, 30, "fm", "thin", 6) + T(160, 176, t.result, { c: "on", size: 13, max: 140 }) + T(160, 206, t.back, { c: "sm mut", max: 200 });
    return s + A(62, 88, 84, 60, "thin") + A(252, 56, 268, 94, "thin") + A(262, 154, 240, 168, "thin") + A(80, 168, 58, 138, "thin");
  },
  agLoop(lb, ns = "agent") {
    const t = lb[ns];
    let s = bot(160, 112);
    s += A(196, 58, 222, 104, "thin") + A(204, 146, 116, 146, "thin") + A(98, 104, 124, 58, "thin") + A(206, 36, 226, 36, "blue-s");
    s += pill(160, 38, t.decide, "fb", { on: true, size: 13 }) + pill(250, 140, t.use, "fy", { on: true, size: 13 }) + pill(70, 140, t.read, "fk", { size: 13 });
    s += pill(272, 36, t.done, "fm", { on: true, size: 12 });
    return s + T(160, 204, t.loopCap, { c: "sm mut", max: 290 });
  },
  agRoute(lb, ns = "agent") {
    const t = lb[ns];
    let s = T(16, 24, t.workflow, { a: "start", c: "b", max: 290 });
    t.steps.forEach((step, i) => s += pill(58 + i * 102, 60, step, ["fb", "fm", "fy"][i], { on: true, size: 13, w: 88 }) + (i < 2 ? A(104 + i * 102, 60, 112 + i * 102, 60, "thin", 7) : ""));
    s += L(12, 100, 308, 100, "dash thin faint") + T(16, 124, t.agentRoute, { a: "start", c: "b blu", max: 290 });
    s += L(96, 172, 82, 200, "thin dash coral-s") + L(198, 178, 222, 202, "thin dash coral-s");
    s += P(crPath([[24, 180], [60, 150], [104, 186], [150, 152], [190, 182], [234, 148], [280, 172]]), "", "blue-s w3") + C(24, 180, 5, "fi");
    s += T(76, 214, "?", { c: "cor b", size: 18 }) + T(230, 214, "?", { c: "cor b", size: 18 });
    return s + L(290, 180, 290, 142) + P("M290,142 l20,8 l-20,8 Z", "fy");
  },
  /* Claude Code: one running example, a shop's checkout total that's wrong with a discount code */
  agTerminal(lb) {
    const t = lb.agent;
    const icon = [
      (x, y) => R(x - 6, y - 8, 12, 16, "fk", "thin", 2) + L(x - 3, y - 3, x + 3, y - 3, "thin") + L(x - 3, y + 1, x + 3, y + 1, "thin") + L(x - 3, y + 5, x + 1, y + 5, "thin"),
      (x, y) => R(x - 9, y - 7, 18, 15, "fb", "thin", 3) + P(`M${x - 4},${y - 3} l4,3 l-4,3`, "", "thin"),
      (x, y) => P(`M${x - 7},${y + 6} L${x + 4},${y - 5} L${x + 8},${y - 1} L${x - 3},${y + 10} Z`, "fy", "thin") + P(`M${x - 7},${y + 6} L${x - 9},${y + 12} L${x - 3},${y + 10}`, "fk", "thin"),
    ];
    let s = R(10, 10, 240, 166, "fk", "", 10) + R(10, 10, 240, 24, "ft", "", 10) + L(10, 34, 250, 34, "thin");
    s += C(26, 22, 4.5, "fc", "thin") + C(40, 22, 4.5, "fy", "thin") + C(54, 22, 4.5, "fm", "thin") + T(150, 27, "claude", { c: "sm b mut", size: 12 });
    s += T(22, 60, ">", { a: "start", c: "b blu", size: 16 }) + T(38, 60, t.task, { a: "start", c: "b", size: 13.5, max: 194 }) + L(22, 72, 238, 72, "thin faint dash");
    t.steps.forEach(([act, res], i) => {
      const y = 94 + i * 22;
      s += icon[[0, 1, 2, 1][i]](30, y - 4) + T(46, y + 1, act, { a: "start", size: 13, max: 110 });
      if (res) { const w = pillW(res, 12) - 4; s += pill(238 - w / 2, y - 4, res, i === 1 ? "fc" : "fm", { on: true, size: 12, w, h: 20 }); }
    });
    s += bot(286, 62) + C(286, 124, 17, "fm") + tick(286, 124);
    return s + T(286, 156, t.done, { c: "sm b blu", max: 64 }) + T(160, 202, t.termCap, { c: "sm mut", max: 300 });
  },
  agRewind(lb) {
    const t = lb.agent;
    let s = L(20, 96, 190, 96, "blue-s w3") + P(crPath([[190, 96], [236, 94], [282, 70]]), "", "coral-s w3") + L(288, 58, 300, 70, "coral-s w3") + L(300, 58, 288, 70, "coral-s w3");
    [40, 90, 140, 190].forEach(x => s += C(x, 96, 7, "fy"));
    s += P("M276,58 Q200,34 96,84", "", "coral-s dash") + head(92, 87, 2.6, "coral-s", 9) + codeChip(190, 30, "/rewind", 84);
    s += T(115, 124, t.checkpoints, { c: "sm mut", max: 200 }) + T(16, 160, t.restore, { a: "start", c: "sm b", max: 70 });
    let x = 16 + Math.min(70, t.restore.length * 6.3) + 10;
    for (const o of t.restoreWhat) { const w = pillW(o, 13); s += pill(x + w / 2, 155, o, "fm", { on: true, size: 13 }); x += w + 6; }
    return s + codeChip(36, 196, "Esc", 48) + T(70, 201, t.stop, { a: "start", c: "sm mut", max: 236 });
  },
  agAway(lb) {
    const t = lb.agent;
    let s = R(22, 46, 68, 48, "fk", "", 6) + T(56, 76, ">_", { c: "b", size: 18 });
    s += C(160, 70, 26, "ft") + L(160, 70, 160, 54, "w3") + L(160, 70, 172, 78, "w3") + C(160, 70, 2.5, "fi");
    s += R(226, 50, 76, 36, "fb", "", 12) + P("M244,86 l-4,10 l14,-10", "fb") + T(264, 73, "@claude", { c: "on b", size: 13 });
    t.away.forEach(([title, sub], i) => s += T(56 + i * 104, 130, title, { c: "b", max: 100 }) + T(56 + i * 104, 150, sub, { c: "sm mut", max: 100 }));
    return s + T(160, 200, t.awayCap, { c: "sm b", max: 300 });
  },
  agPlugin(lb) {
    const t = lb.agent;
    const person = (x, y) => C(x, y - 10, 7, "fk") + P(`M${x - 11},${y + 12} Q${x - 11},${y} ${x},${y} Q${x + 11},${y} ${x + 11},${y + 12} Z`, "fk");
    let s = T(90, 22, t.plugin, { c: "b", max: 140 }) + R(16, 32, 148, 140, "fy", "", 10);
    t.parts.forEach((p, i) => s += R(28, 44 + i * 31, 124, 25, "fk", "thin", 6) + T(90, 61 + i * 31, p, { size: 13, max: 112 }));
    [48, 102, 156].forEach(y => s += A(168, 102, 226, y, "thin") + person(246, y) + R(268, y - 10, 18, 22, "fy", "thin", 3));
    return s + T(160, 204, t.pluginCap, { c: "sm mut", max: 300 });
  },
  agPlug(lb) {
    const t = lb.agent, ys = [52, 98, 144], svc = ["mail", "cal", "sheet"];
    const app = (x, y) => R(x - 15, y - 12, 30, 24, "fb", "thin", 6) + T(x, y + 4.5, "AI", { c: "on b", size: 12 });
    let s = L(160, 12, 160, 208, "dash thin faint");
    ys.forEach(a => ys.forEach(b => s += L(44, a, 116, b, "thin coral-s")));
    // one hub: every app's line meets the MCP box, and one line leaves it for each service
    ys.forEach(y => s += L(205, y, 226, 98, "thin blue-s") + L(254, 98, 275, y, "thin blue-s"));
    s += R(224, 83, 32, 30, "fy", "thin", 8) + T(240, 102, "MCP", { c: "on b", size: 11 });
    ys.forEach((y, i) => s += app(30, y) + ico[svc[i]](130, y) + app(190, y) + ico[svc[i]](290, y));
    [[30, t.apps], [130, t.services], [190, t.apps], [290, t.services]].forEach(([x, w]) => s += T(x, 22, w, { c: "sm mut", size: 12, max: 58 }));
    return s + T(80, 186, t.many, { c: "b cor", max: 150 }) + T(80, 204, t.eachOwn, { c: "sm mut", max: 150 }) +
      T(240, 186, t.few, { c: "b blu", max: 150 }) + T(240, 204, t.oneStd, { c: "sm mut", max: 150 });
  },
  agDesk(lb) {
    const t = lb.agent;
    const sheet = (x, y, w, h, rot, lab) => `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">` + R(x, y, w, h, "fk", "thin", 4) +
      L(x + 10, y + h - 20, x + w - 10, y + h - 20, "thin faint") + L(x + 10, y + h - 11, x + w - 24, y + h - 11, "thin faint") + T(x + w / 2, y + 22, lab, { c: "sm b", size: 12.5, max: w - 20 }) + "</g>";
    let s = R(14, 12, 196, 160, "ft", "", 10);
    s += sheet(24, 22, 86, 62, -3, t.desk[0]) + sheet(116, 24, 84, 62, 2.5, t.desk[1]) + sheet(26, 98, 86, 62, 2, t.desk[2]) + sheet(118, 96, 82, 62, -2, t.desk[3]);
    s += `<g transform="rotate(16 214 156)">` + R(186, 134, 56, 44, "fk", "coral-s dash", 4) + "</g>";
    s += A(220, 74, 238, 74, "thin") + R(242, 36, 66, 76, "fy", "", 6) + T(275, 58, t.summary, { c: "on b", size: 13, max: 58 });
    s += [72, 84, 96].map((y, i) => L(252, y, 298 - i * 10, y, "thin")).join("");
    return s + T(160, 192, t.deskCap, { c: "sm b", max: 300 }) + T(160, 210, t.full, { c: "sm mut", max: 300 });
  },
  agRules(lb) {
    const t = lb.agent;
    let s = L(160, 12, 160, 208, "dash thin faint") + R(12, 26, 140, 112, "fy", "", 6) + C(82, 28, 6, "fc");
    s += T(82, 52, "CLAUDE.md", { c: "on b", size: 14 });
    t.rules.forEach((r, i) => s += T(22, 78 + i * 22, "• " + r, { a: "start", c: "on", size: 12.5, max: 126 }));
    s += R(196, 14, 92, 148, "fk", "", 4) + P("M196,162 l10,-6 l10,6 l10,-6 l10,6 l10,-6 l10,6 l10,-6 l10,6 l12,-6", "", "thin");
    for (let i = 0; i < 12; i++) s += L(206, 26 + i * 11, 278 - (i * 13 % 28), 26 + i * 11, "thin faint");
    return s + tick(82, 158) + T(82, 186, t.short, { c: "b blu", max: 150 }) + T(242, 186, t.long, { c: "b cor", max: 150 }) +
      T(160, 210, t.rulesCap, { c: "sm mut", max: 300 });
  },
  agSkills(lb) {
    const t = lb.skill;
    let s = R(14, 6, 172, 28, "ft", "", 10) + T(100, 25, `“${t.req}”`, { size: 13, max: 160 }) + A(166, 36, 166, 64, "thin", 6);
    s += R(14, 52, 172, 130, "", "dash thin", 10);
    { const w = pillW(t.skillsTab, 12); s += R(24, 43, w, 18, "fm", "thin", 6) + T(24 + w / 2, 56, t.skillsTab, { c: "on b", size: 12 }); }
    t.ctxSkills.forEach(([name, desc], i) => {
      const y = 78 + i * 28, on = i === 0;
      s += R(22, y - 12, 156, 24, on ? "fy" : "fk", "thin", 6) + T(30, y + 4, `${name}: ${desc}`, { a: "start", size: 12, max: 134, c: on ? "on b" : "mut" });
    });
    s += T(100, 170, t.ctxLabel, { c: "sm mut", size: 11.5, max: 160 });
    s += A(180, 78, 198, 78, "thin", 7) + R(200, 52, 108, 130, "fk", "", 8) + R(200, 52, 108, 24, "fy", "", 8) + T(254, 69, "release", { c: "on b", size: 13 });
    const stepSize = Math.min(12.5, ...t.relSteps.map(st => 92 / (st.length * .48)));
    t.relSteps.forEach((st, i) => s += T(210, 98 + i * 22, st, { a: "start", size: f1(stepSize) }));
    return s + T(160, 206, t.opened, { c: "sm b", max: 300 });
  },
  agHelpers(lb) {
    const t = lb.agent;
    let s = `<g opacity=".4">${bot(206, 74)}</g>` + bot(180, 100) + bot(46, 100);
    for (let i = 0; i < 4; i++) s += R(244 - i * 4, 70 + i * 6, 58, 48, "fk", "thin", 4);
    s += [98, 108, 118].map(y => L(240, y, 280, y, "thin faint")).join("");
    s += A(72, 88, 152, 88, "thin") + T(112, 76, t.readThese, { c: "sm mut", max: 80 }) + A(152, 116, 72, 116, "blue-s w3");
    return s + T(112, 136, t.answer, { c: "sm b blu", max: 104 }) + T(46, 160, t.main, { c: "b", max: 90 }) + T(184, 160, t.helper, { c: "b", max: 90 }) +
      T(268, 160, t.pile, { c: "sm mut", max: 80 }) + T(160, 204, t.helpCap, { c: "sm mut", max: 300 });
  },
  agAllow(lb) {
    const t = lb.agent;
    let s = T(16, 18, t.modesLabel, { a: "start", c: "sm b", max: 290 });
    let x = 14;
    t.modes.forEach((m, i) => { const w = Math.max(52, m.length * 7 + 18); s += R(x, 26, w, 26, i ? "ft" : "fb", "thin", 8) + T(x + w / 2, 44, m, { size: 12.5, max: w - 10, c: i ? "" : "on b" }); x += w + 6; });
    s += R(14, 66, 292, 112, "fk", "", 8) + R(14, 66, 292, 24, "ft", "", 8) + T(26, 83, ".claude/settings.json", { a: "start", c: "sm b" });
    [[t.go, "fm"], [t.ask, "fy"], [t.never, "fc"]].forEach(([h, fill], i) => {
      const cx = 63 + i * 97;
      s += pill(cx, 112, h, fill, { on: true, size: 13.5, w: 84 }) + R(cx - 44, 132, 88, 28, "ft", "thin", 6) + T(cx, 151, t.ruleItems[i], { size: 12.5, max: 80 });
    });
    return s + T(160, 204, t.allowCap, { c: "sm mut", max: 300 });
  },
  agPlan(lb) {
    const t = lb.agent;
    let s = R(16, 14, 128, 128, "fk", "", 8) + T(80, 36, t.planTitle, { c: "b", size: 14, max: 110 });
    t.planSteps.forEach((st, i) => s += T(26, 60 + i * 22, `${i + 1}. ${st}`, { a: "start", size: 12, max: 108 }));
    s += `<g transform="rotate(-10 112 130)">` + R(88, 118, 48, 24, "", "blue-s w3", 5) + T(112, 135, "OK", { c: "b blu", size: 15 }) + "</g>";
    const page = (x, y) => R(x, y, 52, 66, "fk", "thin", 4) + [0, 1, 2, 3].map(i => L(x + 9, y + 14 + i * 12, x + 43 - (i % 2) * 12, y + 14 + i * 12, "thin")).join("");
    s += A(152, 80, 180, 80, "thin") + page(194, 40) + page(214, 54) + P("M264,84 L284,64 L292,72 L272,92 Z", "fy", "thin") + P("M264,84 L260,96 L272,92", "fk", "thin");
    return s + T(80, 170, t.plan, { c: "b blu", max: 150 }) + T(80, 190, t.planSub, { c: "sm mut", max: 150 }) +
      T(240, 170, t.work, { c: "b", max: 150 }) + T(240, 190, t.workSub, { c: "sm mut", max: 150 });
  },
  agProof(lb) {
    const t = lb.agent;
    const person = (x, y) => C(x, y - 9, 7, "fk") + P(`M${x - 11},${y + 12} Q${x - 11},${y} ${x},${y} Q${x + 11},${y} ${x + 11},${y + 12} Z`, "fk");
    let s = bot(34, 42) + R(64, 12, 210, 44, "fb", "", 12) + P("M64,30 l-10,6 l10,6", "fb") + T(76, 34, t.doneClaim, { a: "start", c: "on", size: 12.5, max: 190 });
    s += R(100, 66, 172, 30, "ft", "", 12) + P("M272,76 l10,4 l-10,6", "ft") + T(186, 86, t.showMe, { c: "b", size: 13.5, max: 160 }) + person(296, 82);
    const icons = [
      y => C(108, y, 6, "fc") + A(116, y, 128, y, "thin", 6) + C(136, y, 6, "fm"),
      y => R(108, y - 11, 28, 22, "fk", "thin", 3) + R(112, y - 7, 20, 5, "fc", "", 1) + R(112, y + 1, 20, 5, "fm", "", 1),
      y => C(122, y, 10, "", "dash thin coral-s") + T(122, y + 5, "?", { c: "b cor", size: 13 }),
    ];
    t.proofs.forEach((p, i) => { const y = 118 + i * 28; s += icons[i](y) + T(154, y + 5, p, { a: "start", size: 13, max: 158 }); });
    return s + T(160, 210, t.watchCap, { c: "sm b", max: 300 });
  },
};
