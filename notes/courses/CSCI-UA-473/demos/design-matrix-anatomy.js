/* AUTO-GENERATED from design-matrix-anatomy.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, Figure, FigureSvg, TableGrid, Bracket, Lines, TeX, useReveal, useTypeset } from "@course";

/* The shapes in linear regression, once, before the algebra moves them (note 05,
   L5 slides 8-14).

   Slide 12 answers a question note 02 left open — X is N by (d+1), rows are
   examples, the bias column is inside X — and it answers it in one line of prose.
   Every later formula in the lecture depends on having got that right: whether
   XᵀX is (d+1)×(d+1) or N×N, whether ŵ is a column of d+1 numbers, whether the
   leading 1 belongs to the data or to the model. A reader who transposed X on
   slide 12 can follow every subsequent derivation and be wrong about all of them,
   which is why this is a picture and not a sentence.

   Drawn on the lecture's own credit-line example with N = 4 and d = 2, small
   enough to count. The weights stay symbolic: the figure is about shape, and a
   grid of solved numbers invites the reader to check arithmetic instead. */

const ROWS = [[5.2, 3], [7.8, 1], [3.1, 9], [9.4, 5]];
const Y = [12.0, 15.5, 8.2, 20.1];
const CW = 56,
  CH = 30,
  HX = 62,
  HY = 28;
const XX = 96,
  XY = 76; // top-left of the X block, headers included
const CELLS_Y = XY + HY; // where X's data cells actually start
const XCELLS = XX + HX; // and their left edge
const XW = 3 * CW;
const WX = 372,
  WY = CELLS_Y + (4 * CH - 3 * CH) / 2;
const YX = 500;
const STEPS = 4;
const S_W = 1,
  S_Y = 2,
  S_NOTE = 3;
