import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, regressionSample, regPath, logSpace, argmin } from "@course/logic";

/* Coefficient paths under ridge and lasso (note 05, after the closing slide of FML05).

   The ridge-vs-lasso figure shows WHY the lasso zeroes a coefficient - the corner - in
   two parameters. This one shows WHAT that does to a real coefficient vector as lambda
   grows: six slopes on sixty rows, the same data for both penalties, one lambda slider.
   Ridge shrinks every coefficient toward zero and never reaches it; the lasso reaches
   it, one coefficient at a time, in an order that tracks how much each feature earns.

   Two of the six features are deliberately correlated (rho = 0.9) with the signal in
   only one of them. Ridge shares the weight between the pair as lambda grows; the
   lasso hands it to one and drops the other. Neither is "right" - the data cannot tell
   the pair apart - but they fail differently, and the difference is the thing to see. */

const PW = 300, PH = 190, BH = 150;
const LO = -1, HI = 3, NL = 61;
const LAMS = logSpace(LO, HI, NL);
const NAMES = ["x₁", "x₂", "x₃", "x₄", "x₅", "x₆"];

class PathPlot extends Plot {
  constructor(canvas, colors, yr) {
    super(canvas, { width: PW, height: PH, pad: 30, padTop: 14, padRight: 12,
      xDomain: [LO, HI], yDomain: [-yr, yr], colors });
  }

  render({ path, trueW, li, colorOf }) {
    const C = this.C;
    this.grid({ yTicks: 4 }).axes({ atY: 0 });
    // a light line at each true value, so "shrinks toward zero" can be read as
    // "shrinks past the truth" where that is what happens
    trueW.forEach((v) => v !== 0 && this.polyline([[LO, v], [HI, v]], { color: C.border, width: 1 }));
    trueW.forEach((_, j) => {
      const pts = path.map((w, i) => [LO + ((HI - LO) * i) / (NL - 1), w[j]]);
      this.polyline(pts, { color: colorOf(j), width: trueW[j] === 0 ? 1.5 : 2.25,
        dash: j === 1 ? [4, 3] : null });
    });
    this.vline(LO + ((HI - LO) * li) / (NL - 1), { color: C.fg, width: 1.25, dash: [3, 3] });
    for (let e = LO; e <= HI; e++) {
      this.label(e === 0 ? "1" : e === 1 ? "10" : e === 2 ? "100" : e === 3 ? "1000" : "0.1",
        this.x(e), this.bottom + 14, { align: "center" });
    }
    this.label("λ", (this.left + this.right) / 2, this.bottom + 27, { align: "center" });
    this.label("w", this.left - 6, this.top + 6, { align: "right" });
    return this;
  }
}

class BarPlot extends Plot {
  constructor(canvas, colors, yr) {
    super(canvas, { width: PW, height: BH, pad: 30, padTop: 12, padRight: 12,
      xDomain: [0, 6], yDomain: [-yr, yr], colors });
  }

  render({ w, ols, colorOf }) {
    const C = this.C, g = this.g;
    this.grid({ yTicks: 4 }).axes({ atY: 0, y: false });
    w.forEach((v, j) => {
      const x0 = this.x(j + 0.2), x1 = this.x(j + 0.8);
      // the unregularized value as an outline, the current one filled
      g.strokeStyle = C.muted; g.lineWidth = 1; g.globalAlpha = 0.6;
      g.strokeRect(x0, Math.min(this.y(0), this.y(ols[j])), x1 - x0, Math.abs(this.y(ols[j]) - this.y(0)));
      g.globalAlpha = 1;
      g.fillStyle = colorOf(j); g.globalAlpha = 0.85;
      g.fillRect(x0, Math.min(this.y(0), this.y(v)), x1 - x0, Math.abs(this.y(v) - this.y(0)));
      g.globalAlpha = 1;
      if (Math.abs(v) < 1e-9) {
        this.label("0", this.x(j + 0.5), this.y(0) - 5, { align: "center", color: C.fg, size: 11 });
      }
      this.label(NAMES[j], this.x(j + 0.5), this.bottom + 14, { align: "center" });
    });
    return this;
  }
}

