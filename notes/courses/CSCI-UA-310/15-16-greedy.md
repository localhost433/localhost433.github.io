---
title: 15/16 - Greedy Algorithms
date: 2026-03-23/25
---

## Roadmap

**Greedy algorithms** build up a solution by making locally optimal choices at each step, without reconsidering past decisions. These lectures introduce greedy thinking and apply it to interval scheduling, fractional knapsack, interval partitioning on multiple machines, and Huffman coding.

1. **Greedy vs. DP**: When greediness works.
2. **Interval Scheduling**: Maximizing non-overlapping intervals.
3. **Fractional Knapsack**: A greedy solution to a relaxed knapsack.
4. **Exchange Argument**: The canonical proof technique.
5. **Interval Partitioning**: Scheduling on minimum machines.
6. **Huffman Coding**: Optimal prefix-free codes.
7. **Huffman's Algorithm**: Greedy construction via a priority queue.
8. **Correctness Proof**: Two key lemmas.

---

## 1. Greedy vs. Dynamic Programming

Both exploit **optimal substructure**. The difference:

* **DP**: Considers all choices (filling a table of subproblems).
* **Greedy**: Makes one locally optimal choice and never looks back.

A greedy algorithm is correct when the **greedy choice property** holds: a globally optimal solution can always be reached by making the locally greedy choice first.

**Advantage**: Greedy algorithms are typically faster and simpler than DP.

---

## 2. Interval Scheduling (Activity Selection)

### Problem

**Input**: $n$ activities, each with start time $s_i$ and finish time $f_i$. Two activities $i$ and $j$ are **compatible** if they do not overlap (i.e., $[s_i, f_i)$ and $[s_j, f_j)$ are disjoint).

**Output**: A maximum-size set of mutually compatible activities.

### Greedy Algorithm

**Greedy rule**: Always select the compatible activity with the **earliest finish time**.

```text
GREEDY-ACTIVITY-SELECTOR(s, f)
1. Sort activities by finish time: f[1] <= f[2] <= ... <= f[n]
2. A = {1}                  // select first activity
3. k = 1                    // last selected activity
4. for m = 2 to n
5.     if s[m] >= f[k]      // m is compatible with last selected
6.         A = A union {m}
7.         k = m
8. return A
```

**Running time**: $O(n \log n)$ for sorting; $O(n)$ for selection. Total: $O(n \log n)$.

### Correctness (Exchange Argument)

**Theorem**: `GREEDY-ACTIVITY-SELECTOR` produces an optimal solution.

**Proof**:
Let $A = \{a_1, a_2, \dots, a_k\}$ (greedy solution, sorted by finish time) and $O = \{o_1, o_2, \dots, o_m\}$ (any optimal solution, sorted by finish time). We show $|A| = |O|$, i.e., $k = m$.

**Key Lemma**: For each $i = 1, \dots, k$: $f(a_i) \leq f(o_i)$.
* Base: Greedy picks the activity with the smallest finish time overall, so $f(a_1) \leq f(o_1)$.
* Inductive step: Since $f(a_i) \leq f(o_i) \leq s(o_{i+1})$, activity $o_{i+1}$ is also compatible with $a_i$. The greedy algorithm could have picked something with finish time $\leq f(o_{i+1})$, so $f(a_{i+1}) \leq f(o_{i+1})$.

Since the greedy finishes no later than optimal at each step, if $O$ has $m$ activities, the greedy can always extend to at least $m$ activities, so $k \geq m$. Hence $k = m$.

---

## 3. Fractional Knapsack

### Problem

Same as 0/1 Knapsack but items can be split: take a **fraction** $x_i \in [0,1]$ of item $i$.

**Input**: $n$ items with weights $w_i$ and values $v_i$; capacity $W$.

**Output**: Fractions $x_1, \dots, x_n \in [0,1]$ maximizing $\sum_i x_i v_i$ subject to $\sum_i x_i w_i \leq W$.

### Greedy Algorithm

**Key insight**: Take as much as possible of the item with the highest **value density** $v_i / w_i$.

```text
FRACTIONAL-KNAPSACK(w, v, W)
1. Sort items by value density v[i]/w[i] in decreasing order
2. totalWeight = 0, totalValue = 0
3. for i = 1 to n
4.     if totalWeight + w[i] <= W
5.         take all of item i
6.         totalWeight += w[i], totalValue += v[i]
7.     else
8.         fraction = (W - totalWeight) / w[i]
9.         totalValue += fraction * v[i]
10.        break
11. return totalValue
```

**Running time**: $O(n \log n)$ for sorting.

**Correctness**: If we did not take the highest-density item first, we could swap some fraction of a lower-density item for a fraction of the highest-density item, increasing total value. (Exchange argument.)

**Note**: This greedy does **not** work for 0/1 Knapsack (no fractions allowed). That problem requires DP and is NP-hard.

---

## 4. The Exchange Argument (Proof Template)

The exchange argument is the canonical way to prove greedy correctness:

