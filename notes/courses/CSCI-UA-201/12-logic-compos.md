---
title: Digital Logic Components and ALU Design
date: 2025-12-04/09
---

## Overview

This recitation covers larger digital logic components built from gates and adders:

- N-bit adder/subtractor circuits.
- Binary multiplier circuits.
- Decoders.
- Multiplexers.
- Multi-bit ALU design.
- Practice examples tying them together.

## N-bit adder/subtractor

### Two's complement subtraction

To compute $A - B$ using an adder, use two's complement:

$$
A - B = A + (-B) = A + (\lnot B) + 1
$$

So we can reuse an adder for subtraction by:

- Inverting $B$.
- Adding 1 as an extra carry in.

### Single-bit add/sub unit

Each bit slice has:

- Inputs: $A$, $B$, $\text{Cin}$, mode $M$.
- Outputs: result bit and $\text{Cout}$.

Mode behavior:

- $M = 0$ -> addition:
  - Effective $B$ bit is just $B$.
  - Initial carry in (LSB) is $0$.
- $M = 1$ -> subtraction:
  - Effective $B$ bit is $\lnot B$ (through XOR with $M$).
  - Initial carry in (LSB) is $1$.

Typical wiring:

- Each $B$ bit goes through an XOR with $M$:
  - $B' = B \oplus M$.
- Least significant $\text{Cin}$ is $M$.

### N-bit implementation

For an N-bit adder/subtractor:

1. Chain N single-bit add/sub units.
2. Connect $\text{Cout}$ of bit $i$ to $\text{Cin}$ of bit $i+1$.
3. Share the mode bit $M$ across all slices.
4. Use $M$ as the initial $\text{Cin}$.

**Overflow vs carry:**

- Carry out relates to **unsigned** arithmetic.
- Overflow is about **signed** arithmetic:
  - For two's complement, overflow occurs when adding two positive numbers yields a negative, or two negative numbers yield a positive.
  - Can be detected by comparing carry into and carry out of the most significant bit.

## Binary multiplication circuits

### Binary multiplication algorithm

Binary multiplication is similar to decimal:

- Each bit of the multiplier selects either 0 or the multiplicand.
- Partial products are shifted and added.

Example: $5 times 3$:

- $5 = 101_2$, $3 = 011_2$.
- Generate partial products based on bits of the multiplier and add them.

### Array multiplier

For N-bit by N-bit multiplication:

- Inputs: $A$ and $B$, each N bits.
- Output: $2N$-bit product.
- Hardware:
  - $N^2$ AND gates compute partial products $A_i \land B_j$.
  - Adders sum these partial products with appropriate shifts.

Characteristics:

- Number of AND gates: $N^2$.
- Number of adders: roughly $N^2 - N$.
- Critical path (delay) grows with $N$ in a simple ripple-style design.

## Decoders

### Definition

A **decoder** maps N input bits to $2^N$ outputs such that exactly one output is 1.

- Inputs: N-bit binary code.
- Outputs: $2^N$ lines.
- Behavior: output $O_i$ is 1 exactly when the input equals binary $i$.

### 2-to-4 decoder example

Inputs: $I_1$, $I_0$.

Outputs: $O_3, O_2, O_1, O_0$.

- $O_0$ is 1 when $(I_1, I_0) = (0,0)$.
- $O_1$ is 1 when $(I_1, I_0) = (0,1)$.
- $O_2$ is 1 when $(I_1, I_0) = (1,0)$.
- $O_3$ is 1 when $(I_1, I_0) = (1,1)$.

Example Boolean equations:

$$
O_0 = \lnot I_1 \land \lnot I_0
$$

$$
O_1 = \lnot I_1 \land I_0
$$

$$
O_2 = I_1 \land \lnot I_0
$$

$$
O_3 = I_1 \land I_0
$$

### 3-to-8 decoder and uses

