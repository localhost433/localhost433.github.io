---
title: t Distributions
date: 2026-02-11
---

## 1. Transition to Statistics

We now shift from Probability (**deducing behavior from known models**) to Statistics (**inferring models from observed data**).

> Discriptive Statistics vs. Inferential Statistics

### Setup

Observe data $X_1, \dots, X_n$ assumed to be i.i.d. from some distribution (often assumed Normal $\mathcal{N}(\mu, \sigma^2)$). Our goals are:

1. **Estimation:** Guess $\mu$ and $\sigma^2$.
2. **Confidence Intervals:** Find a range that likely contains $\mu$.
3. **Hypothesis Testing:** Test claims like "$\mu = 0$".

---

## 2. Sample Mean and Variance

Let $X_1, X_2, \dots, X_n$ be independent and identically distributed (i.i.d.) random variables from a population with true mean $\E[X_i] = \mu$ and true variance $\Var{X_i} = \sigma^2$.

### 2.1 Estimators

**Definition**:
Let $X_1, X_2, \dots, X_n$ be a random sample drawn from a population distribution that depends on some unknown parameter $\theta$ (like the true mean $\mu$ or true variance $\sigma^2$). An estimator for $\theta$, usually denoted as $\hat{\theta}$, is a function $h(X_1, \dots, X_n)$ of the observable random variables.

> Prior (Before data collection):  
> The sample $X_1, \dots, X_n$ consists of RV, so the estimator $\hat{\theta}$ is a RV. (It has a probability distribution, an expectation, and a variance).
>
> Posterior (After data collection):  
> The sample becomes fixed numbers $x_1, \dots, x_n$. After substitution, the result is a single number called an **estimate**.

- **Sample Mean:**
    $$\overline{X}\_n = \frac{1}{n} \sum_{i=1}^n X_i$$
- **Sample Variance:**
    $$S_n^2 = \frac{1}{n-1} \sum_{i=1}^n (X_i - \overline{X}\_n)^2$$

### 2.2 Unbiasedness

An estimator $\hat{\theta}$ is unbiased for a true parameter $\theta$ if its expected value over all possible samples equals the true parameter, s.t. $\E[\hat{\theta}] = \theta$.

#### Pf. 1: Sample Mean (Unbiased)

$$
    \begin{align*}
        \E[\overline{X}\_n] &= \E\left[ \frac{1}{n} \sum_{i=1}^n X_i \right] \\\\
        &= \frac{1}{n} \sum_{i=1}^n \E[X_i] \\\\
        &= \frac{1}{n} \sum_{i=1}^n \mu \\\\
        &= \frac{1}{n} (n\mu) \\\\
        &= \mu
    \end{align*}
$$

#### Pf. 2: Sample Variance (Unbiased)

$$
    \begin{align*}
        \sum_{i=1}^n (X_i - \overline{X}\_n)^2 &= \sum_{i=1}^n \left( (X_i - \mu) - (\overline{X}\_n - \mu) \right)^2 \\\\
        &= \sum_{i=1}^n \left( (X_i - \mu)^2 - 2(X_i - \mu)(\overline{X}\_n - \mu) + (\overline{X}\_n - \mu)^2 \right) \\\\
        &= \sum_{i=1}^n (X_i - \mu)^2 - 2(\overline{X}\_n - \mu)\sum_{i=1}^n (X_i - \mu) + n(\overline{X}\_n - \mu)^2\\\\
        &= \sum_{i=1}^n (X_i - \mu)^2 - 2n(\overline{X}\_n - \mu)^2 + n(\overline{X}\_n - \mu)^2 \\\\
        &= \sum_{i=1}^n (X_i - \mu)^2 - n(\overline{X}\_n - \mu)^2
    \end{align*}
$$

