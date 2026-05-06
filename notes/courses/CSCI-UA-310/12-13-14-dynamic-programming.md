---
title: 12/13/14 - Dynamic Programming
date: 2026-03-02/04/09
---

## Roadmap

**Dynamic Programming (DP)** is an algorithm design paradigm for solving optimization problems by breaking them into overlapping subproblems and storing results to avoid redundant computation. These lectures introduce the core concepts and apply the DP recipe to five classical problems: rod cutting, LCS, 0/1 knapsack, matrix chain multiplication, and subset sum.

1. **Motivation**: Overlapping subproblems vs. divide-and-conquer.
2. **The DP Recipe**: Four steps.
3. **Rod Cutting**: Problem formulation, naive recursion, and DP solutions.
4. **Reconstructing Solutions**.
5. **Longest Common Subsequence**: Problem, recurrence, $O(mn)$ solution.
6. **0/1 Knapsack**: Problem, recurrence, $O(nW)$ solution.
7. **Fibonacci Revisited**: Top-down vs. bottom-up.
8. **Matrix Chain Multiplication**: Interval subproblems, $O(n^3)$ solution.
9. **Subset Sum**: Boolean DP, $O(nW)$ solution.

---

## 1. Motivation

**Divide and conquer** works when subproblems are independent (e.g., Merge Sort). When subproblems **overlap** (the same subproblem is solved many times), plain recursion does redundant work.

**Dynamic programming** solves each subproblem exactly once and stores the result in a table.

**Two key properties for DP to apply**:
1. **Optimal substructure**: An optimal solution to the problem contains optimal solutions to subproblems.
2. **Overlapping subproblems**: The recursive solution revisits the same subproblems repeatedly.

---

## 2. The DP Recipe

1. **Define subproblems**: Identify a small number of subproblem types parameterized by a small set of variables.
2. **Write a recurrence**: Express the optimal value for a subproblem in terms of smaller subproblems. Identify the "guess" (choice that splits the problem).
3. **Topological order**: Determine the order to solve subproblems (usually smallest to largest).
4. **Compute the answer**: Combine results; trace back if the actual solution (not just the value) is needed.

