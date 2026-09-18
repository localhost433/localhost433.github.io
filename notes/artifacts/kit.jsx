import React from "react";

function cn(...a) { return a.filter(Boolean).join(" "); }

export function Button({ variant = "default", size = "default", className, ...props }) {
  return <button className={cn("ui-btn", "ui-btn--" + variant, "ui-btn--size-" + size, className)} {...props} />;
}

export function Card({ title, className, children, ...props }) {
  if (title != null) {
    return (
      <div className={cn("ui-card", className)} {...props}>
        <div className="ui-card__header"><h3 className="ui-card__title">{title}</h3></div>
        <div className="ui-card__content">{children}</div>
      </div>
    );
  }
  return <div className={cn("ui-card", className)} {...props}>{children}</div>;
}
export function CardHeader({ className, ...props }) { return <div className={cn("ui-card__header", className)} {...props} />; }
export function CardTitle({ className, ...props }) { return <h3 className={cn("ui-card__title", className)} {...props} />; }
export function CardDescription({ className, ...props }) { return <p className={cn("ui-card__description", className)} {...props} />; }
export function CardContent({ className, ...props }) { return <div className={cn("ui-card__content", className)} {...props} />; }
export function CardFooter({ className, ...props }) { return <div className={cn("ui-card__footer", className)} {...props} />; }

export function Badge({ variant = "default", className, ...props }) {
  return <span className={cn("ui-badge", "ui-badge--" + variant, className)} {...props} />;
}

export function Input({ className, ...props }) {
  return <input className={cn("ui-input", className)} {...props} />;
}

export function Label({ className, ...props }) {
  return <label className={cn("ui-label", className)} {...props} />;
}

export function Slider({ className, ...props }) {
  return <input type="range" className={cn("ui-slider", className)} {...props} />;
}

export function Switch({ checked, onCheckedChange, className, ...props }) {
  return (
    <button type="button" role="switch" aria-checked={!!checked}
      data-state={checked ? "checked" : "unchecked"}
      className={cn("ui-switch", className)}
      onClick={() => onCheckedChange && onCheckedChange(!checked)} {...props}>
      <span className="ui-switch__thumb" />
    </button>
  );
}

export function useTheme() {
  const [theme, setTheme] = React.useState(window.__theme || "light");
  React.useEffect(() => {
    const on = (e) => setTheme(e.detail);
    window.addEventListener("themechange", on);
    return () => window.removeEventListener("themechange", on);
  }, []);
  return theme;
}

const CHART_COLORS_LIGHT = ["#6d28d9", "#2563eb", "#059669", "#d97706", "#dc2626"];
const CHART_COLORS_DARK = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f87171"];

export function useChartTheme() {
  const dark = useTheme() === "dark";
  const colors = dark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
  return {
    colors,
    line: colors[0],
    grid: dark ? "#2c2f33" : "#e5e7eb",
    axis: dark ? "#9aa0a6" : "#6b7280",
    tooltip: { background: dark ? "#15171a" : "#ffffff", border: "1px solid " + (dark ? "#2c2f33" : "#e5e7eb"), borderRadius: 8, fontSize: 12 },
  };
}

