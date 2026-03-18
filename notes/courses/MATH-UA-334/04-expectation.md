---
title: Expectation
date: 2026-02-02
---

## 1. Motivation

Once we know the distribution of a random variable (RV), it is often useful to compute summaries or functionals of that distribution, such as the "center" or "spread". The most fundamental functional is the **Expected Value**.

---

## 2. Expected Value (Expectation)

### 2.1 Definition

The expected value $\E[X]$ is the probability-weighted average of the possible values of $X$.

* **Discrete Case:**
    If $X$ has PMF $p(x)$:
    $$\E[X] = \sum_{x} x \cdot p(x)$$
    (Provided $\sum |x|p(x) < \infty$, otherwise undefined).

* **Continuous Case:**
    If $X$ has PDF $f(x)$:
    $$\E[X] = \int_{-\infty}^{+\infty} x \cdot f(x) dx$$
    (Provided $\int |x|f(x) dx < \infty$).

**Interpretation:** $\E[X]$ represents the long-run average. By the Law of Large Numbers, if $X_1, \dots, X_n$ are i.i.d. copies of $X$, then $\frac{1}{n}\sum X_i \to \E[X]$.

### 2.2 Examples

1. **Bernoulli:** $X \sim \text{Bern}(p)$.
    $$\E[X] = 1 \cdot p + 0 \cdot (1-p) = p$$

2. **Binomial:** $X \sim B(n, p)$.
    $$\E[X] = \sum_{k=0}^n k \binom{n}{k} p^k (1-p)^{n-k} = np$$

    > Since the first term of the sum is $0$ (when $k=0$), we can start the summation from $k=1$. Let $m = n-1$ and $j = k-1$. As $k$ goes from $1$ to $n$, $j$ goes from $0$ to $m$. Note that $n-k = (m+1) - (j+1) = m-j$.
    > $$
    >     \begin{align*}
    >         \E[X] &= \sum_{k=1}^n k \frac{n!}{k!(n-k)!} p^k (1-p)^{n-k} \\\\
    >         &= \sum_{k=1}^n \frac{n \cdot (n-1)!}{(k-1)!(n-k)!} p \cdot p^{k-1} (1-p)^{n-k} \\\\
    >         &= np \sum_{k=1}^n \frac{(n-1)!}{(k-1)!(n-k)!} p^{k-1} (1-p)^{n-k} \\\\
    >         &= np \sum_{j=0}^m \frac{m!}{j!(m-j)!} p^j (1-p)^{m-j} \\\\
    >         &= np \sum_{j=0}^m \binom{m}{j} p^j (1-p)^{m-j} \\\\
    >         &= np(p + (1-p))^m \\\\
    >         &= np(1) \\\\
    >         &= np
    >     \end{align*}
    > $$

3. **Normal:** $X \sim \mathcal{N}(\mu, \sigma^2)$.
    Using the substitution $y = \frac{x-\mu}{\sigma}$:
    $$\E[X] = \int_{-\infty}^{\infty} x \frac{1}{\sqrt{2\pi}\sigma} e^{-\frac{(x-\mu)^2}{2\sigma^2}} dx = \mu$$

### 2.3 Properties

1. **Linearity:** For constants $a, b$:
    $$\E[aX + bY] = a\E[X] + b\E[Y]$$
    (This holds even if $X$ and $Y$ are dependent).

2. **LOTUS (Law of the Unconscious Statistician):**
    To compute $\E[g(X)]$, we don't need the PDF of $g(X)$; we can use the PDF of $X$.
    $$\E[g(X)] = \int_{-\infty}^{\infty} g(x) f_X(x) dx$$

---

## 3. Variance

The variance measures the spread or dispersion of a distribution around its mean.

### 3.1 Definition

$$\Var{X} = \E[(X - \E[X])^2]$$

Standard Deviation: $\sigma_X = \sqrt{\Var{X}}$.

### 3.2 Computational Formula

Expanding the square in the definition and using linearity:
$$
    \begin{align*}
        \Var{X}
        &= \E[X^2 - 2X \E[X] + (\E[X])^2]\\\\
        &= \E[X^2] - \E[2X \E[X]] + \E[(\E[X])^2]\\\\
        &= \E[X^2] - 2 \E[X] \E[X] + (\E[X])^2\\\\
        &= \E[X^2] - (\E[X])^2
    \end{align*}
$$

### 3.3 Properties of Variance

1. **Non-negative:** $\Var{X} \ge 0$.
2. **Scaling:** $\Var{aX + b} = a^2 \Var{X}$.
    * Adding a constant ($b$) shifts the distribution but does not change the spread.
    * Multiplying by $a$ scales the spread by $|a|$, so variance scales by $a^2$.
3. **Sum of Independent RVs:** If $X$ and $Y$ are independent:
    $$\Var{X + Y} = \Var{X} + \Var{Y}$$

### 3.4 Examples

1. **Bernoulli($p$):**
    * $\E[X] = p$.
    * $\E[X^2] = 1^2 \cdot p + 0^2 \cdot (1-p) = p$.
    * $\Var{X} = p - p^2 = p(1-p)$.

2. **Normal($\mu, \sigma^2$):**
    * Calculation of $\Var{X}$ involves integration by parts or recognizing the second moment of the standard normal is 1.
    * Result: $\Var{X} = \sigma^2$.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 4: Expectation.
