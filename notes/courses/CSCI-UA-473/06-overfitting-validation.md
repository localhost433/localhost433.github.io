---
title: "6 - Overfitting, Validation & Bias-Variance"
date: "2026-09-22"
---

## Roadmap

*Slide 3.* Three items. The middle one does most of the work:

1. Overfitting and its causes
2. Tools to combat overfitting: regularization, then validation and cross-validation
3. Bias and variance of a hypothesis space

Nearly every slide is adapted from *Learning from Data* (Abu-Mostafa, Magdon-Ismail and
Lin), plus one figure from *Elements of Statistical Learning*. That matters for notation:
where this deck and [L5](note.html?course=CSCI-UA-473&note=05-linear-regression) disagree,
the disagreement usually comes from the two source books, and it is pointed out below.

The recap (slide 2) ties together the last three lectures in one line of argument. Driving
$E_{\text{in}}$ to zero is not the goal; a low $E_{\text{out}}$ is. Even the linear
hypothesis set overfits once the features are expanded with higher-order terms.
[L4](note.html?course=CSCI-UA-473&note=04-feasibility-of-learning)'s Hoeffding bound says
the gap closes as $N$ grows and $M$ shrinks. L5's ridge and lasso are one way to shrink
the effective $M$. The recap's last line announces the new tool: validation.

## Overfitting

*Slide 4.* Overfitting is fitting the data more than the data can support: past some
point a better fit to the sample stops predicting a lower $E_{\text{out}}$, and can
predict a higher one. It typically happens when the model is more complex than the problem
needs.

*Slide 5.* The deck's first picture: the target is a **2nd-degree** polynomial, five noisy
points are drawn from it, and a **4th-degree** polynomial is fitted to them. A quartic has
five coefficients, so with five points the design matrix is square and the fit
interpolates: $E_{\text{in}} = 0$ exactly, whatever the noise was. Between the points the
curve swings far from the parabola.

The same slide builds a table of what makes overfitting worse:

| Increase this | Overfitting |
|---|---|
| Number of data points $N$ | goes **down** |
| Noise in the data | goes **up** |
| Target complexity | goes **up** |

The first row is L4's Hoeffding story, and the second is L5's noisy targets. The third
looks like it contradicts L4 (see the example section at the end).

*Slide 6.* Two experiments from LFD, each fitting a 2nd-order and a 10th-order polynomial
to the same small sample:

| Target | Fit | $E_{\text{in}}$ | $E_{\text{out}}$ |
|---|---|---|---|
| 10th-order polynomial **+ noise** | 2nd order | 0.050 | 0.127 |
| | 10th order | 0.034 | **9.00** |
| 50th-order polynomial, **no noise** | 2nd order | 0.029 | 0.120 |
| | 10th order | $10^{-5}$ | **7680** |

Two things in this table are counterintuitive, and both matter:

- **Top half.** The target *is* a 10th-order polynomial, so $\mathbb H_{10}$ contains
  $f$, and it still loses badly to $\mathbb H_2$, which does not. Containing the target is
  no help when the sample is too small to find it.
- **Bottom half.** There is no noise at all, and the 10th-order fit still overfits
  catastrophically. From $\mathbb H_{10}$'s point of view, whatever part of a 50th-order
  target it cannot represent is indistinguishable from noise: the fit chases it exactly as
  it would chase random error. LFD calls this *deterministic noise*. The deck shows the
  effect without naming it, and it is what the "target complexity" row of slide 5 means.

The same experiment with slide 5's three rows on sliders. The first two buttons set up
slide 6's two cases; the bar underneath counts, over 250 fresh targets and samples, how
often the degree-10 fit ends up worse.

```artifact src=demos/overfitting-causes.jsx
```

The target-degree slider needs care. Up to $Q_f = 10$, $\mathbb H_{10}$ contains the target,
and with the noise at zero the degree-10 fit never loses. The "target complexity" row is
a claim about targets *beyond* what the bigger model can represent, and that is the
regime where turning up $Q_f$ with no noise at all still makes things worse.

## Regularization

*Slide 7.* Ridge again, now written the LFD way:

$$
\operatorname{RSS}(\lambda) = (y - Xw)^{\mathsf T}(y - Xw) + \frac{\lambda}{N}\ w^{\mathsf T}w
= E_{\text{in}}(w) + \frac{\lambda}{N}\ w^{\mathsf T}w .
$$

