/* AUTO-GENERATED from practice-08-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 08 practice — the C++/Java contrasts most likely to be tested: the
   compilation model, Java's heap-only objects and reference-by-value semantics
   (the swap no-op), and the inheritance/binding differences. */

export default mcq({
  questions: [{
    stem: "What is the headline difference in the **compilation model**?",
    choices: [{
      text: "C++ → native code per platform; Java → bytecode for a JVM",
      correct: true
    }, {
      text: "Both compile to bytecode; only the runtime differs"
    }, {
      text: "C++ is interpreted; Java is compiled to native code"
    }, {
      text: "Both produce platform-independent binaries"
    }],
    why: "C++ compiles **all the way to machine code** for one platform, so you must recompile to get a different binary per target (`a.out` vs `.exe`). Java compiles once to **bytecode** (`.class`), and a **JVM** on each machine runs it — write once, run anywhere."
  }, {
    stem: "This Java `swap` is meant to exchange two objects. What do callers observe?",
    figure: {
      code: "static void swap(Person x, Person y) {\n    Person tmp = x;\n    x = y;\n    y = tmp;\n}",
      lang: "java"
    },
    choices: [{
      text: "Nothing — refs by value; local rebinding doesn't apply",
      correct: true
    }, {
      text: "The two objects are swapped correctly"
    }, {
      text: "A compile error — cannot reassign parameters"
    }, {
      text: "The two references become `null`"
    }],
    why: "Java passes **references by value**: `x` and `y` are *copies* of the caller's references. Reassigning them rebinds only the locals, so the caller sees no change. To actually swap, exchange the **fields** (`x.age`↔`y.age`, `x.name`↔`y.name`) so the two heap objects trade state."
  }, {
    stem: "After `p1 = p2;` below, what is `p1.name`, and what happens to the original `\"James\"` object?",
    figure: {
      code: "Person p1 = new Person(\"James\", 20);\nPerson p2 = new Person(\"Maya\", 18);\np1 = p2;\np2.age = 30;\np1.age;    // ?\np1.name;   // ?",
      lang: "java"
    },
    choices: [{
      text: "`p1.age`=30, `p1.name`=\"Maya\" — same object; \"James\" garbage",
      correct: true
    }, {
      text: "`p1` still holds \"James\", 20 — assignment copies the object"
    }, {
      text: "`p1.age` is 18 — `p1` sees a snapshot from assignment time"
    }, {
      text: "A compile error — cannot assign one object to another"
    }],
    why: "Assignment copies the **reference**, not the object. After `p1 = p2`, both point at the **same** `\"Maya\"` object, so `p2.age = 30` is visible through `p1`. The original `\"James\"` object now has no reference and becomes eligible for **garbage collection**."
  }, {
    stem: "How are objects created and destroyed in Java, compared with C++?",
    choices: [{
      text: "Java objects always use `new` on the heap; garbage collector reclaims them",
      correct: true
    }, {
      text: "Java has stack and heap objects just like C++, freed with `delete`"
    }, {
      text: "Java objects freed by explicit destructors `~Class()`"
    }, {
      text: "Java allocates on stack; C++ only on heap"
    }],
    why: "In Java **every** object is created with `new` on the **heap**, reached through a reference — there is no `Person p1;` stack object and no `delete`. The **garbage collector** reclaims unreferenced objects, so Java has **no destructor** (its finalizer is not a C++-style destructor)."
  }, {
    stem: "Which inheritance/binding statement about Java (vs C++) is correct?",
    choices: [{
      text: "Methods virtual; `public` inheritance; no multiple class inheritance",
      correct: true
    }, {
      text: "Requires `virtual` like C++ and allows multiple class inheritance"
    }, {
      text: "Supports `private`/`protected`/`public` inheritance modes like C++"
    }, {
      text: "Forbids overriding; must use interfaces for everything"
    }],
    why: "Every non-`static`/`final`/`private` Java method is **virtual by default** (late binding, no keyword). Java has a single **`public`** inheritance mode, and forbids **multiple class inheritance** — precisely to avoid the diamond problem — offering multiple **interfaces** instead."
  }, {
    stem: "The note's one-line C++→Java mapping for abstraction: a C++ class with **one** pure virtual, vs one where **all** methods are pure virtual?",
    choices: [{
      text: "One pure virtual ↔ `abstract` class; all pure virtual ↔ `interface`",
      correct: true
    }, {
      text: "Both map to a Java `interface`"
    }, {
      text: "One pure virtual ↔ `interface`; all pure virtual ↔ `abstract` class"
    }, {
      text: "Both map to an ordinary concrete class"
    }],
    why: "A C++ class with **at least one** pure virtual method corresponds to a Java **`abstract` class** (some behavior defined, some deferred). A C++ class with **every** method pure virtual — pure interface, no state or bodies — corresponds to a Java **`interface`**."
  }]
});