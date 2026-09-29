import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, biasVariance, regimeOf, bvEval, TARGET } from "@course/logic";

/* High bias against high variance, on the complexity curve (note 06, L6 slides 25-28).

   Right: slide 28's picture, measured rather than sketched. E_in (the mean training
   error) falls with every degree added; E_out (bias^2 + variance + sigma^2) falls,
   flattens, then climbs. The dashed pair underneath is the decomposition of E_out's
   excess over the noise floor. The background says which side of the U each degree
   is on, read off the decomposition (see regimeOf).

   Left: what the two sides look like as fits. Forty datasets from the same target and
   noise, a degree-M fit to each (faint), their average g-bar (bold), and one of the
   forty with its own ten points, so E_in has something to point at. At M = 1 the
   fits agree with each other and are all wrong together: high bias. At M = 9 the one
   highlighted fit threads all ten of its points (E_in = 0) and the forty disagree
   wildly: high variance.

   The table under the plots is the diagnostic reading of the same numbers: which
   symptoms tell the two failures apart, and what helps each. The ten x positions
   are fixed and only the noise is redrawn, so the variance is noise-driven.
   Redrawing x as well (the deck's E_D) sends the M >= 7 variances past 10^3, which
   forty samples cannot average into a readable curve. */

const W = 360, H = 260, SW = 330, SH = 260, MAXM = 9, K = 40, N = 10, SIGMA = 0.2, YHI = 0.8;

class FitsPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, { width: W, height: H, pad: 26, padTop: 22, padRight: 10,
      xDomain: [0, 1], yDomain: [-1.9, 1.9], colors });
  }

  render({ fits, gx, gbar, samples }) {
    const C = this.C, g = this.g;
    this.grid({ yTicks: 4, edges: false }).axes({ atY: 0 });
    g.globalAlpha = 0.16;
    fits.forEach((w) => this.curve((x) => bvEval(w, x), { color: C.acc, width: 1 }));
    g.globalAlpha = 1;
    this.curve(TARGET, { color: C.muted, width: 1.75, dash: [5, 4] });
    this.polyline(gx.map((x, i) => [x, gbar[i]]), { color: C.acc, width: 2.75 });
    // one dataset and its own fit, so "E_in" is something on the screen
    this.curve((x) => bvEval(fits[0], x), { color: C.fg, width: 1.4 });
    samples[0].xs.forEach((x, i) => this.dot(x, samples[0].ys[i], { color: C.fg, r: 3.2 }));
    this.label("ḡ = average of the " + K + " fits (thick);  one fit and its 10 points (solid)", this.left + 4, this.top - 6, { color: C.fg, size: 10.5 });
    this.label("f", this.x(0.75), this.y(TARGET(0.75)) + 18, { align: "center" });
    this.label("x", this.right, this.bottom + 14, { align: "right" });
    return this;
  }
}

const REGIME = {
  bias: { label: "high bias", tone: "pos" },
  balanced: { label: "balanced", tone: "mid" },
  variance: { label: "high variance", tone: "neg" },
};

class ErrorPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, { width: SW, height: SH, pad: 36, padTop: 22, padRight: 12,
      xDomain: [-0.5, MAXM + 0.5], yDomain: [0, YHI], colors });
  }

  render({ all, regimes, M }) {
    const C = this.C, g = this.g;
    regimes.forEach((r, m) => this.band(m - 0.5, m + 0.5, { color: C[REGIME[r].tone], alpha: 0.09 }));
    this.grid({ yTicks: 4, edges: false }).axes({ atX: -0.5 });
    const S = (k) => all.map((r, m) => [m, Math.min(r[k], YHI)]);
    this.polyline([[-0.5, SIGMA * SIGMA], [MAXM + 0.5, SIGMA * SIGMA]], { color: C.muted, width: 1, dash: [2, 3] });
    this.polyline(S("bias2"), { color: C.pos, width: 1.5, dash: [5, 3] });
    this.polyline(S("variance"), { color: C.acc, width: 1.5, dash: [5, 3] });
    this.polyline(S("eout"), { color: C.neg, width: 2.75 });
    this.polyline(S("ein"), { color: C.fg, width: 2.75 });
    S("eout").forEach(([m, v]) => this.dot(m, v, { color: C.neg, r: 2.8 }));
    // E_out at the top degrees runs far off the axis (about 8 at M = 9): mark the
    // clipped points with their true value rather than silently flattening them.
    // One label for all of them: a resample can clip M = 8 as well, and two labels
    // side by side collide.
    const clipped = all.map((r, m) => [m, r.eout]).filter(([, v]) => v > YHI);
    if (clipped.length) {
      const txt = "↑ " + clipped.map(([, v]) => (v < 10 ? v.toFixed(1) : Math.round(v))).join(", ");
      this.labelAt(txt, clipped[0][0], YHI, { dy: 10, dx: -8, align: "right", color: C.neg, size: 10 });
    }
    S("ein").forEach(([m, v]) => this.dot(m, v, { color: C.fg, r: 2.8 }));
    this.vline(M, { color: C.fg, width: 1.25, dash: [3, 3] });

    // region names across the top, one per contiguous run
    let start = 0;
    for (let m = 1; m <= regimes.length; m++) {
      if (m === regimes.length || regimes[m] !== regimes[start]) {
        const mid = (start + m - 1) / 2, lab = REGIME[regimes[start]].label;
        if (m - start >= 2 || lab !== "balanced") this.label(lab, this.x(mid), this.top - 7, { align: "center", color: C.fg, size: 10.5 });
        start = m;
      }
    }
    this.labelAt("E_out", 5, all[5].eout, { dy: -9, align: "center", color: C.neg });
    this.labelAt("E_in", 8.3, all[8].ein, { dy: -8, align: "center", color: C.fg });
    this.labelAt("bias²", 1.5, (all[1].bias2 + all[2].bias2) / 2, { dy: 14, align: "center", color: C.pos, size: 10.5 });
    this.labelAt("variance", 6.9, Math.min(all[7].variance, YHI), { dx: -4, dy: -2, align: "right", color: C.acc, size: 10.5 });
    this.labelAt("σ² (noise floor)", 1.2, SIGMA * SIGMA, { dy: -4, align: "center", size: 10 });
    for (let m = 0; m <= MAXM; m += 3) this.labelAt(String(m), m, 0, { dy: 14, align: "center" });
    this.label("model complexity: degree M", (this.left + this.right) / 2, this.bottom + 28, { align: "center" });
    for (let k = 1; k <= 3; k++) {
      const v = (k / 4) * YHI;
      this.label(v.toFixed(2), this.left - 5, this.y(v) + 4, { align: "right" });
    }
    return this;
  }
}

const ROWS = [
  { key: "bias", E: "high", gap: "small", fits: "agree with each other, all wrong the same way", fix: "a bigger H, more or better features, less regularization" },
  { key: "balanced", E: "near σ²", gap: "small", fits: "scatter a little around a ḡ close to f", fix: "nothing: this is the bottom of the U" },
  { key: "variance", E: "low, even below σ²", gap: "large", fits: "follow their own noise, disagree wildly", fix: "more data, regularization, a smaller H" },
];

