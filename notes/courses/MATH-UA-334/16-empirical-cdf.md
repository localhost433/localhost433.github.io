---
title: Empirical CDF and BootStrap
date: 2026-03-25
---

## 1. Empirical CDF

Suppose $X\_1, \dots, X\_n$ are i.i.d. observations and we would like to summarize the data without first imposing a parametric model on the underlying distribution. Recall that the distribution of a random variable can be described through:

- Its Cumulative Distribution Function (CDF), Probability Mass Function (pmf), or Probability Density Function (pdf).
- Important functionals such as the mean, median, quartiles, and so on.

### 1.1 Definition and Interpretation

For a random variable $X$ with distribution function $F$, the true CDF is defined as:
$$
    F(t) = \prob(X \le t)
$$
This function is non-decreasing, ranges from $0$ to $1$, and is right-continuous.

Given a set of observations $X\_1, \dots, X\_n$, the **empirical CDF** is defined by counting the proportion of data points that fall below or equal to a threshold $t$:
$$
    F\_n(t) = \frac{1}{n} \\# \\{i : X\_i \le t \\}
$$
Equivalently, this can be mathematically written using indicator functions:
$$
    F\_n(t) = \frac{1}{n} \sum\_{i=1}^n \mathbf{1}\\{X\_i \le t\\}
$$

The probability distribution that puts exactly a probability mass of $1/n$ on each observed data point $X\_i$ is precisely called the **empirical distribution**. The empirical CDF $F\_n(t)$ is exactly the true CDF of this underlying empirical distribution.

### 1.2 Pointwise Analysis

Fix a specific point $t \in \mathbb{R}$. For each observation, the indicator variable $1\\{X\_i \le t\\}$ acts as an independent Bernoulli random variable with success probability $F(t)$. That is:
$$
    \mathbf{1}\\{X\_i \le t\\} \sim \text{Ber}(F(t))
$$
Using this fundamental fact, we can derive the basic pointwise properties of the empirical CDF evaluated at $t$.

**Mean:**
$$
    \E[F\_n(t)] = \frac{1}{n} \sum\_{i=1}^n \E[\mathbf{1}\\{X\_i \le t\\}] = \frac{1}{n} \sum\_{i=1}^n \prob(X\_i \le t) = F(t)
$$
This demonstrates that $F\_n(t)$ is an unbiased estimator for the true population CDF evaluated at $F(t)$.

**Variance:**
Since the sample observations are independent, the variance of the sum is exactly the sum of the variances:
$$
    \Var{F\_n(t)} = \frac{1}{n^2} \sum\_{i=1}^n \Var{\mathbf{1}\\{X\_i \le t\\}} = \frac{1}{n} F(t)(1 - F(t))
$$
Because the maximum possible value of the parabola $x(1-x)$ for $x \in [0, 1]$ occurs at $1/4$, the variance is strictly bounded from above by $\frac{1}{4n}$. The typical pointwise deviation $|F\_n(t) - F(t)|$ is of order $n^{-1/2}$.

**Covariance:**
For any two distinct points $s, t \in \mathbb{R}$, we can compute the covariance. Because observations corresponding to $i \neq j$ are completely independent, their cross-covariance terms perfectly vanish:
$$
    \begin{align*}
        \Cov{F\_n(s)}{F\_n(t)}
        &= \frac{1}{n^2} \sum\_{i=1}^n \Cov{\mathbf{1} \\{X\_i \le s\\}}{\mathbf{1}\\{X\_i \le t\\}} \\\\
        &= \frac{1}{n} \left( \E[\mathbf{1}\\{X\_i \le s\\} \mathbf{1}\\{X\_i \le t\\}] - F(s)F(t) \right) \\\\
        &= \frac{1}{n} \left( F(\min\\{s, t\\}) - F(s)F(t) \right)
    \end{align*}
$$

### 1.3 Uniform Law of Large Numbers

While the pointwise analysis shows that $F\_n(t) \to F(t)$ for any *single* fixed value of $t$, in nonparametric statistics we often need the entire function $F\_n$ to uniformly converge to $F$ simultaneously across all possible values of $t$.

We measure the global maximum vertical distance between the empirical CDF and the true CDF using the **Kolmogorov-Smirnov (KS) distance**:
$$
    d\_{KS}(F\_n, F) = \sup\_{x \in \mathbb{R}} |F\_n(x) - F(x)|
$$

**Theorem 16.1 (Glivenko-Cantelli Theorem):**
As the sample size $n \to \infty$, the Kolmogorov-Smirnov distance almost surely converges to $0$ in probability:
$$
    d\_{KS}(F\_n, F) \xrightarrow{p} 0
