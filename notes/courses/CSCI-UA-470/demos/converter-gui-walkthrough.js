/* AUTO-GENERATED from converter-gui-walkthrough.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramCard, DiagramEdge, diagramCardHeight } from "@course";

/* note 14 — the application the whole note designs, drawn as its three windows.
   The main window offers two conversions and a quit; either button opens a dialog
   that reads a number, converts it, and shows the result. The two dialogs are the
   point: they differ in ONE label and ONE formula and are otherwise the same
   window. That visual duplication is what the use-case generalization, the merged
   sequence, and finally the class diagram all exist to delete. */

const mainSections = [{
  rows: ["[  Kg → Lb   ]", "[  Cm → Inch ]", "[  Quit      ]"]
}];
const kgSections = [{
  rows: ["The value in KG:  [ 5.0   ]", "The result:       [ 11.02 ]"]
}, {
  rows: ["[ Convert ]      [ Cancel ]"]
}];
const cmSections = [{
  rows: ["The value in CM:  [ 12.0  ]", "The result:       [ 4.72  ]"]
}, {
  rows: ["[ Convert ]      [ Cancel ]"]
}];
const MAIN = {
  x: 20,
  y: 62,
  w: 200,
  h: diagramCardHeight(mainSections)
}; // 92
const KG = {
  x: 290,
  y: 10,
  w: 250,
  h: diagramCardHeight(kgSections)
}; // 104
const CM = {
  x: 290,
  y: 160,
  w: 250,
  h: diagramCardHeight(cmSections)
}; // 104

const mainRight = MAIN.x + MAIN.w; // 220

export default function ConverterGuiWalkthrough() {
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 570 300",
    maxWidth: 620,
    ariaLabel: "The unit converter's three windows: a main window with Kg to Lb, Cm to Inch, and Quit buttons; each conversion button opens a dialog that reads a value and shows a result. The two dialogs are identical apart from one label and one formula."
  }, /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: mainRight,
      y: 92
    },
    to: {
      x: KG.x,
      y: 62
    },
    label: "opens",
    dashed: true
  }), /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: mainRight,
      y: 122
    },
    to: {
      x: CM.x,
      y: 212
    },
    label: "opens",
    dashed: true
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: MAIN.x,
    y: MAIN.y,
    w: MAIN.w,
    title: "Unit Converter",
    sections: mainSections,
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: KG.x,
    y: KG.y,
    w: KG.w,
    title: "Kg \u2192 Lb",
    sections: kgSections,
    sub: 2
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: CM.x,
    y: CM.y,
    w: CM.w,
    title: "Cm \u2192 Inch",
    sections: cmSections,
    sub: 2
  }), /*#__PURE__*/React.createElement("text", {
    x: 285,
    y: 288,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, "the two dialogs differ in one label and one formula \u2014 nothing else"));
}