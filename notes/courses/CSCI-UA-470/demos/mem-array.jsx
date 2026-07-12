import { scene, stack, heap } from "@course";

/* Stack array vs dynamic array, and array-to-pointer decay. `int a[4]` is four
   contiguous ints in one stack allocation (sizeof 16); its name decays to &a[0].
   `new int[4]` is an 8-byte pointer (sizeof 8) to a heap block. */

const code =
`int  a[4] = {3, 1, 4, 1};
int* q    = a;
int* arr  = new int[4];
delete[] arr;`;

const A = (hl) => stack("a", "int[4]", "", { id: "a", hl, fields: [
  { name: "a[0]", type: "int", value: "3" },
  { name: "a[1]", type: "int", value: "1" },
  { name: "a[2]", type: "int", value: "4" },
  { name: "a[3]", type: "int", value: "1" },
]});
const Q = (hl) => stack("q", "int*", "&a[0]", { id: "q", to: "a", hl });
const ARR = (hl) => stack("arr", "int*", "0x…", { id: "arr", to: "harr", hl });
const HARR = (rec) => heap("", "int[4]", "", { id: "harr", reclaimed: rec, fields: [
  { name: "[0]", type: "int", value: "?" },
  { name: "[1]", type: "int", value: "?" },
  { name: "[2]", type: "int", value: "?" },
  { name: "[3]", type: "int", value: "?" },
]});

const steps = [
  {
    line: 1,
    cells: [A(true)],
    caption: {
      cpp: "`int a[4];` lays out four contiguous ints in **one** stack allocation of 16 bytes.",
      intuition: "`sizeof(a) == 16` measures the **whole array**, not a pointer — the array is the storage itself.",
    },
  },
  {
    line: 2,
    cells: [Q(true), A()],
    caption: {
      cpp: "`int* q = a;` — used in an expression the array name **decays** to a pointer, so `q` holds `&a[0]` and points at the start of the array.",
      asm: "`int* q = a;` -> `lea rax, [a]` — the array name decays to `&a[0]`; no elements are copied.",
      intuition: "`a` and `&a[0]` are the **same address**, which is why a bare pointer can't recover the array's length.",
    },
  },
  {
    line: 3,
    cells: [A(), Q(), ARR(true), HARR()],
    caption: {
      cpp: "`int* arr = new int[4];` puts an 8-byte **pointer** on the stack aimed at a 4-int block on the **heap**. The four ints are **uninitialized** (indeterminate `?`) — `new int[4]` default-initializes them; only `new int[4]{}` would zero them.",
      asm: "`new int[4]` -> `call operator new[]` returns a pointer; the variable is just an 8-byte pointer, not the array.",
      intuition: "`sizeof(arr) == 8`, not 16 — once it's a pointer the array's size is **gone**. And unlike a stack `{...}` initializer, the heap block starts with **garbage**.",
    },
  },
  {
    line: 4,
    cells: [A(), Q(), ARR(true), HARR(true)],
    caption: {
      cpp: "`delete[] arr;` frees the **heap** block (reclaimed), leaving `arr` dangling at freed memory.",
      intuition: "The stack array `a` needs **no** `delete` — it's freed automatically when its scope ends.",
    },
  },
];

export default scene({ title: "Arrays: stack vs heap, and the array-to-pointer decay", code, steps });
