import React from "react";
import { DiagramSvg, treeLayout, ClassTree } from "@course";

/* v3 (note 09) — the type-switch is gone. Shape is still concrete, but draw()
   is now POLYMORPHIC: every subclass OVERRIDES it (own + draw() row), so the
   external if/else dispatch disappears. A 4th DASHED placeholder hangs off the
   same extends fork as a real extension point — a new shape drops in by adding
   one box, no loop to touch. Boxes neutral; colour is reserved for the relation
   (extends, indigo). */

const shape = {
  title: "Shape",
  sections: [
    { rows: ["- color : string", "- x : int", "- y : int"] },
    { rows: ["+ draw()"] },
  ],
};
// each subclass now OVERRIDES draw(): own data AND its own + draw() row
const override = (title, attrs) => ({ title, sections: [{ rows: attrs }, { rows: ["+ draw()"] }] });
const circle = override("Circle", ["- radius : int"]);
const rectangle = override("Rectangle", ["- width : int", "- length : int"]);
const triangle = override("Triangle", ["- base : int", "- height : int"]);
// a real extension point: an empty-attr, dashed placeholder, faint "?" title
const placeholder = {
  title: "?",
  sections: [{ rows: [] }, { rows: ["+ draw()"] }],
  dashed: true,
};

const L = treeLayout({ cx: 372, topY: 20, parent: shape, children: [circle, rectangle, triangle, placeholder], cardW: 150, gap: 22 });
const M = 14;
const W = Math.round(L.right + M);
const H = Math.round(L.bottom + M);

// placeholder card is the 4th (rightmost) child; annotate above its column,
// right-anchored to its edge and lifted clear of the bus + drop lines.
const ph = L.children[3];
const annoX = ph.x + ph.w;        // placeholder's right edge
const annoY = L.busY - 6;         // above the horizontal fork bus

export default function UmlV3() {
  return (
    <DiagramSvg viewBox={`0 0 ${W} ${H}`} maxWidth={700}
      ariaLabel="Version 3 UML: a concrete Shape base class with color, x and y and a draw method; Circle, Rectangle and Triangle each extend Shape and now override draw() with their own implementation. A fourth dashed placeholder box, an empty extension point, hangs off the same extends fork with the note: add a new shape. The external type-switch is gone — behaviour moved into each subclass.">
      <text x={annoX} y={annoY} textAnchor="end"
        style={{ fill: "var(--mm-muted)", fontSize: 11 }}>{"① add a new shape"}</text>

      <ClassTree layout={L} />
    </DiagramSvg>
  );
}
