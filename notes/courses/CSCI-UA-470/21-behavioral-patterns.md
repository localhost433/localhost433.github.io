---
title: "Behavioral Design Patterns"
date: "2026-07-29"
---

## How objects talk

The catalog's third column, and the last one. [The creational note (L18)](note.html?course=CSCI-UA-470&note=19-creational-patterns) was about *how objects get made*; [the structural note (L19)](note.html?course=CSCI-UA-470&note=20-structural-patterns) about *how they are composed*; L20 is about **who calls whom, and when** — the responsibilities each object holds and the messages that pass between them.

| Pattern | The deck's intent |
|---|---|
| **Template Method** | *Define a skeleton of an algorithm* |
| **Strategy** | *Define a family of approaches & make them interchangeable* |
| **State** | *Let an object alter its behavior when changing state* |
| **Command** | *Decouple object that invokes the operation from execution* |
| **Mediator** | *Reduce chaotic dependencies between objects* |
| **Observer** | *Many objects need to receive an update* |
| **Chain of Responsibilities** | *Avoid coupling between request & receiver; enables adding and removing receivers freely* |
| **Iterator** | *Get the next Item of a collection* |

Two warnings before the detail, because this lecture's structure is unusually deceptive. Three of these eight are drawn with the **same class diagram** and even the same method name, and two more are near-twins. Recognising the picture will not get you to the answer here; recognising the *intent* will.

## 1 · Template Method

Several sorters share the same four-step sequence and differ in one step each. Copying the sequence into every subclass duplicates the part that never varies in order to vary the part that does.

```artifact src=demos/pattern-template-method.jsx
```

Start here because it is the odd one out. Every other pattern in this lecture varies behaviour by **holding an object**; Template Method varies it by **being a subclass**. The consequence is practical: a `Sorter` subclass is decided the moment the object is constructed and cannot change afterwards, while all seven of its neighbours can be handed something different at run time.

The protected thing is the *order*. `run()` lives in the parent and is never overridden, so a subclass can fill a hole but cannot reorder, skip, or add a step — which is exactly what you want when the sequence is the part that must not vary.

## 2–4 · Strategy, State, and Command

L20 draws these three with an identical class diagram: a context holding a field of an abstract type, three concrete subclasses, and one delegating call — named `run()` in all three. Rather than repeat the same figure three times, here it is once, with a knob for the cast:

```artifact src=demos/pattern-trio.jsx
```

Switch the knob and only the words change. The boxes, the arrows, the delegating call, and even the shape of the rejected design are the same in all three.

### Telling the trio apart

Since structure decides nothing, the questions have to be about intent. Two of them do all the work: **who chooses**, and **what the choice is for**.

| | Who chooses the object | What it is for | The tell |
|---|---|---|---|
| **Strategy** | the **client**, from outside | interchangeable ways of doing **one job** | each option is a complete, valid answer on its own; the options never mention each other |
| **State** | the object's **own lifecycle** | the same call behaving differently **over time** | one `receiveSMS()`, three answers — the `Phone` rings in `Normal`, stays quiet in `Silent`, buzzes in `Vibrate` |
| **Command** | whoever **issues** the request | making the request an **object**, so invoker and receiver never meet | the request travels: `s1.setCommand(new Drive())` hands the soldier an object, not a string |

Two follow-ups that settle most disputed cases. *Reassignability proves nothing:* a strategy picked from a dropdown is reassigned too, so the question is whether the change comes from **outside** as a preference or from **inside** as a lifecycle event. And *collection is decisive:* Strategy and State objects are held one at a time by a context; nobody keeps a list of them. If a design collects its behaviour objects, it is Command.

> **Beyond the slide —** the shared `run()` is the lecture's own choice, not the catalog's. GoF names them for what they do: `Strategy.execute()` (or `doAlgorithm`), `Command.execute()` (usually paired with `undo()`), and a State whose methods are named after the events it handles — `insertCoin()`, `selectItem()` — precisely because a state reacts to events rather than performing one job. Two more provenance notes: the slide's own client sets the state from *outside* (`p.setState(new Vibrate())`) — states that **transition themselves** are the catalog's tell, not the deck's; and the deck never actually *stores* a command — queued, logged, replayed, undone is what the catalog buys with the same shape. The naming difference is a symptom of the intent difference the UML cannot show.

