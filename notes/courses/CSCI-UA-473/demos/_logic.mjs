// Pure, dependency-free maths for the CSCI-UA-473 figures. Kept out of _kit.jsx
// so it can run under `node --test`; registered into the artifact iframe as
// "@course/logic" by note.js. No DOM, no React, no randomness that is not
// injected.

/* ---- Perceptron ---- */

// w is [b, w1, w2]; the bias is the weight on a constant x0 = 1 coordinate.
export const dot = (w, p) => w[0] + w[1] * p.a + w[2] * p.b;

// The <= 0 convention means w = 0 counts every point as misclassified, which is
// what makes the "Reset w to 0" state read correctly.
export const misclassified = (pts, w) =>
  pts.reduce((m, p, i) => (p.y * dot(w, p) <= 0 && m.push(i), m), []);

// One update. `pick(candidates)` chooses an index into the misclassified list.
// Returns null when nothing is misclassified, else { w, last }.
export function perceptronStep(pts, w, pick) {
  const M = misclassified(pts, w);
  if (!M.length) return null;
  const i = M[pick(M)];
  const p = pts[i], x = [1, p.a, p.b], before = p.y * dot(w, p);
  const next = w.map((v, k) => v + p.y * x[k]);
  return {
    w: next,
    last: { i, y: p.y, before, after: p.y * dot(next, p), n2: 1 + p.a * p.a + p.b * p.b },
  };
}

// Points labelled by a hidden separator `ws`, kept clear of the boundary so the
// sample is separable with a margin. `n` points; the separator is returned so a
// second draw (a test set) can be labelled by the same rule.
function labelledSample(ws, n, rand) {
  const pts = [];
  while (pts.length < n) {
    const p = { a: (rand() * 2 - 1) * 4.5, b: (rand() * 2 - 1) * 4.5 };
    const s = dot(ws, p);
    if (Math.abs(s) < 0.12) continue;
    p.y = s > 0 ? 1 : -1;
    pts.push(p);
  }
  return pts;
}

function separableSample(rand) {
  for (;;) {
    const th = rand() * 2 * Math.PI;
    const ws = [(rand() - 0.5) * 3, Math.cos(th), Math.sin(th)];
    const pts = labelledSample(ws, 20, rand);
    const np = pts.filter((p) => p.y > 0).length;
    if (np >= 3 && np <= 17) return { pts, ws };
  }
}

// kind is "sep" | "non" | "empty". `rand` is a () => [0,1) generator.
export function generate(kind, rand) {
  return generateSplit(kind, rand, 0).pts;
}

/* The same draw, plus `nTest` further points labelled by the same hidden separator.
   PLA converges to zero training error on any separable sample, whatever the
   initial w; the test set is what tells two such runs apart, and it has to come from
   the same rule the training labels came from or the comparison means nothing. */
export function generateSplit(kind, rand, nTest = 40) {
  if (kind === "empty") return { pts: [], test: [] };
  const { pts, ws } = separableSample(rand);
  const test = nTest > 0 ? labelledSample(ws, nTest, rand) : [];
  if (kind === "non") {
    // Plant the midpoint of the two furthest same-class points, labelled the
    // other way: no line can separate it, so the run provably never converges.
    const c = pts[0].y, same = pts.filter((p) => p.y === c);
    let best = [same[0], same[1]], bd = -1;
    for (let i = 0; i < same.length; i++)
      for (let j = i + 1; j < same.length; j++) {
        const d = (same[i].a - same[j].a) ** 2 + (same[i].b - same[j].b) ** 2;
        if (d > bd) { bd = d; best = [same[i], same[j]]; }
      }
    pts.push({ a: (best[0].a + best[1].a) / 2, b: (best[0].b + best[1].b) / 2, y: -c, planted: true });
  }
  return { pts, test };
}

// Multiply every input by k. Labels stay; the separator's orientation stays; only
// the scale of the geometry changes, which is what the "double the inputs" question
// is about.
export const scalePoints = (pts, k) => pts.map((p) => ({ ...p, a: p.a * k, b: p.b * k }));

// Fraction of `pts` on the wrong side of w, under the same <= 0 convention as
// `misclassified`. Used for the held-out error readout.
export const errorRate = (pts, w) => (pts.length ? misclassified(pts, w).length / pts.length : 0);

/* ---- No Free Lunch on the Boolean cube ---- */

// The 8 vertices of {0,1}^3, in the nesting order the figure draws them.
export const VERTICES = (() => {
  const V = [];
  for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) V.push([a, b, c]);
  return V;
})();

