---
title: Joint Distributions
date: 2026-01-28
---

## 1. Introduction

So far, we have looked at single random variables. In many applications, we are interested in the relationship between two or more random variables (e.g., height and weight). This lecture covers **Joint Distributions** for random vectors $(X, Y)$.

---

## 2. Discrete Case

Let $X$ and $Y$ be discrete random variables. The behavior of the pair $(X, Y)$ is described by the **joint probability mass function (joint pmf)**.

### 2.1 Joint PMF

$$p_{X,Y}(x, y) = \mathbb{P}(X = x, Y = y)$$

**Properties:**

1. **Non-negativity:** $p_{X,Y}(x, y) \ge 0$.
2. **Normalization:** Summing over all possible pairs equals 1.
    $$\sum_{x} \sum_{y} p_{X,Y}(x, y) = 1$$

### 2.2 Marginal Distribution

We can recover the distribution of $X$ alone (marginal distribution) by summing out $Y$.

$$p_X(x) = \mathbb{P}(X = x) = \sum_{y} \mathbb{P}(X=x, Y=y) = \sum_{y} p_{X,Y}(x, y)$$

Similarly, for $Y$:
$$p_Y(y) = \sum_{x} p_{X,Y}(x, y)$$

### 2.3 Conditional Distribution

The conditional pmf of $X$ given $Y=y$ is defined as:

$$p_{X|Y}(x|y) = \mathbb{P}(X=x \mid Y=y) = \frac{\mathbb{P}(X=x, Y=y)}{\mathbb{P}(Y=y)} = \frac{p_{X,Y}(x, y)}{p_Y(y)}$$
(Valid only if $p_Y(y) > 0$).

---

## 3. Continuous Case

For continuous random variables $X$ and $Y$, we define the **joint probability density function (joint pdf)** $f_{X,Y}(x, y)$.

Probabilities are calculated as volumes under the surface $f_{X,Y}(x, y)$:
$$\mathbb{P}((X, Y) \in A) = \iint_A f_{X,Y}(x, y) \, dx \, dy$$

### 3.1 Marginals and Conditionals (Continuous)

* **Marginal PDF of X:**
    $$f_X(x) = \int_{-\infty}^{\infty} f_{X,Y}(x, y) \, dy$$
* **Conditional PDF of X given Y=y:**
    $$f_{X|Y}(x|y) = \frac{f_{X,Y}(x, y)}{f_Y(y)}$$

### 3.2 Independence

Random variables $X$ and $Y$ are **independent** if and only if their joint distribution factors into the product of their marginals.

* **Discrete:** $p_{X,Y}(x, y) = p_X(x) p_Y(y)$ for all $x, y$.
* **Continuous:** $f_{X,Y}(x, y) = f_X(x) f_Y(y)$ for all $x, y$.

---

## 4. Change of Variables (Jacobian Method)

Suppose we have a random vector $(X, Y)$ with joint density $f_{X,Y}(x, y)$ and we transform it to $(U, V)$ via a differentiable, invertible map:
$$u = g_1(x, y), \quad v = g_2(x, y)$$

To find the joint PDF $f_{U,V}(u, v)$, we use the Jacobian determinant.

### Formula

$$f_{U,V}(u, v) = f_{X,Y}(x, y) \cdot |J|^{-1}$$
where $x, y$ are expressed in terms of $u, v$, and $J$ is the Jacobian of the transformation $(u,v) \to (x,y)$ (or inverse of the transformation $(x,y) \to (u,v)$).

Specifically, if we compute the Jacobian of the transformation **from $(x, y)$ to $(u, v)$**:
$$
J = \det \begin{bmatrix} \frac{\partial u}{\partial x} & \frac{\partial u}{\partial y} \\\\ \frac{\partial v}{\partial x} & \frac{\partial v}{\partial y} \end{bmatrix}
$$
Then:
$$f_{U,V}(u, v) = f_{X,Y}(x(u,v), y(u,v)) \cdot \frac{1}{|J(x,y)|}$$

### Example 1: Sum of Random Variables

Let $U = X + Y$. To use the method, we introduce a dummy variable $V = Y$.

* Transformation: $u = x+y, v = y$.
* Inverse: $x = u-v, y = v$.
* Jacobian: $\frac{\partial u}{\partial x} = 1, \dots$ actually it is easier to find the Jacobian of the inverse map directly or just use the formula.
    $$\frac{\partial(u,v)}{\partial(x,y)} = \det \begin{bmatrix} 1 & 1 \\\\ 0 & 1 \end{bmatrix} = 1$$
* Density:
    $$f_{U,V}(u, v) = f_{X,Y}(u-v, v) \cdot 1$$
* Marginal of U (Convolution Formula):
    $$f_U(u) = \int_{-\infty}^{\infty} f_{X,Y}(u-v, v) \, dv$$
    If $X, Y$ are independent: $f_U(u) = \int f_X(u-v) f_Y(v) \, dv$.

### Example 2: Polar Coordinates

Let $(X, Y)$ be independent standard normals, i.e., $f_{X,Y}(x,y) = \frac{1}{2\pi} e^{-(x^2+y^2)/2}$.
Transform to polar coordinates $(R, \theta)$:
$$X = R \cos \theta, \quad Y = R \sin \theta$$

* The Jacobian of the transformation from $(R, \theta)$ to $(X, Y)$ is $r$.
* $f_{R, \theta}(r, \theta) = f_{X,Y}(r\cos\theta, r\sin\theta) \cdot r$
* $f_{R, \theta}(r, \theta) = \frac{1}{2\pi} e^{-r^2/2} \cdot r$ for $r \ge 0, \theta \in [0, 2\pi)$.

This implies $R$ and $\theta$ are independent, with $\theta \sim \text{Unif}[0, 2\pi]$ and $R$ following a Rayleigh distribution.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 3: Joint Distributions.
