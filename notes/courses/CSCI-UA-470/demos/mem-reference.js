/* AUTO-GENERATED from mem-reference.jsx by `npm run build:artifacts` — do not edit. */
import { scene, stack } from "@course";

/* A reference is an ALIAS — another name for the same storage, with no object of
   its own. A *local* reference compiles to no storage (`&r == &x`); we draw it as
   the SAME cell relabelled `x · r`. A pointer, by contrast, is a separate object
   that stores an address. (A reference that must persist — e.g. a reference data
   member — is implemented as a hidden 8-byte pointer; noted in a caption.) */

const code = `int  x = 5;
int& r = x;
int* p = &x;`;
const X = (name, hl) => stack(name, "int", "5", {
  id: "x",
  hl
});
const P = hl => stack("p", "int*", "&x", {
  id: "p",
  to: "x",
  hl
});
const steps = [{
  line: 1,
  cells: [X("x", true)],
  caption: {
    cpp: "`int x = 5;` declares a normal `int` variable on the stack.",
    asm: "`mov dword [x], 5` writes the value `5` into a real 4-byte slot.",
    intuition: "A normal variable is real storage — the compiler emits a store for it."
  }
}, {
  line: 2,
  cells: [X("x · r", true)],
  caption: {
    cpp: "`int& r = x;` binds reference `r` to `x` — `r` is another name for the **same** slot (`&r == &x`).",
    asm: "No instruction — `r` compiles to nothing; the compiler simply uses `x`'s slot wherever `r` appears.",
    intuition: "A reference is an alias, not an object — it occupies **zero** storage of its own."
  }
}, {
  line: 3,
  cells: [X("x · r"), P(true)],
  caption: {
    cpp: "`int* p = &x;` declares a **separate** pointer variable that stores `x`'s address.",
    asm: "`lea rax, [x]` computes `x`'s address; `mov qword [p], rax` stores it — `p` is its own 8-byte object.",
    intuition: "A pointer holds an address and can be reseated or made `null`; a reference can't."
  }
}];

// Curated x86-64 (Intel syntax). Shows that int& r = x emits no code while
// int* p = &x needs two instructions to materialise its own 8-byte slot.
// asm line numbers are 1-based positions in this string, counting every line.
const asm = `main:
… prologue elided
  mov  dword [x], 5
; int& r = x -> no code; r aliases x
  lea  rax, [x]
  mov  qword [p], rax
… epilogue elided`;

// source line -> asm line numbers (1-based, no elision targets)
const asmMap = {
  1: [3],
  // int x = 5;    -> mov dword [x], 5
  2: [4],
  // int& r = x;   -> no-code note row
  3: [5, 6] // int* p = &x;  -> lea + mov
};
const asmLabel = "x86-64 · Intel";
export default scene({
  title: "Reference vs pointer: an alias has no storage of its own",
  code,
  steps,
  asm,
  asmMap,
  asmLabel
});