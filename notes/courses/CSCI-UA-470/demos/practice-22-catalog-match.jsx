import { matchBuild } from "@course";

/* notes 19–22 closer — the whole catalog on one board. Twenty labels, twelve
   scenarios, no guarantee any label is used, so elimination is worthless and the
   only route is recognition. That is what a final actually asks.

   Item choice spans all three categories and puts one pair from each collision the
   four notes flag: Factory vs Abstract Factory, Proxy vs Decorator, State vs
   Strategy, and Memento vs Command (#11 vs #12, adjacent on purpose — both keep an
   undo stack, and only what is IN the stack separates them).
   Every scenario is real code someone has written, not a lecture cast. */

export default matchBuild({
  prompt: "Twelve designs from across all four pattern lectures. Stamp the pattern each one is. Labels may be used once, more than once, or not at all — so recognise rather than eliminate.",
  paletteLabel: "Patterns",
  slotLabel: "is a",
  slotPlaceholder: "pattern",
  options: [
    { value: "singleton", label: "Singleton" },
    { value: "factory", label: "Factory" },
    { value: "abstract", label: "Abstract Factory" },
    { value: "adapter", label: "Adapter" },
    { value: "composite", label: "Composition" },
    { value: "flyweight", label: "Flyweight" },
    { value: "proxy", label: "Proxy" },
    { value: "facade", label: "Facade" },
    { value: "bridge", label: "Bridge" },
    { value: "decorator", label: "Decorator" },
    { value: "template", label: "Template Method" },
    { value: "strategy", label: "Strategy" },
    { value: "state", label: "State" },
    { value: "command", label: "Command" },
    { value: "mediator", label: "Mediator" },
    { value: "observer", label: "Observer" },
    { value: "chain", label: "Chain of Resp." },
    { value: "iterator", label: "Iterator" },
    { value: "memento", label: "Memento" },
    { value: "visitor", label: "Visitor" },
  ],
  items: [
    {
      text: "`Runtime.getRuntime()` returns the same object every time it is called, and `Runtime`'s constructor is private.",
      answer: "singleton",
      why: "Private constructor plus a static accessor returning one stored object — the JDK's own Singleton. The exam-usable test is not the static method but whether a **second** instance is possible; here it is not.",
    },
    {
      text: "`new BufferedReader(new InputStreamReader(System.in))` — each class is a `Reader`, each holds the one inside it, and reading from the outermost pulls through all of them.",
      answer: "decorator",
      why: "Wrappers that **stack**, each still being the type it wraps. The constructor argument is the giveaway: a class taking its own abstraction as a parameter is wrapping, not inheriting.",
    },
    {
      text: "A GUI dialog holds `okButton`, `cancelButton`, and `nameField`. None of them references any other; each reports to the dialog, which enables the OK button when the name field is non-empty.",
      answer: "mediator",
      why: "Widgets that would otherwise wire themselves to each other now report to one object that knows the whole board. Not Observer: this is peer coordination *between* controls, not one subject announcing outward to listeners who registered.",
    },
    {
      text: "A UI toolkit ships `DarkTheme` and `LightTheme`. Each returns a `Button`, a `Panel`, and a `Scrollbar` in its own palette, so a light scrollbar never appears in a dark window.",
      answer: "abstract",
      why: "Several **related** hierarchies produced as a matched set, one factory per family. Choosing the factory is what guarantees consistency — a plain Factory (one product hierarchy) has no way to express \"these must go together\".",
    },
    {
      text: "`Collections.unmodifiableList(list)` returns something that implements `List` and forwards every read to the original, but throws on `add` and `remove`.",
      answer: "proxy",
      why: "Same interface, one wrapped object, a decision inserted on the way through — access control, Proxy's own headline job. Not Decorator: it removes capability rather than adding it, and nobody nests unmodifiable wrappers to accumulate anything.",
    },
    {
      text: "An `AbstractTest` class defines `run()` as `setUp(); test(); tearDown();` and marks `test()` abstract. Every test class fills in `test()` and most leave the other two alone.",
      answer: "template",
      why: "JUnit's shape. The **sequence** is inherited and fixed; subclasses fill holes. Note that the variation is by inheritance, not by holding an object — the one behavioral pattern in L20 that works that way.",
    },
    {
      text: "A vector-graphics document holds shapes; a `Group` is itself a shape and holds a list of shapes, including other groups. `document.render()` draws the whole picture whatever the nesting.",
      answer: "composite",
      why: "The self-reference: `Group` **is a** shape and **holds** shapes. One call renders a leaf or an arbitrarily deep tree identically — \"treat a group of objects similarly\", in the deck's words.",
    },
    {
      text: "A media player exposes `play(file)`. Inside, it selects a codec, allocates buffers, opens an audio device, and starts a decode thread — all classes an advanced caller could still drive directly.",
      answer: "facade",
      why: "Several collaborating classes behind one new, smaller entrance, with the subsystem left usable. Not Adapter: nothing was incompatible, and `play(file)` is an interface that did not exist before rather than one being satisfied.",
    },
    {
      text: "A TCP connection object answers `send()` differently depending on whether it is *closed*, *connecting*, or *established*, and receiving the handshake reply moves it from the second to the third.",
      answer: "state",
      why: "The same call behaves differently across one object's lifetime, and events drive transitions between the modes. Strategy would mean the caller picking `Established` as a preference, which makes no sense for a connection.",
    },
    {
      text: "A logging framework's `Logger` may write to a file, a socket, or the console. `Logger` itself is subclassed for *application* and *audit* loggers, and either kind may use any destination, chosen at start-up.",
      answer: "bridge",
      why: "Two axes — kind of logger and destination — kept in separate hierarchies and joined by a field, instead of `AuditSocketLogger` and its five siblings. The test is whether both axes vary for their own reasons; here they do, and either can gain a member without touching the other.",
    },
    {
      text: "A compiler's syntax tree gives every node kind an `accept(v)` method whose whole body is `v.visit(this)`. `TypeChecker`, `CodeGenerator` and `PrettyPrinter` each implement a `visit` for every node kind, and adding a fourth pass touches no node class.",
      answer: "visitor",
      why: "The one-line `accept` body forwarding to `v.visit(this)` is the pattern's fingerprint — a second dispatch bought by hand. A new *operation* is a new class and the tree is never reopened; the price is that a new *node kind* reopens all three passes.",
    },
    {
      text: "A drawing app's undo stack holds objects that each record the canvas as it was before one edit. Undo pops the top one and writes its contents back into the canvas; the objects have no behaviour of their own.",
      answer: "memento",
      why: "What is stacked is a **snapshot of state**, and the entries do nothing — restoring is the canvas reading its own fields back. The next item stacks something that *acts* instead; that difference, not the stack, is what names each one.",
    },
    {
      text: "A drawing app's undo stack holds objects that each know how to perform one edit and how to reverse it. Undo pops the top one and calls `undo()` on it, and the same objects can be replayed to redo the work.",
      answer: "command",
      why: "Same stack, opposite contents. Here the entry is the **request reified** — it carries `run()` and `undo()`, so it can be replayed as well as reversed. A Memento cannot be replayed: it is a photograph, not an instruction.",
    },
  ],
});
