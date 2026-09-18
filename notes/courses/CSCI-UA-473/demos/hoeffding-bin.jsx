import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, HistogramPlot } from "@course";
import { rng, sampleNus, missRate, hoeffding } from "@course/logic";

/* The bin experiment with the bound drawn on top of it. Two claims from note 04 are
   checkable here rather than takeable on faith: the bound never moves when you drag
   mu, and the exponent is eps^2 N, so halving eps costs four times the data. */

const TRIALS = 500;
const W = 620, H = 240;

class BinPlot extends HistogramPlot {
  constructor(canvas, colors) {
    super(canvas, { width: W, height: H, pad: 30, padTop: 14, padRight: 12,
      xDomain: [0, 1], yDomain: [0, 1], colors });
  }

  render({ nus, mu, eps }) {
    const C = this.C;
    // everything inside the band is a sample that did not miss
    this.band(Math.max(0, mu - eps), Math.min(1, mu + eps), { color: C.acc, alpha: 0.14 });
    this.bins(nus, { bins: 40, inside: (v) => Math.abs(v - mu) <= eps });
    this.axes({ y: false });
    // mu is fixed and unknown; the randomness lives in the sample, so mu gets a hard rule
    this.vline(mu, { color: C.fg, width: 2 });
    this.label("μ", this.x(mu), this.top + 2, { color: C.fg, align: "center" });
    this.label("ν = 0", this.left, this.bottom + 15);
    this.label("ν = 1", this.right, this.bottom + 15, { align: "right" });
    return this;
  }
}

export default function App() {
  const C = useClassColors();
  const [mu, setMu] = React.useState(0.35);
  const [N, setN] = React.useState(100);
  const [eps, setEps] = React.useState(0.1);
  const [seed, setSeed] = React.useState(4);
  const ref = React.useRef(null);

  const nus = React.useMemo(() => sampleNus(mu, N, TRIALS, rng(seed)), [mu, N, seed]);
  const bound = hoeffding(eps, N);
  const miss = missRate(nus, mu, eps);

  React.useEffect(() => {
    if (ref.current) new BinPlot(ref.current, C).render({ nus, mu, eps });
  });

  const slider = (props) => <input type="range" {...props}
    style={{ flex: "1 1 140px", minWidth: "120px", accentColor: C.acc }} />;
  const row = (label, node, read) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ ...labelStyle(C), minWidth: "2.5em" }}>{label}</span>
      {node}
      <span style={{ ...readoutStyle(C), margin: 0, minWidth: "5em" }}>{read}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: C.fg }}>
      <h2 className="sr-only">Bin experiment: the distribution of the sample fraction nu around the true fraction mu, with the Hoeffding bound.</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {row("μ", slider({ min: 0.05, max: 0.95, step: 0.01, value: mu, "aria-label": "True fraction mu", onChange: (e) => setMu(+e.target.value) }), "μ = " + mu.toFixed(2))}
        {row("N", slider({ min: 10, max: 1000, step: 10, value: N, "aria-label": "Sample size N", onChange: (e) => setN(+e.target.value) }), "N = " + N)}
        {row("ε", slider({ min: 0.02, max: 0.3, step: 0.01, value: eps, "aria-label": "Tolerance epsilon", onChange: (e) => setEps(+e.target.value) }), "ε = " + eps.toFixed(2))}
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button type="button" style={buttonStyle(C)} onClick={() => setSeed((s) => s + 1)}>Resample</button>
        <button type="button" style={buttonStyle(C)} onClick={() => { setEps(0.1); setN(250); }}>&#949; = 0.10, N = 250</button>
        <button type="button" style={buttonStyle(C)} onClick={() => { setEps(0.05); setN(1000); }}>half &#949;, 4&#215; N</button>
      </div>
      <canvas ref={ref} style={{ width: "100%", maxWidth: W, aspectRatio: `${W} / ${H}` }}
        aria-label={`Histogram of nu over ${TRIALS} samples; ${(miss * 100).toFixed(1)} percent missed by more than epsilon, against a bound of ${(bound * 100).toFixed(1)} percent`} />
      <p style={{ ...readoutStyle(C), margin: 0 }}>
        bound 2e^(−2ε²N) = {bound.toFixed(4)}    observed miss rate = {miss.toFixed(4)}
      </p>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>
        Each bar counts samples landing at that ν; shaded bars are within ε of
        μ, red bars missed. Two things to try. Drag μ: the histogram slides along
        but the bound does not change at all, because the bound never mentions μ.
        Then press the two presets in turn: halving ε while quadrupling N leaves the
        bound where it was, which is the ε²N exponent showing up as a price.
      </p>
    </div>
  );
}
