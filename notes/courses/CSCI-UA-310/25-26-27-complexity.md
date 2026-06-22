---
title: 25/26/27 - Complexity & NP-Completeness
date: 2026-04-27/29/05-04
---

## Roadmap

These lectures ask two foundational questions: **which problems can computers solve at all?** and **which can be solved efficiently?** We define decidability and prove the Halting Problem is undecidable, then define the complexity classes P and NP, introduce polynomial-time reductions, prove that VC and IS are NP-complete via reduction from 3SAT, and discuss practical strategies for coping with NP-hard problems.

1. **Decision Problems**: The formal setting.
2. **Decidability**: What it means for a problem to be solvable.
3. **The Halting Problem**: Statement and Turing's proof.
4. **Reduction**: Program Equality is undecidable.
5. **Rice's Theorem**: A sweeping undecidability result.
6. **Class P**: Problems solvable in polynomial time.
7. **Problems Without Known Poly-Time Algorithms**: VC, IS, Clique, 3SAT.
8. **Polynomial-Time Reductions**: How hardness transfers.
9. **Class NP**: Problems with polynomial-time verifiers.
10. **NP-Completeness**: The hardest problems in NP.
11. **P vs. NP**: The central open question.
12. **Reduction: 3SAT $\leq_p$ IS**: Construction and proof.
13. **Corollary: VC is NP-complete**.
14. **Dealing with NP-Hard Problems**: Practical strategies.

---

## 1. Decision Problems

We focus on **decision problems**: problems whose answer is "yes" or "no."

**Examples**:

- **MST**: Given graph $G$, weights $w$, and integer $k$: is the MST of $G$ of weight $\leq k$?
- **Halting**: Given program $P$ and input $x$: does $P(x)$ terminate?
- **Wang Tiling**: Given a set of colored tile types, can they tile the infinite 2D plane such that adjacent tiles share the same color on touching sides?

---

## 2. Decidability

**Notation**:

- $\langle P \rangle$ = the source code of program $P$ (in some fixed language).
- $P(x)$ = running program $P$ on input $x$.

**Definition**: An algorithm $A$ **solves** problem $\Pi$ if for all inputs:

- If the answer is "yes," $A$ outputs "yes" and terminates.
- If the answer is "no," $A$ outputs "no" and terminates.

**Definition**: A problem $\Pi$ is **decidable** (computable) if there exists an algorithm that solves it.

**Good news**: Most natural computational problems (sorting, shortest paths, dynamic programming problems) are decidable. But some are not.

---

## 3. The Halting Problem

### 3.1 Statement

**Input**: A program $\langle P \rangle$ and a string $x$.

**Output**: Does $P(x)$ terminate?

### 3.2 Theorem (Turing)

**The Halting Problem is not decidable.** No algorithm solves Halting.

### 3.3 Proof (Diagonal Argument)

Suppose for contradiction that algorithm $A^{\text{Halt}}$ solves Halting. Define a new algorithm:

```text
Flip(z):       // z is an input string
1. Run A^Halt(z, z)
2. If output is "yes": loop forever
3. If output is "no":  halt
```

Now consider running `Flip` on its own source code $z = \langle\text{Flip}\rangle$:

$$\text{Flip}(\langle\text{Flip}\rangle) \text{ halts} \iff A^{\text{Halt}}(\langle\text{Flip}\rangle, \langle\text{Flip}\rangle) = \text{"no"}$$

But $A^{\text{Halt}}$ correctly solves Halting, so:

$$A^{\text{Halt}}(\langle\text{Flip}\rangle, \langle\text{Flip}\rangle) = \text{"no"} \iff \text{Flip}(\langle\text{Flip}\rangle) \text{ does not halt}$$

This is a contradiction:

$$\text{Flip}(\langle\text{Flip}\rangle) \text{ halts} \iff \text{Flip}(\langle\text{Flip}\rangle) \text{ does not halt}$$

Therefore $A^{\text{Halt}}$ cannot exist. $\square$

---

## 4. Reduction: Program Equality is Undecidable

**Program Equality**:

- **Input**: Two programs $\langle A \rangle$ and $\langle B \rangle$.
- **Goal**: Decide if $A(x) = B(x)$ for all strings $x$.

**Claim**: Program Equality is not computable.

**Proof** (reduction from Halting):

