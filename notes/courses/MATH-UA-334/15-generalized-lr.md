---
title: Generalized LR Tests
date: 2026-03-23
---

## 1. Introduction to Generalized Likelihood Ratio Tests

In previous lectures, we established that the standard Likelihood Ratio (LR) test is strictly optimal for simple hypothesis testing (simple versus simple) via the Neyman-Pearson Lemma. However, practical statistical problems frequently involve **composite hypotheses**, where the parameter spaces consist of multiple possible values.

We formulate the composite hypothesis testing problem as follows:
$$
    H\_0: \theta \in \Theta\_0 \quad \text{vs.} \quad H\_1: \theta \in \Theta\_1
$$
Let the full parameter space be $\Theta = \Theta\_0 \cup \Theta\_1$.

To test these hypotheses, we define the **Generalized Likelihood Ratio (LR)** as the maximum likelihood achieved under the null hypothesis divided by the global maximum likelihood achieved over the entire parameter space:
$$
    LR = \frac{\max\_{\theta \in \Theta\_0} L\_n(\theta)}{\max\_{\theta \in \Theta} L\_n(\theta)}
$$
Because the numerator restricts the parameter to a subset $\Theta\_0 \subseteq \Theta$, the likelihood in the numerator can never exceed the likelihood in the denominator. Thus, $LR \in [0, 1]$.

**Decision Rule:**
If the observed data is highly compatible with the null hypothesis, the constrained maximum will be very close to the unconstrained global maximum, making $LR \approx 1$. If the data strongly contradicts $H\_0$, the constrained maximum will be far smaller, yielding a small $LR$.
Thus, our test strictly instructs us to:
$$
    \text{Reject } H\_0 \iff LR < c
$$
for some critically chosen threshold $c$.

---

## 2. Examples of the Generalized LR Test

### 2.1 Gaussian Location Model (Two-Sided Test)

Suppose we observe $X\_1, \dots, X\_n \sim \mathcal{N}(\mu, \sigma^2)$ where the variance $\sigma^2$ is perfectly known. We wish to test:
$$
    H\_0: \mu = \mu\_0 \quad \text{vs.} \quad H\_1: \mu \neq \mu\_0
$$
Here, $\Theta\_0 = \{\mu\_0\}$ and the full space is $\Theta = \mathbb{R}$.

**Step 1: Constrained Maximum (Numerator)**
Because $\Theta\_0$ contains only one value, the constrained maximum likelihood is simply the likelihood evaluated at $\mu\_0$:
$$
    \max\_{\mu \in \Theta\_0} L\_n(\mu) = \prod\_{i=1}^n \frac{1}{\sqrt{2\pi}\sigma} \exp\left( -\frac{(X\_i - \mu\_0)^2}{2\sigma^2} \right)
$$

**Step 2: Unconstrained Maximum (Denominator)**
Over the full space $\mathbb{R}$, the likelihood is maximized by the standard Maximum Likelihood Estimator (MLE), which is the sample mean $\overline{X}\_n$:
$$
    \max\_{\mu \in \Theta} L\_n(\mu) = \prod\_{i=1}^n \frac{1}{\sqrt{2\pi}\sigma} \exp\left( -\frac{(X\_i - \overline{X}\_n)^2}{2\sigma^2} \right)
$$

**Step 3: Compute the Likelihood Ratio**
Dividing the numerator by the denominator cancels out the leading constants:
$$
    LR = \exp\left( -\frac{1}{2\sigma^2} \sum\_{i=1}^n (X\_i - \mu\_0)^2 + \frac{1}{2\sigma^2} \sum\_{i=1}^n (X\_i - \overline{X}\_n)^2 \right)
$$
Using the algebraic identity $\sum\_{i=1}^n (X\_i - \mu\_0)^2 = \sum\_{i=1}^n (X\_i - \overline{X}\_n)^2 + n(\overline{X}\_n - \mu\_0)^2$, the sum terms magically cancel, leaving:
$$
    LR = \exp\left( -\frac{n}{2\sigma^2} (\overline{X}\_n - \mu\_0)^2 \right)
$$

**Step 4: Decision Rule**
We reject $H\_0$ if $LR < c$. Taking the natural logarithm algebraically transforms this into:
$$
    |\overline{X}\_n - \mu\_0| > \tau
$$
This precisely recovers the familiar two-sided Z-test!

### 2.2 Gaussian Location Model (One-Sided Test)

Now consider the one-sided alternative:
$$
    H\_0: \mu = \mu\_0 \quad \text{vs.} \quad H\_1: \mu > \mu\_0
$$
The parameter space is $\Theta = [\mu\_0, \infty)$.
The constrained maximum remains the same. However, the unconstrained MLE over $\Theta$ is now $\hat{\mu} = \max\{\overline{X}\_n, \mu\_0\}$.

