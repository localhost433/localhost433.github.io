import React from "react";
import { DiagramSvg, treeLayout, ClassTree } from "@course";

/* v4 (note 09) — Shape is now ABSTRACT. Its title is italic (UML abstract class)
   and draw() is an italic row (UML abstract method), so `new Shape()` is illegal
   and every concrete subclass MUST implement draw(). Cylinder is the newly added
   concrete shape; the dashed card is the open extension point. Five children make
   this wide, so cardW is narrowed and the demo maxWidth bumped. Boxes are neutral;
   colour is reserved for the relation (extends, indigo). */

const shape = {
  title: "Shape",
  abstract: true,
  sections: [
    { rows: ["- color : string", "- x : int", "- y : int"] },
    { rows: [{ text: "+ draw()", italic: true }] },
  ],
};

// concrete subclass: its own data + a concrete draw()
const concrete = (title, attrs) => ({ title, sections: [{ rows: attrs }, { rows: ["+ draw()"] }] });
const cylinder = concrete("Cylinder", []);
const circle = concrete("Circle", ["- radius : int"]);
const rectangle = concrete("Rectangle", ["- width : int", "- length : int"]);
const triangle = concrete("Triangle", ["- base : int", "- height : int"]);
// open extension point: dashed placeholder, faint "?" title, just + draw()
const placeholder = { title: "?", dashed: true, sections: [{ rows: [] }, { rows: ["+ draw()"] }] };

const L = treeLayout({
  cx: 384, topY: 18,
  parent: shape,
  children: [cylinder, circle, rectangle, triangle, placeholder],
  cardW: 132, gap: 22,
});
const W = Math.round(L.right + 14);
const H = Math.round(L.bottom + 14);

export default function UmlV4() {
  return (
    <DiagramSvg viewBox={`0 0 ${W} ${H}`} maxWidth={748}
      ariaLabel="Version 4 UML: an abstract Shape base class (italic title) with color, x, y and an abstract draw method (italic). Five children extend Shape — Cylinder (the newly added concrete shape), Circle, Rectangle, Triangle, each with their own data and a concrete draw(), plus a dashed placeholder labelled question mark marking an open extension point. Because Shape and draw() are abstract, new Shape() is illegal and every concrete subclass must implement draw().">
      <ClassTree layout={L} />
    </DiagramSvg>
  );
}
