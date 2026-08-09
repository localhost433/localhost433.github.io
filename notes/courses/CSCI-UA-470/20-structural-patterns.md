---
title: "Structural Design Patterns"
date: "2026-07-27"
---

## Composing objects, not creating them

[The creational note (L18)](note.html?course=CSCI-UA-470&note=19-creational-patterns) answered *how does the object get made*. L19 asks the next question: given the objects, **how do you put them together** so the arrangement is easier to live with than the classes alone would be. Seven patterns, and the deck gives each one a single bracketed line:

| Pattern | The deck's intent | In one phrase |
|---|---|---|
| **Adapter** | *Extend the ability of existing class* | make an incompatible class fit |
| **Composition** | *Define a common interface for all granularities and to treat group of objects similarly* | one thing and many things, called the same way |
| **Flyweight** | *Improves the performance* | share the duplicates instead of allocating them |
| **Proxy** | *Control Access* | same door, with a doorman |
| **Facade** | *Hide Complexity* | one small entrance to a big subsystem |
| **Bridge** | *Decouple Abstraction from implementation* | two hierarchies instead of their product |
| **Decorator** | *Add different features to existing Object* | features you stack instead of subclass |

Four of the seven put one object in front of another, which is why those four are the ones that get confused on an exam. That is settled in its own section at the end; take the seven one at a time first.

## 1 · Adapter

You own a hierarchy that works. Then a class arrives that does the same job with different method names, different arguments, and a different return type — a vendor's library, a legacy connection, someone else's SDK. It cannot be edited and it will not fit.

```artifact src=demos/pattern-adapter.jsx
```

The adapter is the only child in the hierarchy with two loyalties: it **is** a `DBCNN` (so the client can hold it) and it **has** a `SQLite` (so it can actually do the work). Both halves are required, and spotting both is how you recognise one in code you have never seen.

> **Beyond the slide —** the intent line oversells. An adapter adds no ability at all; the wrapped class could always read and write. What changes is the *shape* of the ability, so a class written against one interface becomes usable through another. The catalog also distinguishes an **object adapter** (holds the adaptee, as here) from a **class adapter** (inherits from the adaptee and implements the target interface). Java cannot inherit from two classes, but it can use that class-adapter form when the target is an interface; the object form is the more general choice (the inheritance issue is [the diamond problem](note.html?course=CSCI-UA-470&note=06-polymorphism)).

## 2 · Composition

A file is one thing; a folder is many things, and some of those things are folders. Written naively, every caller carries the tree structure — a cast and a branch at every level.

```artifact src=demos/pattern-composite.jsx
```

The move is small and easy to under-rate: `Folder` holds `List<item>`, the **parent** type, not `List<File>`. That single choice is what lets folders nest, what makes `browse()` recurse, and what makes a leaf and a whole subtree callable through the same line.

> **Beyond the slide —** the catalog calls this **Composite**; "composition" in every other context in this course means the filled-diamond UML edge from [note 14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams), whose test is whether the part dies with the whole. They are unrelated ideas that happen to share a word here, and an exam question about "composition" has to be read for which one it means: an *edge* on a class diagram, or a *pattern* with a self-reference.

## 3 · Flyweight

A thousand vehicles on screen, drawn from a handful of distinct type-and-colour pairs. The duplicates carry identical state and differ only in their address, which makes them exactly the kind of object worth not making.

```artifact src=demos/pattern-flyweight.jsx
```

The client loop is unchanged, character for character — the deck reuses it on purpose. Everything happens inside `getVehicle`, and the consequence is visible only in memory:

```artifact src=demos/pattern-flyweight-heap.jsx
```

The limit the deck leaves implicit: anything that must **differ** per occurrence — a position, a speed, a health bar — cannot live on a shared object. Sharing is safe exactly as far as the shared state is the state that *identifies* the object; everything else has to be held by the caller and handed in per call.

## 4 · Proxy

Three query kinds go into the database connection and only two should come out. The rule is easy to state and impossible to enforce while every caller holds the real connection.

```artifact src=demos/pattern-proxy.jsx
```