1. Consider an optimal solution $O$ and the greedy solution $A$.
2. If $A \neq O$, find the first position where they differ.
3. Swap the optimal's choice for the greedy's choice. Show the solution does not get worse.
4. Repeat until $O$ is transformed into $A$, proving $A$ is optimal.

---

## 5. Interval Partitioning (Scheduling on Multiple Machines)

### Problem

**Input**: $n$ jobs with start times $s_j$ and finish times $f_j$.

**Output**: Assign each job to a machine such that no two overlapping jobs are on the same machine, using the **minimum number of machines**.

**Definition**: The **depth** of a set of intervals is the maximum number of intervals that contain any single point $t$.

**Lower bound**: We need at least depth($\mathcal{I}$) machines.

### Greedy Algorithm

Sort jobs by start time. Maintain a set of machines. For each job, assign it to any machine that is free; if none is free, open a new machine.

**Theorem**: This greedy uses exactly depth($\mathcal{I}$) machines.

**Proof**: When the greedy opens a $d$-th machine, it is because all $d-1$ existing machines are busy, meaning $d$ intervals overlap at that point. Thus depth $\geq d$. Since the lower bound matches the greedy's output, the greedy is optimal.

---

## 6. Huffman Coding

### Problem

**Input**: An alphabet $C = \{c_1, \dots, c_n\}$ where character $c_i$ has frequency $f_i$.

**Goal**: Assign a binary codeword to each character such that:
* The code is **prefix-free** (no codeword is a prefix of another).
* The **total encoding length** $\sum_{c \in C} f_c \cdot d_T(c)$ is minimized, where $d_T(c)$ is the depth of $c$ in the code tree $T$.

**Prefix-free codes** are represented by binary trees where characters are leaves.

**Total bits** = $B(T) = \sum_{c \in C} f_c \cdot d_T(c)$.

**Example**: Characters $\{a, b, c, d, e, f\}$ with frequencies $\{45, 13, 12, 16, 9, 5\}$.
An optimal encoding gives $B(T) = 224$ bits per 100 characters (vs. 300 for fixed-length).

---

## 7. Huffman's Algorithm

**Greedy rule**: Merge the two characters (or subtrees) with the **smallest frequencies** into a new subtree. Repeat until one tree remains.

```text
HUFFMAN(C)
1. n = |C|
2. Q = C                    // min-priority queue keyed by frequency
3. for i = 1 to n-1
4.     allocate a new node z
5.     z.left  = x = EXTRACT-MIN(Q)
6.     z.right = y = EXTRACT-MIN(Q)
7.     z.freq  = x.freq + y.freq
8.     INSERT(Q, z)
9. return EXTRACT-MIN(Q)    // the root of the tree
```

**Running time**: $O(n \log n)$ using a binary min-heap.

### Worked Example

Frequencies: $a:45, b:13, c:12, d:16, e:9, f:5$.

Step-by-step merges:
1. Merge $f(5)$ and $e(9)$ → node $fe(14)$.
2. Merge $c(12)$ and $b(13)$ → node $cb(25)$.
3. Merge $fe(14)$ and $d(16)$ → node $fed(30)$.
4. Merge $cb(25)$ and $fed(30)$ → node $cbfed(55)$.
5. Merge $a(45)$ and $cbfed(55)$ → root $(100)$.

Resulting codewords: $a = 0$, $c = 100$, $b = 101$, $d = 111$, $f = 1100$, $e = 1101$.

$B(T) = 45 \cdot 1 + 13 \cdot 3 + 12 \cdot 3 + 16 \cdot 3 + 9 \cdot 4 + 5 \cdot 4 = 224$.

---

## 8. Correctness Proof

### Lemma 1 (Greedy Choice Property)

Let $x$ and $y$ be the two characters with the smallest frequencies. There exists an optimal prefix-free code in which $x$ and $y$ have codewords of the same length that differ only in the last bit (i.e., they are siblings in the code tree).

**Proof**: Take any optimal tree $T$. Let $b$ and $c$ be siblings at maximum depth. WLOG $f_b \leq f_c$ and $f_x \leq f_y$. Swapping $x \leftrightarrow b$ and $y \leftrightarrow c$ does not increase $B(T)$ because $x, y$ have the smallest frequencies and move to the deepest positions.

### Lemma 2 (Optimal Substructure)

Let $T$ be an optimal code tree for $C$, and suppose $x$ and $y$ are sibling leaves. Let $T'$ be $T$ with $x$ and $y$ replaced by their parent $z$ with $f_z = f_x + f_y$. Then $T'$ is optimal for $C' = C \setminus \{x, y\} \cup \{z\}$.

**Proof**: $B(T) = B(T') + f_x + f_y$. If $T'$ were not optimal for $C'$, a better $T''$ for $C'$ would give a tree better than $T$ for $C$, contradicting optimality.

**Combining**: By Lemma 1, we may assume the greedy merges $x$ and $y$ first. By Lemma 2, the remaining problem is the optimal subproblem with $z$ having frequency $f_x + f_y$. Induction completes the proof.

---

## References

* **CLRS**: Chapter 16 — Greedy Algorithms (Sections 16.1–16.3).
