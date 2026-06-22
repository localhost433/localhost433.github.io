/* AUTO-GENERATED from diamond-chart.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramBox, DiagramEdge } from "@course";

/* Static two-panel class diagram for the diamond problem (L06), built on the
   shared @course diagram primitives. LEFT (non-virtual): two Person subobjects.
   RIGHT (virtual): one shared Person. Node colours: Person=0, Teacher=1,
   Student=2, TA=3 (the segment palette). */

const HALF = 18; // box half-height (matches DiagramBox default h=36)

function Title({
  x,
  label,
  code
}) {
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("text", {
    x: x,
    y: 20,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 13,
      fontWeight: 700
    }
  }, label), /*#__PURE__*/React.createElement("text", {
    x: x,
    y: 37,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, code));
}
// derived (bottom) -> base (top): arrow ends on the base's lower edge.
const up = (a, b) => ({
  from: {
    x: a.cx,
    y: a.cy - HALF
  },
  to: {
    x: b.cx,
    y: b.cy + HALF
  }
});
export default function DiamondChart() {
  const r1 = 74,
    r2 = 150,
    r3 = 226;
  const L = {
    pa: {
      cx: 78,
      cy: r1
    },
    pb: {
      cx: 202,
      cy: r1
    },
    te: {
      cx: 78,
      cy: r2
    },
    st: {
      cx: 202,
      cy: r2
    },
    ta: {
      cx: 140,
      cy: r3
    }
  };
  const R = {
    pe: {
      cx: 460,
      cy: r1
    },
    te: {
      cx: 398,
      cy: r2
    },
    st: {
      cx: 522,
      cy: r2
    },
    ta: {
      cx: 460,
      cy: r3
    }
  };
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 600 300",
    ariaLabel: "Diamond inheritance: non-virtual gives two Person subobjects (t.name ambiguous); virtual gives one shared Person (t.name OK)."
  }, /*#__PURE__*/React.createElement("line", {
    x1: "300",
    y1: "12",
    x2: "300",
    y2: "255",
    style: {
      stroke: "var(--mm-gap-bd)",
      strokeWidth: 1,
      strokeDasharray: "3 4"
    }
  }), /*#__PURE__*/React.createElement(Title, {
    x: 140,
    label: "non-virtual",
    code: ": public Person"
  }), /*#__PURE__*/React.createElement(DiagramEdge, up(L.te, L.pa)), /*#__PURE__*/React.createElement(DiagramEdge, up(L.st, L.pb)), /*#__PURE__*/React.createElement(DiagramEdge, up(L.ta, L.te)), /*#__PURE__*/React.createElement(DiagramEdge, up(L.ta, L.st)), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: L.pa.cx,
    cy: L.pa.cy,
    label: "Person",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: L.pb.cx,
    cy: L.pb.cy,
    label: "Person",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: L.te.cx,
    cy: L.te.cy,
    label: "Teacher",
    sub: 1
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: L.st.cx,
    cy: L.st.cy,
    label: "Student",
    sub: 2
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: L.ta.cx,
    cy: L.ta.cy,
    label: "TA",
    sub: 3
  }), /*#__PURE__*/React.createElement("text", {
    x: 140,
    y: 264,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 12.5,
      fontWeight: 700
    }
  }, "TA inherits 2 \xD7 Person"), /*#__PURE__*/React.createElement("text", {
    x: 140,
    y: 282,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-dangling)",
      fontSize: 12,
      fontWeight: 700
    }
  }, "t.name \u2192 ambiguous"), /*#__PURE__*/React.createElement(Title, {
    x: 460,
    label: "virtual (the fix)",
    code: ": virtual public Person"
  }), /*#__PURE__*/React.createElement(DiagramEdge, up(R.te, R.pe)), /*#__PURE__*/React.createElement(DiagramEdge, up(R.st, R.pe)), /*#__PURE__*/React.createElement(DiagramEdge, up(R.ta, R.te)), /*#__PURE__*/React.createElement(DiagramEdge, up(R.ta, R.st)), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: R.pe.cx,
    cy: R.pe.cy,
    label: "Person",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: R.te.cx,
    cy: R.te.cy,
    label: "Teacher",
    sub: 1
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: R.st.cx,
    cy: R.st.cy,
    label: "Student",
    sub: 2
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: R.ta.cx,
    cy: R.ta.cy,
    label: "TA",
    sub: 3
  }), /*#__PURE__*/React.createElement("text", {
    x: 460,
    y: 264,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 12.5,
      fontWeight: 700
    }
  }, "TA inherits 1 shared Person"), /*#__PURE__*/React.createElement("text", {
    x: 460,
    y: 282,
    textAnchor: "middle",
    style: {
      fill: "var(--seg-heap-fg)",
      fontSize: 12,
      fontWeight: 700
    }
  }, "t.name \u2192 OK"));
}