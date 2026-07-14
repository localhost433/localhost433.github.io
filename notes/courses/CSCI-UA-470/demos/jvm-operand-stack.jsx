import { scene, stack, text } from "@course";

/* L11 - JVM operand stack trace.
   The bytecode uses iload_1 and iload_2, so the model is an instance method
   frame: local[0] is the implicit this reference, local[1] is a, and local[2]
   is b. The this slot is shown once as a local variable slot, but it is not
   followed by these instructions. The actual arithmetic is stack-based: iload
   pushes values from local slots, iadd pops two ints and pushes one result, and
   ireturn pops the result for the caller. */

const code =
`class Calc {
    int add(int a, int b) {
        return a + b;
    }
}

Calc c = new Calc();
int r = c.add(5, 7);   // the frame below is this call`;

// Real `javap -c Calc` output (JDK 22). Only the default constructor is elided.
// Regenerate/verify with: npm run check:bytecode
const asm =
`class Calc {
… Calc() — default constructor elided
  int add(int, int);
    Code:
       0: iload_1
       1: iload_2
       2: iadd
       3: ireturn
}`;

// source line (in `code`) -> bytecode line numbers (in `asm`)
const asmMap = {
  2: [3],            // int add(int a, int b)  -> the method descriptor
  3: [5, 6, 7, 8],   // return a + b;          -> the whole Code block
};

const asmLabel = "javap -c · JDK 22";

const THIS = () => stack("local[0]", "ref", "this (unused)", { id: "this" });
const A = (hl) => stack("local[1]", "int a", "5", { id: "a", hl });
const B = (hl) => stack("local[2]", "int b", "7", { id: "b", hl });
const EMPTY = () => stack("operand stack", "empty", "[]", { id: "empty" });
const OP0 = (v, hl) => stack("operand[0]", "int", v, { id: "op0", hl });
const OP1 = (v, hl) => stack("operand[top]", "int", v, { id: "op1", hl });
const RET = (hl) => stack("return to caller", "int", "12", { id: "ret", hl });
const PC = (pc, instr, hl) => text("PC", "bytecode", pc + (instr ? ": " + instr : ""), { id: "pc", hl });

const steps = [
  {
    line: 2, asmLine: 3,
    cells: [THIS(), A(), B(), EMPTY(), PC("before 0", "")],
    caption: {
      jvm: "A JVM frame starts with a local-variable array and an empty operand stack. In this instance method, local slot `0` holds `this`, while slots `1` and `2` hold the integer arguments.",
      intuition: "`add` takes **two** parameters, yet the bytecode reads slots **1** and **2** — because slot `0` is the invisible `this`. That is why the first argument is not slot `0`.",
    },
  },
  {
    line: 3, asmLine: 5,
    cells: [THIS(), A(true), B(), OP0("5", true), PC(0, "iload_1", true)],
    caption: {
      jvm: "`iload_1` reads local slot `1`, the value of `a`, and pushes `5` onto the operand stack.",
      intuition: "Load instructions move values from the frame's local-variable array to the operand stack.",
    },
  },
  {
    line: 3, asmLine: 6,
    cells: [THIS(), A(), B(true), OP0("5"), OP1("7", true), PC(1, "iload_2", true)],
    caption: {
      jvm: "`iload_2` reads local slot `2`, the value of `b`, and pushes `7` above the earlier `5`.",
      intuition: "The operand stack now has the two inputs needed by the arithmetic instruction.",
    },
  },
  {
    line: 3, asmLine: 7,
    cells: [THIS(), A(), B(), OP0("12", true), PC(2, "iadd", true)],
    caption: {
      jvm: "`iadd` pops the two top int values, adds them, and pushes the result `12`.",
      intuition: "Stack-based arithmetic consumes operands from the top of the operand stack and leaves its result there.",
    },
  },
  {
    line: 3, asmLine: 8,
    cells: [THIS(), A(), B(), RET(true), PC(3, "ireturn", true)],
    caption: {
      jvm: "`ireturn` pops the top int result and returns it to the caller. After the return, this frame is finished.",
      intuition: "This is why JVM bytecode is called stack-based: even return values move through the operand stack.",
    },
  },
];

export default scene({
  title: "JVM operand stack trace - frame, iload, iadd, ireturn",
  code,
  lang: "java",
  asm,
  asmMap,
  asmLabel,
  asmLang: "bytecode",
  steps,
});
