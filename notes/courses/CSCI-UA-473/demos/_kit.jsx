/* CSCI-UA-473 demo kit. The shared chrome lives in the global kit; this file
   holds only what is specific to this course: the class-label palette and a
   Python tokenizer. See ../../../artifacts/kit.jsx for the shared exports.

   Mcq used to be reimplemented here with inline styles, because .mm-* had no
   styles outside CSCI-UA-470. Its styles now live in theme.css as the .ui-*
   tier, so this course shares 470's component and its look. */
import React from "react";
import { registerLang, renderCaption, tokenize, useTheme } from "@kit";

/* NOT re-exported from @kit: DiagramSvg and diagramPalette. Both resolve CSS
   custom properties (--mm-muted, --mm-cell-bg, --seg-*-bg) that are defined only
   in CSCI-UA-470/demos/_shared.css. note.js injects theme.css plus *this course's*
   _shared.css into the artifact iframe, and ours deliberately defines no .mm-*
   tier, so those var() lookups resolve to nothing: an invalid `fill` falls back to
   inherited black in both themes. FigureSvg below is the 473 replacement, with its
   arrowheads coloured from useClassColors() like every other mark in this course. */
export { KnobBar, CompareCaption, CodeBlock,
         Mcq, McqFigure, mcq, renderCaption } from "@kit";

/* Semantic colours for class labels. These are not arbitrary series colours, so
   they stay named rather than folding into diagramPalette. Light values clear
   3:1 on white and dark values clear 7:1 on the dark background, which is the
   WCAG 1.4.11 bar for graphical objects. They do NOT clear 4.5:1 for text, so
   never draw text in `acc` — use `fg`. */
/* `mid` is the midpoint of the pos<->neg diverging scale. Interpolating straight
   from green to orange passes through olive, which reads as a third category
   rather than as "no signal"; routing through a neutral gray says undecided and
   still carries white text (>= 4.5:1 in both themes). */
const LIGHT = { pos: "#1D9E75", neg: "#D85A30", acc: "#7F77DD", mid: "#6B7280" };
const DARK  = { pos: "#34D399", neg: "#FB923C", acc: "#A78BFA", mid: "#717A88" };

/* Canvas silently ignores a colour it cannot parse, and it cannot parse
   `hsl(var(--token))`: assigning one leaves strokeStyle/fillStyle at its PREVIOUS
   value. These four used to be returned in exactly that form, so every canvas figure
   in this course drew its grid, axes, labels and halos in whatever colour happened to
   be current - which is why label halos came out rimmed in the last bar's orange and
   grids came out black instead of grey. SVG resolves var() fine, which is why the
   Boolean-cube figure was never affected and the bug stayed hidden.

   Resolved to literals here, once per theme change. The fallbacks match theme.css so
   a figure still renders correctly if it is ever drawn before the stylesheet lands. */
const FALLBACK = {
  light: { fg: "#020817", muted: "#64748b", border: "#e2e8f0", bg: "#ffffff" },
  dark:  { fg: "#f8fafc", muted: "#94a3b8", border: "#1e293b", bg: "#020817" },
};

function readToken(name, fallback) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? "hsl(" + v + ")" : fallback;
}

export function useClassColors() {
  const theme = useTheme();
  const dark = theme === "dark";
  const c = dark ? DARK : LIGHT;
  const fb = dark ? FALLBACK.dark : FALLBACK.light;
  return React.useMemo(() => ({
    ...c,
    fg: readToken("--foreground", fb.fg),
    muted: readToken("--muted-foreground", fb.muted),
    border: readToken("--border", fb.border),
    bg: readToken("--background", fb.bg),
  }), [theme]);
}

export function buttonStyle(C, active) {
  return { background: active ? C.border : C.bg, border: `1px solid ${active ? C.fg : C.border}`,
    borderRadius: "6px", color: C.fg, padding: "6px 10px", cursor: "pointer", font: "inherit",
    fontWeight: active ? 500 : 400 };
}

