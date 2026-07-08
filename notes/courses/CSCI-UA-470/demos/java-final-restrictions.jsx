import React from "react";
import { DiagramSvg, CodeBlock, CompareCaption } from "@course";
import { Button } from "@kit";

/* L10 - Java final restrictions.
   Interactive stepper built from the SHARED lecture components so the code pane
   and the Reset/Back/Next controls match every other artifact: a syntax-
   highlighted CodeBlock plus the standard mm-scene nav (Button + step dots).
   The diagram's highlighted scenario changes by step. The three meanings of
   final are deliberately parallel:
     1. final variable/reference -> no reassignment of that variable after init
     2. final method             -> no overriding of that inherited method
     3. final class              -> no subclass may extend that class
   None of these alone makes ordinary object state immutable.

   Drawn at viewBox width 780 / maxWidth 780 so the per-panel text stays legible. */

const codeLines = [
  "// 1. final variable: the binding is fixed",
  "final Circle c = new Circle();",
  "c.radius = 10;              // OK: object state may change",
  "c = new Circle();           // ERROR: c cannot be rebound",
  "",
  "// 2. final method: the implementation slot is fixed",
  "class Shape {",
  "    final void id() { }",
  "}",
  "class Circle extends Shape {",
  "    void id() { }           // ERROR: cannot override final method",
  "}",
  "",
  "// 3. final class: the inheritance edge is forbidden",
  "final class Utility { }",
  "Utility u = new Utility();  // OK: normal use",
  "class MoreUtility extends Utility { } // ERROR",
];

const steps = [
  {
    key: "overview", label: "overview", lines: [2, 8, 15],
    caption: {
      java: "The keyword `final` has three related but distinct source-level meanings: freeze a variable binding, freeze a method's overridable implementation, or freeze a class's inheritance boundary.",
      intuition: "In all three cases, `final` blocks one relation. It does not automatically make every object state immutable.",
    },
  },
  {
    key: "variable", label: "variable", lines: [2, 3, 4],
    caption: {
      java: "`final Circle c` means the variable `c` receives one reference value. Mutating the reachable `Circle` object may still be legal; assigning a different reference to `c` is not.",
      intuition: "The frozen thing is the arrow stored in the variable, not the fields inside the object at the arrow's target.",
    },
  },
  {
    key: "method", label: "method", lines: [7, 8, 9, 10, 11, 12],
    caption: {
      java: "`final void id()` is inherited by `Circle`, but `Circle` cannot provide a new implementation for the same method signature.",
      intuition: "The frozen thing is the override relation for that method. Other methods and the object's fields remain ordinary unless separately restricted.",
    },
  },
  {
    key: "class", label: "class", lines: [15, 16, 17],
    caption: {
      java: "`final class Utility` can be instantiated and used normally. The illegal operation is declaring a subclass with `extends Utility`.",
      intuition: "The frozen thing is the inheritance edge below the class, not the use of the class itself.",
    },
  },
];

const scenarios = [
  { key: "variable", title: "final variable", subtitle: "freeze a binding", sub: 0 },
  { key: "method", title: "final method", subtitle: "freeze overriding", sub: 2 },
  { key: "class", title: "final class", subtitle: "freeze subclassing", sub: 3 },
];

const capRows = [
  ["java", "JAVA", "java"],
  ["intuition", "INTUITION", "int"],
];

const PW = 244, PX0 = 12, PSTEP = 256;

const activeStep = (step, key) => step.key === "overview" || step.key === key;
const activeStroke = (step, key) => activeStep(step, key) ? "var(--mm-ptr)" : "var(--mm-gap-bd)";
const activeOpacity = (step, key) => step.key === "overview" || step.key === key ? 1 : 0.36;
const segOf = (sub) => (sub === 0 ? "stack" : sub === 2 ? "global" : "code");

function renderInline(text) {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="mm-ic">{p.slice(1, -1)}</code>;
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

function Caption({ step }) {
  return (
    <div className="mm-scene__caption mm-scene__caption--struct">
      {capRows.map(([key, label, mod]) => (
        <p className="mm-cap-row" key={key}>
          <span className={"mm-cap-tag mm-cap-tag--" + mod}>{label}</span>
          <span className="mm-cap-txt">{renderInline(step.caption[key])}</span>
        </p>
      ))}
    </div>
  );
}

function pill(x, y, label, good) {
  const seg = good ? "heap" : "code";
  const w = good ? 42 : 58;
  return (
    <g>
      <rect x={x} y={y} width={w} height={22} rx={7}
        style={{ fill: `var(--seg-${seg}-bg)`, stroke: `var(--seg-${seg}-bd)`, strokeWidth: 1 }} />
      <text x={x + w / 2} y={y + 11} textAnchor="middle" dominantBaseline="central"
        style={{ fill: `var(--seg-${seg}-fg)`, fontSize: 9.6, fontWeight: 900 }}>{label}</text>
    </g>
  );
}

function outcomeRow(x, y, good, code, note) {
  return (
    <g>
      <rect x={x} y={y} width={216} height={46} rx={9}
        style={{ fill: "var(--mm-cell-bg)", stroke: "var(--mm-cell-bd)", strokeWidth: 1 }} />
      {pill(x + 10, y + 12, good ? "OK" : "ERROR", good)}
      <text x={x + 78} y={y + 17} textAnchor="start" dominantBaseline="central"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 9.8, fontWeight: 850 }}>{code}</text>
      <text x={x + 78} y={y + 33} textAnchor="start" dominantBaseline="central"
        style={{ fill: "var(--mm-muted)", fontSize: 8.8 }}>{note}</text>
    </g>
  );
}

