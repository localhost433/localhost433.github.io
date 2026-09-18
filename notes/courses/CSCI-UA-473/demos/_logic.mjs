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

// kind is "sep" | "non" | "empty". `rand` is a () => [0,1) generator.
export function generate(kind, rand) {
  if (kind === "empty") return [];
  let pts = [];
  for (;;) {
    pts = [];
    const th = rand() * 2 * Math.PI;
    const ws = [(rand() - 0.5) * 3, Math.cos(th), Math.sin(th)];
    while (pts.length < 20) {
      const p = { a: (rand() * 2 - 1) * 4.5, b: (rand() * 2 - 1) * 4.5 };
      const s = dot(ws, p);
      if (Math.abs(s) < 0.12) continue;
      p.y = s > 0 ? 1 : -1;
      pts.push(p);
    }
    const np = pts.filter((p) => p.y > 0).length;
    if (np >= 3 && np <= 17) break;
  }
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
  return pts;
}

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
