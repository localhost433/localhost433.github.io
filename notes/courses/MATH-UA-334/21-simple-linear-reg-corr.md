---
title: Simple Linear Regression and Correlation
date: 2026-04-13
---

## 1. Assessing the Fit with Residuals

In the previous lecture, we established the mathematical machinery to calculate the least squares estimators $\hat{\beta}\_0$ and $\hat{\beta}\_1$. However, finding a line of best fit does not mathematically guarantee that a linear model is actually appropriate for the data. To rigorously assess the plausibility of the standard model, we must analyze the **residuals**.

**Definition (Residual):**
The residual $\hat{e}\_i$ for the $i$-th observation is the strictly vertical distance between the actual observed value and the fitted predicted value:
$$
    \hat{e}\_i = y\_i - \hat{y}\_i = y\_i - \hat{\beta}\_0 - \hat{\beta}\_1 x\_i
$$
*(Note: Do not confuse the calculated residual $\hat{e}\_i$ with the true, unobservable error term $e\_i$.)*

### 1.1 Properties of Residuals

Under the standard regression assumptions, the mathematical expectation of any given residual is exactly zero:
$$
    \begin{align*}
        \E[\hat{e}\_i] &= \E[y\_i - \hat{\beta}\_0 - \hat{\beta}\_1 x\_i] \\\\
        &= \E[y\_i] - \E[\hat{\beta}\_0] - \E[\hat{\beta}\_1] x\_i \\\\
        &= (\beta\_0 + \beta\_1 x\_i) - \beta\_0 - \beta\_1 x\_i \\\\
        &= 0
    \end{align*}
$$

### 1.2 Residual Plots

Statisticians actively use diagnostic scatter plots of the residuals $\hat{e}\_i$ against the predictor values $x\_i$ to detect severe violations of the model assumptions:

1. **Good Picture:** The residuals appear as a completely uniform, random scatter centered perfectly around the horizontal zero line. This suggests the linear assumption and homoscedasticity assumption are valid.
2. **Bad Picture (Non-linearity):** The residuals exhibit a clear curved or U-shaped trend. This strongly implies that $\E[\hat{e}\_i] \neq 0$ for certain ranges of $x$, indicating that a polynomial or non-linear term is severely missing from the model.
3. **Bad Picture (Heteroskedasticity):** The vertical spread (variance) of the residuals explicitly widens or narrows as $x$ increases (e.g., a "megaphone" shape). This aggressively violates the assumption that $\Var{e\_i} = \sigma^2$ is constant.

---

## 2. Correlation and the Coefficient of Determination

While the slope $\hat{\beta}\_1$ tells us the expected change in $y$ for a one-unit change in $x$, it does not intrinsically measure the *strength* of the linear association, because its mathematical magnitude depends entirely on the physical units of $x$ and $y$.

### 2.1 The Correlation Coefficient

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

### 2.2 The Coefficient of Determination ($R^2$)

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

## 3. Introduction to Random Vectors

As we transition toward Multiple Linear Regression involving multiple predictors, scalar algebra becomes catastrophically tedious. We must heavily adopt linear algebra and **Random Vectors**.

A random vector $Z = (Z\_1, \dots, Z\_n)^T$ is simply a column vector where each element is a distinct random variable.

* **Expectation:** $\E[Z]$ is the vector of individual expectations.
* **Covariance Matrix:** The covariance matrix $\Sigma\_{ZZ}$ is an $n \times n$ matrix capturing all pairwise covariances:
    $$
        (\Sigma\_{ZZ})\_{ij} = \text{Cov}(Z\_i, Z\_j)
    $$
    Thus, the diagonal elements rigidly represent the individual variances $\Var{Z\_i}$. The matrix is mathematically symmetric and positive semi-definite.

### 3.1 Linear Transformations of Random Vectors

If we apply a fixed, deterministic matrix transformation $A \in \mathbb{R}^{m \times n}$ to our random vector $Z$, such that $Y = AZ$, the statistical moments transform elegantly:
$$
    \E[Y] = \E[AZ] = A\E[Z]
$$
$$
    \Sigma\_{YY} = \Var{AZ} = A \Sigma\_{ZZ} A^T
$$

### 3.2 The Trace Property

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
2. Han, Y. (2026). Lecture 21: More on simple linear regression.
