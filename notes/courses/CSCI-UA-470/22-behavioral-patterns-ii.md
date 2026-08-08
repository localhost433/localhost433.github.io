---
title: "Behavioral Patterns II — Taking It Out of the Object"
date: "2026-07-29/08-03"
---

## Four jobs that leave home

[Note 21](note.html?course=CSCI-UA-470&note=21-behavioral-patterns) covered the six behavioral patterns that vary what an object does by **holding another object** and swapping which one. These four work differently. In each of them a class was doing two things, and one of them moves out:

| Pattern | The deck's intent | What leaves the object |
|---|---|---|
| **Chain of Responsibilities** | *Avoid coupling between request & receiver; enables adding and removing receivers freely* | the **route** leaves the sender |
| **Iterator** | *Get the next Item of a collection* | the **cursor** leaves the collection |
| **Memento** | *Restore Object to its previous state* | the **state history** leaves the document |
| **Visitor** | *Add additional behavior to an entity without changing its structure* | the **operation** leaves the hierarchy |

That column on the right is the whole note. Each of these is [note 16](note.html?course=CSCI-UA-470&note=16-solid)'s Single Responsibility applied to a different thing an object had quietly taken on, and in each case the extracted job then gets to vary on its own axis — a new chain, a new traversal, a hundred levels of undo, a new operation — without the original class being reopened, which is Open–Closed arriving on the back of it.

The first two are L20's last pair; the second two are all of L21.

## 7 · Chain of Responsibilities

A student's request has to climb the department's ladder — Secretary, Chair, Dean, Assistant — until it reaches someone authorised to settle it, and the deck's point is that the ladder is different for different kinds of request. Hard-coding one ladder per scenario means the sender knows every possible handler, and the order they come in.

```artifact src=demos/pattern-chain.jsx
```

The payoff is the client half, and the deck spends three whole panels on it: **three different chains built from the same four classes**, by reassigning `nextHandler` fields — the last one even wires the Secretary in as the *final* rung. The chain is *data*, so it can come from a config file, differ per request type, or be rebuilt while the program runs — which is what the second bullet of the intent is promising.

What makes this a chain rather than ordinary delegation is a field whose type is the class's own abstract parent. That self-reference is the same trick [L19's Composition](note.html?course=CSCI-UA-470&note=20-structural-patterns) uses to recurse; here it makes the structure extensible to any length instead of any depth.

This is also the fourth if-chain the behavioral lectures reject, and the odd one out among them. The [trio](note.html?course=CSCI-UA-470&note=21-behavioral-patterns) switched on a `String` naming a mode; this one switches on *which handler to try next*, so the fix is not a field of an abstract type on one context but a field of the abstract type on **every** handler.

## 8 · Iterator

A collection can be walked in more than one order, and each new order somebody asks for arrives as another method on the collection — with another cursor field to go with it.

```artifact src=demos/pattern-iterator.jsx
```

The rejected design is **interface bloat** rather than an if-chain: a collection that grew one method per question anyone ever asked of it, and one cursor field per method. Holding items and walking them change for different reasons, so [note 16](note.html?course=CSCI-UA-470&note=16-solid)'s Single Responsibility says split them — and the split buys something the methods could never manage: each iterator owns **its own cursor**, so two walks can run over one collection at the same time.

This is also the pattern you have already been using. `java.util.Iterator` declares exactly `hasNext()` and `next()`, and a for-each loop is sugar that asks a collection for one and drives it.

## 9 · Memento

The deck opens L21 with a picture everyone recognises: a document, a filmstrip of past versions beside it, and ctrl+Z. The question is who owns the filmstrip.

```artifact src=demos/pattern-memento.jsx
```

Let a document keep its own history and it becomes two classes wearing one name — the text, and the bookkeeping of every past version of the text — which is [note 16](note.html?course=CSCI-UA-470&note=16-solid)'s SRP example almost word for word. The give-away is what happens to `undo()`: it has to know how to reverse every kind of edit the document will ever support, so it grows a branch per field.

Snapshots kill that. A `Memento` is the document's three fields and nothing else — no methods, no behaviour, a photograph — and a `CareTaker` keeps them in a list. `save()` pushes a copy; `undo()` pops the last one back into the document and drops it. Undo depth becomes a property of the caretaker's list, so ten levels costs ten mementos and zero new lines in `Document`.

