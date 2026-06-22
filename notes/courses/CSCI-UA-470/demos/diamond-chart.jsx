import React from "react";
import { DiagramSvg, DiagramBox, DiagramEdge } from "@course";

/* Static two-panel class diagram for the diamond problem (L06), built on the
   shared @course diagram primitives. LEFT (non-virtual): two Person subobjects.
   RIGHT (virtual): one shared Person. Node colours: Person=0, Teacher=1,
   Student=2, TA=3 (the segment palette). */

const HALF = 18; // box half-height (matches DiagramBox default h=36)

function Title({ x, label, code }) {
  return (
    <g>
      <text x={x} y={20} textAnchor="middle"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 13, fontWeight: 700 }}>{label}</text>
      <text x={x} y={37} textAnchor="middle"
        style={{ fill: "var(--mm-muted)", fontSize: 11 }}>{code}</text>
    </g>
  );
}
// derived (bottom) -> base (top): arrow ends on the base's lower edge.
const up = (a, b) => ({ from: { x: a.cx, y: a.cy - HALF }, to: { x: b.cx, y: b.cy + HALF } });

export default function DiamondChart() {
  const r1 = 74, r2 = 150, r3 = 226;
  const L = {
    pa: { cx: 78, cy: r1 }, pb: { cx: 202, cy: r1 },
    te: { cx: 78, cy: r2 }, st: { cx: 202, cy: r2 },
    ta: { cx: 140, cy: r3 },
  };
  const R = {
    pe: { cx: 460, cy: r1 },
    te: { cx: 398, cy: r2 }, st: { cx: 522, cy: r2 },
    ta: { cx: 460, cy: r3 },
  };
  return (
    <DiagramSvg viewBox="0 0 600 300"
      ariaLabel="Diamond inheritance: non-virtual gives two Person subobjects (t.name ambiguous); virtual gives one shared Person (t.name OK).">
      <line x1="300" y1="12" x2="300" y2="255"
        style={{ stroke: "var(--mm-gap-bd)", strokeWidth: 1, strokeDasharray: "3 4" }} />

      {/* LEFT: non-virtual (two Persons) */}
      <Title x={140} label="non-virtual" code=": public Person" />
      <DiagramEdge {...up(L.te, L.pa)} />
      <DiagramEdge {...up(L.st, L.pb)} />
      <DiagramEdge {...up(L.ta, L.te)} />
      <DiagramEdge {...up(L.ta, L.st)} />
      <DiagramBox cx={L.pa.cx} cy={L.pa.cy} label="Person" sub={0} />
      <DiagramBox cx={L.pb.cx} cy={L.pb.cy} label="Person" sub={0} />
      <DiagramBox cx={L.te.cx} cy={L.te.cy} label="Teacher" sub={1} />
      <DiagramBox cx={L.st.cx} cy={L.st.cy} label="Student" sub={2} />
      <DiagramBox cx={L.ta.cx} cy={L.ta.cy} label="TA" sub={3} />
      <text x={140} y={264} textAnchor="middle"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 12.5, fontWeight: 700 }}>TA inherits 2 × Person</text>
      <text x={140} y={282} textAnchor="middle"
        style={{ fill: "var(--mm-dangling)", fontSize: 12, fontWeight: 700 }}>t.name → ambiguous</text>

      {/* RIGHT: virtual (one shared Person) */}
      <Title x={460} label="virtual (the fix)" code=": virtual public Person" />
      <DiagramEdge {...up(R.te, R.pe)} />
      <DiagramEdge {...up(R.st, R.pe)} />
      <DiagramEdge {...up(R.ta, R.te)} />
      <DiagramEdge {...up(R.ta, R.st)} />
      <DiagramBox cx={R.pe.cx} cy={R.pe.cy} label="Person" sub={0} />
      <DiagramBox cx={R.te.cx} cy={R.te.cy} label="Teacher" sub={1} />
      <DiagramBox cx={R.st.cx} cy={R.st.cy} label="Student" sub={2} />
      <DiagramBox cx={R.ta.cx} cy={R.ta.cy} label="TA" sub={3} />
      <text x={460} y={264} textAnchor="middle"
        style={{ fill: "var(--mm-cell-fg)", fontSize: 12.5, fontWeight: 700 }}>TA inherits 1 shared Person</text>
      <text x={460} y={282} textAnchor="middle"
        style={{ fill: "var(--seg-heap-fg)", fontSize: 12, fontWeight: 700 }}>t.name → OK</text>
    </DiagramSvg>
  );
}