export function readoutStyle(C) {
  return { margin: "0 0 6px", color: C.muted, fontSize: "13px", lineHeight: 1.5,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" };
}

export function labelStyle(C) {
  return { color: C.muted, fontSize: "13px" };
}

/* Python uses `#` comments and leaves `//` as operators. CodeBlock highlights
   one line at a time, so a multi-line triple-quoted string cannot be one span;
   only a complete single-line one is string-coloured, and a bare delimiter is
   punctuation. Prefix letters (`f`, `r`, `b`) tokenize separately from their strings. */
const PY_KW = new Set(["def", "return", "if", "elif", "else", "for", "while", "in",
  "not", "and", "or", "import", "from", "as", "class", "lambda", "None", "True",
  "False", "with", "try", "except", "raise", "yield", "pass", "break", "continue",
  "global", "assert", "del", "is"]);
const PY_RE = /(#[^\n]*)|("""[\s\S]*?"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_])/g;

registerLang("python", (line) => tokenize(line, PY_RE, (m) =>
  m[1] ? "mm-tok-com" : m[2] ? "mm-tok-str" : m[3] ? "mm-tok-num"
    : m[4] ? (PY_KW.has(m[4]) ? "mm-tok-kw" : undefined) : undefined));

/* ---- Plot: the shared drawing surface for this course's figures ----

   Every figure used to carry its own X()/Y() transform, its own grid weights and its
   own label handling, so the visual vocabulary drifted file by file: grids as heavy
   as axes, status rings indistinguishable from emphasis rings, labels that merged
   where points clustered. Encapsulating the coordinate system and the chrome makes
   the house style the default instead of something each file re-types.

   Responsibilities are split deliberately:
     _logic.mjs  the maths, pure and testable, no DOM
     Plot        rendering and coordinates, no React, no domain knowledge
     component   state and controls

   Plot knows nothing about perceptrons or polynomials; subclasses add the marks a
   particular kind of figure needs. */

export class Plot {
  constructor(canvas, opts = {}) {
    const { width = 400, height = 240, pad = 32, padTop = 12, padRight = 12,
            xDomain = [0, 1], yDomain = [0, 1], colors } = opts;
    if (!canvas) throw new Error("Plot needs a canvas");
    this.cv = canvas;
    this.w = width; this.h = height;
    this.pad = pad; this.padTop = padTop; this.padRight = padRight;
    this.xDomain = xDomain; this.yDomain = yDomain;
    this.C = colors;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = height * dpr;
    this.g = canvas.getContext("2d");
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.g.clearRect(0, 0, width, height);
  }

  // ---- coordinates ----
  get left() { return this.pad; }
  get right() { return this.w - this.padRight; }
  get top() { return this.padTop; }
  get bottom() { return this.h - this.pad; }

  x(v) {
    const [a, b] = this.xDomain;
    return this.left + ((v - a) / (b - a)) * (this.right - this.left);
  }
  y(v) {
    const [a, b] = this.yDomain;
    return this.bottom - ((v - a) / (b - a)) * (this.bottom - this.top);
  }

  // ---- chrome ----
  /* Grid is scaffolding and axes are information, so they never share a weight.
     Getting this wrong is what made the earlier figures read as graph paper. */
  grid({ xTicks = 0, yTicks = 4 } = {}) {
    const g = this.g;
    g.strokeStyle = this.C.border; g.lineWidth = 1; g.globalAlpha = 0.5;
    g.beginPath();
    for (let k = 0; k <= yTicks; k++) {
      const yy = this.top + (k / yTicks) * (this.bottom - this.top);
      g.moveTo(this.left, yy); g.lineTo(this.right, yy);
    }
    for (let k = 0; xTicks && k <= xTicks; k++) {
      const xx = this.left + (k / xTicks) * (this.right - this.left);
      g.moveTo(xx, this.top); g.lineTo(xx, this.bottom);
    }
    g.stroke(); g.globalAlpha = 1;
    return this;
  }

  /* `x` and `y` select which axes get drawn. An axis line with no scale behind it is
     decoration, and decoration at the same weight as real structure is what made these
     figures read as boxes rather than as plots. */
  axes({ atY = null, atX = null, x = true, y = true } = {}) {
    const g = this.g;
    g.strokeStyle = this.C.muted; g.lineWidth = 1.25; g.beginPath();
    if (x) {
      const yy = atY == null ? this.bottom : this.y(atY);
      g.moveTo(this.left, yy); g.lineTo(this.right, yy);
    }
    if (y) {
      const xx = atX == null ? this.left : this.x(atX);
      g.moveTo(xx, this.top); g.lineTo(xx, this.bottom);
    }
    g.stroke();
    return this;
  }

  // ---- marks ----
  /* Clipping is on by default: an overfit degree-9 curve leaves the panel by a mile,
     and letting it paint over the axes makes the figure look broken rather than
     making the point. */
  curve(fn, { color, width = 2, dash = null, samples = 300, clip = true } = {}) {
    const g = this.g;
    if (clip) { g.save(); g.beginPath(); g.rect(this.left, this.top, this.right - this.left, this.bottom - this.top); g.clip(); }
    g.strokeStyle = color || this.C.acc; g.lineWidth = width;
    if (dash) g.setLineDash(dash);
    g.beginPath();
    const [a, b] = this.xDomain;
    for (let i = 0; i <= samples; i++) {
      const xv = a + (i / samples) * (b - a);
      const px = this.x(xv), py = this.y(fn(xv));
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.stroke();
    g.setLineDash([]);
    if (clip) g.restore();
    return this;
  }

  polyline(pts, opts = {}) {
    const g = this.g;
    g.strokeStyle = opts.color || this.C.acc; g.lineWidth = opts.width || 2;
    if (opts.dash) g.setLineDash(opts.dash);
    g.beginPath();
    pts.forEach(([xv, yv], i) => (i ? g.lineTo(this.x(xv), this.y(yv)) : g.moveTo(this.x(xv), this.y(yv))));
    g.stroke(); g.setLineDash([]);
    return this;
  }

  /* A background-coloured rim, not a decorative outline: where points cluster the
     rim is the only thing keeping two overlapping markers legible. */
  dot(xv, yv, { color, r = 4.5, halo = true, ring = null, ringWidth = 2 } = {}) {
    const g = this.g, px = this.x(xv), py = this.y(yv);
    g.fillStyle = color || this.C.acc;
    g.beginPath(); g.arc(px, py, r, 0, 2 * Math.PI); g.fill();
    if (halo) { g.strokeStyle = this.C.bg; g.lineWidth = 1.5; g.stroke(); }
    if (ring) {
      g.strokeStyle = ring; g.lineWidth = ringWidth;
      g.beginPath(); g.arc(px, py, r + 5, 0, 2 * Math.PI); g.stroke();
    }
    return this;
  }

  band(x0, x1, { color, alpha = 0.14 } = {}) {
    const g = this.g;
    g.fillStyle = color || this.C.acc; g.globalAlpha = alpha;
    g.fillRect(this.x(x0), this.top, this.x(x1) - this.x(x0), this.bottom - this.top);
    g.globalAlpha = 1;
    return this;
  }

  /* A band across y, for tolerances like Hoeffding's epsilon. `band` covers a range of
     x; these are not interchangeable and using the wrong one washes the whole panel. */
  hband(y0, y1, { color, alpha = 0.14 } = {}) {
    const g = this.g;
    g.fillStyle = color || this.C.acc; g.globalAlpha = alpha;
    g.fillRect(this.left, this.y(y1), this.right - this.left, this.y(y0) - this.y(y1));
    g.globalAlpha = 1;
    return this;
  }

  vline(xv, { color, width = 2, dash = null } = {}) {
    const g = this.g;
    g.strokeStyle = color || this.C.fg; g.lineWidth = width;
    if (dash) g.setLineDash(dash);
    g.beginPath(); g.moveTo(this.x(xv), this.top); g.lineTo(this.x(xv), this.bottom); g.stroke();
    g.setLineDash([]);
    return this;
  }

  /* Labels carry the same halo as markers, for the same reason. */
  label(text, px, py, { color, size = 11, halo = true, align = "left" } = {}) {
    const g = this.g;
    g.font = size + "px sans-serif"; g.textAlign = align;
    // 3px of halo swallows an 11px glyph; just enough to separate, not to bolden.
    if (halo) { g.lineWidth = 2.25; g.strokeStyle = this.C.bg; g.lineJoin = "round"; g.strokeText(text, px, py); }
    g.fillStyle = color || this.C.muted; g.fillText(text, px, py);
    g.textAlign = "left";
    return this;
  }

  labelAt(text, xv, yv, opts = {}) {
    return this.label(text, this.x(xv) + (opts.dx || 0), this.y(yv) + (opts.dy || 0), opts);
  }
}

/* Adds binned counts. Kept as a subclass rather than a flag on Plot because a
   histogram owns its own y scale: counts, derived from the data, not supplied. */
export class HistogramPlot extends Plot {
  bins(values, { bins = 40, inside = () => true, insideColor, outsideColor } = {}) {
    const counts = new Array(bins).fill(0);
    values.forEach((v) => {
      const [a, b] = this.xDomain;
      const k = Math.floor(((v - a) / (b - a)) * bins);
      if (k >= 0 && k < bins) counts[k]++;
    });
    const peak = Math.max(1, ...counts);
    const bw = (this.right - this.left) / bins;
    const g = this.g;
    counts.forEach((c, i) => {
      if (!c) return;
      const [a, b] = this.xDomain;
      const centre = a + ((i + 0.5) / bins) * (b - a);
      const ok = inside(centre);
      const hh = (c / peak) * (this.bottom - this.top);
      g.fillStyle = ok ? (insideColor || this.C.acc) : (outsideColor || this.C.neg);
      g.globalAlpha = ok ? 0.85 : 1;
      g.fillRect(this.left + i * bw + 0.5, this.bottom - hh, bw - 1, hh);
    });
    g.globalAlpha = 1;
    return this;
  }
}

/* ============================================================================
   Static figures
   ----------------------------------------------------------------------------
   The interactive demos in this course are canvas plots driven by state. The
   figures added for notes 00-05 are the other kind: a fixed picture that ports a
   slide the lecturer draws, with no knobs. They still need a shared vocabulary,
   or each one re-invents boxes, arrowheads and table cells and the set drifts.

   Same three-layer split the Plot block above documents:
     _logic.mjs   the maths, pure and testable
     this layer   drawing primitives — SVG components and the Scene3D class
     the demo     a data spec, and nothing else where that is possible

   Two surfaces, chosen by what the figure is made of:
     FigureSvg    boxes, tables, arrows, labelled equations. Vector, selectable
                  text, no devicePixelRatio bookkeeping.
     Scene3D      anything with a camera in it. Canvas, because a 3D scene is
                  redrawn per frame and per drag.
   ========================================================================== */

/* A figure that is "static" in the note (```artifact ... static) is not
   necessarily still: the lecturer's own slides build the components diagram one
   box per click, and replaying that build is the figure's whole pedagogical
   point. What `static` rules out is controls, not motion.

   Motion is gated on visibility for two independent reasons. The honest one is
   that an animation which has already finished by the time you scroll to it has
   communicated nothing. The mechanical one is in artifact-host.html: an
   off-screen iframe may never paint, so rAF never fires there — the host had to
   grow runAfterPaint() for exactly that. IntersectionObserver is the signal that
   actually tracks "on screen", so it drives both the step reveals (setInterval,
   which does run off-screen and would otherwise burn through the whole sequence
   unseen) and the 3D spin (rAF, which would silently stall). */
const reducedMotion = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useVisible(ref, { once = false } = {}) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    // No IntersectionObserver (old engine, or the node kit harness): degrade to
    // "always visible" rather than to a figure that never draws.
    if (!el || typeof IntersectionObserver === "undefined") { setVisible(true); return undefined; }
    const io = new IntersectionObserver((entries) => {
      const on = entries.some((e) => e.isIntersecting);
      if (on || !once) setVisible(on);
      if (on && once) io.disconnect();
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once]);
  return visible;
}

/* Returns the index of the currently revealed step, 0 .. steps-1. Under reduced
   motion it returns the final step immediately: the figure is complete, just not
   animated, which is the correct fallback for a diagram (unlike a carousel,
   nothing is lost by showing the end state). */
export function useReveal(ref, steps, { ms = 900 } = {}) {
  const visible = useVisible(ref, { once: true });
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    if (steps <= 1 || reducedMotion()) { setStep(Math.max(0, steps - 1)); return undefined; }
    if (!visible) return undefined;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= steps - 1) clearInterval(id);
    }, ms);
    return () => clearInterval(id);
  }, [visible, steps, ms]);
  return step;
}

