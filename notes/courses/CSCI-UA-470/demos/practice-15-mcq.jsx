import { mcq } from "@course";

/* note 15 practice — the systematic-comparison review. Deliberately drills traps
   that note 08's MCQ did NOT: `new` semantics, class-vs-struct default access,
   C++ static locals, the virtual-destructor rule, C++-vs-Java reference semantics,
   and friend/arrays. A final-review checklist, so the angle is breadth of contrasts. */

export default mcq({
  questions: [
    {
      stem: "`new int` — valid in which language(s)?",
      figure: { code: "int* p = new int;   // C++\nint i = new int;    // Java?", lang: "cpp" },
      choices: [
        { text: "C++ only — `new` there allocates **any** type and returns a pointer; Java's `new` creates **objects** only (primitives are not `new`-ed)", correct: true },
        { text: "Both — `new int` works identically in each" },
        { text: "Java only — C++ cannot `new` a primitive" },
        { text: "Neither — you must `new int[1]` in both" },
      ],
      why: "C++ `new` allocates **any** dynamically-created type — `new int`, `new Circle` — and returns a pointer. Java `new` creates **objects** only and returns a reference; `new int` is invalid because `int` is a primitive, not an object.",
    },
    {
      stem: "What is the default member access of a C++ `class` versus a C++ `struct`?",
      choices: [
        { text: "`class` members default to **private**; `struct` members default to **public** — that default is the only real difference between them", correct: true },
        { text: "Both default to public" },
        { text: "Both default to private" },
        { text: "`class` defaults to public; `struct` to private" },
      ],
      why: "In C++ the *only* language-level difference between `class` and `struct` is the default access: **`class` → private**, **`struct` → public**. (Java has no `struct`; its default access is package-private.)",
    },
    {
      stem: "\"Java has no static variables\" — why is that imprecise?",
      choices: [
        { text: "Java has static **fields** (class-level members); what it lacks is C++-style **local static variables** inside a function", correct: true },
        { text: "It is fully correct — Java has no `static` at all" },
        { text: "Java has local statics but no static fields" },
        { text: "Java `static` applies only to methods, never data" },
      ],
      why: "Java supports `static` **fields** and methods (belonging to the class, not an object). What it does **not** have is the C++ **function-local `static`** variable that persists across calls. So the precise statement is 'Java has static fields but not C++-style local statics.'",
    },
    {
      stem: "In C++, when must a polymorphic base class declare a **`virtual` destructor**?",
      figure: { code: "Base* p = new Derived();\ndelete p;   // ?", lang: "cpp" },
      choices: [
        { text: "When derived objects are deleted through a **base pointer** — without a virtual destructor, `~Derived` is skipped (undefined behavior)", correct: true },
        { text: "Never — destructors cannot be virtual" },
        { text: "Only when the class has no other virtual methods" },
        { text: "Always, even for classes that are never inherited" },
      ],
      why: "`delete p;` on a `Base*` that points at a `Derived` runs the **static** type's destructor unless it is `virtual`. Without a virtual destructor, `~Derived` never runs (resource leak / undefined behavior). Java sidesteps this entirely — no destructors, GC handles reclamation.",
    },
    {
      stem: "How does a C++ **reference** differ from a Java **reference**?",
      choices: [
        { text: "A C++ reference is an **alias** — it must be initialized and cannot be reseated or null; a Java reference is a pointer-like handle that can be `null` and reassigned", correct: true },
        { text: "They are the same concept with different syntax" },
        { text: "A C++ reference can be null; a Java reference cannot" },
        { text: "A Java reference exposes pointer arithmetic; a C++ reference does not" },
      ],
      why: "A **C++ reference** is a true **alias** for one variable: it must be initialized when declared and can never be reseated or made null. A **Java reference** is a pointer-like handle to a heap object — it can be `null` and reassigned — but, unlike a C++ pointer, exposes no pointer arithmetic.",
    },
    {
      stem: "Which pair of statements is correct?",
      choices: [
        { text: "C++ has `friend` (Java does not); Java arrays are **objects that know their length** (raw C++ arrays carry no length metadata)", correct: true },
        { text: "Java has `friend`; C++ arrays know their length" },
        { text: "Both languages have `friend`; neither array type knows its length" },
        { text: "Neither language has `friend`; both array types know their length" },
      ],
      why: "**`friend`** (granting a chosen function/class access to private members) is a **C++** feature with **no Java** equivalent. **Java arrays** are objects with a `.length`; a **raw C++ array** is just a block of elements with no safe length metadata (which is why you track the size yourself).",
    },
  ],
});
