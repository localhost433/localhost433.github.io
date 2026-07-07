import React from "react";
import { DiagramSvg, DiagramBox, CompareCaption } from "@course";

/* L11 - JVM architecture map.
   The map keeps JVM pieces in their proper roles. Class loading reads .class
   files and creates class metadata. Runtime data areas are abstract JVM storage
   areas: method area and heap are shared, while JVM stacks, PC registers, and
   native method stacks are per-thread. The execution engine interprets or JITs
   bytecode and uses those runtime areas. JNI is a bridge from Java/native method
   calls to platform-specific native libraries outside the ordinary Java runtime
   path. The host OS/CPU are outside the JVM.

   Drawn at viewBox width 780 with maxWidth 780, so 1 SVG unit ≈ 1 rendered px:
   that keeps the cell labels and notes legible and stops them overflowing. */

function group(x, y, w, h, title, note) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={16}
        style={{ fill: "var(--mm-panel-bg)", stroke: "var(--mm-gap-bd)", strokeWidth: 1.35 }} />
      <text x={x + w / 2} y={y + 25} textAnchor="middle"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 12.8, fontWeight: 900 }}>{title}</text>
      {note ? <text x={x + w / 2} y={y + 42} textAnchor="middle"
        style={{ fill: "var(--mm-muted)", fontSize: 10 }}>{note}</text> : null}
    </g>
  );
}

function arrow(x1, y1, x2, y2, label, dashed = false) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        style={{ stroke: "var(--mm-muted)", strokeWidth: 1.6, strokeDasharray: dashed ? "5 4" : "none" }}
        markerEnd="url(#dia-arrow)" />
      {label ? <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 7} textAnchor="middle"
        style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontStyle: "italic" }}>{label}</text> : null}
    </g>
  );
}

// a wide mini cell so its note never overflows the box
function mini(cx, y, w, label, note, sub) {
  return <DiagramBox cx={cx} cy={y + 24} w={w} h={48} label={label} note={note} sub={sub} />;
}

export default function JvmArchitectureMap() {
  return (
    <div>
      <span data-artifact-title style={{ display: "none" }}>JVM architecture - class loading, runtime data areas, execution engine, JNI</span>

      <DiagramSvg viewBox="0 0 780 548" maxWidth={780}
        ariaLabel="JVM architecture map showing class files, the class loader subsystem, runtime data areas, execution engine, JNI, native libraries, and host OS or CPU.">
        <text x={390} y={32} textAnchor="middle"
          style={{ fill: "var(--mm-cell-fg)", fontSize: 16, fontWeight: 900 }}>JVM architecture map</text>

        <DiagramBox cx={72} cy={104} w={112} h={48} label=".class files" note="bytecode" sub={3} />
        {arrow(128, 104, 150, 104)}

        {/* one JVM process */}
        <rect x={150} y={62} width={614} height={386} rx={18}
          style={{ fill: "none", stroke: "var(--mm-cell-bd)", strokeWidth: 1.6 }} />
        <text x={457} y={84} textAnchor="middle"
          style={{ fill: "var(--mm-cell-fg)", fontSize: 12.5, fontWeight: 900 }}>inside one JVM process</text>

        {/* class loader */}
        {group(164, 100, 178, 320, "Class loader", "load → link → init")}
        {mini(253, 158, 150, "Loading", ".class → Class", 0)}
        {arrow(253, 210, 253, 226)}
        {mini(253, 226, 150, "Linking", "verify·prepare·resolve", 0)}
        {arrow(253, 278, 253, 294)}
        {mini(253, 294, 150, "Init", "static init, first use", 0)}

        {/* runtime data areas */}
        {group(358, 100, 238, 320, "Runtime data areas", "JVM-defined storage")}
        <text x={376} y={166} textAnchor="start"
          style={{ fill: "var(--mm-muted)", fontSize: 10, fontWeight: 800 }}>shared by all threads</text>
        {mini(434, 174, 116, "Method Area", "class data", 1)}
        {mini(548, 174, 84, "Heap", "objects", 1)}
        <text x={376} y={256} textAnchor="start"
          style={{ fill: "var(--mm-muted)", fontSize: 10, fontWeight: 800 }}>one set per thread</text>
        {mini(434, 264, 116, "JVM Stack", "frames", 1)}
        {mini(548, 264, 84, "PC Reg", "cur. instr", 1)}
        {mini(477, 342, 140, "Native Stack", "native calls", 1)}

        {/* execution engine */}
        {group(610, 100, 142, 320, "Execution engine", "runs bytecode")}
        {mini(681, 174, 124, "Interpreter", "stepwise", 2)}
        {mini(681, 244, 124, "JIT", "hot code → native", 2)}
        {mini(681, 314, 124, "GC", "heap cleanup", 2)}

        {arrow(342, 192, 358, 192, "loads")}
        {arrow(596, 200, 610, 200, "uses")}

        {/* JNI bridge out to the host */}
        <DiagramBox cx={300} cy={500} w={108} h={46} label="JNI" note="native bridge" sub={0} />
        <DiagramBox cx={470} cy={500} w={150} h={46} label="native libraries" note=".dll / .so / .dylib" sub={3} />
        <DiagramBox cx={660} cy={500} w={108} h={46} label="Host" note="OS + CPU" sub={3} />
        <path d="M682 420 V462 H300 V477" fill="none"
          style={{ stroke: "var(--mm-muted)", strokeWidth: 1.6, strokeDasharray: "5 4" }}
          markerEnd="url(#dia-arrow)" />
        <text x={500} y={454} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontStyle: "italic" }}>native call</text>
        {arrow(354, 500, 393, 500)}
        {arrow(545, 500, 604, 500)}
      </DiagramSvg>

      <CompareCaption
        cols={[
          { tag: "loader", kind: "java", children: <>A class runs a lifecycle: <strong>load</strong> (<code className="mm-ic">.class</code> → <code className="mm-ic">Class</code>) → <strong>link</strong> (verify · prepare · resolve) → <strong>initialize</strong> (static init, on first active use).</> },
          { tag: "runtime", kind: "cpp", children: <>Method area and heap are shared; JVM stacks, PC registers, and native method stacks are per-thread runtime data areas.</> },
          { tag: "native", kind: "asm", children: <>JNI crosses from Java execution to platform-specific native libraries and then to the host OS/CPU.</> },
        ]}
      />
    </div>
  );
}
