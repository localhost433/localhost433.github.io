/* AUTO-GENERATED from uml-code-relationships.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramCard, UmlLink, CodeBlock, diagramCardHeight, cls } from "@course";
import { Button } from "@kit";

/* note 15 — the heart of L15: each class-diagram relationship IS a line of Java.
   One step per relationship, the UML edge on the left and the code it compiles
   to on the right. The two ends of every step use the lecture's own examples
   (Person/Employee, Drawable/Shape, Person/Address, Manager/Worker, Person/Hand,
   LotteryTicket/Random) so the note's prose can point at them by name.
   Dependency deliberately shows BOTH code forms — the local `new` and the
   parameter — because that is the exam trap. */

const steps = [{
  key: "generalization",
  label: "generalization",
  kind: "generalize",
  top: cls("Person", [], []),
  bottom: cls("Employee", [], []),
  code: "class Person {\n    ...\n}\nclass Employee extends Person {\n    ...\n}",
  caption: "An is-a between two classes: solid line, hollow triangle at the parent. It's the triangle — not where the boxes sit — that names the parent, so the layout is free: stacked here, side-by-side below, the meaning is identical. In code it is exactly `extends` — the child inherits the parent's whole interface."
}, {
  key: "realization",
  label: "realization",
  kind: "realize",
  top: {
    title: "«interface» Drawable",
    abstract: true,
    sections: [{
      rows: []
    }]
  },
  bottom: cls("Shape", [], []),
  code: "interface Drawable {\n    ...\n}\nclass Shape implements Drawable {\n    ...\n}",
  caption: "The same hollow triangle but a DASHED line, and the parent is an «interface». In code the keyword changes with the line style: `implements`, not `extends`."
}, {
  key: "association",
  label: "association",
  kind: "assoc",
  horizontal: true,
  top: cls("Person", [], []),
  bottom: cls("Address", [], []),
  code: "class Address {\n    ...\n}\nclass Person {\n    Address a;   // knows-about\n}",
  caption: "A plain line: Person knows about Address. In code, an association is a FIELD whose type is the other class. The object lives on independently of who refers to it."
}, {
  key: "aggregation",
  label: "aggregation",
  kind: "aggregate",
  horizontal: true,
  top: cls("Manager", [], []),
  bottom: cls("Worker", [], []),
  code: "class Worker {\n    ...\n}\nclass Manager {\n    List<Worker> workers;  // has-a\n}",
  caption: "The HOLLOW diamond sits at the whole (Manager). In code it is still a field — typically a collection — but the parts are constructed elsewhere and OUTLIVE the whole: fire the manager, keep the workers."
}, {
  key: "composition",
  label: "composition",
  kind: "compose",
  horizontal: true,
  top: cls("Person", [], []),
  bottom: cls("Hand", [], []),
  code: "class Person {\n    class Hand {     // part declared inside the whole\n        ...\n    }\n    List<Hand> hands;\n}",
  caption: "The FILLED diamond: the parts are entirely made of the whole and die with it. The lecture's code form makes that literal — `Hand` is declared INSIDE `Person`, so no hand exists without its person."
}, {
  key: "dependency",
  label: "dependency",
  kind: "depend",
  horizontal: true,
  top: cls("LotteryTicket", ["+ num : int"], ["+ someMethod()"]),
  bottom: cls("Random", [], []),
  code: "class LotteryTicket {\n    int num;\n    void someMethod() {\n        Random r = new Random(); // form 1: local\n        num = r.nextInt();\n    }\n}\n// OR\nclass LotteryTicket {\n    void someMethod(Random r) { // form 2: parameter\n        ...\n    }\n}",
  caption: "Dashed open arrow: uses TEMPORARILY. No field at all — the other class appears only inside a method, either as a local `new` or as a parameter. When the method returns, the relationship is over."
}];
const CARD_W = 190;
function StepDiagram({
  step
}) {
  const topH = diagramCardHeight(step.top.sections);
  const botH = diagramCardHeight(step.bottom.sections);
  if (step.horizontal) {
    const y = 40,
      x1 = 20,
      x2 = 320;
    const midY = y + Math.max(topH, botH) / 2;
    return /*#__PURE__*/React.createElement(DiagramSvg, {
      viewBox: "0 0 540 170",
      maxWidth: 560,
      ariaLabel: `UML ${step.label}: ${step.top.title} ${step.label === "dependency" ? "depends on" : "linked to"} ${step.bottom.title}.`
    }, /*#__PURE__*/React.createElement(UmlLink, {
      from: {
        x: x1 + CARD_W,
        y: midY
      },
      to: {
        x: x2,
        y: midY
      },
      kind: step.kind
    }), /*#__PURE__*/React.createElement(DiagramCard, {
      x: x1,
      y: y,
      w: CARD_W,
      title: step.top.title,
      sections: step.top.sections,
      abstract: step.top.abstract,
      sub: 0
    }), /*#__PURE__*/React.createElement(DiagramCard, {
      x: x2,
      y: y,
      w: CARD_W,
      title: step.bottom.title,
      sections: step.bottom.sections,
      sub: 2
    }));
  }
  // vertical: child below, arrow UP to the parent (generalization / realization)
  const x = 175,
    topY = 16,
    botY = topY + topH + 56;
  const H = botY + botH + 16;
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: `0 0 540 ${H}`,
    maxWidth: 560,
    ariaLabel: `UML ${step.label}: ${step.bottom.title} points up to ${step.top.title} with a hollow triangle${step.kind === "realize" ? " on a dashed line" : ""}.`
  }, /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: x + CARD_W / 2,
      y: botY
    },
    to: {
      x: x + CARD_W / 2,
      y: topY + topH
    },
    kind: step.kind
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: x,
    y: topY,
    w: CARD_W,
    title: step.top.title,
    sections: step.top.sections,
    abstract: step.top.abstract,
    sub: 0
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: x,
    y: botY,
    w: CARD_W,
    title: step.bottom.title,
    sections: step.bottom.sections,
    sub: 2
  }));
}
function renderInline(text) {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`")) return /*#__PURE__*/React.createElement("code", {
      key: i,
      className: "mm-ic"
    }, p.slice(1, -1));
    if (p.startsWith("**") && p.endsWith("**")) return /*#__PURE__*/React.createElement("strong", {
      key: i
    }, p.slice(2, -2));
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, p);
  });
}
export default function UmlCodeRelationships() {
  const [i, setI] = React.useState(0);
  const step = steps[i];
  return /*#__PURE__*/React.createElement("div", {
    className: "mm-scene"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mm-scene__title",
    "data-artifact-title": true
  }, "Six relationships, six shapes of Java"), /*#__PURE__*/React.createElement(StepDiagram, {
    step: step
  }), /*#__PURE__*/React.createElement(CodeBlock, {
    code: step.code,
    lang: "java"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mm-scene__caption mm-scene__caption--struct"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mm-cap-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mm-cap-tag mm-cap-tag--java"
  }, step.label.toUpperCase()), /*#__PURE__*/React.createElement("span", {
    className: "mm-cap-txt"
  }, renderInline(step.caption)))), /*#__PURE__*/React.createElement("div", {
    className: "mm-scene__nav"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    disabled: i === 0,
    onClick: () => setI(0)
  }, "Reset"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    disabled: i === 0,
    onClick: () => setI(i - 1)
  }, "Back"), /*#__PURE__*/React.createElement("div", {
    className: "mm-scene__dots",
    role: "tablist"
  }, steps.map((s, n) => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    type: "button",
    "aria-label": "Step " + (n + 1) + ": " + s.label,
    "aria-selected": n === i,
    className: "mm-dot" + (n === i ? " mm-dot--on" : ""),
    onClick: () => setI(n)
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    disabled: i === steps.length - 1,
    onClick: () => setI(i + 1)
  }, "Next"), /*#__PURE__*/React.createElement("span", {
    className: "mm-scene__step"
  }, i + 1, " / ", steps.length)));
}