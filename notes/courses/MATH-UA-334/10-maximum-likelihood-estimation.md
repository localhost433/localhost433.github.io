---
title: Maximum Likelihood Estimation
date: 2026-02-23
---

## 1. Introduction to Maximum Likelihood

While the Method of Moments (MoM) provides a straightforward, algebraic way to estimate parameters, it can sometimes feel ad-hoc and is not always guaranteed to provide the estimator with the lowest variance. **Maximum Likelihood Estimation (MLE)** offers a more principled, robust framework that enjoys excellent theoretical properties in large samples.

> Recall that:
>
> - Assume that the data are generated from a specific family of probability distributions, indexed by $\theta$.  
> - The goal is to use the observed sample data to estimate the true, unknown parameter $\theta$.

### 1.1 Intuition Behind the Method

Suppose we observe a data point $X$. The underlying probability density function (PDF) is $f(x)$, but we aren't sure if the true density is $f\_1(x)$ or $f\_2(x)$.

> $f\_1(x)$ and $f\_2(x)$ belongs to the same family of distributions but have different parameters.

If we plug our observed $X$ into both functions and find that $f\_2(X) \gg f\_1(X)$, common sense suggests that $f\_2$ is a much more plausible model for our data. MLE generalizes this logic: we should choose the parameter vector $\theta$ that maximizes the probability (or probability density) of the data we actually observed. We consider the observed data as fixed, and we vary the parameter to see which parameter value makes the data appear most "likely."

---

## 2. The Likelihood Function

The formal mathematical object that allows us to find the **Maximum Likelihood Estimator** is the Likelihood Function.

**Definition (Likelihood):**
Let $X\_1, \dots, X\_n$ be RVs with a joint PDF/PMF given by $f\_\theta(x\_1, \dots, x\_n)$. When the data is observed, we treat the data as fixed constants and view this joint density strictly as a function of the parameter $\theta$. This is called the **likelihood function**:
$$
    L\_n(\theta) = f\_\theta(x\_1, \dots, x\_n)
$$

If the data $X_1, \dots, X_n$ are i.i.d., the joint density is the product of the marginal densities:
$$
    L\_n(\theta) = \prod\_{i=1}^n f\_\theta(x\_i)
$$

> - If not independent,
>   $$
>   L(\theta) = f_\theta(x_1) \cdot f_\theta(x_2 \mid x_1) \cdot f_\theta(x_3 \mid x_1, x_2) \cdot \dots
>   $$
>
> - If not identically distributed, the density function changes for each $i$.

**Definition (Log-Likelihood):**

We work with the natural logarithm of the likelihood. This is called the **log-likelihood function**:

> Because products are cumbersome to differentiate, we want it in form of a sum.  
> Also, multiplying many probabilities can lead to values so small that they cause numerical underflow in computers.

$$
    \ell\_n(\theta) = \ln L\_n(\theta) = \ln \left( \prod\_{i=1}^n f\_\theta(x\_i) \right) = \sum\_{i=1}^n \ln f\_\theta(x\_i)
$$

> Since the natural logarithm is a strictly increasing function, any value of $\theta$ that maximizes the log-likelihood function $\ell\_n$ will also maximize the original likelihood function $L\_n$.

---

## 3. Maximum Likelihood Estimator

The **Maximum Likelihood Estimator (MLE)**, denoted $\hat{\theta}\_\text{MLE}$, is the value of $\theta$ that maximizes the likelihood function (and consequently, the log-likelihood function).
$$
    \hat{\theta}\_\text{MLE} = \arg\max\_\theta L\_n(\theta) = \arg\max\_\theta \ell\_n(\theta)
$$

> Note that $\arg\max$ outputs a input, which the output of the function with that input is $\max$. Here the domain of $\theta$ is the parameter space $\Theta$.

In practice, we typically find the MLE by taking the derivative of the log-likelihood with respect to $\theta$, setting it to zero, and solving for $\theta$. We must also verify that the second derivative is negative to ensure that the critical point is indeed a maximum.