The three roles have names worth learning, because the exam question is usually *which object is which*:

| Role | In the deck | Its one job |
|---|---|---|
| **Originator** | `Document` | holds the live state; can produce a snapshot and accept one back |
| **Memento** | `Memento` | is the snapshot — data, no behaviour |
| **Caretaker** | `CareTaker` | keeps the snapshots in order and hands the last one back |

> **Beyond the slide —** the deck gives `Memento` public fields, so anyone can read the document's private state out of one. The catalog's version is stricter, and the strictness is the point: a memento shows a **narrow interface** to the caretaker (who only stores it) and its full contents only to the originator (who made it). Otherwise the pattern buys undo by throwing away the encapsulation of [note 03](note.html?course=CSCI-UA-470&note=03-classes-objects). Read the deck's `undo()` closely and you will also find it writing into a `d` it never declares — the caretaker must already be holding the document, which is what the dashed dependency edge is recording.

### Memento vs. Command

[Note 21](note.html?course=CSCI-UA-470&note=21-behavioral-patterns) said that if a design **collects** its behaviour objects, it is Command. Memento is the qualification, and the two are genuinely hard to separate because from outside they are the same feature: a stack, and a pop that undoes something.

| | What is in the stack | What undo does |
|---|---|---|
| **Command** | the **request**, reified — an object with `run()` and `undo()` | asks the top entry to reverse itself |
| **Memento** | the **state the request changed** — fields, no methods | writes the top entry's fields back into the originator |

Two consequences follow, and either settles a disputed case. A Command stack can be **replayed** — run the list forward and you have redo, or a macro — while a memento stack cannot, because a photograph does not describe how the picture was taken. And a Command has to be written once per kind of edit, while one `Memento` class covers every edit there will ever be, at the cost of copying the whole state each time.

## 10 · Visitor

The deck starts by crossing something out. A `Shape` hierarchy exists, it works, and now the shapes need to be rotated — so `rotate()` goes on `Shape` and on all three subclasses. Then resizing. Then flipping. Four edits per feature, and the hierarchy is being reopened for a reason that has nothing to do with what a shape *is*.

```artifact src=demos/pattern-visitor.jsx
```

That is [note 16](note.html?course=CSCI-UA-470&note=16-solid)'s Open–Closed violation, and the fix is the same move as always — put the varying thing in its own hierarchy — with one twist that makes Visitor the hardest pattern in the course. The operation now lives in a `Visitor` class, so `Rotator` holds *everything* about rotating in one place. But a visitor has to know **which** shape it received in order to do anything, and that is where the twist is.

### The one line that makes it work

Every element class carries the same one-line method:

```java
void accept(Visitor v) { v.visit(this); }
```

It looks like pure duplication. It is not, and the reason is a rule from [note 06](note.html?course=CSCI-UA-470&note=06-polymorphism): Java binds a **method call** by the receiver's run-time type, but it binds an **overload** by the argument's declared type, at compile time. So `v.visit(s)` where `s` is declared `Shape` asks for a `visit(Shape)` and never sees the `Circle` inside. Writing the identical call inside `Circle.accept` puts it somewhere `this` is *statically* a `Circle` — and now the compiler can pick `visit(Circle)`.

Two dispatches, on two different objects, with a compile-time overload choice wedged between them. That is **double dispatch**, and it is worth stepping through rather than reading about:

```artifact src=demos/visitor-double-dispatch.jsx
```

Switch the last knob to `v.visit(s)` to see what the `accept` hop is actually buying. Without it there is one dispatch, the shape's type is gone by the time the visitor runs, and the nine method bodies collapse into three `instanceof` chains — the very design the pattern was bought to delete.

### The price

Visitor is the one pattern in the catalog that is openly a trade, and summaries tend to leave out the half that costs:

- A new **operation** is free. `Flipper` is one class; no shape is touched.
- A new **element** is expensive. `Pentagon` adds a declaration to `Visitor` and forces a body into every implementer of it.

