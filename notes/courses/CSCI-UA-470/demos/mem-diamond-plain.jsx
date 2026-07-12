import { scene } from "@course";

/* The NON-virtual diamond (code/lectures/L06 without `virtual`): teacher and
   student each inherit `person` the ordinary way, so a TA contains TWO complete
   `person` subobjects. We trace the layout class by class to show WHERE the
   second copy comes from — then `t.name` is ambiguous, the very problem virtual
   inheritance fixes. */

const code =
`class person  { string name; };
class teacher : public person { int age; };
class student : public person { int age; };
class TA : public teacher, public student { int age; };

int main() {
    TA t;
    t.name;
}`;

const title = "TA object · NON-virtual diamond — sizeof 80";

// Always the full TA layout; `m` highlights the part a step is about:
// "teacher"/"student"/"ta" = that branch's slots, "amb" = both person copies.
const slots = (m) => [
  { name: "name", type: "string", size: 32, origin: "person", value: '"?"', hl: m === "teacher" || m === "amb" },
  { name: "age",  type: "int", origin: "teacher", value: "25", hl: m === "teacher" },
  { name: "name", type: "string", size: 32, origin: "person", value: '"?"', hl: m === "student" || m === "amb" },
  { name: "age",  type: "int", origin: "student", value: "20", hl: m === "student" },
  { name: "age",  type: "int", origin: "TA", value: "27", hl: m === "ta" },
];
const view = (m) => ({ title, slots: slots(m) });

const steps = [
  {
    line: [1, 2], layout: view("teacher"),
    caption: {
      cpp: "`class teacher : public person` inherits `person` the **ordinary** way, so a `teacher` embeds a whole `person` (its `name`) and then its own `age`.",
      intuition: "Plain inheritance copies the entire base in — every path that inherits `person` carries its **own** copy.",
    },
  },
  {
    line: 3, layout: view("student"),
    caption: {
      cpp: "`class student : public person` **also** inherits `person`. A `TA` is **both**, so it holds a **second**, independent `person` — two `name`s, at **+0** and **+40**.",
      intuition: "Two inheritance paths to one base produce **two** copies of it. That duplication *is* the diamond.",
    },
  },
  {
    line: 4, layout: view("ta"),
    caption: {
      cpp: "`class TA : public teacher, public student` lays the two branches back-to-back, then appends its **own** `age` — **`sizeof 80`**: the two `person`+`age` branches sit at **+0** and **+40**, and TA's `age` packs into the second branch's trailing padding (the Itanium ABI reuses base tail-padding) rather than adding another 8.",
      intuition: "A most-derived object is just its base subobjects concatenated, plus its own members.",
    },
  },
  {
    line: 7, layout: view(null),
    caption: {
      cpp: "`TA t;` — the finished object: two complete `person` subobjects (one via `teacher` at **+0**, one via `student` at **+40**), each with its own `name`.",
      intuition: "Read the ruler — the duplication is physical, not conceptual.",
    },
  },
  {
    line: 8, layout: view("amb"),
    caption: {
      cpp: "`t.name` is rejected: both highlighted `person::name` copies are equally valid — *request for member 'name' is ambiguous* — and even `person* p = &t;` won't compile.",
      intuition: "With **two** base copies the compiler can't choose one for you, so unqualified access is **ambiguous**.",
    },
  },
  {
    line: 8, layout: view(null),
    caption: {
      cpp: "Disambiguate with `t.teacher::name` — but two `person`s is usually a bug. Declaring the inheritance **`virtual`** collapses them into one shared base, so `t.name` becomes unambiguous.",
      intuition: "Qualifying the path is a **workaround**; **virtual inheritance** is the real fix — it shares a single base copy.",
    },
  },
];

export default scene({ title: "The non-virtual diamond: two base copies make access ambiguous", code, steps });