Suppose for contradiction that algorithm $E$ solves Program Equality. We construct an algorithm $H$ that solves Halting:

```text
H(<P>, x):
1. Write code for A_{P,x}: on any input y, run P(x); if P(x) halts, return "no"
2. Write code for B: on any input y, return "no"
3. Return E(<A_{P,x}>, <B>)
```

**Key observation**: Both $A_{P,x}$ and $B$ ignore their input and always return "no" — *but only if $P(x)$ halts*. If $P(x)$ does not halt, $A_{P,x}$ loops forever.

Therefore:
$$E(\langle A_{P,x}\rangle, \langle B\rangle) = \text{"yes"} \iff A_{P,x} = B \text{ on all inputs} \iff P(x) \text{ halts}$$

So $H$ solves Halting — contradicting Turing's theorem. Hence $E$ cannot exist. $\square$

**Notation**: This shows $\text{Halting} \leq \text{ProgramEquality}$ (Halting reduces to Program Equality; Program Equality is at least as hard as Halting).

---

## 5. Rice's Theorem

**Theorem (Rice, informally)**: Every non-trivial problem that talks about the **input-output behavior** of programs is not decidable.

More precisely: any semantic property of programs (one that cannot be determined from syntax alone) is undecidable.

**Examples of undecidable problems**:

- Does program $P$ output "yes" on input $x$?
- Does program $P$ halt on all inputs?
- Do programs $A$ and $B$ compute the same function? (Program Equality above)
- Wang Tiling (shown to be equivalent to a halting problem).
- Deciding if a theorem in first-order logic is true.

**TL;DR**: There are some problems that no algorithm can solve. Most natural computational problems are decidable, but a surprisingly rich class — especially those that reason about program behavior — are not.

---

## 6. Class P

**Definition**: A **decision problem** is a set (language) $L \subseteq \Sigma^*$; "x is a yes-instance of $L$" means $x \in L$.

**Definition**: The class **P** is the set of all decision problems solvable by an algorithm with running time $O(n^c)$ for some constant $c$, on inputs of size $n$.

**Examples in P**: Sorting, MST, APSP, Rod Cutting, BFS, DFS, Dijkstra, ...

**Intuition**: P captures "efficiently solvable" problems.

---

## 7. Problems Without Known Poly-Time Algorithms

### 7.1 Vertex Cover (VC)

**Input**: Undirected graph $G = (V, E)$, integer $k$.

**Question**: Are there $k$ vertices in $V$ that **touch** (cover) all edges in $E$?

A set $S$ is a vertex cover if for every edge $(u,v) \in E$, at least one of $u, v \in S$.

### 7.2 Independent Set (IS)

**Input**: Undirected graph $G = (V, E)$, integer $k$.

**Question**: Are there $k$ vertices with **no edge between them**?

A set $S$ is an independent set if for all $u, v \in S$, $(u,v) \notin E$.

### 7.3 Clique

**Input**: Undirected graph $G = (V, E)$, integer $k$.

**Question**: Are there $k$ nodes such that every pair is connected by an edge?

### 7.4 3SAT

**Input**: A Boolean formula $\varphi(x_1, \dots, x_n)$ in **conjunctive normal form (CNF)** with exactly 3 literals per clause (AND of ORs of 3 variables or their negations).

**Question**: Is there a satisfying assignment?

**Example**:
$$\varphi = (x_1 \vee x_2 \vee \overline{x}_3) \wedge (x_1 \vee \overline{x}_2 \vee x_4) \wedge (\overline{x}_1 \vee \overline{x}_2 \vee \overline{x}_4) \wedge (x_2 \vee x_4 \vee x_3)$$

Assignment $x_1 = T, x_2 = F, x_3 = T, x_4 = T$ satisfies $\varphi$.

---

## 8. Polynomial-Time Reductions

**Definition**: A **reduction** from decision problem $L$ to decision problem $L'$ is an algorithm $R$ such that $R(x) \in L'$ iff $x \in L$. Notation: $L \leq L'$.

If $R$ runs in polynomial time: **poly-time reduction**, $L \leq_p L'$.

**Interpretation**: If $L \leq_p L'$ and $L' \in P$, then $L \in P$. Equivalently: if $L \notin P$ then $L' \notin P$.

### 8.1 VC $\leq_p$ IS (and IS $\leq_p$ VC)

