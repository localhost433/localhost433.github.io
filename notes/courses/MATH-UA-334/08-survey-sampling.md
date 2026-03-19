---
title: Survey Sampling
date: 2026-02-16
---

## 1. Introduction to Survey Sampling

In many real-world scenarios, we want to understand the properties of a large but finite population without observing every single individual. For example:

* What is the average age of undergraduate students at a university?
* What proportion of the population approves of a certain policy?
* How many typographical errors exist in a printed textbook?

In these cases, the population is **not** random; it is a fixed, deterministic set of values. However, because it is impractical to measure the entire population, we use randomness in our data collection process—called **sampling**—to estimate the population's properties.

### 1.1 Population Parameters

Let the population consist of $N$ numeric values, which we denote as $\{x_1, x_2, \dots, x_N\}$. We are typically interested in summarizing this population using standard parameters.

**Population Mean:**
The true average of the population is given by:
$$
    \mu = \frac{1}{N} \sum_{i=1}^N x_i
$$

**Population Variance:**
The true variance of the population is given by:
$$
    \sigma^2 = \frac{1}{N} \sum_{i=1}^N (x_i - \mu)^2
$$

### 1.2 The Sampling Strategy

To estimate $\mu$ and $\sigma^2$, we draw a sample of size $n$ (where typically $n \ll N$). We represent our sampled items as random variables $X_1, X_2, \dots, X_n$. Because the selection process is random, these $X_i$'s are random variables.

We construct **estimators** from our sample to guess the population parameters:

* **Sample Mean:** $\overline{X}\_n = \frac{1}{n} \sum_{i=1}^n X_i$
* **Sample Variance:** $S_n^2 = \frac{1}{n-1} \sum_{i=1}^n (X_i - \overline{X}\_n)^2$

By the Law of Large Numbers (LLN), as $n$ grows, our estimators will converge to the true parameters, such that $\overline{X}\_n \approx \mu$ and $S_n^2 \approx \sigma^2$. However, the exact statistical properties of these estimators depend heavily on *how* we draw our sample.