/* Opacity for an element that appears at `at` and is hidden before it. Elements
   with no step are always on, so a figure that never animates needs no changes. */
export const atStep = (step, at) => (at == null || step >= at ? 1 : 0);
const FADE = { transition: "opacity .45s ease" };

/* ---- the shell every figure shares ---------------------------------------
   The sr-only <h2> is the artifact's accessible title and is also what the note
   reads back for its collapsible bar, so it is a sentence describing the figure,
   not a label. Static figures render bare (note.js), so the caption below the
   drawing is the only prose the reader gets. */
export function Figure({ title, caption, children }) {
  const C = useClassColors();
  return (
    <>
      <h2 className="sr-only">{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: C.fg }}>
        {children}
        {caption ? (
          <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.55, color: C.muted }}>
            {renderCaption(caption)}
          </p>
        ) : null}
      </div>
    </>
  );
}

/* ---- SVG surface ---------------------------------------------------------
   One arrowhead marker per palette role. @kit's DiagramSvg fills its markers
   from var(--mm-muted), which does not exist outside CSCI-UA-470 (see the
   re-export comment at the top of this file), so this course defines its own and
   colours them from useClassColors() like every other mark here. */
const ARROW_ROLES = ["fg", "muted", "acc", "pos", "neg", "mid"];

