---
title: Laws of Large Numbers
date: 2025-11-19
---

## Convergence of real sequences

For a deterministic sequence $(x_n)_{n\ge 1}$ of real numbers, we say
$$
x_n \to x \quad \text{as } n\to\infty
$$
if for every $\varepsilon > 0$ there exists $N$ such that for all $n \ge N$,
$$
|x_n - x| < \varepsilon.
$$

We now introduce analogous notions for random variables.

---

## Convergence of random variables

Let $(X_n)_{n\ge 1}$ and $X$ be random variables on the same probability space.

### Convergence almost surely

We say that $X_n$ converges to $X$ **almost surely (a.s.)** if
$$
\mathbb{P}\big( \{\omega : \lim_{n\to\infty} X_n(\omega) = X(\omega)\} \big) = 1.
$$

Equivalently, there exists an event $A$ with $\mathbb{P}(A)=1$ such that for every $\omega \in A$,
$$
\lim_{n\to\infty} X_n(\omega) = X(\omega).
$$

We write $X_n \xrightarrow{a.s.} X$.

### Convergence in probability

We say that $X_n$ converges to $X$ **in probability** if for every $\varepsilon>0$,
$$
\lim_{n\to\infty} \mathbb{P}\big(|X_n - X| > \varepsilon\big) = 0.
$$

We write $X_n \xrightarrow{P} X$.

### Convergence in distribution

Let $F_n(x) = \mathbb{P}(X_n \le x)$ and $F(x) = \mathbb{P}(X \le x)$ be the distribution functions of $X_n$ and $X$. We say $X_n$ converges to $X$ **in distribution** if
$$
F_n(x) \to F(x)
$$
for every $x$ at which $F$ is continuous.

We write $X_n \xrightarrow{d} X$.

### Relationships between modes of convergence

We have the chain:
$$
X_n \xrightarrow{a.s.} X \quad \Rightarrow \quad X_n \xrightarrow{P} X \quad \Rightarrow \quad X_n \xrightarrow{d} X.
$$

- If $X_n \to X$ almost surely, then the set where convergence fails has probability $0$, which forces $\mathbb{P}(|X_n - X| > \varepsilon) \to 0$ for every $\varepsilon>0$.
- If $X_n \to X$ in probability, one can show $F_n(x) \to F(x)$ at continuity points of $F$ using bounds like
  $$
  |F_n(x) - F(x)| \le \mathbb{P}(|X_n - X| > \varepsilon) + |F(x+\varepsilon) - F(x-\varepsilon)|.
  $$

The converses need not hold in general.

---

## Weak Law of Large Numbers (WLLN)

Let $X_1, X_2, \dots$ be independent, identically distributed random variables with finite expectation $\mu = \mathbb{E}X_1$ and finite variance $\sigma^2 = \operatorname{Var}(X_1)$.

Define the sample mean
$$
\overline{X}_n = \frac{X_1 + \cdots + X_n}{n}.
$$

**Weak Law of Large Numbers (one standard version):**
$$
\overline{X}_n \xrightarrow{P} \mu
\quad \text{as } n\to\infty.
$$

**Proof using Chebyshev’s inequality:**

First compute the mean and variance of $\overline{X}_n$:

- Linearity of expectation:

$$
\mathbb{E}\overline{X}\_n
= \mathbb{E} \left(\frac{1}{n}\sum\_{k=1}^n X\_k\right)
= \frac{1}{n}\sum\_{k=1}^n \mathbb{E}X\_k
= \mu
$$

- Independence and identical distribution give

$$
\operatorname{Var}(\overline{X}_n)
= \operatorname{Var}\left(\frac{1}{n}\sum\_{k=1}^n X\_k\right)
= \frac{1}{n^2} \sum\_{k=1}^n \operatorname{Var}(X\_k)
= \frac{\sigma^2}{n}.
$$

Now for any $\varepsilon>0$, Chebyshev’s inequality gives
$$
\mathbb{P}\big(|\overline{X}_n - \mu|\ge \varepsilon\big)
\le \frac{\operatorname{Var}(\overline{X}_n)}{\varepsilon^2}
= \frac{\sigma^2}{n\varepsilon^2} \xrightarrow{n\to\infty} 0.
$$
Hence $\overline{X}_n \xrightarrow{P} \mu$.