> [Recall formal definition of **estimator** from Note 07.](http://robinc.vercel.app/note.html?course=MATH-UA-334&note=07-t-distributions#21-estimators)

---

## 2. Sampling With Replacement

In **sampling with replacement**, after an individual is selected from the population and its value is recorded, it is placed back into the population pool. Thus, it is possible for the exact same individual to be sampled more than once.

### 2.1 Mathematical Model

Under this scheme, each draw is completely independent of the others. We can model $X_1, \dots, X_n$ as independent and identically distributed (i.i.d.) random variables. Each $X_i$ is drawn uniformly from the population $\{x_1, \dots, x_N\}$.

$$
    \mathbb{P}(X_i = x_j) = \frac{1}{N} \quad \text{for any } j \in \{1, \dots, N\}
$$

### 2.2 Expectation and Variance of the Sample Mean

Let's analyze the expected value of a single observation $X_i$:
$$
    \begin{align*}
        \E[X_i] &= \sum_{j=1}^N x_j \cdot \mathbb{P}(X_i = x_j) \\\\
        &= \sum_{j=1}^N x_j \left(\frac{1}{N}\right) \\\\
        &= \mu
    \end{align*}
$$
Similarly, the variance of a single observation is:
$$
    \begin{align*}
        \Var{X_i} &= \E[(X_i - \mu)^2] \\\\
        &= \sum_{j=1}^N (x_j - \mu)^2 \left(\frac{1}{N}\right) \\\\
        &= \sigma^2
    \end{align*}
$$

Because the samples are independent, the expected value and variance of the sample mean $\overline{X}\_n$ are straightforward:
$$
    \E[\overline{X}\_n] = \E\left[ \frac{1}{n} \sum_{i=1}^n X_i \right] = \frac{1}{n} \sum_{i=1}^n \E[X_i] = \frac{1}{n} (n\mu) = \mu
$$
$$
    \Var{\overline{X}\_n} = \Var{\frac{1}{n} \sum_{i=1}^n X_i} = \frac{1}{n^2} \sum_{i=1}^n \Var{X_i} = \frac{1}{n^2} (n\sigma^2) = \frac{\sigma^2}{n}
$$

This shows that $\overline{X}\_n$ is an unbiased estimator for $\mu$, and its variance shrinks linearly with the sample size $n$.

---

## 3. Sampling Without Replacement

In practice, surveying the exact same person twice yields no new information. Thus, most surveys use **sampling without replacement**. Once an individual is drawn, they are removed from the pool.

### 3.1 Mathematical Model

Under this scheme, $X_1, \dots, X_n$ are identically distributed (each has a $1/N$ chance of being any specific individual), but they are **no longer independent**. If you select the largest value in the population for $X_1$, you cannot select it again for $X_2$.

Because the marginal distributions are identical to the with-replacement case:

* $\E[X_i] = \mu$
* $\Var{X_i} = \sigma^2$

The expectation of the sample mean is still unbiased:
$$
    \E[\overline{X}\_n] = \mu
$$

### 3.2 Variance of the Sample Mean and the Finite Population Correction

Calculating the variance requires accounting for the covariance between different draws $X_i$ and $X_k$ (where $i \neq k$).
$$
    \begin{align*}
        \Var{\overline{X}\_n} &= \Var{\frac{1}{n} \sum_{i=1}^n X_i} \\\\
        &= \frac{1}{n^2} \left( \sum_{i=1}^n \Var{X_i} + \sum_{i \neq k} \text{Cov}(X_i, X_k) \right) \\\\
        &= \frac{1}{n^2} \left( n\sigma^2 + n(n-1) \text{Cov}(X_1, X_2) \right)
    \end{align*}
$$

To find $\text{Cov}(X_1, X_2)$, we consider the extreme case where we sample the *entire* population without replacement ($n = N$). If we do this, the sample mean is simply the population mean, so its variance must be zero:
$$
    \Var{\overline{X}\_N} = 0 = \frac{1}{N^2} \left( N\sigma^2 + N(N-1)\text{Cov}(X_1, X_2) \right)
$$
Solving this for the covariance yields:
$$
    \text{Cov}(X_1, X_2) = -\frac{\sigma^2}{N-1}
$$
The negative covariance makes intuitive sense; drawing a large value makes drawing another large value slightly less likely. Plugging this back into our variance equation for an arbitrary $n$:
$$
    \begin{align*}
        \Var{\overline{X}\_n} &= \frac{1}{n^2} \left( n\sigma^2 - n(n-1)\frac{\sigma^2}{N-1} \right) \\\\
        &= \frac{\sigma^2}{n} \left( 1 - \frac{n-1}{N-1} \right)
    \end{align*}
$$

The term $\left( 1 - \frac{n-1}{N-1} \right)$ is known as the **Finite Population Correction (FPC)**.

* It shows that sampling without replacement always leads to a strictly lower variance than sampling with replacement.
* If $n \ll N$, the FPC is approximately 1, and the variance is practically identical to the with-replacement case.
* If $n = N$, the FPC becomes 0, indicating absolute certainty about the population mean.

---

## 4. Confidence Intervals for the Mean

Because the random variables $X_1, \dots, X_n$ are dependent in the without-replacement setting, we cannot directly apply the standard Central Limit Theorem. However, a modified version of the CLT holds when $1 \ll n \ll N$.

Under these conditions, the standardized sample mean converges in distribution to a standard Normal:
$$
    \frac{\overline{X}\_n - \mu}{\sqrt{\Var{\overline{X}\_n}}} \xrightarrow{d} \sim \mathcal{N}(0, 1)
$$

To construct a confidence interval, we estimate $\sigma^2$ using $S_n^2$. The $(1-\alpha)$ confidence interval for $\mu$ is:
$$
    \mu \in \left[ \overline{X}\_n - z_{\alpha/2} \sqrt{\frac{S_n^2}{n} \left(1 - \frac{n-1}{N-1}\right)}, \quad \overline{X}\_n + z_{\alpha/2} \sqrt{\frac{S_n^2}{n} \left(1 - \frac{n-1}{N-1}\right)} \right]
$$
For a 95% confidence interval, $z_{\alpha/2} \approx 1.96$.

> [The derivation is similar to what is being done in Note 07.](http://robinc.vercel.app/note.html?course=MATH-UA-334&note=07-t-distributions#41-confidence-intervals) So it is not shown here.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 8: Survey Sampling.
