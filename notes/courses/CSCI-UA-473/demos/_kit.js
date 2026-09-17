/* AUTO-GENERATED from _kit.jsx by `npm run build:artifacts`. Do not edit. */
/* CSCI-UA-473 demo kit. The shared chrome lives in the global kit; this file
   holds only what is specific to this course: the class-label palette and a
   Python tokenizer. See ../../../artifacts/kit.jsx for the shared exports. */
import React from "react";
import { registerLang, tokenize, useTheme } from "@kit";
export { DiagramSvg, diagramPalette, KnobBar, CompareCaption, CodeBlock } from "@kit";

/* Semantic colours for class labels. These are not arbitrary series colours, so
   they stay named rather than folding into diagramPalette. Light values clear
   3:1 on white and dark values clear 7:1 on the dark background, which is the
   WCAG 1.4.11 bar for graphical objects. They do NOT clear 4.5:1 for text, so
   never draw text in `acc` — use `fg`. */
const LIGHT = {
  pos: "#1D9E75",
  neg: "#D85A30",
  acc: "#7F77DD"
};
const DARK = {
  pos: "#34D399",
  neg: "#FB923C",
  acc: "#A78BFA"
};
export function useClassColors() {
  const dark = useTheme() === "dark";
  const c = dark ? DARK : LIGHT;
  return {
    ...c,
    fg: "hsl(var(--foreground))",
    muted: "hsl(var(--muted-foreground))",
    border: "hsl(var(--border))",
    bg: "hsl(var(--background))"
  };
}
export function buttonStyle(C, active) {
  return {
    background: active ? C.border : C.bg,
    border: `1px solid ${active ? C.fg : C.border}`,
    borderRadius: "6px",
    color: C.fg,
    padding: "6px 10px",
    cursor: "pointer",
    font: "inherit",
    fontWeight: active ? 500 : 400
  };
}
export function readoutStyle(C) {
  return {
    margin: "0 0 6px",
    color: C.muted,
    fontSize: "13px",
    lineHeight: 1.5,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
  };
}
export function labelStyle(C) {
  return {
    color: C.muted,
    fontSize: "13px"
  };
}

