/* AUTO-GENERATED from _kit.jsx by `npm run build:artifacts`. Do not edit. */
/* CSCI-UA-480 demo kit. The shared chrome lives in the global kit
   (../../../artifacts/kit.jsx, imported as @kit); this file holds the colours
   and the SVG building blocks this course's figures draw with.

   The SVG primitives (Figure, FigureSvg, Box, Lines, Sym, Arrow, port, toneOf,
   symRuns) are the CSCI-UA-473 kit's, copied rather than shared because a demo
   can only import @kit, @course and @course/logic. @kit's own DiagramSvg and
   diagramPalette are not usable here for the same reason 473 gives: they resolve
   --mm-* custom properties that only CSCI-UA-470/demos/_shared.css defines, and
   every var() that resolves to nothing falls back to black. */
import React from "react";
import { renderCaption, useTheme } from "@kit";
export { renderCaption } from "@kit";

/* Roles, 473's validated values: `acc` is the thing under discussion, `pos` is
   "correct / allowed", `neg` is "wrong / contended", `mid` is neutral. They
   clear 3:1 for graphical objects, not 4.5:1 for text: never draw text in them,
   draw it in `fg` and put the colour on a mark beside it. */
const LIGHT = {
  pos: "#1D9E75",
  neg: "#D85A30",
  acc: "#7F77DD",
  mid: "#6B7280"
};
const DARK = {
  pos: "#34D399",
  neg: "#FB923C",
  acc: "#A78BFA",
  mid: "#717A88"
};

/* Thread identity: four categorical hues in a fixed order (thread A/0 is always
   blue), checked with the dataviz validator against white and against the dark
   background (#020817): CVD separation >= 9 and a normal-vision floor >= 24 in
   both modes. The light aqua is 2.8:1 on white, so every filled cell also carries
   its thread's letter; that letter is drawn in INK, which is >= 4.5:1 on all
   eight fills, rather than in fg, which is white in dark mode and fails there. */
const THREADS_LIGHT = ["#2a78d6", "#eb6834", "#1baf7a", "#7F77DD"];
const THREADS_DARK = ["#3987e5", "#d95926", "#199e70", "#9085e9"];
export const INK = "#020817";

/* Canvas cannot parse hsl(var(--token)) and SVG gradients are fussy about it, so
   the four theme tokens are resolved to literals once per theme change, with
   fallbacks matching theme.css for a figure drawn before the stylesheet lands. */
const FALLBACK = {
  light: {
    fg: "#020817",
    muted: "#64748b",
    border: "#e2e8f0",
    bg: "#ffffff"
  },
  dark: {
    fg: "#f8fafc",
    muted: "#94a3b8",
    border: "#1e293b",
    bg: "#020817"
  }
};
function readToken(name, fallback) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? "hsl(" + v + ")" : fallback;
}
export function useColors() {
  const theme = useTheme();
  const dark = theme === "dark";
  const c = dark ? DARK : LIGHT;
  const fb = dark ? FALLBACK.dark : FALLBACK.light;
  return React.useMemo(() => ({
    ...c,
    T: dark ? THREADS_DARK : THREADS_LIGHT,
    ink: INK,
    fg: readToken("--foreground", fb.fg),
    muted: readToken("--muted-foreground", fb.muted),
    border: readToken("--border", fb.border),
    bg: readToken("--background", fb.bg)
  }), [theme]);
}
export const THREAD_NAMES = ["A", "B", "C", "D"];
export function buttonStyle(C, active, disabled) {
  return {
    background: active ? C.border : C.bg,
    border: `1px solid ${active ? C.fg : C.border}`,
    borderRadius: "6px",
    color: disabled ? C.muted : C.fg,
    padding: "6px 10px",
    cursor: disabled ? "not-allowed" : "pointer",
    font: "inherit",
    fontWeight: active ? 500 : 400,
    opacity: disabled ? 0.6 : 1
  };
}
export function readoutStyle(C) {
  return {
    margin: "0 0 6px",
    color: C.muted,
    fontSize: "13px",
    lineHeight: 1.5,
    fontFamily: MONO
  };
}
export function labelStyle(C) {
  return {
    color: C.muted,
    fontSize: "13px"
  };
}

/* MathJax (loaded for fences with the `math` flag) rewrites a caption's text nodes in
   place, so a caption that changes with state must be remounted, not patched: pass
   Figure a `captionKey` that changes with it, and call useTypeset with the same deps
   so the new caption is typeset. A no-op for figures without the flag. */
export function useTypeset(deps = []) {
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.typesetMath) return undefined;
    window.typesetMath();
    const t = setTimeout(() => {
      if (window.typesetMath) window.typesetMath();
    }, 450);
    return () => clearTimeout(t);
  }, deps);
}

