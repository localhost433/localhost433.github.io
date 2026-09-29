"use strict";
const { test, before } = require("node:test");
const assert = require("node:assert");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

// Same shape as the 473 tests: the logic is ESM so the browser can import it as
// @course/logic, and this CJS test reaches it with a dynamic import.
const MOD = pathToFileURL(path.join(__dirname, "_logic.mjs")).href;
let L;
before(async () => { L = await import(MOD); });

const _ = null;

/* ---- issue slots (note 02, book §2.2.5-2.2.6) ---- */

test("superscalar: one thread, groups issue together, a short stall empties a cycle", () => {
  const r = L.issueSchedule("superscalar", { programs: [[2, { wait: 1 }, 3]], threads: 1, width: 4, cycles: 4 });
  assert.deepStrictEqual(r.grid, [[0, 0, _, _], [_, _, _, _], [0, 0, 0, _], [0, 0, _, _]]);
  assert.strictEqual(r.filled, 7);
  assert.strictEqual(r.maxThreadsPerCycle, 1);
});

test("superscalar ignores every thread but the first", () => {
  const one = L.issueSchedule("superscalar", { threads: 1 });
  const four = L.issueSchedule("superscalar", { threads: 4 });
  assert.deepStrictEqual(four.grid, one.grid);
});

test("fine-grained: round robin one thread per cycle, skipping stalled threads", () => {
  const programs = [[1, { wait: 2 }], [1, { wait: 2 }]];
  const r = L.issueSchedule("fine", { programs, threads: 2, width: 1, cycles: 5 });
  assert.deepStrictEqual(r.grid, [[0], [1], [_], [0], [1]]);
});

test("coarse-grained: switches only on a miss, and the switch costs a cycle", () => {
  const programs = [[1, { miss: 3 }], [1]];
  const r = L.issueSchedule("coarse", { programs, threads: 2, width: 1, cycles: 5 });
  assert.deepStrictEqual(r.grid, [[0], [_], [1], [1], [1]]);
  assert.deepStrictEqual(r.switchCycles, [1]);
});

test("coarse-grained: a short stall idles the core instead of switching", () => {
  const programs = [[1, { wait: 2 }], [1]];
  const r = L.issueSchedule("coarse", { programs, threads: 2, width: 1, cycles: 4 });
  assert.deepStrictEqual(r.grid, [[0], [_], [_], [0]]);
});

test("SMT: several threads share one cycle's slots, priority rotating", () => {
  const programs = [[3], [3]];
  const r = L.issueSchedule("smt", { programs, threads: 2, width: 4, cycles: 3 });
  assert.deepStrictEqual(r.grid, [[0, 0, 0, 1], [1, 1, 0, 0], [0, 1, 1, 1]]);
  assert.strictEqual(r.utilization, 1);
  assert.strictEqual(r.maxThreadsPerCycle, 2);
});

test("with one thread every multithreading scheme collapses to plain superscalar", () => {
  const base = L.issueSchedule("superscalar", { threads: 1 }).grid;
  for (const t of ["fine", "coarse", "smt"]) {
    assert.deepStrictEqual(L.issueSchedule(t, { threads: 1 }).grid, base, t);
  }
});

test("default workload with four threads: SMT fills most, and only SMT mixes threads in a cycle", () => {
  const u = {}, m = {};
  for (const t of L.ISSUE_TECHNIQUES) {
    const r = L.issueSchedule(t, { threads: 4 });
    u[t] = r.utilization; m[t] = r.maxThreadsPerCycle;
  }
  assert.ok(u.smt > u.fine && u.fine > u.superscalar, JSON.stringify(u));
  assert.ok(u.fine > u.coarse && u.coarse > u.superscalar, JSON.stringify(u));
  assert.deepStrictEqual([m.superscalar, m.fine, m.coarse], [1, 1, 1]);
  assert.ok(m.smt > 1);
});

/* ---- race on x += my_val (note 04, book §2.4.3) ---- */

test("race: the two serial orders give 26", () => {
  const s = L.raceInit();
  assert.strictEqual(L.raceRun(s, [0, 0, 0, 0, 1, 1, 1, 1]).x, 26);
  assert.strictEqual(L.raceRun(s, [1, 1, 1, 1, 0, 0, 0, 0]).x, 26);
});

test("race: the book's schedule loses thread 0's update and ends at 19", () => {
  // compute, compute, load, load, add, store (T0), add, store (T1)
  const end = L.raceRun(L.raceInit(), [0, 1, 0, 1, 0, 0, 1, 1]);
  assert.strictEqual(end.x, 19);
  assert.strictEqual(end.threads[0].done && end.threads[1].done, true);
});

