---
title: "Behavioral Patterns I — Behaviour as an Object"
date: "2026-07-29"
---

## How objects talk

The catalog's third column, and its largest: ten patterns across two lectures. [The creational note (L18)](note.html?course=CSCI-UA-470&note=19-creational-patterns) was about *how objects get made*; [the structural note (L19)](note.html?course=CSCI-UA-470&note=20-structural-patterns) about *how they are composed*; L20 and L21 are about **who calls whom, and when** — the responsibilities each object holds and the messages that pass between them.

Ten is too many to hold at once, and they do not form one flat list. Six of them vary behaviour by **holding an object** and swapping which one; the other four work by **taking something out of the object** altogether — the route, the cursor, the state, the operation. This note is the first six. [Note 22](note.html?course=CSCI-UA-470&note=22-behavioral-patterns-ii) is the other four, and carries the closing exercise over the whole catalog.

| Pattern | The deck's intent |
|---|---|
| **Template Method** | *Define a skeleton of an algorithm* |
| **Strategy** | *Define a family of approaches & make them interchangeable* |
| **State** | *Let an object alter its behavior when changing state* |
| **Command** | *Decouple object that invokes the operation from execution* |
| **Mediator** | *Reduce chaotic dependencies between objects* |
| **Observer** | *Many objects need to receive an update* |

Two warnings before the detail, because this lecture's structure is unusually deceptive. Three of these six are drawn with the **same class diagram** and even the same method name, and two more are near-twins. Recognising the picture will not get you to the answer here; recognising the *intent* will.

## 1 · Template Method

Several sorters share the same four-step sequence and differ in one step each. Copying the sequence into every subclass duplicates the part that never varies in order to vary the part that does.

```artifact src=demos/pattern-template-method.jsx
```

Start here because it is the odd one out. Every other pattern in this note varies behaviour by **holding an object**; Template Method varies it by **being a subclass**. The consequence is practical: a `Sorter` subclass is decided the moment the object is constructed and cannot change afterwards, while all five of its neighbours here can be handed something different at run time.

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

Two follow-ups that settle most disputed cases. *Reassignability proves nothing:* a strategy picked from a dropdown is reassigned too, so the question is whether the change comes from **outside** as a preference or from **inside** as a lifecycle event. And *collection is decisive:* Strategy and State objects are held one at a time by a context; nobody keeps a list of them. If a design collects its behaviour objects, it is Command — with one qualification that arrives in [note 22](note.html?course=CSCI-UA-470&note=22-behavioral-patterns-ii), where Memento collects too, but collects *state* rather than requests.

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

## The one move behind almost all of them

Three of these six begin from the same rejected design — a `String` field naming a mode, and a method that switches on it:

```java
if      (x.equals("A")) { … }
else if (x.equals("B")) { … }
else                    { … }
```

and all three fix it the same way: replace the `String` with a field of an **abstract type**, and replace the conditional with **one polymorphic call**. That is [note 09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java)'s v2→v3 step and [note 16](note.html?course=CSCI-UA-470&note=16-solid)'s Open–Closed fix, arriving for the fourth, fifth, and sixth time.

A fourth instance is waiting in [note 22](note.html?course=CSCI-UA-470&note=22-behavioral-patterns-ii): Chain of Responsibility rejects an if-chain too, but over *handlers* rather than over a `String` mode — same conditional, different thing being switched on, and a different fix.

Which is worth stating plainly, because it is the exam's favourite question in disguise: **spotting** the smell is easy once you have seen it three times. **Naming** which of the three patterns it is requires the intent questions above, and nothing else will do it.

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
| The through-line | a `String` mode + an if-chain becomes a field of an abstract type + one polymorphic call |
| The other four | Chain, Iterator, Memento and Visitor are in [note 22](note.html?course=CSCI-UA-470&note=22-behavioral-patterns-ii) — they extract rather than swap |

## Practice

Begin with the collision this note is built around. Every scenario below would draw the same class diagram, so structure decides nothing and you have to reason from who chooses and what the choice is for. Two of the six are near-misses on purpose.

```artifact src=demos/practice-21-trio.jsx
```

Then the naming pass over these six — six designs, six names, each used exactly once, with Mediator and Observer sitting next to each other so the direction question has to be asked.

```artifact src=demos/practice-21-behavioral-match.jsx
```

The graded pass, weighted toward the two collisions and the through-line:

```artifact src=demos/practice-21-mcq.jsx
```

[Note 22](note.html?course=CSCI-UA-470&note=22-behavioral-patterns-ii) carries the closer for the whole catalog — twenty labels over twelve designs from all three lectures — once the last four patterns are in hand.

---

> Where this sits in the course: the catalog's last column, opened. The pillars ([the roadmap](note.html?course=CSCI-UA-470&note=18-oop-pillars-roadmap)) gave the machinery, the UML unit ([L12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams)–[L15](note.html?course=CSCI-UA-470&note=15-uml-to-code)) the notation, and [SOLID](note.html?course=CSCI-UA-470&note=16-solid) the judgment; the pattern notes ([L18](note.html?course=CSCI-UA-470&note=19-creational-patterns), [L19](note.html?course=CSCI-UA-470&note=20-structural-patterns), this one, and [note 22](note.html?course=CSCI-UA-470&note=22-behavioral-patterns-ii)) are the named solutions those principles keep arriving at. Next: the four patterns that answer the same pressure by **removing** a job from the object rather than swapping it out. For final review, the language rules are consolidated in [the Java/C++ comparison (L11)](note.html?course=CSCI-UA-470&note=17-java-cpp-systematic-comparison) and the whole design chain runs end to end on one program in the [Password Keeper](note.html?course=CSCI-UA-470&note=password-keeper).
