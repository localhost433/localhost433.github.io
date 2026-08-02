/* AUTO-GENERATED from practice-19-singleton-classbox.jsx by `npm run build:artifacts` — do not edit. */
// notes/courses/CSCI-UA-470/demos/practice-19-singleton-classbox.jsx
import { classBuild } from "@course";

/* note 19 practice — build the Singleton box. Two drills at once: note 14's member
   notation (visibility left, type after the colon, and the VOID RULE that strips the
   return type from a constructor) and the pattern itself, whose whole enforcement
   lives in two visibility marks. The `-` on the constructor is the one students
   reach for `+` on out of habit, because every other constructor they have written
   was public — and it is exactly the mark that makes the pattern work. */

export default classBuild({
  prompt: "Build the Singleton class box. Stamp each member's visibility, then drop its type after the colon. Two of these three marks are what make the pattern enforceable rather than a comment — think about which, and why the constructor is not like every other constructor you've written.",
  className: "Singleton",
  abstract: false,
  attributes: [{
    vis: "-",
    name: "instance",
    type: "Singleton",
    whyVis: "The stored object is the class's own bookkeeping. Public would let anyone reseat it — `Singleton.instance = new Singleton()` — and the guarantee would be gone. So `-` private.",
    whyType: "The field holds the one object, so its type is the class itself: `instance : Singleton`. A class referring to its own type is legal and is the heart of the pattern."
  }],
  operations: [{
    vis: "-",
    name: "Singleton()",
    ret: null,
    whyVis: "This is the mark the pattern turns on. A **private** constructor means `new Singleton()` does not compile outside the class — which is the only way to stop a second object being made. Every other constructor you have written was `+`; this one must not be.",
    whyType: "It is a constructor, so UML writes **no** return type at all — the same void rule as `+ show()`. Never `Singleton() : Singleton`, and never `: void`."
  }, {
    vis: "+",
    name: "getInstance()",
    ret: "Singleton",
    whyVis: "With the constructor closed, this is the *only* door in — so it has to be `+` public. (It must also be **static**, which UML shows by underlining the row; the builder does not drill that mark, but the exam does.)",
    whyType: "It hands back the one object, so the return type is `Singleton`, after the colon: `+ getInstance() : Singleton`."
  }],
  typeDistractors: ["void", "String", "boolean"]
});