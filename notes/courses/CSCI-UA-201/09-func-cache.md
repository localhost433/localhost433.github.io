---
title: Function Conventions and Cache Primer
date: 2025-10-30/11-06
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

A useful mental model is:

- Each **thread** has one stack **region** (a reserved range of virtual memory).
- Each active **function call** owns a contiguous slice of that region called a **stack frame**.
- Frames do not conflict because the stack is used in strict **LIFO** order.

Key registers:

- `RIP`: address of the next instruction to execute (controls code flow).
- `RSP`: stack pointer, holds the address of the current top of the stack (moves as the stack grows/shrinks).
- `RBP`: optional frame pointer, used as a stable "bookmark" inside the current frame for fixed-offset addressing.

On x86-64, the stack typically grows **downward** (toward smaller addresses). Conceptually:

- `push X`: decrement `RSP`, then store `X` at memory[`RSP`].
- `pop X`: load from memory[`RSP`] into `X`, then increment `RSP`.
- `call f`: pushes the return address (next `RIP`) onto the stack, then jumps to `f`.
- `ret`: pops the return address into `RIP` (execution resumes in the caller).

Standard prologue:

```asm
push %rbp
mov %rsp, %rbp
```

- Saves the caller's base pointer value on the stack.
- Copies the current `RSP` value into `RBP` (AT&T syntax is `mov source, destination`).

  - This does not "link" registers, it copies a 64-bit value (which happens to be an address).
  - After this, `RBP` serves as a stable reference point for the current frame.

Often, functions also reserve space for locals/spills by moving `RSP`, for example:

```asm
sub $N, %rsp
```

Standard epilogue:

```asm
pop %rbp
ret
```

- Restores the caller's base pointer (LIFO: it pops the exact value previously pushed).
- Returns control to the caller by popping the return address into `RIP`.

If the function reserved local space (for example with `sub $N, %rsp`), it must first undo that (for example with `add $N, %rsp`, or using `leave`) so that the saved `RBP` is back on top of the stack.

After a function returns, its frame is **deallocated** (because `RSP` is restored). The bytes may still physically remain in memory temporarily, but they are no longer valid to rely on and can be overwritten by later pushes/calls.

Local variables and spilled registers are typically stored at negative offsets from `RBP` (when `RBP` is used as a frame pointer). Stack-passed arguments are typically at positive offsets from `RBP`.

## Cache memory fundamentals

Main memory (RAM) is much slower than the CPU. Cache memory is a small, fast buffer that keeps recently used data close to the processor.

This section is intentionally a **primer**:

- For detailed cache organization (direct-mapped vs set-associative), replacement/write policies, and AMAT equations, see **[10 - Cache Organization and Performance](https://robinc.vercel.app/note.html?course=CSCI-UA-201&note=10-cache-perf)**.
- For the CPU instruction cycle and DRAM internals (destructive reads, refresh), see **[14 - Memory Hierarchy and CPU Architecture](https://robinc.vercel.app/note.html?course=CSCI-UA-201&note=14-mem-arch)**.

### Motivation and timing

Order-of-magnitude access times (varies by machine, but the gap matters):

- L1 cache: a few CPU cycles.
- L2 cache: more (still on-chip, but slower than L1).
- L3 cache: larger, slower (still much faster than RAM).
- RAM (DRAM): tens to ~100+ nanoseconds scale (often hundreds of cycles).
- Disk/SSD: microseconds to milliseconds (not on the normal load/store path).

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

### Memory blocks vs cache lines

- A **memory block** (often just “block”) is a fixed-size chunk of main memory of size `B` bytes.
- A **cache line** is a slot in the cache that can hold **exactly one** memory block (of size `B`) at a time, plus metadata.
- The **offset** selects a byte (or word) *within* the cached block, it does not identify *which* block.

### Cache line structure (conceptual)

Each cache line typically stores:

- **Data block**: `B` bytes copied from memory.
- **Tag**: identifies *which* memory block is currently stored in this line.
- **Valid bit**: whether the line currently contains meaningful data.

  - `valid = 0` means “treat this as empty/invalid”, so any access to it is a miss.
  - `valid = 1` means the tag compare is meaningful.

### TAG / INDEX / OFFSET (high level)

When a cache looks up an address, it conceptually uses:

- **OFFSET**: selects the byte/word within the cache line’s data block.
- **INDEX**: selects which line (direct-mapped) or which set (set-associative) to check.
- **TAG**: identifies which memory block is currently stored there.

The detailed “how many bits go where,” plus mapping/associativity and the full lookup procedure, is in **10**.

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
   - Multiple different memory blocks map to the same INDEX, so they contend for the same cache line even if there is free space elsewhere.
   - Higher associativity can reduce these.
