---
title: Simple Linear Regression
date: 2026-04-08
---

## 1. Introduction to Simple Linear Regression

In many statistical applications, our primary goal is **prediction**. We are given an independent (explanatory or predictor) variable $x$, and we wish to predict a dependent (response or outcome) variable $y$. 

Before formally introducing any probabilistic assumptions, we generally start with the foundational idea that $y$ can be approximated by some function of $x$:
$$
    y \approx f(x)
$$

### 1.1 Parametric Modeling

To operationalize this, we must guess the structural "shape" of the function $f$. This is known as parametric modeling. By visually inspecting a scatter plot of our data, we might propose various functional forms:
* **Linear:** $f(x) = \beta\_0 + \beta\_1 x$
* **Polynomial:** $f(x) = \sum\_{k=0}^d a\_k x^k$
* **Exponential:** $f(x) = C\_0 e^{C\_1 x}$

For this lecture, we will focus exclusively on the **Simple Linear Regression** model, where the relationship between the predictor and the response is assumed to be a straight line.

---

## 2. Least Squares Estimation

Given a dataset of $n$ observations $(x\_1, y\_1), \dots, (x\_n, y\_n)$, we need a rigorous mathematical method to find the optimal parameters $\beta\_0$ (the intercept) and $\beta\_1$ (the slope). 

The most common approach, dating back to Carl Friedrich Gauss, is the **Method of Least Squares**. We seek the parameters that explicitly minimize the sum of the squared vertical deviations between the observed responses and the fitted line.

We define the objective function $Q(\beta\_0, \beta\_1)$ as:
$$
    Q(\beta\_0, \beta\_1) = \sum\_{i=1}^n (y\_i - (\beta\_0 + \beta\_1 x\_i))^2
$$

### 2.1 Deriving the Estimators

To find the minimum, we take the partial derivatives of $Q$ with respect to both parameters and perfectly set them to zero.

**Step 1: Derivative with respect to $\beta\_0$**
$$
    \begin{align*}
        \frac{\partial Q}{\partial \beta\_0} &= -2 \sum\_{i=1}^n (y\_i - \beta\_0 - \beta\_1 x\_i) = 0 \\\\
        \sum\_{i=1}^n y\_i &= n \beta\_0 + \beta\_1 \sum\_{i=1}^n x\_i \\\\
        \frac{1}{n} \sum\_{i=1}^n y\_i &= \beta\_0 + \beta\_1 \frac{1}{n} \sum\_{i=1}^n x\_i \\\\
        \bar{y} &= \beta\_0 + \beta\_1 \bar{x}
    \end{align*}
$$
This immediately gives us the estimator for the intercept:
$$
    \hat{\beta}\_0 = \bar{y} - \hat{\beta}\_1 \bar{x}
$$

**Step 2: Derivative with respect to $\beta\_1$**
$$
    \begin{align*}
        \frac{\partial Q}{\partial \beta\_1} &= -2 \sum\_{i=1}^n x\_i (y\_i - \beta\_0 - \beta\_1 x\_i) = 0 \\\\
        \sum\_{i=1}^n x\_i y\_i &= \beta\_0 \sum\_{i=1}^n x\_i + \beta\_1 \sum\_{i=1}^n x\_i^2
    \end{align*}
$$
By substituting $\beta\_0 = \bar{y} - \beta\_1 \bar{x}$ into the equation and applying algebraic manipulations, we isolate $\hat{\beta}\_1$:
$$
    \hat{\beta}\_1 = \frac{\sum\_{i=1}^n (x\_i - \bar{x})(y\_i - \bar{y})}{\sum\_{i=1}^n (x\_i - \bar{x})^2}
$$

---

## 3. The Standard Statistical Model

To evaluate the statistical properties of our estimators (like bias and variance), we must formalize the data-generating process. The standard simple linear regression model assumes:
$$
    y\_i = \beta\_0 + \beta\_1 x\_i + e\_i \quad \text{for } i = 1, \dots, n
$$
Where:
* $x\_i$ are strictly fixed, deterministic constants (not random variables).
* $\beta\_0, \beta\_1$ are the true, unknown population parameters.
* $e\_i$ are independent and identically distributed (i.i.d.) random error terms.

**Error Assumptions:**
1. $\E[e\_i] = 0$ (The errors are perfectly centered at zero).
2. $\Var{e\_i} = \sigma^2$ (Homoscedasticity: the variance is constant across all $x\_i$).
3. Often, for exact inference, we further assume $e\_i \sim \mathcal{N}(0, \sigma^2)$.

