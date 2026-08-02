import React from "react";
import { patternFigure, DiagramCard, diagramCardHeight, UmlLink } from "@course";

/* note 20 — Facade, on L19's restaurant. The figure has to make one thing obvious:
   the subsystem does NOT shrink. waiter, kitchen and Food are all still there, all
   still doing the same work — the pattern adds ONE more class on top of them. That
   is why the facade card sits below with three dashed dependencies climbing into
   the subsystem rather than replacing it.

   The seven-line client block moving from the "rejected" half into the facade's own
   body is the entire before/after. */

const PAD = 14, CARD_W = 176, GAP = 26, DROP = 70;

const SUB = [
  { title: "waiter", sections: [{ rows: [] }, { rows: ["+ takeOrder(o)", "+ deliver(f)"] }] },
  { title: "kitchen", sections: [{ rows: [] }, { rows: ["+ prepareFood(f)"] }] },
  { title: "Food", sections: [{ rows: ["- name : String"] }, { rows: [] }] },
];
const FACADE = { title: "Order", sections: [
  { rows: ["- w : waiter", "- k : kitchen"] },
  { rows: ["+ prepare()"] },
]};

const subH = Math.max(...SUB.map((s) => diagramCardHeight(s.sections, { title: true })));
const rowW = SUB.length * CARD_W + (SUB.length - 1) * GAP;
const facH = diagramCardHeight(FACADE.sections, { title: true });
const facY = PAD + 16 + subH + DROP;
const W = Math.round(PAD * 2 + rowW);
const H = Math.round(facY + facH + 20 + PAD);
const facX = PAD + rowW / 2 - CARD_W / 2;

export default patternFigure({
  title: "Facade — one call in front of seven",
  intent: "[ Hide Complexity ]",
  bad: {
    lang: "java",
    code: `waiter w1 = new waiter();
waiter w2 = new waiter();
kitchen k = new Kitchen();
food f = new food();
w1.takeOrder(...);
k.prepareFood(f);
w1.deliver(f);`,
    note: "Seven lines to place one order — and the caller has to know the objects, the order of the calls, and which of the two waiters delivers. Every client repeats the sequence, so every client can get it wrong in a new way.",
  },
  good: {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`, maxWidth: 700,
    ariaLabel: "Three subsystem classes — waiter with takeOrder and deliver, kitchen with prepareFood, and Food — sit in a row. Below them a facade class Order holds a waiter and a kitchen, offers prepare(), and depends on waiter and kitchen with dashed arrows. The subsystem classes are unchanged.",
    node: (
      <g>
        <text x={PAD + rowW / 2} y={PAD + 6} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".05em" }}>
          SUBSYSTEM — UNCHANGED
        </text>
        {SUB.map((s, i) => (
          <DiagramCard key={s.title} x={PAD + i * (CARD_W + GAP)} y={PAD + 16} w={CARD_W}
            title={s.title} sections={s.sections} neutral />
        ))}
        {[0, 1].map((i) => {
          const cx = PAD + i * (CARD_W + GAP) + CARD_W / 2;
          return <UmlLink key={i} kind="depend" orth elbow="vhv"
            from={{ x: facX + CARD_W / 2, y: facY }} to={{ x: cx, y: PAD + 16 + subH }} />;
        })}
        <DiagramCard x={facX} y={facY} w={CARD_W} title={FACADE.title} sections={FACADE.sections} sub={1} />
        <text x={facX + CARD_W / 2} y={facY + facH + 16} textAnchor="middle"
          style={{ fill: "var(--mm-muted)", fontSize: 11 }}>the facade — the one class that is new</text>
      </g>
    ),
  },
  client: {
    lang: "java",
    label: "client code",
    code: `Order o = new Order(...);
o.prepare();`,
    note: "The seven lines did not vanish — they moved **inside** `Order.prepare()`, where they exist once and are written by whoever owns the restaurant, not by whoever wants dinner.",
  },
  caption: {
    cols: [
      { tag: "still there", kind: "cpp", children: <><code className="mm-ic">waiter</code>, <code className="mm-ic">kitchen</code> and <code className="mm-ic">Food</code> are untouched and still directly usable. A facade <strong>adds</strong> an entrance; it does not seal the building.</> },
      { tag: "new & smaller", kind: "int", children: <><code className="mm-ic">Order</code> offers an interface that did not exist before — one method where there were four objects and a required call order.</> },
    ],
    punch: "This is the wrapper that invents a new interface rather than preserving one. Adapter reshapes one class's interface; Proxy and Decorator keep an interface identical; Facade introduces a smaller one over several objects at once.",
  },
});
