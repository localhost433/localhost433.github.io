import { mcq } from "@course";

/* note 22 practice — the graded pass over the four patterns that EXTRACT rather than
   swap. The first two questions come over from practice-21-mcq with their sections
   (Chain and Iterator); the rest are new.

   The weight is on the note's two collisions: Memento vs Command (identical from
   outside — both are a stack you pop) and the Memento's custody rule, which the deck's
   public fields quietly break. The closing question is the note's thesis. */

export default mcq({
  questions: [
    {
      stem: "`if (canHandle(a)) approve(a); else nextHandler.handle(a);` — what makes this a chain rather than plain delegation?",
      choices: [
        { text: "`nextHandler` has the abstract parent's own type", correct: true },
        { text: "`handle` is declared abstract on the parent" },
        { text: "There are four concrete handler subclasses" },
        { text: "The sender holds a reference to only one handler" },
      ],
      why: "A field whose type is the class's own abstract parent is what lets the structure extend to any length and be rewired at run time — the same self-reference that makes a Composite recurse. Plain delegation forwards to a *different* type and stops there; abstract methods and subclass counts are true of half the catalog.",
    },
    {
      stem: "L20's Iterator crosses out a `Collection` with `getNextItemBasedOnIndex()`, `getNextItemBasedOnSize()`, and more. What is the objection?",
      choices: [
        { text: "The collection has taken on a second job — traversal", correct: true },
        { text: "The method names are too long to be readable" },
        { text: "Those methods should have been made static" },
        { text: "A collection should expose its list directly instead" },
      ],
      why: "Holding items and walking them are separate responsibilities that change for separate reasons, so the class grows forever on one axis — note 16's SRP, reached from the traversal side. Extracting `Iterator` also buys something the methods could not: each iterator carries its **own cursor**, so two walks can run over one collection at once.",
    },
    {
      stem: "Two undo stacks. One holds objects with `run()` and `undo()`; the other holds objects with three fields and no methods. Which is which?",
      choices: [
        { text: "Commands first, Mementos second", correct: true },
        { text: "Mementos first, Commands second" },
        { text: "Both are Command; the fields are its state" },
        { text: "Both are Memento; the stack is the giveaway" },
      ],
      why: "A Command **is an instruction**: it knows how to do the thing and how to reverse it, so it can be replayed as well as undone. A Memento **is a photograph**: no behaviour at all, just the state as it was, which the originator reads back into itself. The stack proves nothing — the two designs look identical from outside, and only what is *inside* the entries separates them.",
    },
    {
      stem: "In the Memento design, what is the `CareTaker` not supposed to do?",
      choices: [
        { text: "Read or change the fields inside a `Memento`", correct: true },
        { text: "Take a snapshot the document did not request" },
        { text: "Return a `Memento` to a different document" },
        { text: "Hold more than one `Memento` at a time" },
      ],
      why: "The caretaker's job is **custody**: keep them in order, hand the last one back, and never look inside. Only the originator knows what those fields mean. *Beyond the slide:* the deck draws `Memento` with public fields, which makes the rule unenforceable — a faithful Memento exposes a narrow interface to the caretaker and its full state only to the document, so encapsulation survives being snapshotted.",
    },
    {
      stem: "A visitor could simply be handed the shape. So what does `accept(v) { v.visit(this); }` actually buy?",
      choices: [
        { text: "A second dispatch, on the element's real type", correct: true },
        { text: "A place to run code before and after the visit" },
        { text: "A guarantee the visitor is not null when used" },
        { text: "The right to keep `visit` out of the interface" },
      ],
      why: "`v.visit(s)` binds on `s`'s **declared** type, so the concrete type is discarded at compile time. Putting the same call inside `Circle.accept` puts it somewhere `this` is statically a `Circle`, which is what lets the compiler choose `visit(Circle)`. That is the second dispatch — bought by hand, because Java dispatches on the receiver and never on an argument.",
    },
    {
      stem: "Chain, Iterator, Memento and Visitor all answer the same pressure. What is it?",
      choices: [
        { text: "A job was taken out of the class that had it", correct: true },
        { text: "A conditional was replaced by a polymorphic call" },
        { text: "An object was made cheaper to create repeatedly" },
        { text: "A hierarchy was flattened into a single class" },
      ],
      why: "The route left the sender, the cursor left the collection, the state left the document, the operation left the hierarchy. In each case the extracted job can now vary on its own axis without reopening the class it came from — note 16's Single Responsibility and Open–Closed arriving four more times, from four different directions. The polymorphic-call answer describes L20's other six, not these.",
    },
  ],
});
