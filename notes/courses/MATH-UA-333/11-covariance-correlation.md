---
title: Covariance and Correlation
date: 2025-11-04
---

## Motivation

Independence implies strong factorization:
for all reasonable $g,h$,
$$
\E[g(X)h(Y)] = \E[g(X)]\,\E[h(Y)].
$$
In particular, if $X,Y$ are independent,
$$
\E[XY] = \E[X]\E[Y].
$$

The converse need not hold: we may have $\E[XY]=\E[X]\E[Y]$ without independence. This leads to **covariance** and **correlation** as measures of linear dependence.

Example: let $X\sim\mathrm{Unif}(-1,1)$, and $Y=X^2$.

Then $\E[X]=0$, $\E[X^2]=1/3$, $\E[X^3]=0$, hence
$$
\E[XY]=\E[X^3]=0=\E[X]\E[Y].
$$
So $X$ and $Y$ are uncorrelated, but clearly not independent.

---

## Covariance

Let $X,Y$ be random variables with finite second moments.

The **covariance** of $X$ and $Y$ is
$$
\mathrm{Cov}(X,Y)
:= \E\big[(X-\E[X])(Y-\E[Y])\big].
$$

Expanding:
$$
\mathrm{Cov}(X,Y)
= \E[XY] - \E[X]\E[Y].
$$

In particular,
$$
\mathrm{Cov}(X,X)=\mathrm{Var}(X).
$$

---

## Basic properties of covariance

For random variables $X,Y,Z$ and constants $a,b$:

- Symmetry:
  $$
  \mathrm{Cov}(X,Y)=\mathrm{Cov}(Y,X).
  $$
- Variance:
  $$
  \mathrm{Cov}(X,X)=\mathrm{Var}(X).
  $$
- Shift invariance:
  $$
  \mathrm{Cov}(X+b,Y)=\mathrm{Cov}(X,Y).
  $$
- Scaling:
  $$
  \mathrm{Cov}(aX,Y)=a\,\mathrm{Cov}(X,Y).
  $$
- Bilinearity:
  $$
  \mathrm{Cov}(X+Z,Y)=\mathrm{Cov}(X,Y)+\mathrm{Cov}(Z,Y).
  $$
- Sums:
  $$
  \mathrm{Cov}\Big(\sum_{i=1}^n X_i,\ \sum_{j=1}^m Y_j\Big)
  = \sum_{i=1}^n\sum_{j=1}^m \mathrm{Cov}(X_i,Y_j).
  $$

If $X$ and $Y$ are independent, then
$$
\mathrm{Cov}(X,Y)=0,
$$
but the converse is not always true (uncorrelated $\not\Rightarrow$ independent).

---

## Variance of sums

From bilinearity,
$$
\mathrm{Var}\Big(\sum_{i=1}^n X_i\Big)
= \sum_{i=1}^n\sum_{j=1}^n \mathrm{Cov}(X_i,X_j).
$$

If $X_1,\dots,X_n$ are pairwise independent (or at least uncorrelated), this simplifies to
$$
\mathrm{Var}\Big(\sum_{i=1}^n X_i\Big)
= \sum_{i=1}^n \mathrm{Var}(X_i).
$$

Example: If $X\sim\mathrm{Bin}(n,p)$, write $X=\sum_{i=1}^n X_i$ with $X_i\sim\mathrm{Ber}(p)$ independent. Then
$$
\mathrm{Var}(X)
= \sum_{i=1}^n \mathrm{Var}(X_i)
= np(1-p).
$$

---

## Correlation

Assume $\mathrm{Var}(X)>0$ and $\mathrm{Var}(Y)>0$.

The **correlation coefficient** of $X$ and $Y$ is
$$
\rho(X,Y)
:= \frac{\mathrm{Cov}(X,Y)}{\sqrt{\mathrm{Var}(X)\,\mathrm{Var}(Y)}}.
$$

Equivalently,
$$
\rho(X,Y) = \mathrm{Cov}\!\left(
\frac{X}{\sqrt{\mathrm{Var}(X)}},
\frac{Y}{\sqrt{\mathrm{Var}(Y)}}
\right).
$$

Properties:

- Invariance under positive affine maps:
  $$
  \rho(X+b,Y)=\rho(X,Y),\quad
  \rho(aX,Y)=\rho(X,Y)\ \text{for }a>0.
  $$
- Sign flip:
  $$
  \rho(aX,Y) = -\rho(X,Y)\ \text{for }a<0.
  $$

---

## Bounds on correlation (via Cauchy–Schwarz)

Cauchy–Schwarz inequality for random variables:
$$
\big(\E[UV]\big)^2 \le \E[U^2]\E[V^2].
$$

Apply with
$$
U=X-\E[X],\quad V=Y-\E[Y],
$$
to get
$$
\mathrm{Cov}(X,Y)^2
= \big(\E[UV]\big)^2
\le \E[U^2]\E[V^2]
= \mathrm{Var}(X)\mathrm{Var}(Y).
$$

Therefore
$$
-1 \le \rho(X,Y) \le 1.
$$

Equality $|\rho(X,Y)|=1$ holds iff there exists a constant $a$ such that
$$
P\big(Y = aX + b\big)=1
$$
for some $b$ (a.s. exact linear relationship).

Correlation measures the strength and direction of linear dependence; it does not capture all forms of dependence (e.g. $X$ and $X^2$).