export default function App() {
  const C = useClassColors();
  const [M, setM] = React.useState(1);
  const [seed, setSeed] = React.useState(5);
  const ref = React.useRef(null), sref = React.useRef(null);

  const all = React.useMemo(
    () => Array.from({ length: MAXM + 1 }, (_, m) => biasVariance(m, { K, N, sigma: SIGMA }, rng(seed + 31 * m))),
    [seed]);
  const best = Math.min(...all.map((r) => r.eout));
  const regimes = all.map((r) => regimeOf(r, best));
  const cur = all[M], reg = regimes[M];

  React.useEffect(() => {
    if (ref.current) new FitsPlot(ref.current, C).render(cur);
    if (sref.current) new ErrorPlot(sref.current, C).render({ all, regimes, M });
  });

  const td = { padding: "5px 8px", borderTop: `1px solid ${C.border}`, verticalAlign: "top" };
  const th = { ...td, color: C.muted, fontWeight: 400, textAlign: "left", borderTop: "none" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: C.fg }}>
      <h2 className="sr-only">High bias against high variance: forty polynomial fits of degree M with their average, next to training and test error against model complexity, with the bias-squared and variance curves and the regions where each dominates.</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={labelStyle(C)}>degree M</span>
        <input type="range" min="0" max={MAXM} step="1" value={M} onChange={(e) => setM(+e.target.value)}
          aria-label="Polynomial degree M" style={{ flex: "1 1 140px", minWidth: "120px", accentColor: C.acc }} />
        <span style={{ ...readoutStyle(C), margin: 0, minWidth: "3.5em" }}>M = {M}</span>
        <button type="button" style={buttonStyle(C, M === 1)} onClick={() => setM(1)}>High bias (M = 1)</button>
        <button type="button" style={buttonStyle(C, M === 4)} onClick={() => setM(4)}>Balanced (M = 4)</button>
        <button type="button" style={buttonStyle(C, M === 9)} onClick={() => setM(9)}>High variance (M = 9)</button>
        <button type="button" style={buttonStyle(C)} onClick={() => setSeed((s) => s + 1)}>Resample</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-start", justifyContent: "center" }}>
        <canvas ref={ref} style={{ flex: `1 1 ${W}px`, minWidth: 0, maxWidth: W, aspectRatio: `${W} / ${H}` }}
          aria-label={`${K} degree-${M} fits to ${K} samples of ${N} points, their average, one highlighted fit with its points, and the target`} />
        <canvas ref={sref} style={{ flex: `1 1 ${SW}px`, minWidth: 0, maxWidth: SW, aspectRatio: `${SW} / ${SH}` }}
          aria-label={`Training and test error against degree, with bias squared and variance; M = ${M} is ${REGIME[reg].label}`} />
      </div>
      <p style={{ ...readoutStyle(C), margin: 0 }}>
        at M = {M} ({REGIME[reg].label}):  E_in = {cur.ein.toFixed(3)}   E_out = {cur.eout.toFixed(3)}   gap = {(cur.eout - cur.ein).toFixed(3)}
        <br />bias² = {cur.bias2.toFixed(3)}   variance = {cur.variance.toFixed(3)}   σ² = {(SIGMA * SIGMA).toFixed(3)}
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", fontSize: "12.5px", lineHeight: 1.4, width: "100%", minWidth: 540 }}>
          <thead>
            <tr><th style={th} /><th style={th}>E_in</th><th style={th}>E_out − E_in</th><th style={th}>the forty fits</th><th style={th}>what helps</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const on = r.key === reg;
              const tone = C[REGIME[r.key].tone];
              return (
                <tr key={r.key} style={{ background: on ? tone + "22" : "transparent", color: on ? C.fg : C.muted }}>
                  <td style={{ ...td, fontWeight: on ? 600 : 400, borderLeft: `3px solid ${on ? tone : "transparent"}`, whiteSpace: "nowrap" }}>{REGIME[r.key].label}</td>
                  <td style={td}>{r.E}</td><td style={td}>{r.gap}</td><td style={td}>{r.fits}</td><td style={td}>{r.fix}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>
        Right: training error E_in falls with every degree; test error E_out = bias² + variance + σ²
        falls, flattens, then climbs. The shading marks where bias² outweighs variance (left) and
        where E_out has climbed well above its best and the excess is mostly variance (right).
        Left: the forty fits at the current degree. M = 1 and M = 7 both miss the best E_out by a wide
        margin (about 0.25 and 0.19, against 0.06) and fail for opposite reasons, and the table is how to tell them apart from the
        numbers alone: a high-bias model is bad on its own training data too, a high-variance
        model is good there and bad everywhere else. More data shrinks variance and does
        nothing for bias.
      </p>
    </div>
  );
}
