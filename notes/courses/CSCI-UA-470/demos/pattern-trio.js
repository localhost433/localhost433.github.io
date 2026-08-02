/* AUTO-GENERATED from pattern-trio.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { PatternFigure, patternTree, KnobBar, ab } from "@course";

/* note 21 — Strategy, State and Command drawn ONCE, with a knob for the cast.
   L20 gives all three the same picture and even the same method name (`run()`),
   which is not sloppiness — it is the lesson. Three different problems collapse to
   one structure: replace a String field plus an if-chain with a field of an abstract
   type plus one polymorphic call.

   Splitting these into three near-identical figures would hide exactly what the
   student needs to see. What actually separates them is intent, and that lives in
   the caption (and in the note's "telling the trio apart" section), not in the UML. */

const role = (title, kids) => ({
  parent: {
    title,
    abstract: true,
    sections: [{
      rows: [ab("+ run()")]
    }]
  },
  children: kids.map(k => ({
    title: k,
    sections: [{
      rows: ["+ run()"]
    }]
  }))
});
const CASTS = {
  strategy: {
    label: "Strategy",
    intent: "[Define a family of approaches & make them interchangeable]",
    context: {
      title: "Team",
      sections: [{
        rows: ["- name : String", "- strategy : Strategy"]
      }, {
        rows: ["+ play()"]
      }]
    },
    edgeLabel: "strategy.run()",
    ...role("Strategy", ["Man-To-Man", "Zone-Defense", "Attack"]),
    bad: `class Team {
    String name;
    String strategy;              // "Zone-Defense" | "Man-To-Man" | "Attack"

    void play() {
        if      (strategy.equals("Zone-Defense")) { ... }
        else if (strategy.equals("Man-To-Man"))   { ... }
        else                                      { ... }
    }
}`,
    badNote: "A String naming a behaviour, and a method that switches on it. Every new tactic reopens `play()`.",
    client: `Team t = new Team();
t.strategy = new Attack();     // not the string "Attack"
t.play();`,
    cols: [{
      tag: "who picks",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement("strong", null, "client"), " chooses, up front, and usually leaves it. A team does not decide mid-match to become man-to-man on its own.")
    }, {
      tag: "what varies",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Interchangeable ", /*#__PURE__*/React.createElement("strong", null, "ways of doing one job"), ". Any strategy is a complete, valid answer to ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "play()"), ".")
    }]
  },
  state: {
    label: "State",
    intent: "[Let an object alter its behavior when changing state]",
    context: {
      title: "Phone",
      sections: [{
        rows: ["- model : String", "- state : State"]
      }, {
        rows: ["+ receiveSMS()", "+ setState(s)"]
      }]
    },
    edgeLabel: "state.run()",
    ...role("State", ["Normal", "Silent", "Vibrate"]),
    bad: `class Phone {
    String model;
    String state;                 // "normal" | "silent" | "vibrate"

    void receiveSMS() {
        if      (state.equals("normal")) { ring(); }
        else if (state.equals("silent")) { }
        else                             { vibrate(); }
    }
}`,
    badNote: "Identical shape to Strategy's rejected half — and to Command's. That is the point: one smell, three problems.",
    client: `Phone p1 = new Phone();
p1.setState(new Vibrate());    // and it will change again later
p1.receiveSMS();`,
    cols: [{
      tag: "who picks",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement("strong", null, "object's own history"), " does. A phone moves between modes over its lifetime, and the state can drive the next transition itself.")
    }, {
      tag: "what varies",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "What ", /*#__PURE__*/React.createElement("strong", null, "the same call"), " does at different moments. ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "receiveSMS()"), " rings now and buzzes later, with no change at the call site.")
    }]
  },
  command: {
    label: "Command",
    intent: "[Decouple object that invokes the operation from execution]",
    context: {
      title: "Soldier",
      sections: [{
        rows: ["- command : Command"]
      }, {
        rows: ["+ execute()", "+ setCommand(c)"]
      }]
    },
    edgeLabel: "command.run()",
    ...role("Command", ["Drive", "Arrest", "Attack"]),
    bad: `class Soldier {
    String command;               // "Drive" | "Arrest" | "Attack"

    void execute() {
        if      (command.equals("Drive"))  { ... }
        else if (command.equals("Arrest")) { ... }
        else                               { ... }
    }
}`,
    badNote: "The third copy of the same rejected design. If you can spot one of these, you can spot all three — telling them apart is the harder skill.",
    client: `Soldier s1 = new Soldier();
s1.setCommand(new Drive());    // an object, so it can be stored,
s1.execute();                  // queued, logged, or handed on`,
    cols: [{
      tag: "who picks",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "Whoever ", /*#__PURE__*/React.createElement("strong", null, "issues"), " the request \u2014 and the issuer and the receiver need never meet. The command object travels between them.")
    }, {
      tag: "what varies",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement("strong", null, "request itself becomes an object"), ", so it can be put in a list, replayed, queued, or undone. Neither neighbour aims at that.")
    }]
  }
};
const KNOBS = [{
  id: "cast",
  label: "cast",
  options: [{
    value: "strategy",
    label: "Strategy · Team"
  }, {
    value: "state",
    label: "State · Phone"
  }, {
    value: "command",
    label: "Command · Soldier"
  }]
}];
export default function PatternTrio() {
  const [cast, setCast] = React.useState("strategy");
  const c = CASTS[cast];
  const T = patternTree({
    contextW: 232,
    gapX: 50,
    edge: "assoc",
    edgeLabel: c.edgeLabel,
    context: c.context,
    parent: c.parent,
    children: c.children,
    cardW: 138,
    gap: 18
  });
  T.maxWidth = 760;
  T.ariaLabel = `${c.label}: a ${c.context.title} holds a ${c.parent.title} and delegates to run(). ${c.parent.title} is the parent of ${c.children.map(k => k.title).join(", ")}.`;
  return /*#__PURE__*/React.createElement("div", {
    className: "mm-scene"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mm-scene__title",
    "data-artifact-title": true
  }, "Strategy, State, Command \u2014 one picture, three meanings"), /*#__PURE__*/React.createElement(KnobBar, {
    knobs: KNOBS,
    value: {
      cast
    },
    onChange: (_, v) => setCast(v)
  }), /*#__PURE__*/React.createElement(PatternFigure, {
    intent: c.intent,
    bad: {
      code: c.bad,
      lang: "java",
      note: c.badNote
    },
    good: T,
    goodTag: `the pattern · ${c.label}`,
    client: {
      code: c.client,
      lang: "java",
      label: "client code"
    },
    caption: {
      cols: c.cols,
      punch: "Switch the knob and only the words change — the boxes, the arrows and the delegating call are identical in all three. Structure cannot tell these apart; intent can."
    }
  }));
}