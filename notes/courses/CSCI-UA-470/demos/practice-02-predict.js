/* AUTO-GENERATED from practice-02-predict.jsx by `npm run build:artifacts` — do not edit. */
import { scene, l02HeapScene } from "@course";

/* note 02 practice — the dynamic-memory walkthrough (shared with the mem-heap demo
   via l02HeapScene) turned into active recall: the student predicts what `delete p;`
   does to `p` and to the heap block, before the dangling state is revealed. Reuses
   the demo's exact cell layout and code, adding only the question. */

export default scene(l02HeapScene({
  predict: {
    ask: "`delete p;` is about to run (p points at a heap `int` holding 42). Afterward, what is true of `p` and that heap block?",
    choices: [{
      label: "The block is freed, but `p` still holds the old address — `p` now **dangles**, and `*p` is undefined behavior",
      correct: true
    }, {
      label: "`p` is set to `nullptr` automatically and the block is zeroed"
    }, {
      label: "Nothing changes until `p = nullptr;` runs on the next line"
    }],
    why: "`delete` only tells the allocator the block may be reused; it does **not** change `p`'s value or the bytes. So `p` still points at freed memory — a **dangling** pointer — and reading `*p` is undefined behavior. That is why the next line, `p = nullptr;`, is the fix: it makes the stale pointer safe (and a second `delete nullptr` a harmless no-op)."
  }
}));