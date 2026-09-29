/* CSCI-UA-480 figure logic. Plain ESM, no DOM, no React: the browser imports it
   as @course/logic and _logic.test.js imports it under node. Each figure's
   component owns state and drawing; the rules it animates live here, so the
   numbers the note quotes are the numbers the tests check. */

/* ---- issue slots: pipelining, superscalar and hardware multithreading ----
   Note 02, book §2.2.5-2.2.6. A thread's program is a loop of tokens:
     n (a number)   a group of n independent instructions, which can issue in
                    the same cycle if there are free slots; the next group
                    depends on this one, so it starts the cycle after
     { wait: k }    a short stall (a dependency): the next group waits k cycles
     { miss: k }    a long stall (a load from main memory), also k cycles
   Coarse-grained multithreading treats the two stalls differently, which is the
   only reason they are separate. */

// Four threads with similar parallelism and a 6-cycle memory miss each. With one
// thread far richer than the rest, "superscalar" (which only ever runs thread A)
// outscored coarse-grained multithreading for reasons that had nothing to do with
// the technique; the test on the default workload pins the textbook ordering.
export const ISSUE_PROGRAMS = [
  [3, { wait: 1 }, 2, 4, { miss: 6 }, 2, 3, 1],
  [2, 3, { miss: 6 }, 2, { wait: 1 }, 3, 1],
  [3, 1, { wait: 1 }, 2, { miss: 6 }, 3, 2],
  [2, { wait: 1 }, 3, 2, { miss: 6 }, 1, 3],
];

/* A hardware thread: its program, where it is in it, and when it can next issue.
   It knows nothing about scheduling policy; policies only ask whether it is ready
   and tell it how many instructions they took from it. */
class HwThread {
  constructor(prog) {
    this.prog = prog; this.pc = 0; this.left = prog[0]; this.readyAt = 0; this.stall = null;
  }
  ready(c) { return this.readyAt <= c; }
  // Take k instructions from the current group in cycle c.
  take(k, c) {
    this.left -= k;
    if (this.left === 0) this.finishGroup(c);
  }
  // The group is done: move to the next one, honouring a stall token if there is one.
  finishGroup(c) {
    let pc = (this.pc + 1) % this.prog.length;
    let readyAt = c + 1, stall = null;
    const tok = this.prog[pc];
    if (typeof tok === "object") {
      const k = tok.miss != null ? tok.miss : tok.wait;
      readyAt = c + 1 + k;
      stall = tok.miss != null ? "miss" : "wait";
      pc = (pc + 1) % this.prog.length;
    }
    this.pc = pc; this.left = this.prog[pc]; this.readyAt = readyAt; this.stall = stall;
  }
}

/* An issue policy decides, cycle by cycle, which threads fill the core's slots.
   The four schemes differ only in `fill`; everything else (the grid, the waste
   counts) is shared, so a fifth scheme is one more subclass and one table entry. */
class IssuePolicy {
  static usesOneThread = false;
  constructor(threads, width) { this.threads = threads; this.width = width; this.switchCycles = []; }
  issue(i, k, col, c) {
    for (let j = 0; j < k; j++) col.push(i);
    this.threads[i].take(k, c);
  }
  // Fill `col` with the ids of the threads that issue in cycle c.
  fill(c, col) { throw new Error("IssuePolicy.fill is abstract"); }
}

// One thread, as wide as its ready group allows.
class Superscalar extends IssuePolicy {
  static usesOneThread = true;
  fill(c, col) {
    const th = this.threads[0];
    if (th.ready(c)) this.issue(0, Math.min(this.width, th.left), col, c);
  }
}

// Switch after every cycle, round robin, skipping stalled threads.
class FineGrained extends IssuePolicy {
  last = -1;
  fill(c, col) {
    const T = this.threads.length;
    for (let off = 0; off < T; off++) {
      const i = (this.last + 1 + off) % T;
      if (this.threads[i].ready(c)) { this.issue(i, Math.min(this.width, this.threads[i].left), col, c); this.last = i; return; }
    }
  }
}

