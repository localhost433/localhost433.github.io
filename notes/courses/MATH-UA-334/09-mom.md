---
title: Method of Moments
date: 2026-02-18
---

## 1. Introduction to Parameter Estimation

In statistical modeling, we often assume that our observed data $X_1, \dots, X_n$ are independent and identically distributed (i.i.d.) draws from a specific family of probability distributions. However, we rarely know the exact distribution; instead, we only know its *form*, which depends on one or more unknown parameters.

> For example, saying data have the *form* of a Normal distribution means we know it follows the symmetric bell-curve equation, but we don't know where it's centered or how wide it is.  
> This "form" is the PDF/PMF, but with placeholders instead of actual numbers.

### 1.1 Parametric Families

A parametric family is a collection of probability distributions indexed by a parameter vector $\theta = (\theta_1, \dots, \theta_k) \in \mathbb{R}^k$.

> $\theta$ as the tuple of parameters of this distribution which we want to estimate.

**Practical Examples:**

- **Normal Distribution:** $X\_1, \dots, X\_n \sim \mathcal{N}(\mu, \sigma^2)$. Here, the relevant parameter vector is exactly $\theta = (\mu, \sigma^2)$, accurately representing the center and the spread, both of which may be completely mathematically unknown.
- **Poisson Distribution:** $X\_1, \dots, X\_n \sim \text{Poi}(\lambda)$. The single controlling parameter is exactly $\theta = \lambda$, robustly representing the rate of occurrence over time.
- **Exponential Distribution:** $X\_1, \dots, X\_n \sim \text{Exp}(\lambda)$. The primary parameter is strictly $\theta = \lambda$, continuously governing the waiting time.

**The Core Problem:** Given a sample dataset, how do we systematically construct a good estimator $\hat{\theta}$ to estimate the true, unknown parameter $\theta$?

---

## 2. The Method of Moments (MoM)

The Method of Moments (MoM) is one of the oldest and most intuitive strategies for parameter estimation. The core philosophy is to equate the theoretical moments of a distribution (which are functions of the unknown parameters) to the empirical moments computed from the sample data.

> Relying on the assumption that **the sample should look like the population**.

### 2.1 Theoretical vs. Empirical Moments

**Definition (Theoretical Moments):**
The $k$-th theoretical moment of a random variable $X$ is defined as the expected value of $X^k$:
$$
    \mu\_k(\theta) = \E\_\theta[X^k]
$$
Notice that this moment is entirely a function of the underlying parameter $\theta$.

**Definition (Empirical/Sample Moments):**
The $k$-th empirical moment is the average of the $k$-th powers of the observed data:
$$
    \hat{m}\_k = \frac{1}{n} \sum\_{i=1}^n X\_i^k
$$
Unlike the deterministic theoretical moment, the computed empirical moment is inherently a random variable, primarily because it is computed precisely from the random sample.

> The analogy here to me is $\mu$ vs. $\overline{X}\_n$, "True Moment" vs. "Sample Moment".

### 2.2 The MoM Procedure

If our parameter vector $\theta$ has $k$ components (e.g., $k=2$ for a Normal distribution), we generally need $k$ equations to solve for them.

**Steps for MoM Estimation:**

1. Compute the first $k$ theoretical moments in terms of the unknown parameters: $\mu_1(\theta), \mu_2(\theta), \dots, \mu_k(\theta)$.
2. Compute the first $k$ sample moments from the data: $\hat{m}\_1, \hat{m}\_2, \dots, \hat{m}\_k$.
3. Set up a system of $k$ equations by setting the theoretical moments equal to the sample moments:
    $$
        \begin{align*}
            \mu_1(\theta) &= \hat{m}\_1 \\\\
            \mu_2(\theta) &= \hat{m}\_2 \\\\
            &\vdots \\\\
            \mu_k(\theta) &= \hat{m}\_k
        \end{align*}
    $$
4. Solve this system of equations for $\theta$. The solution is the Method of Moments estimator, denoted $\hat{\theta}\_\text{MoM}$.

---

## 3. Examples of MoM Estimators

### 3.1 Normal Distribution

Suppose $X_1, \dots, X_n \sim \mathcal{N}(\mu, \sigma^2)$. We need to estimate two parameters: $\theta = (\mu, \sigma^2)$. We need the first two moments.

#### Theoretical Moments

$$
    \mu\_1 = \E[X] = \mu
$$
Using the foundational computational formula for statistical variance $\Var{X} = \E[X^2] - (\E[X])^2$:

$$
    \mu\_2 = \E[X^2] = \Var{X} + (\E[X])^2 = \sigma^2 + \mu^2
$$

#### Sample Moments

$$
    \hat{m}\_1 = \frac{1}{n} \sum\_{i=1}^n X\_i = \overline{X}\_n
$$
$$
    \hat{m}\_2 = \frac{1}{n} \sum\_{i=1}^n X\_i^2
$$

#### Solving

