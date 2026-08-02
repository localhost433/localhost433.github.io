/* AUTO-GENERATED from pattern-adapter.jsx by `npm run build:artifacts` — do not edit. */
import React from "react";
import { patternFigure, DiagramSvg, DiagramCard, diagramCardHeight, treeLayout, ClassTree, UmlLink, SvgCode, svgCodeSize } from "@course";

/* note 20 — Adapter, on L19's own DB-connection cast. The tell is drawn rather than
   said: three of the four children are ordinary subclasses, and the fourth carries
   an extra field (`- s : SQLite`) pointing at a class that is NOT in the hierarchy
   and never will be. The adapter's methods are not implementations; they are
   translations, which is why the callout shows the body calling `s.command()` /
   `s.loadData()` — SQLite's vocabulary, not DBCNN's.

   The payoff lives in the client half: four blocks that differ by one word. */

const ops = ["+ read(q) : String", "+ write(q)"];
const child = (title, attrs = []) => ({
  title,
  sections: [{
    rows: attrs
  }, {
    rows: ops
  }]
});
const PAD = 14,
  CARD_W = 158,
  GAP = 14,
  DROP = 44;
const L = treeLayout({
  cx: 0,
  topY: PAD,
  cardW: CARD_W,
  gap: GAP,
  parent: {
    title: "DBCNN",
    abstract: true,
    sections: [{
      rows: ["- dbName : String"]
    }, {
      rows: ops
    }]
  },
  children: [child("OracleCNN"), child("SQLServerCNN"), child("MySQLCNN"), child("SQLiteCNN", ["- s : SQLite"])]
});
const SHIFT = PAD - L.left;
const A = L.children[3]; // the adapter — everything below hangs off it
const adapterCx = A.cx + SHIFT,
  adapterBottom = A.top + A.h;
const SQLITE = {
  title: "SQLite",
  sections: [{
    rows: ["- dbName : String"]
  }, {
    rows: ["+ command(q)", "+ loadData() : Data"]
  }]
};
const sqliteY = adapterBottom + DROP;
const sqliteH = diagramCardHeight(SQLITE.sections, {
  title: true
});
const sqliteX = adapterCx - CARD_W / 2;
const BODY = ["s = new SQLite();", "s.command(q);", "return s.loadData();"];
const body = svgCodeSize(BODY, "SQLiteCNN.read(q)");
const bodyX = sqliteX + CARD_W + 40;
const W = Math.round(Math.max(L.right + SHIFT, bodyX + body.w) + PAD);
const H = Math.round(Math.max(sqliteY + sqliteH, sqliteY + body.h) + PAD);
const GOOD = {
  width: W,
  height: H,
  viewBox: `0 0 ${W} ${H}`,
  maxWidth: 820,
  ariaLabel: "An abstract DBCNN with read and write is the parent of OracleCNN, SQLServerCNN, MySQLCNN, and SQLiteCNN. SQLiteCNN additionally holds a field s of type SQLite, a separate class outside the hierarchy with its own command and loadData methods. SQLiteCNN.read is shown delegating to s.command and s.loadData.",
  node: /*#__PURE__*/React.createElement("g", {
    transform: `translate(${SHIFT}, 0)`
  }, /*#__PURE__*/React.createElement(ClassTree, {
    layout: L
  }), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${-SHIFT}, 0)`
  }, /*#__PURE__*/React.createElement(UmlLink, {
    from: {
      x: adapterCx,
      y: adapterBottom
    },
    to: {
      x: adapterCx,
      y: sqliteY
    },
    kind: "assoc",
    label: "wraps"
  }), /*#__PURE__*/React.createElement(DiagramCard, {
    x: sqliteX,
    y: sqliteY,
    w: CARD_W,
    title: SQLITE.title,
    sections: SQLITE.sections,
    sub: 2
  }), /*#__PURE__*/React.createElement(SvgCode, {
    x: bodyX,
    y: sqliteY,
    lines: BODY,
    title: "SQLiteCNN.read(q)"
  })))
};
export default patternFigure({
  title: "Adapter — a translator wearing the family's interface",
  intent: "[Extend the ability of existing class]",
  bad: {
    lang: "java",
    code: `// three databases share one interface…
DBCNN dbc = new MySQLCNN();
dbc.write(q);
String r = dbc.read(q);

// …and the fourth does not
SQLite s = new SQLite();     // not a DBCNN, and cannot be assigned to one
s.command(q);                // different method names
Data d = s.loadData();       // different return type`,
    note: "`SQLite` is a perfectly good class — it is simply not *shaped* like the others. Every client that wants to support it now needs a second code path, and the code path is the thing the hierarchy existed to remove."
  },
  good: GOOD,
  client: {
    lang: "java",
    label: "client code — all four cases",
    code: `DBCNN dbc;

dbc = new OracleCNN();     dbc.write(q);  results = dbc.read(q);
dbc = new SQLServerCNN();  dbc.write(q);  results = dbc.read(q);
dbc = new MySQLCNN();      dbc.write(q);  results = dbc.read(q);
dbc = new SQLiteCNN();     dbc.write(q);  results = dbc.read(q);`,
    note: "Four lines that differ by one word — and the fourth is the adapter. The client cannot tell which of these subclasses implements the work itself and which forwards it to a stranger, and that indistinguishability **is** the pattern."
  },
  caption: {
    cols: [{
      tag: "inherits",
      kind: "cpp",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "SQLiteCNN"), " extends ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "DBCNN"), ", so it fits everywhere a ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "DBCNN"), " fits. That is the half that faces the ", /*#__PURE__*/React.createElement("strong", null, "client"), ".")
    }, {
      tag: "holds",
      kind: "int",
      children: /*#__PURE__*/React.createElement(React.Fragment, null, "It also holds a ", /*#__PURE__*/React.createElement("code", {
        className: "mm-ic"
      }, "SQLite"), " and calls ", /*#__PURE__*/React.createElement("em", null, "its"), " methods. That is the half that faces the ", /*#__PURE__*/React.createElement("strong", null, "stranger"), ". An adapter always has both.")
    }],
    punch: "The deck's intent line reads \"extend the ability of existing class\", which undersells it: an adapter adds no ability. It changes the shape of an ability that already existed, so an incompatible class can be used through an interface it was never written for."
  }
});