// Stay on one thread; switch only when it waits on a miss, and pay for the switch.
class CoarseGrained extends IssuePolicy {
  cur = 0; switchUntil = -1;
  constructor(threads, width, { switchPenalty = 1 } = {}) { super(threads, width); this.switchPenalty = switchPenalty; }
  fill(c, col) {
    if (c < this.switchUntil) { this.switchCycles.push(c); return; }
    const th = this.threads[this.cur];
    if (th.ready(c)) { this.issue(this.cur, Math.min(this.width, th.left), col, c); return; }
    if (th.stall !== "miss") return;   // short stalls are not worth a switch
    const T = this.threads.length;
    for (let off = 1; off < T; off++) {
      const j = (this.cur + off) % T;
      if (!this.threads[j].ready(c)) continue;
      this.cur = j;
      this.switchUntil = c + this.switchPenalty;
      if (this.switchPenalty === 0) this.issue(j, Math.min(this.width, this.threads[j].left), col, c);
      else this.switchCycles.push(c);
      return;
    }
  }
}

// Fill the cycle's slots from every ready thread, priority rotating.
class Smt extends IssuePolicy {
  fill(c, col) {
    const T = this.threads.length;
    let free = this.width;
    for (let off = 0; off < T && free > 0; off++) {
      const i = (c + off) % T;
      if (!this.threads[i].ready(c)) continue;
      const k = Math.min(free, this.threads[i].left);
      this.issue(i, k, col, c);
      free -= k;
    }
  }
}

const ISSUE_POLICIES = { superscalar: Superscalar, fine: FineGrained, coarse: CoarseGrained, smt: Smt };
export const ISSUE_TECHNIQUES = Object.keys(ISSUE_POLICIES);

export function issueSchedule(technique, {
  programs = ISSUE_PROGRAMS, threads = 4, width = 4, cycles = 16, switchPenalty = 1,
} = {}) {
  const Policy = ISSUE_POLICIES[technique];
  if (!Policy) throw new Error("unknown technique: " + technique);
  const T = Policy.usesOneThread ? 1 : Math.min(threads, programs.length);
  const policy = new Policy(programs.slice(0, T).map((prog) => new HwThread(prog)), width, { switchPenalty });

  const grid = [];
  for (let c = 0; c < cycles; c++) {
    const col = [];
    policy.fill(c, col);
    while (col.length < width) col.push(null);
    grid.push(col);
  }
  return { grid, switchCycles: policy.switchCycles, ...slotStats(grid, width, programs.length) };
}

/* Two kinds of unused slot: every slot of a cycle in which nothing issued, and the
   slots left over in a cycle that issued something. Multithreading attacks the
   first kind; only issuing from several threads in one cycle attacks the second. */
function slotStats(grid, width, nThreads) {
  const cycles = grid.length;
  let filled = 0, wasteEmptyCycles = 0, wasteLeftover = 0, maxThreadsPerCycle = 0;
  const perThread = Array.from({ length: nThreads }, () => 0);
  for (const col of grid) {
    const used = col.filter((v) => v !== null);
    filled += used.length;
    if (used.length === 0) wasteEmptyCycles += width; else wasteLeftover += width - used.length;
    maxThreadsPerCycle = Math.max(maxThreadsPerCycle, new Set(used).size);
    for (const v of used) perThread[v] += 1;
  }
  return { filled, utilization: filled / (width * cycles), ipc: filled / cycles, maxThreadsPerCycle, perThread,
           wasteEmptyCycles, wasteLeftover };
}

/* ---- the race on x += my_val (note 04, book §2.4.3) ----
   Each thread runs compute, load, add, store; with the lock, lock and unlock
   bracket the three memory steps. The book's numbers: x starts at 0, thread 0
   computes 7 and thread 1 computes 19, so the right answer is 26. */

export const RACE_OPS = ["compute", "load", "add", "store"];
export const RACE_OPS_LOCKED = ["compute", "lock", "load", "add", "store", "unlock"];

export function raceInit({ x0 = 0, vals = [7, 19], useLock = false } = {}) {
  return {
    x: x0, x0, lock: null, useLock,
    threads: vals.map((val) => ({ val, pc: 0, reg: null, myVal: null, done: false })),
    log: [],
  };
}

