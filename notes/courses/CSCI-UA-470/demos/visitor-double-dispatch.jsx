import React from "react";
import { DiagramSvg, DiagramCard, CodeBlock, KnobBar, diagramPalette } from "@course";
import { Button } from "@kit";

/* note 22 — the double-dispatch tracer. The one thing in L21 a static diagram cannot
   carry: `s.accept(v)` reaches one of NINE method bodies, and it takes three separate
   language rules to get there — a virtual call, then an OVERLOAD chosen at compile
   time, then a second virtual call.

   The grid is the point. Columns are shapes and rows are visitors, and the two axes
   are selected by DIFFERENT mechanisms:

     column  <- which `visit` OVERLOAD the compiler bound, from the STATIC type of
                `this` inside accept (a Circle, because we are in Circle.accept)
     row     <- which class's implementation runs, from the RUNTIME type of `visitor`

   Turn `accept` off and the three columns collapse into one: `v.visit(s)` binds
   `visit(Shape)` because `s` is DECLARED Shape, and the concrete type has to be
   recovered by hand with instanceof. Nine cells become three, and note 06's
   static-vs-dynamic binding is the whole explanation. */

const SHAPES = ["Circle", "Rectangle", "Triangle"];
const VISITORS = ["Rotator", "Resizer", "Flipper"];
const VERB = { Rotator: "rotate", Resizer: "resize", Flipper: "flip" };

const KNOBS = [
  { id: "shape", label: "shape", options: SHAPES.map((s) => ({ value: s, label: s })) },
  { id: "visitor", label: "visitor", options: VISITORS.map((v) => ({ value: v, label: v })) },
  { id: "call", label: "client writes", options: [
    { value: "accept", label: "s.accept(v)" },
    { value: "direct", label: "v.visit(s)" },
  ] },
];

/* ---- the source, regenerated per cast so the highlighted line is the real one ---- */

const acceptCode = (shape, vis) =>
`abstract class Shape {
    abstract void accept(Visitor v);
}
class ${shape} extends Shape {
    void accept(Visitor v) { v.visit(this); }
}

interface Visitor {
    void visit(Circle c);
    void visit(Rectangle r);
    void visit(Triangle t);
}
class ${vis} implements Visitor {
    public void visit(Circle c)    { /* ${VERB[vis]} a circle */ }
    public void visit(Rectangle r) { /* ${VERB[vis]} a rectangle */ }
    public void visit(Triangle t)  { /* ${VERB[vis]} a triangle */ }
}

Shape   s = new ${shape}();
Visitor v = new ${vis}();
s.accept(v);`;

const directCode = (shape, vis) =>
`abstract class Shape { }
class ${shape} extends Shape { }          // no accept()

interface Visitor {
    void visit(Shape s);                  // the only overload it can offer
}
class ${vis} implements Visitor {
    public void visit(Shape s) {
        if      (s instanceof Circle)    { /* ${VERB[vis]} a circle */ }
        else if (s instanceof Rectangle) { /* ${VERB[vis]} a rectangle */ }
        else                             { /* ${VERB[vis]} a triangle */ }
    }
}

Shape   s = new ${shape}();
Visitor v = new ${vis}();
v.visit(s);                               // s is DECLARED Shape`;

/* ---- steps: what is decided, by which rule, and what lights up ---- */

const acceptSteps = (shape, vis, si) => ([
  {
    lines: [21, 5],
    lit: { obj: "shape" },
    title: "① a virtual call on the shape",
    body: (
      <>
        <code className="mm-ic">s.accept(v)</code> is an ordinary polymorphic call.
        {" "}<code className="mm-ic">s</code> is declared <code className="mm-ic">Shape</code>,
        {" "}but it <em>is</em> a <code className="mm-ic">{shape}</code> at run time, so
        {" "}<code className="mm-ic">{shape}.accept</code> runs. Nothing about the visitor
        {" "}has been decided yet.
      </>
    ),
  },
  {
    lines: [5, 9 + si],
    lit: { obj: "shape", col: si },
    title: "② an overload chosen at compile time",
    body: (
      <>
        Inside <code className="mm-ic">{shape}.accept</code>, <code className="mm-ic">this</code>
        {" "}is statically a <code className="mm-ic">{shape}</code> — so the compiler picked
        {" "}<code className="mm-ic">visit({shape})</code> when it compiled this line, and no
        {" "}other overload can ever run from here. That fixes the <strong>column</strong>,
        {" "}and it is why every element class needs its own one-line{" "}
        <code className="mm-ic">accept</code>: a shared one in <code className="mm-ic">Shape</code>
        {" "}would bind <code className="mm-ic">visit(Shape)</code> and lose the type.
      </>
    ),
  },
  {
    lines: [13, 14 + si],
    lit: { obj: "both", col: si, row: VISITORS.indexOf(vis), cell: true },
    title: "③ a virtual call on the visitor",
    body: (
      <>
        That chosen overload is still a virtual call, now on{" "}
        <code className="mm-ic">visitor</code> — whose run-time type is{" "}
        <code className="mm-ic">{vis}</code>. That fixes the <strong>row</strong>. Two runtime
        types, consulted one at a time, land on one of nine bodies:{" "}
        <code className="mm-ic">{vis}.visit({shape})</code>.
      </>
    ),
  },
]);