**Running time**: (# subproblems) $\times$ (time per subproblem).

---

## 3. Rod Cutting

**Problem**: Given a rod of length $n$ and a price table $p[1 \dots n]$ where $p[i]$ is the price for a rod of length $i$, find the maximum revenue $r_n$ obtainable by cutting the rod into integer-length pieces.

**Example price table**:

| Length $i$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Price $p[i]$ | 1 | 5 | 8 | 9 | 10 | 17 | 17 | 20 | 24 | 30 |

### Naive Recursive Solution

$$r_n = \max_{1 \leq i \leq n}(p[i] + r_{n-i})$$

with $r_0 = 0$.

```text
CUT-ROD(p, n)
1. if n == 0
2.     return 0
3. q = -inf
4. for i = 1 to n
5.     q = max(q, p[i] + CUT-ROD(p, n-i))
6. return q
```

**Running time**: $T(n) = 1 + \sum_{j=0}^{n-1} T(j)$, giving $T(n) = 2^n$ — exponential due to redundant subproblems.

### Bottom-Up Dynamic Programming

Solve subproblems in order of increasing size, filling a table $r[0 \dots n]$.

```text
BOTTOM-UP-CUT-ROD(p, n)
1. let r[0..n] be a new array
2. r[0] = 0
3. for j = 1 to n
4.     q = -inf
5.     for i = 1 to j
6.         q = max(q, p[i] + r[j-i])
7.     r[j] = q
8. return r[n]
```

**Running time**: $\Theta(n^2)$ — two nested loops.

### Top-Down Memoization

```text
MEMOIZED-CUT-ROD(p, n)
1. let r[0..n] be a new array initialized to -inf
2. return MEMOIZED-CUT-ROD-AUX(p, n, r)

MEMOIZED-CUT-ROD-AUX(p, n, r)
1. if r[n] >= 0
2.     return r[n]
3. if n == 0
4.     q = 0
5. else
6.     q = -inf
7.     for i = 1 to n
8.         q = max(q, p[i] + MEMOIZED-CUT-ROD-AUX(p, n-i, r))
9. r[n] = q
10. return q
```

**Running time**: $\Theta(n^2)$ — each subproblem is solved once.

---

## 4. Reconstructing the Solution

To recover the actual cuts (not just the optimal value), store the cut choice:

```text
EXTENDED-BOTTOM-UP-CUT-ROD(p, n)
1. let r[0..n] and s[0..n] be new arrays
2. r[0] = 0
3. for j = 1 to n
4.     q = -inf
5.     for i = 1 to j
6.         if p[i] + r[j-i] > q
7.             q = p[i] + r[j-i]
8.             s[j] = i           // record first cut of size i
9.     r[j] = q
10. return r and s

PRINT-CUT-ROD-SOLUTION(p, n)
1. (r, s) = EXTENDED-BOTTOM-UP-CUT-ROD(p, n)
2. while n > 0
3.     print s[n]
4.     n = n - s[n]
```

---

## 5. Longest Common Subsequence

### Problem

A **subsequence** of a sequence is the sequence with zero or more elements removed (not necessarily contiguous).

**Input**: Two sequences $X = \langle x_1, x_2, \dots, x_m \rangle$ and $Y = \langle y_1, y_2, \dots, y_n \rangle$.

**Output**: The length of the longest common subsequence (LCS) of $X$ and $Y$.

**Example**: $X = \langle A, B, C, B, D, A, B \rangle$, $Y = \langle B, D, C, A, B, A \rangle$.
LCS: $\langle B, C, B, A \rangle$ (length 4) or $\langle B, D, A, B \rangle$ (length 4).

### Optimal Substructure

**Theorem**: Let $Z = \langle z_1, \dots, z_k \rangle$ be any LCS of $X$ and $Y$.

1. If $x_m = y_n$, then $z_k = x_m = y_n$ and $Z_{k-1}$ is an LCS of $X_{m-1}$ and $Y_{n-1}$.
2. If $x_m \neq y_n$ and $z_k \neq x_m$, then $Z$ is an LCS of $X_{m-1}$ and $Y$.
3. If $x_m \neq y_n$ and $z_k \neq y_n$, then $Z$ is an LCS of $X$ and $Y_{n-1}$.

### Recurrence

Define $c[i,j]$ = length of LCS of $X_i = \langle x_1,\dots,x_i \rangle$ and $Y_j = \langle y_1,\dots,y_j \rangle$.

$$c[i,j] = \begin{cases} 0 & \text{if } i = 0 \text{ or } j = 0 \\ c[i-1,j-1] + 1 & \text{if } i,j > 0 \text{ and } x_i = y_j \\ \max(c[i-1,j],\; c[i,j-1]) & \text{if } i,j > 0 \text{ and } x_i \neq y_j \end{cases}$$

### Algorithm

```text
LCS-LENGTH(X, Y)
1. m = X.length, n = Y.length
2. let b[1..m, 1..n] and c[0..m, 0..n] be new tables
3. for i = 1 to m:  c[i, 0] = 0
4. for j = 0 to n:  c[0, j] = 0
5. for i = 1 to m
6.     for j = 1 to n
7.         if x_i == y_j
8.             c[i,j] = c[i-1,j-1] + 1
9.             b[i,j] = "↖"
10.        elif c[i-1,j] >= c[i,j-1]
11.            c[i,j] = c[i-1,j]
12.            b[i,j] = "↑"
13.        else
14.            c[i,j] = c[i,j-1]
15.            b[i,j] = "←"
16. return c and b
```

**Running time**: $\Theta(mn)$ time and space.

**Reconstruction**: Follow the $b$ table from $b[m,n]$ back to $b[1,1]$ to print the LCS.

---

## 6. 0/1 Knapsack

### Problem

**Input**: $n$ items where item $i$ has weight $w_i \in \mathbb{Z}^+$ and value $v_i \geq 0$; knapsack capacity $W \in \mathbb{Z}^+$.

**Output**: Choose a subset $S \subseteq \{1, \dots, n\}$ to maximize $\sum_{i \in S} v_i$ subject to $\sum_{i \in S} w_i \leq W$.

The **0/1** constraint means each item is either taken or not (no fractions).

### Optimal Substructure

For item $n$:
* **Skip item $n$**: optimal value from items $\{1,\dots,n-1\}$ with capacity $W$.
* **Take item $n$** (if $w_n \leq W$): $v_n$ plus optimal value from items $\{1,\dots,n-1\}$ with capacity $W - w_n$.

### Recurrence

Define $\text{OPT}(i, w)$ = maximum value using items $\{1,\dots,i\}$ with capacity $w$.

$$\text{OPT}(i, w) = \begin{cases} 0 & \text{if } i = 0 \\ \text{OPT}(i-1, w) & \text{if } w_i > w \\ \max\bigl(\text{OPT}(i-1, w),\; v_i + \text{OPT}(i-1, w - w_i)\bigr) & \text{otherwise} \end{cases}$$

### Algorithm

```text
KNAPSACK(n, W, w[1..n], v[1..n])
1. let OPT[0..n, 0..W] be a new table, initialized to 0
2. for i = 1 to n
3.     for w = 0 to W
4.         OPT[i, w] = OPT[i-1, w]           // skip item i
5.         if w_i <= w
6.             OPT[i, w] = max(OPT[i, w], v_i + OPT[i-1, w - w_i])
7. return OPT[n, W]
```

**Running time**: $O(nW)$ time and space.

**Note**: $O(nW)$ is **pseudopolynomial** — it is polynomial in $n$ and $W$, but $W$ can be exponential in the number of bits required to represent it. The 0/1 Knapsack problem is NP-hard.

### Worked Example

Items: $(w_1, v_1) = (2, 6)$, $(w_2, v_2) = (2, 10)$, $(w_3, v_3) = (3, 12)$. Capacity $W = 5$.

| $i \backslash w$ | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 6 | 6 | 6 | 6 |
| 2 | 0 | 0 | 10 | 10 | 16 | 16 |
| 3 | 0 | 0 | 10 | 12 | 16 | 22 |

Optimal value: $\text{OPT}(3,5) = 22$ (take items 2 and 3).

---

## 7. Fibonacci Revisited

Computing the $n$-th Fibonacci number $F(n) = F(n-1) + F(n-2)$, $F(0) = 0$, $F(1) = 1$.

**Naive recursion**: $T(n) = T(n-1) + T(n-2) + O(1)$, giving $T(n) = \Theta(\phi^n)$ — exponential.

**DP (bottom-up)**: Compute $F(0), F(1), \dots, F(n)$ in order.

```text
FIBONACCI-DP(n)
1. let F[0..n] be a new array
2. F[0] = 0, F[1] = 1
3. for i = 2 to n
4.     F[i] = F[i-1] + F[i-2]
5. return F[n]
```

**Running time**: $\Theta(n)$ time, $\Theta(n)$ space (reducible to $O(1)$ by keeping only last two values).

---

## 8. Matrix Chain Multiplication

### Problem

**Input**: A chain of $n$ matrices $A_1, A_2, \dots, A_n$ where $A_i$ has dimensions $p_{i-1} \times p_i$.

**Output**: Fully parenthesize the product $A_1 A_2 \cdots A_n$ to minimize the total number of scalar multiplications.

**Key fact**: Multiplying a $p \times q$ matrix by a $q \times r$ matrix costs $p \cdot q \cdot r$ scalar multiplications.

**Example**: For $A_1 (30 \times 35)$, $A_2 (35 \times 15)$, $A_3 (15 \times 5)$, $A_4 (5 \times 10)$:
* $((A_1 A_2) A_3) A_4$: $30 \cdot 35 \cdot 15 + 30 \cdot 15 \cdot 5 + 30 \cdot 5 \cdot 10 = 18{,}000$ multiplications.
* $(A_1 (A_2 (A_3 A_4)))$: $15 \cdot 5 \cdot 10 + 35 \cdot 15 \cdot 10 + 30 \cdot 35 \cdot 10 = 16{,}250$ multiplications.

### Optimal Substructure

Any optimal parenthesization of $A_i A_{i+1} \cdots A_j$ must split at some $k$ ($i \leq k < j$) into $(A_i \cdots A_k)(A_{k+1} \cdots A_j)$. Each part must also be optimally parenthesized.

### Recurrence

Define $m[i,j]$ = minimum number of multiplications to compute $A_i \cdots A_j$.

$$m[i,j] = \begin{cases} 0 & \text{if } i = j \\ \min_{i \leq k < j} \bigl( m[i,k] + m[k+1,j] + p_{i-1} \cdot p_k \cdot p_j \bigr) & \text{if } i < j \end{cases}$$

**Guess**: the split position $k$.

### Algorithm

Solve by increasing **chain length** $\ell = j - i$.

```text
MATRIX-CHAIN-ORDER(p)
1. n = p.length - 1
2. let m[1..n, 1..n] and s[1..n-1, 2..n] be new tables
3. for i = 1 to n:  m[i,i] = 0
4. for l = 2 to n          // chain length
5.     for i = 1 to n-l+1
6.         j = i + l - 1
7.         m[i,j] = inf
8.         for k = i to j-1
9.             q = m[i,k] + m[k+1,j] + p[i-1]*p[k]*p[j]
10.            if q < m[i,j]
11.                m[i,j] = q
12.                s[i,j] = k
13. return m and s
```

**Running time**: $\Theta(n^3)$ — three nested loops.
**Space**: $\Theta(n^2)$.

---

## 9. Subset Sum

### Problem

**Input**: A set $S = \{a_1, a_2, \dots, a_n\}$ of positive integers and a target $W$.

**Output**: Does there exist a subset $T \subseteq S$ such that $\sum_{a \in T} a = W$?

### Recurrence

Define $\text{DP}[i][w] = \mathtt{true}$ if some subset of $\{a_1, \dots, a_i\}$ sums to exactly $w$.

$$\text{DP}[i][w] = \text{DP}[i-1][w] \;\lor\; \bigl(w \geq a_i \;\land\; \text{DP}[i-1][w - a_i]\bigr)$$

Base cases: $\text{DP}[i][0] = \mathtt{true}$ for all $i$; $\text{DP}[0][w] = \mathtt{false}$ for $w > 0$.

### Algorithm

```text
SUBSET-SUM(a[1..n], W)
1. let DP[0..n, 0..W] be a Boolean table
2. for i = 0 to n:  DP[i][0] = true
3. for w = 1 to W:  DP[0][w] = false
4. for i = 1 to n
5.     for w = 0 to W
6.         DP[i][w] = DP[i-1][w]
7.         if w >= a[i]
8.             DP[i][w] = DP[i][w] OR DP[i-1][w - a[i]]
9. return DP[n][W]
```

**Running time**: $O(nW)$ — pseudopolynomial (Subset Sum is NP-complete).

**Worked Example**: $S = \{3, 5, 1\}$, $W = 9$.
* Subset $\{3, 5, 1\}$: sum $= 9$. Answer: **yes**.

---

## References

* **CLRS**: Chapter 15 — Dynamic Programming (Sections 15.1–15.4).
