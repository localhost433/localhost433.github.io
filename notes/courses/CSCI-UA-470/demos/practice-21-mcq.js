/* AUTO-GENERATED from practice-21-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 21 practice — the graded pass. Weighted toward the two collisions the deck
   creates by drawing patterns identically (the trio, and Mediator vs Observer), plus
   the through-line the lecture teaches four times without naming: a String mode plus
   an if-chain becomes a field of an abstract type plus one polymorphic call. */

export default mcq({
  questions: [{
    stem: "Strategy, State, and Command are drawn with the same UML in L20. What actually separates them?",
    choices: [{
      text: "Intent — who chooses, and what the choice is for",
      correct: true
    }, {
      text: "The number of concrete subclasses each allows"
    }, {
      text: "Whether the delegated method returns a value"
    }, {
      text: "Whether the role is an interface or an abstract class"
    }],
    why: "The deck even gives all three the same method name, `run()`. Strategy: the **client** picks an interchangeable way to do one job. State: the **object's own lifecycle** picks, and the options transition into each other. Command: the **request becomes an object** so the invoker never meets the receiver. Nothing in the class diagram records any of that."
  }, {
    stem: "Which observation most strongly indicates **State** rather than Strategy?",
    choices: [{
      text: "The alternatives replace one another over time",
      correct: true
    }, {
      text: "The field can be reassigned after construction"
    }, {
      text: "There are more than three concrete alternatives"
    }, {
      text: "The context has other fields besides the role"
    }],
    why: "`Heating` swapping the thermostat to `Idle` is behaviour no strategy has: interchangeable algorithms do not know about each other, because each is a complete answer on its own. Reassignability proves nothing — a strategy chosen from a dropdown is reassigned too; what matters is whether the change comes from **inside** the lifecycle or **outside** as a preference."
  }, {
    stem: "A toolbar keeps executed actions in a list so the last few can be reversed. Which pattern, and what does the list tell you?",
    choices: [{
      text: "Command — the request was made into a storable object",
      correct: true
    }, {
      text: "Strategy — the list holds interchangeable algorithms"
    }, {
      text: "State — the list records the sequence of states"
    }, {
      text: "Chain of Responsibility — the list is the chain"
    }],
    why: "Strategy and State objects are held **one at a time** by a context; nobody collects them. Commands are collected on purpose — reifying the request is what makes queues, logs, macros, and undo possible. If a design stores its behaviour objects rather than swapping them, it is Command."
  }, {
    stem: "Mediator and Observer are drawn almost identically. Which difference is real?",
    choices: [{
      text: "Mediator relays between peers; Observer announces outward",
      correct: true
    }, {
      text: "Only Observer uses an interface for its participants"
    }, {
      text: "Only Mediator can have more than three participants"
    }, {
      text: "Observer's participants must be of the same class"
    }],
    why: "Read the **direction**. Mediator collapses a many-to-many mesh: colleagues would otherwise talk to each other, so the hub relays — and skips the sender, because it was the one talking. Observer is one-to-many: a subject announces and the listeners, who opted in with `subscribe`, hear it. That opt-in is the other visible difference."
  }, {
    stem: "`if (canHandle(a)) approve(a); else nextHandler.handle(a);` — what makes this a chain rather than plain delegation?",
    choices: [{
      text: "`nextHandler` is typed as the abstract parent itself",
      correct: true
    }, {
      text: "`handle` is declared abstract on the parent"
    }, {
      text: "There are four concrete handler subclasses"
    }, {
      text: "The sender holds a reference to only one handler"
    }],
    why: "A field whose type is the class's own abstract parent is what lets the structure extend to any length and be rewired at run time — the same self-reference that makes a Composite recurse. Plain delegation forwards to a *different* type and stops there; abstract methods and subclass counts are true of half the catalog."
  }, {
    stem: "L20's Iterator crosses out a `Collection` with `getNextItemBasedOnIndex()`, `getNextItemBasedOnSize()`, and more. What is the objection?",
    choices: [{
      text: "The collection has taken on a second job — traversal",
      correct: true
    }, {
      text: "The method names are too long to be readable"
    }, {
      text: "Those methods should have been made static"
    }, {
      text: "A collection should expose its list directly instead"
    }],
    why: "Holding items and walking them are separate responsibilities that change for separate reasons, so the class grows forever on one axis — note 16's SRP, reached from the traversal side. Extracting `Iterator` also buys something the methods could not: each iterator carries its **own cursor**, so two walks can run over one collection at once."
  }, {
    stem: "Which is the odd one out among L20's eight, and why?",
    choices: [{
      text: "Template Method — it varies behaviour by inheritance",
      correct: true
    }, {
      text: "Iterator — it is the only one in the Java standard library"
    }, {
      text: "Mediator — it is the only one with a central object"
    }, {
      text: "Command — it is the only one that stores its objects"
    }],
    why: "Every other pattern here puts a field of an abstract type on a context and delegates; Template Method fixes the algorithm in a parent and lets **subclasses** fill the holes. The practical consequence: a Strategy can be swapped at run time, while a Template Method subclass is decided the moment the object is constructed."
  }, {
    stem: "Four of L20's eight begin from a rejected design with a `String` field and an if-chain over it. What is the general move that fixes all four?",
    choices: [{
      text: "Replace the field with an abstract type and delegate",
      correct: true
    }, {
      text: "Replace the String with an enum and switch on it"
    }, {
      text: "Move the if-chain into a factory method"
    }, {
      text: "Make the context class abstract and subclass it"
    }],
    why: "The same move each time: a field of an abstract type plus one call — `strategy.run()`, `state.run()`, `command.run()`. It is note 09's v2→v3 step and note 16's Open–Closed fix in behavioral clothing. An enum switch is tidier but still a switch you reopen; moving the chain into a factory relocates it (that is Factory's job — L18) without removing the dispatch."
  }]
});