The deck calls it **weight decay**. Note the factor of $N$, because the two lines of the
slide only agree under one reading. LFD defines
$E_{\text{in}}(w) = \frac1N (y - Xw)^{\mathsf T}(y - Xw)$, so the second line is correct
and the first should carry a $\frac1N$ on the RSS. Read that way, the objective is L5's
$\operatorname{RSS} + \lambda w^{\mathsf T}w$ divided by $N$. It has the same minimizer,
and $\lambda$ means the same number in both lectures. Read the first line literally
instead, and this lecture's $\lambda$ is $N$ times L5's. Quiz answers should say which
convention they use.

The figure sweeps $\lambda$ over $0,\ 0.0001,\ 0.01,\ 1$ on the five-point example above:
the wild quartic at $\lambda = 0$, a near-perfect parabola already at $\lambda = 0.0001$,
and a curve too flat to follow the data by $\lambda = 1$. The arrow under it runs from
overfitting to underfitting. The thing to notice is how *little* regularization the fix
takes: the second panel is barely regularized at all. L5's
[coefficient paths](note.html?course=CSCI-UA-473&note=05-linear-regression) show the same
knob from the coefficients' side.

*Slide 8.* Why penalizing weights should help at all. The bound behind everything so far
has the shape

$$
E_{\text{out}}(h) \le E_{\text{in}}(h) + \Omega(\mathbb H) \qquad \text{for all } h \in \mathbb H,
$$

a generalization bound, which the deck attributes to VC theory. L4's finite-$\mathbb H$
Hoeffding bound is an instance: with probability at least $1-\delta$,
$\Omega = \sqrt{\frac{1}{2N}\ln\frac{2M}{\delta}}$. The penalty belongs to the whole set,
not to any one hypothesis. Regularization replaces it with a measure $\Omega(h)$ of the
complexity of an *individual* hypothesis and minimizes $E_{\text{in}}(h) + \Omega(h)$.
Pushing every chosen $h$ toward low complexity shrinks the part of $\mathbb H$ that
learning actually visits, which is what lowers the effective complexity of the set.

The deck is candid that choosing $\Omega(h)$ is as much art as science: there are standard
heuristics, and you choose among them by what you know about the domain.
[Note 00](note.html?course=CSCI-UA-473&note=00)'s regularized ERM objective is this
construction written in general form.

## Regularization vs. validation

*Slide 10.* For any hypothesis,

$$
E_{\text{out}}(h) = E_{\text{in}}(h) + \text{overfit penalty}.
$$

This is a definition, not a theorem: the penalty is whatever makes the equation hold. The
two tools attack it from opposite ends:

| Tool | What it estimates |
|---|---|
| **Regularization** | the penalty term, via a stand-in $\Omega(h)$ |
| **Validation** | the left-hand side, $E_{\text{out}}(h)$, directly |

The picture is L4's three-way split (slide 31 there): $D_{\text{train}}$,
$D_{\text{val}}$, $D_{\text{test}}$. L4 stated the rules for using a validation set. This
lecture asks what the validation error actually estimates, and how well.

## Validation

