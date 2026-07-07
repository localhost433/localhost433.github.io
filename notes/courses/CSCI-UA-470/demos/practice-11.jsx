import { quiz, stack } from "@course";

/* Note 11 practice — predict (operand stack order) + goal (JIT tier). Scenes are
   authored fresh for the quiz; the operand slots are plain stack cells labelled
   by position, with the "top" of the stack drawn last (highest id). */

const OP = (id, val, hl) => stack(id, "operand", val, { id, hl });
const METHOD = (state, hl) => stack("m", "hot()", state, { id: "m", hl });

// Item 1 — predict: pushes stack, they don't overwrite.
const opScene = {
  title: "Operand stack: what's on top?",
  lang: "java",
  code: `iload_1   // push a = 5\niload_2   // push b = 7`,
  steps: [
    {
      line: 1,
      cells: [OP("op0", "5", true)],
      caption: { jvm: "`iload_1` pushes `a` = `5`. The operand stack holds one value.",
                 intuition: "Loads push onto the top of the operand stack." },
    },
    {
      line: 2,
      predict: {
        ask: "After `iload_2` pushes `b` = `7`, what does the operand stack look like, **top-first**?",
        choices: [
          { label: "top → `7`, then `5` below it", correct: true },
          { label: "top → `5`, then `7` below it" },
          { label: "just `7` (it replaces `5`)" },
        ],
        why: "`iload_2` **pushes**; it does not overwrite. `5` was pushed first and stays at the bottom, so the later `7` sits on top. A following `iadd` would pop `7` then `5`.",
      },
      cells: [OP("op0", "5"), OP("op1", "7 ← top", true)],
      caption: { jvm: "`iload_2` pushes `7` **above** the earlier `5`.",
                 intuition: "Two operands are now staged for the next arithmetic instruction." },
    },
  ],
};

// Item 2 — goal: drive invocation count past the JIT threshold.
const jitScene = {
  title: "Warm the method until the JIT compiles it",
  lang: "java",
  code: `hot();   // called in a loop`,
  knobs: [
    { id: "calls", label: "Invocation count", options: [
      { value: "cold", label: "1 call" },
      { value: "warm", label: "~1k calls" },
      { value: "hot",  label: "10k+ calls" },
    ], default: "cold" },
  ],
  steps: (k) => k.calls === "hot"
    ? [ { line: 1, cells: [METHOD("JIT-compiled → native", true)],
          caption: { jvm: "Past the hotness threshold the JIT compiles `hot()` to **native code**; later calls run the compiled version.",
                     intuition: "Hot methods stop being interpreted and start running as native machine code." } } ]
    : [ { line: 1, cells: [METHOD(k.calls === "warm" ? "interpreted (warming)" : "interpreted", true)],
          caption: { jvm: k.calls === "warm"
                       ? "~1k calls: still **interpreted**, but the counter is climbing toward the threshold."
                       : "A cold method runs in the **interpreter**, one bytecode at a time.",
                     intuition: "Below the threshold the execution engine interprets the bytecode." } } ],
};

export default quiz({ items: [
  { kind: "predict", scene: opScene },
  { kind: "goal", scene: jitScene,
    prompt: "Raise the **invocation count** until the method crosses the JIT threshold and compiles to native.",
    goal: (k) => k.calls === "hot",
    success: { why: "Once a method is called enough times it becomes **hot**; the JIT compiles it to native code so it no longer runs in the interpreter." } },
] });
