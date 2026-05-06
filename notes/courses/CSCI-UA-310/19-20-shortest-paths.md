---
title: 19/20 - Shortest Paths
date: 2026-04-06/08
---

## Roadmap

These lectures cover the **Single-Source Shortest Paths (SSSP)** problem. We develop Dijkstra's algorithm for graphs with non-negative edge weights, then extend to Bellman-Ford for negative weights and negative cycle detection, and finally show a fast $O(V+E)$ algorithm for DAGs.

1. **SSSP Problem**: Definitions and properties.
2. **Relaxation**: The key operation.
3. **Dijkstra's Algorithm**: Greedy SSSP for non-negative weights.
4. **Analysis of Dijkstra**: Running time with different priority queues.
5. **Bellman-Ford Algorithm**: Repeated relaxation for general weights.
6. **Correctness of Bellman-Ford**: Why $|V|-1$ rounds suffice.
7. **Negative Cycle Detection**.
8. **SSSP on DAGs**: A faster $O(V+E)$ algorithm using topological order.

---

## 1. The SSSP Problem

**Input**: A directed graph $G = (V, E)$ with non-negative weight function $w: E \to \mathbb{R}^{\geq 0}$ and a source vertex $s \in V$.

**Output**: The shortest-path weight $\delta(s, v)$ for all $v \in V$, where:
$$\delta(s, v) = \min \{ w(p) : s \xrightarrow{p} v \}$$
and $\delta(s, v) = \infty$ if no path exists.

**Shortest-path properties**:

* **Optimal substructure**: Any subpath of a shortest path is itself a shortest path.
* **Triangle inequality**: $\delta(s, v) \leq \delta(s, u) + w(u, v)$ for all edges $(u,v)$.
* **No negative cycles**: If a negative cycle is reachable from $s$, shortest paths are undefined (can be made arbitrarily small).

---

## 2. Relaxation

All SSSP algorithms maintain estimates $v.d \geq \delta(s,v)$ and predecessors $v.\pi$.

**Initialization**:

```text
INITIALIZE-SINGLE-SOURCE(G, s)
1. for each v in V
2.     v.d = inf
3.     v.π = NIL
4. s.d = 0
```

**Relaxation** of edge $(u, v)$:

```text
RELAX(u, v, w)
1. if v.d > u.d + w(u, v)
2.     v.d = u.d + w(u, v)
3.     v.π = u
```

**Key properties**:

* After `RELAX(u, v, w)`: $v.d \leq u.d + w(u,v)$.
* If $u.d = \delta(s, u)$ at the time of relaxation, then afterwards $v.d \leq \delta(s, v)$.
* $v.d$ never increases.

---

## 3. Dijkstra's Algorithm

Dijkstra's algorithm is a greedy SSSP algorithm. It maintains a set $S$ of vertices whose final shortest-path distances have been determined. At each step, it extracts the vertex $u \notin S$ with the minimum distance estimate and relaxes all its outgoing edges.

**Correctness requires**: Non-negative edge weights (so the greedy choice is safe).

```text
DIJKSTRA(G, w, s)
1. INITIALIZE-SINGLE-SOURCE(G, s)
2. S = empty set
3. Q = V                  // min-priority queue keyed by d
4. while Q is not empty
5.     u = EXTRACT-MIN(Q)
6.     S = S union {u}
7.     for each v in Adj[u]
8.         RELAX(u, v, w)
9.         (decrease-key on Q if v.d was updated)
```

### Correctness

**Loop Invariant**: At the start of each iteration, $u.d = \delta(s, u)$ for all $u \in S$.

**Key argument**: When $u$ is extracted, suppose for contradiction that $u.d > \delta(s, u)$. Then the true shortest path $p$ from $s$ to $u$ must exit $S$ at some edge $(x, y)$ with $y \notin S$. Since $y.d \leq \delta(s, y) \leq \delta(s, u) < u.d$ (using non-negativity for the last inequality), $y$ would have been extracted before $u$ — contradiction.

---

## 4. Analysis of Dijkstra

The running time depends on the priority queue implementation:

| Priority Queue | EXTRACT-MIN | DECREASE-KEY | Total |
|---|---|---|---|
| Array | $O(V)$ | $O(1)$ | $O(V^2 + E) = O(V^2)$ |
| Binary heap | $O(\log V)$ | $O(\log V)$ | $O((V + E) \log V)$ |
| Fibonacci heap | $O(\log V)$ amort. | $O(1)$ amort. | $O(V \log V + E)$ |

**With array**: Best for dense graphs ($E = \Theta(V^2)$). Total: $O(V^2)$.

