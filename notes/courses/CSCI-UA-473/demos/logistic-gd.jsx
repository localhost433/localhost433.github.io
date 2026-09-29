import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, logisticSample, logisticEin, logisticNewton, descend, separable1D } from "@course/logic";

/* Batch, stochastic and mini-batch descent on one logistic-regression loss (note 07,
   L7 slides 12-20).

   One input plus the bias, so w = [w0, w1] and E_in is a surface over a plane: the
   left panel is its contours, the three paths are drawn on top. The right panel is
   E_in against epochs (gradient evaluations / N), the only fair x-axis, because a
   batch step costs N single-example gradients.

   The default data (40 points, labels drawn from sigma(0.5 + 1.5 x), seed 2) put the
   minimizer at w* = (0.45, 1.21), near the target that generated them. "Separable
   data" swaps in a set with no minimizer, where every path heads off the panel and
   the readout's |w| keeps growing: the note's point that separable data need a
   regularizer, made visible. */

const W = 330, H = 270, EPOCHS = 12, BATCH = 8;
const DOM = { x: [-2, 3], y: [-1.5, 4] };
const START = [-1.5, -1];
const METHODS = [
  { key: "batch", label: "batch", dash: null },
  { key: "mini", label: "mini-batch (M = 8)", dash: [6, 3] },
  { key: "sgd", label: "SGD", dash: null },
];

function separableSet() {
  const r = rng(4);
  return Array.from({ length: 40 }, () => {
    const x = 4 * r() - 2;
    return { x, y: x > -0.25 ? 1 : -1 };
  });
}

class ContourPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, { width: W, height: H, pad: 30, padTop: 12, padRight: 10,
      xDomain: DOM.x, yDomain: DOM.y, colors });
  }

  render({ pts, runs, wstar, colors }) {
    const C = this.C, g = this.g;
    // Shade E_in on a coarse grid, darker = lower, then draw level lines by marching
    // the same grid. Levels are spaced in log(E_in) so the valley floor gets lines too.
    const nx = 66, ny = 54, vals = [];
    for (let j = 0; j <= ny; j++) {
      const row = [];
      for (let i = 0; i <= nx; i++) {
        const w0 = DOM.x[0] + (i / nx) * (DOM.x[1] - DOM.x[0]);
        const w1 = DOM.y[0] + (j / ny) * (DOM.y[1] - DOM.y[0]);
        row.push(Math.log(logisticEin([w0, w1], pts)));
      }
      vals.push(row);
    }
    const lo = Math.min(...vals.flat()), hi = Math.max(...vals.flat());
    const cw = (this.right - this.left) / nx, ch = (this.bottom - this.top) / ny;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const t = (vals[j][i] - lo) / (hi - lo);
      g.fillStyle = C.acc; g.globalAlpha = 0.22 * (1 - t);
      g.fillRect(this.left + i * cw, this.bottom - (j + 1) * ch, cw + 0.5, ch + 0.5);
    }
    g.globalAlpha = 0.55; g.strokeStyle = C.muted; g.lineWidth = 0.8;
    const levels = Array.from({ length: 9 }, (_, k) => lo + ((k + 0.5) / 9) * (hi - lo) * 0.8);
    for (const L of levels) {
      g.beginPath();
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const a = vals[j][i], b = vals[j][i + 1], c = vals[j + 1][i + 1], d = vals[j + 1][i];
        const px = (ii, jj) => [this.left + ii * cw, this.bottom - jj * ch];
        const cross = [];
        const edge = (v1, v2, p1, p2) => {
          if ((v1 - L) * (v2 - L) < 0) {
            const t = (L - v1) / (v2 - v1);
            cross.push([p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])]);
          }
        };
        edge(a, b, px(i, j), px(i + 1, j)); edge(b, c, px(i + 1, j), px(i + 1, j + 1));
        edge(c, d, px(i + 1, j + 1), px(i, j + 1)); edge(d, a, px(i, j + 1), px(i, j));
        if (cross.length >= 2) { g.moveTo(...cross[0]); g.lineTo(...cross[1]); }
        if (cross.length === 4) { g.moveTo(...cross[2]); g.lineTo(...cross[3]); }
      }
      g.stroke();
    }
    g.globalAlpha = 1;
    this.axes({ atY: 0, atX: 0 });

    g.save(); g.beginPath(); g.rect(this.left, this.top, this.right - this.left, this.bottom - this.top); g.clip();
    // SGD takes 40 steps an epoch and would bury the other two paths, so it goes
    // underneath, thinner and translucent; batch, the reference path, goes on top.
    [2, 1, 0].forEach((k) => {
      const r = runs[k];
      if (!r) return;
      g.globalAlpha = k === 2 ? 0.55 : 1;
      this.polyline(r.path, { color: colors[k], width: k === 0 ? 2.75 : k === 1 ? 1.8 : 1, dash: k === 2 ? null : METHODS[k].dash });
      g.globalAlpha = 1;
    });
    g.restore();
    this.dot(START[0], START[1], { color: C.fg, r: 4 });
    this.labelAt("w(0)", START[0], START[1], { dx: 6, dy: 14, color: C.fg });
    if (wstar) {
      this.dot(wstar[0], wstar[1], { color: C.fg, r: 3.5, ring: C.fg, ringWidth: 1.5 });
      this.labelAt("w*", wstar[0], wstar[1], { dx: 9, dy: -8, color: C.fg });
    }
    this.label("w0 (bias)", this.right, this.y(0) + 14, { align: "right" });
    this.label("w1", this.x(0) + 6, this.top + 10);
    for (const v of [-1, 1, 2]) this.labelAt(String(v), v, 0, { dy: 13, align: "center", size: 10 });
    for (const v of [-1, 1, 2, 3]) this.labelAt(String(v), 0, v, { dx: -5, dy: 4, align: "right", size: 10 });
    return this;
  }
}

