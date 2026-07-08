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

test("inlineExam throws when an unfilled comment marker remains in output", () => {
  // shell with a stray comment marker that no replacement fills
  const shell = [
    "<title>__TITLE__</title>",
    "<script>",
    "window.EXAM = {}; /*__CONFIG__*/",
    "window.QUESTIONS = []; /*__QUESTIONS__*/",
    "/*__ENGINE_LIB__*/",
    "/*__EXTRA__*/",
    "</script>",
  ].join("\n");
  assert.throws(() => inlineExam({ shell, engineLib: "", data: goodData }), /marker remains/);
});

test("inlineExam does not false-trip on bare __FILE__/__LINE__ tokens in question content", () => {
  // A C++ exam question may legitimately mention __FILE__, __LINE__, __cplusplus, etc.
  // These are not marker-comment syntax, so they must not trigger the leftover-marker guard.
  const d = { ...goodData, questions: [{ ...goodQ,
    prompt: "What does __FILE__ expand to? Also consider __LINE__ and __cplusplus." }] };
  assert.doesNotThrow(() => inlineExam({ shell: SHELL, engineLib: "function ok(){}", data: d }));
});

test("inlineExam inserts data containing $-substitution sequences literally", () => {
  const d = { ...goodData, questions: [{ ...goodQ, prompt: "cost is $$5 and $& and $1" }] };
  const out = inlineExam({ shell: SHELL, engineLib: "", data: d });
  // The literal text must survive JSON-encoded, not be mangled by $-substitution
  assert.ok(out.includes(JSON.stringify("cost is $$5 and $& and $1").slice(1, -1)));
});

test("inlineExam neutralizes </script> case-insensitively and repeatedly", () => {
  const d = { ...goodData, questions: [{ ...goodQ, prompt: "</SCRIPT> then </script> again" }] };
  const out = inlineExam({ shell: SHELL, engineLib: "", data: d });
  assert.doesNotMatch(out, /<\/script> again/i);
});
