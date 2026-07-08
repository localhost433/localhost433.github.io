import { useCaseDiagram } from "@course";

/* note 12 — the canonical use-case diagram, built in the lecture's three steps:
   an ACTOR (Receptionist) outside the system, a USE CASE (Make Appointment) oval
   inside the boundary, and the ASSOCIATION line saying the two communicate.
   `showRoles` tags each of the three parts. */

export default useCaseDiagram({
  system: "Medical Clinic",
  actors: [{ id: "recep", label: "Receptionist" }],
  cases: ["Make Appointment"],
  showRoles: true,
});