const directSteps = (shape, vis) => ([
  {
    lines: [15, 17, 5],
    lit: { obj: "shape" },
    title: "① the argument's type is lost at compile time",
    body: (
      <>
        <code className="mm-ic">s</code> is <em>declared</em>{" "}
        <code className="mm-ic">Shape</code>. Overload resolution is a compile-time rule, so it
        can only use that declared type — it binds <code className="mm-ic">visit(Shape)</code>.
        {" "}That <code className="mm-ic">s</code> happens to hold a{" "}
        <code className="mm-ic">{shape}</code> is invisible here; only <em>receivers</em> get
        {" "}late binding in Java, never arguments.
      </>
    ),
  },
  {
    lines: [8, 9],
    lit: { obj: "both", row: VISITORS.indexOf(vis), cell: true },
    title: "② one dispatch, then a hand-written type test",
    body: (
      <>
        The single call dispatches on <code className="mm-ic">visitor</code> to{" "}
        <code className="mm-ic">{vis}.visit(Shape)</code> — and now the method has to recover
        by hand what the compiler discarded. Nine bodies have collapsed into three, each
        holding the <code className="mm-ic">instanceof</code> chain that Open–Closed exists
        {" "}to delete. This is the design Visitor is bought to avoid.
      </>
    ),
  },
]);

/* ---- the grid ---- */

const PAD = 14;
const CARD_W = 156, CELL_W = 122, CELL_H = 42, CGAP = 8;
const ROWH_W = 96, ROWH_GAP = 10;
const GRID_X = CARD_W + PAD + 34;
const HDR_H = 24, HDR_GAP = 8;
const HDR_Y = PAD + 18;
const ROW0_Y = HDR_Y + HDR_H + HDR_GAP;
const COL0_X = GRID_X + ROWH_W + ROWH_GAP;

const colX = (i) => COL0_X + i * (CELL_W + CGAP);
const rowY = (i) => ROW0_Y + i * (CELL_H + CGAP);

const WIDE_W = 3 * CELL_W + 2 * CGAP;
const GRID_R = COL0_X + WIDE_W;
const W = GRID_R + PAD;
const H = rowY(2) + CELL_H + PAD + 20;

