---
title: Local Linear Regression
date: 2026-04-22
---

## 1. Introduction to Nonparametric Regression

In traditional simple linear regression, we impose a highly rigid global assumption: the true relationship between the predictor $x$ and the response $y$ is exactly a straight line across the entire infinite domain. 

However, in many complex real-world datasets, the relationship is fundamentally non-linear globally, yet it may appear approximately linear within very small, highly localized neighborhoods.

We formulate the **Nonparametric Regression** model as:
$$
    y\_i = f(x\_i) + e\_i \\quad \\text{for } i = 1, \\dots, n
$$
where:
* $f(x)$ is a completely unknown structural link function.
* We make absolutely no parametric assumptions about the global shape of $f(x)$. We only assume that $f(x)$ is mathematically smooth (e.g., its second derivative is strictly bounded: $|f''(x)| \\le L$).
* $e\_i$ represents independent measurement error noise, with $\\E[e\_i] = 0$ and $\\Var{e\_i} = \\sigma^2$.

Our primary statistical target is to estimate the true value $f(x\_0)$ at some specific target point $x\_0$.

---

## 2. Local Averaging and Kernels

The core intuition behind localized estimation is that if an observed data point $x\_i$ is physically close to our target $x\_0$, then $f(x\_0) \\approx f(x\_i) = y\_i - e\_i$. Thus, we should aggressively average the $y$-values of strictly the data points that reside in the immediate vicinity of $x\_0$.

### 2.1 The Binning Estimator

A primitive approach is the simple binning estimator, which averages all observations falling within a strict mathematical distance $h$ from $x\_0$:
$$
    \\hat{f}(x\_0) = \\frac{\\sum\\_{i: |x\_i - x\_0| \\le h} y\_i}{\\#\\{i: |x\_i - x\_0| \\le h\\}}
$$
The parameter $h$ is universally known as the **bandwidth**.
* **Small bandwidth ($h \\to 0$):** Extremely small bias (we only use points practically identical to $x\_0$), but massive variance (we average very few points, leaving us highly vulnerable to the noise $e\_i$).
* **Large bandwidth ($h \\to \\infty$):** Massive bias (we incorrectly average points from fundamentally different regions of the curve), but extremely small variance.

### 2.2 Kernel Weighting

The binning estimator is mathematically harsh because an observation just inside the boundary receives full weight, while one infinitesimally outside receives zero weight. 

To resolve this, we employ a **smooth Kernel function** $K(u)$ that gradually assigns continuous, decaying weights based strictly on the distance from the target. A highly popular choice is the Gaussian kernel:
$$
    K\\_h(u) = \\exp\\left( -\\frac{u^2}{2h^2} \\right)
$$

### 2.3 Nadaraya-Watson Estimator

Replacing the harsh binning indicator with the smooth kernel yields the famous **Nadaraya-Watson** estimator:
$$
    \\hat{f}\\_{NW}(x\_0) = \\frac{\\sum\\_{i=1}^n K\\_h(x\_i - x\_0) y\_i}{\\sum\\_{i=1}^n K\\_h(x\_i - x\_0)}
$$
This estimator effectively performs a highly localized, weighted constant fit. It strictly assumes the function is entirely flat within the localized neighborhood.

---

## 3. Local Linear Regression

The Nadaraya-Watson estimator struggles severely near the physical boundaries of the dataset or in regions with steep gradients, strictly because it fits a flat constant. We can dramatically improve performance by fitting a localized *straight line* instead of a constant.

### 3.1 The Optimization Problem

For a specific target point $x\_0$, we mathematically postulate that for points $x\_i$ near $x\_0$, the function can be accurately approximated by a first-order Taylor expansion:
$$
    f(x\_i) \\approx \\beta\_0 + \\beta\_1 (x\_i - x\_0)
$$
We estimate the local parameters $\\beta\_0$ and $\\beta\_1$ by minimizing a heavily kernel-weighted sum of squared residuals:
$$
    \\min\\_{\\beta\_0, \\beta\_1} \\sum\\_{i=1}^n \\left[ y\_i - (\\beta\_0 + \\beta\_1(x\_i - x\_0)) \\right]^2 K\\_h(x\_i - x\_0)
$$
Once we mathematically solve this optimization problem, our final estimate for the function value strictly at $x\_0$ is identically the local intercept:
$$
    \\hat{f}(x\_0) = \\hat{\\beta}\_0
$$

### 3.2 Matrix Formulation

This entire localized optimization problem can be beautifully expressed and solved using the exact mathematical machinery of Weighted Least Squares (WLS) from the previous lecture.

Let $W$ be a strictly diagonal weight matrix where the $i$-th diagonal entry is precisely the localized kernel weight:
$$
    W\\_{ii} = K\\_h(x\_i - x\_0)
$$
Let $Y$ be the standard response vector, and let the localized design matrix $X$ be formulated as:
$$
    X = \\begin{bmatrix}
        1 & x\_1 - x\_0 \\\\\\\\
        1 & x\_2 - x\_0 \\\\\\\\
        \\vdots & \\vdots \\\\\\\\
        1 & x\_n - x\_0
    \\end{bmatrix}
$$
By taking the calculus derivative of the localized objective function and explicitly setting it to zero, we immediately recover the WLS solution:
$$
    \\begin{bmatrix} \\hat{\\beta}\_0 \\\\\\\\ \\hat{\\beta}\_1 \\end{bmatrix} = (X^T W X)^{-1} X^T W Y
$$

### 3.3 The Final Estimator

To strictly isolate the prediction $\\hat{f}(x\_0) = \\hat{\\beta}\_0$, we multiply the resulting vector by the basis vector $[1, 0]$:
$$
    \\hat{f}(x\_0) = [1, 0] (X^T W X)^{-1} X^T W Y
$$
This incredible mathematical formulation proves that local linear regression is strictly a linear estimator—it can be written perfectly in the form $\\sum\\_{i=1}^n w(x\_0, x\_i) y\_i$, where the highly complex equivalent weights intrinsically adjust for the local density and geometry of the $x$ observations.

---

## References

1.  Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2.  Han, Y. (2026). Lecture 24: Local linear regression.