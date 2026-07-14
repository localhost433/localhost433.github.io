---
title: C++ Foundations
date: "2026-05-18"
---

## C++ basics

- C++ is much less insistent on OOP: you can write whole programs without ever defining a class.
- C++ is an extension of C. It allows global variables, and `main` is a non-class function (unlike Java, `main` cannot live inside a class).
- You always write at least one function outside a class.
- Naming convention: usually lowercase, separated by underscores.

## Program structure and compilation

- **Implementation files** -- end in `.cc` or `.cpp`.
- **Header files** -- end in `.h`, and contain declarations of classes, methods, functions, globals, and constants.

Compilation and static linking proceed in stages:

1. The preprocessor combines implementation and header files.
2. The result is compiled into assembly (`.s`).
3. The assembler turns that into an unlinked `.o` object file.
4. The `.o` is linked with other precompiled libraries.
5. An executable binary results, named `a.out` by default.

```sh
g++ main.cpp   # produces a.out
./a.out        # run it
```

The same stages end to end, from source through preprocess, compile, assemble, and link to a runnable binary:

```artifact src=demos/compile-pipeline.jsx static
```

> Gotcha: C++ does not check that a value-returning function actually returns one. Falling off the end of a non-`void`, non-`main` function is undefined behavior, and you get whatever happens to be in the return register. `main` is the special case: the standard defines reaching its closing brace as `return 0;`, so `int main()` with no `return` is well-defined and exits with status `0`.

> Reality vs. slide: the slide phrases this as "C++ will happily leave whatever happens to be in `EAX` as the return code," implying `main` too leaks the register (`EAX` is the x86 return register). That is what a non-`main` value-returning function does; the caller reads whatever garbage is left in the return register. `main` is genuinely special. Falling off its end is defined to return `0`, so its exit status is `0`, not leftover register contents.

## The preprocessor

```cpp
#include <iostream>          // library header: angle brackets
#include "mylib.h"           // your own header: quotes
#define MESSAGE "Hello, World!"
#define ABS(x) ((x) < 0 ? -(x) : (x))   // function-like macro
```

- `#define` performs plain text substitution, for constants and for function-like macros.
- `#ifdef` / `#undef` / `#endif` conditionally compile sections of code.

> Gotcha from the real L01 code: the sample writes `#ifdef ABS(X)` / `#undef ABS(X)`. `#ifdef` takes a bare identifier, so it matches `ABS`, and the `#undef` then removes the macro. The later `ABS(-5)` then fails to compile (`use of undeclared identifier 'ABS'`). It should just be `#ifdef ABS`.

## Namespaces

A namespace groups names so they don't collide. It can span multiple files (the compiler joins the parts), and is entered with the scope-resolution operator `::`.

```cpp
namespace students {
    int age = 20;
    int add() { return 100; }
}
namespace teachers {
    int age = 30;
    int add() { return 200; }
}

students::age;          // 20
teachers::age;          // 30
using namespace students;   // now `age` means students::age
```

`using namespace std;` is why you can write `cout` instead of `std::cout`; the `string` class is `std::string`, and so on.

The in-class program (`code/lectures/L01`) uses two namespaces, a couple of macros, and five `cout`s. Step through what the compiled program prints and why:

```artifact src=demos/trace-l01.jsx
```

## Input and output

`#include <iostream>` gives you the streams `cin` (standard input) and `cout` (standard output).

- **Insertion** `<<` -- moves data from a variable to the output stream.
- **Extraction** `>>` -- moves data from the input stream to a variable.

```cpp
int x;
std::cout << "Hello, World!" << std::endl;
std::cin  >> x;
std::cout << "You entered: " << x << std::endl;
```

`'\n'` vs `endl`: `cout << endl` inserts a newline and flushes the stream, while `cout << "\n"` only inserts a newline. So `cout << endl;` <-> `cout << '\n' << flush;`.

## Data types

| Category | Types | Notes |
|---|---|---|
| Whole numbers | `char`, `short`, `int`, `long`, `long long` | `short`/`long` are modifiers, not separate types (`short x` is `short int`) |
| Decimals | `float`, `double`, `long double` | ~7, ~15, ~18 significant digits |
| Boolean | `bool` | `0` is false, everything else is true |
| No value | `void` | |
| Wide chars | `wchar_t` | for Unicode |

Typical sizes (use `sizeof(x)` to check on your machine):

| Type | Size | Signed range |
|---|---|---|
| `char` | 1 byte | $-128 \dots 127$ |
| `short` | 2 bytes | $-32{,}768 \dots 32{,}767$ |
| `int` | 4 bytes | $-2{,}147{,}483{,}648 \dots 2{,}147{,}483{,}647$ |
| `long long` | 8 bytes | $\approx -9.2 \times 10^{18} \dots 9.2 \times 10^{18}$ |

