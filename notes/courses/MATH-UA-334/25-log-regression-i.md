---
title: Logistic Regression I
date: 2026-04-27
---

## 1. Introduction to Classification

Up to this point, our regression models have explicitly assumed that the response variable $Y$ is a continuous real number ($Y \\in \\mathbb{R}$). However, an enormous class of statistical problems involves predicting a **categorical** outcome.

When the outcome is strictly binary, we say $Y\_i \\in \\{0, 1\\}$.
* **Examples:** Clicking an ad vs. not clicking; an image being a dog vs. a cat; a medical treatment succeeding vs. failing.

### 1.1 The Failure of Ordinary Least Squares

Why can't we simply apply standard Ordinary Least Squares (OLS) to a binary response variable?
1.  **Range Violation:** OLS mathematically models the expected value $\\E[Y\_i | x\_i] = x\_i^T \\beta$. Since $Y\_i \\in \\{0, 1\\}$, the true expectation must strictly represent a probability, meaning it must stay bound within $[0, 1]$. However, $x\_i^T \\beta$ is a linear plane that will inevitably plunge into negative infinity or soar into positive infinity as $x\_i$ grows, producing nonsensical predicted probabilities.
2.  **Severe Heteroskedasticity:** Because $Y\_i$ is a binary Bernoulli random variable, its variance is inherently tied directly to its mean: $\\Var{Y\_i | x\_i} = p\_i(1 - p\_i)$. Since the probability $p\_i$ varies with $x\_i$, the variance fluctuates wildly across the dataset, utterly destroying the homoscedasticity assumption required for OLS efficiency.

---

## 2. The Logistic Regression Model

To rigorously solve these failures, we must force the linear predictor $x^T \\beta$ to map smoothly into the strict $[0, 1]$ interval. We accomplish this using the **Logistic (Sigmoid) Function**:
$$
    \\sigma(t) = \\frac{1}{1 + e^{-t}}
$$

**Properties of the Sigmoid Function:**
* It is strictly bounded: $\\lim\\_{t \\to -\\infty} \\sigma(t) = 0$ and $\\lim\\_{t \\to \\infty} \\sigma(t) = 1$.
* It is perfectly symmetric around the center: $\\sigma(0) = 0.5$.
* It is strictly increasing.

We define the probabilistic model for Logistic Regression as:
$$
    Y\_i \\sim \\text{Bern}(p(x\_i)) \\quad \\text{where } p(x\_i) = \\sigma(x\_i^T \\beta) = \\frac{1}{1 + e^{-x\_i^T \\beta}}
$$

### 2.1 The Log-Odds Interpretation

A mathematically beautiful consequence of this formulation arises when we examine the \"odds\" of a positive outcome. The odds are defined as the ratio of the probability of success to the probability of failure: $\\frac{p(x)}{1 - p(x)}$.
$$
    \\frac{p(x)}{1 - p(x)} = e^{x^T \\beta}
$$
Taking the natural logarithm of both sides elegantly yields the **log-odds**:
$$
    \\log \\left( \\frac{p(x)}{1 - p(x)} \\right) = x^T \\beta
$$
This explicitly demonstrates that while the probabilities are bound in a complex non-linear curve, the log-odds of success change in a perfectly linear fashion with respect to the predictors $x$.

---

## 3. Maximum Likelihood Estimation

Because the variance is intrinsically heteroskedastic, we entirely abandon the least squares framework and rely strictly on **Maximum Likelihood Estimation (MLE)** to find the optimal parameter vector $\\beta$.

For a dataset of $n$ independent observations $(x\_i, y\_i)$, the joint likelihood function is:
$$
    L(\\beta) = \\prod\\_{i=1}^n p(x\_i)^{y\_i} (1 - p(x\_i))^{1 - y\_i}
$$

Taking the natural logarithm, we derive the formal log-likelihood objective function:
$$
    \\begin{align*}
        \\ell(\\beta) &= \\sum\\_{i=1}^n \\left[ y\_i \\log p(x\_i) + (1 - y\_i) \\log(1 - p(x\_i)) \\right] \\\\\\\\
        &= \\sum\\_{i=1}^n \\left[ y\_i \\log \\left( \\frac{p(x\_i)}{1 - p(x\_i)} \\right) + \\log(1 - p(x\_i)) \\right] \\\\\\\\
        &= \\sum\\_{i=1}^n \\left[ y\_i x\_i^T \\beta - \\log(1 + e^{x\_i^T \\beta}) \\right]
    \\end{align*}
$$

### 3.1 Optimization and the Gradient

Unlike standard linear regression, taking the derivative of this log-likelihood and setting it to zero does **not** yield a closed-form algebraic expression. We must solve it algorithmically.

The gradient (first derivative vector) is:
$$
    \\nabla \\ell(\\beta) = \\sum\\_{i=1}^n \\left( y\_i - \\sigma(x\_i^T \\beta) \\right) x\_i
$$
The Hessian matrix (second derivative matrix) is:
$$
    \\nabla^2 \\ell(\\beta) = -\\sum\\_{i=1}^n \\sigma(x\_i^T \\beta)(1 - \\sigma(x\_i^T \\beta)) x\_i x\_i^T
$$
Because $p(1-p)$ is always strictly positive, and $x\_i x\_i^T$ is a positive semi-definite outer product matrix, the overall Hessian is mathematically negative definite. This guarantees that the log-likelihood function is strictly globally concave, ensuring that optimization algorithms (like Newton-Raphson or Iteratively Reweighted Least Squares) will rapidly converge to a unique, global maximum.

---

## 4. Decision Boundaries and Separability

Once we compute the optimal $\\hat{\\beta}$, we use it for physical prediction. For a new data point $x$, we output the prediction $\\hat{Y} = 1$ if the estimated probability $p(x) > 0.5$.

Because $\\sigma(0) = 0.5$, the prediction rule simplifies strictly to evaluating the sign of the linear combination:
* Predict $1$ if $x^T \\hat{\\beta} > 0$
* Predict $0$ if $x^T \\hat{\\beta} < 0$

The geometric **decision boundary** is therefore the exact mathematical hyperplane defined by $x^T \\hat{\\beta} = 0$.

### 4.1 Linear Separability

A profound theoretical failure occurs if the training data is **linearly separable**. Data is defined as linearly separable if there exists *any* vector $v \\in \\mathbb{R}^p$ such that a perfect hyperplane divides the classes:
* $y\_i = 1 \\implies x\_i^T v > 0$
* $y\_i = 0 \\implies x\_i^T v < 0$

If such a vector exists, the maximum likelihood estimator literally fails to exist. The optimization algorithm will simply scale the magnitude of $v$ towards infinity ($c \\cdot v$ as $c \\to \\infty$), attempting to push the probabilities to exactly $1$ and $0$, resulting in numerical overflow and divergent parameters. In modern machine learning, this is mitigated by imposing $L\_2$ regularization (Ridge penalty) on the logistic objective.

---

## References

1.  Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2.  Han, Y. (2026). Lecture 25: Logistic Regression I.