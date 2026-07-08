/* AUTO-GENERATED from use-case-library-steps.jsx by `npm run build:artifacts` — do not edit. */
import { useCaseWalkthrough, librarySystem, librarySteps } from "@course";

/* note 12 — the Library System built up piece by piece: actors → each actor's
   goals → the shared use case → the «extend» relations. Fixed frame, so the
   diagram grows in place. Same `librarySystem` spec as the static figure. */

export default useCaseWalkthrough({
  title: "Library System — built step by step",
  spec: librarySystem,
  steps: librarySteps
});