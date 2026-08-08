/* AUTO-GENERATED from pattern-visitor.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { PatternFigure, KnobBar, treeLayout, ClassTree, DiagramCard, UmlLink, SvgCode, svgCodeSize, diagramCardHeight, ab } from "@course";

/* note 22 — Visitor, with a knob for the deck's two casts.

   Like Bridge, this is TWO hierarchies with one link between them, so it skips
   patternTree and places both trees itself. The rejected half is a DIAGRAM, which is
   what earns the CrossOut PatternFigure stamps on it — the deck draws its red X over
   exactly this: the Shape hierarchy reopened to bolt rotate() and resize() on.

   Two dashed dependency arrows run BOTH ways between the parents, and that mutual
   dependency is the honest picture: Shape.accept takes a Visitor, Visitor.visit takes
   a Shape. Neither can be compiled without the other, which is the price the pattern
   charges and the reason a new Shape reopens every visitor.

   The hospital cast is asymmetric on purpose — the deck really does draw a single
   Patient there. The lesson survives it: the VISITOR side is the pattern, the element
   side is whatever you already had, one class or ten. */

const PAD = 14,
  CARD_W = 132,
  GAP = 12,
  MID = 84,
  FORK = 32;
const leaf = (title, attrs, ops) => ({
  title,
  sections: attrs ? [{
    rows: attrs
  }, {
    rows: ops
  }] : [{
    rows: ops
  }]
});
const CASTS = {
  shapes: {
    label: "Shapes",
    elementType: "Shape",
    visitorParent: {
      title: "Visitor",
      abstract: true,
      sections: [{
        rows: [ab("visit(Shape)")]
      }]
    },
    visitors: ["Rotator", "Resizer", "Flipper"].map(t => leaf(t, null, ["visit(Shape)"])),
    elementParent: {
      title: "Shape",
      abstract: true,
      sections: [{
        rows: ["color"]
      }, {
        rows: [ab("accept(Visitor)")]
      }]
    },
    elements: [leaf("Circle", ["radius"], ["accept(Visitor)"]), leaf("Rectangle", ["width", "length"], ["accept(Visitor)"]), leaf("Triangle", ["base", "height"], ["accept(Visitor)"])],
    badParent: {
      title: "Shape",
      abstract: true,
      sections: [{
        rows: ["color"]
      }, {
        rows: [ab("rotate()"), ab("resize()")]
      }]
    },
    badElements: [leaf("Circle", ["radius"], ["rotate()", "resize()"]), leaf("Rectangle", ["width", "length"], ["rotate()", "resize()"]), leaf("Triangle", ["base", "height"], ["rotate()", "resize()"])],
    badNote: "Every new operation reopens the abstract class **and** all three subclasses — four edits for one feature, and the fourth shape makes it five. This is note 16's Open–Closed violation in its plainest form: the hierarchy is closed for extension in the direction the work actually keeps arriving from.",
    client: `Shape s = new Circle(5);
Visitor v = new Rotator();

s.accept(v);           // runs Rotator's code for a Circle

v = new Resizer();
s.accept(v);           // same shape, a different operation

// adding a Flipper touches no Shape class at all`,
    clientNote: "`Shape` never gains a method. `accept` is the only thing it ever needs, and its body is one line long, forever.",
    cols: [{
      tag: "elements",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The hierarchy you already had. It is closed: adding ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Flipper"), " does not reopen ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Circle"), ", ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Rectangle"), " or ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Triangle"), ".")
    }, {
      tag: "visitors",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The new axis. One visitor is one operation across the ", /*#__PURE__*/React.createElement("em", null, "whole"), " hierarchy, so all the code for rotating lives in one class instead of scattered across three.")
    }]
  },
  hospital: {
    label: "Hospital",
    elementType: "Patient",
    visitorParent: {
      title: "Visitor",
      abstract: true,
      sections: [{
        rows: [ab("visit(Patient)")]
      }]
    },
    visitors: ["Physician", "Nurse", "Surgeon"].map(t => leaf(t, null, ["visit(Patient)"])),
    elementParent: {
      title: "Patient",
      sections: [{
        rows: ["name", "age"]
      }, {
        rows: ["accept(Visitor)"]
      }]
    },
    elements: [],
    badParent: {
      title: "Patient",
      sections: [{
        rows: ["name", "age"]
      }, {
        rows: ["examine()", "operate()", "medicate()"]
      }]
    },
    badElements: [],
    badNote: "One class made to know every profession that will ever walk into the room. A hospital hires a physiotherapist and `Patient` — a record of a person — has to be recompiled. The class grows along an axis that has nothing to do with what a patient *is*.",
    client: `Patient p = new Patient("Ada", 34);
Visitor v = new Surgeon();

p.accept(v);           // runs the Surgeon's code for this patient

v = new Nurse();
p.accept(v);           // same patient, a different professional

// hiring a physiotherapist touches no Patient code`,
    clientNote: "The staff list can grow all week. `Patient` keeps exactly the one method it started with — which is the deck's point in choosing a hospital: the *people who visit* change constantly, the *thing they visit* does not.",
    cols: [{
      tag: "element",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Patient"), " record. Stable, and deliberately ignorant of who will be treating it.")
    }, {
      tag: "visitors",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The staff. Each profession is one class holding everything that profession does \u2014 and a new profession is a new class, not an edit.")
    }]
  }
};
const KNOBS = [{
  id: "cast",
  label: "cast",
  options: [{
    value: "shapes",
    label: "Shapes · Rotator / Resizer"
  }, {
    value: "hospital",
    label: "Hospital · Patient"
  }]
}];

