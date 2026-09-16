import React from "react";
import { useClassColors } from "@course";
import { misclassified, perceptronStep, generate } from "@course/logic";

const L = 5, S = 340, CAP = 1500;

const X = (a) => (a + L) / (2 * L) * S;
const Y = (b) => S - (b + L) / (2 * L) * S;

function draw(cv, hc, state) {
  if (!cv || !hc) return;
  const { pts, w, last, hist, C } = state;
  const dpr = window.devicePixelRatio || 1;
  cv.width = S * dpr; cv.height = S * dpr;
  const g = cv.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, S, S);
  const nz = Math.abs(w[1]) + Math.abs(w[2]) > 1e-12;
  if (nz || Math.abs(w[0]) > 1e-12) {
    const cs = 8; g.globalAlpha = 0.13;
    for (let px = 0; px < S; px += cs) for (let py = 0; py < S; py += cs) {
      const a = (px + cs / 2) / S * 2 * L - L;
      const b = (S - py - cs / 2) / S * 2 * L - L;
      const s = w[0] + w[1] * a + w[2] * b;
      if (s === 0) continue;
      g.fillStyle = s > 0 ? C.pos : C.neg; g.fillRect(px, py, cs, cs);
    }
    g.globalAlpha = 1;
  }
  g.strokeStyle = C.border; g.lineWidth = 0.5;
  for (let k = -L; k <= L; k++) {
    g.beginPath(); g.moveTo(X(k), 0); g.lineTo(X(k), S);
    g.moveTo(0, Y(k)); g.lineTo(S, Y(k)); g.stroke();
  }
  g.lineWidth = 1; g.beginPath();
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
    const ta = fa + 1.2 * w[1] / n, tb = fb + 1.2 * w[2] / n;
    g.strokeStyle = C.acc; g.fillStyle = C.acc; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(X(fa), Y(fb)); g.lineTo(X(ta), Y(tb)); g.stroke();
    const ang = Math.atan2(Y(tb) - Y(fb), X(ta) - X(fa));
    g.beginPath(); g.moveTo(X(ta), Y(tb));
    g.lineTo(X(ta) - 9 * Math.cos(ang - 0.4), Y(tb) - 9 * Math.sin(ang - 0.4));
    g.lineTo(X(ta) - 9 * Math.cos(ang + 0.4), Y(tb) - 9 * Math.sin(ang + 0.4));
    g.fill();
    g.font = "13px sans-serif"; g.fillStyle = C.fg; g.fillText("w", X(ta) + 6, Y(tb) - 4);
  }
  const M = new Set(misclassified(pts, w)); g.font = "11px sans-serif";
  pts.forEach((p, i) => {
    const px = X(p.a), py = Y(p.b); g.fillStyle = p.y > 0 ? C.pos : C.neg;
    if (p.y > 0) { g.beginPath(); g.arc(px, py, 6, 0, 2 * Math.PI); g.fill(); }
    else g.fillRect(px - 5.5, py - 5.5, 11, 11);
    if (M.has(i)) {
      g.strokeStyle = C.fg; g.lineWidth = 1.5; g.beginPath();
      g.arc(px, py, 10, 0, 2 * Math.PI); g.stroke();
    }
    if (last && last.i === i) {
      g.strokeStyle = C.acc; g.lineWidth = 2.5; g.beginPath();
      g.arc(px, py, 14, 0, 2 * Math.PI); g.stroke();
    }
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

export default function PerceptronDemo() {
  const C = useClassColors();
  const [pts, setPts] = React.useState(() => generate("sep", Math.random));
  const [w, setW] = React.useState([0, 0, 0]);
  const [t, setT] = React.useState(0);
  const [hist, setHist] = React.useState([]);
  const [last, setLast] = React.useState(null);
  const [running, setRunning] = React.useState(false);
  const [capHit, setCapHit] = React.useState(false);
  const [addCls, setAddCls] = React.useState(1);
  const [pickMode, setPickMode] = React.useState("rand");
  const [kind, setKind] = React.useState("sep");
  const cv = React.useRef(null), hc = React.useRef(null);

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

  React.useEffect(() => { draw(cv.current, hc.current, { pts, w, last, hist, C }); },
    [pts, w, last, hist, C]);

  const resetData = (nextKind) => {
    setRunning(false); setPts(generate(nextKind, Math.random)); setW([0, 0, 0]);
    setT(0); setHist([]); setLast(null); setCapHit(false);
  };

  const onCanvasClick = (e) => {
    const r = cv.current.getBoundingClientRect();
    const a = Math.round((e.clientX - r.left) / r.width * 2 * L - L);
    const b = Math.round(L - (e.clientY - r.top) / r.height * 2 * L);
    const k = pts.findIndex((p) => Math.hypot(p.a - a, p.b - b) < 0.45);
    setRunning(false); setPts((old) => k >= 0 ? old.filter((_, i) => i !== k) : old.concat({ a, b, y: addCls }));
    setHist([]); setLast(null); setCapHit(false); setT(0);
  };

  const M = misclassified(pts, w);
  let note = "Circles are y = +1, squares are y = −1. Ringed points satisfy y wᵀx ≤ 0 (counted as misclassified). Click an existing point to delete it.";
  if (pts.length && !M.length) note = "Converged: every point has y wᵀx > 0. " + note;
  else if (pts.length && !Math.abs(w[1]) && !Math.abs(w[2]) && !Math.abs(w[0])) note = "w = 0, so y wᵀx = 0 for every point: all count as misclassified under the ≤ 0 convention. " + note;
  if (capHit) note = "Stopped at " + CAP + " updates without converging. " + note;
  if (pts.some((p) => p.planted)) note = "The planted point is the midpoint of two same-class points with the opposite label, so no line can separate the data. " + note;

  return (
    <>
      <h2 className="sr-only">Interactive perceptron learning algorithm on 2D data: step through updates and watch the separating line, its normal vector, and the misclassification count.</h2>
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
          <button type="button" onClick={() => {
            setRunning(false); setW([0, 0, 0]); setT(0); setHist([]); setLast(null); setCapHit(false);
          }} style={buttonStyle(C)}>Reset w to 0</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start" }}>
          <canvas ref={cv} onClick={onCanvasClick} aria-label="Perceptron data and separating line"
            style={{ width: S, height: S, border: `0.5px solid ${C.border}`, borderRadius: "6px", cursor: "crosshair" }} />
          <div style={{ flex: "1 1 250px", minWidth: "250px" }}>
            <p style={readoutStyle(C)}>w = [b, w₁, w₂] = <b>{"[" + w.map((v) => v.toFixed(2)).join(", ") + "]"}</b></p>
            <p style={readoutStyle(C)}>updates t = <b>{t}</b>, misclassified = <b>{M.length}</b></p>
            <p style={{ ...readoutStyle(C), minHeight: "58px" }}>
              {last ? <>Last update used point {last.i + 1} (y = {last.y > 0 ? "+1" : "−1"}).<br />
                y wᵀx: {last.before.toFixed(2)} → {last.after.toFixed(2)}<br />
                increase {(last.after - last.before).toFixed(2)} = ‖x‖² = {last.n2.toFixed(2)}</> : "No update yet."}
            </p>
            <p style={{ ...labelStyle(C), margin: "6px 0 4px" }}>Misclassified count after each update</p>
            <canvas ref={hc} aria-label="Misclassified count after each update"
              style={{ width: "100%", height: 110, border: `0.5px solid ${C.border}`, borderRadius: "6px" }} />
            <p style={{ ...labelStyle(C), margin: "8px 0 0", lineHeight: 1.5 }}>{note}</p>
          </div>
        </div>
      </div>
    </>
  );
}

const rowStyle = { display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", margin: "0 0 2px" };

function buttonStyle(C, active) {
  return { background: active ? C.border : C.bg, border: `1px solid ${active ? C.fg : C.border}`,
    borderRadius: "6px", color: C.fg, padding: "6px 10px", cursor: "pointer", font: "inherit",
    fontWeight: active ? 500 : 400 };
}

function readoutStyle(C) {
  return { margin: "0 0 6px", color: C.muted, fontSize: "13px", lineHeight: 1.5,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" };
}

function labelStyle(C) {
  return { color: C.muted, fontSize: "13px" };
}
