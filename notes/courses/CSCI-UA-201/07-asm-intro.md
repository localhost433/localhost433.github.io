---
title: Introduction to Assembly Language
date: 2025-10-23
---

## CPU registers

Registers are small, very fast storage locations inside the CPU. All arithmetic and control operations in assembly use registers explicitly.

Important 64-bit general-purpose registers on x86-64:

- `RAX`: accumulator and return value register.
- `RBX`: general purpose.
- `RCX`: general purpose, often used as a loop counter.
- `RDX`: general purpose, often used in multiplication and division.
- `RSI`: source index in memory operations.
- `RDI`: destination index in memory operations.
- `RSP`: stack pointer (points to the top of the stack).
- `RBP`: base pointer (used for stack frames).
- `RIP`: instruction pointer (address of the next instruction).

We mainly use `RAX`, `RBX`, `RCX`, and `RDX` for simple arithmetic examples.

## AT&T syntax basics

We use the AT&T syntax used by `gcc` on Linux and macOS.

Key rules:

1. `$` before a number means an immediate (literal) value.

   ```asm
   mov $42, %rax     # put the number 42 into RAX
   ```

2. `%` before a name means a register.

   ```asm
   mov %rbx, %rax    # copy RBX into RAX
   ```

3. Instruction operands are written as `source, destination`.

   ```asm
   mov $10, %rax     # RAX = 10
   add %rbx, %rax    # RAX = RAX + RBX
   ```

Read `mov S, D` as "move S into D".

## Core instructions

### MOV (copy data, brief)

```asm
mov SOURCE, DEST
```

- Copies data from `SOURCE` into `DEST` (the source is not changed).
- Operand order is `source, destination` in AT&T syntax.

Common pitfall (immediate vs address):

```asm
mov 25, %rax    # WRONG: uses address 25
mov $25, %rax   # RIGHT: literal 25
```

For the full set of `mov` forms (memory dereference, offsets, base/index/scale) and array/struct addressing, see **08**.

### ADD and SUB

```asm
add SOURCE, DEST   # DEST = DEST + SOURCE
sub SOURCE, DEST   # DEST = DEST - SOURCE
```

Examples:

```asm
mov $10, %rax
add $5, %rax       # RAX becomes 15

mov $20, %rax
sub $8, %rax       # RAX becomes 12
```

Order matters for `sub`: `sub $8, %rax` computes `RAX - 8`, not `8 - RAX`.

### INC and DEC

```asm
inc %rax    # RAX = RAX + 1
dec %rax    # RAX = RAX - 1
```

These are shorthand for adding or subtracting 1 and can be used in loops.

### IMUL (integer multiplication)

```asm
imul SOURCE, DEST  # DEST = DEST * SOURCE
```

Example:

```asm
mov $4, %rax
imul $3, %rax      # RAX becomes 12
```

### CMP and conditional jumps

`cmp SOURCE, DEST` conceptually computes `DEST - SOURCE` and sets condition flags, but does not store the result. Jumps then inspect the flags.

Common conditional jumps:

- `je LABEL`: jump if equal.
- `jne LABEL`: jump if not equal.
- `jg LABEL`: jump if greater than.
- `jl LABEL`: jump if less than.
- `jge LABEL`: jump if greater or equal.
- `jle LABEL`: jump if less or equal.
- `jmp LABEL`: unconditional jump.

Example pattern:

```asm
mov $10, %rax
cmp $5, %rax      # compare RAX with 5
jg bigger         # if RAX > 5, jump to bigger

mov $0, %rax      # executed when RAX <= 5
jmp end

bigger:
    mov $1, %rax  # executed when RAX > 5

end:
    # function continues
```

## Program skeleton

Every simple assembly program we write mirrors a C function and uses a standard prologue and epilogue:

```asm
.global main
main:
    # prologue
    push %rbp
    mov %rsp, %rbp

    # body: your instructions go here

    # epilogue
    pop %rbp
    ret
```

- `push %rbp` and `mov %rsp, %rbp` set up a new stack frame.
- `pop %rbp` and `ret` restore the caller's frame and return.

For now, treat this as boilerplate and focus on the instructions in the body.
