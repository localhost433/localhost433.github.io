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

// SequenceOrderBuilder: the interactive drag-to-order exercise built on top of
// the existing SequenceDiagram renderer + the seq-order shared logic.
test("_kit.jsx exports the sequence-order builder", () => {
  assert.ok(src.includes("export function SequenceOrderBuilder"), "missing SequenceOrderBuilder");
  assert.ok(src.includes("export function sequenceOrder"), "missing sequenceOrder factory");
});
test("_kit.jsx imports the shared ordering logic", () => {
  assert.ok(/from\s+["']@course\/seq-order["']/.test(src), "must import from @course/seq-order");
});
test("SequenceOrderBuilder withholds activations until complete", () => {
  assert.ok(src.includes("placed.length === messages.length"),
    "activations must be gated on a fully-placed board");
});

// gradedChipState: the one grading→colour mapping shared by all three builders.
test("_kit.jsx exports the shared gradedChipState helper", () => {
  assert.ok(src.includes("export function gradedChipState"), "missing gradedChipState");
});

// ClassBoxBuilder: the note-14 build exercise — fill visibility + type slots in a
// three-compartment UML box and pick the relationship, on the real DiagramCard.
test("_kit.jsx exports the class-box builder", () => {
  assert.ok(src.includes("export function ClassBoxBuilder"), "missing ClassBoxBuilder");
  assert.ok(src.includes("export function classBuild"), "missing classBuild factory");
});
test("ClassBoxBuilder grades visibility, type, and relationship", () => {
  // the three graded dimensions the note drills: the vis mark, the type-after-colon,
  // and which relationship line joins the two boxes.
  assert.ok(/whyVis/.test(src) && /whyType/.test(src), "must surface per-part why on vis/type");
  assert.ok(/relationship/.test(src), "must grade the relationship kind");
});
test("ClassBoxBuilder omits the type slot for void operations (UML omits ': void')", () => {
  // ret == null models the lecture rule: no return type on constructors/void — so a
  // void operation must contribute no type slot, no bank token, and no colon in its row.
  assert.ok(/if \(m\.ret != null\) out\.push\(\{ id: `o\$\{i\}t`/.test(src),
    "a null-ret operation must not create a type slot");
  assert.ok(/operations\.filter\(\(o\) => o\.ret != null\)\.map\(\(o\) => o\.ret\)/.test(src),
    "a null-ret operation must not add a token to the type bank");
});

// UseCaseBuilder: the note-12 build exercise — drop elements inside/outside the
// system boundary, then connect actors to cases and cases to cases.
test("_kit.jsx exports the use-case builder", () => {
  assert.ok(src.includes("export function UseCaseBuilder"), "missing UseCaseBuilder");
  assert.ok(src.includes("export function useCaseBuild"), "missing useCaseBuild factory");
});
test("UseCaseBuilder drives the real UseCaseDiagram from placement + connections", () => {
  assert.ok(/UseCaseDiagram/.test(src), "must render a live UseCaseDiagram preview");
  assert.ok(/associations/.test(src) && /relations/.test(src), "must grade associations and relations");
});
test("UseCaseBuilder Reset clears only the current stage", () => {
  const uc = src.slice(src.indexOf("export function UseCaseBuilder"));
  const reset = uc.slice(uc.indexOf("const reset = () => {"));
  const body = reset.slice(0, reset.indexOf("\n  };") + 1);
  assert.ok(/if \(stage === "identify"\)/.test(body), "reset must branch on the current stage");
  assert.ok(!/setRevealedSet\(new Set\(\)\)/.test(body), "reset must not wipe every stage's revealed flag");
  assert.ok(!/setStage\(/.test(body), "reset must stay on the current stage, not jump back");
  assert.ok(/placeViaConnect/.test(body), "resetting Connect must roll back an auto-completed Place");
});
