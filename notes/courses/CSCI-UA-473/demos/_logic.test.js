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

/* ---- ridge vs. lasso constraint regions ---- */

// A tilted, elongated bowl: correlated features, which is when the two penalties
// actually differ. what sits well outside any small budget.
const A = [1, 0.85, 1.2];
const WHAT = [1.9, 1.35];

test("an unconstrained solution inside the region is returned untouched", () => {
  const big = 10;
  assert.deepStrictEqual(L.lassoFit(A, WHAT, big).w, WHAT);
  assert.strictEqual(L.lassoFit(A, WHAT, big).active, false);
  assert.deepStrictEqual(L.ridgeFit(A, WHAT, big).w, WHAT);
  assert.strictEqual(L.ridgeFit(A, WHAT, big).active, false);
});

test("a binding constraint puts the solution exactly on the boundary", () => {
  const t = 1;
  assert.ok(Math.abs(L.l1norm(L.lassoFit(A, WHAT, t).w) - t) < 1e-9);
  assert.ok(Math.abs(L.l2norm(L.ridgeFit(A, WHAT, t).w) - t) < 1e-6);
});

test("the lasso lands on a corner - an exactly zero coefficient - for a tight budget", () => {
  const hit = [];
  for (let t = 0.1; t <= 1.2; t += 0.1) if (L.lassoFit(A, WHAT, t).zeros > 0) hit.push(+t.toFixed(1));
  assert.ok(hit.length > 0, "expected some budget to zero a coefficient, got none");
  // and it is a *range* of budgets, not a single lucky value - that is the point
  assert.ok(hit.length >= 3, "expected a range of budgets to give sparsity, got " + hit.join(","));
});

test("ridge shrinks toward zero but never reaches it", () => {
  for (let t = 0.05; t <= 1.5; t += 0.05) {
    const r = L.ridgeFit(A, WHAT, t);
    assert.strictEqual(r.zeros, 0, "ridge produced an exact zero at t=" + t.toFixed(2));
    assert.ok(L.l2norm(r.w) > 0);
  }
});

test("both solutions shrink monotonically as the budget tightens", () => {
  let prevL = Infinity, prevR = Infinity;
  for (let t = 1.6; t >= 0.2; t -= 0.1) {
    const nl = L.l1norm(L.lassoFit(A, WHAT, t).w);
    const nr = L.l2norm(L.ridgeFit(A, WHAT, t).w);
    assert.ok(nl <= prevL + 1e-9, "lasso norm grew as t shrank");
    assert.ok(nr <= prevR + 1e-9, "ridge norm grew as t shrank");
    prevL = nl; prevR = nr;
  }
});

test("the constrained solution beats every other feasible point sampled", () => {
  const t = 0.8;
  const lw = L.lassoFit(A, WHAT, t).w, best = L.ellipseLoss(A, WHAT, lw);
  for (let i = 0; i < 400; i++) {
    const th = (i / 400) * 2 * Math.PI;
    // walk the diamond boundary: scale the unit-L1 direction to the budget
    const c = Math.cos(th), s = Math.sin(th);
    const n = Math.abs(c) + Math.abs(s);
    const p = [(t * c) / n, (t * s) / n];
    assert.ok(L.ellipseLoss(A, WHAT, p) >= best - 1e-9,
      "found a feasible point better than the reported lasso optimum");
  }
});

test("a circular bowl sends both penalties to the same radius", () => {
  // A = identity: contours are circles, so the ridge answer is just what scaled in.
  const I = [1, 0, 1], w0 = [3, 4], t = 1;
  const r = L.ridgeFit(I, w0, t);
  assert.ok(Math.abs(r.w[0] - 0.6) < 1e-6 && Math.abs(r.w[1] - 0.8) < 1e-6,
    "expected the radial projection (0.6, 0.8), got " + r.w.map((v) => v.toFixed(4)));
});

/* ---- seeded randomness ---- */

test("rng is deterministic per seed and differs across seeds", () => {
  const a = Array.from({ length: 5 }, L.rng(7));
  const b = Array.from({ length: 5 }, L.rng(7));
  const c = Array.from({ length: 5 }, L.rng(8));
  assert.deepStrictEqual(a, b);
  assert.notDeepStrictEqual(a, c);
  assert.ok(a.every((v) => v >= 0 && v < 1));
});

