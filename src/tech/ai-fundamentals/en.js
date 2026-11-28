// AI Fundamentals: the collection, its ideas and the words inside its drawings.
export default {
  collections: {
    "ai-fundamentals": {
      title: "AI Fundamentals",
      lede: "How machines learn, how chatbots write, and how to use AI well.",
      chapters: { big: "What AI is", learn: "How machines learn", work: "Making it work", gen: "Generative AI", use: "Using AI well" },
      links: {
        coursera: "Machine Learning Specialization by Andrew Ng",
        kaggle: "Practice on real datasets with a data science community",
        dlai: "Short courses on deep learning and generative AI",
      },
    },
  },

  ideas: {
    "ai-family": { title: "The AI family", gist: "AI, machine learning, deep learning and generative AI fit inside each other like nesting dolls.", panels: [
      ["Four ideas, one inside the next", "Every generative AI tool is a kind of deep learning, which is a kind of machine learning, which is a kind of AI."],
      ["Artificial intelligence", "Any computer system that does something we’d call smart: playing chess, recognizing a face, planning a route. It can follow hand-written rules or learn from data."],
      ["Machine learning", "AI that learns from examples instead of being told the rules. Show it thousands of past cases and it works out the pattern itself."],
      ["Deep learning", "Machine learning built from many layers of simple math units, loosely inspired by brain cells. It’s what made computers good at photos, speech and language."],
      ["Generative AI", "Deep learning that makes new things: writing, pictures, code and audio. Chatbots and image generators live in this smallest circle."],
    ]},
    "rules-vs-learning": { title: "Rules vs. learning", gist: "Normal software follows rules a person wrote. Machine learning works out the rules from examples.", panels: [
      ["Normal software: rules in, answers out", "A programmer writes the rules. The computer applies them to data and gives answers, like a cook following a recipe."],
      ["Rules work, until they don’t", "Telling walking from running from cycling is easy with a speed rule. But what speed means golf? Some things are too messy to write rules for."],
      ["Machine learning flips it around", "Give it lots of examples with the right answers attached. It works out the rules on its own."],
      ["Learning from labeled examples", "Record a phone’s motion sensor while people walk, run, cycle and golf, and label each recording. The model finds the pattern for each one, golf included."],
    ]},
    "model-errors": { title: "How a model knows it’s wrong", gist: "A model makes guesses, measures how far off they are, and adjusts to shrink the gap.", panels: [
      ["Start with real examples", "Each dot is a real house: its size along the bottom and its price going up. The model’s job is to predict a price from a size."],
      ["The model draws its best guess", "The blue line is the model’s predicted price for every size. It can’t pass through every dot."],
      ["The gaps are errors", "The distance from each real dot to the line shows how wrong the guess was for that house."],
      ["Training shrinks the error", "Training nudges the line, again and again, until the total error is as small as it can get. Each gap is squared first, so big misses count extra. Experts call this score the mean squared error."],
    ]},
    "overfitting": { title: "Too simple, too fussy, just right", gist: "A good model learns the general trend, not every quirk of its practice data.", panels: [
      ["Too simple: underfitting", "A straight line can’t follow a curve. It’s like a student who learned one rule and uses it for every question. Experts call this high bias."],
      ["Too fussy: overfitting", "This line hits every practice dot but zigzags wildly. It memorized the practice test, so it fails the real one. Experts call this high variance."],
      ["Just right: it generalizes", "A smooth curve follows the real trend and ignores the noise. That’s what lets it make good guesses on data it has never seen."],
      ["The real test is new data", "Always check a model on examples it didn’t train on. The smooth curve still fits the new yellow dots. The zigzag would miss them."],
    ]},
    "clean-data": { title: "Clean data first", gist: "A model can only be as good as the examples it learns from.", panels: [
      ["Real data is messy", "Mixed units, blanks and odd values creep in whenever people collect data. Every red box here is a problem."],
      ["Make it consistent", "Put every value in the same unit. 1,500 a month becomes 18,000 a year, so the model compares like with like."],
      ["Handle the gaps", "When a value is missing, fill it with a sensible estimate or mark it as unknown. Don’t let blanks slip through unnoticed."],
      ["Drop what can’t be saved", "A row that’s mostly empty does more harm than good, so remove it. Then check the outliers: is 3,000,000 a year real, or a typo?"],
    ]},
    "types-of-learning": { title: "Three ways machines learn", gist: "With an answer key, without one, or by trial and error.", panels: [
      ["Supervised: learning with an answer key", "Every example comes with the right answer. Show it emails marked spam or not spam, and it learns to sort new ones."],
      ["Two kinds of answers", "Classification picks a group, like spam or not spam. Regression predicts a number, like a house price. The next idea shows how a regression model learns."],
      ["Unsupervised: finding groups on its own", "No answers are given. The model spots which examples are alike, such as customers who shop the same way. This is called clustering."],
      ["Reinforcement: trial and error", "The model tries actions and gets a reward or a penalty, like a dog learning tricks for treats. Game-playing AI and robots learn this way."],
    ]},
    "ml-lifecycle": { title: "From idea to working model", gist: "Building a model is a loop: gather, train, test, launch, watch, repeat.", panels: [
      ["It’s a loop, not a launch", "Machine learning projects run in a cycle. The work doesn’t stop when the model goes live."],
      ["Start with the problem, then the data", "Turn a business goal into a question a model can answer. Then gather and clean the data, and pick the details that matter (called features)."],
      ["Train and test", "Train the model, then test it against the business goal. If it falls short, go back for more or better data and try again."],
      ["Launch and keep watching", "Once it’s live, watch how it performs. The world changes, so feed in new data and retrain. Running this loop well is called MLOps."],
    ]},
    "neural-networks": { title: "Neural networks", gist: "Layers of tiny calculators that pass numbers forward and discover useful in-between ideas.", panels: [
      ["Layers of tiny calculators", "Each circle takes in numbers, gives each one a weight for how much it matters, and passes a single number on."],
      ["Input, hidden, output", "The input layer takes the raw facts, hidden layers work on them, and the output layer gives the answer. “Deep” just means many hidden layers."],
      ["Example: will this T-shirt sell?", "Four facts go in. The middle layer turns them into ideas like “is it affordable?” and “do people know about it?”. The output is the chance it becomes a best-seller."],
      ["Nobody names the middle ideas", "We never tell the network to think about affordability. During training it finds whatever in-between ideas help it guess right. That’s where its power comes from."],
      ["How it learns: guess, check, nudge", "It’s the same trick as the line through the house dots. The network guesses, measures how far off it was, and nudges every weight a little to do better next time. Big networks have billions of weights, which is why training takes so much data and computing power."],
    ]},
    "how-chatbots-write": { title: "How a chatbot writes", gist: "It guesses the next word, adds it, and guesses again.", panels: [
      ["It guesses the next word", "Give it some text and it scores every word that could come next. After “The cat sat on the”, “mat” scores high and “moon” scores low. The scores come from patterns in everything it has read."],
      ["Then it does it again", "It adds the chosen word and guesses the next one, then the next. Every answer, from an email to a poem, is built one piece at a time. (Strictly, the pieces are often parts of words, called tokens.)"],
      ["A little luck in every pick", "It doesn’t always take the top word. A bit of randomness keeps the writing natural, which is why the same question can get a different answer each time."],
      ["A chat is one long document", "Your messages and its replies are joined into one text, and it keeps continuing it. It rereads all of it before each new word, up to a limit, which is why very long chats can lose track of the beginning."],
    ]},
    "foundation-models": { title: "Foundation models", gist: "One huge model, trained once on a mountain of data, then used for many jobs.", panels: [
      ["Practice on almost everything", "The guessing skill comes from practice on a huge pile of text, and often images and code too. No labels are needed: the real next word is the answer key. Along the way it picks up grammar, facts and how ideas connect."],
      ["Then put it to work on many jobs", "The same model can write, summarize, pull out facts, chat and answer questions. You don’t need a new model for each task."],
      ["You rarely build your own", "Training one costs a fortune, so only a few large companies do it. Most people use one through an app or online service. Some models are also free to download and run on your own computer."],
    ]},
    "embeddings": { title: "Words as points on a map", gist: "AI turns words into lists of numbers, so similar meanings sit close together.", panels: [
      ["Every word becomes a list of numbers", "Each number scores the word on some trait. “Cat” scores high on feline and “dog” doesn’t. This list is called an embedding."],
      ["Similar words land close together", "Real embeddings have hundreds of numbers. Squash them down to two and plot them like a map: cat and kitten end up neighbors, and houses sits far away."],
      ["Directions carry meaning", "The step from “man” to “woman” is about the same as from “king” to “queen”. That’s how a model captures relationships between words, not just the words themselves."],
      ["Search by meaning", "Turn documents into points too, and a question lands near the pages that mean the same thing, even with no words in common. This is how AI finds the right pages in your files, which comes back in “Making a model yours”."],
    ]},
    "customizing-models": { title: "Making a model yours", gist: "Start with a better prompt, then add your documents. Retrain only if you must.", panels: [
      ["Four ways to customize", "Start at the bottom. Each step up costs more effort and money, and gives you a more specialized model. Most needs are met by the first two."],
      ["Write a better prompt", "Clear instructions and a few examples, as in the last idea. It’s free, instant, and often all you need."],
      ["Hand it your documents (RAG)", "Before answering, the system searches your files by meaning, like the map of words, and passes the best pages to the model. Think of it as an open-book exam: no retraining, and easy to keep up to date."],
      ["Give it extra training (fine-tuning)", "Train an existing model a little more on your own examples so it learns your tone or a specialist task. It’s like sending a graduate on a specialist course."],
      ["Build one from scratch", "Train a brand-new model on your own data. It takes huge amounts of data, money and expertise, so very few organizations need to."],
    ]},
    "prompting": { title: "Writing a good prompt", gist: "Brief the AI like a new colleague: what to do, why, with what, and in what shape.", panels: [
      ["The four parts of a clear prompt", "Say what to do, why it matters, what to work with, and what the answer should look like."],
      ["The same brief, filled in", "Here it is for a stock check. Leave out any part and the AI has to guess."],
      ["Show, don’t just tell", "Just asking is called zero-shot. Showing a couple of worked examples first (few-shot) gets the AI to copy the exact format you want."],
      ["Ask it to think step by step", "For math and logic, ask it to work through the steps before answering. Since it writes one word at a time, writing the steps first gives it something to build on. This is called chain-of-thought prompting."],
      ["More ways to get better answers", "Ask a few times and compare. Ask for several options before picking one. Paste in the documents it should rely on. And where the app allows it, let it search or calculate instead of guessing."],
    ]},
    "made-up-answers": { title: "Why AI makes things up", gist: "It writes what sounds likely, and likely isn’t always true.", panels: [
      ["Confident and wrong", "Ask about a rare detail and a chatbot may invent one: a book nobody wrote, a quote nobody said, a study nobody did. It sounds just as sure as when it’s right. This is called a hallucination."],
      ["It writes, it doesn’t look things up", "As in “[How a chatbot writes](how-chatbots-write)”, it builds an answer one likely word at a time. Ask for a book and the likely answer has a familiar shape: a title, an author, a year. Each piece only has to fit the words before it. No step checks that the book exists."],
      ["Likely isn’t the same as true", "For famous facts, seen countless times, the likely words are also the true ones. For a rare detail it saw once or never, there’s no strong pattern to follow, so a guess that sounds right fills the gap."],
      ["Why it doesn’t say “I don’t know”", "When models are trained and tested, answers are often scored like an exam: a right answer earns a point, a wrong one or “I don’t know” earns nothing. As on a multiple-choice test, guessing beats leaving it blank, so the model learns to guess. Its sure tone comes from the text it learned from, which rarely hedges, so a guess sounds as certain as a fact."],
      ["How to protect yourself", "Give it a source to work from, the open-book exam from “[Making a model yours](customizing-models)”. Ask where each fact came from, and check anything that matters, especially names, numbers and quotes, before you rely on it."],
    ]},
    "responsible-ai": { title: "Responsible AI", gist: "Four questions to ask before trusting AI with decisions about people.", panels: [
      ["Is it fair?", "Say a company lets a model sort job applications. It learned from past hires, who were mostly men, so it ranks women lower. As in “[Clean data first](clean-data)”, a model is only as good as its examples, and these carry an old bias."],
      ["Does it protect people’s data?", "Applications hold phone numbers, home addresses, ID numbers. Paste one into a chatbot for a quick summary and it may be stored, read by the provider’s staff or used for training, and what a model trained on can resurface in someone else’s answers. Know where data goes before you share it, especially someone else’s."],
      ["Can it explain itself?", "A rejected applicant asks why. They should get a reason, but many models can’t give one: it’s spread over thousands of weights and middle ideas nobody named, as in “[Neural networks](neural-networks)”. When the stakes are high, use a system whose reasons can be checked, and tell people when AI is involved."],
      ["Who’s in charge?", "Every AI system needs an owner: someone who checks its picks before they count, watches whether any group keeps losing out, hears complaints, and can overrule the model. “The computer decided” is never the final answer."],
    ]},
  },

  /* words inside the drawings (draw.js) */
  art: {
    family: { ai: "Artificial intelligence", ml: "Machine learning", dl: "Deep learning", gen: "Gen AI" },
    rules: {
      rules: "Rules", data: "Data", answers: "Answers", progBox: "Normal\nprogram", mlBox: "Machine\nlearning",
      names: ["walking", "running", "cycling", "golf"], speeds: ["speed < 4", "speed < 12", "even faster", "no rule fits"],
      tags: ["WALKING", "RUNNING", "CYCLING", "GOLFING"], sensor: "sensor readings + the right answer",
    },
    error: { x: "house size →", y: "price", real: "real houses", guess: "the model’s guesses", off: "how far off", mse: "mean squared error", mseSub: "= average of the squares" },
    fit: { under: "too simple", over: "too fussy", right: "just right", test: "the real test", newData: "new data it never saw" },
    data: { headers: ["Age", "Income", "State"], sep: ",", yr: "yr", mo: "mo", unknown: "unknown", typo: "real, or a typo?" },
    types: {
      spam: "spam", notSpam: "not spam", model: "model", spamQ: "spam?", examples: "examples + answers",
      classification: "classification", whichGroup: "which group?", regression: "regression", whatNumber: "what number?",
      unnamed: "nobody named these groups", treat: "+1 treat", tryFail: "try, fail, adjust, repeat",
    },
    loop: { problem: "problem", data: "data", train: "train", test: "test", launch: "launch", monitor: "monitor", notYet: "not good\nenough?" },
    net: { input: "input", hidden: "hidden layers", output: "output", flow: "numbers flow this way", guess: "guess", right: "right answer", nudge: "nudge every weight a little", repeat: "guess, check, nudge, repeat" },
    demand: {
      inputs: ["price", "shipping", "marketing", "material"], hidden: ["affordable?", "well known?", "good quality?"],
      out: "best-seller?", facts: "4 facts", ideas: "3 ideas", answer: "1 answer",
    },
    found: {
      pretrain: "pre-train", pile1: "a mountain of data,", pile2: "no labels needed", model: "foundation model",
      tasks: ["write", "summarize", "pull out facts", "chat", "answer questions", "make images"],
      online: "use it online", onlineSub: "in an app or a service", local: "run it yourself", localSub: "some are free to download",
    },
    gen: {
      start: ["The", "cat", "sat", "on", "the"], options: ["mat", "sofa", "floor", "moon"], scores: "how likely each next word is",
      next: ["mat", "and", "purred"], loopCaption: "add the word, guess again",
      tries: ["try 1", "try 2"], endings: ["… mat and purred.", "… sofa and fell asleep."], samplingCaption: "same start, different endings",
      you: "You:", ai: "AI:", readsAll: "it rereads\nall of this\nbefore each\nnew word",
    },
    embed: {
      traits: ["living", "feline", "human", "gender", "royal", "verb", "plural"], dec: ".",
      cat: "cat", dog: "dog", kitten: "kitten", houses: "houses", caption: "each number scores one trait", close: "close = similar",
      man: "man", woman: "woman", king: "king", queen: "queen", same: "same step",
      query: "“forgot my login”", near: "Resetting your password", far: ["Office opening hours", "Holiday policy"], noShared: "no words in common, still a match",
    },
    custom: { prompt: "a better prompt", rag: "your documents (RAG)", fine: "fine-tune", scratch: "from\nscratch", effort: "more effort and cost", special: "more specialized" },
    prompt: {
      parts: ["Instruction", "Context", "Input data", "Output format"],
      example: { ask: "Which orders can we ship?", why: "Stock check for\nour online shop", order: "Order 1", stock: "Stock", cols: ["order", "ship / restock"] },
      translate: "Translate to French:", cheese: "cheese →", examples: ["sea → mer", "cat → chat"], reply: ["Sure!", "In French, cheese", "is “fromage”. You", "might also like…"], chatty: "plus extra chatter", exact: "just the format shown",
      question: "3 boxes of 12 eggs. 5 broke.\nHow many good eggs?", think: "“Let’s think step by step.”", answer: "answer", straight: "asked straight", noSteps: "no steps\nto build on",
      tricks: ["ask a few times", "ask for options", "give it sources", "let it use tools"],
    },
    trust: {
      ask: "Any good books on the\nhistory of Vietnamese coffee?", claim: "Try “The Slow Drip” by\nAnna Kessler (2014).", stamp: "made up", sure: "said as surely as a real fact",
      famous: ["a famous fact", "The capital\nof France is", "Paris", "seen countless times"],
      rare: ["a rare detail", "A good book on\nVietnamese coffee is", "The Slow Drip", "seen rarely, if ever"],
      shapeTag: "the shape of a book tip", shape: "Try “_____” by _____ (____).",
      fills: [["The Slow Drip", "sounds like a title"], ["Anna Kessler", "sounds like an author"], ["2014", "sounds like a year"]], noCheck: "nothing checks that the book is real",
      examTitle: "how answers are scored", scored: [["“I don’t know.”", "0 points"], ["a confident guess", "sometimes\nright: 1 point"]], examCaption: "guessing beats leaving it blank",
      checks: ["give it a source", "ask where each\nfact came from", "check names,\nnumbers, quotes"],
    },
    resp: {
      past: "past hires", model: "model", ranked: "new applicants", copies: "it learned the pattern, bias included",
      chatbot: "chatbot", paste: "summarize this CV:", card: ["phone number", "home address", "ID number"], where: ["stored where?", "used for\ntraining?", "seen by whom?"],
      leakCaption: "know where data goes before you share it",
      application: "application", denied: "rejected", why: "why?", noReason: "no reason anyone can check",
      suggests: "AI suggests", reject: "reject", override: "overruled", person: "a person checks", decision: "decision", interview: "interview", owner: "someone owns it, and answers for it",
    },
  },
};
