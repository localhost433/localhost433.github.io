const test = require("node:test");
const assert = require("node:assert/strict");
const U = require("./artifact-utils.js");

test("parseArtifactInfo: bare", () => {
  assert.deepEqual(U.parseArtifactInfo("artifact"), { isArtifact: true, src: null });
});
test("parseArtifactInfo: leading/trailing space stays artifact", () => {
  assert.equal(U.parseArtifactInfo("artifact ").isArtifact, true);
});
test("parseArtifactInfo: unquoted src", () => {
  assert.deepEqual(U.parseArtifactInfo("artifact src=demos/quicksort.jsx"),
    { isArtifact: true, src: "demos/quicksort.jsx" });
});
test("parseArtifactInfo: quoted src with space", () => {
  assert.equal(U.parseArtifactInfo('artifact src="demos/a b.jsx"').src, "demos/a b.jsx");
});
test("parseArtifactInfo: non-artifact lang", () => {
  assert.equal(U.parseArtifactInfo("js").isArtifact, false);
  assert.equal(U.parseArtifactInfo("artifactx").isArtifact, false);
});
test("resolveArtifactSrc: builds path", () => {
  assert.equal(U.resolveArtifactSrc("CSCI-UA-310", "demos/q.jsx"),
    "/notes/courses/CSCI-UA-310/demos/q.jsx");
});
test("resolveArtifactSrc: strips leading slash", () => {
  assert.equal(U.resolveArtifactSrc("X", "/demos/q.jsx"), "/notes/courses/X/demos/q.jsx");
});
test("resolveArtifactSrc: rejects traversal", () => {
  assert.throws(() => U.resolveArtifactSrc("X", "../secret.jsx"));
});
test("scanBareSpecifiers: finds libs, ignores rel/url/reserved/kit", () => {
  const src = [
    "import { LineChart } from 'recharts';",
    'import * as d3 from "d3";',
    "import './local.js';",
    "import x from '../up.js';",
    "import y from 'https://esm.sh/thing';",
    "import React from 'react';",
    "import { createRoot } from 'react-dom/client';",
    "import { Card } from '@kit';",
    "import { X } from '@course';",
  ].join("\n");
  assert.deepEqual(U.scanBareSpecifiers(src).sort(), ["d3", "recharts"]);
});
test("scanBareSpecifiers: bare import without binding", () => {
  assert.deepEqual(U.scanBareSpecifiers("import 'katex';"), ["katex"]);
});
test("ensureDefaultExport: leaves existing default", () => {
  const s = "export default function App(){return null;}";
  assert.equal(U.ensureDefaultExport(s), s);
});
test("ensureDefaultExport: appends when missing", () => {
  const out = U.ensureDefaultExport("function App(){return null;}");
  assert.match(out, /export default \(typeof App/);
});
test("buildLibImports: maps to esm.sh with react externalized", () => {
  assert.deepEqual(U.buildLibImports(["recharts"]),
    { recharts: "https://esm.sh/recharts?external=react,react-dom" });
});
test("buildLibImports: empty", () => {
  assert.deepEqual(U.buildLibImports([]), {});
});
