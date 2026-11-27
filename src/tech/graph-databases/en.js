// Graph databases: the idea and the words inside its drawings.
export default {
  ideas: {
    "graph-databases": { title: "Graph databases", gist: "Store things as dots and their connections as lines, then ask questions by following the lines.", panels: [
      ["A database of connections", "Many databases keep data in tables, like a spreadsheet. A graph database stores things as dots and the connections between them as lines, so who is linked to whom is part of the data itself. “Graph” here means a network, not a chart. Neo4j is a well-known example."],
      ["Dots are nodes", "Each dot is a node: one thing, such as Tom Hanks or the film Toy Story. A label says what kind of thing it is, like Person or Movie. A node can carry several labels: Tom Hanks is both a Person and an Actor."],
      ["Lines are relationships", "A relationship joins two nodes. It has a type, written in capitals, and points one way, so it reads like a sentence: Tom Hanks ACTED_IN Toy Story. You can still follow it backwards, from the film to its cast."],
      ["Details on dots and lines", "Nodes and relationships can both hold details, stored as name and value pairs called properties: Tom Hanks was born in 1956, Toy Story came out in 1995. The role of Woody sits on the line, because it belongs to the connection, not to the actor or the film alone."],
      ["Why not just use tables?", "A table database keeps people, films and who acted in what in separate tables, matched up by ID numbers. Every extra step, like co-stars of co-stars, means another round of matching. A graph stores each connection with its nodes, so the database just follows the line."],
      ["Ask by sketching the pattern", "To ask a question, you draw the shape you’re looking for in text. Round brackets are nodes and an arrow is a relationship: (p:Person)-[:ACTED_IN]->(m:Movie). The database finds every place in the graph that fits, here everyone who acted in Toy Story. This query language is called Cypher."],
      ["Walk out several steps", "From Tim Allen, the database can follow lines to the films Tim Allen was in, then to their casts, then to those actors’ other films, ring after ring. In the pattern you only write how many steps to take, such as *1..4 for one to four. With tables, each ring would be another round of matching."],
      ["Six degrees of Kevin Bacon", "A party game asks how to link any actor to Kevin Bacon through shared films. Ask a graph for the shortest path and it finds a route with the fewest steps between two nodes: Tim Allen was in Toy Story with Tom Hanks, who was in Apollo 13 with Kevin Bacon. Route planners and social networks ask the same kind of question."],
      ["“People who liked this also liked…”", "A recommendation is a short walk: from you to a film you rated highly, back to other people who rated it highly, then on to what else they liked. It’s one pattern to write, and the database only walks the lines near you, not through every film it holds."],
      ["Add data without making copies", "CREATE always adds a new node, even if the same one is already there: run it twice and you have two Toy Storys. MERGE looks first and only adds what’s missing, so running it again changes nothing. When you’re not sure what’s already in the graph, use MERGE."],
      ["Find the starting point fast", "Following lines is quick, but first the database has to find where to start, such as the node for Tom Hanks. Without help it checks every node, like reading a whole book to find one name. An index works like the one at the back of a book and jumps straight there."],
      ["When a graph is the right choice", "Pick a graph when your questions are about connections: who knows whom, what links to what, how to get from A to B. Fraud teams use one to spot groups of accounts that share a phone number and an address. If you mostly add up columns, like monthly sales, a table database is simpler."],
    ], links: {
      intro: "What a graph database is: nodes, relationships and properties, with more examples",
      cheat: "Every part of the Cypher query language on one page, with short examples",
      manual: "How Cypher works, from simple patterns to paths",
      wiki: "How graph databases differ from table databases, and where they came from",
    }},
  },

  /* words inside the drawings (draw.js) */
  art: {
    graph: {
      intro: "things are dots, connections are lines",
      genre: "Animation", labelCap: "a label says what kind of thing it is",
      type: "type", dir: "direction", sentence: "“Tom Hanks acted in Toy Story”", reads: "it reads like a sentence",
      props: "details sit on the dots and on the lines",
      people: "people", films: "films", cast: "who acted where", match: "match IDs at every step", follow: "just follow the line",
      found: "found:", fits: "every place the pattern fits",
      rings: "each step reaches one more ring",
      fewest: "the fewest steps between two dots",
      you: "you", other: "Alice", suggest: "for you?", walk: "a short walk from you, not a search of every film",
      twice: "run twice", dup: "two copies", always: "always adds", one: "still one", ifMissing: "adds only if missing",
      idx: "index", scan: "check every node", scanSub: "like reading the whole book", jump: "jump straight there", jumpSub: "like the index of a book",
      phone: "phone", addr: "address", graphQ: "connections? a graph", graphSub: "who shares what", tableQ: "totals? a table", tableSub: "add up a column",
      months: ["Jan", "Feb", "Mar"], total: "total",
    },
  },
};
