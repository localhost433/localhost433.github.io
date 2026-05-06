---
title: 23 - All-Pairs Shortest Paths (Floyd-Warshall)
date: 2026-04-20
---

## Roadmap

This lecture covers the **All-Pairs Shortest Paths (APSP)** problem. We motivate the problem, review naive approaches, and develop the **Floyd-Warshall** algorithm via dynamic programming.

1. **APSP Problem**: Definition and input format.
2. **Naive Approaches**: Running Dijkstra/Bellman-Ford for each source.
3. **DP Attempt 1**: Subproblem by number of edges — $O(V^4)$.
4. **DP Attempt 2**: Repeated squaring — $O(V^3 \log V)$.
5. **Floyd-Warshall**: Subproblem by intermediate vertex set — $O(V^3)$.

---

## 1. The APSP Problem

**Why Dijkstra doesn't handle negative weights**:

Even with no negative cycles, Dijkstra can give wrong answers. Example: $s \to b$ with weight 10, $s \to d$ with weight 100, $d \to c$ with weight $-200$, $c \to b$ with weight 1. Dijkstra returns $\delta(s,b) = 10$ but the true answer is $-99$ (path $s \to d \to c \to b$). The algorithm is "too greedy."

**Input**: Directed graph $G = (V, E)$ with weight function $w: E \to \mathbb{R}$, no negative cycles. Graph given as an $n \times n$ weight matrix:

$$W[u,v] = \begin{cases} 0 & \text{if } u = v \\ w(u,v) & \text{if } (u,v) \in E \\ \infty & \text{if } (u,v) \notin E \end{cases}$$

**Output**: $\delta(u,v)$ for all pairs $u, v \in V$.

---

## 2. Naive Approaches

**Run Dijkstra from each source**: $O(|V| \cdot (|V| \log |V| + |E|))$. Only works for non-negative weights.

**Run Bellman-Ford from each source**: $O(|V|^2 \cdot |E|)$. Works for negative weights, but slow.

---

## 3. DP Attempt 1: Bound by Edge Count

**Subproblem**: $W[u,v,k]$ = shortest path from $u$ to $v$ using at most $k$ edges.

**Observation**: Shortest paths are simple (no cycles), so they use at most $|V|-1$ edges.

**Recurrence**:
$$W[u,v,k] = \begin{cases} w(u,v) & k = 1 \\ \min_{x \in V} \bigl( W[u,x,k-1] + w(x,v) \bigr) & k > 1 \end{cases}$$

**Running time**: $|V| \times |V| \times |V|$ subproblems $\times$ $|V|$ guess for $x$ = $O(|V|^4)$.

---

## 4. DP Attempt 2: Repeated Squaring

**Key observation**: Instead of increasing $k$ by 1 each time, use powers of 2.

**Recurrence** (for $k$ a power of 2):
$$W[u,v,k] = \begin{cases} w(u,v) & k = 1 \\ \min_{x \in V} \bigl( W[u,x,k/2] + W[x,v,k/2] \bigr) & k > 1 \end{cases}$$

**Running time**: $|V|^2 \times \log|V|$ subproblems $\times |V|$ guess = $O(|V|^3 \log |V|)$.

Better, but Floyd-Warshall achieves $O(|V|^3)$ with a different subproblem definition.

---

## 5. Floyd-Warshall Algorithm

**Idea**: Order the vertices arbitrarily $v_1, v_2, \dots, v_n$. Parameterize subproblems by which vertices are allowed as **intermediates**.

**Subproblem**: $D[u, v, i]$ = shortest path from $u$ to $v$ using only vertices from $\{v_1, \dots, v_i\}$ as intermediate vertices.

**Key observation**: For the shortest $u \to v$ path using only $\{v_1,\dots,v_i\}$:

* **Case 1**: $v_i$ is **not** on the path. Then $D[u,v,i] = D[u,v,i-1]$.
* **Case 2**: $v_i$ **is** on the path. Then the sub-paths $u \to v_i$ and $v_i \to v$ both use only $\{v_1,\dots,v_{i-1}\}$. So $D[u,v,i] = D[u,v_i,i-1] + D[v_i,v,i-1]$.

**Guess**: Is $v_i$ on the path or not?

**Recurrence**:
$$D[u,v,i] = \begin{cases} w(u,v) & i = 0 \\ \min\bigl(D[u,v,i-1],\; D[u,v_i,i-1] + D[v_i,v,i-1]\bigr) & i > 0 \end{cases}$$

**Output**: $D[u,v,n]$ for each pair $u, v \in V$.

### Pseudocode

```text
FLOYD-WARSHALL(W)
1. n = W.rows
2. D^(0) = W
3. for i = 1 to n
4.     let D^(i) be a new n x n matrix
5.     for u = 1 to n
6.         for v = 1 to n
7.             D^(i)[u,v] = min(D^(i-1)[u,v],
8.                              D^(i-1)[u,i] + D^(i-1)[i,v])
9. return D^(n)
```

**Running time**: $O(|V|^3)$ — three nested loops.
**Space**: $O(|V|^2)$ (only two matrices needed at a time, or in-place with care).

### Worked Example

Graph with $V = \{v_1, v_2, v_3, v_4, v_5, v_6\}$:

Computing $D[v_3, v_5, i]$ through successive iterations:

* $D[v_3, v_5, 0] = \infty$ (no direct edge)
* $D[v_3, v_5, 1] = \infty$ (no path through $v_1$ only)
* $D[v_3, v_5, 2] = 5$ (path $v_3 \to v_2 \to v_5$)
* $D[v_3, v_5, 3] = 5$ (no improvement through $v_3$)
* $D[v_3, v_5, 4] = -190$ (path through $v_4$ exploits a negative edge)
* $D[v_3, v_5, 5] = -190$ (no improvement)
* $D[v_3, v_5, 6] = -195$ (final answer through $v_6$)

---

## Summary: APSP Algorithms

| Algorithm | Weights | Time |
|---|---|---|
| Dijkstra from each vertex | Non-negative | $O(V(V \log V + E))$ |
| Bellman-Ford from each vertex | Any | $O(V^2 E)$ |
| DP Attempt 1 | Any | $O(V^4)$ |
| DP Attempt 2 (repeated squaring) | Any | $O(V^3 \log V)$ |
| Floyd-Warshall | Any (no neg. cycles) | $O(V^3)$ |

---

## References

* **CLRS**: Chapter 25 — All-Pairs Shortest Paths (Section 25.2: Floyd-Warshall).
