---
title: Bayesian Perspective
date: 2026-03-02
---

## 1. Frequentist vs. Bayesian Philosophies

Up until now, our statistical methods (Method of Moments, Maximum Likelihood Estimation) have relied entirely on the **Frequentist** interpretation of statistics.

* **Frequentist Setting:** The true parameter $\theta$ is an unknown, but strictly fixed, constant. It is not a random variable. Probabilities are strictly interpreted as long-run frequencies of repeated experiments. Consequently, we cannot make probabilistic statements about $\theta$ itself (e.g., saying there is a $95%$ probability that $\theta$ is greater than $0$ is technically invalid in Frequentist statistics).
* **Bayesian Setting:** The parameter $\theta$ is mathematically treated as a **random variable** itself. We start with prior subjective beliefs about the distribution of $\theta$, and we update these beliefs as we observe more data. Probabilities reflect our *degree of belief* or uncertainty regarding the parameter.

---

## 2. The Bayesian Framework

The entire Bayesian approach to statistical inference centers around three fundamental mathematical objects: the prior distribution, the likelihood function, and the posterior distribution.

### 2.1 The Prior Distribution

Before we observe any data, we must encode our subjective beliefs, intuitions, or historical knowledge about $\theta$ into a probability density function called the **Prior Distribution**, denoted as $\pi(\theta)$.

* If we absolutely know that $\theta$ must be positive (like a variance), $\pi(\theta)$ is strictly defined only on $(0, \infty)$.
* If we have no idea what $\theta$ might be, we might deliberately choose an "uninformative" prior (e.g., a flat uniform distribution across all possible values).

### 2.2 The Likelihood

When data $X = (X\_1, \dots, X\_n)$ is observed, the data generation process $f\_\theta(x\_1, \dots, x\_n)$ is viewed as the **conditional distribution** of the data given a specific value of the parameter, denoted $f(X | \theta)$.
This is the same likelihood function used in MLE.

### 2.3 The Posterior Distribution (Bayes' Rule)

After observing the data $X$, we update our beliefs about $\theta$ using Bayes' Theorem. This updated distribution is called the **Posterior Distribution**, denoted $\pi(\theta | X)$.

