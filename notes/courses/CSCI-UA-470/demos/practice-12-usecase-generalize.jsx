// notes/courses/CSCI-UA-470/demos/practice-12-usecase-generalize.jsx
import { useCaseBuild } from "@course";

/* note 12 practice — the third case-to-case relation, straight from the note's own
   example: Phone Order and Internet Order are two specialized kinds of Place Order,
   so each GENERALIZES to it — the hollow-triangle arrow, child → parent, the same
   notation as class inheritance. The library build drilled «extend» and the store
   build drilled «include»; this one closes the set with generalization. The actor
   associates only with the parent Place Order — the children inherit that link.
   Like the other two builds it opens with the Identify stage: tag the actor and the
   three use cases in the requirements sentence before placing anything. */

export default useCaseBuild({
  prompt: "Build the Order System diagram. First read the requirements and tag the actor and use cases; then drop each element inside or outside the boundary, connect the Customer to Place Order, and add the two case-to-case relations: Phone Order and Internet Order are each a specialized kind of Place Order.",
  system: "Order System",
  // Identify stage: the requirements as clickable words. Customer names a user
  // (actor); each order the system carries out is a use case; the connecting words
  // are left untagged.
  source: {
    tokens: [
      "A", { w: "Customer", role: "actor" }, "can", { w: "place an order,", role: "case", id: "place" },
      "either", "a", { w: "phone order", role: "case", id: "phone" }, "or", "an",
      { w: "internet order.", role: "case", id: "internet" },
    ],
  },
  elements: [
    { id: "customer", label: "Customer", role: "actor",
      whyZone: "The Customer is a person the system serves — an actor OUTSIDE the boundary." },
    { id: "place", label: "Place Order", role: "case",
      whyZone: "Placing an order is the general goal the system provides — a use-case oval INSIDE the boundary." },
    { id: "phone", label: "Phone Order", role: "case",
      whyZone: "A phone order is a use case — a specialized kind of Place Order, inside the boundary." },
    { id: "internet", label: "Internet Order", role: "case",
      whyZone: "An internet order is a use case — a specialized kind of Place Order, inside the boundary." },
  ],
  associations: [
    { actor: "customer", cases: ["place"] },
  ],
  relations: [
    { from: "phone", to: "place", kind: "generalize",
      why: "A Phone Order IS-A specialized kind of Place Order, so it GENERALIZES to it — a hollow-triangle arrow pointing from the child (Phone Order) up to the parent (Place Order), the same notation as class inheritance. Not «include» or «extend» — those are dashed step arrows, not is-a specializations." },
    { from: "internet", to: "place", kind: "generalize",
      why: "An Internet Order is likewise a specialized kind of Place Order — a second generalization, hollow triangle from Internet Order up to Place Order. The actor's association with the parent is inherited by both children, which is why only Place Order needs a line to the Customer." },
  ],
});
