/* AUTO-GENERATED from ridge-vs-lasso.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { lassoFit, ridgeFit, ellipseLoss, l1norm, l2norm } from "@course/logic";

/* The closing slide of FML05, made to move. Same elliptical error contours in both
   panels, an L1 diamond on the left and an L2 circle on the right, and one budget
   slider driving both. The claim to check by dragging: the diamond's corner captures
   the solution over a whole range of budgets (w1 pinned at exactly 0), while the
   circle only ever squeezes the solution toward the origin without reaching an axis. */

const S = 320; // canvas edge, CSS px
const R = 2.6; // half-width of the (w1, w2) window
const WHAT = [1.9, 1.35];
const A = [1, 0.85, 1.2]; // [a11, a12, a22]; correlated features tilt the bowl

// Eigen-decomposition of the symmetric 2x2 [a b; b c], for drawing level sets.
function eig(A) {
  const [a, b, c] = A;
  const tr = a + c,
    det = a * c - b * b;
  const gap = Math.sqrt(Math.max(0, tr * tr - 4 * det));
  const l1 = (tr + gap) / 2,
    l2 = (tr - gap) / 2;
  let v1 = Math.abs(b) > 1e-12 ? [b, l1 - a] : [1, 0];
  const n1 = Math.hypot(v1[0], v1[1]);
  v1 = [v1[0] / n1, v1[1] / n1];
  return {
    l1,
    l2,
    v1,
    v2: [-v1[1], v1[0]]
  };
}
const E = eig(A);

/* Was a hand-rolled draw() with its own X()/Y() transform, its own axis weights and
   unhaloed labels, so it drifted from every other figure in the course. On Plot it
   inherits the shared coordinate system and chrome. */
class ConstraintPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, {
      width: S,
      height: S,
      pad: 0,
      padTop: 0,
      padRight: 0,
      xDomain: [-R, R],
      yDomain: [-R, R],
      colors
    });
  }
  contour(level, {
    dash = null,
    alpha = 1,
    width = 1
  } = {}) {
    const r1 = Math.sqrt(level / E.l1),
      r2 = Math.sqrt(level / E.l2);
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120 * 2 * Math.PI,
        ct = Math.cos(t) * r1,
        st = Math.sin(t) * r2;
      pts.push([WHAT[0] + ct * E.v1[0] + st * E.v2[0], WHAT[1] + ct * E.v1[1] + st * E.v2[1]]);
    }
    this.g.globalAlpha = alpha;
    this.polyline(pts.concat([pts[0]]), {
      color: this.C.neg,
      width,
      dash
    });
    this.g.globalAlpha = 1;
    return this;
  }
  feasible(kind, t) {
    const g = this.g;
    g.fillStyle = this.C.acc;
    g.globalAlpha = 0.22;
    g.beginPath();
    if (kind === "l1") {
      g.moveTo(this.x(t), this.y(0));
      g.lineTo(this.x(0), this.y(t));
      g.lineTo(this.x(-t), this.y(0));
      g.lineTo(this.x(0), this.y(-t));
    } else {
      g.arc(this.x(0), this.y(0), t / (2 * R) * S, 0, 2 * Math.PI);
    }
    g.closePath();
    g.fill();
    g.globalAlpha = 1;
    g.strokeStyle = this.C.acc;
    g.lineWidth = 1.5;
    g.stroke();
    return this;
  }
  render({
    kind,
    t,
    sol
  }) {
    const C = this.C;
    this.feasible(kind, t);
    this.axes({
      atY: 0,
      atX: 0
    });
    [0.25, 0.9, 2.0, 3.6].forEach(l => this.contour(l, {
      alpha: 0.5
    }));
    if (sol.active) this.contour(ellipseLoss(A, WHAT, sol.w), {
      dash: [4, 3],
      width: 1.6
    });
    this.dot(WHAT[0], WHAT[1], {
      color: C.muted,
      r: 4
    });
    this.labelAt("OLS", WHAT[0], WHAT[1], {
      dx: 8,
      dy: -6,
      color: C.fg,
      size: 12
    });
    this.dot(sol.w[0], sol.w[1], {
      color: C.pos,
      r: 6,
      ring: sol.zeros > 0 ? C.pos : null,
      ringWidth: 2
    });
    this.label("w\u2081", this.right - 6, this.y(0) - 7, {
      align: "right"
    });
    this.label("w\u2082", this.x(0) + 7, this.top + 14);
    return this;
  }
}
function Panel({
  kind,
  title,
  t,
  C
}) {
  const ref = React.useRef(null);
  const sol = kind === "l1" ? lassoFit(A, WHAT, t) : ridgeFit(A, WHAT, t);
  React.useEffect(() => {
    if (ref.current) new ConstraintPlot(ref.current, C).render({
      kind,
      t,
      sol
    });
  });
  const zero = sol.zeros > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      flex: "1 1 300px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle(C),
      fontWeight: 600,
      color: C.fg
    }
  }, title), /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    style: {
      width: "100%",
      maxWidth: S,
      aspectRatio: "1 / 1"
    },
    "aria-label": `${title}: feasible region with the constrained solution at w1 ${sol.w[0].toFixed(2)}, w2 ${sol.w[1].toFixed(2)}`
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, "w\u2081 = ", sol.w[0].toFixed(3), "   w\u2082 = ", sol.w[1].toFixed(3)), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      color: zero ? C.pos : C.muted
    }
  }, sol.active ? zero ? "w₁ is exactly 0 - the feature is dropped" : "both coefficients nonzero" : "budget not binding - this is the OLS solution"));
}
export default function App() {
  const C = useClassColors();
  const [t, setT] = React.useState(1.0);
  const preset = v => () => setT(v);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "budget t"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0.15",
    max: "3.4",
    step: "0.01",
    value: t,
    onChange: e => setT(+e.target.value),
    "aria-label": "Constraint budget t",
    style: {
      flex: "1 1 160px",
      minWidth: "140px",
      accentColor: C.acc
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...readoutStyle(C),
      margin: 0,
      minWidth: "4.5em"
    }
  }, "t = ", t.toFixed(2)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: preset(0.45)
  }, "tight"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: preset(1.0)
  }, "moderate"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: preset(3.3)
  }, "slack")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    kind: "l1",
    title: "Lasso - L\u2081, |w\u2081| + |w\u2082| \u2264 t",
    t: t,
    C: C
  }), /*#__PURE__*/React.createElement(Panel, {
    kind: "l2",
    title: "Ridge - L\u2082, \u2016w\u2016\u2082 \u2264 t",
    t: t,
    C: C
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.5
    }
  }, "Both panels share the same error contours and the same OLS solution; only the shape of the shaded feasible set differs. Drag t down and watch where each solution ends up: the diamond has corners on the axes and the contour reaches one first, so the lasso sits at w\u2081 = 0 across a whole range of budgets. The circle has no corners, so the ridge solution slides around it and approaches the origin without ever landing on an axis."));
}