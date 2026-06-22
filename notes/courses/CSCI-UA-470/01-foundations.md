---
title: C++ Foundations
date: "2026-05-18"
---

## C++ at a glance

- C++ is **much less insistent on OOP** -- you can write whole programs without ever defining a class.
- C++ is an **extension of C**: it allows global variables, and `main` is a non-class function (unlike Java, `main` cannot live inside a class).
- You always write at least one function *outside* a class.
- Naming convention: usually lowercase, separated by underscores.

## Program structure and compilation

- **Implementation files** end in `.cc` or `.cpp`; **header files** end in `.h`.
- Header files contain *declarations* of classes, methods, functions, globals, and constants.
- Compilation and static linking proceed in stages:
  1. The **preprocessor** combines implementation and header files.
  2. The result is compiled into an unlinked **`.o`** object file.
  3. The `.o` is **linked** with other precompiled libraries.
  4. An executable binary results -- named **`a.out`** by default.

```sh
g++ main.cpp   # produces a.out
./a.out        # run it
```

Those stages, end to end -- source through preprocess, compile, and link to a runnable binary:

```artifact src=demos/compile-pipeline.jsx static
```

> **Gotcha:** C++ does not check that you actually returned a value. `int main()` compiles even with no `return`, leaving whatever happens to be in the `EAX` register as the exit code.

## The preprocessor

```cpp
#include <iostream>          // library header: angle brackets
#include "mylib.h"           // your own header: quotes
#define MESSAGE "Hello, World!"
#define ABS(x) ((x) < 0 ? -(x) : (x))   // function-like macro
```

- `#define` performs plain text substitution -- for constants and function-like macros.
- `#ifdef` / `#undef` / `#endif` conditionally compile sections of code.

> **Gotcha from the real L01 code:** the sample writes `#ifdef ABS(X)` / `#undef ABS(X)`. `#ifdef` takes a *bare identifier*, so it matches `ABS` and the `#undef` then removes the macro -- making the later `ABS(-5)` fail to compile (`use of undeclared identifier 'ABS'`). It should just be `#ifdef ABS`.

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

`using namespace std;` is exactly why you can write `cout` instead of `std::cout` (the `string` class is `std::string`, etc.).

The in-class program (`code/lectures/L01`) ties this together -- two namespaces, a couple of macros, and five `cout`s. Step through exactly what the compiled program prints and why:

```artifact src=demos/trace-l01.jsx
```

## Input and output

- `#include <iostream>` gives you the streams `cin` (standard input) and `cout` (standard output).
- **Insertion** `<<`: from a variable *to* the output stream. **Extraction** `>>`: from the input stream *to* a variable.

```cpp
int x;
std::cout << "Hello, World!" << std::endl;
std::cin  >> x;
std::cout << "You entered: " << x << std::endl;
```

- `'\n'` vs `endl`: `cout << endl` inserts a newline **and flushes** the stream; `cout << "\n"` only inserts a newline. So `cout << endl;` <-> `cout << '\n' << flush;`.

## Data types

| Category | Types | Notes |
|---|---|---|
| Whole numbers | `char`, `short`, `int`, `long`, `long long` | `short`/`long` are **modifiers**, not separate types (`short x` is `short int`) |
| Decimals | `float`, `double`, `long double` | ~7, ~15, ~18 significant digits |
| Boolean | `bool` | `0` is false, **everything else** is true |
| No value | `void` | |
| Wide chars | `wchar_t` | for Unicode |

Typical sizes (use `sizeof(x)` to check on your machine):

| Type | Size | Signed range |
|---|---|---|
| `char` | 1 byte | $-128 \dots 127$ |
| `short` | 2 bytes | $-32{,}768 \dots 32{,}767$ |
| `int` | 4 bytes | $-2{,}147{,}483{,}648 \dots 2{,}147{,}483{,}647$ |
| `long long` | 8 bytes | $\approx -9.2 \times 10^{18} \dots 9.2 \times 10^{18}$ |

- A `char` is just a 1-byte integer (used where Java uses `byte`).
- Integers are **signed** by default; `unsigned int` covers `0 ... 4,294,967,295`.

When you bundle these types into an object, the compiler **aligns** each field to its own size and pads the gaps -- so the total `sizeof` (and even the field *order*) matters. Same fields, different order:

```artifact src=demos/size-layout.jsx static
```

### A classic C++ gotcha

What Java catches at compile time can become a silent logic bug in C++:

```cpp
if (variable = 1)   // assignment, evaluates to 1 -> ALWAYS true
if (1 == variable)  // "Yoda" style avoids the mistake
if (3 < a < 8)      // ALWAYS true: parses as (3 < a) < 8
```

## Strings

C++ has **two** kinds of strings.

### C-strings

- An array of characters terminated by the null character `'\0'` (ASCII 0). You must leave room for it.
- `char name[10] = "HELLO";` stores `H E L L O \0`.
- Prone to **buffer overflow** -- everything is read until the null byte.
- Only array operations work: `=` works *only* at declaration (not for copying), and `==`, `<`, `>` do **not** compare contents.
- `<cstring>`: `strncpy` (copy), `strncat` (concatenate), `strncmp` (compare), `strlen` (length), `strchr`/`strstr` (search).
- `<cctype>`: `isalpha`, `isdigit`, `isalnum`, `isspace`, `isupper`, `tolower`, `toupper`, ...

### The `string` class

```cpp
#include <string>
std::string s = "Hello";
```

- More flexible, easier, and no buffer-overflow problem.
- Like Java's `String` but **mutable** (closer to `StringBuffer`). `=`, `==`, and `[]` all work as expected.
- Member methods: `length`/`size` (same thing), `clear`, `empty`, `at`, `insert`, `erase`, `replace`, `append`, `find`, `substr`, `compare`, `c_str` (returns a C-string).
- Non-member: `+`, `+=`, comparisons, `swap`, `<<`/`>>`, and `getline(inStream, str, delimiter='\n')`.

| Feature | C-string | `string` class |
|---|---|---|
| Type | `char[]` ending in `\0` | `std::string` |
| Copy with `=` | only at declaration | yes |
| Compare with `==`/`<` | no | yes |
| Resizable / safe | no (overflow risk) | yes |
