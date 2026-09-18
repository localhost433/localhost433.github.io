import React from "react";
import { useClassColors, buttonStyle, readoutStyle, Canvas3D } from "@course";
import { Slider } from "@kit";
import { LIFT_POINTS, clipHalfPlane } from "@course/logic";

/* Bias absorption in 3D: 2D inputs lifted onto the shelf x0 = 1, separated by a
   plane through the origin whose normal is w = [b, w1, w2].

   The camera used to live here as a private proj/poly/seg/arrow set. It is now
   Scene3D in the course kit, shared with the least-squares projection figure in
   note 05 — same transform, so this draws exactly what it drew before. A point
   is [x1, x2, z]; the shelf is the z = 1 plane. */

const H = 340, SQ = 2;

function draw(s, w, C) {
  const wv = [w[1], w[2], w[0]];   // scene order: the bias becomes the height

  s.seg([-2.6, 0, 0], [2.6, 0, 0], { color: C.border, dash: [4, 4] });
  s.seg([0, -2.6, 0], [0, 2.6, 0], { color: C.border, dash: [4, 4] });
  s.arrow([0, 0, 0], [0, 0, 1.7], { color: C.border, width: 1 });
  s.text("x₁", [2.75, 0, 0], { color: C.muted });
  s.text("x₂", [0, 3.4, 0], { dx: 8, dy: -10, color: C.muted });
  s.text("x₀", [0, 0, 1.8], { dx: 4, color: C.muted });
  s.text("origin", [0, 0, 0], { dx: -14, dy: 20, align: "right", color: C.muted });

  const sq = [[-SQ, -SQ, 1], [SQ, -SQ, 1], [SQ, SQ, 1], [-SQ, SQ, 1]];
  const f = (p) => w[0] + w[1] * p[0] + w[2] * p[1];
  const nz = Math.hypot(...wv) > 1e-9;
  if (nz) {
    s.poly(clipHalfPlane(sq, f), { fill: C.pos, alpha: 0.2 });
    s.poly(clipHalfPlane(sq, (p) => -f(p)), { fill: C.neg, alpha: 0.2 });
  }
  s.poly(sq, { stroke: C.border, width: 0.8 });
  s.text("shelf x₀ = 1", [SQ, SQ, 1], { dx: 6, color: C.muted });

  if (nz) {
    // An orthonormal basis of the plane w·x = 0, so it can be drawn as a quad.
    const n = Math.hypot(...wv), u0 = Math.abs(wv[2]) < 0.9 * n ? [0, 0, 1] : [1, 0, 0];
    let u = [wv[1] * u0[2] - wv[2] * u0[1], wv[2] * u0[0] - wv[0] * u0[2], wv[0] * u0[1] - wv[1] * u0[0]];
    const un = Math.hypot(...u); u = u.map((v) => v / un);
    const nh = wv.map((v) => v / n);
    const v = [nh[1] * u[2] - nh[2] * u[1], nh[2] * u[0] - nh[0] * u[2], nh[0] * u[1] - nh[1] * u[0]];
    const R = 2.3, corner = (a, b) => [0, 1, 2].map((k) => R * (a * u[k] + b * v[k]));
    s.poly([corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)],
      { fill: C.acc, alpha: 0.13, stroke: C.acc });

    // Where that plane cuts the shelf: the decision boundary the 2D picture shows.
    const tr = [];
    for (let i = 0; i < 4; i++) {
      const a = sq[i], b = sq[(i + 1) % 4], fa = f(a), fb = f(b);
      if (fa === 0) tr.push(a);
      else if (fa * fb < 0) {
        const t = fa / (fa - fb);
        tr.push(a.map((x, k) => x + t * (b[k] - x)));
      }
    }
    if (tr.length >= 2) s.seg(tr[0], tr[1], { color: C.fg, width: 2.5 });
    const tip = nh.map((x) => 1.5 * x);
    s.arrow([0, 0, 0], tip, { color: C.acc, width: 2.5 });
    s.text("w", tip, { dx: 6, dy: -4, color: C.fg });
  }

  LIFT_POINTS.forEach((p) => {
    const at = [p.a, p.b, 1], bad = p.y * f([p.a, p.b]) <= 0;
    s.dot(at, { color: p.y > 0 ? C.pos : C.neg, r: p.y > 0 ? 5.5 : 5, shape: p.y > 0 ? "circle" : "square" });
    if (bad) s.ring(at, { color: C.fg });
  });
}

const sg = (v) => (v < 0 ? " − " : " + ") + Math.abs(v).toFixed(1);
const KNOBS = [["b", "b"], ["w1", "w₁"], ["w2", "w₂"]];

export default function BiasAbsorption() {
  const C = useClassColors();
  const [w, setW] = React.useState([0, 0.8, -1]);
  const [view, setView] = React.useState({ yaw: -1.05, pitch: 0.58 });

  const onSlider = (index, e) => {
    const value = Number(e.target.value);
    setW((old) => old.map((v, i) => (i === index ? value : v)));
  };

  const m = LIFT_POINTS.filter((p) => p.y * (w[0] + w[1] * p.a + w[2] * p.b) <= 0).length;
  return (
    <>
      <h2 className="sr-only">3D view of bias absorption: 2D inputs lifted onto the plane x0 = 1 and separated by a plane through the origin whose normal is w = [b, w1, w2].</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: C.fg }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start", marginBottom: "8px" }}>
          <div style={{ flex: "1", minWidth: "240px" }}>
            {KNOBS.map(([id, label], i) => (
              <div key={id} style={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr) 44px", gap: "8px",
                alignItems: "center", marginBottom: "6px", fontSize: "13px", color: C.muted }}>
                <label htmlFor={"bias-absorption-" + id}>{label}</label>
                <Slider id={"bias-absorption-" + id} min={-3} max={3} step={0.1} value={w[i]}
                  onChange={(e) => onSlider(i, e)} />
                <span style={{ color: C.fg, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", textAlign: "right" }}>{w[i].toFixed(1)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button type="button" onClick={() => setView({ yaw: -1.05, pitch: 0.58 })} style={buttonStyle(C)}>↻ Reset view</button>
            <button type="button" onClick={() => setView({ yaw: 0, pitch: Math.PI / 2 })} style={buttonStyle(C)}>View from above</button>
          </div>
        </div>
        <Canvas3D height={H} interactive view={view} onView={setView}
          sceneOpts={{ cy: H * 0.54 }}
          ariaLabel="3D lifted data, shelf, and separating plane"
          draw={(s) => draw(s, w, C)} />
        <p style={readoutStyle(C)}>
          3D plane through origin: {w[0].toFixed(1)}·x₀{sg(w[1])}·x₁{sg(w[2])}·x₂ = 0<br />
          trace on the shelf (x₀ = 1): {w[1].toFixed(1)}·x₁{sg(w[2])}·x₂{sg(w[0])} = 0<br />
          misclassified on the shelf: {m} of {LIFT_POINTS.length}{Math.abs(w[0]) < 1e-9 ? " (b = 0: the trace passes through (x₁, x₂) = (0, 0))" : ""}
        </p>
      </div>
    </>
  );
}
