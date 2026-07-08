"use strict";
function isCorrect(w, QUESTIONS){
  if (w.answer == null) return false;
  const opt = QUESTIONS[w.qi].options[w.optOrder[w.answer]];
  return !!(opt && opt.correct === true);
}
function missedIndices(work, QUESTIONS){
  const out = [];
  work.forEach((w, i) => { if (!isCorrect(w, QUESTIONS)) out.push(i); });
  return out;
}
function buildRetryWork(work, missedIdx){
  return missedIdx.map((i) => ({ qi:work[i].qi, optOrder:work[i].optOrder.slice(), answer:null, flagged:false }));
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { isCorrect, missedIndices, buildRetryWork };
}
