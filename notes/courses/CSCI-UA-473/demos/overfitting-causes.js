/* AUTO-GENERATED from overfitting-causes.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, overfitTrial, overfitSummary, polyEval } from "@course/logic";

/* What drives overfitting (note 06, L6 slides 5-6).

   Slide 5 is a three-row table: more data points, less overfitting; more noise,
   more; a more complex target, more. Slide 6 shows two LFD experiments, a degree-2
   and a degree-10 fit to the same small sample. This puts the three rows on
   sliders and runs the slide 6 experiment under them.

   The target is LFD's: a random Legendre series of degree Q_f, scaled so E[f^2] = 1
   whatever Q_f is, so "more complex" never also means "bigger". The panel is one
   draw. The summary underneath is 250 draws, each with a new target and new data,
   because one draw can say anything: how often the degree-10 fit ends up with the
   larger E_out, and the median amount by which it loses (negative when it wins).
   A median rather than a mean because at small N the excess is in the hundreds on
   some draws and a mean just reports those. */

const W = 460,
  H = 280,
  TRIALS = 250;
class FitPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, {
      width: W,
      height: H,
      pad: 26,
      padTop: 16,
      padRight: 10,
      xDomain: [-1, 1],
      yDomain: [-3, 3],
      colors
    });
  }
  render({
    trial
  }) {
    const C = this.C;
    this.grid({
      yTicks: 6,
      edges: false
    }).axes({
      atY: 0,
      atX: 0
    });
    this.curve(trial.f, {
      color: C.muted,
      width: 1.75,
      dash: [5, 4],
      samples: 500
    });
    this.curve(x => polyEval(trial.w[2], x), {
      color: C.pos,
      width: 2.25
    });
    this.curve(x => polyEval(trial.w[10], x), {
      color: C.neg,
      width: 2.25,
      samples: 500
    });
    trial.xs.forEach((x, i) => this.dot(x, trial.ys[i], {
      color: C.fg,
      r: 3.25
    }));
    return this;
  }
}
const fmt = v => Math.abs(v) < 10 ? v.toFixed(3) : Math.abs(v) < 1e4 ? v.toFixed(1) : v.toExponential(1);
function Slider({
  C,
  label,
  value,
  set,
  min,
  max,
  step,
  show
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flex: "1 1 220px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...labelStyle(C),
      minWidth: "8.5em"
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => set(+e.target.value),
    "aria-label": label,
    style: {
      flex: "1 1 100px",
      minWidth: "90px",
      accentColor: C.acc
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...readoutStyle(C),
      margin: 0,
      minWidth: "3em"
    }
  }, show(value)));
}
export default function App() {
  const C = useClassColors();
  const [N, setN] = React.useState(15);
  const [sigma, setSigma] = React.useState(0.5);
  const [Q, setQ] = React.useState(10);
  const [seed, setSeed] = React.useState(4);
  const [summary, setSummary] = React.useState(null);
  const [stale, setStale] = React.useState(true);
  const ref = React.useRef(null);
  const trial = React.useMemo(() => overfitTrial({
    N,
    sigma,
    Q
  }, rng(seed)), [N, sigma, Q, seed]);

  // 250 fresh experiments per setting is a few hundred milliseconds, so it waits for
  // the slider to settle instead of running on every input event
  React.useEffect(() => {
    setStale(true);
    const t = setTimeout(() => {
      setSummary(overfitSummary({
        N,
        sigma,
        Q,
        trials: TRIALS
      }, rng(99)));
      setStale(false);
    }, 160);
    return () => clearTimeout(t);
  }, [N, sigma, Q]);
  React.useEffect(() => {
    if (ref.current) new FitPlot(ref.current, C).render({
      trial
    });
  });
  const preset = (n, s, q) => {
    setN(n);
    setSigma(s);
    setQ(q);
  };
  const cell = {
    padding: "2px 12px 2px 0",
    textAlign: "right"
  };
  const pct = summary ? Math.round(summary.worse * 100) : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "Degree-2 and degree-10 polynomial fits to a small noisy sample from a random target, with sliders for the number of points, the noise level and the complexity of the target, and how often the degree-10 fit generalizes worse."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px 18px"
    }
  }, /*#__PURE__*/React.createElement(Slider, {
    C: C,
    label: "data points N",
    value: N,
    set: setN,
    min: 12,
    max: 120,
    step: 1,
    show: v => v
  }), /*#__PURE__*/React.createElement(Slider, {
    C: C,
    label: "noise \u03C3",
    value: sigma,
    set: setSigma,
    min: 0,
    max: 1.5,
    step: 0.05,
    show: v => v.toFixed(2)
  }), /*#__PURE__*/React.createElement(Slider, {
    C: C,
    label: "target degree Q_f",
    value: Q,
    set: setQ,
    min: 1,
    max: 50,
    step: 1,
    show: v => v
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, N === 15 && sigma === 0.5 && Q === 10),
    onClick: () => preset(15, 0.5, 10)
  }, "Slide 6 left: degree 10 + noise"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, N === 15 && sigma === 0 && Q === 50),
    onClick: () => preset(15, 0, 50)
  }, "Slide 6 right: degree 50, no noise"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: () => setSeed(s => s + 1)
  }, "New draw")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    style: {
      flex: `1 1 ${W}px`,
      maxWidth: W,
      aspectRatio: `${W} / ${H}`
    },
    "aria-label": `One draw: the degree 2 fit has out-of-sample error ${fmt(trial.eout[2])} and the degree 10 fit ${fmt(trial.eout[10])}`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "0 1 220px",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      ...readoutStyle(C),
      borderCollapse: "collapse",
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...cell,
      textAlign: "left"
    }
  }, "this draw"), /*#__PURE__*/React.createElement("th", {
    style: cell
  }, "E_in"), /*#__PURE__*/React.createElement("th", {
    style: cell
  }, "E_out"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      color: C.pos
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...cell,
      textAlign: "left"
    }
  }, "degree 2"), /*#__PURE__*/React.createElement("td", {
    style: cell
  }, fmt(trial.ein[2])), /*#__PURE__*/React.createElement("td", {
    style: cell
  }, fmt(trial.eout[2]))), /*#__PURE__*/React.createElement("tr", {
    style: {
      color: C.neg
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...cell,
      textAlign: "left"
    }
  }, "degree 10"), /*#__PURE__*/React.createElement("td", {
    style: cell
  }, fmt(trial.ein[10])), /*#__PURE__*/React.createElement("td", {
    style: cell
  }, fmt(trial.eout[10]))))), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: stale ? 0.45 : 1,
      transition: "opacity .2s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...labelStyle(C),
      marginBottom: "4px"
    }
  }, "over ", TRIALS, " draws, degree 10 generalizes worse in"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "14px",
      borderRadius: "4px",
      border: `1px solid ${C.border}`,
      overflow: "hidden"
    },
    role: "img",
    "aria-label": `${pct} percent of draws`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + "%",
      height: "100%",
      background: C.neg,
      opacity: 0.8
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: "4px 0 0"
    }
  }, summary ? `${pct}% of draws;  median excess E_out = ${fmt(summary.median)}` : "…")))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.5
    }
  }, "The dashed curve is a random target of degree Q_f, the dots are N noisy samples of it, and the two fits are least squares at degree 2 (green) and 10 (orange). The buttons set up slide 6's two experiments with fifteen points each (the noise level on the left is this figure's choice; the slide does not state it). Then move one slider at a time against slide 5's table. More points shrinks the orange bar; by N = 80 the degree-10 fit usually wins. More noise grows it. For target degree, compare a setting below 10 with one above it, with the noise at zero."));
}