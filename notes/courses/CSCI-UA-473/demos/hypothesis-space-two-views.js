/* AUTO-GENERATED from hypothesis-space-two-views.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, Figure, FigureSvg, Lines, TeX, useReveal, useTypeset } from "@course";

/* The components diagram, instantiated (note 03, after L3 slides 7-13).

   `components-diagram` draws the lecture's own chart and is accurate, but every
   box in it is a name: f is "unknown target function", ℍ is "hypothesis set", g is
   "final hypothesis". Nothing on that chart says what kind of object any of them
   is, so it can be read correctly and still leave ℍ as a word rather than a thing.

   This figure draws one running example twice, because the two readings of ℍ are
   what the rest of the course alternates between without announcing it:

     left   a hypothesis is a BOUNDARY drawn on the input space, and ℍ is a family
            of them — the picture used whenever someone says "a linear model"
     right  a hypothesis is a POINT, and ℍ is the region of a space those points
            fill — the picture every optimisation argument uses, because "search
            ℍ for the best g" only means something once ℍ has a geometry

   The same five hypotheses appear in both, in the same colour, and the whole point
   of the figure is the correspondence line between them: one boundary on the left
   is one point on the right. f is drawn deliberately curved, so that on the left it
   is a shape no straight line can match and on the right it is a point outside the
   region — two readings of "the target is not in your hypothesis set", which is the
   gap No Free Lunch is about and the one bias-variance will decompose. */

const STEPS = 4;
const S_H = 1,
  S_F = 2,
  S_G = 3;

// ---- left panel: the input space ------------------------------------------
const LX = 44,
  LY = 76,
  LW = 300,
  LH = 216;
const px = u => LX + u * LW;
const py = v => LY + LH - v * LH;

// the target: a shallow U, so no straight line reproduces it
const F = u => 0.30 + 0.9 * (u - 0.5) * (u - 0.5);

// H is the straight lines v = a + b·u; five of them, drawn and plotted
const HYPS = [{
  a: 0.60,
  b: -0.30
}, {
  a: 0.50,
  b: -0.10
}, {
  a: 0.42,
  b: 0.02
}, {
  a: 0.38,
  b: 0.08
},
// the one that separates the sample: g
{
  a: 0.28,
  b: 0.25
}];
const G = 3;
const POS = [[0.12, 0.80], [0.35, 0.62], [0.62, 0.68], [0.88, 0.85], [0.50, 0.55]];
const NEG = [[0.18, 0.30], [0.42, 0.15], [0.70, 0.22], [0.90, 0.36]];

// ---- right panel: the space of functions -----------------------------------
const RX = 404,
  RY = 76,
  RW = 336,
  RH = 216;
const EC = [568, 208],
  ER = [140, 80]; // the ℍ ellipse
