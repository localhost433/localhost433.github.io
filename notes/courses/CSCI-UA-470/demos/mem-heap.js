/* AUTO-GENERATED from mem-heap.jsx by `npm run build:artifacts` — do not edit. */
import { scene, stack, heap } from "@course";

/* L02 dynamic memory (from the L02-02 slide): new / delete / dangling.
   No standalone .cpp under code/lectures, so this follows the lecture. */

const code = `int* p = new int(0);
*p = 42;
delete p;
p = nullptr;`;
const P = (value, hl) => stack("p", "int*", value, {
  addr: "0x…a8",
  to: value === "nullptr" ? undefined : "h",
  toNull: value === "nullptr",
  hl
});
const H = (value, reclaimed) => heap("", "int", value, {
  id: "h",
  addr: "0x…c0",
  reclaimed
});
const steps = [{
  line: 1,
  cells: [P("0x…c0", true), H("0")],
  caption: {
    cpp: "`new int(0)` asks for memory on the **heap** and returns its address into `p`.",
    asm: "`new` -> `call operator new` — heap allocation is a library call; the returned address is stored in `p`.",
    intuition: "The pointer `p` lives on the **stack**, but the `int` it owns lives on the **heap**."
  }
}, {
  line: 2,
  cells: [P("0x…c0"), H("42")],
  caption: {
    cpp: "`*p = 42;` writes through the pointer into the heap object.",
    intuition: "Stack variables are freed automatically, but this **heap** object is not — you must free it yourself."
  }
}, {
  line: 3,
  cells: [P("0x…c0", true), H("42", true)],
  caption: {
    cpp: "`delete p;` releases the heap memory, but `p` still holds the old address — it is now a **dangling** pointer, and reading `*p` here is undefined behaviour.",
    asm: "`delete p` -> `call operator delete` frees the block; `p` still holds the freed address (dangling).",
    intuition: "Freeing the **heap** bytes (greyed and struck through) does not change `p`, so its arrow now dangles (red and broken)."
  }
}, {
  line: 4,
  cells: [P("nullptr", true)],
  caption: {
    cpp: "`p = nullptr;` breaks the dangling link so `p` now points at the dedicated **null sink** (`⌀ nullptr`) in the free/unmapped band.",
    intuition: "Pointing at **null** clearly means *nothing*, and a second `delete` would now be harmless."
  }
}];
export default scene({
  title: "Dynamic memory: new, delete, and dangling pointers",
  code,
  steps
});