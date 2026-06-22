/* AUTO-GENERATED from platform-fanout.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramBox, CompareTitles, CompareCaption } from "@course";

/* L08 — C++ vs Java compilation, compared STAGE BY STAGE (preprocessor and all) with
   the per-platform fan-out drawn INSIDE each column as a clean FORK (trunk -> bus ->
   drops), not diagonal rays.

   Shared stage axis (top -> bottom):
     Source -> Preprocess -> Compile -> Link -> Run·JVM -> Machine·CPU
   Structural comparison + the language-specific GAPS: C++ has a Preprocess and a Link
   step Java lacks; Java has a JVM step C++ lacks; both compile and both reach the CPU.

   Each column forks to the three platforms (macOS / Linux / Windows): C++ forks EARLY
   at Link (main.o -> three native binaries). Java keeps ONE Main.class travelling
   straight down and forks LATE, right at the JVM. The fork HEIGHT is the punchline —
   build-time vs run-time multiplication.

   Colour = ROLE (source blue, native amber, bytecode purple, JVM green, machine neutral;
   preprocess is a dashed pass-through). Highlighting a platform lights its whole route
   down BOTH columns as one --mm-ptr path and dims the other branches. */

const GAP = 76; // horizontal spacing between platform sub-lanes (also the hover-strip width)
const PLATFORMS = [{
  key: "mac",
  name: "macOS",
  dx: -GAP
}, {
  key: "linux",
  name: "Linux",
  dx: 0
}, {
  key: "win",
  name: "Windows",
  dx: GAP
}];
const CPP_BIN = {
  mac: "a.out",
  linux: "a.out",
  win: "app.exe"
};
const COL = {
  cpp: 178,
  java: 542
};
const ROW = {
  src: 42,
  pre: 104,
  compile: 166,
  link: 228,
  vm: 290,
  cpu: 352
};
const MID = 360;
const SBOX = {
  w: 122,
  h: 38
}; // single (shared) boxes
const CHIP = {
  w: 122,
  h: 28
}; // preprocess pass-through step
const FBOX = {
  w: 66,
  h: 34
}; // forked (per-platform) boxes

const sx = (col, dx) => COL[col] + dx;
const topY = (y, b) => y - b.h / 2;
const botY = (y, b) => y + b.h / 2;

/* The two columns as data, so one Branch render covers both. C++ forks EARLY (its
   binaries sit at the Link row), Java forks LATE (its JVMs at Run·JVM); each fork's bus
   is derived to sit just above its row, so editing ROW keeps the buses in step. */
const COLS = [{
  col: "cpp",
  forkRow: ROW.link,
  bus: topY(ROW.link, FBOX) - 11,
  sub: 2,
  label: p => CPP_BIN[p.key]
}, {
  col: "java",
  forkRow: ROW.vm,
  bus: topY(ROW.vm, FBOX) - 11,
  sub: 1,
  label: () => "JVM"
}];
const ARIA = "C++ versus Java compilation compared stage by stage — Source, Preprocess, Compile, " + "Link, Run on the JVM, then Machine and CPU — with each column forking to three " + "platforms: macOS, Linux and Windows. C++ has extra stages Java lacks: a preprocessor " + "and a linker. Both compile — C++ to a native object main.o, Java to a portable " + "bytecode Main.class. C++ forks early, at link, into three native executables (a.out " + "for macOS, a.out for Linux, app.exe for Windows) that run directly on each CPU; C++ " + "has no virtual machine. Java keeps the single Main.class travelling straight down and " + "forks late, where one JVM per operating system runs that same one file before the CPU. " + "So C++ multiplies its artifact at build time while Java keeps one file and multiplies " + "only the JVM at run time: recompile everywhere versus write once, run anywhere.";

