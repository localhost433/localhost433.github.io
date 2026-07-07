/* AUTO-GENERATED from jvm-operand-stack.jsx by `npm run build:artifacts` — do not edit. */
import { scene, stack, text } from "@course";

/* L11 - JVM operand stack trace.
   The bytecode uses iload_1 and iload_2, so the model is an instance method
   frame: local[0] is the implicit this reference, local[1] is a, and local[2]
   is b. The this slot is shown once as a local variable slot, but it is not
   followed by these instructions. The actual arithmetic is stack-based: iload
   pushes values from local slots, iadd pops two ints and pushes one result, and
   ireturn pops the result for the caller. */

const code = `0: iload_1
1: iload_2
2: iadd
3: ireturn`;
const THIS = () => stack("local[0]", "ref", "this (unused)", {
  id: "this"
});
const A = hl => stack("local[1]", "int a", "5", {
  id: "a",
  hl
});
const B = hl => stack("local[2]", "int b", "7", {
  id: "b",
  hl
});
const EMPTY = () => stack("operand stack", "empty", "[]", {
  id: "empty"
});
const OP0 = (v, hl) => stack("operand[0]", "int", v, {
  id: "op0",
  hl
});
const OP1 = (v, hl) => stack("operand[top]", "int", v, {
  id: "op1",
  hl
});
const RET = hl => stack("return to caller", "int", "12", {
  id: "ret",
  hl
});
const PC = (pc, instr, hl) => text("PC", "bytecode", pc + (instr ? ": " + instr : ""), {
  id: "pc",
  hl
});
const steps = [{
  cells: [THIS(), A(), B(), EMPTY(), PC("before 0", "")],
  caption: {
    jvm: "A JVM frame starts with a local-variable array and an empty operand stack. In this instance method, local slot `0` holds `this`, while slots `1` and `2` hold the integer arguments.",
    intuition: "The `this` reference explains why the first integer argument is in local slot `1`; these bytecodes do not use `this` directly."
  }
}, {
  line: 1,
  cells: [THIS(), A(true), B(), OP0("5", true), PC(0, "iload_1", true)],
  caption: {
    jvm: "`iload_1` reads local slot `1`, the value of `a`, and pushes `5` onto the operand stack.",
    intuition: "Load instructions move values from the frame's local-variable array to the operand stack."
  }
}, {
  line: 2,
  cells: [THIS(), A(), B(true), OP0("5"), OP1("7", true), PC(1, "iload_2", true)],
  caption: {
    jvm: "`iload_2` reads local slot `2`, the value of `b`, and pushes `7` above the earlier `5`.",
    intuition: "The operand stack now has the two inputs needed by the arithmetic instruction."
  }
}, {
  line: 3,
  cells: [THIS(), A(), B(), OP0("12", true), PC(2, "iadd", true)],
  caption: {
    jvm: "`iadd` pops the two top int values, adds them, and pushes the result `12`.",
    intuition: "Stack-based arithmetic consumes operands from the top of the operand stack and leaves its result there."
  }
}, {
  line: 4,
  cells: [THIS(), A(), B(), RET(true), PC(3, "ireturn", true)],
  caption: {
    jvm: "`ireturn` pops the top int result and returns it to the caller. After the return, this frame is finished.",
    intuition: "This is why JVM bytecode is called stack-based: even return values move through the operand stack."
  }
}];
export default scene({
  title: "JVM operand stack trace - frame, iload, iadd, ireturn",
  code,
  lang: "java",
  steps
});