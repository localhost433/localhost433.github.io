/* AUTO-GENERATED from use-case-library.jsx by `npm run build:artifacts` — do not edit. */
import { useCaseDiagram, librarySystem } from "@course";

/* note 12 — the Library System worked example as one static reference figure:
   two actors flanking the boundary, columns of use cases, the shared
   `List all Borrowings` reached by both, and the «extend» relations. The same
   `librarySystem` spec drives the stepped walkthrough in use-case-library-steps. */

export default useCaseDiagram({
  ...librarySystem,
  caption: {
    text: "two actors · a shared case · «extend» relations between use cases",
    color: "--mm-muted"
  }
});