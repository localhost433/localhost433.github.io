import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";

/* The unit balls of the Lp norms L2 introduces. Worth a picture because the shapes,
   not the formulas, are what later arguments rest on: L5's lasso gets its sparsity
   from the corners of the p = 1 diamond, and nothing else about the penalty matters
   for that conclusion.

   The slider runs all the way to p = ∞ rather than stopping at 6, because the square
   is the other endpoint of the story the corners tell: p = 1 has corners on the axes
   (a corner is a zero coefficient), p = 2 has none, p = ∞ has them off the axes,
   where they buy nothing. Sweeping in p directly cannot reach ∞, so the control is
   linear in 1/p instead — s = 0 is p = ∞, s = 1 is p = 1, s = 2 is p = 1/2 — which
   also spaces the interesting range evenly instead of crushing p = 1 and p = 2 into
   the first sixth of the track. */

const W = 420, R = 1.5;

// s = 1/p, so the control reaches the endpoint that p itself cannot.
const S_MIN = 0, S_MAX = 2;
const pOf = (s) => (s <= 0 ? Infinity : 1 / s);
const sOf = (p) => (p === Infinity ? 0 : 1 / p);

class BallPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, { width: W, height: W, pad: 0, padTop: 0, padRight: 0,
      xDomain: [-R, R], yDomain: [-R, R], colors });
  }

  /* |w1|^p + |w2|^p = 1, traced by sweeping the angle and solving for the radius.
     At p = ∞ that limit is max(|w1|, |w2|) = 1, the square, which the same sweep
     gives as r = 1/max(|cos|, |sin|) — worth writing out rather than approximating
     with a large finite p, where `Math.pow` underflows to zero and the curve
     collapses onto the origin. */
  ball(p, { color, width = 2, fill = 0 }) {
    const g = this.g;
    const pts = [];
    for (let i = 0; i <= 720; i++) {
      const t = (i / 720) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t);
      let r;
      if (p === Infinity) {
        r = 1 / Math.max(Math.abs(c), Math.abs(s));
      } else {
        const denom = Math.pow(Math.abs(c), p) + Math.pow(Math.abs(s), p);
        r = denom === 0 ? 0 : Math.pow(denom, -1 / p);
      }
      pts.push([r * c, r * s]);
    }
    if (fill) {
      g.fillStyle = color; g.globalAlpha = fill;
      g.beginPath();
      pts.forEach(([a, b], i) => (i ? g.lineTo(this.x(a), this.y(b)) : g.moveTo(this.x(a), this.y(b))));
      g.closePath(); g.fill(); g.globalAlpha = 1;
    }
    this.polyline(pts, { color, width });
    return this;
  }

  render({ p }) {
    const C = this.C;
    /* Interior lines only. The outermost grid line on each side used to close into a
       rectangle, and a rectangle floating in a card that is wider than the canvas is
       what read as an inconsistent background rather than as a plot. */
    this.grid({ xTicks: 4, yTicks: 4, edges: false });
    this.axes({ atY: 0, atX: 0 });
    // the two taught cases stay on screen as reference while p sweeps between them
    this.ball(1, { color: C.muted, width: 1.25 });
    this.ball(2, { color: C.muted, width: 1.25 });
    this.ball(p, { color: C.acc, width: 2.5, fill: 0.16 });
    this.label("w₁", this.right - 4, this.y(0) - 7, { align: "right" });
    this.label("w₂", this.x(0) + 7, this.top + 12);
    return this;
  }
}

const NAME = (p) => (p === Infinity ? "L∞ — the square; every point of the boundary is a coordinate at its maximum"
  : Math.abs(p - 1) < 0.02 ? "L₁ — the lasso's diamond"
  : Math.abs(p - 2) < 0.02 ? "L₂ — ridge's circle"
  : p < 1 ? "p < 1 — non-convex, corners sharper still"
  : p > 2 ? "p > 2 — rounder, the corners sliding off the axes towards the square"
  : "between the two taught cases");

const SHOW = (p) => (p === Infinity ? "∞" : p.toFixed(2));

export default function App() {
  const C = useClassColors();
  const [s, setS] = React.useState(sOf(1));
  const ref = React.useRef(null);
  const p = pOf(s);

  React.useEffect(() => {
    if (ref.current) new BallPlot(ref.current, C).render({ p });
  });

  const preset = (target) => (
    <button type="button" key={String(target)} style={buttonStyle(C, p === target)}
      onClick={() => setS(sOf(target))}>
      p = {target === Infinity ? "∞" : target}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: C.fg }}>
      <h2 className="sr-only">Unit balls of the Lp norms, sweeping p between one half and infinity, with the L1 and L2 balls held as reference.</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={labelStyle(C)}>1/p</span>
        {/* reversed: dragging right raises p, so the track reads 1/2 … 1 … 2 … ∞ */}
        <input type="range" min={S_MIN} max={S_MAX} step="0.005" value={S_MAX - s}
          onChange={(e) => setS(S_MAX - +e.target.value)}
          aria-label="Norm exponent p, controlled through its reciprocal"
          style={{ flex: "1 1 150px", minWidth: "130px", accentColor: C.acc, direction: "ltr" }} />
        <span style={{ ...readoutStyle(C), margin: 0, minWidth: "5em" }}>p = {SHOW(p)}</span>
        {[1, 2, Infinity].map(preset)}
      </div>
      <canvas ref={ref} style={{ width: "100%", maxWidth: W, aspectRatio: "1 / 1", alignSelf: "center" }}
        aria-label={`Unit ball of the L${SHOW(p)} norm`} />
      <p style={{ ...readoutStyle(C), margin: 0 }}>{'{'} w : ‖w‖ₚ ≤ 1 {'}'}   —   {NAME(p)}</p>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>
        Every point on a coloured curve is exactly one unit away from the origin under
        that norm; the two grey outlines are p = 1 and p = 2, held for reference. The
        feature worth carrying into L5 is the corner. At p = 1 the ball touches each axis
        at a sharp point, and a point on an axis is a coefficient that is exactly zero.
        At p = 2 the boundary is smooth everywhere, so there is no reason for a solution
        to land on an axis rather than beside it. At p = ∞ the corners are back, but at
        the diagonals, where both coefficients are equal and neither is zero — which is
        why the endpoint that produces sparsity is p = 1 and not simply "a pointy ball".
      </p>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>
        ‖w‖<sub>∞</sub> = max<sub>i</sub> |w<sub>i</sub>|, the largest coordinate. This is a
        norm on a <em>vector</em>; the largest singular value is the operator norm of a
        <em> matrix</em>, a different object that happens to share the "sup over something"
        definition.
      </p>
    </div>
  );
}
