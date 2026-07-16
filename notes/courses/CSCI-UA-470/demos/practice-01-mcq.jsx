import { mcq } from "@course";

/* note 01 practice — the C++ foundations gotchas that read as exam traps: the two
   condition mistakes Java would reject, main's special fall-off rule, the
   platform-dependent width of `long`, and the C-string vs string-class split. */

export default mcq({
  questions: [
    {
      stem: "What does this `if` condition evaluate to?",
      figure: { code: "int a = 5, b = 3;\nif (a = b) { /* ... */ }", lang: "cpp" },
      choices: [
        { text: "True — `a = b` assigns `3` to `a`, and the `if` tests that value (`3`, non-zero)", correct: true },
        { text: "False — `a` (5) does not equal `b` (3)" },
        { text: "A compile error — you cannot assign inside a condition" },
        { text: "True — but only because 5 ≠ 3" },
      ],
      why: "`=` is **assignment**, not comparison. `a = b` stores `3` in `a` and the whole expression **evaluates to the assigned value**, `3`, which is non-zero → true. It is true for any non-zero `b`; `if (c = 0)` would always be false. Java rejects this (a condition must be `boolean`); C++ silently accepts it — the classic source of the bug. Writing `if (b == a)` compares.",
    },
    {
      stem: "For `int a = 20`, what does `if (3 < a < 8)` do?",
      figure: { code: "int a = 20;\nif (3 < a < 8) { /* ... */ }", lang: "cpp" },
      choices: [
        { text: "Always true — it parses as `(3 < a) < 8`, i.e. `1 < 8`", correct: true },
        { text: "False — 20 is not between 3 and 8" },
        { text: "True only when `a` is between 3 and 8" },
        { text: "A compile error — chained comparison is illegal" },
      ],
      why: "`<` is left-associative, so `3 < a < 8` is `(3 < a) < 8`. `3 < a` is `true` → `1`, then `1 < 8` is **always true**, regardless of `a`. There is no chained-comparison operator in C++; you must write `3 < a && a < 8`.",
    },
    {
      stem: "A non-`void` function reaches its closing brace without a `return`. What happens — and is `main` different?",
      choices: [
        { text: "Any other function: undefined behavior (garbage from the return register). `main` is special: falling off it is defined as `return 0`", correct: true },
        { text: "Both cases are undefined behavior, including `main`" },
        { text: "Both are defined to return 0" },
        { text: "It is a compile error in every case" },
      ],
      why: "Falling off the end of a value-returning function is **undefined behavior** — the caller reads whatever is left in the return register. `main` is the one exception the standard carves out: reaching its closing brace is defined as `return 0;`, so `int main()` with no `return` exits with status `0`. (The slide's 'leaves whatever is in EAX' describes the *non-*`main` case.)",
    },
    {
      stem: "You need an integer type guaranteed to be the same size on 64-bit Windows and 64-bit Linux. Is `long` safe?",
      choices: [
        { text: "No — `long` is 32-bit on 64-bit Windows but 64-bit on 64-bit Linux; use `long long` (min 64 bits) or check `sizeof`", correct: true },
        { text: "Yes — `long` is always 8 bytes on any 64-bit platform; the standard ties its width to the machine word size" },
        { text: "Yes — the standard fixes `long` at exactly 32 bits everywhere, so it is identical on both; only `int` varies" },
        { text: "No — but only because `long` is always smaller than `int`" },
      ],
      why: "The standard only fixes **minimums** (`long` ≥ 32 bits, `long long` ≥ 64 bits); the exact width is the platform's choice. `long` is the treacherous one — 32 bits on 64-bit Windows, 64 bits on 64-bit Linux/macOS. Never assume `long` and `long long` match; confirm with `sizeof(x)`.",
    },
    {
      stem: "`a` and `b` below are **C-strings** (`char[]`). Which statement is true?",
      figure: { code: "char a[10] = \"HELLO\";\nchar b[10];\nb = a;          // (1)\nif (a == b) {}  // (2)", lang: "cpp" },
      choices: [
        { text: "Both are wrong: `=` copies a C-string only at declaration (1 fails), and `==` compares addresses, not contents (2)", correct: true },
        { text: "Both work: `=` copies the characters up to the `'\\0'` (1), and `==` compares them character by character (2)" },
        { text: "(1) works — arrays assign like any other variable — but `==` compares addresses, not contents (2)" },
        { text: "(2) compares the contents correctly, but (1) is a compile error because the array sizes could differ" },
      ],
      why: "A C-string is a bare `char[]` ending in `'\\0'`. Assignment with `=` works **only at declaration** — line (1) is an error (arrays are not assignable). `==` compares the array **addresses**, not the characters. To copy use `strncpy`, to compare use `strncmp`. The `std::string` class, by contrast, makes `=` and `==` work as expected.",
    },
    {
      stem: "What is the difference between `cout << endl;` and `cout << '\\n';`?",
      choices: [
        { text: "`endl` inserts a newline **and flushes** the stream; `'\\n'` only inserts the newline", correct: true },
        { text: "They are identical in every respect" },
        { text: "`'\\n'` flushes; `endl` does not" },
        { text: "`endl` prints two characters; `'\\n'` prints one" },
      ],
      why: "`cout << endl` is equivalent to `cout << '\\n' << flush` — it writes a newline **and flushes** the buffer. `cout << '\\n'` writes the newline only, leaving the buffer to flush later. Overusing `endl` in a loop forces a flush every iteration, which can be needlessly slow.",
    },
  ],
});
