---
title: "UML Sequence Diagrams"
date: "2026-07-08"
---

## From use cases to interactions

[Note 12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams) split UML into three families and developed the Behavioral one: the use case diagram, which says what a system lets its actors do from the outside. This note develops the Interaction family it deferred, the sequence diagram, which zooms inside a single use case and shows how the objects collaborate to carry it out.

| Family | Captures | Diagrams |
|---|---|---|
| Structural | static view of the system | Class, Object, Package, Component, Deployment |
| Behavioral | dynamic parts of the system | Use case, Activity, State machine |
| Interaction | how parts exchange messages over time | Sequence, Collaboration, Timing |

A use-case oval such as `Make order` is a single word standing in for a whole conversation. The sequence diagram is where that conversation gets written out: which objects take part, what messages they send, and in what order.

> A sequence diagram illustrates the objects that participate in a use case and the messages that pass between them over time. Its emphasis is on time ordering.

## Anatomy of a sequence diagram

Every sequence diagram is built from the same handful of parts. Here they are on the smallest possible scene, one actor placing an order with one cashier:

```artifact src=demos/sequence-anatomy.jsx static
```

- **Participant** — an object or entity that acts in the diagram, drawn along the top. An object is a box holding an underlined `name : Class` (e.g. `Mike : Cashier`); an external initiator is drawn as an actor stick figure.
- **Lifeline** — the dashed vertical line dropping from each participant. It represents that participant existing through time.
- **Activation** (activation bar) — the thin box on a lifeline, drawn while that object's method is on the stack: either it is running its own code, or it is waiting on another object's method to finish. Nesting activation bars indicates recursion.
- **Message** — an arrow from the sender's lifeline to the receiver's, labelled `name(arguments)` (e.g. `place_order(details)`).
- **Return** — the dashed arrow carrying control (and any result) back to the caller.

The two axes carry all the meaning:

| Axis | Reads as |
|---|---|
| Horizontal | which object or participant is acting |
| Vertical | time; further down the page is later |

## Messages

Messages illustrate communication between the active objects. The arrow style encodes the kind of call:

| Kind | Arrow | Meaning |
|---|---|---|
| Synchronous | solid line, filled arrowhead | the caller's flow is interrupted until the message completes; a blocking call |
| Asynchronous | solid line, open (thin) arrowhead | the caller does not wait for a response |
| Flat | solid line, plain arrowhead | no distinction drawn between sync and async |
| Return | dashed line, open arrowhead | control flow has returned to the caller |

A message is labelled with a message name and its arguments, e.g. `Admit(patientID, roomType)`. A message from an object back to itself is drawn as a small loop off its own lifeline: a **self-call**, an object invoking one of its own methods, which nests a new activation.

## Object lifetime

Participants need not exist for the whole diagram:

- **Creation** — an arrow labelled `new` pointing at the created object. The new object's box appears at the point in time it is created, and its lifeline begins there.
- **Deletion** — an X at the bottom of the object's lifeline, where it is destroyed, either by another object or by itself (self-deletion).

Because time runs downward, an object created halfway down the page has a shorter lifeline that starts lower, so the diagram shows its whole lifetime.

## Combined fragments: conditions and loops

Straight-line message order is the common case, but interactions also branch and repeat. UML wraps a span of messages in a **combined fragment**: a labelled frame with a tab in its top-left corner naming the operator, and a **guard** in `[square brackets]`.

| Operator | Frame tab | Meaning |
|---|---|---|
| opt | `opt` | optional: the body runs only if the guard is true (one branch, no else) |
| alt | `alt` | alternatives: mutually-exclusive branches split by a dashed divider, the first guard then `[else]` |
| loop | `loop` | the body repeats while the guard holds |

Iteration can also be written inline on a single message with a `*` prefix: `*[until full] insert()` sends the message repeatedly.

The `alt` fragment is the richest of the three. Here a bank clears a check, taking one branch when the balance covers the amount and the `[else]` branch when it does not:

```artifact src=demos/sequence-fragments.jsx static
```

An `opt` is this shape with a single branch and no divider; a `loop` is the same frame whose body runs more than once.

## Worked example: "Make order" at the coffee shop

The `Make order` oval from the coffee-shop use-case diagram becomes a conversation between four objects. The customer pays the cashier, the cashier hands the job to the barista, the barista passes the finished drink to the receptionist, who checks its quality with a self-call and returns the order.

```artifact src=demos/sequence-coffee-order.jsx static
```

Read it top-to-bottom as time:

1. `place_order(order_details)` — the customer calls the cashier (synchronous; the cashier's activation begins).
2. `price` — the cashier returns the price (dashed).
3. `get_payment(price)` — the customer pays.
4. `prepare(order_details)` — the cashier delegates to the barista.
5. `deliver(order)` — the barista hands the drink to the receptionist.
6. `checkQuality(order)` — the receptionist checks it, a self-call.
7. `order` — the finished order returns to the customer.

> On the return arrows. This diagram, following the lecture, draws returns to whoever the story follows next: the price back to the customer, the finished order straight back to the customer. Strict UML would instead unwind the call stack one frame at a time, returning each call to its immediate caller (receptionist → barista → cashier → customer). The collapsed form trades that rigor for a readable narrative, and both are common in practice.

The lecture built this up in versions, first `Customer → Cashier → Barista`, then adding the receptionist and the quality check. The activation bars grow the same way: each new collaborator adds a stack frame further down the page. Earlier versions have fewer participants and messages, but the shape is the same.

## Sequence vs. use case: where each fits

The two diagrams are a pair, one zooming into the other:

| | Use case diagram | Sequence diagram |
|---|---|---|
| Family | Behavioral | Interaction |
| Answers | what the system lets actors do | how objects collaborate to do it |
| Viewpoint | outside the system boundary | inside a single use case |
| Building blocks | actors, use-case ovals, relations | participants, lifelines, messages, activations |
| Emphasis | goals | time ordering |

## Practice

Reading a finished sequence diagram is one skill; drawing one is another. Build the "Make order" interaction yourself — drag each message into its place in time and watch the diagram assemble. The lifelines and message directions are given; the ordering is yours.

```artifact src=demos/practice-13-sequence.jsx
```

---

> Where this sits in the course: a sequence diagram is the Interaction-family companion to the use-case diagram in [note 12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams). A use case names a goal from the outside; the sequence diagram writes out the message-by-message collaboration that fulfils it. Both stay at the level of design notation, above the C++/Java implementation detail of the earlier notes. The [next note](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams) reads the objects on those lifelines off as a class diagram, completing the UML trilogy with the Structural family.
