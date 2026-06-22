/* AUTO-GENERATED from java-dispatch.jsx by `npm run build:artifacts` — do not edit. */
import { scene, obj, glob, text } from "@course";

/* The Java analog of vtable-internals. A method table is an ARRAY of slots, one
   per virtual method, in a fixed order shared by a class and its subclasses.
   `Circle` overrides `draw` only: its table swaps the `draw` slot to Circle.draw
   while the `area` slot keeps the base's Shape.area entry. The heap object's
   class pointer selects the table; `invokevirtual` names a method, the JVM
   resolves it to a fixed slot. (Slots are named draw/area — not #0/#1 — because a
   real table front-loads Object's methods, so a numeric index here would lie.) */

const code = `class Shape {
    void draw() { }
    double area() { return 0; }
}
class Circle extends Shape {
    void draw() { }
}

Shape s = new Circle();
s.draw();
s.area();`;

// each method body lives once in the Code segment, shared by every instance.
const SHAPE_DRAW = hl => text("Shape.draw", "method", "(default)", {
  id: "shape_draw",
  hl
});
const SHAPE_AREA = hl => text("Shape.area", "method", "return 0", {
  id: "shape_area",
  hl
});
const CIRCLE_DRAW = hl => text("Circle.draw", "method", "g.oval(...)", {
  id: "circle_draw",
  hl
});

// method tables as arrays of slots. Same slot order in both tables; an override
// swaps one slot, an inherited method keeps the base's entry (same target id).
const SHAPE_MT = hl => glob("Shape methods", "method table", "", {
  id: "mt_shape",
  hl,
  fields: [{
    name: "draw",
    size: 8,
    to: "shape_draw",
    value: "&Shape.draw"
  }, {
    name: "area",
    size: 8,
    to: "shape_area",
    value: "&Shape.area"
  }]
});
const CIRCLE_MT = hl => glob("Circle methods", "method table", "", {
  id: "mt_circle",
  hl,
  fields: [{
    name: "draw",
    size: 8,
    to: "circle_draw",
    value: "&Circle.draw"
  }, {
    name: "area",
    size: 8,
    to: "shape_area",
    value: "&Shape.area"
  }]
});

// the Circle on the heap: Java header + a class pointer selecting Circle's table.
const circleObj = obj("Circle", [{
  name: "color",
  type: "String",
  size: 32
}], {
  region: "heap",
  header: 12,
  vptr: "mt_circle"
});
const OBJ = hl => circleObj("s", {
  color: '"red"'
}, {
  hl
});
const steps = [{
  line: [1, 2, 3, 4],
  cells: [SHAPE_MT(true), SHAPE_DRAW(), SHAPE_AREA()],
  caption: {
    java: "`Shape` declares two methods, `draw()` and `area()`.",
    jvm: "Each class gets a **method table** — an array with one slot per virtual method, in a **fixed order**. `Shape`'s table holds a `draw` slot and an `area` slot, each pointing at a body in the Code segment.",
    intuition: "A method table is a **constant array of method entries**, one table per class."
  }
}, {
  line: [5, 6, 7],
  cells: [SHAPE_MT(), SHAPE_DRAW(), SHAPE_AREA(), CIRCLE_MT(true), CIRCLE_DRAW()],
  caption: {
    java: "`Circle extends Shape` and overrides `draw()`, but **inherits** `area()`.",
    jvm: "`Circle`'s table reuses the **same slot order**: the `draw` slot now holds **`Circle.draw`** (the override); the `area` slot still holds **`Shape.area`** (inherited — the very same entry).",
    intuition: "Overriding swaps **one slot**; a slot you don't override keeps the **base's entry**."
  }
}, {
  line: 9,
  cells: [SHAPE_MT(), SHAPE_DRAW(), SHAPE_AREA(), CIRCLE_MT(), CIRCLE_DRAW(), OBJ(true)],
  caption: {
    java: "`Shape s = new Circle();` — `s` is declared `Shape`, but the object is a `Circle`.",
    jvm: "The object's header carries a **class pointer**, set at construction, pointing at **`Circle`'s table**. The static type of `s` never changes it.",
    intuition: "The object carries its class; the **declared type** doesn't decide which table."
  }
}, {
  line: 10,
  cells: [SHAPE_MT(), SHAPE_DRAW(), SHAPE_AREA(), CIRCLE_MT(true), CIRCLE_DRAW(true), OBJ(true)],
  caption: {
    java: "`s.draw()` runs **`Circle.draw`** — the override, chosen by the object's class.",
    jvm: "`invokevirtual Shape.draw:()V` names a method; the JVM resolves it to a fixed **`draw` slot**. The model: follow the receiver's class pointer to **`Circle`'s table**, index the `draw` slot → `Circle.draw`. (The JIT may inline this once it knows the class — the slot is the dispatch *model*, not a guaranteed lookup.)",
    intuition: "The **slot index** is fixed; the **class pointer** picks the table."
  }
}, {
  line: 11,
  cells: [SHAPE_MT(), SHAPE_DRAW(), SHAPE_AREA(true), CIRCLE_MT(true), CIRCLE_DRAW(), OBJ(true)],
  caption: {
    java: "`s.area()` runs **`Shape.area`** — inherited, because `Circle` never overrode it.",
    jvm: "`invokevirtual Shape.area:()D` resolves to the **`area` slot** of the same `Circle` table, which still holds **`Shape.area`**. A different slot index → a different method.",
    intuition: "Same object, **different slot** → different method. The **slot is the method**; the **class pointer is the object**."
  }
}];
export default scene({
  title: "Inside Java dispatch: a method table is an array of slots, one swapped by an override",
  code,
  steps,
  lang: "java"
});