**With binary heap**: Best for sparse graphs. Total: $O((V + E) \log V)$.

**With Fibonacci heap**: Theoretically optimal: $O(V \log V + E)$.

### Worked Example

Graph with vertices $\{s, a, b, c, d\}$ and edges:
$(s,a,10), (s,c,3), (a,b,1), (a,c,4), (b,d,7), (c,a,4), (c,b,8), (c,d,2), (d,b,5)$.

Initial: $s.d=0$, all others $\infty$.

| Step | Extract | Distances after relaxation |
|---|---|---|
| 1 | $s$ | $a.d=10, c.d=3$ |
| 2 | $c$ | $a.d=7, b.d=11, d.d=5$ |
| 3 | $d$ | $b.d=10$ |
| 4 | $a$ | $b.d=8$ |
| 5 | $b$ | done |

Final: $\delta(s,a)=7, \delta(s,b)=8, \delta(s,c)=3, \delta(s,d)=5$.

---

## 5. Bellman-Ford Algorithm

Dijkstra fails with negative weights because the greedy choice can be wrong: a shorter path through a negative edge might arrive later. Bellman-Ford uses **dynamic programming** instead.

**Key insight**: Any shortest path in a graph without negative cycles is a simple path and uses at most $|V|-1$ edges.

```text
BELLMAN-FORD(G, w, s)
1. INITIALIZE-SINGLE-SOURCE(G, s)
2. for i = 1 to |V| - 1
3.     for each edge (u, v) in E
4.         RELAX(u, v, w)
5. for each edge (u, v) in E
6.     if v.d > u.d + w(u, v)
7.         return FALSE       // negative cycle exists
8. return TRUE
```

**Running time**: $O(VE)$ — $|V|-1$ rounds, each examining all $|E|$ edges.

---

## 6. Correctness of Bellman-Ford

**Theorem**: After $k$ iterations of the outer loop, $v.d \leq$ the weight of the shortest path from $s$ to $v$ using **at most $k$ edges**.

**Proof by induction**:

* After 0 iterations: $s.d = 0 = \delta_0(s,s)$ and $v.d = \infty$ for $v \neq s$. Correct (no 0-edge paths to others).
* After $k$ iterations: Assume $v.d \leq \delta_{k-1}(s,v)$ for all $v$ after $k-1$ iterations. When we relax edge $(u,v)$: $v.d \leq u.d + w(u,v) \leq \delta_{k-1}(s,u) + w(u,v) = \delta_k(s,v)$.

After $|V|-1$ iterations, since shortest simple paths use at most $|V|-1$ edges: $v.d = \delta(s,v)$ for all reachable $v$.

---

## 7. Negative Cycle Detection

After $|V|-1$ rounds, if any edge $(u,v)$ still satisfies $v.d > u.d + w(u,v)$, then there is a negative-weight cycle reachable from $s$.

**Why**: If no negative cycle exists, after $|V|-1$ rounds all $v.d = \delta(s,v)$, and no further relaxation is possible. If a relaxation is still possible, a path using $|V|$ edges (containing a cycle) is shorter than any simple path — the cycle must be negative.

---

## 8. SSSP on DAGs

For **directed acyclic graphs (DAGs)**, we can solve SSSP in $\Theta(V + E)$ time, even with negative weights, by processing vertices in **topological order**.

**Correctness**: When we process vertex $u$, all predecessors of $u$ have already been processed and their distances are finalized (topological order ensures no back edges, so no shorter path will arrive later).

```text
DAG-SHORTEST-PATHS(G, w, s)
1. Topologically sort the vertices of G
2. INITIALIZE-SINGLE-SOURCE(G, s)
3. for each vertex u in topological order
4.     for each v in Adj[u]
5.         RELAX(u, v, w)
```

**Running time**: $\Theta(V + E)$ (topological sort + one pass over all edges).

**Application**: Critical path analysis in project scheduling (set edge weights to negative task durations and find shortest paths to get the longest path / critical path).

---

## Summary: SSSP Algorithms

| Algorithm | Weights | Time |
|---|---|---|
| Dijkstra (array) | Non-negative | $O(V^2)$ |
| Dijkstra (binary heap) | Non-negative | $O((V+E) \log V)$ |
| Dijkstra (Fibonacci heap) | Non-negative | $O(V \log V + E)$ |
| Bellman-Ford | Any (no neg. cycles) | $O(VE)$ |
| DAG Shortest Paths | Any (DAG) | $\Theta(V+E)$ |

---

## References

* **CLRS**: Chapter 24 — Single-Source Shortest Paths (Sections 24.1–24.3).
