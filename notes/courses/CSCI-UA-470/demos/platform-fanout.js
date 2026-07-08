/* AUTO-GENERATED from platform-fanout.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramBox, CompareTitles, CompareCaption } from "@course";

/* L08 — C++ vs Java compilation, compared STAGE BY STAGE (preprocessor and all) with
   the per-platform fan-out drawn INSIDE each column as a clean FORK (trunk -> bus ->
   drops), not diagonal rays.

   Shared stage axis (top -> bottom):
     Source -> Preprocess -> Compile -> Assemble -> Link -> Run·JVM -> Machine·CPU
   Structural comparison + the language-specific GAPS: C++ has Preprocess, Assemble and
   Link steps Java lacks; Java has a JVM step C++ lacks; both compile and both reach the CPU.

   Each language's stages are grouped into labelled PHASE ZONES (large background blocks):
     C++  -> Compilation (Source..Link)            + Execution (CPU)
     Java -> Compilation (Source..Compile) + Interpretation (JVM) + Execution (CPU)
   The zones are per-column because the phases differ; faint per-stage bands nest inside.

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
  src: 56,
  pre: 118,
  compile: 180,
  asm: 242,
  link: 304,
  vm: 366,
  cpu: 456
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
   binaries sit at the Link row), Java forks LATE (its JVMs at Run·JVM). `trunkFrom` is
   the row of the last single (pre-fork) box, so the trunk drops from there to the bus;
   each fork's bus is derived to sit just above its row, so editing ROW keeps it in step. */
const COLS = [{
  col: "cpp",
  forkRow: ROW.link,
  bus: topY(ROW.link, FBOX) - 11,
  sub: 2,
  trunkFrom: ROW.asm,
  label: p => CPP_BIN[p.key]
}, {
  col: "java",
  forkRow: ROW.vm,
  bus: topY(ROW.vm, FBOX) - 11,
  sub: 1,
  trunkFrom: ROW.compile,
  label: () => "JVM"
}];

/* Per-column background scaffolding: which stage rows each column actually occupies,
   and how those rows group into named phases. The phase zones are large rounded blocks;
   the per-stage bands nest inside them. */
const COL_ROWS = {
  cpp: ["src", "pre", "compile", "asm", "link", "cpu"],
  java: ["src", "compile", "vm", "cpu"]
};
const PHASES = {
  cpp: [{
    label: "Compilation",
    from: "src",
    to: "link"
  }, {
    label: "Execution",
    from: "cpu",
    to: "cpu"
  }],
  java: [{
    label: "Compilation",
    from: "src",
    to: "compile"
  }, {
    label: "Interpretation",
    from: "vm",
    to: "vm"
  }, {
    label: "Execution",
    from: "cpu",
    to: "cpu"
  }]
};
const COLBAND = {
  cpp: {
    x: 60,
    w: 236
  },
  java: {
    x: 424,
    w: 236
  }
};
const BAND_H = 56,
  BAND_HALF = 28,
  ZONE_PAD = 12,
  ZONE_HEADER = 22;
const ARIA = "C++ versus Java compilation compared stage by stage, with each language's phases " + "grouped into labelled background blocks. Stages top to bottom: Source, Preprocess " + "(C++ only), Compile, Assemble (C++ only), Link (C++ only), Run on the JVM (Java only), " + "then Machine and CPU. C++'s Compilation phase runs main.cpp through the preprocessor, " + "the compiler to assembly main.s, the assembler to the native object main.o, and the " + "linker to an executable; its Execution phase runs that binary directly on the CPU. " + "Because assembly and object code are already architecture and OS specific, C++ recompiles " + "the source separately for each target — compile, assemble and link are redone per platform — " + "producing three native binaries: a.out for macOS, a.out for Linux, app.exe for Windows. " + "Java's Compilation phase runs javac from " + "Main.java to portable bytecode Main.class; its Interpretation phase is the JVM, one per " + "operating system, that runs that single Main.class; its Execution phase is the CPU. So " + "C++ multiplies its artifact at build time while Java keeps one file and multiplies only " + "the JVM at run time: recompile everywhere versus write once, run anywhere.";

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

