import React from "react";
import { patternFigure, patternTree, SvgCode, svgCodeSize, ab } from "@course";

/* note 21 — Template Method, and the odd one out of the eight. Every other
   behavioral pattern in L20 varies behaviour by HOLDING an object; this one varies
   it by BEING a subclass. The figure keeps `run()` non-italic and the steps italic,
   because that is the whole design: the skeleton is fixed and inherited, the steps
   are the holes.

   Approach-1 and Approach-2 override DIFFERENT steps on purpose — it is what shows
   that a subclass fills the holes it cares about and inherits the rest. */

const BODY = ["this.step_1();", "this.step_2();", "this.step_3();", "this.step_4();"];

const T = patternTree({
  parent: { title: "Sorter", abstract: true, sections: [
    { rows: ["- data"] },
    { rows: [ab("- step_1()"), ab("- step_2()"), ab("- step_3()"), ab("- step_4()"), "+ run()"] },
  ]},
  children: [
    { title: "Approach-1", sections: [{ rows: ["- step_3()"] }] },
    { title: "Approach-2", sections: [{ rows: ["- step_2()"] }] },
  ],
  cardW: 168, gap: 60,
  note: "run() is inherited, never overridden — the steps are the only holes",
});

const body = svgCodeSize(BODY, "Sorter.run()");
const bodyX = T.layout.parent.x + 168 + 46;
const W = Math.round(Math.max(T.width, bodyX + body.w + 14));

export default patternFigure({
  title: "Template Method — a fixed skeleton with holes in it",
  intent: "[Define a skeleton of an algorithm]",
  bad: {
    lang: "java",
    code: `class QuickSorter {
    void run() { readInput(); partition(); recurse();  writeOutput(); }
}
class MergeSorter {
    void run() { readInput(); split();     mergeBack(); writeOutput(); }
}

// readInput and writeOutput are copied. Change the output format
// and you edit both — and the third sorter somebody adds next month.`,
    note: "The *sequence* is the same in every sorter; only a step or two differs. Copying the sequence into each subclass duplicates the part that never varies in order to vary the part that does.",
  },
  good: {
    width: W, height: T.height, viewBox: `0 0 ${W} ${T.height}`, maxWidth: 720,
    ariaLabel: "An abstract Sorter class holds data, four private abstract steps step_1 to step_4, and a concrete public run(). Its body calls this.step_1 through this.step_4 in order. Two subclasses inherit run unchanged: Approach-1 overrides step_3, Approach-2 overrides step_2.",
    node: (
      <g>
        {T.node}
        <SvgCode x={bodyX} y={T.layout.parent.y} lines={BODY} title="Sorter.run()" />
      </g>
    ),
  },
  client: {
    lang: "java",
    label: "client code",
    code: `Sorter s1;
// s1 = new Approach-1();
s1 = new Approach-2();
s1.run();`,
    note: "One call, and the commented-out line is the exercise: swapping it changes *which step* behaves differently while the order of the four stays exactly as `run()` fixed it.",
  },
  caption: {
    cols: [
      { tag: "fixed", kind: "cpp", children: <><code className="mm-ic">run()</code> lives in the parent and is <strong>not</strong> overridden. The order of the steps is the thing being protected — a subclass cannot reorder or skip them.</> },
      { tag: "variable", kind: "int", children: <>Each step is a hole. A subclass fills the ones it cares about and inherits the rest, so <code className="mm-ic">Approach-1</code> and <code className="mm-ic">Approach-2</code> differ by exactly one method each.</> },
    ],
    punch: "This is the only behavioral pattern in L20 that varies behaviour through inheritance. Every other one holds an object instead — which is why Strategy, its closest neighbour, can change its algorithm at run time and Template Method cannot.",
  },
});
