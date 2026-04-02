---
title: p-Values and Confidence Sets
date: 2026-03-09
---

## 1. Moving Beyond Simple Hypothesis Testing

In the previous lecture, we established that the Likelihood Ratio (LR) test is perfectly optimal for differentiating between two simple hypotheses. However, this foundational paradigm is highly restrictive for practical applications.

1. **Composite Hypotheses:** The LR test cannot be directly applied when the alternative hypothesis $H\_1$ is composite (e.g., $H\_1: \theta > \theta\_0$).
2. **Difficult Power Calculations:** Controlling the Type II error probability ($\beta$) is mathematically difficult when dealing with composite alternative spaces, because $\beta$ must be calculated for every single parameter configuration within $H\_1$:
    $$
        \beta = \max\_{\theta \in \Theta\_1} \prob(\text{Accept } H\_0 \mid \theta)
    $$

Therefore, in broad practical usage, most statistical tests are exclusively designed to strictly control the Type I error (the significance level $\alpha$), without explicitly optimizing for $\beta$. We accomplish this by relying on test statistics with known null distributions.

> In addition, under a practical scenario, we fix $\alpha$ because false positives are considered worse than false negatives.

---

## 2. Test Statistics and Critical Regions

The standard strategy for composite hypothesis testing is to construct a specific measurable function of the data and the parameter, $h(X, \theta)$, such that under the null hypothesis $H\_0$, the sampling distribution of $h$ is completely known and free of unknown parameters.

For a test of $H\_0: \theta = \theta\_0$, we calculate the test statistic evaluated at the null parameter: $T(X) = h(X, \theta\_0)$.

We then establish a **rejection region** based strictly on critical values. For a one-sided test, we reject $H\_0$ if $T(X) > c\_\alpha$. The threshold $c\_\alpha$ is systematically chosen such that:
$$
    \prob(T(X) > c\_\alpha \mid H\_0) = \alpha
$$
If the test statistic falls outside this narrowly constructed region, we conclude that the observed data is fundamentally incompatible with the null hypothesis, and we reject $H\_0$.

---

## 3. The $p$-Value

When simply reporting "Reject" or "Accept", a significant amount of statistical context is lost. A test statistic that barely crosses the threshold is treated identically to one that massively exceeds it. The **$p$-value** addresses this limitation by reporting the continuous strength of the evidence against the null hypothesis.

**Definition (P-Value):**
The $p$-value is the probability, calculated precisely under the assumption that the null hypothesis $H\_0$ is true, of observing a test statistic at least as extreme as the one that was actually observed in the sample data.

If $T\_\text{obs}$ is the realized, observed value of our test statistic $T(X)$, the $p$-value for a right-sided test is:
$$
    \text{$p$-value} = \prob(T(X) \ge T\_\text{obs} \mid H\_0)
$$

### 3.1 Properties of the $p$-Value

1. **Decision Rule:** A $p$-value perfectly acts as an alternative decision mechanism. We reject $H\_0$ if and only if the calculated $\text{$p$-value} \le \alpha$.
2. **Uniform Distribution Under the Null:** A fascinating mathematical property is that if the null hypothesis is completely true, and the test statistic is continuous, the $p$-value itself acts as a random variable that is uniformly distributed on the interval $[0, 1]$.
    $$
        \text{$p$-value} \sim \text{Unif}[0, 1] \quad \text{under } H\_0
    $$

---

## 4. Confidence Sets and Duality

Hypothesis testing aims to determine if a specific, isolated parameter value $\theta\_0$ is plausible. A **Confidence Set** essentially extends this logic by finding *all* possible parameter values that are plausible given the observed data.

**Definition (Confidence Set):**
A $(1 - \alpha)$-confidence set (or interval) $CI(X)$ is a data-dependent interval constructed such that the true parameter $\theta\_0$ is contained within the set with a probability of at least $1 - \alpha$ prior to sampling.
$$
    \prob(\theta\_0 \in CI(X) \mid \theta = \theta\_0) \ge 1 - \alpha \quad \text{for every } \theta\_0
$$

### 4.1 The Duality Principle

There is a profound mathematical duality between hypothesis testing and confidence intervals. A confidence interval simply consists of all the null hypothesis values that would *not* be rejected by a level-$\alpha$ hypothesis test.

