import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, sineSample, polyFit, polyEval, rmse, eoutNoisy, TARGET } from "@course/logic";

/* Slide 32 of FML04, made to move. Ten noisy points from a sine, fit by a degree-M
   polynomial. The thing to watch is that E_in falls monotonically while E_out turns
   around: at M = 9 the curve passes through all ten points, E_in hits zero, and the
   fit is useless everywhere between them. */

const W = 620, H = 300, SIGMA = 0.2;

/* A Plot that knows what a fitted polynomial looks like. The base class owns the
   coordinate system and the chrome; this owns the three marks that make the point. */
class FitPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, { width: W, height: H, pad: 34, padRight: 10,
      xDomain: [0, 1], yDomain: [-1.9, 1.9], colors });
  }

  render({ xs, ys, w }) {
    const C = this.C;
    this.grid({ yTicks: 4 }).axes({ atY: 0 });
    // the noise-free curve the data actually came from
    this.curve(TARGET, { color: C.muted, width: 1.75, dash: [5, 4] });
    this.curve((x) => polyEval(w, x), { color: C.acc, width: 2.25 });
    xs.forEach((x, i) => this.dot(x, ys[i], { color: C.pos }));
    this.label("x", this.right, this.bottom + 15, { align: "right" });
    this.label("y", this.left - 6, this.top + 6, { align: "right" });
    return this;
  }
}

export default function App() {
  const C = useClassColors();
  const [M, setM] = React.useState(3);
  const [seed, setSeed] = React.useState(3);
  const ref = React.useRef(null);

  const { xs, ys } = React.useMemo(() => sineSample(10, SIGMA, rng(seed)), [seed]);
  const w = React.useMemo(() => polyFit(xs, ys, M), [xs, ys, M]);
  const ein = rmse(w, xs, ys), eout = eoutNoisy(w, SIGMA);

  React.useEffect(() => {
    if (ref.current) new FitPlot(ref.current, C).render({ xs, ys, w });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: C.fg }}>
      <h2 className="sr-only">Polynomial fits of increasing degree to ten noisy points from a sine, with in-sample and out-of-sample error.</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={labelStyle(C)}>degree M</span>
        <input type="range" min="0" max="9" step="1" value={M} onChange={(e) => setM(+e.target.value)}
          aria-label="Polynomial degree M" style={{ flex: "1 1 150px", minWidth: "130px", accentColor: C.acc }} />
        <span style={{ ...readoutStyle(C), margin: 0, minWidth: "3.5em" }}>M = {M}</span>
        <button type="button" style={buttonStyle(C)} onClick={() => setSeed((s) => s + 1)}>New sample</button>
        <button type="button" style={buttonStyle(C, M === 9)} onClick={() => setM(9)}>Jump to M = 9</button>
      </div>
      <canvas ref={ref} style={{ width: "100%", maxWidth: W, aspectRatio: `${W} / ${H}` }}
        aria-label={`Degree ${M} polynomial fit; in-sample error ${ein.toFixed(3)}, out-of-sample error ${eout.toFixed(3)}`} />
      <p style={{ ...readoutStyle(C), margin: 0 }}>
        E_in = {ein.toFixed(3)}    E_out = {eout.toFixed(3)}
      </p>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>
        Dashed grey is the target the data came from, the solid line is the fit, dots are
        the ten training points. Raising M always drives E_in down, because a richer
        hypothesis set can only fit the sample better. E_out does not follow: it bottoms
        out near M = 3 and then climbs. At M = 9 the curve passes through every point,
        E_in reaches zero, and the fit is worthless between them. Zero training error is
        not evidence of learning.
      </p>
    </div>
  );
}
