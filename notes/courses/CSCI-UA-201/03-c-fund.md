---
title: C Programming Fundamentals
date:
---

## From source code to execution

A C program goes through several stages.

### Phase 1: Writing source code

- Human-readable C code lives in $\text{.c}$ files.
- It specifies variables, control flow, and function calls.

### Phase 2: Compilation

This usually has two substeps.

1. **Compilation to assembly**

   - The compiler (such as gcc) translates C source code to assembly language (often $\text{.s}$ files).
   - Assembly is a human-readable form of machine instructions.

2. **Assembly to machine code**

   - The assembler translates assembly into machine code for a specific architecture.
   - The result is an executable binary (for example $a.out$ or an $\text{.exe}$).

Example gcc usage:

```bash
gcc hello.c -o hello   # compile C source to an executable named hello
./hello                # run on Linux or macOS
hello.exe              # run on Windows
```

### Phase 3: Execution

- The operating system loads the executable into memory.
- The CPU fetches and executes instructions sequentially, following control flow.

## Machine dependence

### Native code vs virtual machine

- C and C++ are **machine dependent**:
  - The compiler generates machine code for a specific instruction set (for example x86-64 or ARM).
  - Executables for one architecture generally do not run on another.

- Languages like Java and Python are **machine independent** at the source or bytecode level:
  - The compiler or interpreter targets a virtual machine.
  - The same bytecode or script can run on many platforms as long as there is a compatible runtime.

### Tradeoffs

- C and C++:
  - Typically faster and closer to the hardware.
  - Good for operating systems, embedded software, and performance-critical inner loops.
- Java and Python:
  - Often easier to deploy across platforms.
  - Good for rapid development and high-level applications.

In practice: "write once, recompile everywhere" for C, versus "write once, run anywhere" for virtual-machine based languages.

## Core data types in C

Types tell the compiler:

1. How many bytes of memory to allocate.
2. How to interpret the bits stored in that memory.

### Integer types

Typical sizes on a modern 64-bit system (actual sizes are implementation dependent):

- `char`: 1 byte.
- `short`: 2 bytes.
- `int`: 4 bytes.
- `long`: often 8 bytes.
- `long long`: at least 8 bytes.

Each can be `signed` or `unsigned`.

Example with `char`:

- `unsigned char` can represent integers from $0$ to $255$.
- `signed char` can represent integers from $-128$ to $127$.

By default, integer types are signed unless explicitly declared `unsigned`.

### Floating point types

- `float`: 4 bytes, about 7 decimal digits of precision.
- `double`: 8 bytes, about 15 decimal digits of precision (default choice).
- `long double`: often 16 bytes, for higher precision.

These implement IEEE 754 formats on most systems.

## Input and output with format specifiers

### printf and interpretation of bits

A variable is a region of memory holding a bit pattern. `printf` format specifiers tell C how to interpret and display that pattern.

Common specifiers:

- `%d`: signed integer (`int`, `short`, or `char` when promoted).
- `%c`: character.
- `%ld`: `long`.
- `%lld`: `long long`.
- `%f`: `float` (promoted to `double` when passed).
- `%lf`: `double`.
- `%Lf`: `long double`.

Example:

```c
char x = 65;          // bits: 01000001
printf("%d\n", x);   // prints 65
printf("%c\n", x);   // prints A
```

The underlying bits are the same; only the interpretation changes.

### scanf and the address-of operator

`scanf` reads text from standard input, parses it according to format specifiers, and writes into variables.

Example:

```c
int number;
scanf("%d", &number);
```

- `&number` is the address of `number`.
- `scanf` needs a pointer so it knows where to store the parsed result.

If you forget the `&` for non-array variables, the program passes the value instead of the address, which leads to undefined behavior.

## Summary

- C source code goes through compilation and assembly to become an executable.
- Machine dependence means you must compile separately for each target architecture.
- Data types determine memory size and interpretation.
- Format specifiers let `printf` and `scanf` treat the same bits as numbers, characters, or floating point values, depending on intent.