export const raceOps = (s) => (s.useLock ? RACE_OPS_LOCKED : RACE_OPS);

export function raceNextOp(s, tid) {
  const th = s.threads[tid];
  return th.done ? null : raceOps(s)[th.pc];
}

export function raceCanStep(s, tid) {
  const op = raceNextOp(s, tid);
  if (op === null) return false;
  return !(op === "lock" && s.lock !== null && s.lock !== tid);
}

export function raceStep(s, tid) {
  if (!raceCanStep(s, tid)) return s;
  const threads = s.threads.map((t) => ({ ...t }));
  const th = threads[tid];
  const op = raceOps(s)[th.pc];
  let { x, lock } = s;
  if (op === "compute") th.myVal = th.val;
  else if (op === "lock") lock = tid;
  else if (op === "load") th.reg = x;
  else if (op === "add") th.reg = th.reg + th.myVal;
  else if (op === "store") x = th.reg;
  else if (op === "unlock") lock = null;
  th.pc += 1;
  th.done = th.pc === raceOps(s).length;
  const entry = { tid, op, x, reg: th.reg, myVal: th.myVal };
  return { ...s, x, lock, threads, log: [...s.log, entry] };
}

export function raceRun(s, order) {
  return order.reduce((acc, tid) => raceStep(acc, tid), s);
}

/* The update is lost exactly when the two load..store windows overlap: each thread
   loads x before the other has stored it. That is decided at the second load, long
   before the final store makes it visible, so the stepper can say so at that moment. */
export function raceDoomed(s) {
  const at = (tid, op) => { const i = s.log.findIndex((e) => e.tid === tid && e.op === op); return i < 0 ? Infinity : i; };
  const l0 = at(0, "load"), l1 = at(1, "load"), s0 = at(0, "store"), s1 = at(1, "store");
  return l0 !== Infinity && l1 !== Infinity && l0 < s1 && l1 < s0;
}

// Small seeded PRNG so a "random order" run is reproducible in tests.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A fair random scheduler: at every step, each thread that can move is equally likely.
export function raceRandomRun(opts = {}, rng = Math.random) {
  let s = raceInit(opts);
  for (;;) {
    const movable = s.threads.map((_, i) => i).filter((i) => raceCanStep(s, i));
    if (!movable.length) return s;
    s = raceStep(s, movable[Math.floor(rng() * movable.length)]);
  }
}

/* The exact probability that the fair random scheduler loses an update. It is not
   60/70: that fraction counts interleavings as equally likely, and a coin-flip
   scheduler does not produce them equally often (it reaches the serial orders, for
   instance, with probability 1/16 each rather than 1/70). */
export function raceFailureProbability(opts = {}) {
  const start = raceInit(opts);
  const expected = start.x0 + start.threads.reduce((a, t) => a + t.val, 0);
  return (function P(s) {
    const movable = s.threads.map((_, i) => i).filter((i) => raceCanStep(s, i));
    if (!movable.length) return s.x !== expected ? 1 : 0;
    return movable.reduce((a, i) => a + P(raceStep(s, i)), 0) / movable.length;
  })(start);
}

export function raceEnumerate(opts = {}) {
  const outcomes = {};
  let total = 0;
  (function walk(s) {
    const movable = s.threads.map((_, i) => i).filter((i) => raceCanStep(s, i));
    if (movable.length === 0) {
      if (s.threads.every((t) => t.done)) { total += 1; outcomes[s.x] = (outcomes[s.x] || 0) + 1; }
      return;
    }
    for (const i of movable) walk(raceStep(s, i));
  })(raceInit(opts));
  return { total, outcomes };
}

/* ---- cache coherence walkthrough (note 03, slide 34 and book §2.3.5) ----
   x = 2 is shared; y0 is core 0's, y1 and z1 are core 1's. Caches are
   write-back, and the protocols are write-invalidate. A line is I (no valid
   copy), S (a clean copy) or M (a dirty copy, newer than memory). Four cores,
   although only two touch x: with two, a broadcast and a targeted message look
   the same. */

