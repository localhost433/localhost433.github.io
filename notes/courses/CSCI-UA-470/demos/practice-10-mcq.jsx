import { mcq } from "@course";

/* note 10 practice — the three exam distinctions the note names itself: text vs
   binary representation, the serialization read/write contract, and what `final`
   freezes at each of its three positions (variable / method / class). */

export default mcq({
  questions: [
    {
      stem: "How is the number `3.4567` stored in a **text** file?",
      choices: [
        { text: "As the characters `3`, `.`, `4`, `5`, `6`, `7` — the ASCII codes of the string \"3.4567\", not floating-point bits", correct: true },
        { text: "As 8 bytes of IEEE-754 floating-point" },
        { text: "As a 4-byte two's-complement integer" },
        { text: "As a single compressed token" },
      ],
      why: "In a **text** file every datum is first turned into characters and each character encoded (e.g. ASCII). So `3.4567` becomes the six characters `3 . 4 5 6 7` — which is why a text editor can display it. A **binary** file would instead store the actual floating-point representation. Both are bits; the difference is **what the bits mean**.",
    },
    {
      stem: "Likewise, how is the integer `2` stored in a text file versus a binary file?",
      choices: [
        { text: "Text: the ASCII code for the character `'2'`. Binary: the numeric value `2` (e.g. fixed-width two's-complement bits)", correct: true },
        { text: "Both store the two's-complement bits of `2`" },
        { text: "Both store the ASCII code of `'2'`" },
        { text: "Text stores nothing; only binary files can hold numbers" },
      ],
      why: "A text file stores `2` as the **character** `'2'` (its ASCII code), *not* the integer value. A binary file stores the **numeric** representation of `2` directly. This is the core text-vs-binary distinction the note flags.",
    },
    {
      stem: "For a `Circle` object to be written with `ObjectOutputStream`, what must its class do, and what is `Serializable`?",
      figure: { code: "class Circle implements Serializable { /* ... */ }", lang: "java" },
      choices: [
        { text: "Implement `Serializable` — a **marker interface** (no methods) that flags the class as allowed to be serialized", correct: true },
        { text: "Extend `ObjectOutputStream` and override `writeObject`" },
        { text: "Implement `Serializable` and define its `serialize()` method" },
        { text: "Nothing — any object can be serialized by default" },
      ],
      why: "`ObjectOutputStream.writeObject` requires the object's class to implement **`Serializable`**, a **marker interface** — it declares no methods; its mere presence tells Java the class's objects may be serialized.",
    },
    {
      stem: "You wrote `os.writeObject(x); os.writeObject(c);` (an `Integer` then a `Circle`). How must the reader recover them?",
      figure: { code: "// write side\nos.writeObject(x);   // Integer\nos.writeObject(c);   // Circle\n\n// read side\n??? a = ??? is.readObject();\n??? b = ??? is.readObject();", lang: "java" },
      choices: [
        { text: "Read in the **same order** and **cast** each: `Integer i = (Integer) is.readObject(); Circle cir = (Circle) is.readObject();`", correct: true },
        { text: "Read in any order; the stream tags each object by type" },
        { text: "Read once into a single array of all objects" },
        { text: "No cast is needed — `readObject()` returns the exact type written" },
      ],
      why: "Serialization is **positional**: the first `readObject()` must match the first `writeObject`, and so on. And `readObject()` is declared to return `Object`, so each result needs an **explicit cast** to the type you wrote. The stream does record each object's class — that's how a wrong cast is detected — but reads are still strictly positional.",
    },
    {
      stem: "What do the three uses of `final` restrict?",
      choices: [
        { text: "`final` variable = cannot be reassigned; `final` method = cannot be overridden; `final` class = cannot be extended", correct: true },
        { text: "All three mean the same: the value is a compile-time constant" },
        { text: "`final` variable = cannot be read; `final` method = cannot be called; `final` class = cannot be instantiated" },
        { text: "`final` only applies to variables; on methods and classes it is ignored" },
      ],
      why: "`final` restricts change, and the restriction depends on position: a **variable** cannot be reassigned after initialization; a **method** cannot be overridden by subclasses (though it is still inherited); a **class** cannot be subclassed.",
    },
    {
      stem: "Given `final Circle c = new Circle();`, which is true?",
      figure: { code: "final Circle c = new Circle();\nc = new Circle();   // (1)\nc.radius = 5;       // (2)", lang: "java" },
      choices: [
        { text: "(1) is illegal — `c` cannot be **rebound** — but (2) is fine; `final` freezes the reference, not the object's mutability", correct: true },
        { text: "Both are illegal — `final` makes the object fully immutable" },
        { text: "Both are legal — `final` only documents intent" },
        { text: "(2) is illegal but (1) is fine" },
      ],
      why: "For a reference, `final` freezes the **binding**: `c` cannot be reassigned to a different `Circle` (line 1 is an error). The **object itself stays mutable** — `c.radius = 5` is fine — unless the class's own fields/methods prevent it. `final` alone does **not** make an object immutable.",
    },
  ],
});
