---
title: Two-Sample t-test
date: 2026-03-30
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
    * $X\_1, \dots, X\_n$: The outcomes or scores from home games.
    * $Y\_1, \dots, Y\_m$: The outcomes or scores from away games.
    * We test if the distribution of home scores is statistically different from the away scores.

2. **Treatment Effect in Medicine:** Does a new drug significantly improve patient outcomes compared to a placebo?
    * $X\_1, \dots, X\_n$: The clinical outcomes from the control (placebo) group.
    * $Y\_1, \dots, Y\_m$: The clinical outcomes from the treatment group.
    * We test if the treatment distribution represents a distinct improvement.

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

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 17: two-sample t-test.