class TracePlot extends Plot {
  constructor(canvas, colors, yMax) {
    super(canvas, { width: W, height: H, pad: 30, padTop: 12, padRight: 10,
      xDomain: [0, EPOCHS], yDomain: [0, yMax], colors });
  }

  render({ runs, emin, colors }) {
    const C = this.C;
    this.grid({ yTicks: 4, xTicks: 4, edges: false }).axes();
    if (emin != null) {
      this.polyline([[0, emin], [EPOCHS, emin]], { color: C.muted, width: 1, dash: [4, 4] });
      this.labelAt("min E_in", EPOCHS, emin, { dy: 13, align: "right" });
    }
    const g = this.g;
    g.save(); g.beginPath(); g.rect(this.left, this.top, this.right - this.left, this.bottom - this.top); g.clip();
    [2, 1, 0].forEach((k) => {
      const r = runs[k];
      if (!r) return;
      g.globalAlpha = k === 2 ? 0.7 : 1;
      this.polyline(r.trace, { color: colors[k], width: k === 0 ? 2.75 : k === 1 ? 1.8 : 1.1, dash: k === 2 ? null : METHODS[k].dash });
      g.globalAlpha = 1;
    });
    g.restore();
    this.label("epochs (gradient evaluations / N)", this.right, this.bottom + 22, { align: "right" });
    this.label("E_in", this.left + 4, this.top + 10);
    for (let e = 0; e <= EPOCHS; e += 3) this.labelAt(String(e), e, 0, { dy: 13, align: "center", size: 10 });
    for (let v = 0.5; v < this.yDomain[1]; v += 0.5) this.labelAt(v.toFixed(1), 0, v, { dx: -5, dy: 4, align: "right", size: 10 });
    return this;
  }
}

const ETAS = [0.1, 0.2, 0.5, 1, 2, 4, 8, 12, 16];

