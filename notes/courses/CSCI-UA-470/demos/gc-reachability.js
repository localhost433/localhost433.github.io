/* AUTO-GENERATED from gc-reachability.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, CompareCaption } from "@course";

/* L11 - garbage collection reachability.
   The collector keeps what is REACHABLE from a GC root (live stack frames, static
   fields), not merely what is "referenced". Objects D and E reference each other
   (a cycle), so neither has a zero reference count, yet the whole D-E-F island is
   unreachable from any root and is collected. The two curved arrows between D and
   E make that mutual reference explicit: reachability, not reference counting, is
   the JVM's rule, which is exactly why a self-referential island is still
   garbage. Live objects are solid green; the unreachable island is dashed grey. */

const ROOTS = [{
  id: "r1",
  label: "main() frame",
  note: "stack local: a",
  cx: 122,
  cy: 188
}, {
  id: "r2",
  label: "static field",
  note: "Registry.cache",
  cx: 122,
  cy: 304
}];

// heap objects: reachable ones are live; the D<->E<->F island is unreachable.
const OBJS = [{
  id: "A",
  x: 372,
  y: 164,
  live: true
}, {
  id: "B",
  x: 560,
  y: 134,
  live: true
}, {
  id: "C",
  x: 560,
  y: 244,
  live: true
}, {
  id: "D",
  x: 372,
  y: 348,
  live: false
}, {
  id: "E",
  x: 536,
  y: 348,
  live: false
}, {
  id: "F",
  x: 672,
  y: 354,
  live: false
}];
const OBJ = Object.fromEntries(OBJS.map(o => [o.id, o]));
const ROOT_EDGES = [["r1", "A"], ["r2", "C"]];
const STRAIGHT_EDGES = [["A", "B"], ["A", "C"], ["E", "F"]]; // F is reached only from inside the island

const OR = 27; // object radius

// straight segment shortened so the arrowhead lands on each node's border
function seg(from, to) {
  const dx = to.x - from.x,
    dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len,
    uy = dy / len;
  return {
    x1: from.x + ux * OR,
    y1: from.y + uy * OR,
    x2: to.x - ux * OR,
    y2: to.y - uy * OR
  };
}

