---
title: "20/21 - Simple Linear Regression"
date: 2026-04-08/13
---

## Roadmap

This note develops simple linear regression from first principles. We derive the least squares estimators, establish their statistical properties (unbiasedness, variance), and estimate the error variance. We then cover hypothesis testing for coefficients. The second half assesses model fit via residual analysis and correlation, introduces the coefficient of determination $R^2$, and builds up the random vector machinery needed for multiple regression.

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

## 7. Assessing the Fit with Residuals

Finding a line of best fit does not mathematically guarantee that a linear model is actually appropriate for the data. To rigorously assess the plausibility of the standard model, we must analyze the **residuals**.

**Definition (Residual):**
The residual $\hat{e}\_i$ for the $i$-th observation is the strictly vertical distance between the actual observed value and the fitted predicted value:
$$
    \hat{e}\_i = y\_i - \hat{y}\_i = y\_i - \hat{\beta}\_0 - \hat{\beta}\_1 x\_i
$$
*(Note: Do not confuse the calculated residual $\hat{e}\_i$ with the true, unobservable error term $e\_i$.)*

### 7.1 Properties of Residuals

Under the standard regression assumptions, the mathematical expectation of any given residual is exactly zero:
$$
    \begin{align*}
        \E[\hat{e}\_i] &= \E[y\_i - \hat{\beta}\_0 - \hat{\beta}\_1 x\_i] \\\\
        &= \E[y\_i] - \E[\hat{\beta}\_0] - \E[\hat{\beta}\_1] x\_i \\\\
        &= (\beta\_0 + \beta\_1 x\_i) - \beta\_0 - \beta\_1 x\_i \\\\
        &= 0
    \end{align*}
$$

### 7.2 Residual Plots

Statisticians actively use diagnostic scatter plots of the residuals $\hat{e}\_i$ against the predictor values $x\_i$ to detect severe violations of the model assumptions:

1. **Good Picture:** The residuals appear as a completely uniform, random scatter centered perfectly around the horizontal zero line. This suggests the linear assumption and homoscedasticity assumption are valid.
2. **Bad Picture (Non-linearity):** The residuals exhibit a clear curved or U-shaped trend. This strongly implies that $\E[\hat{e}\_i] \neq 0$ for certain ranges of $x$, indicating that a polynomial or non-linear term is severely missing from the model.
3. **Bad Picture (Heteroskedasticity):** The vertical spread (variance) of the residuals explicitly widens or narrows as $x$ increases (e.g., a "megaphone" shape). This aggressively violates the assumption that $\Var{e\_i} = \sigma^2$ is constant.

---

## 8. Correlation and the Coefficient of Determination

While the slope $\hat{\beta}\_1$ tells us the expected change in $y$ for a one-unit change in $x$, it does not intrinsically measure the *strength* of the linear association, because its mathematical magnitude depends entirely on the physical units of $x$ and $y$.

### 8.1 The Correlation Coefficient

The true population correlation coefficient $\rho$ is unitless and defined as:
$$
    \rho = \Cor{X}{Y} = \frac{\text{Cov}(X, Y)}{\sqrt{\Var{X} \Var{Y}}}
$$
Given our sample data, we explicitly calculate the **sample correlation coefficient** $r$:
$$
    r = \frac{\sum\_{i=1}^n (x\_i - \bar{x})(y\_i - \bar{y})}{\sqrt{\sum\_{i=1}^n (x\_i - \bar{x})^2 \sum\_{i=1}^n (y\_i - \bar{y})^2}}
$$
We can algebraically link the sample correlation $r$ directly to the estimated slope $\hat{\beta}\_1$:
$$
    \hat{\beta}\_1 = r \frac{S\_y}{S\_x}
$$
where $S\_x$ and $S\_y$ are the sample standard deviations.

### 8.2 The Coefficient of Determination ($R^2$)

To globally quantify how well our linear model fits the data, we utilize the Analysis of Variance (ANOVA) decomposition. We partition the total variability in the response variable into two distinct components:
$$
    \text{SST} = \text{RSS} + \text{Explained SS}
$$

* **Total Sum of Squares (SST):** $\sum\_{i=1}^n (y\_i - \bar{y})^2$ (The baseline variability of $y$).
* **Residual Sum of Squares (RSS):** $\sum\_{i=1}^n \hat{e}\_i^2$ (The variability strictly left unexplained by the model).
* **Explained Sum of Squares:** $\sum\_{i=1}^n (\hat{y}\_i - \bar{y})^2$ (The variability successfully explained by the regression line).

The **Coefficient of Determination**, heavily denoted as $R^2$, represents the strict proportion of the total variance in $y$ that is predictably explained by $x$:
$$
    R^2 = \frac{\text{Explained SS}}{\text{SST}} = 1 - \frac{\text{RSS}}{\text{SST}}
$$
In the specific case of simple linear regression, it is a profound mathematical fact that $R^2 = r^2$.

---

## 9. Introduction to Random Vectors

As we transition toward Multiple Linear Regression involving multiple predictors, scalar algebra becomes catastrophically tedious. We must heavily adopt linear algebra and **Random Vectors**.

A random vector $Z = (Z\_1, \dots, Z\_n)^T$ is simply a column vector where each element is a distinct random variable.

* **Expectation:** $\E[Z]$ is the vector of individual expectations.
* **Covariance Matrix:** The covariance matrix $\Sigma\_{ZZ}$ is an $n \times n$ matrix capturing all pairwise covariances:
    $$
        (\Sigma\_{ZZ})\_{ij} = \text{Cov}(Z\_i, Z\_j)
    $$
    Thus, the diagonal elements rigidly represent the individual variances $\Var{Z\_i}$. The matrix is mathematically symmetric and positive semi-definite.

### 9.1 Linear Transformations of Random Vectors

If we apply a fixed, deterministic matrix transformation $A \in \mathbb{R}^{m \times n}$ to our random vector $Z$, such that $Y = AZ$, the statistical moments transform elegantly:
$$
    \E[Y] = \E[AZ] = A\E[Z]
$$
$$
    \Sigma\_{YY} = \Var{AZ} = A \Sigma\_{ZZ} A^T
$$

### 9.2 The Trace Property

The trace of a square matrix, denoted $\text{Tr}(A)$, is the sum of its diagonal elements. A highly useful statistical property relates the expected squared norm of a random vector to the trace of its covariance matrix.
If $\E[Z] = 0$, then:
$$
    \begin{align*}
        \E[||Z||^2] &= \E\left[ \sum\_{i=1}^n Z\_i^2 \right] \\\\
        &= \sum\_{i=1}^n \E[Z\_i^2] \\\\
        &= \sum\_{i=1}^n \Var{Z\_i} \\\\
        &= \sum\_{i=1}^n (\Sigma\_{ZZ})\_{ii} \\\\
        &= \text{Tr}(\Sigma\_{ZZ})
    \end{align*}
$$
This fundamental trace identity will be strictly required to calculate the expected residual error in multiple regression.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 20: Simple Linear Regression.
3. Han, Y. (2026). Lecture 21: More on simple linear regression.
