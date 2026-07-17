import { sequenceDiagram } from "@course";

/* note 15 — the Add flow of the calculator, the middle diagram of the L15
   traceability chain. The interesting move is the CREATE: MainGUI constructs
   its Mathematician mid-scene (`new()`), so the participant's header floats at
   the creation row (bornAt) instead of the top line. The lecture drew Sub and
   Multiply too — both isomorphic to this one, only the do_* message renamed —
   which is exactly the duplication argument note 14 made with the converter. */

export default sequenceDiagram({
  participants: [
    { id: "user", label: "User", kind: "actor" },
    { id: "gui", label: "g : MainGUI" },
    { id: "math", label: "m : Mathematician", bornAt: 1 },
  ],
  messages: [
    { from: "user", to: "gui", label: "add(n1, n2)", kind: "sync" },        // 0
    { from: "gui", to: "math", label: "new()", kind: "sync" },              // 1 — creation
    { from: "gui", to: "math", label: "do_addition(n1, n2)", kind: "sync" },// 2
    { from: "math", to: "gui", label: "result", kind: "return" },           // 3
    { from: "gui", to: "gui", label: "show_result(result)", kind: "sync", self: true }, // 4
    { from: "gui", to: "user", label: "result", kind: "return" },           // 5
  ],
  activations: [
    { p: "gui", from: 0, to: 5 },
    { p: "math", from: 2, to: 3 },
    { p: "gui", from: 4, to: 4, dx: 4 }, // nested self-call bar
  ],
  caption: { text: "Sub and Multiply are this exact diagram with do_subtraction / do_multiply swapped in", color: "--mm-muted" },
});
