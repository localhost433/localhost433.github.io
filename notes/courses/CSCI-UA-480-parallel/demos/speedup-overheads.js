/* AUTO-GENERATED from speedup-overheads.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useColors, Figure, FigureSvg, Sym, buttonStyle, readoutStyle, labelStyle } from "@course";
import { OVERHEAD_SCENARIOS, overheadRun } from "@course/logic";

/* Where the parallel run-time goes (note 06; L6 slides 5-6, book §2.6.1).
   The deck's four pictures of one 100-unit serial job on four processors, drawn to
   the same scale so the parallel run-time is the height of the tallest column. Each
   column splits into useful work (thread colour), overhead (hatched) and idle time
   waiting for the slowest core (dashed outline): the three things E hides in one
   number. The last scenario's split is an assumption, stated in the caption: the
   slide gives only the four 50s. */

const U = 2.1; // px per time unit
const TOP = 26,
  BASE = TOP + 100 * U;
const SERIAL_X = 40,
  CORE_X = 170,
  COL_W = 46,
  GAP = 22;
export default function SpeedupOverheads() {
  const C = useColors();
  const [key, setKey] = React.useState("perfect");
  const sc = OVERHEAD_SCENARIOS[key];
  const r = overheadRun(sc);
  const y = t => BASE - t * U;
  const f = v => String(parseFloat(v.toFixed(2)));
  return /*#__PURE__*/React.createElement(Figure, {
    title: "One 100-unit serial job and the same job split across four processors, with each processor's time divided into useful work, overhead and idle time, for the deck's four scenarios.",
    caption: "Slides 5-6, drawn to one scale. Speedup only sees the tallest column: S = Tserial / Tparallel. Efficiency E = S / p is the share of the four columns that is useful work, and E \xD7 Tparallel is the average useful time per core, which is Tserial / p (book \xA72.6.1); everything above that line is lost to overhead or to waiting for the slowest core. Load imbalance and synchronization cost the same kind of thing, idle or wasted core time, and the last scenario, which the deck calls closest to real parallel programs, pays both. Its split is our reading: the slide gives only four columns of 50, and 30/20/40/10 of work plus 10 of synchronization each is one way to get there."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      alignItems: "center"
    }
  }, Object.entries(OVERHEAD_SCENARIOS).map(([k, s]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    style: buttonStyle(C, key === k),
    "aria-pressed": key === k,
    onClick: () => setKey(k)
  }, s.label))), /*#__PURE__*/React.createElement(FigureSvg, {
    viewBox: `0 0 ${CORE_X + 4 * (COL_W + GAP) + 150} ${BASE + 40}`,
    maxWidth: 560,
    align: "left",
    ariaLabel: `Serial run of 100 units. Four processors: ${r.cores.map((c, i) => `processor ${i + 1} does ${c.useful} useful, ${c.overhead} overhead, ${c.idle} idle`).join("; ")}. Parallel run-time ${r.tpar}, speedup ${f(r.S)}, efficiency ${f(r.E)}.`
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "ovh",
    width: "6",
    height: "6",
    patternUnits: "userSpaceOnUse",
    patternTransform: "rotate(45)"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "6",
    height: "6",
    fill: C.bg
  }), /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "6",
    stroke: C.muted,
    strokeWidth: "2.2"
  }))), /*#__PURE__*/React.createElement("line", {
    x1: 20,
    y1: BASE,
    x2: CORE_X + 4 * (COL_W + GAP),
    y2: BASE,
    stroke: C.border,
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement(Sym, {
    x: 20,
    y: TOP - 10,
    text: "time \u2191",
    size: 11.5,
    fill: C.muted
  }), /*#__PURE__*/React.createElement("rect", {
    x: SERIAL_X,
    y: y(100),
    width: COL_W + 10,
    height: 100 * U,
    rx: 3,
    fill: C.fg,
    opacity: 0.18,
    stroke: C.fg,
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement(Sym, {
    x: SERIAL_X + (COL_W + 10) / 2,
    y: y(100) + 16,
    text: "100",
    size: 12.5,
    fill: C.fg,
    anchor: "middle",
    weight: 600
  }), /*#__PURE__*/React.createElement(Sym, {
    x: SERIAL_X + (COL_W + 10) / 2,
    y: BASE + 17,
    text: "1 processor",
    size: 11.5,
    fill: C.muted,
    anchor: "middle"
  }), r.cores.map((c, i) => {
    const x = CORE_X + i * (COL_W + GAP);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: x,
      y: y(c.useful),
      width: COL_W,
      height: c.useful * U,
      fill: C.T[i],
      opacity: 0.85
    }), c.useful >= 8 ? /*#__PURE__*/React.createElement(Sym, {
      x: x + COL_W / 2,
      y: BASE - 6,
      text: String(c.useful),
      size: 12,
      fill: C.ink,
      anchor: "middle",
      weight: 600
    }) : null, c.overhead ? /*#__PURE__*/React.createElement("rect", {
      x: x,
      y: y(c.useful + c.overhead),
      width: COL_W,
      height: c.overhead * U,
      fill: "url(#ovh)",
      stroke: C.muted,
      strokeWidth: "1"
    }) : null, c.idle ? /*#__PURE__*/React.createElement("rect", {
      x: x + 0.6,
      y: y(r.tpar) + 0.6,
      width: COL_W - 1.2,
      height: c.idle * U - 1.2,
      fill: "none",
      stroke: C.muted,
      strokeWidth: "1.1",
      strokeDasharray: "4 3"
    }) : null, /*#__PURE__*/React.createElement(Sym, {
      x: x + COL_W / 2,
      y: BASE + 17,
      text: String(i + 1),
      size: 12,
      fill: C.muted,
      anchor: "middle"
    }));
  }), /*#__PURE__*/React.createElement("line", {
    x1: CORE_X - 8,
    y1: y(r.tpar),
    x2: CORE_X + 4 * (COL_W + GAP) - GAP + 8,
    y2: y(r.tpar),
    stroke: C.fg,
    strokeWidth: "1.3",
    strokeDasharray: "6 3"
  }), /*#__PURE__*/React.createElement(Sym, {
    x: CORE_X + 4 * (COL_W + GAP) - GAP + 14,
    y: y(r.tpar) + 4,
    text: `Tparallel = ${r.tpar}`,
    size: 12,
    fill: C.fg
  }), /*#__PURE__*/React.createElement("line", {
    x1: CORE_X - 8,
    y1: y(r.usefulAvg),
    x2: CORE_X + 4 * (COL_W + GAP) - GAP + 8,
    y2: y(r.usefulAvg),
    stroke: C.muted,
    strokeWidth: "1",
    strokeDasharray: "2 3"
  }), r.tpar !== r.usefulAvg ? /*#__PURE__*/React.createElement(Sym, {
    x: CORE_X + 4 * (COL_W + GAP) - GAP + 14,
    y: y(r.usefulAvg) + 4,
    text: `E × Tpar = ${f(r.usefulAvg)}`,
    size: 12,
    fill: C.muted
  }) : null, /*#__PURE__*/React.createElement(Sym, {
    x: CORE_X + 1.5 * (COL_W + GAP) + COL_W / 2,
    y: BASE + 34,
    text: "4 processors",
    size: 11.5,
    fill: C.muted,
    anchor: "middle"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle(C),
      display: "flex",
      gap: "14px",
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 12,
      background: C.T[0],
      opacity: 0.85,
      borderRadius: 2,
      display: "inline-block"
    }
  }), "useful work"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "12",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "14",
    height: "12",
    fill: "url(#ovh)",
    stroke: C.muted
  })), "overhead (sync)"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 12,
      border: `1.1px dashed ${C.muted}`,
      boxSizing: "border-box",
      display: "inline-block"
    }
  }), "idle, waiting for the slowest")), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0,
      whiteSpace: "pre-wrap"
    }
  }, `S = 100 / ${r.tpar} = ${f(r.S)}     E = S / 4 = ${f(r.E)}\nper core, on average: ${f(r.usefulAvg)} useful, ${f(r.lostAvg)} lost to overhead and idling`));
}