export function FigureSvg({ viewBox, ariaLabel, maxWidth = 680, children }) {
  const C = useClassColors();
  return (
    <svg viewBox={viewBox} role="img" aria-label={ariaLabel}
      style={{ width: "100%", height: "auto", maxWidth, display: "block", margin: "0 auto",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
      <defs>
        {ARROW_ROLES.map((r) => (
          <marker key={r} id={"fig-arrow-" + r} markerWidth="10" markerHeight="10" refX="8" refY="5"
            orient="auto" markerUnits="userSpaceOnUse">
            <path d="M1.5,1.5 L9,5 L1.5,8.5 Z" fill={C[r]} />
          </marker>
        ))}
      </defs>
      {children}
    </svg>
  );
}

/* ---- real TeX inside a figure --------------------------------------------

   The Unicode route only ever got close: ℍ, 𝕏 and 𝒜 come from three Unicode
   blocks and resolve from three fallback fonts, subscripts are worse, and
   anything with a fraction or a sum over i=1..N is simply not expressible. The
   artifact host can load MathJax per artifact (the `math` flag on the fence), so
   a figure that needs real notation asks for it and gets the same typesetting as
   the surrounding note.

   The bundle is tex-mml-chtml, so the output is HTML, not SVG — there is no
   tex2svg to call. HTML goes inside an <svg> through <foreignObject>, whose
   contents live in user units and therefore scale with the viewBox like every
   other mark. React switches namespace correctly for foreignObject children, and
   MathJax's DOM walk reaches them.

   Positioning: foreignObject has no text anchor, so the box is placed by hand and
   the div inside it is aligned with text-align. Boxes are generously sized because
   a foreignObject clips, and a clipped equation is worse than a loose one. */
export function useTypeset(deps = []) {
  React.useEffect(() => {
    // Defined by artifact-host.html only for math-flagged artifacts; a figure that
    // renders without the flag still mounts, just with raw TeX source visible.
    if (typeof window === "undefined" || !window.typesetMath) return undefined;
    window.typesetMath();
    // One retry: a reveal step or a theme change can add nodes after the host's
    // own post-paint typeset has already run.
    const t = setTimeout(() => { if (window.typesetMath) window.typesetMath(); }, 450);
    return () => clearTimeout(t);
  }, deps);
}

export function TeX({ x, y, tex, size = 13, fill, anchor = "start", w = 300, h, dy = 0,
                      at, step, weight }) {
  const height = h || size * 2.6;
  const left = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  return (
    <foreignObject x={left} y={y - size * 1.25 + dy} width={w} height={height}
      style={{ overflow: "visible", ...FADE, opacity: atStep(step, at) }}>
      <div xmlns="http://www.w3.org/1999/xhtml" style={{
        fontSize: size + "px", color: fill, lineHeight: 1.25, width: w + "px",
        fontWeight: weight,
        textAlign: anchor === "middle" ? "center" : anchor === "end" ? "right" : "left",
      }}>{"\\(" + tex + "\\)"}</div>
    </foreignObject>
  );
}

/* A tone names the semantic role of a mark, not a colour: `acc` is "the thing
   under discussion", `pos`/`neg` are the two classes, `solid` is the one filled
   shape the slide uses for the learning algorithm. Keeping the mapping in one
   place is what stops figure N+1 from inventing a sixth shade of purple. */
export function toneOf(C, name = "plain") {
  const tinted = (c) => ({ stroke: c, fill: c, fillOpacity: 0.14, text: C.fg, marker: c });
  switch (name) {
    case "acc":   return tinted(C.acc);
    case "pos":   return tinted(C.pos);
    case "neg":   return tinted(C.neg);
    case "mid":   return tinted(C.mid);
    case "solid": return { stroke: C.acc, fill: C.acc, fillOpacity: 1, text: "#fff", marker: C.acc };
    case "ghost": return { stroke: C.border, fill: C.bg, fillOpacity: 1, text: C.muted, marker: C.muted };
    default:      return { stroke: C.muted, fill: C.bg, fillOpacity: 1, text: C.fg, marker: C.muted };
  }
}

/* ---- SVG primitives ------------------------------------------------------ */

/* A labelled box or ellipse. `lines` is the stacked text block, centred as a
   unit so a one-line and a three-line box still look like the same component. */
/* 𝕏, 𝕐, ℍ and 𝒜 come from three different Unicode blocks, and a sans-serif
   stack resolves them from three different fallback fonts: ℍ in particular lands
   somewhere that draws it as a narrow "IH". A math stack keeps the deck's symbols
   looking like one alphabet. */
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const MATH = '"STIX Two Math", "Cambria Math", "Latin Modern Math", Georgia, serif';

/* Sub- and superscripts, written "E_{out}(h)" or "2e^{-2ε²N}".

   The Unicode subscript letters are spread across three blocks — ₒ and ₜ live in
   Subscripts and Superscripts, ᵤ in Phonetic Extensions — and a sans-serif stack
   resolves them from different fallback fonts, so "Eₒᵤₜ" renders with the u
   sitting visibly higher than the o and t next to it. Real tspans instead, which
   also means the shift is proportional to the font size rather than baked into a
   glyph. dy accumulates in SVG, so every shifted run is undone by the next. */
const SYM_RE = /_\{([^}]*)\}|\^\{([^}]*)\}|_(\S)|\^(\S)/g;

