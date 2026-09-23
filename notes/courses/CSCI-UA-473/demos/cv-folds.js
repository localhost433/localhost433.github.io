/* AUTO-GENERATED from cv-folds.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, Figure, FigureSvg, Box, Lines, Sym, Arrow, TeX, useTypeset } from "@course";

/* K-fold cross-validation, model selection with it, and the fold back
   (note 06, L6 slides 15 and 17-20).

   The deck spreads this over six slides: the fold-back diagram, the push-pull on K,
   leave-one-out, the ten-fold picture with D_4 held out, and the model-selection
   loop as a bulleted list. Drawn as one U-shaped flow instead, because the
   procedure is one loop: K phases give one E_cv, one E_cv per candidate lambda
   picks lambda*, and the last step - retrain on all of D with lambda* fixed - is the
   same fold back that single validation ends with. Leave-one-out sits underneath as
   the K = N end of the same picture rather than as a separate method.

   Green is training data and purple is the fold being validated, the same two
   colours the validation-size figure uses for the same two roles. */

const K = 5,
  X0 = 112,
  CW = 60,
  GAP = 4,
  Y0 = 52,
  RH = 32,
  CH = 24;
const cellX = k => X0 + k * (CW + GAP);
const BAR_END = cellX(K - 1) + CW;
function Bar({
  y,
  val,
  C,
  label
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, Array.from({
    length: K
  }, (_, k) => /*#__PURE__*/React.createElement(Box, {
    key: k,
    x: cellX(k),
    y: y,
    w: CW,
    h: CH,
    C: C,
    tone: k === val ? "acc" : "pos",
    rx: 3,
    lines: [{
      t: k === val ? "val" : "train",
      size: 11,
      fill: k === val ? C.acc : C.muted,
      weight: k === val ? 600 : 400
    }]
  })), /*#__PURE__*/React.createElement(Sym, {
    x: 20,
    y: y + 16,
    text: label,
    size: 12,
    fill: C.muted
  }));
}
export default function CvFolds() {
  const C = useClassColors();
  useTypeset([C]);
  const rowY = j => Y0 + j * RH;
  const mid = (Y0 + rowY(K - 1) + CH) / 2;
  const FY = 262,
    LOO = 20,
    LY = 390,
    LW = (BAR_END - X0 - (LOO - 1) * 2) / LOO;
  return /*#__PURE__*/React.createElement(Figure, {
    title: "Five-fold cross-validation: five phases, each validating a different fifth of the data, averaged into one cross-validation error per candidate lambda; the best lambda is then retrained on all of the data. Leave-one-out is the same procedure with one point per fold.",
    caption: "One run of the loop on slide 20. **The five phases give one number**, `E_cv` for one value of `\u03BB`; repeating them for every candidate and keeping the smallest picks `\u03BB*`. The last row is the fold back from slide 15: retrain on all `N` points with `\u03BB*` fixed, and ship that `g`. Bottom: with `K = N` every fold is a single point, which is leave-one-out."
  }, /*#__PURE__*/React.createElement(FigureSvg, {
    viewBox: "0 0 760 430",
    maxWidth: 740,
    ariaLabel: "Five rows of five cells. In row j, cell j is marked val and the rest train; each row produces E_val superscript j. A bracket collects the five into E_cv of lambda, the average. An arrow leads to a box: repeat for each candidate lambda and keep the smallest. An arrow back to a final row of five training cells, labelled fold back, which produces g. Below, a row of twenty one-point folds for leave-one-out."
  }, Array.from({
    length: K
  }, (_, k) => /*#__PURE__*/React.createElement(Sym, {
    key: k,
    x: cellX(k) + CW / 2,
    y: 40,
    text: `D_${k + 1}`,
    size: 12,
    fill: C.muted,
    anchor: "middle"
  })), Array.from({
    length: K
  }, (_, j) => /*#__PURE__*/React.createElement("g", {
    key: j
  }, /*#__PURE__*/React.createElement(Bar, {
    y: rowY(j),
    val: j,
    C: C,
    label: `phase ${j + 1}`
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: [BAR_END + 8, rowY(j) + CH / 2],
    to: [BAR_END + 44, rowY(j) + CH / 2],
    C: C,
    width: 1.2
  }), /*#__PURE__*/React.createElement(Sym, {
    x: BAR_END + 52,
    y: rowY(j) + 17,
    text: `E_{val}^{${j + 1}}`,
    size: 13,
    fill: C.fg
  }))), /*#__PURE__*/React.createElement("path", {
    d: `M${BAR_END + 104},${Y0 + 2} L${BAR_END + 112},${Y0 + 2} L${BAR_END + 112},${rowY(K - 1) + CH - 2} L${BAR_END + 104},${rowY(K - 1) + CH - 2}`,
    fill: "none",
    stroke: C.muted,
    strokeWidth: "1.3"
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: [BAR_END + 112, mid],
    to: [566, mid],
    C: C,
    width: 1.3
  }), /*#__PURE__*/React.createElement(Box, {
    x: 568,
    y: mid - 30,
    w: 184,
    h: 60,
    C: C,
    tone: "acc"
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 660,
    y: mid + 6,
    w: 184,
    anchor: "middle",
    size: 13.5,
    fill: C.fg,
    tex: "E_{\\text{cv}}(\\lambda) = \\frac{1}{5}\\sum_{j=1}^{5} E_{\\text{val}}^{j}"
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: [660, mid + 30],
    to: [660, FY - 12],
    C: C,
    width: 1.3
  }), /*#__PURE__*/React.createElement(Box, {
    x: 580,
    y: FY - 10,
    w: 160,
    h: 64,
    C: C,
    lines: [{
      t: "repeat for each",
      size: 12
    }, {
      t: "candidate λ_1, …, λ_M;",
      size: 12
    }, {
      t: "keep the smallest E_{cv}",
      size: 12
    }]
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: [578, FY + 12],
    to: [BAR_END + 6, FY + 12],
    C: C,
    tone: "acc",
    width: 1.5
  }), /*#__PURE__*/React.createElement(Sym, {
    x: (BAR_END + 578) / 2,
    y: FY + 4,
    text: "\u03BB* fixed",
    size: 12,
    fill: C.acc,
    anchor: "middle"
  }), Array.from({
    length: K
  }, (_, k) => /*#__PURE__*/React.createElement(Box, {
    key: k,
    x: cellX(k),
    y: FY,
    w: CW,
    h: CH,
    C: C,
    tone: "pos",
    rx: 3,
    lines: [{
      t: "train",
      size: 11,
      fill: C.muted
    }]
  })), /*#__PURE__*/React.createElement(Lines, {
    x: 20,
    y: FY + 11,
    lines: ["fold back:", "all N points"],
    size: 12,
    fill: C.muted,
    lh: 1.25
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: [(X0 + BAR_END) / 2, FY + CH + 2],
    to: [(X0 + BAR_END) / 2, FY + CH + 30],
    C: C,
    width: 1.3
  }), /*#__PURE__*/React.createElement(Box, {
    x: (X0 + BAR_END) / 2 - 60,
    y: FY + CH + 32,
    w: 120,
    h: 30,
    C: C,
    tone: "solid",
    lines: [{
      t: "final g",
      size: 13,
      weight: 600
    }]
  }), /*#__PURE__*/React.createElement("line", {
    x1: 20,
    y1: LY - 30,
    x2: 740,
    y2: LY - 30,
    stroke: C.border,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement(Lines, {
    x: 20,
    y: LY - 8,
    lines: ["K = N (leave-one-out): N phases, each validating a single point"],
    size: 12,
    fill: C.muted
  }), Array.from({
    length: LOO
  }, (_, i) => /*#__PURE__*/React.createElement("rect", {
    key: i,
    x: X0 + i * (LW + 2),
    y: LY + 4,
    width: LW,
    height: 18,
    rx: 2,
    fill: i === 6 ? C.acc : C.pos,
    fillOpacity: i === 6 ? 0.55 : 0.14,
    stroke: i === 6 ? C.acc : C.pos,
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement(Sym, {
    x: 20,
    y: LY + 17,
    text: "phase j",
    size: 12,
    fill: C.muted
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: [BAR_END + 8, LY + 13],
    to: [BAR_END + 44, LY + 13],
    C: C,
    width: 1.2
  }), /*#__PURE__*/React.createElement(Sym, {
    x: BAR_END + 52,
    y: LY + 18,
    text: "e_j, then average the N of them",
    size: 12.5,
    fill: C.fg
  })));
}