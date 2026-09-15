"use strict";
const { test, before } = require("node:test");
const assert = require("node:assert");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

// The logic is ESM so the browser can import it as @course/logic; a CJS test
// reaches it with a dynamic import in a `before` hook. Same shape as
// notes/js/seq-order-logic.test.js.
const MOD = pathToFileURL(path.join(__dirname, "_logic.mjs")).href;
let L;
before(async () => { L = await import(MOD); });

test("dot applies the bias as the x0 = 1 coordinate", () => {
  assert.strictEqual(L.dot([1, 2, 3], { a: 10, b: 100 }), 1 + 20 + 300);
});

test("misclassified uses the y*w.x <= 0 convention, so w = 0 misses everything", () => {
  const pts = [{ a: 1, b: 1, y: 1 }, { a: -1, b: -1, y: -1 }];
  assert.deepStrictEqual(L.misclassified(pts, [0, 0, 0]), [0, 1]);
});

test("a perceptron update increases y*w.x by exactly ||x||^2", () => {
  const pts = [{ a: 2, b: 3, y: 1 }];
  const r = L.perceptronStep(pts, [0, 0, 0], () => 0);
  assert.notStrictEqual(r, null);
  assert.strictEqual(r.last.n2, 1 + 4 + 9);
  assert.ok(Math.abs((r.last.after - r.last.before) - r.last.n2) < 1e-12);
});

test("perceptronStep returns null once every point is correct", () => {
  const pts = [{ a: 1, b: 1, y: 1 }];
  assert.strictEqual(L.perceptronStep(pts, [0, 1, 1], () => 0), null);
});

test("perceptronStep does not mutate the weight vector it is given", () => {
  const w = [0, 0, 0];
  L.perceptronStep([{ a: 1, b: 1, y: 1 }], w, () => 0);
  assert.deepStrictEqual(w, [0, 0, 0], "caller's w must be untouched");
});

test("a separable run converges", () => {
  let w = [0, 0, 0];
  const pts = L.generate("sep", mulberry(7));
  for (let i = 0; i < 5000 && L.misclassified(pts, w).length; i++) {
    const r = L.perceptronStep(pts, w, () => 0);
    if (r) w = r.w;
  }
  assert.strictEqual(L.misclassified(pts, w).length, 0);
});

test("the planted contradiction makes the data non-separable", () => {
  const pts = L.generate("non", mulberry(11));
  assert.ok(pts.some((p) => p.planted), "must plant a contradicting point");
  let w = [0, 0, 0];
  for (let i = 0; i < 3000; i++) {
    const r = L.perceptronStep(pts, w, () => 0);
    if (r) w = r.w;
  }
  assert.ok(L.misclassified(pts, w).length > 0, "must never converge");
});

// A tiny deterministic PRNG so generate() is reproducible in tests.
function mulberry(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
