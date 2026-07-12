import React from "react";
import { DiagramSvg, DiagramBox, CompareCaption } from "@course";

/* L11 — the SAME computation, two machine models, so "register-based vs
   stack-based" is SHOWN rather than asserted. Both sides compute a + b with
   a = 5, b = 7 → 12.
     LEFT  = the physical CPU (x86-64): every instruction NAMES the register(s)
             it reads and writes — a register machine.
     RIGHT = the JVM (bytecode): the ops carry NO operands; they push and pop an
             implicit operand stack — a stack machine.
   The opcodes and the 5 / 7 / 12 values match the note's own x86 asm block and
   the jvm-operand-stack stepper, so the three pieces line up exactly. Drawn at
   viewBox width 780 with maxWidth 780 so 1 SVG unit ≈ 1 rendered px, keeping the
   monospace instruction rows legible. */

const L = { cx: 196, x: 16, w: 360 };   // register panel
const R = { cx: 588, x: 400, w: 360 };  // stack panel

// one instruction row: the opcode on the left edge, the resulting state on the right edge
function insRow(panel, y, ins, state) {
  return (
    <g>
      <text x={panel.x + 18} y={y} textAnchor="start"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 12.5, fontWeight: 700 }}>{ins}</text>
      <text x={panel.x + panel.w - 16} y={y} textAnchor="end"
        style={{ fill: "var(--mm-muted)", fontSize: 11 }}>{state}</text>
    </g>
  );
}

export default function RegisterVsStack() {
  return (
    <div>
      <span data-artifact-title style={{ display: "none" }}>Register-based vs stack-based: the same a + b computed on an x86 CPU and on the JVM operand stack</span>

      <DiagramSvg viewBox="0 0 780 390" maxWidth={780}
        ariaLabel="The same computation, a plus b with a equals 5 and b equals 7 giving 12, shown two ways. On the left, a register machine (x86-64): mov 5 into rbx, mov 7 into rcx, mov 0 into rax, add rbx to rax giving 5, add rcx to rax giving 12 — every instruction names the registers it reads and writes, and the result sits in the named register rax. On the right, a stack machine (the JVM): iload_1 pushes 5, iload_2 pushes 7 leaving the stack 5 then 7, iadd pops both and pushes 12, ireturn pops 12 and returns it — the opcodes carry no operands and instead push and pop one anonymous operand stack. A register machine names its operands; a stack machine leaves them implicit on the stack top.">
        <text x={390} y={28} textAnchor="middle"
          style={{ fill: "var(--mm-cell-fg)", fontSize: 16, fontWeight: 900 }}>the same computation, two machines</text>
        <text x={390} y={46} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 11 }}>compute <tspan style={{ fontWeight: 700 }}>a + b</tspan> with a = 5, b = 7 → 12</text>

        {/* panels */}
        <rect x={L.x} y={60} width={L.w} height={300} rx={14}
          style={{ fill: "var(--mm-panel-bg)", fillOpacity: 0.5, stroke: "var(--mm-gap-bd)", strokeWidth: 1.3 }} />
        <rect x={R.x} y={60} width={R.w} height={300} rx={14}
          style={{ fill: "var(--mm-panel-bg)", fillOpacity: 0.5, stroke: "var(--mm-gap-bd)", strokeWidth: 1.3 }} />

        {/* headers */}
        <text x={L.cx} y={84} textAnchor="middle"
          style={{ fill: "var(--seg-global-fg)", fontSize: 13, fontWeight: 900 }}>Register machine · x86-64</text>
        <text x={L.cx} y={100} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 10 }}>operands are named registers</text>
        <text x={R.cx} y={84} textAnchor="middle"
          style={{ fill: "var(--seg-heap-fg)", fontSize: 13, fontWeight: 900 }}>Stack machine · JVM bytecode</text>
        <text x={R.cx} y={100} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 10 }}>operands are implicit — the stack top</text>

        {/* instruction streams */}
        {insRow(L, 138, "mov $5, %rbx",   "rbx = 5")}
        {insRow(L, 168, "mov $7, %rcx",   "rcx = 7")}
        {insRow(L, 198, "mov $0, %rax",   "rax = 0")}
        {insRow(L, 228, "add %rbx, %rax", "rax = 5")}
        {insRow(L, 258, "add %rcx, %rax", "rax = 12")}

        {insRow(R, 138, "iload_1", "push → [5]")}
        {insRow(R, 168, "iload_2", "push → [5, 7]")}
        {insRow(R, 198, "iadd",    "pop, pop, push → [12]")}
        {insRow(R, 228, "ireturn", "pop → 12 to caller")}

        {/* storage row label */}
        <text x={L.cx} y={296} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 9.5, fontWeight: 800, letterSpacing: ".04em" }}>NAMED STORAGE · the register file</text>
        <text x={R.cx} y={296} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 9.5, fontWeight: 800, letterSpacing: ".04em" }}>ANONYMOUS STORAGE · one operand stack</text>

        {/* register file: three named slots */}
        <DiagramBox cx={L.x + 74}  cy={332} w={92} h={34} label="rbx" note="5" sub={2} />
        <DiagramBox cx={L.x + 178} cy={332} w={92} h={34} label="rcx" note="7" sub={2} />
        <DiagramBox cx={L.x + 282} cy={332} w={92} h={34} label="rax" note="12 ← result" sub={0} />

        {/* operand stack: the anonymous slot the result lives on */}
        <DiagramBox cx={R.cx} cy={332} w={190} h={34} label="operand[top]" note="12 ← result" sub={1} />
      </DiagramSvg>

      <CompareCaption
        cols={[
          { tag: "register", kind: "asm", children: <>Each instruction <strong>names</strong> the registers it reads and writes (<code className="mm-ic">add %rbx, %rax</code>). The CPU has a fixed set of named registers; the result lives in <code className="mm-ic">rax</code>.</> },
          { tag: "stack", kind: "java", children: <>Each opcode carries <strong>no operands</strong>: <code className="mm-ic">iadd</code> just pops the top two values and pushes their sum. Values flow through <strong>one operand stack</strong>, never named.</> },
          { tag: "why it matters", kind: "cpp", children: <>Naming no registers is what makes bytecode <strong>portable</strong> — it needn't know how many registers a CPU has. The JVM maps the stack onto real registers when it runs.</> },
        ]}
        punch={<>A <em>register</em> machine spells out <em>where</em> every operand lives; a <em>stack</em> machine leaves that implicit on the operand stack. Java compiles to the stack model, then the JVM lowers it to the register model underneath.</>}
      />
    </div>
  );
}
