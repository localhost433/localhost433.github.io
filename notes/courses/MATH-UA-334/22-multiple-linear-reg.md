---
title: Multiple Linear Regression
date: 2026-04-15
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

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 22: Multiple Linear Regression.
