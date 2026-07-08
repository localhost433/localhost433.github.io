const test = require("node:test");
const assert = require("node:assert/strict");
const R = require("./engine/resume.js");

const state = { current: 3, remaining: 1800, work: [
  { qi: 5, optOrder: [1,0,2,3], answer: 2, flagged: true },
  { qi: 1, optOrder: [0,1], answer: null, flagged: false } ] };

test("progressKey namespaces by id", () => {
  assert.equal(R.progressKey("midterm-3"), "exam:midterm-3:progress");
});
test("serialize -> deserialize round-trips state", () => {
  const back = R.deserializeProgress(R.serializeProgress(state));
  assert.deepEqual(back, state);
});
test("deserializeProgress returns null on garbage", () => {
  assert.equal(R.deserializeProgress("not json"), null);
  assert.equal(R.deserializeProgress(JSON.stringify({ nope: 1 })), null);
});
test("hasResumable is true only when an answer or flag exists", () => {
  assert.equal(R.hasResumable(R.serializeProgress(state)), true);
  const fresh = { current: 0, remaining: 4500, work: [{ qi:0, optOrder:[0,1], answer:null, flagged:false }] };
  assert.equal(R.hasResumable(R.serializeProgress(fresh)), false);
});
test("deserializeProgress returns null (does not throw) when a work entry is not an object", () => {
  assert.doesNotThrow(() => {
    assert.equal(R.deserializeProgress(JSON.stringify({ current: 0, remaining: 10, work: [null] })), null);
  });
});

const questions = [{ options: [{}, {}] }, { options: [{}, {}, {}] }];

test("isCompatible is true for a state that matches the current question bank", () => {
  const s = { current: 0, work: [{ qi: 0, optOrder: [0,1], answer: 1, flagged: false }] };
  assert.equal(R.isCompatible(s, questions), true);
});
test("isCompatible is false when current is out of range for work.length", () => {
  const s = { current: 1, work: [{ qi: 0, optOrder: [0,1], answer: null, flagged: false }] };
  assert.equal(R.isCompatible(s, questions), false);
});
test("isCompatible is false when work[0].qi is out of range for questions", () => {
  const s = { current: 0, work: [{ qi: 5, optOrder: [0,1], answer: null, flagged: false }] };
  assert.equal(R.isCompatible(s, questions), false);
});
test("isCompatible is false when work[0].optOrder.length mismatches questions[qi].options.length", () => {
  const s = { current: 0, work: [{ qi: 1, optOrder: [0,1], answer: null, flagged: false }] };
  assert.equal(R.isCompatible(s, questions), false);
});