Take the expectation of both sides. By definition, $\E[(X_i - \mu)^2] = \Var{X_i} = \sigma^2$, and the variance of $\overline{X}\_n$ is $\E[(\overline{X}\_n - \mu)^2] = \Var{\overline{X}\_n} = \frac{\sigma^2}{n}$.

$$
    \begin{align*}
        \E\left[ \sum_{i=1}^n (X_i - \overline{X}\_n)^2 \right] &= \E\left[ \sum_{i=1}^n (X_i - \mu)^2 \right] - \E\left[ n(\overline{X}\_n - \mu)^2 \right] \\\\
        &= \sum_{i=1}^n \E[(X_i - \mu)^2] - n\E[(\overline{X}\_n - \mu)^2] \\\\
        &= \sum_{i=1}^n \sigma^2 - n\left(\frac{\sigma^2}{n}\right) \\\\
        &= n\sigma^2 - \sigma^2 \\\\
        &= (n - 1)\sigma^2
    \end{align*}
$$

Multiply both sides by $\frac{1}{n-1}$ to see the expectation of estimator $S_n^2$:

$$
    \E[S_n^2] = \E\left[ \frac{1}{n-1} \sum_{i=1}^n (X_i - \overline{X}\_n)^2 \right] = \frac{1}{n-1} (n-1)\sigma^2 = \sigma^2
$$

> Dividing by $n-1$ makes $S_n^2$ an unbiased estimator of $\sigma^2$. If divided by $n$, expectation would have been $\frac{n-1}{n}\sigma^2$, which is biased (as an underestimation).

---

## 3. Sampling Distributions under Normality

If the data $X_i \sim \mathcal{N}(\mu, \sigma^2)$, we have specific distributions for our estimators. (Probability distributions of estimators as if they are RVs).

### 3.1 Chi-Square Distribution

Let $Z_1, \dots, Z_k \sim \mathcal{N}(0, 1)$ be i.i.d.. The sum of their squares $V$ follows a **Chi-Square distribution with $k$ degrees of freedom**:
$$
    V = \sum_{i=1}^k Z_i^2 \sim \chi^2_k
$$

> Degrees of freedom: Independent pieces of information.
> > Here, I think it is because there are $n$ i.i.d. RVs $\sim \mathcal{N}(0, 1)$.

For Sample Variance,

$$
    \frac{(n-1)S_n^2}{\sigma^2} \sim \chi^2_{n-1}
$$

> $S_n^2$ is a sum of squared normal variables $(X_i - \overline{X}\_n)^2$, so it follows a Chi-squared shape.
> Division by $\sigma^2$ is for standarization.
> > **Degrees of freedom ($n-1$):**  
> > If we used the known true mean $\mu$, terms $\frac{X_i - \mu}{\sigma}$ would be exactly $n$ independent standard normal variables, yielding $\chi^2_n$.  
> > However, because center is estimated $\overline{X}\_n$, the constraint $\sum (X_i - \overline{X}\_n) = 0$ makes the final residual predictable. One "independent piece of information" is lost, resulting in $n-1$ degrees of freedom.

Furthermore, $\overline{X}\_n$ and $S_n^2$ are independent.

> This is **unique to normal distribution**. The normal distribution's shape (determined by $\sigma^2$) is independent of its location ($\mu$ determines the center). And the sample mean $\overline{X}\_n$ is uncorrelated with every residual, $(X_i - \overline{X}\_n)$, since each of these are determined by $X_i$.

### 3.2 Student's t-Distribution

When evaluating how far our sample mean is from the true mean, we look at the standardized statistic:
$$Z = \frac{\overline{X}\_n - \mu}{\sigma/\sqrt{n}} \sim \mathcal{N}(0, 1)$$
However, $\sigma$ is usually unknown. We must replace it with $S_n$, which introduces extra variability.

**Definition (t-distribution):**
If $Z \sim \mathcal{N}(0, 1)$ and $V \sim \chi^2_k$ are independent, then the ratio:

