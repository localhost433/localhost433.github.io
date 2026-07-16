/* AUTO-GENERATED from practice-04-predict.jsx by `npm run build:artifacts` — do not edit. */
import { scene, stack, heap } from "@course";

/* Standalone predict: default (memberwise) copy of a pointer-owning object shares
   one heap block. A Circle is a stack cell with a color field + owned radius ptr. */
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
export default scene({
  title: "Default copy of a pointer-owning object",
  code: "class Circle { string color; int* radius; };\nCircle a;        // assume ctor: radius = new int(0)\nCircle b = a;    // default (memberwise) copy",
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
      cpp: "Members are copied memberwise, so `b.radius` holds the **same address** as `a.radius`.",
      intuition: "A shallow copy duplicates the pointer, not the pointee."
    }
  }]
});