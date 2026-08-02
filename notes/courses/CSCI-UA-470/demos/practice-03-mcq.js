/* AUTO-GENERATED from practice-03-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 03 practice — classes & objects: struct-vs-class (implicit `this`), the
   C++ default of PRIVATE access, blueprint-vs-instance, constructor rules, and the
   missing-`else` validation gotcha the note flags in both setter and constructor. */

export default mcq({
  questions: [{
    stem: "How does a C++ class method receive the object it acts on, compared with a C-style free function over a `struct`?",
    choices: [{
      text: "Method: implicitly `this`; function: explicit parameter",
      correct: true
    }, {
      text: "Both take the object as an explicit parameter"
    }, {
      text: "Method: explicit; function uses `this`"
    }, {
      text: "Neither receives it — both use global state"
    }],
    why: "A C-style `struct` is just data; a separate free function must be *handed* the struct: `intro(PERSON p)`. A C++ class bundles data **and** behavior, and the method is called *on* the object (`p1.intro()`), receiving it **implicitly as `this`**. That bundling of state with behavior is encapsulation."
  }, {
    stem: "With no access specifier, what is the visibility of `name` below — and does `p1.name` compile?",
    figure: {
      code: "class Person {\n    string name;\n};\nPerson p1;\np1.name = \"James\";   // ?",
      lang: "cpp"
    },
    choices: [{
      text: "`private` by default — `p1.name` is a compile error",
      correct: true
    }, {
      text: "`public` by default — `p1.name` works fine"
    }, {
      text: "`protected` by default — usable in subclasses only"
    }, {
      text: "Unspecified — it depends on the compiler"
    }],
    why: "**By default everything in a C++ class is `private`.** Without a `public:` specifier, outside code cannot touch `name`, so `p1.name = ...` is a compiler error. (A `struct` is the opposite — public by default — which is the main difference between `struct` and `class` in C++: default access, for both members and base classes.)"
  }, {
    stem: "Which statement about **classes vs. objects** is correct?",
    choices: [{
      text: "Class is a blueprint (no data); each object has its own data",
      correct: true
    }, {
      text: "Each object shares one copy of class attributes"
    }, {
      text: "Class is runtime; object is compile-time definition"
    }, {
      text: "Changing one object's field affects all objects of that class"
    }],
    why: "A **class** is a user-defined type — a logical blueprint defined once, occupying no data memory itself. An **object** is a concrete instance in memory with **its own** state. One class stamps out **many** independent objects: changing `p1.age` has no effect on `p2.age`."
  }, {
    stem: "Which is true of a C++ **constructor**?",
    choices: [{
      text: "Same name as class, no return type, can be overloaded",
      correct: true
    }, {
      text: "Named `init`, returns `void`, cannot be overloaded"
    }, {
      text: "Same name as class, returns that class type"
    }, {
      text: "You must write one — no default is ever supplied"
    }],
    why: "A constructor is named exactly like the class, has **no return type at all** (not even `void`), and can be **overloaded** so objects can be built several ways. If you define **no** constructor, the compiler supplies a default one; the moment you write your own, you control how objects start out."
  }, {
    stem: "This setter is meant to reject negative radii. What does it actually do?",
    figure: {
      code: "void set_radius(double r) {\n    if (r < 0) { radius = 0; }\n    radius = r;\n}",
      lang: "cpp"
    },
    choices: [{
      text: "Guard is useless — `radius = r;` overwrites it",
      correct: true
    }, {
      text: "It correctly clamps negative input to 0"
    }, {
      text: "Compile error — missing `else` statement"
    }, {
      text: "It stores 0 for every input, negative or positive"
    }],
    why: "Without an `else`, the final `radius = r;` runs on **every** path, so even after `radius = 0` the next line overwrites it with the negative `r`. The validation is defeated. The fix is `if (r < 0) radius = 0; else radius = r;` — the note flags this same bug in the constructors too."
  }, {
    stem: "When does a **destructor** run, and what is its signature?",
    choices: [{
      text: "Automatically on destruction; named `~ClassName()`; no params",
      correct: true
    }, {
      text: "Only when explicitly called; named `ClassName()`"
    }, {
      text: "Once per class at program exit; named `destroy()`"
    }, {
      text: "Whenever object is copied; named `~ClassName(...)`"
    }],
    why: "A destructor runs **automatically** when an object dies — a stack object at end of scope, a heap object at `delete`. It is written `~ClassName()` with **no parameters and no return type**. For objects of plain values there is nothing to do; it becomes essential once the object owns **heap memory** (Resource Management, note 04)."
  }]
});