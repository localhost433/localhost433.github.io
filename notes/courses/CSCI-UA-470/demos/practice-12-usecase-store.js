/* AUTO-GENERATED from practice-12-usecase-store.jsx by `npm run build:artifacts` — do not edit. */
// notes/courses/CSCI-UA-470/demos/practice-12-usecase-store.jsx
import { useCaseBuild } from "@course";

/* note 12 practice — a second, richer use-case build that forces the include-vs-
   extend decision in ONE diagram (the first Library build only used «extend»). An
   online store: the Customer checks out and browses; an Admin adds products.
   - Checkout «include» Verify Payment — verifying payment ALWAYS happens as part of
     checkout, so it is mandatory factored-out behavior: base → included.
   - Write Review «extend» View Product — a review is written only sometimes, on top
     of a View Product that stands alone, so it is optional: extension → base.
   Getting both right (and their opposite arrow directions) is the whole exam trap. */

export default useCaseBuild({
  prompt: "Build the Online Store diagram: place actors outside and use cases inside, join each actor to its cases, then add the two case-to-case relations — Checkout to Verify Payment, and Write Review to View Product. One is «include», one is «extend».",
  system: "Online Store",
  elements: [{
    id: "customer",
    label: "Customer",
    role: "actor",
    whyZone: "The Customer is a person the system serves — an actor OUTSIDE the boundary."
  }, {
    id: "admin",
    label: "Admin",
    role: "actor",
    whyZone: "The Admin is also an external actor — outside the boundary, not a use case inside it."
  }, {
    id: "checkout",
    label: "Checkout",
    role: "case",
    whyZone: "Checking out is a goal the system provides — a use-case oval INSIDE the boundary."
  }, {
    id: "verify",
    label: "Verify Payment",
    role: "case",
    whyZone: "Verifying payment is a use case (a factored-out step) — inside the boundary."
  }, {
    id: "view",
    label: "View Product",
    role: "case",
    whyZone: "Viewing a product is a use case the system offers — inside the boundary."
  }, {
    id: "review",
    label: "Write Review",
    role: "case",
    whyZone: "Writing a review is a use case — inside the boundary."
  }, {
    id: "addprod",
    label: "Add Product",
    role: "case",
    whyZone: "Adding a product is a use case — inside the boundary."
  }],
  associations: [{
    actor: "customer",
    cases: ["checkout", "view"]
  }, {
    actor: "admin",
    cases: ["addprod"]
  }],
  relations: [{
    from: "checkout",
    to: "verify",
    kind: "include",
    why: "Verifying payment ALWAYS runs as part of checking out, so it is mandatory factored-out behavior: «include». The dashed arrow points from the base to the step it pulls in — Checkout → Verify Payment."
  }, {
    from: "review",
    to: "view",
    kind: "extend",
    why: "A review is written only sometimes, on top of a View Product that is complete on its own, so it is optional: «extend». The dashed arrow points from the extension back to the base — Write Review → View Product, the reverse of «include»."
  }]
});