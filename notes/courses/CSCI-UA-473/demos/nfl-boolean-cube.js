/* AUTO-GENERATED from nfl-boolean-cube.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useClassColors, buttonStyle, labelStyle } from "@course";
import { VERTICES, analyzeNFL } from "@course/logic";

/* No free lunch on the Boolean cube (note 03, L3 slides 50-54).

   The first version of this figure opened empty: no labels, so every unseen vertex
   voted 0.50, "off-training error" read n/a, and both hypothesis sets reported the
   same consistent count. Everything on screen was true and none of it was the point.
   It now opens mid-experiment, on the four corners below and the majority target,
   because the theorem is a comparison and a comparison needs two numbers.

   The sample is {000, 010, 100, 111} — the all-zeros corner, two of its neighbours
   and the all-ones corner — chosen because it is the arrangement that makes all
   three readings come out cleanly at once:

     all 256 functions, either target   every unseen vertex votes 0.50, error 0.50
     linear threshold, majority         all four decided, error 0.25
     linear threshold, parity           all four decided, error 1.00

   That last row is the theorem, not an illustration of it: the same bias that beat
   chance on one target is beaten BY chance on another, and nothing in the training
   data could have told you which one you were in. */

const SEED = [0, 2, 4, 7]; // 000, 010, 100, 111

const SX = v => 70 + 170 * v[0] + 80 * v[1];
const SY = v => 270 - 170 * v[2] - 60 * v[1];
const TARGETS = {
  maj: v => v[0] + v[1] + v[2] >= 2 ? 1 : -1,
  par: v => (v[0] + v[1] + v[2]) % 2 ? 1 : -1
};