// The rejected half: the element side with every operation bolted onto it.
// A hierarchy renders as a tree; a lone class (the hospital cast) as one card.
function badHalf(c) {
  if (c.badElements.length) {
    const T = treeLayout({
      cx: 0,
      topY: PAD,
      cardW: CARD_W,
      gap: GAP,
      forkGap: FORK,
      parent: c.badParent,
      children: c.badElements
    });
    const dx = PAD - T.left;
    const w = Math.round(T.right + dx + PAD),
      h = Math.round(T.bottom + PAD);
    return {
      width: w,
      height: h,
      viewBox: `0 0 ${w} ${h}`,
      maxWidth: 560,
      note: c.badNote,
      ariaLabel: `An abstract Shape class carrying colour plus abstract rotate and resize, above Circle, Rectangle and Triangle, each of which implements rotate and resize itself. The whole diagram is crossed out.`,
      node: /*#__PURE__*/React.createElement("g", {
        transform: `translate(${dx}, 0)`
      }, /*#__PURE__*/React.createElement(ClassTree, {
        layout: T
      }))
    };
  }
  const h0 = diagramCardHeight(c.badParent.sections, {
    title: true
  });
  const w = CARD_W + 40 + 2 * PAD,
    h = h0 + 2 * PAD;
  return {
    width: w,
    height: h,
    viewBox: `0 0 ${w} ${h}`,
    maxWidth: 300,
    note: c.badNote,
    ariaLabel: "A single Patient class carrying name and age plus examine, operate and medicate. The diagram is crossed out.",
    node: /*#__PURE__*/React.createElement(DiagramCard, {
      x: PAD,
      y: PAD,
      w: CARD_W + 40,
      title: c.badParent.title,
      sections: c.badParent.sections,
      neutral: true
    })
  };
}

