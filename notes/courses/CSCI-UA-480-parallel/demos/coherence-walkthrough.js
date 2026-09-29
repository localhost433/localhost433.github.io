/* AUTO-GENERATED from coherence-walkthrough.jsx by `npm run build:artifacts`. Do not edit. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { useColors, FigureSvg, Box, Arrow, Sym, buttonStyle, labelStyle, readoutStyle, MONO } from "@course";
import { coherenceWalk, COHERENCE_MODES, COHERENCE_PROGRAM } from "@course/logic";

/* Slide 34's coherence example (note 03; L3 slides 33-36, book §2.3.5), stepped.
   x = 2 is shared, y0 belongs to core 0, y1 and z1 to core 1; caches are
   write-back and both protocols are write-invalidate. Four cores are drawn
   although only two touch x: with two, a broadcast to everyone and a message to
   the one sharer look identical, and that difference is the whole reason the
   directory scales. The states and messages come from coherenceWalk in
   _logic.mjs, which the tests pin (z1 = 8 without a protocol, 28 with either). */

const MODE_LABEL = {
  none: "No protocol",
  snoop: "Snooping",
  directory: "Directory"
};
const STATE_WORD = {
  S: "shared",
  M: "modified",
  I: "invalid"
};
const CX = i => 16 + i * 176,
  CW = 160;
const core = i => ({
  x: CX(i),
  y: 8,
  w: CW,
  h: 46
});
const cache = i => ({
  x: CX(i),
  y: 78,
  w: CW,
  h: 42
});
const BUS = {
  x: 16,
  y: 156,
  w: 3 * 176 + CW,
  h: 16
};
const MEM = {
  x: 150,
  y: 214,
  w: 200,
  h: 46
};
const DIR = {
  x: 372,
  y: 214,
  w: 260,
  h: 46
};

