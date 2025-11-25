---
title: Moment Generating Functions
date: 2025-11-11/13
---

## Moments and generating functions for sequences

Let $X$ be a random variable. For $n \ge 1$, the **$n$-th moment** of $X$ is
$$
\mathbb{E}(X^n).
$$

For a (deterministic) sequence $\{a_n\}_{n\ge 0}$, the **(ordinary) generating function** is
$$
F(z) = \sum_{n=0}^{\infty} a_n z^n.
$$
Within the radius of convergence,
$$
a_n = \frac{1}{n!} \frac{d^n}{dz^n} F(z)\bigg|_{z=0}.
$$

The **exponential generating function** is
$$
G(z) = \sum_{n=0}^{\infty} \frac{a_n}{n!} z^n,
$$
and then
$$
a_n = \frac{d^n}{dz^n} G(z)\bigg|_{z=0}.
$$

For random variables, the moment generating function plays a similar role with coefficients given by the moments $\mathbb{E}(X^n)$.

---

## Moment generating function: definition and basic properties

### Definition

For a real-valued random variable $X$, the **moment generating function (mgf)** is
$$
M_X(t) = \mathbb{E}\big(e^{tX}\big), \qquad t \in \mathbb{R},
$$
whenever this expectation is finite.

Using the power series of the exponential,
$$
e^{tX} = \sum_{n=0}^{\infty} \frac{(tX)^n}{n!},
$$
we obtain
$$
M_X(t) = \mathbb{E}\left(\sum_{n=0}^{\infty} \frac{(tX)^n}{n!}\right)
= \sum_{n=0}^{\infty} \frac{t^n}{n!} \mathbb{E}(X^n),
$$
where the interchange of expectation and summation is justified when the series converges absolutely.

In particular,
$$
\mathbb{E}(X^n) = \frac{d^n}{dt^n} M_X(t)\bigg|_{t=0}.
$$

### Basic properties

- $M_X(0) = \mathbb{E}(e^{0\cdot X}) = 1$.
- **Uniqueness (informal):** if $M_X(t)$ exists in a neighborhood of $0$ and two random variables $X,Y$ have the same mgf on such an interval, then $X$ and $Y$ have the same distribution.
- **Independence and sums:**  
  If $X$ and $Y$ are independent and $Z = X+Y$, then
  $$
  M_Z(t) = \mathbb{E}\big(e^{t(X+Y)}\big)
  = \mathbb{E}\big(e^{tX} e^{tY}\big)
  = \mathbb{E}(e^{tX}) \, \mathbb{E}(e^{tY})
  = M_X(t) M_Y(t).
  $$
  More generally, for independent $X_1,\dots,X_n$,
  $$
  M_{X_1+\cdots+X_n}(t) = \prod_{k=1}^n M_{X_k}(t).
  $$
- **Domain issues:**  
  It can happen that $M_X(t)$ is finite only for $t$ in some interval around $0$, or even that
  $$
  M_X(t) = \infty \quad \text{for all } t \ne 0.
  $$

---

## Examples of mgfs

> **Example (Exponential distribution).**  
> Let $X \sim \mathrm{Exp}(\lambda)$ with density $\lambda e^{-\lambda x}$ on $[0,\infty)$.  
> Then for $t \in \mathbb{R}$,
> $$
> M_X(t) = \int_0^{\infty} \lambda e^{-\lambda x} e^{tx} \, dx
> = \lambda \int_0^{\infty} e^{-(\lambda - t)x} \, dx.
> $$
> If $t < \lambda$, the integral converges:
> $$
> M_X(t) = \lambda \cdot \frac{1}{\lambda - t} = \frac{\lambda}{\lambda - t}.
> $$
> If $t \ge \lambda$, the integral diverges and $M_X(t) = \infty$.  
> Hence
> $$
> M_X(t) =
> \begin{cases}
> \dfrac{\lambda}{\lambda - t}, & t < \lambda,\\[4pt]
> \infty, & t \ge \lambda.
> \end{cases}
> $$