// a flow line; `on` lights it as the highlighted route (--mm-ptr + matching arrowhead)
const FlowEdge = ({
  x1,
  y1,
  x2,
  y2,
  on,
  head = true
}) => /*#__PURE__*/React.createElement("line", {
  x1: x1,
  y1: y1,
  x2: x2,
  y2: y2,
  markerEnd: head ? on ? "url(#pf-arrow-on)" : "url(#dia-arrow)" : undefined,
  style: {
    stroke: on ? "var(--mm-ptr)" : "var(--mm-muted)",
    strokeWidth: on ? 2 : 1.6,
    strokeLinecap: "round"
  }
});
const MachineBox = ({
  cx,
  cy,
  label,
  note
}) => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
  x: cx - FBOX.w / 2,
  y: cy - FBOX.h / 2,
  width: FBOX.w,
  height: FBOX.h,
  rx: 7,
  style: {
    fill: "var(--mm-cell-bg)",
    stroke: "var(--mm-cell-bd)",
    strokeWidth: 1.5
  }
}), /*#__PURE__*/React.createElement("text", {
  x: cx,
  y: cy - 4,
  textAnchor: "middle",
  dominantBaseline: "central",
  style: {
    fill: "hsl(var(--foreground))",
    fontSize: 13,
    fontWeight: 700
  }
}, label), /*#__PURE__*/React.createElement("text", {
  x: cx,
  y: cy + 9,
  textAnchor: "middle",
  dominantBaseline: "central",
  style: {
    fill: "var(--mm-muted)",
    fontSize: 9
  }
}, note));
const StepChip = ({
  cx,
  cy,
  label,
  note
}) => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
  x: cx - CHIP.w / 2,
  y: cy - CHIP.h / 2,
  width: CHIP.w,
  height: CHIP.h,
  rx: 7,
  style: {
    fill: "var(--mm-panel-bg)",
    stroke: "var(--mm-gap-bd)",
    strokeWidth: 1.4,
    strokeDasharray: "4 3"
  }
}), /*#__PURE__*/React.createElement("text", {
  x: cx,
  y: cy - 3,
  textAnchor: "middle",
  dominantBaseline: "central",
  style: {
    fill: "var(--mm-muted)",
    fontSize: 11,
    fontStyle: "italic",
    fontWeight: 600
  }
}, label), /*#__PURE__*/React.createElement("text", {
  x: cx,
  y: cy + 8,
  textAnchor: "middle",
  dominantBaseline: "central",
  style: {
    fill: "var(--mm-muted)",
    fontSize: 8.5
  }
}, note));
const StageLabel = ({
  y,
  label,
  sub
}) => /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("text", {
  x: MID,
  y: sub ? y - 7 : y,
  textAnchor: "middle",
  dominantBaseline: "central",
  style: {
    fill: "var(--mm-muted)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".04em"
  }
}, label), sub ? /*#__PURE__*/React.createElement("text", {
  x: MID,
  y: y + 8,
  textAnchor: "middle",
  dominantBaseline: "central",
  style: {
    fill: "var(--mm-muted)",
    fontSize: 9,
    fontStyle: "italic",
    opacity: 0.85
  }
}, sub) : null);
const Via = ({
  x,
  y,
  anchor,
  children
}) => /*#__PURE__*/React.createElement("text", {
  x: x,
  y: y,
  textAnchor: anchor,
  dominantBaseline: "central",
  style: {
    fill: "var(--mm-muted)",
    fontSize: 10,
    fontStyle: "italic"
  }
}, children);

