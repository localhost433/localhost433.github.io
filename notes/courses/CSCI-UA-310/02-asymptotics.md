---
title: 2 - Asymptotic Analysis
date: 2026-01-26
---

## Roadmap

We move from specific algorithm analysis (Insertion Sort) to a general framework for comparing the efficiency of algorithms. We introduce **Asymptotic Notation** ($O, \Omega, \Theta$) to classify functions based on their growth rates.

1. **Motivation**: Why we ignore constants and lower-order terms.
2. **Definitions**: $O$ (Big-O), $\Omega$ (Big-Omega), $\Theta$ (Big-Theta).
3. **Calculus Techniques**: Using limits to compare functions.
4. **Standard Classes**: Polynomials, Logarithms, Exponentials.

---

## 1. The Asymptotic Framework

When analyzing algorithms, exact running times (e.g., $T(n) = 3n^2 + 10n + 4$) are often too detailed and hardware-dependent. We care about **scalability**: how the running time grows as $n \to \infty$.

We simplify analysis by:

1. **Ignoring lower-order terms**: As $n$ becomes large, $n^2$ dominates $n$.
2. **Ignoring leading constants**: $3n^2$ and $100n^2$ grow at the same "rate" (quadratic).

---

## 2. Asymptotic Definitions

### 2.1 Big-O Notation ($O$) - The Upper Bound

$O(g(n))$ is the set of functions that grow **no faster** than $g(n)$.

**Definition**: $f(n) = O(g(n))$ if there exist positive constants $c$ and $n_0$ such that:
$$0 \le f(n) \le c \cdot g(n) \quad \text{for all } n \ge n_0$$

* *Usage*: Worst-case analysis. "The algorithm takes *at most* quadratic time."

### 2.2 Big-Omega Notation ($\Omega$) - The Lower Bound

$\Omega(g(n))$ is the set of functions that grow **at least as fast** as $g(n)$.

**Definition**: $f(n) = \Omega(g(n))$ if there exist positive constants $c$ and $n_0$ such that:
$$0 \le c \cdot g(n) \le f(n) \quad \text{for all } n \ge n_0$$

* *Usage*: Best-case analysis or lower bounds on problems. "Sorting requires *at least* $n \log n$ time."

### 2.3 Big-Theta Notation ($\Theta$) - The Tight Bound

$\Theta(g(n))$ is the set of functions that grow **at the same rate** as $g(n)$.

**Definition**: $f(n) = \Theta(g(n))$ if $f(n) = O(g(n))$ AND $f(n) = \Omega(g(n))$.
Mathematically:
$$0 \le c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \quad \text{for all } n \ge n_0$$

---

## 3. Comparison Techniques

To determine the relationship between $f(n)$ and $g(n)$, we can often use limits.
Calculate $L = \lim_{n \to \infty} \frac{f(n)}{g(n)}$.

* If $L = 0$: $f(n)$ grows strictly slower than $g(n)$. ($f = O(g), f \ne \Theta(g)$).
* If $0 < L < \infty$: $f(n)$ and $g(n)$ grow at the same rate. ($f = \Theta(g)$).
* If $L = \infty$: $f(n)$ grows strictly faster than $g(n)$. ($f = \Omega(g), f \ne \Theta(g)$).

### Example 1: Polynomials

Let $f(n) = 2n^2 + 5n + 10$ and $g(n) = n^2$.
$$\lim_{n \to \infty} \frac{2n^2 + 5n + 10}{n^2} = \lim_{n \to \infty} \left( 2 + \frac{5}{n} + \frac{10}{n^2} \right) = 2$$
Since $0 < 2 < \infty$, $f(n) = \Theta(n^2)$.

### Example 2: Exponentials

Let $f(n) = 4^n$ and $g(n) = 2^n$.
$$\lim_{n \to \infty} \frac{4^n}{2^n} = \lim_{n \to \infty} \left(\frac{4}{2}\right)^n = \lim_{n \to \infty} 2^n = \infty$$
Thus, $4^n = \Omega(2^n)$ and $4^n \neq O(2^n)$. The base of the exponent matters significantly!

---

## 4. Common Growth Rates

Sorted from slowest to fastest:

1. $\Theta(1)$ (Constant)
2. $\Theta(\log n)$ (Logarithmic)
3. $\Theta(\sqrt{n})$ (Square root)
4. $\Theta(n)$ (Linear)
5. $\Theta(n \log n)$ (Linearithmic - typical for efficient sorting)
6. $\Theta(n^2)$ (Quadratic - typical for simple sorting)
7. $\Theta(n^3)$ (Cubic)
8. $\Theta(2^n)$ (Exponential)
9. $\Theta(n!)$ (Factorial)

**Rule of Thumb**: Logarithms grow slower than any polynomial. Polynomials grow slower than any exponential.

---

## References

* **CLRS**: Chapter 3: "Growth of Functions".
