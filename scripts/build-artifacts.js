#!/usr/bin/env node
/*
 * Pre-transpile artifact JSX → JS so the browser doesn't need to download or
 * run Babel at runtime. For each `*.jsx` under notes/artifacts/ and
 * notes/courses/<id>/demos/ this writes a sibling `*.js` (same Babel transform
 * the runtime host used to do). note.js prefers the `.js` and, when every piece
 * of an artifact is precompiled, the iframe host skips loading Babel entirely.
 *
 * Run:  npm install   (once, to get @babel/standalone)
 *       npm run build:artifacts
 * Commit the generated .js files. It's a no-op-safe optimisation: if the .js
 * are missing, the runtime falls back to fetching .jsx + Babel as before.
 */
"use strict";

const Babel = require("@babel/standalone");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const sources = [];

const globalKit = path.join(ROOT, "notes/artifacts/kit.jsx");
if (fs.existsSync(globalKit)) sources.push(globalKit);

const coursesDir = path.join(ROOT, "notes/courses");
if (fs.existsSync(coursesDir)) {
  for (const course of fs.readdirSync(coursesDir)) {
    const demos = path.join(coursesDir, course, "demos");
    if (!fs.existsSync(demos)) continue;
    for (const f of fs.readdirSync(demos)) {
      if (f.endsWith(".jsx")) sources.push(path.join(demos, f));
    }
  }
}

let n = 0;
for (const src of sources) {
  const code = fs.readFileSync(src, "utf8");
  const { code: out } = Babel.transform(code, {
    presets: ["react"],
    sourceType: "module",
    filename: path.basename(src),
  });
  const dst = src.replace(/\.jsx$/, ".js");
  const banner = "/* AUTO-GENERATED from " + path.basename(src) +
    " by `npm run build:artifacts` — do not edit. */\n";
  fs.writeFileSync(dst, banner + out);
  console.log("  " + path.relative(ROOT, src) + "  ->  " + path.relative(ROOT, dst));
  n++;
}
console.log("compiled " + n + " artifact file(s).");
