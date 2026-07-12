/* AUTO-GENERATED from trace-l03.jsx by `npm run build:artifacts` — do not edit. */
import { scene, obj } from "@course";

/* Traces code/lectures/L03/main.cpp: the circle class with overloaded
   operators, built up one statement at a time. Real run prints:
     c3: radius = 5, color = No color
     c3: radius = 50, color = No color
     c3: radius = 2, color = white            */

const code = `circle c1;
circle c2;
c1.set_radius(10);
c1.set_color("red");
c2.set_radius(5);
c2.set_color("blue");
circle c3;

c3 = c1 - c2;
c3 = c1 * c2;
c3 = c1 / c2;
c1 = c2;`;

// circle = string color (≈32 B) + double radius (8 B) -> sizeof 40
const circle = obj("circle", [{
  name: "color",
  type: "string",
  size: 32
}, {
  name: "radius",
  type: "double"
}]);
const c = (id, color, radius, hl) => circle(id, [color, radius], {
  hl
});
const out = (r, col) => ({
  expr: "c1 " + (r === 5 ? "-" : r === 50 ? "*" : "/") + " c2",
  result: "c3: radius = " + r + ", color = " + col
});
const steps = [{
  line: 1,
  cells: [c("c1", "No color", 0, true)],
  caption: {
    cpp: "`circle c1;` — the default constructor builds `c1 = {No color, 0}` on the stack.",
    asm: "`lea rdi, [c1]` loads `c1`'s address as `this`; `call circle::circle` runs the default constructor.",
    intuition: "Even a default constructor is a **function call** — `this` arrives in `rdi` just like any argument."
  }
}, {
  line: 2,
  cells: [c("c1", "No color", 0), c("c2", "No color", 0, true)],
  caption: {
    cpp: "`circle c2;` — a second default circle, also `{No color, 0}`.",
    asm: "`lea rdi, [c2]` points `this` at `c2`'s slot; `call circle::circle` constructs it in place.",
    intuition: "Each object gets its own `call` — the **address in `rdi`** is the only thing that changes."
  }
}, {
  line: [3, 4],
  cells: [c("c1", "red", 10, true), c("c2", "No color", 0)],
  caption: {
    cpp: "`c1.set_radius(10)` then `c1.set_color(\"red\")` update c1 in place — result: `{red, 10}`.",
    asm: "`lea rdi, [c1]` sets `this = &c1`; `call circle::set_color` passes the string argument in `rsi` (set_radius is elided above).",
    intuition: "A **member function call** is just `this` in `rdi` plus normal argument registers — no magic."
  }
}, {
  line: [5, 6],
  cells: [c("c1", "red", 10), c("c2", "blue", 5, true)],
  caption: {
    cpp: "The same two setters give `c2 = {blue, 5}`.",
    asm: "`lea rdi, [c2]` switches `this` to `c2`; `call circle::set_color` writes the new color.",
    intuition: "`this` is the only thing distinguishing `c1.set_color` from `c2.set_color` — **same function, different pointer**."
  }
}, {
  line: 7,
  cells: [c("c1", "red", 10), c("c2", "blue", 5), c("c3", "No color", 0, true)],
  caption: {
    cpp: "`circle c3;` — a third default circle, ready to receive operator results.",
    asm: "`lea rdi, [c3]` targets the new slot; `call circle::circle` default-constructs it.",
    intuition: "Every local object on the stack gets its own constructor **call** — stack allocation is automatic, construction is not."
  }
}, {
  line: 9,
  cells: [c("c1", "red", 10), c("c2", "blue", 5), c("c3", "No color", 5, true)],
  outputs: [out(5, "No color")],
  caption: {
    cpp: "`c3 = c1 - c2` is shorthand for `c3 = c1.operator-(c2)`: radius 10 − 5 = 5, color \"No color\"; a brand-new circle is returned by value.",
    asm: "`lea rdi, [c3]` passes the **hidden return slot**; `lea rsi, [c1]` is `this` (left operand); `lea rdx, [c2]` is the argument; then `call circle::operator-`.",
    intuition: "A binary operator is **three arguments**: a hidden return slot, `this` (left side), and the right-hand operand."
  }
}, {
  line: 10,
  cells: [c("c1", "red", 10), c("c2", "blue", 5), c("c3", "No color", 50, true)],
  outputs: [out(5, "No color"), out(50, "No color")],
  caption: {
    cpp: "`c3 = c1 * c2` — `operator*` multiplies the radii: 10 × 5 = 50.",
    asm: "The `lea` setup is the same pattern (hidden slot → `rdi`, `this` → `rsi`, arg → `rdx`); then `call circle::operator*`.",
    intuition: "Every overloaded operator lowers to an **ordinary `call`** — the symbol is just syntactic sugar for the function name."
  }
}, {
  line: 11,
  cells: [c("c1", "red", 10), c("c2", "blue", 5), c("c3", "white", 2, true)],
  outputs: [out(5, "No color"), out(50, "No color"), out(2, "white")],
  caption: {
    cpp: "`c3 = c1 / c2` — `operator/` guards against zero radius, computes 10 / 5 = 2, and sets color to \"white\".",
    asm: "After the identical `lea` setup, `call circle::operator/` handles the guard and division logic in one function body.",
    intuition: "Guard logic, arithmetic, and color assignment all live inside the **function body** — the call site is always just a `call`."
  }
}, {
  line: 12,
  cells: [c("c1", "blue", 5, true), c("c2", "blue", 5), c("c3", "white", 2)],
  outputs: [out(5, "No color"), out(50, "No color"), out(2, "white")],
  caption: {
    cpp: "`c1 = c2` calls the assignment operator: `c2`'s members are copied into the already-existing `c1`, so c1 becomes `{blue, 5}`.",
    asm: "`lea rdi, [c1]` is `this` (destination); `lea rsi, [c2]` is the source argument; `call circle::operator=` does the copy.",
    intuition: "`operator=` is a **member function** like any other — no hidden return slot because it returns `*this`, a reference, not a new object."
  }
}];