// A label with a background-coloured halo, so it stays legible where it crosses a line.
function Tag({
  x,
  y,
  text,
  C,
  anchor = "middle"
}) {
  return /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y,
    textAnchor: anchor,
    fontSize: "11.5",
    fill: C.fg,
    stroke: C.bg,
    strokeWidth: "4",
    strokeLinejoin: "round",
    paintOrder: "stroke"
  }, text);
}
function Curve({
  from,
  to,
  dip,
  C,
  tone = "acc",
  dash,
  label,
  dx = 0,
  dy = -4
}) {
  const mx = (from[0] + to[0]) / 2;
  const d = `M${from[0]},${from[1]} Q${mx},${dip} ${to[0]},${to[1]}`;
  // the curve's midpoint (t = 1/2 on a quadratic Bezier)
  const px = 0.25 * from[0] + 0.5 * mx + 0.25 * to[0],
    py = 0.25 * from[1] + 0.5 * dip + 0.25 * to[1];
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: C[tone],
    strokeWidth: "1.6",
    strokeDasharray: dash || undefined,
    markerEnd: `url(#fig-arrow-${tone})`
  }), label ? /*#__PURE__*/React.createElement(Tag, {
    x: px + dx,
    y: py + dy,
    text: label,
    C: C
  }) : null);
}
function narrate(mode, step) {
  if (!step) return "Before time 0: x = 2 is in main memory and no cache holds it.";
  const out = [];
  for (const e of step.events) {
    if (e.op === "read") {
      if (e.hit) {
        const stale = mode === "none" && e.core === 1 && step.t === 2;
        out.push(`Core ${e.core} hits in its own cache and reads x = ${e.value}.` + (stale ? " That copy is stale: core 0 wrote x = 7 at time 1, and nothing told core 1." : ""));
      } else if (e.from === "memory") {
        out.push(`Core ${e.core} misses and reads x = ${e.value} from main memory` + (mode === "snoop" ? " (the request is broadcast on the bus)." : mode === "directory" ? "; the directory records core " + e.core + " as a sharer." : "."));
      } else {
        out.push(mode === "snoop" ? `Core ${e.core} misses; its request goes out on the bus, core 0 sees it and supplies its modified x = ${e.value}, and main memory is updated on the way.` : `Core ${e.core} misses and asks the directory, which knows core 0 holds x modified and forwards the request to core 0 (dashed); core 0 supplies x = ${e.value}, main memory is updated, and the directory now lists both cores as sharers.`);
      }
    } else if (e.op === "write") {
      if (mode === "none") out.push("Core 0 writes x = 7 into its own cache. Nothing tells core 1, whose copy still says 2. (A write-through cache would update main memory as well, but still not core 1's copy, so the outcome is the same.)");else if (mode === "snoop") out.push("Core 0 writes x = 7 and broadcasts on the bus. Cores 1, 2 and 3 all snoop the broadcast; core 1 holds x, so it marks its copy invalid.");else out.push("Core 0 writes x = 7 and tells the directory. The directory lists core 1 as the only other sharer, so it sends one invalidation, to core 1; cores 2 and 3 hear nothing.");
    }
  }
  return out.join(" ");
}
export default function CoherenceWalkthrough() {
  const C = useColors();
  const [mode, setMode] = React.useState("none");
  const [k, setK] = React.useState(0); // 0 = before time 0, k = after time k-1
  const [guess, setGuess] = React.useState({}); // mode -> the reader's prediction for z1
  const walk = React.useMemo(() => coherenceWalk(mode), [mode]);
  // Predict before reveal: the first time a reader reaches time 2 in a mode, show
  // the state just before core 1 runs z1 = 4*x and ask for z1 first.
  const gated = k === 3 && guess[mode] == null;
  const step = gated ? walk[1] : k > 0 ? walk[k - 1] : null;
  const caches = step ? step.caches : walk[0].caches.map(() => ({
    state: "I",
    value: null
  }));
  const memory = step ? step.memory : 2;
  const dir = step ? step.directory : {
    sharers: [],
    owner: null
  };
  const vars = step ? step.vars : {};
  const latest = (() => {
    const m = caches.find(l => l.state === "M");
    return m ? m.value : memory;
  })();
  const events = step && !gated ? step.events : [];
  const busName = mode === "directory" ? "interconnect" : "bus";
  const cacheLines = l => {
    if (l.state === "I" && l.value === null) return [{
      t: "no copy of x",
      size: 12.5,
      fill: C.muted
    }];
    if (l.state === "I") return [{
      t: `x = ${l.value}  invalid`,
      size: 12.5,
      mono: true,
      fill: C.muted
    }];
    return [{
      t: `x = ${l.value}  ${STATE_WORD[l.state]}`,
      size: 12.5,
      mono: true
    }];
  };
  const cacheTone = l => {
    if (l.state === "I") return l.value === null ? "ghost" : "neg";
    if (l.state === "S" && l.value !== latest) return "neg";
    return l.state === "M" ? "acc" : "plain";
  };
  const marks = [];
  events.forEach((e, j) => {
    const c = cache(e.core),
      cx = c.x + c.w / 2;
    // Under snooping every miss is itself a broadcast on the bus.
    if (mode === "snoop" && e.op === "read" && e.hit === false) {
      marks.push(/*#__PURE__*/React.createElement(Arrow, {
        key: "r" + j,
        from: [cx + 24, c.y + c.h],
        to: [cx + 24, BUS.y - 2],
        C: C,
        tone: "muted",
        dash: "4 3",
        width: 1.4
      }));
      marks.push(/*#__PURE__*/React.createElement(Tag, {
        key: "rt" + j,
        x: cx + 30,
        y: c.y + c.h + 22,
        text: "read x",
        anchor: "start",
        C: C
      }));
    }
    if (e.op === "read" && e.hit === false && e.from === "memory") {
      const fx = MEM.x + MEM.w / 2 + (e.core === 0 ? -30 : 30);
      marks.push(/*#__PURE__*/React.createElement(Arrow, {
        key: "m" + j,
        from: [fx, MEM.y],
        to: [cx, c.y + c.h + 2],
        C: C,
        tone: "pos",
        width: 1.5
      }));
      marks.push(/*#__PURE__*/React.createElement(Tag, {
        key: "mt" + j,
        x: (fx + cx) / 2 + (e.core === 0 ? -8 : 8),
        y: (MEM.y + c.y + c.h) / 2 + 22,
        text: `x = ${e.value}`,
        anchor: e.core === 0 ? "end" : "start",
        C: C
      }));
    } else if (e.op === "read" && e.hit === false) {
      const o = cache(0);
      if (mode === "directory") {
        marks.push(/*#__PURE__*/React.createElement(Curve, {
          key: "q" + j,
          from: [cx + 20, c.y + c.h],
          to: [DIR.x + 70, DIR.y],
          dip: 200,
          C: C,
          tone: "muted",
          dash: "4 3",
          label: "read x",
          dx: 14
        }));
        marks.push(/*#__PURE__*/React.createElement(Curve, {
          key: "f" + j,
          from: [DIR.x + 20, DIR.y],
          to: [o.x + o.w / 2 - 30, o.y + o.h + 2],
          dip: 170,
          C: C,
          tone: "muted",
          dash: "4 3",
          label: "forward",
          dy: 14
        }));
      }
      marks.push(/*#__PURE__*/React.createElement(Curve, {
        key: "d" + j,
        from: [o.x + o.w - 20, o.y + o.h],
        to: [c.x + 20, c.y + c.h + 2],
        dip: BUS.y + 44,
        C: C,
        tone: "pos",
        label: `x = ${e.value}`,
        dy: 18
      }));
    } else if (e.op === "read" && e.hit) {
      const stale = cacheTone(caches[e.core]) === "neg";
      marks.push(/*#__PURE__*/React.createElement(Tag, {
        key: "h" + j,
        x: cx,
        y: c.y + c.h + 18,
        text: stale ? "hit, but on a stale copy" : "hit",
        C: C
      }));
    } else if (e.op === "write" && mode === "snoop") {
      marks.push(/*#__PURE__*/React.createElement(Arrow, {
        key: "w" + j,
        from: [cx, c.y + c.h],
        to: [cx, BUS.y - 2],
        C: C,
        tone: "acc",
        width: 1.8
      }));
      marks.push(/*#__PURE__*/React.createElement(Tag, {
        key: "wt" + j,
        x: BUS.x + 8,
        y: BUS.y + 32,
        text: "broadcast: invalidate the line holding x",
        anchor: "start",
        C: C
      }));
      e.seenBy.forEach(i => {
        const t = cache(i),
          tx = t.x + t.w / 2;
        marks.push(/*#__PURE__*/React.createElement(Arrow, {
          key: "s" + i,
          from: [tx, BUS.y],
          to: [tx, t.y + t.h + 2],
          C: C,
          tone: "acc",
          dash: "4 3",
          width: 1.4
        }));
      });
    } else if (e.op === "write" && mode === "directory") {
      marks.push(/*#__PURE__*/React.createElement(Curve, {
        key: "w" + j,
        from: [cx - 20, c.y + c.h],
        to: [DIR.x + 30, DIR.y],
        dip: 196,
        C: C,
        tone: "acc",
        label: "write x",
        dy: 16
      }));
      e.seenBy.forEach(i => {
        const t = cache(i);
        marks.push(/*#__PURE__*/React.createElement(Curve, {
          key: "i" + i,
          from: [DIR.x + 110, DIR.y],
          to: [t.x + t.w / 2 + 30, t.y + t.h + 2],
          dip: 176,
          C: C,
          tone: "acc",
          dash: "4 3",
          label: "invalidate",
          dx: 40,
          dy: -2
        }));
      });
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    hidden: true
  }, "Slide 34's coherence example, stepped"), /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "Slide 34's cache coherence example stepped through time on four cores, with no coherence protocol, with snooping, and with a directory."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "protocol"), COHERENCE_MODES.map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    type: "button",
    style: buttonStyle(C, mode === m),
    "aria-pressed": mode === m,
    onClick: () => setMode(m)
  }, MODE_LABEL[m])), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, false, k === 0),
    disabled: k === 0,
    onClick: () => setK(k - 1)
  }, "\u25C2 Back"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, false, k === 3),
    disabled: k === 3,
    onClick: () => setK(k + 1)
  }, "Next \u25B8"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle(C),
      minWidth: "8em"
    }
  }, k === 0 ? "before time 0" : gated ? "about to run time 2" : `after time ${k - 1}`)), /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle(C),
      display: "flex",
      gap: "4px 14px",
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.fg
    }
  }, "cache line:"), [["acc", "modified (newer than memory)"], ["plain", "shared (clean copy)"], ["neg", "invalid or stale"]].map(([t, lbl]) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 14,
      height: 11,
      borderRadius: 3,
      boxSizing: "border-box",
      border: `1.4px ${t === "neg" ? "dashed" : "solid"} ${t === "plain" ? C.muted : C[t]}`,
      background: t === "plain" ? "transparent" : C[t] + "24"
    }
  }), lbl))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle(C),
      display: "flex",
      gap: "4px 14px",
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.fg
    }
  }, "arrows:"), [["pos", "solid", "data"], ["acc", "solid", "the write"], ["acc", "dashed", "its invalidations"], ["muted", "dashed", "read requests"]].map(([t, st, lbl]) => /*#__PURE__*/React.createElement("span", {
    key: lbl,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 18,
      borderTop: `2px ${st} ${C[t]}`,
      display: "inline-block"
    }
  }), lbl))), /*#__PURE__*/React.createElement("table", {
    style: {
      borderCollapse: "collapse",
      fontSize: 13,
      fontFamily: MONO,
      alignSelf: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      color: C.muted
    }
  }, ["Time", "Core 0", "Core 1"].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: "left",
      padding: "2px 14px 2px 6px",
      fontWeight: 500
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, COHERENCE_PROGRAM.map((row, t) => /*#__PURE__*/React.createElement("tr", {
    key: t,
    style: {
      background: k === t + 1 ? C.border : "transparent"
    },
    "aria-current": k === t + 1 ? "step" : undefined
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "2px 14px 2px 6px"
    }
  }, t), row.map(ins => /*#__PURE__*/React.createElement("td", {
    key: ins.core,
    style: {
      padding: "2px 14px 2px 6px",
      color: ins.op === "other" ? C.muted : C.fg
    }
  }, ins.text)))))), /*#__PURE__*/React.createElement(FigureSvg, {
    viewBox: "0 0 720 268",
    maxWidth: 720,
    ariaLabel: `Four cores with private caches on a ${busName}, main memory below${mode === "directory" ? ", and a directory entry for x" : ""}. ${narrate(mode, step)}`
  }, [0, 1, 2, 3].map(i => {
    const ev = gated ? i === 1 ? {
      op: "read",
      text: "z1 = 4*x;  (next)"
    } : i === 0 ? {
      op: "other",
      text: "(not involving x)"
    } : null : events.find(e => e.core === i);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement(Box, _extends({}, core(i), {
      C: C,
      tone: ev && ev.op !== "other" ? "fg" : "plain",
      strokeWidth: ev && ev.op !== "other" ? 2.2 : 1.4,
      lines: [{
        t: `core ${i}`,
        size: 13,
        weight: 600
      }, {
        t: ev ? ev.text : i < 2 ? " " : "(not using x)",
        size: 12,
        mono: true,
        fill: ev && ev.op !== "other" ? C.fg : C.muted
      }]
    })), /*#__PURE__*/React.createElement("line", {
      x1: CX(i) + CW / 2,
      y1: 54,
      x2: CX(i) + CW / 2,
      y2: 78,
      stroke: C.border,
      strokeWidth: "1.2"
    }), /*#__PURE__*/React.createElement(Box, _extends({}, cache(i), {
      C: C,
      tone: cacheTone(caches[i]),
      dash: caches[i].state === "I" && caches[i].value !== null ? "4 3" : undefined,
      lines: cacheLines(caches[i])
    })), /*#__PURE__*/React.createElement("line", {
      x1: CX(i) + CW / 2,
      y1: 120,
      x2: CX(i) + CW / 2,
      y2: BUS.y,
      stroke: C.border,
      strokeWidth: "1.6"
    }));
  }), /*#__PURE__*/React.createElement("rect", {
    x: BUS.x,
    y: BUS.y,
    width: BUS.w,
    height: BUS.h,
    rx: 4,
    fill: C.border
  }), /*#__PURE__*/React.createElement("text", {
    x: BUS.x + BUS.w - 8,
    y: BUS.y + 12.5,
    textAnchor: "end",
    fontSize: "11.5",
    fill: C.fg
  }, busName), /*#__PURE__*/React.createElement("line", {
    x1: MEM.x + MEM.w / 2,
    y1: BUS.y + BUS.h,
    x2: MEM.x + MEM.w / 2,
    y2: MEM.y,
    stroke: C.border,
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement(Box, _extends({}, MEM, {
    C: C,
    lines: [{
      t: "main memory",
      size: 12.5,
      fill: C.muted
    }, {
      t: `x = ${memory}`,
      size: 13,
      mono: true
    }]
  })), mode === "directory" && /*#__PURE__*/React.createElement(Box, _extends({}, DIR, {
    C: C,
    tone: "mid",
    lines: [{
      t: "directory entry for x",
      size: 12.5,
      fill: C.muted
    }, {
      t: `sharers {${dir.sharers.join(", ")}}  owner ${dir.owner === null ? "–" : "core " + dir.owner}`,
      size: 12.5,
      mono: true
    }]
  })), marks), gated ? /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${C.fg}`,
      borderRadius: 8,
      padding: "10px 12px",
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, "Core 1 is about to run ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: MONO
    }
  }, "z1 = 4*x;"), " Predict first: what will z1 be?"), [8, 28].map(v => /*#__PURE__*/React.createElement("button", {
    key: v,
    type: "button",
    style: buttonStyle(C),
    onClick: () => setGuess({
      ...guess,
      [mode]: v
    })
  }, v))) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.55
    }
  }, k === 3 && guess[mode] != null ? /*#__PURE__*/React.createElement("strong", null, guess[mode] === vars.z1 ? "Right. " : `Not ${guess[mode]}: z1 = ${vars.z1}. `) : null, narrate(mode, step)), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, "y0 = ", vars.y0 ?? "–", "   y1 = ", vars.y1 ?? "–", "   z1 = ", vars.z1 ?? "–", vars.z1 != null ? vars.z1 === 28 ? "   (4 × 7: core 1 saw the write)" : "   (4 × 2: core 1 used a stale x)" : ""));
}