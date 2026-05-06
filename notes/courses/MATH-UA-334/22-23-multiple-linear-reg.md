---
title: "22/23 - Multiple Linear Regression"
date: 2026-04-15/20
---

## Roadmap

This note generalizes linear regression to multiple predictors. We derive the OLS estimator in matrix form, prove it is unbiased and characterize its covariance matrix, and analyze the projection matrix structure. We then estimate the residual variance and build inference for individual coefficients. The second half handles practical extensions: heteroskedasticity (with Weighted Least Squares as the fix), high-dimensional settings (Ridge and LASSO regularization), and cross-validation for model/hyperparameter selection.

---

## 1. The Multiple Linear Regression Model

We now generalize our framework to allow for multiple predictor variables. Suppose we wish to predict a response variable $y$ using $p-1$ distinct explanatory variables (features). The standard linear model is written as:
$$
    y\_i = \beta\_0 + \beta\_1 x\_{i1} + \beta\_2 x\_{i2} + \dots + \beta\_{p-1} x\_{i,p-1} + e\_i \quad \text{for } i = 1, \dots, n
$$

To eliminate the massive summations, we aggressively compress this system into vector-matrix notation.
Let $Y \in \mathbb{R}^n$ be the vector of responses, $e \in \mathbb{R}^n$ be the vector of random errors, $\beta \in \mathbb{R}^p$ be the parameter vector, and $X \in \mathbb{R}^{n \times p}$ be the **Design Matrix** (where the first column is strictly entirely ones to accommodate the intercept $\beta\_0$).

The model is compactly represented as:
$$
    Y = X\beta + e
$$
**Standard Assumptions:**

1. $\E[e] = 0$ (The zero vector).
2. $\text{Cov}(e) = \sigma^2 I\_n$ (The errors are completely uncorrelated and share a constant variance $\sigma^2$).

---

## 2. Ordinary Least Squares (OLS) Estimator

We seek the parameter vector $\hat{\beta}$ that strictly minimizes the sum of squared residuals $||Y - X\beta||^2$. By applying vector calculus, we differentiate the objective function with respect to the vector $\beta$ and set it to zero, leading to the famous Normal Equations:
$$
    (X^T X) \hat{\beta} = X^T Y
$$
Assuming the matrix $X^T X$ is fully invertible (which requires the columns of $X$ to be linearly independent), the unique global solution is the **OLS Estimator**:
$$
    \hat{\beta} = (X^T X)^{-1} X^T Y
$$

---

## 3. Statistical Properties of the OLS Estimator

Since $Y$ is a random vector, $\hat{\beta}$ is also a random vector. We can rigorously determine its expectation and covariance matrix using the linear transformation rules derived in the previous lecture.

### 3.1 Bias

We substitute the true model $Y = X\beta + e$ directly into the estimator:
$$
    \begin{align*}
        \E[\hat{\beta}] &= \E[(X^T X)^{-1} X^T Y] \\\\
        &= \E[(X^T X)^{-1} X^T (X\beta + e)] \\\\
        &= \E[\beta + (X^T X)^{-1} X^T e] \\\\
        &= \beta + (X^T X)^{-1} X^T \E[e]
    \end{align*}
$$
Because $\E[e] = 0$, the second term identically vanishes, yielding $\E[\hat{\beta}] = \beta$. The OLS estimator is perfectly unbiased.

### 3.2 Covariance Matrix

We apply the covariance transformation rule $\text{Cov}(AZ) = A \text{Cov}(Z) A^T$:
$$
    \begin{align*}
        \text{Cov}(\hat{\beta}) &= \text{Cov}(\beta + (X^T X)^{-1} X^T e) \\\\
        &= \text{Cov}((X^T X)^{-1} X^T e) \\\\
        &= ((X^T X)^{-1} X^T) \text{Cov}(e) ((X^T X)^{-1} X^T)^T \\\\
        &= (X^T X)^{-1} X^T (\sigma^2 I\_n) X (X^T X)^{-1} \\\\
        &= \sigma^2 (X^T X)^{-1} (X^T X) (X^T X)^{-1} \\\\
        &= \sigma^2 (X^T X)^{-1}
    \end{align*}
$$

---

## 4. The Projection Matrix and Residuals

The fitted predicted values are given by $\hat{Y} = X\hat{\beta}$. Substituting the OLS formula:
$$
    \hat{Y} = X(X^T X)^{-1} X^T Y = P Y
$$
The matrix $P = X(X^T X)^{-1} X^T$ is known as the **Projection Matrix** (or Hat matrix, because it puts the "hat" on $Y$).

**Properties of $P$:**

1. **Symmetric:** $P^T = P$
2. **Idempotent:** $P^2 = P$ (Projecting a vector that is already projected changes nothing).
3. **Trace:** $\text{Tr}(P) = p$. Consequently, the trace of $(I\_n - P)$ is $n - p$.

