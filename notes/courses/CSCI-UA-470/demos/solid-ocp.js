/* AUTO-GENERATED from solid-ocp.jsx by `npm run build:artifacts` — do not edit. */
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
  title: "Shape",
  abstract: true,
  sections: [{
    rows: ["- color : String"]
  }, {
    rows: [ab("+ getArea() : double")]
  }]
};
const kid = (title, attrs) => cls(title, attrs, ["+ getArea() : double"]);
const circle = kid("Circle", ["- radius"]);
const rect = kid("Rectangle", ["- width", "- height"]);
const tri = kid("Triangle", ["- base", "- height"]);
// the newly added shape: pure extension, dashed to mark it as the new arrival
const cylinder = {
  ...kid("Cylinder", ["- r", "- h"]),
  dashed: true
};
const L = treeLayout({
  cx: 350,
  topY: 16,
  parent: shape,
  children: [circle, rect, tri, cylinder],
  cardW: 150,
  gap: 20
});
const W = Math.round(L.right + 14);
const H = Math.round(L.bottom + 30);
export default function SolidOcp() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mm-scene"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mm-scene__title",
    "data-artifact-title": true
  }, "Open\u2013Closed \u2014 extension over modification"), /*#__PURE__*/React.createElement(CodeBlock, {
    code: BAD,
    lang: "java"
  }), /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: `0 0 ${W} ${H}`,
    maxWidth: 748,
    ariaLabel: "The Open-Closed fix: an abstract Shape with an abstract getArea() and four subclasses \u2014 Circle, Rectangle, Triangle, and a dashed newly-added Cylinder \u2014 each carrying its own getArea() override. Adding Cylinder touched no existing class."
  }, /*#__PURE__*/React.createElement(ClassTree, {
    layout: L
  }), /*#__PURE__*/React.createElement("text", {
    x: W / 2,
    y: H - 8,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, "Cylinder arrives as a new subclass \u2014 nothing above it was reopened")), /*#__PURE__*/React.createElement(CompareCaption, {
    cols: [{
      tag: "closed",
      kind: "java",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Existing classes are ", /*#__PURE__*/React.createElement("strong", null, "closed for modification"), ": no one edits ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Shape"), " or its if-chain again, because there is no if-chain \u2014 each shape owns its formula.")
    }, {
      tag: "open",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The hierarchy is ", /*#__PURE__*/React.createElement("strong", null, "open for extension"), ": a new shape is a new subclass with one override. The dispatch that the if-chain hand-rolled is what ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "virtual"), "/overriding already does.")
    }],
    punch: "If adding a case means editing a method, the design is open in the wrong place."
  }));
}