- 3 inputs -> 8 outputs.
- Used for:
  - Memory chip select.
  - Instruction decoding.
  - Demultiplexing.
  - Address decoding for I/O devices.

Example: to enable chip 5, drive address inputs so that only output $O_5$ is 1.

## Multiplexers (MUX)

### Definition

A **multiplexer** selects one of many inputs to pass to a single output.

- Data inputs: $2^N$ lines.
- Select inputs: N bits.
- Output: 1 line.

Think of a mux as a digital selector.

### 4-to-1 mux

Inputs: data $I_0, I_1, I_2, I_3$, selects $S_1, S_0$.

Output function:

$$
\text{Out} =
\lnot S_1 \land \lnot S_0 \land I_0
\;\lor\;
\lnot S_1 \land S_0 \land I_1
\;\lor\;
S_1 \land \lnot S_0 \land I_2
\;\lor\;
S_1 \land S_0 \land I_3
$$

Exactly one product term is active for any given select value.

### Using muxes to implement logic

A $2^N$-to-1 mux can implement any Boolean function of N variables:

- Connect the N variables to the select lines.
- Choose each data input $I_i$ to be 0 or 1 according to the desired truth table.

Example: implement $F(A,B)$ using a 4-to-1 mux by wiring $A,B$ to selects and assigning $I_0,\dots,I_3$ appropriately.

### Building larger muxes

An 8-to-1 mux can be built from 2-to-1 muxes in a tree:

- Stage 1: 4 muxes select between input pairs using $S_0$.
- Stage 2: 2 muxes select between results using $S_1$.
- Stage 3: 1 mux selects final output using $S_2$.

Total 2-to-1 muxes required: 7.

## Multi-bit ALU design

### 1-bit ALU slice

Inputs:

- Operand bits $A$ and $B$.
- Carry in $\text{Cin}$ (for arithmetic).
- Operation select signals (for example 2 bits).

Outputs:

- Result bit $\text{Out}$.
- Carry out $\text{Cout}$ (for arithmetic).
- Possibly flags such as zero or negative for the bit or for the whole word.

Supported operations (depending on select encoding):

- Bitwise AND.
- Bitwise OR.
- ADD.
- SUB (via two's complement).
- Possibly others like XOR.

Typical structure:

- AND and OR blocks compute logic results.
- An adder block computes arithmetic.
- A small mux chooses which result to output based on select lines.

### N-bit ALU

To build an N-bit ALU:

1. Use N copies of the 1-bit ALU slice.
2. Connect corresponding bits of $A$ and $B$ into each slice.
3. Chain carries: $\text{Cout}$ of bit $i$ -> $\text{Cin}$ of bit $i+1$.
4. Broadcast the same operation select signals to all slices.

The ALU also typically outputs **status flags**:

- Zero flag $Z$: result word is all 0s.
- Negative flag $N$: most significant bit is 1 (for two's complement).
- Carry flag $C$: carry out from the most significant bit.
- Overflow flag $V$: signed overflow occurred.

### Example operations (4-bit)

Given $A = 1100_2$ and $B = 0101_2$:

- AND: $1100 \land 0101 = 0100$.
- OR: $1100 \lor 0101 = 1101$.
- ADD: $1100 + 0101 = 10001_2$ (5-bit result, overflow if only 4 bits kept).
- SUB: $A - B = 1100 + (\lnot 0101) + 1 = 1100 + 1010 + 1 = 0111$.

## Summary

- Adder/subtractor: uses XOR with a mode bit and an initial carry to unify addition and subtraction.
- Binary multiplier: uses partial products (AND gates) and adders; result width doubles.
- Decoder: N inputs -> $2^N$ outputs with one-hot behavior, used for selection and addressing.
- Multiplexer: $2^N$ inputs -> 1 output, with N select bits; can implement arbitrary Boolean functions.
- Multi-bit ALU: built from 1-bit slices, performs arithmetic and logical operations and sets flags for the CPU.
