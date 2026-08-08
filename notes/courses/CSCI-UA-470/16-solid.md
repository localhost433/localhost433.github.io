---
title: "SOLID Principles"
date: "2026-07-15"
---

## From "can" to "should"

Everything so far taught what the language and the notation *can* express: inheritance, interfaces, the six relationship edges, and the Java each one compiles to ([note 15](note.html?course=CSCI-UA-470&note=15-uml-to-code)). L16 is the first lecture about what you *should* draw. SOLID is five design principles — one per letter — and every one of them is a rule about **change**: which classes must be edited, and which merely extended, when a requirement moves.

| | Principle | One-liner from the slide |
|---|---|---|
| S | Single Responsibility | every class must have a single responsibility |
| O | Open–Closed | open for extension, closed for modification |
| L | Liskov Substitution | a class should be substitutable for its parents |
| I | Interface Segregation | the client shouldn't be forced to implement useless methods |
| D | Dependency Inversion | high-level classes should not depend on low-level classes |

Each section below is the slide's own bad→good pair: the crossed-out design, the fix, and the reason the fix is not cosmetic.

## S — Single Responsibility

An `Invoice` that stores its own number, date, and details *and* adds, deletes, and sorts invoices is two classes wearing one name: the invoice (data) and the bookkeeping of invoices (management). Those change for different reasons — a new field touches one job, a new sorting rule touches the other — so SRP splits them:

```artifact src=demos/solid-srp.jsx static
```

The instructor's margin note is the exam trap: SRP does **not** mean a class should do a single or *simple* task. `InvoiceRegister` has three operations and is still one responsibility — *keeping the register*. The unit of counting is not methods but **reasons to change**. The slide's second example makes the same cut inside one class: `Car` loses `totalSales` (a fact about the fleet, not about a car) and gains a `static counter` — class-level bookkeeping, not per-object state.

## O — Open–Closed

The bad `Shape` is [note 06](note.html?course=CSCI-UA-470&note=06-polymorphism)'s dispatch problem, hand-rolled: a `type` string and a `getArea()` if-chain that must be *reopened and edited* for every new shape. The fix is the hierarchy the course has been building since [note 09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java) — abstract `Shape`, abstract `getArea()`, one override per subclass:

```artifact src=demos/solid-ocp.jsx
```

Now `Cylinder` is *pure extension*: a new subclass with one override, and no existing class is touched. Overriding already is the dispatch the if-chain was trying to be — OCP is the design-level argument for the `virtual` machinery of [note 06](note.html?course=CSCI-UA-470&note=06-polymorphism).

## L — Liskov Substitution

Both of the slide's hierarchies **compile**. `Vehicle` promises `turnAcOn()` to every child — then `Bike` arrives. `Bird` promises `fly()` — then `Ostrich` arrives:

```artifact src=demos/solid-lsp.jsx
```

`Bird b = new Ostrich();` is legal Java — upcasting always is ([note 06](note.html?course=CSCI-UA-470&note=06-polymorphism)) — and `b.fly()` still resolves at runtime to something. That is exactly why the compiler cannot save you: LSP is a **semantic** contract on top of the syntax. Any code written against `Bird` must work, unchanged and unsurprised, with every subclass. A child that stubs, throws, or no-ops an inherited method is evidence that the *parent* promised too much; the fix is to move the promise down (a `FlyingBird` layer) or out (a `Flyable` interface — which is the next principle's territory).

## I — Interface Segregation

A fat `Movable` interface declares `move()` *and* `jump()`, and every implementer signs the whole contract. `Person` and `Bird` can honour it; `Vehicle` is forced into `jump() { }` — the empty stub that the slide points at:

```artifact src=demos/solid-isp.jsx static
```

Split the contract and the stub disappears: `Movable` keeps `move()`, `Jump-able` takes `jump()`, and every class implements exactly what it can honour — Java allows implementing many interfaces precisely so contracts can stay thin ([note 09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java)). Note the family resemblance to LSP: the empty stub *is* a broken promise; ISP fixes it at the source by never extracting the promise from a class that can't keep it.

## D — Dependency Inversion

The slide gives DIP one line — *high-level classes should not depend on low-level classes* — and stops there, so the example below goes beyond the lecture material. The shape of the problem: a high-level policy class (`NotificationService`) that names a concrete low-level detail (`EmailSender`) must be edited whenever the detail changes. The fix inserts an abstraction and flips the arrows:

```artifact src=demos/solid-dip.jsx static
```

After the flip, the service depends only on `«interface» MessageSender`, and the concrete senders point *up* into the abstraction with realization edges. That reversal — the detail depending on the abstraction, instead of the policy depending on the detail — is the **inversion** in the name. In [note 15](note.html?course=CSCI-UA-470&note=15-uml-to-code)'s vocabulary: the dashed `depend` arrow from high to low is replaced by a `depend` into the interface plus `realize` edges from below.

## What to retain from L16

- SOLID is five rules about **change**: who gets edited when a requirement moves.
- **SRP** counts *reasons to change*, not methods — and per the margin note, single responsibility ≠ single simple task. Fleet-level facts (`totalSales`) leave the object for a `static` counter or a register class.
- **OCP**: an if-chain over a `type` field is a dispatch table you must reopen; subclass overrides are the dispatch table that extends itself.
- **LSP** is semantic, not syntactic — the violation *compiles*. A stubbed or throwing override means the parent over-promised.
- **ISP**: an empty stub (`jump() { }`) is the smell; split fat interfaces so each class signs only what it can honour.
- **DIP**: both sides depend on an abstraction; the arrow flip (concretions pointing up into the interface) is the inversion.
- The five overlap on purpose: ISP's stub is an LSP break; OCP's fix is [note 06](note.html?course=CSCI-UA-470&note=06-polymorphism)'s polymorphism; DIP's mechanism is [note 15](note.html?course=CSCI-UA-470&note=15-uml-to-code)'s realization edge.

## Practice

The exam skill is diagnosis: given a design you have never seen, name the principle it breaks. These five are fresh — none is the note's own example — and the letters are used once each, so the real work is telling the neighbours apart: an SRP hoard from an ISP stub, an ISP stub from an LSP throw. Check is one-shot; commit before you grade.

```artifact src=demos/practice-16-solid-match.jsx
```

Then spot the principle *and* pick the fix — the way it's examined:

```artifact src=demos/practice-16-mcq.jsx
```

---

> Where this sits in the course: the design capstone. Notes [L05](note.html?course=CSCI-UA-470&note=05-inheritance)–[L09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java) built the machinery (inheritance, dispatch, abstract classes, interfaces), notes [L12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams)–[L15](note.html?course=CSCI-UA-470&note=15-uml-to-code) built the notation for wielding it, and SOLID is the judgment layer that says which of the expressible designs will survive their next requirement. The design-pattern notes ([L18](note.html?course=CSCI-UA-470&note=19-creational-patterns)–[L21](note.html?course=CSCI-UA-470&note=22-behavioral-patterns-ii)) are the sequel: named, reusable designs that these five principles keep arriving at — Factory is Open–Closed applied to construction, Strategy is the same fix applied to behaviour, Iterator is Single Responsibility applied to traversal, and Visitor is Open–Closed bought along one axis by spending it along the other. [L22](note.html?course=CSCI-UA-470&note=23-design-in-the-ai-era) then turns these same five letters into a review rubric for code you did not write. For final review, the language rules are consolidated in [the Java/C++ comparison (L11)](note.html?course=CSCI-UA-470&note=17-java-cpp-systematic-comparison) and the pillar map in [the pillars roadmap](note.html?course=CSCI-UA-470&note=18-oop-pillars-roadmap).