export function Field({ label, htmlFor, className, children, ...props }) {
  return (
    <div className={cn("ui-field", className)} {...props}>
      {label != null ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
    </div>
  );
}

export function Stat({ label, value, className, ...props }) {
  return (
    <div className={cn("ui-stat", className)} {...props}>
      {label != null ? <div className="ui-stat__label">{label}</div> : null}
      <div className="ui-stat__value">{value}</div>
    </div>
  );
}

export function ButtonGroup({ className, ...props }) {
  return <div role="group" className={cn("ui-btn-group", className)} {...props} />;
}

export function Stepper({ value, onChange, step = 1, min, max, className, ...props }) {
  const clamp = (n) => (min != null && n < min ? min : max != null && n > max ? max : n);
  return (
    <div className={cn("ui-row", className)} {...props}>
      <Button variant="outline" size="icon" aria-label="Decrease"
        disabled={min != null && value <= min} onClick={() => onChange(clamp(value - step))}>−</Button>
      <span className="ui-stat__value" style={{ minWidth: "3ch", textAlign: "center" }}>{value}</span>
      <Button variant="outline" size="icon" aria-label="Increase"
        disabled={max != null && value >= max} onClick={() => onChange(clamp(value + step))}>+</Button>
    </div>
  );
}

/* Reusable interaction primitives (shared across scene types). KnobBar's .mm-*
   rules live in notes/courses/CSCI-UA-470/demos/_shared.css. */
export function KnobBar({ knobs, value, onChange }) {
  return (
    <div className="mm-knobs">
      {knobs.map((k) => (
        <div className="mm-knob" key={k.id}>
          <span className="mm-knob__label">{k.label}</span>
          <div className="mm-knob__opts" role="group" aria-label={k.label}>
            {k.options.map((o) => {
              const on = value[k.id] === o.value;
              return (
                <button key={String(o.value)} type="button" aria-pressed={on}
                  className={"mm-knob__opt" + (on ? " mm-knob__opt--on" : "")}
                  onClick={() => onChange(k.id, o.value)}>{o.label}</button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- concept-diagram primitives (shared SVG building blocks) ----
   Extracted from diamond-chart so every concept diagram (pipeline, class
   relations, the diamond) shares one box/edge/arrow/palette styling. */
export const diagramPalette = (i) => ([
  { bg: "--seg-stack-bg",  bd: "--seg-stack-bd",  fg: "--seg-stack-fg"  },
  { bg: "--seg-heap-bg",   bd: "--seg-heap-bd",   fg: "--seg-heap-fg"   },
  { bg: "--seg-global-bg", bd: "--seg-global-bd", fg: "--seg-global-fg" },
  { bg: "--seg-code-bg",   bd: "--seg-code-bd",   fg: "--seg-code-fg"   },
])[((i % 4) + 4) % 4];

// the <svg> wrapper that defines the shared arrowhead marker once.
export function DiagramSvg({ viewBox, ariaLabel, maxWidth = 640, children }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={ariaLabel}
      style={{ width: "100%", height: "auto", maxWidth, display: "block", margin: "0 auto",
        fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace' }}>
      <defs>
        <marker id="dia-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1,1 L8,4.5 L1,8 Z" style={{ fill: "var(--mm-muted)" }} />
        </marker>
        {/* UML relations: a hollow triangle (filled with the card bg so the line
            stops at its base) pointing at the supertype. COLOUR encodes the
            relation — extends (inheritance, indigo) vs implements (interface, teal);
            the boxes themselves stay neutral. */}
        <marker id="dia-extends" markerWidth="15" markerHeight="13" refX="12.5" refY="6.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1,1 L12.5,6.5 L1,12 Z"
            style={{ fill: "var(--mm-cell-bg)", stroke: "var(--mm-ptr)", strokeWidth: 1.4 }} />
        </marker>
        <marker id="dia-implements" markerWidth="15" markerHeight="13" refX="12.5" refY="6.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1,1 L12.5,6.5 L1,12 Z"
            style={{ fill: "var(--mm-cell-bg)", stroke: "var(--mm-ref)", strokeWidth: 1.4 }} />
        </marker>
        {/* Use-case dependency arrowheads: an OPEN V (not filled) at the target,
            coloured to name the relation — «include» (teal) vs «extend» (amber).
            The dashed dependency line meeting it is drawn in the same colour. */}
        <marker id="dia-open-inc" markerWidth="13" markerHeight="12" refX="9.5" refY="5.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1.5,1 L9.5,5.5 L1.5,10" style={{ fill: "none", stroke: "var(--mm-ref)", strokeWidth: 1.5 }} />
        </marker>
        <marker id="dia-open-ext" markerWidth="13" markerHeight="12" refX="9.5" refY="5.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M1.5,1 L9.5,5.5 L1.5,10" style={{ fill: "none", stroke: "var(--mm-hl)", strokeWidth: 1.5 }} />
        </marker>
        {/* Class-diagram whole/part diamonds. These sit at the SOURCE end (the
            "whole"), not the target — hollow for aggregation (the part can outlive
            the whole), filled for composition (the part dies with it). refX=0 so
            the diamond's tip lands on the line's start point. */}
        <marker id="dia-diamond-hollow" markerWidth="16" markerHeight="11" refX="0" refY="5.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,5.5 L7.5,1 L15,5.5 L7.5,10 Z"
            style={{ fill: "var(--mm-cell-bg)", stroke: "var(--mm-muted)", strokeWidth: 1.4 }} />
        </marker>
        <marker id="dia-diamond-filled" markerWidth="16" markerHeight="11" refX="0" refY="5.5"
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,5.5 L7.5,1 L15,5.5 L7.5,10 Z"
            style={{ fill: "var(--mm-muted)", stroke: "var(--mm-muted)", strokeWidth: 1.4 }} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

export function CompareCaption({ cols = [], punch }) {
  return (
    <div className="mm-compare" style={{ "--cols": cols.length }}>
      {cols.map((c, i) => (
        <div className="mm-compare__col" key={i}>
          <span className={"mm-compare__tag mm-cap-tag mm-cap-tag--" + (c.kind || "cpp")}>{c.tag}</span>
          {c.children}
        </div>
      ))}
      {punch ? <p className="mm-compare__punch">{punch}</p> : null}
    </div>
  );
}

// Language-specific keyword/type/builtin classification for syntax highlighting.
// Course kits extend this registry with their own languages (470: asm + bytecode;
// 473: python).
const LANGS = {
  cpp: {
    kw: new Set(["return", "using", "namespace", "new", "delete", "class", "struct",
      "public", "private", "protected", "friend", "static", "const", "virtual",
      "operator", "template", "typename", "this", "if", "else", "for", "while",
      "include", "define", "ifdef", "ifndef", "endif", "undef", "override", "final",
      "nullptr", "NULL", "true", "false"]),
    ty: new Set(["int", "char", "double", "float", "bool", "void", "unsigned",
      "long", "short", "auto", "string", "ostream", "istream"]),
    bi: new Set(["cout", "cin", "endl", "std", "main"]),
  },
  java: {
    kw: new Set(["package", "import", "public", "private", "protected", "class",
      "interface", "enum", "extends", "implements", "abstract", "final", "static",
      "native", "synchronized", "return", "new", "this", "super", "void",
      "if", "else", "for", "while", "do", "switch", "case", "break", "continue",
      "try", "catch", "finally", "throw", "throws", "instanceof",
      "null", "true", "false"]),
    ty: new Set(["int", "long", "short", "byte", "char", "boolean", "float", "double", "var"]),
    bi: new Set(["out", "err", "println", "print", "args", "length", "main"]),
  },
};

function classifyWord(w, L) {
  if (L.kw.has(w)) return "mm-tok-kw";
  if (L.ty.has(w)) return "mm-tok-ty";
  if (L.bi.has(w)) return "mm-tok-fn";
  if (/^[A-Z]/.test(w)) return "mm-tok-ty";   // user-defined types: Circle, Person, String, …
  return undefined;
}

// Drive a tokenizer: scan `line` with a global regex and wrap each match in a
// <span> whose class comes from classify(match). Shared by code + asm below.
export function tokenize(line, re, classify) {
  const out = [];
  let m, k = 0;
  while ((m = re.exec(line)) !== null) out.push(<span key={k++} className={classify(m)}>{m[0]}</span>);
  return out;
}

const CODE_RE = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(#[A-Za-z]+)|(\b\d+\.?\d*[fFlLdD]?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_"'])/g;

// Tokenize one line of C++/Java into highlighted <span>s.
export function highlightCode(line, lang = "cpp") {
  const L = LANGS[lang] || LANGS.cpp;
  return tokenize(line, CODE_RE, (m) =>
    m[1] ? "mm-tok-com" : (m[2] || m[3]) ? "mm-tok-str" : m[4] ? "mm-tok-pre"
      : m[5] ? "mm-tok-num" : m[6] ? classifyWord(m[6], L) : undefined);
}

// Open language registry. Course kits call registerLang for vocabulary that is
// theirs alone (470: asm and JVM bytecode; 473: python), so the global kit
// stays free of course specifics.
const LANG_REGISTRY = Object.create(null);

// Register a tokenizer for a language name. `fn(line)` returns React nodes.
export function registerLang(name, fn) { LANG_REGISTRY[name] = fn; }

export const highlight = (line, lang) =>
  LANG_REGISTRY[lang] ? LANG_REGISTRY[lang](line) : highlightCode(line, lang);

// A curated-asm line beginning with "…" is an elision row (muted, non-mappable).
const isElision = (ln) => /^\s*…/.test(ln);

// One line-numbered, syntax-highlighted block for C++ OR assembly. `activeLine`
// is the highlighted 1-based line, or an array/Set of lines (an asm group). A line
// starting with "…" renders as a muted "⋯" elision row (used by curated asm).
// Optional onHoverLine(n) reports the hovered line (null on leave) to a parent.
// Optional onPickLine(n) makes lines in `pickable` (a Set) clickable -> jump to step.
export function CodeBlock({ code, activeLine, lang = "cpp", onHoverLine, onPickLine, pickable }) {
  const lines = (code || "").split("\n");
  const isActive = activeLine instanceof Set ? (n) => activeLine.has(n)
    : Array.isArray(activeLine) ? (n) => activeLine.includes(n)
    : (n) => n === activeLine;
  return (
    <pre className="mm-code">
      {lines.map((ln, n) => {
        if (isElision(ln)) return (
          <div key={n} className="mm-code__line mm-code__line--elide">
            <span className="mm-code__ln" aria-hidden="true">⋯</span>
            <span className="mm-code__txt">{ln.replace(/^\s*…\s?/, "")}</span>
          </div>
        );
        const no = n + 1;
        const canPick = onPickLine && (!pickable || pickable.has(no));
        const h = {};
        if (onHoverLine) { h.onMouseEnter = () => onHoverLine(no); h.onMouseLeave = () => onHoverLine(null); }
        if (canPick) {
          h.onClick = () => onPickLine(no);
          h.role = "button"; h.tabIndex = 0;
          h.onKeyDown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPickLine(no); } };
        }
        const cls = "mm-code__line" + (isActive(no) ? " mm-code__line--active" : "") + (canPick ? " mm-code__line--pick" : "");
        return (
          <div key={n} className={cls} {...h}>
            <span className="mm-code__ln">{no}</span>
            <span className="mm-code__txt">{ln ? highlight(ln, lang) : " "}</span>
          </div>
        );
      })}
    </pre>
  );
}

/* ============================================================
   Inline caption markup + the shared MCQ.

   Both were duplicated per course: CSCI-UA-470 carried a class-styled `Mcq`
   with a `figure` slot and a "Show answer" button, CSCI-UA-473 an
   inline-styled one with the MathJax remount fix and a correct-first guard.
   Neither was a superset, so the 473 copy silently kept a bug fix the 470
   copy needed. This is the union of the two, wearing 470's look; the styles
   moved to theme.css as the `.ui-quiz*` / `.ui-mcq*` tier so every course can
   reach them. Course kits re-export it, so demos keep importing from
   "@course" unchanged.
   ============================================================ */

// Expand code sentinels (NUL N NUL) in an already-emphasis-parsed string back
// into <code> elements, leaving the surrounding text as-is.
function expandCodes(str, codes, kp) {
  return String(str).split(/\u0000(\d+)\u0000/).map((p, i) =>
    i % 2 === 1
      ? <code key={kp + "c" + i} className="ui-ic">{codes[+p]}</code>
      : <React.Fragment key={kp + "t" + i}>{p}</React.Fragment>
  );
}

// Render a caption with composable inline markdown: `code`, **bold**, *italic*.
// Code spans are masked out before emphasis parsing, so the two compose, e.g.
// **`x`** renders as bold code, and **a `b` c** bolds the whole run incl. code.
export function renderCaption(text) {
  if (text == null) return null;
  const codes = [];
  const masked = String(text).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c); return "\u0000" + (codes.length - 1) + "\u0000";
  });
  const out = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(masked)) !== null) {
    if (m.index > last) out.push(<React.Fragment key={"t" + k}>{expandCodes(masked.slice(last, m.index), codes, "t" + k)}</React.Fragment>);
    if (m[1] != null) out.push(<strong key={"b" + k}>{expandCodes(m[1], codes, "b" + k)}</strong>);
    else out.push(<em key={"i" + k}>{expandCodes(m[2], codes, "i" + k)}</em>);
    last = re.lastIndex; k++;
  }
  if (last < masked.length) out.push(<React.Fragment key={"t" + k}>{expandCodes(masked.slice(last), codes, "t" + k)}</React.Fragment>);
  return out;
}

/* The artifact iframe maps "@course/seq-order" to the shared deterministic
   ordering logic, but the Node kit harness imports kits outside that import
   map. Keep the same tiny implementation as a test/runtime fallback so the
   component renders either way (unshuffled order is never shipped: the
   fallback shuffles too, it just does not share the course's seed stream). */
function fallbackSeededShuffle(items, seed) {
  const out = items.slice();
  let s = (seed >>> 0) || 1;
  const rand = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = out[i]; out[i] = out[j]; out[j] = t;
  }
  return out;
}

function fallbackHashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const FALLBACK_ORDER = { seededShuffle: fallbackSeededShuffle, hashSeed: fallbackHashSeed };

function useSequenceOrder() {
  const [order, setOrder] = React.useState(null);
  React.useEffect(() => {
    let live = true;
    import("@course/seq-order").then((module) => { if (live) setOrder(module); }).catch(() => {});
    return () => { live = false; };
  }, []);
  return order || FALLBACK_ORDER;
}

// Authored configs list the correct choice first for readability, and the
// seeded shuffle hides that - except when the shuffle happens to land it back
// in position 1, which reads as a giveaway. Demote it when that happens.
function shuffleChoices(choices, index, stem, order) {
  const shuffled = order.seededShuffle(choices, order.hashSeed(index + "#" + stem));
  if (shuffled.length > 1 && shuffled[0].correct) {
    const first = shuffled.shift();
    shuffled.push(first);
  }
  return shuffled;
}

/* An optional { code, lang } snippet or { image, alt } picture above the
   choices. ({ artifact: src } embedding is deferred.) */
export function McqFigure({ figure }) {
  if (!figure) return null;
  if (figure.code) return <div className="ui-mcq__fig"><CodeBlock code={figure.code} lang={figure.lang || "cpp"} /></div>;
  if (figure.image) return <img className="ui-mcq__img" src={figure.image} alt={figure.alt || ""} />;
  return null;
}

/* Paged multiple-choice quiz (4 choices, or 2 for true/false). No score;
   picking marks the choice with a tick or cross, reveals the correct one, and
   shows the `why`. Author the correct choice first - the order never survives
   into the UI. */
export function Mcq({ questions: rawQuestions = [] }) {
  const order = useSequenceOrder();
  const questions = React.useMemo(
    () => rawQuestions.map((q, i) => ({ ...q, choices: shuffleChoices(q.choices, i, q.stem, order) })),
    [rawQuestions, order]);
  const [cur, setCur] = React.useState(0);
  const [picks, setPicks] = React.useState({}); // qIndex -> choiceIndex, or -1 for "show answer"
  const n = questions.length;
  const pick = picks[cur];
  const answered = pick != null;
  // MathJax doesn't re-typeset on its own when React repaints the stem/choices
  // for a new question or an answer reveal. `window.typesetMath` only exists
  // when this artifact opted into the `math` fence flag; `?.()` is a no-op
  // otherwise, so this is harmless for any Mcq instance without TeX in it.
  React.useEffect(() => { window.typesetMath?.(); }, [cur, answered]);
  if (!n) return null;
  const q = questions[cur];
  const go = (d) => setCur((c) => Math.max(0, Math.min(n - 1, c + d)));
  const choose = (k) => setPicks((p) => (p[cur] != null ? p : { ...p, [cur]: k }));
  return (
    <div className="ui-mcq">
      <div className="ui-quiz__nav">
        <button type="button" className="ui-quiz__btn" onClick={() => go(-1)} disabled={cur === 0}
          aria-label="Previous question">&lsaquo; Prev</button>
        <span className="ui-quiz__pos" aria-live="polite">Question {cur + 1} of {n}</span>
        <button type="button" className="ui-quiz__btn" onClick={() => go(1)} disabled={cur === n - 1}
          aria-label="Next question">Next &rsaquo;</button>
      </div>
      {/* Keyed on both the question index and the answered flag: MathJax
          mutates this subtree's DOM in place (splitting text nodes into
          <mjx-container> elements), and React's virtual DOM never learns
          about that. Reconciling against those mutated nodes - whether by
          paging to a new question or by revealing the answer, which changes
          the choice buttons' text/style in place - patches the wrong nodes
          and splices content across questions. Changing the key on either
          transition forces React to discard the mutated subtree and mount
          fresh nodes instead, which the typesetMath effect above then
          retypesets from scratch. */}
      <div key={`${cur}-${answered}`}>
        <p className="ui-mcq__stem">{renderCaption(q.stem)}</p>
        <McqFigure figure={q.figure} />
        <div className="ui-mcq__choices" role="group" aria-label={`Choices for question ${cur + 1}`}>
          {q.choices.map((c, k) => {
            const cls = !answered ? "" : c.correct ? " ui-mcq__choice--correct" : (k === pick ? " ui-mcq__choice--wrong" : "");
            return (
              <button type="button" key={k} className={"ui-mcq__choice" + cls} disabled={answered}
                onClick={() => choose(k)}>
                {answered && c.correct ? <span className="ui-mcq__mark">&#10003; </span> : null}
                {answered && k === pick && !c.correct ? <span className="ui-mcq__mark ui-mcq__mark--no">&#10007; </span> : null}
                {renderCaption(c.text)}
              </button>
            );
          })}
        </div>
        {!answered ? (
          <button type="button" className="ui-mcq__show" onClick={() => choose(-1)}>Show answer</button>
        ) : (
          <p className="ui-mcq__why">{renderCaption(q.why)}</p>
        )}
      </div>
    </div>
  );
}

export function mcq(config) {
  return function App() { return React.createElement(Mcq, config); };
}
