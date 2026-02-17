---
title: Limit Theorems
date: 2026-02-09
---

## 1. Introduction

Limit theorems explain "why science works". They describe the universal behavior of sums of independent, identically distributed (i.i.d.) random variables as the number of variables $n$ goes to infinity.

Let $X_1, X_2, \dots$ be i.i.d. random variables with mean $\mu = E[X]$ and variance $\sigma^2 = \text{Var}(X)$.
Consider the **sample mean**:
$$
\overline{X}\_n = \frac{1}{n} \sum\_{i=1}^n X\_i
$$

---

## 2. Law of Large Numbers (LLN)

The Law of Large Numbers states that the sample mean converges to the true population mean.

### 2.1 Theorem (Weak Law of Large Numbers)

If $X_1, \dots, X_n$ are i.i.d. with finite mean $\mu$ and finite variance $\sigma^2$, then for any $\epsilon > 0$:
$$\lim_{n \to \infty} \mathbb{P}(|\overline{X}_n - \mu| > \epsilon) = 0$$

This is convergence in probability, written as $\overline{X}_n \xrightarrow{p} \mu$.

### 2.2 Proof (via Chebyshev's Inequality)

1. **Expectation of $\overline{X}_n$:**
    $$E[\overline{X}_n] = \frac{1}{n} \sum E[X_i] = \frac{1}{n} (n\mu) = \mu$$
2. **Variance of $\overline{X}_n$:**
    $$\text{Var}(\overline{X}_n) = \text{Var}\left(\frac{1}{n} \sum X_i\right) = \frac{1}{n^2} \sum \text{Var}(X_i) = \frac{1}{n^2} (n\sigma^2) = \frac{\sigma^2}{n}$$
3. **Chebyshev's Inequality:**
    $$\mathbb{P}(|Y - E[Y]| \ge \epsilon) \le \frac{\text{Var}(Y)}{\epsilon^2}$$
    Applying this to $Y = \overline{X}_n$:
    $$\mathbb{P}(|\overline{X}_n - \mu| \ge \epsilon) \le \frac{\sigma^2/n}{\epsilon^2} = \frac{\sigma^2}{n\epsilon^2}$$
    As $n \to \infty$, the RHS goes to 0.

### 2.3 Application: Monte Carlo Simulation

To estimate an integral $I = \int_0^1 f(x) \, dx$:
1. Generate $U_1, \dots, U_n \sim \text{Unif}[0, 1]$.
2. Compute $Y_i = f(U_i)$.
3. By LLN, $\frac{1}{n} \sum Y_i \to E[f(U)] = \int_0^1 f(u) \cdot 1 \, du = I$.

---

## 3. Central Limit Theorem (CLT)

While LLN tells us $\overline{X}_n$ concentrates around $\mu$, the CLT tells us about the *distribution* of the fluctuations around $\mu$.

### 3.1 Theorem

Let $X_1, \dots, X_n$ be i.i.d. with mean $\mu$ and variance $\sigma^2 < \infty$. Let $S_n = \sum X_i$.
Then the standardized sum converges in distribution to a standard Normal random variable.

$$Z_n = \frac{S_n - n\mu}{\sigma \sqrt{n}} = \frac{\sqrt{n}(\overline{X}_n - \mu)}{\sigma} \xrightarrow{d} \mathcal{N}(0, 1)$$

**Interpretation:**
For large $n$, $\overline{X}_n \approx \mathcal{N}(\mu, \frac{\sigma^2}{n})$.

### 3.2 Proof Sketch (Characteristic Functions)

The proof relies on Moment Generating Functions (MGF) or Characteristic Functions.
Let $\phi_X(t) = E[e^{itX}]$.
Assume (WLOG) $\mu=0, \sigma=1$. We look at $\frac{1}{\sqrt{n}}\sum X_i$.
$$\phi_{Z_n}(t) = E\left[ \exp\left( i t \frac{\sum X_k}{\sqrt{n}} \right) \right] = \left( \phi_X\left( \frac{t}{\sqrt{n}} \right) \right)^n$$
Using Taylor expansion $\phi_X(u) \approx 1 - \frac{u^2}{2} + o(u^2)$:
$$\phi_{Z_n}(t) \approx \left( 1 - \frac{(t/\sqrt{n})^2}{2} \right)^n = \left( 1 - \frac{t^2}{2n} \right)^n$$
As $n \to \infty$, this converges to $e^{-t^2/2}$, which is the characteristic function of $\mathcal{N}(0, 1)$.

### 3.3 Example (Approximation)

Let $X_i \sim \text{Unif}[0, 1]$. We want $\mathbb{P}(\sum_{i=1}^{20} X_i \le 10)$.
* $\mu = 1/2$, $\sigma^2 = 1/12$.
* $S_{20} \approx \mathcal{N}(20 \cdot 0.5, 20 \cdot \frac{1}{12}) = \mathcal{N}(10, \frac{5}{3})$.
* Standardize and compute using Standard Normal table.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 6: Limit Theorems.