export const COHERENCE_PROGRAM = [
  [{ core: 0, op: "read", dst: "y0", mul: 1, text: "y0 = x;" },
   { core: 1, op: "read", dst: "y1", mul: 3, text: "y1 = 3*x;" }],
  [{ core: 0, op: "write", value: 7, text: "x = 7;" },
   { core: 1, op: "other", text: "(not involving x)" }],
  [{ core: 0, op: "other", text: "(not involving x)" },
   { core: 1, op: "read", dst: "z1", mul: 4, text: "z1 = 4*x;" }],
];

/* A set of private write-back caches over one memory. Reads that hit and writes to
   the writer's own line work the same under every protocol; the protocols differ
   in exactly two decisions, which subclasses override (template method):
     missFetch(core)         where a read miss gets its value, and who hears about it
     invalidateOthers(core)  whom a write tells, and whose copies it invalidates
   The defaults are "no protocol": misses read memory, which may be stale, and a
   write tells nobody. */
class CacheSystem {
  constructor(cores, x0) {
    this.memory = x0;
    this.caches = Array.from({ length: cores }, () => ({ state: "I", value: null }));
  }
  others(core) { return this.caches.map((_, i) => i).filter((i) => i !== core); }
  read(core) {
    const line = this.caches[core];
    if (line.state !== "I") return { hit: true, value: line.value, from: "cache", seenBy: [] };
    const { value, from, seenBy } = this.missFetch(core);
    this.caches[core] = { state: "S", value };
    return { hit: false, value, from, seenBy };
  }
  write(core, value) {
    const seenBy = this.invalidateOthers(core);
    this.caches[core] = { state: "M", value };
    return { value, seenBy };
  }
  missFetch(core) { return { value: this.memory, from: "memory", seenBy: [] }; }
  invalidateOthers(core) { return []; }
  directorySnapshot() { return { sharers: [], owner: null }; }
  // A core holding the line modified supplies it; memory is updated on the way.
  supplyFrom(owner) {
    const value = this.caches[owner].value;
    this.memory = value;
    this.caches[owner].state = "S";
    return value;
  }
  invalidate(i) { if (this.caches[i].state !== "I") this.caches[i] = { state: "I", value: this.caches[i].value }; }
}

class NoProtocol extends CacheSystem {}

// Every miss and every write is broadcast; every other core snoops it.
class Snooping extends CacheSystem {
  missFetch(core) {
    const seenBy = this.others(core);
    const owner = this.caches.findIndex((l) => l.state === "M");
    if (owner >= 0) return { value: this.supplyFrom(owner), from: "core " + owner, seenBy };
    return { value: this.memory, from: "memory", seenBy };
  }
  invalidateOthers(core) {
    const seenBy = this.others(core);
    seenBy.forEach((i) => this.invalidate(i));
    return seenBy;
  }
}

// A directory entry records the sharers and the owner; messages go only to them.
class Directory extends CacheSystem {
  sharers = []; owner = null;
  missFetch(core) {
    let result = { value: this.memory, from: "memory", seenBy: [] };
    if (this.owner !== null && this.owner !== core) {
      const o = this.owner;
      result = { value: this.supplyFrom(o), from: "core " + o, seenBy: [o] };
      this.owner = null;
    }
    this.sharers = [...new Set([...this.sharers, core])].sort((a, b) => a - b);
    return result;
  }
  invalidateOthers(core) {
    const seenBy = this.sharers.filter((i) => i !== core);
    seenBy.forEach((i) => this.invalidate(i));
    this.sharers = [core]; this.owner = core;
    return seenBy;
  }
  directorySnapshot() { return { sharers: [...this.sharers], owner: this.owner }; }
}

const PROTOCOLS = { none: NoProtocol, snoop: Snooping, directory: Directory };
export const COHERENCE_MODES = Object.keys(PROTOCOLS);

