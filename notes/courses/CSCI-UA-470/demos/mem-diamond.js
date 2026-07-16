/* AUTO-GENERATED from mem-diamond.jsx by `npm run build:artifacts` — do not edit. */
import { scene } from "@course";

/* The VIRTUAL diamond (code/lectures/L06): teacher & student inherit `person`
   virtually, so a TA has exactly ONE shared `person`, relocated to the END of
   the object. We trace the layout class by class to contrast it with the
   non-virtual case: each branch carries a hidden `vbptr` (a run-time offset to
   the shared base) instead of its own `person`. */

const code = `class person  { string name = "james"; };
class teacher : virtual public person { int age = 25; };
class student : virtual public person { int age = 20; };
class TA : public teacher, public student { int age = 27; };

int main() {
    TA t;
    t.name;
}`;
const title = "TA object · virtual diamond — sizeof 64";

// Always the full virtual layout; `m` selects what a step highlights:
//   *-decl  -> the branch's own slots while building up
//   person  -> the single shared base
//   *-res   -> a branch's vbptr + the shared name it reaches at run time
const slots = m => [{
  name: "vbptr",
  kind: "vptr",
  size: 8,
  origin: "teacher",
  value: "-> +32",
  hl: m === "t-decl" || m === "t-res"
}, {
  name: "age",
  type: "int",
  origin: "teacher",
  value: "25",
  hl: m === "t-decl"
}, {
  name: "vbptr",
  kind: "vptr",
  size: 8,
  origin: "student",
  value: "-> +16",
  hl: m === "s-decl" || m === "s-res"
}, {
  name: "age",
  type: "int",
  origin: "student",
  value: "20",
  hl: m === "s-decl"
}, {
  name: "age",
  type: "int",
  origin: "TA",
  value: "27",
  hl: m === "ta-decl"
}, {
  name: "name",
  type: "string",
  size: 32,
  origin: "person",
  value: '"james"',
  hl: m === "person" || m === "t-res" || m === "s-res"
}];
const view = m => ({
  title,
  slots: slots(m)
});
const steps = [{
  line: [1, 2],
  layout: view("t-decl"),
  caption: {
    cpp: "Marking the base **`virtual`** (`class teacher : virtual public person`) makes `teacher` carry a hidden **`vbptr`** — a *run-time* offset to a shared `person` — plus its own `age`, instead of embedding a `person`.",
    intuition: "`virtual` inheritance replaces the inlined base with a **pointer to a shared one**."
  }
}, {
  line: 3,
  layout: view("s-decl"),
  caption: {
    cpp: "`student` is **also** `virtual public person`, so it adds its **own** `vbptr` + `age` — but both vbptrs are meant to reach the **same** `person`, not two copies.",
    intuition: "Two branches, two vbptrs, **one** shared base — no duplication."
  }
}, {
  line: 4,
  layout: view("ta-decl"),
  caption: {
    cpp: "`class TA : public teacher, public student` appends its own `age`. The two branches sit at **+0** and **+16**; the most-derived class places the single shared base.",
    intuition: "Only the complete object knows where the one shared base finally goes."
  }
}, {
  line: 7,
  layout: view("person"),
  caption: {
    cpp: "`TA t;` — and exactly **one** shared `person`, relocated to the **end** (`name` at **+32**). `sizeof 64`, versus **80** for the non-virtual diamond's two copies.",
    intuition: "Virtual inheritance collapses the duplicate base into a single shared sub-object."
  }
}, {
  line: 8,
  layout: view("t-res"),
  caption: {
    cpp: "Through the **teacher** part: load the `vbptr` at **+0**, read its stored offset (**+32**), then `this(+0) + 32` reaches the shared `person` at **+32**.",
    intuition: "The offset lives in a table, not in the instruction — the base is found **indirectly, at run time**."
  }
}, {
  line: 8,
  layout: view("s-res"),
  caption: {
    cpp: "Through the **student** part the `vbptr` sits at **+16** and stores a *different* offset (**+16**), yet `this(+16) + 16` reaches the **same** `person` at **+32**.",
    intuition: "Two paths with two stored offsets converge on one shared base."
  }
}, {
  line: 8,
  layout: view(null),
  caption: {
    cpp: "A *standalone* `student` keeps its `person` right after itself, but inside a `TA` the shared `person` moves to **+32** — so the same `this->name` sits at a **different** offset depending on the complete object.",
    intuition: "The offset must be looked up through the `vbptr` because it depends on the **complete object** — not knowable at compile time."
  }
}];
export default scene({
  title: "Virtual inheritance: finding the shared base by run-time offset",
  code,
  steps
});