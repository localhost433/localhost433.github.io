"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const KIT = path.join(__dirname, "..", "courses", "CSCI-UA-470", "demos", "_kit.jsx");
const src = fs.readFileSync(KIT, "utf8");

// The four-primitive foundation must stay exported from the kit. This guards
// against accidental deletion/rename during refactors. (Knob = KnobBar,
// Predict = PredictGate + Verdict, Why = WhyDot + WhyNotes. Fade is deferred.)
const EXPECTED = [
  "export function KnobBar",
  "export function PredictGate",
  "export function Verdict",
  "export function WhyDot",
  "export function WhyNotes",
];

for (const sig of EXPECTED) {
  test(`_kit.jsx exports: ${sig}`, () => {
    assert.ok(src.includes(sig), `missing primitive export: ${sig}`);
  });
}