The vector of residuals is identically:
$$
    \hat{e} = Y - \hat{Y} = (I\_n - P)Y
$$
Since $(I\_n - P)X = X - X = 0$, substituting $Y = X\beta + e$ simplifies the residuals to strictly depend only on the true errors:
$$
    \hat{e} = (I\_n - P)(X\beta + e) = (I\_n - P)e
$$

---

## 5. Estimating the Residual Variance

To estimate the unknown variance $\sigma^2$, we calculate the expected value of the sum of squared residuals, $||\hat{e}||^2$.
Since $\E[\hat{e}] = (I\_n - P)\E[e] = 0$, we can heavily utilize the trace property $\E[||Z||^2] = \text{Tr}(\Sigma\_{ZZ})$:
$$
    \begin{align*}
        \E[||\hat{e}||^2] &= \text{Tr}(\text{Cov}(\hat{e})) \\\\
        &= \text{Tr}(\text{Cov}((I\_n - P)e)) \\\\
        &= \text{Tr}((I\_n - P) \text{Cov}(e) (I\_n - P)^T) \\\\
        &= \text{Tr}((I\_n - P) (\sigma^2 I\_n) (I\_n - P)) \\\\
        &= \sigma^2 \text{Tr}((I\_n - P)^2)
    \end{align*}
$$
Because $(I\_n - P)$ is also idempotent, $(I\_n - P)^2 = (I\_n - P)$.
$$
    \E[||\hat{e}||^2] = \sigma^2 \text{Tr}(I\_n - P) = \sigma^2 (n - p)
$$
Therefore, the unbiased estimator for the error variance strictly divides by $n-p$:
$$
    S^2 = \frac{1}{n-p} ||\hat{e}||^2
$$

---

## 6. Inference and Confidence Intervals

With $S^2$ acquired, the estimated variance for any individual coefficient $\hat{\beta}\_j$ is seamlessly extracted strictly from the diagonal of the covariance matrix:
$$
    S\_{\hat{\beta}\_j}^2 = S^2 [(X^T X)^{-1}]\_{jj}
$$

If we assume the true underlying errors $e\_i$ are normally distributed, the test statistic dynamically follows a Student's t-distribution with $n-p$ degrees of freedom:
$$
    \frac{\hat{\beta}\_j - \beta\_j}{S\_{\hat{\beta}\_j}} \sim t\_{n-p}
$$
Even if normality fails, the Central Limit Theorem heavily guarantees asymptotic normality as $n \to \infty$. This allows us to construct an approximate $95\%$ confidence interval for any parameter:
$$
    \beta\_j \in \left[ \hat{\beta}\_j - 1.96 S\_{\hat{\beta}\_j}, \quad \hat{\beta}\_j + 1.96 S\_{\hat{\beta}\_j} \right]
$$
This precisely justifies the standard regression output universally seen in statistical software packages like R or Python, which report the Estimate, Standard Error, t-value, and the $P(>|t|)$ significance p-value.

---

## 7. Heteroskedasticity in Linear Regression

In the standard multiple linear regression model, we heavily relied on the strict assumption of homoscedasticity, meaning that the variance of the random error terms is perfectly constant across all observations: $\Var{e\_i} = \sigma^2$ for all $i$.

However, in many practical datasets, the variance of the errors fluctuates depending on the specific observation. This phenomenon is formally known as **heteroskedasticity**.

We modify our standard linear model to mathematically accommodate this:
$$
    Y = X\beta + e
$$
where $Y \in \mathbb{R}^n$, $X \in \mathbb{R}^{n \times p}$, $\beta \in \mathbb{R}^p$, and $e \in \mathbb{R}^n$.
The fundamental assumptions become:

1. $\E[e] = 0$
2. $\Cov{e}{e} = \Omega = \text{diag}(\sigma\_1^2, \sigma\_2^2, \dots, \sigma\_n^2)$

Here, the covariance matrix $\Omega$ is a diagonal matrix where each distinct diagonal entry represents the specific variance $\sigma\_i^2$ of the corresponding error term $e\_i$.

### 7.1 Properties of the OLS Estimator under Heteroskedasticity

If we naively apply the standard Ordinary Least Squares (OLS) estimator $\hat{\beta}\_{OLS} = (X^T X)^{-1} X^T Y$, what happens to its fundamental statistical properties?

**Bias:**
The OLS estimator miraculously remains perfectly unbiased. Because $\E[e] = 0$ still holds, the same derivation as before gives $\E[\hat{\beta}\_{OLS}] = \beta$.

**Variance:**
The covariance matrix of the OLS estimator, however, fundamentally changes. We must explicitly incorporate the true error covariance matrix $\Omega$:
$$
    \Cov{\hat{\beta}\_{OLS}}{\hat{\beta}\_{OLS}} = (X^T X)^{-1} X^T \Omega X (X^T X)^{-1}
