const test = require("node:test");
const assert = require("node:assert/strict");
const { buildOne, engineLibSource } = require("./build.js");

// A minimal, self-contained exam so this test does NOT depend on data/*.js
// (those are created in Task 6). buildOne reads the real shell + engine files.
const DATA = { meta: { title: "Build Test", out: "midterm/_buildtest.html", id: "buildtest",
  minutes: 10, shuffleQuestions: false, shuffleOptions: false, introHtml: "<p>t</p>" },
  questions: [{ type: "concept", prose: true, prompt: "P?",
    options: [{ text: "a", correct: true, why: "y" }, { text: "b", correct: false, why: "n" }] }] };

test("engineLibSource concatenates both engine modules", () => {
  const src = engineLibSource();
  assert.match(src, /function serializeProgress/);
  assert.match(src, /function buildRetryWork/);
});
test("buildOne produces self-contained html with no disallowed external urls", () => {
  const html = buildOne(DATA);
  assert.match(html, /window\.QUESTIONS = \[/);
  assert.doesNotMatch(html, /__[A-Z]+__/);
  const ext = (html.match(/https?:\/\/[^"')\s]+/g) || [])
    .filter((u) => !/fonts\.(googleapis|gstatic)\.com/.test(u));
  assert.deepEqual(ext, []);
});
