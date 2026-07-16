import { scene } from "@course";

/* Multiple inheritance and the "this-pointer adjustment" surprise.
   A C : public A, public B object is laid out [A][B][C]. A C* and an A*
   point at offset 0, but a B* must point at the B subobject — which starts
   at offset sizeof(A). So (B*)&obj is NOT the same address as &obj. */

const code =
`struct A { int a1; int a2; };
struct B { int b1; };
struct C : public A, public B {
    int c1;
};

int main() {
    C  obj;
    A* pa = &obj;
    B* pb = &obj;
    C* pc = &obj;
}`;

const slots = [
  { name: "a1", type: "int", origin: "A", value: "1" },
  { name: "a2", type: "int", origin: "A", value: "2" },
  { name: "b1", type: "int", origin: "B", value: "3" },
  { name: "c1", type: "int", origin: "C", value: "4" },
];
const title = "C : public A, public B  ·  object layout (sizeof 16)";

const steps = [
  {
    line: 8, layout: { title, slots },
    caption: {
      cpp: "`C obj;` creates a `C`, laid out `[A][B][C]` — the whole `A` subobject first, then `B`, then `C`'s own fields.",
      asm: "No init code is emitted — all members are POD; the compiler reserves 16 bytes on the stack but emits no stores.",
      intuition: "Bases are embedded in declaration order; the layout is determined at compile time.",
    },
  },
  {
    line: [9, 11],
    layout: { title, slots, pointers: [{ name: "C* pc", at: 0 }, { name: "A* pa", at: 0 }] },
    caption: {
      cpp: "`A* pa = &obj;` points at the object's `A` base, which lives at the very start of `C`.",
      asm: "`lea rax, [obj]` loads the object's address with no adjustment — offset **+0**; `C*` and `A*` share the same address.",
      intuition: "Upcasting to the **first** base is free: the address never changes.",
    },
  },
  {
    line: 10,
    layout: { title, slots, pointers: [{ name: "B* pb", at: 8 }] },
    caption: {
      cpp: "`B* pb = &obj;` points at the `B` base, which starts **8 bytes into** the `C` object (`= sizeof(A)`).",
      asm: "`lea rax, [obj+8]` — the address is adjusted by **+8** (`= sizeof(A)`); `pb != &obj`.",
      intuition: "A `B*` into a `C` must skip past `A`, so the compiler silently adjusts `this` — that's **this-pointer adjustment**.",
    },
  },
];

// Curated x86-64 Intel syntax (idealized). main only; struct definitions emit no code.
// asm line numbers below are 1-based positions in this string, counting every line.
const asm =
`main:
… prologue elided
; C obj -> 16 bytes, no init
  lea  rax, [obj]
  mov  [pa], rax
  lea  rax, [obj+8]
  mov  [pb], rax
  lea  rax, [obj]
  mov  [pc], rax
… epilogue elided`;

// source line (in `code`) -> asm line numbers (in `asm`)
const asmMap = {
  8:  [3],        // C obj  ->  no-code note row
  9:  [4, 5],     // A* pa = &obj;  lea [obj], mov [pa]
  10: [6, 7],     // B* pb = &obj;  lea [obj+8], mov [pb]  — the adjustment
  11: [8, 9],     // C* pc = &obj;  lea [obj], mov [pc]  — most-derived, offset +0
};

const asmLabel = "x86-64 · Intel (idealized)";

export default scene({ title: "Multiple inheritance: a base pointer may point into the middle of the object", code, steps, asm, asmMap, asmLabel });
