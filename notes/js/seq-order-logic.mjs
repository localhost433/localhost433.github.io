// Pure, dependency-free ordering logic for the sequence drag-to-order exercise.
// Kept out of _kit.jsx so it can run under `node --test`; registered into the
// artifact iframe as "@course/seq-order" by note.js.

// A tiny LCG so shuffles are reproducible without Math.random (which would make
// a module-load-time shuffle non-deterministic and break resume/snapshot tests).
function lcg(seed) {
  let s = (seed >>> 0) || 1;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export function seededShuffle(items, seed) {
  const out = items.slice();
  const rand = lcg(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = out[i]; out[i] = out[j]; out[j] = t;
  }
  return out;
}

export function gradeOrder(placed, correct) {
  return placed.map((id, index) => ({ index, id, ok: id === correct[index] }));
}

export function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