$$
    \begin{align*}
        \mu &= \overline{X}\_n \\\\
        \sigma^2 + \mu^2 &= \frac{1}{n} \sum\_{i=1}^n X\_i^2
    \end{align*}
$$

Substituting the first equation into the second:
$$
    \begin{align*}
        \sigma^2 + (\overline{X}\_n)^2 &= \frac{1}{n} \sum\_{i=1}^n X\_i^2 \\\\
        \hat{\sigma}^2\_\text{MoM} &= \frac{1}{n} \sum\_{i=1}^n X\_i^2 - (\overline{X}\_n)^2 \\\\
        \hat{\sigma}^2\_\text{MoM} &= \frac{1}{n} \sum\_{i=1}^n (X\_i - \overline{X}\_n)^2
    \end{align*}
$$
Thus, the MoM estimators for the Normal distribution match the standard sample mean and the (biased) sample variance. That
$$
    \hat{\theta}\_\text{MoM} = \left( \hat{\mu}, \hat{\sigma}^2 \right) = \left( \overline{X}\_n, \frac{1}{n} \sum_{i=1}^n (X_i - \overline{X}\_n)^2 \right)
$$

> Here:
>
> - The estimator $\hat{\theta}$ is the tuple.  
> - The components $\hat{\theta}_i$ are individual estimators.  
>
> In this case $\hat{\theta} = (\hat{\theta}\_1, \hat{\theta}\_2)$  
> $\hat{\theta}_1 = \hat{\mu}$ and $\hat{\theta}_2 = \hat{\sigma}^2$

### 3.2 Exponential Distribution

Suppose $X_1, \dots, X_n \sim \text{Exp}(\lambda)$. We have one parameter, so we only need the first moment.

**Theoretical Moment:**
$$
    \mu\_1 = \E[X] = \frac{1}{\lambda}
$$

**Sample Moment:**
$$
    \hat{m}\_1 = \overline{X}\_n
$$

**Equate and Solve:**
$$
    \frac{1}{\hat{\lambda}\_\text{MoM}} = \overline{X}\_n \implies \hat{\lambda}\_\text{MoM} = \frac{1}{\overline{X}\_n}
$$

### 3.3 Uniform Distribution

Suppose $X\_1, \dots, X\_n \sim \text{Unif}(0, \theta)$.

**Theoretical Moment:**
$$
    \mu\_1 = \E[X] = \frac{\theta}{2}
$$

**Equate and Solve:**
$$
    \frac{\hat{\theta}\_\text{MoM}}{2} = \overline{X}\_n \implies \hat{\theta}\_\text{MoM} = 2\overline{X}\_n
$$

> Note: While MoM is simple to apply here, this estimator is highly sensitive to outliers, and the [Maximum Likelihood Estimator (Note 10)](http://robinc.vercel.app/note.html?course=MATH-UA-334&note=10-maximum-likelihood-estimation) for this distribution—which utilizes the sample maximum—is often strictly superior.

---

## 4. Consistency of MoM

A key statistical property of an estimator is **consistency**. While an estimator might be biased for small samples (like the MoM estimator for normal variance), consistency guarantees that as the sample size $n \to \infty$, the estimator converges in probability to the true parameter value.

> With enough data, a consistent estimator will almost certainly be correct.

The consistency of Method of Moments estimators relies on two fundamental theorems:

1. **LLN:** Because empirical sample moments are simply averages of i.i.d. variables (e.g., the average of $X_i^k$), the LLN guarantees that as $n \to \infty$, the sample moment converges to the theoretical moment:
    $$
        \hat{m}\_k \xrightarrow{p} \mu_k(\theta)
    $$
2. **The Continuous Mapping Theorem:** The MoM estimator $\hat{\theta}\_\text{MoM}$ is derived by solving a system of equations, meaning it is a function of the sample moments ($\hat{m}\_1, \dots, \hat{m}\_k$). If the inputs to a continuous function converge to a specific target (In this case from the sample moment to the true moments, that $\hat{m}\_j \xrightarrow{p} \mu_j(\theta)$), the output of the function converges as well. Therefore:
    $$
        \hat{\theta}\_\text{MoM}(\hat{m}\_1, \dots, \hat{m}\_k) \xrightarrow{p} \theta
    $$

Therefore, Method of Moments estimators are generally consistent. Even if they are not always the most efficient (lowest variance) estimators available.

> Questions: Why do we want the MoM estimator? Why do we use them if they are not the best?
>
> 1. Simplicity and Intuition: MoM is incredibly easy to understand and apply.
> 2. A Good Starting Point: Even when MoM estimators aren't the best possible estimators (like MLEs often are), they are usually "good enough" to get a rough estimate quickly.
>    > In complex modern computational statistics, MoM estimates are often used as the initial starting values for more complicated algorithms.
> 3. Consistency: Even if they are slightly biased for small samples, they are almost always consistent.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 9: Method of Moments.