> **Example (Geometric sample mean).**  
> Let $X_1,\dots,X_n$ be independent geometric random variables with parameter $p=0.1$. Then
> $$
> \mathbb{E}X_1 = \frac{1}{p} = 10, \qquad
> \operatorname{Var}(X_1) = \frac{1-p}{p^2} = 90.
> $$
> Let
> $$
> \overline{X}_n = \frac{X_1+\cdots+X_n}{n}.
> $$
> Chebyshev gives
> $$
> \mathbb{P}\big(|\overline{X}_n - 10| > 1\big)
> \le \frac{\operatorname{Var}(X_1)}{n \cdot 1^2}
> = \frac{90}{n}.
> $$
> So the probability that the sample mean deviates from $10$ by more than $1$ goes to $0$ as $n\to\infty$.

---

## Borel–Cantelli lemma

The **Borel–Cantelli lemma** is a key tool for almost sure convergence.

Let $A_1, A_2,\dots$ be events. If
$$
\sum_{n=1}^{\infty} \mathbb{P}(A_n) < \infty,
$$
then with probability $1$, only finitely many of the events $A_n$ occur.

In other words, there exists a random (finite) $N(\omega)$ such that $A_n(\omega)$ does not occur for all $n > N(\omega)$, for almost every $\omega$.

Equivalently, the event
$$
\{\omega : A_n(\omega) \text{ occurs infinitely often}\}
$$
has probability $0$.

---

## Strong Law of Large Numbers (SLLN)

Let $X_1,X_2,\dots$ be i.i.d. with finite mean $\mu = \mathbb{E}X_1$.

**Strong Law of Large Numbers:**
$$
\overline{X}_n = \frac{X_1+\cdots+X_n}{n}
\xrightarrow{a.s.} \mu.
$$

That is, with probability $1$,
$$
\lim_{n\to\infty} \frac{X_1+\cdots+X_n}{n} = \mu.
$$

The full proof is subtle. One version (as outlined in the slides) assumes an additional fourth-moment condition $\mathbb{E}|X_1|^4 < \infty$.

### Outline under $\mathbb{E}|X_1|^4<\infty$

Let $S_n = X_1 + \cdots + X_n$. For fixed $k>0$ define events
$$
A_n = ( \left|\frac{S_n}{n} - \mu\right| \ge \frac{1}{k} ).
$$
> Note: the set brackets can't be parsed on web correctly (probably because similar to tex grammar) so I replaced it with parentheses.

If we can show
$$
\sum_{n=1}^{\infty} \mathbb{P}(A_n) < \infty,
$$
then by Borel–Cantelli, with probability $1$ only finitely many $A_n$ occur, which implies that eventually
$$
\left|\frac{S_n}{n} - \mu\right| < \frac{1}{k}.
$$
Doing this for all integer $k$ gives $\overline{X}_n \to \mu$ almost surely.

Apply Markov to $Y_n = \left|\frac{S_n}{n} - \mu\right|^4$:
$$
\mathbb{P}(A_n)
= \mathbb{P}\left(\left|\frac{S_n}{n} - \mu\right| \ge \frac{1}{k}\right)
\le k^4 \, \mathbb{E}\left(\frac{S_n}{n} - \mu\right)^4.
$$

We want a bound
$$
\mathbb{E}(S_n - n\mu)^4 \le C n^2
$$
for some constant $C$ depending only on the distribution of $X_1$.

Then
$$
\mathbb{E}\left(\frac{S_n}{n} - \mu\right)^4
= \frac{1}{n^4} \mathbb{E}(S_n - n\mu)^4
\le \frac{C}{n^2},
$$
and hence
$$
\mathbb{P}(A_n) \le k^4 \frac{C}{n^2}.
$$
Since $\sum_{n} n^{-2} < \infty$, we obtain $\sum_n \mathbb{P}(A_n)<\infty$.

To establish $\mathbb{E}(S_n - n\mu)^4 \le C n^2$, expand
$$
S_n - n\mu = \sum_{i=1}^n (X_i - \mu)
$$
and use independence and centering to see that only index patterns with either all four equal or two equal pairs contribute. The resulting expression is of order
$$
n\,\mathbb{E}(X_1-\mu)^4 + n^2 (\mathbb{E}(X_1-\mu)^2)^2,
$$
which is bounded by a constant times $n^2$ under $\mathbb{E}|X_1|^4<\infty$.

---

## Summary of convergence and LLNs

- Modes of convergence:
  $$
  X_n \xrightarrow{a.s.} X
  \;\Rightarrow\;
  X_n \xrightarrow{P} X
  \;\Rightarrow\;
  X_n \xrightarrow{d} X.
  $$

- **WLLN:** sample averages converge to the mean in probability.
- **SLLN:** sample averages converge to the mean almost surely.

Inequalities from earlier (Markov, Chebyshev) and tools like Borel–Cantelli are central to proving these laws.