According to Bayes' Rule:
$$
    \pi(\theta | X) = \frac{\pi(\theta) f(X | \theta)}{\int \pi(\theta') f(X | \theta') d\theta'}
$$
Because the denominator is merely the marginal distribution of the data (which acts as a normalizing constant with respect to $\theta$), we often write Bayes' Rule simply as a proportionality:
$$
    \pi(\theta | X) \propto \pi(\theta) f(X | \theta)
$$
**Word Equation:** Posterior $\propto$ Prior $\times$ Likelihood.

---

## 3. Conjugate Priors

A significant challenge in Bayesian statistics is calculating the denominator integral to properly normalize the posterior. However, if the prior distribution and the likelihood function are perfectly mathematically matched such that the posterior distribution belongs to the *same probability family* as the prior, we call the prior a **conjugate prior**. This structural harmony makes the math elegantly trackable.

### 3.1 Example: Beta-Binomial Conjugacy

Suppose we want to estimate the unknown bias $\theta \in [0, 1]$ of a coin.

* **Data/Likelihood:** We flip the coin $n$ times and observe $X$ heads. The likelihood follows a Binomial distribution:
    $$
        f(X | \theta) = \binom{n}{X} \theta^X (1-\theta)^{n-X} \propto \theta^X (1-\theta)^{n-X}
    $$
* **Prior:** We choose an uninformative Uniform prior on $[0, 1]$. Note that the Uniform distribution is actually a special mathematical case of the Beta distribution, $\text{Beta}(1, 1)$:
    $$
        \pi(\theta) = 1 \propto \theta^{1-1} (1-\theta)^{1-1}
    $$
* **Posterior:** We multiply the prior by the likelihood:
    $$
        \begin{align*}
            \pi(\theta | X) &\propto \pi(\theta) f(X | \theta) \\\\
            &\propto (1) \cdot \left( \theta^X (1-\theta)^{n-X} \right) \\\\
            &\propto \theta^{(X+1)-1} (1-\theta)^{(n-X+1)-1}
        \end{align*}
    $$
    We immediately recognize this functional algebraic form as a Beta distribution. Therefore, the exact posterior distribution is:
    $$
        \theta | X \sim \text{Beta}(X+1, n-X+1)
    $$

> Beta distribution have the PDF $\frac {x^{\alpha -1}(1-x)^{\beta -1}}{\mathrm{B} (\alpha, \beta)}$ where the beta function $\mathrm{B}$ is a normalizing constant. And for $X \sim \text{Beta}(\alpha, \beta)$, $\E[X] = \frac{\alpha}{\alpha+\beta}$.

From this comprehensive posterior distribution, we can readily derive specific point estimates.  
**Claim**: Under a squared error loss function, the optimal Bayesian point estimator is simply the posterior mean:

$$
    \hat{\theta}\_\text{Bayes} = \E[\theta | X] = \E[\text{Beta}(X+1, n-X+1)] = \frac{X+1}{n+2}
$$

> **Proof of the Claim:**  
> Let our point estimate be constant $c$. Want to find $c$ that minimizes the expected value of our loss function over the posterior distribution.
> We define the Expected Loss (or Risk) as:
> $$
>     \text{Risk}(c) = \E[(\theta - c)^2 \mid X]
> $$
> Expand the square and distribute the expectation. With respect to the posterior distribution, $\theta$ is the random variable, and $c$ is a fixed number:
> $$
>     \begin{align*}
>         \text{Risk}(c) &= \E[\theta^2 - 2c\theta + c^2 \mid X] \\\\
>         &= \E[\theta^2 \mid X] - 2c\E[\theta \mid X] + c^2
>     \end{align*}
> $$
> Take the derivative with respect to $c$ and set it to $0$:
> $$
>     \begin{align*}
>         \frac{d}{dc} \text{Risk}(c) &= \frac{d}{dc} \left( \E[\theta^2 \mid X] - 2c\E[\theta \mid X] + c^2 \right) \\\\
>         &= 0 - 2\E[\theta \mid X] + 2c
>     \end{align*}
> $$
> Solve for $c$:
> $$
>     \begin{align*}
>         0 &= -2\E[\theta \mid X] + 2c \\\\
>         2c &= 2\E[\theta \mid X] \\\\
>         c &= \E[\theta \mid X]
>     \end{align*}
> $$
> This gives the optimal point estimator $\hat{\theta}\_{\text{Bayes}} = \E[\theta \mid X]$ which is the posterior mean to minimize squared error.

Notice how this slightly differs from the MLE ($\hat{\theta}\_\text{MLE} = \frac{X}{n}$). The Bayesian estimator practically acts as if we saw "one imaginary head and one imaginary tail" prior to conducting any actual coin flipping. This built-in "pseudo-data" regularizes the estimate and inherently prevents extreme conclusions (such as claiming a coin is 100% heads simply because we flipped it once and got heads, $n=1, X=1$).

---

## 4. Asymptotic Properties of the Posterior

What practically happens when we collect a massive amount of data ($n \to \infty$)?

As the total sample size grows immensely, the Likelihood function becomes incredibly sharp around the true parameter and completely overwhelms the subjective Prior distribution (provided the prior isn't strictly zero anywhere in the parameter space).

By utilizing a Taylor expansion of the log-posterior directly around the MLE peak $\hat{\theta}\_\text{MLE}$, we can mathematically demonstrate:
$$
    \pi(\theta | X) \approx \exp\left( \ln \pi(\hat{\theta}\_\text{MLE}) - \frac{n I(\hat{\theta}\_\text{MLE})}{2} (\theta - \hat{\theta}\_\text{MLE})^2 \right)
$$

> **Proof: Laplace Approximation of the Posterior**
> 
> Start with Bayes' Theorem in proportional form:
> $$
>     \pi(\theta | X) \propto \pi(\theta) L_n(\theta)
> $$
> Take logarithm for the log-posterior, where $l_n(\theta) = \ln L_n(\theta)$:
> $$
>     \ln \pi(\theta | X) = \ln \pi(\theta) + l_n(\theta) + C
> $$
> For a large sample size $n$, the probability mass is heavily concentrated at $\hat{\theta}\_\text{MLE}$. We perform a second-order Taylor expansion of the log-likelihood $l_n(\theta)$ centered at this peak:
> $$
>     l_n(\theta) \approx l_n(\hat{\theta}\_\text{MLE}) + (\theta - \hat{\theta}\_\text{MLE}) \dot{l}\_n(\hat{\theta}\_\text{MLE}) + \frac{1}{2}(\theta - \hat{\theta}\_\text{MLE})^2 \dot{l}\_n'(\hat{\theta}\_\text{MLE})
> $$
> Since $\hat{\theta}\_\text{MLE}$ is the maximum, $\dot{l}\_n(\hat{\theta}\_\text{MLE}) = 0$.  Furthermore, the negative second derivative of the log-likelihood approximates the total Fisher Information: $\ddot{l}\_n(\hat{\theta}\_\text{MLE}) \approx -n I(\hat{\theta}\_\text{MLE})$.
> Substitute:
> $$
>     l_n(\theta) \approx l_n(\hat{\theta}\_\text{MLE}) - \frac{n I(\hat{\theta}\_\text{MLE})}{2}(\theta - \hat{\theta}\_\text{MLE})^2
> $$
> Plugging this back into the unnormalized log-posterior, assuming the prior evaluates roughly to a constant $\ln \pi(\hat{\theta}\_\text{MLE})$ near the peak:
> $$
>     \ln \pi(\theta | X) \approx \ln \pi(\hat{\theta}\_\text{MLE}) + l_n(\hat{\theta}\_\text{MLE}) - \frac{n I(\hat{\theta}\_\text{MLE})}{2}(\theta - \hat{\theta}\_\text{MLE})^2
> $$
> Finally, exponentiating both sides and absorbing the constant likelihood term $l_n(\hat{\theta}\_\text{MLE})$ into the proportionality constant gives the approximated posterior:
> $$
>     \pi(\theta | X) \approx \text{const} \cdot \exp\left( \ln \pi(\hat{\theta}\_\text{MLE}) - \frac{n I(\hat{\theta}\_\text{MLE})}{2} (\theta - \hat{\theta}\_\text{MLE})^2 \right)
> $$

This rigorous expansion implies that for a sufficiently large $n$, the posterior distribution closely approximates a Normal distribution that is centered precisely at the Maximum Likelihood Estimator:
$$
    \theta | X \approx \mathcal{N}\left( \hat{\theta}\_\text{MLE}, \frac{1}{n I(\hat{\theta}\_\text{MLE})} \right)
$$

> **Proof: Arriving at the Normal Approximation**
>
> Recall that for a Normal distribution $\mathcal{N}(\mu, \sigma^2)$:
> $$
>     f(x) \propto \exp\left( -\frac{1}{2\sigma^2} (x - \mu)^2 \right)
> $$
> Compare this structural form to the $\theta$-dependent component of our derived posterior approximation:
> $$
>     \pi(\theta | X) \propto \exp\left( - \frac{n I(\hat{\theta}\_\text{MLE})}{2} (\theta - \hat{\theta}\_\text{MLE})^2 \right)
> $$
> Map the parameters:
>
> 1. The variable $x$ corresponds to parameter $\theta$.
> 2. The mean $\mu$ corresponds to MLE $\hat{\theta}\_\text{MLE}$.
> 3. The precision multiplier matches the variance term. Setting them equal gives:
>
> $$
>     \frac{1}{2\sigma^2} = \frac{n I(\hat{\theta}\_\text{MLE})}{2} \implies \frac{1}{\sigma^2} = n I(\hat{\theta}\_\text{MLE}) \implies \sigma^2 = \frac{1}{n I(\hat{\theta}\_\text{MLE})}
> $$
> Therefore, the posterior distribution converges to a Normal distribution centered at the MLE with variance determined by the inverse Fisher Information:
> $$
>     \theta | X \approx \mathcal{N}\left( \hat{\theta}\_\text{MLE}, \frac{1}{n I(\hat{\theta}\_\text{MLE})} \right)
> $$

This remarkable theoretical result (often strongly linked to the Bernstein-von Mises theorem) is philosophically profound: given enough raw data, Frequentists and Bayesians will ultimately arrive at the exact same objective conclusions, regardless of what the Bayesian's initial subjective prior beliefs might have been.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 12: Bayesian Perspective.
