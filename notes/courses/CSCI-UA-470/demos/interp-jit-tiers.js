/* AUTO-GENERATED from interp-jit-tiers.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, CompareCaption } from "@course";

/* L11 - interpreter then JIT, over the lifetime of one hot method.
   The JVM does NOT pick interpretation OR compilation once and for all. It
   interprets from the first call (fast startup, no compile pause), counts
   invocations, and when a method crosses the "hot" threshold the JIT compiles it
   to native code ONCE (a one-time cost spike); later calls run that native code
   far more cheaply. The chart plots per-call cost over the method's life:
     - tall amber bars  = interpreted calls (decode every bytecode, every time)
     - one purple spike = the single JIT compilation
     - short green bars = native calls (run compiled machine code)
   The faint dashed line marks the per-call cost you keep paying if the method is
   never compiled, so the green gap underneath it is the cost the JIT removes. */

const X0 = 70,
  X1 = 742; // axis span
const BASE = 252; // baseline (cost = 0)
const HIGH = 92; // top of an interpreted bar (high per-call cost)
const LOW = 224; // top of a native bar (low per-call cost)
const THRESH = 372; // hot-threshold line

const INTERP = {
  x0: 92,
  n: 9,
  step: 30,
  w: 20
};
const NATIVE = {
  x0: 432,
  n: 9,
  step: 30,
  w: 20
};
const interpBars = Array.from({
  length: INTERP.n
}, (_, i) => INTERP.x0 + i * INTERP.step);
const nativeBars = Array.from({
  length: NATIVE.n
}, (_, i) => NATIVE.x0 + i * NATIVE.step);
function bar(x, w, top, seg, key) {
  return /*#__PURE__*/React.createElement("rect", {
    key: key,
    x: x,
    y: top,
    width: w,
    height: BASE - top,
    rx: 3,
    style: {
      fill: `var(--seg-${seg}-bg)`,
      stroke: `var(--seg-${seg}-bd)`,
      strokeWidth: 1.2
    }
  });
}
export default function InterpJitTiers() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    style: {
      display: "none"
    }
  }, "Interpreter then JIT - the JVM interprets a method from the first call, then compiles it to native code once it becomes hot"), /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: "0 0 780 372",
    maxWidth: 780,
    ariaLabel: "A chart of one method's per-call cost across repeated calls. Early calls are interpreted, shown as tall amber bars at a high cost level because the interpreter decodes each bytecode on every call. The JVM counts invocations; when the count crosses a hot threshold, marked by a dashed vertical line, the JIT compiler runs once, shown as a single tall purple spike, translating the whole method to native machine code. After that, calls run that native code directly, shown as short green bars at a much lower cost level. A faint dashed line continues the interpreted cost across the native region; the gap below it is the per-call cost the JIT removes. Interpreter and JIT both live in the execution engine and operate together; tiered compilation means a quick first compile, C1, can later be replaced by a more optimized one, C2."
  }, /*#__PURE__*/React.createElement("text", {
    x: 390,
    y: 28,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-cell-fg)",
      fontSize: 16,
      fontWeight: 900
    }
  }, "one method over its lifetime: interpret first, then JIT-compile"), /*#__PURE__*/React.createElement("line", {
    x1: X0,
    y1: 64,
    x2: X0,
    y2: BASE,
    style: {
      stroke: "var(--mm-muted)",
      strokeWidth: 1.6
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: X0 - 6,
    y: 58,
    textAnchor: "start",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10.5,
      fontWeight: 800
    }
  }, "cost per call"), /*#__PURE__*/React.createElement("line", {
    x1: X0,
    y1: HIGH,
    x2: X1,
    y2: HIGH,
    style: {
      stroke: "var(--mm-gap-bd)",
      strokeWidth: 1,
      strokeDasharray: "3 4"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: X0 - 8,
    y: HIGH,
    textAnchor: "end",
    dominantBaseline: "central",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 9.5
    }
  }, "high"), /*#__PURE__*/React.createElement("line", {
    x1: X0,
    y1: LOW,
    x2: NATIVE.x0 - 14,
    y2: LOW,
    style: {
      stroke: "var(--mm-gap-bd)",
      strokeWidth: 1,
      strokeDasharray: "3 4"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: X0 - 8,
    y: LOW,
    textAnchor: "end",
    dominantBaseline: "central",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 9.5
    }
  }, "low"), interpBars.map((x, i) => bar(x, INTERP.w, HIGH, "global", "ib" + i)), bar(THRESH + 8, 24, 72, "code", "spike"), /*#__PURE__*/React.createElement("text", {
    x: THRESH + 20,
    y: 66,
    textAnchor: "middle",
    style: {
      fill: "var(--seg-code-fg)",
      fontSize: 9.6,
      fontWeight: 900
    }
  }, "compile"), /*#__PURE__*/React.createElement("text", {
    x: THRESH + 20,
    y: BASE + 14,
    textAnchor: "middle",
    style: {
      fill: "var(--seg-code-fg)",
      fontSize: 9.2,
      fontWeight: 800
    }
  }, "once"), nativeBars.map((x, i) => bar(x, NATIVE.w, LOW, "heap", "nb" + i)), /*#__PURE__*/React.createElement("line", {
    x1: NATIVE.x0 - 6,
    y1: HIGH,
    x2: nativeBars[nativeBars.length - 1] + NATIVE.w + 6,
    y2: HIGH,
    style: {
      stroke: "var(--seg-global-bd)",
      strokeWidth: 1.4,
      strokeDasharray: "5 4",
      opacity: 0.85
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: (NATIVE.x0 + nativeBars[nativeBars.length - 1]) / 2,
    y: HIGH - 8,
    textAnchor: "middle",
    style: {
      fill: "var(--seg-global-fg)",
      fontSize: 9.8,
      fontStyle: "italic",
      fontWeight: 700
    }
  }, "cost the JIT removes"), /*#__PURE__*/React.createElement("line", {
    x1: X0,
    y1: BASE,
    x2: X1,
    y2: BASE,
    markerEnd: "url(#dia-arrow)",
    style: {
      stroke: "var(--mm-muted)",
      strokeWidth: 1.6
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: X1,
    y: BASE + 28,
    textAnchor: "end",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10,
      fontStyle: "italic"
    }
  }, "invocations / time \u2192"), /*#__PURE__*/React.createElement("line", {
    x1: THRESH,
    y1: 64,
    x2: THRESH,
    y2: BASE,
    style: {
      stroke: "var(--mm-ptr)",
      strokeWidth: 1.7,
      strokeDasharray: "6 4"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: THRESH,
    y: 56,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-ptr)",
      fontSize: 11,
      fontWeight: 900
    }
  }, "hot threshold"), /*#__PURE__*/React.createElement("text", {
    x: (INTERP.x0 + interpBars[interpBars.length - 1]) / 2,
    y: BASE + 44,
    textAnchor: "middle",
    style: {
      fill: "var(--seg-global-fg)",
      fontSize: 12.5,
      fontWeight: 900
    }
  }, "Interpreted"), /*#__PURE__*/React.createElement("text", {
    x: (INTERP.x0 + interpBars[interpBars.length - 1]) / 2,
    y: BASE + 60,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 9.6
    }
  }, "decode each bytecode, every call"), /*#__PURE__*/React.createElement("text", {
    x: (NATIVE.x0 + nativeBars[nativeBars.length - 1]) / 2,
    y: BASE + 44,
    textAnchor: "middle",
    style: {
      fill: "var(--seg-heap-fg)",
      fontSize: 12.5,
      fontWeight: 900
    }
  }, "Native (JIT-compiled)"), /*#__PURE__*/React.createElement("text", {
    x: (NATIVE.x0 + nativeBars[nativeBars.length - 1]) / 2,
    y: BASE + 60,
    textAnchor: "middle",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 9.6
    }
  }, "run compiled machine code directly")), /*#__PURE__*/React.createElement(CompareCaption, {
    cols: [{
      tag: "start: interpret",
      kind: "java",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Every method begins ", /*#__PURE__*/React.createElement("strong", null, "interpreted"), " -- no compile pause, so startup is fast, but each call re-decodes the bytecode, so the per-call cost stays high.")
    }, {
      tag: "hot: compile",
      kind: "asm",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The JVM counts invocations; past a threshold the ", /*#__PURE__*/React.createElement("strong", null, "JIT"), " compiles the method to ", /*#__PURE__*/React.createElement("strong", null, "native code"), " once -- a one-time cost -- and every later call runs that code far more cheaply.")
    }, {
      tag: "both, together",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Interpreter and JIT are ", /*#__PURE__*/React.createElement("strong", null, "both"), " in the execution engine. This is why \"Java is interpreted\" is only half true -- hot code ends up as native machine code, like C++.")
    }],
    punch: /*#__PURE__*/React.createElement(React.Fragment, null, "Interpretation is the default for fast startup; JIT compilation is the optimization for hot code -- the JVM uses both over a method's lifetime. ", /*#__PURE__*/React.createElement("em", null, "Tiered compilation"), " goes further: a quick first compile (C1) may be replaced by a more optimized one (C2), and a wrong assumption can deoptimize back to the interpreter.")
  }));
}