import { useCaseDiagram } from "@course";

/* password-keeper — the L17 use case diagram, exactly as the slide draws it: one
   actor, three goals, and ONE case-to-case relation. The user associates with Add
   and View only; Delete hangs off View by a dashed «extend» arrow pointing from the
   extension to the base — deleting is optional behaviour reachable only while
   viewing, not a standalone goal. */

export default useCaseDiagram({
  system: "Password Keeper",
  actors: [{ id: "user", label: "User", x: 120, y: 140 }],
  cases: [
    { id: "add", label: "Add new password", x: 400, y: 70 },
    { id: "view", label: "View passwords", x: 400, y: 190 },
    { id: "delete", label: "Delete password", x: 690, y: 190 },
  ],
  associations: [{ actor: "user", cases: ["add", "view"] }],
  relations: [
    { id: "x-delete", from: "delete", to: "view", kind: "extend", labelDy: -8 },
  ],
  caption: { text: "the extend arrow leaves the extension and lands on the base — Delete knows View, never the reverse", color: "--mm-muted" },
});
