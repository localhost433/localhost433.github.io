import { scene, stack } from "@course";

/* Standalone predict: Java dispatches on the object's runtime class. The reveal
   shows the object's class pointer resolving to Circle.draw. */
const handle = (name, type, to, hl) => stack(name, type, to, { id: name, hl });
const object = (klass, hl) => stack("obj", "object", "", { id: "obj", hl, fields: [
  { name: "class", type: "ptr", size: 8, value: "→ " + klass },
]});

export default scene({
  title: "Which draw() runs?",
  lang: "java",
  code: "Shape s = new Circle();\ns.draw();",
  steps: [
    {
      line: 1,
      cells: [handle("s", "Shape", "→ obj", true), object("Circle", true)],
      caption: {
        java: "`s` is declared `Shape` but references a `new Circle()`; the object carries a **class pointer** to `Circle`.",
        intuition: "The declared type of `s` is just a compile-time constraint.",
      },
    },
    {
      line: 2,
      predict: {
        ask: "`s` is declared `Shape s` but holds a `new Circle()`. When `s.draw()` runs, **which method body executes**?",
        choices: [
          { label: "`Shape.draw` — the declared type of `s`" },
          { label: "`Circle.draw` — the runtime object is a `Circle`", correct: true },
          { label: "A compile error — `draw()` is ambiguous" },
        ],
        why: "Java dispatches on the object's **runtime class**, not the reference's declared type. Every non-`static`, non-`private` method is **virtual** by default, so `s.draw()` follows the object's class pointer to `Circle.draw`. The `Shape` in `Shape s` only limits what the compiler lets you call.",
      },
      cells: [handle("s", "Shape", "→ obj"), object("Circle", true)],
      caption: {
        java: "`s.draw()` runs **`Circle.draw`** — chosen by the object's class, not by `s`'s type.",
        intuition: "Runtime type wins; the declared type never picks the body.",
      },
    },
  ],
});
