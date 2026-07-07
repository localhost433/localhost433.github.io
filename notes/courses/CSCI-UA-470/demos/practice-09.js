/* AUTO-GENERATED from practice-09.jsx by `npm run build:artifacts` — do not edit. */
import { quiz, stack } from "@course";

/* Note 09 practice — predict (Java always-virtual dispatch) + explore (C++
   virtual opt-in vs Java). Cells are simplified: a Shape handle and an object
   carrying a class pointer; the explore item adds a vtable slot when virtual. */

const handle = (name, type, to, hl) => stack(name, type, to, {
  id: name,
  hl
});
const object = (klass, hl) => stack("obj", "object", "", {
  id: "obj",
  hl,
  fields: [{
    name: "class",
    type: "ptr",
    size: 8,
    value: "→ " + klass
  }]
});
const vtable = (body, hl) => stack("vt", "Circle vtable", "", {
  id: "vt",
  hl,
  fields: [{
    name: "draw",
    type: "ptr",
    size: 8,
    value: body
  }]
});

// Item 1 — predict: Java dispatches on the runtime class.
const javaPredict = {
  title: "Which draw() runs?",
  lang: "java",
  code: `Shape s = new Circle();\ns.draw();`,
  steps: [{
    line: 1,
    cells: [handle("s", "Shape", "→ obj", true), object("Circle", true)],
    caption: {
      java: "`s` is declared `Shape` but references a `new Circle()`; the object carries a **class pointer** to `Circle`.",
      intuition: "The declared type of `s` is just a compile-time constraint."
    }
  }, {
    line: 2,
    predict: {
      ask: "`s` is declared `Shape s` but holds a `new Circle()`. When `s.draw()` runs, **which method body executes**?",
      choices: [{
        label: "`Shape.draw` — the declared type of `s`"
      }, {
        label: "`Circle.draw` — the runtime object is a `Circle`",
        correct: true
      }, {
        label: "A compile error — `draw()` is ambiguous"
      }],
      why: "Java dispatches on the object's **runtime class**, not the reference's declared type. Every non-`static`, non-`private` method is **virtual** by default, so `s.draw()` follows the object's class pointer to `Circle.draw`. The `Shape` in `Shape s` only limits what the compiler lets you call."
    },
    cells: [handle("s", "Shape", "→ obj"), object("Circle", true)],
    caption: {
      java: "`s.draw()` runs **`Circle.draw`** — chosen by the object's class, not by `s`'s type.",
      intuition: "Runtime type wins; the declared type never picks the body."
    }
  }]
};

// Item 2 — explore: C++ virtual opt-in vs Java always-on (no right answer).
const cppExplore = {
  title: "C++ dispatch: virtual opt-in vs Java's always-on",
  code: `Shape* s = new Circle();\ns->draw();   // which draw?`,
  knobs: [{
    id: "virt",
    label: "Base method",
    options: [{
      value: "non",
      label: "non-virtual"
    }, {
      value: "virt",
      label: "virtual"
    }],
    default: "non"
  }],
  steps: k => k.virt === "virt" ? [{
    line: 2,
    cells: [handle("s", "Shape*", "→ obj"), object("Circle", true), vtable("Circle::draw", true)],
    caption: {
      cpp: "`virtual` → **late binding**: `s->draw()` follows the object's vptr to the `Circle` vtable, so `Circle::draw` runs — like Java always does.",
      intuition: "With `virtual`, the runtime type wins."
    }
  }] : [{
    line: 2,
    cells: [handle("s", "Shape*", "→ obj", true), object("Circle")],
    caption: {
      cpp: "Non-virtual → **early binding**: the call is resolved at compile time from the **static type** `Shape`, so `Shape::draw` runs.",
      intuition: "C++ dispatches statically unless you write `virtual`; Java is always virtual."
    }
  }]
};
export default quiz({
  items: [{
    kind: "predict",
    scene: javaPredict
  }, {
    kind: "explore",
    scene: cppExplore
  }]
});