// The four seeded corners, labelled by whichever target is selected. With no target
// there is nothing to label them by, so the board starts empty and is clicked in.
const seedFor = t => TARGETS[t] ? Object.fromEntries(SEED.map(i => [i, TARGETS[t](VERTICES[i])])) : {};
function mix(p, neg, pos, mid) {
  const rgb = color => {
    const hex = color.match(/^#([0-9a-f]{6})$/i);
    if (hex) return [0, 2, 4].map(i => parseInt(hex[1].slice(i, i + 2), 16));
    const channels = color.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i);
    return channels ? channels.slice(1).map(Number) : [0, 0, 0];
  };
  const c1 = rgb(neg),
    c2 = rgb(pos),
    cm = rgb(mid);
  // Two segments through the neutral, so a 0.50 vote reads as "undecided" rather
  // than as an olive third colour half way between the two classes.
  const [from, to, u] = p < 0.5 ? [c1, cm, p * 2] : [cm, c2, (p - 0.5) * 2];
  return "rgb(" + from.map((x, k) => Math.round(x + (to[k] - x) * u)).join(",") + ")";
}
function drawGrid(cv, H, consistent, C) {
  if (!cv) return;
  const dpr = window.devicePixelRatio || 1;
  cv.width = 224 * dpr;
  cv.height = 224 * dpr;
  const g = cv.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, 224, 224);
  const CS = new Set(consistent),
    HS = new Set(H);
  for (let m = 0; m < 256; m++) {
    const r = Math.floor(m / 16),
      c = m % 16;
    g.fillStyle = CS.has(m) ? C.acc : HS.has(m) ? C.muted : C.border;
    g.globalAlpha = CS.has(m) ? 1 : HS.has(m) ? 0.55 : 0.35;
    g.fillRect(c * 14 + 1, r * 14 + 1, 12, 12);
  }
  g.globalAlpha = 1;
}
export default function NflCube() {
  const C = useClassColors();
  const [target, setTarget] = React.useState("maj");
  const [D, setD] = React.useState(() => seedFor("maj"));
  const [linearOnly, setLinearOnly] = React.useState(true);
  const grid = React.useRef(null);
  const {
    H,
    C: consistent,
    vote
  } = React.useMemo(() => analyzeNFL(D, linearOnly), [D, linearOnly]);
  const T = TARGETS[target];
  React.useEffect(() => {
    drawGrid(grid.current, H, consistent, C);
  }, [H, consistent, C]);
  const edges = [];
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
    const distance = VERTICES[i].reduce((n, v, k) => n + (v !== VERTICES[j][k]), 0);
    if (distance === 1) edges.push([i, j]);
  }
  let err = 0,
    cnt = 0;
  const vertices = VERTICES.map((v, i) => {
    const x = SX(v),
      y = SY(v),
      code = v.join("");
    let fill,
      text,
      ring = null;
    if (i in D) {
      fill = D[i] > 0 ? C.pos : C.neg;
      text = D[i] > 0 ? "+1" : "−1";
    } else if (vote[i] === null) {
      fill = C.bg;
      text = "?";
    } else {
      fill = mix(vote[i], C.neg, C.pos, C.mid);
      text = vote[i].toFixed(2);
      if (T) {
        cnt++;
        const tr = T(v),
          e = vote[i] === 0.5 ? 0.5 : vote[i] > 0.5 !== (tr === 1) ? 1 : 0;
        err += e;
        ring = e === 0 ? C.pos : e === 1 ? C.neg : C.muted;
      }
    }
    return {
      x,
      y,
      code,
      fill,
      text,
      ring,
      i,
      v
    };
  });
  let note = "Purple cells: consistent with D. Mid gray: in H but ruled out by D. Faint: outside H. Unseen vertices show the fraction of consistent hypotheses voting +1.";
  if (!consistent.length) note = "No hypothesis in H fits these labels: the inductive bias excludes this target. " + note;
  if (T) note = "Ring color scores the majority vote at each unseen vertex against the target: green right, orange wrong, gray tie (counted 0.5). " + note;
  const offTraining = T && cnt && consistent.length ? (err / cnt).toFixed(2) : "n/a";

  /* How many unseen vertices the surviving hypotheses actually agree about. This is
     the quantity the theorem is about: an unrestricted H leaves it at zero however
     much data you show it, because for every hypothesis that votes +1 somewhere
     unseen there is another, equally consistent, that votes \u22121. */
  const unseen = VERTICES.map((_, i) => i).filter(i => !(i in D));
  const decided = unseen.filter(i => vote[i] !== null && vote[i] !== 0.5).length;
  const verdict = !unseen.length ? "Every vertex is labelled, so there is nothing left to generalize to." : !consistent.length ? "Nothing in H fits this sample: the bias has ruled the target out entirely." : decided === 0 ? `All ${consistent.length} surviving hypotheses disagree about every one of the ${unseen.length} unseen vertices \u2014 each one votes exactly 0.50. The sample has told you nothing about them, and a bigger sample would not change that.` : `The surviving hypotheses agree about ${decided} of the ${unseen.length} unseen vertices.` + (T ? ` Off-training error against the target: ${offTraining}, versus 0.50 for a coin.` : "");
  const clickVertex = i => {
    setD(old => {
      const next = {
        ...old
      };
      if (T) {
        if (i in next) delete next[i];else next[i] = T(VERTICES[i]);
      } else if (!(i in next)) next[i] = 1;else if (next[i] === 1) next[i] = -1;else delete next[i];
      return next;
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, "No free lunch on the Boolean cube: label vertices of ", '{0,1}', "\xB3 and see how many hypotheses stay consistent and what they vote at unseen vertices, under all 256 functions versus the 104 linear threshold functions."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: rowStyle
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "Hypothesis set"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-pressed": !linearOnly,
    onClick: () => setLinearOnly(false),
    style: buttonStyle(C, !linearOnly)
  }, "All 256 functions"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-pressed": linearOnly,
    onClick: () => setLinearOnly(true),
    style: buttonStyle(C, linearOnly)
  }, "Linear threshold (104)")), /*#__PURE__*/React.createElement("div", {
    style: rowStyle
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "Target"), /*#__PURE__*/React.createElement("select", {
    value: target,
    onChange: e => {
      setTarget(e.target.value);
      setD(seedFor(e.target.value));
    },
    style: selectStyle(C)
  }, /*#__PURE__*/React.createElement("option", {
    value: "maj"
  }, "Majority of bits (a threshold function)"), /*#__PURE__*/React.createElement("option", {
    value: "par"
  }, "Parity of bits (not a threshold function)"), /*#__PURE__*/React.createElement("option", {
    value: "man"
  }, "None: click cycles unseen, +1, \u22121")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setD(seedFor(target)),
    style: buttonStyle(C, false)
  }, "\u21BB Reset sample")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "360",
    height: "300",
    viewBox: "0 0 360 300",
    role: "img",
    "aria-label": "Boolean cube with labels and hypothesis votes",
    style: {
      maxWidth: "100%"
    }
  }, edges.map(([i, j]) => /*#__PURE__*/React.createElement("line", {
    key: `e-${i}-${j}`,
    x1: SX(VERTICES[i]),
    y1: SY(VERTICES[i]),
    x2: SX(VERTICES[j]),
    y2: SY(VERTICES[j]),
    stroke: C.muted,
    strokeWidth: "1.25",
    strokeOpacity: "0.55"
  })), vertices.map(({
    x,
    y,
    code,
    fill,
    text,
    ring,
    i
  }) => /*#__PURE__*/React.createElement("g", {
    key: i,
    style: {
      cursor: "pointer"
    },
    onClick: () => clickVertex(i)
  }, ring && /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "25",
    fill: "none",
    stroke: ring,
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "20",
    fill: fill,
    stroke: C.border,
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y + 4,
    textAnchor: "middle",
    fontSize: "12",
    fill: i in D || vote[i] !== null ? "#fff" : C.muted
  }, text), /*#__PURE__*/React.createElement("text", {
    x: x + (VERTICES[i][0] ? 26 : -26),
    y: y - 18,
    textAnchor: "middle",
    fontSize: "11",
    fill: C.muted
  }, code)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 230px",
      minWidth: "230px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "|H|",
    value: H.length,
    C: C
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Consistent with D",
    value: consistent.length,
    C: C
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Unseen vertices decided",
    value: `${decided} / ${unseen.length}`,
    C: C
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Off-training error",
    value: offTraining,
    C: C
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: "0 0 10px",
      lineHeight: 1.5,
      color: decided === 0 ? C.neg : C.fg
    }
  }, verdict), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: "0 0 4px"
    }
  }, "All 256 functions f: ", '{0,1}', "\xB3 \u2192 ", '{±1}', ", one cell each"), /*#__PURE__*/React.createElement("canvas", {
    ref: grid,
    "aria-label": "Hypothesis consistency grid",
    style: {
      width: 224,
      height: 224,
      border: `0.5px solid ${C.border}`,
      borderRadius: "6px"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: "6px 0 0",
      lineHeight: 1.5
    }
  }, note)))));
}
function Stat({
  label,
  value,
  C
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.bg,
      borderRadius: "6px",
      padding: "8px 12px",
      minWidth: "120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      color: C.muted
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "20px",
      fontWeight: 500,
      color: C.fg
    }
  }, value));
}
const rowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  alignItems: "center",
  margin: "0 0 2px"
};
function selectStyle(C) {
  return {
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: "6px",
    color: C.fg,
    padding: "6px 10px",
    font: "inherit"
  };
}