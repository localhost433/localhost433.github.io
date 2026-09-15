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

before(async () => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "kit-runtime-"));

  // Write stub React module
  stubReactPath = path.join(tempDir, "react-stub.js");
  fs.writeFileSync(stubReactPath, `
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

  // Copy and rewrite _kit.js
  kitxPath = path.join(tempDir, "_kit.js");
  let kitxSrc = fs.readFileSync(path.join(__dirname, "..", "courses", "CSCI-UA-470", "demos", "_kit.js"), "utf8");
  kitxSrc = kitxSrc.replace(/from\s+["']react["']/g, `from "${pathToFileURL(stubReactPath)}"`);
  kitxSrc = kitxSrc.replace(/from\s+["']@kit["']/g, `from "${pathToFileURL(kitPath)}"`);
  kitxSrc = kitxSrc.replace(/from\s+["']@course\/seq-order["']/g, `from "${pathToFileURL(path.join(__dirname, "seq-order-logic.mjs"))}"`);
  fs.writeFileSync(kitxPath, kitxSrc);
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
