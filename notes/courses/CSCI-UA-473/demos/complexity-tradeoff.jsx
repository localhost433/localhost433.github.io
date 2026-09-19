import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";

/* Slide 27's tradeoff picture, with the second axis the slide keeps separate made
   movable (note 04).

   The deck draws three curves against the complexity of H — in-sample error
   falling, a model-complexity penalty rising, out-of-sample error the sum of the
   two — and marks the optimum where they balance. Beside it, in words only, it
   says that a more complex f needs a more complex g and hence a more complex H.
   Those are the same picture, and the note's own warning ("do not collapse those
   two complexities into one") is much easier to obey once you have watched one of
   them move while the other stays put.

   The model, which is the note's claim and not a new one:

     E_in(M; c) = A·c/(c+M)    falls with the complexity of H, and a more complex
                               target keeps it up longer — this is question 2
     Ω(M)       = B·√M         the penalty from the bound: it depends on |H| and N
                               and NOT on f — this is question 1
     E_out      = E_in + Ω

   So raising c lifts the falling curve and leaves the rising one exactly where it
   was, and the minimum of their sum slides right and up. Right: you must spend
   more capacity. Up: the best you can do is worse, and no choice of H recovers it.

   Deliberately unnumbered on both axes, like the slide. It is a schematic of a
   relationship, and the measured version — real fits, real errors — is the demo
   immediately below it in the note. Putting numbers on this one would invite them
   to be compared with those, which they cannot be. */

const W = 620, H = 320, MMAX = 20;
/* Tuned, not arbitrary. A flatter penalty moves the optimum further when c rises
   but flattens the U until it stops looking like the slide; a steeper one keeps a
   sharp U and barely moves. These constants keep the U unmistakable at every c
   while the optimum still shifts by about half again across the slider. */
const A = 0.5, B = 0.024, POW = 0.85;
const C_MIN = 1, C_MAX = 8, C_BASE = 2;      // the complexity of f; base is the ghost

const ein = (M, c) => (A * c) / (c + M);
const omega = (M) => B * Math.pow(M, POW);
const eout = (M, c) => ein(M, c) + omega(M);

/* The optimum, found by scanning rather than by solving. The stationarity
   condition here has a closed form, but the figure would still have to scan to
   draw the curves, and a scan cannot disagree with what is on screen. */
function bestM(c) {
  let best = 0, bv = Infinity;
  for (let M = 0; M <= MMAX; M += 0.02) {
    const v = eout(M, c);
    if (v < bv) { bv = v; best = M; }
  }
  return best;
}

class TradeoffPlot extends Plot {
  constructor(canvas, colors) {
    super(canvas, { width: W, height: H, pad: 40, padTop: 18, padRight: 16,
      xDomain: [0, MMAX], yDomain: [0, 0.56], colors });
  }

  ghost(c) {
    const g = this.g;
    g.globalAlpha = 0.28;
    this.curve((M) => ein(M, c), { color: this.C.pos, width: 1.5, dash: [3, 4] });
    this.curve((M) => eout(M, c), { color: this.C.neg, width: 1.5, dash: [3, 4] });
    this.vline(bestM(c), { color: this.C.muted, width: 1, dash: [2, 4] });
    g.globalAlpha = 1;
    return this;
  }