// A hypothesis is a mask in [0, 256): bit i is the label at VERTICES[i].
export const labelOf = (mask, i) => ((mask >> i) & 1) ? 1 : -1;

// The linear threshold functions, derived rather than tabulated. Sweeping
// half-integer weights and thresholds over [-3, 3] finds all 104; the count is
// the known number of threshold functions of three variables.
let THR = null;
export function thresholdFns() {
  if (THR) return THR;
  THR = new Set();
  const R = []; for (let i = -6; i <= 6; i++) R.push(i / 2);
  for (const w0 of R) for (const w1 of R) for (const w2 of R) for (const t of R) {
    let mask = 0, ok = true;
    for (let i = 0; i < 8; i++) {
      const v = VERTICES[i], s = w0 * v[0] + w1 * v[1] + w2 * v[2] - t;
      if (s === 0) { ok = false; break; }   // a vertex on the plane is undefined
      if (s > 0) mask |= 1 << i;
    }
    if (ok) THR.add(mask);
  }
  return THR;
}

// D maps vertex index -> observed label. Returns the hypothesis set, the subset
// consistent with D, and for each unseen vertex the fraction of consistent
// hypotheses voting +1 (null when nothing is consistent).
export function analyzeNFL(D, linearOnly) {
  const thr = linearOnly ? thresholdFns() : null;
  const H = [];
  for (let m = 0; m < 256; m++) if (!thr || thr.has(m)) H.push(m);
  const seen = Object.keys(D).map(Number);
  const C = H.filter((m) => seen.every((i) => labelOf(m, i) === D[i]));
  const vote = {};
  for (let i = 0; i < 8; i++)
    if (!(i in D)) vote[i] = C.length ? C.filter((m) => labelOf(m, i) === 1).length / C.length : null;
  return { H, C, vote };
}

/* ---- Bias absorption: lifting 2D inputs onto the x0 = 1 shelf ---- */

// The fixed demo cloud, labelled by the plane 0.8*a - b + 0.9 = 0.
export const LIFT_POINTS = [
  [-1.5, 1.2], [-0.5, 1.5], [0.5, 1.8], [1.2, 1.5], [-1.7, 0.2], [-1.0, 0.6],
  [0.0, -0.5], [1.0, -1.2], [-0.8, -1.5], [1.6, 0.3], [0.3, 0.4], [-1.8, -1.2],
].map(([a, b]) => ({ a, b, y: 0.8 * a - b + 0.9 > 0 ? 1 : -1 }));

// Sutherland-Hodgman: clip a convex polygon to the half-space f(p) >= 0, adding
// the crossing points where an edge changes sign.
export function clipHalfPlane(poly, f) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q);
    if (fp >= 0) out.push(p);
    if (fp * fq < 0) {
      const t = fp / (fp - fq);
      out.push(p.map((v, k) => v + t * (q[k] - v)));
    }
  }
  return out;
}

/* ---- Ridge vs. lasso constraint regions (note 05) ----

   The closing slide of FML05 draws the same elliptical error contours against two
   feasible regions, an L1 diamond and an L2 circle, and asserts that the diamond's
   corners are what produce exact zeros. These solve the constrained problem for real
   so the claim can be checked rather than asserted.

   Loss is the quadratic bowl around the unconstrained least-squares solution,
       loss(w) = (w - what)' A (w - what),
   with A symmetric positive definite. That IS the RSS up to an additive constant:
   expanding (y - Xw)'(y - Xw) around what = (X'X)^-1 X'y gives A = X'X. So the
   picture is not a cartoon of regression, it is regression in two parameters. */

// loss(w) for the quadratic form A centred at what. A is [a11, a12, a22].
export function ellipseLoss(A, what, w) {
  const dx = w[0] - what[0], dy = w[1] - what[1];
  return A[0] * dx * dx + 2 * A[1] * dx * dy + A[2] * dy * dy;
}

// Minimize loss along the segment p -> q, in closed form.
// g(s) = loss(p + s(q-p)) is a parabola in s; g'(s) = 0 gives s*, clamped to [0,1].
// Clamping to an endpoint is what puts the lasso solution exactly on a corner.
function minOnSegment(A, what, p, q) {
  const dx = q[0] - p[0], dy = q[1] - p[1];
  const ex = p[0] - what[0], ey = p[1] - what[1];
  // g(s) = A0(ex+s dx)^2 + 2A1(ex+s dx)(ey+s dy) + A2(ey+s dy)^2
  const quad = A[0] * dx * dx + 2 * A[1] * dx * dy + A[2] * dy * dy;
  const lin = 2 * (A[0] * ex * dx + A[1] * (ex * dy + ey * dx) + A[2] * ey * dy);
  let s = quad <= 0 ? 0 : -lin / (2 * quad);
  s = Math.max(0, Math.min(1, s));
  const w = [p[0] + s * dx, p[1] + s * dy];
  return { w, loss: ellipseLoss(A, what, w) };
}

