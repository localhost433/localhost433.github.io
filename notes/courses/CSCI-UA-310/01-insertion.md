---
title: 1 - Insertion Sort & Correctness
date: 2026-01-20
---

## Roadmap

This lecture introduces the fundamental concepts of algorithm analysis using **Insertion Sort** as a case study. We define the sorting problem formally, present the algorithm, prove its correctness using **Loop Invariants**, and analyze its running time.

1. **The Sorting Problem**: Formal definition.
2. **Insertion Sort**: Algorithm mechanics and pseudocode.
3. **Correctness**: Proving the algorithm works using Loop Invariants.
4. **Analysis**: Best-case, worst-case, and average-case time complexity.

---

## 1. The Sorting Problem

**Input**: A sequence of $n$ numbers $\langle a_1, a_2, \dots, a_n \rangle$.

**Output**: A permutation (reordering) $\langle a'_1, a'_2, \dots, a'_n \rangle$ of the input sequence such that $a'_1 \le a'_2 \le \dots \le a'_n$.

The numbers being sorted are also called **keys**. In practice, these keys are often associated with other data (satellite data) as part of a record.

---

## 2. Insertion Sort

Insertion Sort is an efficient algorithm for sorting a small number of elements. It works the way many people sort a hand of playing cards: we start with an empty left hand and the cards face down on the table. We then remove one card at a time from the table and insert it into the correct position in the left hand. To find the correct position for a card, we compare it with each of the cards already in the hand, from right to left.

### 2.1 Pseudocode

We use 1-based indexing (typical for pseudocode and mathematical analysis).

```text
INSERTION-SORT(A)
1. for j = 2 to A.length
2.     key = A[j]
3.     // Insert A[j] into the sorted sequence A[1..j-1]
4.     i = j - 1
5.     while i > 0 and A[i] > key
6.         A[i + 1] = A[i]
7.         i = i - 1
8.     A[i + 1] = key
```

### 2.2 Mechanics

* The index $j$ indicates the "current card" being inserted.
* The subarray $A[1..j-1]$ constitutes the currently sorted hand.
* The remaining subarray $A[j+1..n]$ corresponds to the pile of cards still on the table.

---

## 3. Correctness via Loop Invariants

To prove the algorithm is correct, we use a **loop invariant**. A loop invariant is a property that holds true before and after each iteration of a loop.

**Invariant**: At the start of each iteration of the **for** loop of lines 1–8, the subarray $A[1..j-1]$ consists of the elements originally in $A[1..j-1]$, but in sorted order.

We must show three things about this loop invariant:

1. **Initialization**: It is true prior to the first iteration of the loop.
2. **Maintenance**: If it is true before an iteration of the loop, it remains true before the next iteration.
3. **Termination**: When the loop terminates, the invariant gives us a useful property that helps show that the algorithm is correct.

### Proof

1. **Initialization**: Before the first loop iteration, $j = 2$. The subarray $A[1..j-1]$ is $A[1]$, which consists of a single element. A single element is trivially sorted. The invariant holds.
2. **Maintenance**: Informally, the body of the `for` loop works by moving $A[j-1], A[j-2], \dots$ one position to the right until the proper position for `key` (formerly $A[j]$) is found. At that point, the value of `key` is placed into this position. The subarray $A[1..j]$ then consists of the original elements, but in sorted order. Incrementing $j$ for the next iteration preserves the invariant for $A[1..j]$.
3. **Termination**: The loop terminates when $j$ exceeds $n$, i.e., $j = n + 1$. Substituting $n + 1$ for $j$ in the invariant, we have: "The subarray $A[1..n]$ consists of the elements originally in $A[1..n]$, but in sorted order." This means the entire array is sorted.

---

## 4. Analysis of Algorithms

We analyze algorithms by predicting the resources they require, typically **computational time**.

### 4.1 Cost Model

We assume a generic one-processor, random-access machine (RAM) model. Instructions are executed one after another, with no concurrent operations.

* Arithmetic, data movement, and control instructions take constant time.
* Let $c_k$ be the cost of the $k$-th line of the pseudocode.
* Let $t_j$ be the number of times the `while` loop test is executed for that value of $j$.

The running time $T(n)$ is the sum of running times for each statement executed.

### 4.2 Best-Case Analysis

The best case occurs when the array is **already sorted**.

* For each $j$, $A[j] \le key$ immediately.
* The `while` loop terminates after one check ($t_j = 1$).
* The running time is a linear function of $n$:
$$ T(n) = an + b = \Theta(n) $$

### 4.3 Worst-Case Analysis

The worst case occurs when the array is **reverse sorted**.

* We must compare `key` with every element in the sorted subarray $A[1..j-1]$.
* $t_j = j$ for $j = 2,\dots,n$.
* Note that $\sum_{j=2}^n j = \frac{n(n+1)}{2} - 1$.
* The running time is a quadratic function of $n$:
$$ T(n) = an^2 + bn + c = \Theta(n^2) $$

### 4.4 Average-Case Analysis

On average, half the elements in $A[1..j-1]$ are less than $A[j]$ and half are greater.

* $t_j \approx j/2$.
* The summation still yields a quadratic term.
* $$ T(n) = \Theta(n^2) $$

Consequently, Insertion Sort is effective for small inputs but inefficient for large inputs compared to algorithms like Merge Sort ($O(n \log n)$).

---

## References

* **CLRS**: Cormen, Leiserson, Rivest, and Stein, *Introduction to Algorithms*, Chapter 2: "Getting Started" (Sections 2.1, 2.2).
