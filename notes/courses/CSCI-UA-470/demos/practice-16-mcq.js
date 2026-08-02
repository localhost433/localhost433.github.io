/* AUTO-GENERATED from practice-16-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 16 practice — spot the violated principle and pick the canonical fix.
   The stems are small designs, not definitions, because that is how SOLID is
   examined: recognize the smell in a class you have never seen. The SRP
   question guards the instructor's own margin note (single responsibility ≠
   single simple task). */

export default mcq({
  questions: [{
    stem: "A `Car` class has `color`, `model`, `year` — and `totalSales`, incremented every time any car is sold. Which principle does `totalSales` violate, and why?",
    choices: [{
      text: "SRP — fleet accounting is a separate responsibility",
      correct: true
    }, {
      text: "OCP — `totalSales` cannot be extended without modification"
    }, {
      text: "LSP — a subclass could not substitute for `Car`"
    }, {
      text: "None — any class may hold any number of fields"
    }],
    why: "One car knows its own color, model, year. *How many cars were sold* is a fact about the **fleet**, not about any car — a separate responsibility that would drag sales-rule changes into `Car`. The lecture's fix kept a `static counter` (class-level, not per-object) — or hands the job to a registry, as `InvoiceRegister` does for `Invoice`."
  }, {
    stem: "Per the lecture's warning: does SRP mean every class should perform a single, *simple* task?",
    choices: [{
      text: "No — one **responsibility** (one reason to change); class can be rich",
      correct: true
    }, {
      text: "Yes — classes should be minimal; ideally one method"
    }, {
      text: "Yes — any class with multiple public methods violates SRP"
    }, {
      text: "No — SRP only applies to interfaces"
    }],
    why: "The margin note on the slide: SRP \"doesn't mean that the class should perform single or simple task.\" `InvoiceRegister` adds, deletes, *and* sorts invoices — three operations, one responsibility: *keeping the register*. The test is not method count but **reasons to change**: if two different policy changes both edit the same class, it has two responsibilities."
  }, {
    stem: "`getArea()` contains `if (type == \"circle\") … else if (type == \"rectangle\") …`. Adding `Cylinder` means editing this method. The OCP fix is…",
    choices: [{
      text: "Make `Shape` abstract with abstract `getArea()` in each subclass",
      correct: true
    }, {
      text: "Add the `cylinder` branch and document it"
    }, {
      text: "Replace strings with an `enum` for type-safety"
    }, {
      text: "Mark `getArea()` as `final`"
    }],
    why: "**Open for extension, closed for modification**: the if-chain is a hand-rolled dispatch table that must be *reopened* for every new case. Moving each formula into its subclass lets overriding do the dispatch — `Cylinder` arrives as a new class and no existing file changes. An enum-switch is tidier but still a switch you must edit."
  }, {
    stem: "`class Ostrich extends Bird` where `Bird` declares `fly()`. The code compiles. What does LSP say?",
    choices: [{
      text: "Violation — `Bird b = new Ostrich(); b.fly();` breaks the contract",
      correct: true
    }, {
      text: "No violation — it compiles; LSP is compile-time"
    }, {
      text: "No violation — `Ostrich` can override `fly()` to throw"
    }, {
      text: "Violation — but only because `Bird` should be `final`"
    }],
    why: "LSP is **semantic**: every subclass must be usable wherever the parent is, *behaving as the parent promises*. Overriding `fly()` to throw or do nothing is exactly the smell — code holding a `Bird` now needs to know *which* bird, which is what substitution was supposed to make unnecessary. The fix moves `fly()` out of `Bird` (into a `FlyingBird` or a `Flyable` contract)."
  }, {
    stem: "Interface `Movable` declares `move()` and `jump()`; class `Vehicle` implements it with `jump() { }` — an empty body. Which principle, and which fix?",
    choices: [{
      text: "ISP — split into `Movable` and `Jumpable` interfaces",
      correct: true
    }, {
      text: "DIP — `Vehicle` should depend on an abstraction"
    }, {
      text: "OCP — `Vehicle` modified the interface"
    }, {
      text: "SRP — `Vehicle` has two responsibilities"
    }],
    why: "\"The client shouldn't be forced to implement useless methods\" — the empty `jump() { }` stub is the tell. Segregating the fat interface into two thin ones lets every class sign **only the contract it can honour**: `Vehicle` takes `Movable`; `Person` and `Bird` take both. (The empty stub also flirts with LSP — a `Movable` that silently ignores `jump()` breaks the promise — but the *cause* is the fat interface.)"
  }, {
    stem: "`NotificationService` (high-level policy) constructs and calls `EmailSender` (low-level detail) directly. What does DIP prescribe?",
    choices: [{
      text: "Introduce `MessageSender` abstraction; both depend on it",
      correct: true
    }, {
      text: "`EmailSender` should extend `NotificationService`"
    }, {
      text: "Move both classes into the same package"
    }, {
      text: "Use a `static` sender for single dependency"
    }],
    why: "\"High-level classes should not depend on low-level classes\" — both should depend on an **abstraction**. Insert `«interface» MessageSender`: the service's arrow now stops at the interface, and `EmailSender`/`SmsSender` point *up* into it with realization. That arrow flip — concretions depending on the abstraction instead of being depended on — is the **inversion** in the name."
  }]
});