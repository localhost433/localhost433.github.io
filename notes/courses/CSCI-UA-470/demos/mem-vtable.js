/* AUTO-GENERATED from mem-vtable.jsx by `npm run build:artifacts` — do not edit. */
import { scene, obj, stack, glob, text } from "@course";

/* Traces code/lectures/L06/p1.cpp: virtual dispatch via vptr + vtable.
   A class with a virtual function gets a hidden vptr (its first member);
   each object's vptr points to its class's vtable, whose entries point to
   the actual function bodies. A base pointer still reaches the override. */

const code = `class person {
public:
    string name = "James";
    virtual void intro();
};
class student : public person {
public:
    int age = 20;
    void intro() override;
};

int main() {
    person  p;
    student s;
    person* ptr = &s;
    ptr->intro();
}`;

// fixed cells (toggle highlight per step)
// Objects: the hidden vptr block points at the class vtable (vptr: "<id>").
// Vtables: the `intro` slot is a function pointer to the implementation.
// person = vptr(8) + string name(≈32) -> 40 ;  student adds int age -> 48
const person = obj("person", [{
  name: "name",
  type: "string",
  size: 32
}], {
  vptr: "pvt"
});
const student = obj("student", [{
  name: "name",
  type: "string",
  size: 32
}, {
  name: "age",
  type: "int"
}], {
  vptr: "svt"
});
const P = hl => person("p", ['"James"'], {
  hl
});
const PVT = hl => glob("person::vtable", "vtable", "&intro", {
  id: "pvt",
  to: "pintro",
  hl
});
const PIN = hl => text("person::intro", "fn", "cout << name", {
  id: "pintro",
  hl
});
const S = hl => student("s", ['"James"', "20"], {
  hl
});
const SVT = hl => glob("student::vtable", "vtable", "&intro", {
  id: "svt",
  to: "sintro",
  hl
});
const SIN = hl => text("student::intro", "fn", "cout << name, age", {
  id: "sintro",
  hl
});
const PTR = hl => stack("ptr", "person*", "-> s", {
  to: "s",
  hl
});
const steps = [{
  line: [3, 4, 13],
  cells: [P(true), PVT(), PIN()],
  caption: {
    cpp: "`person p;` constructs a `person`, and because the class has a `virtual` function its first member is a hidden **vptr** pointing to the one `person` vtable whose `intro` slot points to `person::intro`.",
    intuition: "A `virtual` function makes every object carry a vptr, so the object itself remembers which function table to use."
  }
}, {
  line: [8, 9, 14],
  cells: [P(), PVT(), PIN(), S(true), SVT(), SIN()],
  caption: {
    cpp: "`student s;` constructs a `student`, which overrides `intro()` and so gets its own vtable; `s`'s vptr points there and that `intro` slot points to `student::intro`.",
    intuition: "Each class that overrides a virtual function gets a distinct vtable, so an object's vptr selects the right override."
  }
}, {
  line: 15,
  cells: [P(), PVT(), PIN(), S(), SVT(), SIN(), PTR(true)],
  caption: {
    cpp: "`person* ptr = &s;` gives `ptr` the static type `person*` while it holds the address of the **student** object `s`.",
    intuition: "The pointer's type doesn't change what `s` actually is — the object keeps its own vptr regardless of how you point at it."
  }
}, {
  line: 16,
  cells: [P(), PVT(), PIN(), S(true), SVT(true), SIN(true), PTR(true)],
  caption: {
    cpp: "`ptr->intro();` dispatches dynamically along `ptr -> s -> s's vptr -> student::vtable -> student::intro`, running the **derived** override even through a `person*`.",
    intuition: "Virtual dispatch follows the object's vptr, not the pointer type — a non-virtual call would instead use the static type and run `person::intro`."
  }
}];
export default scene({
  title: "L06 — virtual dispatch: vptr -> vtable -> function",
  code,
  steps
});