export function coherenceWalk(mode, { cores = 4, x0 = 2 } = {}) {
  const Protocol = PROTOCOLS[mode];
  if (!Protocol) throw new Error("unknown protocol: " + mode);
  const sys = new Protocol(cores, x0);
  const vars = {};
  return COHERENCE_PROGRAM.map((row, t) => {
    const events = row.map((ins) => {
      const ev = { core: ins.core, op: ins.op, text: ins.text, hit: null, value: null, seenBy: [], from: null };
      if (ins.op === "read") {
        const r = sys.read(ins.core);
        vars[ins.dst] = ins.mul * r.value;
        return { ...ev, ...r };
      }
      if (ins.op === "write") return { ...ev, ...sys.write(ins.core, ins.value) };
      return ev;
    });
    return {
      t, events, memory: sys.memory,
      caches: sys.caches.map((l) => ({ ...l })),
      directory: sys.directorySnapshot(),
      vars: { ...vars },
    };
  });
}

/* ---- tree-structured sums (note 01's global sum, note 04's local arrays) ----
   Round r pairs thread i with thread i + 2^(r-1) for every i divisible by 2^r; the
   higher-numbered one sends and the lower one adds. Works for any p, not only
   powers of two (a thread with no partner that round just waits). */
export function treeSum(values) {
  const v = values.slice();
  const rounds = [];
  for (let step = 1; step < v.length; step *= 2) {
    const round = [];
    for (let i = 0; i + step < v.length; i += 2 * step) {
      v[i] += v[i + step];
      round.push({ from: i + step, to: i, sum: v[i] });
    }
    rounds.push(round);
  }
  return { rounds, total: v[0] };
}

// Receives (= additions) done by core 0: every other core's value naively, one per round in the tree.
export function masterWork(p) {
  let r = 0;
  while ((1 << r) < p) r++;
  return { naive: p - 1, tree: r };
}

// The naive collection from L1: core 0 receives and adds every other core's value, one after another.
export function naiveSum(values) {
  let acc = values[0];
  const steps = values.slice(1).map((v, j) => { acc += v; return { from: j + 1, to: 0, sum: acc }; });
  return { steps, total: acc };
}

/* ---- performance (note 06, L6 slides 5-6 and 16-20, book §2.6.1 and §2.6.4) ---- */

/* The deck's four-processor pictures. Each core does `work[i]` units of the original
   problem and then `sync` units of overhead; the run ends when the last core does, so
   every other core idles until then. Returns the book's quantities: S = Tserial/Tpar,
   E = S/p, and the split of each core's Tpar into useful work, overhead and idle.
   E * Tpar is the average useful time per core, which is exactly Tserial/p when the
   work adds up to Tserial (book §2.6.1). */
export const OVERHEAD_SCENARIOS = {
  perfect:   { label: "Perfect", work: [25, 25, 25, 25], sync: 0 },
  sync:      { label: "Sync cost", work: [25, 25, 25, 25], sync: 10 },
  imbalance: { label: "Load imbalance", work: [30, 20, 40, 10], sync: 0 },
  both:      { label: "Imbalance + sync", work: [30, 20, 40, 10], sync: 10 },
};

export function overheadRun({ serial = 100, work, sync = 0 }) {
  const p = work.length;
  const busy = work.map((w) => w + sync);
  const tpar = Math.max(...busy);
  const S = serial / tpar, E = S / p;
  const cores = work.map((w, i) => ({ useful: w, overhead: sync, idle: tpar - busy[i] }));
  const usefulAvg = work.reduce((a, b) => a + b, 0) / p;
  return { p, serial, tpar, S, E, cores, usefulAvg, lostAvg: tpar - usefulAvg };
}

/* Stopwatch vs CPU clock for a threaded region. Each thread runs `user` seconds of its
   own code and `sys` seconds in the kernel on its own core; thread i may also block
   (sleep, e.g. waiting for a message) for `wait[i]` seconds, which costs wall-clock time
   but no CPU time. `time prog` reports real = the wall clock, and user/sys summed over
   threads; clock() reports user + sys summed over threads (slide 20). */
export function timingRun({ threads = 4, user = 2, sys = 0.25, wait = [] }) {
  const t = Array.from({ length: threads }, (_, i) => ({ user, sys, wait: wait[i] || 0 }));
  const finish = t.map((x) => x.user + x.sys + x.wait);
  const real = Math.max(...finish);
  const userSum = threads * user, sysSum = threads * sys;
  return { threads: t, finish, real, user: userSum, sys: sysSum, clock: userSum + sysSum };
}