// The pattern: visitor hierarchy on the left, element side on the right, joined by the
// two dashed dependencies. Parent cards are centred on a shared axis so both read flat.
function goodHalf(c) {
  const A = treeLayout({
    cx: 0,
    topY: PAD,
    cardW: CARD_W,
    gap: GAP,
    forkGap: FORK,
    parent: c.visitorParent,
    children: c.visitors
  });
  const aH = A.parent.h;
  const hasTree = c.elements.length > 0;
  const B = hasTree ? treeLayout({
    cx: 0,
    topY: PAD,
    cardW: CARD_W,
    gap: GAP,
    forkGap: FORK,
    parent: c.elementParent,
    children: c.elements
  }) : null;
  const bH = hasTree ? B.parent.h : diagramCardHeight(c.elementParent.sections, {
    title: true
  });
  const bW = hasTree ? CARD_W : CARD_W + 30;

  // align the two parent cards on one horizontal axis
  const axis = PAD + Math.max(aH, bH) / 2;
  const aDy = axis - aH / 2 - PAD;
  const bDy = axis - bH / 2 - PAD;
  const aShift = PAD - A.left;
  const aRight = A.right + aShift;
  const bLeft = aRight + MID;
  const bShift = hasTree ? bLeft - B.left : 0;
  const bX = hasTree ? null : bLeft;
  const aParentRight = A.parent.cx + aShift + CARD_W / 2;
  const bParentLeft = hasTree ? B.parent.cx + bShift - CARD_W / 2 : bX;
  const bParentCx = hasTree ? B.parent.cx + bShift : bX + bW / 2;
  const ACCEPT = ["visitor.visit(this);"];
  const acceptTitle = `${c.elementType}.accept(v : Visitor)`;
  const aSize = svgCodeSize(ACCEPT, acceptTitle);

  // the callout belongs under the ELEMENT side, whose accept() body it is — not under
  // whichever of the two trees happens to be taller.
  const elementBottom = hasTree ? B.bottom + bDy : PAD + bDy + bH;
  const codeY = elementBottom + 20;
  const codeX = Math.max(bParentCx - aSize.w / 2, bParentLeft - 20);
  const rightEdge = hasTree ? B.right + bShift : bX + bW;
  const W = Math.round(Math.max(rightEdge, codeX + aSize.w) + PAD);
  const H = Math.round(Math.max(codeY + aSize.h, A.bottom + aDy) + 22 + PAD);
  return {
    width: W,
    height: H,
    viewBox: `0 0 ${W} ${H}`,
    maxWidth: 880,
    ariaLabel: `An abstract Visitor declaring visit of a ${c.elementType}, with ${c.visitors.map(v => v.title).join(", ")} inheriting from it and each implementing visit. On the right, ${hasTree ? `an abstract ${c.elementType} with accept of a Visitor, above ${c.elements.map(e => e.title).join(", ")}` : `a ${c.elementType} class with accept of a Visitor`}. Two dashed dependency arrows run between the two parents, one in each direction. A code callout gives the body of accept: visitor dot visit of this.`,
    node: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
      transform: `translate(${aShift}, ${aDy})`
    }, /*#__PURE__*/React.createElement(ClassTree, {
      layout: A
    })), hasTree ? /*#__PURE__*/React.createElement("g", {
      transform: `translate(${bShift}, ${bDy})`
    }, /*#__PURE__*/React.createElement(ClassTree, {
      layout: B
    })) : /*#__PURE__*/React.createElement(DiagramCard, {
      x: bX,
      y: PAD + bDy,
      w: bW,
      title: c.elementParent.title,
      sections: c.elementParent.sections,
      neutral: true
    }), /*#__PURE__*/React.createElement(UmlLink, {
      kind: "depend",
      from: {
        x: bParentLeft,
        y: axis - 11
      },
      to: {
        x: aParentRight,
        y: axis - 11
      }
    }), /*#__PURE__*/React.createElement(UmlLink, {
      kind: "depend",
      from: {
        x: aParentRight,
        y: axis + 11
      },
      to: {
        x: bParentLeft,
        y: axis + 11
      }
    }), /*#__PURE__*/React.createElement(SvgCode, {
      x: codeX,
      y: codeY,
      lines: ACCEPT,
      title: acceptTitle
    }), /*#__PURE__*/React.createElement("text", {
      x: W / 2,
      y: H - 8,
      textAnchor: "middle",
      style: {
        fill: "var(--mm-muted)",
        fontSize: 11
      }
    }, "a new operation is a new class on the left \u2014 the right side is never reopened")),
    note: "`accept` is one line, and it is the whole pattern. Handing the visitor `this` is what lets the visitor's code know **which** concrete element it received — a second dispatch, bought by hand, because the language only gives you one."
  };
}
export default function PatternVisitor() {
  const [cast, setCast] = React.useState("shapes");
  const c = CASTS[cast];
  return /*#__PURE__*/React.createElement("div", {
    className: "mm-scene"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mm-scene__title",
    "data-artifact-title": true
  }, "Visitor \u2014 the operation leaves the hierarchy"), /*#__PURE__*/React.createElement(KnobBar, {
    knobs: KNOBS,
    value: {
      cast
    },
    onChange: (_, v) => setCast(v)
  }), /*#__PURE__*/React.createElement(PatternFigure, {
    intent: "[Add additional behavior to an entity without changing its structure]",
    bad: badHalf(c),
    good: goodHalf(c),
    goodTag: `the pattern · ${c.label}`,
    client: {
      code: c.client,
      lang: "java",
      label: "client code"
    },
    caption: {
      cols: c.cols,
      punch: "Visitor buys Open–Closed for operations by spending it on types. A new visitor costs one class and touches nothing; a new element kind costs an edit in every visitor there is. Reach for it when the hierarchy is stable and the list of things you do to it is not."
    }
  }));
}