/* ---- motion helpers (only atStep is used so far) ---- */
export const atStep = (step, at) => at == null || step >= at ? 1 : 0;
const FADE = {
  transition: "opacity .45s ease"
};

/* ---- the shell every figure shares ------------------------------------------
   The sr-only <h2> is the artifact's accessible title and also what the note reads
   back for its collapsible bar, so it is a sentence, not a label. A static figure
   renders bare, so its caption is the only prose around it. */
export function Figure({
  title,
  caption,
  captionKey,
  children
}) {
  const C = useColors();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    className: "sr-only"
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      color: C.fg
    }
  }, children, caption ? /*#__PURE__*/React.createElement("p", {
    key: captionKey ?? "caption",
    style: {
      margin: 0,
      fontSize: "13px",
      lineHeight: 1.55,
      color: C.muted
    }
  }, renderCaption(caption)) : null));
}
const ARROW_ROLES = ["fg", "muted", "acc", "pos", "neg", "mid", "t0", "t1", "t2", "t3"];
const roleColor = (C, r) => /^t[0-3]$/.test(r) ? C.T[+r[1]] : C[r];
export function FigureSvg({
  viewBox,
  ariaLabel,
  maxWidth = 680,
  align = "center",
  children
}) {
  const C = useColors();
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: viewBox,
    role: "img",
    "aria-label": ariaLabel,
    style: {
      width: "100%",
      height: "auto",
      maxWidth,
      display: "block",
      margin: align === "left" ? "0" : "0 auto",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    }
  }, /*#__PURE__*/React.createElement("defs", null, ARROW_ROLES.map(r => /*#__PURE__*/React.createElement("marker", {
    key: r,
    id: "fig-arrow-" + r,
    markerWidth: "10",
    markerHeight: "10",
    refX: "8",
    refY: "5",
    orient: "auto",
    markerUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.5,1.5 L9,5 L1.5,8.5 Z",
    fill: roleColor(C, r)
  })))), children);
}

/* A tone names a role, not a colour. `t0`..`t3` tint a box with a thread's hue. */
export function toneOf(C, name = "plain") {
  const tinted = c => ({
    stroke: c,
    fill: c,
    fillOpacity: 0.14,
    text: C.fg,
    marker: c
  });
  const m = /^t([0-3])$/.exec(name);
  if (m) return tinted(C.T[+m[1]]);
  switch (name) {
    case "fg":
      return {
        stroke: C.fg,
        fill: C.bg,
        fillOpacity: 1,
        text: C.fg,
        marker: C.fg
      };
    case "acc":
      return tinted(C.acc);
    case "pos":
      return tinted(C.pos);
    case "neg":
      return tinted(C.neg);
    case "mid":
      return tinted(C.mid);
    case "solid":
      return {
        stroke: C.acc,
        fill: C.acc,
        fillOpacity: 1,
        text: "#fff",
        marker: C.acc
      };
    case "ghost":
      return {
        stroke: C.border,
        fill: C.bg,
        fillOpacity: 1,
        text: C.muted,
        marker: C.muted
      };
    default:
      return {
        stroke: C.muted,
        fill: C.bg,
        fillOpacity: 1,
        text: C.fg,
        marker: C.muted
      };
  }
}
export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/* Sub- and superscripts written "E_{out}" or "x_i", as real tspans: the Unicode
   subscript letters come from different fallback fonts and sit at different
   heights. dy accumulates in SVG, so every shifted run is undone by the next. */
const SYM_RE = /_\{([^}]*)\}|\^\{([^}]*)\}|_(\S)|\^(\S)/g;
export function symRuns(text, size = 12) {
  const runs = [];
  let last = 0,
    m;
  while ((m = SYM_RE.exec(String(text))) !== null) {
    if (m.index > last) runs.push({
      t: text.slice(last, m.index),
      shift: 0
    });
    const sub = m[1] != null || m[3] != null;
    runs.push({
      t: m[1] ?? m[2] ?? m[3] ?? m[4],
      shift: sub ? 1 : -1
    });
    last = SYM_RE.lastIndex;
  }
  SYM_RE.lastIndex = 0;
  if (last < String(text).length) runs.push({
    t: String(text).slice(last),
    shift: 0
  });
  if (!runs.some(r => r.shift)) return text;
  let prev = 0;
  const out = runs.map((r, i) => {
    const dy = (r.shift - prev) * size * 0.28;
    prev = r.shift;
    return /*#__PURE__*/React.createElement("tspan", {
      key: i,
      dy: dy,
      fontSize: r.shift ? size * 0.76 : size
    }, r.t);
  });
  if (prev !== 0) out.push(/*#__PURE__*/React.createElement("tspan", {
    key: "reset",
    dy: -prev * size * 0.28
  }));
  return out;
}

