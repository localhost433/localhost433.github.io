---
title: 4 - QuickSort
date: 2026-02-02
---

## Roadmap

**QuickSort** is one of the most widely used sorting algorithms. Like Merge Sort, it uses Divide and Conquer, but the work is distributed differently. QuickSort does the hard work in the **divide** step (Partitioning), making the **combine** step trivial.

1. **Overview**: Divide and Conquer applied to QuickSort.
2. **Partitioning**: The core logic (Lomuto Partition scheme).
3. **Analysis**: Worst-case ($O(n^2)$) vs. Expected ($O(n \log n)$).
4. **Randomization**: Why it makes the worst case incredibly unlikely.

---

## 1. QuickSort Overview

**Algorithm**:

1. **Divide**: Partition the array $A[p..r]$ into two (possibly empty) subarrays $A[p..q-1]$ and $A[q+1..r]$ such that each element of $A[p..q-1]$ is less than or equal to $A[q]$, which is, in turn, less than or equal to each element of $A[q+1..r]$. The index $q$ is computed as part of this partitioning procedure.
2. **Conquer**: Sort the two subarrays by recursive calls to QuickSort.
3. **Combine**: Because the subarrays are already sorted in place, no work is needed to combine them: the entire array $A[p..r]$ is now sorted.

---

## 2. Partitioning

The key is the `PARTITION` procedure, which rearranges the subarray in place.

**Pseudocode (Lomuto Partition)**:

```text
PARTITION(A, p, r)
1. x = A[r]          // Pivot
2. i = p - 1
3. for j = p to r - 1
4.     if A[j] <= x
5.         i = i + 1
6.         exchange A[i] with A[j]
7. exchange A[i + 1] with A[r]
8. return i + 1
```

**Mechanics**:

* The pivot $x = A[r]$ is chosen as the last element.
* The index $i$ marks the boundary between "small elements" and "large elements".
* As $j$ scans, if we find a small element ($A[j] \le x$), we move the boundary $i$ forward and swap $A[i]$ into the small region.
* Finally, the pivot is placed between the two regions.
* **Time Complexity**: $\Theta(n)$ for a subarray of size $n$.

---

## 3. Analysis

The running time of QuickSort depends on whether the partitioning is balanced.

### 3.1 Worst-Case Analysis

The worst case occurs when the partitioning routine produces one subproblem with $n-1$ elements and one with 0 elements.

* This happens if the array is already sorted or reverse sorted (assuming pivot is last element).
* Recurrence: $T(n) = T(n-1) + \Theta(n)$.
* Summation: $\Theta(n^2)$.
* This is no better than Insertion Sort!

### 3.2 Best-Case Analysis

The pivot partitions the array into two even halves of size $n/2$.

* Recurrence: $T(n) = 2T(n/2) + \Theta(n)$.
* Solution: $\Theta(n \log n)$.

### 3.3 Average Case

Even a 9-to-1 split yields $\Theta(\log n)$ depth.

* The tree height becomes $\Theta(\log n)$, which is still $\Theta(\log n)$.
* Therefore, the average running time is $\Theta(n \log n)$.

---

## 4. Randomized QuickSort

To prevent the worst-case behavior on specific inputs (like sorted arrays), we add **randomization**.

**Randomized Partition**:
Instead of always picking $A[r]$ as the pivot, we pick a random index $i$ from $[p, r]$, swap $A[i]$ with $A[r]$, and then proceed as usual.

**Result**:

* The running time is independent of the input ordering.
* The **expected** running time is $\Theta(n \log n)$.
* The probability of hitting the $\Theta(n^2)$ worst case is vanishingly small.

---

## References

* **CLRS**: Chapter 7: "Quicksort".
