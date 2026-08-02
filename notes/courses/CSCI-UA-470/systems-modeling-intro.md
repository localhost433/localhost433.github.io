---
title: "Introduction to Systems Modeling"
date: "2026-07-01"
---

## What a model is, and why bother

A **model** is an abstraction of a system -- it deliberately drops detail to make the whole graspable. The governing rule of every model in this unit:

> A model describes **what** a system does, not **how** it does it.

That one sentence separates modeling from programming. Code is the *how*: the exact allocation, the loop, the dispatch. A model is the *what*: the actors, the goals, the responsibilities, the relationships -- the shape of the system before any of it is built. You model so that clients, analysts, designers, and programmers can argue about the design *before* it hardens into code that is expensive to change.

## Where modeling fits in the software process

Before a line of code exists, a project passes through a chain of roles -- from the client who wants something, through the analyst who pins down requirements, to the designer who shapes a solution, to the programmer who builds it:

```artifact src=demos/use-case-roles.jsx static
```

**UML** (Unified Modeling Language) is the shared notation the analyst and designer use to capture that design and hand it downstream. It is a **communication tool, not a programming language** -- it sits *above* the C++/Java implementation details ([the JVM note (L10–L11)](note.html?course=CSCI-UA-470&note=11-jvm-runtime), [the Java/C++ comparison (L11)](note.html?course=CSCI-UA-470&note=17-java-cpp-systematic-comparison)) and is deliberately language-agnostic.

## The three families of UML diagrams

UML diagrams split into three families. Every diagram you study in this unit falls into one of them:

| Family | Captures | Diagrams (studied ones in **bold**) |
|---|---|---|
| **Structural** | the static view -- parts and how they wire together | **Class**, **Object**, Package, Component, Deployment |
| **Behavioral** | the system in motion | **Use case**, Activity, State machine |
| **Interaction** | how parts exchange messages over time | **Sequence**, Collaboration, Timing |

- **Structural** diagrams freeze the system and show its parts. The **class diagram** (types, fields, methods, associations) is the one most tied to the OOP pillars; the **object diagram** is a concrete snapshot of instances at one moment.
- **Behavioral** diagrams show the system doing things. The **use case diagram** captures external actors and the goals they pursue -- the outermost, requirements-level view.
- **Interaction** diagrams zoom in on behavior: the **sequence diagram** orders messages top-to-bottom along lifelines.

The three you build in this course -- use case, sequence, class -- are one from each family, and they are meant to be used *together*, not in isolation.

## An iterative loop, not a waterfall

The three diagrams are not a one-pass checklist; they feed back into each other. You sketch use cases, realize one as a sequence diagram, notice two sequences share structure, **refactor the model** to remove the duplication, and only then read the class diagram off the refined design. Refactoring the *model* deletes duplication before it becomes duplicated *code* -- the whole point of modeling before building. That loop is worked end-to-end on the unit converter in [Class Diagrams & Iterative Design](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams).

## What to retain

- A **model** is an abstraction that captures **what**, not **how** -- the line between modeling and coding.
- **UML** is a language-agnostic **communication tool** used by analysts and designers, sitting above any implementation language.
- UML diagrams fall into **three families**: **Structural** (static parts), **Behavioral** (system in motion), **Interaction** (messages over time).
- The three you study map one-per-family: **use case** (behavioral), **sequence** (interaction), **class/object** (structural).
- The diagrams form an **iterative loop** -- refactoring the model removes duplication before it reaches code.

## Practice

This note is the on-ramp; the drilling happens in each diagram's own note. Start with the use case questions:

```artifact src=demos/practice-12-mcq.jsx
```

---

> Where this sits in the course: the doorway to the modeling unit. From here the three diagram families each get their own note -- the **use case diagram** in [note 12](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams), the **sequence diagram** in [note 13](note.html?course=CSCI-UA-470&note=13-uml-sequence-diagrams), and the **class diagram** with its iterative loop in [note 14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams). They come together in the [password-keeper capstone](note.html?course=CSCI-UA-470&note=password-keeper), and the judgment layer over the resulting designs is [SOLID](note.html?course=CSCI-UA-470&note=16-solid).
