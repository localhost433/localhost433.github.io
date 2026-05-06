---
title: "13/14/15 - Hypothesis Testing"
date: 2026-03-04/09/23
---

## Roadmap

This note develops the full framework for hypothesis testing. We start with the basic formulation — null and alternative hypotheses, Type I/II errors — and derive the optimal test for simple-vs-simple hypotheses via the Neyman-Pearson Lemma (the Likelihood Ratio test). We then extend to composite hypotheses using $p$-values, confidence sets, and the duality between them. Finally, we cover the Generalized Likelihood Ratio test for composite hypotheses and Wilks' Theorem, which underpins Pearson's $\chi^2$ test.

---

## 1. Introduction to Hypothesis Testing

Hypothesis testing is a formal statistical procedure used to make decisions about the underlying properties of a population based on a sample of observations. The objective is to evaluate whether there is sufficient statistical evidence to reject a default baseline assumption in favor of an alternative claim.

We formalize our problem using two competing hypotheses:

- **Null hypothesis ($H\_0$):** This represents the default status quo, a statement of "no effect," "no discovery," or "no difference."
- **Alternative hypothesis ($H\_1$):** This represents the active claim we wish to prove, representing a "discovery" or a significant deviation from the baseline.

---

## 2. Statistical Formulation

Suppose we observe data $X = (X\_1, \dots, X\_n)$ drawn from a probability distribution $f\_\theta$, where $\theta \in \Theta$ is an unknown parameter. The parameter space $\Theta$ is partitioned into two disjoint subsets, $\Theta\_0$ and $\Theta\_1$.

The formal hypothesis testing problem is stated as:
$$
    H\_0: \theta \in \Theta\_0 \quad \text{vs.} \quad H\_1: \theta \in \Theta\_1
$$
By definition, we require $\Theta\_0 \cap \Theta\_1 = \emptyset$.

> Since it's a partition of the parameter space $\Theta$.

**Definition (Statistical Test):**
A test is a formal decision rule, defined as a function $T$ that maps the observed data $X$ to the set of hypotheses $\{H\_0, H\_1\}$. Based on the observed values, the test explicitly instructs us to either "Accept $H\_0$" or "Reject $H\_0$" (which implies accepting $H\_1$).

### 2.1 Types of Hypotheses

Hypotheses are broadly categorized based on the specific number of parameter values they contain.

- **Simple Hypothesis:** The hypothesis precisely specifies exactly one single value for the parameter. For example, $H\_0: \theta = \theta\_0$. Thus, $|\Theta\_0| = 1$.
- **Composite Hypothesis:** The hypothesis specifies a range or multiple possible values for the parameter. For example, $H\_1: \theta > \theta\_0$ or $H\_1: \theta \neq \theta\_0$. Thus, $|\Theta\_1| > 1$.

### 2.2 Examples of Testing Scenarios

**Example 1: Coin Tossing (Simple vs. Simple)**
Suppose I toss a coin with bias $p$ exactly $4$ times, and $X$ of the tosses turn out to be heads. Suppose we have some prior knowledge that the bias is either $0.5$ or $0.7$.
We formulate the hypothesis testing problem as:
$$
    H\_0: p = 0.5 \quad \text{vs.} \quad H\_1: p = 0.7
$$
A test $T$ would take the observed number of heads $X \in \{0, 1, 2, 3, 4\}$ and map it to a decision in $\{H\_0, H\_1\}$.

**Example 2: Normal Mean Testing**
Suppose we have a sample $X\_1, \dots, X\_n \sim \mathcal{N}(\mu, \sigma^2)$ with a known variance $\sigma^2$ but an unknown mean $\mu$.

- **Simple vs. Simple:** $H\_0: \mu = \mu\_0$ vs. $H\_1: \mu = \mu\_1$.
- **Two-sided test:** $H\_0: \mu = \mu\_0$ vs. $H\_1: \mu \neq \mu\_0$. (Simple vs. Composite)
- **One-sided test:** $H\_0: \mu = \mu\_0$ vs. $H\_1: \mu > \mu\_0$. (Simple vs. Composite)

---

## 3. Evaluating a Statistical Test

Whenever we make a decision using a statistical test, we risk making one of two distinct types of errors:

