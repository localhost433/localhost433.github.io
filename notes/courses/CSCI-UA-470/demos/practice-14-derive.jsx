import { mcq } from "@course";

/* note 14 practice — the central habit: read the classes off the sequence diagram.
   Every question here starts from an interaction and asks what structure falls out
   of it, which is the direction the note insists on (the interaction DISCOVERS the
   structure; the class diagram is not drawn from thin air). */

export default mcq({
  questions: [
    {
      stem: "A sequence diagram for `Place order` has this top row. Which classes does it tell you to declare?",
      figure: {
        lang: "text",
        code: "Customer(actor)   m : MenuGUI   o : Order   k : Kitchen\n     |               |            |           |\n     |--select()---->|            |           |\n     |               |--submit()->|           |\n     |               |            |--cook()-->|",
      },
      choices: [
        { text: "`MenuGUI`, `Order`, `Kitchen`", correct: true },
        { text: "`Customer`, `MenuGUI`, `Order`, `Kitchen`" },
        { text: "`select`, `submit`, `cook`" },
        { text: "Only `Order`, since it is the one in the middle" },
      ],
      why: "The **objects** on the top row become the classes: `m : MenuGUI`, `o : Order`, `k : Kitchen`. `Customer` is an **actor** — a stick figure outside the system boundary, not a class you implement. The messages (`select`, `submit`, `cook`) become the **operations** on those classes, not classes themselves.",
    },
    {
      stem: "You draw two sequence diagrams and they come out identical except that one uses `k : KgLbGUI` / `convertKgToLb(amount)` and the other uses `k : CmInchGUI` / `convertCmToInch(amount)`. What is the model telling you?",
      choices: [
        { text: "The two are the same interaction; generalize so the difference becomes a parameter", correct: true },
        { text: "Nothing — two use cases legitimately need two sequence diagrams" },
        { text: "The sequence diagrams are wrong and must be redrawn" },
        { text: "You need a third diagram to reconcile them" },
      ],
      why: "Two diagrams of the **same shape** are the cue that the model is over-specified. Making the unit **data rather than identity** — one `convert(amount, targetUnit)` — collapses the pair into one interaction. Removing a duplicated use case removes a duplicated sequence, which removes a duplicated method, which removes duplicated code.",
    },
    {
      stem: "In the converter's sequence diagram, `Converter` never appears in the use-case diagram. Why is it a class anyway?",
      choices: [
        { text: "It earned its place by exchanging messages — the interaction discovers objects the use case never named", correct: true },
        { text: "Every design must have a worker class" },
        { text: "It was added by mistake and should be removed" },
        { text: "Use-case diagrams always omit exactly one class" },
      ],
      why: "A use case names a **goal** from the outside; it deliberately says nothing about the objects inside. The sequence diagram is where the collaboration is written out, and any object that has to send or receive a message to make the goal happen is real. `Converter` owns the arithmetic, so it appears on a lifeline — and therefore in the class diagram.",
    },
  ],
});