function Box({ x, y, w, h, label, sub, dim, strong, mono = true, size = 11.5 }) {
  const c = sub != null && !dim
    ? diagramPalette(sub)
    : { bg: "--mm-cell-bg", bd: "--mm-cell-bd", fg: "--mm-cell-fg" };
  return (
    <g opacity={dim ? 0.34 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={6}
        style={{ fill: `var(${c.bg})`, stroke: `var(${c.bd})`,
          strokeWidth: strong ? 2.5 : 1.4 }} />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central"
        style={{ fill: `var(${c.fg})`, fontSize: size, fontWeight: strong ? 700 : 500,
          fontFamily: mono ? 'ui-monospace, "JetBrains Mono", Menlo, monospace' : "system-ui, sans-serif" }}>
        {label}
      </text>
    </g>
  );
}

const guide = (props) => (
  <line {...props} style={{ stroke: "var(--mm-hl)", strokeWidth: 2, strokeDasharray: "4 4" }} />
);

function Grid({ shape, visitor, step, accept }) {
  const si = SHAPES.indexOf(shape), vi = VISITORS.indexOf(visitor);
  const lit = step.lit || {};
  const colOn = lit.col != null, rowOn = lit.row != null;

  return (
    <g>
      {/* the two objects the call is made from */}
      <DiagramCard x={PAD} y={HDR_Y} w={CARD_W} title={`s : ${shape}`} underline
        sections={[{ rows: ["declared: Shape"] }]}
        neutral={!(lit.obj === "shape" || lit.obj === "both")} sub={0} />
      <DiagramCard x={PAD} y={rowY(1) + 4} w={CARD_W} title={`v : ${visitor}`} underline
        sections={[{ rows: ["declared: Visitor"] }]}
        neutral={lit.obj !== "both"} sub={1} />

      {/* column headers — three overloads, or the single Shape one */}
      {accept ? SHAPES.map((s, i) => (
        <Box key={s} x={colX(i)} y={HDR_Y} w={CELL_W} h={HDR_H}
          label={`visit(${s})`} sub={0} dim={colOn && i !== si} strong={colOn && i === si} />
      )) : (
        <Box x={COL0_X} y={HDR_Y} w={WIDE_W} h={HDR_H} label="visit(Shape)" sub={0} strong />
      )}

      {/* row headers — the visitor classes */}
      {VISITORS.map((v, i) => (
        <Box key={v} x={GRID_X} y={rowY(i)} w={ROWH_W} h={CELL_H}
          label={v} sub={1} dim={rowOn && i !== vi} strong={rowOn && i === vi} />
      ))}

      {/* look-up guides: down the chosen column, across the chosen row. Drawn BEFORE
          the bodies so the cells paint over them — the dashes show in the gutters and
          never strike through a cell's label. */}
      {colOn && accept ? guide({ x1: colX(si) + CELL_W / 2, y1: HDR_Y + HDR_H,
        x2: colX(si) + CELL_W / 2, y2: rowY(2) + CELL_H }) : null}
      {rowOn ? guide({ x1: GRID_X + ROWH_W, y1: rowY(vi) + CELL_H / 2,
        x2: GRID_R, y2: rowY(vi) + CELL_H / 2 }) : null}

      {/* the bodies */}
      {VISITORS.map((v, i) => (
        accept ? SHAPES.map((s, j) => {
          const isCell = lit.cell && i === vi && j === si;
          return (
            <Box key={v + s} x={colX(j)} y={rowY(i)} w={CELL_W} h={CELL_H}
              label={`${VERB[v]} a ${s.toLowerCase()}`} size={10.5} mono={false}
              sub={isCell ? 2 : null}
              dim={(colOn && j !== si) || (rowOn && i !== vi)} strong={isCell} />
          );
        }) : (
          <Box key={v} x={COL0_X} y={rowY(i)} w={WIDE_W} h={CELL_H}
            label="visit(Shape) { …instanceof… }" size={11} sub={lit.cell && i === vi ? 2 : null}
            dim={rowOn && i !== vi} strong={lit.cell && i === vi} />
        )
      ))}

      <text x={PAD} y={HDR_Y - 6}
        style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em" }}>
        THE OBJECTS
      </text>
      <text x={COL0_X} y={HDR_Y - 6}
        style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em" }}>
        {accept ? "WHICH OVERLOAD  (compile time)" : "THE ONLY OVERLOAD  (compile time)"}
      </text>
      <text x={GRID_X} y={H - 8}
        style={{ fill: "var(--mm-muted)", fontSize: 10.5, fontWeight: 700, letterSpacing: ".05em" }}>
        {accept ? "WHICH CLASS  (run time)" : "WHICH CLASS  (run time) — 9 bodies became 3"}
      </text>
    </g>
  );
}

export default function VisitorDoubleDispatch() {
  const [shape, setShape] = React.useState("Circle");
  const [visitor, setVisitor] = React.useState("Rotator");
  const [call, setCall] = React.useState("accept");
  const [i, setI] = React.useState(0);

  const accept = call === "accept";
  const si = SHAPES.indexOf(shape);
  const steps = accept ? acceptSteps(shape, visitor, si) : directSteps(shape, visitor);
  const idx = Math.min(i, steps.length - 1);
  const step = steps[idx];
  const code = accept ? acceptCode(shape, visitor) : directCode(shape, visitor);

  const onKnob = (id, v) => {
    setI(0);
    if (id === "shape") setShape(v);
    else if (id === "visitor") setVisitor(v);
    else setCall(v);
  };

  return (
    <div className="mm-scene">
      <div className="mm-scene__title" data-artifact-title>
        Double dispatch — how s.accept(v) finds one of nine bodies
      </div>

      <KnobBar knobs={KNOBS} value={{ shape, visitor, call }} onChange={onKnob} />

      <DiagramSvg viewBox={`0 0 ${W} ${H}`} maxWidth={860}
        ariaLabel={`A lookup table. Columns are the visit overloads for Circle, Rectangle and Triangle; rows are the visitor classes Rotator, Resizer and Flipper. Currently ${accept ? `the column visit of ${shape} and the row ${visitor} are selected, meeting at one cell` : `there is a single visit of Shape column, so each visitor has one body containing an instanceof chain`}.`}>
        <Grid shape={shape} visitor={visitor} step={step} accept={accept} />
      </DiagramSvg>

      <CodeBlock code={code} lang="java" activeLine={step.lines} />

      <p className="mm-scene__caption">
        <strong>{step.title}</strong>{" — "}{step.body}
      </p>

      <div className="mm-scene__nav">
        <Button variant="ghost" size="sm" disabled={idx === 0} onClick={() => setI(0)}>Reset</Button>
        <Button variant="outline" size="sm" disabled={idx === 0} onClick={() => setI(idx - 1)}>Back</Button>
        <div className="mm-scene__dots" role="tablist">
          {steps.map((_, n) => (
            <button key={n} type="button" aria-label={"Step " + (n + 1)} aria-selected={n === idx}
              className={"mm-dot" + (n === idx ? " mm-dot--on" : "")} onClick={() => setI(n)} />
          ))}
        </div>
        <Button variant="outline" size="sm" disabled={idx === steps.length - 1}
          onClick={() => setI(idx + 1)}>Next</Button>
        <span className="mm-scene__step">{idx + 1} / {steps.length}</span>
      </div>
    </div>
  );
}
