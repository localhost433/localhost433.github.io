import { matchBuild } from "@course";

/* note 20 practice — seven scenarios, seven names, each used exactly once, so a
   confident answer anywhere constrains the rest. None is the note's own cast.

   The scenarios are chosen so the four wrappers land next to each other and have to
   be separated by the two questions from wrapper-family, not by vocabulary: #1 and
   #4 both wrap ONE object and both leave the client's line alone until you notice
   that one changes the interface and one does not; #6 is the one people call Proxy
   because it caches. */

export default matchBuild({
  prompt: "Seven designs, seven structural patterns — each name is used exactly once. Four of them wrap something, so decide those with the two questions: does the call site change, and what is the wrapper for?",
  paletteLabel: "Patterns",
  slotLabel: "is a",
  slotPlaceholder: "pattern",
  options: [
    { value: "adapter", label: "Adapter" },
    { value: "composite", label: "Composition" },
    { value: "flyweight", label: "Flyweight" },
    { value: "proxy", label: "Proxy" },
    { value: "facade", label: "Facade" },
    { value: "bridge", label: "Bridge" },
    { value: "decorator", label: "Decorator" },
  ],
  items: [
    {
      text: "A payments module expects every gateway to implement `charge(amount) : Receipt`. The bank's own library offers `submitPayment(cents)` returning an XML string, so a new class implements `charge()` by converting the amount, calling `submitPayment`, and parsing the XML into a `Receipt`.",
      answer: "adapter",
      why: "One incompatible class, wrapped so it satisfies an interface it was never written for. The new class **is a** gateway (so the module can hold it) and **has a** bank library (so it can do the work) — both halves, which is the Adapter signature.",
    },
    {
      text: "`ReportBuilder` exposes `build(id)`. Inside, it opens a database connection, runs three queries, loads a template, renders it, and closes the connection — all classes the caller could still use directly if it wanted to.",
      answer: "facade",
      why: "Several collaborating classes, one new smaller entrance, and the subsystem left fully accessible. Not Adapter: nothing was incompatible, and no existing interface is being satisfied — `build(id)` is an interface that did not exist before.",
    },
    {
      text: "A text editor draws 40,000 characters. Rather than one object per character, it keeps one object per *distinct* glyph, and each is handed the position to draw at when it is asked to render.",
      answer: "flyweight",
      why: "The classic case. The state that identifies a glyph is shared; the state that differs per occurrence — the position — is **passed in** rather than stored. That split is what makes sharing safe, and it is the part the deck's vehicle example leaves implicit.",
    },
    {
      text: "`AuditedAccount` implements the same `Account` interface as `RealAccount`, holds one, and writes a log line before forwarding every call. Existing code keeps calling `account.withdraw(x)` and compiles unchanged.",
      answer: "proxy",
      why: "Same interface, one wrapped object, and a decision inserted on the way through. Logging is one of Proxy's standard jobs alongside access control, lazy loading, and remote calls. The tell against Decorator: nobody would wrap an `AuditedAccount` in another `AuditedAccount`.",
    },
    {
      text: "A drawing app has `Circle`, `Square`, and `Group`. A `Group` holds a list of shapes — which may include other groups — and its `draw()` calls `draw()` on each. `canvas.draw(root)` renders the whole picture at any nesting depth.",
      answer: "composite",
      why: "The self-reference gives it away: `Group` is a shape **and** holds shapes. One `draw()` call on a leaf and one on a whole tree are written identically, which is exactly \"treat a group of objects similarly\".",
    },
    {
      text: "A `Notifier` must send by email, SMS, or push, and must also come in plain, urgent, and silent flavours. Instead of nine classes, `Notifier` has an `urgency` field and holds a `Channel`; either side can gain a new member without touching the other.",
      answer: "bridge",
      why: "Two axes that vary for unrelated reasons, split into two hierarchies joined by a field instead of multiplied into nine classes. The give-away in the rejected version would be a class named `UrgentSmsNotifier` — two nouns glued together, a cell in a table rather than a kind of thing.",
    },
    {
      text: "A Java `InputStream` is wrapped in a `BufferedInputStream`, which is wrapped in a `GZIPInputStream`, which is wrapped in a `CipherInputStream`. Each is itself an `InputStream`, and the application reads from the outermost one.",
      answer: "decorator",
      why: "Wrappers that **stack**, each one still being the type it wraps — the standard library's own Decorator, and the reason `new BufferedInputStream(new FileInputStream(f))` looks the way it does. Not Proxy: each layer adds behaviour to the data rather than deciding whether the call gets through, and the nesting is the point.",
    },
  ],
});