$$

**Proof Sketch:**
By mapping the problem through the probability integral transform, we can assume without loss of generality that $F$ is the strictly linear CDF of the uniform distribution on $[0, 1]$, meaning $F(x) = x$. Fix $\epsilon > 0$ and establish a finite grid of points $x\_i = i\epsilon$. By the standard pointwise Law of Large Numbers, the empirical CDF securely converges to the true CDF at each of these finite, discrete grid points. Because both $F\_n$ and $F$ are monotonically non-decreasing functions, we can analytically bound the error at any intermediate point $x \in [x\_i, x\_{i+1}]$ using the extreme errors evaluated at the neighboring grid points. Since the grid width is fixed at $\epsilon$, the maximum deviation globally is eventually bounded tightly by $\epsilon$ plus a rapidly vanishing error term. Since $\epsilon$ is arbitrarily small, the supremum taken over all $x$ rigorously approaches $0$.

### 1.4 A Distributional Limit and Two Consequences

If the true CDF $F$ is a strictly continuous function, scaling the KS distance geometrically by $\sqrt{n}$ yields a profound asymptotic limit:
$$
    \sqrt{n} d\_{KS}(F\_n, F) \xrightarrow{d} K
$$
where the random variable $K$ strictly follows the **Kolmogorov distribution**. The most remarkable feature of this limit law is that it is completely **distribution-free**—it does not depend whatsoever on the underlying shape or parameters of $F$, provided $F$ contains no discrete jumps.

**Consequence 1: Confidence Bands**
Let $K(\alpha)$ be the critical threshold value such that $\prob(K > K(\alpha)) = \alpha$. Using this distribution, we can construct an asymptotic $(1-\alpha)$ confidence band that traps the entire CDF:
$$
    \prob\left( F\_n(x) - \frac{K(\alpha)}{\sqrt{n}} \le F(x) \le F\_n(x) + \frac{K(\alpha)}{\sqrt{n}} \quad \forall x \in \mathbb{R} \right) \to 1 - \alpha
$$

**Consequence 2: Kolmogorov-Smirnov Test**
To formally test the null hypothesis $H\_0: X\_1, \dots, X\_n \sim F$, we calculate the KS distance and reject $H\_0$ if the scaled distance exceeds the critical value:
$$
    \sqrt{n} d\_{KS}(F\_n, F) > K(\alpha)
$$
This establishes a highly powerful, completely nonparametric one-sample goodness-of-fit test.

---

## 2. Bootstrap

The Bootstrap is a computationally intensive resampling method designed to quantify the statistical uncertainty of an arbitrary estimator $\hat{\theta}\_n$. In broad practice, it is widely utilized to approximate standard errors, formally estimate structural biases, and reliably construct robust confidence intervals whenever classical mathematical derivations fail.

### 2.1 Motivation

A classical statistical route to quantifying uncertainty involves deriving an exact asymptotic variance formula analytically. For example, for a Maximum Likelihood Estimator (MLE), we generally rely on the Cramer-Rao framework:
$$
    \Var{\hat{\theta}\_n} \approx \frac{1}{n I(\theta)}
$$
where $I(\theta)$ represents the Fisher Information.

However, mathematical statisticians encounter two massive practical hurdles:

1. The true parameter $\theta$ is completely unknown (a partial plug-in fix involves awkwardly replacing $\theta$ with $\hat{\theta}\_n$).
2. Even if $\theta$ were perfectly known, analytically deriving the variance function $V(\theta)$ or $I(\theta)$ can be mathematically impossible or computationally intractable for complex estimators (like the sample median, or deep machine learning models).

### 2.2 If $\theta$ Were Known: Monte Carlo Simulation

Imagine a hypothetical thought experiment where the true data-generating parameter $\theta$ is perfectly known to the statistician. To find the variance of $\hat{\theta}\_n$, we could strictly execute a Monte Carlo simulation:

1. Simulate $B$ fresh, independent datasets of size $n$ from the true generating distribution $P\_\theta$.
2. Compute the chosen estimator on each simulated dataset to obtain independent copies $\theta^\*\_1, \dots, \theta^\*\_B$.
3. Compute the empirical variance of these generated copies:

$$
    \frac{1}{B} \sum\_{j=1}^B (\theta^\*\_j - \overline{\theta}^\*)^2 \xrightarrow{p} \Var{\hat{\theta}\_n}
$$

### 2.3 Nonparametric Bootstrap

In physical reality, the true distribution $F$ is completely unknown. The fundamental theoretical insight of the **Nonparametric Bootstrap** is to aggressively replace the unknown true distribution $F$ with the empirical distribution $F\_n$ computed directly from our single, fixed dataset.