test("race: of the 70 interleavings, 10 are correct and 60 lose an update", () => {
  const { total, outcomes } = L.raceEnumerate();
  assert.strictEqual(total, 70);
  assert.deepStrictEqual(outcomes, { 7: 30, 19: 30, 26: 10 });
});

test("race: with the lock every reachable interleaving gives 26, and a waiting thread cannot step", () => {
  const { total, outcomes } = L.raceEnumerate({ useLock: true });
  // Whichever thread locks first, the other's compute step can sit in any of the
  // 7 gaps around the first thread's 6 steps: 2 x 7.
  assert.strictEqual(total, 14);
  assert.deepStrictEqual(Object.keys(outcomes), ["26"]);
  const held = L.raceRun(L.raceInit({ useLock: true }), [0, 0, 1]); // T0 locks, T1 computes
  assert.strictEqual(L.raceCanStep(held, 1), false);
  assert.strictEqual(L.raceCanStep(held, 0), true);
});

test("race: stepping is pure", () => {
  const s = L.raceInit();
  const t = L.raceStep(s, 0);
  assert.notStrictEqual(t, s);
  assert.strictEqual(s.threads[0].pc, 0);
  assert.strictEqual(t.threads[0].pc, 1);
});

/* ---- coherence walkthrough (note 03, slide 34 / book §2.3.5) ---- */

test("coherence: with no protocol core 1 reads its stale copy and z1 = 8", () => {
  const w = L.coherenceWalk("none");
  const last = w[w.length - 1];
  assert.deepStrictEqual(last.vars, { y0: 2, y1: 6, z1: 8 });
  assert.strictEqual(w[2].events.find((e) => e.core === 1).hit, true);
});

test("coherence: snooping invalidates core 1 by broadcast, so z1 = 28", () => {
  const w = L.coherenceWalk("snoop");
  assert.deepStrictEqual(w[w.length - 1].vars, { y0: 2, y1: 6, z1: 28 });
  const write = w[1].events.find((e) => e.core === 0);
  assert.deepStrictEqual(write.seenBy, [1, 2, 3]);
  assert.strictEqual(w[1].caches[1].state, "I");
  assert.strictEqual(w[2].events.find((e) => e.core === 1).hit, false);
});

test("coherence: the directory invalidates only the sharer", () => {
  const w = L.coherenceWalk("directory");
  assert.deepStrictEqual(w[w.length - 1].vars, { y0: 2, y1: 6, z1: 28 });
  const write = w[1].events.find((e) => e.core === 0);
  assert.deepStrictEqual(write.seenBy, [1]);
  assert.deepStrictEqual(w[0].directory.sharers, [0, 1]);
  assert.deepStrictEqual(w[1].directory.sharers, [0]);
});

/* ---- waste split (issue slots, second pass) ---- */

test("issue slots: empty-cycle waste and leftover waste partition the unused slots", () => {
  for (const t of L.ISSUE_TECHNIQUES) {
    for (const threads of [1, 2, 4]) {
      const r = L.issueSchedule(t, { threads });
      assert.strictEqual(r.filled + r.wasteEmptyCycles + r.wasteLeftover, 64, `${t} ${threads}`);
    }
  }
});

test("issue slots: fine-grained trades empty cycles for leftovers; only SMT cuts both", () => {
  const w = {};
  for (const t of L.ISSUE_TECHNIQUES) {
    const r = L.issueSchedule(t, { threads: 4 });
    w[t] = [r.wasteEmptyCycles, r.wasteLeftover];
  }
  assert.deepStrictEqual(w.superscalar, [32, 12]);
  assert.deepStrictEqual(w.fine, [8, 22]);
  assert.deepStrictEqual(w.smt, [8, 9]);
  assert.ok(w.smt[0] < w.superscalar[0] && w.smt[1] < w.superscalar[1]);
  assert.ok(w.fine[1] > w.superscalar[1]);
});

/* ---- race, second pass: when the update is lost, and random schedules ---- */

test("race: the update is doomed the moment both threads have loaded before either stores", () => {
  const book = [0, 1, 0, 1, 0, 0, 1, 1];
  let s = L.raceInit();
  const doomedAt = [];
  book.forEach((tid, i) => { s = L.raceStep(s, tid); doomedAt.push(L.raceDoomed(s)); });
  // compute, compute, load (T0), load (T1): doomed from the fourth step on
  assert.deepStrictEqual(doomedAt, [false, false, false, true, true, true, true, true]);
  const serial = L.raceRun(L.raceInit(), [0, 0, 0, 0, 1, 1, 1, 1]);
  assert.strictEqual(L.raceDoomed(serial), false);
});

