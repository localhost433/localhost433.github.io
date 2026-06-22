/* AUTO-GENERATED from mem-reference-compare.jsx by `npm run build:artifacts` — do not edit. */
import { compare, stack } from "@course";

/* The three declarations, read side by side. The point lives in the HIGHLIGHT:
   it marks the storage *introduced* at each stage — so the reference (stage 2)
   lights up nothing (it reuses x's slot), while the pointer (stage 3) grows a
   real cell of its own. Stage 3 keeps the un-highlighted `x · r` cell so the
   pointer has a target to arrow into. */

const X = (label, hl) => stack(label, "int", "5", {
  id: "x",
  hl
});
const P = hl => stack("p", "int*", "&x", {
  id: "p",
  to: "x",
  hl
});
export default compare({
  title: "Reference vs pointer: an alias has no storage of its own",
  stages: [{
    code: "int  x = 5;",
    cells: [X("x", true)],
    tag: {
      text: "4 bytes",
      kind: "cpp"
    },
    note: "A real variable — the compiler reserves a 4-byte slot."
  }, {
    code: "int& r = x;",
    cells: [X("x · r")],
    tag: {
      text: "+0 bytes",
      kind: "int"
    },
    note: "`r` is another name for `x`'s slot — `&r == &x`, **no new object**."
  }, {
    code: "int* p = &x;",
    cells: [X("x · r"), P(true)],
    tag: {
      text: "+8 bytes",
      kind: "asm"
    },
    note: "`p` is its **own** object that stores `x`'s address."
  }],
  punch: "Stages 1 and 2 are the **same** storage; only the pointer adds a cell of its own.",
  hint: "Highlight marks the storage introduced at each stage."
});