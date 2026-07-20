/* AUTO-GENERATED from practice-14-notation.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 14 practice — the mechanical half: member notation and visibility. These are
   the marks that get lost under exam pressure, above all that the TYPE comes AFTER
   the colon (the reverse of the Java/C++ declaration order the course has drilled
   for thirteen notes) and that `-` is private, not "minus" or "protected". */

export default mcq({
  questions: [{
    stem: "In a UML class box, what does `- radius : double` declare?",
    choices: [{
      text: "A private attribute named `radius`, of type `double`",
      correct: true
    }, {
      text: "A protected attribute named `radius`, of type `double`"
    }, {
      text: "A private attribute named `double`, of type `radius`"
    }, {
      text: "A public method `radius` returning a `double`"
    }],
    why: "`-` is **private** (`+` public, `#` protected, `~` package). The form is `visibility name : Type`, so the **type comes after the colon** — the reverse of the C++/Java declaration order. It is an attribute, not a method, because there are no parentheses."
  }, {
    stem: "Which is the correct UML operation notation for a public method `show` that takes nothing and returns nothing?",
    choices: [{
      text: "`+ show()`",
      correct: true
    }, {
      text: "`+ show() : void`"
    }, {
      text: "`+ void show()`"
    }, {
      text: "`public void show()`"
    }],
    why: "Operations read `visibility name(params) : ReturnType` — but the return type is **omitted** when it is `void` (and on constructors). So a method that returns nothing is just `+ show()`; writing `: void` adds a type UML says to leave off, and `void show()` puts the type in front the way Java writes it, the reverse of UML's order."
  }, {
    stem: "In a class box's attribute compartment, what does an **underlined** member mean?",
    choices: [{
      text: "It is `static` — one per class, not per object",
      correct: true
    }, {
      text: "It is abstract"
    }, {
      text: "It is deprecated"
    }, {
      text: "It is `final` / read-only"
    }],
    why: "Underlining marks a **static** member (attribute or operation) — the class-level slot the course met as `static` in C++/Java. *Italics* mark abstract; UML has no underline for deprecated or final. Full attribute syntax: `visibility name : type [count] = default` — multiplicity and a default value can ride along, and a `/` in the visibility position marks a **derived** attribute (computed, not stored)."
  }, {
    stem: "A class box shows `# tick()` and the class name is written in *italics*. What does that tell you?",
    choices: [{
      text: "A protected operation on an abstract class",
      correct: true
    }, {
      text: "A private operation on a concrete class"
    }, {
      text: "A package-visible operation on an interface"
    }, {
      text: "A public operation that is deprecated"
    }],
    why: "`#` is **protected**. An **italic** class name is UML's mark for an **abstract** class (an italic *operation* name marks an abstract/pure-virtual method). `~` would be package visibility; nothing in UML notation encodes deprecation."
  }, {
    stem: "How many compartments does a full UML class box have, and what are they?",
    choices: [{
      text: "Three: name, attributes, operations",
      correct: true
    }, {
      text: "Two: name and members"
    }, {
      text: "Three: name, operations, associations"
    }, {
      text: "Four: name, attributes, operations, relationships"
    }],
    why: "Three: the **name**, the **attributes**, and the **operations**. Relationships are not a compartment — they are the **lines between** boxes (association, aggregation, composition, generalization, dependency)."
  }]
});