/* Code identifiers are full of underscores (bin_counts, loc_bin_cts), which
   symRuns would read as subscripts. `mono` text skips the markup. */
const textOf = (t, size, mono) => mono ? t : symRuns(t, size);
export function Sym({
  x,
  y,
  text,
  size = 12,
  fill,
  anchor = "start",
  weight,
  italic,
  mono,
  at,
  step
}) {
  return /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y,
    fontSize: size,
    fill: fill,
    textAnchor: anchor,
    fontWeight: weight,
    fontStyle: italic ? "italic" : undefined,
    fontFamily: mono ? MONO : undefined,
    style: {
      ...FADE,
      opacity: atStep(step, at)
    }
  }, textOf(text, size, mono));
}
export function Box({
  x,
  y,
  w,
  h,
  shape = "rect",
  tone: t,
  C,
  lines = [],
  rx = 5,
  at,
  step,
  dash,
  align = "center",
  pad = 12,
  strokeWidth = 1.4
}) {
  const T = toneOf(C, t);
  const lh = lines.reduce((s, l) => s + (l.size || 13) * 1.45, 0);
  let cursor = y + h / 2 - lh / 2;
  return /*#__PURE__*/React.createElement("g", {
    style: {
      ...FADE,
      opacity: atStep(step, at)
    }
  }, shape === "ellipse" ? /*#__PURE__*/React.createElement("ellipse", {
    cx: x + w / 2,
    cy: y + h / 2,
    rx: w / 2,
    ry: h / 2,
    fill: T.fill,
    fillOpacity: T.fillOpacity,
    stroke: T.stroke,
    strokeWidth: strokeWidth,
    strokeDasharray: dash || undefined
  }) : /*#__PURE__*/React.createElement("rect", {
    x: x,
    y: y,
    width: w,
    height: h,
    rx: rx,
    fill: T.fill,
    fillOpacity: T.fillOpacity,
    stroke: T.stroke,
    strokeWidth: strokeWidth,
    strokeDasharray: dash || undefined
  }), /*#__PURE__*/React.createElement("text", {
    x: align === "left" ? x + pad : x + w / 2,
    textAnchor: align === "left" ? "start" : "middle",
    fill: T.text
  }, lines.map((l, i) => {
    const size = l.size || 13;
    cursor += size * (i === 0 ? 1.05 : 1.45);
    return /*#__PURE__*/React.createElement("tspan", {
      key: i,
      x: align === "left" ? x + pad : x + w / 2,
      y: cursor,
      fontSize: size,
      fontWeight: l.weight || 400,
      fill: l.fill || T.text,
      fontStyle: l.italic ? "italic" : undefined,
      fontFamily: l.mono ? MONO : undefined
    }, textOf(l.t, size, l.mono));
  })));
}

/* Free text, wrapped by hand, one <text> per line (see the 473 kit for why). */
export function Lines({
  x,
  y,
  lines,
  size = 12.5,
  lh = 1.35,
  fill,
  anchor = "start",
  at,
  step,
  italic,
  mono
}) {
  return /*#__PURE__*/React.createElement("g", {
    style: {
      ...FADE,
      opacity: atStep(step, at)
    }
  }, lines.map((t, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: x,
    y: y + i * size * lh,
    textAnchor: anchor,
    fontSize: size,
    fill: fill,
    fontStyle: italic ? "italic" : undefined,
    fontFamily: mono ? MONO : undefined
  }, textOf(t, size, mono))));
}
export const port = (n, side) => ({
  top: [n.x + n.w / 2, n.y],
  bottom: [n.x + n.w / 2, n.y + n.h],
  left: [n.x, n.y + n.h / 2],
  right: [n.x + n.w, n.y + n.h / 2]
})[side];
export function Arrow({
  from,
  to,
  C,
  tone: t = "plain",
  dash,
  width = 1.5,
  at,
  step,
  head = true
}) {
  const T = toneOf(C, t);
  const role = ARROW_ROLES.indexOf(t) >= 0 ? t : "muted";
  return /*#__PURE__*/React.createElement("line", {
    x1: from[0],
    y1: from[1],
    x2: to[0],
    y2: to[1],
    stroke: T.marker,
    strokeWidth: width,
    strokeDasharray: dash || undefined,
    markerEnd: head ? `url(#fig-arrow-${role})` : undefined,
    style: {
      ...FADE,
      opacity: atStep(step, at)
    }
  });
}

/* ---- a reduction drawn as circles and sends (notes 01 and 04) ------------------
   mode "tree": `rounds` from treeSum (logic); round r pairs receivers at level r.
   mode "naive": `steps` from naiveSum; core 0 adds one value per step.
   `values` puts numbers in the top circles and partial sums in the + nodes; without
   it the nodes read "+" as on L4 slide 33. The vertical spacing is the same in both
   modes, so the naive chain is visibly taller: the height is the critical path. */
