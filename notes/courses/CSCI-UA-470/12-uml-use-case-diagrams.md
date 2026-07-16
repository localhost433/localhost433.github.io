---
title: "UML & Use Case Diagrams"
date: "2026-07-01"
---

## Where UML fits in the software process

Before any code exists, a software project passes through a chain of roles:

```artifact src=demos/use-case-roles.jsx static
```

UML (Unified Modeling Language) is the shared notation the analyst and designer use to capture a design and communicate it to everyone downstream. It is a communication tool, not a programming language, and it sits above the C++/Java implementation details covered in [note 11](note.html?course=CSCI-UA-470&note=11-jvm-runtime) and [note 15](note.html?course=CSCI-UA-470&note=15-java-cpp-systematic-comparison).

The mindset that governs every UML model:

> A UML diagram describes what a system does, not how it does it.

## The three families of UML diagrams

UML diagrams split into three groups. The one this note develops is the use case diagram.

| Family | Captures | Diagrams |
|---|---|---|
| Structural | static view of the system | Class, Object, Package, Component, Deployment |
| Behavioral | dynamic parts of the system | Use case, Activity, State machine |
| Interaction | how parts exchange messages over time | Sequence, Collaboration, Timing |

- **Structural** diagrams freeze the system and show its parts and how they are wired. The class diagram (types, fields, methods, and associations) is the one most tied to the OOP pillars in [note 16](note.html?course=CSCI-UA-470&note=16-oop-pillars-roadmap); the object diagram shows a concrete snapshot of instances; package, component, and deployment diagrams zoom out to modules, binaries, and physical nodes.
- **Behavioral** diagrams show the system in motion: the use case diagram (external actors and the goals they pursue), the activity diagram (a flowchart of a process with forks/joins and decisions), and the state machine diagram (the states of one object and its transitions).
- **Interaction** diagrams are a zoom-in on behavior: the [sequence diagram](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams) (messages ordered top-to-bottom along lifelines), collaboration (the same messages numbered on an object graph), and timing (state against time).

The rest of this note is about the use case diagram, the L12 topic.

## Use case diagrams

A use case diagram answers "what should this system let people do?" from the outside. It serves to:

- Visualize the behavior of the system.
- Communicate with clients and teammates.
- Describe what the system does from the standpoint of an external observer: again, what and not how.

A use case diagram is built from exactly three kinds of things: use cases, actors, and relationships.

### Use case

- An activity performed by the users of the system.
- Drawn as an oval or ellipse.
- Labeled with a descriptive verb-noun phrase: `Register student`, `Make Appointment`, `Withdraw Funds`.

### Actor

- A user or outside system that interacts with the system.
- The one who or what initiates the events involved in the use case.
- Drawn as a stick figure.
- Labeled with a descriptive noun or noun phrase: `Receptionist`, `Customer`, `Librarian`.
- An actor need not be a person. An external system, such as a bank or a legacy service, is an actor too.

### Relationship

- Represents communication between an actor and a use case, an association.
- Drawn as a plain line, sometimes a double-headed arrow line.

> Use cases describe scenarios of the interaction between the users of the system (the actors) and the system itself.

## Building a use case diagram

The lecture walks through the Medical Clinic scenario:

> "A patient calls the clinic to make an appointment for a yearly checkup. The receptionist finds the nearest empty time slot in the appointment book and schedules the appointment for that time slot."

It becomes a diagram in three steps.

### 1. Identify the actors

The people or systems that will interact with the scenario. Guiding questions:

- Who is interested in or benefits from the system?
- Who supplies, uses, or removes information?
- Does one person play several roles, or several people the same role?
- What other entity is interested, or supplies/uses information?
- Does the system use an external resource or interact with a legacy system?

For the clinic, the actor is the `Receptionist`.

### 2. Identify the use cases

A summary of scenarios for a single task or goal. Guiding questions:

- What are the tasks of each actor?
- Will any actor create, store, change, remove, or read information?
- Which use cases create, store, change, remove, or read that information?
- Must any actor inform the system about sudden external changes, or be informed about occurrences in the system?
- Can all functional requirements be performed by the use cases?

For the clinic, the use case is `Make Appointment`.

### 3. Draw the relation

Connect the actor to the use case with a communication line:

```artifact src=demos/use-case-clinic.jsx static
```

### Use case description

The diagram is only a summary. Each use case can be backed by a textual description that includes all or part of the following fields:

| Field | Meaning |
|---|---|
| Title / Reference Name | meaningful name of the use case |
| Author / Date | author and creation date |
| Modification / Date | last modification and its date |
| Purpose | the goal to be achieved |
| Overview | short description of the process |
| Related use cases | in accordance with the use case diagram |
| Actors | the agents participating |
| Pre-conditions | must be true to allow execution |
| Post-conditions | set when the use case completes normally |
| Normal flow of events | the regular flow of activities |
| Alternative flow of events | other flows of activities |
| Exceptional flow of events | unusual situations |
| Implementation issues | foreseen implementation problems |
| Special requirements | non-functional requirements and constraints |