// The artifact iframe maps this module to the shared deterministic ordering
// logic. Keep the same tiny implementation as a test/runtime fallback because
// the Node kit harness imports course kits outside that iframe import map.
function fallbackSeededShuffle(items, seed) {
  const out = items.slice();
  let s = seed >>> 0 || 1;
  const rand = () => (s = s * 1664525 + 1013904223 >>> 0) / 4294967296;
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = out[i];
    out[i] = out[j];
    out[j] = t;
  }
  return out;
}
function fallbackHashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const FALLBACK_ORDER = {
  seededShuffle: fallbackSeededShuffle,
  hashSeed: fallbackHashSeed
};
function useSequenceOrder() {
  const [order, setOrder] = React.useState(null);
  React.useEffect(() => {
    let live = true;
    import("@course/seq-order").then(module => {
      if (live) setOrder(module);
    }).catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return order || FALLBACK_ORDER;
}
function renderInline(text, C) {
  if (text == null) return null;
  return String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return /*#__PURE__*/React.createElement("strong", {
        key: i
      }, part.slice(2, -2));
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return /*#__PURE__*/React.createElement("code", {
        key: i,
        style: {
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: "3px",
          padding: "1px 3px",
          color: C.fg
        }
      }, part.slice(1, -1));
    }
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, part);
  });
}
function shuffleChoices(choices, index, stem, order) {
  const shuffled = order.seededShuffle(choices, order.hashSeed(index + "#" + stem));
  if (shuffled.length > 1 && shuffled[0].correct) {
    const first = shuffled.shift();
    shuffled.push(first);
  }
  return shuffled;
}
export function Mcq({
  questions: rawQuestions = []
}) {
  const order = useSequenceOrder();
  const questions = React.useMemo(() => rawQuestions.map((q, i) => ({
    ...q,
    choices: shuffleChoices(q.choices, i, q.stem, order)
  })), [rawQuestions, order]);
  const [cur, setCur] = React.useState(0);
  const [picks, setPicks] = React.useState({});
  const C = useClassColors();
  const n = questions.length;
  const pick = picks[cur];
  const answered = pick != null;
  // MathJax doesn't re-typeset on its own when React repaints the stem/choices
  // for a new question or an answer reveal. `window.typesetMath` only exists
  // when this artifact opted into the `math` fence flag; `?.()` is a no-op
  // otherwise, so this is harmless for any Mcq instance without TeX in it.
  React.useEffect(() => {
    window.typesetMath?.();
  }, [cur, answered]);
  if (!n) return null;
  const q = questions[cur];
  const go = d => setCur(c => Math.max(0, Math.min(n - 1, c + d)));
  const choose = k => setPicks(p => p[cur] != null ? p : {
    ...p,
    [cur]: k
  });
  const navButton = disabled => ({
    ...buttonStyle(C),
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "default" : "pointer"
  });
  const choiceButton = (choice, index) => {
    const picked = answered && index === pick;
    const correct = answered && choice.correct;
    return {
      ...buttonStyle(C),
      display: "block",
      width: "100%",
      margin: "0 0 8px",
      textAlign: "left",
      borderColor: correct ? C.pos : picked ? C.neg : C.border,
      background: correct || picked ? correct ? C.pos : C.neg : C.bg,
      color: correct || picked ? C.bg : C.fg,
      opacity: answered && !correct && !picked ? 0.75 : 1,
      cursor: answered ? "default" : "pointer"
    };
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      color: C.fg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "8px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => go(-1),
    disabled: cur === 0,
    "aria-label": "Previous question",
    style: navButton(cur === 0)
  }, "\u2039 Prev"), /*#__PURE__*/React.createElement("span", {
    "aria-live": "polite"
  }, "Question ", cur + 1, " of ", n), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => go(1),
    disabled: cur === n - 1,
    "aria-label": "Next question",
    style: navButton(cur === n - 1)
  }, "Next \u203A")), /*#__PURE__*/React.createElement("div", {
    key: `${cur}-${answered}`
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 4px",
      fontSize: "15px"
    }
  }, renderInline(q.stem, C)), /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": `Choices for question ${cur + 1}`
  }, q.choices.map((choice, i) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: i,
    disabled: answered,
    onClick: () => choose(i),
    style: choiceButton(choice, i)
  }, answered && choice.correct ? "✓ Correct: " : null, answered && i === pick && !choice.correct ? "✗ Your choice: " : null, renderInline(choice.text, C)))), answered ? /*#__PURE__*/React.createElement("p", {
    style: {
      ...labelStyle(C),
      margin: "0",
      lineHeight: 1.5
    }
  }, renderInline(q.why, C)) : null));
}
export function mcq(config) {
  return function App() {
    return /*#__PURE__*/React.createElement(Mcq, config);
  };
}

/* Python uses `#` comments and leaves `//` as operators. CodeBlock highlights
   one line at a time, so a multi-line triple-quoted string cannot be one span;
   only a complete single-line one is string-coloured, and a bare delimiter is
   punctuation. Prefix letters (`f`, `r`, `b`) tokenize separately from their strings. */
const PY_KW = new Set(["def", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "import", "from", "as", "class", "lambda", "None", "True", "False", "with", "try", "except", "raise", "yield", "pass", "break", "continue", "global", "assert", "del", "is"]);
const PY_RE = /(#[^\n]*)|("""[\s\S]*?"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_])/g;
registerLang("python", line => tokenize(line, PY_RE, m => m[1] ? "mm-tok-com" : m[2] ? "mm-tok-str" : m[3] ? "mm-tok-num" : m[4] ? PY_KW.has(m[4]) ? "mm-tok-kw" : undefined : undefined));