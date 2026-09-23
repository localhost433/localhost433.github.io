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

The null hypothesis $H_0$ asserts that there is absolutely no statistical effect of gender on promotion decisions. How do we mathematically model and evaluate this claim?

---

## 2. Fisher's Exact Test

Fisher's exact test evaluates $2 \times 2$ tables and is useful when sample sizes are small.

Let the observed counts be denoted as $n_{ij}$. We define the fixed marginal totals:

- Row totals: $n_{i\cdot} = \sum_j n_{ij}$ (e.g., total promoted $n_{1\cdot} = 35$)
- Column totals: $n_{\cdot j} = \sum_i n_{ij}$ (e.g., total males $n_{\cdot 1} = 24$)
- Grand total: $n_{\cdot \cdot} = \sum_{i,j} n_{ij} = 48$

**Fisher's Core Assumption:** We treat the row sums and column sums as strictly fixed parameters, rather than random variables. Consequently, the single upper-left cell count $N_{11}$ mathematically dictates the entire contingency table.

**The Null Distribution:**
Under $H_0$ (no gender bias), the observed count $N_{11}$ is statistically equivalent to the result of drawing $n_{\cdot 1}$ (24 males) completely at random, without replacement, from a combined population consisting of $n_{1\cdot}$ (35 promoted) and $n_{2\cdot}$ (13 not promoted) individuals.

This process flawlessly matches the definition of the **Hypergeometric distribution**. The precise probability of observing exactly $k$ promoted males is:
$$
    \prob(N_{11} = k) = \frac{\binom{n_{1\cdot}}{k} \binom{n_{2\cdot}}{n_{\cdot 1} - k}}{\binom{n_{\cdot \cdot}}{n_{\cdot 1}}}
$$
Applying this to our specific numerical example:
$$
    \prob(N_{11} = 21) = \frac{\binom{35}{21} \binom{13}{3}}{\binom{48}{24}}
$$
To complete the hypothesis test, we calculate the p-value by strictly summing the probabilities of observing $N_{11} = 21$ and all other possible counts that represent equal or even more extreme deviations from the expected center.

---

## 3. Chi-Square Test for Homogeneity

While Fisher's Exact Test is powerful for $2 \times 2$ setups, we frequently encounter large datasets with multiple populations and multiple distinct categories.

Suppose we sample from $I$ entirely independent populations. Within each population $i$, the observations are sorted into $J$ distinct categories. Let $n_{ij}$ be the observed count in category $j$ for population $i$.
The data in row $i$ strictly follows a multinomial distribution:
$$
    (X_{i1}, \dots, X_{iJ}) \sim \text{Multi}(n_{i\cdot}, p_i)
$$
where $p_i = (p_{i1}, \dots, p_{iJ})$ represents the true categorical probabilities for population $i$.

We wish to test if the populations are perfectly homogeneous (i.e., they all share the exact same probability structure):
$$
    H_0: p_1 = p_2 = \dots = p_I = \pi
$$

Under the homogeneity assumption, the maximum-likelihood estimate of the shared category probability $\pi_j$ comes from the column totals:
$$
    \hat{\pi}_j = \frac{n_{\cdot j}}{n_{\cdot \cdot}}
$$
Consequently, the expected count for cell $(i,j)$ under $H_0$ is:
$$
    E_{ij} = n_{i\cdot} \hat{\pi}_j = \frac{n_{i\cdot} n_{\cdot j}}{n_{\cdot \cdot}}
$$

Applying Pearson's large-sample approximation to the Generalized LR test generates the highly versatile **Chi-Square test statistic**:
$$
    \chi^2 = \sum_{i=1}^I \sum_{j=1}^J \frac{(n_{ij} - E_{ij})^2}{E_{ij}}
$$
By Wilks' Theorem, the asymptotic degrees of freedom $d$ is the difference in parameters between the full model ($I \times (J-1)$) and the constrained null model ($J-1$):
$$
    d = I(J-1) - (J-1) = (I-1)(J-1)
$$
Thus, under $H_0$, the test statistic asymptotically follows $\chi^2_{(I-1)(J-1)}$.

---

## 4. Chi-Square Test for Independence

A mathematically analogous but philosophically distinct problem arises when we randomly sample $n$ items from a *single* broad population and subsequently cross-classify each item across two features (Feature $I$ and Feature $J$).

The total data follows one massive multinomial distribution over the $I \times J$ grid:
$$
    (X_{11}, \dots, X_{IJ}) \sim \text{Multi}(n, \Pi)
$$
where $\Pi_{ij} = \prob(I=i, J=j)$.

We formulate the null hypothesis that the two categorical features are statistically independent:
$$
    H_0: \Pi_{ij} = \prob(I=i) \prob(J=j) = \Pi_{i\cdot} \Pi_{\cdot j} \quad \text{for all } (i, j)
$$

### 4.1 Equivalence of the Test Statistic

The generalized likelihood-ratio test for independence yields the same statistic as the test for homogeneity.

We estimate the marginal probabilities as $\hat{\Pi}_{i\cdot} = \frac{n_{i\cdot}}{n}$ and $\hat{\Pi}_{\cdot j} = \frac{n_{\cdot j}}{n}$.
The expected count is therefore $E_{ij} = n \hat{\Pi}_{i\cdot} \hat{\Pi}_{\cdot j} = \frac{n_{i\cdot} n_{\cdot j}}{n_{\cdot \cdot}}$.
The test statistic strictly remains:
$$
    \sum_{i=1}^I \sum_{j=1}^J \frac{(n_{ij} - E_{ij})^2}{E_{ij}} \sim \chi^2_{(I-1)(J-1)} \quad \text{under } H_0
$$

### 4.2 Special Case: The $2 \times 2$ Grid

For the highly common $2 \times 2$ scenario ($I=2, J=2$), the degrees of freedom is precisely $d = 1$. The vast summations in the Chi-Square formula beautifully condense into a single, highly efficient algebraic expression:
$$
    \chi^2 = \frac{(n_{11} n_{22} - n_{12} n_{21})^2 n_{\cdot \cdot}}{n_{1\cdot} n_{2\cdot} n_{\cdot 1} n_{\cdot 2}}
$$
The numerator contains the squared cross-product difference $(n_{11} n_{22} - n_{12} n_{21})^2$, the square of the table's determinant.

---

## References

1. Rice, J. A. (2007). *Mathematical Statistics and Data Analysis* (3rd ed.). Thomson Brooks/Cole.
2. Han, Y. (2026). Lecture 19: Categorical Data.
