---
title: 21/22 - Minimum Spanning Trees
date: 2026-04-13/15
---

## Roadmap

These lectures introduce the **Minimum Spanning Tree (MST)** problem, the generic greedy framework underlying both classical algorithms, and present both Kruskal's and Prim's algorithms in full.

1. **MST Problem**: Definition and motivation.
2. **The Generic MST Algorithm**: Cuts, safe edges.
3. **Kruskal's Algorithm**: Sort and merge.
4. **Union-Find Data Structure**: Efficient implementation of Kruskal's.
5. **Prim's Algorithm**: Grow a single tree from a root.
6. **Analysis of Prim's**: Running time with different priority queues.
7. **Comparison**: Kruskal's vs. Prim's.

---

## 1. The MST Problem

**Input**: A connected, undirected graph $G = (V, E)$ with weight function $w: E \to \mathbb{R}$.

**Output**: A spanning tree $T \subseteq E$ that connects all vertices and minimizes total weight:
$$w(T) = \sum_{(u,v) \in T} w(u,v)$$

**Properties of a spanning tree**: $|T| = |V| - 1$, $T$ is connected, $T$ is acyclic.

**Applications**: Network design (telephone networks, electrical grids), clustering.

---

## 2. The Generic MST Algorithm

### 2.1 Cuts and Safe Edges

**Definition (Cut)**: A **cut** $(S, V \setminus S)$ is a partition of $V$ into two non-empty sets.

**Definition (Crossing edge)**: An edge $(u,v)$ **crosses** a cut if $u \in S$ and $v \in V \setminus S$.

**Definition (Light edge)**: An edge crossing a cut is **light** if it has the minimum weight among all edges crossing that cut.

**Theorem (Safe edge rule)**: Let $A \subseteq E$ be a subset of some MST, $(S, V \setminus S)$ be any cut that **respects** $A$ (no edge in $A$ crosses the cut), and $(u,v)$ be a light edge crossing the cut. Then $(u,v)$ is **safe** for $A$ (i.e., $A \cup \{(u,v)\}$ is a subset of some MST).

**Proof sketch**: Let $T$ be an MST containing $A$ but not $(u,v)$. Adding $(u,v)$ to $T$ creates a cycle. This cycle contains another edge $(x,y)$ crossing the cut. Replace $(x,y)$ with $(u,v)$: since $w(u,v) \leq w(x,y)$ (light edge), the new tree $T'$ has $w(T') \leq w(T)$. So $T'$ is also an MST containing $A \cup \{(u,v)\}$.

### 2.2 Generic Algorithm

```text
GENERIC-MST(G, w)
1. A = empty set
2. while A does not form a spanning tree
3.     find a safe edge (u, v) for A
4.     A = A union {(u, v)}
5. return A
```

---

## 3. Kruskal's Algorithm

**Idea**: Sort all edges by weight. Add each edge to $A$ if it does not create a cycle (i.e., connects two different components).

**Why it's safe**: When we add edge $(u,v)$, the cut separates the component containing $u$ from the rest. $(u,v)$ is the lightest edge crossing this cut.

```text
MST-KRUSKAL(G, w)
1. A = empty set
2. for each vertex v in V
3.     MAKE-SET(v)
4. Sort edges in E by non-decreasing weight
5. for each edge (u, v) in sorted order
6.     if FIND-SET(u) != FIND-SET(v)
7.         A = A union {(u, v)}
8.         UNION(u, v)
9. return A
```

**Running time**: $O(E \log E)$ for sorting (dominates). The Union-Find operations cost nearly $O(E \alpha(V))$ total.

---

## 4. Union-Find (Disjoint Set Union)

Kruskal's algorithm needs efficient support for:

- `MAKE-SET(x)`: Create a singleton set $\{x\}$.
- `FIND-SET(x)`: Return the representative of $x$'s set.
- `UNION(x, y)`: Merge the sets containing $x$ and $y$.

### 4.1 Implementation with Union-by-Rank and Path Compression

Each set is represented as a tree. The root is the representative.

**Union by rank**: Attach the smaller-rank tree under the larger-rank tree's root.

**Path compression**: During `FIND-SET`, make every node on the find path point directly to the root.

```text
MAKE-SET(x)
1. x.parent = x
2. x.rank = 0

FIND-SET(x)
1. if x != x.parent
2.     x.parent = FIND-SET(x.parent)   // path compression
3. return x.parent

UNION(x, y)
1. LINK(FIND-SET(x), FIND-SET(y))

LINK(x, y)
1. if x.rank > y.rank
2.     y.parent = x
3. else x.parent = y
4.     if x.rank == y.rank
5.         y.rank = y.rank + 1
```

