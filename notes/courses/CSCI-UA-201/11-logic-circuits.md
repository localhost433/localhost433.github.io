---
title: Digital Logic Transistors to Arithmetic Circuits
date: 2025-11-20
---

## Overview

This recitation develops digital logic from the physics of transistors up through logic gates, Boolean algebra, and arithmetic circuits such as adders and a simple ALU.

## Transistors and CMOS Inverter

### Silicon and doping

- Pure silicon is a poor conductor.
- **Doping** creates:
  - **N-type** silicon: extra electrons (negative carriers).
  - **P-type** silicon: missing electrons ("holes", positive carriers).

### N-type and P-type transistor behavior

A transistor is an electrically controlled switch. For CMOS logic:

- N-type transistor:
  - Gate = 0 -> switch OFF.
  - Gate = 1 -> switch ON (connects output to ground).
- P-type transistor:
  - Gate = 0 -> switch ON (connects output to $V_{dd}$).
  - Gate = 1 -> switch OFF.

### Building a NOT gate (inverter)

Configuration:

- One P-type transistor connects output to $V_{dd}$.
- One N-type transistor connects output to ground.
- Both gates share the same input.

Operation:

- Input = 0:
  - P-type ON, N-type OFF -> output is connected to $V_{dd}$ (logic 1).
- Input = 1:
  - P-type OFF, N-type ON -> output is connected to ground (logic 0).

Key idea: the output is always strongly driven to 0 or 1 (never floating).

## Fundamental logic gates

We use binary signals (0, 1) and gates that implement Boolean operations.

### NOT gate

- Function: invert a single input.
- Truth table:

| A | Output |
|---|--------|
| 0 | 1      |
| 1 | 0      |

### AND gate

- Output is 1 only when all inputs are 1.

| A | B | Output |
|---|---|--------|
| 0 | 0 | 0      |
| 0 | 1 | 0      |
| 1 | 0 | 0      |
| 1 | 1 | 1      |

### OR gate

- Output is 1 when at least one input is 1.

| A | B | Output |
|---|---|--------|
| 0 | 0 | 0      |
| 0 | 1 | 1      |
| 1 | 0 | 1      |
| 1 | 1 | 1      |

### XOR gate (exclusive OR)

- Output is 1 when inputs differ.

| A | B | Output |
|---|---|--------|
| 0 | 0 | 0      |
| 0 | 1 | 1      |
| 1 | 0 | 1      |
| 1 | 1 | 0      |

### NAND and NOR gates

- **NAND**: NOT of AND.
- **NOR**: NOT of OR.

Both NAND and NOR are **functionally complete**: any Boolean function can be built using only NAND gates or using only NOR gates.

## Boolean algebra and simplification

Boolean expressions describe logic circuits; laws of Boolean algebra let us simplify them to use fewer gates.

### De Morgan's laws

$$
\lnot(A \lor B) = (\lnot A) \land (\lnot B)
$$

$$
\lnot(A \land B) = (\lnot A) \lor (\lnot B)
$$

### Distributive laws

$$
A \land (B \lor C) = (A \land B) \lor (A \land C)
$$

$$
A \lor (B \land C) = (A \lor B) \land (A \lor C)
$$

### Basic identities

- Complement:
  - $A \land \lnot A = 0$
  - $A \lor \lnot A = 1$
- Identity:
  - $A \land 1 = A$
  - $A \lor 0 = A$
- Annihilation:
  - $A \land 0 = 0$
  - $A \lor 1 = 1$

### From truth table to simplified expression

Given a truth table, the standard **sum-of-products** form:

1. For each row where the output is 1, form a product term (AND) that matches that row.
2. OR all such terms.

Example pattern for three inputs $A$, $B$, $C$:

- Row with $A=0$, $B=1$, $C=1$ contributes $\lnot A \land B \land C$.
- The final output is a big OR of all such minterms.
- Then simplify using De Morgan and distributive rules to reduce gate count.

## Adder circuits

### XOR as 1-bit adder without carry

If we ignore carry, adding two bits $A$ and $B$ is simply:

$$
\text{Sum} = A \oplus B
$$

But this is not enough for binary addition because $1 + 1 = 10_2$ requires both a sum bit and a carry bit.

### Half adder

The **half adder** adds two input bits $A$ and $B$ and produces:

- Sum: 1-bit sum.
- Carry: 1-bit carry out.

Truth table:

| A | B | Sum | Carry |
|---|---|-----|-------|
| 0 | 0 | 0   | 0     |
| 0 | 1 | 1   | 0     |
| 1 | 0 | 1   | 0     |
| 1 | 1 | 0   | 1     |

Boolean functions:

$$
\text{Sum} = A \oplus B
$$

$$
\text{Carry} = A \land B
$$

### Full adder

A **full adder** adds three bits:

- Inputs: $A$, $B$, and $\text{C}_\text{in}$ (carry in).
- Outputs: $\text{Sum}$ and $\text{Cout}$ (carry out).

Truth table (sketched):

- When an odd number of inputs are 1, $\text{Sum} = 1$.
- When at least two inputs are 1, $\text{Cout} = 1$.

Simplified expressions:

$$
\text{Sum} = A \oplus B \oplus \text{Cin}
$$

$$
\text{Cout} = (A \land B) \lor (\text{Cin} \land (A \oplus B))
$$

### N-bit ripple-carry adder

To add two N-bit numbers:

- Chain $N$ full adders.
- Connect $\text{Cout}$ of bit $i$ to $\text{Cin}$ of bit $i+1$.
- The least significant adder gets $\text{Cin}$ (usually 0).

This is called a **ripple-carry** adder since carries ripple from least significant bit to most significant bit, limiting speed for large $N$.

### Adding subtraction: ALU slice

Two's complement lets us implement subtraction as addition:

$$
A - B = A + (\lnot B) + 1
$$

Design trick:

- Insert an XOR gate on each bit of $B$, controlled by a mode signal $M$:
  - $M = 0$ -> $B$ passes through (addition).
  - $M = 1$ -> $\lnot B$ (subtraction).
- Feed $M$ as the initial $\text{Cin}$ into the least significant full adder.

Then the same N-bit adder can perform:

- Addition: $A + B$ when $M = 0$.
- Subtraction: $A - B$ when $M = 1$.

This forms the arithmetic part of an ALU.

## Quick reference

- NAND and NOR are functionally complete.
- Half adder: sum $A \oplus B$, carry $A \land B$.
- Full adder: sum $A \oplus B \oplus \text{Cin}$, carry $(A \land B) \lor (\text{Cin} \land (A \oplus B))$.
- N-bit ripple-carry adder chains full adders using carry.
- Two's complement subtraction: invert $B$, add 1, and add to $A$.
