---
title: Nonparametric Two-Sample Tests
date: 2026-04-01
---

## 1. Motivation for Nonparametric Methods

In the previous lecture, we extensively utilized the two-sample t-test. The validity of the exact t-test intrinsically relies on the core assumption of **Gaussianity** (that the underlying data is normally distributed). While the Central Limit Theorem (CLT) guarantees that the t-test asymptotically behaves like a Normal distribution $\mathcal{N}(0,1)$ for massively large samples $n$ and $m$, this provides absolutely no comfort when dealing with **finite, non-normal data**.

What rigorous tests can we deploy when the data is clearly non-normal, highly skewed, or categorical, and the sample size is small? We turn to **nonparametric tests**, which make absolutely no assumptions regarding the specific parametric family of the underlying distributions.

---

## 2. (Wilcoxon) Mann-Whitney Test

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

### 2.1 The Rank-Sum Idea

If $H\_0$ is true, then the pooled sample of all observations $(X\_1, \dots, X\_n, Y\_1, \dots, Y\_m)$ consists of $n+m$ independent and identically distributed (i.i.d.) random variables. Since the two groups are statistically indistinguishable, the specific ranks occupied by the $Y$ observations within the pooled, sorted sample should look entirely like a random subset of size $m$ drawn uniformly from the integers $\{1, 2, \dots, n+m\}$.

**Example Calculation:**
Suppose we observe $X = (1, 3)$ and $Y = (6, 2, 7)$.

1. The pooled sample is $(1, 3, 6, 2, 7)$.
2. We sort the pooled sample: $1, 2, 3, 6, 7$.
3. We assign ranks based on the sorted order:
   * Rank 1: $X$ (value 1)
   * Rank 2: $Y$ (value 2)
   * Rank 3: $X$ (value 3)
   * Rank 4: $Y$ (value 6)
   * Rank 5: $Y$ (value 7)
4. The test statistic $T\_Y$ is strictly defined as the sum of the relative ranks of the $Y$ group:

$$
    T\_Y = 2 + 4 + 5 = 11
$$

### 2.2 Distribution of $T\_Y$ under $H\_0$

Under the null hypothesis, $T\_Y$ is distributed as the sum of $m$ distinct integers chosen uniformly at random without replacement from the set $\{1, 2, \dots, n+m\}$.

We can rigorously calculate the expectation and variance of this specific random sum:

* **Expectation:** The average rank in the pool is $\frac{n+m+1}{2}$. Since we select $m$ items, the expected sum is:
    $$
        \E[T\_Y] = m \frac{n+m+1}{2}
    $$
* **Variance:** Using the variance formulas for sampling without replacement (which introduces a finite population correction factor):
    $$
        \Var{T\_Y} = \frac{nm(n+m+1)}{12}
    $$

### 2.3 The Mann-Whitney $U$ Statistic

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

## 3. Nonparametric Tests for Paired Data

Often, data is collected in pairs $(X\_i, Y\_i)$ rather than independent groups. A classic example is measuring a patient's blood pressure strictly *before* ($X\_i$) and *after* ($Y\_i$) administering a specific medical treatment.

Because $X\_i$ and $Y\_i$ correspond to the exact same subject, they are highly dependent. We transform the problem by calculating the pairwise differences:
$$
    D\_i = Y\_i - X\_i \quad \text{for } i = 1, \dots, n
$$
The null hypothesis $H\_0$ asserts that the treatment has absolutely zero effect, meaning the distribution of the differences $D\_i$ is perfectly symmetric around $0$.

### 3.1 The Sign Test

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

### 3.2 Wilcoxon Signed-Rank Test

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
2. Han, Y. (2026). Lecture 18: Nonparametric Two-sample Tests.
