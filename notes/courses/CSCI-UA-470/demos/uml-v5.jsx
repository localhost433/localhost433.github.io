import React from "react";
import { DiagramSvg, treeLayout, ClassTree } from "@course";

/* v5 (note 09) — designing the hierarchy. THREE separate trees, each with its
   own abstract base (italic title) and an indigo `extends` fork. Grouping is by
   genuine is-a: a Car is not a Shape, so Vehicle gets its own tree; a Student is
   a Person, not a Shape, so Person gets its own. Shared behaviour (draw / move /
   speak) is declared abstract on each base; the leaves implement it. Boxes are
   neutral; colour is reserved for the relation. */

const ab  = (text) => ({ text, italic: true });           // abstract method row
const cls = (title, attrs, methods) => ({                  // concrete: attrs + methods
  title, sections: [{ rows: attrs }, { rows: methods }] });

// Tree 1 — Shape (abstract) with real attributes.
const shape = {
  title: "Shape", abstract: true,
  sections: [
    { rows: ["- color : string", "- x : int", "- y : int"] },
    { rows: [ab("+ draw()")] },
  ],
};
const circle    = cls("Circle",    ["- radius : int"],                  ["+ draw()"]);
const rectangle = cls("Rectangle", ["- width : int", "- length : int"], ["+ draw()"]);
const triangle  = cls("Triangle",  ["- base : int", "- height : int"],  ["+ draw()"]);

// Tree 2 — Vehicle (abstract), methods-only classes (empty attr compartment).
const vehicle = {
  title: "Vehicle", abstract: true,
  sections: [{ rows: [] }, { rows: [ab("+ draw()"), ab("+ move()")] }],
};
const car  = cls("Car",  [], ["+ draw()", "+ move()"]);
const bike = cls("Bike", [], ["+ draw()", "+ move()"]);

// Tree 3 — Person (abstract), methods-only classes (empty attr compartment).
const person = {
  title: "Person", abstract: true,
  sections: [{ rows: [] }, { rows: [ab("+ draw()"), ab("+ move()"), ab("+ speak()")] }],
};
const student  = cls("Student",  [], ["+ draw()", "+ move()", "+ speak()"]);
const employee = cls("Employee", [], ["+ draw()", "+ move()", "+ speak()"]);

// Tree 1 across the top, centred. Trees 2 & 3 on a row below, side by side.
const T1 = treeLayout({ cx: 332, topY: 16, parent: shape, children: [circle, rectangle, triangle], cardW: 138, gap: 22 });

const topY2 = T1.bottom + 36;
const T2 = treeLayout({ cx: 168, topY: topY2, parent: vehicle, children: [car, bike], cardW: 124, gap: 26 });
const T3 = treeLayout({ cx: 500, topY: topY2, parent: person, children: [student, employee], cardW: 124, gap: 26 });

const M = 14;
const W = Math.round(Math.max(T1.right, T2.right, T3.right) + M);
const H = Math.round(Math.max(T2.bottom, T3.bottom) + M);

export default function UmlV5() {
  return (
    <DiagramSvg viewBox={`0 0 ${W} ${H}`} maxWidth={720}
      ariaLabel="Version 5 UML: three separate class hierarchies grouped by genuine is-a relationships, each under its own abstract base with an extends fork. Top: abstract Shape (color, x, y; abstract draw) extended by Circle, Rectangle and Triangle, each implementing draw. Lower left: abstract Vehicle (abstract draw and move) extended by Car and Bike. Lower right: abstract Person (abstract draw, move and speak) extended by Student and Employee. A Car is not a Shape, so each lives in its own tree under its own abstract base.">
      <ClassTree layout={T1} />
      <ClassTree layout={T2} />
      <ClassTree layout={T3} />
    </DiagramSvg>
  );
}
