/* AUTO-GENERATED from pattern-bridge.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { patternFigure, treeLayout, ClassTree, UmlLink } from "@course";

/* note 20 — Bridge. The rejected half is the one place in this note where the code
   block is a LIST OF CLASS NAMES, because that is exactly the damage: three device
   kinds crossed with three operating systems is nine classes, and a fourth OS makes
   it twelve. The pattern half puts the two hierarchies side by side with one line
   between them, and the count drops to 3 + 3 + 1.

   The `- os : OS` field is the bridge. Everything else is two ordinary hierarchies. */

const PAD = 14,
  CARD_W = 138,
  GAP = 16,
  MID = 76;
const leaf = (title, rows = []) => ({
  title,
  sections: rows.length ? [{
    rows
  }] : []
});
const osOps = ["+ startup()", "+ shutdown()", "+ manageMemory()"];
const A = treeLayout({
  cx: 0,
  topY: PAD,
  cardW: CARD_W,
  gap: GAP,
  parent: {
    title: "computer",
    abstract: true,
    sections: [{
      rows: ["- cpu : String", "- RAM : String", "- os : OS"]
    }]
  },
  children: [leaf("Pc"), leaf("Laptop"), leaf("desktop")]
});
const B = treeLayout({
  cx: 0,
  topY: PAD,
  cardW: CARD_W,
  gap: GAP,
  parent: {
    title: "OS",
    abstract: true,
    sections: [{
      rows: osOps
    }]
  },
  children: [leaf("win", osOps), leaf("Mac", osOps), leaf("Linux", osOps)]
});
const aShift = PAD - A.left;
const aRight = A.right + aShift;
const bShift = aRight + MID - B.left;
const W = Math.round(B.right + bShift + PAD);
const H = Math.round(Math.max(A.bottom, B.bottom) + 22 + PAD);
const label = (x, y, text) => /*#__PURE__*/React.createElement("text", {
  x: x,
  y: y,
  textAnchor: "middle",
  style: {
    fill: "var(--mm-muted)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".05em"
  }
}, text);
export default patternFigure({
  title: "Bridge — two hierarchies instead of their product",
  intent: "[ Decouple Abstraction from implementation ]",
  bad: {
    lang: "java",
    code: `class PcWin      { } class PcLinux      { } class PcMac      { }
class LaptopWin  { } class LaptopLinux  { } class LaptopMac  { }
class DesktopWin { } class DesktopLinux { } class DesktopMac { }

// 3 devices x 3 systems = 9 classes.
// add one OS -> 12.  add one device -> 16.  and every
// shutdown() bug has to be fixed in three of them.`,
    note: "Crossing two independent dimensions with inheritance multiplies them. The give-away is a class name that is two nouns glued together — `LaptopLinux` is not a kind of thing, it is a **cell in a table**."
  },
  good: {
    width: W,
    height: H,
    viewBox: `0 0 ${W} ${H}`,
    maxWidth: 820,
    ariaLabel: "Two separate hierarchies. On the left, an abstract computer class holding cpu, RAM and an os field of type OS, with subclasses Pc, Laptop and desktop. On the right, an abstract OS class with startup, shutdown and manageMemory, and subclasses win, Mac and Linux. A single association labelled the bridge joins computer to OS.",
    node: /*#__PURE__*/React.createElement("g", null, label(A.parent.cx + aShift, PAD - 2, "ABSTRACTION"), label(B.parent.cx + bShift, PAD - 2, "IMPLEMENTATION"), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${aShift}, 12)`
    }, /*#__PURE__*/React.createElement(ClassTree, {
      layout: A
    })), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${bShift}, 12)`
    }, /*#__PURE__*/React.createElement(ClassTree, {
      layout: B
    })), /*#__PURE__*/React.createElement(UmlLink, {
      kind: "assoc",
      label: "the bridge",
      from: {
        x: A.parent.cx + aShift + CARD_W / 2,
        y: A.parent.y + 12 + A.parent.h / 2
      },
      to: {
        x: B.parent.cx + bShift - CARD_W / 2,
        y: B.parent.y + 12 + B.parent.h / 2
      }
    }), /*#__PURE__*/React.createElement("text", {
      x: W / 2,
      y: H - 8,
      textAnchor: "middle",
      style: {
        fill: "var(--mm-muted)",
        fontSize: 11
      }
    }, "3 + 3 + one field. A fourth OS adds one class, and no device is touched."))
  },
  client: {
    lang: "java",
    label: "client code",
    code: `computer c = new Laptop();
c.os = new Linux();          // any device x any system, chosen at run time
c.os.startup();

c.os = new Mac();            // and changed later, which nine classes could not do`,
    note: "The last line is the part inheritance could not express at all. A `LaptopLinux` **is** its operating system for life; a `Laptop` merely *has* one, so it can be handed a different one."
  },
  caption: {
    cols: [{
      tag: "abstraction",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The side the client holds and calls \u2014 ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "computer"), " and its kinds. It varies for its own reasons: form factor, price, ports.")
    }, {
      tag: "implementation",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The side that does the platform work \u2014 ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "OS"), " and its kinds. It varies for entirely different reasons, on its own schedule.")
    }],
    punch: "The trigger for Bridge is two dimensions that change independently. Ask whether the two axes would ever be released, tested, or owned separately — if yes, do not multiply them into one hierarchy."
  }
});