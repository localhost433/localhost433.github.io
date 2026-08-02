/* AUTO-GENERATED from practice-17-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 17 practice — the systematic-comparison review. Deliberately drills traps
   that note 08's MCQ did NOT: `new` semantics, class-vs-struct default access,
   C++ static locals, the virtual-destructor rule, C++-vs-Java reference semantics,
   and friend/arrays. A final-review checklist, so the angle is breadth of contrasts. */

export default mcq({
  questions: [{
    stem: "`new int` — valid in which language(s)?",
    figure: {
      code: "int* p = new int;   // C++\nint i = new int;    // Java?",
      lang: "cpp"
    },
    choices: [{
      text: "C++ only — `new` allocates any type; Java objects only",
      correct: true
    }, {
      text: "Both — `new int` works identically in each"
    }, {
      text: "Java only — C++ cannot `new` primitives"
    }, {
      text: "Neither — must use `new int[1]` in both"
    }],
    why: "C++ `new` allocates **any** dynamically-created type — `new int`, `new Circle` — and returns a pointer. Java `new` creates **objects** only and returns a reference; `new int` is invalid because `int` is a primitive, not an object."
  }, {
    stem: "What is the default member access of a C++ `class` versus a C++ `struct`?",
    choices: [{
      text: "`class` private; `struct` public by default",
      correct: true
    }, {
      text: "Both default to public"
    }, {
      text: "Both default to private"
    }, {
      text: "`class` → public; `struct` → private"
    }],
    why: "In C++ the *only* language-level difference between `class` and `struct` is the default access: **`class` → private**, **`struct` → public**. (Java has no `struct`; its default access is package-private.)"
  }, {
    stem: "\"Java has no static variables\" — why is that imprecise?",
    choices: [{
      text: "Java has static **fields**; lacks C++ **local statics**",
      correct: true
    }, {
      text: "It is fully correct — Java has no `static`"
    }, {
      text: "Java has local statics but no static fields"
    }, {
      text: "Java `static` applies only to methods"
    }],
    why: "Java supports `static` **fields** and methods (belonging to the class, not an object). What it does **not** have is the C++ **function-local `static`** variable that persists across calls. So the precise statement is 'Java has static fields but not C++-style local statics.'"
  }, {
    stem: "In C++, when must a polymorphic base class declare a **`virtual` destructor**?",
    figure: {
      code: "Base* p = new Derived();\ndelete p;   // ?",
      lang: "cpp"
    },
    choices: [{
      text: "Deleting via base pointer — else `~Derived` skipped",
      correct: true
    }, {
      text: "Never — destructors cannot be virtual"
    }, {
      text: "Only when the class has no other virtual methods"
    }, {
      text: "Always, even for classes never inherited"
    }],
    why: "`delete p;` on a `Base*` that points at a `Derived` runs the **static** type's destructor unless it is `virtual`. Without a virtual destructor, `~Derived` never runs (resource leak / undefined behavior). Java sidesteps this entirely — no destructors, GC handles reclamation."
  }, {
    stem: "How does a C++ **reference** differ from a Java **reference**?",
    choices: [{
      text: "C++ alias (fixed, non-null); Java handle (mutable, nullable)",
      correct: true
    }, {
      text: "They are the same concept with different syntax"
    }, {
      text: "C++ references can be null; Java references cannot"
    }, {
      text: "Java references expose pointer arithmetic; C++ does not"
    }],
    why: "A **C++ reference** is a true **alias** for one variable: it must be initialized when declared and can never be reseated or made null. A **Java reference** is a pointer-like handle to a heap object — it can be `null` and reassigned — but, unlike a C++ pointer, exposes no pointer arithmetic."
  }, {
    stem: "Which pair of statements is correct?",
    choices: [{
      text: "C++ `friend` (Java lacks); Java arrays have length",
      correct: true
    }, {
      text: "Java has `friend`; C++ arrays know their length"
    }, {
      text: "Both have `friend`; neither array type knows length"
    }, {
      text: "Neither has `friend`; both array types know length"
    }],
    why: "**`friend`** (granting a chosen function/class access to private members) is a **C++** feature with **no Java** equivalent. **Java arrays** are objects with a `.length`; a **raw C++ array** is just a block of elements with no safe length metadata (which is why you track the size yourself)."
  }]
});