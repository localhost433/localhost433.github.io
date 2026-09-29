/* AUTO-GENERATED from histogram-first-partition.jsx by `npm run build:artifacts`. Do not edit. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { useColors, Figure, FigureSvg, Box, Arrow, Sym, Lines, port } from "@course";

/* The histogram's first partition (note 04; L4 slide 31, book Fig 2.21): one
   Find_bin task per data element, one increment task per bin. Redrawn with the
   contended bin marked, because the slide's point is carried entirely by two
   arrows meeting at one box and that is easy to miss at slide size. */

export default function HistogramFirstPartition() {
  const C = useColors();
  const d0 = {
      x: 150,
      y: 24,
      w: 116,
      h: 32
    },
    d1 = {
      x: 286,
      y: 24,
      w: 104,
      h: 32
    },
    d2 = {
      x: 410,
      y: 24,
      w: 116,
      h: 32
    };
  const b0 = {
      x: 150,
      y: 118,
      w: 190,
      h: 34
    },
    b1 = {
      x: 360,
      y: 118,
      w: 166,
      h: 34
    };
  const at = (n, dx) => [n.x + n.w / 2 + dx, n.y];
  return /*#__PURE__*/React.createElement(Figure, {
    title: "First partition of the histogram: Find_bin tasks for data elements i minus 1, i and i plus 1, with the first two both sending an increment to bin counts b minus 1.",
    caption: "Slide 31. Each `Find_bin` task works on one element and sends one increment to the task that owns its bin. `data[i-1]` and `data[i]` both land in bin `b-1`, so two tasks update one counter: `bin_counts[b-1]++` is a **critical section**, and with many elements per bin the increments serialize. With the deck's own 20 values the output is `bin_counts = [6, 3, 2, 3, 6]`: the counters for bins 0 and 4 each take **6 increments from 6 different tasks**."
  }, /*#__PURE__*/React.createElement(FigureSvg, {
    viewBox: "0 0 560 200",
    maxWidth: 560,
    ariaLabel: "Top row, Find_bin: data[i-1], data[i], data[i+1]. Bottom row, increment bin_counts: bin_counts[b-1]++ receives arrows from data[i-1] and data[i] and is marked as contended; bin_counts[b]++ receives an arrow from data[i+1]."
  }, /*#__PURE__*/React.createElement(Sym, {
    x: 0,
    y: 45,
    text: "Find_bin",
    size: 13,
    fill: C.fg,
    mono: true
  }), /*#__PURE__*/React.createElement(Lines, {
    x: 0,
    y: 131,
    lines: ["Increment", "bin_counts"],
    size: 13,
    fill: C.fg,
    lh: 1.3,
    mono: true
  }), /*#__PURE__*/React.createElement(Sym, {
    x: 128,
    y: 45,
    text: "\u2026",
    size: 14,
    fill: C.muted
  }), /*#__PURE__*/React.createElement(Sym, {
    x: 536,
    y: 45,
    text: "\u2026",
    size: 14,
    fill: C.muted
  }), /*#__PURE__*/React.createElement(Sym, {
    x: 128,
    y: 140,
    text: "\u2026",
    size: 14,
    fill: C.muted
  }), /*#__PURE__*/React.createElement(Sym, {
    x: 536,
    y: 140,
    text: "\u2026",
    size: 14,
    fill: C.muted
  }), /*#__PURE__*/React.createElement(Box, _extends({}, d0, {
    C: C,
    lines: [{
      t: "data[i-1]",
      mono: true
    }]
  })), /*#__PURE__*/React.createElement(Box, _extends({}, d1, {
    C: C,
    lines: [{
      t: "data[i]",
      mono: true
    }]
  })), /*#__PURE__*/React.createElement(Box, _extends({}, d2, {
    C: C,
    lines: [{
      t: "data[i+1]",
      mono: true
    }]
  })), /*#__PURE__*/React.createElement(Box, _extends({}, b0, {
    C: C,
    tone: "neg",
    strokeWidth: 1.8,
    lines: [{
      t: "bin_counts[b-1]++",
      mono: true
    }]
  })), /*#__PURE__*/React.createElement(Box, _extends({}, b1, {
    C: C,
    lines: [{
      t: "bin_counts[b]++",
      mono: true
    }]
  })), /*#__PURE__*/React.createElement(Arrow, {
    from: port(d0, "bottom"),
    to: at(b0, -30),
    C: C,
    tone: "neg",
    width: 1.6
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: port(d1, "bottom"),
    to: at(b0, 30),
    C: C,
    tone: "neg",
    width: 1.6
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: port(d2, "bottom"),
    to: port(b1, "top"),
    C: C,
    width: 1.4
  }), /*#__PURE__*/React.createElement(Lines, {
    x: b0.x + b0.w / 2,
    y: 176,
    anchor: "middle",
    size: 12,
    fill: C.fg,
    italic: true,
    lines: ["two tasks, one counter"]
  })));
}