---

## 4. Statistical Properties of the Estimators

Because $y\_i$ is a linear combination of a fixed constant and a random error $e\_i$, $y\_i$ is itself a random variable with $\E[y\_i] = \beta\_0 + \beta\_1 x\_i$ and $\Var{y\_i} = \sigma^2$. Since $\hat{\beta}\_0$ and $\hat{\beta}\_1$ are linear functions of $y\_i$, they are also random variables.

### 4.1 Unbiasedness

We can rigorously show that both estimators are unbiased.

For $\hat{\beta}\_1$:
$$
    \begin{align*}
        \E[\hat{\beta}\_1] &= \E\left[ \frac{\sum\_{i=1}^n (x\_i - \bar{x})(y\_i - \bar{y})}{\sum\_{i=1}^n (x\_i - \bar{x})^2} \right] \\\\
        &= \frac{\sum\_{i=1}^n (x\_i - \bar{x}) \E[y\_i]}{\sum\_{i=1}^n (x\_i - \bar{x})^2} \\\\
        &= \frac{\sum\_{i=1}^n (x\_i - \bar{x}) (\beta\_0 + \beta\_1 x\_i)}{\sum\_{i=1}^n (x\_i - \bar{x})^2}
    \end{align*}
$$
Because $\sum (x\_i - \bar{x}) \beta\_0 = \beta\_0 \sum (x\_i - \bar{x}) = 0$, the first term elegantly vanishes. We are left with:
$$
    \E[\hat{\beta}\_1] = \frac{\beta\_1 \sum\_{i=1}^n (x\_i - \bar{x}) x\_i}{\sum\_{i=1}^n (x\_i - \bar{x})^2} = \beta\_1
$$
Thus, $\hat{\beta}\_1$ is an unbiased estimator of the true slope. Similarly, $\E[\hat{\beta}\_0] = \E[\bar{y} - \hat{\beta}\_1 \bar{x}] = \beta\_0 + \beta\_1 \bar{x} - \beta\_1 \bar{x} = \beta\_0$.

### 4.2 Variance and Covariance

Using the independence of the $y\_i$ observations, we calculate the variances:
$$
    \Var{\hat{\beta}\_1} = \frac{\sigma^2}{\sum\_{i=1}^n (x\_i - \bar{x})^2}
$$
$$
    \Var{\hat{\beta}\_0} = \frac{\sigma^2 \sum\_{i=1}^n x\_i^2}{n \sum\_{i=1}^n (x\_i - \bar{x})^2}
$$
The covariance between the two estimators is:
$$
    \text{Cov}(\hat{\beta}\_0, \hat{\beta}\_1) = -\frac{\bar{x} \sigma^2}{\sum\_{i=1}^n (x\_i - \bar{x})^2}
$$

---

## 5. Estimating the Error Variance

The variance of the random errors, $\sigma^2$, is typically unknown and must be estimated from the data. We use the sum of the squared residuals.

Let the fitted value be $\hat{y}\_i = \hat{\beta}\_0 + \hat{\beta}\_1 x\_i$. The residual is $e\_i = y\_i - \hat{y}\_i$.
An unbiased estimator for $\sigma^2$ is the sample residual variance $S^2$:
$$
    S^2 = \frac{1}{n-2} \sum\_{i=1}^n (y\_i - \hat{\beta}\_0 - \hat{\beta}\_1 x\_i)^2
$$
We strictly divide by $n-2$ instead of $n$ because we have consumed two degrees of freedom calculating the parameters $\hat{\beta}\_0$ and $\hat{\beta}\_1$.

---

## 6. Hypothesis Testing for Coefficients

With $S^2$ calculated, we can formally construct hypothesis tests for our coefficients. The standard error of $\hat{\beta}\_1$ is:
$$
    S\_{\hat{\beta}\_1} = \frac{S}{\sqrt{\sum\_{i=1}^n (x\_i - \bar{x})^2}}
$$
Under the strict assumption that $e\_i \sim \mathcal{N}(0, \sigma^2)$, the standardized statistic dynamically follows a Student's t-distribution:
$$
    \frac{\hat{\beta}\_1 - \beta\_1}{S\_{\hat{\beta}\_1}} \sim t\_{n-2}
$$
This forms the foundational basis for constructing confidence intervals and computing p-values to test if the slope $\beta\_1$ is statistically significantly different from zero.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 20: Simple Linear Regression.