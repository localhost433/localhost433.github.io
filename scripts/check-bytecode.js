#!/usr/bin/env node
/*
 * The bytecode columns in the Java demos claim to be REAL `javap -c` output.
 * This proves it: compile demos/bytecode/*.java, run javap -c, and assert every
 * opcode line embedded in the demo .jsx still matches, in order.
 *
 * Run: npm run check:bytecode      (skips cleanly when no JDK is installed)
 */
"use strict";

const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DEMOS = path.join(ROOT, "notes/courses/CSCI-UA-470/demos");
const SRC = path.join(DEMOS, "bytecode");

// Which method's Code block each demo's bytecode column is cut from.
const CASES = [
  { java: "Calc.java", cls: "Calc", method: "int add(int, int);", jsx: "jvm-operand-stack.jsx" },
  { java: "Dispatch.java", cls: "Demo", method: "public static void main(java.lang.String[]);", jsx: "java-dispatch.jsx" },
];

const have = (bin) => spawnSync(bin, ["-version"], { stdio: "ignore" }).status === 0;
if (!have("javac") || !have("javap")) {
  console.log("SKIP check:bytecode — no JDK on this machine (javac/javap not found).");
  process.exit(0);
}

// "  9: invokevirtual #10        // Method Shape.draw:()V"
//   -> "9: invokevirtual #10 // Method Shape.draw:()V"
const INSTR = /^\s*\d+:\s/;
const norm = (s) => s.trim().replace(/\s+/g, " ");

// The instruction lines of ONE method's Code block in `javap -c` output.
function realInstructions(out, method) {
  const lines = out.split("\n");
  const start = lines.findIndex((l) => norm(l) === norm(method));
  if (start < 0) throw new Error(`javap output has no method "${method}"`);
  const body = [];
  for (const l of lines.slice(start + 1)) {
    if (INSTR.test(l)) body.push(norm(l));
    else if (body.length && norm(l) !== "" && !/^\s*Code:/.test(l)) break; // next member
  }
  return body;
}

// The instruction lines the demo embeds, from its `const asm = \`...\`` literal.
function embeddedInstructions(jsx) {
  const m = /const asm\s*=\s*`([\s\S]*?)`/.exec(jsx);
  if (!m) throw new Error("demo has no `const asm = \\`...\\`` block");
  return m[1].split("\n").filter((l) => INSTR.test(l)).map(norm);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "javap-"));
let failed = 0;

for (const c of CASES) {
  execFileSync("javac", ["-d", tmp, path.join(SRC, c.java)], { stdio: "pipe" });
  const out = execFileSync("javap", ["-c", "-classpath", tmp, c.cls], { encoding: "utf8" });

  const real = realInstructions(out, c.method);
  const embedded = embeddedInstructions(fs.readFileSync(path.join(DEMOS, c.jsx), "utf8"));

  if (real.join("\n") === embedded.join("\n")) {
    console.log(`OK   ${c.jsx} — ${embedded.length} opcodes match javap -c ${c.cls}`);
  } else {
    failed++;
    console.error(`FAIL ${c.jsx} — bytecode column has drifted from ${c.java}`);
    console.error(`  real (javap -c ${c.cls}, "${c.method}"):`);
    for (const l of real) console.error(`    ${l}`);
    console.error("  embedded in the demo:");
    for (const l of embedded) console.error(`    ${l}`);
  }
}

fs.rmSync(tmp, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
