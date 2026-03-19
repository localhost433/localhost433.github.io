---
title: Limit Theorems
date: 2026-02-09
---

## 1. Introduction

Limit theorems explain "why science works". They describe the universal behavior of sums of independent, identically distributed (i.i.d.) random variables as the number of variables $n$ goes to infinity.

Let $X_1, X_2, \dots$ be i.i.d. random variables with mean $\mu = \E[X]$ and variance $\sigma^2 = \Var{X}$.
Consider the **sample mean**:
$$
    \overline{X}\_n = \frac{1}{n} \sum_{i=1}^n X_i
$$

---

## 2. Law of Large Numbers (LLN)

The Law of Large Numbers states that the sample mean converges to the true population mean.

### 2.1 Theorem (Weak Law of Large Numbers)

If $X_1, \dots, X_n$ are i.i.d. with finite mean $\mu$ and finite variance $\sigma^2$, then for any $\epsilon > 0$:
$$\lim_{n \to \infty} \mathbb{P}(|\overline{X}\_n - \mu| > \epsilon) = 0$$

This is convergence in probability, written as $\overline{X}\_n \xrightarrow{p} \mu$.

### 2.2 Proof (via Chebyshev's Inequality)

First, we establish Chebyshev's Inequality. For any random variable $Y$ with mean $\E[Y]$ and variance $\Var{Y}$, and for any $\epsilon > 0$:
$$\mathbb{P}(|Y - \E[Y]| \ge \epsilon) \le \frac{\Var{Y}}{\epsilon^2}$$

Now apply this to $Y = \overline{X}\_n$:

1. **Expectation of $\overline{X}\_n$:**
    $$\E[\overline{X}\_n] = \frac{1}{n} \sum \E[X_i] = \frac{1}{n} (n\mu) = \mu$$
2. **Variance of $\overline{X}\_n$:**
    $$\Var{\overline{X}\_n} = \Var{\frac{1}{n} \sum X_i} = \frac{1}{n^2} \sum \Var{X_i} = \frac{1}{n^2} (n\sigma^2) = \frac{\sigma^2}{n}$$
3. **Applying Chebyshev:**
    $$\mathbb{P}(|\overline{X}\_n - \mu| \ge \epsilon) \le \frac{\sigma^2/n}{\epsilon^2} = \frac{\sigma^2}{n\epsilon^2}$$
    As $n \to \infty$, the RHS goes to $0$.

### 2.3 Application: Monte Carlo Simulation

Goal is to estimate an integral $I = \int_0^1 f(x) dx$. Let $U$ be a continuous random variable s.t. $U \sim \text{Unif}[0,1]$. The p.d.f. of $U$ is:
$$
    p_U(u)=
    \begin{cases}
        & 1 \text{ for }0 \le u \le 1\\\\
        & 0 \text{ otherwise.}
    \end{cases}
$$
For the original integral:
$$
\E[f(U)] = \int_{-\infty}^{\infty} f(u) p_U(u) du = \int_0^1 f(u) \cdot 1 du = \int_0^1 f(x) dx = I
$$

1. Generate $U_1, \dots, U_n \sim \text{Unif}[0, 1]$ i.i.d..
2. Compute $Y_i = f(U_i)$, they are also i.i.d. with the same mean $\mu = I$.
3. By LLN:
   $$
   \frac{1}{n} \sum_{i=1}^n Y_i \xrightarrow{p} \E[Y_1]
   $$
   Substitute back:
   $$
   \frac{1}{n} \sum_{i=1}^n f(U_i) \xrightarrow{p} \int_0^1 f(x) dx
   $$

---

## 3. Central Limit Theorem (CLT)

While LLN tells us $\overline{X}\_n$ concentrates around $\mu$, the CLT tells us about the *distribution* of the fluctuations around $\mu$.

> "Fluctuations" as of $(\overline{X}\_n - \mu)$.

### 3.1 Theorem

Let $X_1, \dots, X_n$ be i.i.d. with mean $\mu$ and variance $\sigma^2 < \infty$. Let $S_n = \sum X_i$.
Then the standardized sum converges in distribution to a standard Normal random variable.

