---
title: Function Conventions and Cache Basics
date:
---

## Assembly function conventions

Assembly functions must follow precise rules so that callers and callees cooperate correctly.

### Argument passing

Integer and pointer arguments are passed in this order:

1. `RDI`
2. `RSI`
3. `RDX`
4. `RCX`
5. `R8`
6. `R9`

Any arguments beyond six are pushed on the stack from right to left before the call.

Example for `g(10, 20, 30, 40, 50, 60, 70, 80)`:

```asm
mov $10, %rdi   # arg1
mov $20, %rsi   # arg2
mov $30, %rdx   # arg3
mov $40, %rcx   # arg4
mov $50, %r8    # arg5
mov $60, %r9    # arg6
push $80        # arg8
push $70        # arg7
call g
```

The callee expects the first six arguments in registers and the rest on the stack.

The return value must be placed in `RAX` before `ret`.

### Register saving conventions

- Caller-saved registers:
  - `RAX`, `RCX`, `RDX`, `RSI`, `RDI`, `R8`, `R9`, `R10`, `R11`.
  - The callee may overwrite these.
  - The caller must save them (for example with `push`) if it needs them after the call.

- Callee-saved registers:
  - `RBX`, `RBP`, `RSP`, `R12`, `R13`, `R14`, `R15`.
  - If the callee uses these for its own purposes, it must restore them before returning.

Example of callee saving `RBX`:

```asm
some_function:
    push %rbp
    mov %rsp, %rbp

    push %rbx            # save caller's RBX
    mov $42, %rbx        # use RBX
    # ...
    mov %rbx, %rax       # place result in RAX

    pop %rbx             # restore RBX
    pop %rbp
    ret
```

### Stack frame management

Standard prologue:

```asm
push %rbp
mov %rsp, %rbp
```

- Saves the caller's base pointer.
- Establishes a new base pointer for the current function.

Standard epilogue:

```asm
pop %rbp
ret
```

- Restores the caller's base pointer.
- Returns control to the caller.

Local variables and spilled registers are typically stored at negative offsets from `RBP`.

## Cache memory fundamentals

Main memory (RAM) is much slower than the CPU. Cache memory is a small, fast buffer that keeps recently used data close to the processor.

### Motivation and timing

Rough access times:

- CPU cycle: about 0.5 nanoseconds.
- L1 cache: a few cycles.
- L2 cache: tens of cycles.
- RAM: hundreds of cycles.
- Disk: milliseconds.

Without caches, the CPU would spend most of its time waiting for data.

### Locality of reference

Cache performance relies on program behavior.

- **Temporal locality**: if a location is accessed now, it is likely to be accessed again soon.
  - Examples: loop counters, top of the stack.
- **Spatial locality**: if a location is accessed, nearby locations are likely to be accessed soon.
  - Examples: iterating through arrays, sequential instruction fetch.

Example:

```c
int sum = 0;
for (int i = 0; i < 100; i++) {
    sum += array[i];
}
```

- `i` and `sum` show temporal locality.
- `array[i]` shows spatial locality.

### Hits and misses

- A **cache hit** occurs when the requested data is found in the cache.
- A **cache miss** occurs otherwise, and the data must be fetched from a slower level.

If there are `N` accesses and `M` misses:

- Hit rate = `(N - M) / N`.
- Miss rate = `M / N`.

### Types of cache misses

Three classic categories (3Cs):

1. **Compulsory miss**:
   - First time a block is accessed.
   - Cannot be avoided on cold start.

2. **Capacity miss**:
   - The working set does not fit in the cache.
   - Increasing cache size can help.

3. **Conflict miss**:
   - Caused by limited associativity and mapping.
   - Multiple blocks contend for the same cache location even if there is free space elsewhere.
   - Higher associativity can reduce these.

Later recitations go deeper into cache organization, addressing, and policies.
