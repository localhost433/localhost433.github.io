/* AUTO-GENERATED from uml-v6.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { DiagramSvg, DiagramCard, treeLayout, ClassTree, UmlLink, diagramCardHeight, ab, cls } from "@course";

/* v6 (note 09) — interface polymorphism. THREE trees (Shape / Vehicle / Animal,
   per the v6 code) plus the Drawable and Movable interface cards (italic titles,
   italic abstract method rows). Solid indigo forks are `extends` (is-a); dashed
   teal edges into the interfaces are `implements` (can-do) — the same colour
   coding InheritFork uses. Shape's draw() row is NON-italic: v6 gives it a
   default body. Animal has draw()/move() bodies but implements nothing — the
   nominal-typing punchline. Boxes stay neutral; colour names the relation. */

// interface card: italic (abstract) title + one italic abstract-method row
const iface = (title, method) => ({
  title,
  abstract: true,
  sections: [{
    rows: [ab(method)]
  }]
});
const drawable = iface("Drawable", "+ draw()");
const movable = iface("Movable", "+ move()");

// Tree 1 — Shape (abstract) with a CONCRETE default draw() (non-italic row).
const shape = {
  title: "Shape",
  abstract: true,
  sections: [{
    rows: []
  }, {
    rows: ["+ draw()"]
  }]
};
const T1 = treeLayout({
  cx: 170,
  topY: 112,
  parent: shape,
  children: [cls("Circle", [], []), cls("Rectangle", [], []), cls("Triangle", [], [])],
  cardW: 92,
  gap: 12
});

// Tree 2 — Vehicle (abstract) declares move() only; Car/Bike opt in to Drawable.
const vehicle = {
  title: "Vehicle",
  abstract: true,
  sections: [{
    rows: []
  }, {
    rows: ["+ move()"]
  }]
};
const T2 = treeLayout({
  cx: 540,
  topY: 112,
  parent: vehicle,
  children: [cls("Car", [], ["+ draw()"]), cls("Bike", [], ["+ draw()"]), cls("Flight", [], ["+ fly()"])],
  cardW: 92,
  gap: 12
});

// Tree 3 — Animal has draw()/move() BODIES but implements nothing.
const animal = {
  title: "Animal",
  abstract: true,
  sections: [{
    rows: []
  }, {
    rows: ["+ draw()", "+ move()"]
  }]
};
const T3 = treeLayout({
  cx: 350,
  topY: T1.bottom + 36,
  parent: animal,
  children: [cls("Bird", [], ["+ fly()"]), cls("Crawler", [], [])],
  cardW: 92,
  gap: 26
});

// interface cards across the top; Movable sits directly above Vehicle
const IW = 104,
  IY = 16,
  IBOT = IY + diagramCardHeight(drawable.sections);
const drawCx = 350,
  movCx = T2.parent.cx;
const M = 14;
const W = Math.round(Math.max(T1.right, T2.right, T3.right) + M);
const H = Math.round(T3.bottom + M);

// Car / Bike centres (leftmost two children of the Vehicle tree)
const carCx = T2.children[0].cx,
  bikeCx = T2.children[1].cx;

// the nominal-typing punchline, beside the Animal tree
const punchLines = ["has draw()/move() bodies,", "implements nothing →", "not Drawable, not Movable"];
export default function UmlV6() {
  return /*#__PURE__*/React.createElement(DiagramSvg, {
    viewBox: `0 0 ${W} ${H}`,
    maxWidth: 720,
    ariaLabel: "Version 6 UML: two interface cards, Drawable with an abstract draw method and Movable with an abstract move method, above three separate class trees. Left tree: abstract Shape with a concrete default draw body, extended by Circle, Rectangle and Triangle; a dashed implements edge runs from Shape up to Drawable, so every shape is Drawable. Right tree: abstract Vehicle declaring move, extended by Car and Bike (each adding draw and connected to Drawable by dashed implements edges) and Flight (adding fly). A dashed implements edge also runs from Vehicle up to Movable, so every vehicle is Movable. Bottom tree: abstract Animal with draw and move bodies, extended by Bird (adding fly) and Crawler \u2014 it implements nothing, so despite owning draw and move an Animal is neither Drawable nor Movable. Solid forks are extends (is-a); dashed edges are implements (can-do)."
  }, /*#__PURE__*/React.createElement("text", {
    x: 14,
    y: 30,
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10,
      fontStyle: "italic"
    }
  }, "solid = extends \xB7 dashed = implements"), /*#__PURE__*/React.createElement(DiagramCard, {
    x: drawCx - IW / 2,
    y: IY,
    w: IW,
    title: drawable.title,
    sections: drawable.sections,
    abstract: true,
    neutral: true
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: movCx - IW / 2,
    y: IY,
    w: IW,
    title: movable.title,
    sections: movable.sections,
    abstract: true,
    neutral: true
  }), /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: T1.parent.cx,
      y: T1.parent.y
    },
    to: {
      x: drawCx - 28,
      y: IBOT
    },
    kind: "realize"
  }), /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: movCx,
      y: T2.parent.y
    },
    to: {
      x: movCx,
      y: IBOT
    },
    kind: "realize"
  }), /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: carCx - 10,
      y: T2.childTop
    },
    to: {
      x: drawCx + 2,
      y: IBOT
    },
    kind: "realize"
  }), /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: bikeCx - 28,
      y: T2.childTop
    },
    to: {
      x: drawCx + 32,
      y: IBOT
    },
    kind: "realize"
  }), /*#__PURE__*/React.createElement(ClassTree, {
    layout: T1
  }), /*#__PURE__*/React.createElement(ClassTree, {
    layout: T2
  }), /*#__PURE__*/React.createElement(ClassTree, {
    layout: T3
  }), punchLines.map((ln, i) => /*#__PURE__*/React.createElement("text", {
    key: ln,
    x: T3.right + 14,
    y: T3.parent.y + 48 + i * 15,
    style: {
      fill: "var(--mm-muted)",
      fontSize: 11
    }
  }, ln)));
}