If $\overline{X}\_n \le \mu\_0$, the maximum occurs at $\mu\_0$, so $LR = 1$ (we absolutely do not reject $H\_0$).
If $\overline{X}\_n > \mu\_0$, the maximum is at $\overline{X}\_n$, yielding the exact same expression as the two-sided case.
Rejecting $H\_0$ for $LR < c$ directly reduces to rejecting $H\_0$ if $\overline{X}\_n - \mu\_0 > \tau$, which is the standard one-sided Z-test.

---

## 3. Wilks' Theorem and Asymptotic Distribution

In the previous Gaussian example, taking $-2 \log LR$ reveals a fascinating structure:
$$
    -2 \log LR = \frac{n}{\sigma^2}(\overline{X}\_n - \mu\_0)^2 = \left( \frac{\overline{X}\_n - \mu\_0}{\sigma/\sqrt{n}} \right)^2
$$
Because the inner term is distributed as $\mathcal{N}(0, 1)$ under $H\_0$, the entire statistic $-2 \log LR$ follows a $\chi^2\_1$ distribution.
This elegant relationship generalizes broadly across statistics, forming the foundation of **Wilks' Theorem**.

**Theorem (Wilks' Theorem):**
Under standard regularity conditions, as the sample size $n \to \infty$, the test statistic $-2 \log LR$ evaluated under the null hypothesis converges in distribution to a Chi-Square distribution:
$$
    -2 \log LR \xrightarrow{d} \chi^2\_d \quad \text{under } H\_0
$$
where the degrees of freedom $d$ is the difference in the dimensionality of the parameter spaces:
$$
    d = \dim(\Theta) - \dim(\Theta\_0)
$$

**Implications:**
Wilks' theorem is practically revolutionary. It tells us that to perform a level-$\alpha$ hypothesis test for virtually any complex statistical model, we merely need to solve two MLE problems (constrained and unconstrained), compute $-2 \log LR$, and check if it strictly exceeds the $(1-\alpha)$ critical value of the $\chi^2\_d$ distribution.

### 3.1 Proof Sketch (One-Dimensional Case)

Assume $\Theta\_0 = \{\theta\_0\}$ and $\Theta = \mathbb{R}$, yielding $d = 1 - 0 = 1$.
Let $\ell\_n(\theta) = \log L\_n(\theta)$ be the log-likelihood. The test statistic is:
$$
    -2 \log LR = -2 (\ell\_n(\theta\_0) - \ell\_n(\hat{\theta}\_n))
$$
We perform a second-order Taylor expansion of $\ell\_n(\theta\_0)$ strictly around the unconstrained MLE $\hat{\theta}\_n$:
$$
    \ell\_n(\theta\_0) \approx \ell\_n(\hat{\theta}\_n) + (\theta\_0 - \hat{\theta}\_n)\dot{\ell}\_n(\hat{\theta}\_n) + \frac{1}{2}(\theta\_0 - \hat{\theta}\_n)^2 \ddot{\ell}\_n(\hat{\theta}\_n)
$$
Because $\hat{\theta}\_n$ is the maximum, the first derivative is zero: $\dot{\ell}\_n(\hat{\theta}\_n) = 0$.
Additionally, the negative second derivative approximates the Fisher Information: $-\ddot{\ell}\_n(\hat{\theta}\_n) \approx n I(\theta\_0)$.
Substituting these yields:
$$
    -2 \log LR \approx -2 \left( -\frac{1}{2}(\hat{\theta}\_n - \theta\_0)^2 n I(\theta\_0) \right) = \left( \sqrt{n I(\theta\_0)}(\hat{\theta}\_n - \theta\_0) \right)^2
$$
By the asymptotic normality of the MLE, $\sqrt{n I(\theta\_0)}(\hat{\theta}\_n - \theta\_0) \xrightarrow{d} \mathcal{N}(0, 1)$. The square of a standard normal random variable is by definition $\chi^2\_1$.

---

## 4. Pearson's Chi-Square Test for Multinomial Data

Suppose we observe categorical data falling into $m$ distinct categories. Let the counts be $(X\_1, \dots, X\_m) \sim \text{Multi}(n, p)$, where $p = (p\_1, \dots, p\_m)$ is the true probability vector and $\sum p\_j = 1$.
We wish to perform a goodness-of-fit test:
$$
    H\_0: p = p\_0 \quad \text{vs.} \quad H\_1: p \neq p\_0
$$
Here, $\dim(\Theta\_0) = 0$. The full parameter space $\Theta$ is the standard probability simplex, which has $m-1$ free dimensions, so $\dim(\Theta) = m - 1$.
By Wilks' theorem, $-2 \log LR \xrightarrow{d} \chi^2\_{m-1}$.

### 4.1 Deriving Pearson's Statistic

The multinomial likelihood is:
$$
    L\_n(p) = \frac{n!}{X\_1! \dots X\_m!} p\_1^{X\_1} \dots p\_m^{X\_m}
$$
The unconstrained MLE for the multinomial distribution is simply the empirical frequencies: $\hat{p}\_j = X\_j / n$.
The generalized likelihood ratio is therefore:
$$
    LR = \prod\_{j=1}^m \left( \frac{p\_{0j}}{X\_j / n} \right)^{X\_j}
$$
Taking the natural logarithm and multiplying by $-2$:
$$
    -2 \log LR = 2 \sum\_{j=1}^m X\_j \log \left( \frac{X\_j / n}{p\_{0j}} \right)
$$
To connect this to classical statistics, we approximate the function $f(x) = x \log(x/p)$ using a second-order Taylor expansion around $x = p$. The linear terms perfectly sum to zero, leaving strictly the quadratic terms:
$$
    \begin{align*}
        -2 \log LR
        &\approx 2n \sum\_{j=1}^m \left( \left(\frac{X\_j}{n} - p\_{0j}\right) + \frac{1}{2p\_{0j}}\left(\frac{X\_j}{n} - p\_{0j}\right)^2 \right) \\\\
        &= n \sum\_{j=1}^m \frac{(X\_j / n - p\_{0j})^2}{p\_{0j}} \\\\
        &= \sum\_{j=1}^m \frac{(X\_j - n p\_{0j})^2}{n p\_{0j}}
    \end{align*}
$$
This final expression is exactly **Pearson's $\chi^2$ statistic** (1900), fundamentally defined as:
$$
    \sum \frac{(\text{Observed} - \text{Expected})^2}{\text{Expected}}
$$
Under $H\_0$, Pearson's statistic also converges in distribution to $\chi^2\_{m-1}$.

---

## 5. Examples

### 5.1 Mendel's Pea Data

Gregor Mendel observed $n = 556$ peas across four distinct phenotypes.
The theoretical probabilities under his genetic model, alongside his actual observed counts, were:

* **Smooth yellow:** $\prob = 9/16$, Observed $X\_1 = 315$
* **Smooth green:** $\prob = 3/16$, Observed $X\_2 = 108$
* **Wrinkled yellow:** $\prob = 3/16$, Observed $X\_3 = 101$
* **Wrinkled green:** $\prob = 1/16$, Observed $X\_4 = 32$

We compute Pearson's statistic using the expected counts $E\_j = n p\_{0j}$:
$$
    \sum\_{j=1}^4 \frac{(X\_j - E\_j)^2}{E\_j} = \frac{(315 - 556 \cdot 9/16)^2}{556 \cdot 9/16} + \frac{(108 - 556 \cdot 3/16)^2}{556 \cdot 3/16} + \dots \approx 0.47
$$
The degrees of freedom is $d = 4 - 1 = 3$. We consult the $\chi^2\_3$ distribution to find the p-value:
$$
    \text{p-value} = \prob(\chi^2\_3 \ge 0.47) \approx 0.93
$$
Because $0.93 \gg 0.05$, we absolutely do not reject the null hypothesis. The fit is incredibly tight; in fact, future statisticians have extensively debated whether Mendel's data were "too good to be true."

### 5.2 Poisson Dispersion Test

Suppose $X\_1, \dots, X\_n \sim \text{Poi}(\lambda\_i)$ independently. We wish to test if all observations share the exact same underlying rate:
$$
    H\_0: \lambda\_1 = \dots = \lambda\_n \quad \text{vs.} \quad H\_1: \lambda\_i \neq \lambda\_j \text{ for some } (i, j)
$$
The likelihood function is:
$$
    L\_n(\lambda) = \prod\_{i=1}^n e^{-\lambda\_i} \frac{\lambda\_i^{X\_i}}{X\_i!}
$$
Under $H\_0$, we have one common parameter $\lambda$. The constrained MLE is $\hat{\lambda} = \overline{X}\_n$.
Under $H\_1$, each $\lambda\_i$ is a free parameter. The unconstrained MLE is $\hat{\lambda}\_i = X\_i$.
$$
    LR = \frac{\prod\_{i=1}^n e^{-\overline{X}\_n} (\overline{X}\_n)^{X\_i} / X\_i!}{\prod\_{i=1}^n e^{-X\_i} (X\_i)^{X\_i} / X\_i!} = \prod\_{i=1}^n e^{X\_i - \overline{X}\_n} \left( \frac{\overline{X}\_n}{X\_i} \right)^{X\_i}
$$
Taking the logarithm and multiplying by $-2$ yields:
$$
    -2 \log LR = 2 \sum\_{i=1}^n X\_i \log \frac{X\_i}{\overline{X}\_n}
$$
*(Note that the linear $\sum\_{i=1}^n (X\_i - \overline{X}\_n)$ terms naturally evaluate to $0$).*
By applying a Taylor expansion identical to the multinomial case, we discover a simple Pearson-type approximation:
$$
    -2 \log LR \approx \sum\_{i=1}^n \frac{(X\_i - \overline{X}\_n)^2}{\overline{X}\_n}
$$
Here, the full space has $n$ parameters and the null space has $1$ parameter. By Wilks' Theorem, the test statistic elegantly converges to $\chi^2\_{n-1}$ under $H\_0$.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 15: Generalized LR Test.