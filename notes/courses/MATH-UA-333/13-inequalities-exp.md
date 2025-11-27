---
title: Inequalities about Expectation
date: 2025-11-17
---

## Basic facts about expectation

Let $X,Y$ be random variables.

- If $X \ge 0$ almost surely, then
  $$
  \mathbb{E}X \ge 0,
  $$
  with equality if and only if $\mathbb{P}(X=0)=1$.

- If $X \ge Y$ almost surely, then
  $$
  \mathbb{E}X \ge \mathbb{E}Y.
  $$

- Since $-|X| \le X \le |X|$, we have
  $$
  |\mathbb{E}X| \le \mathbb{E}|X|.
  $$

These monotonicity properties are the starting point for Markov’s inequality.

---

## Markov’s inequality

Let $X$ be a random variable with $X \ge 0$ almost surely and let $a>0$.

We have

$$
X \ge X \mathbf{1}\_{\{X \ge a\}} \ge a \mathbf{1}\_{\{X \ge a\}}.
$$

Taking expectations,

$$
\mathbb{E}X \ge \mathbb{E} \big(X \mathbf{1}\_{\{X\ge a\}} \big) \ge a \mathbb{E}\big(\mathbf{1}\_{\{X \ge a\}} \big)
= a \mathbb{P}(X \ge a)
$$

Therefore
$$
\mathbb{P}(X \ge a) \le \frac{\mathbb{E}X}{a}.
$$

If $X$ is not necessarily nonnegative, we can apply Markov to $|X|$:
$$
\mathbb{P}(|X|\ge a) \le \frac{\mathbb{E}|X|}{a}.
$$

Equality in Markov’s inequality (in the nonnegative case) forces
$$
X = a \mathbf{1}_{\{X\ge a\}}
$$
almost surely; that is, $X$ takes only the values $0$ and $a$.

---

## Chebyshev’s inequality

Let $X$ be a random variable with mean $\mu$ and variance
$$
\sigma^2 = \mathbb{E}\big((X-\mu)^2\big).
$$

For any $k>0$,
$$
|X-\mu| \ge k \quad \Longleftrightarrow \quad (X-\mu)^2 \ge k^2.
$$

Apply Markov’s inequality to $Y = (X-\mu)^2$ (which is nonnegative):
$$
\mathbb{P}\big(|X-\mu|\ge k\big)
= \mathbb{P}\big((X-\mu)^2 \ge k^2\big)
\le \frac{\mathbb{E}(X-\mu)^2}{k^2}
= \frac{\sigma^2}{k^2}.
$$

So Chebyshev’s inequality states:
$$
\mathbb{P}\big(|X-\mu|\ge k\big) \le \frac{\sigma^2}{k^2}.
$$

---

## Example: binomial tail via Markov and Chebyshev

> **Example (Binomial tails).**  
> Let $X \sim \mathrm{Bin}(n,p)$, so
> $$
> \mathbb{E}X = np, \qquad \operatorname{Var}(X) = np(1-p).
> $$
> Fix $k>0$. We want to bound $\mathbb{P}(X \ge np + k)$.
>
> - **Markov bound.** Since $X \ge 0$,
>   $$
>   \mathbb{P}(X \ge np + k)
>   \le \frac{\mathbb{E}X}{np + k}
>   = \frac{np}{np + k}.
>   $$
>
> - **Chebyshev bound.**  
>   Note that
>   $$
>   \{X \ge np + k\} \subseteq \{|X - np| \ge k\},
>   $$
>   so
>   $$
>   \mathbb{P}(X \ge np + k)
>   \le \mathbb{P}(|X - np| \ge k)
>   \le \frac{\operatorname{Var}(X)}{k^2}
>   = \frac{np(1-p)}{k^2}.
>   $$
> 
> Chebyshev typically gives a better bound than Markov here, but neither is exponential in $n$.

---

## One-sided Chebyshev inequality

Let $X$ be a random variable with mean $\mu$ and variance $\sigma^2$. For any $k>0$,
$$
\mathbb{P}(X \ge \mu + k) \le \frac{\sigma^2}{\sigma^2 + k^2}.
$$

**Idea of proof:**

Consider $Y = X + a$ for some $a > -\mu - k$, so that $\mu + k + a > 0$. Then
$$
\mathbb{P}(X \ge \mu + k)
= \mathbb{P}(Y \ge \mu + k + a).
$$
Apply Markov’s inequality to $Y^2$:
$$
\mathbb{P}(Y \ge \mu + k + a)
\le \frac{\mathbb{E}(Y^2)}{(\mu + k + a)^2}.
$$
Compute $\mathbb{E}(Y^2)$ in terms of $\mu,\sigma^2,a$ and then choose $a$ to minimize the bound. This optimization leads to
$$
\mathbb{P}(X \ge \mu + k) \le \frac{\sigma^2}{\sigma^2 + k^2}.
$$

---

## Chernoff bounds via mgf

Let $X$ be a random variable with mgf $M_X(t) = \mathbb{E}(e^{tX})$.

For $k>0$ and $t>0$,
$$
\mathbb{P}(X \ge k)
= \mathbb{P}\big(e^{tX} \ge e^{tk}\big)
\le e^{-tk} \, \mathbb{E}(e^{tX})
= e^{-tk} M_X(t),
$$
where we applied Markov’s inequality to the nonnegative random variable $e^{tX}$.

If $X_1,\dots,X_n$ are independent with common mgf $M(t)$, and $S_n = X_1 + \cdots + X_n$, then
$$
\mathbb{P}(S_n \ge k)
\le e^{-tk} M_{S_n}(t)
= e^{-tk} \prod_{j=1}^n M_{X_j}(t)
= e^{-tk} (M(t))^n.
$$

We can then choose $t$ to minimize the upper bound $e^{-tk} M(t)^n$.

---

## Example: Chernoff bound for binomial tail

> **Example (Chernoff bound for $\mathrm{Bin}(n,p)$).**  
> Let $X \sim \mathrm{Bin}(n,p)$ and write $X = X_1 + \cdots + X_n$ where $X_j$ are i.i.d. Bernoulli$(p)$.  
> For each $X_j$,
> $$
> M_{X_j}(t) = \mathbb{E}(e^{tX_j}) = p e^t + (1-p).
> $$
> Hence
> $$
> M_X(t) = (p e^t + 1 - p)^n.
> $$
> For $a>1$,
> $$
> \mathbb{P}(X \ge a n p)
> \le \exp(-t a n p)\, (p e^t + 1 - p)^n.
> $$
> Choose $t = \ln a$:
> $$
> \mathbb{P}(X \ge a n p)
> \le \big(a^{-ap} (a p + 1 - p)\big)^n.
> $$
> Using $e^x \ge 1 + x$, one shows
> $$
> a p + 1 - p \le e^{p(a-1)},
> $$
> so
> $$
> \mathbb{P}(X \ge a n p)
> \le \exp\big(n p (a - 1 - a \ln a)\big).
> $$
> For $a>1$, we have $a - 1 - a \ln a < 0$, hence the tail probability decays exponentially in $n$.
>
> For comparison:
> 
> - Markov: $\mathbb{P}(X \ge a n p) \le 1/a$.
> - Chebyshev:
>   $$
>   \mathbb{P}(X \ge a n p)
>   \le \frac{1-p}{n (a-1)^2 p}.
>   $$
> 
> Chernoff gives an exponentially small bound, which is much sharper.