// stacked backing cards: signals "one of these PER TARGET" — C++ compiles/assembles
// the source separately for each platform, so main.s and main.o are not shared artifacts.
const StackBacking = ({
  cx,
  cy,
  w,
  h
}) => /*#__PURE__*/React.createElement("g", null, [2, 1].map(k => /*#__PURE__*/React.createElement("rect", {
  key: k,
  x: cx - w / 2 + k * 5,
  y: cy - h / 2 - k * 5,
  width: w,
  height: h,
  rx: 7,
  style: {
    fill: "var(--mm-panel-bg)",
    stroke: "var(--mm-cell-bd)",
    strokeWidth: 1.2,
    opacity: 0.7
  }
})));
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
  }), " native (assembly \xB7 object \xB7 binary)"), /*#__PURE__*/React.createElement("span", {
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
    viewBox: "0 0 720 500",
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
  }))), COLS.map(c => PHASES[c.col].map((ph, pi) => {
    const cb = COLBAND[c.col];
    const zTop = ROW[ph.from] - BAND_HALF - ZONE_HEADER;
    const zBot = ROW[ph.to] + BAND_HALF + ZONE_PAD;
    return /*#__PURE__*/React.createElement("rect", {
      key: "zone-" + c.col + pi,
      x: cb.x - 6,
      y: zTop,
      width: cb.w + 12,
      height: zBot - zTop,
      rx: 12,
      style: {
        fill: "var(--mm-panel-bg)",
        fillOpacity: 0.5,
        stroke: "var(--mm-gap-bd)",
        strokeOpacity: 0.8,
        strokeWidth: 1.3
      }
    });
  })), COLS.map(c => COL_ROWS[c.col].map(rk => {
    const cb = COLBAND[c.col];
    return /*#__PURE__*/React.createElement("rect", {
      key: "band-" + c.col + rk,
      x: cb.x,
      y: ROW[rk] - BAND_HALF,
      width: cb.w,
      height: BAND_H,
      rx: 9,
      style: {
        fill: "var(--mm-reclaimed-bg)",
        opacity: 0.4
      }
    });
  })), COLS.map(c => PHASES[c.col].map((ph, pi) => /*#__PURE__*/React.createElement("text", {
    key: "zlbl-" + c.col + pi,
    x: COL[c.col],
    y: ROW[ph.from] - BAND_HALF - ZONE_HEADER + 14,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11.5,
      fontWeight: 800,
      letterSpacing: ".05em"
    }
  }, ph.label))), /*#__PURE__*/React.createElement(StageLabel, {
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
    y: ROW.asm,
    label: "Assemble",
    sub: "C++ only"
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
    x1: COL.cpp,
    y1: botY(ROW.compile, SBOX),
    x2: COL.cpp,
    y2: topY(ROW.asm, SBOX),
    on: lit
  }), /*#__PURE__*/React.createElement(Via, {
    x: COL.cpp - SBOX.w / 2 - 8,
    y: ROW.asm,
    anchor: "end"
  }, "as"), /*#__PURE__*/React.createElement(FlowEdge, {
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
    y1: botY(c.trunkFrom, SBOX),
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
  }), /*#__PURE__*/React.createElement(StackBacking, {
    cx: COL.cpp,
    cy: ROW.compile,
    w: SBOX.w,
    h: SBOX.h
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: COL.cpp,
    cy: ROW.compile,
    w: SBOX.w,
    h: SBOX.h,
    sub: 2,
    label: "main.s",
    note: "assembly \xB7 per target"
  }), /*#__PURE__*/React.createElement(StackBacking, {
    cx: COL.cpp,
    cy: ROW.asm,
    w: SBOX.w,
    h: SBOX.h
  }), /*#__PURE__*/React.createElement(DiagramBox, {
    cx: COL.cpp,
    cy: ROW.asm,
    w: SBOX.w,
    h: SBOX.h,
    sub: 2,
    label: "main.o",
    note: "native object \xB7 per target"
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
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Has a ", /*#__PURE__*/React.createElement("strong", null, "preprocessor"), ", ", /*#__PURE__*/React.createElement("strong", null, "assembler"), " and ", /*#__PURE__*/React.createElement("strong", null, "linker"), " Java lacks. Forks at ", /*#__PURE__*/React.createElement("strong", null, "build"), " time: because assembly and objects are already CPU/OS-specific, the source is ", /*#__PURE__*/React.createElement("strong", null, "recompiled per target"), " into", /*#__PURE__*/React.createElement("strong", null, " three native binaries"), ", each running directly on its OS.")
    }, {
      tag: "Java",
      kind: "java",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "No preprocessor, assembler or linker. Forks at ", /*#__PURE__*/React.createElement("strong", null, "run"), " time (the JVM): ", /*#__PURE__*/React.createElement("strong", null, "one"), " ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Main.class"), ", and a ", /*#__PURE__*/React.createElement("strong", null, "JVM per OS"), " runs that same file.")
    }],
    punch: /*#__PURE__*/React.createElement(React.Fragment, null, "The per-platform ", /*#__PURE__*/React.createElement("em", null, "\xD73"), " happens at ", /*#__PURE__*/React.createElement("strong", null, "build"), " time for C++ but ", /*#__PURE__*/React.createElement("strong", null, "run"), " time for Java \u2014", /*#__PURE__*/React.createElement("em", null, " recompile everywhere"), " vs. ", /*#__PURE__*/React.createElement("em", null, "write once, run anywhere"), ".")
  }));
}