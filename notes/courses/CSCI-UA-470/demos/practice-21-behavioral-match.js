/* AUTO-GENERATED from practice-21-behavioral-match.jsx by `npm run build:artifacts` — do not edit. */
import { matchBuild } from "@course";

/* note 21 practice — six scenarios, six names, each used exactly once. None uses
   the deck's cast. The trio is represented but only once each, since
   practice-21-trio drills that split on its own; the work here is Template Method,
   and especially Mediator vs Observer (#2 vs #5), which the deck draws almost
   identically. Chain and Iterator moved to practice-22-* with their sections. */

export default matchBuild({
  prompt: "Six designs, six behavioral patterns — each name used exactly once. Two of them are hub-and-spoke and look alike on paper; read the direction of the messages to separate them.",
  paletteLabel: "Patterns",
  slotLabel: "is a",
  slotPlaceholder: "pattern",
  options: [{
    value: "template",
    label: "Template Method"
  }, {
    value: "strategy",
    label: "Strategy"
  }, {
    value: "state",
    label: "State"
  }, {
    value: "command",
    label: "Command"
  }, {
    value: "mediator",
    label: "Mediator"
  }, {
    value: "observer",
    label: "Observer"
  }],
  items: [{
    text: "An abstract `Importer` defines `run()` as `open(); parse(); validate(); save();` and is never overridden. `CsvImporter` overrides `parse()` only; `XmlImporter` overrides `parse()` and `validate()`.",
    answer: "template",
    why: "The **sequence is inherited and fixed**; only individual steps are replaceable, and they are replaced by *subclassing*. That inheritance-based variation is what marks Template Method out from its neighbours here, which all vary behaviour by holding an object."
  }, {
    text: "In a chat room, a member sends one message to the room object, which delivers it to everyone present except the sender. Members hold no references to each other.",
    answer: "mediator",
    why: "Peers that would otherwise be a mesh now talk **through** a hub, and the `except the sender` clause is the pattern's own signature — a colleague does not receive its own message. Not Observer: the members are peers exchanging messages, not listeners registered to hear one source announce."
  }, {
    text: "A `Thermostat` holds a `mode` object and delegates `onTemperatureChange()` to it. `Heating` swaps itself for `Idle` when the target is reached; `Idle` swaps itself for `Cooling` when the room gets too warm.",
    answer: "state",
    why: "The alternatives **know about and replace each other** — behaviour is driven by where the object is in its own lifecycle. Interchangeable strategies never promote one another; if the options do, it is State."
  }, {
    text: "A macro recorder stores each user action as an object with `run()` and `undo()`, appends it to a list, and can replay or reverse the list later.",
    answer: "command",
    why: "The request has been **turned into an object** — stored, listed, replayed, reversed. That is what neither Strategy nor State is for: both are held one at a time by a context, and neither is meant to be collected."
  }, {
    text: "A spreadsheet cell registers with the cells it depends on. When one of those recomputes, it tells everyone that registered, and they recompute in turn. A cell can deregister at any time.",
    answer: "observer",
    why: "One source announcing **outward** to listeners that asked to hear it, with registration in the listener's hands. Not Mediator: nothing is relaying messages *between* peers — each dependency is a one-to-many announcement from a single subject."
  }, {
    text: "A `PriceCalculator` holds a `DiscountRule`. The checkout page passes in `Student`, `Seasonal`, or `None` depending on the customer, and the calculator applies whichever it was handed.",
    answer: "strategy",
    why: "Interchangeable ways of doing one job, chosen from **outside** and each a complete answer to \"what discount applies\". No transitions between the rules and nothing storing them in a list, which is what rules out State and Command."
  }]
});