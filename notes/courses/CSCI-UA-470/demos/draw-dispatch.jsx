import { scene, stack, glob, text, obj } from "@course";

/* The Java analog of vtable-internals: instead of an explicit `int type` tag the
   caller switches on, each object header carries a class pointer; each class has
   a method table whose `draw` slot points at that class's body. `s.draw()` is
   `invokevirtual Shape.draw:()V` — load the receiver's class pointer, index its
   table at the `draw` slot, call that body. Mirror its glob-table + text-body +
   heap-obj wiring, adapted to Java references-to-heap. */

const codeV2 =
`void drawAll(Shape[] shapes) {
    for (Shape s : shapes) {
        if (s.type == CIRCLE) drawCircle(s);
        else if (s.type == RECT) drawRect(s);
        else if (s.type == TRI) drawTri(s);
    }
}`;

const codeV2Pent =
`void drawAll(Shape[] shapes) {
    for (Shape s : shapes) {
        if (s.type == CIRCLE) drawCircle(s);
        else if (s.type == RECT) drawRect(s);
        else if (s.type == TRI) drawTri(s);
        else if (s.type == PENT) drawPent(s);
    }
}`;

const codeV3 =
`void drawAll(Shape[] shapes) {
    for (Shape s : shapes)
        s.draw();
}`;

// v2: free static helpers in scope (Java has no free functions; these are static
// methods, fine to call unqualified). One body each in the Code segment. Note the
// downcast: `r` lives on the subclass, so a helper reached via a `Shape` reference
// must cast — the tag switch forces it.
const DRAW_CIRCLE = (hl) => text("drawCircle", "fn", "g.oval(s.x,s.y,((Circle)s).r)", { id: "h_circle", hl });
const DRAW_RECT   = (hl) => text("drawRect",   "fn", "g.rect(s.x,s.y,s.w,s.h)", { id: "h_rect", hl });
const DRAW_TRI    = (hl) => text("drawTri",    "fn", "g.poly(s,3)", { id: "h_tri", hl });
const DRAW_PENT   = (hl) => text("drawPent",   "fn", "g.poly(s,5)", { id: "h_pent", hl });

// v3: each subclass's own draw() body lives once in the Code segment.
const CIRCLE_DRAW = (hl) => text("Circle.draw",    "fn", "g.oval(x,y,r)", { id: "d_circle", hl });
const RECT_DRAW   = (hl) => text("Rectangle.draw", "fn", "g.rect(x,y,w,h)", { id: "d_rect", hl });
const TRI_DRAW    = (hl) => text("Triangle.draw",  "fn", "g.poly(3)", { id: "d_tri", hl });
const PENT_DRAW   = (hl) => text("Pentagon.draw",  "fn", "g.poly(5)", { id: "d_pent", hl });

// v3: one method table per class. The `draw` slot points at that class's body.
const MT_CIRCLE = (hl) => glob("Circle methods", "method table", "", { id: "mt_circle", hl, fields: [
  { name: "draw", size: 8, to: "d_circle", value: "&Circle.draw" },
]});
const MT_RECT = (hl) => glob("Rectangle methods", "method table", "", { id: "mt_rect", hl, fields: [
  { name: "draw", size: 8, to: "d_rect", value: "&Rectangle.draw" },
]});
const MT_TRI = (hl) => glob("Triangle methods", "method table", "", { id: "mt_tri", hl, fields: [
  { name: "draw", size: 8, to: "d_tri", value: "&Triangle.draw" },
]});
const MT_PENT = (hl) => glob("Pentagon methods", "method table", "", { id: "mt_pent", hl, fields: [
  { name: "draw", size: 8, to: "d_pent", value: "&Pentagon.draw" },
]});

// v2 heap objects: Java header + shape data + an explicit `int type` tag the
// caller switches on. (No class pointer is used by the v2 code path.)
const v2Circle = obj("Circle", [
  { name: "type", type: "int", size: 4 },
  { name: "color", type: "String", size: 8 },
], { region: "heap", header: 12 });
const v2Pent = obj("Pentagon", [
  { name: "type", type: "int", size: 4 },
  { name: "color", type: "String", size: 8 },
], { region: "heap", header: 12 });

// v3 heap objects: Java header carries a class pointer (vptr) to the method
// table — no `type` tag. The class picks the method.
const v3Circle = obj("Circle", [{ name: "color", type: "String", size: 8 }], { region: "heap", header: 12, vptr: "mt_circle" });
const v3Pent   = obj("Pentagon", [{ name: "color", type: "String", size: 8 }], { region: "heap", header: 12, vptr: "mt_pent" });

