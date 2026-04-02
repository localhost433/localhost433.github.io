---
title: Hypothesis Testing
date: 2026-03-04
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

1. **$\alpha$ - Type I Error (False Positive):** We incorrectly reject the null hypothesis $H\_0$ when it is actually true.
    - The probability of committing a Type I Error is called the **Significance Level**, denoted by $\alpha$.
    - $\alpha = \prob(\text{Output } H\_1 \mid H\_0 \text{ is true})$.
2. **$\beta$ - Type II Error (False Negative):** We incorrectly accept the null hypothesis $H\_0$ when the alternative $H\_1$ is actually true.
    - The probability of a Type II error is denoted by $\beta$.
    - The **Power** of the test is defined as $1 - \beta$, which is the probability of correctly rejecting $H\_0$ when $H\_1$ is true.
    - $1 - \beta = \prob(\text{Output } H\_1 \mid H\_1 \text{ is true})$.

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

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 13: Simple Hypothesis Testing.
