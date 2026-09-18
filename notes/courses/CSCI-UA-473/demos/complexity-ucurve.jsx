import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, sineSample, polyFit, rmse, eoutNoisy } from "@course/logic";

/* The two primary questions, drawn against each other. E_in answers "is E_in small",
   the gap between the curves answers "is E_in close to E_out", and complexity trades
   one for the other. Same ten points as the overfitting figure, fitted at every
   degree at once so the shape is visible rather than remembered. */

const W = 620, H = 290, MAXM = 9, SIGMA = 0.2;

class UCurvePlot extends Plot {
  constructor(canvas, colors, yHi) {
    super(canvas, { width: W, height: H, pad: 44, padTop: 16, padRight: 14,
      xDomain: [0, MAXM], yDomain: [0, yHi], colors });
  }

  render({ ein, eout, M }) {
    const C = this.C;
    this.grid({ yTicks: 4 });

    // the generalization gap is the quantity Hoeffding bounds, so it is drawn as an
    // area rather than left for the reader to subtract two curves by eye
    const g = this.g;
    g.fillStyle = C.neg; g.globalAlpha = 0.12;
    g.beginPath();
    ein.forEach((v, i) => (i ? g.lineTo(this.x(i), this.y(v)) : g.moveTo(this.x(i), this.y(v))));
    for (let i = eout.length - 1; i >= 0; i--) g.lineTo(this.x(i), this.y(eout[i]));
    g.closePath(); g.fill(); g.globalAlpha = 1;

    this.axes();
    this.polyline(eout.map((v, i) => [i, v]), { color: C.neg, width: 2.25 });
    this.polyline(ein.map((v, i) => [i, v]), { color: C.pos, width: 2.25 });
    eout.forEach((v, i) => this.dot(i, v, { color: C.neg, r: 3, halo: true }));
    ein.forEach((v, i) => this.dot(i, v, { color: C.pos, r: 3, halo: true }));

    // the chosen complexity, and the degree that actually minimizes E_out
    const best = eout.indexOf(Math.min(...eout));
    this.vline(best, { color: C.muted, width: 1.25, dash: [4, 3] });
    this.label("best M = " + best, this.x(best) + (best > MAXM / 2 ? -6 : 6), this.top + 12,
      { align: best > MAXM / 2 ? "right" : "left" });
    this.vline(M, { color: C.acc, width: 2 });

    for (let m = 0; m <= MAXM; m += 3) this.label(String(m), this.x(m), this.bottom + 16, { align: "center" });
    // the vertical axis carried no scale, so the error values could not be read off it
    for (let k = 1; k <= 4; k++) {
      const v = (k / 4) * this.yDomain[1];
      this.label(v.toFixed(2), this.left - 6, this.y(v) + 4, { align: "right" });
    }
    return this;
  }
}

export default function App() {
  const C = useClassColors();
  const [M, setM] = React.useState(3);
  const [seed, setSeed] = React.useState(3);
  const ref = React.useRef(null);

  const { ein, eout } = React.useMemo(() => {
    const { xs, ys } = sineSample(10, SIGMA, rng(seed));
    const ei = [], eo = [];
    for (let m = 0; m <= MAXM; m++) {
      const w = polyFit(xs, ys, m);
      ei.push(rmse(w, xs, ys));
      eo.push(Math.min(eoutNoisy(w, SIGMA), 2.5));   // clamp so one wild degree cannot flatten the rest
    }
    return { ein: ei, eout: eo };
  }, [seed]);

  const yHi = Math.max(0.6, Math.max(...eout) * 1.15);
  React.useEffect(() => {
    if (ref.current) new UCurvePlot(ref.current, C, yHi).render({ ein, eout, M });
  });

  const gap = eout[M] - ein[M];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: C.fg }}>
      <h2 className="sr-only">In-sample and out-of-sample error against polynomial degree, with the generalization gap shaded.</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={labelStyle(C)}>degree M</span>
        <input type="range" min="0" max={MAXM} step="1" value={M} onChange={(e) => setM(+e.target.value)}
          aria-label="Polynomial degree M" style={{ flex: "1 1 150px", minWidth: "130px", accentColor: C.acc }} />
        <span style={{ ...readoutStyle(C), margin: 0, minWidth: "3.5em" }}>M = {M}</span>
        <button type="button" style={buttonStyle(C)} onClick={() => setSeed((s) => s + 1)}>New sample</button>
      </div>
      <canvas ref={ref} style={{ width: "100%", maxWidth: W, aspectRatio: `${W} / ${H}` }}
        aria-label={`Error against complexity; at degree ${M} the gap between out-of-sample and in-sample error is ${gap.toFixed(3)}`} />
      <p style={{ ...readoutStyle(C), margin: 0 }}>
        at M = {M}:  E_in = {ein[M].toFixed(3)}   E_out = {eout[M].toFixed(3)}   gap = {gap.toFixed(3)}
      </p>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>
        The lower curve is E_in, the upper one is E_out, and the shaded area between them
        is the generalization gap - the only quantity Hoeffding bounds. Read the two
        primary questions off the picture: E_in falling is question two getting easier,
        the shaded area widening is question one getting harder, and neither curve alone
        tells you where to stand. The dashed line marks the degree that actually
        minimizes E_out; nothing you can compute from the training set alone points at it.
      </p>
    </div>
  );
}
