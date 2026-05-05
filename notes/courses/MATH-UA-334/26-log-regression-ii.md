---
title: Logistic Regression II
date: 2026-04-29
---

## 1. Statistical Inference in Logistic Regression

In the previous lecture, we successfully formulated the logistic regression optimization problem to compute the Maximum Likelihood Estimator (MLE) $\\hat{\\beta}$. However, point estimation alone is inadequate for rigorous scientific research; we must be able to perform statistical inference—constructing confidence intervals and hypothesis tests to evaluate whether specific features actually influence the predicted probabilities.

Because logistic regression entirely lacks a closed-form formula for $\\hat{\\beta}$, we cannot apply exact finite-sample derivations like the Student's t-distribution. Instead, we must overwhelmingly rely on the general **asymptotic theory of the MLE**.

### 1.1 The Fisher Information Matrix

Recall from asymptotic MLE theory that for massively large sample sizes $n$, the estimator dynamically converges to a Normal distribution strictly centered around the true parameter $\\beta$:
$$
    I(\\beta)^{1/2} (\\hat{\\beta}\_n - \\beta) \\xrightarrow{d} \\mathcal{N}(0, I\_p)
$$
where $I(\\beta)$ is the expected **Fisher Information matrix**.

For logistic regression, the Fisher Information matrix is defined mathematically as the negative expected Hessian of the log-likelihood function evaluated at the true parameter. We derived the exact Hessian in the previous lecture:
$$
    \\nabla^2 \\ell(\\beta) = -\\sum\\_{i=1}^n \\sigma(x\_i^T \\beta)(1 - \\sigma(x\_i^T \\beta)) x\_i x\_i^T
$$
Since this expression does not contain the random variable $y\_i$ (it depends strictly on the deterministic design matrix $x\_i$ and the parameters), its mathematical expectation is simply the expression itself!
$$
    I(\\beta) = \\E[-\\nabla^2 \\ell(\\beta)] = \\sum\\_{i=1}^n \\sigma(x\_i^T \\beta)(1 - \\sigma(x\_i^T \\beta)) x\_i x\_i^T
$$

### 1.2 Wald Tests and Confidence Intervals

In practical application, the true parameter $\\beta$ is unknown, so we must plug in our estimated $\\hat{\\beta}$ to compute the empirical Fisher Information matrix $I(\\hat{\\beta})$. The estimated covariance matrix for our coefficient vector is identically the inverse of this matrix:
$$
    \\widehat{\\text{Cov}}(\\hat{\\beta}) = I(\\hat{\\beta})^{-1}
$$

To test the specific null hypothesis $H\_0: \\beta\_j = 0$ (which asserts that the $j$-th feature has absolutely no effect on the log-odds), we extract the standard error for $\\hat{\\beta}\_j$ directly from the $j$-th diagonal entry of the inverse Fisher Information matrix:
$$
    SE(\\hat{\\beta}\_j) = \\sqrt{ \\left[ I(\\hat{\\beta})^{-1} \\right]\\_{jj} }
$$
We construct the **Wald test statistic**, which asymptotically follows a standard normal distribution under the null hypothesis:
$$
    Z\_j = \\frac{\\hat{\\beta}\_j}{SE(\\hat{\\beta}\_j)} \\sim \\mathcal{N}(0, 1)
$$
This powerful statistic enables us to calculate precise p-values and construct robust $95\\%$ confidence intervals: $\\left[ \\hat{\\beta}\_j - 1.96 \\cdot SE(\\hat{\\beta}\_j), \\quad \\hat{\\beta}\_j + 1.96 \\cdot SE(\\hat{\\beta}\_j) \\right]$.

---

## 2. Multinomial Logistic Regression

The standard logistic model rigorously handles strictly binary outcomes. We now comprehensively generalize this framework to handle multi-class categorical outcomes, where the response variable $Y\_i \\in \\{0, 1, \\dots, K-1\\}$. 

* **Examples:** Classifying an image strictly into one of $K$ digit classes (0 through 9); predicting a patient's medical condition as 'healthy', 'mild', or 'severe'.

### 2.1 The Softmax Formulation

We must construct a unified mathematical model that maps a linear predictor vector into a valid, rigorously constrained probability distribution across all $K$ categories. These probabilities must remain strictly positive and sum exactly to $1$.

We utilize the exponential function to guarantee positivity, and we forcefully normalize the results by their total sum. This is formally known as the **Softmax** function.

We select class $0$ as our mathematical baseline reference class. For every other class $j \\in \\{1, \\dots, K-1\\}$, we define an entirely distinct parameter vector $\\beta\_j$. The exact probability of observing class $j$ given the input $x$ is defined as:
$$
    p\_j(x) = \\prob{Y = j | x} = \\frac{e^{x^T \\beta\_j}}{1 + \\sum\\_{l=1}^{K-1} e^{x^T \\beta\_l}} \\quad \\text{for } j = 1, \\dots, K-1
$$
Because the total sum of all probabilities must equal $1$, the probability of the baseline class $0$ is mechanically determined by subtraction:
$$
    p\_0(x) = \\prob{Y = 0 | x} = \\frac{1}{1 + \\sum\\_{l=1}^{K-1} e^{x^T \\beta\_l}}
$$
*(Note: Mathematically, this perfectly implies that the parameter vector for the baseline class is intrinsically anchored as the zero vector, $\\beta\_0 = 0$.)*

### 2.2 The Multinomial Log-Likelihood

To formalize the optimization problem, we encode our response variable using a strict **one-hot encoding** strategy. We represent $y\_i$ as a $K$-dimensional indicator vector $\\vec{y}\_i$, where the $j$-th element is exactly $1$ if the observation belongs to class $j$, and $0$ otherwise.

The joint likelihood of observing the specific class $y\_i$ for a given $x\_i$ is elegantly written as the product of the individual probabilities raised to their respective one-hot indicators:
$$
    L(\\beta) = \\prod\\_{i=1}^n \\prod\\_{j=0}^{K-1} p\_j(x\_i)^{1(y\_i = j)}
$$

Taking the natural logarithm seamlessly transforms this massive product into a tractable sum, yielding the definitive **multinomial log-likelihood** objective function:
$$
    \\ell(\\beta) = \\sum\\_{i=1}^n \\sum\\_{j=0}^{K-1} 1(y\_i = j) \\log p\_j(x\_i)
$$
In the modern deep learning literature, the negative of this precise log-likelihood formulation is universally referred to as the **Cross-Entropy Loss**. Maximizing this log-likelihood via advanced gradient ascent techniques forms the foundational bedrock of all modern multi-class neural network classifiers.

---

## References

1.  Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2.  Han, Y. (2026). Lecture 26: Logistic Regression II.