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

test("there are exactly 104 linear threshold functions on the Boolean cube", () => {
  assert.strictEqual(L.thresholdFns().size, 104);
});

test("thresholdFns agrees with a brute-force search over weights", () => {
  const R = []; for (let i = -6; i <= 6; i++) R.push(i / 2);
  const brute = new Set();
  for (const w0 of R) for (const w1 of R) for (const w2 of R) for (const th of R) {
    let mask = 0, ok = true;
    for (let i = 0; i < 8; i++) {
      const v = L.VERTICES[i], s = w0 * v[0] + w1 * v[1] + w2 * v[2] - th;
      if (s === 0) { ok = false; break; }
      if (s > 0) mask |= 1 << i;
    }
    if (ok) brute.add(mask);
  }
  assert.deepStrictEqual([...L.thresholdFns()].sort((x, y) => x - y),
                         [...brute].sort((x, y) => x - y));
});

test("with no data every hypothesis is consistent and every vertex ties", () => {
  const { H, C, vote } = L.analyzeNFL({}, false);
  assert.strictEqual(H.length, 256);
  assert.strictEqual(C.length, 256);
  // Exactly half of all 256 functions label any given vertex +1.
  for (let i = 0; i < 8; i++) assert.strictEqual(vote[i], 0.5);
});

test("this is the no-free-lunch result: labelling 7 vertices still ties the 8th", () => {
  const D = {}; for (let i = 0; i < 7; i++) D[i] = 1;
  const { C, vote } = L.analyzeNFL(D, false);
  assert.strictEqual(C.length, 2, "only the two completions survive");
  assert.strictEqual(vote[7], 0.5, "the unseen vertex is still a coin flip");
});

// The labelling matters. With all seven seen vertices +1 the tie SURVIVES the
// restriction, because masks 127 and 255 are both threshold functions. This
// labelling (only vertex 000 positive, vertex 011 hidden) is one where the two
// completions split: "is x = 000" is linearly realisable, "x in {000, 011}" is
// not. Found by exhaustive search over all 256 masks x 8 hidden vertices.
test("restricting H to threshold functions breaks the tie, which is inductive bias", () => {
  const D = { 0: 1, 1: -1, 2: -1, 4: -1, 5: -1, 6: -1, 7: -1 };  // vertex 3 hidden
  const free = L.analyzeNFL(D, false);
  assert.strictEqual(free.C.length, 2, "unrestricted, both completions survive");
  assert.strictEqual(free.vote[3], 0.5, "unrestricted, the unseen vertex ties");

  const biased = L.analyzeNFL(D, true);
  assert.strictEqual(biased.C.length, 1, "only one completion is a threshold function");
  assert.strictEqual(biased.vote[3], 0, "a restricted H commits, and commits to -1");
});

test("parity is not a threshold function, so a linear H cannot fit it", () => {
  const D = {};
  L.VERTICES.forEach((v, i) => { D[i] = (v[0] + v[1] + v[2]) % 2 ? 1 : -1; });
  assert.strictEqual(L.analyzeNFL(D, true).C.length, 0);
  assert.strictEqual(L.analyzeNFL(D, false).C.length, 1);
});

test("clipping a square to a half-plane through its middle halves it", () => {
  const sq = [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
  const out = L.clipHalfPlane(sq, (p) => p[0]);   // keep x >= 0
  assert.ok(out.every((p) => p[0] >= -1e-12), "no vertex may survive on the wrong side");
  assert.strictEqual(out.length, 4, "a straight cut across a square yields a quad");
});

test("clipping keeps a fully-inside polygon whole and drops a fully-outside one", () => {
  const sq = [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
  assert.strictEqual(L.clipHalfPlane(sq, () => 1).length, 4);
  assert.strictEqual(L.clipHalfPlane(sq, () => -1).length, 0);
});

test("the lift demo's fixed points are labelled by the plane that defines them", () => {
  assert.strictEqual(L.LIFT_POINTS.length, 12);
  for (const p of L.LIFT_POINTS)
    assert.strictEqual(p.y, 0.8 * p.a - p.b + 0.9 > 0 ? 1 : -1);
});

test("bias absorption: the generating plane separates the lifted cloud perfectly", () => {
  // w is the plane through the origin in lifted space whose trace on the x0 = 1
  // shelf is the 2D line 0.8a - b + 0.9 = 0 that defined the labels. If bias
  // absorption holds, that plane misclassifies nothing.
  const w = [0.9, 0.8, -1];   // [b, w1, w2]
  const wrong = L.LIFT_POINTS.filter((p) => p.y * (w[0] + w[1] * p.a + w[2] * p.b) <= 0);
  assert.deepStrictEqual(wrong, [], "the generating plane must separate its own labels");
});
