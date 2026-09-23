/* AUTO-GENERATED from h0-vs-h1.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, linesExperiment, SINPI } from "@course/logic";

/* The lecture's worked example (note 06, L6 slides 29-34), with the one control the
   slides do not have.

   f(x) = sin(pi x) on [-1, 1], no noise, N points drawn uniformly. H0 fits a constant,
   H1 a line. At N = 2 the slide's verdict is H0 by a wide margin: bias 0.50 + variance
   0.25 against 0.21 + 1.69. The banner reads that as "match the model complexity to the
   data resources", and the N slider is what makes the sentence checkable: the target
   never changes, and the winner flips at N = 4.

   Each panel is the slide 32/33 pair drawn on one canvas: sixty of the fits (faint),
   their average g-bar (bold), and the band g-bar +- one standard deviation at each x,
   whose squared half-width averaged over x is the variance. The numbers come from
   600,000 / N datasets, not from the sixty drawn; at N = 2 that is 300,000, enough
   to land on the exact values (bias 0.207, variance 1.676) to two decimals. The
   slide's 1.69 is LFD's own simulation running a little high. */

const W = 330,
  H = 250,
  NMAX = 20;
class LinesPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, {
      width: W,
      height: H,
      pad: 26,
      padTop: 16,
      padRight: 10,
      xDomain: [-1, 1],
      yDomain: [-2.5, 2.5],
      colors
    });
  }
  render({
    exp,
    name,
    formula
  }) {
    const C = this.C,
      g = this.g;
    this.grid({
      yTicks: 4,
      edges: false
    }).axes({
      atY: 0,
      atX: 0
    });

    // the variance band, clipped to the panel like every other mark
    g.save();
    g.beginPath();
    g.rect(this.left, this.top, this.right - this.left, this.bottom - this.top);
    g.clip();
    g.fillStyle = C.acc;
    g.globalAlpha = 0.13;
    g.beginPath();
    exp.gbar.forEach((v, i) => {
      const px = this.x(this.gx[i]),
        py = this.y(v + exp.sd[i]);
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    });
    for (let i = exp.gbar.length - 1; i >= 0; i--) g.lineTo(this.x(this.gx[i]), this.y(exp.gbar[i] - exp.sd[i]));
    g.closePath();
    g.fill();
    g.globalAlpha = 1;
    g.restore();
    g.globalAlpha = 0.2;
    exp.fits.forEach(([a, b]) => this.curve(x => a * x + b, {
      color: C.acc,
      width: 1,
      samples: 2
    }));
    g.globalAlpha = 1;
    this.curve(SINPI, {
      color: C.muted,
      width: 1.75,
      dash: [5, 4]
    });
    this.polyline(this.gx.map((x, i) => [x, exp.gbar[i]]), {
      color: C.acc,
      width: 2.75
    });
    this.label(name + ":  " + formula, this.left + 6, this.top + 12, {
      color: C.fg
    });
    this.label("sin(πx)", this.x(0.5), this.y(1) - 8, {
      align: "center"
    });
    this.label("x", this.right, this.y(0) + 14, {
      align: "right"
    });
    return this;
  }
}
const fmt = v => v.toFixed(2);
export default function App() {
  const C = useClassColors();
  const [N, setN] = React.useState(2);
  const [seed, setSeed] = React.useState(1);
  const r0 = React.useRef(null),
    r1 = React.useRef(null);
  const T = Math.round(600000 / N);
  const exp = React.useMemo(() => linesExperiment(N, {
    T
  }, rng(seed * 101 + N)), [N, seed, T]);
  const tot = k => exp[k].bias + exp[k].variance;
  const winner = tot("h0") < tot("h1") ? "H0" : "H1";
  React.useEffect(() => {
    for (const [ref, k, name, formula] of [[r0, "h0", "H0", "h(x) = b"], [r1, "h1", "H1", "h(x) = ax + b"]]) {
      if (!ref.current) continue;
      const p = new LinesPlot(ref.current, C);
      p.gx = exp.gx;
      p.render({
        exp: exp[k],
        name,
        formula
      });
    }
  });
  const line = (k, name) => `${name}:  bias = ${fmt(exp[k].bias)}   var = ${fmt(exp[k].variance)}   bias + var = ${fmt(tot(k))}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "The sin of pi x example: constant fits and line fits to N points each, repeated over many datasets, with their average hypothesis, a one-standard-deviation band, and the bias and variance of each hypothesis set as N changes."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "points per dataset N"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "2",
    max: NMAX,
    step: "1",
    value: N,
    onChange: e => setN(+e.target.value),
    "aria-label": "Number of training points N",
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
  }, "N = ", N), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, N === 2),
    onClick: () => setN(2)
  }, "N = 2 (slide)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, N === 4),
    onClick: () => setN(4)
  }, "N = 4"), /*#__PURE__*/React.createElement("button", {
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
    ref: r0,
    style: {
      flex: `1 1 ${W}px`,
      maxWidth: W,
      aspectRatio: `${W} / ${H}`
    },
    "aria-label": `Constant fits at N = ${N}: bias ${fmt(exp.h0.bias)}, variance ${fmt(exp.h0.variance)}`
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: r1,
    style: {
      flex: `1 1 ${W}px`,
      maxWidth: W,
      aspectRatio: `${W} / ${H}`
    },
    "aria-label": `Line fits at N = ${N}: bias ${fmt(exp.h1.bias)}, variance ${fmt(exp.h1.variance)}`
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, line("h0", "H0"), /*#__PURE__*/React.createElement("br", null), line("h1", "H1"), /*#__PURE__*/React.createElement("br", null), "at N = ", N, ", ", winner, " wins (", fmt(Math.min(tot("h0"), tot("h1"))), " against ", fmt(Math.max(tot("h0"), tot("h1"))), ")"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.5
    }
  }, "Each panel: sixty datasets' fits (faint), their average \u1E21 (bold), the band \u1E21 \xB1 one standard deviation, and the dashed target. The numbers are over ", T.toLocaleString("en-US"), " datasets (the slide's 1.69 for H1's variance is a simulation estimate; the exact value is 1.68). Walk N up: bias hardly changes for either set, variance falls for both, and the lines overtake the constants at N = 4 without anything about f changing."));
}