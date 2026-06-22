/* AUTO-GENERATED from class-blueprint.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramCard, DiagramEdge, diagramCardHeight } from "@course";

/* "Classes vs. objects: one blueprint, many instances" (note 03), reworked from a
   memory stepper into a STRUCTURAL concept SVG. LEFT: the class Circle as a UML-style
   blueprint card — its attributes (types) and methods (behaviour), no values. RIGHT:
   two instance cards (objects) stamped from it, showing DATA ONLY (no methods). The
   "instance of" edges + caption carry the teaching beat: each object owns its own
   attributes, but all objects share the one set of methods.
   Blueprint = sub 0 (blue); instances = sub 2 (amber) — same kind, stamped out. */

const blueprintSections = [{
  rows: ["color : string", "radius : double"]
}, {
  rows: ["get_color()", "set_radius(double)"]
}];
const c1Sections = [{
  rows: ['color = "red"', "radius = 2.0"]
}];
const c2Sections = [{
  rows: ['color = "blue"', "radius = 3.0"]
}];
const BP = {
  x: 28,
  y: 44,
  w: 184,
  h: diagramCardHeight(blueprintSections)
}; // 122
const C1 = {
  x: 388,
  y: 34,
  w: 168,
  h: diagramCardHeight(c1Sections)
}; // 74
const C2 = {
  x: 388,
  y: 132,
  w: 168,
  h: diagramCardHeight(c2Sections)
}; // 74

const bpRight = BP.x + BP.w; // 212
const bpMidY = BP.y + BP.h / 2; // 105
const instLeft = C1.x; // 388
const c1MidY = C1.y + C1.h / 2; // 71
const c2MidY = C2.y + C2.h / 2; // 169

export default function ClassBlueprint() {
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 600 250",
    maxWidth: 600,
    ariaLabel: "The class Circle is a blueprint with attributes and methods; c1 and c2 are instances of it that store only their own attribute data, while all objects share the one set of methods."
  }, /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: bpRight,
      y: bpMidY - 17
    },
    to: {
      x: instLeft,
      y: c1MidY
    },
    label: "instance of"
  }), /*#__PURE__*/React.createElement(DiagramEdge, {
    from: {
      x: bpRight,
      y: bpMidY + 17
    },
    to: {
      x: instLeft,
      y: c2MidY
    },
    label: "instance of"
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: BP.x,
    y: BP.y,
    w: BP.w,
    title: "Circle",
    sections: blueprintSections,
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: C1.x,
    y: C1.y,
    w: C1.w,
    title: "c1 : Circle",
    sections: c1Sections,
    sub: 2
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: C2.x,
    y: C2.y,
    w: C2.w,
    title: "c2 : Circle",
    sections: c2Sections,
    sub: 2
  }), /*#__PURE__*/React.createElement("text", {
    x: 300,
    y: 232,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, "each object owns its own attributes; all objects share the one set of methods"));
}