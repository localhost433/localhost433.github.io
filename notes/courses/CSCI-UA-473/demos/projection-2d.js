/* AUTO-GENERATED from projection-2d.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, readoutStyle, labelStyle, Plot } from "@course";

/* L2 derives proj_a(x) from the fact that the residual is orthogonal to a, and says
   outright that it will be back. It comes back in L5 as least squares: the fitted
   values are the projection of y onto the column space of X, and the normal equations
   are this same orthogonality read one column at a time. Drag either vector. */

const W = 380,
  H = 380,
  R = 5;
const proj = (x, a) => {
  const aa = a[0] * a[0] + a[1] * a[1];
  const k = aa === 0 ? 0 : (a[0] * x[0] + a[1] * x[1]) / aa;
  return {
    k,
    p: [k * a[0], k * a[1]]
  };
};
class VectorPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, {
      width: W,
      height: H,
      pad: 0,
      padTop: 0,
      padRight: 0,
      xDomain: [-R, R],
      yDomain: [-R, R],
      colors
    });
  }
  arrow(to, {
    color,
    width = 2.5,
    label
  }) {
    const g = this.g,
      x0 = this.x(0),
      y0 = this.y(0),
      x1 = this.x(to[0]),
      y1 = this.y(to[1]);
    g.strokeStyle = color;
    g.fillStyle = color;
    g.lineWidth = width;
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
    const ang = Math.atan2(y1 - y0, x1 - x0);
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x1 - 10 * Math.cos(ang - 0.38), y1 - 10 * Math.sin(ang - 0.38));
    g.lineTo(x1 - 10 * Math.cos(ang + 0.38), y1 - 10 * Math.sin(ang + 0.38));
    g.fill();
    if (label) this.label(label, x1 + 8 * Math.cos(ang), y1 + 8 * Math.sin(ang) - 4, {
      color,
      size: 13
    });
    return this;
  }

  // the square tick that says "this angle is exactly 90 degrees"
  rightAngle(at, u, v, size = 12) {
    const g = this.g,
      px = this.x(at[0]),
      py = this.y(at[1]);
    const n = d => {
      const m = Math.hypot(d[0], d[1]) || 1;
      return [d[0] / m, -d[1] / m];
    };
    const [ux, uy] = n(u),
      [vx, vy] = n(v);
    g.strokeStyle = this.C.muted;
    g.lineWidth = 1.25;
    g.beginPath();
    g.moveTo(px + ux * size, py + uy * size);
    g.lineTo(px + (ux + vx) * size, py + (uy + vy) * size);
    g.lineTo(px + vx * size, py + vy * size);
    g.stroke();
    return this;
  }
  render({
    x,
    a
  }) {
    const C = this.C;
    const {
      p
    } = proj(x, a);
    this.grid({
      xTicks: 5,
      yTicks: 5
    });
    this.axes({
      atY: 0,
      atX: 0
    });

    // the line spanned by a: the subspace being projected onto
    const m = Math.hypot(a[0], a[1]) || 1;
    const far = [a[0] / m * R * 2, a[1] / m * R * 2];
    this.polyline([[-far[0], -far[1]], far], {
      color: C.acc,
      width: 1,
      dash: [4, 4]
    });

    // the residual, which is the whole point
    this.polyline([[x[0], x[1]], p], {
      color: C.neg,
      width: 1.75,
      dash: [5, 4]
    });
    this.rightAngle(p, [a[0], a[1]], [x[0] - p[0], x[1] - p[1]]);
    this.arrow(a, {
      color: C.acc,
      width: 1.75,
      label: null
    });
    this.labelAt("a", a[0], a[1], {
      dx: 10,
      dy: 16,
      color: C.acc,
      size: 13
    });
    this.arrow(x, {
      color: C.pos,
      label: "x"
    });
    this.arrow(p, {
      color: C.fg,
      width: 2.5,
      label: null
    });
    this.dot(p[0], p[1], {
      color: C.fg,
      r: 4
    });
    this.labelAt("proj", p[0], p[1], {
      dx: -8,
      dy: -10,
      color: C.fg,
      size: 13,
      align: "right"
    });
    return this;
  }
}
export default function App() {
  const C = useClassColors();
  const [x, setX] = React.useState([1.5, 3.6]);
  const [a, setA] = React.useState([4, 1.0]);
  const [drag, setDrag] = React.useState(null);
  const ref = React.useRef(null);
  const {
    k,
    p
  } = proj(x, a);
  const res = [x[0] - p[0], x[1] - p[1]];
  const dotRes = a[0] * res[0] + a[1] * res[1];
  React.useEffect(() => {
    if (ref.current) new VectorPlot(ref.current, C).render({
      x,
      a
    });
  });
  const toData = e => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width * W;
    const py = (e.clientY - r.top) / r.height * H;
    return [px / W * 2 * R - R, R - py / H * 2 * R];
  };
  const near = (v, q) => Math.hypot(v[0] - q[0], v[1] - q[1]) < 0.9;
  const down = e => {
    const q = toData(e);
    setDrag(near(x, q) ? "x" : near(a, q) ? "a" : null);
  };
  const move = e => {
    if (!drag) return;
    e.preventDefault();
    const q = toData(e).map(v => Math.max(-R + 0.2, Math.min(R - 0.2, v)));
    drag === "x" ? setX(q) : setA(q);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "Projection of a vector x onto the line spanned by a, with the residual drawn and its orthogonality marked."), /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    onPointerDown: down,
    onPointerMove: move,
    onPointerUp: () => setDrag(null),
    onPointerLeave: () => setDrag(null),
    style: {
      width: "100%",
      maxWidth: W,
      aspectRatio: "1 / 1",
      touchAction: "none",
      alignSelf: "center",
      cursor: drag ? "grabbing" : "grab",
      border: `1px solid ${C.border}`,
      borderRadius: "8px"
    },
    "aria-label": `x is [${x[0].toFixed(1)}, ${x[1].toFixed(1)}], a is [${a[0].toFixed(1)}, ${a[1].toFixed(1)}], projection coefficient ${k.toFixed(3)}`
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0,
      lineHeight: 1.7
    }
  }, "a\u1D40x / a\u1D40a = ", k.toFixed(3), /*#__PURE__*/React.createElement("br", null), "proj = [", p[0].toFixed(2), ", ", p[1].toFixed(2), "]   residual = [", res[0].toFixed(2), ", ", res[1].toFixed(2), "]", /*#__PURE__*/React.createElement("br", null), "a\u1D40(x \u2212 proj) = ", Math.abs(dotRes) < 5e-4 ? "0" : dotRes.toFixed(6)), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.5
    }
  }, "Drag either arrow head. The dashed line is the subspace spanned by a, and the orange dashed segment is the residual x \u2212 proj. However you move the two vectors, the last readout stays zero: the residual is orthogonal to a, and that single fact is what defines the projection. L5 uses it in exactly this form, with the column space of X in place of the line through a, which is why the normal equations read X\u1D40(y \u2212 \u0177) = 0."));
}