## 5 · Mediator

A room full of objects that each need to reach the others. Wire them directly and every one of them carries a list of everyone else.

```artifact src=demos/pattern-mediator.jsx
```

The deck draws the rejected half as a scribble of crossing arrows. Written out it is worse than it looks: with every peer holding the membership list, *n* colleagues need *n(n−1)* references, and adding a fifth means editing the four that already exist. Route everything through a hub and it becomes *n* references held by one object whose entire job is knowing who is in the room.

## 6 · Observer

One value changes and several unrelated things need to hear about it — a chart, an alert box, an audit log. Naming them inside the object that changed means editing it every time the list does.

```artifact src=demos/pattern-observer.jsx
```

### Mediator vs. Observer

The two UML pictures are nearly the same — a hub holding a list of a role type, an interface, three implementers, and a notify loop. The differences are real but small, and they are about **direction**:

| | Shape | Who registers | The loop |
|---|---|---|---|
| **Mediator** | many-to-many collapsed to a hub — peers who would otherwise talk to *each other* | whoever builds the room | skips the **sender**: a colleague does not receive its own message |
| **Observer** | one-to-many — one source announcing to listeners | the **listener**, via `subscribe` / `unsubscribe`, at run time | notifies everyone; there is no sender to exclude |

A quick test on an unfamiliar design: ask whether the participants would be talking *to each other* if the hub were removed. Chat members would; spreadsheet cells watching a value would not — they would just stop hearing about it.

You have met the Observer shape before, from the interaction side: [note 13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams)'s MVC drill has a Model pushing an asynchronous `notify()` to its View. That async arrow is the same idea drawn as a message rather than as classes.

## 7 · Chain of Responsibilities

A student's request has to climb the department's ladder — Secretary, Chair, Dean, Assistant — until it reaches someone authorised to settle it, and the deck's point is that the ladder is different for different kinds of request. Hard-coding one ladder per scenario means the sender knows every possible handler, and the order they come in.

```artifact src=demos/pattern-chain.jsx
```

The payoff is the client half, and the deck spends three whole panels on it: **three different chains built from the same four classes**, by reassigning `nextHandler` fields — the last one even wires the Secretary in as the *final* rung. The chain is *data*, so it can come from a config file, differ per request type, or be rebuilt while the program runs — which is what the second bullet of the intent is promising.

What makes this a chain rather than ordinary delegation is a field whose type is the class's own abstract parent. That self-reference is the same trick [L19's Composition](note.html?course=CSCI-UA-470&note=20-structural-patterns) uses to recurse; here it makes the structure extensible to any length instead of any depth.

## 8 · Iterator

A collection can be walked in more than one order, and each new order somebody asks for arrives as another method on the collection — with another cursor field to go with it.

```artifact src=demos/pattern-iterator.jsx
```

The rejected design is **interface bloat** rather than an if-chain: a collection that grew one method per question anyone ever asked of it, and one cursor field per method. Holding items and walking them change for different reasons, so [note 16](note.html?course=CSCI-UA-470&note=16-solid)'s Single Responsibility says split them — and the split buys something the methods could never manage: each iterator owns **its own cursor**, so two walks can run over one collection at the same time.

This is also the pattern you have already been using. `java.util.Iterator` declares exactly `hasNext()` and `next()`, and a for-each loop is sugar that asks a collection for one and drives it.

## The one move behind almost all of them

Four of these eight begin from the same rejected design — a `String` field naming a mode, and a method that switches on it:

```java
if      (x.equals("A")) { … }
else if (x.equals("B")) { … }
else                    { … }
```

and all four fix it the same way: replace the `String` with a field of an **abstract type**, and replace the conditional with **one polymorphic call**. That is [note 09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java)'s v2→v3 step and [note 16](note.html?course=CSCI-UA-470&note=16-solid)'s Open–Closed fix, arriving for the fourth, fifth, sixth, and seventh time.