$$Z_n = \frac{\sqrt{n}(\overline{X}\_n - \mu)}{\sigma} \xrightarrow{d} \mathcal{N}(0, 1)$$

> Rigorously, "convergence in distribution" here means the CDF of $Z_n$ converges to the CDF of the standard normal dist. for every $z \in \R$:
> $$\lim_{n \to \infty} \mathbb{P}(Z_n \le z) = \Phi(z) = \int_{-\infty}^z \frac{1}{\sqrt{2\pi}} e^{-x^2/2} dx$$

**Interpretation:**
For large $n$, $\overline{X}\_n \approx \sim \mathcal{N}(\mu, \frac{\sigma^2}{n})$.

### 3.2 Proof Sketch (Characteristic Functions)

The proof relies on Moment Generating Functions (MGF)/ Characteristic Functions, and Lévy's continuity theorem.

> Lévy's Continuity Theorem:
> If the characteristic functions of a seq. of RVs converge to the characteristic function of $Y$, then the seq. converges in distribution to $Y$.

Let $Y_i = \frac{X_i - \mu}{\sigma}$. Because $X_i$ are i.i.d., $Y_i$ are also i.i.d., $\E[Y_i] = 0$ and $\Var{Y_i} = 1$. Rewrite the target $Z_n$ in terms of $Y_i$:

$$Z_n = \frac{1}{\sqrt{n}} \sum_{i=1}^n Y_i$$

Let $\varphi_Y(t)$ be the characteristic function of $Y_i$. Since the first two moments exist ($\E[Y]=0$, $\E[Y^2]=1$), we can expand $\varphi_Y(t)$ around $t=0$ using Taylor's theorem:

$$
    \begin{align*}
        \varphi_Y(t)
        &= \E[e^{itY}]\\\\
        &= 1 + it\E[Y] + \frac{(it)^2}{2!}\E[Y^2] + o(t^2)\\\\
        &= 1 + 0 - \frac{t^2}{2}(1) + o(t^2)\\\\
        &= 1 - \frac{t^2}{2} + o(t^2)
    \end{align*}
$$

Then:

$$
    \begin{align*}
        \varphi_{Z_n}(t)
        &= \varphi_{\sum Y_i / \sqrt{n}}(t)\\\\
        &= \prod_{i=1}^n \varphi_{Y_i}\left(\frac{t}{\sqrt{n}}\right)\\\\
        &= \left[ \varphi_Y\left(\frac{t}{\sqrt{n}}\right) \right]^n\\\\
        &= \left( 1 - \frac{(t/\sqrt{n})^2}{2} + o\left(\left(\frac{t}{\sqrt{n}}\right)^2\right) \right)^n\\\\
        &= \left( 1 - \frac{t^2}{2n} + o\left(\frac{t^2}{n}\right) \right)^n
    \end{align*}
$$

Using the definition of $e$, that $\lim_{n \to \infty} (1 + \frac{x}{n})^n = e^x$. As $n \to \infty$, the $o(t^2/n)$ term becomes negligible compared to the $1/n$ terms.

$$\lim_{n \to \infty} \varphi_{Z_n}(t) = e^{-t^2/2}$$

The function $e^{-t^2/2}$ is the characteristic function of $\mathcal{N}(0,1)$. By Lévy's Continuity Theorem, $Z_n \xrightarrow{d} \mathcal{N}(0, 1)$.

### 3.3 Example (Approximation)

Let $X_i \sim \text{Unif}[0, 1]$. We want $\mathbb{P}(\sum_{i=1}^{20} X_i \le 10)$.

* $\mu = 1/2$, $\sigma^2 = 1/12$.
* $S_{20} \approx \sim \mathcal{N}(20 \cdot 0.5, 20 \cdot \frac{1}{12}) = \sim \mathcal{N}(10, \frac{5}{3})$.
* Standardize and compute using the Standard Normal table.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 6: Limit Theorems.
