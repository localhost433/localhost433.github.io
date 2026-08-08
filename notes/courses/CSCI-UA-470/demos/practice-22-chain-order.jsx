// notes/courses/CSCI-UA-470/demos/practice-22-chain-order.jsx
import { sequenceOrder } from "@course";

/* note 22 practice — one wiring of L20's request chain, as a sequence diagram. The
   ordering is forced by the escalation rule (`if I cannot, pass it on`), so there is
   exactly one right answer, and building it makes two things concrete:

   the student sends ONE message and never learns who answered it, and the reply
   travels back down the chain rather than jumping straight to the sender. The trap
   is putting the Assistant's approval next to the student's request, because that
   is where the decision "really" happens. */

export default sequenceOrder({
  prompt: "Chain wired Secretary → Chair → Dean → Assistant, as in L20. A student submits a request that only the Assistant is authorized to settle. Order the messages — and notice how far the request travels for a single call.",
  participants: [
    { id: "stu", label: "Student", kind: "actor" },
    { id: "sec", label: "s : Secretary" },
    { id: "chair", label: "c : Chair" },
    { id: "dean", label: "d : Dean" },
    { id: "asst", label: "a : Assistant" },
  ],
  messages: [
    { id: "submit", from: "stu", to: "sec", label: "handle(s1)", kind: "sync",
      why: "The student calls the **head of the chain** — the only handler they hold a reference to. They do not know the chain's length, its order, or who is authorized to settle this request." },
    { id: "toChair", from: "sec", to: "chair", label: "nextHandler.handle(s1)", kind: "sync",
      why: "This request is not one the secretary is authorized to handle, so the check fails and the request is passed to whatever `nextHandler` holds. Nothing is returned yet — the call is still going *up*." },
    { id: "toDean", from: "chair", to: "dean", label: "nextHandler.handle(s1)", kind: "sync",
      why: "Same rule, one rung higher. Each handler makes exactly one decision about itself and knows only its successor." },
    { id: "toAsst", from: "dean", to: "asst", label: "nextHandler.handle(s1)", kind: "sync",
      why: "The dean also declines and forwards. This is the last hop: the Assistant's `nextHandler` is null, so the chain ends here whether or not the request is settled." },
    { id: "ok", from: "asst", to: "dean", label: "settled", kind: "return",
      why: "The Assistant can handle it, so the forwarding stops and a value returns. It goes to the **dean** — its caller — not to the student: each `handle` call is an ordinary blocking call that has to return to whoever made it." },
    { id: "backDean", from: "dean", to: "chair", label: "settled", kind: "return",
      why: "The dean's own `handle` call can now finish, returning to *its* caller. The reply unwinds the chain in the exact reverse of the way the request climbed it." },
    { id: "backChair", from: "chair", to: "sec", label: "settled", kind: "return",
      why: "One more rung down. Four calls up means four returns down — the cost of not coupling the sender to the receiver." },
    { id: "backStu", from: "sec", to: "stu", label: "settled", kind: "return",
      why: "The student's single call finally returns. They have no way of telling whether the secretary settled it or four people were asked, which is exactly the decoupling the pattern is for." },
  ],
  activations: [
    { p: "sec", from: 0, to: 7 },
    { p: "chair", from: 1, to: 6 },
    { p: "dean", from: 2, to: 5 },
    { p: "asst", from: 3, to: 4 },
  ],
});
