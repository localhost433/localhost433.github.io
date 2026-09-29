/* AUTO-GENERATED from issue-slots.jsx by `npm run build:artifacts`. Do not edit. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { useColors, Figure, FigureSvg, buttonStyle, labelStyle, THREAD_NAMES, MONO } from "@course";
import { issueSchedule, ISSUE_TECHNIQUES } from "@course/logic";

/* Issue slots under four ways of feeding a 4-wide core (note 02; book §2.2.5-2.2.6,
   L2 slides 16-19).

   The slides draw each generation as a block diagram of pipeline stages, which
   shows the hardware but not the thing that differs between the schemes: which
   thread's instructions occupy which execution slot in which cycle. So one grid
   per scheme, cycles left to right and the four issue slots top to bottom, fed
   the same four thread programs (ISSUE_PROGRAMS in _logic.mjs).

   Second pass: the point of the figure is that there are two kinds of unused slot
   and the schemes differ in which kind they remove. A first version drew both
   kinds the same way and printed one percentage, so a reader had to count cells to
   find that fine-grained multithreading *adds* leftover slots (12 to 22) while
   removing empty cycles, and that only SMT shrinks both. Now the two kinds are
   drawn differently (grey block vs. outline) and tallied in a bar per scheme. */

const LABELS = {
  superscalar: ["Superscalar", "one thread only"],
  fine: ["Fine-grained MT", "switch every cycle"],
  coarse: ["Coarse-grained MT", "switch only on a miss"],
  smt: ["SMT (hyperthreading)", "threads share a cycle"]
};
const W = 4,
  CYC = 16,
  CW = 24,
  CH = 16,
  GAP = 2,
  GX = 178,
  PANEL = 108,
  TOP = 8;
const colX = c => GX + c * (CW + GAP);
const rowY = (p, s) => TOP + p * PANEL + s * (CH + GAP);
const GRID_H = W * CH + (W - 1) * GAP;

// The longest run of completely empty cycles, if it is long enough to be a miss.
function longestGap(grid) {
  let best = null,
    start = null;
  grid.forEach((col, c) => {
    const empty = col.every(v => v === null);
    if (empty && start === null) start = c;
    if ((!empty || c === grid.length - 1) && start !== null) {
      const end = empty ? c : c - 1;
      if (!best || end - start > best[1] - best[0]) best = [start, end];
      start = null;
    }
  });
  return best && best[1] - best[0] >= 2 ? best : null;
}
const lostFill = C => ({
  fill: C.muted,
  fillOpacity: 0.3
});
function Panel({
  p,
  technique,
  r,
  C
}) {
  const [name, gloss] = LABELS[technique];
  const y0 = rowY(p, 0);
  const most = r.maxThreadsPerCycle;
  const gap = technique === "superscalar" ? longestGap(r.grid) : null;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: y0 + 12,
    fontSize: "13.5",
    fontWeight: "600",
    fill: C.fg
  }, name), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: y0 + 30,
    fontSize: "12",
    fill: C.muted
  }, gloss), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: y0 + 50,
    fontSize: "12.5",
    fill: C.fg
  }, "IPC ", /*#__PURE__*/React.createElement("tspan", {
    fontWeight: "600"
  }, r.ipc.toFixed(2))), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: y0 + 66,
    fontSize: "12.5",
    fill: C.fg
  }, most <= 1 ? "one thread per cycle" : `up to ${most} threads per cycle`), gap && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: `M${colX(gap[0])},${y0 + GRID_H + 6} v4 H${colX(gap[1]) + CW} v-4`,
    fill: "none",
    stroke: C.muted,
    strokeWidth: "1.1"
  }), /*#__PURE__*/React.createElement("text", {
    x: (colX(gap[0]) + colX(gap[1]) + CW) / 2,
    y: y0 + GRID_H + 23,
    textAnchor: "middle",
    fontSize: "11.5",
    fill: C.muted
  }, `thread A waits on memory: ${gap[1] - gap[0] + 1} empty cycles`)), r.grid.map((col, c) => {
    const emptyCycle = col.every(v => v === null);
    return col.map((v, s) => {
      const x = colX(c),
        y = rowY(p, s);
      if (v === null && emptyCycle) {
        return /*#__PURE__*/React.createElement("rect", _extends({
          key: c + "-" + s,
          x: x,
          y: y,
          width: CW,
          height: CH,
          rx: 3
        }, lostFill(C)));
      }
      if (v === null) {
        return /*#__PURE__*/React.createElement("rect", {
          key: c + "-" + s,
          x: x + 0.75,
          y: y + 0.75,
          width: CW - 1.5,
          height: CH - 1.5,
          rx: 3,
          fill: "none",
          stroke: C.muted,
          strokeWidth: "1.1"
        });
      }
      return /*#__PURE__*/React.createElement("g", {
        key: c + "-" + s
      }, /*#__PURE__*/React.createElement("title", null, `cycle ${c}, slot ${s + 1}: thread ${THREAD_NAMES[v]}`), /*#__PURE__*/React.createElement("rect", {
        x: x,
        y: y,
        width: CW,
        height: CH,
        rx: 3,
        fill: C.T[v]
      }), /*#__PURE__*/React.createElement("text", {
        x: x + CW / 2,
        y: y + CH / 2 + 3.8,
        textAnchor: "middle",
        fontSize: "10.5",
        fontWeight: "600",
        fill: C.ink
      }, THREAD_NAMES[v]));
    });
  }), r.switchCycles.map(c => /*#__PURE__*/React.createElement("rect", {
    key: "sw" + c,
    x: colX(c) - 2,
    y: y0 - 2,
    width: CW + 4,
    height: GRID_H + 4,
    rx: 4,
    fill: "none",
    stroke: C.fg,
    strokeWidth: "1.2",
    strokeDasharray: "3 2.5"
  })));
}

