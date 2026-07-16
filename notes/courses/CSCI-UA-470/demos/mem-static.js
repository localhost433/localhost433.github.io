/* AUTO-GENERATED from mem-static.jsx by `npm run build:artifacts` — do not edit. */
import { scene, obj, glob, text } from "@course";

/* Where `static` actually lives. A static data member is ONE shared copy in
   Global/Static — absent from every object's bytes; a static method is a plain
   Code-segment function with no `this`; a static local persists in Global/Static
   (constant-initialized before main even runs); a file-scope `static` has internal
   linkage but the same storage. Builds on the L03/L04 `Circle` (color + radius) and note 04's
   `static int counter` / `resetCounter()`. */

const code = `static int fileCounter = 0;

class Circle {
    string color;
    double radius;
    static int counter;
public:
    Circle() { counter++; }
    static void resetCounter();
};
int Circle::counter = 0;

int nextId() {
    static int n = 0;
    return ++n;
}

int main() {
    Circle a, b;
    nextId(); nextId();
}`;

// one Circle shape: per-object color + radius. The static counter is NOT a member.
const circle = obj("Circle", [{
  name: "color",
  type: "string",
  size: 32
}, {
  name: "radius",
  type: "double"
}], {
  region: "stack"
});
// Circle() only bumps counter: color default-constructs to "", radius stays uninitialized.
const A = hl => circle("a", ['""', "?"], {
  hl
});
const B = hl => circle("b", ['""', "?"], {
  hl
});
const COUNT = hl => glob("Circle::counter", "static int", "2", {
  id: "count",
  hl
});
const RESET = hl => text("Circle::resetCounter()", "static fn", "counter = 0", {
  id: "reset",
  hl
});
const NLOCAL = hl => glob("nextId()::n", "static int", "2", {
  id: "slocal",
  hl
});
const FCOUNT = hl => glob("fileCounter", "static int", "0", {
  id: "fcount",
  hl
});
const steps = [{
  line: [8, 19],
  cells: [A(true), B(true), COUNT(true)],
  caption: {
    cpp: "`Circle a, b;` constructs two `Circle`s on the **stack**; each `Circle()` bumps the shared `counter`, so it reaches **2**.",
    asm: "Each `call Circle::Circle` runs `add dword [Circle::counter], 1` — two constructions, so the one shared `counter` ends at **2**.",
    intuition: "`Circle::counter` is **one shared copy** outside every object — `sizeof(Circle)` ignores it, yet every instance updates the same storage."
  }
}, {
  line: 9,
  cells: [A(), B(), COUNT(), RESET(true)],
  caption: {
    cpp: "`static void resetCounter()` is only **declared** here — a static method belonging to the class, not to any instance. `main` never calls it, so the counter stays **2**.",
    asm: "Its body `mov dword [Circle::counter], 0` lives in the **Code** segment with **no `this`** in `rdi` — but it is never `call`ed, so it never runs.",
    intuition: "A static method is a plain Code-segment function (no object, no vtable). Declaring `resetCounter` does **not** reset anything; nothing here invokes it."
  }
}, {
  line: [14, 15],
  cells: [A(), B(), COUNT(), RESET(), NLOCAL(true)],
  caption: {
    cpp: "`static int n = 0;` inside `nextId()` is a function-local static that persists across calls — the two `nextId()` calls leave it at **2**.",
    asm: "`nextId.n` lives at a global symbol; `= 0` is a **constant** initializer, so the storage is set before `main` even runs — no per-call setup at all.",
    intuition: "The variable persists across calls and is initialized once — it is NOT on the stack."
  }
}, {
  line: 1,
  cells: [A(), B(), COUNT(), RESET(), NLOCAL(), FCOUNT(true)],
  caption: {
    cpp: "`static int fileCounter` at file scope gives the variable **internal linkage** — invisible to other `.cpp` files.",
    asm: "`fileCounter:` is a global symbol with no `.globl` directive, so the linker cannot see it from other translation units.",
    intuition: "Internal linkage hides the name from other files, but the storage is still Global/Static — not the stack."
  }
}];

// Curated x86-64 (Intel syntax, names demangled). Data rows show one shared copy
// each in Global/Static; code rows show the relevant functions.
// asm line numbers below are 1-based positions in this string, counting every line.
const asm = `fileCounter:
  .long 0
Circle::counter:
  .long 0
nextId.n:
  .long 0
Circle::Circle:
  add dword [Circle::counter], 1
  ret
Circle::resetCounter:
  mov dword [Circle::counter], 0
  ret
nextId:
  mov eax, [nextId.n]
  add eax, 1
  mov [nextId.n], eax
  ret
main:
  lea rdi, [a]
  call Circle::Circle
  lea rdi, [b]
  call Circle::Circle
  call nextId
  call nextId
… epilogue elided`;

// source line (in `code`) -> asm line numbers (in `asm`)
const asmMap = {
  19: [7, 8, 19, 20, 21, 22],
  // Circle a, b;  -> Circle::Circle bumps counter, called twice in main
  9: [10, 11, 12],
  // static void resetCounter()  -> its body (writes counter, no this)
  14: [5, 6, 13, 14, 15, 16],
  // static int n = 0;  -> data symbol + nextId: load/inc/store
  1: [1, 2] // static int fileCounter  -> data symbol + .long
};
const asmLabel = "x86-64 · Intel (idealized)";
export default scene({
  title: "Where static lives: one shared copy, outside every object",
  code,
  steps,
  asm,
  asmMap,
  asmLabel
});