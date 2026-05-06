---
title: 08/09 - Hashing
date: 2026-02-16/18
---

## Roadmap

These lectures introduce **hash tables**, the primary data structure for implementing dynamic sets with fast average-case operations. We motivate the design through direct-address tables, introduce hash functions and collision resolution via chaining, then cover **open addressing** and **universal hashing** for provable worst-case guarantees.

1. **The Dictionary Problem**: Operations and motivation.
2. **Direct-Address Tables**: A simple starting point.
3. **Hash Tables**: Hash functions and collisions.
4. **Chaining**: Collision resolution via linked lists.
5. **Analysis of Chaining**: Expected cost under simple uniform hashing.
6. **Open Addressing**: Linear probing, quadratic probing, double hashing.
7. **Analysis of Open Addressing**: Expected number of probes.
8. **Universal Hashing**: Worst-case guarantees via randomized hash functions.
9. **A Universal Hash Family**: Construction and proof.

---

## 1. The Dictionary Problem

We want a data structure supporting:

* `INSERT(S, x)`: Insert element $x$ into set $S$.
* `DELETE(S, x)`: Remove element $x$ from set $S$.
* `SEARCH(S, k)`: Find element with key $k$ in $S$.

**Goal**: All three operations in $O(1)$ expected time.

---

## 2. Direct-Address Tables

**Idea**: If keys are drawn from a universe $U = \{0, 1, \dots, m-1\}$, allocate an array $T[0 \dots m-1]$. Slot $k$ holds a pointer to the element with key $k$ (or `NIL`).

**Performance**: All operations take $\Theta(1)$ worst-case time.

**Problem**: If the universe $|U|$ is large (e.g., 64-bit integers), the table is impractically large. In practice, the number of keys actually stored $n \ll |U|$.

---

## 3. Hash Tables

**Idea**: Use a **hash function** $h: U \to \{0, 1, \dots, m-1\}$ to map keys to table slots. Store element with key $k$ in slot $h(k)$.

$$h: U \to \{0, 1, \dots, m-1\}$$

The table size $m$ is much smaller than $|U|$.

**Collision**: Two keys $k_1 \neq k_2$ with $h(k_1) = h(k_2)$ is a **collision**. Collisions are unavoidable if $n > m$.

### Hash Function Design

A good hash function satisfies the **simple uniform hashing assumption**: each key is equally likely to hash to any of the $m$ slots, independently of all other keys.

**Division method**: $h(k) = k \bmod m$. Choose $m$ to be a prime not close to a power of 2.

**Multiplication method**: $h(k) = \lfloor m \cdot (kA \bmod 1) \rfloor$ for some constant $0 < A < 1$.

---

## 4. Chaining

**Chaining** resolves collisions by placing all elements that hash to the same slot into a **linked list**.

* Slot $j$ contains a pointer to the head of the list of all elements with $h(k) = j$.

### Pseudocode

```text
CHAINED-HASH-INSERT(T, x)
1. insert x at the head of list T[h(x.key)]

CHAINED-HASH-SEARCH(T, k)
1. search for an element with key k in list T[h(k)]

CHAINED-HASH-DELETE(T, x)
1. delete x from the list T[h(x.key)]
```

`INSERT` takes $O(1)$ time. `DELETE` takes $O(1)$ if lists are doubly linked.

---

## 5. Analysis of Chaining

Define the **load factor** $\alpha = n/m$ (average number of elements per slot).

**Theorem**: Under simple uniform hashing, an unsuccessful search takes expected time $\Theta(1 + \alpha)$.

**Proof sketch**: An unsuccessful search examines all elements in slot $h(k)$. The expected list length is $\alpha = n/m$. Adding $O(1)$ for computing $h(k)$ gives $\Theta(1 + \alpha)$.

**Theorem**: Under simple uniform hashing, a successful search takes expected time $\Theta(1 + \alpha)$.

**Interpretation**: If $n = O(m)$ (i.e., $\alpha = O(1)$), all operations take $O(1)$ expected time.

---

## 6. Open Addressing

In **open addressing**, all elements are stored in the hash table itself (no linked lists). On collision, we **probe** for an alternative slot.

