import React from "react";
import { patternFigure, patternTree, SvgCode, svgCodeSize, ab } from "@course";

/* note 21 — Observer, drawn as the deliberate near-twin of pattern-mediator. The
   two structural differences worth pointing at, and both are visible in this figure:
   `subscribe` / `unsubscribe` (observers opt in and out at run time; colleagues are
   registered by whoever builds the room) and a notify loop with NO sender check.

   The direction is the real distinction, and it is in the caption: a Subject pushes
   OUT to whoever asked, one-to-many. A Mediator relays BETWEEN peers, many-to-many
   collapsed to a hub. */

const BODY = ["for (s : subscribers)", "    s.getNotification(msg);"];

const T = patternTree({
  contextW: 268, gapX: 46, edge: "aggregate", edgeLabel: "subscribers",
  context: { title: "Subject", sections: [
    { rows: ["- subscribers : List<Observer>"] },
    { rows: ["+ subscribe(o)", "+ unsubscribe(o)", "+ broadcast(msg)"] },
  ]},
  parent: { title: "«interface» Observer", abstract: true,
    sections: [{ rows: [ab("+ getNotification(msg)")] }] },
  children: ["Observer-1", "Observer-2", "Observer-3"].map((t) => ({
    title: t, sections: [{ rows: ["+ getNotification(msg)"] }],
  })),
  relation: "implements",
  cardW: 196, gap: 14,
});

const body = svgCodeSize(BODY, "Subject.broadcast(msg)");
const W = Math.round(Math.max(T.width, 14 + body.w + 14));
const H = Math.round(T.height + body.h + 6);

export default patternFigure({
  title: "Observer — one announcement, however many listeners",
  intent: "[Many objects need to receive an update]",
  bad: {
    lang: "java",
    code: `class Stock {
    double price;
    ChartView chart;  AlertBox alerts;  AuditLog log;    // named, one by one

    void setPrice(double p) {
        price = p;
        chart.redraw();  alerts.check(p);  log.write(p);  // and the next one?
    }
}`,
    note: "The subject names every listener, so a new listener edits the subject — and the subject now depends on three unrelated classes it has no business knowing. Turning a listener off means editing this method, not the listener.",
  },
  good: {
    width: W, height: H, viewBox: `0 0 ${W} ${H}`, maxWidth: 840,
    ariaLabel: "A Subject class holds subscribers, a List of Observer, and offers subscribe, unsubscribe and broadcast. It aggregates the Observer interface, which declares getNotification and is realised by Observer-1, Observer-2 and Observer-3. The broadcast body loops over the subscribers and notifies every one.",
    node: (
      <g>
        {T.node}
        <SvgCode x={14} y={T.height - 4} lines={BODY} title="Subject.broadcast(msg)" />
      </g>
    ),
  },
  client: {
    lang: "java",
    label: "client code",
    code: `Subject stock = new Subject();
stock.subscribe(chart);
stock.subscribe(alerts);

stock.broadcast("AAPL 214.30");   // both hear it

stock.unsubscribe(alerts);        // and now only the chart does`,
    note: "The **listeners** decide whether they are listening, and can stop at any moment. That is the half the rejected version cannot express at all: unsubscribing there means editing `setPrice`.",
  },
  caption: {
    cols: [
      { tag: "one-to-many", kind: "cpp", children: <>One <code className="mm-ic">Subject</code> pushes <strong>outward</strong> to whoever registered. The observers do not talk back through it and do not know about each other.</> },
      { tag: "opt-in", kind: "int", children: <><code className="mm-ic">subscribe</code> / <code className="mm-ic">unsubscribe</code> put the membership decision in the <strong>listener's</strong> hands, at run time.</> },
    ],
    punch: "The deck draws Mediator and Observer with almost the same UML. Read the direction: Mediator relays between peers who would otherwise talk to each other; Observer announces from one source to listeners who asked to hear it.",
  },
});