**Amortized running time**: $O(m \cdot \alpha(n))$ for $m$ operations on $n$ elements, where $\alpha$ is the extremely slowly growing inverse Ackermann function ($\alpha(n) \leq 4$ in practice). Essentially $O(1)$ per operation.

### 4.2 Total Complexity of Kruskal's

$$O(E \log E + E \cdot \alpha(V)) = O(E \log V)$$

since $|E| \leq |V|^2$ so $\log E = O(\log V)$.

---

## 5. Prim's Algorithm

**Idea**: Maintain a single growing tree $A$. At each step, add the **lightest edge** that crosses the cut between $A$'s vertices and the remaining vertices. This is an instance of the generic MST algorithm.

**Why safe**: At each step, the cut $(S, V \setminus S)$ where $S$ is the current tree respects $A$. The lightest crossing edge is safe by the safe-edge theorem.

Each vertex $v \notin S$ maintains:

- `v.key`: minimum weight of any edge connecting $v$ to a vertex in $S$ (or $\infty$ if none).
- `v.π`: the vertex in $S$ that achieves `v.key`.

```text
MST-PRIM(G, w, r)
1. for each u in V
2.     u.key = inf
3.     u.π = NIL
4. r.key = 0
5. Q = V                   // min-priority queue keyed by key
6. while Q is not empty
7.     u = EXTRACT-MIN(Q)
8.     for each v in Adj[u]
9.         if v in Q and w(u, v) < v.key
10.            v.π = u
11.            v.key = w(u, v)    // DECREASE-KEY
```

The MST is $\{ (v, v.\pi) : v \in V \setminus \{r\} \}$.

### 5.1 Correctness

**Loop Invariant**: Before each iteration, $A = \{(v, v.\pi) : v \in V \setminus Q \setminus \{r\}\}$ is a subset of some MST.

When $u$ is extracted, `u.key` = $w(u, u.\pi)$ is the minimum-weight edge from $u$ to the current tree. By the safe-edge theorem (with the cut separating $Q$ from $V \setminus Q$), this edge is safe.

### 5.2 Worked Example

Graph: $V = \{a,b,c,d,e,f,g,h,i\}$, with edges of various weights.

Starting from vertex $a$:

- Extract $a$ (key=0). Update neighbors: $b.key=4, h.key=8$.
- Extract $b$ (key=4). Update: $c.key=8, h.key=11$ (no improvement for $h$).
- Extract $c$ (key=8). Update: $d.key=7, f.key=4, i.key=2$.
- Extract $i$ (key=2). Update: $h.key=7, g.key=6$.
- Extract $f$ (key=4). Update: $g.key=2, e.key=10$.
- ... (continue until all vertices extracted)

At the end, $A = \{(a,b), (b,c), (c,i), (c,f), (f,g), (g,h), (c,d), (d,e)\}$ with total weight 37.

---

## 6. Analysis of Prim's

| Priority Queue | EXTRACT-MIN        | DECREASE-KEY  | Total             |
| -------------- | ------------------ | ------------- | ----------------- |
| Array          | $O(V)$             | $O(1)$        | $O(V^2)$          |
| Binary heap    | $O(\log V)$        | $O(\log V)$   | $O(E \log V)$     |
| Fibonacci heap | $O(\log V)$ amort. | $O(1)$ amort. | $O(E + V \log V)$ |

With a **simple array**: $O(V)$ per `EXTRACT-MIN` $\times$ $V$ extractions + $O(1)$ per edge relaxation = $O(V^2 + E) = O(V^2)$. Good for dense graphs.

With a **binary heap**: $O(E \log V)$. Good for sparse graphs.

---

## 7. Comparison: Kruskal's vs. Prim's

| Property       | Kruskal's                       | Prim's                  |
| -------------- | ------------------------------- | ----------------------- |
| Strategy       | Add lightest safe edge globally | Grow one tree from root |
| Data structure | Union-Find                      | Priority queue          |
| Time (sparse)  | $O(E \log V)$                   | $O(E \log V)$           |
| Time (dense)   | $O(E \log V)$                   | $O(V^2)$ with array     |
| Best for       | Sparse graphs                   | Dense graphs            |

**Both produce a valid MST**. The choice depends on graph density and implementation constraints.

### 7.1 MST Uniqueness

If all edge weights are distinct, the MST is unique. With ties, multiple MSTs may exist, but all have the same total weight.

---

## References

- **CLRS**: Chapter 23 — Minimum Spanning Trees (Sections 23.1–23.2); Chapter 21 — Disjoint Sets.
