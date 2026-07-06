/* AUTO-GENERATED from jvm-architecture-map.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramBox, CompareCaption, WhyDot, WhyNotes } from "@course";

/* L11 - JVM architecture map.
   The map keeps JVM pieces in their proper roles. Class loading reads .class
   files and creates class metadata. Runtime data areas are abstract JVM storage
   areas: method area and heap are shared, while JVM stacks, PC registers, and
   native method stacks are per-thread. The execution engine interprets or JITs
   bytecode and uses those runtime areas. JNI is a bridge from Java/native method
   calls to platform-specific native libraries outside the ordinary Java runtime
   path. The host OS/CPU are outside the JVM.

   Drawn at viewBox width 780 with maxWidth 780, so 1 SVG unit ≈ 1 rendered px:
   that keeps the cell labels and notes legible and stops them overflowing. */

function group(x, y, w, h, title, note) {
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: y,
    width: w,
    height: h,
    rx: 16,
    style: {
      fill: "var(--mm-panel-bg)",
      stroke: "var(--mm-gap-bd)",
      strokeWidth: 1.35
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: x + w / 2,
    y: y + 25,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 12.8,
      fontWeight: 900
    }
  }, title), note ? /*#__PURE__*/React.createElement("text", {
    x: x + w / 2,
    y: y + 42,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10
    }
  }, note) : null);
}
function arrow(x1, y1, x2, y2, label, dashed = false) {
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    style: {
      stroke: "var(--mm-muted)",
      strokeWidth: 1.6,
      strokeDasharray: dashed ? "5 4" : "none"
    },
    markerEnd: "url(#dia-arrow)"
  }), label ? /*#__PURE__*/React.createElement("text", {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2 - 7,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10.5,
      fontStyle: "italic"
    }
  }, label) : null);
}