Note what the pattern buys over a rule in a code review. A convention holds until somebody writes the one line that breaks it, and no compiler is on the side of a comment. Route every call through one object and the restriction becomes structural: there is no path to the real connection that skips the check. It is the same argument as [L18's private constructor](note.html?course=CSCI-UA-470&note=19-creational-patterns), applied to calls instead of construction.

Access control is one job in a family that all share the shape: lazy loading (build the real object on the first call that needs it), caching, logging, and the remote proxy that makes a network call look local.

## 5 · Facade

Placing one restaurant order takes four objects and seven lines in a specific order. Every client that wants dinner has to know all of it, and can therefore get all of it wrong.

```artifact src=demos/pattern-facade.jsx
```

The subsystem does not shrink and does not become private. `waiter`, `kitchen`, and `Food` are all still there and still directly usable — the pattern adds **one** class whose job is knowing the call order so no caller has to. In [note 15](note.html?course=CSCI-UA-470&note=15-uml-to-code)'s vocabulary a facade is a **control** object: it holds no domain data of its own and exists to sequence other people's work.

## 6 · Bridge

Three device kinds crossed with three operating systems is nine classes; a fourth OS makes twelve, and every `shutdown()` bug has to be fixed in three of them. The give-away in the rejected design is a class name that is two nouns glued together — `LaptopLinux` is not a kind of thing, it is a cell in a table.

```artifact src=demos/pattern-bridge.jsx
```

The trigger is **two dimensions that change independently**. A useful test: would the two axes ever be released, tested, or owned by different people? If yes, do not multiply them into one hierarchy — split them and join them with a field. That field is the bridge, and it also buys something inheritance could not express at all: a `LaptopLinux` *is* its operating system for life, while a `Laptop` merely *has* one, and can be handed a different one at run time.

## 7 · Decorator

A wedding booking can have flowers, or catering, or music, or any combination of the three — and next season, a photographer. Adding a field per add-on makes one class that knows about every extra and every booking pay for all of them; adding a subclass per combination is worse.

```artifact src=demos/pattern-decorator.jsx
```

The line that gets misread is `b1 = new Flower(b1, …)`. It looks like reassignment throwing the old object away, and it is the opposite: the old object is passed in *first*, survives inside the new one, and only the **name** moves outward.

```artifact src=demos/pattern-decorator-wrap.jsx
```

Follow the arrows and the two directions separate cleanly — calls run outside-in, answers come back inside-out. Reordering the three wrapping lines reorders the walk without touching a class, and that is the whole reason to prefer this over three more subclasses.

> **Beyond the slide —** the deck's `Decorator` holds a `Booking` but does not *extend* it, which means a decorated booking is not itself a `Booking` and the chain type-checks only by accident. The catalog's Decorator implements the same abstraction it wraps, so a wrapper is substitutable for what it wrapped ([note 16](note.html?course=CSCI-UA-470&note=16-solid)'s Liskov rule) and stacking is guaranteed rather than hoped for. Java's own `InputStream` family is built exactly that way — `new GZIPInputStream(new BufferedInputStream(in))` works because every layer *is* an `InputStream`.

## Adapter vs. Proxy vs. Decorator vs. Facade

All four put an object in front of another object, so "it wraps something" identifies none of them. Two questions do:

```artifact src=demos/wrapper-family.jsx static
```

| | Interface the client sees | Wraps | Distinctive |
|---|---|---|---|
| **Adapter** | a different one | one incompatible class | exists because two interfaces disagree |
| **Facade** | a new, smaller one | several collaborating classes | subsystem stays usable directly |
| **Proxy** | identical | one object | decides *whether and when* the call gets through |
| **Decorator** | identical | one object — possibly another decorator | **stacks**; adds to the call rather than gating it |

The tie-breaker when two still look plausible: ask whether wrapping the wrapper would make sense. Only Decorator is built for it.

## What to retain from L19

| Topic | Key test point |
|---|---|
| The category | structural patterns are about **composition** — how objects are wired together, not how they are made |
| Adapter | **is-a** the target interface **and** **has-a** the incompatible class; translates, adds no ability |
| Adapter vs. Bridge | Adapter fixes an interface mismatch *after the fact*; Bridge is designed in *up front* to keep two axes apart |
| Composition | the composite **holds a list of the abstraction it implements** — the self-reference is the pattern |
| Composition, the name | the catalog calls it **Composite**; the UML composition *edge* (note 14) is a different idea entirely |
| Flyweight | share objects with identical **intrinsic** state; per-occurrence state must be passed in, not stored |
| Flyweight tell | the client code does not change — the cache lives entirely inside the factory |
| Proxy | **same interface**, one wrapped object, a decision inserted on the way through (access, caching, laziness, remoteness) |
| Facade | one **new, smaller** interface over several classes; the subsystem is unchanged and still directly usable |
| Bridge | two independently varying dimensions → two hierarchies + one field, instead of their product |
| Bridge tell | in the rejected design, class names are two nouns glued together (`LaptopLinux`) |
| Decorator | wrappers that **stack**; `new Flower(b1, …)` takes the wrapped object as an argument |
| Decorator direction | calls run **outside-in**, returns come back **inside-out** |
| The four wrappers | separated by two questions: does the call site change, and is the wrapper gating, adding, translating, or simplifying? |

## Practice

Start with the naming pass. Seven fresh designs, seven names, each used exactly once — so a confident answer anywhere narrows what is left. Four of the seven wrap something, and those are decided by the two questions rather than by vocabulary.

```artifact src=demos/practice-20-structural-match.jsx
```

Then the direction question, as a sequence diagram. A booking wrapped three deep receives one `cost()` call; order the messages. The trap is starting at `Booking` because it is "the real one" — check first which object `b1` actually points at.

```artifact src=demos/practice-20-decorator-order.jsx
```

And the graded pass, weighted toward the four wrappers, plus the three limits the deck states quickly: what Flyweight cannot share, what makes a Composite a Composite, and what actually triggers a Bridge.

```artifact src=demos/practice-20-mcq.jsx
```

---

> Where this sits in the course: the middle of the catalog. [The creational note (L18)](note.html?course=CSCI-UA-470&note=19-creational-patterns) covered how objects are made; these seven cover how they are composed, and almost all of them are an argument for holding an object over inheriting from one — the same preference [SOLID (L16)](note.html?course=CSCI-UA-470&note=16-solid) reaches from the other side. The behavioral notes finish the catalog with how objects **talk** — [L20](note.html?course=CSCI-UA-470&note=21-behavioral-patterns) for the six that swap a held object, and [L20–L21](note.html?course=CSCI-UA-470&note=22-behavioral-patterns-ii) for the four that take a job out of one.
