/* AUTO-GENERATED from pattern-chain.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { patternFigure, patternTree, SvgCode, svgCodeSize, ab } from "@course";

/* note 21 — Chain of Responsibilities. The deck's payoff is three DIFFERENT
   escalation orders built from the SAME four handler classes (Secretary, Chair,
   Dean, Assistant — a student request climbing the ladder), so the figure's job is
   to make `nextHandler` conspicuous: it is a Handler field on Handler, which is the
   self-reference that turns a hierarchy into a chain.

   The client half shows the deck's three wirings, because a single wiring looks
   like an ordinary delegation and hides the entire point. */

const BODY = ["// can I deal with this?", "if (canHandle(a))", "    approve(a);", "else if (nextHandler != null)", "    nextHandler.handle(a);"];
const T = patternTree({
  place: "above",
  contextW: 208,
  gapY: 44,
  edge: "depend",
  edgeLabel: "handles",
  context: {
    title: "Application",
    sections: [{
      rows: ["- student : String", "- request : String"]
    }]
  },
  parent: {
    title: "Handler",
    abstract: true,
    sections: [{
      rows: ["- nextHandler : Handler"]
    }, {
      rows: [ab("+ handle(a)")]
    }]
  },
  children: ["Secretary", "Chair", "Dean", "Assistant"].map(t => ({
    title: t,
    sections: [{
      rows: ["+ handle(a)"]
    }]
  })),
  cardW: 138,
  gap: 16,
  note: "nextHandler is a Handler — that self-reference is what makes a chain"
});
const body = svgCodeSize(BODY, "Handler.handle(a)");
const W = Math.round(Math.max(T.width, 14 + body.w + 14));
const H = Math.round(T.height + body.h + 6);
export default patternFigure({
  title: "Chain of Responsibilities — the same four, rewired",
  intent: "[Avoid coupling between request & receiver · enables adding and removing receivers freely]",
  bad: {
    lang: "java",
    code: `// routine form — settled at the front desk
if (!secretary.handle(a)) if (!chair.handle(a)) dean.handle(a);

// grade appeal — different people, different order
if (!chair.handle(a)) if (!dean.handle(a)) assistant.handle(a);

// urgent case — skips two rungs
if (!dean.handle(a)) assistant.handle(a);`,
    note: "Three hard-coded ladders for three kinds of student request, and a fourth kind means a fourth ladder. The sender has to know every possible receiver **and** the order they come in — which is precisely the coupling the pattern exists to remove."
  },
  good: {
    width: W,
    height: H,
    viewBox: `0 0 ${W} ${H}`,
    maxWidth: 780,
    ariaLabel: "An Application class with student and request sits above an abstract Handler and depends on it. Handler holds nextHandler, itself a Handler, and declares an abstract handle(a). Secretary, Chair, Dean and Assistant each inherit from Handler and override handle. The handle body approves the request if it can, and otherwise forwards it to nextHandler.",
    node: /*#__PURE__*/React.createElement("g", null, T.node, /*#__PURE__*/React.createElement(SvgCode, {
      x: 14,
      y: T.height - 4,
      lines: BODY,
      title: "Handler.handle(a)"
    }))
  },
  client: {
    lang: "java",
    label: "client code — three chains, same four classes",
    code: `Handler s = new Secretary(), c = new Chair(),
        d = new Dean(),      A = new Assistant();

s.nextHandler = c;  c.nextHandler = d;  d.nextHandler = A;
s.handle(a);           // the routine route: starts at the secretary

s.nextHandler = d;  d.nextHandler = c;  c.nextHandler = A;
s.handle(a);           // same classes, new order — nothing recompiled

c.nextHandler = d;  d.nextHandler = A;  A.nextHandler = s;
c.handle(a);           // starts mid-ladder; the secretary is last resort`,
    note: "Not one class changed between the three blocks — only `nextHandler` assignments. The chain is **data**, so it can come from a config file, differ per request type, or be rebuilt while the program runs."
  },
  caption: {
    cols: [{
      tag: "sender",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Knows ", /*#__PURE__*/React.createElement("strong", null, "one"), " handler and nothing about the rest. It does not know who will answer, how many were asked, or whether anyone did.")
    }, {
      tag: "chain",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Each handler knows only its ", /*#__PURE__*/React.createElement("strong", null, "successor"), ". Insert, remove, or reorder by assigning a field \u2014 no class is edited and no subclass is added.")
    }],
    punch: "The exam tell is a field whose type is the class's own abstract parent, plus a method that ends by calling that field's version of itself. If the request can be passed on, it is a chain; if it is always handled where it lands, it is not."
  }
});