export function symRuns(text, size = 12) {
  const runs = [];
  let last = 0, m;
  while ((m = SYM_RE.exec(String(text))) !== null) {
    if (m.index > last) runs.push({ t: text.slice(last, m.index), shift: 0 });
    const sub = m[1] != null || m[3] != null;
    runs.push({ t: m[1] ?? m[2] ?? m[3] ?? m[4], shift: sub ? 1 : -1 });
    last = SYM_RE.lastIndex;
  }
  SYM_RE.lastIndex = 0;
  if (last < String(text).length) runs.push({ t: String(text).slice(last), shift: 0 });
  if (!runs.some((r) => r.shift)) return text;
  let prev = 0;
  const out = runs.map((r, i) => {
    const dy = (r.shift - prev) * size * 0.28;
    prev = r.shift;
    return <tspan key={i} dy={dy} fontSize={r.shift ? size * 0.76 : size}>{r.t}</tspan>;
  });
  // A line that ends on a shifted run would leave the pen off the baseline, and
  // the next line in a Lines block is positioned with a relative dy from there.
  if (prev !== 0) out.push(<tspan key="reset" dy={-prev * size * 0.28} />);
  return out;
}

/* Standalone marked-up text; `lines` in Box and Lines take the same syntax. */
export function Sym({ x, y, text, size = 12, fill, anchor = "start", weight, italic, at, step }) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} fontWeight={weight}
      fontStyle={italic ? "italic" : undefined}
      style={{ ...FADE, opacity: atStep(step, at) }}>{symRuns(text, size)}</text>
  );
}

export function Box({ x, y, w, h, shape = "rect", tone: t, C, lines = [], rx = 5, at, step, dash, align = "center", pad = 12 }) {
  const T = toneOf(C, t);
  const lh = lines.reduce((s, l) => s + (l.size || 13) * 1.45, 0);
  let cursor = y + h / 2 - lh / 2;
  return (
    <g style={{ ...FADE, opacity: atStep(step, at) }}>
      {shape === "ellipse"
        ? <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2}
            fill={T.fill} fillOpacity={T.fillOpacity} stroke={T.stroke} strokeWidth="1.4"
            strokeDasharray={dash || undefined} />
        : <rect x={x} y={y} width={w} height={h} rx={rx}
            fill={T.fill} fillOpacity={T.fillOpacity} stroke={T.stroke} strokeWidth="1.4"
            strokeDasharray={dash || undefined} />}
      <text x={align === "left" ? x + pad : x + w / 2} textAnchor={align === "left" ? "start" : "middle"} fill={T.text}>
        {lines.map((l, i) => {
          const size = l.size || 13;
          cursor += size * (i === 0 ? 1.05 : 1.45);
          return (
            <tspan key={i} x={align === "left" ? x + pad : x + w / 2} y={cursor} fontSize={size}
              fontWeight={l.weight || 400} fill={l.fill || T.text}
              fontStyle={l.italic ? "italic" : undefined}
              fontFamily={l.mono ? MONO : l.math ? MATH : undefined}>
              {symRuns(l.t, size)}
            </tspan>
          );
        })}
      </text>
    </g>
  );
}

/* Free text, wrapped by hand: SVG has no flow layout, so a caption sitting
   beside a box is a list of lines and the figure decides where they break. */
export function Lines({ x, y, lines, size = 12.5, lh = 1.35, fill, anchor = "start", at, step, italic }) {
  /* One <text> per line rather than one <text> of dy-stacked tspans: symRuns
     emits tspans that shift the baseline for sub- and superscripts, and nesting
     those inside a tspan that also carries the line's dy made the two shifts
     interact — a line ending in markup drew on top of the line above it. */
  return (
    <g style={{ ...FADE, opacity: atStep(step, at) }}>
      {lines.map((t, i) => (
        <text key={i} x={x} y={y + i * size * lh} textAnchor={anchor} fontSize={size} fill={fill}
          fontStyle={italic ? "italic" : undefined}>{symRuns(t, size)}</text>
      ))}
    </g>
  );
}

export const port = (n, side) => ({
  top:    [n.x + n.w / 2, n.y],
  bottom: [n.x + n.w / 2, n.y + n.h],
  left:   [n.x, n.y + n.h / 2],
  right:  [n.x + n.w, n.y + n.h / 2],
}[side]);

