---
title: Memory Circuits and CPU Datapath
date: 2025-11-25/12-02
---

## Overview

This recitation builds up the “state” and “dataflow” story inside a CPU (simplified):

- **Combinational vs. sequential** circuits (memory comes from feedback).
- The **SR latch** as the minimal 1-bit memory element.
- The **gated SR latch** (adds *write enable*, prevents the invalid state).
- The **D flip-flop** (parent-child latches + clocking for synchronization).
- **Registers** (many flip-flops in parallel) and the **register file**:
  - Write selection using a **decoder**.
  - Read selection using **multiplexers** (two read ports).
- A simplified **CPU datapath** model where each instruction takes **two cycles**
  (read/calculate, then write-back).

## Two types of circuits

### Combinational circuits (no memory)

Output depends only on *current* inputs.

- Examples: adders, multipliers, ALU.

### Sequential circuits (have memory)

Output depends on current inputs **and previous outputs**.

- Examples: latches, flip-flops, registers.
- Key idea: **feedback** (a loop) is what lets a circuit “remember”.

## SR latch (1-bit memory from feedback)

An **SR latch** is built from two cross-coupled NOR gates, producing a stable feedback loop.

- Inputs: **S** (set), **R** (reset)
- Output: **Q**

Truth table (classic SR latch behavior):

| R | S | Meaning | Q (next) |
|---|---|---------|----------|
| 0 | 0 | Hold    | stays at previous value |
| 0 | 1 | Set     | 1 |
| 1 | 0 | Reset   | 0 |
| 1 | 1 | Invalid | undefined/meaningless |

Why the invalid case matters: we are commanding “set” and “reset” simultaneously.

**Mental model:** SR latch is a sticky toggle: “set to 1,” “reset to 0,” or “hold what you were.”

## Gated SR latch (adds *Write Enable*)

The basic SR latch has two issues:

1. It allows the invalid state **S = R = 1**.
2. It has no control over **when** writing is permitted.

A **gated SR latch** fixes both by adding:

- Two AND gates on the inputs,
- An inverter,
- A **Write Enable** signal **WE**.

Behavior:

- If **WE = 0**: both S and R are forced to 0, so the latch is in **Hold**.
- If **WE = 1**: the data is allowed through, so the latch **sets** or **resets**.

Truth table (conceptual):

| Data | WE | Action |
|------|----|--------|
| X    | 0  | Hold (no change) |
| 0    | 1  | Reset (Q <- 0) |
| 1    | 1  | Set (Q <- 1) |

**Why the invalid state disappears:** the inverter ensures S and R can’t both be 1 at once
(the data and NOT-data cannot simultaneously be 1).

## D flip-flop and the clock (synchronization)

A latch changes whenever its enable is active, which is dangerous in large systems:
different parts of the CPU might read a value while it is changing.

A CPU clock provides a global rhythm:

- rising edge: 0 -> 1
- falling edge: 1 -> 0

### Parent-child (master-slave) D flip-flop

A D flip-flop can be built from two gated latches:

- **Parent latch** enabled when clock is high.
- **Child latch** enabled when clock is low (inverted clock).

Operation:

- **Clock = 1:** parent captures *new* data, child holds *old* output.
- **Clock = 0:** parent holds, child updates from parent.
- So the external output **Q updates on the falling edge** (end of the high phase).

**Key benefit:** the rest of the datapath can safely read the old value during the cycle, and the new
value becomes visible only at a clean edge.

## From flip-flops to registers

- 1 flip-flop stores **1 bit**.
- An N-bit register is **N flip-flops in parallel** (same clock/control).
- A 64-bit register = 64 flip-flops, all updating simultaneously on the clock edge.

## Register file: writing with decoders

A **register file** is a group of registers plus selection hardware for fast access.

Goal for writing:

1. Broadcast the incoming data to all registers.
2. Ensure **exactly one** register actually writes.

A **decoder** does the selection (for the decoder definition and equations, see **[12 - Digital Logic Components and ALU Design](https://robinc.vercel.app/note.html?course=CSCI-UA-201&note=12-logic-compos)**).

Address width:

- If you have `R` registers, you need `log2(R)` select bits.

Example:

- 16 registers -> 4 select bits (since 2^4 = 16).

Write sequence idea:

- Global **WE = 1** (write intent),
- Decoder output selects the target register,
- On the clock edge, only that register captures.

## Register file: reading with multiplexers (two read ports)

Most CPU operations need **two operands**, so the register file commonly supports:

- Read **two** registers simultaneously (two outputs).
- Write **one** register at a time.

Implementation concept:

- Two independent mux “stacks” (see **[12 - Digital Logic Components and ALU Design](https://robinc.vercel.app/note.html?course=CSCI-UA-201&note=12-logic-compos)** for the mux truth-table-style definition):
  - **Read Select 1** picks a register onto **Data Out 1**.
  - **Read Select 2** picks a register onto **Data Out 2**.

For a 64-bit register file, this is conceptually “64 muxes in parallel” per read port
(one mux per bit position).

**Limitation:** with two read ports, you cannot read 3+ registers in one cycle.
You must break a 3-operand dependency into multiple steps/instructions.

## The simplified datapath model (two-cycle instructions)

Main datapath components:

- **Register file** (2 reads, 1 write)
- **ALU** (computes ADD/SUB/AND/OR/etc.)
- **MUXes** (route which values feed the ALU, and which value feeds the write-back bus)

### Example: `add RBX, RAX` (x86-style)

Meaning: `RBX <- RBX + RAX`.

**Cycle 1: Read & Calculate**

- `WE = 0` (no writing yet)
- `ReadSel1 = RAX`, `ReadSel2 = RBX`
- ALU op = ADD
- ALU computes `RAX + RBX` and stores the result internally.

**Cycle 2: Write-back**

- `WE = 1`
- `WriteSel = RBX`
- Data-in to register file is driven by ALU result
- On the clock edge, RBX is updated.

### Control signals (mental checklist)

When tracing an instruction, explicitly track:

- `WE` (read vs write phase)
- `WriteSel`
- `ReadSel1`, `ReadSel2`
- `ALUOp`
- any MUX selects (which source is routed where)

## Quick reference

- Memory comes from **feedback** (sequential circuits).
- SR latch: (R,S) = (0,0) holds; (1,1) invalid.
- Gated SR latch: adds **WE**, blocks invalid state.
- D flip-flop: parent-child latches, **updates on falling edge**.
- Register file:
  - **decoder** chooses *where to write*,
  - **muxes** choose *what to read* (two reads at once),
  - instructions typically split into **read/calc** then **write-back**.
