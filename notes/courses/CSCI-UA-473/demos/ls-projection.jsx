import React from "react";
import { useClassColors, Figure, Canvas3D } from "@course";

/* Least squares as an orthogonal projection (note 05, L5 slide 15; the figure is
   ESL 3.2, which the deck reproduces flat).

   Flat is the problem. The whole content of the picture is that the residual
   leaves the plane at a right angle, and a fixed 2D projection of a 3D right
   angle is exactly the thing a reader cannot verify by looking. Here it is drawn
   with the shared Scene3D camera and a slow sway: a few degrees of parallax, and
   which vector is in front of the plane stops being a guess. Reduced motion pins
   it at the canonical pose, which is the slide's pose.

   Scene coordinates: the column space is the z = 0 plane, so "leaves the plane"
   is literally "has a z component". */

const X1 = [2.7, 0, 0];
const X2 = [0.9, 2.1, 0];
const A = 0.52, B = 0.62;                       // the fitted weights ŵ
const YH = [0, 1, 2].map((i) => A * X1[i] + B * X2[i]);
const Y = [YH[0], YH[1], 2.05];

function draw(s, C) {
  // the column space of X: every Xw, and nothing else, lives here
  s.poly([[-1.1, -1.0, 0], [4.0, -1.0, 0], [4.0, 3.2, 0], [-1.1, 3.2, 0]],
    { fill: C.acc, alpha: 0.13, stroke: C.acc, width: 1 });
  // Prose stays on the canvas in the UI face; every symbol is a TeX label above it.
  s.text("the column space of X — every Xw lives here", [4.0, -1.0, 0],
    { dx: -4, dy: 24, align: "right", size: 12, color: C.acc });

  // the two columns, and ŷ written as a combination of them
  // ŷ written head-to-tail as ŵ₁x₁ + ŵ₂x₂, so "in the plane" reads as "a
  // combination of the columns" rather than as a claim about the picture.
  s.seg([0, 0, 0], [A * X1[0], A * X1[1], 0], { color: C.muted, width: 1.5, dash: [4, 3] });
  s.seg([A * X1[0], A * X1[1], 0], YH, { color: C.muted, width: 1.5, dash: [4, 3] });
  s.arrow([0, 0, 0], X1, { color: C.fg, width: 2 });
  s.arrow([0, 0, 0], X2, { color: C.fg, width: 2 });

  // y, its projection, and the residual that connects them
  s.seg(YH, Y, { color: C.neg, width: 1.6, dash: [5, 4] });
  s.rightAngle(YH, [0, 0, 1], X1, { size: 0.3, color: C.fg });
  s.arrow([0, 0, 0], Y, { color: C.neg, width: 2.4 });
  s.arrow([0, 0, 0], YH, { color: C.pos, width: 2.4 });
  s.dot([0, 0, 0], { color: C.fg, r: 3 });
}

/* Scene-space anchors for the TeX labels; Canvas3D projects them every frame, so
   they follow their vectors through the sway instead of drifting off them. */
const LABELS = (C) => [
  { p: X1, tex: "x_1", dx: 8, dy: 14, size: 14, color: C.fg },
  { p: X2, tex: "x_2", dx: -2, dy: -6, size: 14, color: C.fg },
  { p: Y, tex: "y", dx: 9, dy: -2, size: 15, color: C.neg },
  { p: YH, tex: "\\hat y = X\\hat w", dx: 10, dy: 24, size: 14, color: C.pos },
  { p: [YH[0], YH[1], (Y[2] + YH[2]) / 2], tex: "y - \\hat y", dx: 11, dy: 6, size: 13, color: C.neg },
];

export default function LsProjection() {
  const C = useClassColors();
  return (
    <Figure
      title="Least squares in three dimensions: the two columns of X span a plane, y stands off it, and the fitted prediction is the point of the plane directly below y, with the residual meeting the plane at a right angle."
      caption="The model can only produce points **in the plane** — that is what `ŷ = Xw` means. Least squares picks the one whose residual is orthogonal to every column, which is the normal equations `Xᵀ(y − ŷ) = 0` read as a picture."
    >
      <Canvas3D height={310} sway={{ amp: 0.30, seconds: 14 }} labels={LABELS(C)}
        initialView={{ yaw: -0.72, pitch: 0.42 }} sceneOpts={{ center: [1.45, 1.1, 0.55], scale: 62, cy: 152 }}
        ariaLabel="A tilted plane spanned by the vectors x1 and x2; the vector y rises out of the plane; the vector y-hat lies in it directly beneath y; a dashed segment joins y-hat to y and meets the plane at a marked right angle."
        draw={(s) => draw(s, C)} />
    </Figure>
  );
}