export const l1norm = (w) => Math.abs(w[0]) + Math.abs(w[1]);
export const l2norm = (w) => Math.hypot(w[0], w[1]);

/* Lasso: minimize loss subject to |w1| + |w2| <= t.
   Inside the diamond the unconstrained solution wins; otherwise the minimum is on the
   boundary, which is four segments, each solved exactly above. Returns the point and
   whether a coordinate came out exactly zero. */
export function lassoFit(A, what, t) {
  if (l1norm(what) <= t) return { w: what.slice(), active: false, zeros: 0 };
  const V = [[t, 0], [0, t], [-t, 0], [0, -t]];
  let best = null;
  for (let i = 0; i < 4; i++) {
    const r = minOnSegment(A, what, V[i], V[(i + 1) % 4]);
    if (!best || r.loss < best.loss) best = r;
  }
  const zeros = (best.w[0] === 0 ? 1 : 0) + (best.w[1] === 0 ? 1 : 0);
  return { w: best.w, active: true, zeros };
}

/* Ridge: minimize loss subject to ||w||_2 <= t.
   On the circle there is no corner to land on, so the boundary is scanned by angle and
   then refined by golden section. The scan is deliberate: it makes the "never exactly
   zero" property an observed outcome of the geometry rather than a special case. */
export function ridgeFit(A, what, t, steps = 1440) {
  if (l2norm(what) <= t) return { w: what.slice(), active: false, zeros: 0 };
  const at = (th) => ellipseLoss(A, what, [t * Math.cos(th), t * Math.sin(th)]);
  let bi = 0, bv = Infinity;
  for (let i = 0; i < steps; i++) {
    const v = at((i / steps) * 2 * Math.PI);
    if (v < bv) { bv = v; bi = i; }
  }
  const step = (2 * Math.PI) / steps;
  let lo = (bi - 1) * step, hi = (bi + 1) * step;
  const phi = (Math.sqrt(5) - 1) / 2;
  let c = hi - phi * (hi - lo), d = lo + phi * (hi - lo);
  for (let k = 0; k < 60; k++) {
    if (at(c) < at(d)) { hi = d; d = c; c = hi - phi * (hi - lo); }
    else { lo = c; c = d; d = lo + phi * (hi - lo); }
  }
  const th = (lo + hi) / 2;
  const w = [t * Math.cos(th), t * Math.sin(th)];
  const zeros = (w[0] === 0 ? 1 : 0) + (w[1] === 0 ? 1 : 0);
  return { w, active: true, zeros };
}

/* ---- Seeded randomness (notes 04) ----
   Figures that sample must be reproducible: the prose cites what you see, and a
   screenshot has to come back the same. Every draw runs through an injected
   generator, never Math.random. */

