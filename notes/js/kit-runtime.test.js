"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { pathToFileURL } = require("node:url");

// Set up a temp directory with rewritten compiled kit modules.
let tempDir;
let stubReactPath;
let kitPath;
let kitxPath;
let kit473Path;

before(async () => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "kit-runtime-"));

  // Write stub React module
  stubReactPath = path.join(tempDir, "react-stub.js");
  fs.writeFileSync(stubReactPath, `
global.window = {
  __theme: "light",
  addEventListener: () => {},
  removeEventListener: () => {}
};
export const createElement = (type, props, ...kids) => ({ type, props, children: kids });
export const Fragment = Symbol("Fragment");
export const useState = (init) => [init, () => {}];
export const useMemo = (fn) => fn();
export const useRef = (init) => ({ current: init });
export const useEffect = () => {};
export const useCallback = (fn) => fn;
export default { createElement, Fragment, useState, useMemo, useRef, useEffect, useCallback };
`);

  // Copy and rewrite kit.js
  kitPath = path.join(tempDir, "kit.js");
  let kitSrc = fs.readFileSync(path.join(__dirname, "..", "artifacts", "kit.js"), "utf8");
  kitSrc = kitSrc.replace(/from\s+["']react["']/g, `from "${pathToFileURL(stubReactPath)}"`);
  fs.writeFileSync(kitPath, kitSrc);

  // Copy and rewrite _kit.js (470)
  kitxPath = path.join(tempDir, "_kit.js");
  let kitxSrc = fs.readFileSync(path.join(__dirname, "..", "courses", "CSCI-UA-470", "demos", "_kit.js"), "utf8");
  kitxSrc = kitxSrc.replace(/from\s+["']react["']/g, `from "${pathToFileURL(stubReactPath)}"`);
  kitxSrc = kitxSrc.replace(/from\s+["']@kit["']/g, `from "${pathToFileURL(kitPath)}"`);
  kitxSrc = kitxSrc.replace(/from\s+["']@course\/seq-order["']/g, `from "${pathToFileURL(path.join(__dirname, "seq-order-logic.mjs"))}"`);
  fs.writeFileSync(kitxPath, kitxSrc);

  // Copy and rewrite _kit.js (473)
  kit473Path = path.join(tempDir, "_kit473.js");
  let kit473Src = fs.readFileSync(path.join(__dirname, "..", "courses", "CSCI-UA-473", "demos", "_kit.js"), "utf8");
  kit473Src = kit473Src.replace(/from\s+["']react["']/g, `from "${pathToFileURL(stubReactPath)}"`);
  kit473Src = kit473Src.replace(/from\s+["']@kit["']/g, `from "${pathToFileURL(kitPath)}"`);
  fs.writeFileSync(kit473Path, kit473Src);
});

after(() => {
  // Clean up temp directory
  if (tempDir && fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }
});

test("CodeBlock renders without throwing", async () => {
  const mod = await import(pathToFileURL(kitxPath));
  const { CodeBlock } = mod;

  assert.ok(typeof CodeBlock === "function", "CodeBlock must be exported");

  // Test basic C++ highlighting
  const result = CodeBlock({ code: "int x = 1;", lang: "cpp" });
  assert.ok(result, "CodeBlock must return a result");

  // Test asm highlighting (470-specific)
  const asmResult = CodeBlock({ code: "mov rax, 1", lang: "asm" });
  assert.ok(asmResult, "CodeBlock must render asm without throwing");

  // Test bytecode highlighting (470-specific)
  const bcResult = CodeBlock({ code: "  0: ldc           #1", lang: "bytecode" });
  assert.ok(bcResult, "CodeBlock must render bytecode without throwing");
});

test("MemoryCompare with stages renders without throwing", async () => {
  const mod = await import(pathToFileURL(kitxPath));
  const { MemoryCompare } = mod;

  assert.ok(typeof MemoryCompare === "function", "MemoryCompare must be exported");

  // Test that MemoryCompare can render with code stages (this exercises highlight())
  const result = MemoryCompare({
    title: "Test",
    stages: [
      { code: "int x = 1;", caption: "Initialize", cells: [] }
    ],
    lang: "cpp"
  });
  assert.ok(result, "MemoryCompare must render with stages without throwing");
});

test("CSCI-UA-473 kit imports and evaluates without throwing", async () => {
  const mod = await import(pathToFileURL(kit473Path));
  assert.ok(mod, "CSCI-UA-473 kit must import successfully");
  assert.ok(typeof mod.useClassColors === "function", "useClassColors must be exported");
  assert.ok(typeof mod.CodeBlock === "function", "CodeBlock must be re-exported");
});

test("useClassColors returns the right structure and light-theme values", async () => {
  const mod = await import(pathToFileURL(kit473Path));
  const { useClassColors } = mod;

  // Call useClassColors to get the color object
  const colors = useClassColors();

  // Check all seven keys exist
  const requiredKeys = ["pos", "neg", "acc", "fg", "muted", "border", "bg"];
  for (const key of requiredKeys) {
    assert.ok(key in colors, `useClassColors must have key "${key}"`);
  }

  // Verify light-theme values (the brief specifies these exact values)
  assert.strictEqual(colors.pos, "#1D9E75", "pos must have the correct light-theme value");
  assert.strictEqual(colors.neg, "#D85A30", "neg must have the correct light-theme value");
  assert.strictEqual(colors.acc, "#7F77DD", "acc must have the correct light-theme value");

  // Verify that the shadcn theme tokens are present (as CSS var references)
  assert.ok(colors.fg.includes("var(--foreground)"), "fg must reference --foreground");
  assert.ok(colors.muted.includes("var(--muted-foreground)"), "muted must reference --muted-foreground");
  assert.ok(colors.border.includes("var(--border)"), "border must reference --border");
  assert.ok(colors.bg.includes("var(--background)"), "bg must reference --background");
});

test("Python tokenizer correctly tokenizes Python code", async () => {
  const mod = await import(pathToFileURL(kit473Path));
  const { CodeBlock } = mod;

  // Test that a comment is tokenized as mm-tok-com
  const commentResult = CodeBlock({ code: "# This is a comment", lang: "python" });
  assert.ok(commentResult, "CodeBlock must render Python code without throwing");

  // Test a Python keyword tokenization by examining the highlighted output
  const keywordResult = CodeBlock({ code: "def foo():", lang: "python" });
  assert.ok(keywordResult, "CodeBlock must render Python keyword without throwing");

  // To verify the tokenizer works correctly, we need to check that the highlight
  // function produces the right token classes. We'll do this by examining the
  // structure of what CodeBlock produces (it's a React tree with spans).
  // The highlight function returns an array of React elements with className attributes.

  // Get access to the highlight function through the kit
  const { highlight } = await import(pathToFileURL(kitPath));

  // Test comment tokenization
  const commentTokens = highlight("# This is a comment", "python");
  assert.ok(Array.isArray(commentTokens), "highlight must return an array of tokens");
  assert.ok(commentTokens.length > 0, "comment line must produce tokens");

  // The first token should be the comment (class name mm-tok-com)
  const commentToken = commentTokens[0];
  assert.strictEqual(commentToken.type, "span", "tokens must be span elements");
  assert.strictEqual(commentToken.props.className, "mm-tok-com", "# must be tokenized as a comment");

  // Test keyword tokenization
  const keywordTokens = highlight("def ", "python");
  assert.ok(Array.isArray(keywordTokens), "highlight must return an array of tokens");
  assert.ok(keywordTokens.length > 0, "keyword line must produce tokens");

  // The first token should be 'def' with class name mm-tok-kw
  const keywordToken = keywordTokens[0];
  assert.strictEqual(keywordToken.type, "span", "tokens must be span elements");
  assert.strictEqual(keywordToken.props.className, "mm-tok-kw", "def must be tokenized as a keyword");

  // Test that // is NOT treated as a comment in Python (unlike C)
  const slashSlashTokens = highlight("// not a comment", "python");
  assert.ok(Array.isArray(slashSlashTokens), "highlight must return tokens");
  // The first token should be //, which should NOT have mm-tok-com class
  const firstToken = slashSlashTokens[0];
  assert.notStrictEqual(firstToken.props.className, "mm-tok-com",
    "// must NOT be treated as a comment in Python");
});

test("Python tokenizer preserves every source character", async () => {
  const { highlight } = await import(pathToFileURL(kitPath));

  // Every emitted token must preserve exactly the source text it represents.
  const losslessSamples = [
    '    """',
    '"""one line doc"""',
    "def foo(x):",
    "# a comment",
    "// not a comment in python",
    's = "has a # inside"',
    'f"hi {name}"',
    "x = 7 // 2",
    "@property",
    "s = 'single'",
    "it's unbalanced",
  ];
  for (const line of losslessSamples) {
    const tokens = highlight(line, "python");
    assert.ok(Array.isArray(tokens), "highlight must return an array of tokens");
    const rendered = tokens.map((token) => {
      assert.strictEqual(token.type, "span", "tokens must be span elements");
      assert.strictEqual(token.children.length, 1, "each token must have one text child");
      return token.children[0];
    }).join("");
    assert.strictEqual(rendered, line, `Python highlighting must preserve ${JSON.stringify(line)}`);
  }
});