export function Arrow({ from, to, C, tone: t = "plain", dash, width = 1.5, at, step, head = true }) {
  const T = toneOf(C, t);
  const role = ARROW_ROLES.indexOf(t) >= 0 ? t : (t === "plain" ? "muted" : "muted");
  return (
    <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}
      stroke={T.marker} strokeWidth={width} strokeDasharray={dash || undefined}
      markerEnd={head ? `url(#fig-arrow-${role})` : undefined}
      style={{ ...FADE, opacity: atStep(step, at) }} />
  );
}

/* A square bracket, drawn as three strokes. Matrices in these figures are real
   grids rather than glyphs, so their delimiters have to be drawn too. */
export function Bracket({ x, y, h, w = 7, side = "left", C, at, step }) {
  const s = side === "left" ? 1 : -1;
  const d = `M${x + s * w},${y} L${x},${y} L${x},${y + h} L${x + s * w},${y + h}`;
  return <path d={d} fill="none" stroke={C.muted} strokeWidth="1.3"
    style={{ ...FADE, opacity: atStep(step, at) }} />;
}

/* A grid of cells with optional headers. Covers the design matrix, the two cost
   matrices and the joint-probability table — three figures that would otherwise
   each hand-roll <rect> loops with subtly different padding. */
export function TableGrid({
  x, y, cw = 52, ch = 30, cells, colHead, rowHead, corner, C,
  headSize = 12, size = 12.5, at, step, mono = true, rule = true, texHead = false,
}) {
  const rows = cells.length, cols = cells[0].length;
  const hx = rowHead ? cw : 0, hy = colHead ? ch : 0;
  const font = mono ? MONO : undefined;
  /* Headers are the part of a table that carries notation — p_X(x), \hat y, the
     column of ones — so they can opt into real TeX while the cells stay plain
     numbers in the mono face. */
  const head = (t, hxp, hyp, anchor, key) => (texHead
    ? <TeX key={key} x={hxp} y={hyp} anchor={anchor} w={cw * 2} size={headSize}
        fill={C.muted} tex={t} />
    : <text key={key} x={hxp} y={hyp} textAnchor={anchor} fontSize={headSize}
        fill={C.muted} fontStyle={key === "corner" ? "italic" : undefined}>{symRuns(t, headSize)}</text>);
  return (
    <g style={{ ...FADE, opacity: atStep(step, at) }}>
      {corner ? head(corner, x + hx / 2, y + hy / 2 + 4, "middle", "corner") : null}
      {colHead ? colHead.map((h, c) =>
        head(h, x + hx + c * cw + cw / 2, y + hy - 8, "middle", "ch" + c)) : null}
      {rowHead ? rowHead.map((h, r) =>
        head(h, x + hx - 8, y + hy + r * ch + ch / 2 + 4, "end", "rh" + r)) : null}
      {cells.map((row, r) => row.map((cell, c) => {
        if (!cell) return null;
        const T = toneOf(C, cell.tone);
        const cx = x + hx + c * cw, cy = y + hy + r * ch;
        return (
          <g key={r + "-" + c}>
            <rect x={cx} y={cy} width={cw} height={ch}
              fill={cell.tone ? T.fill : C.bg} fillOpacity={cell.tone ? (cell.alpha ?? T.fillOpacity) : 1}
              stroke={rule ? C.border : "none"} strokeWidth="1" />
            <text x={cx + cw / 2} y={cy + ch / 2 + 4.5} textAnchor="middle" fontSize={size}
              fontFamily={font} fontWeight={cell.bold ? 600 : 400}
              fill={cell.fg || (cell.tone === "solid" ? "#fff" : C.fg)}>{cell.t}</text>
          </g>
        );
      }))}
    </g>
  );
}

/* ---- Scene3D: the camera, promoted out of bias-absorption-3d ---------------
   That demo grew a private proj/poly/seg/arrow set for the lifted-input picture.
   The projection figure in note 05 needs exactly the same camera, so the maths
   moves here and the demo keeps only its scene. Same transform as before, so the
   refactor changes no pixels: rotate about the vertical by `yaw`, then tilt by
   `pitch`. A point is [x1, x2, z] — the horizontal plane first, height last,
   which is the order the lifted-input scene reads in.

   Depth is painter order, not a z-buffer: these scenes are a plane and a handful
   of vectors, and sorting faces would buy nothing over calling them in order. */
export class Scene3D {
  constructor(canvas, opts = {}) {
    const { height = 320, yaw = -1.05, pitch = 0.5, scale, colors, center = null } = opts;
    if (!canvas) throw new Error("Scene3D needs a canvas");
    const w = canvas.clientWidth || opts.width || 640;
    const dpr = (typeof window !== "undefined" && window.devicePixelRatio) || 1;
    canvas.width = w * dpr; canvas.height = height * dpr;
    this.cv = canvas; this.w = w; this.h = height;
    this.yaw = yaw; this.pitch = pitch;
    this.C = colors;
    /* Scene-space point to put at the centre of the canvas. Without it a scene
       whose interesting region is not centred on its own origin — a plane drawn
       from the origin outwards, say — sits in one corner with the rest of the
       canvas empty. */
    this.center = center;
    this.cam = { cx: opts.cx ?? w / 2, cy: opts.cy ?? height * 0.56,
                 s: scale ?? Math.min(w, height) / 6.2 };
    this.g = canvas.getContext("2d");
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.g.clearRect(0, 0, w, height);
    this.g.font = "13px sans-serif";
  }

