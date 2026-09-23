/* AUTO-GENERATED from validation-size.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, validationCurve, polyFit, polyEval, eoutSineExact, TARGET } from "@course/logic";

/* How big should the validation set be? (note 06, L6 slides 11-15.)

   The left panel is the LFD figure on slide 14, rebuilt from real fits: for every
   validation size K, a thousand datasets of N = 40 noisy sine points, degree 3
   trained on N - K and validated on K. The bold curve is the mean of E_val(g-), the
   band the middle 68% of datasets (a standard deviation either side, for a bell
   curve; percentiles because one wild g- in a thousand swings the sd by itself). Two more curves the slide
   does not draw, because they are its argument: the mean of E_out(g-), which the
   bold curve is an unbiased estimate of (so the two should lie on top of each
   other), and E_out(g) for the hypothesis retrained on all N after folding the
   validation set back in, which does not depend on K at all.

   Read the band, not the curve. On the left it is wide because E_val averages few
   points; on the right it widens again because g- itself, trained on few points, is
   different every time. The right panel is one of the thousand datasets at the
   current K. */

const W = 400,
  H = 270,
  FW = 280,
  N = 40,
  M = 3,
  SIGMA = 0.3,
  KMAX = 30,
  TRIALS = 1000,
  YHI = 0.4;
