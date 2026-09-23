/* Keep markdown and MathJax out of each other's way.
 *
 * Both renderers on this site — notes/js/note.js and posts/js/post.js — hand
 * marked's output to MathJax, and marked's own rules quietly corrupt TeX on the
 * way through. The damage is identical in both places, so the repair lives here
 * and each renderer calls `MarkdownMath.install(marked)` after loading marked and
 * before parsing anything.
 *
 * Three failures, three rules:
 *
 * 1. INLINE. marked's `escape` tokenizer runs over the contents of every `$...$`
 *    and `$$...$$` and eats the backslash before any ASCII punctuation. `\{` and
 *    `\}` become bare braces, which is the loud one — MathJax then sees `\left{`
 *    and prints the whole block as red source, "Missing or unrecognized delimiter
 *    for \left". `\,` `\!` `\;` become `,` `!` `;` and `\|` becomes `|`, which are
 *    the quiet ones: spacing and norm bars silently disappear. `\\` becomes `\`,
 *    which collapses every row break in an `aligned` or `bmatrix`. And `_..._`
 *    inside display math gets italicized, injecting literal `<em>` into formulas.
 *
 * 2. BLOCK. A `$$ ... $$` whose continuation line starts with `+ `, `- ` or `* `
 *    is a bullet as far as CommonMark is concerned, so marked splits the block
 *    into a paragraph plus a list and the two `$$` land in different block tokens.
 *    MathJax then has nothing to pair and prints the source. The inline rule cannot
 *    repair this: by the time it runs the span has already been cut in half.
 *
 * 3. LITERAL DOLLAR. `\$` is the correct markdown for a dollar sign in prose and
 *    was the one spelling that did not work, because marked emits a bare `$` that
 *    MathJax reads as an opening delimiter and pairs with the next real formula's:
 *    "If you win \$5 per six, $Z=5X$" rendered as "If you win 5per six, Z=5X$".
 *
 * The inline matcher is deliberately conservative — no blank line inside, no
 * leading or trailing space, a length cap, and no `**`/`__`/backtick in the body —
 * so that a pair of prose dollar signs ("$5 day" … "the full $") cannot swallow
 * the markdown between them.
 */
(function (global) {
  "use strict";

  const MATH_MAX_INLINE = 200;
  const encodeForHtml = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const literalDollar = {
    name: "literalDollar",
    level: "inline",
    start(src) { const i = src.indexOf("\\$"); return i === -1 ? undefined : i; },
    tokenizer(src) {
      if (!src.startsWith("\\$")) return undefined;
      return { type: "literalDollar", raw: "\\$" };
    },
    // MathJax's own default ignore class, so the character survives as a character
    renderer() { return '<span class="tex2jax_ignore">$</span>'; }
  };

  /* Two shapes, because the sources use both: `$$` alone on its own line opening a
     block, and a whole expression on one line. Neither can over-run its paragraph. */
  const mathBlock = {
    name: "mathBlock",
    level: "block",
    start(src) { const i = src.indexOf("$$"); return i === -1 ? undefined : i; },
    tokenizer(src) {
      const fenced = /^\$\$[ \t]*\n([\s\S]*?)\n[ \t]*\$\$[ \t]*(?:\n|$)/.exec(src);
      if (fenced) return { type: "mathBlock", raw: fenced[0], text: "$$\n" + fenced[1] + "\n$$" };
      const oneLine = /^\$\$([^\n]+?)\$\$[ \t]*(?:\n|$)/.exec(src);
      if (oneLine) return { type: "mathBlock", raw: oneLine[0], text: "$$" + oneLine[1] + "$$" };
      return undefined;
    },
    renderer(token) { return "<p>" + encodeForHtml(token.text) + "</p>\n"; }
  };

  const mathInline = {
    name: "math",
    level: "inline",
    start(src) { const i = src.indexOf("$"); return i === -1 ? undefined : i; },
    tokenizer(src) {
      const display = /^\$\$([\s\S]+?)\$\$/.exec(src);
      if (display) return { type: "math", raw: display[0], text: display[0] };
      const inline = /^\$([^$]+?)\$/.exec(src);
      if (!inline) return undefined;
      const body = inline[1];
      if (body.length > MATH_MAX_INLINE) return undefined;
      if (/\n[ \t]*\n/.test(body)) return undefined;
      if (/^\s|\s$/.test(body)) return undefined;
      // no TeX contains these, but a pair of prose dollar signs straddling markdown does
      if (/\*\*|__|`/.test(body)) return undefined;
      return { type: "math", raw: inline[0], text: inline[0] };
    },
    renderer(token) { return encodeForHtml(token.text); }
  };

  function install(marked) {
    if (!marked || typeof marked.use !== "function") return false;
    marked.use({ extensions: [literalDollar] });
    marked.use({ extensions: [mathBlock] });
    marked.use({ extensions: [mathInline] });
    return true;
  }

  global.MarkdownMath = { install, encodeForHtml, MATH_MAX_INLINE };
})(typeof window !== "undefined" ? window : globalThis);
