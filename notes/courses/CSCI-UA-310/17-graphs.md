---
title: 17 - Graph Representations & Properties
date: 2026-03-30
---

## Roadmap

This lecture introduces graphs formally and covers the two standard representations. We also define key graph properties needed for subsequent algorithms.

1. **Graph Definitions**: Directed and undirected graphs.
2. **Representations**: Adjacency lists vs. adjacency matrices.
3. **Graph Properties**: Connectivity, paths, cycles.
4. **Special Graph Classes**: DAGs, trees, bipartite graphs.

---

## 1. Graph Definitions

A **graph** $G = (V, E)$ consists of a set of **vertices** $V$ and a set of **edges** $E$.

**Undirected graph**: Edges are unordered pairs $\{u, v\}$. Edge $\{u, v\}$ is the same as $\{v, u\}$.

**Directed graph (digraph)**: Edges are ordered pairs $(u, v)$. Edge $(u, v)$ goes from $u$ to $v$.

**Weighted graph**: Each edge $(u, v)$ has a weight $w(u, v) \in \mathbb{R}$.

**Key quantities**:

- $n = |V|$ (number of vertices), $m = |E|$ (number of edges).
- For undirected graphs: $m \leq \binom{n}{2} = O(n^2)$.
- For directed graphs: $m \leq n(n-1) = O(n^2)$.

**Sparse graph**: $m = O(n)$ or $m = O(n \log n)$.
**Dense graph**: $m = \Theta(n^2)$.

---

## 2. Representations

### 2.1 Adjacency List

An array $\text{Adj}[1 \dots n]$ where $\text{Adj}[u]$ is a linked list of all vertices $v$ such that $(u, v) \in E$.

- **Space**: $\Theta(V + E)$.
- **Time to check** if $(u,v) \in E$: $O(\deg(u))$.
- **Time to iterate** over all neighbors of $u$: $\Theta(\deg(u))$.
- **Preferred** for sparse graphs.

### 2.2 Adjacency Matrix

An $n \times n$ matrix $A$ where $A[u][v] = 1$ if $(u,v) \in E$, else $0$.

- **Space**: $\Theta(V^2)$.
- **Time to check** if $(u,v) \in E$: $O(1)$.
- **Time to iterate** over all neighbors of $u$: $\Theta(n)$.
- **Preferred** for dense graphs or when fast edge-existence queries are needed.

**Comparison**:

| Operation            | Adj. List    | Adj. Matrix |
| -------------------- | ------------ | ----------- |
| Space                | $O(V + E)$   | $O(V^2)$    |
| Edge query $(u,v)$?  | $O(\deg(u))$ | $O(1)$      |
| All neighbors of $u$ | $O(\deg(u))$ | $O(V)$      |

---

## 3. Graph Properties

**Path**: A sequence of vertices $v_1, v_2, \dots, v_k$ where each $(v_i, v_{i+1}) \in E$.

**Simple path**: All vertices distinct.

**Cycle**: A path where $v_1 = v_k$ and all other vertices are distinct.

**Connected** (undirected): Every pair of vertices has a path between them.

**Strongly connected** (directed): Every pair $(u, v)$ has directed paths both $u \to v$ and $v \to u$.

**Weakly connected** (directed): The underlying undirected graph is connected.

**Degree**:

- Undirected: $\deg(v)$ = number of incident edges.
- Directed: $\text{in-deg}(v)$ = edges entering, $\text{out-deg}(v)$ = edges leaving.
- **Handshake lemma**: $\sum_{v \in V} \deg(v) = 2|E|$.

---

## 4. Special Graph Classes

**Tree**: A connected undirected graph with no cycles. An $n$-vertex tree has exactly $n-1$ edges.

**Directed Acyclic Graph (DAG)**: A directed graph with no directed cycles. DAGs admit a **topological ordering**: a linear ordering of vertices such that for every edge $(u,v)$, $u$ appears before $v$.

**Bipartite graph**: Vertices can be partitioned into two sets $L$ and $R$ such that every edge goes between $L$ and $R$ (no edges within $L$ or within $R$). Equivalent to having no odd-length cycles.

**Complete graph $K_n$**: Every pair of vertices is connected. $|E| = \binom{n}{2}$.

---

## References

- **CLRS**: Chapter 22 — Elementary Graph Algorithms (Section 22.1: Representations).
