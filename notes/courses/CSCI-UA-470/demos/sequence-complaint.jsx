import { sequenceDiagram } from "@course";

/* note 13 — the second worked example from L13 ("Make a Complaint"), in the
   fuller of the lecture's two versions: the receptionist records the complaint
   and notifies the manager, the manager resolves it (a self-call) and explicitly
   notifies the receptionist of the result, and the receptionist returns it to
   the customer. Contrast with the collapsed version, where Sam's result is
   drawn returning straight to the customer. */

export default sequenceDiagram({
  participants: [
    { id: "cust", label: "Customer", kind: "actor" },
    { id: "recep", label: "Tara : Receptionist" },
    { id: "mgr", label: "Sam : Manager" },
  ],
  messages: [
    { from: "cust", to: "recep", label: "record_complaint(complaint_details)", kind: "sync" }, // 0
    { from: "recep", to: "mgr", label: "notify(complaint_details)", kind: "sync" },            // 1
    { from: "mgr", to: "mgr", label: "resolve()", kind: "sync", self: true },                  // 2
    { from: "mgr", to: "recep", label: "notify_client(result)", kind: "sync" },                // 3
    { from: "recep", to: "cust", label: "result", kind: "return" },                            // 4
  ],
  activations: [
    { p: "recep", from: 0, to: 1 },
    { p: "mgr", from: 1, to: 3 },
    { p: "mgr", from: 2, to: 2, dx: 4 }, // nested self-call bar
    { p: "recep", from: 3, to: 4 },
  ],
});