**Claim**: $G$ has a vertex cover of size $k$ $\iff$ $G$ has an independent set of size $n - k$.

**Proof**: Let $S$ be a vertex cover of size $k$. Then $V \setminus S$ (of size $n-k$) is an independent set: if $(u,v) \in E$, then $S$ covers $(u,v)$, so at least one of $u, v \in S$, meaning not both are in $V \setminus S$.

Thus: if there's a poly-time algorithm for VC, there's one for IS (and vice versa). These problems are equally hard.

---

## 9. Class NP

**Formal Definition**: $L \in$ **NP** if there exists a polynomial-time **verifier** $V$ such that:

- For every $x \in L$: there exists a **witness** $w$ with $V(x, w) = \text{"yes"}$.
- For every $x \notin L$: for all $w$: $V(x, w) = \text{"no"}$.
- $V$ runs in polynomial time in $|x|$.

**Alternative**: NP = problems solvable by a non-deterministic polynomial-time algorithm (one allowed to "guess" the witness).

**Why "NP"**: Non-deterministic Polynomial time.

**Examples in NP**:

- VC: witness = the $k$ vertices.
- IS: witness = the $k$ independent vertices.
- Clique: witness = the $k$-clique vertices.
- 3SAT: witness = the satisfying assignment.
- Subset Sum, Hamiltonian Cycle, ...

**Note**: $P \subseteq NP$ (a poly-time algorithm is its own verifier).

---

## 10. NP-Completeness

**Definition**: $L$ is **NP-hard** if $\forall B \in NP$: $B \leq_p L$ (every NP problem reduces to $L$).

**Definition**: $L$ is **NP-complete** if $L \in NP$ and $L$ is NP-hard.

**Theorem (Cook-Levin)**: 3SAT is NP-complete.

This is the foundational result: 3SAT is the "hardest" problem in NP. Proved by showing every NP problem can be encoded as a 3SAT instance.

**Corollary**: If 3SAT $\leq_p$ $L$ and $L \in NP$, then $L$ is NP-complete.

**Complexity landscape**:

```text
Computable
┌────────────────────────────────────────────────────┐
│  NP                                                │
│ ┌──────────────────────┐  ┌────────────────────┐   │
│ │  P                   │  │  NP-complete       │   │
│ │  • MST               │  │  • 3SAT            │   │
│ │  • APSP              │  │  • VC              │   │
│ └──────────────────────┘  └────────────────────┘   │
└────────────────────────────────────────────────────┘    • Halting
                                                          • Wang Tiling
```

---

## 11. P vs. NP

**The central open question**: Is P = NP?

**If P $\neq$ NP** (widely believed):

- There is no efficient algorithm for any NP-complete problem (3SAT, VC, IS, ...).
- Cryptography (RSA, etc.) is secure.

**If P $=$ NP**:

- We can solve almost everything in polynomial time.
- "Can verify $\Rightarrow$ can solve."
- Modern cryptography would break down.

The P vs. NP problem is one of the Millennium Prize Problems ($1 million prize for a solution).

---

## 12. Reduction: 3SAT $\leq_p$ IS

**Given**: A 3SAT formula $\varphi$ with $m$ clauses and $n$ variables. We construct a graph $G_\varphi$ such that:
$$G_\varphi \text{ has an IS of size } m \iff \varphi \text{ is satisfiable}$$

### 12.1 Construction

**Step 1**: For each clause $C_j = (\ell_{j1} \vee \ell_{j2} \vee \ell_{j3})$, create a **triangle** (3-clique) with one node per literal: nodes $\ell_{j1}, \ell_{j2}, \ell_{j3}$ all connected to each other.

This gives $3m$ nodes and $m$ triangles. An independent set can contain **at most one node from each triangle**.

An IS of size $m$ must include **exactly one node per triangle** — i.e., one satisfied literal per clause.

**Step 2**: For each variable $x_i$, add an edge between every node labeled $x_i$ and every node labeled $\overline{x}_i$ (across all triangles).

This **consistency constraint** ensures we cannot choose both $x_i$ and $\overline{x}_i$ into the IS.

### 12.2 Example

$$\varphi = (x_1 \vee x_2 \vee \overline{x}_3) \wedge (x_1 \vee \overline{x}_2 \vee x_4) \wedge (\overline{x}_1 \vee \overline{x}_2 \vee \overline{x}_4) \wedge (x_2 \vee x_4 \vee x_3)$$