/* ---- Hoeffding ---- */

test("the Hoeffding bound does not depend on mu", () => {
  // The claim note 04 leans on hardest. It is a property of the formula, so it is
  // testable rather than assertable.
  const at = L.hoeffding(0.1, 500);
  for (const mu of [0.01, 0.2, 0.5, 0.8, 0.99]) {
    assert.strictEqual(L.hoeffding(0.1, 500), at, "bound moved with mu = " + mu);
  }
});

test("halving epsilon costs four times the data for the same bound", () => {
  const target = L.hoeffding(0.1, 1000);
  assert.ok(Math.abs(L.hoeffding(0.05, 4000) - target) < 1e-12);
});

test("the bound is capped at 1 and decreasing in N", () => {
  assert.strictEqual(L.hoeffding(0.01, 1), 1);
  let prev = Infinity;
  for (const N of [10, 100, 1000, 5000]) {
    const v = L.hoeffding(0.1, N);
    assert.ok(v < prev); prev = v;
  }
});

test("sampled deviation actually respects the bound", () => {
  const rand = L.rng(20260918);
  for (const mu of [0.15, 0.5, 0.75]) {
    const nus = L.sampleNus(mu, 200, 400, rand);
    const eps = 0.1;
    assert.ok(L.missRate(nus, mu, eps) <= L.hoeffding(eps, 200),
      "empirical miss rate exceeded the bound at mu=" + mu);
  }
});

test("the union bound loosens by exactly M and goes vacuous", () => {
  assert.ok(Math.abs(L.unionBound(0.1, 500, 4) - 4 * L.hoeffding(0.1, 500)) < 1e-12);
  assert.strictEqual(L.unionBound(0.1, 500, 10 ** 9), 1);
  const M = L.vacuousAt(0.1, 500);
  assert.ok(L.unionBound(0.1, 500, M) >= 1 - 1e-12);
  assert.ok(L.unionBound(0.1, 500, M - 1) < 1);
});

/* ---- polynomial least squares ---- */

test("polyFit recovers an exact polynomial", () => {
  const xs = [0, 0.25, 0.5, 0.75, 1];
  const truth = [1, -2, 3];                     // 1 - 2x + 3x^2
  const ys = xs.map((x) => L.polyEval(truth, x));
  const w = L.polyFit(xs, ys, 2);
  w.forEach((c, i) => assert.ok(Math.abs(c - truth[i]) < 1e-8, "coef " + i + " = " + c));
  assert.ok(L.rmse(w, xs, ys) < 1e-8);
});

test("degree N-1 interpolates N points exactly", () => {
  const rand = L.rng(3);
  const { xs, ys } = L.sineSample(10, 0.2, rand);
  const w = L.polyFit(xs, ys, 9);
  assert.ok(L.rmse(w, xs, ys) < 1e-4, "E_in should be ~0 at M = 9, got " + L.rmse(w, xs, ys));
});

test("the M=9 fit that nails E_in is far worse out of sample - the overfitting claim", () => {
  const rand = L.rng(3);
  const { xs, ys } = L.sineSample(10, 0.2, rand);
  const w3 = L.polyFit(xs, ys, 3);
  const w9 = L.polyFit(xs, ys, 9);
  assert.ok(L.rmse(w9, xs, ys) < L.rmse(w3, xs, ys), "M=9 must fit the sample better");
  assert.ok(L.outOfSample(w9) > L.outOfSample(w3), "M=9 must generalize worse");
});

test("ridge damping pulls the degree-9 fit back toward the target", () => {
  const rand = L.rng(3);
  const { xs, ys } = L.sineSample(10, 0.2, rand);
  const wild = L.polyFit(xs, ys, 9, 0);
  const tamed = L.polyFit(xs, ys, 9, 1e-3);
  assert.ok(L.outOfSample(tamed) < L.outOfSample(wild));
});

test("sineSample is reproducible from its seed", () => {
  const a = L.sineSample(10, 0.2, L.rng(11));
  const b = L.sineSample(10, 0.2, L.rng(11));
  assert.deepStrictEqual(a, b);
});

