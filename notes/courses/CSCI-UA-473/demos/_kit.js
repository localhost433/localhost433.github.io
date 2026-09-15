/* AUTO-GENERATED from _kit.jsx by `npm run build:artifacts`. Do not edit. */
/* CSCI-UA-473 demo kit. The shared chrome lives in the global kit; this file
   holds only what is specific to this course: the class-label palette and a
   Python tokenizer. See ../../../artifacts/kit.jsx for the shared exports. */
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

/* Python uses `#` comments and leaves `//` as operators. CodeBlock highlights
   one line at a time, so a multi-line triple-quoted string cannot be one span;
   only a complete single-line one is string-coloured, and a bare delimiter is
   punctuation. Prefix letters (`f`, `r`, `b`) tokenize separately from their strings. */
const PY_KW = new Set(["def", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "import", "from", "as", "class", "lambda", "None", "True", "False", "with", "try", "except", "raise", "yield", "pass", "break", "continue", "global", "assert", "del", "is"]);
const PY_RE = /(#[^\n]*)|("""[\s\S]*?"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_])/g;
registerLang("python", line => tokenize(line, PY_RE, m => m[1] ? "mm-tok-com" : m[2] ? "mm-tok-str" : m[3] ? "mm-tok-num" : m[4] ? PY_KW.has(m[4]) ? "mm-tok-kw" : undefined : undefined));