Let $A(\theta\_0)$ be the acceptance region of a level-$\alpha$ test for $H\_0: \theta = \theta\_0$.
$$
    \prob(X \in A(\theta\_0) \mid \theta = \theta\_0) \ge 1 - \alpha
$$
The corresponding confidence interval is constructed by simply pivoting this probability statement to isolate the parameter:
$$
    CI(X) = \{ \theta\_0 : X \in A(\theta\_0) \}
$$

### 4.2 Example 1: Normal Mean with Unknown Variance

Suppose $X\_1, \dots, X\_n \sim \mathcal{N}(\mu, \sigma^2)$, with both parameters fully unknown. We wish to test $H\_0: \mu = \mu\_0$ versus $H\_1: \mu \neq \mu\_0$.

Because the true variance $\sigma^2$ is unknown, we use the sample variance $S\_n^2$. Our standard test statistic leverages the Student's t-distribution:
$$
    T(X) = \frac{\overline{X}\_n - \mu\_0}{S\_n / \sqrt{n}} \sim t\_{n-1} \quad \text{under } H\_0
$$

The symmetric acceptance region for a level-$\alpha$ test is:
$$
    A(\mu\_0) = \{ X : -t\_{n-1, \alpha/2} \le \frac{\overline{X}\_n - \mu\_0}{S\_n / \sqrt{n}} \le t\_{n-1, \alpha/2} \}
$$

To find the corresponding confidence interval, we mathematically pivot the inequality inside the acceptance region to isolate $\mu\_0$ in the center:
$$
    \begin{align*}
        -t\_{n-1, \alpha/2} &\le \frac{\overline{X}\_n - \mu\_0}{S\_n / \sqrt{n}} \le t\_{n-1, \alpha/2} \\\\
        -t\_{n-1, \alpha/2} \frac{S\_n}{\sqrt{n}} &\le \overline{X}\_n - \mu\_0 \le t\_{n-1, \alpha/2} \frac{S\_n}{\sqrt{n}} \\\\
        -\overline{X}\_n - t\_{n-1, \alpha/2} \frac{S\_n}{\sqrt{n}} &\le -\mu\_0 \le -\overline{X}\_n + t\_{n-1, \alpha/2} \frac{S\_n}{\sqrt{n}} \\\\
        \overline{X}\_n - t\_{n-1, \alpha/2} \frac{S\_n}{\sqrt{n}} &\le \mu\_0 \le \overline{X}\_n + t\_{n-1, \alpha/2} \frac{S\_n}{\sqrt{n}}
    \end{align*}
$$
Thus, the exact $(1-\alpha)$ confidence interval for $\mu$ is directly derived from the hypothesis test's acceptance criteria.

### 4.3 Example 2: Normal Variance Testing

Suppose we instead wish to test the variance of our normal sample, setting $H\_0: \sigma = \sigma\_0$ versus a two-sided alternative $H\_1: \sigma \neq \sigma\_0$.

A natural test statistic is derived using the sample variance $S\_n^2$:
$$
    T(X) = \frac{(n-1)S\_n^2}{\sigma\_0^2} = \frac{\sum\_{i=1}^n (X\_i - \overline{X}\_n)^2}{\sigma\_0^2} \sim \chi\_{n-1}^2 \quad \text{under } H\_0
$$

The acceptance region for a level-$\alpha$ test involves the critical values of the Chi-Square distribution:
$$
    A(\sigma\_0) = \{ X : c\_{1 - \alpha/2} \le \frac{\sum\_{i=1}^n (X\_i - \overline{X}\_n)^2}{\sigma\_0^2} \le c\_{\alpha/2} \}
$$

By pivoting this acceptance region, we extract a confidence interval for the unknown variance $\sigma^2$:
$$
    \begin{align*}
        c\_{1 - \alpha/2} &\le \frac{(n-1)S\_n^2}{\sigma\_0^2} \le c\_{\alpha/2} \\\\
        \frac{1}{c\_{\alpha/2}} &\le \frac{\sigma\_0^2}{(n-1)S\_n^2} \le \frac{1}{c\_{1 - \alpha/2}} \\\\
        \frac{(n-1)S\_n^2}{c\_{\alpha/2}} &\le \sigma\_0^2 \le \frac{(n-1)S\_n^2}{c\_{1 - \alpha/2}}
    \end{align*}
$$
This precisely constructs the $(1-\alpha)$ confidence interval for $\sigma^2$.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 14: P-value, confidence set.
