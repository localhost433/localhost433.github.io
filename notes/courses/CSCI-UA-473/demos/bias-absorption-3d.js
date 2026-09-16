/* AUTO-GENERATED from bias-absorption-3d.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, buttonStyle, readoutStyle } from "@course";
import { Slider } from "@kit";
import { LIFT_POINTS, clipHalfPlane } from "@course/logic";
const H = 380,
  SQ = 2;

// Rotate about the vertical, then tilt. Returns screen coordinates.
// `cam` is the camera {cx, cy, s}; do NOT name it `C`, which is the colour
// object everywhere else in these demos.
function proj(x1, x2, z, cam, yaw, pitch) {
  const X = x1 * Math.cos(yaw) - x2 * Math.sin(yaw);
  const Y = x1 * Math.sin(yaw) + x2 * Math.cos(yaw);
  return [cam.cx + cam.s * X, cam.cy - cam.s * (z * Math.cos(pitch) + Y * Math.sin(pitch))];
}
function poly(g, pts, cam, yaw, pitch, fill, alpha, stroke) {
  if (pts.length < 3) return;
  g.beginPath();
  pts.forEach((p, i) => {
    const q = proj(p[0], p[1], p[2], cam, yaw, pitch);
    i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]);
  });
  g.closePath();
  g.globalAlpha = alpha;
  g.fillStyle = fill;
  g.fill();
  g.globalAlpha = 1;
  if (stroke) {
    g.strokeStyle = stroke;
    g.lineWidth = 0.8;
    g.stroke();
  }
}
function seg(g, a, b, cam, yaw, pitch) {
  const p = proj(a[0], a[1], a[2], cam, yaw, pitch);
  const q = proj(b[0], b[1], b[2], cam, yaw, pitch);
  g.beginPath();
  g.moveTo(p[0], p[1]);
  g.lineTo(q[0], q[1]);
  g.stroke();
}
function arrow(g, a, b, cam, yaw, pitch, col, lw) {
  g.strokeStyle = col;
  g.fillStyle = col;
  g.lineWidth = lw;
  seg(g, a, b, cam, yaw, pitch);
  const p = proj(a[0], a[1], a[2], cam, yaw, pitch);
  const q = proj(b[0], b[1], b[2], cam, yaw, pitch);
  const an = Math.atan2(q[1] - p[1], q[0] - p[0]);
  g.beginPath();
  g.moveTo(q[0], q[1]);
  g.lineTo(q[0] - 10 * Math.cos(an - 0.4), q[1] - 10 * Math.sin(an - 0.4));
  g.lineTo(q[0] - 10 * Math.cos(an + 0.4), q[1] - 10 * Math.sin(an + 0.4));
  g.fill();
}
function draw(canvas, w, view, C) {
  if (!canvas) return;
  const {
    yaw,
    pitch
  } = view;
  const Wd = canvas.clientWidth || 640,
    dpr = window.devicePixelRatio || 1;
  canvas.width = Wd * dpr;
  canvas.height = H * dpr;
  const g = canvas.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, Wd, H);
  const cam = {
    cx: Wd / 2,
    cy: H * 0.6,
    s: Math.min(Wd, H) / 6.2
  };
  const wv = [w[1], w[2], w[0]];
  g.font = "13px sans-serif";
  g.strokeStyle = C.border;
  g.lineWidth = 1;
  g.setLineDash([4, 4]);
  seg(g, [-2.6, 0, 0], [2.6, 0, 0], cam, yaw, pitch);
  seg(g, [0, -2.6, 0], [0, 2.6, 0], cam, yaw, pitch);
  g.setLineDash([]);
  arrow(g, [0, 0, 0], [0, 0, 1.7], cam, yaw, pitch, C.border, 1);
  g.fillStyle = C.muted;
  let q = proj(2.75, 0, 0, cam, yaw, pitch);
  g.fillText("x₁", q[0], q[1]);
  q = proj(0, 2.75, 0, cam, yaw, pitch);
  g.fillText("x₂", q[0], q[1]);
  q = proj(0, 0, 1.8, cam, yaw, pitch);
  g.fillText("x₀", q[0] + 4, q[1]);
  q = proj(0, 0, 0, cam, yaw, pitch);
  g.fillText("origin", q[0] + 6, q[1] + 14);
  const sq = [[-SQ, -SQ, 1], [SQ, -SQ, 1], [SQ, SQ, 1], [-SQ, SQ, 1]];
  const f = p => w[0] + w[1] * p[0] + w[2] * p[1];
  const nz = Math.hypot(...wv) > 1e-9;
  if (nz) {
    poly(g, clipHalfPlane(sq, f), cam, yaw, pitch, C.pos, 0.2);
    poly(g, clipHalfPlane(sq, p => -f(p)), cam, yaw, pitch, C.neg, 0.2);
  }
  poly(g, sq, cam, yaw, pitch, "rgba(0,0,0,0)", 0, C.border);
  q = proj(SQ, SQ, 1, cam, yaw, pitch);
  g.fillStyle = C.muted;
  g.fillText("shelf x₀ = 1", q[0] + 6, q[1]);
  if (nz) {
    const n = Math.hypot(...wv),
      u0 = Math.abs(wv[2]) < 0.9 * n ? [0, 0, 1] : [1, 0, 0];
    let u = [wv[1] * u0[2] - wv[2] * u0[1], wv[2] * u0[0] - wv[0] * u0[2], wv[0] * u0[1] - wv[1] * u0[0]];
    const un = Math.hypot(...u);
    u = u.map(v => v / un);
    const nh = wv.map(v => v / n);
    const v = [nh[1] * u[2] - nh[2] * u[1], nh[2] * u[0] - nh[0] * u[2], nh[0] * u[1] - nh[1] * u[0]];
    const R = 2.3;
    const corner = (s, t) => [0, 1, 2].map(k => R * (s * u[k] + t * v[k]));
    poly(g, [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)], cam, yaw, pitch, C.acc, 0.13, C.acc);
    const tr = [];
    for (let i = 0; i < 4; i++) {
      const a = sq[i],
        b = sq[(i + 1) % 4],
        fa = f(a),
        fb = f(b);
      if (fa === 0) tr.push(a);else if (fa * fb < 0) {
        const t = fa / (fa - fb);
        tr.push(a.map((x, k) => x + t * (b[k] - x)));
      }
    }
    if (tr.length >= 2) {
      g.strokeStyle = C.fg;
      g.lineWidth = 2.5;
      seg(g, tr[0], tr[1], cam, yaw, pitch);
    }
    const tip = nh.map(x => 1.5 * x);
    arrow(g, [0, 0, 0], tip, cam, yaw, pitch, C.acc, 2.5);
    q = proj(tip[0], tip[1], tip[2], cam, yaw, pitch);
    g.fillStyle = C.fg;
    g.fillText("w", q[0] + 6, q[1] - 4);
  }
  LIFT_POINTS.forEach(p => {
    const s = p.y * f([p.a, p.b]),
      bad = s <= 0;
    const point = proj(p.a, p.b, 1, cam, yaw, pitch),
      x = point[0],
      y = point[1];
    g.fillStyle = p.y > 0 ? C.pos : C.neg;
    if (p.y > 0) {
      g.beginPath();
      g.arc(x, y, 5.5, 0, 2 * Math.PI);
      g.fill();
    } else g.fillRect(x - 5, y - 5, 10, 10);
    if (bad) {
      g.strokeStyle = C.fg;
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(x, y, 9, 0, 2 * Math.PI);
      g.stroke();
    }
  });
}
const sg = v => (v < 0 ? " − " : " + ") + Math.abs(v).toFixed(1);
export default function BiasAbsorption() {
  const C = useClassColors();
  const [w, setW] = React.useState([0, 0.8, -1]);
  const [view, setView] = React.useState({
    yaw: -0.7,
    pitch: 0.42
  });
  const drag = React.useRef(null);
  const cv = React.useRef(null);
  React.useEffect(() => {
    const canvas = cv.current;
    if (!canvas) return undefined;
    draw(canvas, w, view, C);
    const observer = new ResizeObserver(() => draw(canvas, w, view, C));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [w, view, C]);
  const onSlider = (index, e) => {
    const value = Number(e.target.value);
    setW(old => old.map((v, i) => i === index ? value : v));
  };
  const resetView = () => setView({
    yaw: -0.7,
    pitch: 0.42
  });
  const topView = () => setView({
    yaw: 0,
    pitch: Math.PI / 2
  });
  const onPointerDown = e => {
    drag.current = [e.clientX, e.clientY, view.yaw, view.pitch];
    cv.current.style.cursor = "grabbing";
    cv.current.setPointerCapture && cv.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = e => {
    if (!drag.current) return;
    const d = drag.current;
    setView({
      yaw: d[2] + (e.clientX - d[0]) * 0.01,
      pitch: Math.max(-0.2, Math.min(Math.PI / 2, d[3] + (e.clientY - d[1]) * 0.01))
    });
  };
  const onPointerUp = () => {
    drag.current = null;
    cv.current.style.cursor = "grab";
  };
  const m = LIFT_POINTS.filter(p => p.y * (w[0] + w[1] * p.a + w[2] * p.b) <= 0).length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "3D view of bias absorption: 2D inputs lifted onto the plane x0 = 1 and separated by a plane through the origin whose normal is w = [b, w1, w2]."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      alignItems: "flex-start",
      marginBottom: "8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1",
      minWidth: "240px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "28px minmax(0, 1fr) 44px",
      gap: "8px",
      alignItems: "center",
      marginBottom: "6px",
      fontSize: "13px",
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "bias-absorption-b"
  }, "b"), /*#__PURE__*/React.createElement(Slider, {
    id: "bias-absorption-b",
    min: -3,
    max: 3,
    step: 0.1,
    value: w[0],
    onChange: e => onSlider(0, e)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.fg,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      textAlign: "right"
    }
  }, w[0].toFixed(1))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "28px minmax(0, 1fr) 44px",
      gap: "8px",
      alignItems: "center",
      marginBottom: "6px",
      fontSize: "13px",
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "bias-absorption-w1"
  }, "w\u2081"), /*#__PURE__*/React.createElement(Slider, {
    id: "bias-absorption-w1",
    min: -3,
    max: 3,
    step: 0.1,
    value: w[1],
    onChange: e => onSlider(1, e)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.fg,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      textAlign: "right"
    }
  }, w[1].toFixed(1))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "28px minmax(0, 1fr) 44px",
      gap: "8px",
      alignItems: "center",
      marginBottom: "6px",
      fontSize: "13px",
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "bias-absorption-w2"
  }, "w\u2082"), /*#__PURE__*/React.createElement(Slider, {
    id: "bias-absorption-w2",
    min: -3,
    max: 3,
    step: 0.1,
    value: w[2],
    onChange: e => onSlider(2, e)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.fg,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      textAlign: "right"
    }
  }, w[2].toFixed(1)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: resetView,
    style: buttonStyle(C)
  }, "\u21BB Reset view"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: topView,
    style: buttonStyle(C)
  }, "View from above"))), /*#__PURE__*/React.createElement("canvas", {
    ref: cv,
    role: "img",
    "aria-label": "3D lifted data, shelf, and separating plane",
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp,
    style: {
      width: "100%",
      height: H,
      border: `0.5px solid ${C.border}`,
      borderRadius: "6px",
      cursor: "grab",
      touchAction: "none"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: readoutStyle(C)
  }, "3D plane through origin: ", w[0].toFixed(1), "\xB7x\u2080", sg(w[1]), "\xB7x\u2081", sg(w[2]), "\xB7x\u2082 = 0", /*#__PURE__*/React.createElement("br", null), "trace on the shelf (x\u2080 = 1): ", w[1].toFixed(1), "\xB7x\u2081", sg(w[2]), "\xB7x\u2082", sg(w[0]), " = 0", /*#__PURE__*/React.createElement("br", null), "misclassified on the shelf: ", m, " of ", LIFT_POINTS.length, Math.abs(w[0]) < 1e-9 ? " (b = 0: the trace passes through (x₁, x₂) = (0, 0))" : "")));
}