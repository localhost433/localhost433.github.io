---
title: "OOP Pillars & Course Roadmap"
date: "2026-05-18/07-01"
---

## The four pillars

Every OOP feature in this course is one of four ideas. The list below is the skeleton; each branch links to the note that builds it out -- and is where later topics attach.

- **Encapsulation** -- access specifiers; getters & setters
- **Inheritance** -- single · single multi-level · multiple · multi-level multiple
- **Abstraction** -- abstract classes; interfaces
- **Polymorphism** -- late binding (virtual functions) · virtual inheritance · method overloading / overriding

- **Encapsulation** -- bundle state with the code that guards it, then expose a controlled surface. See access specifiers in [C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java) and getters/setters in [Classes & Objects](note.html?course=CSCI-UA-470&note=03-classes-objects).
- **Inheritance** -- one class reuses and extends another. Built in [Inheritance](note.html?course=CSCI-UA-470&note=05-inheritance) (C++) and contrasted in [C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java).
- **Abstraction** -- program against a contract, not a concrete type. Abstract classes appear in [Polymorphism & Abstract Classes](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java); interfaces are nailed down [below](#concrete-vs-abstract-vs-interface).
- **Polymorphism** -- one call, many behaviors, chosen by the object's runtime type. Built in [Polymorphism & Virtual Functions](note.html?course=CSCI-UA-470&note=06-polymorphism) (C++) and applied in [note 09](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java).

### Where the later notes attach

The back half of the course does not introduce a fifth pillar. It either deepens these four ideas or adds Java-specific supporting machinery around them:

- **Java syntax and language contrast** -- access, references, inheritance, and Java object rules are organized in [C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java).
- **Polymorphic design** -- abstract base types and shape hierarchies are developed in [Polymorphism & Abstract Classes](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java).
- **Java I/O and `final`** -- text files, binary files, serialization, and `final` are covered in [Java Files, Serialization & final](note.html?course=CSCI-UA-470&note=10-java-files-final).
- **JVM mechanics** -- bytecode, class loading, runtime areas, interpretation, JIT compilation, and garbage collection are covered in [JVM, Bytecode & Runtime Architecture](note.html?course=CSCI-UA-470&note=11-jvm-runtime).
- **Systematic Java/C++ comparison** -- the consolidated table of Java versus C++ rules is in [Java vs. C++: Systematic Comparison](note.html?course=CSCI-UA-470&note=13-java-cpp-systematic-comparison).
- **UML and design patterns** -- these are reusable notations and designs built mostly from **Inheritance**, **Abstraction**, and **Polymorphism**. UML is developed in [UML & Use Case Diagrams](note.html?course=CSCI-UA-470&note=12-uml-use-case-diagrams).

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
| **C++ equivalent** | ordinary concrete class; mark methods `virtual` only when polymorphic dispatch is needed | class with **>= 1** method *pure* virtual (`= 0`) | interface-like class with **all** required methods *pure* virtual |

Read the **C++ equivalent** row top-to-bottom as a spectrum of implementation: a concrete class has enough implementation to instantiate; the moment even one method is pure virtual, the class becomes abstract and you lose the ability to create a direct object of that type; an interface-like C++ class is the extreme case where the required operations are all pure virtual.

```artifact src=demos/concrete-abstract-interface.jsx static
```

> This row supersedes the brief equivalence note at the end of [C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java) and the abstract-method table in [note 09's v4](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java) -- both point here.

### Why an interface isn't just "an abstract class with no fields"

Two practical differences carry their weight:

- **Multiple implementation.** A class extends at most one (abstract) class but can implement any number of interfaces -- this is Java's controlled substitute for multiple inheritance.
- **Modern interfaces aren't purely abstract.** Since the contract-only days, Java added `default` methods (a body the implementer inherits unless it overrides), `static` helpers, and `private` helpers. So "interface = all pure virtual" is the *original* picture; the C++ equivalence row captures that clean mental model, while real Java interfaces have grown a few concrete corners.


## Cross-reference map

| Concept | Main note entries |
|---|---|
| Encapsulation | [03 - Classes & Objects](note.html?course=CSCI-UA-470&note=03-classes-objects), [08 - C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java), [13 - Java vs. C++](note.html?course=CSCI-UA-470&note=13-java-cpp-systematic-comparison) |
| Inheritance | [05 - Inheritance](note.html?course=CSCI-UA-470&note=05-inheritance), [08 - C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java), [13 - Java vs. C++](note.html?course=CSCI-UA-470&note=13-java-cpp-systematic-comparison) |
| Polymorphism | [06 - Polymorphism & Virtual Functions](note.html?course=CSCI-UA-470&note=06-polymorphism), [09 - Polymorphism & Abstract Classes](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java), [13 - Java vs. C++](note.html?course=CSCI-UA-470&note=13-java-cpp-systematic-comparison) |
| Abstraction | [09 - Polymorphism & Abstract Classes](note.html?course=CSCI-UA-470&note=09-polymorphism-design-java), this note's [concrete/abstract/interface comparison](#concrete-vs-abstract-vs-interface), [13 - Java vs. C++](note.html?course=CSCI-UA-470&note=13-java-cpp-systematic-comparison) |
| Runtime / JVM | [11 - JVM, Bytecode & Runtime Architecture](note.html?course=CSCI-UA-470&note=11-jvm-runtime), [13 - Java vs. C++](note.html?course=CSCI-UA-470&note=13-java-cpp-systematic-comparison) |
