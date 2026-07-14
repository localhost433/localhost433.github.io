import { useCaseDiagram, converterUseCase } from "@course";

/* note 14 — the generalized use-case diagram, for reference: the two conversions
   are children of one parameterized `Convert(amount, targetUnit)` under the
   hollow-triangle generalization arrow, the same relation note 12 used for
   `Phone Order` / `Internet Order` → `Place Order`. Sibling of the stepped
   converter-use-case-generalize, exactly as use-case-library is to its -steps. */

export default useCaseDiagram({
  ...converterUseCase,
  caption: { text: "the unit is a parameter now, not an identity — one Convert, two children", color: "--mm-muted" },
});
