---
title: Data Representation
date:
---

## Text and character encoding

Computers store text as numeric codes.

### ASCII

- 7-bit core set (values 0 to 127), extended ASCII uses 8 bits (0 to 255).
- Each character is mapped to an integer code, then stored in binary.

Example: "Hi"

- 'H' is 72 in decimal, which is $01001000_2$.
- 'i' is 105 in decimal, which is $01101001_2$.
- "Hi" in binary is $01001000\ 01101001$.

### Unicode and UTF-8

- Unicode assigns code points to characters from many languages and symbol sets.
- UTF-8 encodes each code point using 1 to 4 bytes.
- All ASCII bytes keep their original values in UTF-8, so ASCII text is valid UTF-8.

## Integer representation

Let an integer be stored in $n$ bits.

### Unsigned integers

- Represent non-negative values only.
- Bit pattern $b_{n-1} \dots b_1 b_0$ is interpreted as

$$
b_{n-1} 2^{n-1} + \dots + b_1 2^1 + b_0 2^0.
$$

- Range: $0$ to $2^n - 1$.

### Signed integers

Several conventions exist to represent negative numbers.

#### Sign-magnitude

- Most significant bit (MSB) is the sign: 0 for positive, 1 for negative.
- Remaining bits store the magnitude.
- Problem: there are two representations of zero ($+0$ and $-0$).

Example with 3 bits:

- $000$ is $+0$.
- $011$ is $+3$.
- $100$ is $-0$.
- $111$ is $-3$.

#### One's complement

- Negative numbers are formed by flipping all bits of the positive value.
- Still has two zeros ($+0$ and $-0$).
- Range for $n$ bits: from $-(2^{n-1} - 1)$ to $+(2^{n-1} - 1)$.

#### Two's complement

This is the standard representation.

- To get $-x$ from $x$:
  1. Write $x$ in binary.
  2. Flip all bits (one's complement).
  3. Add $1$.

- Range for $n$ bits: $-2^{n-1}$ to $2^{n-1} - 1$.
- There is a unique zero and integer addition works uniformly at the bit level.

Example: $-7$ in 8-bit two's complement.

- $+7 = 00000111_2$
- Flip bits: $11111000_2$
- Add one: $11111001_2$
- So $-7 = 11111001_2$.

Check: $11111001_2 + 00000111_2 = 1 00000000_2$, and the carry out of the top bit is ignored, leaving zero.

## Floating point representation

Modern systems use IEEE 754 formats.

### Single precision (32-bit)

Written as

- 1 sign bit,
- 8-bit exponent with bias 127,
- 23-bit fraction (mantissa) with an implicit leading bit for normalized values.

If the stored fields are $s$ (sign), $e$ (exponent), $f$ (fraction bits), then for a normalized number

$$
\text{value} = (-1)^s \times (1.f)_2 \times 2^{e - 127}.
$$

Example: $5.75$.

1. Convert to binary: $5.75 = 101.11_2$.
2. Normalize: $101.11_2 = 1.0111_2 \times 2^2$.
3. Sign bit $s = 0$.
4. Exponent field $e = 2 + 127 = 129 = 10000001_2$.
5. Fraction field holds $0111$ followed by zeros.

So the bit pattern is


$$
0\ 10000001\ 01110000000000000000000.
$$


### Key floating point ideas

- Only finitely many real numbers can be represented, so most reals are approximated.
- Spacing between representable numbers grows as magnitudes grow.
- Rounding means algebraic laws like associativity may fail, so order of operations matters in numerical code.
