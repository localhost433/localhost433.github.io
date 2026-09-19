import React from "react";
import { useClassColors, buttonStyle, readoutStyle, labelStyle } from "@course";
import { misclassified, perceptronStep, generateSplit, scalePoints, errorRate } from "@course/logic";

const BASE_L = 5, S = 340, CAP = 1500;

function draw(cv, hc, state) {
  if (!cv || !hc) return;
  const { pts, test, w, last, hist, C, L } = state;
  const X = (a) => (a + L) / (2 * L) * S;
  const Y = (b) => S - (b + L) / (2 * L) * S;
  const dpr = window.devicePixelRatio || 1;
  cv.width = S * dpr; cv.height = S * dpr;
  const g = cv.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, S, S);
  const nz = Math.abs(w[1]) + Math.abs(w[2]) > 1e-12;
  if (nz || Math.abs(w[0]) > 1e-12) {
    const cs = 8; g.globalAlpha = 0.09;
    for (let px = 0; px < S; px += cs) for (let py = 0; py < S; py += cs) {
      const a = (px + cs / 2) / S * 2 * L - L;
      const b = (S - py - cs / 2) / S * 2 * L - L;
      const s = w[0] + w[1] * a + w[2] * b;
      if (s === 0) continue;
      g.fillStyle = s > 0 ? C.pos : C.neg; g.fillRect(px, py, cs, cs);
    }
    g.globalAlpha = 1;
  }
  // Grid is scaffolding and axes are information, so they must not share a weight.
  // The grid spacing follows the scale, so a doubled cloud sits on a doubled grid.
  const unit = L / BASE_L;
  g.strokeStyle = C.border; g.lineWidth = 1; g.globalAlpha = 0.5;
  for (let k = -BASE_L; k <= BASE_L; k++) {
    g.beginPath(); g.moveTo(X(k * unit), 0); g.lineTo(X(k * unit), S);
    g.moveTo(0, Y(k * unit)); g.lineTo(S, Y(k * unit)); g.stroke();
  }
  g.globalAlpha = 1;
  g.strokeStyle = C.muted; g.lineWidth = 1.25; g.beginPath();
  g.moveTo(X(0), 0); g.lineTo(X(0), S);
  g.moveTo(0, Y(0)); g.lineTo(S, Y(0)); g.stroke();
  if (nz) {
    g.strokeStyle = C.fg; g.lineWidth = 2; g.beginPath();
    if (Math.abs(w[2]) >= Math.abs(w[1])) {
      g.moveTo(X(-L), Y(-(w[0] + w[1] * -L) / w[2]));
      g.lineTo(X(L), Y(-(w[0] + w[1] * L) / w[2]));
    } else {
      g.moveTo(X(-(w[0] + w[2] * -L) / w[1]), Y(-L));
      g.lineTo(X(-(w[0] + w[2] * L) / w[1]), Y(L));
    }
    g.stroke();
    const n2 = w[1] * w[1] + w[2] * w[2], n = Math.sqrt(n2);
    const fa = -w[0] * w[1] / n2, fb = -w[0] * w[2] / n2;
    const ta = fa + 1.2 * unit * w[1] / n, tb = fb + 1.2 * unit * w[2] / n;
    g.strokeStyle = C.acc; g.fillStyle = C.acc; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(X(fa), Y(fb)); g.lineTo(X(ta), Y(tb)); g.stroke();
    const ang = Math.atan2(Y(tb) - Y(fb), X(ta) - X(fa));
    g.beginPath(); g.moveTo(X(ta), Y(tb));
    g.lineTo(X(ta) - 9 * Math.cos(ang - 0.4), Y(tb) - 9 * Math.sin(ang - 0.4));
    g.lineTo(X(ta) - 9 * Math.cos(ang + 0.4), Y(tb) - 9 * Math.sin(ang + 0.4));
    g.fill();
    g.font = "13px sans-serif"; g.fillStyle = C.fg; g.fillText("w", X(ta) + 6, Y(tb) - 4);
  }
  // Held-out points are drawn small and hollow: they are never touched by the
  // algorithm, and the picture should make that visible rather than say it.
  if (test.length) {
    const T = new Set(misclassified(test, w));
    test.forEach((p, i) => {
      const px = X(p.a), py = Y(p.b);
      g.strokeStyle = p.y > 0 ? C.pos : C.neg; g.lineWidth = 1.25; g.globalAlpha = 0.55;
      g.beginPath();
      if (p.y > 0) g.arc(px, py, 3.2, 0, 2 * Math.PI);
      else g.rect(px - 3, py - 3, 6, 6);
      g.stroke();
      if (T.has(i) && nz) {
        g.strokeStyle = C.fg; g.globalAlpha = 0.5;
        g.beginPath(); g.moveTo(px - 5, py - 5); g.lineTo(px + 5, py + 5);
        g.moveTo(px + 5, py - 5); g.lineTo(px - 5, py + 5); g.stroke();
      }
      g.globalAlpha = 1;
    });
  }
  const M = new Set(misclassified(pts, w)); g.font = "11px sans-serif";
  pts.forEach((p, i) => {
    const px = X(p.a), py = Y(p.b); g.fillStyle = p.y > 0 ? C.pos : C.neg;
    if (p.y > 0) { g.beginPath(); g.arc(px, py, 6, 0, 2 * Math.PI); g.fill(); }
    else g.fillRect(px - 5.5, py - 5.5, 11, 11);
    if (M.has(i)) {
      g.strokeStyle = C.fg; g.lineWidth = 1.25; g.globalAlpha = 0.3;
      g.beginPath(); g.arc(px, py, 10, 0, 2 * Math.PI); g.stroke();
      g.globalAlpha = 1;
    }
    if (last && last.i === i) {
      g.strokeStyle = C.acc; g.lineWidth = 2.5; g.beginPath();
      g.arc(px, py, 14, 0, 2 * Math.PI); g.stroke();
    }
    // Points cluster, so their index labels overlap. A background-coloured stroke
    // under each keeps both readable instead of letting them merge into one glyph.
    g.lineWidth = 3; g.strokeStyle = C.bg; g.lineJoin = "round";
    g.strokeText(String(i + 1), px + 8, py - 8);
    g.fillStyle = C.muted; g.fillText(String(i + 1), px + 8, py - 8);
  });

  const W = hc.clientWidth || 300, H = 110;
  hc.width = W * dpr; hc.height = H * dpr;
  const h = hc.getContext("2d");
  h.setTransform(dpr, 0, 0, dpr, 0, 0); h.clearRect(0, 0, W, H);
  const n = Math.max(hist.length, 10), ym = Math.max(pts.length, 1);
  h.strokeStyle = C.border; h.lineWidth = 0.5; h.beginPath();
  h.moveTo(28, H - 16); h.lineTo(W - 6, H - 16);
  h.moveTo(28, 6); h.lineTo(28, H - 16); h.stroke();
  h.fillStyle = C.muted; h.font = "11px sans-serif";
  h.fillText(String(ym), 4, 14); h.fillText("0", 14, H - 14);
  h.fillText(String(hist.length), W - 30, H - 3);
  if (hist.length) {
    h.strokeStyle = C.acc; h.lineWidth = 1.5; h.beginPath();
    const pts0 = [pts.length].concat(hist);
    pts0.forEach((v, k) => {
      const x = 28 + (W - 34) * k / n, y = (H - 16) - (H - 22) * v / ym;
      k ? h.lineTo(x, y) : h.moveTo(x, y);
    });
    h.stroke();
  }
}