Those are the sizes you will typically see, but the C++ standard only guarantees a minimum width for each integer type, and the exact width is chosen by the platform and compiler. This matters for how code actually runs: the same source can wrap around at a different value on a different target.

| Type | Standard minimum | Typical (64-bit) |
|---|---|---|
| `short` | 16 bits | 16 bits |
| `int` | 16 bits | 32 bits |
| `long` | 32 bits | 32 or 64 bits |
| `long long` | 64 bits | 64 bits |

> Gotcha: `long` is the treacherous one. It is 32 bits on some platforms (e.g. 64-bit Windows) and 64 bits on others (e.g. 64-bit Linux/macOS), even though both satisfy the standard's 32-bit minimum. Never assume `long` and `long long` are the same size, and use `sizeof(x)` to confirm on your machine.

- A `char` is just a 1-byte integer (used where Java uses `byte`).
- Integers are signed by default; `unsigned int` covers `0 ... 4,294,967,295`.

When you bundle these types into an object, the compiler aligns each field to its own size and pads the gaps, so the total `sizeof`, and even the order of the fields, matters. Same fields, different order:

```artifact src=demos/size-layout.jsx static
```

### A classic C++ gotcha

What Java catches at compile time can become a silent logic bug in C++:

```cpp
if (variable = 1)   // assignment, evaluates to 1 -> ALWAYS true
if (1 == variable)  // "Yoda" style avoids the mistake
if (3 < a < 8)      // ALWAYS true: parses as (3 < a) < 8
```

An assignment expression evaluates to the value it assigned, and the `if` tests that value directly:

```cpp
if (a = b)   // true unless b is 0 (the condition is the value of b)
if (c = 0)   // ALWAYS false: assigns 0, then tests 0
if (a = 9)   // ALWAYS true: assigns 9, then tests 9 (non-zero)
```

## Strings

C++ has two kinds of strings.

### C-strings

- An array of characters terminated by the null character `'\0'` (ASCII 0). You must leave room for it.
- `char name[10] = "HELLO";` stores `H E L L O \0`.
- Prone to buffer overflow, since everything is read until the null byte.
- Only array operations work: `=` works only at declaration (not for copying), and `==`, `<`, `>` do not compare contents.
- Read a whole line into a C-string with `inStream.getline(aCString, numOfCharsToRead)`. This is the C-string form, distinct from `std::getline` for the `string` class, covered below.
- `<cstring>`: `strncpy` (copy), `strncat` (concatenate), `strncmp` (compare), `strlen` (length), `strchr`/`strrchr`/`strstr` (search).
- `<cctype>`: `isalpha`, `isdigit`, `isalnum`, `isspace`, `isupper`, `tolower`, `toupper`, and more:
  - `isblank` -- whitespace, but not a newline.
  - `isgraph` -- has a visible glyph (can be "written").
  - `isprint` -- printable: a graphical character or a space.
  - `ispunct` -- punctuation.
  - `isxdigit` -- a hex digit (`0`-`9`, `A`-`F`).
  - `iscntrl` -- a control character.
  - `islower` -- a lowercase letter.

### The `string` class

```cpp
#include <string>
std::string s = "Hello";
```

- More flexible, easier, and no buffer-overflow problem.
- Like Java's `String`, but mutable (closer to `StringBuffer`). `=`, `==`, and `[]` all work as expected.
- Member methods: `iterators`, `length`/`size` (same thing), `clear`, `empty`, `at`, `insert`, `erase`, `replace`, `append`, `find`, `substr`, `compare`, `c_str` (returns a C-string).
- Non-member: `+`, `+=`, comparisons, `swap`, `<<`/`>>`, and `getline(inStream, str, delimiter='\n')`.

Single-character stream methods, for when `>>` and `getline` are too coarse:

| Call | What it does |
|---|---|
| `inStream.get()` | Read the next character (whitespace included) |
| `inStream.peek()` | Look at the next character without removing it from the stream |
| `outStream.put(ch)` | Write a single character |
| `inStream.putback(ch)` | Put a character back into the stream after reading it |
| `inStream.ignore(n)` | Ignore (discard) the next `n` characters |

| Feature | C-string | `string` class |
|---|---|---|
| Type | `char[]` ending in `\0` | `std::string` |
| Copy with `=` | only at declaration | yes |
| Compare with `==`/`<` | no | yes |
| Resizable / safe | no (overflow risk) | yes |
