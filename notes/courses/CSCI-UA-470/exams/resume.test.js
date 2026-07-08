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
