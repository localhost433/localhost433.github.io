---
title: More on Linear Regression
date: 2026-04-20
---

## 1. Heteroskedasticity in Linear Regression

In the standard multiple linear regression model, we heavily relied on the strict assumption of homoscedasticity, meaning that the variance of the random error terms is perfectly constant across all observations: $\Var{e\_i} = \sigma^2$ for all $i$. 

However, in many practical datasets, the variance of the errors fluctuates depending on the specific observation. This phenomenon is formally known as **heteroskedasticity**.

We modify our standard linear model to mathematically accommodate this:
$$
    Y = X\beta + e
$$
where $Y \in \mathbb{R}^n$, $X \in \mathbb{R}^{n \times p}$, $\beta \in \mathbb{R}^p$, and $e \in \mathbb{R}^n$.
The fundamental assumptions become:
1.  $\E[e] = 0$
2.  $\Cov{e}{e} = \Omega = \text{diag}(\sigma\_1^2, \sigma\_2^2, \dots, \sigma\_n^2)$

Here, the covariance matrix $\Omega$ is a diagonal matrix where each distinct diagonal entry represents the specific variance $\sigma\_i^2$ of the corresponding error term $e\_i$.

### 1.1 Properties of the Ordinary Least Squares (OLS) Estimator

If we naively apply the standard Ordinary Least Squares (OLS) estimator $\hat{\beta}\_{OLS} = (X^T X)^{-1} X^T Y$, what happens to its fundamental statistical properties?

**Bias:**
The OLS estimator miraculously remains perfectly unbiased.
$$
    \begin{align*}
        \\E[\\hat{\\beta}\\_{OLS}] &= \\E[(X^T X)^{-1} X^T (X\\beta + e)] \\\\\\\\
        &= \\beta + (X^T X)^{-1} X^T \\E[e] \\\\\\\\
        &= \\beta
    \\end{align*}
$$

**Variance:**
The covariance matrix of the OLS estimator, however, fundamentally changes. We must explicitly incorporate the true error covariance matrix $\Omega$:
$$
    \begin{align*}
        \\Cov{\\hat{\\beta}\\_{OLS}}{\\hat{\\beta}\\_{OLS}} &= \\Cov{(X^T X)^{-1} X^T e}{(X^T X)^{-1} X^T e} \\\\\\\\
        &= (X^T X)^{-1} X^T \\Cov{e}{e} ((X^T X)^{-1} X^T)^T \\\\\\\\
        &= (X^T X)^{-1} X^T \\Omega X (X^T X)^{-1}
    \\end{align*}
$$
This complex \"sandwich\" covariance structure proves that OLS is no longer the most efficient (lowest variance) estimator under heteroskedasticity.

### 1.2 Weighted Least Squares (WLS)

To strictly optimize the estimation process, we employ **Weighted Least Squares (WLS)**. The core intuition is to assign a specific weight to each observation that is inversely proportional to its variance. Observations with massive variance (high noise) receive extremely low weights, while highly precise observations receive massive weights.

The WLS objective function explicitly minimizes the weighted sum of squared residuals:
$$
    Q\\_{WLS}(\\beta) = (Y - X\\beta)^T \\Omega^{-1} (Y - X\\beta) = \\sum\\_{i=1}^n \\frac{(y\_i - x\_i^T \\beta)^2}{\\sigma\_i^2}
$$

By taking the derivative with respect to $\beta$ and perfectly setting it to zero, we derive the WLS estimator:
$$
    \\hat{\\beta}\\_{WLS} = (X^T \\Omega^{-1} X)^{-1} X^T \\Omega^{-1} Y
$$

This estimator represents the absolute best linear unbiased estimator (BLUE) under heteroskedastic conditions, effectively restoring the optimality guarantees of the Gauss-Markov theorem.

---

## 2. High-Dimensional Regression and Regularization

A catastrophic breakdown in the standard OLS framework occurs when the number of features $p$ strictly exceeds the number of observations $n$ ($p > n$). In this high-dimensional setting, the design matrix $X$ is wide, and the matrix $X^T X$ is mathematically rank-deficient and entirely non-invertible.

To resolve this, we introduce **regularization**, which intentionally injects a controlled amount of bias into the estimator to drastically reduce its variance and restore mathematical stability.

### 2.1 Ridge Regression ($L\_2$ Regularization)

Ridge regression mathematically adds an $L\_2$ penalty (the squared Euclidean norm of the parameter vector) to the standard least squares objective function:
$$
    \\hat{\\beta}\\_{ridge} = \\arg\\min\\_{\\beta} \\left( ||Y - X\\beta||^2 + \\lambda ||\\beta||\\_2^2 \\right)
$$
where $\lambda > 0$ is a strictly positive tuning parameter that directly controls the regularization strength.

Taking the derivative and setting it to zero yields a beautiful closed-form solution:
$$
    \\hat{\\beta}\\_{ridge} = (X^T X + \\lambda I\_p)^{-1} X^T Y
$$
Because we mathematically add a strictly positive constant $\lambda$ to the diagonal of $X^T X$, the resulting matrix is strictly positive definite and universally invertible, completely solving the $p > n$ catastrophe.

### 2.2 LASSO Regression ($L\_1$ Regularization)

The LASSO (Least Absolute Shrinkage and Selection Operator) method introduces an $L\_1$ penalty instead:
$$
    \\hat{\\beta}\\_{LASSO} = \\arg\\min\\_{\\beta} \\left( ||Y - X\\beta||^2 + \\lambda \\sum\\_{j=0}^{p-1} |\\beta\_j| \\right)
$$

**Key Properties of LASSO:**
1.  **No Closed Form:** Unlike Ridge, LASSO has absolutely no explicit closed-form algebraic solution due to the non-differentiability of the absolute value function at zero. It must be solved using advanced convex optimization algorithms.
2.  **Sparsity:** The geometric nature of the $L\_1$ penalty actively forces many of the estimated coefficients $\hat{\beta}\_j$ to become exactly zero. This effectively performs automatic feature selection, which is profoundly useful when dealing with thousands of weak or irrelevant features.

---

## 3. Cross-Validation

How do we scientifically select the optimal hyperparameter $\lambda$ for Ridge or LASSO, or generally choose the absolute best model from a diverse collection of candidates $M\_1, \\dots, M\_K$?

We heavily rely on **Cross-Validation**, a highly rigorous resampling technique designed to estimate the true out-of-sample prediction error.

### 3.1 The K-Fold Cross-Validation Algorithm

1.  **Split:** Randomly partition the original dataset into $K$ roughly equal-sized, mutually exclusive subsets (folds).
2.  **Iterate:** For each specific fold $k = 1, \\dots, K$:
    * Designate fold $k$ as the strict **validation set**.
    * Aggressively merge the remaining $K-1$ folds to form the **training set**.
    * Fit the specific model (e.g., LASSO with a fixed $\lambda$) exclusively on the training set.
    * Evaluate the model's predictive performance (e.g., compute the Mean Squared Error) exclusively on the unseen validation set $k$.
3.  **Aggregate:** Calculate the final cross-validation score by strictly averaging the validation performance across all $K$ iterations.
4.  **Select:** Repeat this entire procedure for various candidate values of $\lambda$ and definitively select the $\lambda$ that rigorously yields the absolute best average validation performance.

---

## References

1.  Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2.  Han, Y. (2026). Lecture 23: More on linear regression.