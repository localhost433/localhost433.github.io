// notes/courses/CSCI-UA-470/demos/practice-13-sequence-observer.jsx
import { sequenceOrder } from "@course";

/* note 13 practice — the first ordering drill with an ASYNCHRONOUS message, so the
   assembled diagram shows both arrowheads: the FILLED head of a blocking sync call
   and the OPEN head of `notify()`, the fire-and-forget observer push (a Model
   telling its View it changed, without waiting). A classic MVC click→update→notify→
   render loop; every step is forced by causality (you cannot notify before the
   state changes, or render before being notified), so the order is unambiguous. */

export default sequenceOrder({
  prompt: "Order this MVC interaction top-to-bottom as time. Watch the arrowheads as it assembles: get_payment-style blocking calls are FILLED, the async notify() is OPEN. Direction is given — you choose only the sequence.",
  participants: [
    { id: "user", label: "User", kind: "actor" },
    { id: "btn", label: "b : Button" },
    { id: "model", label: "m : Model" },
    { id: "view", label: "v : View" },
  ],
  messages: [
    { id: "click", from: "user", to: "btn", label: "click()", kind: "sync",
      why: "The user opens the interaction — nothing precedes the first call in." },
    { id: "set", from: "btn", to: "model", label: "setValue(x)", kind: "sync",
      why: "The button handles the click by updating the model — this must come before the model can announce any change." },
    { id: "notify", from: "model", to: "view", label: "notify()", kind: "async",
      why: "Once its state has actually changed, the model pushes an async notify() to its observers (an OPEN arrowhead — fire-and-forget, the model does not wait). So it follows setValue and precedes the view's response." },
    { id: "read", from: "view", to: "model", label: "getValue()", kind: "sync",
      why: "Woken by notify(), the view reads the new value back — a blocking call, so it comes after the notification and before the redraw." },
    { id: "value", from: "model", to: "view", label: "value", kind: "return",
      why: "The model returns the current value (dashed) before the view can draw with it." },
    { id: "render", from: "view", to: "view", label: "render()", kind: "sync", self: true,
      why: "A self-call — with the value in hand, the view redraws itself last." },
  ],
  activations: [
    { p: "btn", from: 0, to: 1 },
    { p: "model", from: 1, to: 2 },   // handling setValue, firing notify
    { p: "model", from: 3, to: 4 },   // answering the view's getValue
    { p: "view", from: 2, to: 5 },
  ],
});
