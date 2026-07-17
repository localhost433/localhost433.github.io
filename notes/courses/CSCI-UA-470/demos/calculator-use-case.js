/* AUTO-GENERATED from calculator-use-case.jsx by `npm run build:artifacts` — do not edit. */
import { useCaseDiagram } from "@course";

/* note 15 — the calculator's requirements view, the first diagram of the L15
   worked example. One actor, three goals. Deliberately the same shape as the
   unit converter of note 14 before its refactor: three same-shaped ovals whose
   only difference is the operation — the duplication the sequence diagrams
   will make visible next. */

export default useCaseDiagram({
  system: "Calculator",
  actors: [{
    id: "user",
    label: "User",
    x: 130,
    y: 150
  }],
  cases: [{
    id: "add",
    label: "Add numbers",
    x: 400,
    y: 60
  }, {
    id: "sub",
    label: "Sub numbers",
    x: 400,
    y: 150
  }, {
    id: "mul",
    label: "Multiply numbers",
    x: 400,
    y: 240
  }],
  associations: [{
    actor: "user",
    cases: ["add", "sub", "mul"]
  }],
  caption: {
    text: "three goals that differ only in the operation — remember the converter",
    color: "--mm-muted"
  }
});