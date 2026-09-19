/* AUTO-GENERATED from matvec-column-view.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, Figure, FigureSvg, TableGrid, Bracket, Lines, TeX, useReveal, useTypeset } from "@course";

/* Ax as a linear combination of the columns of A (note 02, L2 slides 12 and 14).

   The deck gives the rule abstractly on slide 14 — y = Σ xᵢaᵢ — two slides after
   the concrete IT-spending example on slide 12, and the note points out that these
   are two readings of one operation. Drawn on the deck's own numbers, the rule
   stops being notation: the answer column is literally the first column scaled by
   the desktop price plus the second scaled by the laptop price.

   Revealed in that order, because the whole figure is an equality being derived:
   each column is picked out, scaled by its own price, and only then added, so the
   "linear combination" is something you watch happen rather than a caption under a
   finished equation. One beat per operand — splitting the two scaled columns apart
   is the difference between an animation and a slide that fades in. */

const A = [[2, 4], [1, 5], [3, 5], [2, 7]];
const X = [1000, 3000];
const Y = A.map(r => r[0] * X[0] + r[1] * X[1]);
const CH = 28;
export default function MatvecColumnView() {
  const C = useClassColors();
  const box = React.useRef(null);
  const step = useReveal(box, 6, {
    ms: 950
  });
  useTypeset([C, step]);
  const cell = (t, tone) => ({
    t: String(t),
    tone,
    alpha: tone ? 0.16 : 0
  });
  const col = j => A.map(r => [cell(r[j], j === 0 ? "acc" : "pos")]);
  const scaled = j => A.map(r => [cell(r[j] * X[j], j === 0 ? "acc" : "pos")]);
  const grid = (x, y, cells, cw, at) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableGrid, {
    x: x,
    y: y,
    cw: cw,
    ch: CH,
    cells: cells,
    C: C,
    size: 12,
    step: step,
    at: at
  }), /*#__PURE__*/React.createElement(Bracket, {
    x: x - 5,
    y: y,
    h: cells.length * CH,
    C: C,
    step: step,
    at: at
  }), /*#__PURE__*/React.createElement(Bracket, {
    x: x + cw * cells[0].length + 5,
    y: y,
    h: cells.length * CH,
    side: "right",
    C: C,
    step: step,
    at: at
  }));
  const op = (t, x, y, at, size = 15) => /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y,
    textAnchor: "middle",
    fontSize: size,
    fill: C.muted,
    style: {
      transition: "opacity .45s ease",
      opacity: step >= at ? 1 : 0
    }
  }, t);
  return /*#__PURE__*/React.createElement(Figure, {
    title: "Matrix-vector multiplication read as a linear combination of columns, on the lecture's IT-spending example: the answer is the first column scaled by the desktop price plus the second column scaled by the laptop price.",
    caption: "One row of `A` is one company, one column is one kind of equipment. Reading across rows gives each company's bill; **reading down columns gives the same answer as a combination of two vectors**, which is the reading note 05 needs when `Xw` has to land in the column space of `X`."
  }, /*#__PURE__*/React.createElement("div", {
    ref: box
  }, /*#__PURE__*/React.createElement(FigureSvg, {
    viewBox: "0 0 740 386",
    maxWidth: 740,
    ariaLabel: "A four by two matrix of desktop and laptop counts times the price vector 1000, 3000 equals the total-spending vector; below, the same result written as 1000 times the first column plus 3000 times the second."
  }, /*#__PURE__*/React.createElement("text", {
    x: 111,
    y: 44,
    textAnchor: "middle",
    fontSize: "11.5",
    fill: C.acc
  }, "desktops"), /*#__PURE__*/React.createElement("text", {
    x: 165,
    y: 44,
    textAnchor: "middle",
    fontSize: "11.5",
    fill: C.pos
  }, "laptops"), grid(84, 56, A.map(r => [cell(r[0], "acc"), cell(r[1], "pos")]), 54, 0), /*#__PURE__*/React.createElement(Lines, {
    x: 10,
    y: 92,
    size: 11,
    fill: C.muted,
    lines: ["one row", "= one", "company"]
  }), op("·", 214, 118, 0), grid(232, 84, [[cell(X[0], "acc")], [cell(X[1], "pos")]], 68, 0), /*#__PURE__*/React.createElement(Lines, {
    x: 232,
    y: 76,
    size: 11,
    fill: C.muted,
    lines: ["unit prices"]
  }), op("=", 322, 118, 0), grid(340, 56, Y.map(v => [cell(v)]), 76, 0), /*#__PURE__*/React.createElement(Lines, {
    x: 340,
    y: 48,
    size: 11,
    fill: C.muted,
    lines: ["total IT spending"]
  }), /*#__PURE__*/React.createElement(Lines, {
    x: 452,
    y: 70,
    size: 12,
    fill: C.muted,
    lines: ["The space has been transformed", "from “unit price of equipment”", "to “total spending by company”."]
  }), /*#__PURE__*/React.createElement(Lines, {
    x: 452,
    y: 140,
    size: 12,
    fill: C.fg,
    lines: ["Same product, read down the", "columns instead of across the rows:"]
  }), /*#__PURE__*/React.createElement("line", {
    x1: 64,
    y1: 202,
    x2: 696,
    y2: 202,
    stroke: C.border,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 76,
    y: 294,
    w: 60,
    anchor: "middle",
    size: 15,
    fill: C.fg,
    tex: "y \\;=",
    step: step,
    at: 1
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 187,
    y: 222,
    w: 60,
    anchor: "middle",
    size: 13,
    fill: C.acc,
    tex: "a_1",
    step: step,
    at: 1
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 331,
    y: 222,
    w: 60,
    anchor: "middle",
    size: 13,
    fill: C.pos,
    tex: "a_2",
    step: step,
    at: 2
  }), op("1000 ·", 128, 294, 1, 14), grid(164, 232, col(0), 46, 1), op("+", 228, 294, 2, 15), op("3000 ·", 272, 294, 2, 14), grid(308, 232, col(1), 46, 2), op("=", 374, 294, 3, 15), grid(392, 232, scaled(0), 66, 3), op("+", 478, 294, 4, 15), grid(496, 232, scaled(1), 74, 4), op("=", 590, 294, 5, 15), grid(608, 232, Y.map(v => [cell(v)]), 76, 5), /*#__PURE__*/React.createElement(TeX, {
    x: 370,
    y: 362,
    w: 420,
    anchor: "middle",
    size: 14,
    fill: C.muted,
    step: step,
    at: 5,
    tex: "\\text{in general:}\\quad y \\;=\\; \\sum_i x_i\\, a_i"
  }))));
}