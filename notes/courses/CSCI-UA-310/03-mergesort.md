---
title: 3 - Merge Sort & Recurrences
date: 2026-01-28
---

## Roadmap

We introduce the **Divide and Conquer** paradigm, a powerful strategy for algorithm design. We apply this to **Merge Sort**, achieving a $\Theta(n \log n)$ running time. We then analyze the algorithm by solving the resulting recurrence relation.

1. **Divide and Conquer**: The three steps.
2. **Merge Sort**: The algorithm.
3. **Analysis**: The recurrence $T(n) = 2T(n/2) + cn$.
4. **Solving Recurrences**: Recursion Trees and the Substitution Method.

---

## 1. Divide and Conquer

This paradigm involves three steps:
1. **Divide** the problem into a number of subproblems that are smaller instances of the same problem.
2. **Conquer** the subproblems by solving them recursively. If the subproblem sizes are small enough (base cases), solve them directly.
3. **Combine** the solutions to the subproblems into the solution for the original problem.

---

## 2. Merge Sort Algorithm

Merge Sort follows the paradigm perfectly:
1. **Divide**: Divide the $n$-element sequence to be sorted into two subsequences of $n/2$ elements each.
2. **Conquer**: Sort the two subsequences recursively using merge sort.
3. **Combine**: Merge the two sorted subsequences to produce the sorted answer.

### 2.1 The Merge Step
The key subroutine is `MERGE(A, p, q, r)`, which merges two sorted subarrays $A[p..q]$ and $A[q+1..r]$ into a single sorted subarray $A[p..r]$.

**Logic**:
We have two piles of cards, both sorted. We look at the top card of each pile, pick the smaller one, and place it face down in the output pile. We repeat this until one pile is empty, then append the remaining cards of the other pile.

**Complexity of Merge**:
Since we iterate through both subarrays exactly once, the time complexity is linear in the number of elements being merged.
$$T_{\text{merge}}(n) = \Theta(n)$$

---

## 3. Analysis of Merge Sort

Let $T(n)$ be the time to sort $n$ numbers.
1. **Divide**: The divide step computes the middle index. Time: $\Theta(1)$.
2. **Conquer**: We recursively solve two problems, each of size $n/2$. Time: $2T(n/2)$.
3. **Combine**: We merge $n$ elements. Time: $\Theta(n)$.

The recurrence is:
$$T(n) = \begin{cases} \Theta(1) & \text{if } n = 1 \\\\ 2T(n/2) + \Theta(n) & \text{if } n > 1 \end{cases}$$

---

## 4. Solving Recurrences

We suspect the solution is $T(n) = \Theta(n \log n)$. We verify this using two methods.

### 4.1 Recursion Tree Method
We visualize the recurrence as a tree of costs.
* **Root (Level 0)**: Cost $cn$ (for the merge).
* **Level 1**: Two nodes of size $n/2$. Cost $2 \times (c \cdot n/2) = cn$.
* **Level 2**: Four nodes of size $n/4$. Cost $4 \times (c \cdot n/4) = cn$.
* **Level $i$**: $2^i$ nodes of size $n/2^i$. Cost $2^i \times (c \cdot n/2^i) = cn$.

**Height of Tree**: The recursion bottoms out when $n/2^h = 1$, so $h = \log_2 n$.  
**Total Cost**: sum of costs at each level.
$$T(n) = \sum_{i=0}^{\log n} cn = cn (\log n + 1) = \Theta(n \log n)$$

### 4.2 Substitution Method
This method is formal mathematical induction.
**Guess**: $T(n) \le d n \log n$ for some constant $d > 0$.

**Inductive Step**: Assume $T(k) \le d k \log k$ for $k < n$.
Substitute this into the recurrence:
We can expand the recurrence as follows:
$$
\begin{align*}
T(n) &= 2T\left(\frac{n}{2}\right) + cn \\\\
&= 2\left[2T\left(\frac{n}{4}\right) + c\frac{n}{2}\right] + cn \\\\
&= 4T\left(\frac{n}{4}\right) + 2cn \\\\
&= 4\left[2T\left(\frac{n}{8}\right) + c\frac{n}{4}\right] + 2cn \\\\
&= 8T\left(\frac{n}{8}\right) + 3cn \\\\
&= 2^k T\left(\frac{n}{2^k}\right) + kcn
\end{align*}
$$
When $k = \log_2 n$, $T(1)$ is reached, so $T(n) = nT(1) + cn\log_2 n = O(n\log n)$.
$$
\begin{align*}
T(n) &= 2T(n/2) + cn \\\\
&\le 2 \left( d \frac{n}{2} \log \frac{n}{2} \right) + cn \\\\
&= d n (\log n - \log 2) + cn \\\\
&= d n \log n - dn + cn \\\\
&= d n \log n - (d - c)n
\end{align*}
$$
We want $T(n) \le d n \log n$. This requires the residual term $-(d-c)n$ to be $\le 0$.
$$-(d-c)n \le 0 \implies d \ge c$$
Since we can pick $d$ large enough ($d \ge c$), the guess holds.
Thus, $T(n) = O(n \log n)$.

---

## References

* **CLRS**: Chapter 2 (Merge Sort), Chapter 4 (Divide-and-Conquer, Recurrences).
