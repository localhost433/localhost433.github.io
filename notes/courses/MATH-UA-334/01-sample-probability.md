---
title: Sample space and probability
date: 2026-01-21
---

## 1. Introduction and Roadmap

We model a “random experiment” with a formal mathematical triple $(\Omega, \mathcal{F}, \prob)$:

- $\Omega$: The sample space, representing all possible outcomes.
- $\mathcal{F} \subseteq 2^{\Omega}$: The collection of *events* (the subsets of the sample space we are allowed to assign probabilities to).
- $\prob$: The probability measure on $\mathcal{F}$ (which must satisfy Kolmogorov's axioms).

The remainder of the course builds on these core ideas. We compute probabilities by:

1. Set manipulations and applying probability axioms.
2. Counting methods (when the underlying model is uniform).
3. Using advanced tools like conditioning and independence.

---

## 2. Sample Spaces and Events

### 2.1 Sample Space

**Definition (Sample Space).** A **sample space** $\Omega$ is the set of all possible outcomes of a random experiment.

**Examples:**

- **Coin Toss:** Toss a coin three times. The sample space is:
    $$\Omega = \{HHH, HHT, HTH, HTT, THH, THT, TTH, TTT\}$$
- **Card Draw:** Draw one card from a standard 52-card deck. The sample space $\Omega$ contains 52 distinct elements.

### 2.2 Events

**Definition (Event).** An **event** is a subset $A \subseteq \Omega$.

> **Formal note:** In full generality, we specify a sigma-algebra $\mathcal{F}$ of measurable events. For this course, we generally think of events as subsets of $\Omega$, assuming we are working with a collection of subsets closed under complements and countable unions.

### 2.3 Set Operations

For events $A, B \subseteq \Omega$, we define the following set operations:

- **Complement** ($A^c$): The set of outcomes in $\Omega$ that are not in $A$.
  $$A^c := \Omega \setminus A$$
- **Union** ($A \cup B$): The set of outcomes in $A$ or $B$ (or both).
- **Intersection** ($A \cap B$): The set of outcomes in both $A$ and $B$.
- **Difference** ($A \setminus B$): The set of outcomes in $A$ but not in $B$.
  $$A \setminus B := A \cap B^c$$

**Example:**
Let $\Omega$ be the set of outcomes of 3 coin flips. Define the following events:

- $A =$ “at most one tail” $= \{HHH, HHT, HTH, THH\}$
- $B =$ “first flip is tails” $= \{THH, THT, TTH, TTT\}$

**Operations:**

1. **Union ($A \cup B$):** "At most one tail OR first flip is tails".
    $$A \cup B = \{HHH, HHT, HTH, THH, THT, TTH, TTT\} = \Omega \setminus \{HTT\}$$
2. **Intersection ($A \cap B$):** "At most one tail AND first flip is tails".
    $$A \cap B = \{THH\}$$

---

## 3. Probability Measure

A probability measure $\prob$ is a function that assigns a real number to each event in the sample space.

### 3.1 The Axioms of Probability

A function $\prob: \mathcal{F} \to [0, 1]$ is a probability measure if it satisfies the following three axioms:

1. **Normalization:** $\prob(\Omega) = 1$.
2. **Non-negativity:** $\prob(A) \ge 0$ for all $A \subseteq \Omega$.
3. **Countable Additivity (Disjoint Unions):** If $A_1, A_2, \dots$ are disjoint events (i.e., $A_i \cap A_j = \emptyset$ for $i \neq j$), then:
    $$\prob\left(\bigcup_{i=1}^{\infty} A_i\right) = \sum_{i=1}^{\infty} \prob(A_i)$$
    *Special case:* For two disjoint events $A$ and $B$, $\prob(A \cup B) = \prob(A) + \prob(B)$.

### 3.2 Properties Derived from Axioms

Using the axioms, we can derive several useful properties:

1. **Complement Rule:** $\prob(A^c) = 1 - \prob(A)$.
2. **Empty Set:** $\prob(\emptyset) = 0$.
3. **Monotonicity:** If $A \subseteq B$, then $\prob(A) \le \prob(B)$.
4. **Inclusion-Exclusion Principle:** For any two events $A$ and $B$:
    $$\prob(A \cup B) = \prob(A) + \prob(B) - \prob(A \cap B)$$

---

## 4. Counting and Uniform Probability

When the sample space $\Omega$ is finite and all outcomes are equally likely (the uniform model), calculating probabilities reduces to counting.

**Assumption:** $\Omega = \{\omega_1, \dots, \omega_N\}$ and $\prob(\{\omega_i\}) = \frac{1}{N}$ for all $i$.

For any event $A \subseteq \Omega$:
$$\prob(A) = \frac{|A|}{|\Omega|}$$

### 4.1 Counting Principles

To determine $|A|$ and $|\Omega|$, we often use combinatorial methods:

- **Multiplication Rule:** If an experiment has $k$ steps with $n_1, n_2, \dots, n_k$ choices respectively, the total number of outcomes is $n_1 \times n_2 \times \dots \times n_k$.
- **Permutations:** Ordering $k$ distinct items from a set of $n$.
    $$P(n, k) = \frac{n!}{(n-k)!}$$
- **Combinations:** Choosing $k$ items from a set of $n$ without regard to order.
    $$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$

### 4.2 Card drawing Example

What is the probability of drawing a King from a standard deck?

- $|\Omega| = 52$
- $|A| = 4$ (King of Hearts, Diamonds, Clubs, Spades)
- $\prob(A) = \frac{4}{52} = \frac{1}{13}$

### 4.3 Hypergeometric Distribution Example

Suppose an urn contains $W$ white balls and $B$ black balls. We draw $n$ balls without replacement. What is the probability of drawing exactly $k$ white balls?

1. Total number of ways to draw $n$ balls: $\binom{W+B}{n}$.
2. Number of ways to draw exactly $k$ white balls and $n-k$ black balls: $\binom{W}{k} \binom{B}{n-k}$.

$$\prob(\text{exactly } k \text{ white}) = \frac{\binom{W}{k} \binom{B}{n-k}}{\binom{W+B}{n}}$$

---

## 5. Conditional Probability and Bayes' Rule

### 5.1 Conditional Probability

**Definition.** The conditional probability of $A$ given $B$ (assuming $\prob(B) > 0$) is:
$$\prob(A \mid B) = \frac{\prob(A \cap B)}{\prob(B)}$$

This represents updating our sample space to $B$ and evaluating the relative proportion of $A$ inside $B$.

### 5.2 Law of Total Probability

If $B_1, B_2, \dots, B_n$ form a partition of the sample space $\Omega$ (they are disjoint and their union is $\Omega$), then for any event $A$:
$$\prob(A) = \sum_{i=1}^n \prob(A \cap B_i) = \sum_{i=1}^n \prob(A \mid B_i) \prob(B_i)$$

### 5.3 Bayes' Rule

Using the definition of conditional probability and the Law of Total Probability, we derive Bayes' Rule:
$$\prob(B_j \mid A) = \frac{\prob(A \mid B_j) \prob(B_j)}{\sum_{i=1}^n \prob(A \mid B_i) \prob(B_i)}$$

---

## 6. Independence

### 6.1 Pairwise Independence

Events $A$ and $B$ are **independent** if and only if:
$$\prob(A \cap B) = \prob(A)\prob(B)$$

If $\prob(B) > 0$, this is entirely equivalent to:
$$\prob(A \mid B) = \prob(A)$$
meaning “knowing $B$ has occurred does not change the probability of $A$ occurring”.

### 6.2 Mutual Independence

Events $A_1, \dots, A_n$ are **mutually independent** if for *every* subcollection $\{A_{i_1}, \dots, A_{i_m}\}$ with $m \ge 2$:
$$\prob(A_{i_1} \cap \dots \cap A_{i_m}) = \prob(A_{i_1}) \dots \prob(A_{i_m})$$
Note: Pairwise independence does not guarantee mutual independence.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 1: Sample space & probability.
