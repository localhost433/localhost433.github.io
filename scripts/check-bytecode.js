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

// The raw text of a demo's `const asm = \`...\`` literal (all lines, unfiltered).
function rawAsm(jsx) {
  const m = /const asm\s*=\s*`([\s\S]*?)`/.exec(jsx);
  if (!m) throw new Error("demo has no `const asm = \\`...\\`` block");
  return m[1];
}

// The instruction lines the demo embeds, from its `const asm = \`...\`` literal.
function embeddedInstructions(jsx) {
  return rawAsm(jsx).split("\n").filter((l) => INSTR.test(l)).map(norm);
}

// The embedded method-declaration line — by construction the non-blank line
// directly above the "Code:" marker (see the demos' `asm` literals: a `class`
// line, an elided-constructor row, the method declaration, then "Code:").
function embeddedMethodDecl(jsx) {
  const lines = rawAsm(jsx).split("\n");
  const codeIdx = lines.findIndex((l) => /^\s*Code:\s*$/.test(l));
  if (codeIdx < 1) throw new Error("demo's asm literal has no \"Code:\" marker");
  return norm(lines[codeIdx - 1]);
}

// Parse `const asmMap = { ... };` out of the .jsx source WITHOUT executing it —
// a regex over the object-literal text is enough: keys are line numbers, values
// are `[n, n, ...]` arrays of asm line numbers.
function parseAsmMap(jsx) {
  const m = /const asmMap\s*=\s*\{([\s\S]*?)\n\};/.exec(jsx);
  if (!m) throw new Error("demo has no `const asmMap = { ... };` block");
  const map = {};
  const entryRe = /(\d+):\s*\[([^\]]*)\]/g;
  let e;
  while ((e = entryRe.exec(m[1])) !== null) {
    map[e[1]] = e[2].split(",").map((s) => s.trim()).filter(Boolean).map(Number);
  }
  return map;
}

// Parse every per-step `line: N, asmLine: M` pairing (the two mechanisms live
// adjacent on the same step object in these demos), plus every standalone
// `asmLine: M` value (used as a fallback membership check if no pairs parse).
function parseStepAsmLines(jsx) {
  const pairs = [];
  const pairRe = /\bline:\s*(\d+)\s*,\s*asmLine:\s*(\d+)/g;
  let p;
  while ((p = pairRe.exec(jsx)) !== null) pairs.push({ line: Number(p[1]), asmLine: Number(p[2]) });
  const all = [];
  const allRe = /\basmLine:\s*(\d+)/g;
  let a;
  while ((a = allRe.exec(jsx)) !== null) all.push(Number(a[1]));
  return { pairs, all };
}

