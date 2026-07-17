// notes/courses/CSCI-UA-470/demos/practice-13-sequence.jsx
import { sequenceOrder } from "@course";

/* note 13 practice — the flip side of the worked example: instead of reading a
   finished sequence diagram, BUILD one. Same coffee-shop "Make order" cast; the
   student orders the messages and watches the real diagram assemble itself. The
   `why` on each message names what forces it into that slot (a call before its
   return, payment only after the price is known, delivery before the quality
   self-check). Direction is given on each chip, so the sole task is time order. */

export default sequenceOrder({
  prompt: "Order the messages of “Make order” top-to-bottom as time. Direction is given — you choose only the sequence.",
  participants: [
    { id: "cust", label: "Customer", kind: "actor" },
    { id: "cashier", label: "Mike : Cashier" },
    { id: "barista", label: "Maya : Barista" },
    { id: "recep", label: "Tara : Receptionist" },
  ],
  messages: [
    { id: "place", from: "cust", to: "cashier", label: "place_order(order_details)", kind: "sync",
      why: "The customer opens the interaction — nothing precedes the first call in." },
    { id: "price", from: "cashier", to: "cust", label: "price", kind: "return",
      why: "The price is returned before the customer can pay it." },
    { id: "pay", from: "cust", to: "cashier", label: "get_payment(price)", kind: "sync",
      why: "Payment can only happen once the price is known." },
    { id: "prepare", from: "cashier", to: "barista", label: "prepare(order_details)", kind: "sync",
      why: "The cashier delegates to the barista after taking payment." },
    { id: "deliver", from: "barista", to: "recep", label: "deliver(order)", kind: "sync",
      why: "The barista hands the finished drink to the receptionist." },
    { id: "check", from: "recep", to: "recep", label: "checkQuality(order)", kind: "sync", self: true,
      why: "A self-call — the receptionist checks it before releasing it." },
    { id: "order", from: "recep", to: "cust", label: "order", kind: "return",
      why: "The finished order returns to the customer last." },
  ],
  activations: [
    { p: "cashier", from: 0, to: 3 },
    { p: "barista", from: 3, to: 4 },
    { p: "recep", from: 4, to: 6 },
    { p: "recep", from: 5, to: 5, dx: 4 }, // nested self-call bar
  ],
});
