/* AUTO-GENERATED from trace-l01.jsx by `npm run build:artifacts` — do not edit. */
import { scene, glob, text, spotlight } from "@course";

/* Traces code/lectures/L01 (main.cpp + mylib.h): namespaces, macros, I/O.
   Real run of the program prints: 20 / 30 / 100 / Hello, World! / 5 */

const code = `// mylib.h
namespace students {
    int age = 20;
    int add() {
        return 100;
    }
}
namespace teachers {
    int age = 30;
    int add() {
        return 200;
    }
}

// main.cpp
#define MESSAGE "Hello, World!"
#define ABS(x) ((x) < 0 ? -(x) : (x))
using namespace students;
using namespace std;
int main() {
    cout << age << endl;
    cout << teachers::age << endl;
    cout << add() << endl;
    cout << MESSAGE << endl;
    cout << ABS(-5) << endl;
}`;

// namespace-scope variables live in Global/Static; functions live in Code.
const base = [glob("students::age", "int", 20, {
  id: "sage"
}), glob("teachers::age", "int", 30, {
  id: "tage"
}), text("students::add()", "int()", "return 100", {
  id: "sadd"
}), text("teachers::add()", "int()", "return 200", {
  id: "tadd"
})];
const hl = spotlight(base);
const O = [{
  expr: "cout << age",
  result: "20"
}, {
  expr: "cout << teachers::age",
  result: "30"
}, {
  expr: "cout << add()",
  result: "100"
}, {
  expr: "cout << MESSAGE",
  result: "Hello, World!"
}, {
  expr: "cout << ABS(-5)",
  result: "5"
}];
const steps = [{
  line: 18,
  cells: hl(null),
  caption: {
    cpp: "Before `main` runs, both namespaces are laid out in static storage (G/S) and their functions in the Code segment.",
    intuition: "`using namespace students;` brings students' names into scope — nothing has printed yet."
  }
}, {
  line: 21,
  cells: hl("sage"),
  outputs: O.slice(0, 1),
  caption: {
    cpp: "`using namespace students;` makes the unqualified name `age` resolve to `students::age` (20).",
    intuition: "Namespace-scope variables live in **Global/Static** storage."
  }
}, {
  line: 22,
  cells: hl("tage"),
  outputs: O.slice(0, 2),
  caption: {
    cpp: "`teachers::age` is fully qualified with the `::` scope operator, so it reads the teachers version (30).",
    intuition: "An explicit qualifier always wins — **no clash** with the using-directive."
  }
}, {
  line: 23,
  cells: hl("sadd"),
  outputs: O.slice(0, 3),
  caption: {
    cpp: "`add()` is unqualified too, so it binds to `students::add()` and returns 100.",
    intuition: "Functions live in the **Code** segment, separate from namespace data."
  }
}, {
  line: [16, 24],
  cells: hl(null),
  outputs: O.slice(0, 4),
  caption: {
    cpp: "`MESSAGE` is a `#define` — the preprocessor textually substitutes `\"Hello, World!\"` before compilation.",
    intuition: "Macros are pure text replacement and have **no runtime storage**."
  }
}, {
  line: [17, 25],
  cells: hl(null),
  outputs: O.slice(0, 5),
  caption: {
    cpp: "`ABS(-5)` expands to `((-5) < 0 ? -(-5) : (-5))` = 5.",
    intuition: "Unlike a real function, a function-like macro pastes its argument in **textually** — harmless for `ABS(-5)`, but `ABS(i++)` would evaluate the argument **twice**."
  }
}];
export default scene({
  title: "L01 — namespaces, macros & I/O: what does it print?",
  code,
  steps
});