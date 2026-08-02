import { mcq } from "@course";

/* note 15 practice — the concepts around the code translation: the BCE
   stereotypes (who counts as boundary — including the DB connection, the
   lecture's favourite curveball), the grammar table, CRC cards, and what the
   traceability chain buys. */

export default mcq({
  questions: [
    {
      stem: "A system talks to users through forms and to a database through a connection object. Which objects are **boundary** objects?",
      choices: [
        { text: "Both the forms and the DB connection", correct: true },
        { text: "Only the forms; DB connection is entity" },
        { text: "Only the DB connection; forms are control" },
        { text: "Neither; boundary means the system box" },
      ],
      why: "Boundary objects sit wherever the system meets **anything outside itself** — human or not. The lecture drew the DB connection as a boundary object on the *database* edge, mirroring the input/output forms on the *user* edge. The trap is assuming boundary = UI.",
    },
    {
      stem: "In the three-stereotype picture, what does the **control** object do?",
      choices: [
        { text: "Routes messages: boundary → entities → results", correct: true },
        { text: "Stores the domain data the system remembers" },
        { text: "Renders output for the user" },
        { text: "Persists data to the database" },
      ],
      why: "The control object is the **handler** in the middle: boundary objects hand it input, it fans out to the **entity** objects (the data), and pushes results back toward the boundary. In the coffee-shop staffing analogy it is the barista — the one who *does* the order rather than *taking* or *storing* it.",
    },
    {
      stem: "Running the grammar table over \"A library **has** members; each member **is a kind of** person who **borrows** books\" — which mapping is right?",
      choices: [
        { text: "has → aggregation; is a kind of → inheritance; borrows → operation", correct: true },
        { text: "has → inheritance; is a kind of → aggregation; borrows → attribute" },
        { text: "has → operation; is a kind of → constraint; borrows → association" },
        { text: "All three verbs become operations" },
      ],
      why: "The table sorts by the **kind** of verb: *having* verbs (has, consists of, includes) → aggregation/composition; *being* verbs (is one of, is a kind of) → inheritance; *doing* verbs (borrows, submits, runs) → operations. Nouns meanwhile propose the classes — library, member, person, book.",
    },
    {
      stem: "What are the two columns on a CRC card?",
      choices: [
        { text: "Responsibilities and Collaborators", correct: true },
        { text: "Attributes and Operations" },
        { text: "Requirements and Constraints" },
        { text: "Classes and Relationships" },
      ],
      why: "**C**lass, **R**esponsibility, **C**ollaborator: one card per candidate class, what it *knows and does* on the left, *who it works with* on the right. It is a walk-through tool — replaying the scenarios against the cards discovers responsibilities the grammar pass missed.",
    },
    {
      stem: "In the calculator example, the class diagram gives `MainGUI` a **dashed arrow** to `Mathematician`. What in the *sequence diagram* forces that choice?",
      choices: [
        { text: "`Mathematician` created in call; method-local", correct: true },
        { text: "The return message `result` is dashed too" },
        { text: "`Mathematician` has no attributes" },
        { text: "Dashed vs solid is just stylistic" },
      ],
      why: "Traceability is the point of the chain: the sequence diagram shows `MainGUI` creating its `Mathematician` **during** `add(n1, n2)` and dropping it after the result returns. A reference that lives only inside a method is a **dependency** — dashed. Had the diagram shown a Mathematician held as a field across calls, the edge would be a solid association.",
    },
  ],
});
