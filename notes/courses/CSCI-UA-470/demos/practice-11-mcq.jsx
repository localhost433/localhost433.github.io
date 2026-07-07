import { mcq } from "@course";

/* Discrete-fact MCQ on the JVM runtime. No score. */
export default mcq({
  questions: [
    {
      stem: "Which JVM runtime areas are **shared** by all threads (not per-thread)?",
      choices: [
        { text: "The heap and the method area", correct: true },
        { text: "The JVM stacks and PC registers" },
        { text: "The operand stack and local-variable array" },
        { text: "Native method stacks" },
      ],
      why: "The **heap** and **method area** are shared across all threads. JVM stacks, PC registers, and native method stacks are **per-thread** — each thread gets its own.",
    },
    {
      stem: "In what order does class loading proceed for a class on first active use?",
      choices: [
        { text: "load → link (verify · prepare · resolve) → initialize", correct: true },
        { text: "initialize → load → link" },
        { text: "verify → load → initialize → resolve" },
        { text: "load → initialize → link" },
      ],
      why: "A class is **loaded** (bytecode → `Class` metadata), then **linked** — verify, prepare (static defaults), resolve — then **initialized** (static initializers run) on first active use.",
    },
    {
      stem: "True or false: `.class` files contain native machine instructions for the host CPU.",
      choices: [
        { text: "True" },
        { text: "False", correct: true },
      ],
      why: "`.class` files contain **JVM bytecode** and class metadata — a portable, software-defined instruction set. The interpreter or JIT turns bytecode into native instructions at run time.",
    },
    {
      stem: "After `iconst_1`, `iconst_2`, `iadd`, what is on top of the operand stack?",
      figure: { code: "iconst_1   // push 1\niconst_2   // push 2\niadd       // pop 2, pop 1, push sum", lang: "java" },
      choices: [
        { text: "`3`", correct: true },
        { text: "`2`, with `1` below it" },
        { text: "`1`, with `2` below it" },
        { text: "nothing — the stack is empty" },
      ],
      why: "`iadd` pops the two top ints (`2` then `1`), adds them, and pushes the single result `3`. Two operands are consumed, one is produced.",
    },
  ],
});
