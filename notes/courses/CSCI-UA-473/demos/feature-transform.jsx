import React from "react";
import { useClassColors, Figure, PlotFigure } from "@course";
import { rng } from "@course/logic";

/* The circle that becomes a line (note 07, L7 slides 21-22, from LFD).

   The same points twice. Left, in x-space, the classes are split by the circle
   x1^2 + x2^2 = 0.6 and no line separates them. Right, after z = Phi(x) =
   (1, x1^2, x2^2), the circle is the line z1 + z2 = 0.6 and a linear classifier
   does the job. The weights are the same three numbers in both panels,
   w~ = (-0.6, 1, 1): only the coordinates changed.

   Points are sampled away from the boundary (|r^2 - 0.6| > 0.08), as in LFD's
   figure, so the separation is visible at a glance. Crosses are +1 (outside), rings
   are -1 (inside): shape carries the class as well as colour. */

// H - padTop - pad = W - pad - padRight in both panels, so one unit is as tall as it is
// wide and the circle is drawn as a circle.
const R2 = 0.6, W = 300, H = 300;

const POINTS = (() => {
  const r = rng(12), pts = [];
  while (pts.length < 26) {
    const x1 = 2 * r() - 1, x2 = 2 * r() - 1, q = x1 * x1 + x2 * x2;
    if (Math.abs(q - R2) < 0.08) continue;
    pts.push({ x1, x2, y: q > R2 ? 1 : -1 });
  }
  return pts;
})();

function marks(p, C, coords) {
  const g = p.g;
  for (const pt of POINTS) {
    const [u, v] = coords(pt);
    const px = p.x(u), py = p.y(v);
    if (pt.y > 0) {
      g.strokeStyle = C.pos; g.lineWidth = 2.2; g.beginPath();
      g.moveTo(px - 4, py - 4); g.lineTo(px + 4, py + 4); g.moveTo(px + 4, py - 4); g.lineTo(px - 4, py + 4); g.stroke();
    } else {
      g.strokeStyle = C.neg; g.lineWidth = 2.2; g.beginPath(); g.arc(px, py, 4.2, 0, 2 * Math.PI); g.stroke();
    }
  }
}

function xSpace(p, C) {
  p.grid({ yTicks: 4, xTicks: 4, edges: false }).axes({ atY: 0, atX: 0 });
  const g = p.g, rr = Math.sqrt(R2);
  g.strokeStyle = C.fg; g.lineWidth = 2; g.beginPath();
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * 2 * Math.PI, px = p.x(rr * Math.cos(a)), py = p.y(rr * Math.sin(a));
    i ? g.lineTo(px, py) : g.moveTo(px, py);
  }
  g.stroke();
  marks(p, C, (pt) => [pt.x1, pt.x2]);
  p.label("x1", p.right, p.y(0) + 14, { align: "right" });
  p.label("x2", p.x(0) + 6, p.top + 10);
}

function zSpace(p, C) {
  p.grid({ yTicks: 4, xTicks: 4, edges: false }).axes();
  p.polyline([[0, R2], [R2, 0]], { color: C.fg, width: 2 });
  marks(p, C, (pt) => [pt.x1 * pt.x1, pt.x2 * pt.x2]);
  p.label("z1 = x1²", p.right, p.bottom + 22, { align: "right" });
  p.label("z2 = x2²", p.left + 6, p.top + 10);
  for (const v of [0, 0.5]) p.labelAt(String(v), v, 0, { dy: 13, align: "center", size: 10 });
}

export default function FeatureTransform() {
  const C = useClassColors();
  return (
    <Figure
      title="The same labelled points before and after the transform z equals one, x1 squared, x2 squared: a circular boundary in x-space becomes a straight line in z-space."
      caption="Crosses are **+1** (outside the circle), rings are **−1**. The classifier is `sign(−0.6 + x1² + x2²)` in both panels. On the left it is a circle; on the right, with the same weights `(−0.6, 1, 1)` applied to `z`, it is the line `z1 + z2 = 0.6`. Squaring folds each axis onto `[0, 1]`, so the four quadrants land on top of each other and the inside of the circle collects near the origin."
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", justifyContent: "center" }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "12.5px", color: C.muted }}>x-space: the circle x1² + x2² = 0.6</p>
          <PlotFigure width={W} height={H} draw={(p) => xSpace(p, C)}
            ariaLabel="x-space: rings inside a circle of radius root 0.6, crosses outside it"
            plotOpts={{ xDomain: [-1.05, 1.05], yDomain: [-1.05, 1.05], pad: 22, padTop: 10, padRight: 10 }} />
        </div>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "12.5px", color: C.muted }}>z-space: the line z1 + z2 = 0.6</p>
          <PlotFigure width={W} height={H} draw={(p) => zSpace(p, C)}
            ariaLabel="z-space: the same points after squaring each coordinate, rings near the origin below the line z1 plus z2 equals 0.6, crosses above it"
            plotOpts={{ xDomain: [0, 1.02], yDomain: [0, 1.02], pad: 30, padTop: 10, padRight: 10 }} />
        </div>
      </div>
    </Figure>
  );
}