export function SumTree({
  C,
  p = 8,
  mode = "tree",
  rounds = [],
  steps = [],
  values = null,
  levelGap = 58
}) {
  const X0 = 96,
    DX = 62,
    R = 16,
    TOP = values ? 44 : 26;
  const cx = i => X0 + i * DX;
  const ly = l => TOP + l * levelGap;
  const levels = mode === "tree" ? rounds.length : steps.length;
  const H = ly(levels) + R + 10;
  const nodes = []; // { level, at, label }
  const sends = []; // { from: [x, y], to: [x, y] }
  const keeps = []; // dashed "keeps its running sum" segments
  if (mode === "tree") {
    const sumAt = {}; // thread -> level of its latest node
    for (let i = 0; i < p; i++) sumAt[i] = 0;
    rounds.forEach((round, r) => {
      const l = r + 1;
      round.forEach(e => {
        sends.push({
          from: [cx(e.from), ly(sumAt[e.from])],
          to: [cx(e.to), ly(l)]
        });
        keeps.push({
          x: cx(e.to),
          y1: ly(sumAt[e.to]),
          y2: ly(l)
        });
        nodes.push({
          level: l,
          at: e.to,
          label: values ? String(e.sum) : "+"
        });
        sumAt[e.to] = l;
      });
    });
  } else {
    steps.forEach((e, j) => {
      const l = j + 1;
      sends.push({
        from: [cx(e.from), ly(0)],
        to: [cx(0), ly(l)]
      });
      keeps.push({
        x: cx(0),
        y1: ly(l - 1),
        y2: ly(l)
      });
      nodes.push({
        level: l,
        at: 0,
        label: values ? String(e.sum) : "+"
      });
    });
  }
  const unit = (dx, dy) => {
    const n = Math.hypot(dx, dy);
    return [dx / n, dy / n];
  };
  const circle = (x, y, label, key, strong) => /*#__PURE__*/React.createElement("g", {
    key: key
  }, /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: R,
    fill: C.bg,
    stroke: strong ? C.fg : C.muted,
    strokeWidth: strong ? 1.8 : 1.4
  }), /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y + 4.5,
    textAnchor: "middle",
    fontSize: label.length > 2 ? 11.5 : 13,
    fill: C.fg
  }, label));
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${cx(p - 1) + 30} ${H}`,
    role: "img",
    style: {
      width: "100%",
      height: "auto",
      maxWidth: 600,
      display: "block",
      margin: "0 auto",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    },
    "aria-label": mode === "tree" ? `${rounds.length} rounds: ` + rounds.map((rd, r) => `round ${r + 1}: ` + rd.map(e => `${e.from} into ${e.to}`).join(", ")).join("; ") : `${steps.length} steps, each adding one core's value into core 0`
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("marker", {
    id: "sumtree-arrow",
    markerWidth: "10",
    markerHeight: "10",
    refX: "8",
    refY: "5",
    orient: "auto",
    markerUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.5,1.5 L9,5 L1.5,8.5 Z",
    fill: C.fg
  }))), Array.from({
    length: levels
  }, (_, l) => /*#__PURE__*/React.createElement("text", {
    key: "lbl" + l,
    x: 0,
    y: ly(l + 1) + 4,
    fontSize: "12.5",
    fill: C.muted
  }, `${mode === "tree" ? "round" : "step"} ${l + 1}`)), keeps.map((k, i) => /*#__PURE__*/React.createElement("line", {
    key: "k" + i,
    x1: k.x,
    y1: k.y1 + R,
    x2: k.x,
    y2: k.y2 - R,
    stroke: C.muted,
    strokeWidth: "1.3",
    strokeDasharray: "4 3"
  })), sends.map((s, i) => {
    const [ux, uy] = unit(s.to[0] - s.from[0], s.to[1] - s.from[1]);
    return /*#__PURE__*/React.createElement("line", {
      key: "s" + i,
      x1: s.from[0] + ux * R,
      y1: s.from[1] + uy * R,
      x2: s.to[0] - ux * (R + 2),
      y2: s.to[1] - uy * (R + 2),
      stroke: C.fg,
      strokeWidth: "1.3",
      markerEnd: "url(#sumtree-arrow)"
    });
  }), values && Array.from({
    length: p
  }, (_, i) => /*#__PURE__*/React.createElement("text", {
    key: "core" + i,
    x: cx(i),
    y: ly(0) - R - 7,
    textAnchor: "middle",
    fontSize: "11",
    fill: C.muted
  }, `core ${i}`)), Array.from({
    length: p
  }, (_, i) => circle(cx(i), ly(0), values ? String(values[i]) : String(i), "t" + i)), nodes.map((n, i) => circle(cx(n.at), ly(n.level), n.label, "n" + i, i === nodes.length - 1)));
}