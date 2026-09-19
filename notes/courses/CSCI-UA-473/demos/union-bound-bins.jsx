import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle, Plot } from "@course";
import { rng, sampleNus, hoeffding, unionBound, vacuousAt } from "@course/logic";

/* Why one bin is verification and many bins is learning. Each bin is a hypothesis
   fixed before the data; its nu is an honest estimate of its own mu. Pick the bin
   that looks best after seeing the data and you are no longer estimating anything,
   because the selection used the sample. The bound pays for that by a factor of M. */

const W = 620, H = 170, MU = 0.5, N = 40;

class BinsPlot extends Plot {
  constructor(canvas, colors, M) {
    super(canvas, { width: W, height: H, pad: 26, padTop: 16, padRight: 12,
      xDomain: [0, M], yDomain: [0.26, 0.74], colors });
    this.M = M;
  }

  render({ nus, eps }) {
    const C = this.C;
    const best = nus.indexOf(Math.min(...nus));
    const slot = (this.right - this.left) / this.M;

    // the tolerance, drawn where it actually lives: a band in nu around mu
    this.hband(MU - eps, MU + eps, { color: C.acc, alpha: 0.12 });

    nus.forEach((v, i) => {
      const cx = this.left + (i + 0.5) * slot;
      const off = Math.abs(v - MU) > eps;
      const g = this.g;
      // a stem to the bin's own baseline reads as "one bin"; a full-height rule read
      // as a table cell and boxed the whole figure in
      g.strokeStyle = C.border; g.lineWidth = 1;
      g.beginPath(); g.moveTo(cx, this.y(MU)); g.lineTo(cx, this.y(v)); g.stroke();
      g.fillStyle = i === best ? C.acc : (off ? C.neg : C.pos);
      g.beginPath(); g.arc(cx, this.y(v), i === best ? 6.5 : 4.5, 0, 2 * Math.PI); g.fill();
      g.strokeStyle = C.bg; g.lineWidth = 1.5; g.stroke();
      if (i === best) {
        g.strokeStyle = C.acc; g.lineWidth = 2;
        g.beginPath(); g.arc(cx, this.y(v), 11, 0, 2 * Math.PI); g.stroke();
      }
    });

    // mu is the same for every bin here, so the spread is sampling noise alone
    const g = this.g;
    g.strokeStyle = C.fg; g.lineWidth = 1.5; g.setLineDash([5, 4]);
    g.beginPath(); g.moveTo(this.left, this.y(MU)); g.lineTo(this.right, this.y(MU)); g.stroke();
    g.setLineDash([]);

    this.label("μ = " + MU, this.left + 4, this.y(MU) - 6, { color: C.fg });
    this.label("best-looking bin", this.left + (best + 0.5) * slot, this.y(nus[best]) - 12,
      { color: C.acc, align: "center" });
    this.label("ν", this.left - 6, this.top + 6, { align: "right" });
    return this;
  }
}

export default function App() {
  const C = useClassColors();
  const [M, setM] = React.useState(8);
  const [eps, setEps] = React.useState(0.15);
  const [seed, setSeed] = React.useState(9);
  const ref = React.useRef(null);

  const nus = React.useMemo(() => sampleNus(MU, N, M, rng(seed)), [M, seed]);
  const single = hoeffding(eps, N);
  const many = unionBound(eps, N, M);
  const dead = vacuousAt(eps, N);
  const best = Math.min(...nus);

  React.useEffect(() => {
    if (ref.current) new BinsPlot(ref.current, C, M).render({ nus, eps });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: C.fg }}>
      <h2 className="sr-only">Many bins with the same true fraction: the best-looking sample fraction drifts from mu as the number of hypotheses grows, and the bound loosens by a factor of M.</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={labelStyle(C)}>hypotheses M</span>
        <input type="range" min="1" max="40" step="1" value={M} onChange={(e) => setM(+e.target.value)}
          aria-label="Number of hypotheses M" style={{ flex: "1 1 130px", minWidth: "110px", accentColor: C.acc }} />
        <span style={{ ...readoutStyle(C), margin: 0, minWidth: "4.5em" }}>M = {M}</span>
        <button type="button" style={buttonStyle(C)} onClick={() => setSeed((s) => s + 1)}>Resample</button>
      </div>
      <canvas ref={ref} style={{ width: "100%", maxWidth: W, aspectRatio: `${W} / ${H}`, alignSelf: "center" }}
        aria-label={`${M} bins each with true fraction ${MU}; the best-looking bin reports ${best.toFixed(3)}`} />
      <p style={{ ...readoutStyle(C), margin: 0, lineHeight: 1.7 }}>
        every bin has μ = {MU}, yet the best-looking one reports ν = {best.toFixed(3)}<br />
        single fixed h:  2e^(−2ε²N) = {single.toFixed(3)}<br />
        after choosing among M:  2Me^(−2ε²N) = {many >= 1 ? "1 (says nothing)" : many.toFixed(3)}
      </p>
      <p style={{ ...labelStyle(C), margin: 0, lineHeight: 1.5 }}>
        Every bin here has the same μ, so every difference you see is sampling noise.
        Drag M up and watch the best-looking bin drift further below μ: with more
        hypotheses to choose from, some bin looks good by luck alone, and picking it is
        what breaks the single-hypothesis guarantee. That is the difference between
        verification and learning. The bound pays the price as a factor of M, and at
        M = {dead} it reaches 1 and stops saying anything at all.
      </p>
    </div>
  );
}
