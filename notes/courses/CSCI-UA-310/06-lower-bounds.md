---
title: 6 - Lower Bounds & Linear Sorting
date: 2026-02-09
---

## Roadmap

We shift perspective from "how fast can we sort?" to "what is the theoretical limit?". We prove that comparison-based sorting cannot break the $\Omega(n \log n)$ barrier. We then introduce non-comparison sorts that achieve $O(n)$.

1. **Lower Bounds**: The Decision Tree model.
2. **Proof**: $\Omega(n \log n)$ for comparison sorts.
3. **Counting Sort**: Sorting integers in linear time.

---

## 1. Lower Bounds for Comparison Sorts

**Comparison Sorts**: Algorithms that only gain information about the input sequence $\langle a_1, \dots, a_n \rangle$ by comparing elements $a_i$ and $a_j$. Examples: Merge Sort, QuickSort, Insertion Sort.

### 1.1 The Decision Tree Model

We can view any comparison sort as a binary tree.

* **Internal Node**: A comparison $a_i : a_j$.
* **Left Branch**: Case $a_i \le a_j$.
* **Right Branch**: Case $a_i > a_j$.
* **Leaf Node**: A permutation of the input (a potential sorted order).

For the algorithm to be correct, every possible permutation of the $n$ elements must appear as a leaf. There are $n!$ permutations.

### 1.2 The Proof

Let $h$ be the height of the tree. The height represents the worst-case number of comparisons.
A binary tree of height $h$ has at most $2^h$ leaves.
Since we need at least $n!$ leaves:
$$2^h \ge n!$$
Taking logs:
$$h \ge \log_2(n!)$$
Using Stirling's approximation ($\log n! = \Theta(n \log n)$):
$$h = \Omega(n \log n)$$
**Conclusion**: Any comparison sort requires $\Omega(n \log n)$ comparisons in the worst case. Merge Sort and Heap Sort are asymptotically optimal comparison sorts.

---

## 2. Counting Sort

To beat the $\Omega(n \log n)$ bound, we must stop comparing elements. **Counting Sort** uses the actual values of the numbers to index into an array.

**Assumption**: The input consists of integers in the range $0$ to $k$.

### 2.1 Algorithm

1. **Count**: Create an array $C[0..k]$ to store the frequency of each number.
2. **Accumulate**: Modify $C$ such that $C[i]$ contains the number of elements $\le i$.
3. **Place**: Iterate through the input array $A$ backwards. Place element $A[j]$ at position $C[A[j]]$ in the output array $B$. Decrement $C[A[j]]$.

### 2.2 Analysis

* Initializing $C$: $\Theta(k)$.
* Counting frequencies: $\Theta(n)$.
* Accumulating: $\Theta(k)$.
* Placing elements: $\Theta(n)$.
* **Total Time**: $\Theta(n + k)$.

If $k = O(n)$, the running time is $\Theta(n)$.

**Stability**: Counting Sort is **stable**; elements with the same value appear in the output in the same order as they appeared in the input. This is crucial for Radix Sort.

---

## References

* **CLRS**: Chapter 8: "Sorting in Linear Time".
