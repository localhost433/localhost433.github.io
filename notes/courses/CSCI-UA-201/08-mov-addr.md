---
title: Move Instructions and Addressing Modes
date: 2025-10-28/30
---

## Move instructions and data movement

The `mov` instruction copies data; it does not destroy the source.

```asm
mov %rax, %rbx    # RBX gets a copy of RAX; RAX is unchanged
```

### Common `mov` forms

1. **Immediate to register**

   ```asm
   mov $5, %rax      # RAX = 5
   ```

2. **Register to register**

   ```asm
   mov %rbx, %rax    # RAX = RBX
   ```

3. **Absolute memory address**

   ```asm
   mov 10, %rax      # RAX = value stored at address 10
   ```

4. **Pointer dereference**

   ```asm
   mov (%rcx), %rax  # RAX = value at address held in RCX
   ```

5. **Pointer with offset**

   ```asm
   mov 8(%rcx), %rax # RAX = value at address RCX + 8
   ```

Parentheses mean "treat the register contents as an address".

## Addressing modes and arrays

### Indexed addressing

Used to access elements of arrays:

```asm
mov (%rsi, %rcx, 4), %rax
```

- Base: `%rsi` holds the array base address.
- Index: `%rcx` holds the element index.
- Scale: `4` is the size of each element in bytes (for `int`).

This loads `array[index]` into `%rax`.

### Offset + base + index * scale

Full form:

```asm
mov 12(%rsi, %rcx, 4), %rax
```

This accesses the address

$$
12 + \text{base} + \text{index} \times 4.
$$

A common use is accessing arrays that are fields inside a `struct`.

Example `struct`:

```c
struct student {
    int id;        // offset 0
    int age;       // offset 4
    int ssn;       // offset 8
    int grades[5]; // offset 12
};
```

Given a pointer to `struct student` in `%rsi` and index `i` in `%rcx`, `grades[i]` is at

- base pointer `%rsi`,
- plus 12 bytes (offset of `grades`),
- plus `i * 4` (size of each `int`),

which matches `mov 12(%rsi, %rcx, 4), %rax`.
For calling conventions (arg registers, caller/callee-saved, stack frames, prologue/epilogue), see **[09 - Function Conventions and Cache Basics](https://robinc.vercel.app/note.html?course=CSCI-UA-201&note=09-func-cache)**.