*Slide 11.* Setup. The full dataset has $N$ examples. Carve out $D_{\text{val}}$ with $K$
of them, train on the remaining $N-K$, and call the result $g^-$ (the minus is for "trained
on less than all of $D$"). Then

$$
E_{\text{val}}(g^-) = \frac1K \sum_{x_n \in D_{\text{val}}} e\big(g^-(x_n),\  y_n\big).
$$

**The mean** (slide 12). Take the expectation over the draw of the validation set:

$$
\mathbb E_{D_{\text{val}}}\big[E_{\text{val}}(g^-)\big]
= \frac1K \sum_{x_n \in D_{\text{val}}} \mathbb E_{D_{\text{val}}}\big[e(g^-(x_n), y_n)\big]
= \frac1K \sum_{x_n \in D_{\text{val}}} E_{\text{out}}(g^-)
= E_{\text{out}}(g^-).
$$

So $E_{\text{val}}(g^-)$ is an **unbiased** estimate of $E_{\text{out}}(g^-)$. The middle
equality is the one that uses something: each $(x_n, y_n)$ is a fresh draw that $g^-$ never
saw, so the expected error on it is by definition $E_{\text{out}}(g^-)$. If $g^-$ had been
trained on even one validation point, that step would fail for that point.

This is the one-bin situation from L4, where Hoeffding applies without a union bound.
$g^-$ is fixed before $D_{\text{val}}$ is looked at, so checking it against
$D_{\text{val}}$ is *verification*, the case L4 said the single-bin bound covers. With
0-1 error the bin inequality applies unchanged, with $K$ in place of $N$.

**The variance** (slide 13). With the $K$ validation points independent,

$$
\operatorname{Var}\big[E_{\text{val}}(g^-)\big]
= \frac{1}{K^2}\sum_{x_n \in D_{\text{val}}} \operatorname{Var}\big[e(g^-(x_n), y_n)\big]
= \frac{\sigma^2(g^-)}{K},
$$

where $\sigma^2(g^-)$ is the variance of the pointwise error. The slide sums the variances
without comment; that step is where independence is used. The conclusion:

$$
E_{\text{out}}(g^-) \le E_{\text{val}}(g^-) + O\left(\frac{\sigma(g^-)}{\sqrt K}\right).
$$

Read this as a *high-probability* statement, not a deterministic one. The slide writes a
bare $\le$, but what the variance gives you is Chebyshev: the chance that $E_{\text{val}}$
misses by more than $t\ \sigma/\sqrt K$ is at most $1/t^2$. The dependence on $K$ is what
counts: quadrupling the validation set halves the error bar.

### How big should $K$ be?

*Slide 14.* The obvious answer, "as large as possible", fails. $K$ comes out of $N$, so a
large $K$ leaves little data for $D_{\text{train}}$, and $g^-$ gets worse. The LFD figure
plots expected $E_{\text{val}}$ against $K$ with a band showing its spread, and the two
failure modes are at opposite ends:

| $K$ | What goes wrong |
|---|---|
| small | $E_{\text{val}}$ is an average of few terms: an honest estimate, but a noisy one (wide band on the left) |
| large | $g^-$ was trained on few points, so it is a poor hypothesis: the curve rises, and the band widens again because $g^-$ itself now varies a lot from sample to sample |

**Rule of thumb:** 20% of $D$ for validation, 80% for training.

The slide's figure, rebuilt from fits: forty noisy sine points per dataset, a cubic
trained on $N - K$ and validated on $K$, a thousand datasets at every $K$. It adds two
curves the slide leaves out. One is the mean of $E_{\text{out}}(g^-)$, which lies on top of
the mean of $E_{\text{val}}(g^-)$ because the estimate is unbiased. The other is
$E_{\text{out}}(g)$ after folding back, flat because it never depended on $K$.

```artifact src=demos/validation-size.jsx
```

Read the band, not the curve. With the figure's default datasets, the standard
deviation of $E_{\text{val}}$ at $K = 1$ is 0.15, larger than the mean of 0.105. By
$K = 8$ (the 20% rule) it is down to 0.06, and $g^-$ is still nearly as good as $g$
(0.111 against 0.107). Past $K \approx 20$ both curves climb and the band opens up again:
the estimate is precise, but it is a precise estimate of a bad hypothesis. At the far
right the mean climbs out of the band altogether, because a few datasets whose $g^-$
went wild drag the average up. Those are the $\sigma(g^-)$ of slide 13 getting large.

### Fold back in

*Slide 15.* The tradeoff can be partly sidestepped:

1. Split $D$ into $D_{\text{train}}$ and $D_{\text{val}}$.
2. Train on $D_{\text{train}}$, and pick the hyperparameters whose $g^-$ has the best
   $E_{\text{val}}(g^-)$.
3. Fold the $K$ validation examples back in, recovering all of $D$.
4. Retrain on $D$ with those hyperparameters **fixed**, giving the final $g$.

You ship $g$ and report $E_{\text{val}}(g^-)$. The report is an unbiased estimate for
$g^-$, not for $g$. It carries over to $g$ under the *learning-curve* assumption that
training on more data does not make $E_{\text{out}}$ worse in expectation. If
$E_{\text{out}}(g) \le E_{\text{out}}(g^-)$, the reported number is, if anything,
pessimistic about what you shipped. That is the sense in which the slide says the tradeoff
is sidestepped without giving up the guarantee: it survives, in the direction that is safe.

### Model selection

*Slide 16.* Now use one validation set to choose among $M$ hypothesis sets
$\mathbb H_1, \dots, \mathbb H_M$. Train each on $D_{\text{train}}$ to get $g_m^-$, compute
every $E_{\text{val}}(g_m^-)$, pick the best $\mathbb H_{m^{\ast}}$, and retrain it on $D$.

The slide says the validation set can be reused this way with the guarantee intact. That
needs one qualification. Picking the smallest of $M$ validation errors is L4's $M$-bins
problem one level up: the winner's $E_{\text{val}}$ is the best-looking of $M$ noisy estimates, so it
is **optimistic**. The guarantee survives, but it weakens with the number of candidates,
roughly as

$$
E_{\text{out}}(g_{m^{\ast}}^-) \le E_{\text{val}}(g_{m^{\ast}}^-) + O\left(\sqrt{\frac{\ln M}{K}}\right).
$$

The weakening is only logarithmic, which is why choosing among a handful of degrees or
$\lambda$ values costs little. It is also why the test set has to stay out of this loop:
once $D_{\text{val}}$ has been used to *choose*, its error is no longer an unbiased
estimate of the winner's $E_{\text{out}}$, and only an untouched set can supply one.

A symbol warning for this whole section. $M$ here counts **models**, as it counted
hypotheses in L4. In the polynomial demos $M$ is a **degree**. Neither is related to the
$\mathbb H_0$, $\mathbb H_1$ subscripts at the end of this note.

## Cross-validation

*Slide 17.* The choice of $K$ is a push-pull between two approximations in the chain

$$
E_{\text{out}}(g) \quad\approx\quad E_{\text{out}}(g^-) \quad\approx\quad E_{\text{val}}(g^-).
$$

The first $\approx$ wants $D_{\text{train}}$ large, so $K$ small. The second wants
$D_{\text{val}}$ large, so $K$ large. Cross-validation stops choosing between them.

**Leave-one-out.** Take $K = 1$, but do it $N$ times. For each $j$, train on $D$ minus
$(x_j, y_j)$ to get $g_j^-$, and score it on the point you left out:

$$
e_j = e\big(g_j^-(x_j),\  y_j\big),
\qquad
E_{\text{cv}} = \frac1N \sum_{j=1}^{N} e_j .
$$

Every training set has $N-1$ points, so the first $\approx$ is nearly exact. Every point is
used for validation once, so the average is over $N$ terms rather than one. Each $e_j$ is an
unbiased estimate of $E_{\text{out}}(g_j^-)$, so $E_{\text{cv}}$ is an unbiased estimate of
the expected $E_{\text{out}}$ of a model trained on $N-1$ points. The $e_j$ are not
independent (any two training sets share $N-2$ points), so $\sigma^2/N$ is the wrong
formula for its variance. An average of $N$ correlated errors is still far steadier than
one held-out point. Slide 18 draws the $N$ splits side by side. The price is $N$ trainings.

**K-fold** (slide 19). The affordable approximation. Split $D$ into $K$ equal parts. In
phase $j$, part $j$ is the validation set and the other $K-1$ parts are the training set.
Train, record $E_{\text{val}}^{j}$, and average:

$$
E_{\text{kcv}} = \frac1K \sum_{j=1}^{K} E_{\text{val}}^{j}.
$$

Every point is validated exactly once. The figure at the end of this section draws the
phases for $K = 5$; the slide's own example uses ten parts with $D_4$ held out.
Leave-one-out is the special case $K = N$. K-fold costs $K$ trainings instead of $N$.

A second symbol warning. In K-fold, $K$ is the **number of folds**, and each validation set
has $N/K$ points. In the section above, $K$ was the **size** of the validation set. The
bias-variance section below uses $K$ a third way, for the number of simulated datasets. The
deck reuses the letter all three times.

**Model selection with CV** (slide 20). This is the procedure L5 could not supply for
choosing $\lambda$:

1. Define $M$ candidate models by varying the knob: $(\mathbb H, \lambda_1), \dots, (\mathbb H, \lambda_M)$.
2. For each, run cross-validation to get $E_{\text{cv}}$.
3. Pick the $\lambda^{\ast}$ with the smallest $E_{\text{cv}}$.
4. Train $(\mathbb H, \lambda^{\ast})$ on the entire $D$ to get the final hypothesis.

The whole procedure, from the phases to the shipped hypothesis:

```artifact src=demos/cv-folds.jsx static math
```

The same loop chooses a polynomial degree or a feature subset. L4's
[measured U-curve](note.html?course=CSCI-UA-473&note=04-feasibility-of-learning) already
marks the degree a single validation set would pick. CV replaces that one noisy curve with
the average of $K$ of them.

## Bias and variance

*Slide 22.* Regularization gave a knob on complexity, and validation a way to set it. The
knob balances two things: lowering $E_{\text{in}}$ (training), and bounding the
$E_{\text{in}}$-$E_{\text{out}}$ gap (generalization). But both tools assume a hypothesis
set has already been chosen. Can anything be said about $\mathbb H$ before learning
starts?

*Slide 23.* Three ways to measure the complexity of $\mathbb H$, each for a different
setting:

| Tool | Setting |
|---|---|
| Hoeffding with the union bound ($M$) | finite, discrete $\mathbb H$ |
| VC dimension | continuous $\mathbb H$, discrete outputs (classification) |
| **Bias-variance** | continuous $\mathbb H$, real-valued outputs (regression), **squared error only** |

VC dimension is named here and not developed in the course so far.

*Slide 24.* The tension, restated. A complex $\mathbb H$ has a better chance of
approximating $f$ *in-sample*; a simple one has a better chance of generalizing
*out-of-sample*. Bias-variance splits $E_{\text{out}}$ into two terms, one for each:

- how well $\mathbb H$ can approximate $f$ at all, and
- how well you can home in on a good $h \in \mathbb H$ given the particular $D$ you got.

### The derivation

*Slides 25-27.* The new move is to make the dependence on the dataset explicit: write
$g^{(D)}$ for the hypothesis learned from $D$. For one dataset, with squared error and a
deterministic target,

$$
E_{\text{out}}\big(g^{(D)}\big) = \mathbb E_x\Big[\big(g^{(D)}(x) - f(x)\big)^2\Big].
$$

That number depends on the luck of the draw, so average it over datasets. The integrand is
non-negative, so the two expectations can be swapped:

$$
\mathbb E_D\Big[E_{\text{out}}\big(g^{(D)}\big)\Big]
= \mathbb E_x\Big[\mathbb E_D\big[(g^{(D)}(x) - f(x))^2\big]\Big]
= \mathbb E_x\Big[\mathbb E_D\big[g^{(D)}(x)^2\big] - 2\ \mathbb E_D\big[g^{(D)}(x)\big]f(x) + f(x)^2\Big].
$$

The middle expectation gets a name, the **average hypothesis**:

$$
\bar g(x) = \mathbb E_D\big[g^{(D)}(x)\big] \approx \frac1K \sum_{k=1}^{K} g^{(D_k)}(x),
$$

the pointwise average of the hypotheses learned from many independent datasets
$D_1, \dots, D_K$. It is a thought experiment: you only ever get one $D$. Substitute, then
add and subtract $\bar g(x)^2$,

$$
\mathbb E_D\Big[E_{\text{out}}\big(g^{(D)}\big)\Big]
= \mathbb E_x\Big[\mathbb E_D\big[g^{(D)}(x)^2\big] - \bar g(x)^2 + \bar g(x)^2 - 2\ \bar g(x) f(x) + f(x)^2\Big],
$$

and regroup the four terms in pairs:

$$
\mathbb E_D\Big[E_{\text{out}}\big(g^{(D)}\big)\Big]
= \mathbb E_x\Big[\underset{\operatorname{var}(x)}{\underbrace{\mathbb E_D\big[(g^{(D)}(x) - \bar g(x))^2\big]}} +
\underset{\operatorname{bias}(x)}{\underbrace{\big(\bar g(x) - f(x)\big)^2}}\Big].
$$

The first pair collapses by the variance identity
$\mathbb E[Z^2] - (\mathbb E Z)^2 = \mathbb E[(Z - \mathbb E Z)^2]$; the second is a
perfect square. So

$$
\mathbb E_D\Big[E_{\text{out}}\big(g^{(D)}\big)\Big]
= \mathbb E_x\big[\operatorname{bias}(x) + \operatorname{var}(x)\big]
= \textbf{bias} + \textbf{var}.
$$

| Term | Measures |
|---|---|
| **var** | how far the hypothesis learned from *your* $D$ strays from the average hypothesis $\bar g$ |
| **bias** | how far the average hypothesis strays from the target: how far the learning model is biased away from $f$ |

Three notation points, since this is where the deck differs from other sources:

1. **The deck's bias is already squared.** $\operatorname{bias}(x) = (\bar g(x) - f(x))^2$.
   ESL, most other texts, and the demo below call the same quantity $\text{bias}^2$. Same
   number, different name.
2. **There is no noise term**, because the target here is deterministic, $y = f(x)$. With
   L5's noisy targets, $y = f(x) + \varepsilon$ where $\mathbb E[\varepsilon] = 0$,
   $\operatorname{Var}(\varepsilon) = \sigma^2$, and $\varepsilon$ is independent of the
   training data. Expanding $(g - f - \varepsilon)^2$ leaves a cross term with zero
   expectation and one extra term, $\sigma^2$:
   $\mathbb E_D[E_{\text{out}}] = \textbf{bias} + \textbf{var} + \sigma^2$. That $\sigma^2$
   is the floor no choice of $\mathbb H$ gets under.
3. **Variance does not need noise.** The example below is noiseless, and its variance
   still reaches 1.68. The spread comes from *which $x$'s* were drawn, not only from what
   noise landed on them.

### The picture

*Slide 28.* The ESL figure: prediction error against model complexity. Training error
falls monotonically. Test error falls, then rises. The left end is labeled **high bias, low
variance** and the right end **low bias, high variance**. It is the same U as L4's slide
27, now with its two sides named.

The mechanism, run forty times: forty datasets from the same noisy sine, a degree-$M$ fit
to each, and their average $\bar g$ in bold. The right panel repeats the experiment at
every degree.

```artifact src=demos/bias-variance.jsx
```

One difference from the deck's $\mathbb E_D$: this demo keeps the ten $x$ positions fixed
and redraws only the noise, so its variance is entirely noise-driven. Redrawing the $x$'s
too makes the high-degree fits blow up, with variances of $10^3$ and more, which a
forty-sample average cannot display. The deck's own example, next, is the other extreme:
the $x$'s are random and there is no noise.

Where the sum bottoms out. The minimum of $\textbf{bias} + \textbf{var}$ is where the two
**slopes cancel**, with bias falling exactly as fast as variance rises. It is not in
general where the curves cross. A two-line counterexample: if
$\operatorname{bias}(M) = 1/M^2$ and $\operatorname{var}(M) = M/8$, the curves cross at
$M = 2$, where the sum is $0.5$, but the sum keeps falling to about $0.47$ at
$M = 16^{1/3} \approx 2.52$.

## The example: $\mathbb H_0$ vs. $\mathbb H_1$ on $\sin(\pi x)$

*Slide 29.* The target is $f(x) = \sin(\pi x)$ on $[-1, 1]$, with no noise, and $x$ drawn
uniformly (LFD's setting; the slide leaves $P(x)$ implicit). You get **two** training
examples. Two candidate hypothesis sets:

$$
\mathbb H_0:\ h(x) = b,
\qquad
\mathbb H_1:\ h(x) = ax + b.
$$

**With unlimited data** (slide 30), each set's best member:

| | Best hypothesis | $E_{\text{out}}$ |
|---|---|---|
| $\mathbb H_0$ | $b = 0$ | $\mathbb E[\sin^2(\pi x)] = 0.50$ |
| $\mathbb H_1$ | $a = 3/\pi \approx 0.955$, $b = 0$ | $\tfrac12 - \tfrac{3}{\pi^2} \approx 0.20$ |

(The line comes from least squares against the whole function:
$a = \mathbb E[x\sin(\pi x)]/\mathbb E[x^2] = (1/\pi)/(1/3)$.) On approximation alone,
$\mathbb H_1$ wins easily.

**With two points** (slide 31), $\mathbb H_0$ fits the average of the two $y$'s, and
$\mathbb H_1$ fits the line through both points. Repeat over many datasets (slides 32-33).
$\mathbb H_0$'s horizontal lines cluster in a narrow band around $\bar g \approx 0$.
$\mathbb H_1$'s lines fan out across the whole panel, and its $\bar g$ is a tilted line
inside a very wide band. The spread is not from steep lines. A line through two points of
the curve has slope $f'(\xi) = \pi\cos(\pi\xi)$ for some $\xi$ between them, by the mean
value theorem, so no fitted slope exceeds $\pi$. What makes the variance large is a slope
of up to $\pi$ carried across an interval of width 2, far from the two points that fixed
it.

Slides 32-33 on one canvas per hypothesis set, with $N$ on a slider:

```artifact src=demos/h0-vs-h1.jsx
```

The verdict (slide 34):

| | bias | var | $\mathbb E_D[E_{\text{out}}]$ |
|---|---|---|---|
| $\mathbb H_0$ | 0.50 | 0.25 | **0.75** |
| $\mathbb H_1$ | 0.21 | 1.69 | 1.90 |

$\mathbb H_0$ wins, by a wide margin. The slide's banner: "Match the model complexity to
the data resources and not the target complexity."

Checked for this note. For $\mathbb H_1$, integrating numerically over the two $x$'s
gives bias 0.207 and variance 1.676, so the slide's 1.69 is a simulation estimate running
slightly high; the verdict does not change. $\mathbb H_0$'s numbers are exact by hand. $\bar g = \mathbb E[b] = 0$, so bias
$= \mathbb E[\sin^2(\pi x)] = \tfrac12$. And $b$ is the mean of $N$ values each with
variance $\tfrac12$, so var $= \tfrac{1}{2N}$.

Two details worth taking from the tables:

- $\mathbb H_1$'s bias (0.21) is *not* its best-in-class error (0.20). $\bar g$ is the
  average of what learning produces, not the best line in the set, and the two need not
  coincide.
- **The winner depends on $N$.** This is the slider in the figure above; the table
  records it, computed for this note rather than taken from the deck. The $\mathbb H_0$ column is exact,
  $\tfrac12 + \tfrac{1}{2N}$. The $\mathbb H_1$ column is simulated (two million datasets
  at small $N$), and its bias stays near 0.20 throughout.

| $N$ | $\mathbb H_0$: $\mathbb E_D[E_{\text{out}}]$ | $\mathbb H_1$: $\mathbb E_D[E_{\text{out}}]$ | Winner |
|---|---|---|---|
| 2 | 0.750 | 1.88 | $\mathbb H_0$ |
| 3 | 0.667 | 0.91 | $\mathbb H_0$ |
| 4 | 0.625 | 0.55 | $\mathbb H_1$ |
| 10 | 0.550 | 0.26 | $\mathbb H_1$ |
| 20 | 0.525 | 0.22 | $\mathbb H_1$ |

Bias hardly moves with $N$; variance is what falls. $\mathbb H_1$ takes over at $N = 4$,
without anything changing about $f$.

### Reconciling with L4

L4's slide 27 said a more complex $f$ forces a more complex $\mathbb H$. This lecture says
target complexity makes overfitting *worse* (slide 5), and the banner says to match the
model to the data, not the target. These are not in conflict. Both describe where the
minimum of $\textbf{bias} + \textbf{var}$ sits, and that minimum depends on $f$ *and* on
$N$:

- A harder $f$ raises the bias of a small $\mathbb H$, which pushes the best choice toward
  bigger sets. That is L4's statement.
- A small $N$ raises the variance of a big $\mathbb H$, which pushes the best choice back
  toward smaller ones. That is this lecture's statement, and at $N = 2$ it wins by a mile.
- Slide 5's third row is a claim about a *fixed* $\mathbb H$. The part of a harder target
  that $\mathbb H$ cannot represent acts like noise, so the same fit overfits more. It
  does not say which $\mathbb H$ to switch to.

L4's schematic hid the second bullet because its complexity penalty was drawn at one fixed
$N$. The $N$ table above is the missing axis.

## What changed from note 05's preview

Note 05 previewed this lecture from the syllabus before the deck was posted. The preview
has been removed from note 05, and its demo is the one in the bias-variance section above.
What the deck changed:

- **Vocabulary.** The deck says **bias** for what the preview called $\text{bias}^2$. Same
  quantity.
- **Noise.** The preview wrote $E_{\text{out}} = \text{bias}^2 + \text{variance} + \sigma^2$.
  The deck's derivation is noiseless and has no $\sigma^2$. Both are right, for different
  targets.
- **The minimum.** The preview said the minimum sits where the curves cross. That was
  wrong: the minimum is where the slopes cancel, and the demo's caption now says so.
- **Missing from the preview:** validation as an estimator (its mean and variance), fold
  back, the $\ln M$ cost of model selection, and the $\sin(\pi x)$ example. That example
  carries the lecture's actual conclusion.

## Practice

On paper, cold. Each has a check.

**Overfitting and regularization.**

1. Five noisy points from a quadratic, fitted with a quartic. State $E_{\text{in}}$ without
   computing anything, and say why the noise level does not affect it. *Check:* five
   coefficients, five points: the design matrix is square, the fit interpolates, and
   $E_{\text{in}} = 0$ for any noise.
2. From the slide 6 table, compute $E_{\text{out}} - E_{\text{in}}$ for all four fits.
   Explain why the noiseless experiment still produces the worst gap. *Check:* the gaps
   are 0.077, 8.97, 0.091 and about 7680; the part of the 50th-order target that
   $\mathbb H_{10}$ cannot represent plays the role of noise.
3. Show that the two lines of the slide 7 ridge objective are equal only if $E_{\text{in}}$
   is the bare RSS, and rewrite the first line for LFD's $E_{\text{in}} = \frac1N \operatorname{RSS}$.
   Then show that the minimizer is L5's $(X^{\mathsf T}X + \lambda I)^{-1}X^{\mathsf T}y$ with the *same*
   $\lambda$. *Check:* multiply the objective by $N$; a positive constant does not move the
   minimizer.

**Validation.**

4. Prove $\mathbb E[E_{\text{val}}(g^-)] = E_{\text{out}}(g^-)$. Point to the step that
   fails if $g^-$ was trained on some of the validation points. *Check:* it is the step
   $\mathbb E[e(g^-(x_n), y_n)] = E_{\text{out}}(g^-)$, which needs $(x_n, y_n)$ independent
   of $g^-$.
5. With 0-1 error and $E_{\text{out}}(g^-) = 0.1$, find $\sigma^2(g^-)$ and the standard
   deviation of $E_{\text{val}}$ at $K = 100$ and at $K = 400$. *Check:* a Bernoulli error
   has $\sigma^2 = 0.1 \times 0.9 = 0.09$; the standard deviations are $0.03$ and $0.015$.
6. $N = 100$. Apply the rule of thumb, then explain why $K = 80$ would give a *more*
   precise estimate of a *worse* hypothesis. *Check:* $K = 20$; at $K = 80$, $g^-$ is
   trained on 20 points.
7. After fold-back, which hypothesis do you ship, which error do you report, and is the
   report biased up or down for what you shipped? *Check:* ship $g$, report
   $E_{\text{val}}(g^-)$, which is pessimistic for $g$ on the learning-curve assumption.
8. You pick the best of $M = 10$ values of $\lambda$ by one validation set. Why is the
   winner's $E_{\text{val}}$ optimistic, and which L4 argument is this? *Check:* it is the
   minimum of ten noisy estimates, which is the $M$-bins argument; the bound picks up
   $\sqrt{\ln M / K}$.
9. $N = 1000$, one training costs one second. Compare the cost of leave-one-out with
   10-fold. Then say what $K$ means in each of the three places the deck uses it.
   *Check:* 1000 versus 10 trainings; $K$ is validation size, fold count, and number of
   simulated datasets.

**Bias and variance.**

10. Derive $\mathbb E_D[E_{\text{out}}(g^{(D)})] = \textbf{bias} + \textbf{var}$ from the
    definition, naming the identity used at each step. Then redo it with
    $y = f(x) + \varepsilon$ and find where $\sigma^2$ enters. *Check:* the cross term
    $-2\ \mathbb E[(g - f)\varepsilon]$ vanishes because $\varepsilon$ has mean zero and is
    independent of $g^{(D)}$.
11. For $\mathbb H_0$ on $\sin(\pi x)$ with $N$ points, show bias $= \tfrac12$ and
    var $= \tfrac{1}{2N}$ exactly. *Check:* $\mathbb E[\sin(\pi x)] = 0$ and
    $\mathbb E[\sin^2(\pi x)] = \tfrac12$ for uniform $x$ on $[-1, 1]$.
12. Compute the best line in $\mathbb H_1$ against $\sin(\pi x)$ and its error. Then
    explain why it differs from $\mathbb H_1$'s bias at $N = 2$. *Check:* $a = 3/\pi$,
    error $\tfrac12 - 3/\pi^2 \approx 0.196$; $\bar g$ is an average of learned lines, not
    the least-squares line.
13. With $\operatorname{bias}(M) = 1/M^2$ and $\operatorname{var}(M) = M/8$, find where the
    curves cross and where their sum is smallest. *Check:* they cross at $M = 2$; the
    minimum is at $M = 16^{1/3} \approx 2.52$, which is why "pick the crossing" is the
    wrong rule.

---

> Next up: quiz 1 on 09/24, then on 09/29 linear models for classification (logistic
> regression, and loss functions for binary and multi-class problems). Cross-entropy from
> [L4](note.html?course=CSCI-UA-473&note=04-feasibility-of-learning)'s loss table is about
> to become the main loss rather than a table entry.
