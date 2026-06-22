import { scene, derived, stack } from "@course";

/* Based on code/lectures/L06 (person -> student): what inheritance looks like
   in memory. A derived object embeds the WHOLE base subobject inline at
   offset 0, then appends its own members — so a base pointer and a derived
   pointer to the same object hold the SAME address. Upcasting is free; it
   only changes how much of the object is visible, not where it lives. */

const code =
`class person {
public:
    string name = "James";
    virtual void intro();
};
class student : public person {
public:
    int age = 20;
};

int main() {
    student  s;
    person*  pp = &s;
    student* sp = &s;
}`;

// one student object, its bytes colour-grouped by the class that declared them
const studentObj = derived([
  { cls: "person",  vptr: true, fields: [{ name: "name", type: "string", size: 32 }] },
  { cls: "student",            fields: [{ name: "age",  type: "int" }] },
]);
const S  = (hl) => studentObj("s", { name: '"James"', age: "20" }, { hl });
const PP = (hl) => stack("pp", "person*",  "&s", { id: "pp", to: "s", hl });
const SP = (hl) => stack("sp", "student*", "&s", { id: "sp", to: "s", hl });

const steps = [
  {
    line: [8, 12],
    cells: [S(true)],
    caption: {
      cpp: "`student s;` constructs one object that begins with the entire `person` subobject (`vptr` + `name`, in blue), then appends `student`'s own `age` (teal, initialized to 20 by line 8).",
      intuition: "A `student` **is-a** `person`, so it is one contiguous block, not two separate objects.",
    },
  },
  {
    line: [1, 3, 4],
    cells: [S(true)],
    caption: {
      cpp: "The blue slots form a **complete** `person`, laid out exactly as a standalone `person` would be, sitting at **offset 0**.",
      intuition: "Inheritance under the hood is just the base struct embedded at the front, with the derived members tacked on after.",
    },
  },
  {
    line: 13,
    cells: [S(), PP(true)],
    caption: {
      cpp: "`person* pp = &s;` takes `&s`; since the `person` part is at **offset 0**, that address **is** the start of the object, so `pp` views `s` as a `person` (reaching `name`, not `age`).",
      asm: "upcast `student*` -> `person*` is a **no-op** — the `person` base sits at offset **+0** (contrast `mem-multi`, where a second base needs a **+8** adjustment).",
      intuition: "No bytes are copied or moved; upcasting only narrows the view, it never changes the address.",
    },
  },
  {
    line: 14,
    cells: [S(), PP(), SP(true)],
    caption: {
      cpp: "`student* sp = &s;` holds the **same address** as `pp`, but its `student*` static type lets it also reach `age`.",
      intuition: "A pointer's static type decides which members are reachable, not **where** it points — that identical address is exactly why a `person*` can safely refer to a `student`.",
    },
  },
];

export default scene({ title: "Inheritance in memory: a derived object is its base, plus more", code, steps });