const steps = [
  {
    code: codeV2,
    line: [3, 4, 5],
    cells: [
      stack("s", "Shape", "", { to: "o_circle", link: "ref" }),
      v2Circle("o_circle", { type: "CIRCLE", color: '"red"' }, { hl: true }),
      DRAW_CIRCLE(), DRAW_RECT(), DRAW_TRI(),
    ],
    caption: {
      java: "`Shape` carries an `int type` tag. `drawAll` **reads the tag** and branches to the matching helper.",
      intuition: "The **caller** decides behaviour by inspecting data; each new kind = one more `else if`.",
    },
  },
  {
    code: codeV2,
    line: 3,
    cells: [
      stack("s", "Shape", "", { to: "o_circle", link: "ref" }),
      v2Circle("o_circle", { type: "CIRCLE", color: '"red"' }, { hl: true }),
      DRAW_CIRCLE(true), DRAW_RECT(), DRAW_TRI(),
    ],
    caption: {
      java: "`s.type == CIRCLE` is true, so `drawCircle(s)` runs.",
      intuition: "It works, but *which* draw lives in the **ladder**, not the object.",
    },
  },
  {
    code: codeV2Pent,
    line: 6,
    cells: [
      stack("s", "Shape", "", { to: "o_pent", link: "ref" }),
      v2Pent("o_pent", { type: "PENT", color: '"blue"' }, { hl: true }),
      DRAW_CIRCLE(), DRAW_RECT(), DRAW_TRI(), DRAW_PENT(true),
    ],
    caption: {
      java: "A new `Pentagon` forces a **new `else if`** — repeated in every type switch.",
      intuition: "The smell: code that must change whenever the **data** does. This is the ladder the note warns about.",
    },
  },
  {
    code: codeV3,
    line: 3,
    cells: [
      stack("s", "Shape", "", { to: "o_circle", link: "ref" }),
      v3Circle("o_circle", { color: '"red"' }, { hl: true }),
      MT_CIRCLE(), MT_RECT(), MT_TRI(),
      CIRCLE_DRAW(), RECT_DRAW(), TRI_DRAW(),
    ],
    caption: {
      java: "Each subclass overrides `draw()`. The whole ladder becomes one line: `s.draw()`.",
      jvm: "No `type` field now: each object header holds a **class pointer**; each class's **method table** has a `draw` slot -> that class's body.",
      intuition: "Behaviour moved **into the object**; the call site stops choosing.",
    },
  },
  {
    code: codeV3,
    line: 3,
    cells: [
      stack("s", "Shape", "", { to: "o_circle", link: "ref" }),
      v3Circle("o_circle", { color: '"red"' }, { hl: true }),
      MT_CIRCLE(true), MT_RECT(), MT_TRI(),
      CIRCLE_DRAW(true), RECT_DRAW(), TRI_DRAW(),
    ],
    caption: {
      java: "`s` is declared `Shape`, but at run time it **is** a `Circle`, so `s.draw()` runs `Circle.draw()`.",
      jvm: "`invokevirtual Shape.draw:()V`: read the receiver's **class pointer**, index its table at the **`draw` slot**, call it -> `Circle.draw`.",
      intuition: "Same call site, same bytecode; the **object's class** picks the method. In Java every method is virtual by default.",
    },
  },
  {
    code: codeV3,
    line: 3,
    cells: [
      stack("s", "Shape", "", { to: "o_pent", link: "ref" }),
      v3Pent("o_pent", { color: '"blue"' }, { hl: true }),
      MT_CIRCLE(), MT_RECT(), MT_TRI(), MT_PENT(true),
      CIRCLE_DRAW(), RECT_DRAW(), TRI_DRAW(), PENT_DRAW(true),
    ],
    caption: {
      java: "Add `class Pentagon extends Shape` with its own `draw()`; `drawAll` **never changes**.",
      jvm: "The new object's class pointer finds the **Pentagon table**; the same `invokevirtual` lands on `Pentagon.draw`.",
      intuition: "Open to extension, closed to modification — new behaviour is a **new class**, not a new `else if`. (Choosing *which* shape to `new` is a separate problem — a factory.)",
    },
  },
];

export default scene({
  title: "From a type switch to polymorphic dispatch: the object picks draw()",
  code: codeV2,
  steps,
  lang: "java",
});
