import { dualScene, stack, heap } from "@course";

/* Shallow vs deep copy, side by side: the SAME operation stepped through twice —
   shallow (default copy) on the left, deep (user copy ctor) on the right — so the
   one-block-shared vs two-blocks-owned difference is visible at a glance. Both
   sides reuse note 04's Circle, a class that OWNS a heap int (`int* radius`).
   See demos/mem-copy.jsx for the single-scene version. */

// a Circle is a stack cell with a color field + an owned radius pointer field
// (per-instance `to` -> the heap int it owns). Same factory as mem-copy.jsx.
const circle = (id, radiusTo, hl) => stack(id, "Circle", "", { id, hl, fields: [
  { name: "color",  type: "string", size: 32, value: '"Red"' },
  { name: "radius", type: "int*",   size: 8,  to: radiusTo },
]});
// owned heap ints; ids are unique within each side (left and right are
// independent MemoryModels, so the same id may recur across columns).
const RA = (rec) => heap("", "int", "0", { id: "ra", reclaimed: rec });
const RB = (rec) => heap("", "int", "0", { id: "rb", reclaimed: rec });

/* ---------- LEFT: shallow (default) copy ---------- */
const shallowCode =
`class Circle {
    string color;
    int*   radius;
public:
    Circle() {
        color  = "Red";
        radius = new int(0);
    }
    ~Circle() {
        delete radius;
    }
};

Circle a;
Circle b = a;   // default copy`;

// Curated x86-64 (Intel, demangled): default ctor, shallow memberwise copy, dtor.
const shallowAsm =
`Circle::Circle:
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
… epilogue elided`;

// source line -> asm line numbers (1-based, NON-elision targets only)
const shallowMap = {
  7:  [3],        // radius = new int(0)  -> default ctor: call operator new
  14: [3],        // Circle a;            -> runs that constructor
  15: [6, 7],     // Circle b = a;        -> two movs of the pointer, no new alloc
  10: [10, 11],   // delete radius;       -> load radius + call operator delete
};

const shallowSteps = [
  {
    line: [7, 14],
    cells: [circle("a", "ra", true), RA()],
    caption: {
      cpp: "`Circle a;` runs the default constructor: `radius = new int(0)`.",
      asm: "`call operator new` allocates one heap `int` and stores its address in `a.radius`.",
      intuition: "`a` **owns** a heap block from the moment it is constructed.",
    },
  },
  {
    line: 15,
    cells: [circle("a", "ra"), circle("b", "ra", true), RA()],
    caption: {
      cpp: "`Circle b = a;` with the **default** copy: members are copied memberwise.",
      asm: "Two movs: `mov rax, [a.radius]` then `mov [b.radius], rax` — the **pointer value** is copied, no new allocation.",
      intuition: "A shallow copy duplicates the **pointer**, so `a` and `b` share **one** heap block.",
    },
  },
  {
    line: 10,
    cells: [circle("a", "ra", true), RA(true)],
    caption: {
      cpp: "`delete radius;` runs in reverse: `~b` fires first, then `~a` deletes the **same** address.",
      asm: "`mov rdi, [radius]` loads the shared address; `call operator delete` frees it — this happens **twice**.",
      intuition: "Shared ownership leads to a **double free** (undefined behaviour).",
    },
  },
];

/* ---------- RIGHT: deep (user-defined) copy ---------- */
const deepCode =
`class Circle {
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
Circle b = a;   // copy ctor`;

// Curated x86-64 (Intel, demangled): default ctor, deep copy ctor, dtor.
const deepAsm =
`Circle::Circle:
… prologue elided
  call operator new
… epilogue elided
Circle::Circle(const Circle&):
… prologue elided
  call operator new
… epilogue elided
Circle::~Circle:
… prologue elided
  mov  rdi, [radius]
  call operator delete
… epilogue elided`;

// source line -> asm line numbers (1-based, NON-elision targets only)
const deepMap = {
  7:  [3],        // radius = new int(0)         -> default ctor: call operator new
  18: [3],        // Circle a;                   -> runs that constructor
  11: [7],        // radius = new int(*o.radius) -> deep copy ctor: call operator new
  19: [7],        // Circle b = a;               -> runs the copy ctor (fresh alloc)
  14: [11, 12],   // delete radius;              -> load radius + call operator delete
};

const deepSteps = [
  {
    line: [7, 18],
    cells: [circle("a", "ra", true), RA()],
    caption: {
      cpp: "`Circle a;` runs the default constructor: `radius = new int(0)`.",
      asm: "`call operator new` allocates one heap `int` and stores its address in `a.radius`.",
      intuition: "`a` **owns** a heap block from the moment it is constructed.",
    },
  },
  {
    line: [11, 19],
    cells: [circle("a", "ra", true), circle("b", "rb", true), RA(), RB()],
    caption: {
      cpp: "The user-defined copy ctor does `radius = new int(*o.radius)` — `b` gets its **own** heap int.",
      asm: "`call operator new` gives `b` a **separate** block; `b.radius` holds a **different** address from `a.radius`.",
      intuition: "A deep copy means two allocations, so `a` and `b` own **independent** blocks (Rule of Three).",
    },
  },
  {
    line: 14,
    cells: [circle("a", "ra", true), RA(), RB(true)],
    caption: {
      cpp: "`delete radius;` runs in reverse: `~b` frees `rb`, then `~a` frees `ra` — two **separate** addresses.",
      asm: "Each dtor loads its OWN `radius` and calls `operator delete` once — the two frees never touch the same block.",
      intuition: "Two allocations mean two distinct frees — **no double free**.",
    },
  },
];

const asmLabel = "x86-64 · Intel (idealized)";

export default dualScene({
  title: "Shallow vs deep copy, side by side",
  left: {
    label: "Shallow copy",
    code: shallowCode, lang: "cpp", steps: shallowSteps,
    asm: shallowAsm, asmMap: shallowMap, asmLabel,
  },
  right: {
    label: "Deep copy",
    code: deepCode, lang: "cpp", steps: deepSteps,
    asm: deepAsm, asmMap: deepMap, asmLabel,
  },
});
