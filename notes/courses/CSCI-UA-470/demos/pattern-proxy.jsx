import React from "react";
import { patternFigure, DiagramCard, diagramCardHeight, UmlLink, SvgCode, svgCodeSize } from "@course";

/* note 20 — Proxy. Two cards and one edge; the whole pattern is that the LEFT card
   keeps the name and the interface of the right one. The deck's punch is the
   crossed-out `delete` in the client half: three query kinds go in, two come out,
   and the client's code never said anything about it.

   Drawn without a hierarchy on purpose — the deck doesn't give one, and the point
   is not polymorphism, it is that the caller's `new DBCNN(...)` now hands back
   something that stands in front of the real object. */

const PAD = 14, CARD_W = 190, GAP = 200;

const PROXY = { title: "DBCNN", sections: [
  { rows: ["- dbname : String", "- dbc : OldDBCNN"] },
  { rows: ["+ runQuery(q)"] },
]};
const REAL = { title: "OldDBCNN", sections: [
  { rows: ["- dbname : String"] },
  { rows: ["+ runQuery(q)"] },
]};

const BODY = ["dbc = new OldDBCNN();", 'if (q != "delete")', "    dbc.runQuery(q);"];
const body = svgCodeSize(BODY, "DBCNN.runQuery(q)");

const ph = diagramCardHeight(PROXY.sections, { title: true });
const rh = diagramCardHeight(REAL.sections, { title: true });
const axis = PAD + 18 + Math.max(ph, rh) / 2;
const realX = PAD + CARD_W + GAP;
const W = Math.round(realX + CARD_W + PAD);
const H = Math.round(axis + Math.max(ph, rh) / 2 + 22 + body.h + PAD);

export default patternFigure({
  title: "Proxy — same door, new doorman",
  intent: "[ Control Access ]",
  bad: {
    lang: "java",
    code: `DBCNN dbc = new DBCNN(db_name);
dbc.runQuery(q);        // q may be:  insert   select   delete

// nothing in the type system, and nothing at the call site,
// distinguishes a query that reads from one that destroys`,
    note: "Every caller reaches the real connection directly, so every restriction has to be enforced at every call site — by convention, review, or hope. Miss one and the rule is not a rule.",
  },
  good: {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`, maxWidth: 700,
    ariaLabel: "A DBCNN class marked proxy holds dbname and dbc of type OldDBCNN, and offers runQuery. It is joined by an association labelled forwards to to OldDBCNN, which holds the real runQuery. The proxy's body constructs the real connection and calls runQuery only when the query is not a delete.",
    node: (
      <g>
        <text x={PAD + CARD_W / 2} y={PAD + 8} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".05em" }}>PROXY</text>
        <text x={realX + CARD_W / 2} y={PAD + 8} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".05em" }}>REAL SUBJECT</text>
        <DiagramCard x={PAD} y={axis - ph / 2} w={CARD_W} title={PROXY.title} sections={PROXY.sections} sub={1} />
        <UmlLink from={{ x: PAD + CARD_W, y: axis }} to={{ x: realX, y: axis }} kind="assoc" label="forwards to" />
        <DiagramCard x={realX} y={axis - rh / 2} w={CARD_W} title={REAL.title} sections={REAL.sections} neutral />
        <SvgCode x={PAD} y={axis + Math.max(ph, rh) / 2 + 22} lines={BODY} title="DBCNN.runQuery(q)" />
      </g>
    ),
  },
  client: {
    lang: "java",
    label: "client code — unchanged",
    code: `DBCNN dbc = new DBCNN(db_name);
dbc.runQuery(q);        //  insert  ✓    select  ✓    delete  ✗`,
    note: "Character for character the same as before. The client did not opt in, cannot opt out, and has no way to reach past the proxy — which is the only way an access rule ever actually holds.",
  },
  caption: {
    cols: [
      { tag: "same shape", kind: "cpp", children: <>The proxy keeps the <strong>interface</strong>: same class name from the caller's side, same <code className="mm-ic">runQuery</code>. Nothing about the call site changes.</> },
      { tag: "new rule", kind: "int", children: <>Between the call and the real object it inserts a decision. Here it is a permission check; the same slot holds lazy loading, caching, logging, or a remote call.</> },
    ],
    punch: "Adapter changes the interface so an incompatible class fits. Proxy keeps the interface identical and changes what happens on the way through. Both wrap; only one of them is visible to the caller.",
  },
});
