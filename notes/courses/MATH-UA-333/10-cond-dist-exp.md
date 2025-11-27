---
title: Conditional Distribution and Conditional Expectation
date: 2025-10-28/30
---

## Motivation

When random variables are dependent, knowing the value of one affects the distribution of the other.

Example: roll two dice.

- Let $X$ = first die, $Y$ = sum of both dice.
- Without conditioning:
  $$
  p_Y(k)=\frac{6-|7-k|}{36},\quad k=2,\dots,12.
  $$
- Given $X=2$, we know $Y=2+$ second die, so $Y$ is uniform on $\{3,\dots,8\}$:
  $$
  P(Y=2+k\mid X=2)=\frac16,\quad k=1,\dots,6.
  $$

This leads to **conditional distributions**.

---

## Discrete conditional distributions

Let $X,Y$ be discrete with joint pmf $p_{X,Y}$.

For $b$ with $p_Y(b)>0$, the **conditional pmf of $X$ given $Y=b$** is
$$
p_{X\mid Y}(a\mid b)
= P(X=a\mid Y=b)
= \frac{P(X=a,Y=b)}{P(Y=b)}
= \frac{p_{X,Y}(a,b)}{p_Y(b)}.
$$

The corresponding conditional cdf:
$$
F_{X\mid Y}(a\mid b)
= P(X\le a\mid Y=b)
= \sum_{t\le a} p_{X\mid Y}(t\mid b).
$$

Example (two dice): for $Y=5$, only $(X,Y)=(1,5),(2,5),(3,5),(4,5)$ are possible and equally likely, so
$$
P(X=k\mid Y=5)=\frac14,\quad k=1,2,3,4.
$$

---

## Continuous conditional distributions

Directly writing $P(X\in A\mid Y=b)$ gives $0/0$. We define conditional densities via the joint density.

Assume $(X,Y)$ has joint density $f_{X,Y}$, and let $f_Y(b)>0$.

The **conditional density of $X$ given $Y=b$** is
$$
f_{X\mid Y}(x\mid b)
= \frac{f_{X,Y}(x,b)}{f_Y(b)}.
$$

Then for any Borel set $A$,
$$
P(X\in A\mid Y=b) = \int_A f_{X\mid Y}(x\mid b) dx.
$$

Also
$$
f_{X,Y}(x,b)=f_{X\mid Y}(x\mid b)f_Y(b).
$$

---

## Examples of conditional densities

### Example 1: uniform on the unit disk

$(X,Y)$ uniform on $x^2+y^2\le1$:
$$
f_{X,Y}(x,y)=\frac1\pi \mathbf{1}_{\{x^2+y^2\le1\}}.
$$

For $|b|<1$,
$$
f_Y(b)=\int_{-\sqrt{1-b^2}}^{\sqrt{1-b^2}}\frac1\pi dx
= \frac{2\sqrt{1-b^2}}{\pi}.
$$

Thus
$$
f_{X\mid Y}(x\mid b)=
\frac{1}{2\sqrt{1-b^2}}, \quad \text{for }-\sqrt{1-b^2}\le x\le\sqrt{1-b^2} \quad \text{0 otherwise}
$$

So given $Y=b$, $X$ is uniform on the horizontal chord.

### Example 2: structured joint density

If

$$
f(x,y)=c\mathbf{1}_{\{x>0\}}e^{-y^2-4xy^4-\cos y},
$$

we can rewrite $f(x,y)=c_1(y)\mathbf{1}_{\{x>0\}}e^{-4xy^4}$, so for fixed $b$,

$$
f_{X\mid Y}(x\mid b)\propto \mathbf{1}_{\{x>0\}}e^{-4xb^4},
$$

i.e. conditional on $Y=b$, $X$ has an exponential-type density on $(0,\infty)$ (normalize to integrate to $1$).

### Example 3: hierarchical normal

Suppose $X\sim\mathrm{Unif}(0,1)$, and given $X=x$ we sample
$$
Y\mid X=x \sim N(2x,1).
$$

Then
$$
f_{X,Y}(x,y) = f_X(x)f_{Y\mid X}(y\mid x)
= \mathbf{1}_{[0,1]}(x)\frac1{\sqrt{2\pi}}e^{-(y-2x)^2/2}.
$$

To find $\E[Y]$:
$$
\E[Y] = \E\big[\E[Y\mid X]\big]
= \E[2X] = 1.
$$

This illustrates conditional expectation and the law of total expectation.

---

## Conditional expectation (given a value)

Given $Y=y$:

- Discrete:
  $$
  \E[X\mid Y=y] = \sum_x x p_{X\mid Y}(x\mid y).
  $$
- Continuous:
  $$
  \E[X\mid Y=y] = \int_{-\infty}^\infty x f_{X\mid Y}(x\mid y) dx.
  $$

---

## Conditional expectation as a random variable

Define
$$
g(y):=\E[X\mid Y=y].
$$

The **conditional expectation of $X$ given $Y$** is
$$
\E[X\mid Y] := g(Y),
$$
a random variable (measurable function of $Y$).

Key property (**law of total expectation**):
$$
\E[X] = \E\big[\E[X\mid Y]\big].
$$

- Discrete:
  $$
  \E[X]
  = \sum_y p_Y(y) \E[X\mid Y=y].
  $$
- Continuous:
  $$
  \E[X]
  = \int_{-\infty}^\infty f_Y(y) \E[X\mid Y=y] dy.
  $$

Proof in both cases is by expanding the right-hand side and using the joint distribution; it collapses to $\E[X]$.

> Conditional variance is defined similarly:  
> $\mathrm{Var}(X\mid Y=y)$, and $\mathrm{Var}(X\mid Y)$.
