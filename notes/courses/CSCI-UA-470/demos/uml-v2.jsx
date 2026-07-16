import React from "react";
import { DiagramSvg, DiagramEdge, treeLayout, ClassTree } from "@course";

/* v2 (note 09) — a Shape hierarchy with a `type` tag, as a vertical UML tree
   (note 03 cards + note 08 fork). Shape carries an `int type` field and one
   generic draw(); the subclasses are DATA ONLY (empty method compartments). An
   external if/else switch comparing `type` against named constants chooses how
   to draw — the smell (same story as draw-dispatch.jsx). Boxes are neutral;
   colour is reserved for the relation (extends, indigo). */

const shape = {
  title: "Shape",
  sections: [
    { rows: ["- color : string", "- x : int", "- y : int", "- type : int"] },
    { rows: ["+ draw()"] },
  ],
};
// subclasses: their own data, but an EMPTY method compartment (no own draw)
const dataOnly = (title, attrs) => ({ title, sections: [{ rows: attrs }, { rows: [] }] });
const circle = dataOnly("Circle", ["- radius : int"]);
const rectangle = dataOnly("Rectangle", ["- width : int", "- length : int"]);
const triangle = dataOnly("Triangle", ["- base : int", "- height : int"]);

const L = treeLayout({ cx: 372, topY: 20, parent: shape, children: [circle, rectangle, triangle], cardW: 150, gap: 24 });
const W = Math.round(L.right + 15);
const H = Math.round(L.bottom + 14);
const drawY = L.parent.y + 26 + (12 + 4 * 18) + 6 + 9;   // y of Shape's draw() row

const swLines = [
  "if (s.type == CIRCLE) drawCircle();",
  "else if (s.type == RECT) drawRect();",
  "else if (s.type == TRI)  drawTri();",
];

export default function UmlV2() {
  return (
    <DiagramSvg viewBox={`0 0 ${W} ${H}`} maxWidth={660}
      ariaLabel="Version 2 UML: a Shape base class with color, x, y and an int type field plus one generic draw method; Circle, Rectangle and Triangle extend Shape but hold only their own data with empty method compartments. Beside Shape, an external if/else switch comparing the type field against named constants points into draw() and decides how to draw — the smell.">
      {/* the external draw dispatch, beside Shape, with a horizontal arrow into draw() */}
      <text x={14} y={drawY - 26}
        style={{ fill: "var(--mm-muted)", fontSize: 11, fontWeight: 700 }}>external draw switch:</text>
      {swLines.map((ln, i) => (
        <text key={i} x={14} y={drawY - 8 + i * 15}
          style={{ fill: "var(--tok-com)", fontSize: 11,
            fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace' }}>{ln}</text>
      ))}
      <DiagramEdge from={{ x: 262, y: drawY }} to={{ x: L.parent.x, y: drawY }} dashed />

      <ClassTree layout={L} />
    </DiagramSvg>
  );
}
