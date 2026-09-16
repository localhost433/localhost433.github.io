"use strict";
function progressKey(id){ return "exam:" + id + ":progress"; }

function serializeProgress(s){
  return JSON.stringify({
    current: s.current,
    remaining: s.remaining,
    work: s.work.map((w) => ({ qi:w.qi, optOrder:w.optOrder, answer:w.answer, flagged:!!w.flagged })),
  });
}
function deserializeProgress(json){
  let o; try { o = JSON.parse(json); } catch (_) { return null; }
  if (!o || !Array.isArray(o.work) || typeof o.remaining !== "number" || typeof o.current !== "number") return null;
  for (const w of o.work) {
    if (!w || typeof w !== "object") return null;
    if (typeof w.qi !== "number" || !Array.isArray(w.optOrder)) return null;
  }
  return { current:o.current, remaining:o.remaining,
    work:o.work.map((w)=>({ qi:w.qi, optOrder:w.optOrder, answer:(w.answer==null?null:w.answer), flagged:!!w.flagged })) };
}
function hasResumable(json){
  const s = deserializeProgress(json);
  return !!s && s.work.some((w) => w.answer != null || w.flagged);
}
// True only if a restored state is safe to render against the current questions.
function isCompatible(state, questions) {
  if (!state || !Array.isArray(questions)) return false;
  if (!Array.isArray(state.work)) return false;
  if (typeof state.current !== "number" || state.current < 0 || state.current >= state.work.length) return false;
  for (const w of state.work) {
    const q = questions[w.qi];
    if (!q || !Array.isArray(q.options)) return false;
    if (!Array.isArray(w.optOrder) || w.optOrder.length !== q.options.length) return false;
    for (const oi of w.optOrder) { if (typeof oi !== "number" || oi < 0 || oi >= q.options.length) return false; }
    if (w.answer != null && (typeof w.answer !== "number" || w.answer < 0 || w.answer >= w.optOrder.length)) return false;
  }
  return true;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { progressKey, serializeProgress, deserializeProgress, hasResumable, isCompatible };
}
