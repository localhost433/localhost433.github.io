---
title: Sample space and probability
date: 2026-01-21
---

## Roadmap

We model a “random experiment” with a triple $(\Omega, \mathcal F, \mathbb P)$:

- $\Omega$: sample space (all possible outcomes)
- $\mathcal F \subseteq 2^{\Omega}$: collection of *events* (the subsets we are allowed to assign probabilities to)
- $\mathbb P$: probability measure on $\mathcal F$ (satisfies the axioms)

The rest of the course basically builds on these ideas: compute probabilities by (i) set manipulations and axioms, (ii) counting (when the model is uniform), and (iii) conditioning and independence.

---

## 1. Sample spaces and events

### 1.1 Sample space

**Definition (sample space).** A **sample space** $\Omega$ is the set of all possible outcomes of an experiment.

**Examples:**

* **Coin Toss:** Toss a coin three times. The sample space is:
    $$\Omega = \{HHH, HHT, HTH, HTT, THH, THT, TTH, TTT\}$$
* **Card Draw:** Draw one card from a standard 52-card deck. The sample space contains 52 distinct elements.

### 1.2 Events

**Definition (event).** An **event** is a subset $A \subseteq \Omega$.

> **Formal note:** In full generality, we specify a sigma-algebra $\mathcal F$ of measurable events. For this course, we generally think of events as subsets of $\Omega$, assuming we are working with a collection of subsets closed under complements and countable unions.

### 1.3 Set operations (notation)

For events $A, B \subseteq \Omega$, we define the following set operations:

- **Complement** ($A^c$): The set of outcomes in $\Omega$ that are not in $A$.
  $$A^c := \Omega \setminus A$$
- **Union** ($A \cup B$): The set of outcomes in $A$ or $B$ (or both).
- **Intersection** ($A \cap B$): The set of outcomes in both $A$ and $B$.
- **Difference** ($A \setminus B$): The set of outcomes in $A$ but not in $B$.
  $$A \setminus B := A \cap B^c$$

**Example (Coin tossed 3 times):**

Let $\Omega$ be the set of 3 coin flips. Define the following events:
- $A =$ “at most one tail” $= \{HHH, HHT, HTH, THH\}$
- $B =$ “first flip is tails” $= \{THH, THT, TTH, TTT\}$

**Operations:**
1.  **Union ($A \cup B$):** "At most one tail OR first flip is tails".
    $$A \cup B = \{HHH, HHT, HTH, THH, THT, TTH, TTT\} = \Omega \setminus \{HTT\}$$
2.  **Intersection ($A \cap B$):** "At most one tail AND first flip is tails".
    $$A \cap B = \{THH\}$$

---

## 2. Probability Measure

A probability measure $\mathbb P$ is a function that assigns a real number to each event in the sample space.

### 2.1 The Axioms of Probability

A function $\mathbb P: \mathcal{F} \to [0, 1]$ is a probability measure if it satisfies the following three axioms:

1.  **Normalization:** $\mathbb P(\Omega) = 1$.
2.  **Non-negativity:** $\mathbb P(A) \ge 0$ for all $A \subseteq \Omega$.
3.  **Countable Additivity (Disjoint Unions):** If $A_1, A_2, \dots$ are disjoint events (i.e., $A_i \cap A_j = \emptyset$ for $i \neq j$), then:
    $$\mathbb P\left(\bigcup_{i=1}^{\infty} A_i\right) = \sum_{i=1}^{\infty} \mathbb P(A_i)$$
    *Special case:* For two disjoint events $A$ and $B$, $\mathbb P(A \cup B) = \mathbb P(A) + \mathbb P(B)$.

### 2.2 Properties Derived from Axioms

Using the axioms, we can derive several useful properties:

1.  **Complement Rule:** $\mathbb P(A^c) = 1 - \mathbb P(A)$.
    *Proof:* Since $A \cup A^c = \Omega$ and $A \cap A^c = \emptyset$, by Axiom 3 and 1: $\mathbb P(A) + \mathbb P(A^c) = \mathbb P(\Omega) = 1$.
2.  **Empty Set:** $\mathbb P(\emptyset) = 0$.
    *Proof:* $\emptyset = \Omega^c$, so $\mathbb P(\emptyset) = 1 - \mathbb P(\Omega) = 0$.
3.  **Monotonicity:** If $A \subseteq B$, then $\mathbb P(A) \le \mathbb P(B)$.
    *Proof:* Write $B = A \cup (B \cap A^c)$. Since these are disjoint, $\mathbb P(B) = \mathbb P(A) + \mathbb P(B \cap A^c) \ge \mathbb P(A)$ (by Axiom 2).
4.  **Inclusion-Exclusion Principle:** For any two events $A$ and $B$:
    $$\mathbb P(A \cup B) = \mathbb P(A) + \mathbb P(B) - \mathbb P(A \cap B)$$

---

## 3. Counting and Uniform Probability

When the sample space $\Omega$ is finite and all outcomes are equally likely (uniform model), calculating probabilities reduces to counting.

**Assumption:** $\Omega = \{\omega_1, \dots, \omega_N\}$ and $\mathbb P(\{\omega_i\}) = \frac{1}{N}$ for all $i$.

For any event $A \subseteq \Omega$:
$$\mathbb P(A) = \frac{|A|}{|\Omega|} = \frac{\text{number of outcomes in } A}{\text{total number of outcomes}}$$

### 3.1 Counting Principles

To determine $|A|$ and $|\Omega|$, we often use combinatorial methods:

* **Multiplication Rule:** If an experiment has $k$ steps with $n_1, n_2, \dots, n_k$ choices respectively, the total number of outcomes is $n_1 \times n_2 \times \dots \times n_k$.
* **Permutations:** Ordering $k$ distinct items from a set of $n$.
    $$P(n, k) = \frac{n!}{(n-k)!}$$
* **Combinations:** Choosing $k$ items from a set of $n$ without regard to order.
    $$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$

**Example:**
What is the probability of drawing a King from a standard deck?
- $|\Omega| = 52$
- $|A| = 4$ (King of Hearts, Diamonds, Clubs, Spades)
- $\mathbb P(A) = \frac{4}{52} = \frac{1}{13}$

---

## References

1.  Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2.  Han, Y. (2026). Lecture 1: Sample space & probability.