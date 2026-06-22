---
title: "17/18 - Two-Sample Tests"
date: 2026-03-30/04-01
---

## Roadmap

This note addresses the question of comparing two populations. We begin with the parametric two-sample t-test (and its power analysis and Welch's variant for unequal variances), then move to nonparametric alternatives — the Mann-Whitney U test for independent samples, and the Sign test and Wilcoxon Signed-Rank test for paired data — which make no distributional assumptions.

---

## 1. Introduction to Two-Sample Testing

In many practical statistical scenarios, we are not just interested in the properties of a single population, but rather in comparing two distinct populations. We formalize this by establishing a mathematical model where we observe two independent sets of data.

Let our data be modeled as follows:
$$
    X\_1, \dots, X\_n \sim P
$$
$$
    Y\_1, \dots, Y\_m \sim Q
$$
where $P$ and $Q$ are the underlying probability distributions, and the two samples are mutually independent.

The most common statistical question is to determine whether these two populations are identical. This forms our fundamental null hypothesis:
$$
    H\_0: P = Q
$$

### 1.1 Motivating Examples

1. **Home Field Advantage in Sports:** Does a sports team truly perform better when playing at their home stadium?
    - $X\_1, \dots, X\_n$: The outcomes or scores from home games.
    - $Y\_1, \dots, Y\_m$: The outcomes or scores from away games.
    - We test if the distribution of home scores is statistically different from the away scores.

2. **Treatment Effect in Medicine:** Does a new drug significantly improve patient outcomes compared to a placebo?
    - $X\_1, \dots, X\_n$: The clinical outcomes from the control (placebo) group.
    - $Y\_1, \dots, Y\_m$: The clinical outcomes from the treatment group.
    - We test if the treatment distribution represents a distinct improvement.

---

## 2. Parametric Test: Equality of Gaussian Means

To build a rigorous test, we often start by assuming the data follow a parametric distribution. A standard assumption is that both populations are normally distributed with the exact same unknown variance, but potentially different means.

$$
    X\_1, \dots, X\_n \sim \mathcal{N}(\mu\_X, \sigma^2)
$$
$$
    Y\_1, \dots, Y\_m \sim \mathcal{N}(\mu\_Y, \sigma^2)
$$
Here, $\mu\_X$, $\mu\_Y$, and $\sigma^2$ are all unknown parameters.

We explicitly test the equality of the means:
$$
    H\_0: \mu\_X = \mu\_Y \quad \text{vs.} \quad H\_1: \mu\_X \neq \mu\_Y
$$

### 2.1 The Test Statistic and the Generalized LR Test

Recall from previous lectures that the Generalized Likelihood Ratio (LR) test dictates we calculate the ratio of the maximized likelihoods under $H\_0$ and the full parameter space. By Wilks' Theorem, $-2 \log LR \sim \chi^2\_1$ asymptotically.

For finite samples in the Gaussian model, evaluating the LR test algebraically leads directly to the standard **Two-Sample t-test statistic**:
$$
    T = \frac{\overline{X}\_n - \overline{Y}\_m}{S\_p \sqrt{\frac{1}{n} + \frac{1}{m}}}
$$
where $\overline{X}\_n$ and $\overline{Y}\_m$ are the sample means, and $S\_p^2$ is the **pooled sample variance**, defined as:
$$
    S\_p^2 = \frac{\sum\_{i=1}^n (X\_i - \overline{X}\_n)^2 + \sum\_{j=1}^m (Y\_j - \overline{Y}\_m)^2}{n + m - 2}
$$

Under the null hypothesis $H\_0$, the statistic $T$ exactly follows a Student's t-distribution with $n + m - 2$ degrees of freedom:
$$
    T \sim t\_{n+m-2} \quad \text{under } H\_0
$$
We reject $H\_0$ at significance level $\alpha$ if $|T| > t\_{n+m-2, \alpha/2}$.

---

## 3. Power Analysis of the t-test

A critical aspect of experimental design is ensuring the test has sufficient **power** to detect a true difference if one exists.

Let us simplify the problem to calculate the power. Assume the variance $\sigma^2$ is fully known, and the sample sizes are strictly equal ($n = m$). We define the true difference in means as $\Delta$:
$$
    H\_0: \mu\_X = \mu\_Y \quad \text{vs.} \quad H\_1: \mu\_X - \mu\_Y = \Delta
$$

Under these simplified assumptions, the test statistic is normally distributed:
$$
    T = \frac{\overline{X}\_n - \overline{Y}\_n}{\sigma \sqrt{\frac{2}{n}}}
$$
Under $H\_0$, $T \sim \mathcal{N}(0, 1)$. We reject $H\_0$ if $|T| > z\_{\alpha/2}$.

Under the alternative hypothesis $H\_1$, the true expected difference is $\E[\overline{X}\_n - \overline{Y}\_n] = \Delta$. The variance of this difference is $\Var{\overline{X}\_n - \overline{Y}\_n} = \frac{\sigma^2}{n} + \frac{\sigma^2}{n} = \frac{2\sigma^2}{n}$.
Thus, standardizing this variable gives:
$$
    \frac{\overline{X}\_n - \overline{Y}\_n - \Delta}{\sigma \sqrt{\frac{2}{n}}} \sim \mathcal{N}(0, 1)
$$
Algebraically manipulating this to express the distribution of our test statistic $T$ under $H\_1$:
$$
    T = \frac{\overline{X}\_n - \overline{Y}\_n}{\sigma \sqrt{\frac{2}{n}}} \sim \mathcal{N}\left( \sqrt{\frac{n}{2}} \frac{\Delta}{\sigma}, 1 \right)
$$

### 3.1 Calculating the Power

The power of the test is the probability of strictly rejecting $H\_0$ when $H\_1$ is true:
$$
    \begin{align*}
        \text{Power} &= \prob(|T| > z\_{\alpha/2} \mid H\_1) \\\\
        &= \prob\left( \left| \mathcal{N}\left( \sqrt{\frac{n}{2}} \frac{\Delta}{\sigma}, 1 \right) \right| > z\_{\alpha/2} \right) \\\\
        &= \prob\left( \mathcal{N}(0, 1) + \sqrt{\frac{n}{2}} \frac{\Delta}{\sigma} > z\_{\alpha/2} \right) + \prob\left( \mathcal{N}(0, 1) + \sqrt{\frac{n}{2}} \frac{\Delta}{\sigma} < -z\_{\alpha/2} \right) \\\\
        &= \prob\left( \mathcal{N}(0, 1) > z\_{\alpha/2} - \sqrt{\frac{n}{2}} \frac{\Delta}{\sigma} \right) + \prob\left( \mathcal{N}(0, 1) < -z\_{\alpha/2} - \sqrt{\frac{n}{2}} \frac{\Delta}{\sigma} \right) \\\\
        &= 1 - \Phi\left( z\_{\alpha/2} - \sqrt{\frac{n}{2}} \frac{\Delta}{\sigma} \right) + \Phi\left( -z\_{\alpha/2} - \sqrt{\frac{n}{2}} \frac{\Delta}{\sigma} \right)
    \end{align*}
$$
If we assume $\Delta$ is positive and reasonably large, the second term vanishes, yielding the approximation:
$$
    \text{Power} \approx 1 - \Phi\left( z\_{\alpha/2} - \sqrt{\frac{n}{2}} \frac{\Delta}{\sigma} \right)
$$
This fundamental equation allows statisticians to solve for the required sample size $n$ needed to achieve a target power (e.g., $80\%$ or $90\%$) for a specified minimal detectable effect size $\Delta / \sigma$.

---

## 4. Welch's t-test for Unequal Variances

What if the assumption of equal variances is violated? If $X\_i$ and $Y\_j$ have significantly different variances ($\sigma\_X^2 \neq \sigma\_Y^2$), the pooled variance $S\_p^2$ is an invalid estimator.

Instead, we use **Welch's t-test**, which relies on the unpooled test statistic:
$$
    T = \frac{\overline{X}\_n - \overline{Y}\_m}{\sqrt{\frac{S\_X^2}{n} + \frac{S\_Y^2}{m}}}
$$
Under $H\_0$, this statistic does not perfectly follow a standard t-distribution. However, it can be highly accurately approximated by a t-distribution $t\_{\nu}$, where the adjusted degrees of freedom $\nu$ is calculated via the Welch-Satterthwaite equation:
$$
    \nu \approx \frac{\left(\frac{S\_X^2}{n} + \frac{S\_Y^2}{m}\right)^2}{\frac{(S\_X^2/n)^2}{n-1} + \frac{(S\_Y^2/m)^2}{m-1}}
$$
This robust modification ensures the Type I error rate remains strictly controlled at $\alpha$ even when the homoscedasticity assumption entirely collapses.

---

## 5. Motivation for Nonparametric Methods

The validity of the exact t-test intrinsically relies on the core assumption of **Gaussianity** (that the underlying data is normally distributed). While the Central Limit Theorem (CLT) guarantees that the t-test asymptotically behaves like a Normal distribution $\mathcal{N}(0,1)$ for massively large samples $n$ and $m$, this provides absolutely no comfort when dealing with **finite, non-normal data**.

What rigorous tests can we deploy when the data is clearly non-normal, highly skewed, or categorical, and the sample size is small? We turn to **nonparametric tests**, which make absolutely no assumptions regarding the specific parametric family of the underlying distributions.

---

## 6. (Wilcoxon) Mann-Whitney Test

The Mann-Whitney U test (also famously known as the Wilcoxon Rank-Sum test) is a powerful nonparametric alternative to the independent two-sample t-test.

Suppose we observe independent samples:
$$
    X\_1, \dots, X\_n \sim P
$$
$$
    Y\_1, \dots, Y\_m \sim Q
$$
We wish to test the null hypothesis that the two distributions are completely identical:
$$
    H\_0: P = Q
$$

### 6.1 The Rank-Sum Idea

If $H\_0$ is true, then the pooled sample of all observations $(X\_1, \dots, X\_n, Y\_1, \dots, Y\_m)$ consists of $n+m$ independent and identically distributed (i.i.d.) random variables. Since the two groups are statistically indistinguishable, the specific ranks occupied by the $Y$ observations within the pooled, sorted sample should look entirely like a random subset of size $m$ drawn uniformly from the integers $\{1, 2, \dots, n+m\}$.

**Example Calculation:**
Suppose we observe $X = (1, 3)$ and $Y = (6, 2, 7)$.

1. The pooled sample is $(1, 3, 6, 2, 7)$.
2. We sort the pooled sample: $1, 2, 3, 6, 7$.
3. We assign ranks based on the sorted order:
   - Rank 1: $X$ (value 1)
   - Rank 2: $Y$ (value 2)
   - Rank 3: $X$ (value 3)
   - Rank 4: $Y$ (value 6)
   - Rank 5: $Y$ (value 7)
4. The test statistic $T\_Y$ is strictly defined as the sum of the relative ranks of the $Y$ group:

$$
    T\_Y = 2 + 4 + 5 = 11
$$

### 6.2 Distribution of $T\_Y$ under $H\_0$

Under the null hypothesis, $T\_Y$ is distributed as the sum of $m$ distinct integers chosen uniformly at random without replacement from the set $\{1, 2, \dots, n+m\}$.

We can rigorously calculate the expectation and variance of this specific random sum:

- **Expectation:** The average rank in the pool is $\frac{n+m+1}{2}$. Since we select $m$ items, the expected sum is:
    $$
        \E[T\_Y] = m \frac{n+m+1}{2}
    $$
- **Variance:** Using the variance formulas for sampling without replacement (which introduces a finite population correction factor):
    $$
        \Var{T\_Y} = \frac{nm(n+m+1)}{12}
    $$

### 6.3 The Mann-Whitney $U$ Statistic

An equivalent way to formulate this test is via the Mann-Whitney $U$ statistic, which simply counts the total number of pairwise victories where a $Y$ observation strictly exceeds an $X$ observation:
$$
    U = \sum\_{i=1}^n \sum\_{j=1}^m 1\{Y\_j > X\_i\}
$$
The mathematical relationship between $U$ and the rank-sum statistic $T\_Y$ is purely algebraic:
$$
    U = T\_Y - \frac{m(m+1)}{2}
$$
Under $H\_0$, the expected value is $\E[U] = \frac{nm}{2}$. For large samples, $U$ (and correspondingly $T\_Y$) converges to a normal distribution, allowing for standard Z-tests based on these moments.

---

## 7. Nonparametric Tests for Paired Data

Often, data is collected in pairs $(X\_i, Y\_i)$ rather than independent groups. A classic example is measuring a patient's blood pressure strictly *before* ($X\_i$) and *after* ($Y\_i$) administering a specific medical treatment.

Because $X\_i$ and $Y\_i$ correspond to the exact same subject, they are highly dependent. We transform the problem by calculating the pairwise differences:
$$
    D\_i = Y\_i - X\_i \quad \text{for } i = 1, \dots, n
$$
The null hypothesis $H\_0$ asserts that the treatment has absolutely zero effect, meaning the distribution of the differences $D\_i$ is perfectly symmetric around $0$.

### 7.1 The Sign Test

The simplest approach is the **Sign Test**, which entirely ignores the actual magnitude of the differences and exclusively looks at their mathematical sign.

We define the test statistic $S$ as the sum of the signs:
$$
    S = \sum\_{i=1}^n \text{sign}(D\_i)
$$
where $\text{sign}(D\_i)$ equals $+1$ if $D\_i > 0$ and $-1$ if $D\_i < 0$. Under $H\_0$, each difference is equally likely to be positive or negative. Thus, the number of strictly positive differences is distributed as $\text{Binomial}(n, 1/2)$.
Algebraically, $S$ can be expressed as:
$$
    S = 2 \cdot \text{Bin}(n, 1/2) - n
$$
For massive $n$, $S \approx \mathcal{N}(0, n)$. While robust, the Sign Test severely lacks statistical power because it aggressively discards all magnitude information.

### 7.2 Wilcoxon Signed-Rank Test

To drastically improve power, we employ the **Wilcoxon Signed-Rank Test**, which ingeniously utilizes both the sign and the relative magnitude (rank) of the differences.

**Procedure:**

1. Calculate the absolute magnitudes $|D\_i|$ and strictly rank them from $1$ (smallest) to $n$ (largest).
2. Separate the positive differences from the negative differences.
3. Calculate $W\_+$, which is the sum of the ranks corresponding strictly to the positive differences:

$$
    W\_+ = \sum\_{D\_i > 0} \text{rank}(|D\_i|)
$$

**Distribution under $H\_0$:**
Under the symmetric null hypothesis, the magnitude $|D\_i|$ and the sign of $D\_i$ are entirely independent. For the specific difference that occupies rank $k$, define an indicator variable $I\_k$ such that $I\_k = 1$ if the original difference was positive, and $0$ otherwise.
Under $H\_0$, $I\_1, \dots, I\_n \sim \text{Bern}(1/2)$ independently. The test statistic is:
$$
    W\_+ = \sum\_{k=1}^n k I\_k
$$
We can trivially compute the exact expectation:
$$
    \E[W\_+] = \sum\_{k=1}^n k \E[I\_k] = \sum\_{k=1}^n k \left(\frac{1}{2}\right) = \frac{n(n+1)}{4}
$$
For $n \le 25$, statisticians use exact pre-computed lookup tables to find critical values. For strictly larger $n$, the sum of these independent (though not identical) variables converges securely to a Normal distribution via the Lindeberg-Feller Central Limit Theorem.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 17: two-sample t-test.
3. Han, Y. (2026). Lecture 18: Nonparametric Two-sample Tests.