  project(p) {
    const c = this.center;
    const [x, y, z] = c ? [p[0] - c[0], p[1] - c[1], p[2] - c[2]] : p;
    const { cx, cy, s } = this.cam;
    const X = x * Math.cos(this.yaw) - y * Math.sin(this.yaw);
    const Y = x * Math.sin(this.yaw) + y * Math.cos(this.yaw);
    return [cx + s * X, cy - s * (z * Math.cos(this.pitch) + Y * Math.sin(this.pitch))];
  }

  poly(pts, { fill, alpha = 0.18, stroke, width = 1 } = {}) {
    if (pts.length < 3) return this;
    const g = this.g;
    g.beginPath();
    pts.forEach((p, i) => { const q = this.project(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); });
    g.closePath();
    if (fill) { g.globalAlpha = alpha; g.fillStyle = fill; g.fill(); g.globalAlpha = 1; }
    if (stroke) { g.strokeStyle = stroke; g.lineWidth = width; g.stroke(); }
    return this;
  }

  seg(a, b, { color, width = 1, dash = null } = {}) {
    const g = this.g, p = this.project(a), q = this.project(b);
    g.strokeStyle = color || this.C.muted; g.lineWidth = width;
    if (dash) g.setLineDash(dash);
    g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
    g.setLineDash([]);
    return this;
  }

  /* Head size is in screen pixels, not scene units: an arrowhead that shrinks
     with perspective stops reading as an arrowhead. */
  arrow(a, b, { color, width = 2, head = 10, dash = null } = {}) {
    const g = this.g, col = color || this.C.fg;
    this.seg(a, b, { color: col, width, dash });
    const p = this.project(a), q = this.project(b);
    const an = Math.atan2(q[1] - p[1], q[0] - p[0]);
    g.fillStyle = col;
    g.beginPath(); g.moveTo(q[0], q[1]);
    g.lineTo(q[0] - head * Math.cos(an - 0.4), q[1] - head * Math.sin(an - 0.4));
    g.lineTo(q[0] - head * Math.cos(an + 0.4), q[1] - head * Math.sin(an + 0.4));
    g.fill();
    return this;
  }

  dot(p, { color, r = 5.5, shape = "circle" } = {}) {
    const g = this.g, q = this.project(p);
    g.fillStyle = color || this.C.acc;
    if (shape === "square") g.fillRect(q[0] - r, q[1] - r, 2 * r, 2 * r);
    else { g.beginPath(); g.arc(q[0], q[1], r, 0, 2 * Math.PI); g.fill(); }
    return this;
  }

  ring(p, { color, r = 9, width = 1.25, alpha = 0.35 } = {}) {
    const g = this.g, q = this.project(p);
    g.strokeStyle = color || this.C.fg; g.lineWidth = width; g.globalAlpha = alpha;
    g.beginPath(); g.arc(q[0], q[1], r, 0, 2 * Math.PI); g.stroke(); g.globalAlpha = 1;
    return this;
  }

  /* The little square that says "these two are orthogonal". Drawn in the plane
     of the two given directions so it tilts with the camera; a screen-aligned
     square would claim a right angle the projection does not actually show. */
  rightAngle(corner, u, v, { size = 0.32, color } = {}) {
    const step = (p, d, k) => [0, 1, 2].map((i) => p[i] + d[i] * k);
    const unit = (d) => { const n = Math.hypot(...d) || 1; return d.map((c) => c / n); };
    const a = unit(u), b = unit(v);
    const p1 = step(corner, a, size), p3 = step(corner, b, size);
    const p2 = [0, 1, 2].map((i) => corner[i] + a[i] * size + b[i] * size);
    const g = this.g;
    g.strokeStyle = color || this.C.fg; g.lineWidth = 1.3;
    g.beginPath();
    [p1, p2, p3].forEach((p, i) => { const q = this.project(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); });
    g.stroke();
    return this;
  }

  text(t, p, { dx = 0, dy = 0, color, size = 13, align = "left", halo = true } = {}) {
    const g = this.g, q = this.project(p);
    g.font = size + "px sans-serif"; g.textAlign = align;
    if (halo) { g.lineWidth = 2.5; g.strokeStyle = this.C.bg; g.lineJoin = "round"; g.strokeText(t, q[0] + dx, q[1] + dy); }
    g.fillStyle = color || this.C.muted;
    g.fillText(t, q[0] + dx, q[1] + dy);
    g.textAlign = "left";
    return this;
  }
}

/* ---- TeX labels over a canvas --------------------------------------------

   foreignObject gets real notation into the SVG figures, but a canvas has no DOM
   to hang it on. The labels therefore live in a layer above the canvas, absolutely
   positioned, and are moved by writing to style.transform — MathJax typesets each
   one once, and a moving label after that is a transform, not a re-typeset. That
   matters for the 3D figures, whose labels have to track their vectors through
   every frame of the sway.

   Positions come back from the same projection the canvas drew with, so a label
   and its mark cannot disagree. */
export function TexLayer({ labels, refs, C }) {
  return (
    <>
      {labels.map((l, i) => (
        <div key={i} ref={(el) => { refs.current[i] = el; }}
          style={{
            position: "absolute", left: 0, top: 0, whiteSpace: "nowrap",
            pointerEvents: "none", visibility: "hidden",
            fontSize: (l.size || 13) + "px", color: l.color || C.fg,
            transformOrigin: "0 0",
          }}>{"\\(" + l.tex + "\\)"}</div>
      ))}
    </>
  );
}

