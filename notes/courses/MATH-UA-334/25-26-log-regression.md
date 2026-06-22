---
title: "25/26 - Logistic Regression"
date: 2026-04-27/29
---

## Roadmap

This note covers logistic regression for binary and multi-class classification. We explain why OLS fails for binary outcomes, introduce the logistic (sigmoid) function and the log-odds interpretation, and derive MLE via gradient and Hessian analysis. We discuss decision boundaries, the problem of linear separability, and then extend to statistical inference (Fisher Information, Wald tests, confidence intervals). Finally, we generalize to multinomial logistic regression via the Softmax formulation and the cross-entropy loss.

---

## 1. Introduction to Classification

Up to this point, our regression models have explicitly assumed that the response variable $Y$ is a continuous real number ($Y \in \mathbb{R}$). However, an enormous class of statistical problems involves predicting a **categorical** outcome.

When the outcome is strictly binary, we say $Y\_i \in \{0, 1\}$.

- **Examples:** Clicking an ad vs. not clicking; an image being a dog vs. a cat; a medical treatment succeeding vs. failing.

### 1.1 The Failure of Ordinary Least Squares

Why can't we simply apply standard Ordinary Least Squares (OLS) to a binary response variable?

1. **Range Violation:** OLS mathematically models the expected value $\E[Y\_i | x\_i] = x\_i^T \beta$. Since $Y\_i \in \{0, 1\}$, the true expectation must strictly represent a probability, meaning it must stay bound within $[0, 1]$. However, $x\_i^T \beta$ is a linear plane that will inevitably plunge into negative infinity or soar into positive infinity as $x\_i$ grows, producing nonsensical predicted probabilities.
2. **Severe Heteroskedasticity:** Because $Y\_i$ is a binary Bernoulli random variable, its variance is inherently tied directly to its mean: $\Var{Y\_i | x\_i} = p\_i(1 - p\_i)$. Since the probability $p\_i$ varies with $x\_i$, the variance fluctuates wildly across the dataset, utterly destroying the homoscedasticity assumption required for OLS efficiency.

---

## 2. The Logistic Regression Model

To rigorously solve these failures, we must force the linear predictor $x^T \beta$ to map smoothly into the strict $[0, 1]$ interval. We accomplish this using the **Logistic (Sigmoid) Function**:
$$
    \sigma(t) = \frac{1}{1 + e^{-t}}
$$

**Properties of the Sigmoid Function:**

- It is strictly bounded: $\lim\_{t \to -\infty} \sigma(t) = 0$ and $\lim\_{t \to \infty} \sigma(t) = 1$.
- It is perfectly symmetric around the center: $\sigma(0) = 0.5$.
- It is strictly increasing.

We define the probabilistic model for Logistic Regression as:
$$
    Y\_i \sim \text{Bern}(p(x\_i)) \quad \text{where } p(x\_i) = \sigma(x\_i^T \beta) = \frac{1}{1 + e^{-x\_i^T \beta}}
$$

### 2.1 The Log-Odds Interpretation

A mathematically beautiful consequence of this formulation arises when we examine the "odds" of a positive outcome. The odds are defined as the ratio of the probability of success to the probability of failure: $\frac{p(x)}{1 - p(x)}$.
$$
    \frac{p(x)}{1 - p(x)} = e^{x^T \beta}
$$
Taking the natural logarithm of both sides elegantly yields the **log-odds**:
$$
    \log \left( \frac{p(x)}{1 - p(x)} \right) = x^T \beta
$$
This explicitly demonstrates that while the probabilities are bound in a complex non-linear curve, the log-odds of success change in a perfectly linear fashion with respect to the predictors $x$.

---

## 3. Maximum Likelihood Estimation

Because the variance is intrinsically heteroskedastic, we entirely abandon the least squares framework and rely strictly on **Maximum Likelihood Estimation (MLE)** to find the optimal parameter vector $\beta$.

For a dataset of $n$ independent observations $(x\_i, y\_i)$, the joint likelihood function is:
$$
    L(\beta) = \prod\_{i=1}^n p(x\_i)^{y\_i} (1 - p(x\_i))^{1 - y\_i}
$$

