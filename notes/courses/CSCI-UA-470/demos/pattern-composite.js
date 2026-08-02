/* AUTO-GENERATED from pattern-composite.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { patternFigure, DiagramCard, ClassTree, treeLayout, SvgCode, svgCodeSize, ab } from "@course";

/* note 20 — "Composition" as L19 names it (Composite in the catalog; the note's
   prose carries that aside, and the collision with note 14's composition EDGE).

   Two things have to be visible at once for the pattern to land: `Folder` holds a
   list of the PARENT type, and `Folder.browse()` calls `browse()` on whatever is in
   that list. That is the recursion, and it is why one `browse()` call on the top
   folder prints an arbitrarily deep tree without the caller knowing the depth.

   The self-composition edge is hand-routed (right, up, left) rather than left to
   UmlLink's elbow, because the direct route would cut straight through the
   inheritance fork. The filled diamond sits at Folder — the WHOLE end, per note 14. */

const PAD = 14,
  CARD_W = 168,
  GAP = 64,
  DROP = 34;
const L = treeLayout({
  cx: 0,
  topY: PAD,
  cardW: CARD_W,
  gap: GAP,
  parent: {
    title: "item",
    abstract: true,
    sections: [{
      rows: ["- name : String"]
    }, {
      rows: [ab("+ browse()")]
    }]
  },
  children: [{
    title: "File",
    sections: [{
      rows: ["- content : String"]
    }, {
      rows: ["+ browse()"]
    }]
  }, {
    title: "Folder",
    sections: [{
      rows: ["- items : List<item>"]
    }, {
      rows: ["+ browse()"]
    }]
  }]
});
const FILE_BODY = ['print("I am a file");', "print(content);"];
const FOLDER_BODY = ['print("I am a Folder");', "for (i : items)", "    i.browse();"];
const fb = svgCodeSize(FILE_BODY, "File.browse()");
const ob = svgCodeSize(FOLDER_BODY, "Folder.browse()");
const SHIFT = PAD - L.left;
const kid = i => ({
  cx: L.children[i].cx + SHIFT,
  bottom: L.children[i].top + L.children[i].h
});
const [F, D] = [kid(0), kid(1)];
const bodyY = Math.max(F.bottom, D.bottom) + DROP;

// the self-reference rail: out of Folder's right edge, up past the fork, back into item's
const railX = L.right + SHIFT + 38;
const folderRight = D.cx + CARD_W / 2;
const folderCy = L.children[1].top + L.children[1].h / 2;
const itemRight = L.parent.cx + SHIFT + CARD_W / 2;
const itemCy = L.parent.y + L.parent.h / 2;
const W = Math.round(Math.max(railX + PAD, D.cx + ob.w / 2 + PAD, L.right + SHIFT + PAD));
const H = Math.round(bodyY + Math.max(fb.h, ob.h) + PAD);
const GOOD = {
  width: W,
  height: H,
  viewBox: `0 0 ${W} ${H}`,
  maxWidth: 720,
  ariaLabel: "An abstract item class with a browse() operation is the parent of File and Folder. Folder holds items, a List of item, joined back to item by a composition edge whose filled diamond sits at the Folder end. File.browse prints its content; Folder.browse loops over its items calling browse on each.",
  node: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
    transform: `translate(${SHIFT}, 0)`
  }, /*#__PURE__*/React.createElement(ClassTree, {
    layout: L
  })), /*#__PURE__*/React.createElement("path", {
    d: `M ${folderRight} ${folderCy} H ${railX} V ${itemCy} H ${itemRight}`,
    style: {
      fill: "none",
      stroke: "var(--mm-muted)",
      strokeWidth: 1.5
    },
    markerStart: "url(#dia-diamond-filled)"
  }), /*#__PURE__*/React.createElement("text", {
    x: railX - 6,
    y: (folderCy + itemCy) / 2,
    textAnchor: "end",
    style: {
      fill: "var(--mm-muted)",
      fontSize: 10.5,
      fontStyle: "italic"
    }
  }, "0..*"), /*#__PURE__*/React.createElement(SvgCode, {
    x: F.cx - fb.w / 2,
    y: bodyY,
    lines: FILE_BODY,
    title: "File.browse()"
  }), /*#__PURE__*/React.createElement(SvgCode, {
    x: D.cx - ob.w / 2,
    y: bodyY,
    lines: FOLDER_BODY,
    title: "Folder.browse()"
  }))
};
export default patternFigure({
  title: "Composition — one call, any depth",
  intent: "[ Define a common interface for all granularities and to treat group of objects similarly ]",
  bad: {
    lang: "java",
    code: `void show(Object node) {
    if (node instanceof File)
        print(((File) node).content);
    else if (node instanceof Folder)
        for (Object child : ((Folder) node).items)
            show(child);              // and the cast happens again, one level down
}`,
    note: "The caller carries the whole tree structure. Every level costs an `instanceof`, a cast, and a decision — and the moment a third node type appears (a shortcut, an archive), every one of these methods reopens."
  },
  good: GOOD,
  client: {
    lang: "java",
    label: "client code",
    code: `File f1 = new File("F1");
File f2 = new File("F2");
Folder fldr1 = new Folder("Folder-1");
fldr1.items.add(f1);
fldr1.items.add(f2);

f1.browse();      // prints f1's content
f2.browse();      // prints f2's content
fldr1.browse();   // prints [ f1's content, f2's content ]`,
    note: "The last three lines are the pattern. A leaf and a whole subtree are called **exactly the same way** — and `fldr1` could contain folders containing folders without one character of this changing."
  },
  caption: {
    cols: [{
      tag: "granularity",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "The deck's word. A ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "File"), " is one thing and a ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Folder"), " is many, but both are an ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "item"), ", so the client stops caring which it holds.")
    }, {
      tag: "recursion",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "Folder"), " holds ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "List<item>"), " \u2014 the ", /*#__PURE__*/React.createElement("strong", null, "parent"), " type, not ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "List<File>"), ". That one choice is what lets folders nest, and what makes ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "browse()"), " recurse.")
    }],
    punch: "The test for this pattern is the self-reference: the composite holds a collection of the abstraction it itself implements. Take that away and you have an ordinary has-a, not a Composite."
  }
});