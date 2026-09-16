import React from "react";
import { useClassColors, buttonStyle, labelStyle } from "@course";
import { VERTICES, analyzeNFL } from "@course/logic";

const SX = (v) => 70 + 170 * v[0] + 80 * v[1];
const SY = (v) => 270 - 170 * v[2] - 60 * v[1];
const TARGETS = {
  maj: (v) => (v[0] + v[1] + v[2] >= 2 ? 1 : -1),
  par: (v) => ((v[0] + v[1] + v[2]) % 2 ? 1 : -1),
};

function mix(p, neg, pos) {
  const rgb = (color) => {
    const hex = color.match(/^#([0-9a-f]{6})$/i);
    if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16));
    const channels = color.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i);
    return channels ? channels.slice(1).map(Number) : [0, 0, 0];
  };
  const c1 = rgb(neg), c2 = rgb(pos);
  return "rgb(" + c1.map((x, k) => Math.round(x + (c2[k] - x) * p)).join(",") + ")";
}

function drawGrid(cv, H, consistent, C) {
  if (!cv) return;
  const dpr = window.devicePixelRatio || 1;
  cv.width = 224 * dpr; cv.height = 224 * dpr;
  const g = cv.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, 224, 224);
  const CS = new Set(consistent), HS = new Set(H);
  for (let m = 0; m < 256; m++) {
    const r = Math.floor(m / 16), c = m % 16;
    g.fillStyle = CS.has(m) ? C.acc : HS.has(m) ? C.muted : C.border;
    g.globalAlpha = CS.has(m) ? 1 : HS.has(m) ? 0.55 : 0.35;
    g.fillRect(c * 14 + 1, r * 14 + 1, 12, 12);
  }
  g.globalAlpha = 1;
}