---

## 4. Examples of Maximum Likelihood Estimation

### 4.1 Bernoulli Distribution

Suppose a coin is tossed $n$ times, yielding outcomes $X\_1, \dots, X\_n \sim \text{Bern}(p)$, where $p$ is the unknown probability of success.

The PMF for a single trial is:
$$
    f\_p(x) = p^x (1-p)^{1-x}
$$

**Step 1: Form the log-likelihood.**
$$
    \begin{align*}
        L\_n(p) &= \prod\_{i=1}^n p^{x\_i} (1-p)^{1-x\_i} \\\\
        \ell\_n(p) &= \sum\_{i=1}^n \left( x\_i \ln p + (1-x\_i) \ln(1-p) \right) \\\\
        &= (\ln p) \sum\_{i=1}^n x\_i + \ln(1-p) \sum\_{i=1}^n (1-x\_i)
    \end{align*}
$$

**Step 2: Differentiate and set to zero.**
Let $S = \sum\_{i=1}^n x\_i$ be the total number of successes.
$$
\frac{d}{dp} \ell\_n(p) = \frac{S}{p} - \frac{n-S}{1-p}
$$

Then,
$$
    \begin{align*}
        \frac{S}{p} - \frac{n-S}{1-p} &= 0 \\\\
        \frac{S}{p} &= \frac{n-S}{1-p} \\\\
        S(1-p) &= p(n-S) \\\\
        S - Sp &= np - Sp \\\\
        S &= np
    \end{align*}
$$
implying that $\hat{p}\_\text{MLE} = \frac{S}{n} = \overline{X}\_n$, the sample proportion.

### 4.2 Normal Distribution

Suppose $X\_1, \dots, X\_n \sim \mathcal{N}(\mu, \sigma^2)$. The parameter vector is $\theta = (\mu, \sigma^2)$.

**Step 1: Form the log-likelihood.**
The PDF is $f\_{\mu, \sigma^2}(x) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left( -\frac{(x-\mu)^2}{2\sigma^2} \right)$.
$$
    \begin{align*}
        \ell\_n(\mu, \sigma^2) &= \sum\_{i=1}^n \left( -\frac{1}{2}\ln(2\pi) - \frac{1}{2}\ln(\sigma^2) - \frac{(x\_i-\mu)^2}{2\sigma^2} \right) \\\\
        &= -\frac{n}{2}\ln(2\pi) - \frac{n}{2}\ln(\sigma^2) - \frac{1}{2\sigma^2} \sum\_{i=1}^n (x\_i-\mu)^2
    \end{align*}
$$

**Step 2: Differentiate with respect to $\mu$ and solve.**
$$
    \begin{align*}
        \frac{\partial \ell\_n}{\partial \mu} = \frac{1}{\sigma^2} \sum\_{i=1}^n (x\_i - \mu) &= 0 \\\\
        \sum\_{i=1}^n x\_i - n\mu &= 0
    \end{align*}
$$
which implies $\hat{\mu}\_\text{MLE} = \overline{X}\_n$.

**Step 3: Differentiate with respect to $\sigma^2$ and solve.**
Treat $\sigma^2$ as a single variable $v$.
$$
    \begin{align*}
        \frac{\partial \ell\_n}{\partial v} = -\frac{n}{2v} + \frac{1}{2v^2} \sum\_{i=1}^n (x\_i - \hat{\mu})^2 &= 0 \\\\
        \frac{n}{2v} &= \frac{1}{2v^2} \sum\_{i=1}^n (x\_i - \overline{X}\_n)^2 \\\\
        v &= \frac{1}{n} \sum\_{i=1}^n (x\_i - \overline{X}\_n)^2
    \end{align*}
$$
that $\hat{\sigma}^2\_\text{MLE} = \frac{1}{n} \sum\_{i=1}^n (X\_i - \overline{X}\_n)^2$.

