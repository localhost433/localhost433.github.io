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

// Java ↔ bytecode pane: the javap tokenizer + the pane's target-language prop.
test("_kit.jsx defines a bytecode tokenizer", () => {
  assert.ok(src.includes("function highlightBytecode"),
    "missing highlightBytecode tokenizer");
  assert.ok(src.includes("BYTECODE_OPS"),
    "highlightBytecode must classify opcodes from a mnemonic set");
  assert.ok(src.includes('lang === "bytecode"'),
    "highlight() must route lang=bytecode to highlightBytecode");
});

test("CodeAsmPane accepts a target language + a per-step target-line override", () => {
  assert.ok(src.includes('asmLang = "asm"'),
    "CodeAsmPane must take asmLang, defaulting to asm (C++ demos unchanged)");
  assert.ok(src.includes("activeAsmLine"),
    "CodeAsmPane must accept activeAsmLine to override the asmMap-derived group");
  assert.ok(src.includes("SRC_LABEL"),
    "the left header must derive from `lang`, not be hardcoded to C++");
  assert.ok(!src.includes('{column("C++"'),
    "the hardcoded C++ column header must be gone");
  assert.ok(src.includes("st.asmLine"),
    "MemoryScene's nav map must index step.asmLine so clicking an opcode jumps to its step");
});

// note.js registers the seq-order-logic.mjs shared module as an iframe import.
const NOTE_JS = path.join(__dirname, "note.js");
const noteSrc = fs.readFileSync(NOTE_JS, "utf8");

test("note.js registers @course/seq-order as an iframe module", () => {
  assert.ok(noteSrc.includes("@course/seq-order"),
    "gatherSharedLayers must register the seq-order logic module");
  assert.ok(noteSrc.includes("seq-order-logic.mjs"),
    "must fetch the seq-order-logic.mjs source");
});

// Shared build-exercise UI helpers (Chip, BuilderControls, useTapOrDrag) used
// by the UML "build from scratch" demos.
const BEX = ["export function Chip", "export function BuilderControls", "export function useTapOrDrag"];
for (const sig of BEX) {
  test(`_kit.jsx exports build-exercise helper: ${sig}`, () => {
    assert.ok(src.includes(sig), `missing helper export: ${sig}`);
  });
}