export default function NflCube() {
  const C = useClassColors();
  const [D, setD] = React.useState({});
  const [linearOnly, setLinearOnly] = React.useState(false);
  const [target, setTarget] = React.useState("man");
  const grid = React.useRef(null);
  const { H, C: consistent, vote } = React.useMemo(
    () => analyzeNFL(D, linearOnly), [D, linearOnly]);
  const T = TARGETS[target];

  React.useEffect(() => { drawGrid(grid.current, H, consistent, C); }, [H, consistent, C]);

  const edges = [];
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
    const distance = VERTICES[i].reduce((n, v, k) => n + (v !== VERTICES[j][k]), 0);
    if (distance === 1) edges.push([i, j]);
  }

  let err = 0, cnt = 0;
  const vertices = VERTICES.map((v, i) => {
    const x = SX(v), y = SY(v), code = v.join("");
    let fill, text, ring = null;
    if (i in D) { fill = D[i] > 0 ? C.pos : C.neg; text = D[i] > 0 ? "+1" : "−1"; }
    else if (vote[i] === null) { fill = C.bg; text = "?"; }
    else {
      fill = mix(vote[i], C.neg, C.pos); text = vote[i].toFixed(2);
      if (T) {
        cnt++;
        const tr = T(v), e = vote[i] === 0.5 ? 0.5 : ((vote[i] > 0.5) !== (tr === 1) ? 1 : 0);
        err += e; ring = e === 0 ? C.pos : e === 1 ? C.neg : C.muted;
      }
    }
    return { x, y, code, fill, text, ring, i, v };
  });

  let note = "Purple cells: consistent with D. Mid gray: in H but ruled out by D. Faint: outside H. Unseen vertices show the fraction of consistent hypotheses voting +1.";
  if (!consistent.length) note = "No hypothesis in H fits these labels: the inductive bias excludes this target. " + note;
  if (T) note = "Ring color scores the majority vote at each unseen vertex against the target: green right, red wrong, gray tie (counted 0.5). " + note;
  const offTraining = T && cnt && consistent.length ? (err / cnt).toFixed(2) : "n/a";

  const clickVertex = (i) => {
    setD((old) => {
      const next = { ...old };
      if (T) { if (i in next) delete next[i]; else next[i] = T(VERTICES[i]); }
      else if (!(i in next)) next[i] = 1;
      else if (next[i] === 1) next[i] = -1;
      else delete next[i];
      return next;
    });
  };

  return (
    <>
      <h2 className="sr-only">No free lunch on the Boolean cube: label vertices of {'{0,1}'}³ and see how many hypotheses stay consistent and what they vote at unseen vertices, under all 256 functions versus the 104 linear threshold functions.</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: C.fg }}>
        <div style={rowStyle}>
          <span style={labelStyle(C)}>Hypothesis set</span>
          <button type="button" aria-pressed={!linearOnly} onClick={() => setLinearOnly(false)} style={buttonStyle(C, !linearOnly)}>All 256 functions</button>
          <button type="button" aria-pressed={linearOnly} onClick={() => setLinearOnly(true)} style={buttonStyle(C, linearOnly)}>Linear threshold (104)</button>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle(C)}>Target</span>
          <select value={target} onChange={(e) => { setTarget(e.target.value); setD({}); }} style={selectStyle(C)}>
            <option value="man">None: click cycles unseen, +1, −1</option>
            <option value="maj">Majority of bits (a threshold function)</option>
            <option value="par">Parity of bits (not a threshold function)</option>
          </select>
          <button type="button" onClick={() => setD({})} style={buttonStyle(C, false)}>↻ Clear labels</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start" }}>
          <svg width="360" height="300" viewBox="0 0 360 300" role="img" aria-label="Boolean cube with labels and hypothesis votes"
            style={{ maxWidth: "100%" }}>
            {edges.map(([i, j]) => <line key={`e-${i}-${j}`} x1={SX(VERTICES[i])} y1={SY(VERTICES[i])}
              x2={SX(VERTICES[j])} y2={SY(VERTICES[j])} stroke={C.border} strokeWidth="1" />)}
            {vertices.map(({ x, y, code, fill, text, ring, i }) => (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => clickVertex(i)}>
                {ring && <circle cx={x} cy={y} r="25" fill="none" stroke={ring} strokeWidth="3" />}
                <circle cx={x} cy={y} r="20" fill={fill} stroke={C.border} strokeWidth="0.5" />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="12"
                  fill={(i in D) || vote[i] !== null ? "#fff" : C.muted}>{text}</text>
                <text x={x + (VERTICES[i][0] ? 26 : -26)} y={y - 18} textAnchor="middle"
                  fontSize="11" fill={C.muted}>{code}</text>
              </g>
            ))}
          </svg>
          <div style={{ flex: "1 1 230px", minWidth: "230px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
              <Stat label="|H|" value={H.length} C={C} />
              <Stat label="Consistent with D" value={consistent.length} C={C} />
              <Stat label="Off-training error" value={offTraining} C={C} />
            </div>
            <p style={{ ...labelStyle(C), margin: "0 0 4px" }}>All 256 functions f: {'{0,1}'}³ → {'{±1}'}, one cell each</p>
            <canvas ref={grid} aria-label="Hypothesis consistency grid"
              style={{ width: 224, height: 224, border: `0.5px solid ${C.border}`, borderRadius: "6px" }} />
            <p style={{ ...labelStyle(C), margin: "6px 0 0", lineHeight: 1.5 }}>{note}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, C }) {
  return <div style={{ background: C.bg, borderRadius: "6px", padding: "8px 12px", minWidth: "120px" }}>
    <div style={{ fontSize: "12px", color: C.muted }}>{label}</div>
    <div style={{ fontSize: "20px", fontWeight: 500, color: C.fg }}>{value}</div>
  </div>;
}

const rowStyle = { display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", margin: "0 0 2px" };

function selectStyle(C) {
  return { background: C.bg, border: `1px solid ${C.border}`, borderRadius: "6px", color: C.fg,
    padding: "6px 10px", font: "inherit" };
}
