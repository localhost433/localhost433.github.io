import React from "react";
import { DiagramSvg, DiagramBox, DiagramEdge } from "@course";

/* "The map of class relations" (note 05): the full inheritance taxonomy as a 2x2
   grid — {single | multiple} bases x {single-level | multi-level} depth. Derived
   -> base "is-a" arrows, sibling of diamond-chart. Bases use sub 0/1, derived use
   sub 2/3. The bottom-right cell trends toward the diamond, so it is captioned as
   a pointer to note 06 / diamond-chart rather than fully derived. */

const HALF = 18; // box half-height (matches DiagramBox default h=36)
const up = (a, b, label) => ({ from: { x: a.cx, y: a.cy - HALF }, to: { x: b.cx, y: b.cy + HALF }, label });

const PanelTitle = ({ x, y, label }) => (
  <text x={x} y={y} textAnchor="middle"
    style={{ fill: "var(--mm-cell-fg)", fontSize: 13, fontWeight: 700 }}>{label}</text>
);
const Cap = ({ x, y, label, accent }) => (
  <text x={x} y={y} textAnchor="middle"
    style={{ fill: accent ? "var(--mm-cell-fg)" : "var(--mm-muted)", fontSize: 11, fontWeight: accent ? 700 : 400 }}>
    {label}
  </text>
);

export default function ClassRelations() {
  const TL = { a: { cx: 160, cy: 92 }, b: { cx: 160, cy: 182 } };
  const TR = { a: { cx: 420, cy: 92 }, b: { cx: 540, cy: 92 }, c: { cx: 480, cy: 182 } };
  const BL = { a: { cx: 160, cy: 322 }, b: { cx: 160, cy: 400 }, c: { cx: 160, cy: 466 } };
  const BR = { a: { cx: 480, cy: 322 }, b: { cx: 420, cy: 400 }, c: { cx: 540, cy: 400 }, d: { cx: 480, cy: 466 } };

  return (
    <DiagramSvg viewBox="0 0 640 520" maxWidth={620}
      ariaLabel="Inheritance taxonomy as a 2x2 grid: single base single-level (B is-a A); multiple bases single-level (C is-a A and B); single base multi-level (C is-a B is-a A); multiple bases multi-level (D is-a B and C, where B is-a A and C is-a A) forming a true diamond — the diamond problem.">
      <line x1="320" y1="14" x2="320" y2="506"
        style={{ stroke: "var(--mm-gap-bd)", strokeWidth: 1, strokeDasharray: "3 4" }} />
      <line x1="14" y1="260" x2="626" y2="260"
        style={{ stroke: "var(--mm-gap-bd)", strokeWidth: 1, strokeDasharray: "3 4" }} />

      {/* TOP-LEFT — single base, single-level: B -> A */}
      <PanelTitle x={160} y={28} label="single · single-level" />
      <DiagramEdge {...up(TL.b, TL.a, "is-a")} />
      <DiagramBox cx={TL.a.cx} cy={TL.a.cy} label="A" note="base" sub={0} />
      <DiagramBox cx={TL.b.cx} cy={TL.b.cy} label="B" note="derived" sub={2} />
      <Cap x={160} y={240} label="B is-a A" />

      {/* TOP-RIGHT — multiple bases, single-level: C -> A, B */}
      <PanelTitle x={480} y={28} label="multiple · single-level" />
      <DiagramEdge {...up(TR.c, TR.a, "is-a")} />
      <DiagramEdge {...up(TR.c, TR.b)} />
      <DiagramBox cx={TR.a.cx} cy={TR.a.cy} label="A" note="base" sub={0} />
      <DiagramBox cx={TR.b.cx} cy={TR.b.cy} label="B" note="base" sub={1} />
      <DiagramBox cx={TR.c.cx} cy={TR.c.cy} label="C" note="derived" sub={2} />
      <Cap x={480} y={240} label="C is-a A and is-a B" />

      {/* BOTTOM-LEFT — single base, multi-level: C -> B -> A (chain) */}
      <PanelTitle x={160} y={288} label="single · multi-level" />
      <DiagramEdge {...up(BL.b, BL.a, "is-a")} />
      <DiagramEdge {...up(BL.c, BL.b)} />
      <DiagramBox cx={BL.a.cx} cy={BL.a.cy} label="A" note="base" sub={0} />
      <DiagramBox cx={BL.b.cx} cy={BL.b.cy} label="B" note="derived base" sub={1} />
      <DiagramBox cx={BL.c.cx} cy={BL.c.cy} label="C" note="derived" sub={2} />
      <Cap x={160} y={502} label="C is-a B is-a A" />

      {/* BOTTOM-RIGHT — multiple bases, multi-level: D -> B, C where B -> A */}
      <PanelTitle x={480} y={288} label="multiple · multi-level" />
      <DiagramEdge {...up(BR.b, BR.a, "is-a")} />
      <DiagramEdge {...up(BR.c, BR.a)} />
      <DiagramEdge {...up(BR.d, BR.b)} />
      <DiagramEdge {...up(BR.d, BR.c)} />
      <DiagramBox cx={BR.a.cx} cy={BR.a.cy} label="A" note="base" sub={0} />
      <DiagramBox cx={BR.b.cx} cy={BR.b.cy} label="B" note="derived base" sub={1} />
      <DiagramBox cx={BR.c.cx} cy={BR.c.cy} label="C" note="base" sub={2} />
      <DiagramBox cx={BR.d.cx} cy={BR.d.cy} label="D" note="derived" sub={3} />
      <Cap x={480} y={502} label="-> the diamond problem" accent />
    </DiagramSvg>
  );
}
