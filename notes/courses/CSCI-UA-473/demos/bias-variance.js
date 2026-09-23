/* AUTO-GENERATED from bias-variance.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, biasVariance, polyEval, TARGET } from "@course/logic";

/* The bias-variance decomposition, drawn (note 06, L6 slides 25-28).

   The U-curve figures show E_out turning around as M grows and call the left side
   underfitting and the right side overfitting. Those are outcomes; this figure is the
   mechanism. Draw forty datasets from the same target and noise, fit degree M to
   each, and look at the forty fits together. Their average is gbar. How far gbar sits
   from the target is bias; how far the forty fits scatter around gbar is variance.
   A low degree cannot bend to the target, so gbar is wrong and the fits agree with
   each other (bias). A high degree bends to every noisy sample, so gbar is fine and
   the fits disagree wildly (variance). E_out is their sum plus the noise floor.

   The ten x positions are fixed and only the noise is redrawn, so the variance here
   is noise-driven. Redrawing x as well (the deck's E_D) sends the M >= 7 variances
   past 10^3, which forty samples cannot average into a readable curve. */

const W = 420,
  H = 260,
  SW = 300,
  SH = 260,
  MAXM = 9,
  K = 40,
  N = 10,
  SIGMA = 0.2;
class FitsPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, {
      width: W,
      height: H,
      pad: 30,
      padTop: 14,
      padRight: 12,
      xDomain: [0, 1],
      yDomain: [-1.9, 1.9],
      colors
    });
  }
  render({
    fits,
    gx,
    gbar
  }) {
    const C = this.C,
      g = this.g;
    this.grid({
      yTicks: 4
    }).axes({
      atY: 0
    });
    g.globalAlpha = 0.16;
    fits.forEach(w => this.curve(x => polyEval(w, x), {
      color: C.acc,
      width: 1
    }));
    g.globalAlpha = 1;
    this.curve(TARGET, {
      color: C.muted,
      width: 1.75,
      dash: [5, 4]
    });
    this.polyline(gx.map((x, i) => [x, gbar[i]]), {
      color: C.acc,
      width: 2.75
    });
    this.label("ḡ  (average of the " + K + " fits)", this.left + 6, this.top + 12, {
      color: C.acc
    });
    this.label("f", this.x(0.75), this.y(TARGET(0.75)) - 12, {
      align: "center"
    });
    this.label("x", this.right, this.bottom + 14, {
      align: "right"
    });
    return this;
  }
}
class SummaryPlot extends Plot {
  constructor(canvas, colors, yHi) {
    super(canvas, {
      width: SW,
      height: SH,
      pad: 36,
      padTop: 14,
      padRight: 12,
      xDomain: [0, MAXM],
      yDomain: [0, yHi],
      colors
    });
  }
  render({
    bias2,
    variance,
    M
  }) {
    const C = this.C;
    this.grid({
      yTicks: 4
    }).axes();
    const total = bias2.map((b, i) => b + variance[i] + SIGMA * SIGMA);
    this.polyline(total.map((v, i) => [i, v]), {
      color: C.neg,
      width: 2.25
    });
    this.polyline(bias2.map((v, i) => [i, v]), {
      color: C.pos,
      width: 2
    });
    this.polyline(variance.map((v, i) => [i, v]), {
      color: C.acc,
      width: 2
    });
    total.forEach((v, i) => this.dot(i, v, {
      color: C.neg,
      r: 2.5
    }));
    bias2.forEach((v, i) => this.dot(i, v, {
      color: C.pos,
      r: 2.5
    }));
    variance.forEach((v, i) => this.dot(i, v, {
      color: C.acc,
      r: 2.5
    }));
    this.vline(M, {
      color: C.fg,
      width: 1.25,
      dash: [3, 3]
    });
    this.label("bias²", this.x(0.2), this.y(bias2[0]) - 8, {
      color: C.pos
    });
    this.label("variance", this.x(MAXM) - 4, this.y(Math.min(variance[MAXM], this.yDomain[1])) - 8, {
      align: "right",
      color: C.acc
    });
    this.label("bias² + variance + σ²", this.x(MAXM / 2), this.top + 12, {
      align: "center",
      color: C.neg
    });
    for (let m = 0; m <= MAXM; m += 3) this.label(String(m), this.x(m), this.bottom + 14, {
      align: "center"
    });
    this.label("M", (this.left + this.right) / 2, this.bottom + 28, {
      align: "center"
    });
    for (let k = 1; k <= 4; k++) {
      const v = k / 4 * this.yDomain[1];
      this.label(v.toFixed(2), this.left - 5, this.y(v) + 4, {
        align: "right"
      });
    }
    return this;
  }
}
export default function App() {
  const C = useClassColors();
  const [M, setM] = React.useState(3);
  const [seed, setSeed] = React.useState(5);
  const ref = React.useRef(null),
    sref = React.useRef(null);

  // one decomposition per degree, all from the same seed, so the summary is the
  // curve the slider walks along rather than a separate experiment
  const all = React.useMemo(() => Array.from({
    length: MAXM + 1
  }, (_, m) => biasVariance(m, {
    K,
    N,
    sigma: SIGMA
  }, rng(seed + 31 * m))), [seed]);
  const cur = all[M];
  const bias2 = all.map(r => r.bias2),
    variance = all.map(r => Math.min(r.variance, 0.6));
  const yHi = 0.6;
  React.useEffect(() => {
    if (ref.current) new FitsPlot(ref.current, C).render(cur);
    if (sref.current) new SummaryPlot(sref.current, C, yHi).render({
      bias2,
      variance,
      M
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
  }, "Bias and variance of polynomial fits: forty fits of degree M to forty noisy samples of a sine, their average, and the bias-squared and variance curves against degree."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "degree M"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: MAXM,
    step: "1",
    value: M,
    onChange: e => setM(+e.target.value),
    "aria-label": "Polynomial degree M",
    style: {
      flex: "1 1 150px",
      minWidth: "130px",
      accentColor: C.acc
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...readoutStyle(C),
      margin: 0,
      minWidth: "3.5em"
    }
  }, "M = ", M), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, M === 1),
    onClick: () => setM(1)
  }, "M = 1"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, M === 3),
    onClick: () => setM(3)
  }, "M = 3"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, M === 9),
    onClick: () => setM(9)
  }, "M = 9"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: () => setSeed(s => s + 1)
  }, "Resample")), /*#__PURE__*/React.createElement("div", {
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
    "aria-label": `${K} degree-${M} fits to ${K} samples of ${N} points, their average, and the target`
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: sref,
    style: {
      flex: `1 1 ${SW}px`,
      maxWidth: SW,
      aspectRatio: `${SW} / ${SH}`
    },
    "aria-label": `Bias squared, variance and their sum against degree, currently at M = ${M}`
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, "at M = ", M, ":  bias\xB2 = ", cur.bias2.toFixed(3), "   variance = ", cur.variance.toFixed(3), "   \u03C3\xB2 = ", (SIGMA * SIGMA).toFixed(3), "   sum = ", (cur.bias2 + cur.variance + SIGMA * SIGMA).toFixed(3)), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.5
    }
  }, "Left: ", K, " samples of ", N, " noisy points each from the dashed target, a degree-M polynomial fitted to every one (faint), and their average \u1E21 (bold). Right: the same experiment at every degree. Bias\xB2 is the squared distance from \u1E21 to the target, averaged over x - what the hypothesis set cannot express however much data it sees. Variance is the squared scatter of the individual fits around \u1E21 - how much the answer depends on which sample you happened to draw. Walk M up: at 1 the fits agree and are all wrong together; at 9 their average is nearly right and no single one of them is. E_out is the sum of the two plus the noise floor \u03C3\xB2, and its minimum is where the two slopes cancel, which is not in general where the curves cross. (The variance axis is clipped at 0.6; at M = 9 the true value is larger.)"));
}