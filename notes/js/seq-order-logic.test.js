"use strict";
const { test, before } = require("node:test");
const assert = require("node:assert");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

// The module under test is ESM (.mjs); this test file is CJS, so load it via
// dynamic import() in a `before` hook. (`before` is the standalone node:test
// hook — NOT `test.before`, which is not part of the API.)
const MOD = pathToFileURL(path.join(__dirname, "seq-order-logic.mjs")).href;
let L;
before(async () => { L = await import(MOD); });

test("seededShuffle is deterministic for a given seed", () => {
  const a = L.seededShuffle([1, 2, 3, 4, 5], 42);
  const b = L.seededShuffle([1, 2, 3, 4, 5], 42);
  assert.deepStrictEqual(a, b);
});

test("seededShuffle does not mutate input and is a permutation", () => {
  const input = ["a", "b", "c", "d"];
  const out = L.seededShuffle(input, 7);
  assert.deepStrictEqual(input, ["a", "b", "c", "d"]);            // untouched
  assert.deepStrictEqual([...out].sort(), ["a", "b", "c", "d"]);  // same multiset
});

test("different seeds can produce different orders", () => {
  const a = L.seededShuffle([1, 2, 3, 4, 5, 6, 7, 8], 1);
  const b = L.seededShuffle([1, 2, 3, 4, 5, 6, 7, 8], 2);
  assert.notDeepStrictEqual(a, b);
});

test("gradeOrder marks each slot correct/incorrect by position", () => {
  const correct = ["m1", "m2", "m3"];
  const res = L.gradeOrder(["m1", "m3", "m2"], correct);
  assert.deepStrictEqual(res.map((r) => r.ok), [true, false, false]);
  assert.deepStrictEqual(res.map((r) => r.index), [0, 1, 2]);
});

test("gradeOrder handles a partially-filled board", () => {
  const res = L.gradeOrder(["m1"], ["m1", "m2", "m3"]);
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].ok, true);
});

test("hashSeed is stable and numeric", () => {
  assert.strictEqual(L.hashSeed("m1m2m3"), L.hashSeed("m1m2m3"));
  assert.strictEqual(typeof L.hashSeed("x"), "number");
});
