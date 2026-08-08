// notes/courses/CSCI-UA-470/demos/practice-22-memento-order.jsx
import { sequenceOrder } from "@course";

/* note 22 practice — one ctrl+Z as a sequence diagram, mirroring practice-22-chain-order.
   The order is forced by data flow (you cannot write values you have not read yet), so
   there is exactly one right answer, and building it exposes the thing a description
   glosses over:

   the Document is never ASKED anything. It has no undo(), no history, and no say in
   the matter — it is written to. Every student who has only read the summary puts
   `CareTaker -> Document` first, because "undo" sounds like something a document does. */

export default sequenceOrder({
  prompt: "The user has edited and saved twice, so the caretaker's list holds two mementos. They press ctrl+Z. Order the six messages — and watch which participant never gets asked a question.",
  participants: [
    { id: "user", label: "User", kind: "actor" },
    { id: "c", label: "c : CareTaker" },
    { id: "m", label: "m : Memento" },
    { id: "d", label: "d : Document" },
  ],
  messages: [
    { id: "undo", from: "user", to: "c", label: "undo()", kind: "sync",
      why: "ctrl+Z reaches the **caretaker**, not the document. The document has no undo method to call — that is the whole point of moving the history out of it." },
    { id: "read", from: "c", to: "m", label: "read title, name, content", kind: "sync",
      why: "The caretaker takes the **last** entry in its list — `mementos[-1]` — because the stack is LIFO. Nothing has been written anywhere yet; this step only fetches." },
    { id: "vals", from: "m", to: "c", label: "the three saved values", kind: "return",
      why: "A memento has no behaviour: it hands back exactly the three fields it was given and does nothing else. This is what separates it from a Command, which would have *acted*." },
    { id: "write", from: "c", to: "d", label: "write title, name, content", kind: "sync",
      why: "Only now can the document be touched, because only now are the old values in hand. Anyone who placed this before the read has the data flowing backwards." },
    { id: "wrote", from: "d", to: "c", label: "restored", kind: "return",
      why: "The document's part is over. Note what it never did: it did not consult a history, did not decide what to restore, and gained no method for any of this." },
    { id: "done", from: "c", to: "user", label: "done", kind: "return",
      why: "The caretaker's own call returns, and it drops the entry it just used — so the next ctrl+Z reaches the snapshot before this one. The stack is the entire undo feature." },
  ],
  activations: [
    { p: "c", from: 0, to: 5 },
    { p: "m", from: 1, to: 2 },
    { p: "d", from: 3, to: 4 },
  ],
});
