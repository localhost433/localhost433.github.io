import { scene, stack, heap, glob, text } from "@course";

/* L02 has no standalone source file in code/lectures — this mirrors the
   L02-01 lecture slide: a pointer is just a variable holding an address, and
   that address can live in ANY of the four memory segments. All four pointers
   are shown in parallel (one program), each fanning into a different segment;
   the stepper just spotlights one case at a time. */

const code =
`char g = 10;
int  f() { return 0; }

int main() {
    char  s = 10;
    char* ps = &s;
    char* pg = &g;
    char* ph = new char(10);
    int (*pf)() = &f;
}`;

// every cell is always present (the four arrows fan out in parallel); `act`
// only changes which pointer + target is highlighted.
const view = (act) => [
  stack("s",  "char",     "10",  { id: "s",  hl: act === "stack" }),
  stack("ps", "char*",    "&s",  { id: "ps", to: "s", hl: act === "stack" }),
  stack("pg", "char*",    "&g",  { id: "pg", to: "g", hl: act === "global" }),
  stack("ph", "char*",    "0x…", { id: "ph", to: "h", hl: act === "heap" }),
  stack("pf", "int(*)()", "&f",  { id: "pf", to: "f", hl: act === "code" }),
  glob("g",   "char",     "10",  { id: "g",  hl: act === "global" }),
  heap("",    "char",     "10",  { id: "h",  hl: act === "heap" }),
  text("f",   "int()",    "machine code", { id: "f", hl: act === "code" }),
];

const steps = [
  {
    line: [5, 6], cells: view("stack"),
    caption: {
      cpp: "`ps = &s` reads the address of the local `s` with `&s`, and since `s` lives on the stack the pointer points back into the **STACK**.",
      intuition: "A pointer to a local just holds an address inside the stack itself.",
    },
  },
  {
    line: [1, 7], cells: view("global"),
    caption: {
      cpp: "`pg = &g` takes the address of `g`, which lives in static storage for the whole program, so `pg` points into **GLOBAL/STATIC**.",
      intuition: "The pointer `pg` still sits on the stack; only the address it holds points elsewhere.",
    },
  },
  {
    line: 8, cells: view("heap"),
    caption: {
      cpp: "`new char(10)` allocates fresh memory on the **HEAP** and returns its address into `ph`.",
      intuition: "The pointer is on the stack but the object it owns is on the heap (remember to `delete` it).",
    },
  },
  {
    line: [2, 9], cells: view("code"),
    caption: {
      cpp: "`pf = &f` stores the address of function `f`, which lives in the read-only **CODE** segment.",
      intuition: "Same idea every time — a pointer is just an address, and that address can sit in **any** of the four segments.",
    },
  },
];

export default scene({ title: "One pointer kind, four segments: an address can live anywhere", code, steps });