const KS = Array.from({
  length: KMAX
}, (_, i) => i + 1);
class CurvePlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, {
      width: W,
      height: H,
      pad: 40,
      padTop: 16,
      padRight: 14,
      xDomain: [0, KMAX],
      yDomain: [0, YHI],
      colors
    });
  }
  render({
    rows,
    eoutFull,
    K
  }) {
    const C = this.C,
      g = this.g;
    const clampY = v => Math.max(0, Math.min(YHI, v));
    this.grid({
      yTicks: 4,
      edges: false
    });
    g.fillStyle = C.acc;
    g.globalAlpha = 0.14;
    g.beginPath();
    rows.forEach((r, i) => {
      const px = this.x(r.K),
        py = this.y(clampY(r.hi));
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    });
    for (let i = rows.length - 1; i >= 0; i--) g.lineTo(this.x(rows[i].K), this.y(clampY(rows[i].lo)));
    g.closePath();
    g.fill();
    g.globalAlpha = 1;
    this.axes();
    const upto = rows.filter(r => r.meanOut <= YHI);
    this.polyline([[0, eoutFull], [KMAX, eoutFull]], {
      color: C.pos,
      width: 1.75,
      dash: [6, 4]
    });
    this.polyline(upto.map(r => [r.K, r.meanOut]), {
      color: C.neg,
      width: 1.75,
      dash: [3, 3]
    });
    this.polyline(rows.filter(r => r.meanVal <= YHI).map(r => [r.K, r.meanVal]), {
      color: C.acc,
      width: 2.5
    });
    this.vline(K, {
      color: C.fg,
      width: 1.25,
      dash: [3, 3]
    });
    this.label("E_val(g⁻): mean, middle 68%", this.left + 6, this.top + 12, {
      color: C.acc
    });
    this.label("mean E_out(g⁻)", this.left + 6, this.top + 26, {
      color: C.neg
    });
    this.label("E_out(g), all N points", this.left + 6, this.y(eoutFull) + 15, {
      color: C.pos
    });
    for (let k = 0; k <= KMAX; k += 10) this.label(String(k), this.x(k), this.bottom + 15, {
      align: "center"
    });
    this.label("validation set size K", (this.left + this.right) / 2, this.bottom + 30, {
      align: "center"
    });
    for (let k = 1; k <= 4; k++) {
      const v = k / 4 * YHI;
      this.label(v.toFixed(2), this.left - 6, this.y(v) + 4, {
        align: "right"
      });
    }
    return this;
  }
}
class SplitPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, {
      width: FW,
      height: H,
      pad: 26,
      padTop: 16,
      padRight: 10,
      xDomain: [0, 1],
      yDomain: [-1.9, 1.9],
      colors
    });
  }
  render({
    xs,
    ys,
    n,
    w
  }) {
    const C = this.C;
    this.grid({
      yTicks: 4,
      edges: false
    }).axes({
      atY: 0
    });
    this.curve(TARGET, {
      color: C.muted,
      width: 1.5,
      dash: [5, 4]
    });
    this.curve(x => polyEval(w, x), {
      color: C.acc,
      width: 2.25
    });
    xs.forEach((x, i) => this.dot(x, ys[i], i < n ? {
      color: C.pos,
      r: 3.25
    } : {
      color: C.acc,
      r: 4
    }));
    this.label(`g⁻ from ${n} training points`, this.left + 4, this.top + 12, {
      color: C.acc
    });
    this.label(`${N - n} validation points`, this.left + 4, this.top + 26, {
      color: C.acc
    });
    return this;
  }
}
export default function App() {
  const C = useClassColors();
  const [K, setK] = React.useState(8);
  const [seed, setSeed] = React.useState(2);
  const ref = React.useRef(null),
    sref = React.useRef(null);
  const {
    rows,
    eoutFull,
    first
  } = React.useMemo(() => validationCurve({
    N,
    M,
    sigma: SIGMA,
    Ks: KS,
    trials: TRIALS
  }, rng(seed)), [seed]);
  const row = rows[K - 1];

  // the drawn dataset, split at the current K
  const n = N - K;
  const w = React.useMemo(() => polyFit(first.xs.slice(0, n), first.ys.slice(0, n), M), [first, n]);
  const evalHere = first.xs.slice(n).reduce((s, x, i) => s + Math.pow(polyEval(w, x) - first.ys[n + i], 2), 0) / K;
  const eoutHere = eoutSineExact(w, SIGMA);
  React.useEffect(() => {
    if (ref.current) new CurvePlot(ref.current, C).render({
      rows,
      eoutFull,
      K
    });
    if (sref.current) new SplitPlot(sref.current, C).render({
      xs: first.xs,
      ys: first.ys,
      n,
      w
    });
  });
  const f3 = v => v < 100 ? v.toFixed(3) : v.toExponential(1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "Validation error against validation set size K: its mean and one-standard-deviation band over a thousand datasets, the out-of-sample error it estimates, and one dataset split at the current K."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "validation size K"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: KMAX,
    step: "1",
    value: K,
    onChange: e => setK(+e.target.value),
    "aria-label": "Validation set size K",
    style: {
      flex: "1 1 150px",
      minWidth: "130px",
      accentColor: C.acc
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...readoutStyle(C),
      margin: 0,
      minWidth: "4.5em"
    }
  }, "K = ", K), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, K === 2),
    onClick: () => setK(2)
  }, "K = 2"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, K === 8),
    onClick: () => setK(8)
  }, "K = 8 (20%)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, K === 28),
    onClick: () => setK(28)
  }, "K = 28"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: () => setSeed(s => s + 1)
  }, "New datasets")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      alignItems: "flex-start",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    style: {
      flex: `1 1 ${W}px`,
      maxWidth: W,
      aspectRatio: `${W} / ${H}`
    },
    "aria-label": `At K = ${K}, the validation error averages ${row.meanVal.toFixed(3)} with standard deviation ${row.sdVal.toFixed(3)} across datasets`
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: sref,
    style: {
      flex: `1 1 ${FW}px`,
      maxWidth: FW,
      aspectRatio: `${FW} / ${H}`
    },
    "aria-label": `One dataset of ${N} points split into ${n} training and ${K} validation points, with the degree ${M} fit to the training part`
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, "over ", TRIALS, " datasets at K = ", K, ":  E_val(g\u207B) = ", f3(row.meanVal), " \xB1 ", f3(row.sdVal), "   mean E_out(g\u207B) = ", f3(row.meanOut), "   E_out(g) = ", f3(eoutFull), /*#__PURE__*/React.createElement("br", null), "this dataset:  E_val(g\u207B) = ", f3(evalHere), "   E_out(g\u207B) = ", f3(eoutHere)), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.5
    }
  }, "Left: for each K, a thousand datasets of ", N, " points from the dashed sine with noise \u03C3 = ", SIGMA, ", degree ", M, " trained on the first N \u2212 K points (green on the right) and validated on the last K (purple). The purple curve is the average validation error and the band holds the middle 68% of datasets; the orange dotted curve is the average true error of the same g\u207B, and the two lie on top of each other because E_val is unbiased for g\u207B. The green dashed line is g, retrained on all ", N, " points. Walk K from 1 to 30 and watch the width of the band, then the right panel, where the training part shrinks."));
}