import React from "react";
import { DiagramSvg, DiagramCard, UmlLink, diagramCardHeight } from "@course";

/* note 15 — the structural end of the calculator chain: the participants of the
   three sequence diagrams read off as classes. MainGUI carries the widgets
   (every label, field, and button from the sketch) plus one handler per use
   case; Mathematician carries one do_* operation per use case. The edge between
   them is a DASHED DEPENDENCY, not an association — MainGUI constructs its
   Mathematician inside the handler (`new()` in the sequence diagram) and lets
   it go when the call returns. Sibling of converter-class-diagram, which drew
   the same payoff for note 14. */

const guiSections = [
  { rows: [
    "- lblL : JLabel", "- lblR : JLabel", "- txtL : JTextField", "- txtR : JTextField",
    "- lblAnswer : JLabel", "- btnAdd : JButton", "- btnSub : JButton", "- btnM : JButton",
  ] },
  { rows: ["+ add(n1 : int, n2 : int) : void", "+ sub(n1 : int, n2 : int) : void",
    "+ multiply(n1 : int, n2 : int) : void", "- show_result(result : int) : void"] },
];
const mathSections = [
  { rows: ["(no attributes)"] },
  { rows: ["+ do_addition(a : int, b : int) : int", "+ do_subtraction(a : int, b : int) : int",
    "+ do_multiply(a : int, b : int) : int"] },
];

const GUI = { x: 24, y: 30, w: 296, h: diagramCardHeight(guiSections) };
const MATH = { x: 452, y: 96, w: 336, h: diagramCardHeight(mathSections) };

export default function CalculatorClassDiagram() {
  return (
    <DiagramSvg viewBox="0 0 812 360" maxWidth={720}
      ariaLabel="Class diagram of the calculator. MainGUI holds the labels, text fields, and buttons of the sketch plus add, sub, multiply handlers and a private show_result. A dashed dependency arrow points from MainGUI to Mathematician, whose operations are do_addition, do_subtraction, and do_multiply, each taking two ints and returning an int.">
      <UmlLink from={{ x: GUI.x + GUI.w, y: 160 }} to={{ x: MATH.x, y: 160 }} kind="depend" />
      <DiagramCard x={GUI.x} y={GUI.y} w={GUI.w} title="MainGUI" sections={guiSections} sub={0} />
      <DiagramCard x={MATH.x} y={MATH.y} w={MATH.w} title="Mathematician" sections={mathSections} sub={2} />
      <text x={386} y={148} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontStyle: "italic" }}>
        uses temporarily
      </text>
      <text x={406} y={346} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 11 }}>
        dashed, because the sequence diagram showed new() inside the handler — a local, not a field
      </text>
    </DiagramSvg>
  );
}