> **Example (Binomial distribution).**  
> Let $X \sim \mathrm{Bin}(n,p)$. Then
> $$
> M_X(t)
> = \mathbb{E}(e^{tX})
> = \sum_{k=0}^{n} e^{tk} \binom{n}{k} p^k (1-p)^{n-k}.
> $$
> Factor:
> $$
> M_X(t) = \sum_{k=0}^{n} \binom{n}{k} (p e^t)^k (1-p)^{n-k}
> = (1 - p + p e^t)^n.
> $$
> Differentiate:
> $$
> M_X'(t) = n(1 - p + p e^t)^{n-1} \cdot p e^t,
> $$
> $$
> M_X''(t)
> = n(n-1)(1 - p + p e^t)^{n-2} (p e^t)^2
> + n(1 - p + p e^t)^{n-1} p e^t.
> $$
> At $t=0$,
> $$
> \mathbb{E}(X) = M_X'(0)
> = n(1 - p + p)^{n-1} p
> = np,
> $$
> $$
> \mathbb{E}(X^2) = M_X''(0)
> = n(n-1)p^2 + np.
> $$
> Hence
> $$
> \operatorname{Var}(X)
> = \mathbb{E}(X^2) - (\mathbb{E}X)^2
> = np(1-p).
> $$

> **Example (Poisson distribution).**  
> Let $X \sim \mathrm{Poi}(\lambda)$. Then
> $$
> M_X(t) = \mathbb{E}(e^{tX})
> = \sum_{k=0}^{\infty} e^{tk} e^{-\lambda} \frac{\lambda^k}{k!}
> = e^{-\lambda} \sum_{k=0}^{\infty} \frac{(\lambda e^t)^k}{k!}
> = e^{-\lambda} e^{\lambda e^t}
> = \exp\big(\lambda(e^t - 1)\big).
> $$
> From this,
> $$
> \mathbb{E}X = \lambda, \qquad \operatorname{Var}(X) = \lambda.
> $$

> **Example (Uniform distribution on $[a,b]$).**  
> Let $X \sim \mathrm{Unif}([a,b])$. Then
> $$
> M_X(t) = \mathbb{E}(e^{tX})
> = \int_a^b \frac{1}{b-a} e^{tx} \, dx
> = \frac{e^{tb} - e^{ta}}{t(b-a)}, \quad t \ne 0,
> $$
> and $M_X(0)=1$ by continuity.  
> Differentiating and letting $t\to 0$ recovers
> $$
> \mathbb{E}X = \frac{a+b}{2}, \qquad
> \operatorname{Var}(X) = \frac{(b-a)^2}{12}.
> $$

> **Example (Normal distribution).**  
> Let $X \sim N(\mu,\sigma^2)$. Then
> $$
> M_X(t)
> = \mathbb{E}(e^{tX})
> = \frac{1}{\sqrt{2\pi}\sigma} \int_{-\infty}^{\infty}
> \exp\left(-\frac{(x-\mu)^2}{2\sigma^2} + tx\right) \, dx.
> $$
> Completing the square in the exponent yields
> $$
> M_X(t) = \exp\left(\mu t + \frac{1}{2}\sigma^2 t^2\right).
> $$
> In particular,
> $$
> \mathbb{E}X = \mu, \qquad \operatorname{Var}(X) = \sigma^2.
> $$
> If $X \sim N(\mu_1,\sigma_1^2)$ and $Y \sim N(\mu_2,\sigma_2^2)$ are independent, then
> $$
> M_{X+Y}(t) = M_X(t) M_Y(t)
> = \exp\left( (\mu_1 + \mu_2)t + \frac{1}{2}(\sigma_1^2 + \sigma_2^2)t^2 \right),
> $$
> so
> $$
> X+Y \sim N(\mu_1+\mu_2, \sigma_1^2 + \sigma_2^2).
> $$

---

## Characteristic functions

Because $M_X(t)$ can be infinite for all $t\ne 0$, it is often more convenient to use the **characteristic function**
$$
\varphi_X(t) = \mathbb{E}(e^{itX}), \qquad t \in \mathbb{R}.
$$

- Always satisfies $|\varphi_X(t)| \le 1$.
- If $X,Y$ are independent and $Z=X+Y$, then
  $$
  \varphi_Z(t) = \varphi_X(t)\,\varphi_Y(t).
  $$
- For $X\sim N(\mu,\sigma^2)$,
  $$
  \varphi_X(t) = \exp\big(i\mu t - \tfrac{1}{2}\sigma^2 t^2\big).
  $$

When they exist in a neighborhood of $0$, both the mgf and characteristic function uniquely determine the distribution of $X$.
