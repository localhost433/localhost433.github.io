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
