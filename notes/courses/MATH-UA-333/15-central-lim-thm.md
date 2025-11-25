---
title: Central Limit Theorem
date: 2025-11-19/25
---

## Motivation: Chebyshev is too weak

> **Example (10,000 fair coins).**  
> Consider flipping $10{,}000$ fair coins. Let $X$ be the number of heads. Then $X = X_1 + \cdots + X_{10000}$ where $X_j$ are i.i.d. Bernoulli$(1/2)$.  
> We have
> $$
> \mathbb{E}X = 5000, \qquad \operatorname{Var}(X) = 2500.
> $$
> We are interested in
> $$
> \mathbb{P}\big(|X - 5000| \ge 50\big).
> $$
> Chebyshev’s inequality gives
> $$
> \mathbb{P}\big(|X - 5000| \ge 50\big)
> \le \frac{\operatorname{Var}(X)}{50^2}
> = \frac{2500}{2500} = 1,
> $$
> which is trivial. We need a much sharper result. The Central Limit Theorem provides one.

---

## Statement of the Central Limit Theorem (CLT)

Let $X_1,X_2,\dots$ be i.i.d. random variables with mean $\mu$ and variance $\sigma^2 < \infty$.

Define
$$
S_n = X_1 + \cdots + X_n, \qquad
Z_n = \frac{S_n - n\mu}{\sigma\sqrt{n}}.
$$

**Central Limit Theorem:**
If $\xi \sim \mathcal{N}(0,1)$, then for every $x \in \mathbb{R}$,
$$
\lim_{n\to\infty} \mathbb{P}(Z_n \le x) = \mathbb{P}(\xi \le x).
$$
Equivalently,
$$
Z_n \xrightarrow{d} \mathcal{N}(0,1).
$$

In practice, for many distributions, the approximation is already reasonably good for moderately large $n$ (e.g. $n$ of order $50$ or $100$).

---

## Convergence in distribution and bounded continuous functions

Recall: $X_n \xrightarrow{d} X$ means $F_{X_n}(x) \to F_X(x)$ at each continuity point of $F_X$.

A useful equivalent (stated in the slides):

If $X_n \xrightarrow{d} X$ and $f$ is bounded and continuous, then
$$
\mathbb{E}f(X_n) \to \mathbb{E}f(X).
$$

One way to prove this uses Skorokhod’s representation theorem:

> There exist random variables $Y_n$ and $Y$ defined on a common probability space such that
> $$
> Y_n \stackrel{d}{=} X_n, \quad Y \stackrel{d}{=} X, \quad Y_n \xrightarrow{a.s.} Y.
> $$
> Then $f(Y_n)\to f(Y)$ almost surely, and bounded convergence gives $\mathbb{E}f(Y_n) \to \mathbb{E}f(Y)$, hence the same convergence for $X_n$.

---

## Characteristic functions and convergence

The **characteristic function** of a random variable $X$ is
$$
\varphi_X(t) = \mathbb{E}(e^{itX}), \qquad t\in\mathbb{R}.
$$

Key theorem:

- If $X_n \xrightarrow{d} X$, then $\varphi_{X_n}(t) \to \varphi_X(t)$ for every $t$.
- Conversely, if $\varphi_{X_n}(t) \to \varphi_X(t)$ for all $t$ and $\varphi_X$ is continuous at $0$, then $X_n \xrightarrow{d} X$.

Thus, convergence in distribution is equivalent to pointwise convergence of characteristic functions.

This is the main tool for proving the CLT.

---

## Proof of the CLT (via characteristic functions)

We sketch the proof under the assumption $\mathbb{E}X_1^2<\infty$.

### Step 1: Standardized case $\mu = 0$, $\sigma^2 = 1$

Assume $\mathbb{E}X_1 = 0$ and $\mathbb{E}X_1^2 = 1$. Define
$$
Z_n = \frac{X_1 + \cdots + X_n}{\sqrt{n}}.
$$

We want to show $Z_n \xrightarrow{d} \xi$ where $\xi \sim \mathcal{N}(0,1)$.

By the characteristic function criterion, it suffices to show
$$
\varphi_{Z_n}(t) \to \varphi_{\xi}(t) = e^{-t^2/2}
$$
for each fixed $t$.

First compute $\varphi_{Z_n}(t)$ using independence:
$$
\varphi_{Z_n}(t)
= \mathbb{E}\left(e^{it Z_n}\right)
= \mathbb{E}\left(e^{it (X_1+\cdots+X_n)/\sqrt{n}}\right)
= \prod_{k=1}^n \mathbb{E}\left(e^{itX_k/\sqrt{n}}\right)
= \left(\varphi_{X_1}\left(\frac{t}{\sqrt{n}}\right)\right)^n.
$$