| Truth \ Output | $H\_0$ | $H\_1$ |
| :--- | :--- | :--- |
| **$H\_0$ is true** | Correct decision; $\prob(\text{Output } H\_0 \mid H\_0 \text{ is true}) = 1 - \alpha$ | **Type I Error** (False Positive); $\alpha = \prob(\text{Output } H\_1 \mid H\_0 \text{ is true})$ |
| **$H\_1$ is true** | **Type II Error** (False Negative); $\beta = \prob(\text{Output } H\_0 \mid H\_1 \text{ is true})$ | Correct decision (**Power**); $1 - \beta = \prob(\text{Output } H\_1 \mid H\_1 \text{ is true})$ |

In rigorous statistical practice, it is mathematically impossible to simultaneously minimize both $\alpha$ and $\beta$ for a fixed sample size $n$. The standard frequentist paradigm dictates that we fix the significance level $\alpha$ at a pre-determined, strictly controlled threshold (such as $0.05$ or $0.01$) and then actively seek the specific test that maximizes the statistical power $1 - \beta$.

> $\alpha$ and $\beta$ move in opposite directions. $\alpha$ and Power move in the same direction.

---

## 4. The Likelihood Ratio Test (Simple vs. Simple)

When both $H\_0$ and $H\_1$ are simple hypotheses (e.g., $H\_0: \theta = \theta\_0$ and $H\_1: \theta = \theta\_1$), the **Neyman-Pearson Lemma** provides the absolute optimal test that maximizes power for a given significance level $\alpha$. This optimal test is the **Likelihood Ratio (LR) Test**.

### 4.1 The Decision Rule

The Likelihood Ratio is defined as the ratio of the likelihood of the data under the alternative hypothesis to the likelihood of the data under the null hypothesis:
$$
    \text{LR}(X) = \frac{f\_{\theta\_1}(X\_1, \dots, X\_n)}{f\_{\theta\_0}(X\_1, \dots, X\_n)}
$$
The formal decision rule for the Likelihood Ratio Test states that we should reject $H\_0$ if the likelihood ratio strictly exceeds a specific critical threshold $c$:
$$
    \text{Reject } H\_0 \iff \text{LR}(X) > c
$$
The critical value $c$ is meticulously chosen to ensure that the probability of a Type I error exactly equals our desired significance level $\alpha$, that:
$$
    \prob(\text{LR}(X) > c \mid \theta = \theta\_0) = \alpha
$$

### 4.2 Example: Normal Mean Testing

Suppose $X\_1, \dots, X\_n \sim \mathcal{N}(\mu, \sigma^2)$. We want to find the exact LR test for $H\_0: \mu = \mu\_0$ versus $H\_1: \mu = \mu\_1$, assuming $\mu\_1 > \mu\_0$.

**Step 1: Construct the Likelihood Ratio**
$$
    \text{LR}(X) = \frac{\exp\left(-\frac{1}{2\sigma^2} \sum\_{i=1}^n (X\_i - \mu\_1)^2\right)}{\exp\left(-\frac{1}{2\sigma^2} \sum\_{i=1}^n (X\_i - \mu\_0)^2\right)}
$$
By expanding the squares inside the exponential and simplifying, we get:
$$
    \text{LR}(X) = \exp\left( \frac{n(\mu\_1 - \mu\_0)}{\sigma^2} \overline{X}\_n - \frac{n(\mu\_1^2 - \mu\_0^2)}{2\sigma^2} \right)
$$

**Step 2: Simplify the Rejection Region**
We reject $H\_0$ when $\text{LR}(X) > c$. Taking the natural logarithm of both sides:
$$
    \begin{align*}
        \frac{n(\mu\_1 - \mu\_0)}{\sigma^2} \overline{X}\_n - \frac{n(\mu\_1^2 - \mu\_0^2)}{2\sigma^2} &> \ln c \\\\
        \overline{X}\_n &> \frac{\sigma^2}{n(\mu\_1 - \mu\_0)} \ln c + \frac{\mu\_1 + \mu\_0}{2} = \tau
    \end{align*}
$$
Because $\mu\_1 > \mu\_0$, the inequality direction is strictly preserved. The test mathematically reduces to: **Reject $H\_0$ if $\overline{X}\_n > \tau$.**

