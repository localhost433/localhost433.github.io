---
title: "Creational Design Patterns"
date: "2026-07-22"
---

## From principles to a catalog

[Note 16](note.html?course=CSCI-UA-470&note=16-solid) ended on a question it deliberately left open: of all the designs the notation *can* express, which ones survive their next requirement? SOLID answers with five rules. L18 answers with something more concrete — a **catalog**. A design pattern is a named, reusable solution to a problem that keeps recurring: not code you copy, but a shape you recognise, with a name both people in the conversation already know.

The deck's own roadmap puts it third in a sequence: **OOP → SOLID → Design patterns**. The pillars gave you the machinery, SOLID gave you the judgment, and the catalog gives you the vocabulary. It splits three ways:

```artifact src=demos/pattern-taxonomy.jsx static
```

L18 covers the first column. Every creational pattern is an answer to the same question — *who decides which object exists, and when* — and each takes the `new` keyword out of the place you would naively put it.

## 1 · Singleton

Some things should exist once: the connection pool, the logger, the loaded configuration. Saying so in a comment achieves nothing — the pattern's whole content is making a second object *impossible* rather than *discouraged*, and it does that with two access marks and one static door.

```artifact src=demos/pattern-singleton.jsx
```

Note the two marks and what each buys. The **private constructor** — [access specifiers](note.html?course=CSCI-UA-470&note=access-and-friendship) used for the first time as a design tool rather than as encapsulation — is what the compiler enforces: `new Singleton()` outside the class does not compile, so `getInstance()` is not merely the recommended door, it is the only one. The **static** field and method ([statics](note.html?course=CSCI-UA-470&note=statics-cpp)) are what make the door reachable: before the first call there is no object, so there is nothing to put on the left of the dot, and the accessor has to belong to the class. In UML a static member is shown **underlined** — [note 14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams)'s notation table, drawn here for the first time in this course.

The claim "`s1`, `s2`, and `s3` are the same object" is a claim about *addresses*, and it is worth watching in memory:

```artifact src=demos/pattern-singleton-heap.jsx
```

The static field lives in **Global / Static**, with the class; the object lives on the **heap**; and `s1`/`s2`/`s3` are three stack slots holding three copies of one address. This is [note 02](note.html?course=CSCI-UA-470&note=02-pointers-memory)'s aliasing, one design level up — and the reason `s1 == s2` is `true` under `==`, which compares references, and not a statement about equal field values.

## 2 · Factory

The problem is a decision the source code cannot make. The user picks a shape, the file extension names a parser, the config names a database — the concrete class is only known while the program runs, and the naive answer is an if-chain in the client that must be repeated in every client and reopened for every new product.

```artifact src=demos/pattern-factory.jsx
```

The deck crosses out **two** designs, and the second is the interesting one: a bare `Shape` / `Circle` / `Rect` / `Triangle` hierarchy, handed to the client with no creation abstraction, is *also* rejected. The hierarchy is what makes the products interchangeable once you hold one; it does nothing about the moment you have to choose. Both halves are needed, and the factory is the half [note 09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java) never supplied.

> **Beyond the slide —** what the deck calls Factory is what the catalog calls **Simple Factory** (or a *static factory method*): one class with a static method that switches on a parameter. The Gang of Four's **Factory Method** is a different shape — an abstract `Creator` class declares `createProduct()`, and each concrete creator subclass overrides it, so the choice is made by *which creator you are holding* rather than by an argument. Use the lecture's version on the exam; recognise the other one when you meet it in a codebase.

## 3 · Abstract Factory

One factory serves one hierarchy. When a program needs *several* hierarchies that must stay consistent with one another — a whole look-and-feel, a whole game theme, a whole database dialect — you need the same door once per family:

```artifact src=demos/pattern-abstract-factory.jsx
```

The exam-usable difference is a count. **One** product hierarchy behind the door is Factory. **Several related** hierarchies, each behind its own matching door, is Abstract Factory — and the word doing the work is *related*: the point is not that there are more products, it is that choosing the factory commits you to a matched set. A `MedievalFactory` guarantees the sword never turns up beside a laser rifle; two independent factories could not promise that.

> **Beyond the slide —** the deck draws three *unrelated* factory classes side by side. The catalog's Abstract Factory adds the piece that makes the name make sense: an abstract factory **interface** (`GUIFactory` with `makeButton()`, `makeMenu()`), realised by one concrete factory per family (`WinFactory`, `MacFactory`). The client then holds a `GUIFactory` and never names a concrete factory either — the abstraction goes one level higher than the slide shows.

## What to retain from L18

| Topic | Key test point |
|---|---|
| What a pattern is | a **named, reusable design**, not reusable code — the value is that both people already know the name |
| The three categories | Creational (how objects get **made**), Structural (how they are **composed**), Behavioral (how they **talk**) |
| Singleton intent | *only one instance of a class* — and one global point of access to it |
| Singleton mechanism | **private** constructor + **private static** field + **public static** `getInstance()` with lazy init |
| Singleton gotcha | `new Singleton()` from outside is the slide's red **KO** — a *compile* error, not a runtime one |
| Static in UML | a static member is **underlined** in the class box; `getInstance()` must be static because there is no object to call it on yet |
| Singleton in memory | the field is class-level storage; the object is on the heap; every client holds a copy of one address, so `==` is `true` |
| Factory intent | *generate an object chosen at runtime* — the concrete class is not known when the source is written |
| Factory rejects | (1) a client hardcoding its own creation ladder, **and** (2) a bare hierarchy with no creation abstraction |
| Factory mechanism | `ShapeFactory.getShape(type)` / `getRandomShape()`, both returning the **abstract** product type |
| Factory ↔ SOLID | it is Open–Closed applied to construction; the if-chain is **relocated to one place**, not eliminated |
| Abstract Factory intent | *a family of related objects without naming their concrete classes* |
| Factory vs Abstract Factory | count the **hierarchies**: one → Factory, several related ones with matching doors → Abstract Factory |

## Practice

Three patterns is too few for a naming quiz, so the drill is telling the neighbours apart. Two pairs are built to collide: one product hierarchy versus several related families, and a genuine Singleton versus a static utility class that merely looks like one. Labels are reused, so counting matters more than elimination. Check is one-shot — commit before you grade.

```artifact src=demos/practice-19-creational-match.jsx
```

Then produce the notation rather than recognise it. Build the Singleton box: two of its three visibility marks are the entire enforcement mechanism, and the one people stamp wrong is the constructor, because every constructor they have ever written was public.

```artifact src=demos/practice-19-singleton-classbox.jsx
```

And the graded pass — the reasons behind each mark, the compile-versus-runtime distinction the KO line turns on, and the counting rule that separates the two factories:

```artifact src=demos/practice-19-mcq.jsx
```

---

> Where this sits in the course: the catalog opens here. Notes [05](note.html?course=CSCI-UA-470&note=05-inheritance)–[09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java) built the machinery these patterns are made of, notes [12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams)–[14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams) built the notation they are drawn in, and [note 16](note.html?course=CSCI-UA-470&note=16-solid) supplied the judgment that says why each one is worth the extra class. Creational patterns answer *how the object gets made*; [the structural note (L19)](note.html?course=CSCI-UA-470&note=20-structural-patterns) takes up how objects are **composed**, and [the behavioral note (L20)](note.html?course=CSCI-UA-470&note=21-behavioral-patterns) how they **talk**.
