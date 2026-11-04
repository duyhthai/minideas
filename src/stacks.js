// The shape of the site, shared by every language. SHELF is the home page, in order: each item is
// either a collection (has `ideas`) or a standalone idea (has `slug` and `panels`). Book reviews live
// in src/books/. Each idea says
// which drawing (a function in draw.js plus its arguments) each panel shows; collections and
// standalone ideas carry their own "Go deeper" links.
// Words live in src/i18n/<lang>.js: ideas[slug] has one entry per panel (plus `links` for a
// standalone idea), collections[id] has the collection's title, chapter names and link descriptions.

export const SHELF = [
  {
    id: "ai-fundamentals",
    chapters: ["big", "ml", "dl", "gen", "use"],
    resources: [
      { key: "coursera", name: "Coursera", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { key: "kaggle", name: "Kaggle", url: "https://www.kaggle.com/" },
      { key: "dlai", name: "DeepLearning.AI", url: "https://www.deeplearning.ai/" },
    ],
    ideas: [
      { slug: "ai-family", chapter: "big", panels: [["nested", -1], ["nested", 0], ["nested", 1], ["nested", 2], ["nested", 3]] },
      { slug: "rules-vs-learning", chapter: "ml", panels: [["flow", false], ["people"], ["flow", true], ["labelled"]] },
      { slug: "model-errors", chapter: "ml", panels: [["errPlot", 1], ["errPlot", 2], ["errPlot", 3], ["errPlot", 4]] },
      { slug: "overfitting", chapter: "ml", panels: [["fitPlot", "under"], ["fitPlot", "over"], ["fitPlot", "right"], ["fitPlot", "test"]] },
      { slug: "clean-data", chapter: "ml", panels: [["table", 1], ["table", 2], ["table", 3], ["table", 4]] },
      { slug: "types-of-learning", chapter: "ml", panels: [["supervised"], ["classReg"], ["clusters"], ["reinforce"], ["share"]] },
      { slug: "ml-lifecycle", chapter: "ml", panels: [["mlLoop", null], ["mlLoop", ["problem", "data"]], ["mlLoop", ["train", "test"], true], ["mlLoop", ["launch", "monitor"]]] },
      { slug: "neural-networks", chapter: "dl", panels: [["net", "basic"], ["net", "layers"], ["demand", false], ["demand", true]] },
      { slug: "foundation-models", chapter: "gen", panels: [["pretrain"], ["adapt"], ["makers"]] },
      { slug: "embeddings", chapter: "gen", panels: [["vecs"], ["wordMap"], ["analogy"]] },
      { slug: "customizing-models", chapter: "gen", panels: [["pyramid", -1], ["pyramid", 0], ["pyramid", 1], ["pyramid", 2]] },
      { slug: "prompting", chapter: "gen", panels: [["brief", "parts"], ["brief", "example"], ["shots"], ["cot"], ["tricks"]] },
      { slug: "responsible-ai", chapter: "use", panels: [["ring", null], ["ring", ["fair", "safety", "privacy"]], ["ring", ["explain", "transparency", "veracity"]], ["ring", ["governance", "control"]]] },
      { slug: "aws-ai-services", chapter: "use", panels: [["tiles", "language"], ["tiles", "vision"], ["stairs"]] },
    ],
  },
  {
    slug: "refactoring",
    panels: [["sameResult"], ["stamina"], ["smells"], ["refSteps"], ["safetyNet"], ["renovate"]],
    resources: [
      { key: "guru", name: "Refactoring.Guru", url: "https://refactoring.guru/refactoring" },
      { key: "catalog", name: "Refactoring catalog", url: "https://refactoring.com/catalog/" },
      { key: "stamina", name: "Martin Fowler", url: "https://martinfowler.com/bliki/DesignStaminaHypothesis.html" },
    ],
  },
];