// Curated x86-64 (Intel syntax, names demangled). Prologue/epilogue and
// set_radius calls are shown as elision rows. asm line numbers below are
// 1-based positions in this string, counting every line.
const asm = `main:
… prologue elided
  lea  rdi, [c1]
  call circle::circle
  lea  rdi, [c2]
  call circle::circle
… c1.set_radius, c2.set_radius elided
  lea  rdi, [c1]
  call circle::set_color
  lea  rdi, [c2]
  call circle::set_color
  lea  rdi, [c3]
  call circle::circle
  lea  rdi, [c3]
  lea  rsi, [c1]
  lea  rdx, [c2]
  call circle::operator-
… lea rdi/rsi/rdx setup for operator*
  call circle::operator*
… lea rdi/rsi/rdx setup for operator/
  call circle::operator/
  lea  rdi, [c1]
  lea  rsi, [c2]
  call circle::operator=
… epilogue elided`;

// source line (in `code`) -> asm line numbers (in `asm`)
const asmMap = {
  1: [3, 4],
  // circle c1;         -> lea [c1] + call circle::circle
  2: [5, 6],
  // circle c2;         -> lea [c2] + call circle::circle
  4: [8, 9],
  // c1.set_color(...)  -> lea [c1] + call circle::set_color
  6: [10, 11],
  // c2.set_color(...)  -> lea [c2] + call circle::set_color
  7: [12, 13],
  // circle c3;         -> lea [c3] + call circle::circle
  9: [14, 15, 16, 17],
  // c3 = c1 - c2     -> hidden slot + this + arg + call operator-
  10: [19],
  // c3 = c1 * c2       -> call circle::operator*
  11: [21],
  // c3 = c1 / c2       -> call circle::operator/
  12: [22, 23, 24] // c1 = c2            -> lea [c1] + lea [c2] + call operator=
};
const asmLabel = "x86-64 · Intel (idealized)";
export default scene({
  title: "L03 — operator overloading on circle objects",
  code,
  steps,
  asm,
  asmMap,
  asmLabel
});