function miniClass(x, y, w, name, rows, seg = "stack", dashed = false) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={40 + rows.length * 17} rx={9}
        style={{ fill: `var(--seg-${seg}-bg)`, stroke: `var(--seg-${seg}-bd)`, strokeWidth: 1.2, strokeDasharray: dashed ? "5 4" : "none" }} />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" dominantBaseline="central"
        style={{ fill: `var(--seg-${seg}-fg)`, fontSize: 11.8, fontWeight: 900 }}>{name}</text>
      <line x1={x} y1={y + 30} x2={x + w} y2={y + 30} style={{ stroke: `var(--seg-${seg}-bd)`, strokeWidth: 1 }} />
      {rows.map((r, i) => (
        <text key={i} x={x + 9} y={y + 44 + i * 17} textAnchor="start" dominantBaseline="central"
          style={{ fill: `var(--seg-${seg}-fg)`, fontSize: 9.4, fontWeight: r.bold ? 900 : 600 }}>{r.text}</text>
      ))}
    </g>
  );
}

function VariableBody({ step, x }) {
  const selected = step.key === "variable";
  return (
    <g>
      <text x={x + 122} y={122} textAnchor="middle"
        style={{ fill: "var(--mm-muted)", fontSize: 10.6, fontWeight: 800 }}>frozen: binding</text>

      <rect x={x + 22} y={142} width={74} height={48} rx={10}
        style={{ fill: "var(--seg-stack-bg)", stroke: selected ? "var(--mm-ptr)" : "var(--seg-stack-bd)", strokeWidth: selected ? 2 : 1.2 }} />
      <text x={x + 59} y={160} textAnchor="middle" dominantBaseline="central" style={{ fill: "var(--seg-stack-fg)", fontSize: 12.5, fontWeight: 900 }}>c</text>
      <text x={x + 59} y={176} textAnchor="middle" dominantBaseline="central" style={{ fill: "var(--seg-stack-fg)", fontSize: 9 }}>final ref</text>

      <line x1={x + 96} y1={166} x2={x + 138} y2={166} markerEnd="url(#dia-arrow)"
        style={{ stroke: selected ? "var(--mm-ptr)" : "var(--mm-muted)", strokeWidth: selected ? 2.2 : 1.6 }} />

      <rect x={x + 144} y={132} width={84} height={68} rx={10}
        style={{ fill: "var(--seg-heap-bg)", stroke: "var(--seg-heap-bd)", strokeWidth: 1.2 }} />
      <text x={x + 186} y={151} textAnchor="middle" dominantBaseline="central" style={{ fill: "var(--seg-heap-fg)", fontSize: 11.2, fontWeight: 900 }}>Circle</text>
      <line x1={x + 156} y1={166} x2={x + 216} y2={166} style={{ stroke: "var(--seg-heap-bd)", strokeWidth: 1 }} />
      <text x={x + 158} y={185} style={{ fill: "var(--seg-heap-fg)", fontSize: 9.8 }}>radius = 10</text>

      {outcomeRow(x + 14, 222, true, "c.radius = 10", "object state may mutate")}
      {outcomeRow(x + 14, 278, false, "c = new Circle()", "binding cannot change")}
    </g>
  );
}

function MethodBody({ step, x }) {
  const selected = step.key === "method";
  return (
    <g>
      <text x={x + 122} y={122} textAnchor="middle"
        style={{ fill: "var(--mm-muted)", fontSize: 10.6, fontWeight: 800 }}>frozen: override</text>

      {miniClass(x + 24, 138, 88, "Shape", [{ text: "final id()", bold: true }], "global")}
      <line x1={x + 114} y1={169} x2={x + 140} y2={169} markerEnd="url(#dia-arrow)"
        style={{ stroke: selected ? "var(--mm-ptr)" : "var(--mm-muted)", strokeWidth: selected ? 2.2 : 1.6 }} />
      {miniClass(x + 146, 138, 84, "Circle", [{ text: "inherits" }], "heap")}

      {outcomeRow(x + 14, 222, true, "new Circle().id()", "inherited method is usable")}
      {outcomeRow(x + 14, 278, false, "void id() { }", "same signature override")}
    </g>
  );
}

