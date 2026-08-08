import { mcq } from "@course";

/* note 23 practice — the graded pass over L22. Two strands:

   the PROCESS half (phases, roles, which artifact crosses which handoff), which is
   ordinary examinable material and the reason the course was ordered the way it was;

   and the ARGUMENT half, where the questions are deliberately about REASONS rather
   than claims. "AI writes 41% of code" is a figure to attribute, not to test; "why a
   stable abstraction is what makes regeneration safe" is a chain of reasoning the
   student either followed or did not. */

export default mcq({
  questions: [
    {
      stem: "In the whiteboard's development process, which phase produces the artifact this course spent six lectures on?",
      choices: [
        { text: "Design — UML, SOLID, and the pattern catalog", correct: true },
        { text: "Analysis — the use cases and the actor list" },
        { text: "Implementation — the C++ and Java source" },
        { text: "Requirements — the customer's stated needs" },
      ],
      why: "Use cases come out of **Analysis**; class and sequence diagrams, the five principles, and the twenty patterns are all outputs of **Design**. That is why the course drew for six lectures before the capstone wrote a line: the model is the deliverable of the phase, not a sketch on the way to one.",
    },
    {
      stem: "The board's role chain runs analyst → designer → programmer → tester. What actually crosses each handoff?",
      choices: [
        { text: "A document in a notation both sides can read", correct: true },
        { text: "A verbal briefing, minuted for the record later" },
        { text: "A working build of the previous stage" },
        { text: "A test suite the next stage must satisfy" },
      ],
      why: "Use cases from the analyst, a UML model from the designer, a build from the programmer. This is UML's entire justification and the reason notation rules are worth memorising: a diagram only the author can read has failed at its one job. The board labels analyst and designer *architects* for the same reason — both produce descriptions rather than running code.",
    },
    {
      stem: "The deck's headline claim is that SOLID and patterns \"describe the physics of software complexity — not the author of the code.\" What is the argument?",
      choices: [
        { text: "Coupling and cohesion set the cost of change either way", correct: true },
        { text: "Models are trained on code written before the AI era" },
        { text: "Generated code is measurably more tangled than human code" },
        { text: "The principles predate AI, so they are more thoroughly tested" },
      ],
      why: "The principles are claims about **systems**, not about typists. A class with five reasons to change is expensive to modify whoever wrote it; an abstraction still marks the seam along which parts can be replaced. Who or what emitted the characters does not enter into it — which is why \"the principles are old, AI is new\" is not an objection.",
    },
    {
      stem: "\"If the generated code is broken I'll just regenerate it.\" Why does the deck say stable abstractions are what make that plan work?",
      choices: [
        { text: "Regeneration is non-deterministic and can break callers", correct: true },
        { text: "A model cannot regenerate code it did not itself write" },
        { text: "Regenerating is far slower than editing the existing code" },
        { text: "The second attempt is usually worse than the first" },
      ],
      why: "Ask twice and you get two different implementations — fine if callers depend only on a fixed interface (ISP and DIP), and a cascade of edits if they reach into the details. The abstraction is what lets you throw the body away without touching anything else. The plan is not wrong; it just has a precondition, and the precondition is design.",
    },
    {
      stem: "The deck says AI moved the bottleneck. From what, to what?",
      choices: [
        { text: "From writing code to reading and reviewing it", correct: true },
        { text: "From designing systems to specifying them fully" },
        { text: "From fixing defects to reproducing them" },
        { text: "From shipping features to deploying them" },
      ],
      why: "Under the old loop you understood the code because you had typed every line of it; understanding was a by-product of writing. Generation is nearly free now, so nothing produces that understanding for you and review becomes the constraint. That is the practical case for structure: well-shaped code is faster to read, and reading is what you are now short of.",
    },
    {
      stem: "By the deck's account, which of these is *not* something the AI can settle for you?",
      choices: [
        { text: "Where the boundaries between units should fall", correct: true },
        { text: "The canonical form of a pattern you have named" },
        { text: "Tests for behaviour you have already defined" },
        { text: "Boilerplate, glue, and mechanical translation" },
      ],
      why: "The division of labour the deck draws: models are strong at writing a unit to a clear spec and at recalling a pattern's standard shape, and weak at deciding what should exist at all. Boundaries are a judgment about how the system will change, which is information about the future that no amount of context supplies — and it is the one that survives all of this.",
    },
  ],
});