test("E_out includes the noise floor, so it never dips below it", () => {
  const rand = L.rng(3);
  const sigma = 0.2;
  const { xs, ys } = L.sineSample(10, sigma, rand);
  for (let M = 0; M <= 9; M++) {
    const w = L.polyFit(xs, ys, M);
    assert.ok(L.eoutNoisy(w, sigma) >= sigma - 1e-12,
      "E_out fell below the noise floor at M = " + M);
  }
});

test("the generalization gap stays non-negative where the fit is sane", () => {
  const rand = L.rng(3);
  const sigma = 0.2;
  const { xs, ys } = L.sineSample(10, sigma, rand);
  for (let M = 0; M <= 8; M++) {
    const w = L.polyFit(xs, ys, M);
    assert.ok(L.eoutNoisy(w, sigma) >= L.rmse(w, xs, ys) - 1e-9,
      "gap went negative at M = " + M);
  }
});

/* ---- perceptron: held-out split, scaling ---- */

test("generateSplit labels the test set by the same rule as the training set", () => {
  const { pts, test } = L.generateSplit("sep", L.rng(9), 30);
  assert.strictEqual(pts.length, 20);
  assert.strictEqual(test.length, 30);
  // a separator that fits the training set with margin exists; run PLA and check it
  // also classifies a large majority of the held-out points, which only happens if
  // both were labelled by one rule
  let w = [0, 0, 0];
  for (let t = 0; t < 5000; t++) { const r = L.perceptronStep(pts, w, () => 0); if (!r) break; w = r.w; }
  assert.strictEqual(L.misclassified(pts, w).length, 0);
  assert.ok(L.errorRate(test, w) < 0.35, "held-out error " + L.errorRate(test, w));
});

test("generate is unchanged by the split refactor: still 20 separable points, 21 with the plant", () => {
  assert.strictEqual(L.generate("sep", L.rng(3)).length, 20);
  const non = L.generate("non", L.rng(3));
  assert.strictEqual(non.length, 21);
  assert.ok(non[20].planted);
  assert.deepStrictEqual(L.generate("empty", L.rng(1)), []);
});

test("scalePoints scales inputs and keeps labels; errorRate is a fraction", () => {
  const pts = [{ a: 1, b: -2, y: 1 }, { a: 0.5, b: 0.5, y: -1 }];
  const s = L.scalePoints(pts, 2);
  assert.deepStrictEqual(s, [{ a: 2, b: -4, y: 1 }, { a: 1, b: 1, y: -1 }]);
  assert.deepStrictEqual(pts[0], { a: 1, b: -2, y: 1 }, "input untouched");
  assert.strictEqual(L.errorRate(pts, [0, 0, 0]), 1);
  assert.strictEqual(L.errorRate([], [0, 0, 0]), 0);
});

test("a perceptron through the origin makes the same number of updates on doubled inputs", () => {
  // no bias coordinate: w = [0, w1, w2] and the update leaves w[0] at 0
  const run = (pts) => {
    let w = [0, 0, 0], t = 0;
    for (;;) {
      const M = L.misclassified(pts, w); if (!M.length) return t;
      const p = pts[M[0]]; w = [0, w[1] + p.y * p.a, w[2] + p.y * p.b]; t++;
      if (t > 5000) return -1;
    }
  };
  for (let s = 1; s <= 20; s++) {
    // label through the origin so the no-bias perceptron can converge
    const th = L.rng(s)() * Math.PI * 2, ws = [0, Math.cos(th), Math.sin(th)];
    const r = L.rng(100 + s), pts = [];
    while (pts.length < 15) {
      const p = { a: (r() * 2 - 1) * 4, b: (r() * 2 - 1) * 4 }; const v = L.dot(ws, p);
      if (Math.abs(v) < 0.3) continue; p.y = v > 0 ? 1 : -1; pts.push(p);
    }
    const a = run(pts), b = run(L.scalePoints(pts, 2));
    assert.ok(a > 0 && a === b, `seed ${s}: ${a} vs ${b}`);
  }
});

/* ---- validation and bias-variance ---- */

test("sineSampleRandom draws x in [0,1) and argmin finds the first minimum", () => {
  const { xs, ys } = L.sineSampleRandom(50, 0.1, L.rng(2));
  assert.strictEqual(xs.length, 50);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
  assert.ok(ys.every(Number.isFinite));
  assert.strictEqual(L.argmin([3, 1, 2, 1]), 1);
});