function ClassBody({ step, x }) {
  const selected = step.key === "class";
  return (
    <g>
      <text x={x + 122} y={122} textAnchor="middle"
        style={{ fill: "var(--mm-muted)", fontSize: 10.6, fontWeight: 800 }}>frozen: subclassing</text>

      {miniClass(x + 67, 138, 110, "Utility", [{ text: "final class", bold: true }], "code")}
      <rect x={x + 62} y={134} width={120} height={72} rx={12}
        style={{ fill: "none", stroke: selected ? "var(--mm-ptr)" : "transparent", strokeWidth: 2 }} />

      {outcomeRow(x + 14, 222, true, "new Utility()", "normal use is allowed")}
      {outcomeRow(x + 14, 278, false, "extends Utility", "no subclass may exist")}
    </g>
  );
}

function scenarioPanel(step, s, x) {
  const on = activeStep(step, s.key);
  const opacity = activeOpacity(step, s.key);
  const seg = segOf(s.sub);
  return (
    <g key={s.key} opacity={opacity}>
      <rect x={x} y={42} width={PW} height={300} rx={16}
        style={{ fill: "var(--mm-panel-bg)", stroke: activeStroke(step, s.key), strokeWidth: on ? 2.2 : 1.2 }} />
      <rect x={x} y={42} width={PW} height={56} rx={16}
        style={{ fill: `var(--seg-${seg}-bg)`, stroke: `var(--seg-${seg}-bd)`, strokeWidth: 1.1 }} />
      <text x={x + PW / 2} y={64} textAnchor="middle" dominantBaseline="central"
        style={{ fill: `var(--seg-${seg}-fg)`, fontSize: 15, fontWeight: 900 }}>{s.title}</text>
      <text x={x + PW / 2} y={85} textAnchor="middle" dominantBaseline="central"
        style={{ fill: `var(--seg-${seg}-fg)`, fontSize: 10, opacity: 0.8 }}>{s.subtitle}</text>
      {s.key === "variable" ? <VariableBody step={step} x={x} /> : s.key === "method" ? <MethodBody step={step} x={x} /> : <ClassBody step={step} x={x} />}
    </g>
  );
}

function FinalDiagram({ step }) {
  return (
    <DiagramSvg viewBox="0 0 780 384" maxWidth={780}
      ariaLabel="Three parallel Java final scenarios: final variable, final method, and final class.">
      <text x={390} y={24} textAnchor="middle"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 16, fontWeight: 900 }}>same keyword, three different forbidden operations</text>
      {scenarios.map((s, i) => scenarioPanel(step, s, PX0 + i * PSTEP))}
      <line x1="12" y1="362" x2="768" y2="362" style={{ stroke: "var(--mm-gap-bd)", strokeWidth: 1 }} />
      <text x={390} y={378} textAnchor="middle" style={{ fill: "var(--mm-muted)", fontSize: 10.6 }}>
        final restricts one relation; immutability is separate.
      </text>
    </DiagramSvg>
  );
}

export default function JavaFinalRestrictions() {
  const [i, setI] = React.useState(0);
  const step = steps[i];

  const pickable = React.useMemo(() => new Set(steps.flatMap((s) => s.lines)), []);
  const firstStepForLine = (line) => steps.findIndex((s) => s.lines.includes(line));
  const onPickLine = (no) => { const s = firstStepForLine(no); if (s >= 0) setI(s); };

  return (
    <div className="mm-scene">
      <div className="mm-scene__title" data-artifact-title>Java final - three restrictions, three separate meanings</div>
      <FinalDiagram step={step} />

      <CodeBlock
        code={codeLines.join("\n")}
        activeLine={step.lines}
        lang="java"
        onPickLine={onPickLine}
        pickable={pickable}
      />

      <Caption step={step} />

      <div className="mm-scene__nav">
        <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => setI(0)}>Reset</Button>
        <Button variant="outline" size="sm" disabled={i === 0} onClick={() => setI(i - 1)}>Back</Button>
        <div className="mm-scene__dots" role="tablist">
          {steps.map((s, n) => (
            <button key={s.key} type="button" aria-label={"Step " + (n + 1) + ": " + s.label} aria-selected={n === i}
              className={"mm-dot" + (n === i ? " mm-dot--on" : "")} onClick={() => setI(n)} />
          ))}
        </div>
        <Button variant="outline" size="sm" disabled={i === steps.length - 1} onClick={() => setI(i + 1)}>Next</Button>
        <span className="mm-scene__step">{i + 1} / {steps.length}</span>
      </div>

      <CompareCaption
        cols={[
          { tag: "variable", kind: "java", children: <>A final variable or field cannot be assigned again after initialization.</> },
          { tag: "method", kind: "cpp", children: <>A final method is inherited, but subclasses cannot override that same method signature.</> },
          { tag: "class", kind: "asm", children: <>A final class can be instantiated and used normally, but no class can extend it.</> },
        ]}
        punch="The common trap is to confuse a final reference with an immutable object."
      />
    </div>
  );
}