Taking the natural logarithm, we derive the formal log-likelihood objective function:
$$
    \begin{align*}
        \ell(\beta) &= \sum\_{i=1}^n \left[ y\_i \log p(x\_i) + (1 - y\_i) \log(1 - p(x\_i)) \right] \\\\
        &= \sum\_{i=1}^n \left[ y\_i \log \left( \frac{p(x\_i)}{1 - p(x\_i)} \right) + \log(1 - p(x\_i)) \right] \\\\
        &= \sum\_{i=1}^n \left[ y\_i x\_i^T \beta - \log(1 + e^{x\_i^T \beta}) \right]
    \end{align*}
$$

### 3.1 Optimization and the Gradient

Unlike standard linear regression, taking the derivative of this log-likelihood and setting it to zero does **not** yield a closed-form algebraic expression. We must solve it algorithmically.

The gradient (first derivative vector) is:
$$
    \nabla \ell(\beta) = \sum\_{i=1}^n \left( y\_i - \sigma(x\_i^T \beta) \right) x\_i
$$
The Hessian matrix (second derivative matrix) is:
$$
    \nabla^2 \ell(\beta) = -\sum\_{i=1}^n \sigma(x\_i^T \beta)(1 - \sigma(x\_i^T \beta)) x\_i x\_i^T
$$
Because $p(1-p)$ is always strictly positive, and $x\_i x\_i^T$ is a positive semi-definite outer product matrix, the overall Hessian is mathematically negative definite. This guarantees that the log-likelihood function is strictly globally concave, ensuring that optimization algorithms (like Newton-Raphson or Iteratively Reweighted Least Squares) will rapidly converge to a unique, global maximum.

---

## 4. Decision Boundaries and Separability

Once we compute the optimal $\hat{\beta}$, we use it for physical prediction. For a new data point $x$, we output the prediction $\hat{Y} = 1$ if the estimated probability $p(x) > 0.5$.

Because $\sigma(0) = 0.5$, the prediction rule simplifies strictly to evaluating the sign of the linear combination:

- Predict $1$ if $x^T \hat{\beta} > 0$
- Predict $0$ if $x^T \hat{\beta} < 0$

The geometric **decision boundary** is therefore the exact mathematical hyperplane defined by $x^T \hat{\beta} = 0$.

### 4.1 Linear Separability

A profound theoretical failure occurs if the training data is **linearly separable**. Data is defined as linearly separable if there exists *any* vector $v \in \mathbb{R}^p$ such that a perfect hyperplane divides the classes:

- $y\_i = 1 \implies x\_i^T v > 0$
- $y\_i = 0 \implies x\_i^T v < 0$

If such a vector exists, the maximum likelihood estimator literally fails to exist. The optimization algorithm will simply scale the magnitude of $v$ towards infinity ($c \cdot v$ as $c \to \infty$), attempting to push the probabilities to exactly $1$ and $0$, resulting in numerical overflow and divergent parameters. In modern machine learning, this is mitigated by imposing $L\_2$ regularization (Ridge penalty) on the logistic objective.

---

## 5. Statistical Inference in Logistic Regression

Point estimation alone is inadequate for rigorous scientific research; we must be able to perform statistical inference — constructing confidence intervals and hypothesis tests to evaluate whether specific features actually influence the predicted probabilities.

Because logistic regression entirely lacks a closed-form formula for $\hat{\beta}$, we cannot apply exact finite-sample derivations like the Student's t-distribution. Instead, we must overwhelmingly rely on the general **asymptotic theory of the MLE**.

### 5.1 The Fisher Information Matrix

Recall from asymptotic MLE theory that for massively large sample sizes $n$, the estimator dynamically converges to a Normal distribution strictly centered around the true parameter $\beta$:
$$
    I(\beta)^{1/2} (\hat{\beta}\_n - \beta) \xrightarrow{d} \mathcal{N}(0, I\_p)
$$
where $I(\beta)$ is the expected **Fisher Information matrix**.

For logistic regression, the Fisher Information matrix is defined mathematically as the negative expected Hessian of the log-likelihood function evaluated at the true parameter. We derived the exact Hessian in the previous section:
$$
    \nabla^2 \ell(\beta) = -\sum\_{i=1}^n \sigma(x\_i^T \beta)(1 - \sigma(x\_i^T \beta)) x\_i x\_i^T
$$
Since this expression does not contain the random variable $y\_i$ (it depends strictly on the deterministic design matrix $x\_i$ and the parameters), its mathematical expectation is simply the expression itself:
$$
    I(\beta) = \E[-\nabla^2 \ell(\beta)] = \sum\_{i=1}^n \sigma(x\_i^T \beta)(1 - \sigma(x\_i^T \beta)) x\_i x\_i^T
$$