$$
    T = \frac{Z}{\sqrt{V/k}} \sim t_k
$$

Using known distributions:

- Let our standard normal be $Z = \frac{\overline{X}\_n - \mu}{\sigma/\sqrt{n}}$.
- Let our Chi-Square variable be $V = \frac{(n-1)S_n^2}{\sigma^2}$ with $k = n-1$ degrees of freedom.

Substitute:
$$
    \begin{align*}
        T &= \frac{\frac{\overline{X}\_n - \mu}{\sigma/\sqrt{n}}}{\sqrt{\frac{\frac{(n-1)S_n^2}{\sigma^2}}{n-1}}} \\\\
        &= \frac{\frac{\overline{X}\_n - \mu}{\sigma/\sqrt{n}}}{\sqrt{\frac{S_n^2}{\sigma^2}}} \\\\
        &= \frac{\overline{X}\_n - \mu}{\sigma/\sqrt{n}} \cdot \frac{\sigma}{S_n} \\\\
        &= \frac{\overline{X}\_n - \mu}{S_n/\sqrt{n}}
    \end{align*}
$$

Thus, replacing $\sigma$ with $S_n$ transforms standard normal $Z$ into a Student's t-distribution with $n-1$ degrees of freedom:
$$
    T = \frac{\overline{X}\_n - \mu}{S_n / \sqrt{n}} \sim t_{n-1}
$$

---

## 4. Statistical Inference

### 4.1 Confidence Intervals

Since $T \sim t_{n-1}$ represents uncertainty when $\sigma$ is unknown, we can find a **critical value** $t_{\alpha/2}$ such that the probability of falling within that range is $1 - \alpha$:

> If want the confidence level $1 - \alpha$, choose $\alpha$ first, as the error budget.  
> $\alpha/2$ since the error can go two ways.

$$
    \begin{align*}
        1-\alpha
        &= \mathbb{P}(|T| \le t_{\alpha/2})\\\\
        &= \mathbb{P}\left(-t_{\alpha/2} \le \frac{\overline{X}\_n - \mu}{S_n/\sqrt{n}} \le t_{\alpha/2}\right)\\\\
        &= \mathbb{P}\left(-t_{\alpha/2} \frac{S_n}{\sqrt{n}} \le \overline{X}\_n - \mu \le t_{\alpha/2} \frac{S_n}{\sqrt{n}}\right)\\\\
        &= \mathbb{P}\left(-\overline{X}\_n - t_{\alpha/2} \frac{S_n}{\sqrt{n}} \le -\mu \le -\overline{X}\_n + t_{\alpha/2} \frac{S_n}{\sqrt{n}}\right)\\\\
        &= \mathbb{P}\left(\overline{X}\_n + t_{\alpha/2} \frac{S_n}{\sqrt{n}} \ge \mu \ge \overline{X}\_n - t_{\alpha/2} \frac{S_n}{\sqrt{n}}\right)\\\\
        &= \mathbb{P}\left(\overline{X}\_n - t_{\alpha/2} \frac{S_n}{\sqrt{n}} \le \mu \le \overline{X}\_n + t_{\alpha/2} \frac{S_n}{\sqrt{n}}\right)\\\\
    \end{align*}
$$

This yields the interval for the true mean $\mu$:
$$
    \left[ \overline{X}\_n - t_{\alpha/2} \frac{S_n}{\sqrt{n}},
    \quad \overline{X}\_n + t_{\alpha/2} \frac{S_n}{\sqrt{n}} \right]
$$

### 4.2 Asymptotics

As $n \to \infty$, the sample variance $S_n^2$ gets so accurate at estimating $\sigma^2$ that the extra uncertainty vanishes.

Consequently, the t-distribution $t_n$ converges precisely to the Standard Normal $\mathcal{N}(0, 1)$. For large sample sizes (often considered $n \ge 30$), the Z-distribution is frequently used as an approximation.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 7: t distributions.
