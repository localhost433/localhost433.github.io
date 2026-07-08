/* AUTO-GENERATED from use-case-extend.jsx by `npm run build:artifacts` — do not edit. */
import { useCaseRelation } from "@course";

/* note 12 — «extend»: the base use case is COMPLETE on its own; under certain
   conditions an extending use case adds to it. Slide example: on a shopping site,
   View product details is extended by Add to shopping cart and Write a review. */

export default useCaseRelation({
  kind: "extend",
  focal: {
    label: ["View product", "details"]
  },
  satellites: ["Add to shopping cart", "Write a review"],
  caption: "the base is complete on its own — the extension is conditional"
});