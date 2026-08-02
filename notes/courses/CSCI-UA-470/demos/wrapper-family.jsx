import React from "react";
import { DiagramSvg, DiagramBox, DiagramEdge } from "@course";

/* note 20 — the section that earns the note. Four of L19's seven patterns put an
   object in front of another object, which is why they are the ones that get
   confused. Two questions separate all four, and this is that decision tree.

   Q1 is about the CLIENT's view: does the call site still look the same?
   Q2 splits each side by what the wrapper is for. Every "which pattern is this?"
   question about a wrapper is answerable by walking these two edges. */

const W = 760, H = 300;
const MID_Y = 128, LEAF_Y = 240;
const HALF = 18;                                  // DiagramBox default half-height

const mid = [
  { cx: 190, label: "a NEW interface", note: "the call site changes" },
  { cx: 570, label: "the SAME interface", note: "the call site does not" },
];
const leaves = [
  { cx: 100, label: "Adapter", note: "one class made to fit", sub: 2 },
  { cx: 290, label: "Facade", note: "many classes, one door", sub: 3 },
  { cx: 480, label: "Proxy", note: "gates or defers the call", sub: 2 },
  { cx: 660, label: "Decorator", note: "adds behaviour, stacks", sub: 3 },
];
const edgeLabels = ["one class", "a subsystem", "controls", "adds"];

export default function WrapperFamily() {
  return (
    <div className="mm-scene">
      <div className="mm-scene__title" data-artifact-title>Which wrapper is it? Two questions</div>
      <DiagramSvg viewBox={`0 0 ${W} ${H}`} maxWidth={760}
        ariaLabel="A decision tree for the four wrapper patterns. Start from: this object wraps another. If the client sees a new interface, then one wrapped class means Adapter and a whole subsystem means Facade. If the client sees the same interface, then controlling the call means Proxy and adding behaviour that stacks means Decorator.">
        <DiagramBox cx={W / 2} cy={34} w={330} h={40}
          label="an object wraps another object" note="what does the CLIENT see?" sub={0} />
        {mid.map((m, i) => (
          <React.Fragment key={m.label}>
            <DiagramEdge from={{ x: W / 2, y: 54 }} to={{ x: m.cx, y: MID_Y - HALF }} />
            <DiagramBox cx={m.cx} cy={MID_Y} w={230} h={40} label={m.label} note={m.note} sub={1} />
          </React.Fragment>
        ))}
        {leaves.map((l, i) => (
          <React.Fragment key={l.label}>
            <DiagramEdge from={{ x: mid[i < 2 ? 0 : 1].cx, y: MID_Y + 20 }}
              to={{ x: l.cx, y: LEAF_Y - HALF }} label={edgeLabels[i]} />
            <DiagramBox cx={l.cx} cy={LEAF_Y} w={168} h={40} label={l.label} note={l.note} sub={l.sub} />
          </React.Fragment>
        ))}
      </DiagramSvg>
      <div className="mm-scene__caption mm-scene__caption--struct">
        <p className="mm-cap-row">
          <span className="mm-cap-tag mm-cap-tag--cpp">Q1</span>
          <span className="mm-cap-txt">
            <strong>Does the call site change?</strong> Adapter and Facade give the client something it
            could not write before — a different method set, or a smaller one. Proxy and Decorator are
            invisible: the client's line is identical with or without them, which is why both can be
            slipped in after the fact.
          </span>
        </p>
        <p className="mm-cap-row">
          <span className="mm-cap-tag mm-cap-tag--int">Q2</span>
          <span className="mm-cap-txt">
            <strong>What is the wrapper for?</strong> Adapter wraps <em>one</em> incompatible class;
            Facade fronts <em>several</em> collaborating ones. Proxy decides whether and when the call
            gets through; Decorator lets it through and adds to it — and, unlike the other three,
            <strong> stacks</strong>, because a decorator can wrap a decorator.
          </span>
        </p>
        <p className="mm-cap-row">
          <span className="mm-cap-tag mm-cap-tag--java">tell</span>
          <span className="mm-cap-txt">
            When two of them still look plausible, ask whether wrapping the wrapper would make sense.
            Only Decorator is designed for it.
          </span>
        </p>
      </div>
    </div>
  );
}