### 5.2 Wald Tests and Confidence Intervals

In practical application, the true parameter $\beta$ is unknown, so we must plug in our estimated $\hat{\beta}$ to compute the empirical Fisher Information matrix $I(\hat{\beta})$. The estimated covariance matrix for our coefficient vector is identically the inverse of this matrix:
$$
    \widehat{\text{Cov}}(\hat{\beta}) = I(\hat{\beta})^{-1}
$$

To test the specific null hypothesis $H\_0: \beta\_j = 0$ (which asserts that the $j$-th feature has absolutely no effect on the log-odds), we extract the standard error for $\hat{\beta}\_j$ directly from the $j$-th diagonal entry of the inverse Fisher Information matrix:
$$
    SE(\hat{\beta}\_j) = \sqrt{ \left[ I(\hat{\beta})^{-1} \right]\_{jj} }
$$
We construct the **Wald test statistic**, which asymptotically follows a standard normal distribution under the null hypothesis:
$$
    Z\_j = \frac{\hat{\beta}\_j}{SE(\hat{\beta}\_j)} \sim \mathcal{N}(0, 1)
$$
This powerful statistic enables us to calculate precise p-values and construct robust $95\%$ confidence intervals: $\left[ \hat{\beta}\_j - 1.96 \cdot SE(\hat{\beta}\_j), \quad \hat{\beta}\_j + 1.96 \cdot SE(\hat{\beta}\_j) \right]$.

---

## 6. Multinomial Logistic Regression

The standard logistic model rigorously handles strictly binary outcomes. We now comprehensively generalize this framework to handle multi-class categorical outcomes, where the response variable $Y\_i \in \{0, 1, \dots, K-1\}$.

- **Examples:** Classifying an image strictly into one of $K$ digit classes (0 through 9); predicting a patient's medical condition as 'healthy', 'mild', or 'severe'.

### 6.1 The Softmax Formulation

We must construct a unified mathematical model that maps a linear predictor vector into a valid, rigorously constrained probability distribution across all $K$ categories. These probabilities must remain strictly positive and sum exactly to $1$.

We utilize the exponential function to guarantee positivity, and we forcefully normalize the results by their total sum. This is formally known as the **Softmax** function.

We select class $0$ as our mathematical baseline reference class. For every other class $j \in \{1, \dots, K-1\}$, we define an entirely distinct parameter vector $\beta\_j$. The exact probability of observing class $j$ given the input $x$ is defined as:
$$
    p\_j(x) = \prob{Y = j | x} = \frac{e^{x^T \beta\_j}}{1 + \sum\_{l=1}^{K-1} e^{x^T \beta\_l}} \quad \text{for } j = 1, \dots, K-1
$$
Because the total sum of all probabilities must equal $1$, the probability of the baseline class $0$ is mechanically determined by subtraction:
$$
    p\_0(x) = \prob{Y = 0 | x} = \frac{1}{1 + \sum\_{l=1}^{K-1} e^{x^T \beta\_l}}
$$
*(Note: Mathematically, this perfectly implies that the parameter vector for the baseline class is intrinsically anchored as the zero vector, $\beta\_0 = 0$.)*

### 6.2 The Multinomial Log-Likelihood

To formalize the optimization problem, we encode our response variable using a strict **one-hot encoding** strategy. We represent $y\_i$ as a $K$-dimensional indicator vector $\vec{y}\_i$, where the $j$-th element is exactly $1$ if the observation belongs to class $j$, and $0$ otherwise.

The joint likelihood of observing the specific class $y\_i$ for a given $x\_i$ is elegantly written as the product of the individual probabilities raised to their respective one-hot indicators:
$$
    L(\beta) = \prod\_{i=1}^n \prod\_{j=0}^{K-1} p\_j(x\_i)^{1(y\_i = j)}
$$

Taking the natural logarithm seamlessly transforms this massive product into a tractable sum, yielding the definitive **multinomial log-likelihood** objective function:
$$
    \ell(\beta) = \sum\_{i=1}^n \sum\_{j=0}^{K-1} 1(y\_i = j) \log p\_j(x\_i)
$$
In the modern deep learning literature, the negative of this precise log-likelihood formulation is universally referred to as the **Cross-Entropy Loss**. Maximizing this log-likelihood via advanced gradient ascent techniques forms the foundational bedrock of all modern multi-class neural network classifiers.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 25: Logistic Regression I.
3. Han, Y. (2026). Lecture 26: Logistic Regression II.
