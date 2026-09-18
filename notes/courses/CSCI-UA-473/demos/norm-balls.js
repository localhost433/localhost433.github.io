/* AUTO-GENERATED from norm-balls.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";

/* The unit balls of the Lp norms L2 introduces. Worth a picture because the shapes,
   not the formulas, are what later arguments rest on: L5's lasso gets its sparsity
   from the corners of the p = 1 diamond, and nothing else about the penalty matters
   for that conclusion. */

const W = 360,
  R = 1.45;
class BallPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, {
      width: W,
      height: W,
      pad: 0,
      padTop: 0,
      padRight: 0,
      xDomain: [-R, R],
      yDomain: [-R, R],
      colors
    });
  }

  // |w1|^p + |w2|^p = 1, traced by sweeping the angle and solving for the radius.
  ball(p, {
    color,
    width = 2,
    fill = 0
  }) {
    const g = this.g;
    const pts = [];
    for (let i = 0; i <= 720; i++) {
      const t = i / 720 * 2 * Math.PI,
        c = Math.cos(t),
        s = Math.sin(t);
      const denom = Math.pow(Math.abs(c), p) + Math.pow(Math.abs(s), p);
      const r = denom === 0 ? 0 : Math.pow(denom, -1 / p);
      pts.push([r * c, r * s]);
    }
    if (fill) {
      g.fillStyle = color;
      g.globalAlpha = fill;
      g.beginPath();
      pts.forEach(([a, b], i) => i ? g.lineTo(this.x(a), this.y(b)) : g.moveTo(this.x(a), this.y(b)));
      g.closePath();
      g.fill();
      g.globalAlpha = 1;
    }
    this.polyline(pts, {
      color,
      width
    });
    return this;
  }
  render({
    p
  }) {
    const C = this.C;
    this.grid({
      xTicks: 4,
      yTicks: 4
    });
    this.axes({
      atY: 0,
      atX: 0
    });
    // the two taught cases stay on screen as reference while p sweeps between them
    this.ball(1, {
      color: C.muted,
      width: 1.25
    });
    this.ball(2, {
      color: C.muted,
      width: 1.25
    });
    this.ball(p, {
      color: C.acc,
      width: 2.5,
      fill: 0.16
    });
    this.label("w₁", this.right - 4, this.y(0) - 7, {
      align: "right"
    });
    this.label("w₂", this.x(0) + 7, this.top + 12);
    return this;
  }
}
const NAME = p => Math.abs(p - 1) < 0.02 ? "L₁ — the lasso's diamond" : Math.abs(p - 2) < 0.02 ? "L₂ — ridge's circle" : p < 1 ? "p < 1 — non-convex, corners sharper still" : p > 2 ? "p > 2 — rounder, heading for a square at p = ∞" : "between the two taught cases";
export default function App() {
  const C = useClassColors();
  const [p, setP] = React.useState(1);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) new BallPlot(ref.current, C).render({
      p
    });
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "Unit balls of the Lp norms, sweeping p between one half and six, with the L1 and L2 balls held as reference."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "p"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0.5",
    max: "6",
    step: "0.05",
    value: p,
    onChange: e => setP(+e.target.value),
    "aria-label": "Norm exponent p",
    style: {
      flex: "1 1 150px",
      minWidth: "130px",
      accentColor: C.acc
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...readoutStyle(C),
      margin: 0,
      minWidth: "4em"
    }
  }, "p = ", p.toFixed(2)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, Math.abs(p - 1) < 0.02),
    onClick: () => setP(1)
  }, "p = 1"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, Math.abs(p - 2) < 0.02),
    onClick: () => setP(2)
  }, "p = 2")), /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    style: {
      width: "100%",
      maxWidth: W,
      aspectRatio: "1 / 1"
    },
    "aria-label": `Unit ball of the L${p.toFixed(2)} norm`
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, '{', " w : \u2016w\u2016\u209A \u2264 1 ", '}', "   \u2014   ", NAME(p)), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.5
    }
  }, "Every point on a coloured curve is exactly one unit away from the origin under that norm; the two grey outlines are p = 1 and p = 2, held for reference. The feature worth carrying into L5 is the corner. At p = 1 the ball touches each axis at a sharp point, and a point on an axis is a coefficient that is exactly zero. At p = 2 the boundary is smooth everywhere, so there is no reason for a solution to land on an axis rather than beside it."));
}