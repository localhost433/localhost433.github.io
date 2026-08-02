import React from "react";
import { patternFigure, patternTree, ab } from "@course";

/* note 19 — Factory. The deck crosses out TWO designs, not one: the client that
   hardcodes its own creation ladder, and the bare Shape hierarchy handed to the
   client with no creation abstraction at all. The rejected half below is the first
   (it is the one you can show as code); the second is the point of the caption —
   `Shape` alone is not the pattern, `ShapeFactory` is.

   The class picture is note 09's uml-v4 tree with one card bolted on top, which is
   exactly the argument: the hierarchy was already there, the factory is the door.
   Cylinder and Square arrive dashed (both purple newcomers on the slide) — the new
   subclasses no client had to hear about. */

const kid = (title, attr) => ({ title, sections: [{ rows: attr ? [attr] : [] }] });

const GOOD = patternTree({
  place: "above",
  contextW: 234,
  edge: "depend",
  context: { title: "ShapeFactory",
    sections: [{ rows: ["+ getShape(type) : Shape", "+ getRandomShape() : Shape"] }] },
  parent: { title: "Shape", abstract: true,
    sections: [{ rows: ["- color : String"] }, { rows: [ab("+ getArea() : double")] }] },
  children: [
    kid("Circle", "- radius"),
    kid("Rect", "- w, h"),
    kid("Triangle", "- base, h"),
    { ...kid("Cylinder", "- r, h"), dashed: true },
    { ...kid("Square", "- side"), dashed: true },
  ],
  cardW: 126, gap: 14,
  note: "Cylinder and Square arrive as dashed new subclasses — no client file mentions them, or any of the others",
});
GOOD.ariaLabel = "ShapeFactory, with getShape(type) and getRandomShape() both returning Shape, sits above an abstract Shape class and depends on it with a dashed arrow. Shape is the parent of Circle, Rect, Triangle, and the dashed newly-added Cylinder and Square.";
GOOD.maxWidth = 800;

export default patternFigure({
  title: "Factory — the client asks, it never builds",
  intent: "[Generate object that's chosen at runtime]",
  bad: {
    lang: "java",
    code: `String kind = readUserChoice();     // only known while the program runs

Shape s;
if      (kind.equals("circle"))   s = new Circle();
else if (kind.equals("rect"))     s = new Rect();
else if (kind.equals("triangle")) s = new Triangle();
else                              s = null;`,
    note: "Every client that needs a shape repeats this ladder, and every new shape reopens **all of them**. It is note 16's Open–Closed violation again, this time in the *construction* code rather than the behaviour.",
  },
  good: GOOD,
  client: {
    lang: "java",
    label: "client code",
    code: `// programmer-a — knows what it wants
Shape s;
s = ShapeFactory.getShape(criteria);

// programmer-b — doesn't care which
Shape s;
s = ShapeFactory.getRandomShape();`,
    note: "Neither programmer names `Circle`, `Rect`, or `Triangle`. Both hold the **abstract** type and let the factory decide — which is the only way a decision made *at runtime* can stay out of the client's source.",
  },
  caption: {
    cols: [
      { tag: "one door", kind: "cpp", children: <>The ladder does not disappear — it <strong>moves</strong>, into <code className="mm-ic">ShapeFactory</code>. The win is that it now exists <em>once</em> instead of once per client.</> },
      { tag: "one type", kind: "int", children: <>Every method returns <code className="mm-ic">Shape</code>, the abstract parent. A client that only ever holds <code className="mm-ic">Shape</code> cannot break when a subclass is added.</> },
    ],
    punch: "The deck also crosses out the bare hierarchy on its own: Shape / Circle / Rect / Triangle without a factory is not the pattern. The hierarchy makes the objects interchangeable; the factory is what keeps the client from having to choose between them by name.",
  },
});
