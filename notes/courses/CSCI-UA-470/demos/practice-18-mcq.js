/* AUTO-GENERATED from practice-18-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 18 practice — the synthesis note. Drills the four-pillar taxonomy and the
   abstraction trio the note settles: define-vs-create, concrete vs abstract vs
   interface, and why an interface is more than "an abstract class with no fields". */

export default mcq({
  questions: [{
    stem: "Which OOP pillar is \"one call, many behaviors, chosen by the object's **runtime** type\"?",
    choices: [{
      text: "Polymorphism",
      correct: true
    }, {
      text: "Encapsulation"
    }, {
      text: "Inheritance"
    }, {
      text: "Abstraction"
    }],
    why: "That is **polymorphism** — its sub-topics are late binding (virtual functions), virtual inheritance, and overloading/overriding. **Encapsulation** bundles state with its guarding code; **inheritance** reuses and extends a class; **abstraction** programs against a contract instead of a concrete type."
  }, {
    stem: "The note distinguishes two verbs. What is the difference between **defining** and **creating** an object?",
    figure: {
      code: "Shape s;         // define\nnew Shape();     // create",
      lang: "java"
    },
    choices: [{
      text: "**Define** declares a reference; **create** instantiates with `new`",
      correct: true
    }, {
      text: "They are two words for the same operation"
    }, {
      text: "**Define** allocates memory; **create** only names a variable"
    }, {
      text: "**Create** works for any type; **define** requires concrete"
    }],
    why: "**Defining** a reference — `Shape s;` — is always fine, because a base-typed *handle* is legal even for abstract types. **Creating** — `new Shape()` — only works when the type has **nothing left abstract**. That single distinction drives the concrete/abstract/interface rules."
  }, {
    stem: "Which of a **concrete class**, an **abstract class**, and an **interface** can you instantiate with `new`?",
    choices: [{
      text: "Only the concrete class",
      correct: true
    }, {
      text: "All three — `new` works on any type"
    }, {
      text: "Concrete classes and interfaces only"
    }, {
      text: "None — you always use subclasses"
    }],
    why: "The three differ by **how much is left unimplemented**. A **concrete** class implements everything → `new` is legal. An **abstract** class has ≥ 1 unimplemented method, and an **interface** is abstract by default → `new` is illegal for both. You can still *define* a reference of any of the three."
  }, {
    stem: "Why is an interface more than \"an abstract class with no fields\"? (the note gives two reasons)",
    choices: [{
      text: "Multiple implementation and modern `default`/`static`/`private` methods",
      correct: true
    }, {
      text: "Interfaces can hold instance fields; abstract classes cannot"
    }, {
      text: "Interfaces can be instantiated; abstract classes cannot"
    }, {
      text: "There is no real difference between them"
    }],
    why: "First, **multiple implementation**: a class extends at most one (abstract) class but implements **any number** of interfaces — Java's answer to forbidden multiple class inheritance. Second, modern interfaces are **not purely abstract**: they may add `default` (inherited body), `static`, and `private` helper methods. The clean 'all pure virtual' picture is the original model."
  }, {
    stem: "Mapping to C++: what is the C++ equivalent of a Java **abstract class** versus a Java **interface**?",
    choices: [{
      text: "Abstract class ↔ ≥ 1 pure virtual; interface ↔ all pure virtual",
      correct: true
    }, {
      text: "Both ↔ any class marked `virtual`"
    }, {
      text: "Abstract ↔ all pure virtual; interface ↔ one pure virtual"
    }, {
      text: "Abstract ↔ `final` class; interface ↔ `struct`"
    }],
    why: "Read as a spectrum of implementation: an ordinary **concrete** C++ class instantiates freely; the moment **one** method is pure virtual the class is **abstract** (Java `abstract class`); the extreme where **every** required method is pure virtual is the **interface**-like class (Java `interface`)."
  }, {
    stem: "Which inheritance shapes does **Java** forbid for classes, and what does it offer instead?",
    choices: [{
      text: "Multiple and multi-level+multiple; uses interface implementation",
      correct: true
    }, {
      text: "Single multi-level — only one inheritance level allowed"
    }, {
      text: "None — Java allows all shapes C++ does"
    }, {
      text: "All inheritance — uses composition instead"
    }],
    why: "Java allows **single** and **single multi-level** class inheritance but forbids **multiple** and **multi-level + multiple** for classes, precisely to avoid the **diamond problem**. It recovers most of the benefit by letting a class **implement any number of interfaces**."
  }]
});