// a curved arrow from `from` to `to`, bent perpendicular by `bend`, endpoints on borders
function arc(from, to, bend, dead) {
  const dx = to.x - from.x,
    dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len,
    uy = dy / len; // along chord
  const nx = -uy,
    ny = ux; // perpendicular
  const x1 = from.x + ux * OR + nx * bend * 0.3,
    y1 = from.y + uy * OR + ny * bend * 0.3;
  const x2 = to.x - ux * OR + nx * bend * 0.3,
    y2 = to.y - uy * OR + ny * bend * 0.3;
  const cxp = (from.x + to.x) / 2 + nx * bend,
    cyp = (from.y + to.y) / 2 + ny * bend;
  const stroke = dead ? "var(--seg-code-bd)" : "var(--mm-ptr)";
  return /*#__PURE__*/React.createElement("path", {
    d: `M ${x1} ${y1} Q ${cxp} ${cyp} ${x2} ${y2}`,
    fill: "none",
    markerEnd: "url(#dia-arrow)",
    style: {
      stroke,
      strokeWidth: dead ? 1.7 : 2,
      strokeDasharray: dead ? "5 4" : "none",
      opacity: dead ? 0.85 : 1
    }
  });
}
function RootBox({
  r
}) {
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: r.cx - 62,
    y: r.cy - 24,
    width: 124,
    height: 48,
    rx: 9,
    style: {
      fill: "var(--seg-stack-bg)",
      stroke: "var(--seg-stack-bd)",
      strokeWidth: 1.6
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: r.cx,
    y: r.cy - 6,
    textAnchor: "middle",
    dominantBaseline: "central",
    style: {
      fill: "var(--seg-stack-fg)",
      fontSize: 12.5,
      fontWeight: 900
    }
  }, r.label), /*#__PURE__*/React.createElement("text", {
    x: r.cx,
    y: r.cy + 11,
    textAnchor: "middle",
    dominantBaseline: "central",
    style: {
      fill: "var(--seg-stack-fg)",
      fontSize: 9.2,
      opacity: 0.82
    }
  }, r.note));
}
function ObjNode({
  o
}) {
  const seg = o.live ? "heap" : "code";
  return /*#__PURE__*/React.createElement("g", {
    opacity: o.live ? 1 : 0.7
  }, /*#__PURE__*/React.createElement("circle", {
    cx: o.x,
    cy: o.y,
    r: OR,
    style: {
      fill: `var(--seg-${seg}-bg)`,
      stroke: `var(--seg-${seg}-bd)`,
      strokeWidth: 2,
      strokeDasharray: o.live ? "none" : "5 4"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: o.x,
    y: o.y,
    textAnchor: "middle",
    dominantBaseline: "central",
    style: {
      fill: `var(--seg-${seg}-fg)`,
      fontSize: 15,
      fontWeight: 900
    }
  }, o.id));
}
function legendDot(x, y, seg, dashed, label) {
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: 8,
    style: {
      fill: `var(--seg-${seg}-bg)`,
      stroke: `var(--seg-${seg}-bd)`,
      strokeWidth: 1.8,
      strokeDasharray: dashed ? "3 2" : "none"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: x + 14,
    y: y,
    textAnchor: "start",
    dominantBaseline: "central",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 10.5,
      fontWeight: 700
    }
  }, label));
}
export default function GcReachability() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    style: {
      display: "none"
    }
  }, "Garbage collection - reachable from a root is live; an unreachable island is collected even if its objects reference each other"), /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 760 446",
    maxWidth: 760,
    ariaLabel: "A garbage-collection reachability graph. Two GC roots, a main method stack frame and a static field, point into the heap. Object A is reached from the first root and points to B and C; C is also reached from the static field, so A, B and C are reachable and live. Separately, D and E point at each other through two curved arrows and E points at F, but no root reaches them, so the whole D-E-F island is unreachable and is collected, even though D and E still reference each other. The JVM collects by reachability, not reference counting, so a self-referential cycle of garbage is still garbage."
  }, /*#__PURE__*/React.createElement("text", {
    x: 380,
    y: 26,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 16,
      fontWeight: 900
    }
  }, "reachable from a root = live; everything else is garbage"), legendDot(286, 48, "heap", false, "live (reachable)"), legendDot(456, 48, "code", true, "garbage (unreachable)"), /*#__PURE__*/React.createElement("rect", {
    x: 232,
    y: 72,
    width: 508,
    height: 350,
    rx: 16,
    style: {
      fill: "var(--mm-panel-bg)",
      fillOpacity: 0.5,
      stroke: "var(--mm-gap-bd)",
      strokeWidth: 1.3
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: 726,
    y: 90,
    textAnchor: "end",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11,
      fontWeight: 800
    }
  }, "Heap"), /*#__PURE__*/React.createElement("text", {
    x: 122,
    y: 112,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11,
      fontWeight: 800
    }
  }, "GC roots"), ROOT_EDGES.map(([f, t], i) => {
    const r = ROOTS.find(x => x.id === f);
    const e = seg({
      x: r.cx + 62,
      y: r.cy
    }, OBJ[t]);
    return /*#__PURE__*/React.createElement("line", {
      key: "re" + i,
      x1: r.cx + 62,
      y1: r.cy,
      x2: e.x2,
      y2: e.y2,
      markerEnd: "url(#dia-arrow)",
      style: {
        stroke: "var(--mm-ptr)",
        strokeWidth: 2.2
      }
    });
  }), STRAIGHT_EDGES.map(([f, t], i) => {
    const dead = !OBJ[f].live && !OBJ[t].live;
    const e = seg(OBJ[f], OBJ[t]);
    return /*#__PURE__*/React.createElement("line", {
      key: "se" + i,
      x1: e.x1,
      y1: e.y1,
      x2: e.x2,
      y2: e.y2,
      markerEnd: "url(#dia-arrow)",
      style: {
        stroke: dead ? "var(--seg-code-bd)" : "var(--mm-ptr)",
        strokeWidth: dead ? 1.7 : 2,
        strokeDasharray: dead ? "5 4" : "none",
        opacity: dead ? 0.85 : 1
      }
    });
  }), arc(OBJ.D, OBJ.E, -34, true), arc(OBJ.E, OBJ.D, -34, true), ROOTS.map(r => /*#__PURE__*/React.createElement(RootBox, {
    key: r.id,
    r: r
  })), OBJS.map(o => /*#__PURE__*/React.createElement(ObjNode, {
    key: o.id,
    o: o
  })), /*#__PURE__*/React.createElement("rect", {
    x: 326,
    y: 306,
    width: 400,
    height: 96,
    rx: 14,
    style: {
      fill: "none",
      stroke: "var(--seg-code-bd)",
      strokeWidth: 1.6,
      strokeDasharray: "6 5",
      opacity: 0.9
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: 454,
    y: 296,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 9.8,
      fontStyle: "italic"
    }
  }, "D \u2194 E still reference each other \u2014 still garbage"), /*#__PURE__*/React.createElement("text", {
    x: 526,
    y: 392,
    textAnchor: "middle",
    style: {
      fill: "var(--seg-code-fg)",
      fontSize: 10.5,
      fontWeight: 800
    }
  }, "unreachable island \u2192 collected")), /*#__PURE__*/React.createElement(CompareCaption, {
    cols: [{
      tag: "reachable",
      kind: "java",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "An object is ", /*#__PURE__*/React.createElement("strong", null, "live"), " while a chain of references reaches it from a ", /*#__PURE__*/React.createElement("strong", null, "GC root"), " -- a live stack frame's locals or a static field. A, B and C qualify.")
    }, {
      tag: "garbage",
      kind: "asm",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "D, E and F are ", /*#__PURE__*/React.createElement("strong", null, "unreachable"), " from every root, so the collector reclaims them -- even though D and E point at each other. ", /*#__PURE__*/React.createElement("strong", null, "Reachability"), ", not reference counting, is the rule.")
    }, {
      tag: "vs C++",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "C++ has no tracing GC: you ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "delete"), " manually, and naive reference counting (e.g. ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "shared_ptr"), " cycles) ", /*#__PURE__*/React.createElement("em", null, "leaks"), " exactly this island. The JVM does not.")
    }],
    punch: "\"No longer reachable\" — not \"no longer referenced\" — is what makes an object collectible."
  }));
}