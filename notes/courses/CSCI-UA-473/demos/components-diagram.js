/* AUTO-GENERATED from components-diagram.jsx by `npm run build:artifacts`. Do not edit. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { useClassColors, Figure, FigureSvg, Box, Lines, Arrow, TeX, port, useReveal, useTypeset } from "@course";

/* The components-of-a-learning-system diagram (note 03, L3 slides 7-13).

   The deck draws this figure six times, adding one box per click: target, data,
   i.i.d. annotation, hypothesis set, algorithm, final hypothesis. That build order
   IS the lesson — it is why the note calls the figure "built up incrementally" —
   so this replays it rather than showing the end state. `static` in the note means
   no controls, not no motion; useReveal starts on scroll-in and honours
   prefers-reduced-motion by jumping to the last step.

   One addition the slide does not make, and the note's prose does: a dashed
   boundary around what 𝒜 actually sees. The lecturer says it out loud; nothing in
   the picture shows that f sits outside the algorithm's world.

   Each node's symbol line is real TeX rather than Unicode: 𝕏, 𝕐, ℍ and 𝒜 come from
   three different Unicode blocks and a sans-serif stack resolves them from three
   different fallback fonts, which drew ℍ as a narrow "IH". */

const N = {
  f: {
    x: 150,
    y: 14,
    w: 270,
    h: 58
  },
  D: {
    x: 96,
    y: 124,
    w: 378,
    h: 62
  },
  A: {
    x: 80,
    y: 238,
    w: 400,
    h: 76
  },
  H: {
    x: 170,
    y: 376,
    w: 220,
    h: 58
  },
  g: {
    x: 530,
    y: 248,
    w: 176,
    h: 62
  }
};
const STEPS = 7;
export default function ComponentsDiagram() {
  const C = useClassColors();
  const box = React.useRef(null);
  const step = useReveal(box, STEPS);
  useTypeset([C, step]);
  const cap = {
    size: 11.5,
    fill: C.acc
  };
  const fade = at => ({
    transition: "opacity .45s ease",
    opacity: step >= at ? 1 : 0
  });
  const Node = ({
    n,
    label,
    tex,
    at,
    tone,
    texSize = 16,
    shape
  }) => {
    const fg = tone === "solid" ? "#fff" : C.fg;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Box, {
      x: n.x,
      y: n.y,
      w: n.w,
      h: n.h,
      shape: shape,
      C: C,
      tone: tone,
      step: step,
      at: at
    }), /*#__PURE__*/React.createElement("text", {
      x: n.x + n.w / 2,
      y: n.y + 22,
      textAnchor: "middle",
      fontSize: "13",
      fill: fg,
      style: fade(at)
    }, label), /*#__PURE__*/React.createElement(TeX, {
      x: n.x + n.w / 2,
      y: n.y + n.h - 12,
      w: n.w,
      anchor: "middle",
      size: texSize,
      fill: fg,
      tex: tex,
      step: step,
      at: at
    }));
  };
  return /*#__PURE__*/React.createElement(Figure, {
    title: "The components of a learning system: the unknown target f, the training data D drawn from it, the hypothesis set H, the learning algorithm A that sees only D and H, and the final hypothesis g that approximates f.",
    caption: "Built in the order the lecture builds it. **The algorithm never sees the target** \u2014 everything it can know about `f` arrives through the `N` samples in `D`, which is the work the i.i.d. assumption is doing."
  }, /*#__PURE__*/React.createElement("div", {
    ref: box
  }, /*#__PURE__*/React.createElement(FigureSvg, {
    viewBox: "0 0 790 476",
    maxWidth: 760,
    ariaLabel: "Block diagram: unknown target function f maps X to Y; training data D is drawn from it; the learning algorithm A takes D and the hypothesis set H and outputs the final hypothesis g, which approximates f. A dashed boundary marks D, H and A as the only things the algorithm can see."
  }, /*#__PURE__*/React.createElement("g", {
    style: fade(6)
  }, /*#__PURE__*/React.createElement("rect", {
    x: 62,
    y: 110,
    width: 424,
    height: 334,
    rx: 12,
    fill: C.acc,
    fillOpacity: 0.05,
    stroke: C.acc,
    strokeWidth: "1.2",
    strokeDasharray: "7 5"
  }), /*#__PURE__*/React.createElement("text", {
    x: 66,
    y: 460,
    fontSize: "11.5",
    fill: C.acc
  }, "everything the algorithm can see \u2014 the target f is outside it")), /*#__PURE__*/React.createElement(Node, {
    n: N.f,
    at: 0,
    label: "Unknown Target Function",
    tex: "f : \\mathcal X \\to \\mathcal Y"
  }), /*#__PURE__*/React.createElement(Lines, _extends({
    x: 436,
    y: 30,
    step: step,
    at: 0
  }, cap, {
    lines: ["(true relationship between a customer's", "characteristics and what the bank can make", "from them: the ideal credit approval formula)"]
  })), /*#__PURE__*/React.createElement(Arrow, {
    from: port(N.f, "bottom"),
    to: port(N.D, "top"),
    C: C,
    step: step,
    at: 1
  }), /*#__PURE__*/React.createElement(Node, {
    n: N.D,
    at: 1,
    label: "Training Data",
    texSize: 15,
    tex: "D = \\{(x^1, y^1),\\, (x^2, y^2),\\, \\dots,\\, (x^N, y^N)\\}"
  }), /*#__PURE__*/React.createElement(Lines, _extends({
    x: 500,
    y: 138,
    step: step,
    at: 1
  }, cap, {
    lines: ["(historical records of current", "customers: the only window", "onto the ideal formula)"]
  })), /*#__PURE__*/React.createElement(Lines, {
    x: 6,
    y: 24,
    step: step,
    at: 2,
    size: 11,
    fill: C.neg,
    lines: ["Data points are", "typically assumed", "to be Independent", "and Identically", "Distributed (i.i.d.)"]
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: [80, 84],
    to: [142, 128],
    C: C,
    tone: "neg",
    step: step,
    at: 2,
    width: 1.3
  }), /*#__PURE__*/React.createElement(Node, {
    n: N.H,
    at: 3,
    label: "Hypothesis Set",
    tex: "\\mathbb H",
    texSize: 18
  }), /*#__PURE__*/React.createElement(Lines, _extends({
    x: 500,
    y: 386,
    step: step,
    at: 3
  }, cap, {
    lines: ["(the family of functions believed to", "best approximate f: the set of", "candidate predictive functions)"]
  })), /*#__PURE__*/React.createElement(Arrow, {
    from: port(N.D, "bottom"),
    to: port(N.A, "top"),
    C: C,
    step: step,
    at: 4
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: port(N.H, "top"),
    to: port(N.A, "bottom"),
    C: C,
    step: step,
    at: 4
  }), /*#__PURE__*/React.createElement(Node, {
    n: N.A,
    at: 4,
    label: "Learning Algorithm",
    shape: "ellipse",
    tone: "solid",
    tex: "\\mathcal A",
    texSize: 18
  }), /*#__PURE__*/React.createElement(Arrow, {
    from: port(N.A, "right"),
    to: port(N.g, "left"),
    C: C,
    step: step,
    at: 5
  }), /*#__PURE__*/React.createElement(Node, {
    n: N.g,
    at: 5,
    label: "Final Hypothesis",
    tex: "g \\approx f"
  }), /*#__PURE__*/React.createElement(Lines, _extends({
    x: 618,
    y: 330,
    step: step,
    at: 5
  }, cap, {
    anchor: "middle",
    lines: ["(the learned credit", "approval function)"]
  })))));
}