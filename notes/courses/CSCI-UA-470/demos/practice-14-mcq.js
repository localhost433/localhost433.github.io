/* AUTO-GENERATED from practice-14-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 14 practice — the conceptual traps: class vs object diagram, and the
   structural relationship ladder (dependency → association → aggregation →
   composition → generalization). The aggregation/composition split is the one that
   costs marks, since both are diamonds and only the FILL distinguishes them. */

export default mcq({
  questions: [{
    stem: "What is in the middle compartment of a box on an **object** diagram, as opposed to a class diagram?",
    choices: [{
      text: "Attribute **values** (not declarations)",
      correct: true
    }, {
      text: "Attribute declarations"
    }, {
      text: "The object's operations"
    }, {
      text: "The object's associations"
    }],
    why: "A class diagram is a **design-time blueprint**: `radius : double`. An object diagram is a **run-time snapshot**: `radius = 2.0`. The other giveaway is the title — an object box writes an **underlined** `name : Class`, the same notation a sequence-diagram participant uses, because a participant *is* an object."
  }, {
    stem: "A `Window` owns its `TitleBar`: destroy the window and the title bar goes with it. Which relationship, and which notation?",
    choices: [{
      text: "Composition — **filled** diamond at `Window` end",
      correct: true
    }, {
      text: "Aggregation — **hollow** diamond at `Window` end"
    }, {
      text: "Composition — **filled** diamond at `TitleBar` end"
    }, {
      text: "Association — a plain line"
    }],
    why: "**Composition** is the tighter whole/part bond: the part **dies with the whole**. It draws a **filled** diamond, and the diamond always sits at the **whole** end (`Window`), never on the part. **Aggregation** — the hollow diamond — is the looser one, where the part can outlive the whole (a `Team` and its `Player`s)."
  }, {
    stem: "Order these from **loosest** to **tightest** coupling.",
    choices: [{
      text: "dependency → association → aggregation → composition → generalization",
      correct: true
    }, {
      text: "association → dependency → composition → aggregation → generalization"
    }, {
      text: "generalization → composition → aggregation → association → dependency"
    }, {
      text: "dependency → aggregation → association → generalization → composition"
    }],
    why: "The ladder runs **dependency** (dashed arrow — merely uses) → **association** (plain line — knows about) → **aggregation** (hollow diamond — has-a, separable) → **composition** (filled diamond — owns, inseparable) → **generalization** (hollow triangle — is-a, the tightest, since the child inherits the parent's whole interface)."
  }, {
    stem: "In the iterative design loop, what does applying **generalization** to two same-shaped use cases actually buy you?",
    choices: [{
      text: "Eliminates redundant use cases, diagrams, methods, and code",
      correct: true
    }, {
      text: "Makes the class diagram larger but clearer"
    }, {
      text: "Is a drawing convention with no real design impact"
    }, {
      text: "Eliminates the need for sequence diagrams"
    }],
    why: "This is the whole point of refactoring **in the model**. Two use cases of the same shape become one parameterized parent; the two identical sequence diagrams collapse into one; the two unit-specific methods become one `convert(amount, targetUnit)`; and the duplicated code is never written. Modeling duplication is cheaper to delete than coded duplication."
  }]
});