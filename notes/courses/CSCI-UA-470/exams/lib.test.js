// notes/courses/CSCI-UA-470/exams/lib.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const { validateExam, inlineExam } = require("./lib.js");

const goodQ = { type: "concept", prose: true, prompt: "P?", options: [
  { text: "a", correct: true, why: "y" }, { text: "b", correct: false, why: "n" } ] };
const goodData = { meta: { title: "T", out: "midterm/x.html", id: "x", minutes: 75,
  shuffleQuestions: true, shuffleOptions: true, introHtml: "<p>hi</p>" }, questions: [goodQ] };

test("validateExam accepts a well-formed exam", () => {
  assert.deepEqual(validateExam(goodData), { ok: true });
});
test("validateExam rejects a question with no correct option", () => {
  const bad = { ...goodData, questions: [{ ...goodQ,
    options: [{ text: "a", correct: false, why: "n" }, { text: "b", correct: false, why: "n" }] }] };
  assert.throws(() => validateExam(bad), /exactly one correct/);
});
test("validateExam rejects two correct options", () => {
  const bad = { ...goodData, questions: [{ ...goodQ,
    options: [{ text: "a", correct: true, why: "y" }, { text: "b", correct: true, why: "y" }] }] };
  assert.throws(() => validateExam(bad), /exactly one correct/);
});
test("validateExam rejects missing meta.id", () => {
  const bad = { ...goodData, meta: { ...goodData.meta, id: "" } };
  assert.throws(() => validateExam(bad), /meta\.id/);
});

const SHELL = [
  "<title>__TITLE__</title>",
  "<script>",
  "window.EXAM = { dev:true }; /*__CONFIG__*/",
  "window.QUESTIONS = []; /*__QUESTIONS__*/",
  "/*__ENGINE_LIB__*/",
  "</script>",
].join("\n");

test("inlineExam fills all markers and leaves none", () => {
  const out = inlineExam({ shell: SHELL, engineLib: "function ok(){}", data: goodData });
  assert.match(out, /<title>T<\/title>/);
  assert.match(out, /window\.EXAM = \{"title":"T"/);
  assert.match(out, /window\.QUESTIONS = \[\{"type":"concept"/);
  assert.match(out, /function ok\(\)\{\}/);
  assert.doesNotMatch(out, /__[A-Z]+__/);
});
test("inlineExam throws when a marker is absent", () => {
  assert.throws(() => inlineExam({ shell: "<title>x</title>", engineLib: "", data: goodData }),
    /missing marker/);
});
test("inlineExam escapes </script> inside data to avoid breaking the tag", () => {
  const d = { ...goodData, questions: [{ ...goodQ, prompt: "</script> attack" }] };
  const out = inlineExam({ shell: SHELL, engineLib: "", data: d });
  assert.doesNotMatch(out, /<\/script> attack/);      // raw closer must be escaped
  assert.match(out, /<\\\/script> attack/);            // to <\/script>
});
