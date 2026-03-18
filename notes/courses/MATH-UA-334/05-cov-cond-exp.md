---
title: Covariance, Conditional Expectation
date: 2026-02-04
---

## 1. Covariance

When dealing with multiple random variables, Variance is not linear in general. Covariance measures the linear dependence between two variables.

### 1.1 Definition

$$\Cov{X}{Y} = \E[(X - \E[X])(Y - \E[Y])]$$

Using linearity of expectation, we can derive the computational formula:
$$\Cov{X}{Y} = \E[XY] - \E[X]\E[Y]$$

### 1.2 Relation to Variance of Sums

$$\Var{X + Y} = \Var{X} + \Var{Y} + 2\Cov{X}{Y}$$

*Note:* If $X$ and $Y$ are independent, $\E[XY] = \E[X]\E[Y]$, so $\Cov{X}{Y} = 0$. This recovers the property that variance is additive for independent variables. However, $\Cov{X}{Y} = 0$ does *not* imply independence.

### 1.3 Properties (Bilinearity)

Covariance is a bilinear operator (linear in both arguments):

1. $\Cov{X}{Y} = \Var{X}$.
2. $\Cov{X}{Y} = \Cov{Y}{X}$ (Symmetry).
3. $\Cov{aX + bY}{Z} = a\Cov{X}{Z} + b\Cov{Y}{Z}$.

**Example:**
$$\text{Var}\left(\sum_{i=1}^n X_i\right) = \sum_{i=1}^n \Var{X_i} + \sum_{i \neq j} \Cov{X_i}{X_j}$$

---

## 2. Conditional Expectation

Conditional expectation $\E[Y|X]$ is a fundamental concept for prediction and estimation. It can be viewed in two ways: as a number (given a specific value $X=x$) or as a random variable (function of $X$).

### 2.1 Definition (as a function of x)

$$\E[Y \mid X = x] = \sum_y y  p_{Y|X}(y|x) \quad \text{(Discrete)}$$
$$\E[Y \mid X = x] = \int_{-\infty}^{\infty} y  f_{Y|X}(y|x)  dy \quad \text{(Continuous)}$$

### 2.2 Definition (as a Random Variable)

We define $\E[Y|X]$ as a random variable $g(X)$ that takes the value $\E[Y \mid X=x]$ when $X=x$.

**Example:**
If $X$ is the roll of a die and $Y = X + \epsilon$ (where $\epsilon$ is noise with mean $0$), then $\E[Y|X] = X$.

### 2.3 Law of Total Expectation (Tower Property)

The expected value of the conditional expectation is the unconditional expectation.
$$\E[\E[Y \mid X]] = \E[Y]$$

**Proof (Discrete Case):**
$$
    \begin{align*}
        \E[\E[Y|X]] &= \sum_x \E[Y \mid X=x] p_X(x) \\\\
        &= \sum_x \left( \sum_y y \frac{p_{X,Y}(x,y)}{p_X(x)} \right) p_X(x) \\\\
        &= \sum_x \sum_y y  p_{X,Y}(x,y) \\\\
        &= \sum_y y \sum_x p_{X,Y}(x,y) \\\\
        &= \sum_y y  p_Y(y) = \E[Y]
    \end{align*}
$$

**Application (Random Sums):**
Let $S = \sum_{i=1}^N X_i$, where $N$ is a random variable independent of i.i.d. $X_i$.
$$\E[S] = \E[\E[S \mid N]] = \E[N \cdot \E[X]] = \E[N]\E[X]$$

---

## 3. Conditional Variance

$$\Var{Y \mid X} = \E[(Y - \E[Y|X])^2 \mid X]$$

### Law of Total Variance

The variance of a variable can be decomposed into the "expected conditional variance" and the "variance of the conditional expectation".

$$\Var{Y} = \E[\Var{Y \mid X}] + \Var{\E[Y \mid X]}$$

* **Intra-group variance ($\E[\Var{Y|X}]$):** The average variance within each group defined by $X$.
* **Inter-group variance ($\Var{\E[Y|X]}$):** The variance of the group means.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 5: Covariance, conditional expectation.