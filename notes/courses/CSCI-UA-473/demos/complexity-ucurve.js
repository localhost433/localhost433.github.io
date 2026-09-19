/* AUTO-GENERATED from complexity-ucurve.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, sineSample, sineSampleRandom, polyFit, polyEval, rmse, eoutNoisy, argmin, TARGET } from "@course/logic";

/* The two primary questions, drawn against each other. E_in answers "is E_in small",
   the gap between the curves answers "is E_in close to E_out", and complexity trades
   one for the other. Same ten points as the overfitting figure, fitted at every
   degree at once so the shape is visible rather than remembered.

   The third curve is the one you can actually compute: the error on a held-out
   validation sample. It tracks E_out with noise, and the degree it picks is the only
   handle on the U that does not require knowing the target. Picking by it is
   selecting among M hypotheses one level up, so its error at the chosen degree is
   optimistic - which is what the separate test sample is there to show. */

const W = 470,
  H = 290,
  FW = 264,
  MAXM = 9,
  SIGMA = 0.2,
  NVAL = 10,
  NTEST = 200;
class UCurvePlot extends Plot {
  constructor(canvas, colors, yHi) {
    super(canvas, {
      width: W,
      height: H,
      pad: 44,
      padTop: 16,
      padRight: 14,
      xDomain: [0, MAXM],
      yDomain: [0, yHi],
      colors
    });
  }
  render({
    ein,
    eout,
    eval_,
    M,
    picked
  }) {
    const C = this.C;
    this.grid({
      yTicks: 4
    });

    // the generalization gap is the quantity Hoeffding bounds, so it is drawn as an
    // area rather than left for the reader to subtract two curves by eye
    const g = this.g;
    g.fillStyle = C.neg;
    g.globalAlpha = 0.12;
    g.beginPath();
    ein.forEach((v, i) => i ? g.lineTo(this.x(i), this.y(v)) : g.moveTo(this.x(i), this.y(v)));
    for (let i = eout.length - 1; i >= 0; i--) g.lineTo(this.x(i), this.y(eout[i]));
    g.closePath();
    g.fill();
    g.globalAlpha = 1;
    this.axes();
    this.polyline(eval_.map((v, i) => [i, v]), {
      color: C.acc,
      width: 1.75,
      dash: [5, 4]
    });
    this.polyline(eout.map((v, i) => [i, v]), {
      color: C.neg,
      width: 2.25
    });
    this.polyline(ein.map((v, i) => [i, v]), {
      color: C.pos,
      width: 2.25
    });
    eval_.forEach((v, i) => this.dot(i, v, {
      color: C.acc,
      r: 2.5,
      halo: true
    }));
    eout.forEach((v, i) => this.dot(i, v, {
      color: C.neg,
      r: 3,
      halo: true
    }));
    ein.forEach((v, i) => this.dot(i, v, {
      color: C.pos,
      r: 3,
      halo: true
    }));

    // the chosen complexity, the degree that actually minimizes E_out, and the one
    // validation would pick
    const best = eout.indexOf(Math.min(...eout));
    this.vline(best, {
      color: C.muted,
      width: 1.25,
      dash: [4, 3]
    });
    this.label("best M = " + best, this.x(best) + (best > MAXM / 2 ? -6 : 6), this.top + 12, {
      align: best > MAXM / 2 ? "right" : "left"
    });
    if (picked !== best) {
      this.label("validation picks " + picked, this.x(picked) + (picked > MAXM / 2 ? -6 : 6), this.top + 26, {
        align: picked > MAXM / 2 ? "right" : "left",
        color: C.acc
      });
    } else {
      this.label("= validation's pick", this.x(best) + (best > MAXM / 2 ? -6 : 6), this.top + 26, {
        align: best > MAXM / 2 ? "right" : "left",
        color: C.acc
      });
    }
    this.vline(M, {
      color: C.acc,
      width: 2
    });
    this.label("E_in", this.right - 4, this.y(ein[MAXM]) - 8, {
      align: "right",
      color: C.pos
    });
    this.label("E_out", this.right - 4, this.y(eout[MAXM]) - 8, {
      align: "right",
      color: C.neg
    });
    this.label("E_val", this.right - 4, this.y(eval_[MAXM]) + 14, {
      align: "right",
      color: C.acc
    });
    for (let m = 0; m <= MAXM; m += 3) this.label(String(m), this.x(m), this.bottom + 16, {
      align: "center"
    });
    // the vertical axis carried no scale, so the error values could not be read off it
    for (let k = 1; k <= 4; k++) {
      const v = k / 4 * this.yDomain[1];
      this.label(v.toFixed(2), this.left - 6, this.y(v) + 4, {
        align: "right"
      });
    }
    return this;
  }
}

/* The curve the slider is actually talking about. The U-curve is a summary — one
   number per degree — and a summary of an overfit is not the same experience as
   looking at one. Side by side, moving the slider does two things at once: the
   vertical marker walks along the U, and the wiggle appears. */
