/* AUTO-GENERATED from practice-04.jsx by `npm run build:artifacts` — do not edit. */
import { quiz, stack, heap } from "@course";

/* Note 04 practice — predict (default memberwise copy shares one block) + goal
   (choose the deep copy so each object owns its own block). A Circle is a stack
   cell with a color field and an owned `radius` pointer into a heap int. */

const circle = (id, radiusTo, hl) => stack(id, "Circle", "", {
  id,
  hl,
  fields: [{
    name: "color",
    type: "string",
    size: 32,
    value: '"Red"'
  }, {
    name: "radius",
    type: "int*",
    size: 8,
    to: radiusTo
  }]
});
const RA = () => heap("", "int", "0", {
  id: "ra"
});
const RB = () => heap("", "int", "0", {
  id: "rb"
});

// Item 1 — predict: default copy is memberwise → shared pointer.
const copyPredict = {
  title: "Default copy of a pointer-owning object",
  code: `class Circle { string color; int* radius; };\nCircle a;        // radius = new int(0)\nCircle b = a;    // default (memberwise) copy`,
  steps: [{
    line: 2,
    cells: [circle("a", "ra", true), RA()],
    caption: {
      cpp: "`Circle a;` allocates one heap `int`; `a.radius` points at it.",
      intuition: "The object owns a heap block from construction."
    }
  }, {
    line: 3,
    predict: {
      ask: "With the **default** copy `Circle b = a;`, how many heap `int`s exist afterward?",
      choices: [{
        label: "One — `a` and `b` share it",
        correct: true
      }, {
        label: "Two — `b` gets its own"
      }],
      why: "The default copy is **memberwise**: it copies the `radius` **pointer value**, not the block it points to. So `a` and `b` share one heap `int` — the setup for a double free."
    },
    cells: [circle("a", "ra"), circle("b", "ra", true), RA()],
    caption: {
      cpp: "Members are copied bitwise, so `b.radius` holds the **same address** as `a.radius`.",
      intuition: "A shallow copy duplicates the pointer, not the pointee."
    }
  }]
};

// Item 2 — goal: pick the deep copy so each owns a separate block.
const copyGoal = {
  title: "Give each object its own heap block",
  code: `Circle b = a;   // choose how the copy behaves`,
  knobs: [{
    id: "copy",
    label: "Copy mode",
    options: [{
      value: "shallow",
      label: "shallow (default)"
    }, {
      value: "deep",
      label: "deep (copy ctor)"
    }],
    default: "shallow"
  }],
  steps: k => k.copy === "deep" ? [{
    line: 1,
    cells: [circle("a", "ra", true), circle("b", "rb", true), RA(), RB()],
    caption: {
      cpp: "`radius = new int(*o.radius)` — `b` gets its **own** heap block.",
      intuition: "Two allocations → each destructor frees a different block."
    }
  }] : [{
    line: 1,
    cells: [circle("a", "ra"), circle("b", "ra", true), RA()],
    caption: {
      cpp: "Shallow (default) copy: `a` and `b` hold the **same** address.",
      intuition: "Both destructors free the same block — a double free."
    }
  }]
};
export default quiz({
  items: [{
    kind: "predict",
    scene: copyPredict
  }, {
    kind: "goal",
    scene: copyGoal,
    prompt: "Set the **copy mode** so that `a` and `b` each own a **separate** heap block (no double free).",
    goal: k => k.copy === "deep",
    success: {
      why: "A **deep** copy allocates a fresh `int` per object, so each destructor frees a different block. This is the Rule of Three motivation."
    }
  }]
});