/* AUTO-GENERATED from mem-copy.jsx by `npm run build:artifacts` — do not edit. */
import { scene, stack, heap } from "@course";

/* Shallow vs deep copy of a class that OWNS heap memory (note 04's Circle with
   `int* radius`). A shallow (default) copy duplicates the pointer, so two objects
   share one heap int -> double free. A deep copy allocates a fresh int per object. */

const code = `class Circle {
    string color;
    int*   radius;
public:
    Circle() {
        color  = "Red";
        radius = new int(0);
    }
    Circle(const Circle& o) {
        color  = o.color;
        radius = new int(*o.radius);
    }
    ~Circle() {
        delete radius;
    }
};

Circle a;
Circle b = a;`;

// a Circle is a stack cell with a color field + an owned radius pointer field
// (per-instance `to` -> the heap int it owns).
const circle = (id, radiusTo, hl) => stack(id, "Circle", "", {
  id,
  hl,
  fields: [{
    name: "color",
    type: "string",
    size: 32,
    value: '"Red"'
  }, {
    name: "radius",
    type: "int*",
    size: 8,
    to: radiusTo
  }]
});
const RA = rec => heap("", "int", "0", {
  id: "ra",
  reclaimed: rec
});
const RB = () => heap("", "int", "0", {
  id: "rb"
});
const steps = [{
  line: [7, 18],
  cells: [circle("a", "ra", true), RA()],
  caption: {
    cpp: "`Circle a;` runs the default constructor, whose body does `radius = new int(0)`.",
    asm: "`call operator new` allocates one heap `int` and stores its address in `a.radius`.",
    intuition: "The object **owns** a heap block from the moment it is constructed."
  }
}, {
  line: 19,
  cells: [circle("a", "ra"), circle("b", "ra", true), RA()],
  caption: {
    cpp: "`Circle b = a;` with the **default** copy (*imagine the copy ctor below isn't defined*): members are copied bitwise.",
    asm: "Just two movs: `mov rax, [a.radius]` then `mov [b.radius], rax` — the **pointer value** is copied, no new allocation.",
    intuition: "A shallow copy duplicates the **pointer**, so both `a` and `b` share **one** heap block. `color` is copied by value either way — only the owned `radius` pointer is the problem."
  }
}, {
  line: 14,
  cells: [circle("a", "ra", true), RA(true)],
  caption: {
    cpp: "`delete radius;` in `~Circle` runs (in reverse order): `~b` fires first, then `~a` deletes the **same** address.",
    asm: "`mov rdi, [radius]` loads the shared address; `call operator delete` frees it — with a shared pointer this happens **twice**.",
    intuition: "Shared ownership leads to a **double free** (undefined behaviour)."
  }
}, {
  line: 11,
  cells: [circle("a", "ra", true), circle("b", "rb", true), RA(), RB()],
  caption: {
    cpp: "The user-defined copy ctor does `radius = new int(*o.radius)` — `b` gets its **own** heap int.",
    asm: "`call operator new` gives `b` a **separate** block; `b.radius` now holds a **different** address from `a.radius`.",
    intuition: "A deep copy means two allocations, so `~b` and `~a` free **different** blocks — no double free (Rule of Three). `color` is copied by value either way — only the owned `radius` pointer is the problem."
  }
}];

// Curated x86-64 (Intel syntax, names demangled). Four fragments: default ctor,
// shallow memberwise copy, destructor, and deep copy ctor. Bodies are idealized;
// prologue/epilogue are shown as elision rows. asm line numbers are 1-based,
// counting every line (labels, elisions, instructions).
const asm = `Circle::Circle:
… prologue elided
  call operator new
… epilogue elided
b = a:
  mov  rax, [a.radius]
  mov  [b.radius], rax
Circle::~Circle:
… prologue elided
  mov  rdi, [radius]
  call operator delete
… epilogue elided
Circle::Circle(const Circle&):
… prologue elided
  call operator new
… epilogue elided`;

// source line -> asm line numbers (1-based, NON-elision targets only)
const asmMap = {
  7: [3],
  // radius = new int(0)  -> default ctor: call operator new
  18: [3],
  // Circle a;            -> runs that constructor
  19: [6, 7],
  // Circle b = a;        -> two movs of the pointer, no new alloc
  14: [10, 11],
  // delete radius;       -> load radius + call operator delete
  11: [15] // radius = new int(*o.radius)  -> deep copy: call operator new
};
const asmLabel = "x86-64 · Intel (idealized)";
export default scene({
  title: "Shallow vs deep copy: one heap allocation, or two?",
  code,
  steps,
  asm,
  asmMap,
  asmLabel
});