export function rng(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

// Box-Muller, so the noisy-sine figure gets real Gaussian noise rather than a
// uniform that only looks like noise.
export function gauss(rand) {
  let u = 0, v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* ---- Hoeffding (note 04) ---- */

// The bound itself. Note it never reads mu: that independence is the whole point
// of the figure, and stating it as code makes it checkable.
export const hoeffding = (eps, N) => Math.min(1, 2 * Math.exp(-2 * eps * eps * N));

// Draw `trials` samples of N Bernoulli(mu) draws; return each sample's nu.
export function sampleNus(mu, N, trials, rand) {
  const out = new Array(trials);
  for (let t = 0; t < trials; t++) {
    let red = 0;
    for (let i = 0; i < N; i++) if (rand() < mu) red++;
    out[t] = red / N;
  }
  return out;
}

// Fraction of samples that missed by more than eps: the quantity the bound bounds.
export const missRate = (nus, mu, eps) =>
  nus.reduce((n, v) => n + (Math.abs(v - mu) > eps ? 1 : 0), 0) / nus.length;

// The union bound over M hypotheses, and the smallest M at which it says nothing.
export const unionBound = (eps, N, M) => Math.min(1, M * hoeffding(eps, N));
export const vacuousAt = (eps, N) => Math.ceil(1 / hoeffding(eps, N));

/* ---- Polynomial least squares (notes 04, 05) ---- */

// Vandermonde row for degree M.
const vand = (x, M) => Array.from({ length: M + 1 }, (_, j) => Math.pow(x, j));

// Solve the normal equations by Gaussian elimination with partial pivoting.
// Ridge-style lambda on the diagonal keeps M = 9 on 10 points from blowing up
// numerically; at lambda = 0 it is plain least squares.
export function polyFit(xs, ys, M, lambda = 0) {
  const n = M + 1;
  const A = Array.from({ length: n }, () => new Array(n).fill(0));
  const b = new Array(n).fill(0);
  for (let i = 0; i < xs.length; i++) {
    const p = vand(xs[i], M);
    for (let r = 0; r < n; r++) {
      b[r] += p[r] * ys[i];
      for (let c = 0; c < n; c++) A[r][c] += p[r] * p[c];
    }
  }
  for (let r = 0; r < n; r++) A[r][r] += lambda;
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    if (Math.abs(A[piv][col]) < 1e-12) continue;
    [A[col], A[piv]] = [A[piv], A[col]];
    [b[col], b[piv]] = [b[piv], b[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = A[r][col] / A[col][col];
      for (let c = col; c < n; c++) A[r][c] -= f * A[col][c];
      b[r] -= f * b[col];
    }
  }
  return A.map((row, r) => (Math.abs(row[r]) < 1e-12 ? 0 : b[r] / row[r]));
}

export const polyEval = (w, x) => w.reduce((s, c, j) => s + c * Math.pow(x, j), 0);

export const rmse = (w, xs, ys) =>
  Math.sqrt(xs.reduce((s, x, i) => s + Math.pow(polyEval(w, x) - ys[i], 2), 0) / xs.length);

/* The deck's example: ten points from a sine with Gaussian noise. `target` is the
   noise-free curve, so E_out can be measured against the thing that generated the
   data rather than against a second noisy sample. */
export const TARGET = (x) => Math.sin(2 * Math.PI * x);

export function sineSample(N, sigma, rand) {
  const xs = Array.from({ length: N }, (_, i) => (N === 1 ? 0.5 : i / (N - 1)));
  return { xs, ys: xs.map((x) => TARGET(x) + sigma * gauss(rand)) };
}

// E_out approximated on a dense grid against the noise-free target.
export function outOfSample(w, grid = 200) {
  let s = 0;
  for (let i = 0; i <= grid; i++) {
    const x = i / grid;
    s += Math.pow(polyEval(w, x) - TARGET(x), 2);
  }
  return Math.sqrt(s / (grid + 1));
}

/* E_out as note 04 defines it: error against the distribution, which still contains
   the noise. With y = TARGET(x) + eps and eps independent of x,
     E[(h - y)^2] = E[(h - TARGET)^2] + sigma^2,
   so the irreducible noise floor has to be added back. Without it E_out can come out
   BELOW E_in - the fit beats the noisy sample it was trained on - and the U-curve's
   generalization gap goes negative, which is an artefact of measuring against the
   clean curve rather than a real effect. */
export const eoutNoisy = (w, sigma, grid = 200) =>
  Math.sqrt(Math.pow(outOfSample(w, grid), 2) + sigma * sigma);

/* ---- Random-x sine samples, and validation (notes 04, 06) ---- */

// Same generator as `sineSample`, but with x drawn uniformly rather than on a grid.
// A validation or test set has to be a fresh draw from the same P(x), and a second
// copy of the same grid is not a draw at all.
export function sineSampleRandom(N, sigma, rand) {
  const xs = Array.from({ length: N }, () => rand());
  return { xs, ys: xs.map((x) => TARGET(x) + sigma * gauss(rand)) };
}

// Index of the smallest entry: the degree (or lambda) a validation curve picks.
export const argmin = (arr) => arr.reduce((b, v, i) => (v < arr[b] ? i : b), 0);

/* ---- Bias and variance (note 06) ----
   K datasets of N points each, all from the same target and noise. Fit degree M to
   every one. gbar is the average fit; bias^2 measures how far gbar is from the
   target, variance how far the individual fits scatter around gbar. Both are
   averaged over a grid of x, against the noise-free target, so they are the
   quantities in the decomposition and not a noisy estimate of them. */
export function biasVariance(M, { K = 40, N = 10, sigma = 0.2, grid = 100, lambda = 0 } = {}, rand) {
  const fits = [];
  for (let k = 0; k < K; k++) {
    const { xs, ys } = sineSample(N, sigma, rand);
    fits.push(polyFit(xs, ys, M, lambda));
  }
  const gx = Array.from({ length: grid + 1 }, (_, i) => i / grid);
  const preds = fits.map((w) => gx.map((x) => polyEval(w, x)));
  const gbar = gx.map((_, i) => preds.reduce((s, p) => s + p[i], 0) / K);
  let bias2 = 0, variance = 0;
  gx.forEach((x, i) => {
    bias2 += Math.pow(gbar[i] - TARGET(x), 2);
    variance += preds.reduce((s, p) => s + Math.pow(p[i] - gbar[i], 2), 0) / K;
  });
  return { fits, gx, gbar, bias2: bias2 / gx.length, variance: variance / gx.length };
}

/* ---- Dense linear algebra for the regularization path (note 05) ---- */

// Solve A x = b by Gaussian elimination with partial pivoting. Inputs are copied.
// A singular pivot leaves that coordinate at 0 rather than throwing: the callers
// draw a picture, and a picture with one missing coefficient is more useful than
// no picture.
export function solve(A0, b0) {
  const n = b0.length;
  const A = A0.map((r) => r.slice()), b = b0.slice();
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    if (Math.abs(A[piv][col]) < 1e-12) continue;
    [A[col], A[piv]] = [A[piv], A[col]];
    [b[col], b[piv]] = [b[piv], b[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = A[r][col] / A[col][col];
      for (let c = col; c < n; c++) A[r][c] -= f * A[col][c];
      b[r] -= f * b[col];
    }
  }
  return A.map((row, r) => (Math.abs(row[r]) < 1e-12 ? 0 : b[r] / row[r]));
}

/* A regression problem for the coefficient-path figure. N rows, d columns, the first
   two columns correlated (rho) so that ridge and lasso disagree about them: ridge
   splits the shared signal between the pair, lasso hands it to one and zeroes the
   other. Columns are standardized and y centred, so there is no intercept to
   penalize and the picture is about the d slopes only. */
export function regressionSample({ N = 60, trueW = [4, 0, -3, 0, 2, 0], sigma = 1.5, rho = 0.9 } = {}, rand) {
  const d = trueW.length;
  const X = [];
  for (let i = 0; i < N; i++) {
    const row = Array.from({ length: d }, () => gauss(rand));
    row[1] = rho * row[0] + Math.sqrt(1 - rho * rho) * row[1];
    X.push(row);
  }
  // standardize columns
  for (let j = 0; j < d; j++) {
    const m = X.reduce((s, r) => s + r[j], 0) / N;
    const sd = Math.sqrt(X.reduce((s, r) => s + (r[j] - m) ** 2, 0) / N) || 1;
    X.forEach((r) => { r[j] = (r[j] - m) / sd; });
  }
  let y = X.map((r) => r.reduce((s, v, j) => s + v * trueW[j], 0) + sigma * gauss(rand));
  const ym = y.reduce((s, v) => s + v, 0) / N;
  y = y.map((v) => v - ym);
  return { X, y, trueW };
}

const gram = (X) => {
  const d = X[0].length;
  const G = Array.from({ length: d }, () => new Array(d).fill(0));
  for (const r of X) for (let a = 0; a < d; a++) for (let b = 0; b < d; b++) G[a][b] += r[a] * r[b];
  return G;
};
const xty = (X, y) => X[0].map((_, j) => X.reduce((s, r, i) => s + r[j] * y[i], 0));

// Ridge in closed form: (X'X + lambda I)^-1 X'y, on the bare-RSS convention of the
// lecture. lambda = 0 is ordinary least squares.
export function ridgeSolve(X, y, lambda) {
  const G = gram(X);
  for (let j = 0; j < G.length; j++) G[j][j] += lambda;
  return solve(G, xty(X, y));
}

// Lasso has no closed form; this is coordinate descent on RSS + lambda * ||w||_1.
// For coordinate j the objective is a parabola plus |w_j|, and its minimizer is the
// soft threshold below - the operation that produces exact zeros, which is the whole
// reason the lasso is taught.
export function lassoSolve(X, y, lambda, { iters = 300, w0 = null } = {}) {
  const N = X.length, d = X[0].length;
  const w = w0 ? w0.slice() : new Array(d).fill(0);
  const norm2 = X[0].map((_, j) => X.reduce((s, r) => s + r[j] * r[j], 0));
  const resid = y.map((v, i) => v - X[i].reduce((s, x, j) => s + x * w[j], 0));
  for (let it = 0; it < iters; it++) {
    let moved = 0;
    for (let j = 0; j < d; j++) {
      let rho = 0;
      for (let i = 0; i < N; i++) rho += X[i][j] * (resid[i] + X[i][j] * w[j]);
      const wj = Math.sign(rho) * Math.max(0, Math.abs(rho) - lambda / 2) / norm2[j];
      if (wj !== w[j]) {
        for (let i = 0; i < N; i++) resid[i] += X[i][j] * (w[j] - wj);
        moved = Math.max(moved, Math.abs(wj - w[j]));
        w[j] = wj;
      }
    }
    if (moved < 1e-9) break;
  }
  return w;
}

// Coefficient vectors along a grid of lambdas, warm-started for the lasso so the path
// is smooth. `kind` is "ridge" | "lasso".
export function regPath(X, y, lambdas, kind) {
  const out = [];
  let prev = null;
  for (const lam of lambdas) {
    prev = kind === "ridge" ? ridgeSolve(X, y, lam) : lassoSolve(X, y, lam, { w0: prev });
    out.push(prev);
  }
  return out;
}

// Log-spaced lambdas from 10^lo to 10^hi.
export const logSpace = (lo, hi, n) =>
  Array.from({ length: n }, (_, i) => Math.pow(10, lo + ((hi - lo) * i) / (n - 1)));

/* ---- Overfitting, validation, bias-variance (note 06) ---- */

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const median = (a) => {
  const s = [...a].sort((p, q) => p - q), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// Midpoints of 400 equal cells on [-1, 1]. Every E_out on that interval is a mean over
// this grid. Midpoints rather than a grid that includes the endpoints: P_50 has its
// largest values at x = +-1, and counting those at full weight overstated E_x[f^2] by 7%.
export const GRID_PM1 = Array.from({ length: 400 }, (_, i) => -1 + (2 * i + 1) / 400);

// P_0 .. P_Q at x, by Bonnet's recurrence.
export function legendreAll(Q, x) {
  const p = [1, x];
  for (let q = 2; q <= Q; q++) p.push(((2 * q - 1) * x * p[q - 1] - (q - 1) * p[q - 2]) / q);
  return p.slice(0, Q + 1);
}

/* The slide 6 targets, built the way LFD builds them: a Legendre series of degree Q
   with Gaussian coefficients, rescaled so E_x[f^2] = 1 for x uniform on [-1, 1]. The
   scaling uses E[P_q^2] = 1/(2q+1), so it is exact rather than estimated, and targets
   of every complexity have the same size - otherwise "more complex" would also mean
   "bigger", and the slider would be measuring two things. */
export function legendreTarget(Q, rand) {
  const a = Array.from({ length: Q + 1 }, () => gauss(rand));
  const z = Math.sqrt(a.reduce((s, v, q) => s + (v * v) / (2 * q + 1), 0));
  return (x) => legendreAll(Q, x).reduce((s, p, q) => s + a[q] * p, 0) / z;
}

// One draw of slide 6: a target of complexity Q, N noisy points, and the degree-2 and
// degree-10 least-squares fits. E_out is squared error against the distribution, so it
// includes the noise floor sigma^2, as E_in does.
export function overfitTrial({ N = 15, sigma = 0.5, Q = 10 } = {}, rand) {
  const f = legendreTarget(Q, rand);
  const xs = Array.from({ length: N }, () => 2 * rand() - 1);
  const ys = xs.map((x) => f(x) + sigma * gauss(rand));
  const fGrid = GRID_PM1.map(f);
  const out = { f, xs, ys, w: {}, ein: {}, eout: {} };
  for (const M of [2, 10]) {
    const w = polyFit(xs, ys, M);
    out.w[M] = w;
    out.ein[M] = mean(xs.map((x, i) => (polyEval(w, x) - ys[i]) ** 2));
    out.eout[M] = mean(GRID_PM1.map((x, i) => (polyEval(w, x) - fGrid[i]) ** 2)) + sigma * sigma;
  }
  return out;
}

/* Many draws, new target and new data each time. Two summaries, because the excess
   E_out of the degree-10 fit is heavy-tailed at small N (one draw in the hundreds
   drags a mean anywhere): how often degree 10 loses, and the median amount by which
   it loses. Both are LFD's "overfit measure" E_out(g10) - E_out(g2), read robustly. */
export function overfitSummary({ N = 15, sigma = 0.5, Q = 10, trials = 300 } = {}, rand) {
  const excess = [];
  for (let t = 0; t < trials; t++) {
    const o = overfitTrial({ N, sigma, Q }, rand);
    excess.push(o.eout[10] - o.eout[2]);
  }
  return { worse: excess.filter((d) => d > 1e-9).length / trials, median: median(excess) };
}

/* Slide 14. For every validation size K, many datasets of N points from the noisy
   sine: train degree M on the first N - K, validate on the last K. The x's are i.i.d.,
   so which points land in which part is already random. Returns the mean and spread
   of E_val(g-) across datasets, the mean of E_out(g-) (the curve E_val is unbiased
   for - the two should overlap), and E_out(g) for the fold-back hypothesis trained on
   all N, which does not depend on K. Squared error throughout. */
// m_j = integral over [0, 1] of x^j TARGET(x), by Simpson's rule on 4000 cells, once.
const SINE_MOMENTS = (() => {
  const n = 4000, out = [];
  for (let j = 0; j <= 12; j++) {
    let s = 0;
    for (let i = 0; i <= n; i++) {
      const x = i / n, c = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
      s += c * Math.pow(x, j) * TARGET(x);
    }
    out.push(s / (3 * n));
  }
  return out;
})();

/* E_out of a polynomial against the noisy sine, in closed form: with x uniform on
   [0, 1], integral (g - f)^2 = sum_jk w_j w_k / (j+k+1) - 2 sum_j w_j m_j + 1/2.
   Exact where `outOfSample` samples a grid, and O(M^2) instead of 200 evaluations,
   which is what lets the validation figure redo 30,000 fits on a slider move. */
export function eoutSineExact(w, sigma = 0) {
  let gg = 0, gf = 0;
  for (let j = 0; j < w.length; j++) {
    gf += w[j] * SINE_MOMENTS[j];
    for (let k = 0; k < w.length; k++) gg += (w[j] * w[k]) / (j + k + 1);
  }
  return Math.max(0, gg - 2 * gf + 0.5) + sigma * sigma;
}

export function validationCurve({ N = 40, M = 3, sigma = 0.3, Ks, trials = 1000 } = {}, rand) {
  const data = Array.from({ length: trials }, () => sineSampleRandom(N, sigma, rand));
  const eoutOf = (w) => eoutSineExact(w, sigma);
  const full = mean(data.map((d) => eoutOf(polyFit(d.xs, d.ys, M))));
  /* Prefix sums of the normal equations: the fit on the first n points needs
     sum_{i<n} v_i v_i^T and sum_{i<n} v_i y_i, and every K reuses the same prefixes,
     so each fit is one small in-place solve instead of a rebuild. */
  const d1 = M + 1, stride = d1 * (d1 + 1);
  const prefix = data.map(({ xs, ys }) => {
    const P = new Float64Array((N + 1) * stride);
    for (let i = 0; i < N; i++) {
      const o = i * stride, o2 = o + stride;
      let p = 1;
      const v = new Float64Array(d1);
      for (let r = 0; r < d1; r++) { v[r] = p; p *= xs[i]; }
      for (let r = 0; r < d1; r++) {
        for (let c = 0; c < d1; c++) P[o2 + r * (d1 + 1) + c] = P[o + r * (d1 + 1) + c] + v[r] * v[c];
        P[o2 + r * (d1 + 1) + d1] = P[o + r * (d1 + 1) + d1] + v[r] * ys[i];
      }
    }
    return P;
  });
  const aug = new Float64Array(stride);
  const fitFirst = (k, n) => {
    aug.set(prefix[k].subarray(n * stride, (n + 1) * stride));
    const w = new Array(d1).fill(0), row = d1 + 1;
    for (let col = 0; col < d1; col++) {
      let piv = col;
      for (let r = col + 1; r < d1; r++) if (Math.abs(aug[r * row + col]) > Math.abs(aug[piv * row + col])) piv = r;
      if (Math.abs(aug[piv * row + col]) < 1e-12) continue;
      if (piv !== col) for (let c = 0; c < row; c++) { const t = aug[col * row + c]; aug[col * row + c] = aug[piv * row + c]; aug[piv * row + c] = t; }
      for (let r = 0; r < d1; r++) {
        if (r === col) continue;
        const f = aug[r * row + col] / aug[col * row + col];
        for (let c = col; c < row; c++) aug[r * row + c] -= f * aug[col * row + c];
      }
    }
    for (let r = 0; r < d1; r++) { const a = aug[r * row + r]; w[r] = Math.abs(a) < 1e-12 ? 0 : aug[r * row + d1] / a; }
    return w;
  };
  const rows = Ks.map((K) => {
    const ev = [], eo = [];
    for (let k = 0; k < trials; k++) {
      const d = data[k], n = N - K;
      const w = fitFirst(k, n);
      let s = 0;
      for (let i = n; i < N; i++) {
        let g = 0;
        for (let j = M; j >= 0; j--) g = g * d.xs[i] + w[j];
        s += (g - d.ys[i]) * (g - d.ys[i]);
      }
      ev.push(s / K);
      eo.push(eoutOf(w));
    }
    const m = mean(ev), sorted = [...ev].sort((p, q) => p - q);
    const at = (f) => sorted[Math.round(f * (sorted.length - 1))];
    // the middle 68% as well as the sd: one wild g- among a thousand moves the sd a lot
    // and the percentiles not at all, and the figure draws the percentiles
    return { K, meanVal: m, sdVal: Math.sqrt(mean(ev.map((v) => (v - m) ** 2))),
      lo: at(0.16), hi: at(0.84), meanOut: mean(eo) };
  });
  return { rows, eoutFull: full, first: data[0] };
}

/* Slides 29-34: f(x) = sin(pi x) on [-1, 1], no noise, N points drawn uniformly.
   H0 fits the constant mean(y); H1 fits the least-squares line (for N = 2, the line
   through both points). Bias and variance are exact functions of the fits, averaged
   over a grid of x and over T datasets; `keep` fits are returned for drawing.

   H1's variance is large but not heavy-tailed. The slope of a line through two points
   on the curve is f'(xi) for some xi between them, so it never exceeds pi in size;
   what makes the variance 1.69 is a slope of up to pi carried across an interval of
   width 2. */
export const SINPI = (x) => Math.sin(Math.PI * x);

export function linesExperiment(N, { T = Math.round(600000 / N), grid = 100, keep = 60 } = {}, rand) {
  /* Every fit is a line a x + b, so the grid average has a closed form: for x uniform
     on [-1, 1], E_x[x] = 0 and E_x[x^2] = 1/3, which gives
       variance = Var(a) / 3 + Var(b)
       bias     = E[a]^2 / 3 + E[b]^2 - 2 E[a] E_x[x sin(pi x)] + E_x[sin^2(pi x)]
                = E[a]^2 / 3 + E[b]^2 - 2 E[a] / pi + 1/2.
     So a dataset costs five running sums instead of a pass over a grid, and T can be
     large enough that the answer is not Monte Carlo noise: at 20,000 datasets H1's
     variance at N = 2 wandered between 1.64 and 1.69 with the seed. The default keeps
     N * T fixed, since the variance being estimated shrinks like 1/N. For reference,
     quadrature over the two x's gives H1 at N = 2 bias 0.207 and variance 1.676; the
     slide's 1.69 is LFD's own simulation, a little high. */
  const gx = Array.from({ length: grid }, (_, i) => -1 + (2 * i + 1) / grid);
  const S = { h0: [0, 0, 0, 0, 0], h1: [0, 0, 0, 0, 0] };   // sums of a, b, a^2, b^2, ab
  const fits = { h0: [], h1: [] };
  const xs = new Float64Array(N);
  for (let t = 0; t < T; t++) {
    let xm = 0, ym = 0;
    for (let i = 0; i < N; i++) { xs[i] = 2 * rand() - 1; xm += xs[i]; }
    xm /= N;
    let sxy = 0, sxx = 0, ys = 0;
    for (let i = 0; i < N; i++) { const y = SINPI(xs[i]); ys += y; }
    ym = ys / N;
    for (let i = 0; i < N; i++) { const dx = xs[i] - xm; sxy += dx * (SINPI(xs[i]) - ym); sxx += dx * dx; }
    const a = sxx > 0 ? sxy / sxx : 0;
    const lines = { h0: [0, ym], h1: [a, ym - a * xm] };
    for (const k of ["h0", "h1"]) {
      const [sl, ic] = lines[k], A = S[k];
      A[0] += sl; A[1] += ic; A[2] += sl * sl; A[3] += ic * ic; A[4] += sl * ic;
      if (t < keep) fits[k].push(lines[k]);
    }
  }
  const out = { gx };
  for (const k of ["h0", "h1"]) {
    const [sa, sb, saa, sbb, sab] = S[k].map((v) => v / T);
    const va = Math.max(0, saa - sa * sa), vb = Math.max(0, sbb - sb * sb), cab = sab - sa * sb;
    out[k] = {
      fits: fits[k], meanLine: [sa, sb],
      gbar: gx.map((x) => sa * x + sb),
      sd: gx.map((x) => Math.sqrt(Math.max(0, va * x * x + 2 * cab * x + vb))),
      bias: (sa * sa) / 3 + sb * sb - (2 * sa) / Math.PI + 0.5,
      variance: va / 3 + vb,
    };
  }
  return out;
}