/* Place one label at a screen point. `anchor` is where the point sits relative to
   the box, so a label can hang off the left of a mark without measuring it here. */
export function placeLabel(el, px, py, l) {
  if (!el) return;
  const w = el.offsetWidth, h = el.offsetHeight;
  const ax = l.anchor === "end" ? -w : l.anchor === "middle" ? -w / 2 : 0;
  const ay = l.baseline === "top" ? 0 : l.baseline === "middle" ? -h / 2 : -h;
  el.style.transform = `translate(${px + (l.dx || 0) + ax}px, ${py + (l.dy || 0) + ay}px)`;
  el.style.visibility = "visible";
}

/* The React side of Scene3D: sizing, resize, drag, and the optional slow spin.

   `view` + `onView` make it controlled (bias-absorption-3d owns its camera so its
   Reset / View-from-above buttons can set it). Left uncontrolled, it keeps its
   own camera, which is all a still figure needs. */
export function Canvas3D({
  height = 320, ariaLabel, draw, spin = 0, sway = null, interactive = false,
  view, onView, initialView = { yaw: -1.05, pitch: 0.5 }, sceneOpts, labels = [],
}) {
  const C = useClassColors();
  const cv = React.useRef(null);
  const box = React.useRef(null);
  const labelRefs = React.useRef([]);
  useTypeset([C, labels.length]);
  const visible = useVisible(box);
  const [own, setOwn] = React.useState(initialView);
  const drag = React.useRef(null);
  const v = view || own;
  const setView = onView || setOwn;
  // The spin offset lives in a ref, not in state: a setState per animation frame
  // would re-render the whole figure 60 times a second to move one number.
  const spun = React.useRef(0);

  const render = () => {
    const canvas = cv.current;
    if (!canvas) return;
    const scene = new Scene3D(canvas, {
      ...sceneOpts, height, colors: C,
      yaw: v.yaw + spun.current, pitch: v.pitch,
    });
    draw(scene);
    labels.forEach((l, i) => {
      const [px, py] = scene.project(l.p);
      placeLabel(labelRefs.current[i], px, py, l);
    });
  };

  React.useEffect(render);

  React.useEffect(() => {
    const canvas = cv.current;
    if (!canvas || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  });

  /* Two kinds of motion, because they answer different questions. `spin` is a
     turntable, for a scene you want to see all the way round. `sway` is a small
     oscillation about the given pose, which is what a still 3D figure actually
     needs: enough parallax to read which vector is in front, without the reader
     ever losing the canonical view or waiting for it to come back. */
  React.useEffect(() => {
    if ((!spin && !sway) || !visible || reducedMotion()) return undefined;
    let raf = 0, t0 = 0, last = 0;
    const frame = (t) => {
      if (!t0) t0 = t;
      if (sway) spun.current = sway.amp * Math.sin((2 * Math.PI * (t - t0)) / (sway.seconds * 1000));
      else if (last) spun.current += spin * (t - last) / 1000;
      if (last) render();
      last = t;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [spin, sway && sway.amp, sway && sway.seconds, visible, v, C]);

  const handlers = interactive ? {
    onPointerDown: (e) => {
      drag.current = [e.clientX, e.clientY, v.yaw, v.pitch];
      cv.current.style.cursor = "grabbing";
      if (cv.current.setPointerCapture) cv.current.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e) => {
      const d = drag.current;
      if (!d) return;
      setView({
        yaw: d[2] + (e.clientX - d[0]) * 0.01,
        pitch: Math.max(-0.2, Math.min(Math.PI / 2, d[3] + (e.clientY - d[1]) * 0.01)),
      });
    },
    onPointerUp: () => { drag.current = null; cv.current.style.cursor = "grab"; },
  } : {};

  return (
    <div ref={box} style={{ position: "relative" }}>
      <canvas ref={cv} role="img" aria-label={ariaLabel} {...handlers}
        style={{ width: "100%", height, border: `1px solid ${C.border}`, borderRadius: "8px",
          cursor: interactive ? "grab" : "default", touchAction: interactive ? "none" : undefined }} />
      <TexLayer labels={labels} refs={labelRefs} C={C} />
    </div>
  );
}

/* A still 2D plot: the Plot class with the canvas/dpr/theme wiring the demos
   above each repeat. `draw(plot)` gets a Plot (or a subclass via `plotClass`). */
export function PlotFigure({ width = 520, height = 240, ariaLabel, draw, plotClass = Plot,
                             plotOpts = {}, labels = [] }) {
  const C = useClassColors();
  const cv = React.useRef(null);
  const labelRefs = React.useRef([]);
  useTypeset([C, labels.length]);
  React.useEffect(() => {
    const canvas = cv.current;
    if (!canvas) return;
    const plot = new plotClass(canvas, { width, height, colors: C, ...plotOpts });
    draw(plot);
    // The canvas is laid out responsively but drawn in its design space, so a data
    // coordinate has to be scaled by the same factor CSS is scaling the canvas by.
    const k = (canvas.clientWidth || width) / width;
    labels.forEach((l, i) =>
      placeLabel(labelRefs.current[i], plot.x(l.at[0]) * k, plot.y(l.at[1]) * k, l));
  });
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: width, margin: "0 auto" }}>
      <canvas ref={cv} role="img" aria-label={ariaLabel}
        style={{ width: "100%", height: "auto", aspectRatio: `${width} / ${height}`, display: "block" }} />
      <TexLayer labels={labels} refs={labelRefs} C={C} />
    </div>
  );
}
