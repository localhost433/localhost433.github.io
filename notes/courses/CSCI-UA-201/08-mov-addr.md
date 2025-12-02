---
title: Move Instructions, Addressing, and Calling Conventions
date:
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

## Calling conventions

### Caller-saved and callee-saved registers

Registers are grouped according to who must preserve them across function calls.

- Caller-saved registers (scratch):
  - `RAX`, `RCX`, `RDX`, `RDI`, `RSI`, `R8`, `R9`, `R10`, `R11`.
  - A callee is allowed to overwrite these.
  - If the caller needs their values later, the caller must save and restore them.

- Callee-saved registers (preserved):
  - `RBX`, `RBP`, `R12`, `R13`, `R14`, `R15`.
  - If a function uses any of these, it must save the old value (usually with `push`) and restore it before returning.

### Function parameters and return values

For integer and pointer parameters, the System V x86-64 convention passes the first six arguments in registers:

1. `RDI`
2. `RSI`
3. `RDX`
4. `RCX`
5. `R8`
6. `R9`

Additional arguments are pushed on the stack by the caller from right to left.

The return value is placed in `RAX`.

Example call:

```asm
mov $10, %rdi   # arg1
mov $20, %rsi   # arg2
mov $30, %rdx   # arg3
mov $40, %rcx   # arg4
mov $50, %r8    # arg5
mov $60, %r9    # arg6
push $80        # arg8 (pushed first)
push $70        # arg7 (pushed second)
call g
```

Inside `g`, the parameters appear in the same registers and the extra ones are on the stack.

### Function prologue and epilogue

Standard function layout:

```asm
.globl f
f:
    # prologue
    push %rbp
    mov %rsp, %rbp

    # optionally save callee-saved registers, for example:
    # push %rbx

    # body

    # restore callee-saved registers if saved:
    # pop %rbx

    # epilogue
    pop %rbp
    ret
```

- The prologue creates a new stack frame with `RBP` as a stable base pointer.
- The epilogue restores the old base pointer and returns to the caller.

### Simple example

C code:

```c
int add_5(int a) {
    return a + 5;
}
```

Assembly:

```asm
.globl add_5
add_5:
    push %rbp
    mov %rsp, %rbp

    mov $5, %rax      # RAX = 5
    add %rdi, %rax    # RAX = a + 5 (a is in RDI)

    pop %rbp
    ret               # result is in RAX
```

This respects the register and calling conventions and computes the sum correctly.
