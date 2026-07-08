const test = require("node:test");
const assert = require("node:assert/strict");
const V = require("./engine/review.js");

const QUESTIONS = [
  { options:[{text:"a",correct:true},{text:"b",correct:false}] },   // qi 0, correct display-idx depends on optOrder
  { options:[{text:"a",correct:false},{text:"b",correct:true}] },   // qi 1
];
// work[0]: optOrder identity, answered display 0 -> option a (correct) => right
// work[1]: optOrder identity, answered display 0 -> option a (incorrect) => wrong
const work = [
  { qi:0, optOrder:[0,1], answer:0, flagged:false },
  { qi:1, optOrder:[0,1], answer:0, flagged:false },
];

test("missedIndices flags wrong and unanswered", () => {
  assert.deepEqual(V.missedIndices(work, QUESTIONS), [1]);
  const withBlank = work.concat([{ qi:0, optOrder:[0,1], answer:null, flagged:false }]);
  assert.deepEqual(V.missedIndices(withBlank, QUESTIONS), [1, 2]);
});
test("buildRetryWork rebuilds only missed, cleared", () => {
  const retry = V.buildRetryWork(work, [1]);
  assert.equal(retry.length, 1);
  assert.equal(retry[0].qi, 1);
  assert.deepEqual(retry[0].optOrder, [0,1]);
  assert.equal(retry[0].answer, null);
  assert.equal(retry[0].flagged, false);
});
