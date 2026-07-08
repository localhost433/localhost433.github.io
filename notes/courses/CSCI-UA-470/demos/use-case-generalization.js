/* AUTO-GENERATED from use-case-generalization.jsx by `npm run build:artifacts` — do not edit. */
import { useCaseRelation } from "@course";

/* note 12 — GENERALIZATION between use cases: a child is a specialised parent and
   inherits its behaviour. Slide example: Phone Order and Internet Order both
   generalize to Place Order. Same hollow-triangle arrow as class inheritance. */

export default useCaseRelation({
  kind: "generalize",
  focal: "Place Order",
  satellites: ["Phone Order", "Internet Order"],
  caption: "child “is a kind of” parent — inherits its behaviour"
});