import { matchBuild } from "@course";

/* note 21 practice — the drill the whole note is built toward. Every scenario here
   would produce the SAME class diagram: a context with a field of an abstract type,
   three concrete subclasses, one delegating call. Structure decides nothing, so the
   student has to reason from intent.

   The three tests, one per pattern:
     Strategy — the CLIENT picks an interchangeable way to do one job
     State    — the OBJECT's own situation picks, and it changes over a lifetime
     Command  — the REQUEST becomes an object so invoker and receiver never meet

   Two items are deliberately near-misses (#3 reads like Strategy until you notice
   who changes it; #5 reads like State until you notice it is stored and replayed). */

export default matchBuild({
  prompt: "Every one of these would draw the same UML — a context, an abstract role, three subclasses, one delegating call. Stamp which of the three it actually is, and be ready to say why the other two are wrong.",
  paletteLabel: "Patterns",
  slotLabel: "is a",
  slotPlaceholder: "pattern",
  options: [
    { value: "strategy", label: "Strategy" },
    { value: "state", label: "State" },
    { value: "command", label: "Command" },
  ],
  items: [
    {
      text: "A route planner is told at start-up whether to optimise for *time*, *distance*, or *fuel*. Whichever it is told, it uses that rule for the rest of the run.",
      answer: "strategy",
      why: "The **client** chose, once, from interchangeable ways of answering one question — and every choice is a complete, valid answer to \"find me a route\". Not State: nothing about the planner's own situation changes what it does, and it never switches on its own.",
    },
    {
      text: "A vending machine behaves differently for the same `selectItem()` call depending on whether it is *idle*, *has credit*, or *out of stock* — and inserting a coin moves it from the first to the second.",
      answer: "state",
      why: "The same call does different things **at different moments in one object's life**, and the object moves between modes as events arrive. The transition (`insertCoin` → has credit) is the giveaway: strategies do not promote each other, states do.",
    },
    {
      text: "A text editor's toolbar buttons are each given an object with a `run()` method. The toolbar calls `run()` and knows nothing else; the objects are also kept in a list so the last few can be undone.",
      answer: "command",
      why: "The tell is the **list**. Strategy and State objects are held one at a time by a context; a command is stored, queued, and replayed, because the point was to turn a request into an object. The toolbar is an invoker that never learns who executes.",
    },
    {
      text: "A compression tool holds a `Compressor` and delegates `compress()` to it. The user picks ZIP, GZIP, or LZMA from a dropdown, and the tool holds that one until the user picks another.",
      answer: "strategy",
      why: "A dropdown is still the client choosing, and all three algorithms answer the same question equally well. It is *not* State merely because it can change later — what matters is that the change comes from **outside**, on a preference, not from the object's own progress through a lifecycle.",
    },
    {
      text: "A document holds a `mode` object and delegates `onKey()` to it. `NormalMode` switches the document to `InsertMode` when `i` is pressed; `InsertMode` switches it back on Escape.",
      answer: "state",
      why: "The modes **change the document into each other** — the object's behaviour is driven by where it is in its own lifecycle, and the transitions live inside the states. If a design's alternatives know about each other, it is State, because interchangeable strategies never do.",
    },
    {
      text: "A build server receives job objects over a queue. Each has an `execute()` method; the worker pops one and calls it without knowing whether it compiles, tests, or deploys.",
      answer: "command",
      why: "The request travels — serialised, queued, executed elsewhere by something that never learns what it does. That decoupling of *invoker* from *receiver* is Command's stated intent, and neither neighbour aims at it: a Strategy is chosen by the context's owner, and a State belongs to one object's lifecycle.",
    },
  ],
});
