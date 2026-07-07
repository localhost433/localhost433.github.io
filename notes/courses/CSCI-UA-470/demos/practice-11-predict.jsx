import { scene, stack } from "@course";

/* Standalone predict: operand-stack push order (top-first). */
const OP = (id, val, hl) => stack(id, "operand", val, { id, hl });

export default scene({
  title: "Operand stack: what's on top?",
  lang: "java",
  code: "iload_1   // push a = 5\niload_2   // push b = 7",
  steps: [
    {
      line: 1,
      cells: [OP("op0", "5", true)],
      caption: {
        jvm: "`iload_1` pushes `a` = `5`. The operand stack holds one value.",
        intuition: "Loads push onto the top of the operand stack.",
      },
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
      caption: {
        jvm: "`iload_2` pushes `7` **above** the earlier `5`.",
        intuition: "Two operands are now staged for the next arithmetic instruction.",
      },
    },
  ],
});
