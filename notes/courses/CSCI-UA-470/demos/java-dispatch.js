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

// Real `javap -c Demo` output (JDK 22) for the fragment above, compiled inside a
// real main(). Only the default constructor is elided.
// Regenerate/verify with: npm run check:bytecode
const asm = `class Demo {
… Demo() — default constructor elided
  public static void main(java.lang.String[]);
    Code:
       0: new           #7    // class Circle
       3: dup
       4: invokespecial #9    // Method Circle."<init>":()V
       7: astore_1
       8: aload_1
       9: invokevirtual #10   // Method Shape.draw:()V
      12: aload_1
      13: invokevirtual #15   // Method Shape.area:()D
      16: pop2
      17: return
}`;

// source line (in `code`) -> bytecode line numbers (in `asm`)
const asmMap = {
  9: [5, 6, 7, 8],
  // Shape s = new Circle();  -> new, dup, invokespecial, astore_1
  10: [9, 10],
  // s.draw();                -> aload_1, invokevirtual #10
  11: [11, 12, 13] // s.area();                -> aload_1, invokevirtual #15, pop2
};
const asmLabel = "javap -c · JDK 22";

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
    jvm: "`new #7` allocates a raw `Circle` on the heap and `dup`s the reference so one copy survives the constructor call; `invokespecial #9` runs `Circle.<init>`, and `astore_1` stores the reference in local slot 1. The object's header carries a **class pointer**, set here, pointing at **`Circle`'s table**. The static type of `s` never changes it.",
    intuition: "The object carries its class; the **declared type** doesn't decide which table."
  }
}, {
  line: 10,
  cells: [SHAPE_MT(), SHAPE_DRAW(), SHAPE_AREA(), CIRCLE_MT(true), CIRCLE_DRAW(true), OBJ(true)],
  caption: {
    java: "`s.draw()` runs **`Circle.draw`** — the override, chosen by the object's class.",
    jvm: "`invokevirtual #10` — and the constant pool says `// Method **Shape**.draw:()V`. The bytecode names **`Shape`**, not `Circle`, even though the object *is* a `Circle`: `javac` only knew the **declared** type. The JVM resolves that to a fixed `draw` **slot**, follows the receiver's class pointer to **`Circle`'s table**, and runs the override. (The JIT may inline this once it knows the class — the slot is the dispatch *model*, not a guaranteed lookup.)",
    intuition: "The **slot index** is fixed; the **class pointer** picks the table."
  }
}, {
  line: 11,
  cells: [SHAPE_MT(), SHAPE_DRAW(), SHAPE_AREA(true), CIRCLE_MT(true), CIRCLE_DRAW(), OBJ(true)],
  caption: {
    java: "`s.area()` runs **`Shape.area`** — inherited, because `Circle` never overrode it.",
    jvm: "`invokevirtual #15` — a **different constant-pool entry** (`// Method Shape.area:()D`) resolving to the **`area` slot** of the same `Circle` table, which still holds **`Shape.area`**. The trailing `pop2` discards the returned `double`, which occupies two stack slots. A different slot index → a different method.",
    intuition: "Same object, **different slot** → different method. The **slot is the method**; the **class pointer is the object**."
  }
}];
export default scene({
  title: "Inside Java dispatch: a method table is an array of slots, one swapped by an override",
  code,
  steps,
  lang: "java",
  asm,
  asmMap,
  asmLabel,
  asmLang: "bytecode"
});