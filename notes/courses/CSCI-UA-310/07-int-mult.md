---
title: 7 - Radix Sort & Integer Multiplication
date: 2026-02-11
---

## Roadmap

We conclude linear-time sorting with **Radix Sort** and then explore a Divide and Conquer application outside of sorting: fast **Integer Multiplication**.

1. **Radix Sort**: Sorting multi-digit numbers.
2. **Correctness**: The importance of stability.
3. **Integer Multiplication**: Karatsuba's Algorithm ($O(n^{1.58})$).

---

## 1. Radix Sort

Radix sort solves the problem of sorting numbers with $d$ digits. Counter-intuitively, we sort from the **least significant digit (LSD)** to the most significant.

### 1.1 Algorithm

```text
RADIX-SORT(A, d)
1. for i = 1 to d
2.     use a stable sort to sort array A on digit i
```

Typically, **Counting Sort** is used as the intermediate stable sort.

### 1.2 Analysis

* We perform $d$ passes.
* Each pass takes $O(n + k)$ time (where $k$ is the base, e.g., 10).
* **Total Time**: $O(d(n + k))$.
* If $d$ is constant and $k = O(n)$, Radix Sort runs in **linear time** $O(n)$.

### 1.3 Why LSD?

Sorting by MSD (Most Significant Digit) is intuitive (like alphabetizing words) but requires recursion to sort the "buckets" created by the first digit. LSD Radix Sort is iterative and simpler to implement, relying on the **stability** of the subroutine to maintain the order established by previous, less significant digits.

---

## 2. Integer Multiplication

**Problem**: Multiply two -digit numbers  and .
Standard grade-school multiplication takes  operations. Can we do better?

### 2.1 Divide and Conquer

Let $X = x_h 10^{n/2} + x_l$ and $Y = y_h 10^{n/2} + y_l$.
$$ XY = x_h y_h 10^n + (x_h y_l + x_l y_h) 10^{n/2} + x_l y_l $$
This requires 4 multiplications of size $n/2$.
$$ T(n) = 4T(n/2) + \Theta(n) \implies T(n) = \Theta(n^2) $$
This offers no improvement.

### 2.2 Karatsuba's Algorithm

Karatsuba (1960) noticed that we only need 3 multiplications:

1. $A = x_h y_h$
2. $B = x_l y_l$
3. $C = (x_h + x_l)(y_h + y_l)$

The middle term $x_h y_l + x_l y_h$ can be computed as:
$$ (x_h + x_l)(y_h + y_l) - x_h y_h - x_l y_l = x_h y_l + x_l y_h $$

### 2.3 Complexity

New Recurrence:
$$ T(n) = 3T(n/2) + \Theta(n) $$
Using the Master Theorem ():
$$ T(n) = \Theta(n^{\log_2 3}) \approx \Theta(n^{1.58}) $$
This is significantly faster than  for large .

---

## References

* **CLRS**: Chapter 8 (Radix Sort), Chapter 4 (Divide and Conquer - Karatsuba).