So Visitor buys Open–Closed along one axis by spending it along the other. Reach for it when the hierarchy is settled and the list of things you do to it keeps growing — a compiler's syntax tree with a type checker, a code generator and a pretty-printer is the canonical case. Avoid it when new element kinds arrive faster than new operations.

The deck's second cast makes the same point sideways: a hospital's `Patient` is stable, while the professions that walk into the room are not. Switch the knob on the figure above and the shape of the answer does not change.

## What to retain from L20–L21

| Topic | Key test point |
|---|---|
| The category | these four **extract a job** from a class rather than swapping a held object |
| Chain of Responsibility | `nextHandler` is typed as the abstract **parent**; each handler knows only its successor |
| Chain payoff | the same handler classes rewire into different chains **at run time** — the chain is data |
| Iterator | traversal extracted into its own hierarchy; each iterator owns its **cursor**, so walks can run concurrently |
| Iterator in Java | `java.util.Iterator` is `hasNext()` / `next()`; for-each is sugar over it |
| Memento, the roles | Originator (`Document`) makes and accepts snapshots · Memento is data · CareTaker stores and never looks inside |
| Memento, the stack | `save` pushes a copy, `undo` pops the last one back — undo depth lives in the caretaker's list |
| Memento vs Command | both are a stack you pop; Command stores the **request** (and can replay), Memento the **state** (and cannot) |
| Visitor, the problem | a new operation reopens the abstract class **and** every subclass — Open–Closed, broken |
| Visitor, the hinge | `accept(v) { v.visit(this); }` in **every** element class; a shared one in the base binds `visit(Shape)` and loses the type |
| Double dispatch | receiver dispatch on the element, compile-time overload choice, receiver dispatch on the visitor |
| Java's rule underneath | late binding applies to the **receiver** of a call and never to an argument ([note 06](note.html?course=CSCI-UA-470&note=06-polymorphism)) |
| Visitor, the price | new operation = one class, free · new element = an edit in every visitor there is |
| The through-line | the route, the cursor, the state, the operation — SRP and Open–Closed, four more times |

## Practice

Start with Chain, as a sequence diagram. The ordering is forced by the escalation rule, and assembling it makes visible what a description glosses over: the request climbs four rungs and the answer walks all the way back down.

```artifact src=demos/practice-22-chain-order.jsx
```

Then the same exercise for one ctrl+Z. The data flow forces the order, and building it exposes the participant that is never asked anything.

```artifact src=demos/practice-22-memento-order.jsx
```

Next, Visitor's dispatch rules on their own, before any pattern naming. Two of these four are designs that look like they should work and do not, which is exactly how they appear on an exam.

```artifact src=demos/practice-22-dispatch.jsx
```

The graded pass over all four patterns, weighted toward the Memento/Command collision:

```artifact src=demos/practice-22-mcq.jsx
```

And the closer — the whole catalog on one board. Twenty labels, twelve designs from all four pattern lectures, and no promise that any label is used, so elimination is worthless. This is the shape a final actually takes.

```artifact src=demos/practice-22-catalog-match.jsx
```

---

> Where this sits in the course: the end of the catalog and of the design arc. The pillars ([the roadmap](note.html?course=CSCI-UA-470&note=18-oop-pillars-roadmap)) gave the machinery, the UML unit ([L12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams)–[L15](note.html?course=CSCI-UA-470&note=15-uml-to-code)) the notation, [SOLID](note.html?course=CSCI-UA-470&note=16-solid) the judgment, and the four pattern notes ([L18](note.html?course=CSCI-UA-470&note=19-creational-patterns), [L19](note.html?course=CSCI-UA-470&note=20-structural-patterns), [L20](note.html?course=CSCI-UA-470&note=21-behavioral-patterns), this one) the named solutions those principles keep arriving at. [L22](note.html?course=CSCI-UA-470&note=23-design-in-the-ai-era) steps back from the catalog to ask where all of it sits in a development process — and why the answer has changed shape. For final review, the language rules are consolidated in [the Java/C++ comparison (L11)](note.html?course=CSCI-UA-470&note=17-java-cpp-systematic-comparison) and the whole design chain runs end to end on one program in the [Password Keeper](note.html?course=CSCI-UA-470&note=password-keeper).
