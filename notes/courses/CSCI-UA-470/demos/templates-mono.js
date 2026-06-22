/* AUTO-GENERATED from templates-mono.jsx by `npm run build:artifacts` — do not edit. */
import { scene, stack, text } from "@course";

/* L07 — monomorphization. A function template is a PATTERN, not code: the
   compiler emits nothing until a call fixes T. Each distinct type argument
   stamps out a separate concrete function in the Code segment (max<int>,
   max<double>, max<string> — one copy each), all from one source. Re-calling
   with a type already seen reuses its instantiation. Companion idea to the L06
   vtable demos: templates resolve at COMPILE time (many functions), a virtual
   call resolves at RUN time (one function, chosen by the object). */

const code = `template <typename T>
T max(T a, T b) {
    return a > b ? a : b;
}

int main() {
    int    i = max(3, 7);
    double d = max(2.5, 9.5);
    string x = "ab", y = "cd";
    string s = max(x, y);
    int    j = max(8, 2);
}`;

// one concrete function per distinct type, living once in the Code segment.
// The body string is identical across all three — same source pattern, stamped
// per type; the type badge shows which T it was instantiated with.
const MI = hl => text("max<int>", "T = int", "a > b ? a : b", {
  id: "mi",
  hl
});
const MD = hl => text("max<double>", "T = double", "a > b ? a : b", {
  id: "md",
  hl
});
const MS = hl => text("max<string>", "T = string", "a > b ? a : b", {
  id: "ms",
  hl
});

// the locals each call's result lands in, on the stack (declaration order).
const I = hl => stack("i", "int", "7", {
  id: "i",
  hl
});
const D = hl => stack("d", "double", "9.5", {
  id: "d",
  hl
});
const X = hl => stack("x", "string", '"ab"', {
  id: "x",
  size: 32,
  hl
});
const Y = hl => stack("y", "string", '"cd"', {
  id: "y",
  size: 32,
  hl
});
const S = hl => stack("s", "string", '"cd"', {
  id: "s",
  size: 32,
  hl
});
const J = hl => stack("j", "int", "8", {
  id: "j",
  hl
});
const steps = [{
  line: [1, 2, 3, 4],
  cells: [],
  caption: {
    cpp: "`template <typename T>` declares a **pattern**, not a function. The compiler parses it but emits **no machine code** — the Code segment is empty.",
    intuition: "A template is a **recipe**. Nothing is generated until you call it with a concrete type."
  }
}, {
  line: 7,
  cells: [MI(true), I(true)],
  caption: {
    cpp: "`max(3, 7)` deduces `T = int`, so the compiler **stamps out** `max<int>` into the Code segment and calls it; the result `7` lands in `i`.",
    intuition: "The first use with `int` **instantiates** one concrete function — `max<int>` — real machine code for that type."
  }
}, {
  line: 8,
  cells: [MI(), MD(true), I(), D(true)],
  caption: {
    cpp: "`max(2.5, 9.5)` deduces `T = double`, stamping out a **separate** function `max<double>`; `d` gets `9.5`.",
    intuition: "A new type means a **new instantiation** — a second, independent function compiled beside the first."
  }
}, {
  line: [9, 10],
  cells: [MI(), MD(), MS(true), I(), D(), X(true), Y(true), S(true)],
  caption: {
    cpp: "`max(x, y)` with two `string`s deduces `T = string`, stamping out `max<string>`; it returns the larger, `\"cd\"`, into `s`.",
    intuition: "Three distinct types so far -> **three separate functions** in Code, all from one source pattern."
  }
}, {
  line: 11,
  cells: [MI(true), MD(), MS(), I(), D(), X(), Y(), S(), J(true)],
  caption: {
    cpp: "`max(8, 2)` deduces `T = int` **again** — the compiler **reuses** the existing `max<int>`; no new function is generated. `j` gets `8`.",
    intuition: "One instantiation **per distinct type**, not per call. The repeated `int` call reuses the same compiled `max<int>`."
  }
}, {
  line: [1, 2, 3, 4],
  cells: [MI(true), MD(true), MS(true), I(), D(), X(), Y(), S(), J()],
  caption: {
    cpp: "One template produced **three** concrete functions — `max<int>`, `max<double>`, `max<string>` — each resolved and type-checked at **compile time**.",
    intuition: "Templates trade **code size** (one copy per type) for **speed and type-safety** — resolved at compile time, with no runtime dispatch like a virtual call."
  }
}];
export default scene({
  title: "Monomorphization: one template, a separate compiled function per type",
  code,
  steps
});