---
title: Memory Hierarchy and CPU Architecture
date: 2025-10-21/11-04
---

## Overview

This recitation connects “how the CPU runs instructions” with “why memory is slow,” and how caches hide that slowness:

- CPU components: **control unit** + **datapath**, and the role of **rip** (instruction pointer).
- The **four-stage instruction cycle**: Fetch -> Decode -> Execute -> Update.
- **DRAM** organization: capacitor-based cells, destructive reads, sense amplifiers, and refresh.
- Memory hierarchy intuition (why caches exist, locality).
- For detailed cache organization, mapping, replacement/write policies, and AMAT math, see **[10 - Cache Organization and Performance](https://robinc.vercel.app/note.html?course=CSCI-UA-201&note=10-cache-perf)**.

## CPU instruction cycle

### Basic CPU architecture

At a high level:

- **Control Unit:** decides what to do (interprets instructions, sends control signals).
- **Datapath:** registers + ALU + data routing, actually moves/operates on data.

### Instruction pointer (`rip`)

`rip` (program counter) stores the **address** of the next instruction, not the instruction itself.

### Four-stage instruction cycle

Every instruction conceptually goes through:

1. **FETCH**
   - read instruction at address in `rip` (often via the instruction cache, I-cache).
2. **DECODE**
   - interpret opcode, identify operands/registers, choose ALU/memory actions.
3. **EXECUTE**
   - perform the operation (ALU arithmetic, load/store, etc.).
4. **UPDATE**
   - advance `rip` to the next instruction (or jump/branch target).

Example intuition: sequential instructions typically do `rip <- rip + instruction_size`,
but branches/jumps overwrite `rip` with a target address.

## DRAM organization and operation

### What DRAM is

DRAM (main memory) stores bits as **charge in capacitors**.

- “Dynamic” because charge leaks, so it must be **refreshed periodically**.

### DRAM cell (per bit)

- 1 transistor (access switch, controlled by word line)
- 1 capacitor (stores charge)

### Writes

- Write 1: charge capacitor.
- Write 0: discharge capacitor.

### Reads are destructive

Reading discharges/perturbs the capacitor, so the chip uses a **sense amplifier**:

- Bit lines start at a reference voltage (conceptually “middle”).
- The tiny voltage difference (from a charged vs discharged capacitor) is amplified to a full 0/1.
- Then the value must be **restored** (write-back after read).

### Refresh

Because charge leaks, the memory controller refreshes rows periodically
(typical order-of-magnitude: every ~64 ms in the simplified discussion).

**Big picture:** DRAM is dense and cheap, but slower and needs refresh overhead.

### DRAM vs SRAM (why caches use SRAM)

- SRAM is faster, uses more transistors per bit, doesn’t need refresh.
- DRAM is denser and cheaper, but slower.

## Cache memory organization

### Memory hierarchy (fast -> slow)

Registers -> L1 -> L2 -> L3 -> DRAM -> disk

The huge speed gap is why caches exist.

### Why caches work: locality

- **Temporal locality:** if you used it recently, you’ll likely use it again soon.
- **Spatial locality:** if you accessed address X, you’ll likely access nearby addresses soon.

Caches exploit this by fetching and storing **blocks (cache lines)** of adjacent bytes.
For the full cache design details (tag/index/offset bits, direct-mapped vs set-associative vs fully associative, replacement, write policies), see **[10](https://robinc.vercel.app/note.html?course=CSCI-UA-201&note=10-cache-perf)**.

## Cache math you should be able to do quickly

### Index / offset / tag bits

Given:

- Cache size `S` bytes
- Block size `B` bytes
- Associativity `N` (ways)
- Address width `A` bits

Compute:

1. number of lines = `S / B`
2. number of sets = `(S / B) / N`
3. offset bits = `log2(B)`
4. index bits = `log2(#sets)`
5. tag bits = `A - index_bits - offset_bits`

### Performance equation

A key mental model is the weighted average:

```text
Average Access Time = Hit Rate × Hit Time + Miss Rate × Miss Penalty
```

This explains why even “rare” DRAM misses can dominate runtime.

## Summary

- `rip` tracks the next instruction; instructions cycle through fetch/decode/execute/update.
- DRAM stores charge, reads are destructive, and refresh is required.
- Caches hide DRAM latency by exploiting temporal and spatial locality.
- Mapping and write policies trade off speed, cost, and miss behavior.
- Always keep the average access time equation in mind when reasoning about performance.

(Cache organization details are in **[10](https://robinc.vercel.app/note.html?course=CSCI-UA-201&note=10-cache-perf)**; this note focuses on instruction execution + DRAM and the big-picture hierarchy.)