**Step 3: Determine the Critical Threshold**
We want $\prob(\overline{X}\_n > \tau \mid \mu = \mu\_0) = \alpha$.
Under $H\_0$, the sample mean follows $\overline{X}\_n \sim \mathcal{N}(\mu\_0, \sigma^2/n)$.
Standardizing this variable gives:
$$
    \prob\left( \frac{\overline{X}\_n - \mu\_0}{\sigma/\sqrt{n}} > \frac{\tau - \mu\_0}{\sigma/\sqrt{n}} \right) = \alpha
$$
Because the standardized variable is a standard Normal $Z$, we set $\frac{\tau - \mu\_0}{\sigma/\sqrt{n}} = z\_\alpha$, where $z\_\alpha$ is the upper $\alpha$-quantile of the standard normal distribution. This yields the final threshold:
$$
    \tau = \mu\_0 + z\_\alpha \frac{\sigma}{\sqrt{n}}
$$

---

## 5. Moving Beyond Simple Hypotheses: Test Statistics and $p$-Values

The LR test is perfectly optimal for differentiating between two simple hypotheses. However, this foundational paradigm is highly restrictive for practical applications.

1. **Composite Hypotheses:** The LR test cannot be directly applied when the alternative hypothesis $H\_1$ is composite (e.g., $H\_1: \theta > \theta\_0$).
2. **Difficult Power Calculations:** Controlling the Type II error probability ($\beta$) is mathematically difficult when dealing with composite alternative spaces, because $\beta$ must be calculated for every single parameter configuration within $H\_1$:
    $$
        \beta = \max\_{\theta \in \Theta\_1} \prob(\text{Accept } H\_0 \mid \theta)
    $$

Therefore, in broad practical usage, most statistical tests are exclusively designed to strictly control the Type I error (the significance level $\alpha$), without explicitly optimizing for $\beta$. We accomplish this by relying on test statistics with known null distributions.

> In addition, under a practical scenario, we fix $\alpha$ because false positives are considered worse than false negatives.

### 5.1 Test Statistics and Critical Regions

The standard strategy for composite hypothesis testing is to construct a specific measurable function of the data and the parameter, $h(X, \theta)$, such that under the null hypothesis $H\_0$, the sampling distribution of $h$ is completely known and free of unknown parameters.

For a test of $H\_0: \theta = \theta\_0$, we calculate the test statistic evaluated at the null parameter: $T(X) = h(X, \theta\_0)$.

We then establish a **rejection region** based strictly on critical values. For a one-sided test, we reject $H\_0$ if $T(X) > c\_\alpha$. The threshold $c\_\alpha$ is systematically chosen such that:
$$
    \prob(T(X) > c\_\alpha \mid H\_0) = \alpha
$$
If the test statistic falls outside this narrowly constructed region, we conclude that the observed data is fundamentally incompatible with the null hypothesis, and we reject $H\_0$.

---

## 6. The $p$-Value

When simply reporting "Reject" or "Accept", a significant amount of statistical context is lost. A test statistic that barely crosses the threshold is treated identically to one that massively exceeds it. The **$p$-value** addresses this limitation by reporting the continuous strength of the evidence against the null hypothesis.

**Definition (P-Value):**
The $p$-value is the probability, calculated precisely under the assumption that the null hypothesis $H\_0$ is true, of observing a test statistic at least as extreme as the one that was actually observed in the sample data.

If $T\_\text{obs}$ is the realized, observed value of our test statistic $T(X)$, the $p$-value for a right-sided test is:
$$
    \text{$p$-value} = \prob(T(X) \ge T\_\text{obs} \mid H\_0)
$$

### 6.1 Properties of the $p$-Value

1. **Decision Rule:** A $p$-value perfectly acts as an alternative decision mechanism. We reject $H\_0$ if and only if the calculated $\text{$p$-value} \le \alpha$.
2. **Uniform Distribution Under the Null:** A fascinating mathematical property is that if the null hypothesis is completely true, and the test statistic is continuous, the $p$-value itself acts as a random variable that is uniformly distributed on the interval $[0, 1]$.
    $$
        \text{$p$-value} \sim \text{Unif}[0, 1] \quad \text{under } H\_0
    $$

---

## 7. Confidence Sets and Duality

Hypothesis testing aims to determine if a specific, isolated parameter value $\theta\_0$ is plausible. A **Confidence Set** essentially extends this logic by finding *all* possible parameter values that are plausible given the observed data.

