/* AUTO-GENERATED from pattern-singleton-heap.jsx by `npm run build:artifacts` — do not edit. */
import { scene, stack, glob, obj } from "@course";

/* note 19 — what the Singleton actually costs in memory, and why "the same object"
   is a claim about ADDRESSES, not about equal field values. Three getInstance()
   calls, one allocation: the static field holds the only reference that ever
   points at a fresh object, and s1/s2/s3 are three stack slots holding three
   copies of that one address.

   The step that matters is the second: the `if (instance == NULL)` guard is false
   from then on, so nothing new appears on the heap however many times you call.
   Sibling of mem-reference — the same aliasing lesson, one design level up. */

const code = `Singleton s1 = Singleton.getInstance();
Singleton s2 = Singleton.getInstance();
Singleton s3 = Singleton.getInstance();`;

// the class's own static slot — it lives with the class, not with any object.
const FIELD = (linked, hl) => glob("instance", "Singleton", linked ? "ref" : "null", {
  id: "field",
  to: linked ? "sing" : undefined,
  hl
});

// the one object, on the heap, with a Java object header.
const singleton = obj("Singleton", [{
  name: "count",
  type: "int",
  size: 4
}], {
  region: "heap",
  header: 12
});
const OBJ = (hl, count) => singleton("the object", {
  count
}, {
  id: "sing",
  hl
});
const REF = (name, hl) => stack(name, "Singleton", "ref", {
  id: name,
  to: "sing",
  hl
});
const steps = [{
  line: [],
  cells: [FIELD(false, true)],
  caption: {
    java: "Before any call. `Singleton` is loaded, so its `static instance` slot exists — in **Global / Static**, with the class, not with any object — and it holds `null`.",
    intuition: "The **field** is created with the class. The **object** it will point at does not exist yet."
  }
}, {
  line: 1,
  cells: [FIELD(true, true), OBJ(true, "0"), REF("s1", true)],
  caption: {
    java: "First call: `instance == null` is **true**, so `getInstance()` runs `new Singleton()` once, stores the reference in the static field, and returns it.",
    intuition: "This is **lazy** creation — the object is built on first demand, not at class load."
  }
}, {
  line: 2,
  cells: [FIELD(true), OBJ(false, "0"), REF("s1"), REF("s2", true)],
  caption: {
    java: "Second call: `instance == null` is now **false**, so the `new` is skipped entirely and the stored reference is handed back unchanged.",
    intuition: "`s2` is a **second name**, not a second object — the heap did not grow."
  }
}, {
  line: 3,
  cells: [FIELD(true), OBJ(true, "1"), REF("s1", true), REF("s2", true), REF("s3", true)],
  caption: {
    java: "Third call, same answer — and `s1 == s2 && s2 == s3` is `true`. That is `==`, **reference** comparison, not `equals()`: they are literally the same address.",
    intuition: "Three stack slots hold three copies of **one address**. Do `s1.count++` and `s3.count` reads `1`, because there is no other object to read."
  }
}];
export default scene({
  title: "Three calls, one object: where the Singleton lives",
  code,
  steps,
  lang: "java"
});