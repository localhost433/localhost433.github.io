/* AUTO-GENERATED from sequence-anatomy.jsx by `npm run build:artifacts` — do not edit. */
import { sequenceDiagram } from "@course";

/* note 13 — the vocabulary of a sequence diagram on the smallest possible scene:
   one ACTOR and one OBJECT, a single synchronous call and its return. The
   annotations tag the five parts a reader must recognise: the participant header,
   the dashed lifeline, the activation bar (a method on the stack), the message,
   and the dashed return. Two participants keeps every label unambiguous. */

export default sequenceDiagram({
  participants: [{
    id: "cust",
    label: "Customer",
    kind: "actor"
  }, {
    id: "cashier",
    label: "Mike : Cashier"
  }],
  messages: [{
    from: "cust",
    to: "cashier",
    label: "place_order(details)",
    kind: "sync"
  }, {
    from: "cashier",
    to: "cust",
    label: "price",
    kind: "return"
  }],
  // the cashier's method is on the stack for the whole call
  activations: [{
    p: "cashier",
    from: 0,
    to: 1
  }],
  // leaders point at clear anchors — the cashier lifeline/activation to the RIGHT
  // (past the message label), the message/return arrows just off the customer
  // lifeline to the LEFT — so no leader crosses the place_order label.
  annotations: [{
    t: "participant",
    x: 166,
    y: -14,
    to: {
      x: 166,
      y: 0
    }
  }, {
    t: "lifeline",
    x: 248,
    y: 70,
    anchor: "start",
    to: {
      x: 166,
      y: 88
    }
  }, {
    t: "activation",
    x: 248,
    y: 118,
    anchor: "start",
    to: {
      x: 171,
      y: 118
    }
  }, {
    t: "message",
    x: -8,
    y: 98,
    anchor: "end",
    to: {
      x: 6,
      y: 98
    }
  }, {
    t: "return",
    x: -8,
    y: 144,
    anchor: "end",
    to: {
      x: 6,
      y: 144
    }
  }]
});