We expand $\varphi_{X_1}(u)$ for small $u$ using Taylor’s theorem. Since
$$
\varphi_{X_1}(u) = \mathbb{E}(e^{iuX_1}),
$$
we have
$$
\varphi_{X_1}'(0) = i\mathbb{E}X_1 = 0,
$$
$$
\varphi_{X_1}''(0) = -\mathbb{E}X_1^2 = -1.
$$

Hence near $u=0$,
$$
\varphi_{X_1}(u) = 1 - \frac{u^2}{2} + o(u^2).
$$

Substitute $u = t/\sqrt{n}$:
$$
\varphi_{X_1}\left(\frac{t}{\sqrt{n}}\right)
= 1 - \frac{t^2}{2n} + o\left(\frac{1}{n}\right).
$$

Thus
$$
\varphi_{Z_n}(t)
= \left(1 - \frac{t^2}{2n} + o\left(\frac{1}{n}\right)\right)^n.
$$

As $n\to\infty$,
$$
\left(1 - \frac{t^2}{2n} + o\left(\frac{1}{n}\right)\right)^n
\to e^{-t^2/2},
$$
because if $a_n \to 0$ and $n a_n \to c$, then $(1+a_n)^n \to e^c$.

Therefore, $\varphi_{Z_n}(t) \to e^{-t^2/2}$ for each $t$, so $Z_n \xrightarrow{d} \mathcal{N}(0,1)$ in the standardized case.

### Step 2: General case

Now suppose $X_1$ has mean $\mu$ and variance $\sigma^2 > 0$.

Define standardized variables
$$
\widetilde{X}_k = \frac{X_k - \mu}{\sigma}.
$$

Then $\mathbb{E}\widetilde{X}_k = 0$, $\mathbb{E}\widetilde{X}_k^2 = 1$, and the $\widetilde{X}_k$ are i.i.d.

Apply the standardized CLT to $\widetilde{X}_k$: for
$$
\widetilde{Z}_n = \frac{\widetilde{X}_1 + \cdots + \widetilde{X}_n}{\sqrt{n}},
$$
we have $\widetilde{Z}_n \xrightarrow{d} \mathcal{N}(0,1)$.

But
$$
\widetilde{Z}_n
= \frac{1}{\sqrt{n}\sigma}\Big[(X_1 - \mu) + \cdots + (X_n - \mu)\Big]
= \frac{S_n - n\mu}{\sigma \sqrt{n}} = Z_n.
$$

Hence $Z_n \xrightarrow{d} \mathcal{N}(0,1)$ for general $\mu,\sigma^2$.

This completes the proof.

---

## Using the CLT in practice

For large $n$, if $X_1,\dots,X_n$ are i.i.d. with mean $\mu$ and variance $\sigma^2$, then
$$
\frac{S_n - n\mu}{\sigma\sqrt{n}} \approx \mathcal{N}(0,1).
$$

Thus
$$
\mathbb{P}(a \le S_n \le b)
\approx \mathbb{P}\left( \frac{a - n\mu}{\sigma\sqrt{n}} \le \xi \le \frac{b - n\mu}{\sigma\sqrt{n}} \right),
$$
where $\xi\sim\mathcal{N}(0,1)$ and the right-hand side is computed via the standard normal cdf $\Phi$.

> **Example (Back to 10,000 fair coins).**  
> Recall $X$ is the number of heads in $10{,}000$ fair coin flips, so $\mathbb{E}X = 5000$ and $\operatorname{Var}(X) = 2500$, hence $\operatorname{sd}(X) = 50$.  
> We want
> $$
> \mathbb{P}(4950 \le X \le 5050).
> $$
> Standardize:
> $$
> \mathbb{P}(4950 \le X \le 5050)
> = \mathbb{P}\left(-1 \le \frac{X-5000}{50} \le 1\right).
> $$
> By CLT, $\frac{X-5000}{50}$ is approximately standard normal, so
> $$
> \mathbb{P}(4950 \le X \le 5050)
> \approx \mathbb{P}(-1 \le \xi \le 1)
> = \Phi(1) - \Phi(-1)
> = 2\Phi(1) - 1 \approx 0.6826.
> $$
> This is a meaningful estimate, unlike the trivial Chebyshev bound.