export default function DesignMatrixAnatomy() {
  const C = useClassColors();
  const box = React.useRef(null);
  const step = useReveal(box, STEPS, {
    ms: 1000
  });
  useTypeset([C, step]);
  const f1 = v => v.toFixed(1);
  // the leading column of ones is the only part of X that is not data
  const xCells = ROWS.map(r => [{
    t: "1",
    tone: "acc",
    alpha: 0.22
  }, {
    t: f1(r[0])
  }, {
    t: String(r[1])
  }]);
  const yCells = Y.map(v => [{
    t: f1(v),
    tone: "pos",
    alpha: 0.16
  }]);
  const bracket = (x, y, h, cols, cw, at) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Bracket, {
    x: x - 6,
    y: y,
    h: h,
    C: C,
    step: step,
    at: at
  }), /*#__PURE__*/React.createElement(Bracket, {
    x: x + cols * cw + 6,
    y: y,
    h: h,
    side: "right",
    C: C,
    step: step,
    at: at
  }));
  const op = (t, x, y, at) => /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y,
    textAnchor: "middle",
    fontSize: 20,
    fill: C.muted,
    style: {
      transition: "opacity .45s ease",
      opacity: step >= at ? 1 : 0
    }
  }, t);
  return /*#__PURE__*/React.createElement(Figure, {
    title: "The shapes of linear regression on four examples and two features: the design matrix with its leading column of ones, the weight vector, and the target vector, each with its dimensions named.",
    caption: "Rows of `X` are **examples**, columns are **features**, and the leading column of ones is part of `X` rather than part of the model \u2014 that is what bias absorption means. Getting this orientation wrong makes `X\u1D40X` the wrong size and every formula after slide 12 unreadable."
  }, /*#__PURE__*/React.createElement("div", {
    ref: box
  }, /*#__PURE__*/React.createElement(FigureSvg, {
    viewBox: "0 0 764 372",
    maxWidth: 764,
    ariaLabel: "A four by three design matrix whose first column is all ones and whose other two columns are income and years; times a three by one weight vector w0, w1, w2; approximately equal to a four by one vector of credit lines."
  }, /*#__PURE__*/React.createElement(TableGrid, {
    x: XX,
    y: XY,
    cw: CW,
    ch: CH,
    cells: xCells,
    C: C,
    size: 12.5,
    texHead: true,
    colHead: ["1", "\\text{income}", "\\text{years}"],
    rowHead: ["x^1", "x^2", "x^3", "x^4"]
  }), bracket(XCELLS, CELLS_Y, 4 * CH, 3, CW, 0), /*#__PURE__*/React.createElement(Lines, {
    x: XCELLS + XW / 2,
    y: XY - 22,
    size: 12,
    fill: C.fg,
    anchor: "middle",
    lines: ["X — the design matrix"]
  }), /*#__PURE__*/React.createElement(Lines, {
    x: XX - 44,
    y: CELLS_Y + 2 * CH,
    size: 11,
    fill: C.muted,
    anchor: "middle",
    lines: ["one row", "= one", "example"]
  }), /*#__PURE__*/React.createElement(TeX, {
    x: XCELLS + CW / 2,
    y: CELLS_Y + 4 * CH + 34,
    w: 200,
    anchor: "middle",
    size: 11.5,
    fill: C.acc,
    tex: "\\text{the absorbed bias}"
  }), op("\u00b7", 344, CELLS_Y + 2 * CH + 6, S_W), /*#__PURE__*/React.createElement("g", {
    style: {
      transition: "opacity .45s ease",
      opacity: step >= S_W ? 1 : 0
    }
  }, ["w_0", "w_1", "w_2"].map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: t
  }, /*#__PURE__*/React.createElement("rect", {
    x: WX,
    y: WY + i * CH,
    width: CW,
    height: CH,
    fill: i === 0 ? C.acc : C.bg,
    fillOpacity: i === 0 ? 0.22 : 1,
    stroke: C.border,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement(TeX, {
    x: WX + CW / 2,
    y: WY + i * CH + CH / 2 + 4,
    w: CW * 2,
    anchor: "middle",
    size: 13.5,
    fill: i === 0 ? C.acc : C.fg,
    tex: t
  })))), bracket(WX, WY, 3 * CH, 1, CW, S_W), /*#__PURE__*/React.createElement(Lines, {
    x: WX + CW / 2,
    y: WY - 16,
    size: 12,
    fill: C.fg,
    anchor: "middle",
    step: step,
    at: S_W,
    lines: ["w — what is learned"]
  }), op("\u2248", 464, CELLS_Y + 2 * CH + 6, S_Y), /*#__PURE__*/React.createElement(TableGrid, {
    x: YX,
    y: CELLS_Y,
    cw: CW + 8,
    ch: CH,
    cells: yCells,
    C: C,
    size: 12.5,
    step: step,
    at: S_Y
  }), bracket(YX, CELLS_Y, 4 * CH, 1, CW + 8, S_Y), /*#__PURE__*/React.createElement(Lines, {
    x: YX + (CW + 8) / 2,
    y: CELLS_Y - 16,
    size: 12,
    fill: C.pos,
    anchor: "middle",
    step: step,
    at: S_Y,
    lines: ["y — credit line"]
  }), /*#__PURE__*/React.createElement("g", {
    style: {
      transition: "opacity .45s ease",
      opacity: step >= S_NOTE ? 1 : 0
    }
  }, /*#__PURE__*/React.createElement(TeX, {
    x: 604,
    y: CELLS_Y + 8,
    w: 170,
    size: 13,
    fill: C.fg,
    tex: "X:\\; N \\times (d{+}1)"
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 604,
    y: CELLS_Y + 42,
    w: 170,
    size: 13,
    fill: C.fg,
    tex: "w:\\; (d{+}1) \\times 1"
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 604,
    y: CELLS_Y + 76,
    w: 170,
    size: 13,
    fill: C.fg,
    tex: "y:\\; N \\times 1"
  }), /*#__PURE__*/React.createElement(Lines, {
    x: 604,
    y: CELLS_Y + 106,
    size: 11,
    fill: C.muted,
    lines: ["here N = 4, d = 2"]
  })), /*#__PURE__*/React.createElement("line", {
    x1: 64,
    y1: 268,
    x2: 700,
    y2: 268,
    stroke: C.border,
    strokeWidth: "1",
    style: {
      transition: "opacity .45s ease",
      opacity: step >= S_NOTE ? 1 : 0
    }
  }), /*#__PURE__*/React.createElement("g", {
    style: {
      transition: "opacity .45s ease",
      opacity: step >= S_NOTE ? 1 : 0
    }
  }, /*#__PURE__*/React.createElement(TeX, {
    x: 64,
    y: 300,
    w: 330,
    size: 13,
    fill: C.acc,
    tex: "w_0 \\;\\text{\u2014 the intercept: how far the hyperplane}"
  }), /*#__PURE__*/React.createElement(Lines, {
    x: 64,
    y: 318,
    size: 12.5,
    fill: C.acc,
    lines: ["sits from the origin"]
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 404,
    y: 300,
    w: 340,
    size: 13,
    fill: C.fg,
    tex: "[w_1,\\dots,w_d] \\;\\text{\u2014 the hyperplane's}"
  }), /*#__PURE__*/React.createElement(Lines, {
    x: 404,
    y: 318,
    size: 12.5,
    fill: C.fg,
    lines: ["orientation in d dimensions"]
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 64,
    y: 350,
    w: 660,
    size: 13,
    fill: C.muted,
    tex: "\\text{and the whole of training is } \\; \\hat w = \\arg\\min_w (y - Xw)^{\\mathsf T}(y - Xw) \\; = \\; (X^{\\mathsf T}X)^{-1}X^{\\mathsf T}y ."
  })))));
}