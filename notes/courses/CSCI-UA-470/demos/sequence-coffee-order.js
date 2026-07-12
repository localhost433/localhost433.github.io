/* AUTO-GENERATED from sequence-coffee-order.jsx by `npm run build:artifacts` — do not edit. */
import { sequenceDiagram } from "@course";

/* note 13 — the signature worked example (coffee shop, "Make order", the V4 form
   from L13). The single use-case oval `Make order` explodes into the objects that
   collaborate to fulfil it and the messages they pass over time: the customer
   pays the cashier, the cashier hands the job to the barista, the barista passes
   the finished drink to the receptionist, who checks it (a self-call) and returns
   the order. Activation bars trace the call stack down the page. */

export default sequenceDiagram({
  participants: [{
    id: "cust",
    label: "Customer",
    kind: "actor"
  }, {
    id: "cashier",
    label: "Mike : Cashier"
  }, {
    id: "barista",
    label: "Maya : Barista"
  }, {
    id: "recep",
    label: "Tara : Receptionist"
  }],
  messages: [{
    from: "cust",
    to: "cashier",
    label: "place_order(order_details)",
    kind: "sync"
  },
  // 0
  {
    from: "cashier",
    to: "cust",
    label: "price",
    kind: "return"
  },
  // 1
  {
    from: "cust",
    to: "cashier",
    label: "get_payment(price)",
    kind: "sync"
  },
  // 2
  {
    from: "cashier",
    to: "barista",
    label: "prepare(order_details)",
    kind: "sync"
  },
  // 3
  {
    from: "barista",
    to: "recep",
    label: "deliver(order)",
    kind: "sync"
  },
  // 4
  {
    from: "recep",
    to: "recep",
    label: "checkQuality(order)",
    kind: "sync",
    self: true
  },
  // 5
  {
    from: "recep",
    to: "cust",
    label: "order",
    kind: "return"
  } // 6
  ],
  activations: [{
    p: "cashier",
    from: 0,
    to: 3
  }, {
    p: "barista",
    from: 3,
    to: 4
  }, {
    p: "recep",
    from: 4,
    to: 6
  }]
});