// one platform's route through one column: bus segment -> drop -> forked box -> CPU
const Branch = ({
  c,
  p,
  on
}) => {
  const cx = sx(c.col, p.dx);
  return /*#__PURE__*/React.createElement(React.Fragment, null, p.dx !== 0 ? /*#__PURE__*/React.createElement(FlowEdge, {
    x1: COL[c.col],
    y1: c.bus,
    x2: cx,
    y2: c.bus,
    on: on,
    head: false
  }) : null, /*#__PURE__*/React.createElement(FlowEdge, {
    x1: cx,
    y1: c.bus,
    x2: cx,
    y2: topY(c.forkRow, FBOX),
    on: on
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: cx,
    cy: c.forkRow,
    w: FBOX.w,
    h: FBOX.h,
    sub: c.sub,
    label: c.label(p),
    note: p.name
  }), /*#__PURE__*/React.createElement(FlowEdge, {
    x1: cx,
    y1: botY(c.forkRow, FBOX),
    x2: cx,
    y2: topY(ROW.cpu, FBOX),
    on: on
  }), /*#__PURE__*/React.createElement(MachineBox, {
    cx: cx,
    cy: ROW.cpu,
    label: "CPU",
    note: p.name
  }));
};
export default function PlatformFanout() {
  const [active, setActive] = React.useState(null); // null | "mac" | "linux" | "win"
  const lit = active != null;
  const activeP = active ? PLATFORMS.find(q => q.key === active) : null;
  const dim = k => active == null || active === k ? 1 : 0.16;
  const ring = (cx, cy, b, key) => /*#__PURE__*/React.createElement("rect", {
    key: key,
    x: cx - b.w / 2,
    y: cy - b.h / 2,
    width: b.w,
    height: b.h,
    rx: 7,
    style: {
      fill: "none",
      stroke: "var(--mm-ptr)",
      strokeWidth: 2
    }
  });
  const btn = p => {
    const on = active === p.key;
    return /*#__PURE__*/React.createElement("button", {
      key: p.key,
      type: "button",
      className: "pf-btn" + (on ? " pf-btn--on" : ""),
      "aria-pressed": on,
      onMouseEnter: () => setActive(p.key),
      onFocus: () => setActive(p.key),
      onBlur: () => setActive(null),
      onClick: () => setActive(a => a === p.key ? null : p.key),
      onKeyDown: e => {
        if (e.key === "Escape") {
          setActive(null);
          e.currentTarget.blur();
        }
      }
    }, p.name);
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseLeave: () => setActive(null)
  }, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    style: {
      display: "none"
    }
  }, "C++ vs Java \u2014 compilation, stage by stage across platforms"), /*#__PURE__*/React.createElement(CompareTitles, {
    cols: [{
      tag: "C++",
      kind: "cpp",
      text: "recompile per platform"
    }, {
      tag: "Java",
      kind: "java",
      text: "compile once, run anywhere"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "mm-legend pf-legend"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mm-legend__item"
  }, /*#__PURE__*/React.createElement("i", {
    className: "mm-swatch mm-swatch--sub2"
  }), " native (object \xB7 binary)"), /*#__PURE__*/React.createElement("span", {
    className: "mm-legend__item"
  }, /*#__PURE__*/React.createElement("i", {
    className: "mm-swatch mm-swatch--sub3"
  }), " bytecode (one file)"), /*#__PURE__*/React.createElement("span", {
    className: "mm-legend__item"
  }, /*#__PURE__*/React.createElement("i", {
    className: "mm-swatch mm-swatch--sub1"
  }), " JVM (per OS)"), /*#__PURE__*/React.createElement("span", {
    className: "mm-legend__item"
  }, /*#__PURE__*/React.createElement("i", {
    className: "mm-swatch",
    style: {
      background: "var(--mm-cell-bg)",
      border: "1.5px solid var(--mm-cell-bd)"
    }
  }), " machine \xB7 CPU")), /*#__PURE__*/React.createElement("div", {
    className: "pf-controls"
  }, /*#__PURE__*/React.createElement("span", null, "Highlight a platform:"), PLATFORMS.map(btn)), /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 720 398",
    maxWidth: 700,
    ariaLabel: ARIA
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("marker", {
    id: "pf-arrow-on",
    markerWidth: "9",
    markerHeight: "9",
    refX: "7",
    refY: "4.5",
    orient: "auto",
    markerUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1,1 L8,4.5 L1,8 Z",
    style: {
      fill: "var(--mm-ptr)"
    }
  }))), Object.keys(ROW).map(k => /*#__PURE__*/React.createElement("rect", {
    key: "band-" + k,
    x: 8,
    y: ROW[k] - 28,
    width: 704,
    height: 56,
    rx: 9,
    style: {
      fill: "var(--mm-reclaimed-bg)",
      opacity: 0.4
    }
  })), /*#__PURE__*/React.createElement(StageLabel, {
    y: ROW.src,
    label: "Source"
  }), /*#__PURE__*/React.createElement(StageLabel, {
    y: ROW.pre,
    label: "Preprocess",
    sub: "C++ only"
  }), /*#__PURE__*/React.createElement(StageLabel, {
    y: ROW.compile,
    label: "Compile"
  }), /*#__PURE__*/React.createElement(StageLabel, {
    y: ROW.link,
    label: "Link",
    sub: "C++ only"
  }), /*#__PURE__*/React.createElement(StageLabel, {
    y: ROW.vm,
    label: "Run \xB7 JVM",
    sub: "Java only"
  }), /*#__PURE__*/React.createElement(StageLabel, {
    y: ROW.cpu,
    label: "Machine \xB7 CPU"
  }), /*#__PURE__*/React.createElement(FlowEdge, {
    x1: COL.cpp,
    y1: botY(ROW.src, SBOX),
    x2: COL.cpp,
    y2: topY(ROW.pre, CHIP),
    on: lit
  }), /*#__PURE__*/React.createElement(FlowEdge, {
    x1: COL.cpp,
    y1: botY(ROW.pre, CHIP),
    x2: COL.cpp,
    y2: topY(ROW.compile, SBOX),
    on: lit
  }), /*#__PURE__*/React.createElement(Via, {
    x: COL.cpp - SBOX.w / 2 - 8,
    y: ROW.compile,
    anchor: "end"
  }, "g++ / clang"), /*#__PURE__*/React.createElement(FlowEdge, {
    x1: COL.java,
    y1: botY(ROW.src, SBOX),
    x2: COL.java,
    y2: topY(ROW.compile, SBOX),
    on: lit
  }), /*#__PURE__*/React.createElement(Via, {
    x: COL.java + SBOX.w / 2 + 8,
    y: ROW.compile,
    anchor: "start"
  }, "javac"), COLS.map(c => /*#__PURE__*/React.createElement(FlowEdge, {
    key: "trunk-" + c.col,
    x1: COL[c.col],
    y1: botY(ROW.compile, SBOX),
    x2: COL[c.col],
    y2: c.bus,
    on: lit,
    head: false
  })), PLATFORMS.map(p => /*#__PURE__*/React.createElement("g", {
    key: "route-" + p.key,
    className: "pf-route",
    style: {
      opacity: dim(p.key)
    }
  }, COLS.map(c => /*#__PURE__*/React.createElement(Branch, {
    key: c.col,
    c: c,
    p: p,
    on: active === p.key
  })))), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: COL.cpp,
    cy: ROW.src,
    w: SBOX.w,
    h: SBOX.h,
    sub: 0,
    label: "main.cpp",
    note: "+ headers"
  }), /*#__PURE__*/React.createElement(StepChip, {
    cx: COL.cpp,
    cy: ROW.pre,
    label: "preprocess",
    note: "#includes + macros"
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: COL.cpp,
    cy: ROW.compile,
    w: SBOX.w,
    h: SBOX.h,
    sub: 2,
    label: "main.o",
    note: "native object"
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: COL.java,
    cy: ROW.src,
    w: SBOX.w,
    h: SBOX.h,
    sub: 0,
    label: "Main.java"
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: COL.java,
    cy: ROW.compile,
    w: SBOX.w,
    h: SBOX.h,
    sub: 3,
    label: "Main.class",
    note: "portable bytecode"
  }), /*#__PURE__*/React.createElement(Via, {
    x: COL.cpp,
    y: botY(ROW.cpu, FBOX) + 13,
    anchor: "middle"
  }, "runs a.out directly"), /*#__PURE__*/React.createElement(Via, {
    x: COL.java,
    y: botY(ROW.cpu, FBOX) + 13,
    anchor: "middle"
  }, "runs JIT-compiled code"), activeP ? /*#__PURE__*/React.createElement("g", null, COLS.flatMap(c => [c.forkRow, ROW.cpu].map(y => ring(sx(c.col, activeP.dx), y, FBOX, c.col + "-" + y)))) : null, PLATFORMS.flatMap(p => COLS.map(c => /*#__PURE__*/React.createElement("rect", {
    key: "hit-" + c.col + "-" + p.key,
    className: "pf-hit",
    x: sx(c.col, p.dx) - GAP / 2,
    y: c.bus - 4,
    width: GAP,
    height: botY(ROW.cpu, FBOX) - c.bus + 8,
    onMouseEnter: () => setActive(p.key)
  })))), /*#__PURE__*/React.createElement(CompareCaption, {
    cols: [{
      tag: "C++",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Has a ", /*#__PURE__*/React.createElement("strong", null, "preprocessor"), " and ", /*#__PURE__*/React.createElement("strong", null, "linker"), " Java lacks. Forks at ", /*#__PURE__*/React.createElement("strong", null, "build"), " time (link): recompiled per target into ", /*#__PURE__*/React.createElement("strong", null, "three native binaries"), ", each running directly on its OS.")
    }, {
      tag: "Java",
      kind: "java",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "No preprocessor or linker. Forks at ", /*#__PURE__*/React.createElement("strong", null, "run"), " time (the JVM): ", /*#__PURE__*/React.createElement("strong", null, "one"), " ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Main.class"), ", and a ", /*#__PURE__*/React.createElement("strong", null, "JVM per OS"), " runs that same file.")
    }],
    punch: /*#__PURE__*/React.createElement(React.Fragment, null, "The per-platform ", /*#__PURE__*/React.createElement("em", null, "\xD73"), " happens at ", /*#__PURE__*/React.createElement("strong", null, "build"), " time for C++ but ", /*#__PURE__*/React.createElement("strong", null, "run"), " time for Java \u2014", /*#__PURE__*/React.createElement("em", null, " recompile everywhere"), " vs. ", /*#__PURE__*/React.createElement("em", null, "write once, run anywhere"), ".")
  }));
}