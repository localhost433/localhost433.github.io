import { useCaseWalkthrough, converterUseCase, converterUseCaseSteps } from "@course";

/* note 14 — the first move of the iterative design loop. The unit converter's two
   goals are drawn honestly as two use cases, the repeated shape is named, and then
   generalization folds them under one parameterized `Convert(amount, targetUnit)`.
   Deleting a use case here is what deletes a sequence diagram, then a method, then
   code — so this is where the design pass pays for itself. The settled result is
   the static figure in converter-use-case-final. */

export default useCaseWalkthrough({
  title: "Unit Converter — two use cases, then one",
  spec: converterUseCase,
  steps: converterUseCaseSteps,
});