function Panel({ title, path, ols, trueW, li, yr, C, colorOf }) {
  const pathRef = React.useRef(null), barRef = React.useRef(null);
  const w = path[li];
  React.useEffect(() => {
    if (barRef.current) new BarPlot(barRef.current, C, yr).render({ w, ols, colorOf });
    if (pathRef.current) new PathPlot(pathRef.current, C, yr).render({ path, trueW, li, colorOf });
  });
  const nz = w.filter((v) => Math.abs(v) > 1e-9).length;
  const l2 = Math.sqrt(w.reduce((s, v) => s + v * v, 0));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 1 300px", minWidth: 0 }}>
      <div style={{ ...labelStyle(C), fontWeight: 600, color: C.fg }}>{title}</div>
      <canvas ref={barRef} style={{ width: "100%", maxWidth: PW, aspectRatio: `${PW} / ${BH}` }}
        aria-label={`${title}: the six coefficients at the current lambda, ${nz} of them nonzero`} />
      <canvas ref={pathRef} style={{ width: "100%", maxWidth: PW, aspectRatio: `${PW} / ${PH}` }}
        aria-label={`${title}: each coefficient's path as lambda grows from 0.1 to 1000`} />
      <p style={{ ...readoutStyle(C), margin: 0 }}>
        nonzero {nz} / 6    ‖w‖₂ = {l2.toFixed(2)}
      </p>
      <p style={{ ...readoutStyle(C), margin: 0, fontSize: "12px" }}>
        w = [{w.map((v) => (Math.abs(v) < 1e-9 ? "0" : v.toFixed(2))).join(", ")}]
      </p>
    </div>
  );
}

export default function App() {
  const C = useClassColors();
  const [li, setLi] = React.useState(20);
  const [seed, setSeed] = React.useState(11);

  const { ridge, lasso, ols, trueW } = React.useMemo(() => {
    const { X, y, trueW: tw } = regressionSample({}, rng(seed));
    const r = regPath(X, y, LAMS, "ridge"), l = regPath(X, y, LAMS, "lasso");
    return { ridge: r, lasso: l, ols: regPath(X, y, [0], "ridge")[0], trueW: tw };
  }, [seed]);

  // signal features in the positive colour, the truly-zero ones muted; the correlated
  // twin of x1 is dashed in the path plot and neutral here so the pair reads as a pair
  const colorOf = (j) => (j === 1 ? C.mid : trueW[j] !== 0 ? C.pos : C.muted);
  const yr = Math.max(4.5, ...ols.map(Math.abs)) * 1.1;
  const lam = LAMS[li];
  const preset = (target) => () => setLi(argmin(LAMS.map((v) => Math.abs(Math.log10(v) - Math.log10(target)))));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: C.fg }}>
      <h2 className="sr-only">Coefficient paths under ridge and lasso penalties on the same six-feature regression as the penalty strength lambda grows, with the coefficients at the current lambda drawn as bars.</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={labelStyle(C)}>penalty λ</span>
        <input type="range" min="0" max={NL - 1} step="1" value={li}
          onChange={(e) => setLi(+e.target.value)} aria-label="Regularization strength lambda, on a log scale"
          style={{ flex: "1 1 160px", minWidth: "140px", accentColor: C.acc }} />
        <span style={{ ...readoutStyle(C), margin: 0, minWidth: "6em" }}>λ = {lam < 1 ? lam.toFixed(2) : lam < 10 ? lam.toFixed(1) : Math.round(lam)}</span>
        <button type="button" style={buttonStyle(C)} onClick={preset(0.1)}>≈ OLS</button>
        <button type="button" style={buttonStyle(C)} onClick={preset(10)}>λ = 10</button>
        <button type="button" style={buttonStyle(C)} onClick={preset(100)}>λ = 100</button>
        <button type="button" style={buttonStyle(C)} onClick={() => setSeed((s) => s + 1)}>New data</button>
      </div>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <Panel title="Ridge — RSS + λ‖w‖₂²" path={ridge} ols={ols} trueW={trueW} li={li} yr={yr} C={C} colorOf={colorOf} />
        <Panel title="Lasso — RSS + λ‖w‖₁" path={lasso} ols={ols} trueW={trueW} li={li} yr={yr} C={C} colorOf={colorOf} />
      </div>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>
        Same sixty rows and six standardized features in both panels; the outlines are the
        unregularized least-squares coefficients, the bars are the fit at this λ, and the
        lower plots trace every coefficient as λ grows. The truth is w = [4, 0, −3, 0, 2, 0],
        with x₂ a near-copy of x₁ (correlation 0.9) that carries no signal of its own.
        Read left to right: ridge shrinks everything smoothly and never produces a zero,
        and on the correlated pair it splits the shared weight between x₁ and x₂ as λ
        grows. The lasso drops coefficients one at a time, in the order of how little
        they earn, and on the pair it keeps one and zeroes the other. Drag λ up until the
        lasso is left with three coefficients: those are the three real ones. Push it
        further and it drops those too - the penalty does not know which zeros are true.
      </p>
    </div>
  );
}