const DOTS = [[486, 216], [506, 172], [548, 200], [600, 218], [652, 238]];
const FDOT = [694, 112];
const FADE = {
  transition: "opacity .5s ease"
};
const on = (step, at) => ({
  ...FADE,
  opacity: step >= at ? 1 : 0
});
export default function HypothesisSpaceTwoViews() {
  const C = useClassColors();
  const box = React.useRef(null);
  const step = useReveal(box, STEPS, {
    ms: 1100
  });
  useTypeset([C, step]);
  const line = ({
    a,
    b
  }) => `${px(0)},${py(a)} ${px(1)},${py(a + b)}`;
  const fPath = Array.from({
    length: 41
  }, (_, i) => {
    const u = i / 40;
    return `${px(u).toFixed(1)},${py(F(u)).toFixed(1)}`;
  }).join(" ");
  return /*#__PURE__*/React.createElement(Figure, {
    title: "One hypothesis set drawn twice: on the left each hypothesis is a boundary across the input space, on the right each is a single point in a space of functions, with the target sitting outside the region in both readings.",
    caption: "Left, a hypothesis is a **line on the input space** and `H` is a family of lines. Right, the same hypothesis is a **point** and `H` is the region those points fill. The dashed link is the whole figure: *one line on the left is one point on the right*. `f` is curved, so it is outside `H` in both pictures at once - that distance is what no amount of data removes."
  }, /*#__PURE__*/React.createElement("div", {
    ref: box
  }, /*#__PURE__*/React.createElement(FigureSvg, {
    viewBox: "0 0 764 372",
    maxWidth: 764,
    ariaLabel: "Left: nine labelled points on a square input space, five straight candidate boundaries, a curved dashed target and one bold chosen boundary. Right: an outer region of all functions containing an elliptical region H, with five dots for the same five hypotheses, the chosen one highlighted, and the target drawn as a dot outside H."
  }, /*#__PURE__*/React.createElement(Lines, {
    x: LX,
    y: 44,
    size: 12.5,
    fill: C.fg,
    lines: ["a hypothesis is a boundary on 𝒳"]
  }), /*#__PURE__*/React.createElement(Lines, {
    x: RX,
    y: 44,
    size: 12.5,
    fill: C.fg,
    lines: ["a hypothesis is a point in a space of functions"]
  }), /*#__PURE__*/React.createElement("rect", {
    x: LX,
    y: LY,
    width: LW,
    height: LH,
    fill: "none",
    stroke: C.border,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: LX + LW,
    y: LY + LH + 16,
    textAnchor: "end",
    fontSize: "11",
    fill: C.muted
  }, "\uD835\uDCB3"), /*#__PURE__*/React.createElement("g", {
    style: on(step, S_H)
  }, HYPS.map((h, i) => /*#__PURE__*/React.createElement("polyline", {
    key: i,
    points: line(h),
    fill: "none",
    stroke: C.muted,
    strokeWidth: "1.25",
    strokeOpacity: i === G ? 0 : 0.7
  }))), /*#__PURE__*/React.createElement("polyline", {
    points: fPath,
    fill: "none",
    stroke: C.neg,
    strokeWidth: "2",
    strokeDasharray: "6 4",
    style: on(step, S_F)
  }), /*#__PURE__*/React.createElement("text", {
    x: px(0.10),
    y: py(F(0.10)) - 10,
    textAnchor: "middle",
    fontSize: "13",
    fill: C.neg,
    fontStyle: "italic",
    style: on(step, S_F)
  }, "f"), /*#__PURE__*/React.createElement("polyline", {
    points: line(HYPS[G]),
    fill: "none",
    stroke: C.acc,
    strokeWidth: "2.75",
    style: on(step, S_G)
  }), /*#__PURE__*/React.createElement("text", {
    x: px(0.72),
    y: py(HYPS[G].a + 0.72 * HYPS[G].b) - 11,
    textAnchor: "middle",
    fontSize: "13",
    fill: C.acc,
    fontStyle: "italic",
    style: on(step, S_G)
  }, "g"), POS.map(([u, v], i) => /*#__PURE__*/React.createElement("circle", {
    key: "p" + i,
    cx: px(u),
    cy: py(v),
    r: "4.5",
    fill: C.pos
  })), NEG.map(([u, v], i) => /*#__PURE__*/React.createElement("circle", {
    key: "n" + i,
    cx: px(u),
    cy: py(v),
    r: "4.5",
    fill: C.neg
  })), /*#__PURE__*/React.createElement("text", {
    x: LX + 6,
    y: LY + 16,
    fontSize: "11",
    fill: C.muted
  }, "D \u2014 the sample"), /*#__PURE__*/React.createElement("rect", {
    x: RX,
    y: RY,
    width: RW,
    height: RH,
    rx: "14",
    fill: "none",
    stroke: C.border,
    strokeWidth: "1",
    strokeDasharray: "5 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: RX + 10,
    y: RY + 18,
    fontSize: "11",
    fill: C.muted
  }, "all functions \uD835\uDCB3 \u2192 \uD835\uDCB4"), /*#__PURE__*/React.createElement("g", {
    style: on(step, S_H)
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: EC[0],
    cy: EC[1],
    rx: ER[0],
    ry: ER[1],
    fill: C.acc,
    fillOpacity: "0.12",
    stroke: C.acc,
    strokeWidth: "1.5",
    strokeOpacity: "0.55"
  }), /*#__PURE__*/React.createElement(TeX, {
    x: EC[0] - ER[0] + 16,
    y: EC[1] - ER[1] + 22,
    w: 200,
    size: 12.5,
    fill: C.acc,
    tex: "\\mathbb H \\;-\\; \\text{the lines}"
  }), DOTS.map(([x, y], i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: x,
    cy: y,
    r: "4",
    fill: C.muted,
    fillOpacity: i === G ? 0 : 0.95
  }))), /*#__PURE__*/React.createElement("g", {
    style: on(step, S_F)
  }, /*#__PURE__*/React.createElement("circle", {
    cx: FDOT[0],
    cy: FDOT[1],
    r: "5",
    fill: C.neg
  }), /*#__PURE__*/React.createElement("text", {
    x: FDOT[0] - 10,
    y: FDOT[1] - 10,
    textAnchor: "end",
    fontSize: "12",
    fill: C.neg
  }, "f")), /*#__PURE__*/React.createElement("g", {
    style: on(step, S_G)
  }, /*#__PURE__*/React.createElement("line", {
    x1: DOTS[G][0],
    y1: DOTS[G][1],
    x2: FDOT[0],
    y2: FDOT[1],
    stroke: C.neg,
    strokeWidth: "1.25",
    strokeDasharray: "4 4",
    strokeOpacity: "0.8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: DOTS[G][0],
    cy: DOTS[G][1],
    r: "6",
    fill: C.acc
  }), /*#__PURE__*/React.createElement("text", {
    x: DOTS[G][0] + 10,
    y: DOTS[G][1] + 16,
    fontSize: "12",
    fill: C.acc
  }, "g"), /*#__PURE__*/React.createElement(TeX, {
    x: RX + RW,
    y: RY + RH + 20,
    w: 300,
    anchor: "end",
    size: 12,
    fill: C.neg,
    tex: "\\text{the gap no sample can close: } f \\notin \\mathbb H"
  })), /*#__PURE__*/React.createElement("g", {
    style: on(step, S_G)
  }, /*#__PURE__*/React.createElement("path", {
    d: `M ${px(0.99)} ${py(HYPS[G].a + HYPS[G].b)} C 380 ${py(HYPS[G].a + HYPS[G].b)}, 380 ${DOTS[G][1]}, ${DOTS[G][0] - 10} ${DOTS[G][1]}`,
    fill: "none",
    stroke: C.acc,
    strokeWidth: "1",
    strokeDasharray: "3 3",
    strokeOpacity: "0.7"
  })), /*#__PURE__*/React.createElement(TeX, {
    x: 382,
    y: 348,
    w: 720,
    anchor: "middle",
    size: 13.5,
    fill: C.fg,
    step: step,
    at: S_G,
    tex: "\\text{one line here} \\;=\\; \\text{one point there};\\quad \\text{choosing } g \\in \\mathbb H \\text{ is choosing a point, and } f \\text{ is not one of them}"
  }))));
}