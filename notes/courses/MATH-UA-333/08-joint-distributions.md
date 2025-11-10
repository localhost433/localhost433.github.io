---
title: Joint Distributions and Independence
date: 2025-10-16/21
---

## Joint distributions of two random variables

Let $(\Omega,\mathcal{F},P)$ be a probability space. A **random vector** $(X,Y)$ is a pair of real-valued random variables
$$
X:\Omega\to\mathbb{R},\qquad Y:\Omega\to\mathbb{R}.
$$

The **joint law** of $(X,Y)$ is the probability measure on $\mathbb{R}^2$ defined by
$$
P\big((X,Y)\in A\big)
= P\big(\{\omega\in\Omega : (X(\omega),Y(\omega))\in A\}\big),
\quad A\subseteq\mathbb{R}^2\ \text{(Borel)}.
$$

We describe this law via a joint pmf (discrete) or joint pdf (continuous), from which we recover marginals and independence.

---

## Discrete joint distributions

Assume $X$ and $Y$ are discrete with countable state spaces $S_X,S_Y\subseteq\mathbb{R}$.

### Joint pmf

The **joint pmf**:
$$
p_{X,Y}(a,b) = P(X=a,Y=b),\quad (a,b)\in S_X\times S_Y.
$$

Properties:
- $p_{X,Y}(a,b)\ge0$ for all $(a,b)$.
- $\displaystyle\sum_{a\in S_X}\sum_{b\in S_Y} p_{X,Y}(a,b)=1$.

For $A\subseteq S_X\times S_Y$,
$$
P((X,Y)\in A) = \sum_{(a,b)\in A} p_{X,Y}(a,b).
$$

### Joint cdf (discrete)

$$
F_{X,Y}(s,t)=P(X\le s,Y\le t)
= \sum_{a\le s}\sum_{b\le t} p_{X,Y}(a,b).
$$

### Marginal pmfs

$$
p_X(a)=P(X=a)=\sum_{b\in S_Y} p_{X,Y}(a,b),
\qquad
p_Y(b)=P(Y=b)=\sum_{a\in S_X} p_{X,Y}(a,b).
$$

### Expectation of functions

For $g:\mathbb{R}^2\to\mathbb{R}$,
$$
\E[g(X,Y)] = \sum_{a\in S_X}\sum_{b\in S_Y} g(a,b)\,p_{X,Y}(a,b),
$$
whenever the sum converges absolutely.

---

## Continuous joint distributions

Suppose $(X,Y)$ has a **joint density** $f_{X,Y}:\mathbb{R}^2\to[0,\infty)$ such that
$$
\iint_{\mathbb{R}^2} f_{X,Y}(x,y)\,dx\,dy=1,
$$
and for all Borel $A\subseteq\mathbb{R}^2$,
$$
P((X,Y)\in A) = \iint_A f_{X,Y}(x,y)\,dx\,dy.
$$

Then $(X,Y)$ is (jointly) continuous with density $f_{X,Y}$.

The **joint cdf** is always
$$
F_{X,Y}(a,b)=P(X\le a,Y\le b).
$$
If $F_{X,Y}$ is differentiable,
$$
F_{X,Y}(a,b)
= \int_{-\infty}^a\int_{-\infty}^b f_{X,Y}(x,y)\,dy\,dx,
\qquad
f_{X,Y}(a,b)=\frac{\partial^2}{\partial a\,\partial b}F_{X,Y}(a,b).
$$

### Marginal densities

$$
f_X(a) = \int_{-\infty}^{\infty} f_{X,Y}(a,y)\,dy,
\qquad
f_Y(b) = \int_{-\infty}^{\infty} f_{X,Y}(x,b)\,dx.
$$

### Expectation of functions

For integrable $g$,
$$
\E[g(X,Y)] = \iint_{\mathbb{R}^2} g(x,y)\,f_{X,Y}(x,y)\,dx\,dy.
$$

---

## Example: uniform on the unit disk

Let $(X,Y)$ be uniform on
$$
D=\{(x,y):x^2+y^2\le1\}.
$$

Then
$$
f_{X,Y}(x,y)=\frac1\pi\mathbf{1}_{\{x^2+y^2\le1\}}.
$$

Marginal of $X$ (for $|a|\le1$):
$$
f_X(a)
= \int_{-\sqrt{1-a^2}}^{\sqrt{1-a^2}} \frac1\pi\,dy
= \frac{2\sqrt{1-a^2}}{\pi},
$$
and $0$ otherwise. Similarly for $Y$.

Here $X,Y$ are not independent, since $f_{X,Y}(a,b)\neq f_X(a)f_Y(b)$ on $D$.

---

## Independence

Random variables $X,Y$ are **independent** if for all Borel $A,B$,
$$
P(X\in A,Y\in B)=P(X\in A)P(Y\in B).
$$

Equivalent:

- cdf factorization:
  $$
  F_{X,Y}(a,b)=F_X(a)F_Y(b)\ \forall a,b.
  $$
- Discrete:
  $$
  p_{X,Y}(a,b)=p_X(a)p_Y(b)\ \forall a,b.
  $$
- Continuous (with density):
  $$
  f_{X,Y}(a,b)=f_X(a)f_Y(b)\ \forall a,b.
  $$

If $X,Y$ are independent, then for suitable $g,h$,
$$
\E[g(X)h(Y)]=\E[g(X)]\,\E[h(Y)].
$$

For $X_1,\dots,X_n$, **mutual independence** means
$$
P(X_1\in A_1,\dots,X_n\in A_n)=\prod_{k=1}^n P(X_k\in A_k)
$$
for all Borel $A_k$.

A family is **i.i.d.** if they are mutually independent and all have the same distribution.

---

## Worked example

Let $X,Y,Z$ be i.i.d. $\mathrm{Unif}(0,1)$. Compute $P(X\ge YZ)$.

The joint density on $[0,1]^3$ is $1$, so
$$
P(X\ge YZ)=\iiint_{[0,1]^3} \mathbf{1}_{\{x\ge yz\}}\,dx\,dy\,dz.
$$
For fixed $y,z$, the condition is $x\in[yz,1]$, length $1-yz$, hence
$$
P(X\ge YZ)
= \int_0^1\int_0^1 (1-yz)\,dy\,dz
= 1 - \frac14
= \frac34.
$$
