---
title: Categorical Data
date: 2026-04-08
---

## 1. Introduction to Categorical Data

In many scientific domains, data is intrinsically categorical rather than continuous. Our primary statistical goal is to formulate hypothesis tests that rigorously evaluate the structural relationships between distinct categorical variables.

The foundational mathematical tools for these problems heavily leverage the multinomial distribution, Generalized Likelihood Ratio (LR) tests, and their asymptotic $\chi^2$ approximations.

### 1.1 Motivating Example: 1974 Gender Bias Study

Consider a historical study examining promotion decisions across different genders. The data is traditionally summarized in a $2 \times 2$ contingency table:

|                           | Male ($j=1$) | Female ($j=2$) | Total |
| :---                      | :---         | :---           | :---  |
| **Promoted ($i=1$)**      | 21           | 14             | 35    |
| **No Promotion ($i=2$)**  | 3            | 10             | 13    |
| **Total**                 | 24           | 24             | 48    |

The null hypothesis $H\_0$ asserts that there is absolutely no statistical effect of gender on promotion decisions. How do we mathematically model and evaluate this claim?

---

## 2. Fisher's Exact Test

Fisher's Exact Test provides a highly elegant framework for evaluating $2 \times 2$ tables, particularly when sample sizes are heavily restricted.

Let the observed counts be denoted as $n\_{ij}$. We define the fixed marginal totals:

- Row totals: $n\_{i\cdot} = \sum\_j n\_{ij}$ (e.g., total promoted $n\_{1\cdot} = 35$)
- Column totals: $n\_{\cdot j} = \sum\_i n\_{ij}$ (e.g., total males $n\_{\cdot 1} = 24$)
- Grand total: $n\_{\cdot \cdot} = \sum\_{i,j} n\_{ij} = 48$

**Fisher's Core Assumption:** We treat the row sums and column sums as strictly fixed parameters, rather than random variables. Consequently, the single upper-left cell count $N\_{11}$ mathematically dictates the entire contingency table.

**The Null Distribution:**
Under $H\_0$ (no gender bias), the observed count $N\_{11}$ is statistically equivalent to the result of drawing $n\_{\cdot 1}$ (24 males) completely at random, without replacement, from a combined population consisting of $n\_{1\cdot}$ (35 promoted) and $n\_{2\cdot}$ (13 not promoted) individuals.

This process flawlessly matches the definition of the **Hypergeometric distribution**. The precise probability of observing exactly $k$ promoted males is:
$$
    \prob(N\_{11} = k) = \frac{\binom{n\_{1\cdot}}{k} \binom{n\_{2\cdot}}{n\_{\cdot 1} - k}}{\binom{n\_{\cdot \cdot}}{n\_{\cdot 1}}}
$$
Applying this to our specific numerical example:
$$
    \prob(N\_{11} = 21) = \frac{\binom{35}{21} \binom{13}{3}}{\binom{48}{24}}
$$
To complete the hypothesis test, we calculate the p-value by strictly summing the probabilities of observing $N\_{11} = 21$ and all other possible counts that represent equal or even more extreme deviations from the expected center.

---

## 3. Chi-Square Test for Homogeneity

While Fisher's Exact Test is powerful for $2 \times 2$ setups, we frequently encounter large datasets with multiple populations and multiple distinct categories.

Suppose we sample from $I$ entirely independent populations. Within each population $i$, the observations are sorted into $J$ distinct categories. Let $n\_{ij}$ be the observed count in category $j$ for population $i$.
The data in row $i$ strictly follows a multinomial distribution:
$$
    (X\_{i1}, \dots, X\_{iJ}) \sim \text{Multi}(n\_{i\cdot}, p\_i)
$$
where $p\_i = (p\_{i1}, \dots, p\_{iJ})$ represents the true categorical probabilities for population $i$.

We wish to test if the populations are perfectly homogeneous (i.e., they all share the exact same probability structure):
$$
    H\_0: p\_1 = p\_2 = \dots = p\_I = \pi
$$

Under the homogeneity assumption, the optimal Maximum Likelihood Estimate for the shared categorical probability $\pi\_j$ is seamlessly derived from the aggregate column totals:
$$
    \hat{\pi}\_j = \frac{n\_{\cdot j}}{n\_{\cdot \cdot}}
$$
Consequently, the expected count for cell $(i,j)$ under $H\_0$ is:
$$
    E\_{ij} = n\_{i\cdot} \hat{\pi}\_j = \frac{n\_{i\cdot} n\_{\cdot j}}{n\_{\cdot \cdot}}
$$

Applying Pearson's large-sample approximation to the Generalized LR test generates the highly versatile **Chi-Square test statistic**:
$$
    \chi^2 = \sum\_{i=1}^I \sum\_{j=1}^J \frac{(n\_{ij} - E\_{ij})^2}{E\_{ij}}
$$
By Wilks' Theorem, the asymptotic degrees of freedom $d$ is the difference in parameters between the full model ($I \times (J-1)$) and the constrained null model ($J-1$):
$$
    d = I(J-1) - (J-1) = (I-1)(J-1)
$$
Thus, under $H\_0$, the test statistic asymptotically follows $\chi^2\_{(I-1)(J-1)}$.

---

## 4. Chi-Square Test for Independence

A mathematically analogous but philosophically distinct problem arises when we randomly sample $n$ items from a *single* broad population and subsequently cross-classify each item across two features (Feature $I$ and Feature $J$).

The total data follows one massive multinomial distribution over the $I \times J$ grid:
$$
    (X\_{11}, \dots, X\_{IJ}) \sim \text{Multi}(n, \Pi)
$$
where $\Pi\_{ij} = \prob(I=i, J=j)$.

We formulate the null hypothesis that the two categorical features are statistically independent:
$$
    H\_0: \Pi\_{ij} = \prob(I=i) \prob(J=j) = \Pi\_{i\cdot} \Pi\_{\cdot j} \quad \text{for all } (i, j)
$$

### 4.1 Equivalence of the Test Statistic

In a profound demonstration of algebraic unity, deriving the Generalized LR test for independence yields the **exact same formula** as the test for homogeneity.

We estimate the marginal probabilities as $\hat{\Pi}\_{i\cdot} = \frac{n\_{i\cdot}}{n}$ and $\hat{\Pi}\_{\cdot j} = \frac{n\_{\cdot j}}{n}$.
The expected count is therefore $E\_{ij} = n \hat{\Pi}\_{i\cdot} \hat{\Pi}\_{\cdot j} = \frac{n\_{i\cdot} n\_{\cdot j}}{n\_{\cdot \cdot}}$.
The test statistic strictly remains:
$$
    \sum\_{i=1}^I \sum\_{j=1}^J \frac{(n\_{ij} - E\_{ij})^2}{E\_{ij}} \sim \chi^2\_{(I-1)(J-1)} \quad \text{under } H\_0
$$

### 4.2 Special Case: The $2 \times 2$ Grid

For the highly common $2 \times 2$ scenario ($I=2, J=2$), the degrees of freedom is precisely $d = 1$. The vast summations in the Chi-Square formula beautifully condense into a single, highly efficient algebraic expression:
$$
    \chi^2 = \frac{(n\_{11} n\_{22} - n\_{12} n\_{21})^2 n\_{\cdot \cdot}}{n\_{1\cdot} n\_{2\cdot} n\_{\cdot 1} n\_{\cdot 2}}
$$
This compact representation directly leverages the cross-product difference $(n\_{11} n\_{22} - n\_{12} n\_{21})$, which perfectly measures the determinant of the contingency table matrix, seamlessly capturing the full magnitude of the statistical dependency.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 19: Categorical Data.
