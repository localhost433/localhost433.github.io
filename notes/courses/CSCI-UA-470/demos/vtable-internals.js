/* AUTO-GENERATED from vtable-internals.jsx by `npm run build:artifacts` — do not edit. */
import { scene, obj, glob, text } from "@course";

/* The vtable is an ARRAY indexed by a compile-time slot offset. `Person` has two
   virtuals: intro (#0) and eat (#1); `Student` overrides only intro. Each slot
   holds the address of a body that lives once in the Code segment; the object's
   hidden vptr selects which vtable; the fixed slot offset selects the function.
   Companion to mem-vtable (which shows the single-slot idea). */

const code = `class Person {
public:
    string name = "James";
    virtual void intro();
    virtual void eat();
};
class Student : public Person {
public:
    void intro() override;
};

int main() {
    Person* p = new Student();
    p->eat();
    p->intro();
}`;

// three function bodies in Code — one copy each, shared by all objects.
const PIN = hl => text("Person::intro", "fn", "cout << \"person\"", {
  id: "p_intro",
  hl
});
const PEAT = hl => text("Person::eat", "fn", "cout << \"nom\"", {
  id: "p_eat",
  hl
});
const SIN = hl => text("Student::intro", "fn", "cout << \"student\"", {
  id: "s_intro",
  hl
});

// vtables as arrays of pointer slots in read-only data (Global/Static). Use glob
// + fields (NOT obj) so the cell name is the vtable label and the type badge is
// "vtable", matching mem-vtable's cell.
const PVT = hl => glob("Person::vtable", "vtable", "", {
  id: "pvt",
  hl,
  fields: [{
    name: "#0 intro",
    size: 8,
    to: "p_intro",
    value: "&Person::intro"
  }, {
    name: "#1 eat",
    size: 8,
    to: "p_eat",
    value: "&Person::eat"
  }]
});
const SVT = hl => glob("Student::vtable", "vtable", "", {
  id: "svt",
  hl,
  fields: [{
    name: "#0 intro",
    size: 8,
    to: "s_intro",
    value: "&Student::intro"
  },
  // overridden -> Student's body
  {
    name: "#1 eat",
    size: 8,
    to: "p_eat",
    value: "&Person::eat"
  } // inherited -> same Person body
  ]
});

// the Student object on the heap; its hidden vptr points at Student::vtable.
const studentObj = obj("Student", [{
  name: "name",
  type: "string",
  size: 32
}], {
  vptr: "svt",
  region: "heap"
});
const OBJ = hl => studentObj("*p", ['"James"'], {
  hl
});
const steps = [{
  line: [4, 5],
  cells: [PVT(true), PIN(), PEAT()],
  caption: {
    cpp: "`virtual void intro();` — marking a member `virtual` means the call target is chosen at **run time**, not from the static type.",
    asm: "The compiler emits **`Person::vtable`** in `.rodata`: one `.quad` per virtual, in declaration order — slot **#0** = `intro`, slot **#1** = `eat`, each the **address** of a body in the Code segment.",
    intuition: "A vtable is just a **constant array of function pointers** — one table per polymorphic class."
  }
}, {
  line: [7, 9],
  cells: [PVT(), PIN(), PEAT(), SVT(true), SIN()],
  caption: {
    cpp: "`Student` overrides `intro` but not `eat`, so it inherits `Person::eat`.",
    asm: "`Student::vtable` keeps the **same slot order**: slot **#0** now holds **`Student::intro`** (the override); slot **#1** still holds **`Person::eat`** (inherited).",
    intuition: "Overriding swaps **one slot**; every slot you don't override still points at the base's body. One function, one copy."
  }
}, {
  line: [3, 13],
  cells: [PVT(), PIN(), PEAT(), SVT(), SIN(), OBJ(true)],
  caption: {
    cpp: "`Person* p = new Student();` builds a `Student` on the heap, held through a base `Person*`.",
    asm: "`operator new` allocates it (`mov edi, 40` = `sizeof(Student)`); then `lea rdx, [Student::vtable]` + `mov [rbx], rdx` write the **vptr** into the object's first 8 bytes.",
    intuition: "Every object carries a hidden **vptr** to its class's vtable, set by the constructor — the pointer's static type never changes it."
  }
}, {
  line: 14,
  cells: [PVT(), PIN(), PEAT(true), SVT(true), SIN(), OBJ(true)],
  caption: {
    cpp: "`p->eat();` — a virtual call through a `Person*` whose runtime type is `Student`.",
    asm: "`mov rax, [rbx]` loads the vptr; `call [rax+8]` dispatches through **slot #1 (+8)** -> **`Person::eat`** (not overridden).",
    intuition: "The offset **(+8)** is fixed at **compile time**; the **vptr** picks the table, so the object decides which body runs."
  }
}, {
  line: 15,
  cells: [PVT(), PIN(), PEAT(), SVT(true), SIN(true), OBJ(true)],
  caption: {
    cpp: "`p->intro();` — same pointer `p`, another virtual call.",
    asm: "`mov rax, [rbx]` reloads the vptr; `call [rax+0]` dispatches through **slot #0 (+0)** -> **`Student::intro`** (the override).",
    intuition: "Same vptr, **different offset** (+0 vs +8) -> a different function. The offset is the function; the vptr is the object."
  }
}];

// Curated x86-64 (Intel syntax, names demangled). One .rodata block per vtable,
// then main's dispatch. Prologue/epilogue are shown as elision rows. asm line
// numbers below are 1-based positions in this string, counting every line.
const asm = `Person::vtable:
  .quad Person::intro
  .quad Person::eat
Student::vtable:
  .quad Student::intro
  .quad Person::eat
main:
… prologue elided
  mov  edi, 40
  call operator new
  mov  rbx, rax
  lea  rdx, [Student::vtable]
  mov  [rbx], rdx
  mov  rax, [rbx]
  call [rax+8]
  mov  rax, [rbx]
  call [rax+0]
… epilogue elided`;

// source line (in `code`) -> asm line numbers (in `asm`)
const asmMap = {
  4: [1, 2],
  // virtual void intro()  -> Person::vtable label + slot #0
  5: [3],
  // virtual void eat()    -> slot #1
  9: [4, 5, 6],
  // void intro() override -> Student::vtable
  13: [9, 10, 11, 12, 13],
  // Person* p = new Student();  (allocate + install vptr)
  14: [14, 15],
  // p->eat();   load vptr, index slot #1, call
  15: [16, 17] // p->intro(); load vptr, index slot #0, call
};
const asmLabel = "x86-64 · clang -O1 · Intel, demangled";
export default scene({
  title: "Inside the vtable: an array indexed by a compile-time slot offset",
  code,
  steps,
  asm,
  asmMap,
  asmLabel
});