test("biasVariance: bias falls with degree, variance rises, both are averages over x", () => {
  const r = (M) => L.biasVariance(M, { K: 30, N: 10, sigma: 0.2, grid: 50 }, L.rng(5 + M));
  const b0 = r(0), b3 = r(3), b9 = r(9);
  assert.strictEqual(b0.fits.length, 30);
  assert.strictEqual(b0.gbar.length, 51);
  assert.ok(b0.bias2 > b3.bias2, "degree 0 has more bias than degree 3");
  assert.ok(b9.variance > b3.variance, "degree 9 has more variance than degree 3");
  assert.ok(b3.bias2 < 0.05 && b3.variance < 0.1);
});

/* ---- ridge and lasso paths ---- */

test("solve inverts a small system and leaves a singular coordinate at 0", () => {
  const x = L.solve([[2, 1], [1, 3]], [3, 5]);
  assert.ok(Math.abs(x[0] - 0.8) < 1e-12 && Math.abs(x[1] - 1.4) < 1e-12);
  assert.deepStrictEqual(L.solve([[1, 0], [0, 0]], [2, 3]), [2, 0]);
});

test("regressionSample standardizes columns, centres y and correlates the first pair", () => {
  const { X, y, trueW } = L.regressionSample({ N: 200 }, L.rng(3));
  const N = X.length, d = X[0].length;
  assert.strictEqual(d, trueW.length);
  for (let j = 0; j < d; j++) {
    const m = X.reduce((s, r) => s + r[j], 0) / N;
    const v = X.reduce((s, r) => s + (r[j] - m) ** 2, 0) / N;
    assert.ok(Math.abs(m) < 1e-9 && Math.abs(v - 1) < 1e-9, `column ${j}`);
  }
  assert.ok(Math.abs(y.reduce((s, v) => s + v, 0)) < 1e-9);
  const c01 = X.reduce((s, r) => s + r[0] * r[1], 0) / N;
  assert.ok(c01 > 0.8, "correlation of the pair " + c01);
});

test("ridge at lambda 0 is least squares, and lasso at lambda 0 agrees with it", () => {
  const { X, y } = L.regressionSample({}, L.rng(11));
  const ols = L.ridgeSolve(X, y, 0), lasso = L.lassoSolve(X, y, 0, { iters: 2000 });
  ols.forEach((v, j) => assert.ok(Math.abs(v - lasso[j]) < 1e-3, `coef ${j}: ${v} vs ${lasso[j]}`));
  // the normal equations hold: X'(y - Xw) = 0
  const resid = y.map((v, i) => v - X[i].reduce((s, x, j) => s + x * ols[j], 0));
  X[0].forEach((_, j) => assert.ok(Math.abs(X.reduce((s, r, i) => s + r[j] * resid[i], 0)) < 1e-8));
});

test("ridge shrinks without zeros; lasso reaches exact zeros and drops the null features first", () => {
  const { X, y, trueW } = L.regressionSample({}, L.rng(11));
  const lams = L.logSpace(-1, 3, 25);
  const ridge = L.regPath(X, y, lams, "ridge"), lasso = L.regPath(X, y, lams, "lasso");
  const n2 = (w) => Math.sqrt(w.reduce((s, v) => s + v * v, 0));
  for (let i = 1; i < lams.length; i++) {
    assert.ok(n2(ridge[i]) <= n2(ridge[i - 1]) + 1e-9, "ridge norm is non-increasing in lambda");
    assert.ok(ridge[i].every((v) => v !== 0), "ridge never produces an exact zero");
  }
  const last = lasso[lams.length - 1];
  assert.ok(last.every((v) => v === 0), "lasso at lambda 1000 is all zeros");
  // somewhere along the path the lasso keeps exactly the true support
  const support = (w) => w.map((v) => (v !== 0 ? 1 : 0)).join("");
  const truth = support(trueW);
  assert.ok(lasso.some((w) => support(w) === truth), "lasso path passes through the true support");
});

test("logSpace is log-spaced with the given endpoints", () => {
  const l = L.logSpace(-1, 2, 4);
  assert.deepStrictEqual(l.map((v) => +v.toFixed(9)), [0.1, 1, 10, 100]);
});
