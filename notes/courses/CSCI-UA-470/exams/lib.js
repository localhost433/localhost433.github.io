// notes/courses/CSCI-UA-470/exams/lib.js
"use strict";

function validateExam(data) {
  const m = data && data.meta;
  if (!m || !m.id) throw new Error("exam.meta.id is required");
  if (!m.title) throw new Error("exam.meta.title is required");
  if (!m.out) throw new Error("exam.meta.out is required");
  if (typeof m.minutes !== "number") throw new Error("exam.meta.minutes must be a number");
  if (!Array.isArray(data.questions) || data.questions.length === 0)
    throw new Error("exam.questions must be a non-empty array");
  data.questions.forEach((q, i) => {
    if (!q.prompt) throw new Error(`question ${i}: prompt required`);
    if (!Array.isArray(q.options) || q.options.length < 2)
      throw new Error(`question ${i}: needs >=2 options`);
    const correct = q.options.filter((o) => o.correct === true).length;
    if (correct !== 1) throw new Error(`question ${i}: exactly one correct option required (found ${correct})`);
    q.options.forEach((o, j) => {
      if (typeof o.text !== "string") throw new Error(`question ${i} option ${j}: text required`);
    });
  });
  return { ok: true };
}

// Serialize to JSON, then neutralize any literal "</script>" so inlining can't
// close the host <script> tag early.
function jsonForScript(value) {
  return JSON.stringify(value).replace(/<\/script>/gi, "<\\/script>");
}

function replaceMarkerLine(shell, marker, replacement) {
  const re = new RegExp("^.*" + marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ".*$", "m");
  if (!re.test(shell)) throw new Error("missing marker: " + marker);
  return shell.replace(re, () => replacement);
}

function inlineExam({ shell, engineLib, data }) {
  validateExam(data);
  const title = String(data.meta.title).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (!/<title>[\s\S]*?<\/title>/.test(shell)) throw new Error("missing marker: <title>");
  let out = shell.replace(/<title>[\s\S]*?<\/title>/, () => "<title>" + title + "</title>");
  out = replaceMarkerLine(out, "/*__CONFIG__*/", "window.EXAM = " + jsonForScript(data.meta) + ";");
  out = replaceMarkerLine(out, "/*__QUESTIONS__*/", "window.QUESTIONS = " + jsonForScript(data.questions) + ";");
  out = replaceMarkerLine(out, "/*__ENGINE_LIB__*/", engineLib);
  if (/\/\*__[A-Z_]+__\*\//.test(out)) throw new Error("unfilled marker remains after inlining");
  return out;
}

module.exports = { validateExam, inlineExam, jsonForScript };
