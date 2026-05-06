---
title: 18 - Graph Traversal (BFS & DFS)
date: 2026-04-01
---

## Roadmap

This lecture covers the two fundamental graph traversal algorithms: **Breadth-First Search (BFS)** and **Depth-First Search (DFS)**. Both run in $O(V + E)$ and serve as subroutines for many other graph algorithms.

1. **BFS**: Level-order traversal, shortest paths in unweighted graphs.
2. **DFS**: Recursive exploration, timestamps, edge classification.
3. **Topological Sort**: An application of DFS.
4. **Strongly Connected Components**: Kosaraju's algorithm.

---

## 1. Breadth-First Search

### Algorithm

BFS explores the graph level by level, using a FIFO queue. It computes the **shortest path** (fewest edges) from source $s$ to every reachable vertex.

Each vertex has: `color` (WHITE/GRAY/BLACK), `d` (distance from $s$), `π` (predecessor).

```text
BFS(G, s)
1. for each u in V - {s}
2.     u.color = WHITE, u.d = inf, u.π = NIL
3. s.color = GRAY, s.d = 0, s.π = NIL
4. Q = empty queue
5. ENQUEUE(Q, s)
6. while Q is not empty
7.     u = DEQUEUE(Q)
8.     for each v in Adj[u]
9.         if v.color == WHITE
10.            v.color = GRAY
11.            v.d = u.d + 1
12.            v.π = u
13.            ENQUEUE(Q, v)
14.    u.color = BLACK
```

**Running time**: $O(V + E)$ — each vertex is enqueued once, each edge is examined once.

### BFS Properties

**Theorem**: When BFS terminates, $v.d = \delta(s, v)$ (shortest-path distance) for all reachable $v$.

The **BFS tree** (predecessor subgraph $G_\pi$) contains the shortest paths from $s$ to all reachable vertices. Use `PRINT-PATH(G, s, v)` to trace back via `π` pointers.

---

## 2. Depth-First Search

### Algorithm

DFS explores as deep as possible before backtracking. It uses a **timestamp** for discovery (`d`) and finish (`f`) times.

```text
DFS(G)
1. for each u in V
2.     u.color = WHITE, u.π = NIL
3. time = 0
4. for each u in V
5.     if u.color == WHITE
6.         DFS-VISIT(G, u)

DFS-VISIT(G, u)
1. time = time + 1
2. u.d = time                // u is discovered
3. u.color = GRAY
4. for each v in Adj[u]
5.     if v.color == WHITE
6.         v.π = u
7.         DFS-VISIT(G, v)
8. u.color = BLACK
9. time = time + 1
10. u.f = time               // u is finished
```

**Running time**: $\Theta(V + E)$.

### Parenthesis Theorem

For any two vertices $u$ and $v$, exactly one of the following holds:
1. $[u.d, u.f]$ and $[v.d, v.f]$ are **disjoint** ($u$ and $v$ are in different DFS trees).
2. $[u.d, u.f] \subset [v.d, v.f]$ ($u$ is a **descendant** of $v$).
3. $[v.d, v.f] \subset [u.d, u.f]$ ($v$ is a **descendant** of $u$).

### Edge Classification

In a DFS of a directed graph, edges are classified as:

* **Tree edges**: Edges in the DFS forest $(v.\pi = u)$.
* **Back edges**: $(u, v)$ where $v$ is an ancestor of $u$ in the DFS tree. *Indicate cycles.*
* **Forward edges**: $(u, v)$ where $v$ is a descendant of $u$, but not a tree edge.
* **Cross edges**: All other edges.

**Key fact**: An undirected graph is acyclic if and only if DFS produces no back edges.

---

## 3. Topological Sort

**Problem**: Given a DAG $G = (V, E)$, produce a linear ordering of all vertices such that if $(u, v) \in E$, then $u$ appears before $v$.

**Algorithm**: Run DFS; as each vertex finishes, insert it at the **front** of a linked list.

```text
TOPOLOGICAL-SORT(G)
1. Call DFS(G) to compute finish times u.f for all u
2. As each vertex is finished, insert it onto the front of a linked list
3. return the linked list
```

**Running time**: $\Theta(V + E)$.

**Correctness**: For edge $(u, v)$ in a DAG, $u.f > v.f$ (since $v$ finishes before $u$). So placing vertices in decreasing finish-time order gives a valid topological order.

---

## 4. Strongly Connected Components

**Definition**: A **strongly connected component (SCC)** of a directed graph $G$ is a maximal set of vertices $C \subseteq V$ such that for every pair $u, v \in C$, both $u \leadsto v$ and $v \leadsto u$.

### Kosaraju's Algorithm

```text
STRONGLY-CONNECTED-COMPONENTS(G)
1. Call DFS(G) to compute finish times u.f
2. Compute G^T (transpose: reverse all edges)
3. Call DFS(G^T) processing vertices in decreasing u.f order
4. Each tree in DFS forest of G^T is one SCC
```

**Running time**: $\Theta(V + E)$.

**Key insight**: The SCCs form a DAG when condensed. DFS on $G^T$ in reverse finish-time order visits one SCC at a time, because the condensation DAG is traversed in reverse topological order.

---

## References

* **CLRS**: Chapter 22 — Elementary Graph Algorithms (Sections 22.2–22.5).
