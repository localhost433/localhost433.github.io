---
title: Number Systems & Memory Organization
date: 
---

## Number system fundamentals

Digital systems use several bases to represent information:

- **Decimal (base 10):** digits $0$–$9$, human-friendly.
- **Binary (base 2):** digits $0$–$1$, directly matches on/off electrical signals in hardware.
- **Hexadecimal (base 16):** digits $0$–$9$ and $A$–$F$ (representing $10$–$15$), a compact way to write binary.
- Other bases (e.g., ternary base $3$, quaternary base $4$) are conceptually similar.

All positional number systems use powers of the base:

- Rightmost digit is position $0$, next is position $1$, etc.
- Value $=$ sum over $\text{digit} \times \text{base}^{\text{position}}$.

Example (binary $1011_2$):

$$
1011_2 = 1 \cdot 2^3 + 0 \cdot 2^2 + 1 \cdot 2^1 + 1 \cdot 2^0
= 8 + 0 + 2 + 1 = 11_{10}.
$$

## Base conversions

### To decimal (positional expansion)

- **Binary -> decimal:** multiply each bit by the corresponding power of $2$ and add.
- **Hex -> decimal:** multiply each hex digit by the corresponding power of $16$ and add.

Example:

$$
(10110)_2 = 1 \cdot 2^4 + 0 \cdot 2^3 + 1 \cdot 2^2 + 1 \cdot 2^1 + 0 \cdot 2^0 = 22_{10}.
$$

$$
(\text{AE3})_{16} = 10 \cdot 16^2 + 14 \cdot 16^1 + 3 \cdot 16^0 = 2787_{10}.
$$

### From decimal (repeated division)

Use repeated division by the target base, tracking remainders:

- **Decimal -> binary:** divide by $2$ until the quotient is $0$, read remainders bottom-to-top.
- **Decimal -> hex:** same idea but divide by $16$.

Example:

- $20_{10} \to$ binary: remainders give $(10100)_2$.
- $20_{10} \to$ hex: remainders give $(14)_{16}$.

### Direct binary–hex mapping

Because $16 = 2^4$, $4$ binary bits correspond to $1$ hex digit:

- **Binary -> hex:** group bits into $4$-bit chunks from the right, pad with leading zeros if needed, convert each chunk to hex.
- **Hex -> binary:** replace each hex digit with its $4$-bit binary equivalent.

Example:

- $(110100)_2 \to 0011\,0100 \to (34)_{16}$.
- $(\text{B2F})_{16} \to 1011\,0010\,1111_2$.

A small table (for $0$–$15$) links decimal, hex, and $4$-bit binary.

## Data representation

### Bits, bytes, and larger units

- $1$ **bit** $=$ $1$ binary digit ($0$ or $1$).
- $1$ **byte** $=$ $8$ bits.
- $1$ **KB** $=$ $2^{10}$ bytes $= 1024$ bytes.
- $1$ **MB** $=$ $2^{10}$ KB.
- $1$ **GB** $=$ $2^{10}$ MB.
- $1$ **TB** $=$ $2^{10}$ GB.

An $n$-bit quantity can represent $2^n$ distinct values:

- $1$ bit -> $2$ values.
- $8$ bits ($1$ byte) -> $2^8 = 256$ values.

### Text encoding

- **ASCII:** uses $1$ byte ($8$ bits) per character; can encode up to $256$ characters (e.g., `'A' = 65_{10}$).
- **Unicode:** uses $16$ bits or more; supports many languages and symbols ($2^{16}$ or more code points).

### Numbers

- **Integers:** stored as binary whole numbers (with specific schemes for signed vs unsigned).
- **Floating-point:** used for real numbers; stored using standardized formats (e.g., IEEE-754) with finite precision, so not all real values can be represented exactly.

## Memory organization

### Addresses vs contents

Memory is a collection of storage cells:

- **Memory address:** where data is stored (an index/location).
- **Memory content:** the bits actually stored at that address.

For an $n$-bit memory **location**:

- It can store one of $2^n$ different values (because the content has $n$ bits).

For an $n$-bit **address**:

- It can point to $2^n$ distinct locations.

Example:

- $32$-bit data cell -> $2^{32}$ possible contents.
- $16$-bit address -> $2^{16} = 64\text{K}$ addressable locations.

### Size and powers of two

Useful powers of two:

- $2^{10} = 1024 \approx 1\text{K}$
- $2^{20} \approx 1\text{M}$
- $2^{30} \approx 1\text{G}$
- $2^{40} \approx 1\text{T}$

Key rules:

$$
2^n \cdot 2^m = 2^{n+m}, \quad \log_2(nm) = \log_2(n) + \log_2(m).
$$

Examples:

- $2^{16} = 2^{10} \cdot 2^6 = 1\text{K} \cdot 64 = 64\text{K}$.
- If a system has a $24$-bit address bus, it can address $2^{24}$ bytes $= 16\text{MB}$.

### Basic computer architecture

A simplified view:

- **CPU** connects to **RAM** using three buses:
  - **Address bus:** selects which memory location to access.
  - **Data bus:** carries data between CPU and memory.
  - **Control bus:** carries control signals (read/write, etc.).

The width of the address bus determines the maximum directly addressable memory.

## Practice and examples

The note includes worked examples on:

1. **Base conversions:**
   - Binary <-> decimal.
   - Hex <-> decimal.
   - Decimal <-> binary via repeated division.
   - Hex <-> binary via $4$-bit grouping.

2. **Memory calculations:**
   - Bits needed to address a given memory size (e.g., $8\text{MB}$ requires $23$ address bits).
   - Maximum memory size from a given address width (e.g., $24$-bit address bus -> $16\text{MB}$).

3. **Data values in $n$-bit locations:**
   - Counting the number of distinct values (e.g., a $12$-bit cell stores $2^{12} = 4096$ values).

## Quick reference

Common facts:

- $1$ byte $= 8$ bits.
- $1$ KB $= 1024$ bytes.
- $1$ MB $= 1024$ KB.
- $1$ GB $= 1024$ MB.
- $1$ TB $= 1024$ GB.

Hex <-> $4$-bit binary shortcuts:

- $A = 1010$, $B = 1011$, $C = 1100$, $D = 1101$, $E = 1110$, $F = 1111$.

Frequent mistakes to avoid:

1. Confusing memory **addresses** with memory **contents**.
2. Forgetting to pad binary with leading zeros when grouping for hex.
3. Using $1000$ instead of $1024$ for KB/MB/GB in CS contexts.
4. Reading division remainders in the wrong order in base conversion.
5. Misplacing powers of the base in positional notation.
