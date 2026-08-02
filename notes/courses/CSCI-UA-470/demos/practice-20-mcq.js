/* AUTO-GENERATED from practice-20-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 20 practice — weighted toward the four wrappers, because that is where the
   marks go. The rest guard the three facts the deck states but does not dwell on:
   Flyweight's shared state must be the state that identifies the object, Composite's
   self-reference is the pattern (not the inheritance), and Bridge is triggered by
   two axes rather than by "too many classes" in general. */

export default mcq({
  questions: [{
    stem: "A class implements the **same** interface as the object it wraps, adds behaviour, and can itself be wrapped by another of its kind. Which pattern?",
    choices: [{
      text: "Decorator — it stacks, which the others do not",
      correct: true
    }, {
      text: "Proxy — it wraps and forwards every call"
    }, {
      text: "Adapter — it wraps an object behind an interface"
    }, {
      text: "Facade — it puts one class in front of others"
    }],
    why: "All four wrap, so use the two questions. Same interface rules out Adapter and Facade. Between Proxy and Decorator, the deciding word is **stacks**: a decorator wrapping a decorator is the normal case and is how you get every combination from a few classes, while nobody nests a caching proxy inside a caching proxy."
  }, {
    stem: "Which pair is distinguished by whether the **client's call site** changes?",
    choices: [{
      text: "Facade vs. Proxy — one is new, one is invisible",
      correct: true
    }, {
      text: "Adapter vs. Facade — one class versus several"
    }, {
      text: "Proxy vs. Decorator — controlling versus adding"
    }, {
      text: "Bridge vs. Decorator — two axes versus a stack"
    }],
    why: "Facade gives the client a method that did not exist (`order.prepare()` where there were seven lines); Proxy leaves the line byte-for-byte identical. The other pairs are separated by the *second* question — what the wrapper is for — not by whether the caller can see it."
  }, {
    stem: "In L19's Flyweight, the client's `while` loop is identical before and after. What does that tell you?",
    choices: [{
      text: "The sharing is entirely inside the factory",
      correct: true
    }, {
      text: "The pattern had no measurable effect"
    }, {
      text: "The client must be rewritten to opt in"
    }, {
      text: "The vehicle classes were changed instead"
    }],
    why: "The deck reuses the same loop deliberately. `getVehicle` gained a `repo` and a lookup; `vehicle`, `CAR`, `Bike`, and every caller are untouched. That is what makes Flyweight retrofittable — and also what makes it invisible in a code review that only reads call sites."
  }, {
    stem: "Flyweight shares one `Car` object between many on-screen cars. Where must each car's **position** live?",
    choices: [{
      text: "Outside the shared object — passed in per call",
      correct: true
    }, {
      text: "In a field on the shared `Car`, updated before drawing"
    }, {
      text: "In the factory's `repo`, keyed by car"
    }, {
      text: "In a subclass of `Car` created per position"
    }],
    why: "If position were a field on the shared object, every car would be at the same place — and the last writer would win. Sharing is only safe for the state that **identifies** the object (type and colour here); anything that varies per occurrence has to be held by the caller and handed in. The deck's example never mentions position, which is exactly where the pattern's limit hides."
  }, {
    stem: "What distinguishes Composition from an ordinary has-a relationship?",
    choices: [{
      text: "The composite holds a list of the abstraction it implements",
      correct: true
    }, {
      text: "The parts are destroyed the moment the whole is destroyed"
    }, {
      text: "The container exposes a public `add()` method for adding parts"
    }, {
      text: "The children all override the same method as the parent"
    }],
    why: "`Folder` is an `item` **and** holds `List<item>` — that self-reference is what lets folders nest and what makes `browse()` recurse. (Option two is the *UML* composition edge from note 14, the filled diamond's lifetime rule — a genuinely different idea that unfortunately shares the deck's name for this pattern.)"
  }, {
    stem: "You have three device types and four operating systems. Which fact most strongly indicates Bridge rather than Decorator?",
    choices: [{
      text: "The two dimensions are fixed and vary independently",
      correct: true
    }, {
      text: "The combined class count is larger than about ten classes"
    }, {
      text: "New behaviour needs to be composed onto objects at run time"
    }, {
      text: "One dimension has many more members than the other one"
    }],
    why: "Both patterns defeat a class explosion, so the count alone decides nothing. Bridge is for **two known axes** that change on separate schedules — split them and join with a field. Decorator is for an **open-ended list of optional extras** that stack in any order and any number; you cannot stack an operating system."
  }, {
    stem: "L19's Proxy blocks `delete` while forwarding `insert` and `select`. Why can the client not simply be trusted to avoid `delete`?",
    choices: [{
      text: "A rule enforced at every call site is enforced at none",
      correct: true
    }, {
      text: "Because `runQuery` cannot inspect its own argument"
    }, {
      text: "Because the real connection is private to the proxy"
    }, {
      text: "Because Java has no way to restrict a String parameter"
    }],
    why: "This is the same argument as Singleton's private constructor: convention holds until someone writes the one line that breaks it, and there is no compiler on the side of a comment. Routing every call through one object makes the rule structural — there is no path to `OldDBCNN` that skips the check."
  }, {
    stem: "Facade's `Order` class is added, and `waiter`, `kitchen`, and `Food` are left exactly as they were. Is that a flaw?",
    choices: [{
      text: "No — a facade adds an entrance, it does not seal the building",
      correct: true
    }, {
      text: "Yes — the subsystem classes should become private"
    }, {
      text: "Yes — clients will bypass the facade and reintroduce the coupling"
    }, {
      text: "No — but only because the subsystem is small"
    }],
    why: "The deck draws the three classes unchanged on purpose. A facade offers a simpler path for the common case; direct access stays available for the caller with an unusual need, which is precisely why adding one is cheap and safe. Sealing the subsystem is a separate decision (and a different mechanism — packages, modules, visibility)."
  }]
});