Graph $G_\varphi$ has 4 triangles (one per clause), with inter-triangle edges between complementary literals.

$G_\varphi$ has an IS of size $m = 4$ $\iff$ $\varphi$ is satisfiable (e.g., $x_1 = T, x_2 = F, x_3 = T, x_4 = T$).

### 12.3 Correctness Proof

**($\Rightarrow$) IS of size $m$ $\Rightarrow$ satisfying assignment**:

Let $S$ be an IS of size $m$. Since each triangle has exactly one node in $S$, and consistency edges prevent both $x_i$ and $\overline{x}_i$ from appearing, we can set each variable consistently. The chosen literal in each clause triangle is true, so all clauses are satisfied.

**($\Leftarrow$) Satisfying assignment $\Rightarrow$ IS of size $m$**:

Given a satisfying assignment, for each clause pick any literal that evaluates to true; take the corresponding node into $S$. This gives one node per triangle (size $m$). Intra-triangle edges are not violated (only one node per triangle). Inter-triangle (consistency) edges are not violated: since the assignment is consistent, we never choose both $x_i$ and $\overline{x}_i$.

**Construction time**: $O(m^2)$ (polynomial in input size). So this is a valid poly-time reduction.

**Conclusion**: 3SAT $\leq_p$ IS. Since 3SAT is NP-hard and IS $\in$ NP, IS is NP-complete.

---

## 13. Corollary: VC is NP-complete

From Section 8: IS $\leq_p$ VC and VC $\leq_p$ IS.

Since IS is NP-hard, VC is NP-hard. Since VC $\in$ NP (witness = the $k$ vertices), VC is NP-complete.

---

## 14. Dealing with NP-Hard Problems

If a problem is NP-complete, we believe no poly-time algorithm exists (assuming P $\neq$ NP). Practical strategies:

### 14.1 Strategy 1: Improve Hardware

Better hardware improves constants but does not change the asymptotic complexity. An algorithm that takes $2^n$ steps on a $10^9$-op/s machine takes $2^{60}$ steps even on a machine $10^9 \times$ faster, if $n = 60$.

### 14.2 Strategy 2: Simplify the Problem

Identify special cases that are in P:

- 2SAT (2 literals per clause) $\in$ P.
- Vertex Cover on trees $\in$ P.
- Knapsack with small $W$: pseudopolynomial $O(nW)$ DP.
- Clique on planar graphs $\in$ P.

### 14.3 Strategy 3: Heuristics

Use algorithms without formal guarantees (e.g., local search, simulated annealing, deep learning). Often work well in practice, but may fail on worst-case instances.

### 14.4 Strategy 4: Approximation Algorithms

Design algorithms that run in polynomial time and guarantee a **near-optimal** solution.

**Example (2-approximation for Vertex Cover)**:

```text
APPROX-VERTEX-COVER(G)
1. C = empty set
2. E' = G.E (copy of edges)
3. while E' is not empty
4.     let (u, v) be any edge in E'
5.     C = C union {u, v}
6.     remove all edges incident to u or v from E'
7. return C
```

**Claim**: $|C| \leq 2 \cdot |OPT|$.

**Proof**: Each selected edge $(u,v)$ contributes 2 vertices to $C$. These selected edges form a matching (no two share a vertex). Any vertex cover must include at least one endpoint of each matched edge, so $|OPT| \geq$ (# matched edges) $= |C|/2$.

**Approximation ratio**: 2 (a 2-approximation).

---

## Summary

| Problem         | Complexity        | Notes                        |
| --------------- | ----------------- | ---------------------------- |
| MST             | P ($O(E \log V)$) | Exact solution               |
| APSP            | P ($O(V^3)$)      | Exact solution               |
| 3SAT            | NP-complete       | No poly-time algorithm known |
| Vertex Cover    | NP-complete       | 2-approximation exists       |
| Independent Set | NP-complete       | Hard to approximate          |
| Clique          | NP-complete       | Hard to approximate          |
| Halting         | Undecidable       | Not even computable          |

---

## References

- **CLRS**: Chapter 34 — NP-Completeness; Chapter 35 — Approximation Algorithms.
- Sipser, *Introduction to the Theory of Computation*, Chapters 4–5, 7.