We mathematically generate $B$ bootstrap samples of size $n$ strictly by sampling from the observed dataset $X\_1, \dots, X\_n$ **uniformly at random with replacement**. On each bootstrap sample, we compute the exact same estimator, sequentially yielding bootstrap replicates $\theta^\*\_1, \dots, \theta^\*\_B$.

If the true asymptotic variance of the estimator scales as $V(F)/n$, then for massively large $n$ and large $B$:
$$
    \frac{1}{B} \sum\_{j=1}^B (\theta^\*\_j - \overline{\theta}^\*)^2 \approx \frac{V(F\_n)}{n} \approx \frac{V(F)}{n}
$$
This precisely defines the basic nonparametric bootstrap principle.

### 2.4 Parametric Bootstrap

Alternatively, if we explicitly assume that the data originates from a parametric model family $\\{P\_\theta : \theta \in \Theta\\}$, we can directly replace the unknown parameter with its sample estimate $\hat{\theta}\_n$. We then algorithmically simulate new bootstrap samples of size $n$ drawn directly from the mathematically fitted density $f\_{\hat{\theta}\_n}(x)$. This structured, model-based approach is broadly classified as the **Parametric Bootstrap**.

### 2.5 Bias Estimation and Confidence Intervals

Beyond mere variance, the bootstrap fundamentally maps out the entire sampling distribution, empowering statisticians to estimate systemic bias and construct sophisticated confidence sets.

**Bias Estimation:**
Let the true systemic bias of the estimator be defined as $b(\theta) = \E[\hat{\theta}\_n] - \theta$. The bootstrap directly estimates this by evaluating the expected deviation strictly under the empirical bootstrap distribution:
$$
    b(\hat{\theta}\_n) \approx \E^\*[\theta^\*] - \hat{\theta}\_n \approx \frac{1}{B} \sum\_{j=1}^B \theta^\*\_j - \hat{\theta}\_n
$$

**Confidence Intervals:**
There are several standard techniques to construct valid bootstrap confidence intervals:

1. **Normal Interval:** If the estimator structurally converges to a normal distribution, we compute the standard bootstrap error $\hat{\sigma}\_{\text{boot}}$ and pivot to form:
    $$
        \left[ \hat{\theta}\_n - z\_{1-\alpha/2} \hat{\sigma}\_{\text{boot}}, \quad \hat{\theta}\_n + z\_{1-\alpha/2} \hat{\sigma}\_{\text{boot}} \right]
    $$

2. **Percentile Interval:** Let $q^\*\_p$ reliably denote the empirical $p$-quantile of the sorted bootstrap replicates $\theta^\*\_1, \dots, \theta^\*\_B$. The most highly intuitive approach directly returns the bounded percentile interval:
    $$
        \left[ q^\*\_{\alpha/2}, \quad q^\*\_{1-\alpha/2} \right]
    $$

3. **Reflected Interval:** A highly rigorous statistical method relies on mimicking the pivot distribution $\hat{\theta}\_n - \theta \approx \theta^\* - \hat{\theta}\_n$.
    $$
        1 - \alpha \approx \prob(q^\*\_{\alpha/2} - \hat{\theta}\_n \le \theta^\* - \hat{\theta}\_n \le q^\*\_{1-\alpha/2} - \hat{\theta}\_n)
    $$

    Assuming the distributional errors match appropriately, we symmetrically replace $\theta^\* - \hat{\theta}\_n$ with the true deviation $\hat{\theta}\_n - \theta$ and algebraically solve for $\theta$, which rigorously reflects the bounds around the center:

    $$
        \left[ 2\hat{\theta}\_n - q^\*\_{1-\alpha/2}, \quad 2\hat{\theta}\_n - q^\*\_{\alpha/2} \right]
    $$

    > Note: In broad practical application, researchers frequently prefer to deploy the raw percentile interval due to its transformation-invariant properties, precisely because it achieves the exact same first-order asymptotic accuracy.

4. **BCa Interval:** The Bias-Corrected and Accelerated (BCa) interval rigorously adjusts for skewness and structural bias, technically improving the global error rate to second-order asymptotic accuracy.

### 2.6 Final Comments

The bootstrap serves as a tremendously powerful, highly general statistical "plug-in" procedure. Whenever classical theoretical calculations involving the Fisher Information $I(\theta)$ or complex analytic derivatives fail or become mathematically tedious, the bootstrap seamlessly substitutes massive computational power to reliably evaluate statistical uncertainty.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 16: Empirical CDF, Bootstrap.
