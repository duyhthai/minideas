// The shape of the site, shared by every language. SHELF is the home page, in order: each item is
// either a collection (has `ideas`) or a standalone idea (has `slug` and `panels`). Book reviews live
// in src/books/. Each idea says
// which drawing (a function in draw.js plus its arguments) each panel shows; collections and
// standalone ideas carry their own "Go deeper" links.
// Words live in src/i18n/<lang>.js: ideas[slug] has one entry per panel (plus `links` for a
// standalone idea), collections[id] has the collection's title, chapter names and link descriptions.
// date (YYYY-MM-DD): when it was published on the site, shown on the collection's page or the standalone idea.
// related (optional): the slug of one stack to read next, on either shelf (shown at the end; for a collection, after its last idea).

export const SHELF = [
  {
    id: "ai-fundamentals",
    date: "2026-11-19",
    related: "the-shallows",
    chapters: ["big", "learn", "work", "gen", "use"],
    resources: [
      { key: "coursera", name: "Coursera", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { key: "kaggle", name: "Kaggle", url: "https://www.kaggle.com/" },
      { key: "dlai", name: "DeepLearning.AI", url: "https://www.deeplearning.ai/" },
    ],
    ideas: [
      { slug: "ai-family", chapter: "big", panels: [["nested", -1], ["nested", 0], ["nested", 1], ["nested", 2], ["nested", 3]] },
      { slug: "rules-vs-learning", chapter: "big", panels: [["flow", false], ["people"], ["flow", true], ["labelled"]] },
      { slug: "types-of-learning", chapter: "learn", panels: [["supervised"], ["classReg"], ["clusters"], ["reinforce"]] },
      { slug: "model-errors", chapter: "learn", panels: [["errPlot", 1], ["errPlot", 2], ["errPlot", 3], ["errPlot", 4]] },
      { slug: "overfitting", chapter: "learn", panels: [["fitPlot", "under"], ["fitPlot", "over"], ["fitPlot", "right"], ["fitPlot", "test"]] },
      { slug: "neural-networks", chapter: "learn", panels: [["net", "basic"], ["net", "layers"], ["demand", false], ["demand", true], ["net", "train"]] },
      { slug: "clean-data", chapter: "work", panels: [["table", 1], ["table", 2], ["table", 3], ["table", 4]] },
      { slug: "ml-lifecycle", chapter: "work", panels: [["mlLoop", null], ["mlLoop", ["problem", "data"]], ["mlLoop", ["train", "test"], true], ["mlLoop", ["launch", "monitor"]]] },
      { slug: "next-word", chapter: "gen", panels: [["nextWord"], ["wordLoop"], ["sampling"], ["chatTurns"]] },
      { slug: "foundation-models", chapter: "gen", panels: [["pretrain"], ["adapt"], ["rentOrRun"]] },
      { slug: "embeddings", chapter: "gen", panels: [["vecs"], ["wordMap"], ["analogy"], ["meaningSearch"]] },
      { slug: "prompting", chapter: "gen", panels: [["brief", "parts"], ["brief", "example"], ["shots"], ["cot"], ["tricks"]] },
      { slug: "customizing-models", chapter: "gen", panels: [["pyramid", -1], ["pyramid", 0], ["pyramid", 1], ["pyramid", 2], ["pyramid", 3]] },
      { slug: "made-up-answers", chapter: "use", panels: [["madeUp"], ["fillShape"], ["likelyTrue"], ["examGuess"], ["checkIt"]] },
      { slug: "responsible-ai", chapter: "use", panels: [["biasHire"], ["dataLeak"], ["blackBox"], ["inCharge"]] },
    ],
  },
  {
    id: "building-with-claude",
    date: "2026-11-26",
    related: "clean-code-refactoring",
    chapters: ["code", "skills", "mcp", "api"],
    resources: [
      { key: "academy", name: "Claude Academy", url: "https://academy.claude.com/collections/build-with-claude" },
      { key: "code", name: "Claude Code docs", url: "https://code.claude.com/docs/en/overview" },
      { key: "mcp", name: "Model Context Protocol", url: "https://modelcontextprotocol.io/docs/getting-started/intro" },
      { key: "api", name: "Claude API docs", url: "https://platform.claude.com/docs/en/intro" },
    ],
    ideas: [
      { slug: "claude-code-start", chapter: "code", panels: [["agTerminal"], ["ccInstall"], ["ccVSCode"]] },
      { slug: "claude-code-steering", chapter: "code", panels: [["agPlan"], ["agRewind"], ["agDesk"], ["agHelpers"], ["ccAgentFile"]] },
      { slug: "claude-code-rules", chapter: "code", panels: [["agRules"], ["agAllow"], ["ccHookFlow"], ["ccHookJson"]] },
      { slug: "claude-code-unattended", chapter: "code", panels: [["agAway"], ["ccPipe"], ["ccReview"], ["agProof"]] },
      { slug: "skills-basics", chapter: "skills", panels: [["agSkills"], ["skillFile"], ["skillUse"], ["skillDesc"], ["skillFiles"]] },
      { slug: "skills-sharing", chapter: "skills", panels: [["skillWhich"], ["skillVsAgent"], ["agPlugin"], ["ccSkillFix"]] },
      { slug: "mcp-basics", chapter: "mcp", panels: [["agPlug"], ["mcpClientServer"], ["mcpAdd"], ["agTool", "mcpuse"]] },
      { slug: "mcp-primitives", chapter: "mcp", panels: [["mcpBuild"], ["mcpResources"], ["mcpPrompts"], ["mcpThree"]] },
      { slug: "claude-api-basics", chapter: "api", panels: [["apiRequest"], ["apiMemory"], ["apiSystem"], ["apiTemp"], ["apiShape"]] },
      { slug: "prompt-evals", chapter: "api", panels: [["evalOne"], ["evalSet"], ["evalGrade"], ["evalLoop"]] },
      { slug: "tool-use", chapter: "api", panels: [["toolSchema"], ["agTool", "tools"], ["agLoop", "tools"], ["toolBuiltIn"], ["toolEditor"]] },
      { slug: "rag-pipeline", chapter: "api", panels: [["ragChunk"], ["ragTwoSearch"], ["ragContext"], ["ragFlow"]] },
      { slug: "claude-features", chapter: "api", panels: [["featThink"], ["featFiles"], ["featCite"], ["featCache"]] },
      { slug: "workflows-and-agents", chapter: "api", panels: [["agRoute", "wf"], ["wfChain"], ["wfRoute"], ["wfParallel"], ["agLoop", "wfagent"]] },
    ],
  },
  {
    slug: "clean-code-refactoring",
    date: "2026-11-19",
    related: "building-with-claude",
    panels: [["readMore"], ["stamina"], ["sameResult"], ["goodNames"], ["oneJob"], ["sayOnce"], ["onlyNeed"], ["safetyNet"], ["aiWrites"], ["littleCleaner"]],
    resources: [
      { key: "guru", name: "Refactoring.Guru", url: "https://refactoring.guru/refactoring/what-is-refactoring" },
      { key: "catalog", name: "Refactoring catalog", url: "https://refactoring.com/catalog/" },
      { key: "stamina", name: "Martin Fowler", url: "https://martinfowler.com/bliki/DesignStaminaHypothesis.html" },
      { key: "yagni", name: "Martin Fowler", url: "https://martinfowler.com/bliki/Yagni.html" },
    ],
  },
  {
    slug: "graph-databases",
    date: "2026-11-19",
    panels: [["graphIntro"], ["graphLabels"], ["graphRel"], ["graphProps"], ["graphTables"], ["graphPattern"], ["graphHops"], ["graphPath"], ["graphRecommend"], ["graphMerge"], ["graphIndex"], ["graphWhen"]],
    resources: [
      { key: "intro", name: "Neo4j", url: "https://neo4j.com/docs/getting-started/graph-database/" },
      { key: "cheat", name: "Cypher cheat sheet", url: "https://neo4j.com/docs/cypher-manual/current/cheat-sheet/" },
      { key: "manual", name: "Cypher manual", url: "https://neo4j.com/docs/cypher-manual/current/introduction/" },
      { key: "wiki", name: "Wikipedia", url: "https://en.wikipedia.org/wiki/Graph_database" },
    ],
  },
];