// a wide mini cell so its note never overflows the box
function mini(cx, y, w, label, note, sub) {
  return /*#__PURE__*/React.createElement(DiagramBox, {
    cx: cx,
    cy: y + 24,
    w: w,
    h: 48,
    label: label,
    note: note,
    sub: sub
  });
}
export default function JvmArchitectureMap() {
  const [open, setOpen] = React.useState(null);
  const toggle = n => setOpen(cur => cur === n ? null : n);
  const WHY = [{
    title: "Class loader",
    body: "Reads `.class` bytecode and turns it into in-memory `Class` metadata, running load → link (verify · prepare · resolve) → initialize on first active use."
  }, {
    title: "Runtime data areas",
    body: "JVM-defined storage. Method area and heap are **shared** by all threads; JVM stacks, PC registers, and native method stacks are **per-thread**."
  }, {
    title: "Execution engine",
    body: "Runs the bytecode: the interpreter steps it one instruction at a time; the JIT compiles hot code to native; GC reclaims dead heap objects."
  }, {
    title: "JNI",
    body: "The bridge from Java/native method calls out to platform-specific native libraries (`.dll`/`.so`/`.dylib`) and ultimately the host OS/CPU — outside the ordinary Java runtime path."
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    style: {
      display: "none"
    }
  }, "JVM architecture - class loading, runtime data areas, execution engine, JNI"), /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 780 548",
    maxWidth: 780,
    ariaLabel: "JVM architecture map showing class files, the class loader subsystem, runtime data areas, execution engine, JNI, native libraries, and host OS or CPU."
  }, /*#__PURE__*/React.createElement("text", {
    x: 390,
    y: 32,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 16,
      fontWeight: 900
    }
  }, "JVM architecture map"), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: 72,
    cy: 104,
    w: 112,
    h: 48,
    label: ".class files",
    note: "bytecode",
    sub: 3
  }), arrow(128, 104, 150, 104), /*#__PURE__*/React.createElement("rect", {
    x: 150,
    y: 62,
    width: 614,
    height: 386,
    rx: 18,
    style: {
      fill: "none",
      stroke: "var(--mm-cell-bd)",
      strokeWidth: 1.6
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: 457,
    y: 84,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 12.5,
      fontWeight: 900
    }
  }, "inside one JVM process"), group(164, 100, 178, 320, "Class loader", "load → link → init"), mini(253, 158, 150, "Loading", ".class → Class", 0), arrow(253, 210, 253, 226), mini(253, 226, 150, "Linking", "verify·prepare·resolve", 0), arrow(253, 278, 253, 294), mini(253, 294, 150, "Init", "static init, first use", 0), group(358, 100, 238, 320, "Runtime data areas", "JVM-defined storage"), /*#__PURE__*/React.createElement("text", {
    x: 376,
    y: 166,
    textAnchor: "start",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10,
      fontWeight: 800
    }
  }, "shared by all threads"), mini(434, 174, 116, "Method Area", "class data", 1), mini(548, 174, 84, "Heap", "objects", 1), /*#__PURE__*/React.createElement("text", {
    x: 376,
    y: 256,
    textAnchor: "start",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10,
      fontWeight: 800
    }
  }, "one set per thread"), mini(434, 264, 116, "JVM Stack", "frames", 1), mini(548, 264, 84, "PC Reg", "cur. instr", 1), mini(477, 342, 140, "Native Stack", "native calls", 1), group(610, 100, 142, 320, "Execution engine", "runs bytecode"), mini(681, 174, 124, "Interpreter", "stepwise", 2), mini(681, 244, 124, "JIT", "hot code → native", 2), mini(681, 314, 124, "GC", "heap cleanup", 2), arrow(342, 192, 358, 192, "loads"), arrow(596, 200, 610, 200, "uses"), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: 300,
    cy: 500,
    w: 108,
    h: 46,
    label: "JNI",
    note: "native bridge",
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: 470,
    cy: 500,
    w: 150,
    h: 46,
    label: "native libraries",
    note: ".dll / .so / .dylib",
    sub: 3
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: 660,
    cy: 500,
    w: 108,
    h: 46,
    label: "Host",
    note: "OS + CPU",
    sub: 3
  }), /*#__PURE__*/React.createElement("path", {
    d: "M682 420 V462 H300 V477",
    fill: "none",
    style: {
      stroke: "var(--mm-muted)",
      strokeWidth: 1.6,
      strokeDasharray: "5 4"
    },
    markerEnd: "url(#dia-arrow)"
  }), /*#__PURE__*/React.createElement("text", {
    x: 500,
    y: 454,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10.5,
      fontStyle: "italic"
    }
  }, "native call"), arrow(354, 500, 393, 500), arrow(545, 500, 604, 500), /*#__PURE__*/React.createElement(WhyDot, {
    n: 1,
    x: 180,
    y: 118,
    active: open === 1,
    onToggle: toggle,
    label: "Class loader"
  }), /*#__PURE__*/React.createElement(WhyDot, {
    n: 2,
    x: 374,
    y: 118,
    active: open === 2,
    onToggle: toggle,
    label: "Runtime data areas"
  }), /*#__PURE__*/React.createElement(WhyDot, {
    n: 3,
    x: 626,
    y: 118,
    active: open === 3,
    onToggle: toggle,
    label: "Execution engine"
  }), /*#__PURE__*/React.createElement(WhyDot, {
    n: 4,
    x: 258,
    y: 489,
    active: open === 4,
    onToggle: toggle,
    label: "JNI bridge"
  })), /*#__PURE__*/React.createElement(WhyNotes, {
    notes: WHY,
    open: open
  }), /*#__PURE__*/React.createElement(CompareCaption, {
    cols: [{
      tag: "loader",
      kind: "java",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "A class runs a lifecycle: ", /*#__PURE__*/React.createElement("strong", null, "load"), " (", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, ".class"), " \u2192 ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Class"), ") \u2192 ", /*#__PURE__*/React.createElement("strong", null, "link"), " (verify \xB7 prepare \xB7 resolve) \u2192 ", /*#__PURE__*/React.createElement("strong", null, "initialize"), " (static init, on first active use).")
    }, {
      tag: "runtime",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Method area and heap are shared; JVM stacks, PC registers, and native method stacks are per-thread runtime data areas.")
    }, {
      tag: "native",
      kind: "asm",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "JNI crosses from Java execution to platform-specific native libraries and then to the host OS/CPU.")
    }]
  }));
}