// One stacked bar per scheme: used | whole empty cycles | left over in busy cycles.
function WasteBars({
  results,
  C
}) {
  const total = W * CYC;
  const seg = (n, style, key) => n > 0 ? /*#__PURE__*/React.createElement("div", {
    key: key,
    style: {
      flex: `${n} 0 0`,
      minWidth: 2,
      height: 14,
      borderRadius: 3,
      ...style
    }
  }) : null;
  return /*#__PURE__*/React.createElement("div", {
    role: "table",
    "aria-label": "Where each scheme's 64 issue slots went",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle(C),
      fontWeight: 600,
      color: C.fg
    }
  }, "Where the ", total, " issue slots went"), ISSUE_TECHNIQUES.map((t, i) => {
    const r = results[i];
    return /*#__PURE__*/React.createElement("div", {
      role: "row",
      key: t,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      role: "rowheader",
      style: {
        width: 150,
        fontSize: 13
      }
    }, LABELS[t][0]), /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "true",
      style: {
        display: "flex",
        gap: 2,
        flex: "1 1 160px",
        maxWidth: 300
      }
    }, seg(r.filled, {
      background: C.fg,
      opacity: 0.8
    }, "u"), seg(r.wasteEmptyCycles, {
      background: C.muted,
      opacity: 0.3
    }, "e"), seg(r.wasteLeftover, {
      border: `1.1px solid ${C.muted}`,
      boxSizing: "border-box"
    }, "l")), /*#__PURE__*/React.createElement("span", {
      role: "cell",
      style: {
        fontFamily: MONO,
        fontSize: 12.5,
        color: C.fg,
        whiteSpace: "pre-wrap"
      }
    }, String(r.filled).padStart(2), " used \xB7 ", String(r.wasteEmptyCycles).padStart(2), " in empty cycles \xB7 ", String(r.wasteLeftover).padStart(2), " left over"));
  }));
}
const swatch = style => /*#__PURE__*/React.createElement("span", {
  "aria-hidden": "true",
  style: {
    width: 14,
    height: 12,
    borderRadius: 3,
    display: "inline-block",
    boxSizing: "border-box",
    ...style
  }
});
export default function IssueSlots() {
  const C = useColors();
  const [threads, setThreads] = React.useState(4);
  const results = React.useMemo(() => ISSUE_TECHNIQUES.map(t => issueSchedule(t, {
    threads,
    width: W,
    cycles: CYC
  })), [threads]);
  const axisY = rowY(ISSUE_TECHNIQUES.length - 1, 0) + GRID_H + 18;
  const H = axisY + 10;
  const item = {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px"
  };
  return /*#__PURE__*/React.createElement(Figure, {
    title: "Issue-slot grids for a four-wide core fed by four threads: superscalar running one thread, fine-grained multithreading, coarse-grained multithreading, and simultaneous multithreading, with the unused slots split into whole empty cycles and slots left over in busy cycles.",
    caption: "Each column is one cycle and each row one of the core's four issue slots; a letter is the thread that issued there. All four threads run the same kind of code: a few independent instructions at a time, an occasional one-cycle dependency stall, and one six-cycle miss to main memory. An unused slot is one of two kinds. A **whole empty cycle** (grey) means every thread the core could draw on was stalled. A slot **left over in a busy cycle** (outlined) means the thread that issued had fewer independent instructions ready than the core has slots. (Hardware texts call these *vertical* and *horizontal waste*; the slides and the book do not use the terms.) Fine-grained and coarse-grained multithreading only ever fill empty cycles, so they can shrink the grey but not the outlines; in this run both even add outlines, because the threads they switch in rarely have four instructions ready. **SMT is the only scheme that draws on several threads in one cycle, so it is the only one that can shrink both**: with four threads it does, while with two the outlines stay about level. Coarse-grained also pays for each switch (dashed; one cycle here, an assumption, since the book only says switching \"will also cause delays\"). Set the threads to 1 and all four grids become the same grid: none of the multithreading schemes can do anything until a second thread exists."
  }, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    hidden: true
  }, "Issue slots: superscalar, fine-grained, coarse-grained, SMT"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "threads available"), [1, 2, 4].map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    type: "button",
    style: buttonStyle(C, threads === n),
    "aria-pressed": threads === n,
    onClick: () => setThreads(n)
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle(C),
      display: "flex",
      gap: "12px",
      flexWrap: "wrap"
    }
  }, THREAD_NAMES.slice(0, threads).map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: item
  }, swatch({
    background: C.T[i]
  }), "thread ", n)), /*#__PURE__*/React.createElement("span", {
    style: item
  }, swatch({
    background: C.muted,
    opacity: 0.3
  }), "whole cycle lost"), /*#__PURE__*/React.createElement("span", {
    style: item
  }, swatch({
    border: `1.1px solid ${C.muted}`
  }), "left over in a busy cycle"), /*#__PURE__*/React.createElement("span", {
    style: item
  }, swatch({
    border: `1.2px dashed ${C.fg}`
  }), "thread switch")), /*#__PURE__*/React.createElement(FigureSvg, {
    viewBox: `0 0 ${colX(CYC) + 4} ${H}`,
    maxWidth: 640,
    align: "left",
    ariaLabel: ISSUE_TECHNIQUES.map((t, i) => `${LABELS[t][0]}: IPC ${results[i].ipc.toFixed(2)}; ${results[i].filled} slots used, ${results[i].wasteEmptyCycles} lost to empty cycles, ${results[i].wasteLeftover} left over in busy cycles.`).join(" ")
  }, ISSUE_TECHNIQUES.map((t, p) => /*#__PURE__*/React.createElement(Panel, {
    key: t,
    p: p,
    technique: t,
    r: results[p],
    C: C
  })), /*#__PURE__*/React.createElement("text", {
    x: 0,
    y: axisY,
    fontSize: "11",
    fill: C.muted
  }, "cycle"), Array.from({
    length: CYC
  }, (_, c) => /*#__PURE__*/React.createElement("text", {
    key: c,
    x: colX(c) + CW / 2,
    y: axisY,
    textAnchor: "middle",
    fontSize: "10",
    fill: C.muted
  }, c))), /*#__PURE__*/React.createElement(WasteBars, {
    results: results,
    C: C
  }));
}