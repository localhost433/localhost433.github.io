/* AUTO-GENERATED from roc-threshold.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { logit, sigmoid, binormalRates, binormalAuc, confusionCounts, classMetrics } from "@course/logic";

/* One threshold, four counts, every metric, and the ROC (note 07, L7 slides 25-33).

   The model's scores s = w.x are unit-variance normals at -d/2 for the negatives and
   +d/2 for the positives; the model outputs sigma(s), so the threshold slider moves
   theta on the probability and the dashed line sits at s = logit(theta). The humps are
   drawn per class (each integrates to 1), which is what TPR and FPR are fractions of;
   the counts in the matrix are for 10,000 people at the chosen prevalence.

   The prevalence control is the point of the figure. Move it and the ROC curve, the
   AUC, sensitivity and specificity stay put, because each is a fraction of one column
   of the matrix. Precision and accuracy move, because they mix the columns. The COVID
   preset puts slide 35's test on this model: d = 2.563 makes sensitivity and
   specificity both 0.90 at theta = 0.5, and at 1% prevalence precision reads 1/12. */

const W = 330,
  H = 230,
  S = [-5, 5];
const TOTAL = 10000;
const PREVS = [0.001, 0.01, 0.05, 0.1, 0.25, 0.5];
const phi = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
const D_COVID = 2 * 1.2815516; // Phi(d/2) = 0.9

class ScorePlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, {
      width: W,
      height: H,
      pad: 30,
      padTop: 14,
      padRight: 10,
      xDomain: S,
      yDomain: [0, 0.5],
      colors
    });
  }
  render({
    d,
    t,
    theta
  }) {
    const C = this.C,
      g = this.g;
    this.axes({
      y: false
    });
    const fill = (mu, from, to, color, alpha) => {
      const a = Math.max(S[0], from),
        b = Math.min(S[1], to);
      if (b <= a) return;
      g.fillStyle = color;
      g.globalAlpha = alpha;
      g.beginPath();
      g.moveTo(this.x(a), this.y(0));
      for (let i = 0; i <= 80; i++) {
        const s = a + i / 80 * (b - a);
        g.lineTo(this.x(s), this.y(phi(s - mu)));
      }
      g.lineTo(this.x(b), this.y(0));
      g.closePath();
      g.fill();
      g.globalAlpha = 1;
    };
    fill(-d / 2, S[0], t, C.neg, 0.14); // TN
    fill(-d / 2, t, S[1], C.neg, 0.5); // FP
    fill(d / 2, S[0], t, C.pos, 0.5); // FN
    fill(d / 2, t, S[1], C.pos, 0.14); // TP
    this.curve(s => phi(s + d / 2), {
      color: C.neg,
      width: 2
    });
    this.curve(s => phi(s - d / 2), {
      color: C.pos,
      width: 2
    });
    this.vline(t, {
      color: C.fg,
      width: 1.5,
      dash: [5, 4]
    });
    this.labelAt(`θ = ${theta.toFixed(2)}`, t, 0.47, {
      dx: t > 3 ? -5 : 5,
      align: t > 3 ? "right" : "left",
      color: C.fg
    });
    // Close humps share a peak: put the two names either side of it rather than
    // stacking them, which would run into the θ label above.
    const near = d < 1.2;
    this.labelAt("negatives", -d / 2, phi(0), {
      dy: -6,
      dx: near ? -4 : 0,
      align: near ? "right" : "center",
      color: C.neg
    });
    this.labelAt("positives", d / 2, phi(0), {
      dy: -6,
      dx: near ? 4 : 0,
      align: near ? "left" : "center",
      color: C.pos
    });
    // TN and TP sit inside their humps, away from the threshold; FN and FP sit just
    // either side of it, low down, where the two error slivers are.
    const mark = (text, s, y, color) => this.labelAt(text, s, y, {
      align: "center",
      color: C.fg,
      size: 10.5
    });
    const inHump = (mu, lo, hi) => Math.max(lo, Math.min(hi, mu));
    if (t - 1.1 > S[0] + 0.3) mark("TN", inHump(-d / 2, S[0] + 0.5, t - 1.1), 0.12, C.neg);
    if (t + 1.1 < S[1] - 0.3) mark("TP", inHump(d / 2, t + 1.1, S[1] - 0.5), 0.12, C.pos);
    if (t - 0.35 > S[0]) mark("FN", t - 0.38, 0.015, C.pos);
    if (t + 0.35 < S[1]) mark("FP", t + 0.38, 0.015, C.neg);
    this.label("score s = wᵀx   (the model outputs σ(s))", this.right, this.bottom + 22, {
      align: "right"
    });
    for (const s of [-4, -2, 0, 2, 4]) this.labelAt(String(s), s, 0, {
      dy: 12,
      align: "center",
      size: 10
    });
    return this;
  }
}
class RocPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, {
      width: W - 60,
      height: H,
      pad: 34,
      padTop: 14,
      padRight: 12,
      xDomain: [0, 1],
      yDomain: [0, 1],
      colors
    });
  }
  render({
    d,
    t,
    auc
  }) {
    const C = this.C,
      g = this.g;
    this.grid({
      yTicks: 4,
      xTicks: 4
    }).axes();
    const pts = [];
    for (let i = 0; i <= 200; i++) {
      const s = 7 - i / 200 * 14,
        r = binormalRates(d, s);
      pts.push([r.fpr, r.tpr]);
    }
    g.fillStyle = C.acc;
    g.globalAlpha = 0.12;
    g.beginPath();
    g.moveTo(this.x(0), this.y(0));
    pts.forEach(([x, y]) => g.lineTo(this.x(x), this.y(y)));
    g.lineTo(this.x(1), this.y(0));
    g.closePath();
    g.fill();
    g.globalAlpha = 1;
    this.polyline([[0, 0], [1, 1]], {
      color: C.muted,
      width: 1,
      dash: [4, 4]
    });
    this.polyline(pts, {
      color: C.acc,
      width: 2.5
    });
    const r = binormalRates(d, t);
    this.dot(r.fpr, r.tpr, {
      color: C.fg,
      r: 4.5,
      ring: C.fg,
      ringWidth: 1.5
    });
    this.labelAt(`AUC = ${auc.toFixed(3)}`, 0.95, 0.08, {
      align: "right",
      color: C.fg
    });
    this.labelAt("random", 0.62, 0.55, {
      color: C.muted,
      size: 10
    });
    this.label("FPR = 1 − specificity", this.right, this.bottom + 24, {
      align: "right"
    });
    this.label("TPR", this.left + 6, this.y(0.4)); // below the knee, where the ringed point rarely goes
    for (const v of [0, 0.5, 1]) {
      this.labelAt(String(v), v, 0, {
        dy: 12,
        align: "center",
        size: 10
      });
      if (v) this.labelAt(String(v), 0, v, {
        dx: -6,
        dy: 4,
        align: "right",
        size: 10
      });
    }
    return this;
  }
}
const fmt = v => Number.isNaN(v) ? "undefined (0/0)" : v.toFixed(3);
// The metrics use the exact expected counts, so a count that rounds to 0 but is not 0
// shows as "<1": at theta = 0.99 and 0.1% prevalence, TP and FP are both a small
// fraction of a person and precision is still their ratio, not 0/0.
const cnt = v => v > 0 && v < 0.5 ? "<1" : Math.round(v).toLocaleString("en-US");
export default function App() {
  const C = useClassColors();
  const [theta, setTheta] = React.useState(0.6);
  const [d, setD] = React.useState(2);
  const [pi, setPi] = React.useState(3);
  const rs = React.useRef(null),
    rr = React.useRef(null);
  const prev = PREVS[pi];
  const t = logit(theta);
  const rates = binormalRates(d, t);
  const auc = binormalAuc(d);
  const k = confusionCounts({
    prev,
    ...rates,
    total: TOTAL
  });
  const m = classMetrics(k);
  React.useEffect(() => {
    if (rs.current) new ScorePlot(rs.current, C).render({
      d,
      t,
      theta
    });
    if (rr.current) new RocPlot(rr.current, C).render({
      d,
      t,
      auc
    });
  });
  const cell = (label, v, color, strong) => /*#__PURE__*/React.createElement("td", {
    style: {
      border: `1px solid ${C.border}`,
      padding: "6px 10px",
      textAlign: "center",
      background: strong ? color + "33" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: C.muted
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      color: C.fg
    }
  }, cnt(v)));
  const th = {
    padding: "4px 8px",
    fontSize: "12px",
    color: C.muted,
    fontWeight: 400
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
  }, "A classification threshold on the model's scores for two classes, the confusion matrix it produces for 10,000 people at a chosen prevalence, the metrics derived from it, and the ROC curve with the current operating point."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      alignItems: "center",
      gap: "6px 10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "threshold \u03B8"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0.01",
    max: "0.99",
    step: "0.01",
    value: theta,
    onChange: e => setTheta(+e.target.value),
    "aria-label": "Threshold theta on the predicted probability",
    style: {
      accentColor: C.acc,
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...readoutStyle(C),
      margin: 0,
      minWidth: "5em"
    }
  }, theta.toFixed(2)), /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "separation d"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "4",
    step: "0.05",
    value: d,
    onChange: e => setD(+e.target.value),
    "aria-label": "Separation d between the class means",
    style: {
      accentColor: C.acc,
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, d.toFixed(2)), /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "prevalence"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: PREVS.length - 1,
    step: "1",
    value: pi,
    onChange: e => setPi(+e.target.value),
    "aria-label": "Prevalence of the positive class",
    style: {
      accentColor: C.acc,
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, (prev * 100).toLocaleString("en-US", {
    maximumFractionDigits: 1
  }), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: () => {
      setPi(0);
      setTheta(0.99);
    }
  }, "Slide 30: 0.1% prevalence"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: () => {
      setPi(1);
      setD(D_COVID);
      setTheta(0.5);
    }
  }, "Slide 35: the COVID test"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: () => {
      // Slide 32: the most specific threshold that still has sensitivity 0.95.
      const tt = d / 2 - 1.6448536;
      setTheta(Math.min(0.99, Math.max(0.01, Math.round(sigmoid(tt) * 100) / 100)));
    }
  }, "Slide 32: sensitivity 0.95")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      alignItems: "flex-start",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: rs,
    style: {
      flex: `1 1 ${W}px`,
      minWidth: 0,
      maxWidth: W,
      aspectRatio: `${W} / ${H}`
    },
    "aria-label": `Score distributions with separation ${d.toFixed(2)} and the threshold at theta ${theta.toFixed(2)}`
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: rr,
    style: {
      flex: `1 1 ${W - 60}px`,
      minWidth: 0,
      maxWidth: W - 60,
      aspectRatio: `${W - 60} / ${H}`
    },
    "aria-label": `ROC curve with AUC ${auc.toFixed(3)}; operating point FPR ${rates.fpr.toFixed(3)}, TPR ${rates.tpr.toFixed(3)}`
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      borderCollapse: "collapse",
      fontSize: "13px"
    },
    "aria-label": "Confusion matrix for 10,000 people"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "truly positive"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "truly negative"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "predicted +"), cell("TP", k.TP, C.pos, false), cell("FP", k.FP, C.neg, true)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "predicted \u2212"), cell("FN", k.FN, C.pos, true), cell("TN", k.TN, C.neg, false)))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0,
      whiteSpace: "pre"
    }
  }, `sensitivity (recall) ${fmt(m.recall)}\nspecificity          ${fmt(m.specificity)}\nprecision            ${fmt(m.precision)}\naccuracy             ${fmt(m.accuracy)}\nF1                   ${fmt(m.f1)}\nMCC                  ${fmt(m.mcc)}`)), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.5
    }
  }, "Left: the model's scores for each class, each hump scaled to area 1; the dashed line is the threshold, at s = log(\u03B8 / (1 \u2212 \u03B8)). Heavy shading, here and in the matrix, is the two kinds of error. Right: the ROC curve, traced by sliding \u03B8 from 1 down to 0, with the current operating point ringed. Change the prevalence: the curve, the AUC, sensitivity and specificity do not move; precision does, and so does accuracy, which is prevalence \xD7 sensitivity + (1 \u2212 prevalence) \xD7 specificity. Separation is the only control that changes the ROC, because only a better model pulls the humps apart."));
}