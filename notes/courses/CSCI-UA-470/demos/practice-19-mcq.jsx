import { mcq } from "@course";

/* note 19 practice — the graded pass over L18. Two things the lecture makes
   examinable that a "name the pattern" question misses: the exact reason each
   access mark is there (private constructor, static accessor), and the counting
   rule that separates Factory from Abstract Factory. The last question guards the
   trap the deck sets up but never says out loud — a factory does not remove the
   if-chain, it relocates it, and that is still the whole win. */

export default mcq({
  questions: [
    {
      stem: "Why must a Singleton's constructor be **private**?",
      choices: [
        { text: "So no caller can build a second object with `new`", correct: true },
        { text: "So the class cannot be subclassed by other code" },
        { text: "Because `getInstance()` is static and static members need it" },
        { text: "To keep the constructor out of the class's UML box" },
      ],
      why: "Everything else about the pattern is convention; **this** is the enforcement. With a public constructor, `new Singleton()` compiles anywhere and \"there is only one\" becomes a comment. Make it private and the compiler itself refuses — `getInstance()` becomes the only way in. (It *does* also block subclassing, since a subclass constructor must call `super()`, but that is a side effect, not the reason.)",
    },
    {
      stem: "Client code outside the class runs `Singleton s1 = new Singleton();`. What happens?",
      choices: [
        { text: "Compile error — the constructor is not visible there", correct: true },
        { text: "It compiles and returns the existing instance" },
        { text: "It compiles and quietly creates a second instance" },
        { text: "It compiles but throws an exception at run time" },
      ],
      why: "The slide marks this line **KO** in red. Visibility is checked by the **compiler**, so the failure is at compile time, not run time — nothing is created and nothing is thrown. Inside the class the same line is legal, which is exactly how `getInstance()` builds the one object.",
    },
    {
      stem: "`getInstance()` is called for the second time. Which happens?",
      choices: [
        { text: "The stored reference is returned; no object is created", correct: true },
        { text: "A fresh object is created and replaces the stored one" },
        { text: "A copy of the stored object is created and returned" },
        { text: "It returns `null` until the instance is reset" },
      ],
      why: "The body is `if (instance == NULL) instance = new Singleton(); return instance;`. On the second call the guard is **false**, so the `new` is skipped and the same reference comes back. That is why `s1 == s2` — reference equality, not `equals()`: they are one object with three names.",
    },
    {
      stem: "Why must `getInstance()` be **static**?",
      choices: [
        { text: "There is no instance yet to call it on", correct: true },
        { text: "Static methods are faster than instance methods" },
        { text: "Only a static method may return its own class type" },
        { text: "Because the `instance` field is private" },
      ],
      why: "An instance method needs a receiver: `someSingleton.getInstance()`. But before the first call there **is** no Singleton, so there is nothing to put on the left of the dot — a chicken-and-egg the pattern breaks by making the door class-level: `Singleton.getInstance()`. In UML a static member is shown **underlined**, which is how you spot it in a class box.",
    },
    {
      stem: "A `PaymentFactory.create(kind)` returns a `Payment` — `CardPayment`, `CashPayment`, or `CryptoPayment`. Which pattern, and why not the other one?",
      choices: [
        { text: "Factory — one product hierarchy behind one door", correct: true },
        { text: "Abstract Factory — several concrete classes are produced" },
        { text: "Abstract Factory — the concrete class is chosen at runtime" },
        { text: "Singleton — the factory itself is accessed statically" },
      ],
      why: "Count the **hierarchies**, not the classes. Three concrete payments all sit under one `Payment` parent, so there is one family and one door: Factory. Abstract Factory needs several *related* hierarchies produced as a matched set — `Payment` **and** `Receipt` **and** `Invoice`, each with its own method on the same factory, so choosing a factory commits you to a consistent set.",
    },
    {
      stem: "Which SOLID principle does the Factory pattern most directly serve?",
      choices: [
        { text: "Open–Closed — a new product adds a class, edits none", correct: true },
        { text: "Single Responsibility — the factory does only one job" },
        { text: "Liskov Substitution — subclasses stand in for the parent" },
        { text: "Interface Segregation — clients see a thinner contract" },
      ],
      why: "The rejected design is an if-chain over a type, which must be **reopened and edited** for each new product — the same Open–Closed break note 16 draws for `getArea()`. Funnelling creation through the factory means a new `Square` is a new class and one factory line, while every *client* stays untouched. (SRP is a fair secondary reading — the factory does concentrate the creation job — but the change-cost argument is OCP.)",
    },
    {
      stem: "After introducing `ShapeFactory`, where has the if-chain gone?",
      choices: [
        { text: "Into the factory — one copy instead of one per client", correct: true },
        { text: "It is gone entirely — overriding has replaced the dispatch" },
        { text: "Into `Shape`, as a protected helper the subclasses call" },
        { text: "Into each concrete subclass's constructor" },
      ],
      why: "Something must eventually map a runtime choice to a concrete class, and the pattern does not pretend otherwise — it **relocates** the decision so it exists once, in a class whose job that is. Compare OCP's fix in note 16, where the if-chain genuinely *disappears* into overriding: that works for behaviour, but you cannot dispatch on an object you have not created yet.",
    },
  ],
});
