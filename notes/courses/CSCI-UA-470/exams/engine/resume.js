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
    if (typeof w.qi !== "number" || !Array.isArray(w.optOrder)) return null;
  }
  return { current:o.current, remaining:o.remaining,
    work:o.work.map((w)=>({ qi:w.qi, optOrder:w.optOrder, answer:(w.answer==null?null:w.answer), flagged:!!w.flagged })) };
}
function hasResumable(json){
  const s = deserializeProgress(json);
  return !!s && s.work.some((w) => w.answer != null || w.flagged);
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { progressKey, serializeProgress, deserializeProgress, hasResumable };
}
