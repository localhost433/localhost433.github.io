/* AUTO-GENERATED from practice-12-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 12 practice — the include/extend/generalization "exam trap" the note flags
   in its own words. Each question pins one axis of the trap: which relationship a
   scenario calls for, which way the dashed arrow points, and where the actor sits.
   The two that cost marks are (a) include vs extend — mandatory-shared vs
   optional-conditional — and (b) the ARROW DIRECTION, which is opposite for the two:
   include points base→included, extend points extension→base. */

export default mcq({
  questions: [{
    stem: "Verifying a student's ID is a step that **always** runs as part of both *Update grades* and *Generate report*. Which relationship connects each base to that shared step?",
    choices: [{
      text: "`<<include>>` — the shared step always runs, so factor it out",
      correct: true
    }, {
      text: "`<<extend>>` — the shared step is optional"
    }, {
      text: "Generalization — the shared step is a specialized kind of the base"
    }, {
      text: "A plain association — use cases only connect to actors"
    }],
    why: "**Include** is mandatory, factored-out common behavior: the included use case *always* runs as part of the base. Because both *Update grades* and *Generate report* must verify the ID, `Verify student ID` is pulled out once and each base `<<include>>`s it. **Extend** would be wrong — it is for *conditional* behavior on a base that is already complete on its own."
  }, {
    stem: "On a shopping site, *Write a review* runs only if the shopper chooses to, on top of a *View product details* use case that is complete without it. Which relationship, and which way does the dashed arrow point?",
    choices: [{
      text: "`<<extend>>`, arrow from *Write a review* → *View product details* (extension → base)",
      correct: true
    }, {
      text: "`<<extend>>`, arrow from *View product details* → *Write a review* (base → extension)"
    }, {
      text: "`<<include>>`, arrow from *View product details* → *Write a review*"
    }, {
      text: "Generalization, arrow from *Write a review* → *View product details*"
    }],
    why: "This is optional, conditional behavior, so it is **extend**. The direction is the trap: the `<<extend>>` arrow points **from the extending use case back to the base** it may add to (*Write a review* → *View product details*). Contrast **include**, whose arrow points the *other* way — from the base to the step it always pulls in."
  }, {
    stem: "*Phone Order* and *Internet Order* are two specialized kinds of *Place Order*, each inheriting its meaning. Which relationship and notation?",
    choices: [{
      text: "Generalization — a **hollow-triangle** arrow from each child up to *Place Order*",
      correct: true
    }, {
      text: "`<<include>>` — a dashed arrow from *Place Order* to each child"
    }, {
      text: "`<<extend>>` — a dashed arrow from each child to *Place Order*"
    }, {
      text: "Association — a plain line between the three ovals"
    }],
    why: "\"A specialized kind of, inheriting the parent's behavior\" is **generalization** — the very same **hollow-triangle** arrow used for class inheritance, pointing from each child (*Phone Order*, *Internet Order*) up to the parent (*Place Order*). Both include and extend use *dashed* arrows and describe steps, not is-a specializations."
  }, {
    stem: "In one line, what distinguishes `<<include>>` from `<<extend>>`?",
    choices: [{
      text: "Include is **mandatory** shared behavior that always runs; extend is **optional** behavior that runs only under certain conditions",
      correct: true
    }, {
      text: "Include is optional; extend is mandatory"
    }, {
      text: "Include connects actors to cases; extend connects cases to cases"
    }, {
      text: "They are interchangeable — the choice is only stylistic"
    }],
    why: "**Include = always runs** (factored-out common behavior every execution of the base performs). **Extend = runs only sometimes** (conditional behavior added to a base that is already complete on its own). This one distinction — and the opposite arrow directions that follow from it — is what the exam tests."
  }, {
    stem: "You are drawing a use-case diagram. Where do the **actors** go, and what does the boundary box contain?",
    choices: [{
      text: "Actors sit **outside** the boundary; the boundary box holds the **use-case ovals**",
      correct: true
    }, {
      text: "Actors sit inside the boundary alongside the use cases"
    }, {
      text: "Actors go inside; only the system name goes in the boundary box"
    }, {
      text: "There is no boundary — actors and use cases float freely"
    }],
    why: "An actor is **external** to the system — a person or other system that pursues a goal — so it is drawn as a stick figure **outside** the rectangular boundary. The boundary contains the **use cases** (ovals), the goals the system offers. A plain **association** line then joins each actor to the use cases it participates in."
  }, {
    stem: "A use-case diagram is meant to capture which view of the system?",
    choices: [{
      text: "**What** the system does for its actors — behavior/requirements, not implementation",
      correct: true
    }, {
      text: "**How** the system is implemented internally, method by method"
    }, {
      text: "The static class structure and its associations"
    }, {
      text: "The order of messages exchanged between objects over time"
    }],
    why: "\"A UML diagram describes **what** a system does, not how.\" The use case diagram is the **Behavioral** view: external actors and the goals they pursue. *How* those goals are met object-by-object is the **sequence** diagram (note 13); the static structure is the **class** diagram (note 14)."
  }]
});