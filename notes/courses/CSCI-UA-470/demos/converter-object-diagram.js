/* AUTO-GENERATED from converter-object-diagram.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramCard, UmlLink, diagramCardHeight } from "@course";

/* note 14 — the same system as a run-time SNAPSHOT rather than a blueprint. Every
   box titles itself with an UNDERLINED `name : Class` (the object convention, and
   the same notation a sequence-diagram participant uses), and the compartment holds
   attribute VALUES, not declarations. What the class diagram cannot tell you but
   this can: right now there are two dialog objects alive, and they share the single
   `c : Converter` — one worker, two clients. */

const mainRows = [{
  rows: ['b1 = "Kg → Lb"', 'b2 = "Cm → Inch"', 'b3 = "Quit"']
}];
const kgRows = [{
  rows: ['in  = "5.0"', 'out = "11.02"', "c   = c"]
}];
const cmRows = [{
  rows: ['in  = "12.0"', 'out = "4.72"', "c   = c"]
}];
const convRows = [{
  rows: ["(no attributes)"]
}];
const B = {
  x: 20,
  y: 104,
  w: 190,
  h: diagramCardHeight(mainRows)
}; // 92
const K1 = {
  x: 284,
  y: 20,
  w: 200,
  h: diagramCardHeight(kgRows)
}; // 92
const K2 = {
  x: 284,
  y: 190,
  w: 200,
  h: diagramCardHeight(cmRows)
}; // 92
const C = {
  x: 566,
  y: 122,
  w: 190,
  h: diagramCardHeight(convRows)
}; // 56

const bR = B.x + B.w; // 210
const kR = K1.x + K1.w; // 484

export default function ConverterObjectDiagram() {
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 780 330",
    maxWidth: 700,
    ariaLabel: "Object diagram of the running unit converter: b : MainGUI holds its three buttons; k1 : KgLbGUI shows 5.0 converting to 11.02; k2 : CmInchGUI shows 12.0 converting to 4.72; and both dialogs reference the same single c : Converter object. Every box title is underlined and every compartment holds values rather than declarations."
  }, /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: bR,
      y: 128
    },
    to: {
      x: K1.x,
      y: 66
    },
    kind: "assoc"
  }), /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: bR,
      y: 176
    },
    to: {
      x: K2.x,
      y: 236
    },
    kind: "assoc"
  }), /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: kR,
      y: 66
    },
    to: {
      x: C.x,
      y: 138
    },
    kind: "assoc"
  }), /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: kR,
      y: 236
    },
    to: {
      x: C.x,
      y: 162
    },
    kind: "assoc"
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: B.x,
    y: B.y,
    w: B.w,
    title: "b : MainGUI",
    sections: mainRows,
    sub: 0,
    underline: true
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: K1.x,
    y: K1.y,
    w: K1.w,
    title: "k1 : KgLbGUI",
    sections: kgRows,
    sub: 2,
    underline: true
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: K2.x,
    y: K2.y,
    w: K2.w,
    title: "k2 : CmInchGUI",
    sections: cmRows,
    sub: 2,
    underline: true
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: C.x,
    y: C.y,
    w: C.w,
    title: "c : Converter",
    sections: convRows,
    sub: 1,
    underline: true
  }), /*#__PURE__*/React.createElement("text", {
    x: 390,
    y: 312,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, "instances at one instant \u2014 both dialogs share the single c : Converter"));
}