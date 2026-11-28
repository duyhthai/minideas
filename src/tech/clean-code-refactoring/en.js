// Clean code and refactoring: the idea and the words inside its drawings.
export default {
  ideas: {
    "clean-code-refactoring": { title: "Clean code and refactoring", gist: "Write code that’s easy to read, then tidy it right away, so the next change is easy too.", panels: [
      ["Code is read far more than it’s written", "You write a line once, but people read it again and again: teammates, reviewers, and you six months later. Clean code is code the next reader can understand quickly."],
      ["Why bother? Mess slows you down", "In messy code, every new feature takes longer than the last. Code that’s kept tidy costs a little more at first, then stays quick to change."],
      ["Make it work, then make it right", "First get the code working. Then, while it’s still fresh in your head, tidy it without changing what it does: the same input still gives the same answer. That’s refactoring, and it takes minutes, not a separate project months later."],
      ["Names that say what they mean", "A variable called d makes every reader guess; daysUntilDue doesn’t. A good name often makes a comment unnecessary. When you do write one, explain why the code does something, not what it does."],
      ["One job per piece", "A giant function that checks the order, takes the payment and sends the receipt is hard to follow and risky to change. Split it into small pieces that each do one thing and are named for it, like the steps of a recipe."],
      ["Say it once", "If the same logic is copied into three places, a bug gets fixed in one and stays in the other two. Put it in one place and use it everywhere: the DRY principle, don’t repeat yourself. Only merge things that mean the same, not things that just look alike."],
      ["Build what you need now", "Extra options added “just in case” make code bigger, and every reader has to work through them, though most never get used. Build for today’s need and add more when it’s real. The principle has a name: YAGNI, you aren’t gonna need it."],
      ["Tidy in tiny steps, with tests", "Rename something, or pull a chunk out into its own function, then run the automated tests. If they pass, save and take the next step. If anything fails, undo just that step. Many tiny steps are safer than one big leap."],
      ["When an AI writes the code", "An AI assistant can write code in seconds, but a person still has to read it, understand it and answer for it. It copies the style of the code around it: tidy code gets tidy suggestions, messy code gets more mess. Ask it to make it work, then make it right, in small steps with tests, as you would yourself."],
      ["Leave it a little cleaner", "Nobody writes a perfect first draft, so clean code is a habit, not a finish line. Each time you touch older code, fix one small thing. Like fixing a house one room at a time while you live in it, there’s no need to tear it down and rewrite."],
    ], links: {
      guru: "What clean code looks like, and how refactoring gets you there",
      catalog: "Martin Fowler’s list of refactorings, each with a worked example",
      stamina: "The Design Stamina Hypothesis: why tidy code pays off over time",
      yagni: "YAGNI: why building features before you need them costs more than it seems",
    }},
  },

  /* words inside the drawings (draw.js) */
  art: {
    clean: {
      once: "written once", many: "read again and again", later: "often by you, months later",
      x: "time →", y: "time to add a feature", messy: "messy code", tidy: "kept tidy", payoff: "pays off here",
      input: "input", before: "1. make it work", after: "2. make it right", same: "same\nresult",
      bad: "d = 7", good: "daysUntilDue = 7", guess: "what's d?", clear: "says what it is",
      comment: "// skip Sundays: the bank is closed", why: "a comment says why, not what",
      giant: "one giant function", steps: ["check order", "take payment", "send receipt"], small: "one job each",
      copied: "copied 3 times", missed: "fixed one, missed two", oneHome: "one shared piece", fixedAll: "fix once, fixed everywhere",
      justInCase: "just in case", carry: "every reader carries it", now: "what's needed now", later2: "add more when it's real",
      change: "small change", run: "run tests", pass: "pass", fail: "fail", save: "save", undo: "undo", caption: "repeat, many times a day",
      fast: "written\nin seconds", you: "still read and\nchecked by you",
      visits: ["visit 1", "visit 2", "visit 3", "visit 4"], habit: "each time you pass by, fix one small thing", noRewrite: "no big rewrite needed",
    },
  },
};