  render({ c }) {
    const C = this.C;
    this.grid({ yTicks: 4, edges: false });
    this.axes();

    // where the curves sat at the baseline target, so the movement is visible
    if (Math.abs(c - C_BASE) > 0.01) this.ghost(C_BASE);

    this.curve(omega, { color: C.acc, width: 2.25 });
    this.curve((M) => ein(M, c), { color: C.pos, width: 2.5 });
    this.curve((M) => eout(M, c), { color: C.neg, width: 2.5 });

    const star = bestM(c);
    this.vline(star, { color: C.muted, width: 1.75, dash: [5, 4] });
    this.dot(star, eout(star, c), { color: C.neg, r: 4.5, halo: true });

    // each label sits clear of its own curve, in the slide's own arrangement
    this.label("out-of-sample error", this.x(MMAX) - 6, this.y(eout(MMAX, c)) - 12,
      { align: "right", color: C.neg, size: 12.5 });
    this.label("model complexity", this.x(MMAX) - 6, this.y(omega(MMAX * 0.72)) + 4,
      { align: "right", color: C.acc, size: 12.5 });
    this.label("in-sample error", this.x(MMAX) - 6, this.y(ein(MMAX, c)) - 12,
      { align: "right", color: C.pos, size: 12.5 });
    this.label("d*", this.x(star) + 6, this.top + 12, { align: "left", color: C.muted });

    this.label("Error", this.left - 8, this.top + 6, { align: "right" });
    this.label("Complexity of H  →", this.x(MMAX), this.bottom + 22, { align: "right" });
    return this;
  }
}

const VERDICT = (c, star, base) => {
  if (Math.abs(c - C_BASE) < 0.01) return "The baseline target. Raise its complexity and watch which curve moves.";
  const dir = star > base ? "right" : "left";
  return `The falling curve has moved${star > base ? " up" : " down"}; the rising one has not moved at all. ` +
    `The optimum has gone ${dir}, from d* ≈ ${base.toFixed(1)} to ${star.toFixed(1)}.`;
};

export default function App() {
  const C = useClassColors();
  const [c, setC] = React.useState(C_BASE);
  const ref = React.useRef(null);

  const star = bestM(c), base = bestM(C_BASE);

  React.useEffect(() => {
    if (ref.current) new TradeoffPlot(ref.current, C).render({ c });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: C.fg }}>
      <h2 className="sr-only">The error-against-complexity tradeoff, with a control for the complexity of the target function: raising it lifts the in-sample curve, leaves the model-complexity penalty unchanged, and slides the optimum to the right.</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={labelStyle(C)}>complexity of f</span>
        <input type="range" min={C_MIN} max={C_MAX} step="0.1" value={c}
          onChange={(e) => setC(+e.target.value)}
          aria-label="Complexity of the target function f"
          style={{ flex: "1 1 150px", minWidth: "130px", accentColor: C.acc }} />
        <span style={{ ...readoutStyle(C), margin: 0, minWidth: "8.5em" }}>
          {c === C_BASE ? "baseline" : c < C_BASE ? "simpler f" : "more complex f"}
        </span>
        <button type="button" style={buttonStyle(C, c === C_BASE)} onClick={() => setC(C_BASE)}>reset</button>
        <button type="button" style={buttonStyle(C, c === C_MAX)} onClick={() => setC(C_MAX)}>a much harder f</button>
      </div>
      <canvas ref={ref} style={{ width: "100%", maxWidth: W, aspectRatio: `${W} / ${H}`, alignSelf: "center" }}
        aria-label={`Tradeoff curves at target complexity ${c.toFixed(1)}; the optimal complexity of H is ${star.toFixed(1)}`} />
      <p style={{ ...readoutStyle(C), margin: 0 }}>
        d* = {star.toFixed(1)}    best achievable E_out = {eout(star, c).toFixed(3)}
      </p>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>{VERDICT(c, star, base)}</p>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>
        {c !== C_BASE && "Faint dashed curves are where things sat at the baseline. "}A more complex target is
        harder to fit, so in-sample error stays higher at every complexity of H - that is
        question 2 getting harder. The model-complexity penalty does not budge, because it
        comes from the bound and the bound depends on |H| and N, never on f. Their sum
        therefore bottoms out further right: <strong>you have to spend more capacity</strong>.
        It also bottoms out higher, which is the part that is easy to miss — the extra
        capacity does not buy back what the harder target cost you, it only stops you paying
        twice. No axis has numbers on it: this is the shape of the relationship, and the
        measured version is the figure below.
      </p>
    </div>
  );
}
