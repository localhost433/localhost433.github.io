/* AUTO-GENERATED from erm-objective-anatomy.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, Figure, FigureSvg, Lines, TeX, Arrow, useTypeset } from "@course";

/* The regularized ERM objective, part by part (note 00).

   Note 00 is the supplement written in Cho's notation — M, M⋆, Δ, C(M), ℋ — while
   every lecture note is in the deck's — h, f, ℓ, ℍ, E_in. The note opens by saying
   to translate before mixing them, and then gives the objective as three display
   equations built up in sequence. This is that build as one labelled object, with
   the translation attached to each piece rather than left as a table the reader has
   to apply in their head.

   Typeset with MathJax (the fence carries `math`), so the objective here is set the
   same way as the display equations it summarises. Each term is its own TeX box at
   a known centre, because the leader lines have to point at specific terms and
   foreignObject gives no way to measure one. */

const TERMS = [{
  ax: 96,
  lx: 30,
  tone: "mid",
  label: ["choose the model from", "the hypothesis space,", "not from all functions"]
}, {
  ax: 300,
  lx: 214,
  tone: "acc",
  label: ["the empirical risk: the average", "loss over the N samples you", "actually have"]
}, {
  ax: 500,
  lx: 452,
  tone: "neg",
  label: ["how much", "you care —", "the only", "free knob"]
}, {
  ax: 560,
  lx: 546,
  tone: "pos",
  label: ["a penalty on the model", "itself, not on its fit", "— extra constraints"]
}];
const TRANSLATE = [["M", "h", "a hypothesis"], ["M^\\star", "f", "the unknown target"], ["\\mathcal H", "\\mathbb H", "the hypothesis space"], ["\\Delta(y, M, x)", "\\ell\\big(h(x), f(x)\\big)", "the point-wise loss"], ["\\tfrac{1}{N}\\sum_n \\Delta", "E_{\\text{in}}(h)", "the in-sample error"]];
export default function ErmObjectiveAnatomy() {
  const C = useClassColors();
  useTypeset([C]);
  const tone = {
    mid: C.mid,
    acc: C.acc,
    neg: C.neg,
    pos: C.pos
  };
  return /*#__PURE__*/React.createElement(Figure, {
    title: "The regularized empirical risk minimization objective broken into its four parts, with each part labelled and translated between the supplement's notation and the lecture's.",
    caption: "Everything the lectures do to question 2 \u2014 generalization \u2014 lives in the last two terms. **`\u03BB` is the only knob here that is yours**: the loss comes from the task, the hypothesis space from modelling, and the penalty from what you believe a good model looks like."
  }, /*#__PURE__*/React.createElement(FigureSvg, {
    viewBox: "0 0 764 404",
    maxWidth: 764,
    ariaLabel: "The expression arg min over M in the hypothesis space of one over N times the sum over n of Delta of y-n, M, x-n, plus lambda times C of M, with each term labelled and a table translating the notation."
  }, /*#__PURE__*/React.createElement(TeX, {
    x: 96,
    y: 64,
    w: 220,
    anchor: "middle",
    size: 19,
    fill: C.fg,
    tex: "\\arg\\min\\limits_{M\\,\\in\\,\\mathcal H}"
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 300,
    y: 64,
    w: 340,
    anchor: "middle",
    size: 19,
    fill: C.fg,
    tex: "\\frac{1}{N}\\sum_{n=1}^{N}\\Delta\\big(y_n,\\,M,\\,x_n\\big)"
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 462,
    y: 64,
    w: 40,
    anchor: "middle",
    size: 19,
    fill: C.muted,
    tex: "+"
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 500,
    y: 64,
    w: 40,
    anchor: "middle",
    size: 19,
    fill: C.neg,
    tex: "\\lambda"
  }), /*#__PURE__*/React.createElement(TeX, {
    x: 560,
    y: 64,
    w: 120,
    anchor: "middle",
    size: 19,
    fill: C.fg,
    tex: "C(M)"
  }), TERMS.map((t, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement(Arrow, {
    from: [t.ax, 96],
    to: [t.ax, 126],
    C: C,
    tone: t.tone,
    width: 1.2
  }), /*#__PURE__*/React.createElement(Lines, {
    x: t.lx,
    y: 146,
    size: 11,
    fill: tone[t.tone],
    lines: t.label
  }))), /*#__PURE__*/React.createElement("line", {
    x1: 30,
    y1: 226,
    x2: 734,
    y2: 226,
    stroke: C.border,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: 30,
    y: 250,
    fontSize: "12",
    fill: C.muted,
    fontStyle: "italic"
  }, "note 00 (Cho)"), /*#__PURE__*/React.createElement("text", {
    x: 196,
    y: 250,
    fontSize: "12",
    fill: C.muted,
    fontStyle: "italic"
  }, "the lecture decks"), /*#__PURE__*/React.createElement("text", {
    x: 392,
    y: 250,
    fontSize: "12",
    fill: C.muted,
    fontStyle: "italic"
  }, "what it is"), TRANSLATE.map(([a, b, c], i) => {
    const y = 280 + i * 24;
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement(TeX, {
      x: 30,
      y: y,
      w: 160,
      size: 13,
      fill: C.fg,
      tex: a
    }), /*#__PURE__*/React.createElement(TeX, {
      x: 196,
      y: y,
      w: 190,
      size: 13,
      fill: C.acc,
      tex: b
    }), /*#__PURE__*/React.createElement("text", {
      x: 392,
      y: y,
      fontSize: "12",
      fill: C.muted
    }, c));
  })));
}