import React from "react";
import { DiagramSvg, treeLayout, ClassTree, ab, cls, CodeBlock, CompareCaption } from "@course";

/* note 16 — OCP. The bad half is CODE, not a diagram: the type-switch getArea()
   that must be EDITED for every new shape. The good half is the uml-v4 tree
   from note 09, redrawn in its L16 role: abstract Shape, one override per
   subclass, and Cylinder added purely by extension. Same figure, new argument —
   v4 said "polymorphism dispatches"; L16 says "closed for modification". */

const BAD = `// inside class Shape — one method, every shape's formula
double getArea() {
    if (type == "circle")
        return 3.14 * radius * radius;
    else if (type == "rectangle")
        return width * height;
    else if (type == "triangle")
        return (base * height) / 2;
    // adding Cylinder?  EDIT THIS METHOD.  (modification)
}`;

const shape = {
  title: "Shape", abstract: true,
  sections: [{ rows: ["- color : String"] }, { rows: [ab("+ getArea() : double")] }],
};
const kid = (title, attrs) => cls(title, attrs, ["+ getArea() : double"]);
const circle = kid("Circle", ["- radius"]);
const rect = kid("Rectangle", ["- width", "- height"]);
const tri = kid("Triangle", ["- base", "- height"]);
// the newly added shape: pure extension, dashed to mark it as the new arrival
const cylinder = { ...kid("Cylinder", ["- r", "- h"]), dashed: true };

const L = treeLayout({
  cx: 350, topY: 16,
  parent: shape,
  children: [circle, rect, tri, cylinder],
  cardW: 150, gap: 20,
});
const W = Math.round(L.right + 14);
const H = Math.round(L.bottom + 30);

export default function SolidOcp() {
  return (
    <div className="mm-scene">
      <div className="mm-scene__title" data-artifact-title>Open–Closed — extension over modification</div>

      <CodeBlock code={BAD} lang="java" />

      <DiagramSvg viewBox={`0 0 ${W} ${H}`} maxWidth={748}
        ariaLabel="The Open-Closed fix: an abstract Shape with an abstract getArea() and four subclasses — Circle, Rectangle, Triangle, and a dashed newly-added Cylinder — each carrying its own getArea() override. Adding Cylinder touched no existing class.">
        <ClassTree layout={L} />
        <text x={W / 2} y={H - 8} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
          Cylinder arrives as a new subclass — nothing above it was reopened
        </text>
      </DiagramSvg>

      <CompareCaption
        cols={[
          { tag: "closed", kind: "java", children: <>Existing classes are <strong>closed for modification</strong>: no one edits <code className="mm-ic">Shape</code> or its if-chain again, because there is no if-chain — each shape owns its formula.</> },
          { tag: "open", kind: "int", children: <>The hierarchy is <strong>open for extension</strong>: a new shape is a new subclass with one override. The dispatch that the if-chain hand-rolled is what <code className="mm-ic">virtual</code>/overriding already does.</> },
        ]}
        punch="If adding a case means editing a method, the design is open in the wrong place."
      />
    </div>
  );
}
