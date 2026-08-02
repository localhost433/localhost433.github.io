/* AUTO-GENERATED from practice-13-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 13 practice — the notation that costs marks when you READ a sequence diagram:
   the sync-vs-async arrowhead, what an activation bar actually means, the dashed
   return, the self-call, and the opt/alt/loop fragment operators. The ordering
   builders on this page drill time-ordering; this drills the symbols themselves. */

export default mcq({
  questions: [{
    stem: "A message is drawn as a **solid line with a filled (solid) arrowhead**. What does that encode?",
    choices: [{
      text: "A **synchronous** call — the caller blocks",
      correct: true
    }, {
      text: "An asynchronous call — the caller moves on"
    }, {
      text: "A return of control to the caller"
    }, {
      text: "The creation of a new object"
    }],
    why: "A **filled** arrowhead on a solid line is a **synchronous** (blocking) call: the caller's flow is interrupted until the callee finishes. An **open/thin** arrowhead on a solid line is **asynchronous** — the caller fires and moves on. A **dashed** line with an open head is the **return**."
  }, {
    stem: "What does the thin **activation bar** on a lifeline represent?",
    choices: [{
      text: "The object's method is **on the stack** — executing or waiting",
      correct: true
    }, {
      text: "The object exists throughout the diagram's timeline"
    }, {
      text: "The object is being created at this moment"
    }, {
      text: "A combined fragment is executing"
    }],
    why: "The **activation** (or execution occurrence) is the box drawn while that object's method is **on the call stack** — either executing, or blocked waiting for a call it made to return. The dashed **lifeline** underneath just says the object *exists* through time; the bar says it is *active*. **Nested** bars indicate recursion or a self-call."
  }, {
    stem: "How is a **return** of control drawn, as opposed to the call that triggered it?",
    choices: [{
      text: "**Dashed** line with **open** arrowhead",
      correct: true
    }, {
      text: "Solid line with filled arrowhead"
    }, {
      text: "Solid line with open arrowhead"
    }, {
      text: "An X at the lifeline's end"
    }],
    why: "A **return** is a **dashed** arrow with an **open** head, carrying control (and any result) back to the caller. A **solid filled** head is a synchronous call; a **solid open** head is asynchronous; an **X** at the foot of a lifeline is object **deletion**, not a return."
  }, {
    stem: "The receptionist checks the drink's quality by calling **its own** `checkQuality()` method. How does that appear on the diagram?",
    choices: [{
      text: "A **self-call**: a small loop nesting a new activation bar",
      correct: true
    }, {
      text: "A message arrow to the next participant on the right"
    }, {
      text: "A dashed return arrow from the object to itself"
    }, {
      text: "An X marking on the object's lifeline"
    }],
    why: "A message from an object **back to itself** is a **self-call** — a little loop off its own lifeline that **nests a second activation bar** on top of the first (the object is now running a method it called from within another of its methods). It is not a message to another participant, and not a return."
  }, {
    stem: "A frame is tabbed **`alt`** with a guard `[balance ≥ amount]` above a dashed divider and `[else]` below it. What does it mean?",
    choices: [{
      text: "Mutually-exclusive branches: first runs if guard holds; else otherwise",
      correct: true
    }, {
      text: "Optional block running only if the guard is true; no else"
    }, {
      text: "A loop repeating its body while the guard holds"
    }, {
      text: "Two branches that both always run in sequence"
    }],
    why: "**`alt`** is the mutually-exclusive choice: the divider splits it into branches, the first taken when its guard is true and the `[else]` branch otherwise — exactly one runs. **`opt`** is a single branch with no else (runs only if the guard holds); **`loop`** repeats its body while the guard holds."
  }, {
    stem: "A participant box at the top of the diagram reads **`Mike : Cashier`** with the text underlined. What is it?",
    choices: [{
      text: "A specific **object** — instance of class `Cashier`",
      correct: true
    }, {
      text: "The class `Cashier` itself, as on a class diagram"
    }, {
      text: "A use case named `Mike`"
    }, {
      text: "A message from `Mike` to `Cashier`"
    }],
    why: "A sequence-diagram participant is an **object**, written as an **underlined** `name : Class` (`Mike : Cashier`) — the very same notation used for a box on an **object diagram**, because a participant *is* an instance living through the interaction. An external initiator (with no class) is instead drawn as a stick-figure **actor**."
  }]
});