## Relationships

### Between use cases

There are three relationships between use cases. The include/extend distinction is the exam trap.

| Relationship | Meaning | Notation | Base can stand alone? |
|---|---|---|---|
| Generalization | child use case is a specialized version of a parent and inherits its behavior and meaning | hollow-triangle arrow, child → parent | — |
| Include `<<include>>` | the included use case is always performed as part of a larger base; factors out common behavior | dashed arrow labeled `<<include>>`, base → included | no, the included step always runs |
| Extend `<<extend>>` | the base use case may stand alone, but under certain conditions its behavior is extended by another use case | dashed arrow labeled `<<extend>>`, extending → base | yes, the extension is conditional |

Generalization uses the hollow-triangle arrow, pointing from each child up to the parent, the same notation as class inheritance:

```artifact src=demos/use-case-generalization.jsx static
```

Include uses a dashed arrow from each base to the step it always pulls in:

```artifact src=demos/use-case-include.jsx static
```

Extend uses a dashed arrow from each optional extension back to the base it may add to:

```artifact src=demos/use-case-extend.jsx static
```

Include versus extend in one line: `include` is mandatory, factored-out common behavior that always runs as part of the base, while `extend` is optional behavior that runs only under certain conditions, on a base that is already complete on its own.

Examples from the slides:

- Generalization: `Phone Order` and `Internet Order` both generalize to `Place Order`.
- Include: `updating grades` and `output generating` each `<<include>>` `verifying student id`, the shared step both need.
- Extend: `Exam-grade appeal` `<<extend>>` `Exam copy request`. On a shopping site, `View product details` is extended by `Add to shopping cart` and `Write a review`.

### Between actors

Actors can be related by generalization too. `graduate student` and `non-graduate student` are specialized kinds of `student`, drawn with the same hollow-triangle arrow pointing at the general actor.

### Between actors and use cases

Actors connect to use cases by associations, indicating that the actor and the use case communicate with one another using messages.

## Worked examples

- **Online Banking** — actor `Customer`; use cases `Open Account`, `Deposit Funds`, `Withdraw Funds`, `Close Account`. Drawn out, this is the everyday shape of a use-case diagram: one actor, several goals inside the boundary.

```artifact src=demos/use-case-banking.jsx static
```

- **Library System** — actors `Borrower (Member)` and `Librarian`. The borrower can `Borrow Book`, `Search for book`, `Return Book`, `List all Borrowings`; the librarian can `Add book`, `Remove Book`, `update Book`, `List all Borrowings`, and `Organize Books`. A refined version splits the use cases per actor and adds `<<extend>>` links, so that `Borrow Book` extends `Search for book` and `Return Book` extends `List all Borrowings`. This is the first diagram with real structure, with two actors, a shared use case, and relations between use cases, so it is worth building up one piece at a time.

```artifact src=demos/use-case-library-steps.jsx
```

The finished diagram, for reference:

```artifact src=demos/use-case-library.jsx static
```

- **Digital Sound Recorder** — actor `User`; use cases `Record a file`, `View Recordings`, `Play a Recording`, `Delete a Recording`, `Edit settings`, `Edit recording`. The refined version has `Play a Recording`, `Delete a Recording`, and `Edit recording` `<<extend>>` `View Recordings`, so the three refinements hang off `View Recordings` as optional add-ons.

```artifact src=demos/use-case-recorder.jsx static
```

## Practice

Reading these diagrams is one skill; drawing one is another. Assemble a small Library System yourself. First place each element — actors belong *outside* the boundary, use cases *inside* it — then connect the actors to their use cases and join `Borrow Book` to `Search for book`. The diagram lays itself out as you build.

```artifact src=demos/practice-12-usecase.jsx
```

Now a second diagram that forces the relationship you have to reach for most on the exam. In this Online Store, one case-to-case link is `<<include>>` (a step that *always* runs as part of its base) and the other is `<<extend>>` (optional behavior on a base that stands alone). Watch which way each dashed arrow points as you place them — `include` runs base → included, `extend` runs extension → base.

```artifact src=demos/practice-12-usecase-store.jsx
```

Finally, the include/extend/generalization distinction is the part of this note most likely to be tested. Drill it directly:

```artifact src=demos/practice-12-mcq.jsx
```

## Common UML tools

Edraw Max, Moqups, Visio, ConceptDraw, StarUML, Umbrello, UML Designer Tool, UMLet.

---

> Where this sits in the course: UML is a notation for design, applied on top of the OOP ideas summarized in [note 16](note.html?course=CSCI-UA-470&note=16-oop-pillars-roadmap). A use case diagram captures requirements from the outside, what and not how, before those requirements are turned into the classes, inheritance, and polymorphism built throughout the earlier notes.
