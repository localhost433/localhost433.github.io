/* AUTO-GENERATED from class-relations.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramBox, DiagramEdge } from "@course";

/* "The map of class relations" (note 05): the full inheritance taxonomy as a 2x2
   grid — {single | multiple} bases x {single-level | multi-level} depth. Derived
   -> base "is-a" arrows, sibling of diamond-chart. Bases use sub 0/1, derived use
   sub 2/3. The bottom-right cell trends toward the diamond, so it is captioned as
   a pointer to note 06 / diamond-chart rather than fully derived. */

const HALF = 18; // box half-height (matches DiagramBox default h=36)
const up = (a, b, label) => ({
  from: {
    x: a.cx,
    y: a.cy - HALF
  },
  to: {
    x: b.cx,
    y: b.cy + HALF
  },
  label
});
const PanelTitle = ({
  x,
  y,
  label
}) => /*#__PURE__*/React.createElement("text", {
  x: x,
  y: y,
  textAnchor: "middle",
  style: {
    fill: "var(--mm-cell-fg)",
    fontSize: 13,
    fontWeight: 700
  }
}, label);
const Cap = ({
  x,
  y,
  label,
  accent
}) => /*#__PURE__*/React.createElement("text", {
  x: x,
  y: y,
  textAnchor: "middle",
  style: {
    fill: accent ? "var(--mm-cell-fg)" : "var(--mm-muted)",
    fontSize: 11,
    fontWeight: accent ? 700 : 400
  }
}, label);
export default function ClassRelations() {
  const TL = {
    a: {
      cx: 160,
      cy: 92
    },
    b: {
      cx: 160,
      cy: 182
    }
  };
  const TR = {
    a: {
      cx: 420,
      cy: 92
    },
    b: {
      cx: 540,
      cy: 92
    },
    c: {
      cx: 480,
      cy: 182
    }
  };
  const BL = {
    a: {
      cx: 160,
      cy: 322
    },
    b: {
      cx: 160,
      cy: 400
    },
    c: {
      cx: 160,
      cy: 466
    }
  };
  const BR = {
    a: {
      cx: 480,
      cy: 322
    },
    b: {
      cx: 420,
      cy: 400
    },
    c: {
      cx: 540,
      cy: 400
    },
    d: {
      cx: 480,
      cy: 466
    }
  };
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 640 520",
    maxWidth: 620,
    ariaLabel: "Inheritance taxonomy as a 2x2 grid: single base single-level (B is-a A); multiple bases single-level (C is-a A and B); single base multi-level (C is-a B is-a A); multiple bases multi-level (D is-a B and C, where B is-a A and C is-a A) forming a true diamond \u2014 the diamond problem."
  }, /*#__PURE__*/React.createElement("line", {
    x1: "320",
    y1: "14",
    x2: "320",
    y2: "506",
    style: {
      stroke: "var(--mm-gap-bd)",
      strokeWidth: 1,
      strokeDasharray: "3 4"
    }
  }), /*#__PURE__*/React.createElement("line", {
    x1: "14",
    y1: "260",
    x2: "626",
    y2: "260",
    style: {
      stroke: "var(--mm-gap-bd)",
      strokeWidth: 1,
      strokeDasharray: "3 4"
    }
  }), /*#__PURE__*/React.createElement(PanelTitle, {
    x: 160,
    y: 28,
    label: "single \xB7 single-level"
  }), /*#__PURE__*/React.createElement(DiagramEdge, up(TL.b, TL.a, "is-a")), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: TL.a.cx,
    cy: TL.a.cy,
    label: "A",
    note: "base",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: TL.b.cx,
    cy: TL.b.cy,
    label: "B",
    note: "derived",
    sub: 2
  }), /*#__PURE__*/React.createElement(Cap, {
    x: 160,
    y: 240,
    label: "B is-a A"
  }), /*#__PURE__*/React.createElement(PanelTitle, {
    x: 480,
    y: 28,
    label: "multiple \xB7 single-level"
  }), /*#__PURE__*/React.createElement(DiagramEdge, up(TR.c, TR.a, "is-a")), /*#__PURE__*/React.createElement(DiagramEdge, up(TR.c, TR.b)), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: TR.a.cx,
    cy: TR.a.cy,
    label: "A",
    note: "base",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: TR.b.cx,
    cy: TR.b.cy,
    label: "B",
    note: "base",
    sub: 1
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: TR.c.cx,
    cy: TR.c.cy,
    label: "C",
    note: "derived",
    sub: 2
  }), /*#__PURE__*/React.createElement(Cap, {
    x: 480,
    y: 240,
    label: "C is-a A and is-a B"
  }), /*#__PURE__*/React.createElement(PanelTitle, {
    x: 160,
    y: 288,
    label: "single \xB7 multi-level"
  }), /*#__PURE__*/React.createElement(DiagramEdge, up(BL.b, BL.a, "is-a")), /*#__PURE__*/React.createElement(DiagramEdge, up(BL.c, BL.b)), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: BL.a.cx,
    cy: BL.a.cy,
    label: "A",
    note: "base",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: BL.b.cx,
    cy: BL.b.cy,
    label: "B",
    note: "derived base",
    sub: 1
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: BL.c.cx,
    cy: BL.c.cy,
    label: "C",
    note: "derived",
    sub: 2
  }), /*#__PURE__*/React.createElement(Cap, {
    x: 160,
    y: 502,
    label: "C is-a B is-a A"
  }), /*#__PURE__*/React.createElement(PanelTitle, {
    x: 480,
    y: 288,
    label: "multiple \xB7 multi-level"
  }), /*#__PURE__*/React.createElement(DiagramEdge, up(BR.b, BR.a, "is-a")), /*#__PURE__*/React.createElement(DiagramEdge, up(BR.c, BR.a)), /*#__PURE__*/React.createElement(DiagramEdge, up(BR.d, BR.b)), /*#__PURE__*/React.createElement(DiagramEdge, up(BR.d, BR.c)), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: BR.a.cx,
    cy: BR.a.cy,
    label: "A",
    note: "base",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: BR.b.cx,
    cy: BR.b.cy,
    label: "B",
    note: "derived base",
    sub: 1
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: BR.c.cx,
    cy: BR.c.cy,
    label: "C",
    note: "derived base",
    sub: 2
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: BR.d.cx,
    cy: BR.d.cy,
    label: "D",
    note: "derived",
    sub: 3
  }), /*#__PURE__*/React.createElement(Cap, {
    x: 480,
    y: 502,
    label: "-> the diamond problem",
    accent: true
  }));
}