// The asmMap CONTRACT: every target line it (or a step's asmLine) points at must
// be a real instruction line in the demo's `asm` literal, and a step's own
// asmLine must agree with what asmMap says for that step's source line. Content
// equality (checked above) says nothing about this — it's what actually decides
// which rows the pane highlights. Returns a list of human-readable problems.
function checkAsmMapContract(jsx, jsxName) {
  const problems = [];
  const lines = rawAsm(jsx).split("\n");
  const N = lines.length;
  const isRealInstr = (n) => n >= 1 && n <= N && INSTR.test(lines[n - 1]);
  // One deliberate exception: a demo may map its Java method-signature source
  // line to the bytecode's OWN method-declaration row (e.g. jvm-operand-stack.jsx
  // maps "int add(int a, int b) {" -> "int add(int, int);"), pairing the two
  // signatures. That row isn't an instruction, but it's a real, addressable line
  // — unlike a blank line, an elision row, or the "class"/"Code:" structural rows.
  const codeIdx = lines.findIndex((l) => /^\s*Code:\s*$/.test(l));
  const declLine = codeIdx >= 1 ? codeIdx : -1; // 1-based index of the line just above "Code:"
  const isValidTarget = (n) => isRealInstr(n) || n === declLine;
  const describe = (n) => {
    if (n < 1 || n > N) return "out of range";
    if (isElisionLine(lines[n - 1])) return "an elision row";
    if (lines[n - 1].trim() === "") return "a blank line";
    return "not an instruction line or the method declaration (class/Code: structural row)";
  };

  const asmMap = parseAsmMap(jsx);
  const targets = []; // { srcLine, asmLine }
  for (const src of Object.keys(asmMap)) {
    for (const a of asmMap[src]) targets.push({ srcLine: Number(src), asmLine: a });
  }
  for (const t of targets) {
    if (!isValidTarget(t.asmLine)) {
      problems.push(`${jsxName}:asmMap[${t.srcLine}] -> asm line ${t.asmLine} is ${describe(t.asmLine)}`);
    }
  }

  const { pairs, all } = parseStepAsmLines(jsx);
  for (const a of all) {
    if (!isValidTarget(a)) problems.push(`${jsxName}: step asmLine ${a} is ${describe(a)}`);
  }

  if (pairs.length) {
    // (2), fully: each step's own asmLine must be a member of asmMap[that step's line].
    for (const { line, asmLine } of pairs) {
      const group = asmMap[line] || [];
      if (!group.includes(asmLine)) {
        problems.push(`${jsxName}: step "line: ${line}, asmLine: ${asmLine}" disagrees with asmMap[${line}] = [${group.join(", ")}]`);
      }
    }
  } else if (all.length) {
    // (2), fallback: no adjacent line/asmLine pair could be parsed, so only check
    // that every asmLine value appears SOMEWHERE in the union of asmMap's targets.
    const union = new Set(targets.map((t) => t.asmLine));
    for (const a of all) {
      if (!union.has(a)) problems.push(`${jsxName}: step asmLine ${a} is not a member of any asmMap target group`);
    }
  }

  return problems;
}

const isElisionLine = (ln) => /^\s*…/.test(ln);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "javap-"));
let failed = 0;

try {
  for (const c of CASES) {
    try {
      execFileSync("javac", ["-d", tmp, path.join(SRC, c.java)], { stdio: "pipe" });
      const out = execFileSync("javap", ["-c", "-classpath", tmp, c.cls], { encoding: "utf8" });

      const jsxSrc = fs.readFileSync(path.join(DEMOS, c.jsx), "utf8");
      const real = realInstructions(out, c.method);
      const embedded = embeddedInstructions(jsxSrc);

      let ok = true;

      if (real.join("\n") !== embedded.join("\n")) {
        ok = false;
        console.error(`FAIL ${c.jsx} — bytecode column has drifted from ${c.java}`);
        console.error(`  real (javap -c ${c.cls}, "${c.method}"):`);
        for (const l of real) console.error(`    ${l}`);
        console.error("  embedded in the demo:");
        for (const l of embedded) console.error(`    ${l}`);
      }

      // The method declaration itself (e.g. "int add(int, int);") is not an
      // instruction line, so the opcode comparison above never sees it — check
      // it separately against the real javap header for this case.
      const embeddedDecl = embeddedMethodDecl(jsxSrc);
      if (embeddedDecl !== norm(c.method)) {
        ok = false;
        console.error(`FAIL ${c.jsx} — method declaration has drifted from ${c.java}`);
        console.error(`  real:     ${norm(c.method)}`);
        console.error(`  embedded: ${embeddedDecl}`);
      }

      // The asmMap contract: every target it (or a step's asmLine) names must be
      // a real instruction row, and a step's own asmLine must agree with asmMap.
      const problems = checkAsmMapContract(jsxSrc, c.jsx);
      if (problems.length) {
        ok = false;
        console.error(`FAIL ${c.jsx} — asmMap contract violated:`);
        for (const p of problems) console.error(`    ${p}`);
      }

      if (ok) {
        console.log(`OK   ${c.jsx} — ${embedded.length} opcodes, method decl, and asmMap contract match javap -c ${c.cls}`);
      } else {
        failed++;
      }
    } catch (err) {
      failed++;
      console.error(`FAIL ${c.jsx} — ${err.message}`);
    }
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

process.exit(failed ? 1 : 0);
