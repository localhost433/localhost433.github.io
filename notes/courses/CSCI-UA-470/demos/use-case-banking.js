/* AUTO-GENERATED from use-case-banking.jsx by `npm run build:artifacts` — do not edit. */
import { useCaseDiagram } from "@course";

/* note 12 — a complete (if small) use-case diagram: the Online Banking worked
   example. One actor, Customer, outside the boundary; four goals inside it, each
   joined by a plain association. The everyday shape of a use-case diagram. */

export default useCaseDiagram({
  system: "Online Banking",
  actors: [{
    id: "cust",
    label: "Customer"
  }],
  cases: ["Open Account", "Deposit Funds", "Withdraw Funds", "Close Account"]
});