---
title: Large Sample Theory of MLE
date: 2026-02-25
---

## 1. Introduction to Large Sample Theory

In maximum likelihood estimation, we want to know the statistical properties of our estimator $\hat{\theta}\_n$. While the exact distribution of $\hat{\theta}\_n$ can be difficult to derive for small sample sizes, its behavior becomes extremely predictable as the sample size $n$ approaches infinity. This is referred to as **Asymptotic Theory** or **Large Sample Theory**.

To understand the large-sample (asymptotic) behavior of Maximum Likelihood Estimators, we must formally analyze the derivatives of the log-likelihood function. This analysis centers around a concept called the **Score function**.

---

## 2. The Score Function

### 2.1 Definition

Let $X$ be a random variable drawn from $f\_\theta(x)$ (PDF/PMF), and let $\ell\_\theta(x) = \ln f\_\theta(x)$ be the log-likelihood for a single observation. The **Score function**, denoted $\dot{\ell}\_\theta(x)$, is the partial derivative of the log-likelihood with respect to the parameter $\theta$:
$$
    \dot{\ell}\_\theta(x) = \frac{\partial}{\partial \theta} \ln f\_\theta(x) = \frac{\frac{\partial}{\partial \theta} f_\theta(x)}{f_\theta(x)}
$$
> Note: The dot notation implies differentiation with respect to the parameter $\theta$, not time or data. (this Newton's notation did made me confuse for a moment.)

### 2.2 The Score Equation

For $n$ i.i.d. observations, the log-likelihood is $\ell\_n(\theta) = \sum\_{i=1}^n \ell\_\theta(x\_i)$. The Maximum Likelihood Estimator $\hat{\theta}\_n$ is the solution to the **score equation**, which represents the first-order condition for finding a maximum:
$$
    \sum\_{i=1}^n \dot{\ell}\_\theta(x\_i) = 0 \implies \frac{1}{n} \sum\_{i=1}^n \dot{\ell}\_\theta(x\_i) = 0
$$

> Score is literally just the first derivative of the log-likelihood, and here the sum is turned into an average for the ease to use LLN.

### 2.3 Expected Score is Zero

Under mild regularity conditions (which allow the interchange of integration and differentiation), the expected value of the score function, evaluated at the true parameter $\theta$, is always precisely zero.

> The main regularity condition in this specific proof is about the "support" of the distribution (the range of $x$ values where $f_\theta(x) > 0$). The boundary of the support cannot depend on the unknown parameter $\theta$. This step:
> $$
>     \int\_{-\infty}^{+\infty} \frac{\partial}{\partial \theta} f\_\theta(x) dx = \frac{\partial}{\partial \theta} \int\_{-\infty}^{+\infty} f\_\theta(x) dx
> $$
> The order of the integral $\int$ and the derivative $\frac{\partial}{\partial \theta}$ was swapped (Leibniz's Rule). This is only legal if the bounds of the integral ($-\infty$ to $+\infty$) doesn't contain $\theta$.  
>
> - Good: A Normal distribution. Bounds are always $-\infty$ to $+\infty$, regardless of $\mu$. The conditions hold.  
> - Bad: A Uniform distribution on the interval $[0, \theta]$. Because $\theta$ is in the boundary of the integral itself, the swap could not just happen. The expected score for a Uniform distribution is not zero!

**Proof:**
$$
    \begin{align*}
        \E\_\theta[\dot{\ell}\_\theta(X)] &= \E\_\theta\left[ \frac{\frac{\partial}{\partial \theta} f\_\theta(X)}{f\_\theta(X)} \right] \\\\
        &= \int\_{-\infty}^{+\infty} \frac{\frac{\partial}{\partial \theta} f\_\theta(x)}{f\_\theta(x)} f\_\theta(x) dx \\\\
        &= \int\_{-\infty}^{+\infty} \frac{\partial}{\partial \theta} f\_\theta(x) dx \\\\
        &= \frac{\partial}{\partial \theta} \int\_{-\infty}^{+\infty} f\_\theta(x) dx \\\\
        &= \frac{\partial}{\partial \theta} (1) = 0
    \end{align*}
$$
Because the expectation of the score is zero, the score function can be thought of as a random noise term centered around zero when evaluated at the true parameter.

> $\int\_{-\infty}^{+\infty} f\_\theta(x) dx = 1$ as the probability that ***some*** value $x$ occurs is 100%.

---

## 3. Fisher Information

Fisher Information quantifies exactly how much "information" an observable random variable $X$ carries about an unknown parameter $\theta$.

### 3.1 Definition

The Fisher Information $I(\theta)$ is defined as the variance of the score function. Since we already proved that the expected score is zero, the variance simplifies strictly to the expected value of the squared score:
$$
    I(\theta) = \Var{\dot{\ell}\_\theta(X)} = \E\_\theta\left[ (\dot{\ell}\_\theta(X))^2 \right]
$$

### 3.2 Alternative Form (Second Derivative)

Calculating the squared score is often algebraically tedious. Fortunately, Fisher Information can be equivalently calculated using the second derivative of the log-likelihood, which is typically much easier to evaluate.
$$
    I(\theta) = -\E\_\theta[\ddot{\ell}\_\theta(X)]
$$
where $\ddot{\ell}\_\theta(X) = \frac{\partial^2}{\partial \theta^2} \ln f\_\theta(X)$.

**Interpretation:** The second derivative measures the curvature of the log-likelihood function around its peak. A highly negative expected second derivative (which implies a high curvature and a very steep peak) means a large Fisher Information. This implies the data strongly isolates the true parameter value. Conversely, a flat log-likelihood means high uncertainty and low Fisher Information.

> **Proof: Equivalence of Fisher Information Formulations**
>
> Let $f(x; \theta)$ be the PDF. We start with the fundamental identity:
> $$
>     \int f(x; \theta) dx = 1
> $$
> Differentiate,
> $$
>     \frac{\partial}{\partial \theta} \int f(x; \theta) dx = \frac{\partial}{\partial \theta} (1) = 0
> $$
> Using the Leibniz rule to move the derivative inside the integral:
> $$
>     \int \frac{\partial f(x; \theta)}{\partial \theta} dx = 0
> $$
> Differentiate a second time:
> $$
>     \frac{\partial}{\partial \theta} \int \frac{\partial f(x; \theta)}{\partial \theta} dx = 0 \implies \int \frac{\partial^2 f(x; \theta)}{\partial \theta^2} dx = 0
> $$
> > Recall the definition of the log-likelihood $\ell = \ln f$. The first and second derivatives are:
> >
> > 1. $\dot{\ell} = \frac{\partial}{\partial \theta} \ln f = \frac{1}{f} \frac{\partial f}{\partial \theta} \implies \frac{\partial f}{\partial \theta} = f \cdot \dot{\ell}$
> > 2. To find $\ddot{\ell}$, differentiate $\dot{\ell}$ (using the quotient rule):
> >
> > $$
> >     \ddot{\ell} = \frac{\partial}{\partial \theta} \left( \frac{1}{f} \frac{\partial f}{\partial \theta} \right) = \frac{f \frac{\partial^2 f}{\partial \theta^2} - (\frac{\partial f}{\partial \theta})^2}{f^2} = \frac{1}{f} \frac{\partial^2 f}{\partial \theta^2} - \left( \frac{1}{f} \frac{\partial f}{\partial \theta} \right)^2
> > $$
>
> Substituting $\dot{\ell}$ into the last term:
> $$
>     \ddot{\ell} = \frac{1}{f} \frac{\partial^2 f}{\partial \theta^2} - (\dot{\ell})^2
> $$
>
> Multiply both sides by $f$ and integrate (take the expectation):
> $$
>     \E[\ddot{\ell}] = \int \left( \frac{1}{f} \frac{\partial^2 f}{\partial \theta^2} \right) f dx - \E[(\dot{\ell})^2]
> $$
> $$
>     \E[\ddot{\ell}] = \int \frac{\partial^2 f}{\partial \theta^2} dx - \E[(\dot{\ell})^2]
> $$
>
> We showed that $\int \frac{\partial^2 f}{\partial \theta^2} dx = 0$. Therefore:
> $$
>     \E[\ddot{\ell}] = 0 - \E[(\dot{\ell})^2]
> $$
> $$
>     -\E[\ddot{\ell}] = \E[(\dot{\ell})^2]
> $$
>
> Since $I(\theta) = \Var{\dot{\ell}} = \E[(\dot{\ell})^2]$ (because $\E[\dot{\ell}] = 0$), we have:
> $$
>     I(\theta) = -\E[\ddot{\ell}]
> $$

---

## 4. Asymptotic Normality of the MLE

The crowning achievement of Maximum Likelihood theory is the realization that, for large samples, the MLE is almost always normally distributed around the true parameter, and its variance is strictly dictated by the Fisher Information.

### 4.1 The Main Theorem

Let $X\_1, \dots, X\_n \stackrel{i.i.d.}{\sim} f\_\theta(x)$ subject to regularity conditions. As the sample size $n \to \infty$, the distribution of the MLE $\hat{\theta}\_n$ converges to a Normal distribution centered at the true parameter $\theta$, with variance inversely proportional to the total Fisher Information:

> - If $X_1, X_2, \dots, X_n$ i.i.d., each individual observation gives $I(\theta)$ (same) amount of information.  
> - When taking $n$ samples, the total Fisher Information in the entire dataset is $n \cdot I(\theta)$.  
> - Because the total information is growing linearly, uncertainty (as the variance of the estimate) shrinks, variance of the MLE ends up being $\frac{1}{n I(\theta)}$.

$$
    \sqrt{n}(\hat{\theta}\_n - \theta) \xrightarrow{d} \mathcal{N}\left(0, \frac{1}{I(\theta)}\right)
$$

> **Proof.**
>
> Let $\ell(\theta) = \sum_{i=1}^n \ln f(X_i; \theta)$ be the log-likelihood function.
> Let $S_n(\theta) = \frac{\partial}{\partial \theta} \ell(\theta) = \sum_{i=1}^n \dot{\ell}\_i(\theta)$ be the score function. By the definition of MLE, the score function evaluated at the MLE $\hat{\theta}\_n$ is zero:
> $$S_n(\hat{\theta}\_n) = 0$$
>
> A first-order Taylor expansion of $S_n(\hat{\theta}\_n)$ around the true parameter $\theta$:
> $$S_n(\hat{\theta}\_n) \approx S_n(\theta) + (\hat{\theta}\_n - \theta) {S'}\_n(\theta)$$
>
> Solve for $(\hat{\theta}\_n - \theta)$:
> $$0 \approx S_n(\theta) + (\hat{\theta}\_n - \theta) {S'}\_n(\theta)$$
> $$\hat{\theta}\_n - \theta \approx \frac{-S_n(\theta)}{{S'}\_n(\theta)}$$
> $$\sqrt{n}(\hat{\theta}\_n - \theta) \approx \frac{-\frac{1}{\sqrt{n}} S_n(\theta)}{\frac{1}{n} {S'}\_n(\theta)}$$
>
> The numerator is $-\frac{1}{\sqrt{n}} S_n(\theta) = -\frac{1}{\sqrt{n}} \sum_{i=1}^n \dot{\ell}\_i(\theta)$. We know $\E[\dot{\ell}\_i] = 0$ and $\Var{\dot{\ell}\_i} = I(\theta)$. Because we are summing i.i.d. random variables, the CLT tells us:
> > Through a simple manipulation:
> > $$\frac{1}{\sqrt{n}}\overline{X}\_n \xrightarrow{d} \mathcal{N}(\mu, \sigma^2)$$
> $$\frac{1}{\sqrt{n}} \sum_{i=1}^n \dot{\ell}\_i(\theta) \xrightarrow{d} \mathcal{N}(0, I(\theta))$$
>
> The denominator is $\frac{1}{n} S'\_n(\theta) = \frac{1}{n} \sum_{i=1}^n \ddot{\ell}\_i(\theta)$.
> This is a sample average of the second derivatives. By WLLN, this sample average converges in probability to its expected value:
> $$\frac{1}{n} \sum_{i=1}^n \ddot{\ell}\_i(\theta) \xrightarrow{p} \E[\ddot{\ell}\_i(\theta)]$$
> As proven above, $\E[\ddot{\ell}\_i(\theta)] = -I(\theta)$.
>
> > Slutsky's Theorem allows us to combine convergence in distribution (the numerator) with convergence in probability to a constant (the denominator).
>
> We divide the asymptotic distribution of the numerator by the constant from the denominator:
> $$\sqrt{n}(\hat{\theta}\_n - \theta) \xrightarrow{d} \frac{\mathcal{N}(0, I(\theta))}{-I(\theta)}$$
> Here:
> $$\text{New Variance} = I(\theta) \cdot \left(-\frac{1}{I(\theta)}\right)^2 = \frac{1}{I(\theta)}$$
> Thus, the final result is obtained:
> $$\sqrt{n}(\hat{\theta}\_n - \theta) \xrightarrow{d} \mathcal{N}\left(0, \frac{1}{I(\theta)}\right)$$

In practical terms, for large $n$, we can approximate the distribution of the estimator as:
$$
    \hat{\theta}\_n \approx \mathcal{N}\left(\theta, \frac{1}{n I(\theta)}\right)
$$

> Here $\approx$ is in terms of "approximate distribution", the $\xrightarrow{d}$ above is for the limit.

### 4.2 Comparison with Other Estimators

> The Cramer-Rao Lower Bound (CRLB) states that the variance of *any* unbiased estimator $\tilde{\theta}$ cannot be smaller than the inverse of the total Fisher Information.
> $$\Var{\tilde{\theta}} \ge \frac{1}{n I(\theta)}$$
Because the MLE achieves this absolute theoretical minimum variance as $n \to \infty$, we call it **asymptotically efficient**. It is the "best" possible estimator for large samples.

Estimating the true $\mu$ of $\mathcal{N}(\mu, \sigma^2)$ using the sample mean and the sample median.

1. **MLE (Sample Mean):** For a Normal distribution, the sample mean $\overline{X}\_n$ is the MLE.  

   The Fisher Information for $\mu$ in a Normal distribution is $I(\mu) = 1/\sigma^2$.
   Therefore, by the asymptotic normality theorem, its variance hits the CRLB:
   $$
       \Var{\overline{X}\_n} \approx \frac{1}{n(1/\sigma^2)} = \frac{\sigma^2}{n}
   $$

2. **Median (M-Estimator):** The sample median is also an unbiased estimator for the center of a symmetric Normal distribution. However, its asymptotic variance depends on the density function evaluated at the true mean, $f(\mu)$.  

   For a Normal distribution, the median's asymptotic variance evaluates to:
   $$\Var{\text{Median}} \approx \frac{\pi}{2} \frac{\sigma^2}{n}$$

Both the mean and the median will converge to the true parameter $\mu$ (they are both consistent). However, $\frac{\pi}{2} \frac{\sigma^2}{n}$ is strictly greater than $\frac{\sigma^2}{n}$. The median has a wider spread and higher uncertainty.

> The MLE is 57% more efficient, meaning you would need 57% more data points using the median to achieve the same level of precision as the sample mean.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 11: Large Sample Theory of MLE.
