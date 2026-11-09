# Neo4j Cheat Sheet

Neo4j is a graph database that stores data as **nodes**, **relationships**, and **properties** — instead of tables and rows. This makes it natural to model and query connected data.

---

## Table of Contents

- [Neo4j Cheat Sheet](#neo4j-cheat-sheet)
  - [Table of Contents](#table-of-contents)
  - [Nodes](#nodes)
  - [Labels](#labels)
  - [Relationships](#relationships)
  - [Properties](#properties)
  - [MATCH](#match)
  - [MATCH with Relationships](#match-with-relationships)
  - [RETURN Tabular Data](#return-tabular-data)
  - [CREATE](#create)
  - [MERGE](#merge)
  - [MERGE with Relationships](#merge-with-relationships)
  - [SET and REMOVE](#set-and-remove)
  - [DELETE and DETACH DELETE](#delete-and-detach-delete)
  - [WHERE Filtering](#where-filtering)
  - [ORDER BY, SKIP, and LIMIT](#order-by-skip-and-limit)
  - [Aggregation](#aggregation)
  - [WITH](#with)
  - [OPTIONAL MATCH](#optional-match)
  - [Variable-Length Paths](#variable-length-paths)
  - [Indexes and Constraints](#indexes-and-constraints)

---

## Nodes

Nodes are the circles in a graph. They represent objects or entities in the data model.

![Nodes example](Neo4j CheatSheet_images/page2_img1.png)

> Example nodes: Michael, Neo4j, Sweden

---

## Labels

Labels categorize nodes and describe what they are. A node can have multiple labels.

![Labels example](Neo4j CheatSheet_images/page3_img1.png)

> In the example above, `Michael` has both the `Person` and `Employee` labels, `Neo4j` has the `Company` label, and `Sweden` has the `Location` label.

---

## Relationships

Relationships are the lines connecting nodes. They always have a **direction** and a **type** (written in `UPPER_SNAKE_CASE`).

![Relationships example](Neo4j CheatSheet_images/page4_img1.png)

> In the example: `Michael -[WORKS_AT]-> Neo4j` and `Neo4j -[FOUNDED_IN]-> Sweden`

---

## Properties

Properties are key-value pairs stored on nodes or relationships.

![Properties example](Neo4j CheatSheet_images/page5_img1.png)

**Node properties example:**

-   `Michael` (Person, Employee): `firstName: "Michael"`, `lastName: "Faraday"`, `born: "1791-09-22"`
-   `Neo4j` (Company): `name: "Neo4j"`, `website: "neo4j.com"`
-   `Sweden` (Location): `name: "Sweden"`, `capital: "Stockholm"`

**Relationship property example:**

-   `WORKS_AT` has a property `position: "Engineer"`

---

## MATCH

`MATCH` is used to find nodes and relationships in the graph. Use `WHERE` to filter, and `RETURN` to output results.

![MATCH example](Neo4j CheatSheet_images/page6_img1.jpeg)

```cypher
MATCH (n:Person)
WHERE n.name = 'Tom Hanks'
RETURN n
```

> Finds the `Person` node where `name` equals `'Tom Hanks'` and returns it as a graph.

---

## MATCH with Relationships

You can traverse relationships in a `MATCH` clause using the pattern `(a)-[r:TYPE]->(b)`.

![MATCH with relationships example](Neo4j CheatSheet_images/page7_img1.jpeg)

```cypher
MATCH (m:Movie)<-[r:ACTED_IN]-(p:Person)
WHERE m.title = 'Toy Story'
RETURN m, r, p
```

> Finds all `Person` nodes who `ACTED_IN` the movie `'Toy Story'` and returns the movie, the relationship, and the people (e.g. Tom Hanks, Tim Allen, Don Rickles, Jim Varney).

---

## RETURN Tabular Data

Instead of returning full nodes, you can return specific properties as a table.

![Tabular data example](Neo4j CheatSheet_images/page8_img1.jpeg)

```cypher
MATCH (m:Movie)-[r:IN_GENRE]->(g:Genre)
RETURN m.title AS title, g.name AS genre
```

> Returns a flat table of movie titles and their genres instead of full node objects.

---

## CREATE

`CREATE` always creates a new node or relationship, even if an identical one already exists. Use it when you know the data doesn't exist yet.

```cypher
-- Create a node
CREATE (p:Person {name: "Ada Lovelace", born: 1815})

-- Create a relationship between two existing nodes
MATCH (p:Person {name: "Ada Lovelace"}), (c:Company {name: "Neo4j"})
CREATE (p)-[:WORKS_AT {position: "Engineer"}]->(c)
```

> Unlike `MERGE`, `CREATE` never checks for duplicates — it always inserts.

---

## MERGE

`MERGE` finds a node if it exists, or creates it if it doesn't. Use `SET` to update properties after the merge.

![MERGE example](Neo4j CheatSheet_images/page9_img1.jpeg)

```cypher
MERGE (m:Movie {title: "Arthur the King"})
SET m.year = 2024
RETURN m
```

> If a `Movie` node with `title: "Arthur the King"` already exists, it returns it. Otherwise, it creates it. Then sets the `year` property to `2024`.

---

## MERGE with Relationships

You can use multiple `MERGE` statements together to create nodes and relationships in one query.

![MERGE with relationships example](Neo4j CheatSheet_images/page10_img1.jpeg)

```cypher
MERGE (m:Movie {title: "Arthur the King"})
MERGE (u:User {name: "Alice"})
MERGE (u)-[:RATED {rating: 5}]->(m)
RETURN m, u
```

> Ensures the movie, the user, and the `RATED` relationship between them all exist. If any part is missing, it gets created. The relationship also stores the `rating: 5` property.

---

## SET and REMOVE

`SET` adds or updates properties on a node or relationship. `REMOVE` deletes a property or label.

```cypher
-- Update a property
MATCH (p:Person {name: "Tom Hanks"})
SET p.oscars = 2
RETURN p

-- Add a label
MATCH (p:Person {name: "Tom Hanks"})
SET p:Actor
RETURN p

-- Remove a property
MATCH (p:Person {name: "Tom Hanks"})
REMOVE p.oscars
RETURN p

-- Remove a label
MATCH (p:Person:Actor {name: "Tom Hanks"})
REMOVE p:Actor
RETURN p
```

---

## DELETE and DETACH DELETE

`DELETE` removes a node or relationship. A node must have no relationships before it can be deleted — use `DETACH DELETE` to delete a node and all its relationships in one step.

```cypher
-- Delete a relationship
MATCH (p:Person {name: "Alice"})-[r:RATED]->(m:Movie)
DELETE r

-- Delete a node (must have no relationships)
MATCH (p:Person {name: "Alice"})
DELETE p

-- Delete a node and all its relationships
MATCH (p:Person {name: "Alice"})
DETACH DELETE p
```

---

## WHERE Filtering

`WHERE` supports a range of operators for filtering query results.

```cypher
-- Comparison
MATCH (m:Movie)
WHERE m.year > 2000
RETURN m.title

-- Multiple conditions
MATCH (p:Person)
WHERE p.name STARTS WITH 'Tom' AND p.born > 1960
RETURN p.name

-- String operators: STARTS WITH, ENDS WITH, CONTAINS
MATCH (m:Movie)
WHERE m.title CONTAINS 'King'
RETURN m.title

-- IN list
MATCH (p:Person)
WHERE p.name IN ['Tom Hanks', 'Tim Allen']
RETURN p

-- Null checks
MATCH (p:Person)
WHERE p.born IS NOT NULL
RETURN p.name, p.born
```

---

## ORDER BY, SKIP, and LIMIT

Use these clauses to sort and paginate results.

```cypher
-- Sort results
MATCH (m:Movie)
RETURN m.title, m.year
ORDER BY m.year DESC

-- Pagination: skip the first 10, return the next 5
MATCH (m:Movie)
RETURN m.title
ORDER BY m.title
SKIP 10
LIMIT 5
```

---

## Aggregation

Aggregation functions collapse multiple rows into a single result. Common functions: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `COLLECT`.

```cypher
-- Count movies per genre
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
RETURN g.name AS genre, COUNT(m) AS total
ORDER BY total DESC

-- Collect all movie titles into a list
MATCH (p:Person {name: "Tom Hanks"})-[:ACTED_IN]->(m:Movie)
RETURN p.name, COLLECT(m.title) AS movies

-- Average rating
MATCH (:User)-[r:RATED]->(m:Movie {title: "Toy Story"})
RETURN AVG(r.rating) AS avgRating
```

---

## WITH

`WITH` pipes the output of one query stage into the next. It lets you filter, aggregate, or transform results mid-query before continuing.

```cypher
-- Filter after aggregation
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WITH p, COUNT(m) AS movieCount
WHERE movieCount > 5
RETURN p.name, movieCount
ORDER BY movieCount DESC

-- Chain multiple steps
MATCH (m:Movie)-[:IN_GENRE]->(g:Genre {name: "Action"})
WITH m
MATCH (p:Person)-[:ACTED_IN]->(m)
RETURN m.title, p.name
```

---

## OPTIONAL MATCH

`OPTIONAL MATCH` works like a LEFT JOIN — it returns `null` for parts of the pattern that don't exist, instead of dropping the entire row.

```cypher
MATCH (p:Person {name: "Tom Hanks"})
OPTIONAL MATCH (p)-[:DIRECTED]->(m:Movie)
RETURN p.name, m.title
```

> If Tom Hanks has no `DIRECTED` relationships, the query still returns his name with `null` for `m.title`. Without `OPTIONAL MATCH`, the row would be omitted entirely.

---

## Variable-Length Paths

Use `*min..max` to match relationships across a range of hops. Useful for traversing hierarchies, social graphs, or any deeply connected data.

```cypher
-- Match paths 1 to 3 hops deep
MATCH (a:Person {name: "Alice"})-[:KNOWS*1..3]->(b:Person)
RETURN b.name

-- Match any number of hops (use carefully — can be slow on large graphs)
MATCH (a:Person {name: "Alice"})-[:KNOWS*]->(b:Person)
RETURN b.name

-- Shortest path between two nodes
MATCH (a:Person {name: "Alice"}), (b:Person {name: "Bob"})
MATCH path = shortestPath((a)-[*]-(b))
RETURN path

-- All shortest paths
MATCH (a:Person {name: "Alice"}), (b:Person {name: "Bob"})
MATCH path = allShortestPaths((a)-[*]-(b))
RETURN path
```

---

## Indexes and Constraints

Indexes speed up `MATCH` lookups on specific properties. Constraints enforce data integrity.

```cypher
-- Create an index on a property
CREATE INDEX FOR (p:Person) ON (p.name)

-- Create a full-text index (for CONTAINS / STARTS WITH queries)
CREATE FULLTEXT INDEX movieTitles FOR (m:Movie) ON EACH [m.title]

-- Enforce uniqueness
CREATE CONSTRAINT FOR (p:Person) REQUIRE p.email IS UNIQUE

-- Enforce that a property must exist
CREATE CONSTRAINT FOR (m:Movie) REQUIRE m.title IS NOT NULL

-- List all indexes
SHOW INDEXES

-- List all constraints
SHOW CONSTRAINTS

-- Drop an index
DROP INDEX index_name

-- Drop a constraint
DROP CONSTRAINT constraint_name
```

> Always create indexes on properties you frequently filter by in `WHERE` clauses. Without them, Neo4j performs a full node scan.
