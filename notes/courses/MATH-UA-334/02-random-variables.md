---
title: Random Variables
date: 2026-01-26
---

## 1. Introduction to Random Variables

A **Random Variable (RV)** is a function that maps outcomes from the sample space to real numbers. It provides a numerical summary of a random experiment.

**Definition:**
Let $(\Omega, \mathcal{F}, \mathbb{P})$ be a probability space. A random variable $X$ is a function:
$$X: \Omega \to \mathbb{R}$$

### Examples

1. **Coin Flips:**
    * Experiment: Toss a coin 3 times.
    * $\Omega = \{HHH, HHT, \dots, TTT\}$.
    * Let $X$ be the number of heads.
    * $X(HHT) = 2$, $X(TTT) = 0$.

2. **Indicator Variables:**
    * For any event $A \subseteq \Omega$, the **indicator random variable** $I_A$ (or $\mathbb{1}_A$) is defined as:
        $$I_A(\omega) = \begin{cases} 1 & \text{if } \omega \in A \\ 0 & \text{if } \omega \notin A \end{cases}$$

---

## 2. Cumulative Distribution Function (CDF)

The distribution of a random variable is fully characterized by its Cumulative Distribution Function.

**Definition:**
The **CDF** of a random variable $X$, denoted $F_X(x)$, is defined as:
$$F_X(x) = \mathbb{P}(X \le x) = \mathbb{P}(\{\omega \in \Omega : X(\omega) \le x\})$$

### Properties of the CDF

1. **Limits:**
    $$\lim_{x \to -\infty} F_X(x) = 0, \quad \lim_{x \to +\infty} F_X(x) = 1$$
2. **Non-decreasing:**
    If $x_1 \le x_2$, then $F_X(x_1) \le F_X(x_2)$.
3. **Right-continuous:**
    $$F_X(x) = \lim_{y \to x^+} F_X(y)$$

---

## 3. Discrete Random Variables

A random variable $X$ is **discrete** if it takes values in a finite or countable set $\{x_1, x_2, \dots\}$.

### Probability Mass Function (PMF)

The PMF $p_X(x)$ gives the probability that $X$ takes the specific value $x$.
$$p_X(x_i) = \mathbb{P}(X = x_i)$$

**Properties:**
* $p_X(x_i) \ge 0$
* $\sum_{i} p_X(x_i) = 1$
* Relation to CDF: $F_X(x) = \sum_{x_i \le x} p_X(x_i)$ (a step function).

### Common Discrete Distributions

1. **Bernoulli ($p$):** $X \in \{0, 1\}$.
    * $p_X(1) = p$, $p_X(0) = 1-p$.
2. **Binomial ($n, p$):** Number of successes in $n$ independent Bernoulli trials.
    * $$p_X(k) = \binom{n}{k} p^k (1-p)^{n-k}, \quad k \in \{0, \dots, n\}$$
3. **Geometric ($p$):** Number of failures before the first success.
    * $$p_X(k) = (1-p)^k p, \quad k \in \{0, 1, \dots\}$$
4. **Poisson ($\lambda$):** Modeling rare events.
    * $$p_X(k) = e^{-\lambda} \frac{\lambda^k}{k!}, \quad k \in \{0, 1, \dots\}$$

---

## 4. Continuous Random Variables

A random variable $X$ is **continuous** if there exists a non-negative function $f_X(x)$, called the **Probability Density Function (PDF)**, such that for any set $B \subseteq \mathbb{R}$:
$$\mathbb{P}(X \in B) = \int_B f_X(x) \, dx$$

**Properties:**
* $f_X(x) \ge 0$.
* $\int_{-\infty}^{\infty} f_X(x) \, dx = 1$.
* Relation to CDF: $F_X(x) = \int_{-\infty}^{x} f_X(t) \, dt$.
* Fundamental Theorem of Calculus: $f_X(x) = F'_X(x)$ (where derivative exists).
* **Important:** For continuous RVs, $\mathbb{P}(X = c) = 0$ for any specific point $c$.

### Common Continuous Distributions

1. **Uniform ($a, b$):**
    * $$f_X(x) = \frac{1}{b-a} \quad \text{for } x \in [a, b]$$
2. **Exponential ($\lambda$):** Modeling waiting times.
    * $$f_X(x) = \lambda e^{-\lambda x} \quad \text{for } x \ge 0$$
    * CDF: $F_X(x) = 1 - e^{-\lambda x}$.
3. **Normal (Gaussian) ($\mu, \sigma^2$):** The most important distribution due to the Central Limit Theorem.
    * Notation: $X \sim \mathcal{N}(\mu, \sigma^2)$.
    * $$f_X(x) = \frac{1}{\sqrt{2\pi}\sigma} \exp\left( -\frac{(x-\mu)^2}{2\sigma^2} \right)$$
    * $\mu$: mean (location).
    * $\sigma$: standard deviation (scale).

### Linear Transformation of Normal RVs

**Claim:** If $X \sim \mathcal{N}(0, 1)$, then $Y = \sigma X + \mu \sim \mathcal{N}(\mu, \sigma^2)$.

**Proof:**
Let $F_Y(y)$ be the CDF of $Y$.
$$
\begin{align*}
F_Y(y) &= \mathbb{P}(Y \le y) \\\\
&= \mathbb{P}(\sigma X + \mu \le y) \\\\
&= \mathbb{P}\left(X \le \frac{y - \mu}{\sigma}\right) \\\\
&= F_X\left(\frac{y - \mu}{\sigma}\right)
\end{align*}
$$
Differentiating with respect to $y$ to get the PDF:
$$
\begin{align*}
f_Y(y) &= \frac{d}{dy} F_X\left(\frac{y - \mu}{\sigma}\right) \\\\
&= f_X\left(\frac{y - \mu}{\sigma}\right) \cdot \frac{1}{\sigma} \quad (\text{Chain Rule}) \\\\
&= \frac{1}{\sqrt{2\pi}} \exp\left( -\frac{1}{2} \left(\frac{y-\mu}{\sigma}\right)^2 \right) \cdot \frac{1}{\sigma} \\\\
&= \frac{1}{\sqrt{2\pi}\sigma} \exp\left( -\frac{(y-\mu)^2}{2\sigma^2} \right)
\end{align*}
$$
This matches the density of $\mathcal{N}(\mu, \sigma^2)$.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 2: Random Variables.