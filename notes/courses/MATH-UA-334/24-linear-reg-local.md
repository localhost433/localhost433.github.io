---
title: Local Linear Regression
date: 2026-04-22
---

## 1. Introduction to Nonparametric Regression

Simple linear regression assumes one linear relationship between the predictor $x$ and response $y$ across the modeled domain.

A relationship may be nonlinear globally while remaining approximately linear near a given point.

We formulate the **Nonparametric Regression** model as:
$$
    y_i = f(x_i) + e_i \quad \text{for } i = 1, \dots, n
$$
where:

- $f(x)$ is a completely unknown structural link function.
- We make absolutely no parametric assumptions about the global shape of $f(x)$. We only assume that $f(x)$ is mathematically smooth (e.g., its second derivative is strictly bounded: $|f''(x)| \le L$).
- $e_i$ represents independent measurement error noise, with $\E[e_i] = 0$ and $\Var{e_i} = \sigma^2$.

Our primary statistical target is to estimate the true value $f(x_0)$ at some specific target point $x_0$.

---

## 2. Local Averaging and Kernels

The core intuition behind localized estimation is that if an observed data point $x_i$ is physically close to our target $x_0$, then $f(x_0) \approx f(x_i) = y_i - e_i$. Thus, we should aggressively average the $y$-values of strictly the data points that reside in the immediate vicinity of $x_0$.

### 2.1 The Binning Estimator

A primitive approach is the simple binning estimator, which averages all observations falling within a strict mathematical distance $h$ from $x_0$:
$$
    \hat{f}(x_0) = \frac{\sum_{i: |x_i - x_0| \le h} y_i}{\#\{i: |x_i - x_0| \le h\}}
$$
The parameter $h$ is universally known as the **bandwidth**.

- **Small bandwidth ($h \to 0$):** Extremely small bias (we only use points practically identical to $x_0$), but massive variance (we average very few points, leaving us highly vulnerable to the noise $e_i$).
- **Large bandwidth ($h \to \infty$):** Massive bias (we incorrectly average points from fundamentally different regions of the curve), but extremely small variance.

### 2.2 Kernel Weighting

The binning estimator is mathematically harsh because an observation just inside the boundary receives full weight, while one infinitesimally outside receives zero weight.

To resolve this, we employ a **smooth Kernel function** $K(u)$ that gradually assigns continuous, decaying weights based strictly on the distance from the target. A highly popular choice is the Gaussian kernel:
$$
    K_h(u) = \exp\left( -\frac{u^2}{2h^2} \right)
$$

### 2.3 Nadaraya-Watson Estimator

Replacing the harsh binning indicator with the smooth kernel yields the famous **Nadaraya-Watson** estimator:
$$
    \hat{f}_{NW}(x_0) = \frac{\sum_{i=1}^n K_h(x_i - x_0) y_i}{\sum_{i=1}^n K_h(x_i - x_0)}
$$
This estimator effectively performs a highly localized, weighted constant fit. It strictly assumes the function is entirely flat within the localized neighborhood.

---

## 3. Local Linear Regression

The Nadaraya-Watson estimator struggles severely near the physical boundaries of the dataset or in regions with steep gradients, strictly because it fits a flat constant. We can dramatically improve performance by fitting a localized *straight line* instead of a constant.

### 3.1 The Optimization Problem

For a specific target point $x_0$, we mathematically postulate that for points $x_i$ near $x_0$, the function can be accurately approximated by a first-order Taylor expansion:
$$
    f(x_i) \approx \beta_0 + \beta_1 (x_i - x_0)
$$
We estimate the local parameters $\beta_0$ and $\beta_1$ by minimizing a heavily kernel-weighted sum of squared residuals:
$$
    \min_{\beta_0, \beta_1} \sum_{i=1}^n \left[ y_i - (\beta_0 + \beta_1(x_i - x_0)) \right]^2 K_h(x_i - x_0)
$$
Once we mathematically solve this optimization problem, our final estimate for the function value strictly at $x_0$ is identically the local intercept:
$$
    \hat{f}(x_0) = \hat{\beta}_0
$$

### 3.2 Matrix Formulation

This entire localized optimization problem can be beautifully expressed and solved using the exact mathematical machinery of Weighted Least Squares (WLS) from the previous lecture.

Let $W$ be a strictly diagonal weight matrix where the $i$-th diagonal entry is precisely the localized kernel weight:
$$
    W_{ii} = K_h(x_i - x_0)
$$
Let $Y$ be the standard response vector, and let the localized design matrix $X$ be formulated as:
$$
    X = \begin{bmatrix}
        1 & x_1 - x_0 \\
        1 & x_2 - x_0 \\
        \vdots & \vdots \\
        1 & x_n - x_0
    \end{bmatrix}
$$
By taking the calculus derivative of the localized objective function and explicitly setting it to zero, we immediately recover the WLS solution:
$$
    \begin{bmatrix} \hat{\beta}_0 \\ \hat{\beta}_1 \end{bmatrix} = (X^T W X)^{-1} X^T W Y
$$

### 3.3 The Final Estimator

To strictly isolate the prediction $\hat{f}(x_0) = \hat{\beta}_0$, we multiply the resulting vector by the basis vector $[1, 0]$:
$$
    \hat{f}(x_0) = [1, 0] (X^T W X)^{-1} X^T W Y
$$
This shows that local linear regression is a linear smoother: it can be written as $\sum_{i=1}^n w(x_0, x_i)y_i$, with weights determined by the design points and kernel.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 24: Local linear regression.