Which is worth stating plainly, because it is the exam's favourite question in disguise: **spotting** the smell is easy once you have seen it four times. **Naming** which of the four patterns it is requires the intent questions above, and nothing else will do it.

## What to retain from L20

| Topic | Key test point |
|---|---|
| The category | behavioral patterns are about **responsibility and message flow** — who calls whom, and when |
| Template Method | fixed skeleton in the parent, holes filled by **subclasses**; the only one that varies by inheritance |
| Template Method limit | the subclass is chosen at construction and cannot change; a Strategy can be swapped at run time |
| Strategy | the **client** picks an interchangeable way to do one job |
| State | the same call answers differently over time — the `Phone`'s `receiveSMS()` in `Normal` / `Silent` / `Vibrate` |
| Command | the request becomes an **object** handed to the invoker (`setCommand(new Drive())`) — invoker and executor never meet |
| Trio, the trap | all three share the same UML *and* the method name `run()`; only intent separates them |
| Trio, the tests | change from outside vs. inside (Strategy vs. State); held one at a time vs. collected (either vs. Command) |
| Mediator | many-to-many → hub-and-spoke; `broadcast` **skips the sender** |
| Observer | one-to-many; listeners opt in and out themselves with `subscribe` / `unsubscribe` |
| Mediator vs Observer | would the participants be talking *to each other* without the hub? Yes → Mediator, no → Observer |
| Chain of Responsibility | `nextHandler` is typed as the abstract **parent**; each handler knows only its successor |
| Chain payoff | the same handler classes rewire into different chains **at run time** — the chain is data |
| Iterator | traversal extracted into its own hierarchy; each iterator owns its **cursor**, so walks can run concurrently |
| Iterator in Java | `java.util.Iterator` is `hasNext()` / `next()`; for-each is sugar over it |
| The through-line | a `String` mode + an if-chain becomes a field of an abstract type + one polymorphic call |

## Practice

Begin with the collision this note is built around. Every scenario below would draw the same class diagram, so structure decides nothing and you have to reason from who chooses and what the choice is for. Two of the six are near-misses on purpose.

```artifact src=demos/practice-21-trio.jsx
```

Then the full naming pass over L20 — eight designs, eight names, each used exactly once, with Mediator and Observer sitting next to each other so the direction question has to be asked.

```artifact src=demos/practice-21-behavioral-match.jsx
```

Next, build one chain as a sequence diagram. The ordering is forced by the escalation rule, and assembling it makes visible what a description glosses over: the request climbs four rungs and the answer walks all the way back down.

```artifact src=demos/practice-21-chain-order.jsx
```

The graded pass, weighted toward the two collisions and the through-line:

```artifact src=demos/practice-21-mcq.jsx
```

And the closer — the whole catalog on one board. Eighteen labels, ten designs from all three lectures, and no promise that any label is used, so elimination is worthless. This is the shape a final actually takes.

```artifact src=demos/practice-21-catalog-match.jsx
```

---

> Where this sits in the course: the end of the catalog and of the design arc. The pillars ([the roadmap](note.html?course=CSCI-UA-470&note=18-oop-pillars-roadmap)) gave the machinery, the UML unit ([L12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams)–[L15](note.html?course=CSCI-UA-470&note=15-uml-to-code)) the notation, [SOLID](note.html?course=CSCI-UA-470&note=16-solid) the judgment, and the three pattern notes ([L18](note.html?course=CSCI-UA-470&note=19-creational-patterns), [L19](note.html?course=CSCI-UA-470&note=20-structural-patterns), this one) the named solutions those principles keep arriving at. For final review, the language rules are consolidated in [the Java/C++ comparison (L11)](note.html?course=CSCI-UA-470&note=17-java-cpp-systematic-comparison) and the whole design chain runs end to end on one program in the [Password Keeper](note.html?course=CSCI-UA-470&note=password-keeper).