export default function App() {
  const C = useClassColors();
  const [ei, setEi] = React.useState(2);
  const [sep, setSep] = React.useState(false);
  const [seed, setSeed] = React.useState(1);
  const [show, setShow] = React.useState([true, true, true]);
  const rc = React.useRef(null), rt = React.useRef(null);
  const eta = ETAS[ei];
  const colors = [C.acc, C.pos, C.neg];

  const pts = React.useMemo(() => (sep ? separableSet() : logisticSample(40, [0.5, 1.5], rng(2))), [sep]);
  const wstar = React.useMemo(() => (separable1D(pts) ? null : logisticNewton(pts)), [pts]);
  const emin = wstar ? logisticEin(wstar, pts) : null;
  const runs = React.useMemo(() => METHODS.map((m, k) =>
    descend(pts, { method: m.key === "mini" ? "mini" : m.key, eta, epochs: EPOCHS, batch: BATCH, w0: START },
      rng(seed * 31 + k))), [pts, eta, seed]);
  const shown = runs.map((r, k) => (show[k] ? r : null));
  const e0 = logisticEin(START, pts);

  React.useEffect(() => {
    if (rc.current) new ContourPlot(rc.current, C).render({ pts, runs: shown, wstar, colors });
    if (rt.current) new TracePlot(rt.current, C, Math.max(1.2, e0 * 1.05)).render({ runs: shown, emin, colors });
  });

  const fmt = (v) => (Number.isFinite(v) ? v.toFixed(3) : "diverged");
  const norm = (w) => Math.hypot(w[0], w[1]);
  const line = (k) => {
    const r = runs[k], w = r.w;
    return `${METHODS[k].label.padEnd(18)} E_in = ${fmt(logisticEin(w, pts))}   w = (${fmt(w[0])}, ${fmt(w[1])})   |w| = ${fmt(norm(w))}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: C.fg }}>
      <h2 className="sr-only">Batch, mini-batch and stochastic gradient descent on the logistic regression loss for one input and a bias: their paths over the loss contours, and the loss against epochs, with the learning rate on a slider.</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={labelStyle(C)}>learning rate η</span>
        <input type="range" min="0" max={ETAS.length - 1} step="1" value={ei} onChange={(e) => setEi(+e.target.value)}
          aria-label="Learning rate eta" style={{ flex: "1 1 150px", minWidth: "130px", accentColor: C.acc }} />
        <span style={{ ...readoutStyle(C), margin: 0, minWidth: "4.5em" }}>η = {eta}</span>
        <button type="button" style={buttonStyle(C)} onClick={() => setSeed((s) => s + 1)}>Redraw SGD samples</button>
        <button type="button" style={buttonStyle(C, sep)} onClick={() => setSep((s) => !s)}>Separable data</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
        {METHODS.map((m, k) => (
          <label key={m.key} style={{ ...labelStyle(C), display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input type="checkbox" checked={show[k]} onChange={() => setShow((s) => s.map((v, i) => (i === k ? !v : v)))}
              style={{ accentColor: colors[k] }} />
            <svg width="26" height="8" aria-hidden="true"><line x1="0" y1="4" x2="26" y2="4" stroke={colors[k]} strokeWidth="2.5"
              strokeDasharray={m.dash ? m.dash.join(" ") : undefined} /></svg>
            {m.label}
          </label>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-start", justifyContent: "center" }}>
        <canvas ref={rc} style={{ flex: `1 1 ${W}px`, minWidth: 0, maxWidth: W, aspectRatio: `${W} / ${H}` }}
          aria-label={`Contours of E_in over w0 and w1 with the three descent paths at eta ${eta}`} />
        <canvas ref={rt} style={{ flex: `1 1 ${W}px`, minWidth: 0, maxWidth: W, aspectRatio: `${W} / ${H}` }}
          aria-label={`E_in against epochs for the three methods at eta ${eta}`} />
      </div>
      <p style={{ ...readoutStyle(C), margin: 0, whiteSpace: "pre-wrap" }}>
        after {EPOCHS} epochs:{"\n"}{METHODS.map((_, k) => line(k)).join("\n")}{"\n"}
        {wstar ? `minimizer w* = (${wstar[0].toFixed(3)}, ${wstar[1].toFixed(3)}), E_in(w*) = ${emin.toFixed(3)}`
          : "separable data: no minimizer exists, so E_in only approaches 0 as |w| grows"}
      </p>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>
        Each method takes w ← w − η g; they differ only in how many examples g averages
        over: all 40 (batch), 8 (mini-batch), or 1 (SGD). One epoch is 1 batch step, 5
        mini-batch steps or 40 SGD steps.{" "}
        {wstar
          ? "Raise η until the batch path bounces across the valley (slide 14's middle panel). At any fixed η, SGD keeps wandering near w* instead of stopping on it, because single-example gradients are not zero there."
          : "On separable data there is no valley floor to stop at: every path heads off toward larger |w|, and a larger η only gets there sooner."}
      </p>
    </div>
  );
}
