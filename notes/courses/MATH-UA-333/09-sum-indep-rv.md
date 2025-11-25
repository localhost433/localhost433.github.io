---
title: Sum of Independent Random Variables
date: 2025-10-23
---
## Discrete sums and convolution of pmfs

Let $X,Y$ be independent discrete random variables, and define
$$
Z = X+Y.
$$

For any integer (or allowed value) $t$,
$$
p_Z(t)=P(Z=t)
= \sum_{a} P(X=a,Y=t-a)
= \sum_{a} p_X(a)p_Y(t-a).
$$

This operation
$$
(p_X * p_Y)(t) := \sum_a p_X(a)p_Y(t-a)
$$
is the **convolution** of the pmfs. Convolution is the general rule for sums of independent random variables.

---

## Sum of independent Poisson variables

Let $X\sim\mathrm{Pois}(\lambda_1)$, $Y\sim\mathrm{Pois}(\lambda_2)$, independent, and $Z=X+Y$.

For $n\in\{0,1,2,\dots\}$,
$$
p_Z(n)
= \sum_{k=0}^n p_X(k)p_Y(n-k)
= \sum_{k=0}^n \frac{\lambda_1^k e^{-\lambda_1}}{k!}
\frac{\lambda_2^{n-k} e^{-\lambda_2}}{(n-k)!}.
$$
Factor:
$$
p_Z(n)
= e^{-(\lambda_1+\lambda_2)}\frac1{n!}
\sum_{k=0}^n \binom{n}{k}\lambda_1^k\lambda_2^{n-k}
= e^{-(\lambda_1+\lambda_2)}\frac{(\lambda_1+\lambda_2)^n}{n!}.
$$

So
$$
Z\sim\mathrm{Pois}(\lambda_1+\lambda_2).
$$

---

## Continuous sums and convolution of densities

Let $X,Y$ be independent continuous random variables with densities $f_X,f_Y$ and joint density $f_{X,Y}(x,y)=f_X(x)f_Y(y)$. Let
$$
Z=X+Y.
$$

Then
$$
F_Z(t)=P(Z\le t)
= \iint_{x+y\le t} f_X(x)f_Y(y) dx dy.
$$
By changing order/variables and differentiating,
$$
f_Z(t)
= \int_{-\infty}^{\infty} f_X(x)f_Y(t-x) dx
= (f_X * f_Y)(t),
$$
the **convolution** of $f_X$ and $f_Y$.

---

## Example: sum of two $\mathrm{Unif}(0,1)$

Let $X,Y$ be independent $\mathrm{Unif}(0,1)$, $Z=X+Y$.

Then

$$
f_Z(t) = \int_{-\infty}^{\infty} \mathbf{1}_{[0,1]}(x)\mathbf{1}_{[0,1]}(t-x) dx.
$$

The integrand is $1$ exactly when $0 \le x\le1$ and $0 \le t-x\le1$.

This implies $0 \le t\le2$ and
$$
\max\{0,t-1\}\le x\le \min\{1,t\}.
$$

Hence, for $0 \le t\le2$,
$$
f_Z(t) = \min\{1,t\}-\max\{0,t-1\},
$$
and $f_Z(t)=0$ otherwise. Explicitly,
$$
f_Z(t)=
\begin{cases}
t, & 0 \le t\le 1,\\
2-t, & 1< t\le 2,\\
0, & \text{otherwise}.
\end{cases}
$$

---

## Example: sum of independent exponentials

Let $X,Y$ be independent exponentials:
$$
X\sim\mathrm{Exp}(\lambda_1),\quad Y\sim\mathrm{Exp}(\lambda_2),
$$
with densities $f_X(x)=\lambda_1 e^{-\lambda_1 x}\mathbf{1}_{\{x>0\}}$ and similarly for $Y$.

For $Z=X+Y$ and $t>0$,
$$
f_Z(t) = \int_0^t \lambda_1 e^{-\lambda_1 x} \lambda_2 e^{-\lambda_2 (t-x)} dx
= \lambda_1\lambda_2 e^{-\lambda_2 t} \int_0^t e^{-(\lambda_1-\lambda_2)x} dx.
$$

If $\lambda_1\neq\lambda_2$,
$$
f_Z(t) = \frac{\lambda_1\lambda_2}{\lambda_2-\lambda_1}\big(e^{-\lambda_1 t}-e^{-\lambda_2 t}\big).
$$

If $\lambda_1=\lambda_2=\lambda$,
$$
f_Z(t)=\lambda^2 t e^{-\lambda t},\quad t>0,
$$
which is a $\mathrm{Gamma}(2,\lambda)$ distribution. This is a special case of the Gamma-sum result below.

---

## Gamma distribution

A random variable $X$ has a **Gamma**$(s,\lambda)$ distribution ($s>0$, $\lambda>0$) if
$$
f_X(x)
= \mathbf{1}_{\{x>0\}}\frac{\lambda^s}{\Gamma(s)}x^{s-1}e^{-\lambda x},
$$
where
$$
\Gamma(s) = \int_0^\infty u^{s-1}e^{-u} du.
$$

For $s=1$, this is $\mathrm{Exp}(\lambda)$.

---

## Sum of independent Gamma variables with common rate

Let
$$
X\sim\mathrm{Gamma}(s_1,\lambda),\quad
Y\sim\mathrm{Gamma}(s_2,\lambda),
$$
independent, same rate $\lambda$. Then
$$
Z=X+Y\sim\mathrm{Gamma}(s_1+s_2,\lambda).
$$

(Proof uses convolution and the Beta-function identity.)

---

## Gamma variables and normal variables

If $X\sim N(0,1)$ and $Y=X^2$, then for $t>0$ one finds
$$
f_Y(t) = \frac{1}{\sqrt{2\pi t}}e^{-t/2},
$$
so
$$
Y\sim\mathrm{Gamma}\Big(\frac12,\frac12\Big).
$$

If $X_1,\dots,X_n$ are i.i.d. $N(0,1)$, then
$$
\sum_{i=1}^n X_i^2 \sim \mathrm{Gamma}\Big(\frac{n}{2},\frac12\Big),
$$
also called $\chi^2(n)$.

---

## Sum of independent normals

If $X\sim N(\mu_1,\sigma_1^2)$ and $Y\sim N(\mu_2,\sigma_2^2)$ are independent, then
$$
Z=X+Y\sim N(\mu_1+\mu_2,\ \sigma_1^2+\sigma_2^2).
$$

(Convolution of Gaussian densities stays Gaussian; the means add and the variances add.)
