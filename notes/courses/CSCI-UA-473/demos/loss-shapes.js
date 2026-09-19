/* AUTO-GENERATED from loss-shapes.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, Figure, PlotFigure } from "@course";

/* The three losses the lecture names, drawn (note 04, L4 slide 33).

   The slide lists them: binary 0-1, squared, cross-entropy. The note adds the
   sentence the slide does not — that 0-1 has zero gradient almost everywhere,
   which is WHY the list has three entries instead of one — and that sentence is a
   claim about a shape. A flat step next to a smooth surrogate settles it on sight.

   Two panels because the x axes are genuinely different quantities, and sharing
   one would be a lie: squared loss is a function of the residual h(x) − f(x),
   while 0-1 and cross-entropy are functions of the margin y·h(x). Drawing them on
   one axis is a common figure and a wrong one. */

const W = 344,
  H = 216;
const xent = z => Math.log(1 + Math.exp(-z)) / Math.LN2; // scaled to 1 at z = 0

function regression(p, C) {
  p.grid({
    yTicks: 4
  });
  p.axes({
    atY: 0,
    atX: 0
  });
  p.curve(r => r * r, {
    color: C.acc,
    width: 2.5
  });
  p.curve(r => Math.abs(r), {
    color: C.muted,
    width: 1.5,
    dash: [5, 4]
  });
  // The two expressions identify themselves; they are TeX labels in the layer above.
  p.labelAt("0", 0, 0, {
    dx: 4,
    dy: 13,
    color: C.muted,
    size: 10.5
  });
}
function classification(p, C) {
  p.grid({
    yTicks: 3
  });
  p.axes({
    atY: 0,
    atX: 0
  });
  // 0-1: a step, drawn as two segments so the jump is not a line of its own
  p.polyline([[-3, 1], [-0.02, 1]], {
    color: C.fg,
    width: 2.5
  });
  p.polyline([[0.02, 0], [3, 0]], {
    color: C.fg,
    width: 2.5
  });
  // the jump itself, so the discontinuity is visible rather than implied
  p.polyline([[0, 0], [0, 1]], {
    color: C.fg,
    width: 1.2,
    dash: [3, 3]
  });
  p.dot(0, 0, {
    color: C.fg,
    r: 3.5
  });
  p.curve(xent, {
    color: C.acc,
    width: 2.5
  });
  p.labelAt("cross-entropy", -2.85, 2.35, {
    color: C.acc,
    size: 11.5
  });
  p.labelAt("0-1 loss", -2.85, 1.28, {
    color: C.fg,
    size: 11.5
  });
  p.labelAt("flat: zero gradient", 2.92, 0.72, {
    color: C.muted,
    size: 11,
    align: "right"
  });
  p.labelAt("flat: zero gradient", -2.4, 0.62, {
    color: C.muted,
    size: 11
  });
  p.labelAt("0", 0, 0, {
    dx: 4,
    dy: 13,
    color: C.muted,
    size: 10.5
  });
  p.labelAt("wrong", -2.9, 0, {
    dy: 26,
    color: C.neg,
    size: 10.5
  });
  p.labelAt("right", 2.3, 0, {
    dy: 26,
    color: C.pos,
    size: 10.5
  });
}
export default function LossShapes() {
  const C = useClassColors();
  return /*#__PURE__*/React.createElement(Figure, {
    title: "The shapes of the three losses: squared loss as a function of the residual, and the 0-1 loss and cross-entropy as functions of the margin, showing that 0-1 is flat everywhere it is defined.",
    caption: "`E_in` in the Hoeffding story **is** the average 0-1 loss. Nobody optimizes it directly: it is flat either side of the threshold and discontinuous at it, so gradient descent has nothing to descend. Cross-entropy is the surrogate that keeps the same ordering and gives back a slope."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "18px",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 4px",
      fontSize: "12.5px",
      color: C.muted
    }
  }, "regression: a function of the residual"), /*#__PURE__*/React.createElement(PlotFigure, {
    width: W,
    height: H,
    draw: p => regression(p, C),
    plotOpts: {
      xDomain: [-2, 2],
      yDomain: [0, 4],
      pad: 30,
      padTop: 14,
      padRight: 16
    },
    labels: [{
      at: [0.42, 2.92],
      tex: "\\big(h(x) - f(x)\\big)^2",
      size: 12,
      color: C.acc
    }, {
      at: [-1.95, 0.2],
      tex: "|h(x) - f(x)|",
      size: 11.5,
      color: C.muted
    }, {
      at: [0, 0],
      dy: 38,
      anchor: "middle",
      tex: "h(x) - f(x)",
      size: 11.5,
      color: C.muted
    }],
    ariaLabel: "Squared loss, a parabola with its minimum at zero residual, above the V-shaped absolute loss."
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 4px",
      fontSize: "12.5px",
      color: C.muted
    }
  }, "classification: a function of the margin"), /*#__PURE__*/React.createElement(PlotFigure, {
    width: W,
    height: H,
    draw: p => classification(p, C),
    plotOpts: {
      xDomain: [-3, 3],
      yDomain: [0, 3],
      pad: 30,
      padTop: 14,
      padRight: 16
    },
    labels: [{
      at: [0, 0],
      dy: 38,
      anchor: "middle",
      tex: "y \\cdot h(x)",
      size: 11.5,
      color: C.muted
    }],
    ariaLabel: "The 0-1 loss as a step from one to zero at margin zero, and cross-entropy as a smooth decreasing curve passing through one at margin zero."
  }))));
}