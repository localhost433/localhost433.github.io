---
title: "From Class Diagram to Code"
date: "2026-07-13"
---

## Where this note lands

[Note 14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams) built the class diagram — the boxes, the compartments, the visibility marks — and derived one from a sequence diagram. L15 asks the two questions that come next. First, *what kinds of objects* does a design need before any domain thinking starts? That is the boundary/control/entity split. Second, and the bulk of the lecture: once a relationship is drawn between two boxes, *what Java does it compile to?* Every edge in the notation — the plain line, the two diamonds, the two triangles, the dashed arrow — is a specific, mechanical shape of code, and the translation runs in both directions on an exam.

Notation basics are not repeated here; for the class box anatomy, visibility symbols, and multiplicity, go back to [note 14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams).

## Three kinds of objects: boundary, control, entity

Before nouns and verbs pick the *domain* classes, a design already knows the *roles* its objects will play. A concrete way in — before L15's abstract boxes — is to re-read the coffee shop from [note 13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams) as a staffing chart: the cashier and receptionist face the customer (they take input and hand back output), the barista does the coordinating work in the middle, and the order records are the data everyone works on. Software gets the same three stereotypes:

- **Boundary objects** sit at every edge where the system touches the outside — the input forms and output views on the user side, *and* the connection object on the database side. Boundary is not a synonym for UI: anything the system talks to that isn't itself gets a boundary object at the wall.
- **Control objects** orchestrate. A handler receives what the boundary collected, decides what to do, fans out to the data, and routes the result back. There is often exactly one per use case.
- **Entity objects** are the data — the things the system remembers, the objects a DBMS would persist.

```artifact src=demos/bce-three-layer.jsx static
```

The slice lines matter more than the boxes: input/output at the walls, coordination in the middle, data behind it. When note 16 argues about *responsibility*, this is the picture it will lean on — a class that spans two slices is usually doing too much.

## Finding the classes: grammar first, then CRC cards

Where do the entity classes come from? L15's answer is disarmingly mechanical: read the requirements as *grammar*. Nouns usually map to classes, objects, or attributes; verbs usually map to operations or relationships — and the kind of verb picks the kind of relationship.

```artifact src=demos/noun-verb-analysis.jsx static
```

The grammar pass over-generates, so a second, human pass prunes it: **CRC cards** (Class, Responsibility, Collaborator). One index card per candidate class; on it, what the class *knows and does*, and *who it works with*. Users and developers walk the scenarios together against the cards, and every walk-through either confirms a card, adds a responsibility, or throws a card away. Grammar proposes; the walk-through disposes.

## Every edge is a shape of Java

The core of L15. Six relationships, six mechanical translations — step through them:

```artifact src=demos/uml-code-relationships.jsx
```

The whole table hangs on one question: **where does the reference live?**

| Relationship | Edge | Java |
|---|---|---|
| Generalization | solid line, hollow triangle at parent | `class Employee extends Person` |
| Realization | *dashed* line, hollow triangle at interface | `class Shape implements Drawable` |
| Association | plain line | a **field**: `Address a;` |
| Aggregation | *hollow* diamond at the whole | a collection field: `List<Worker> workers;` — parts built elsewhere, parts outlive the whole |
| Composition | *filled* diamond at the whole | the part declared **inside** the whole: `class Hand` nested in `Person`, plus `List<Hand> hands;` — parts die with the whole |
| Dependency | dashed open arrow | **no field at all** — the class appears only inside a method, as a local `new` *or* as a parameter |

Three pairs of traps, each resolved by one detail:

- `extends` vs `implements` is the **line style**: solid triangle → class parent, dashed triangle → interface.
- Hollow vs filled diamond is the **lifetime claim**: can the parts outlive the whole (fire the manager, keep the workers) or not (no hand without its person)? The lecture's composition code makes the filled diamond literal — the part's class is *declared inside* the whole.
- Association vs dependency is **field vs method**: the same `Random r` is a plain-line association as a field, and a dashed dependency as a local or a parameter. Dependency has *two* code forms — `Random r = new Random();` inside the method body, or `someMethod(Random r)` taking it as a parameter — and both draw the same dashed arrow.

## The chain, end to end: the calculator

L15 closes by running the whole pipeline on one example — a calculator GUI with two input fields, a result label, and `+` `−` `×` buttons. First the requirements view:

```artifact src=demos/calculator-use-case.jsx static
```

Each use case is realized as a sequence diagram. Here is *Add*; *Sub* and *Multiply* are the same diagram with one message renamed:

```artifact src=demos/calculator-sequence.jsx static
```

Note what `MainGUI` does with its `Mathematician`: it *constructs* it mid-interaction (`new()`), uses it for one call, and lets it go. That single fact in the Interaction view decides an edge in the Structural view. Reading the participants off as classes:

```artifact src=demos/calculator-class-diagram.jsx static
```

The edge from `MainGUI` to `Mathematician` is a **dashed dependency**, not an association — because the sequence diagram showed the reference living inside the handler, not in a field. That is traceability: nothing in the class diagram is invented; every box and every edge is *evidence* from the diagrams upstream. (And the three isomorphic sequence diagrams are the same duplication smell [note 14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams) refactored away in the converter — one `do_operation(op, n1, n2)` would collapse them.)

## What to retain from L15

- Three object stereotypes: **boundary** at every edge (UI *and* DB connection), **control** orchestrating in the middle, **entity** holding the data.
- Class discovery is grammar plus walk-through: **nouns → classes/attributes, verbs → operations/relationships**, then **CRC cards** to prune.
- Each UML edge is a mechanical Java shape — and the discriminating question is **where the reference lives**: parent list (`extends`/`implements`), field (association/aggregation/composition), or method (dependency).
- Dependency has **two code forms**: method-local `new`, or a parameter.
- Composition's filled diamond can be made literal by **nesting the part's class inside the whole**.
- The use case → sequence → class chain is **traceable**: the sequence diagram's `new()` is *why* the class diagram's edge is dashed.

## Practice

The reverse drill — given Java, name the edge. The association/dependency boundary is where the marks are lost:

```artifact src=demos/practice-15-relation.jsx
```

And the concepts around the translation — stereotypes, grammar, CRC, traceability:

```artifact src=demos/practice-15-mcq.jsx
```

---

> Where this sits in the course: this is the bridge note — the point where the UML unit ([12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams), [13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams), [14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams)) touches back down into the Java built in notes [05](note.html?course=CSCI-UA-470&note=05-inheritance)–[09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java). Every edge in a class diagram is a commitment to a specific shape of code. [Note 16](note.html?course=CSCI-UA-470&note=16-solid) asks the follow-up: of all the designs the notation *can* express, which ones *should* you draw?