A **probe sequence** for key $k$ is a permutation $\langle h(k,0), h(k,1), \dots, h(k,m-1) \rangle$ of $\{0,1,\dots,m-1\}$.

```text
HASH-INSERT(T, k)
1. i = 0
2. repeat
3.     j = h(k, i)
4.     if T[j] == NIL
5.         T[j] = k
6.         return j
7.     else i = i + 1
8. until i == m
9. error "hash table overflow"
```

```text
HASH-SEARCH(T, k)
1. i = 0
2. repeat
3.     j = h(k, i)
4.     if T[j] == k
5.         return j
6.     i = i + 1
7. until T[j] == NIL or i == m
8. return NIL
```

**Deletion** is tricky: cannot just set to `NIL` (would break search). Use a special `DELETED` sentinel.

### Probing Strategies

**Linear Probing**: $h(k, i) = (h'(k) + i) \bmod m$.
* Simple but causes **primary clustering**: long runs of occupied slots form and grow.

**Quadratic Probing**: $h(k, i) = (h'(k) + c_1 i + c_2 i^2) \bmod m$.
* Reduces primary clustering but causes **secondary clustering**: two keys with the same $h'(k)$ have identical probe sequences.

**Double Hashing**: $h(k, i) = (h_1(k) + i \cdot h_2(k)) \bmod m$.
* Uses two independent hash functions.
* Gives $\Theta(m^2)$ distinct probe sequences; approximates uniform hashing well.
* Requirement: $h_2(k)$ must be coprime to $m$ for all $k$ (e.g., choose $m$ prime).

---

## 7. Analysis of Open Addressing

Assume **uniform hashing**: each key is equally likely to have any of the $m!$ permutations as its probe sequence.

**Theorem**: Under uniform hashing with load factor $\alpha = n/m < 1$:

* Expected number of probes in an **unsuccessful search**: $\leq \dfrac{1}{1 - \alpha}$.
* Expected number of probes in a **successful search**: $\leq \dfrac{1}{\alpha} \ln \dfrac{1}{1-\alpha}$.

**Implication**: For $\alpha$ bounded away from 1, operations take $O(1)$ expected time. As $\alpha \to 1$, performance degrades sharply.

---

## 8. Universal Hashing

**Problem with fixed hash functions**: For any deterministic $h$, an adversary can choose $n$ keys that all hash to the same slot, giving $\Theta(n)$ worst-case time per operation.

**Solution**: Choose the hash function **randomly** at runtime from a family $\mathcal{H}$.

**Definition**: A family $\mathcal{H}$ of hash functions from $U$ to $\{0, \dots, m-1\}$ is **universal** if for any two distinct keys $k, \ell \in U$:
$$\Pr_{h \in \mathcal{H}}[h(k) = h(\ell)] \leq \frac{1}{m}$$

**Theorem**: If $h$ is chosen uniformly from a universal family $\mathcal{H}$, and we use chaining, then for any key $k$:
$$E[\text{number of collisions with } k] < \frac{n}{m} = \alpha$$

So all operations take $O(1 + \alpha) = O(1)$ expected time when $n = O(m)$, regardless of the input.

---

## 9. A Universal Hash Family

**Construction**: Let $p$ be a prime larger than $|U|$. For $a \in \{1, \dots, p-1\}$ and $b \in \{0, \dots, p-1\}$, define:
$$h_{a,b}(k) = ((ak + b) \bmod p) \bmod m$$

The family $\mathcal{H} = \{ h_{a,b} : a \in \{1,\dots,p-1\}, b \in \{0,\dots,p-1\} \}$ is universal.

**Proof sketch**: For distinct $k, \ell \in U$, $ak + b \not\equiv a\ell + b \pmod{p}$, so their images in $\mathbb{Z}_p$ are distinct and uniformly distributed. The probability both map to the same slot modulo $m$ is at most $\lceil p/m \rceil / (p-1) \leq 1/m$ for $p \geq m$.

---

## References

* **CLRS**: Chapter 11 — Hash Tables (Sections 11.1–11.5).
