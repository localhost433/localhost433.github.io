/* AUTO-GENERATED from pattern-mediator.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { patternFigure, patternTree, SvgCode, svgCodeSize, ab } from "@course";

/* note 21 — Mediator. The deck draws the rejected half as a scribble of arrows
   between four boxes; the honest translation into code is a class holding a list of
   its peers and looping over it, which is what a "mesh" actually is once you type it.

   Paired deliberately with pattern-observer: the two UML pictures are near-identical
   and the note's "Mediator vs Observer" section is where they separate. The one
   structural difference visible here is `if (c != sender)` — a colleague does not
   receive its own message, because it was the one talking. */

const BODY = ["for (c : colleagues)", "    if (c != sender)", "        c.receiveNotification(msg);"];
const T = patternTree({
  contextW: 262,
  gapX: 46,
  edge: "aggregate",
  edgeLabel: "colleagues",
  context: {
    title: "Mediator",
    sections: [{
      rows: ["- colleagues : List<Colleague>"]
    }, {
      rows: ["+ broadcast(sender, msg)"]
    }]
  },
  parent: {
    title: "«interface» Colleague",
    abstract: true,
    sections: [{
      rows: [ab("+ receiveNotification(msg)")]
    }]
  },
  children: ["Colleague-1", "Colleague-2", "Colleague-3"].map(t => ({
    title: t,
    sections: [{
      rows: ["+ receiveNotification(msg)"]
    }]
  })),
  relation: "implements",
  cardW: 202,
  gap: 14
});
const body = svgCodeSize(BODY, "Mediator.broadcast(sender, msg)");
const W = Math.round(Math.max(T.width, 14 + body.w + 14));
const H = Math.round(T.height + body.h + 6);
export default patternFigure({
  title: "Mediator — everyone talks to the hub, nobody to each other",
  intent: "[Reduce chaotic dependencies between objects]",
  bad: {
    lang: "java",
    code: `class Colleague {
    List<Colleague> others;               // every peer knows every other peer

    void say(String msg) {
        for (Colleague c : others) c.receiveNotification(msg);
    }
}

// n colleagues -> n(n-1) references to create, wire, and unwire.
// Adding a fifth means editing the four that already exist.`,
    note: "The deck draws this as a scribble of crossing arrows. Typed out, it is worse than it looks: each peer carries the membership list, so joining, leaving, or muting anyone is a change in **every** other class."
  },
  good: {
    width: W,
    height: H,
    viewBox: `0 0 ${W} ${H}`,
    maxWidth: 840,
    ariaLabel: "A Mediator class holds colleagues, a List of Colleague, and offers broadcast(sender, msg). It aggregates the Colleague interface, which declares receiveNotification and is realised by Colleague-1, Colleague-2 and Colleague-3. The broadcast body loops over the colleagues and notifies every one except the sender.",
    node: /*#__PURE__*/React.createElement("g", null, T.node, /*#__PURE__*/React.createElement(SvgCode, {
      x: 14,
      y: T.height - 4,
      lines: BODY,
      title: "Mediator.broadcast(sender, msg)"
    }))
  },
  client: {
    lang: "java",
    label: "client code",
    code: `Mediator room = new Mediator();
room.colleagues.add(c1);
room.colleagues.add(c2);
room.colleagues.add(c3);

room.broadcast(c1, "the build is red");   // c2 and c3 hear it; c1 does not`,
    note: "`c1` names no recipient and holds no list. It knows the room, and the room knows who is in it — so adding `c4` is one line here and no change anywhere else."
  },
  caption: {
    cols: [{
      tag: "before",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Many-to-many: ", /*#__PURE__*/React.createElement("strong", null, "n(n\u22121)"), " references, each peer maintaining its own copy of who exists.")
    }, {
      tag: "after",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Hub-and-spoke: ", /*#__PURE__*/React.createElement("strong", null, "n"), " references, all held by one object whose entire job is knowing the membership.")
    }],
    punch: "The one line of logic that is peculiar to Mediator is the sender check: a colleague does not receive its own message, because it is the one that spoke. Observer's loop has no such test."
  }
});