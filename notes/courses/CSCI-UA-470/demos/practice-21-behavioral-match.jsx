import { matchBuild } from "@course";

/* note 21 practice — eight scenarios, eight names, each used exactly once. None uses
   the deck's cast. The trio is represented but only once each, since
   practice-21-trio drills that split on its own; the work here is the other five,
   and especially Mediator vs Observer (#4 vs #7), which the deck draws almost
   identically. */

export default matchBuild({
  prompt: "Eight designs, eight behavioral patterns — each name used exactly once. Two of them are hub-and-spoke and look alike on paper; read the direction of the messages to separate them.",
  paletteLabel: "Patterns",
  slotLabel: "is a",
  slotPlaceholder: "pattern",
  options: [
    { value: "template", label: "Template Method" },
    { value: "strategy", label: "Strategy" },
    { value: "state", label: "State" },
    { value: "command", label: "Command" },
    { value: "mediator", label: "Mediator" },
    { value: "observer", label: "Observer" },
    { value: "chain", label: "Chain of Resp." },
    { value: "iterator", label: "Iterator" },
  ],
  items: [
    {
      text: "An abstract `Importer` defines `run()` as `open(); parse(); validate(); save();` and is never overridden. `CsvImporter` overrides `parse()` only; `XmlImporter` overrides `parse()` and `validate()`.",
      answer: "template",
      why: "The **sequence is inherited and fixed**; only individual steps are replaceable, and they are replaced by *subclassing*. That inheritance-based variation is what marks Template Method out from the other seven, which all vary behaviour by holding an object.",
    },
    {
      text: "An HTTP request passes through authentication, then rate-limiting, then logging, then the handler. Each stage either responds itself or calls the next one, and the list of stages is read from a config file at start-up.",
      answer: "chain",
      why: "Servlet filters and middleware are Chain of Responsibility in production. The tells: each stage holds only its **successor**, any stage may end the journey, and the order is **data** — so it can come from a config file rather than from code.",
    },
    {
      text: "A `Playlist` can be walked in insertion order, shuffled, or by rating. Each walk is its own class holding a cursor, and `Playlist` itself gained no methods when the third one was added.",
      answer: "iterator",
      why: "Traversal extracted into its own hierarchy, each with its own cursor — which also means two walks can run over the same playlist at once. The clincher is what did *not* happen: `Playlist` was not reopened.",
    },
    {
      text: "In a chat room, a member sends one message to the room object, which delivers it to everyone present except the sender. Members hold no references to each other.",
      answer: "mediator",
      why: "Peers that would otherwise be a mesh now talk **through** a hub, and the `except the sender` clause is the pattern's own signature — a colleague does not receive its own message. Not Observer: the members are peers exchanging messages, not listeners registered to hear one source announce.",
    },
    {
      text: "A `Thermostat` holds a `mode` object and delegates `onTemperatureChange()` to it. `Heating` swaps itself for `Idle` when the target is reached; `Idle` swaps itself for `Cooling` when the room gets too warm.",
      answer: "state",
      why: "The alternatives **know about and replace each other** — behaviour is driven by where the object is in its own lifecycle. Interchangeable strategies never promote one another; if the options do, it is State.",
    },
    {
      text: "A macro recorder stores each user action as an object with `run()` and `undo()`, appends it to a list, and can replay or reverse the list later.",
      answer: "command",
      why: "The request has been **turned into an object** — stored, listed, replayed, reversed. That is what neither Strategy nor State is for: both are held one at a time by a context, and neither is meant to be collected.",
    },
    {
      text: "A spreadsheet cell registers with the cells it depends on. When one of those recomputes, it tells everyone that registered, and they recompute in turn. A cell can deregister at any time.",
      answer: "observer",
      why: "One source announcing **outward** to listeners that asked to hear it, with registration in the listener's hands. Not Mediator: nothing is relaying messages *between* peers — each dependency is a one-to-many announcement from a single subject.",
    },
    {
      text: "A `PriceCalculator` holds a `DiscountRule`. The checkout page passes in `Student`, `Seasonal`, or `None` depending on the customer, and the calculator applies whichever it was handed.",
      answer: "strategy",
      why: "Interchangeable ways of doing one job, chosen from **outside** and each a complete answer to \"what discount applies\". No transitions between the rules and nothing storing them in a list, which is what rules out State and Command.",
    },
  ],
});
