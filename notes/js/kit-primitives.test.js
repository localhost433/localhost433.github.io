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
  "export function Mcq",
  "export function mcq",
];

for (const sig of EXPECTED) {
  test(`_kit.jsx exports: ${sig}`, () => {
    assert.ok(src.includes(sig), `missing primitive export: ${sig}`);
  });
}

// Note 11 mini-VM: JVM runtime-area cell factories + custom-segment support.
const JVM_KIT = [
  "export const methodArea = mkCell(\"method\")",
  "export const opstack = mkCell(\"opstack\")",
  "export const pcreg = mkCell(\"pc\")",
];
for (const sig of JVM_KIT) {
  test(`_kit.jsx exports JVM factory: ${sig}`, () => {
    assert.ok(src.includes(sig), `missing JVM factory: ${sig}`);
  });
}

test("MemoryModel accepts a custom segment set + active glow", () => {
  assert.ok(src.includes("const baseSegs = segments || SEGMENTS"),
    "MemoryModel must derive segs from an optional `segments` override");
  assert.ok(src.includes("mm-seg--active"),
    "MemoryModel must emit the active-region class");
  assert.ok(src.includes("!segments && segs.some"),
    "the C++ stack/heap gap band must be suppressed for custom segments");
});
