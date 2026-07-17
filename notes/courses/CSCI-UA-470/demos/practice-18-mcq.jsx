import { mcq } from "@course";

/* note 18 practice — the synthesis note. Drills the four-pillar taxonomy and the
   abstraction trio the note settles: define-vs-create, concrete vs abstract vs
   interface, and why an interface is more than "an abstract class with no fields". */

export default mcq({
  questions: [
    {
      stem: "Which OOP pillar is \"one call, many behaviors, chosen by the object's **runtime** type\"?",
      choices: [
        { text: "Polymorphism", correct: true },
        { text: "Encapsulation" },
        { text: "Inheritance" },
        { text: "Abstraction" },
      ],
      why: "That is **polymorphism** — its sub-topics are late binding (virtual functions), virtual inheritance, and overloading/overriding. **Encapsulation** bundles state with its guarding code; **inheritance** reuses and extends a class; **abstraction** programs against a contract instead of a concrete type.",
    },
    {
      stem: "The note distinguishes two verbs. What is the difference between **defining** and **creating** an object?",
      figure: { code: "Shape s;         // define\nnew Shape();     // create", lang: "java" },
      choices: [
        { text: "**Define** = declare a reference of that type (always legal); **create** = instantiate with `new` (legal only when nothing is left abstract)", correct: true },
        { text: "They are two words for the same operation" },
        { text: "**Define** allocates memory; **create** only names a variable" },
        { text: "**Create** is legal for any type; **define** requires a concrete class" },
      ],
      why: "**Defining** a reference — `Shape s;` — is always fine, because a base-typed *handle* is legal even for abstract types. **Creating** — `new Shape()` — only works when the type has **nothing left abstract**. That single distinction drives the concrete/abstract/interface rules.",
    },
    {
      stem: "Which of a **concrete class**, an **abstract class**, and an **interface** can you instantiate with `new`?",
      choices: [
        { text: "Only the concrete class — abstract classes and interfaces leave methods unimplemented, so `new` is illegal for them", correct: true },
        { text: "All three — `new` works on any declared type" },
        { text: "Concrete classes and interfaces, but not abstract classes" },
        { text: "None — you always instantiate a subclass instead" },
      ],
      why: "The three differ by **how much is left unimplemented**. A **concrete** class implements everything → `new` is legal. An **abstract** class has ≥ 1 unimplemented method, and an **interface** is abstract by default → `new` is illegal for both. You can still *define* a reference of any of the three.",
    },
    {
      stem: "Why is an interface more than \"an abstract class with no fields\"? (the note gives two reasons)",
      choices: [
        { text: "A class can **implement many** interfaces (only **extend one** class) — Java's controlled substitute for multiple inheritance — and interfaces now allow `default`/`static`/`private` method bodies", correct: true },
        { text: "Interfaces can hold instance fields; abstract classes cannot" },
        { text: "Interfaces can be instantiated with `new`; abstract classes cannot" },
        { text: "There is no real difference — the terms are interchangeable" },
      ],
      why: "First, **multiple implementation**: a class extends at most one (abstract) class but implements **any number** of interfaces — Java's answer to forbidden multiple class inheritance. Second, modern interfaces are **not purely abstract**: they may add `default` (inherited body), `static`, and `private` helper methods. The clean 'all pure virtual' picture is the original model.",
    },
    {
      stem: "Mapping to C++: what is the C++ equivalent of a Java **abstract class** versus a Java **interface**?",
      choices: [
        { text: "Abstract class ↔ a class with **≥ 1** pure virtual (`= 0`); interface ↔ a class with **all** required methods pure virtual", correct: true },
        { text: "Both ↔ any class marked `virtual`" },
        { text: "Abstract class ↔ all methods pure virtual; interface ↔ one pure virtual" },
        { text: "Abstract class ↔ a `final` class; interface ↔ a `struct`" },
      ],
      why: "Read as a spectrum of implementation: an ordinary **concrete** C++ class instantiates freely; the moment **one** method is pure virtual the class is **abstract** (Java `abstract class`); the extreme where **every** required method is pure virtual is the **interface**-like class (Java `interface`).",
    },
    {
      stem: "Which inheritance shapes does **Java** forbid for classes, and what does it offer instead?",
      choices: [
        { text: "Multiple, and multi-level+multiple — to dodge the diamond problem; a class may `implement` many **interfaces** instead", correct: true },
        { text: "Single multi-level — Java allows only one level of inheritance" },
        { text: "None — Java allows every shape C++ does" },
        { text: "All inheritance — Java uses only composition" },
      ],
      why: "Java allows **single** and **single multi-level** class inheritance but forbids **multiple** and **multi-level + multiple** for classes, precisely to avoid the **diamond problem**. It recovers most of the benefit by letting a class **implement any number of interfaces**.",
    },
  ],
});