const randomW = () => [0, 1, 2].map(() => (Math.random() * 2 - 1) * 2);
const fmtW = (w) => "[" + w.map((v) => v.toFixed(2)).join(", ") + "]";

export default function PerceptronDemo() {
  const C = useClassColors();
  const [init] = React.useState(() => generateSplit("sep", Math.random));
  const [pts, setPts] = React.useState(init.pts);
  const [test, setTest] = React.useState(init.test);
  const [w, setW] = React.useState([0, 0, 0]);
  const [w0, setW0] = React.useState([0, 0, 0]);       // where this run started
  const [t, setT] = React.useState(0);
  const [hist, setHist] = React.useState([]);
  const [last, setLast] = React.useState(null);
  const [running, setRunning] = React.useState(false);
  const [capHit, setCapHit] = React.useState(false);
  const [addCls, setAddCls] = React.useState(1);
  const [pickMode, setPickMode] = React.useState("rand");
  const [kind, setKind] = React.useState("sep");
  const [scale, setScale] = React.useState(1);
  const [runs, setRuns] = React.useState([]);            // finished runs on this data
  const cv = React.useRef(null), hc = React.useRef(null);
  const L = BASE_L * scale;

  const pick = React.useCallback(
    (M) => (pickMode === "first" ? 0 : Math.floor(Math.random() * M.length)),
    [pickMode]);

  const step = React.useCallback(() => {
    const r = perceptronStep(pts, w, pick);
    if (!r) return false;
    setW(r.w); setLast(r.last); setT((n) => n + 1);
    setHist((h) => h.concat(misclassified(pts, r.w).length));
    return true;
  }, [pts, w, pick]);

  React.useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      if (t >= CAP) { setCapHit(true); setRunning(false); }
      else if (!step()) setRunning(false);
    }, 90);
    return () => clearInterval(id);
  }, [running, step, t]);

  React.useEffect(() => { draw(cv.current, hc.current, { pts, test, w, last, hist, C, L }); },
    [pts, test, w, last, hist, C, L]);

  // A run is logged the moment it converges, so two runs from different starts can
  // be read against each other: same training error by construction, and whatever
  // the held-out set says.
  const M = misclassified(pts, w);
  React.useEffect(() => {
    if (t > 0 && pts.length && !M.length)
      setRuns((rs) => rs.some((r) => r.t === t && r.w0 === fmtW(w0)) ? rs
        : rs.concat({ w0: fmtW(w0), t, test: errorRate(test, w), scale }));
  }, [t, M.length, pts.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetRun = (start = [0, 0, 0]) => {
    setRunning(false); setW(start); setW0(start); setT(0); setHist([]); setLast(null); setCapHit(false);
  };
  const resetData = (nextKind) => {
    const s = generateSplit(nextKind, Math.random);
    setPts(s.pts); setTest(s.test); setScale(1); setRuns([]); resetRun();
  };
  const toggleScale = () => {
    const k = scale === 1 ? 2 : 0.5;
    setPts(scalePoints(pts, k)); setTest(scalePoints(test, k)); setScale(scale === 1 ? 2 : 1);
    resetRun();
  };

  const onCanvasClick = (e) => {
    const r = cv.current.getBoundingClientRect();
    const a = Math.round((e.clientX - r.left) / r.width * 2 * L - L);
    const b = Math.round(L - (e.clientY - r.top) / r.height * 2 * L);
    const k = pts.findIndex((p) => Math.hypot(p.a - a, p.b - b) < 0.45 * scale);
    setRunning(false); setPts((old) => k >= 0 ? old.filter((_, i) => i !== k) : old.concat({ a, b, y: addCls }));
    setTest([]); setRuns([]);
    setHist([]); setLast(null); setCapHit(false); setT(0);
  };

  let note = "Circles are y = +1, squares are y = −1. Ringed points satisfy y wᵀx ≤ 0 (counted as misclassified). Small hollow markers are the held-out set, labelled by the same hidden rule and never shown to the algorithm; a cross marks one the current line gets wrong. Click an existing point to delete it.";
  if (pts.length && !M.length) note = "Converged: every training point has y wᵀx > 0. " + note;
  else if (pts.length && !Math.abs(w[1]) && !Math.abs(w[2]) && !Math.abs(w[0])) note = "w = 0, so y wᵀx = 0 for every point: all count as misclassified under the ≤ 0 convention. " + note;
  if (capHit) note = "Stopped at " + CAP + " updates without converging. " + note;
  if (pts.some((p) => p.planted)) note = "The planted point is the midpoint of two same-class points with the opposite label, so no line can separate the data. " + note;

  return (
    <>
      <h2 className="sr-only">Interactive perceptron learning algorithm on 2D data: step through updates and watch the separating line, its normal vector, the misclassification count, and the error on a held-out set.</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: C.fg }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start" }}>
          <div role="group" aria-label="data" style={rowStyle}>
            <span style={labelStyle(C)}>data</span>
            <button type="button" aria-pressed={kind === "sep"}
              onClick={() => { setKind("sep"); resetData("sep"); }}
              style={buttonStyle(C, kind === "sep")}>Separable · 20 points</button>
            <button type="button" aria-pressed={kind === "non"}
              onClick={() => { setKind("non"); resetData("non"); }}
              style={buttonStyle(C, kind === "non")}>Non-separable · planted contradiction</button>
            <button type="button" aria-pressed={kind === "empty"}
              onClick={() => { setKind("empty"); resetData("empty"); }}
              style={buttonStyle(C, kind === "empty")}>Empty · click to add points</button>
          </div>
          <div role="group" aria-label="click adds" style={rowStyle}>
            <span style={labelStyle(C)}>click adds</span>
            <button type="button" aria-pressed={addCls === 1}
              onClick={() => setAddCls(1)} style={buttonStyle(C, addCls === 1)}>+1</button>
            <button type="button" aria-pressed={addCls === -1}
              onClick={() => setAddCls(-1)} style={buttonStyle(C, addCls === -1)}>−1</button>
          </div>
          <div role="group" aria-label="pick" style={rowStyle}>
            <span style={labelStyle(C)}>pick</span>
            <button type="button" aria-pressed={pickMode === "rand"}
              onClick={() => setPickMode("rand")} style={buttonStyle(C, pickMode === "rand")}>Random misclassified</button>
            <button type="button" aria-pressed={pickMode === "first"}
              onClick={() => setPickMode("first")} style={buttonStyle(C, pickMode === "first")}>Lowest index</button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <button type="button" onClick={() => resetData(kind)} style={buttonStyle(C)}>↻ New data</button>
          <button type="button" onClick={() => { setRunning(false); step(); }} style={buttonStyle(C)}>Step</button>
          <button type="button" onClick={() => {
            if (running) setRunning(false);
            else { setCapHit(false); setRunning(true); }
          }} style={buttonStyle(C)}>{running ? "Ⅱ Pause" : "▶ Run"}</button>
          <button type="button" onClick={() => resetRun()} style={buttonStyle(C)}>Reset w to 0</button>
          <button type="button" onClick={() => resetRun(randomW())} style={buttonStyle(C)}>Random start w</button>
          <button type="button" aria-pressed={scale === 2} onClick={toggleScale}
            disabled={!pts.length} style={buttonStyle(C, scale === 2)}>Inputs ×2</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start" }}>
          <canvas ref={cv} onClick={onCanvasClick} aria-label="Perceptron data and separating line"
            style={{ width: S, height: S, border: `0.5px solid ${C.border}`, borderRadius: "6px", cursor: "crosshair" }} />
          <div style={{ flex: "1 1 250px", minWidth: "250px" }}>
            <p style={readoutStyle(C)}>w = [b, w₁, w₂] = <b>{fmtW(w)}</b>{scale === 2 ? "   (inputs ×2)" : ""}</p>
            <p style={readoutStyle(C)}>updates t = <b>{t}</b>, misclassified = <b>{M.length}</b> / {pts.length}
              {test.length ? <>, held-out error = <b>{w.every((v) => v === 0) ? "—" : (errorRate(test, w) * 100).toFixed(0) + "%"}</b> of {test.length}</> : null}</p>
            <p style={{ ...readoutStyle(C), minHeight: "58px" }}>
              {last ? <>Last update used point {last.i + 1} (y = {last.y > 0 ? "+1" : "−1"}).<br />
                y wᵀx: {last.before.toFixed(2)} → {last.after.toFixed(2)}<br />
                increase {(last.after - last.before).toFixed(2)} = ‖x‖² = {last.n2.toFixed(2)}</> : "No update yet."}
            </p>
            {runs.length > 0 && (
              <div style={{ ...readoutStyle(C), margin: "0 0 6px" }}>
                <div style={{ ...labelStyle(C), margin: "0 0 3px" }}>Converged runs on this data</div>
                {runs.map((r, i) => (
                  <div key={i}>start {r.w0}{r.scale === 2 ? " ×2" : ""}: {r.t} updates, train error 0, held-out {test.length ? (r.test * 100).toFixed(0) + "%" : "—"}</div>
                ))}
              </div>
            )}
            <p style={{ ...labelStyle(C), margin: "6px 0 4px",
              visibility: hist.length ? "visible" : "hidden" }}>Misclassified count after each update</p>
            <canvas ref={hc} aria-label="Misclassified count after each update"
              style={{ width: "100%", height: 110, borderRadius: "6px",
                border: `1px solid ${C.border}`,
                visibility: hist.length ? "visible" : "hidden" }} />
            <p style={{ ...labelStyle(C), margin: "8px 0 0", lineHeight: 1.5 }}>{note}</p>
          </div>
        </div>
      </div>
    </>
  );
}

const rowStyle = { display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", margin: "0 0 2px" };
