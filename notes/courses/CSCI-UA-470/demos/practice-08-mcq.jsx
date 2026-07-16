import { mcq } from "@course";

/* note 08 practice — the C++/Java contrasts most likely to be tested: the
   compilation model, Java's heap-only objects and reference-by-value semantics
   (the swap no-op), and the inheritance/binding differences. */

export default mcq({
  questions: [
    {
      stem: "What is the headline difference in the **compilation model**?",
      choices: [
        { text: "C++ compiles to **native machine code per platform** (recompile for each target); Java compiles once to **bytecode** that a JVM runs on each OS", correct: true },
        { text: "Both compile to bytecode; only the run step differs" },
        { text: "C++ is interpreted; Java is compiled to native code" },
        { text: "Both produce a platform-independent binary" },
      ],
      why: "C++ compiles **all the way to machine code** for one platform, so you must recompile to get a different binary per target (`a.out` vs `.exe`). Java compiles once to **bytecode** (`.class`), and a **JVM** on each machine runs it — write once, run anywhere.",
    },
    {
      stem: "This Java `swap` is meant to exchange two objects. What do callers observe?",
      figure: { code: "static void swap(Person x, Person y) {\n    Person tmp = x;\n    x = y;\n    y = tmp;\n}", lang: "java" },
      choices: [
        { text: "Nothing — Java passes references **by value**, so this only rebinds the local copies; the caller's objects are unchanged", correct: true },
        { text: "The two objects are swapped correctly" },
        { text: "A compile error — you cannot reassign parameters" },
        { text: "The two references become `null`" },
      ],
      why: "Java passes **references by value**: `x` and `y` are *copies* of the caller's references. Reassigning them rebinds only the locals, so the caller sees no change. To actually swap, exchange the **fields** (`x.age`↔`y.age`, `x.name`↔`y.name`) so the two heap objects trade state.",
    },
    {
      stem: "After `p1 = p2;` below, what is `p1.name`, and what happens to the original `\"James\"` object?",
      figure: { code: "Person p1 = new Person(\"James\", 20);\nPerson p2 = new Person(\"Maya\", 18);\np1 = p2;\np2.age = 30;\np1.age;    // ?\np1.name;   // ?", lang: "java" },
      choices: [
        { text: "`p1.age` is 30 and `p1.name` is \"Maya\" — both names alias the one object; the `\"James\"` object is now unreferenced garbage", correct: true },
        { text: "`p1` still holds \"James\", 20 — assignment copies the object" },
        { text: "`p1.age` is 18 — `p1` sees a snapshot taken at assignment time" },
        { text: "A compile error — you cannot assign one object to another" },
      ],
      why: "Assignment copies the **reference**, not the object. After `p1 = p2`, both point at the **same** `\"Maya\"` object, so `p2.age = 30` is visible through `p1`. The original `\"James\"` object now has no reference and becomes eligible for **garbage collection**.",
    },
    {
      stem: "How are objects created and destroyed in Java, compared with C++?",
      choices: [
        { text: "Java objects are **always on the heap** via `new` (no stack objects) and reclaimed by the **garbage collector** — there is no `delete` and no destructor", correct: true },
        { text: "Java has stack and heap objects just like C++, freed with `delete`" },
        { text: "Java objects are freed by an explicit destructor `~Class()`" },
        { text: "Java allocates on the stack; C++ only on the heap" },
      ],
      why: "In Java **every** object is created with `new` on the **heap**, reached through a reference — there is no `Person p1;` stack object and no `delete`. The **garbage collector** reclaims unreferenced objects, so Java has **no destructor** (its finalizer is not a C++-style destructor).",
    },
    {
      stem: "Which inheritance/binding statement about Java (vs C++) is correct?",
      choices: [
        { text: "Java methods are **virtual by default**, inheritance is **`public` only**, and **multiple** class inheritance is **not allowed** (interfaces instead)", correct: true },
        { text: "Java requires `virtual` like C++ and allows multiple class inheritance" },
        { text: "Java supports `private`/`protected`/`public` inheritance modes like C++" },
        { text: "Java forbids overriding; you must use interfaces for everything" },
      ],
      why: "Every non-`static`/`final`/`private` Java method is **virtual by default** (late binding, no keyword). Java has a single **`public`** inheritance mode, and forbids **multiple class inheritance** — precisely to avoid the diamond problem — offering multiple **interfaces** instead.",
    },
    {
      stem: "The note's one-line C++→Java mapping for abstraction: a C++ class with **one** pure virtual, vs one where **all** methods are pure virtual?",
      choices: [
        { text: "One pure virtual ↔ a Java `abstract` class; **all** pure virtual ↔ a Java `interface`", correct: true },
        { text: "Both map to a Java `interface`" },
        { text: "One pure virtual ↔ `interface`; all pure virtual ↔ `abstract` class" },
        { text: "Both map to an ordinary concrete class" },
      ],
      why: "A C++ class with **at least one** pure virtual method corresponds to a Java **`abstract` class** (some behavior defined, some deferred). A C++ class with **every** method pure virtual — pure interface, no state or bodies — corresponds to a Java **`interface`**.",
    },
  ],
});
