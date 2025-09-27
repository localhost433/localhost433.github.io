---
title: Random stuff in linear algebra
date: 2025-04-02
tags: [math]
author: R
location: Bobst 6F, New York, NY
---

What I want to say today is about the essential part of a linear transformation, and I figured out the proof and purpose just after looking at it in terms of domains and codomains. What I understand here is that

$$
Ax = A\left( \proj{ \ran A^* } x + \left( x - \proj{\ran A^* } x \right) \right) = A\left( \proj{\ran A^* } x \right)
$$

This uses the orthogonal decomposition of $x$, where:

$$
x - \proj{\ran A^* } x \in \left( \ran A^* \right)^\perp = \ker A
$$

so that 

$$
A(x - \proj{\ran A^*}x) = 0
$$

thus it restricts the vectors in the transformation by removing the ones in $\ker A$, and changing $A$ to $\tilde{A}$ just further restricts the domain because now there's only input from $\ran A^*$.

The dual space $A'$ sometimes has the notation $A^*$, which coincides with the adjoint operator; this is what made me think about the relation between the two. Specifically, the Riesz representation theorem states that for all linear functionals $\phi$ on $V$, there exists a unique $v \in V$ such that:

$$
\phi(u) = \inr{u}{v}
$$

Assume $A': V^* \to V^*$. Then

$$
(A'\phi)(u) = \phi(A(u))
$$

By Riesz,

$$
\phi(A(u)) = \inr{A(u)}{v}
$$

Then by the property of the adjoint,

$$
\inr{A(u)}{v} = \inr{u}{A^*(v)}
$$

So,

$$
(A'\phi)(u) = \inr{u}{A^*(v)}
$$

$
\qed{}
$

which is quite fascinating to discover on my own.