Notice that the MLE for variance divides by $n$, not $n-1$. While this estimator is biased, it is asymptotically consistent and minimizes the mean squared error in specific scenarios.

---

## 5. MLE with Right Censoring

MLE is incredibly flexible and can handle complex data structures, such as missing or censored data, much better than the Method of Moments.

> Data is censored when you only have partial information about the value of an observation. The value crosses a certain threshold, but you don't know the exact number.

### 5.1 Example: Censored Geometric Distribution

Let $X \sim \text{Geo}(p)$, representing the number of coin flips needed to get the first heads. The PMF is $p(x) = p(1-p)^{x-1}$ for $x \ge 1$.

Suppose we run $n$ experiments, but we only have the patience to wait up to $T$ flips. If heads hasn't appeared by flip $T$, we stop and simply record the observation as "greater than $T$". Let the observed data be $Y\_1, \dots, Y\_n$.

- If $X\_i \le T$, then $Y\_i = X\_i$. (Uncensored)
- If $X\_i > T$, then $Y\_i = \text{"}T+\text{"}$. (Censored)

To construct the likelihood, we use the specific probability of each type of observation:
$$
    \prob(Y\_i = y) =
    \begin{cases}
        p(1-p)^{y-1} & \text{if } y \le T \\\\
        (1-p)^T & \text{if } y = \text{"}T+\text{"}
    \end{cases}
$$

> - If saw heads at flip $y$ (where $y \le T$), we saw $y-1$ tails, followed by 1 head.
> - If gave up at $T$, we see $T$ tails in a row.
>
> > $\prob(X > T) = \sum\_{x=T+1}^\infty p(1-p)^{x-1} = (1-p)^T$

To find the MLE, we separate the data into two sets: $U$ (uncensored, $Y\_i \le T$) and $C$ (censored, $Y\_i = \text{"}T+\text{"}$). The log-likelihood becomes a sum over both sets. Differentiating this customized log-likelihood allows us to find a highly accurate estimate of $p$ that properly accounts for the censored information—which is something MoM cannot easily achieve.

> We ran the experiment $n$ times. Let $U$ be the set of experiments where we got Heads (Uncensored). Let $m$ be the number of these successes. Let $C$ be the set of experiments have been gave up (Censored). The number of these failures is $n - m$.
>
> $$
>     L_n(p) = \left( \prod_{i \in U} p(1-p)^{y_i - 1} \right) \times \left( \prod_{i \in C} (1-p)^T \right)
> $$
> Take natural log,
> $$
>     \ell_n(p) = \sum_{i \in U} \left[ \ln(p) + (y_i - 1)\ln(1-p) \right] + \sum_{i \in C} \left[ T \ln(1-p) \right]
> $$
> There are $m$ items in the first sum, and $n-m$ items in the second sum. Let $S_U = \sum_{i \in U} y_i$ (the total number of flips in the successful experiments).
> $$
>     \begin{align*}
>         \ell_n(p) &= m \ln(p) + \ln(1-p) \sum_{i \in U} (y_i - 1) + (n-m)T \ln(1-p) \\\\
>         &= m \ln(p) + \ln(1-p) \left[ (S_U - m) + (n-m)T \right]
>     \end{align*}
> $$
> Differentiate with respect to $p$ and set to $0$.
> $$
> \begin{align*}
>     \frac{d}{dp} \ell_n(p) = \frac{m}{p} - \frac{S_U - m + (n-m)T}{1-p} &= 0\\\\
>     \frac{m}{p} &= \frac{S_U - m + (n-m)T}{1-p} \\\\
>     m(1-p) &= p \left[ S_U - m + (n-m)T \right] \\\\
>     m - mp &= p S_U - mp + p(n-m)T \\\\
>     m &= p \left[ S_U + (n-m)T \right] \\\\
>     p &= \frac{m}{S_U + (n-m)T}
> \end{align*}
> $$
> Which gives the MLE as $p = \frac{m}{S_U + (n-m)T}$.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 10: Maximum Likelihood Estimation.