class FitPanel extends Plot {
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
    vx,
    vy,
    w
  }) {
    const C = this.C;
    this.grid({
      yTicks: 4
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
    vx.forEach((x, i) => this.dot(x, vy[i], {
      color: C.acc,
      r: 3,
      halo: false,
      ring: null
    }));
    xs.forEach((x, i) => this.dot(x, ys[i], {
      color: C.pos,
      r: 3.5
    }));
    this.label("the fit at this M", this.left + 4, this.top + 12);
    return this;
  }
}
export default function App() {
  const C = useClassColors();
  const [M, setM] = React.useState(3);
  const [seed, setSeed] = React.useState(3);
  const ref = React.useRef(null);
  const fitRef = React.useRef(null);
  const {
    ein,
    eout,
    eval_,
    etest,
    xs,
    ys,
    vx,
    vy
  } = React.useMemo(() => {
    const {
      xs: sx,
      ys: sy
    } = sineSample(10, SIGMA, rng(seed));
    const {
      xs: vx0,
      ys: vy0
    } = sineSampleRandom(NVAL, SIGMA, rng(seed * 7919 + 11));
    const {
      xs: tx,
      ys: ty
    } = sineSampleRandom(NTEST, SIGMA, rng(seed * 104729 + 23));
    const ei = [],
      eo = [],
      ev = [],
      et = [];
    for (let m = 0; m <= MAXM; m++) {
      const w = polyFit(sx, sy, m);
      ei.push(rmse(w, sx, sy));
      eo.push(Math.min(eoutNoisy(w, SIGMA), 2.5)); // clamp so one wild degree cannot flatten the rest
      ev.push(Math.min(rmse(w, vx0, vy0), 2.5));
      et.push(Math.min(rmse(w, tx, ty), 2.5));
    }
    return {
      ein: ei,
      eout: eo,
      eval_: ev,
      etest: et,
      xs: sx,
      ys: sy,
      vx: vx0,
      vy: vy0
    };
  }, [seed]);
  const wM = React.useMemo(() => polyFit(xs, ys, M), [xs, ys, M]);
  const picked = argmin(eval_);
  const yHi = Math.max(0.6, Math.max(...eout, ...eval_) * 1.15);
  React.useEffect(() => {
    if (ref.current) new UCurvePlot(ref.current, C, yHi).render({
      ein,
      eout,
      eval_,
      M,
      picked
    });
    if (fitRef.current) new FitPanel(fitRef.current, C).render({
      xs,
      ys,
      vx,
      vy,
      w: wM
    });
  });
  const gap = eout[M] - ein[M];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "In-sample, validation and out-of-sample error against polynomial degree, with the generalization gap shaded and the degree validation selects marked."), /*#__PURE__*/React.createElement("div", {
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
    style: buttonStyle(C, M === picked),
    onClick: () => setM(picked)
  }, "Pick M by validation"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C),
    onClick: () => setSeed(s => s + 1)
  }, "New sample")), /*#__PURE__*/React.createElement("div", {
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
    "aria-label": `Error against complexity; at degree ${M} the gap between out-of-sample and in-sample error is ${gap.toFixed(3)}; validation selects degree ${picked}`
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: fitRef,
    style: {
      flex: `1 1 ${FW}px`,
      maxWidth: FW,
      aspectRatio: `${FW} / ${H}`
    },
    "aria-label": `The degree ${M} polynomial fitted to the same ten points, with the ten validation points`
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, "at M = ", M, ":  E_in = ", ein[M].toFixed(3), "   E_val = ", eval_[M].toFixed(3), "   E_out = ", eout[M].toFixed(3), "   gap = ", gap.toFixed(3)), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, "validation picks M = ", picked, ":  E_val = ", eval_[picked].toFixed(3), "   E_test (fresh ", NTEST, " points) = ", etest[picked].toFixed(3), etest[picked] > eval_[picked] ? "   — the validation number is optimistic" : ""), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: 0,
      lineHeight: 1.5
    }
  }, "The lower solid curve is E_in, the upper one is E_out, and the shaded area between them is the generalization gap - the only quantity Hoeffding bounds. Read the two primary questions off the picture: E_in falling is question two getting easier, the shaded area widening is question one getting harder, and neither curve alone tells you where to stand. The grey dashed line marks the degree that actually minimizes E_out; nothing you can compute from the training set alone points at it. The dashed curve is what you ", /*#__PURE__*/React.createElement("em", null, "can"), " compute: the error on ten held-out validation points, drawn hollow in the right panel. Press the button to let it choose M, then read its error at that degree against the fresh test sample. The validation error is usually the smaller of the two, because you chose the degree that made it small: that is selection bias, the M-bins argument one level up, and it is why the test set has to stay untouched until the choice is made."));
}