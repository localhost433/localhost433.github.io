/* AUTO-GENERATED from practice-15-relation.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 15 practice — the reverse drill: given the Java, name the relationship.
   The forward direction (diagram → code) is what the stepper teaches; the exam
   also asks it backwards. The deliberate trap pair is dependency-as-parameter
   vs association-as-field — same class name in the source, different UML edge,
   decided ONLY by where the reference lives. */

export default mcq({
  questions: [{
    stem: "Which relationship does this code realize between `Person` and `Address`?",
    figure: {
      code: "class Person {\n    Address a;\n}",
      lang: "java"
    },
    choices: [{
      text: "Association — a plain line from `Person` to `Address`",
      correct: true
    }, {
      text: "Dependency — a dashed arrow"
    }, {
      text: "Aggregation — a hollow diamond at `Person`"
    }, {
      text: "Generalization — a hollow triangle at `Address`"
    }],
    why: "The reference lives in a **field**, so `Person` *knows about* `Address` for its whole lifetime — that is an **association**, the plain line. A diamond needs a whole/part claim (usually a collection of parts), and a dashed dependency would keep `Address` out of the fields entirely."
  }, {
    stem: "Same class, one edit — the reference moved. Now which relationship?",
    figure: {
      code: "class Person {\n    void mail(Address a) {\n        ...\n    }\n}",
      lang: "java"
    },
    choices: [{
      text: "Dependency — `Person` uses `Address` temporarily",
      correct: true
    }, {
      text: "Association — same as before, the type didn't change"
    }, {
      text: "Composition — `Address` is now inside `Person`"
    }, {
      text: "Realization — `Person` implements `Address`"
    }],
    why: "Now `Address` appears **only inside a method** — as a parameter. When `mail()` returns, the relationship is over: that is **dependency**, the dashed open arrow. The other method-local form is `Address a = new Address();` inside the body. *Where the reference lives* is the whole question: field → association, method → dependency."
  }, {
    stem: "What does this pair translate to in a class diagram?",
    figure: {
      code: "class Manager {\n    List<Worker> workers;\n}",
      lang: "java"
    },
    choices: [{
      text: "Aggregation — hollow diamond at the `Manager` end",
      correct: true
    }, {
      text: "Composition — filled diamond at the `Manager` end"
    }, {
      text: "Aggregation — hollow diamond at the `Worker` end"
    }, {
      text: "Dependency — dashed arrow to `Worker`"
    }],
    why: "A collection of parts held by a whole is the diamond family, and the diamond always rides the **whole** end (`Manager`). It is the **hollow** one because workers are built elsewhere and **outlive** the manager. For the filled diamond the lecture went further: `class Hand` declared *inside* `Person` — parts that cannot exist without the whole."
  }, {
    stem: "`class Shape implements Drawable` draws as…",
    choices: [{
      text: "A **dashed** line with a hollow triangle at `Drawable` — realization",
      correct: true
    }, {
      text: "A **solid** line with a hollow triangle at `Drawable` — generalization"
    }, {
      text: "A dashed **open arrow** at `Drawable` — dependency"
    }, {
      text: "A plain line — association"
    }],
    why: "`implements` is **realization**: the same hollow triangle as inheritance (it is still an is-a promise), but the line goes **dashed** because `Shape` receives no implementation — only the contract. Solid-triangle `extends` and dashed-triangle `implements` differ by exactly one keyword and one line style."
  }]
});