test("race: doomed agrees with the final value on every interleaving", () => {
  (function walk(s) {
    const movable = [0, 1].filter((i) => L.raceCanStep(s, i));
    if (!movable.length) { assert.strictEqual(L.raceDoomed(s), s.x !== 26); return; }
    for (const i of movable) walk(L.raceStep(s, i));
  })(L.raceInit());
});

test("race: exact failure probability of a fair random scheduler matches simulation", () => {
  const p = L.raceFailureProbability();
  assert.ok(p > 0 && p < 1);
  let fail = 0, N = 20000;
  const rng = L.mulberry32(12345);
  for (let i = 0; i < N; i++) if (L.raceRandomRun({}, rng).x !== 26) fail++;
  assert.ok(Math.abs(fail / N - p) < 0.015, `${fail / N} vs ${p}`);
  assert.strictEqual(L.raceFailureProbability({ useLock: true }), 0);
});

/* ---- tree sums (notes 01 and 04) ---- */

test("tree sum on L1's slide-43 numbers", () => {
  const t = L.treeSum([8, 19, 7, 15, 7, 13, 12, 14]);
  assert.deepStrictEqual(t.rounds.map((r) => r.map((e) => e.sum)), [[27, 22, 20, 26], [49, 46], [95]]);
  assert.deepStrictEqual(t.rounds[0].map((e) => [e.from, e.to]), [[1, 0], [3, 2], [5, 4], [7, 6]]);
  assert.strictEqual(t.total, 95);
});

test("master's work: p - 1 receives and adds naively, ceil(log2 p) with the tree", () => {
  assert.deepStrictEqual(L.masterWork(8), { naive: 7, tree: 3 });
  assert.deepStrictEqual(L.masterWork(1000), { naive: 999, tree: 10 });
  assert.deepStrictEqual(L.masterWork(6), { naive: 5, tree: 3 });
});

test("naive global sum: core 0 adds every other core's value in turn", () => {
  const n = L.naiveSum([8, 19, 7, 15, 7, 13, 12, 14]);
  assert.deepStrictEqual(n.steps.map((e) => [e.from, e.sum]), [[1, 27], [2, 34], [3, 49], [4, 56], [5, 69], [6, 81], [7, 95]]);
  assert.strictEqual(n.total, L.treeSum([8, 19, 7, 15, 7, 13, 12, 14]).total);
});

/* ---- performance (note 06) ---- */

test("overheads: the deck's four speedups (slides 5-6)", () => {
  const S = (k) => L.overheadRun(L.OVERHEAD_SCENARIOS[k]);
  assert.strictEqual(S("perfect").S, 4);
  assert.strictEqual(S("perfect").E, 1);
  assert.ok(Math.abs(S("sync").S - 100 / 35) < 1e-12);          // 2.857, the deck rounds to 2.85
  assert.strictEqual(S("imbalance").S, 2.5);
  assert.strictEqual(S("both").S, 2);
  assert.strictEqual(S("both").E, 0.5);
});

test("overheads: E * Tpar is the average useful time per core, the rest is overhead + idle", () => {
  for (const k of Object.keys(L.OVERHEAD_SCENARIOS)) {
    const r = L.overheadRun(L.OVERHEAD_SCENARIOS[k]);
    assert.ok(Math.abs(r.E * r.tpar - r.usefulAvg) < 1e-12, k);
    assert.ok(Math.abs(r.usefulAvg - r.serial / r.p) < 1e-12, k);  // work sums to Tserial
    r.cores.forEach((c) => assert.strictEqual(c.useful + c.overhead + c.idle, r.tpar));
  }
});

test("overheads: the book's example, Tserial 24 ms, p 8, Tparallel 4 ms", () => {
  const r = L.overheadRun({ serial: 24, work: Array(8).fill(3), sync: 1 });
  assert.strictEqual(r.tpar, 4);
  assert.strictEqual(r.E, 0.75);
  assert.strictEqual(r.lostAvg, 1);
});

test("timing: clock() sums CPU time over threads and misses time spent blocked", () => {
  const r = L.timingRun({ threads: 4, user: 2, sys: 0.25 });
  assert.strictEqual(r.real, 2.25);
  assert.strictEqual(r.clock, 9);                 // 4x the stopwatch
  const w = L.timingRun({ threads: 4, user: 2, sys: 0.25, wait: [0, 1.5] });
  assert.strictEqual(w.real, 3.75);               // the waiting thread sets the wall clock
  assert.strictEqual(w.clock, 9);                 // blocked time is not CPU time
  const one = L.timingRun({ threads: 1, user: 2, sys: 0.25 });
  assert.strictEqual(one.clock, one.real);        // one busy thread: the two agree
});
