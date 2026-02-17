---
title: 5 - Selection & Median
date: 2026-02-04
---

## Roadmap

We address the **Selection Problem**: finding the $i$-th smallest element in an array of $n$ distinct numbers. We aim for an $O(n)$ running time, which is faster than sorting the entire array ($O(n \log n)$).

1. **Problem Statement**: Rank and Order Statistics.
2. **Randomized Select**: Algorithm based on QuickSort ($O(n)$ expected).
3. **Deterministic Select**: "Median of Medians" algorithm ($O(n)$ worst-case).

---

## 1. The Selection Problem

**Input**: A set $A$ of $n$ distinct numbers and an integer $i$, with $1 \le i \le n$.
**Output**: The element $x \in A$ that is larger than exactly $i-1$ other elements of $A$.

* $i=1$: Minimum.
* $i=n$: Maximum.
* $i = \lfloor (n+1)/2 \rfloor$: Median.

---

## 2. Randomized Selection

We can adapt the partitioning logic from QuickSort. In QuickSort, we recurse on *both* sides of the partition. In Selection, we know which side the $i$-th element lies in, so we only recurse on **one** side.

**Algorithm**:

```text
RANDOMIZED-SELECT(A, p, r, i)
1. if p == r
2.     return A[p]
3. q = RANDOMIZED-PARTITION(A, p, r)
4. k = q - p + 1  // Rank of the pivot
5. if i == k
6.     return A[q] // Pivot is the answer
7. elseif i < k
8.     return RANDOMIZED-SELECT(A, p, q-1, i)
9. else
10.    return RANDOMIZED-SELECT(A, q+1, r, i-k)
```

**Analysis**:

* **Worst Case**: Like QuickSort, if we always pick bad pivots, $T(n) = T(n-1) + \Theta(n) = \Theta(n^2)$.
* **Expected Case**: On average, the pivot splits the array well.
$$ T(n) \le T(n/2) + O(n) $$
This is a geometric series summing to $O(n)$.

---

## 3. Deterministic Selection ($O(n)$)

To guarantee $O(n)$ worst-case time, we must guarantee a good pivot split. The **Median of Medians** algorithm achieves this.

### 3.1 Algorithm

1. **Divide**: Divide the $n$ elements into $\frac{n}{5}$ groups of 5 elements each.
2. **Medians**: Find the median of each group (sort the 5 elements).
3. **Recursive Pivot**: Recursively find the median $m$ of the $\frac{n}{5}$ group medians.
4. **Partition**: Partition the input array around the pivot $m$.
5. **Recurse**: Recurse on the appropriate subarray if $m$ is not the answer.

### 3.2 Why it works

The "median of medians" $m$ is greater than half of the group medians. Each group median is greater than 2 other elements in its group.
Thus, $m$ is greater than approximately $3n/10$ elements.
Symmetrically, $m$ is less than $3n/10$ elements.
The recursive step runs on at most $7n/10$ elements.

### 3.3 Recurrence

$$ T(n) = T(\lceil n/5 \rceil) + T(7n/10) + O(n) $$

* $T(\lceil n/5 \rceil)$: To find the pivot $m$.
* $T(7n/10)$: The worst-case recursive call.
* $O(n)$: Partitioning overhead.

Using the substitution method, one can prove $T(n) = O(n)$ for sufficiently large $n$, since $7/10 < 1$.

---

## References

* **CLRS**: Chapter 9: "Medians and Order Statistics".