**Definition (Confidence Set):**
A $(1 - \alpha)$-confidence set (or interval) $CI(X)$ is a data-dependent interval constructed such that the true parameter $\theta\_0$ is contained within the set with a probability of at least $1 - \alpha$ prior to sampling.
$$
    \prob(\theta\_0 \in CI(X) \mid \theta = \theta\_0) \ge 1 - \alpha \quad \text{for every } \theta\_0
$$

### 7.1 The Duality Principle

There is a profound mathematical duality between hypothesis testing and confidence intervals. A confidence interval simply consists of all the null hypothesis values that would *not* be rejected by a level-$\alpha$ hypothesis test.

Let $A(\theta\_0)$ be the acceptance region of a level-$\alpha$ test for $H\_0: \theta = \theta\_0$.
$$
    \prob(X \in A(\theta\_0) \mid \theta = \theta\_0) \ge 1 - \alpha
$$
The corresponding confidence interval is constructed by simply pivoting this probability statement to isolate the parameter:
$$
    CI(X) = \{ \theta\_0 : X \in A(\theta\_0) \}
$$

### 7.2 Example 1: Normal Mean with Unknown Variance

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

### 7.3 Example 2: Normal Variance Testing

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

## 8. Generalized Likelihood Ratio Tests

The standard Likelihood Ratio (LR) test is strictly optimal for simple hypothesis testing via the Neyman-Pearson Lemma. However, practical statistical problems frequently involve **composite hypotheses**, where the parameter spaces consist of multiple possible values.

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

## 9. Examples of the Generalized LR Test

### 9.1 Gaussian Location Model (Two-Sided Test)

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

### 9.2 Gaussian Location Model (One-Sided Test)

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

## 10. Wilks' Theorem and Asymptotic Distribution

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

### 10.1 Proof Sketch (One-Dimensional Case)

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

## 11. Pearson's Chi-Square Test for Multinomial Data

Suppose we observe categorical data falling into $m$ distinct categories. Let the counts be $(X\_1, \dots, X\_m) \sim \text{Multi}(n, p)$, where $p = (p\_1, \dots, p\_m)$ is the true probability vector and $\sum p\_j = 1$.
We wish to perform a goodness-of-fit test:
$$
    H\_0: p = p\_0 \quad \text{vs.} \quad H\_1: p \neq p\_0
$$
Here, $\dim(\Theta\_0) = 0$. The full parameter space $\Theta$ is the standard probability simplex, which has $m-1$ free dimensions, so $\dim(\Theta) = m - 1$.
By Wilks' theorem, $-2 \log LR \xrightarrow{d} \chi^2\_{m-1}$.

### 11.1 Deriving Pearson's Statistic

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

## 12. Examples

### 12.1 Mendel's Pea Data

Gregor Mendel observed $n = 556$ peas across four distinct phenotypes.
The theoretical probabilities under his genetic model, alongside his actual observed counts, were:

- **Smooth yellow:** $\prob = 9/16$, Observed $X\_1 = 315$
- **Smooth green:** $\prob = 3/16$, Observed $X\_2 = 108$
- **Wrinkled yellow:** $\prob = 3/16$, Observed $X\_3 = 101$
- **Wrinkled green:** $\prob = 1/16$, Observed $X\_4 = 32$

We compute Pearson's statistic using the expected counts $E\_j = n p\_{0j}$:
$$
    \sum\_{j=1}^4 \frac{(X\_j - E\_j)^2}{E\_j} = \frac{(315 - 556 \cdot 9/16)^2}{556 \cdot 9/16} + \frac{(108 - 556 \cdot 3/16)^2}{556 \cdot 3/16} + \dots \approx 0.47
$$
The degrees of freedom is $d = 4 - 1 = 3$. We consult the $\chi^2\_3$ distribution to find the p-value:
$$
    \text{p-value} = \prob(\chi^2\_3 \ge 0.47) \approx 0.93
$$
Because $0.93 \gg 0.05$, we absolutely do not reject the null hypothesis. The fit is incredibly tight; in fact, future statisticians have extensively debated whether Mendel's data were "too good to be true."

### 12.2 Poisson Dispersion Test

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
2. Han, Y. (2026). Lecture 13: Simple Hypothesis Testing.
3. Han, Y. (2026). Lecture 14: P-value, confidence set.
4. Han, Y. (2026). Lecture 15: Generalized LR Test.
