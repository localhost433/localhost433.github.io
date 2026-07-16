import { scene, l06VtableScene } from "@course";

/* note 06 practice — the vtable-dispatch walkthrough (shared with the mem-vtable
   demo via l06VtableScene) turned into active recall: the student predicts which
   `intro()` runs at the final `ptr->intro()` step, before the dispatch is revealed.
   Reuses the demo's exact cell layout and code, adding only the question. */

export default scene(l06VtableScene({
  predict: {
    ask: "`ptr` has static type `person*` but points at a **student** object. When `ptr->intro()` runs (`intro` is `virtual`), **which body executes**?",
    choices: [
      { label: "`person::intro` — chosen by `ptr`'s declared type" },
      { label: "`student::intro` — chosen by the object's vptr at run time", correct: true },
      { label: "Both, base first" },
    ],
    why: "`intro` is `virtual`, so the call is **late-bound**: it follows the object's own vptr — `ptr -> s -> s's vptr -> student::vtable -> student::intro` — running the **derived** override even through a `person*`. Only if `intro` were **non-virtual** would the static type `person*` decide and `person::intro` run.",
  },
}));
