---
title: "OOP: The Four Pillars"
date: "2026-06-17"
---

This is the **hub** for everything OOP in this course -- the map you come back to. So far we've built the machinery piece by piece, in C++ (notes 03-06) and then Java (notes 08-09); the rest of the course (design, UML, the JVM) keeps building on these same four ideas. Each pillar below links **down** to where it's built and, as we go, will link **forward** to where it's used.

## The four pillars

Every OOP feature in this course is one of four ideas. The tree below is the skeleton; each branch links to the note that builds it out -- and is where later topics attach.

```
OOP pillars
|-- Encapsulation    -- access specifiers; getters & setters
|-- Inheritance      -- single | single multi-level | multiple | multi-level multiple
|-- Abstraction      -- abstract classes; interfaces
`-- Polymorphism     -- late binding (virtual functions) | virtual inheritance
                        | method overloading / overriding
```

- **Encapsulation** -- bundle state with the code that guards it, then expose a controlled surface. See access specifiers in [C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java) and getters/setters in [Classes & Objects](note.html?course=CSCI-UA-470&note=03-classes-objects).
- **Inheritance** -- one class reuses and extends another. Built in [Inheritance](note.html?course=CSCI-UA-470&note=05-inheritance) (C++) and contrasted in [C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java).
- **Abstraction** -- program against a contract, not a concrete type. Abstract classes appear in [Polymorphism & Abstract Classes](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java); interfaces are nailed down [below](#concrete-vs-abstract-vs-interface).
- **Polymorphism** -- one call, many behaviors, chosen by the object's runtime type. Built in [Polymorphism & Virtual Functions](note.html?course=CSCI-UA-470&note=06-polymorphism) (C++) and applied in [note 09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java).

### The road ahead

The back half of the course doesn't introduce a fifth pillar -- it goes *deeper* into these four. As those notes land, they'll attach here:

- **UML** -- a notation for drawing the **Inheritance** + **Abstraction** structure (the `is-a` tree; abstract-class vs. interface boxes). *(forthcoming)*
- **Design patterns** -- reusable shapes built mostly from **Polymorphism** + **Abstraction** (factory, strategy, ...). *(forthcoming)*
- **JVM mechanics** -- how **Polymorphism** is actually implemented: per-class method tables and dynamic dispatch (previewed by `java-dispatch` in [note 09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java)). *(forthcoming)*

### Inheritance shapes, and who allows which

The **Inheritance** branch above fans out into four shapes, and the two languages don't permit the same set:

| Shape | C++ | Java |
|---|---|---|
| Single (A -> B) | yes | yes |
| Single, multi-level (A -> B -> C) | yes | yes |
| Multiple (several bases at once) | yes | **no** (classes) |
| Multi-level + multiple | yes | **no** (classes) |

Java forbids multiple **class** inheritance to dodge the diamond problem -- but a class may **implement multiple interfaces**, which recovers most of the benefit. That exception is exactly why interfaces matter, so they get the rest of this note.

## Concrete vs. abstract vs. interface

These are the three things you can declare in the **Abstraction** branch. They differ along one axis -- *how much is left unimplemented* -- and that single difference drives every other rule.

First, two verbs that are easy to conflate:

- **Define** an object = declare a *reference* of that type: `Shape s;`. Legal for all three (a base-typed handle is always fine).
- **Create** an object = *instantiate* with `new`: `new Shape()`. Only legal when nothing is left abstract.

With that distinction, the full comparison:

| | Concrete class | Abstract class | Interface |
|---|---|---|---|
| **Methods** | all implemented | may or may not contain abstract methods | abstract by default; may add non-abstract `private` / `default` / `static` |
| **Define a reference** (`T x;`) | yes | yes | yes |
| **Create with `new`** (`new T()`) | **yes** | **no** | **no** |
| **Extends / implements** | extends **one** class | extends **one** class | an interface **extends many** interfaces; a class **implements many** interfaces |
| **That super can be...** | concrete or abstract | concrete or abstract | -- |
| **C++ equivalent** | class with **all** methods `virtual` | class with **>= 1** method *pure* virtual (`= 0`) | class with **all** methods *pure* virtual |

Read the **C++ equivalent** row top-to-bottom and the whole table collapses to a single spectrum: as you make more methods pure virtual, you slide from *concrete* (none) through *abstract* (some) to *interface* (all) -- and the moment even one method is pure virtual, you lose the ability to `new` it.

> This row supersedes the brief equivalence note at the end of [C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java) and the abstract-method table in [note 09's v4](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java) -- both point here.

### Why an interface isn't just "an abstract class with no fields"

Two practical differences carry their weight:

- **Multiple implementation.** A class extends at most one (abstract) class but can implement any number of interfaces -- this is Java's controlled substitute for multiple inheritance.
- **Modern interfaces aren't purely abstract.** Since the contract-only days, Java added `default` methods (a body the implementer inherits unless it overrides), `static` helpers, and `private` helpers. So "interface = all pure virtual" is the *original* picture; the C++ equivalence row captures that clean mental model, while real Java interfaces have grown a few concrete corners.