$$
This complex "sandwich" covariance structure proves that OLS is no longer the most efficient (lowest variance) estimator under heteroskedasticity.

### 7.2 Weighted Least Squares (WLS)

To strictly optimize the estimation process, we employ **Weighted Least Squares (WLS)**. The core intuition is to assign a specific weight to each observation that is inversely proportional to its variance. Observations with massive variance (high noise) receive extremely low weights, while highly precise observations receive massive weights.

The WLS objective function explicitly minimizes the weighted sum of squared residuals:
$$
    Q\_{WLS}(\beta) = (Y - X\beta)^T \Omega^{-1} (Y - X\beta) = \sum\_{i=1}^n \frac{(y\_i - x\_i^T \beta)^2}{\sigma\_i^2}
$$

By taking the derivative with respect to $\beta$ and perfectly setting it to zero, we derive the WLS estimator:
$$
    \hat{\beta}\_{WLS} = (X^T \Omega^{-1} X)^{-1} X^T \Omega^{-1} Y
$$

This estimator represents the absolute best linear unbiased estimator (BLUE) under heteroskedastic conditions, effectively restoring the optimality guarantees of the Gauss-Markov theorem.

---

## 8. High-Dimensional Regression and Regularization

A catastrophic breakdown in the standard OLS framework occurs when the number of features $p$ strictly exceeds the number of observations $n$ ($p > n$). In this high-dimensional setting, the design matrix $X$ is wide, and the matrix $X^T X$ is mathematically rank-deficient and entirely non-invertible.

To resolve this, we introduce **regularization**, which intentionally injects a controlled amount of bias into the estimator to drastically reduce its variance and restore mathematical stability.

### 8.1 Ridge Regression ($L\_2$ Regularization)

Ridge regression mathematically adds an $L\_2$ penalty (the squared Euclidean norm of the parameter vector) to the standard least squares objective function:
$$
    \hat{\beta}\_{ridge} = \arg\min\_{\beta} \left( ||Y - X\beta||^2 + \lambda ||\beta||\_2^2 \right)
$$
where $\lambda > 0$ is a strictly positive tuning parameter that directly controls the regularization strength.

Taking the derivative and setting it to zero yields a beautiful closed-form solution:
$$
    \hat{\beta}\_{ridge} = (X^T X + \lambda I\_p)^{-1} X^T Y
$$
Because we mathematically add a strictly positive constant $\lambda$ to the diagonal of $X^T X$, the resulting matrix is strictly positive definite and universally invertible, completely solving the $p > n$ catastrophe.

### 8.2 LASSO Regression ($L\_1$ Regularization)

The LASSO (Least Absolute Shrinkage and Selection Operator) method introduces an $L\_1$ penalty instead:
$$
    \hat{\beta}\_{LASSO} = \arg\min\_{\beta} \left( ||Y - X\beta||^2 + \lambda \sum\_{j=0}^{p-1} |\beta\_j| \right)
$$

**Key Properties of LASSO:**

1. **No Closed Form:** Unlike Ridge, LASSO has absolutely no explicit closed-form algebraic solution due to the non-differentiability of the absolute value function at zero. It must be solved using advanced convex optimization algorithms.
2. **Sparsity:** The geometric nature of the $L\_1$ penalty actively forces many of the estimated coefficients $\hat{\beta}\_j$ to become exactly zero. This effectively performs automatic feature selection, which is profoundly useful when dealing with thousands of weak or irrelevant features.

---

## 9. Cross-Validation

How do we scientifically select the optimal hyperparameter $\lambda$ for Ridge or LASSO, or generally choose the absolute best model from a diverse collection of candidates $M\_1, \dots, M\_K$?

We heavily rely on **Cross-Validation**, a highly rigorous resampling technique designed to estimate the true out-of-sample prediction error.

### 9.1 The K-Fold Cross-Validation Algorithm

1. **Split:** Randomly partition the original dataset into $K$ roughly equal-sized, mutually exclusive subsets (folds).
2. **Iterate:** For each specific fold $k = 1, \dots, K$:
    * Designate fold $k$ as the strict **validation set**.
    * Aggressively merge the remaining $K-1$ folds to form the **training set**.
    * Fit the specific model (e.g., LASSO with a fixed $\lambda$) exclusively on the training set.
    * Evaluate the model's predictive performance (e.g., compute the Mean Squared Error) exclusively on the unseen validation set $k$.
3. **Aggregate:** Calculate the final cross-validation score by strictly averaging the validation performance across all $K$ iterations.
4. **Select:** Repeat this entire procedure for various candidate values of $\lambda$ and definitively select the $\lambda$ that rigorously yields the absolute best average validation performance.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 22: Multiple Linear Regression.
3. Han, Y. (2026). Lecture 23: More on linear regression.
