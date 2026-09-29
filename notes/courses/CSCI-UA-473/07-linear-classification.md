---
title: "7 - Linear Models for Classification: Logistic Regression"
date: "2026-09-29"
---

## Roadmap

*Slide 2.* The outline names four items:

1. Linear models for classification: logistic regression
2. Iterative optimization: gradient descent (a.k.a. batch gradient descent), stochastic
   gradient descent, mini-batch gradient descent
3. Non-linear transformations
4. Error measures

The deck runs past its own outline. Slides 34-40 add a fifth part, the **probabilistic
interpretation**: Bayes' theorem and Bayesian decision theory. The syllabus gives this
deck's material three dates: 09/29 for logistic regression and iterative optimization,
10/01 for error metrics, 10/06 for the probabilistic interpretation. So the deck probably
continues into the next two lectures. The syllabus also lists loss functions for
**multi-class** classification under 09/29, and the deck has none. Softmax shows up
first in Lab 3 (10/02).

The slides on gradient descent and non-linear transforms are adapted from *Learning from
Data* (LFD), as in L6. So is the derivation of the logistic loss, from LFD section 3.3.

## One applicant, three questions

*Slides 3-5.* A bank receives a credit card application with a feature vector $x$:
education, employment, credit score, income, criminal record, whether the applicant owns
a house or a car. With the bias folded in as $x_0 = 1$, as in
[L3](note.html?course=CSCI-UA-473&note=03-components-of-learning), the linear signal is

$$
s = \sum_{i=0}^{d} w_i x_i = w^{\mathsf T}x,
\qquad w = [w_0, w_1, \dots, w_d],\quad x = [1, x_1, \dots, x_d].
$$

The bank can ask three questions of that one signal, and the deck gives one lecture to each:

| Question | Output | Model | Loss | Training |
|---|---|---|---|---|
| Extend credit? | $\pm 1$ | $h(x) = \operatorname{sign}(s)$ | classification (0-1) | PLA, L3 |
| How much credit? | real number | $h(x) = s$ | squared | closed form, L5 |
| **Probability of default?** | in $[0, 1]$ | $h(x) = \sigma(s)$ | cross-entropy | gradient descent, **this lecture** |

The third row is the "something in the middle" of slide 5. Its output is a real number, like
regression's, but bounded like a probability. Slide 5's last two builds explain why it is
**not a regression problem**. Regression needs the target value at each training point,
and the bank never observes a probability of default. It only observes whether each past
customer defaulted, a $\pm 1$ label. (Regressing on those labels with squared loss, which the
deck does not try, fails in a second way: a line is unbounded, so its outputs leave
$[0, 1]$.)

## The model

*Slide 6.* The target is now a probability,

$$
f(x) = \mathbb P[y = +1 \mid x],
$$

but the data never contain a value of $f$. Each label is one draw from the **noisy target**

$$
P(y \mid x) =
\begin{cases}
f(x) & y = +1,\\
1 - f(x) & y = -1.
\end{cases}
$$

That is L5's noisy target again, with a coin flip where L5 had additive Gaussian noise.
Two customers with the same $x$ can have different labels, and neither label is wrong.

*Slide 7.* To turn the unbounded signal $s$ into something positive, continuous and
bounded between 0 and 1, pass it through the **logistic function**

$$
\sigma(s) = \frac{e^{s}}{1 + e^{s}} = \frac{1}{1 + e^{-s}},
$$

and model $f$ with the hypotheses $h_w(x) = \sigma(w^{\mathsf T}x)$. The deck calls
$\sigma$ a **soft threshold**. Compare it with PLA's hard threshold:
$\sigma(s) \to 1$ as $s \to \infty$ and $\to 0$ as $s \to -\infty$, just like
$\operatorname{sign}$, but near $s = 0$ it moves smoothly through $\tfrac12$. Far from the
boundary the model is confident, and near it the model hedges. The deck uses "logistic" and
"sigmoid" interchangeably for the same function.

## Likelihood

*Slide 8.* Suppose $h_w$ were the target. Then the probability of seeing label $y$ at
$x$ is $\sigma(w^{\mathsf T}x)$ for $y = +1$ and $1 - \sigma(w^{\mathsf T}x)$ for
$y = -1$. One identity merges the two cases:

$$
\sigma(-s) = \frac{1}{1 + e^{s}} = 1 - \frac{e^{s}}{1 + e^{s}} = 1 - \sigma(s),
$$

so that

$$
P(y \mid x) = \sigma(y \cdot w^{\mathsf T}x).
$$

This compact form is why the deck labels classes $\pm 1$ and not $0/1$: multiplying
by $y$ flips the sign of the signal exactly when the label is negative. The product
$y\,w^{\mathsf T}x$ is the **margin**, the quantity
[L4](note.html?course=CSCI-UA-473&note=04-feasibility-of-learning)'s loss figure put on its
horizontal axis. It is positive when $h$ classifies the example correctly and grows with
confidence.

*Slide 9.* The training points are drawn i.i.d., so the likelihood of the whole training set
factors:

$$
P(Y \mid X) = \prod_{i=1}^{N} P(y_i \mid x_i) = \prod_{i=1}^{N} \sigma(y_i\, w^{\mathsf T}x_i).
$$

Learning means choosing $w$ to make this as large as possible: **maximum likelihood
estimation**. In practice you minimize $-\frac1N \log P(Y \mid X)$, the negative log
likelihood. The deck says this is "for computational stability" and that the two problems
are equivalent because $-\log$ is monotonically decreasing. Both claims hold, and the first one
is concrete. With $N = 1100$ examples each predicted at probability $\tfrac12$, the product is
$2^{-1100}$. The smallest positive double is about $2^{-1074}$, so the product rounds to
0 and every $w$ ties. The log turns the product into a sum of moderate numbers. The
$\frac1N$ is a positive constant and does not move the minimizer.

## The loss: cross-entropy

*Slide 10.* Carry out the log:

$$
E_{\text{in}}(w) = -\frac1N \log \prod_{i=1}^{N} \sigma(y_i\, w^{\mathsf T}x_i)
= \frac1N \sum_{i=1}^{N} \log \frac{1}{\sigma(y_i\, w^{\mathsf T}x_i)}
= \frac1N \sum_{i=1}^{N} \log\big(1 + e^{-y_i\, w^{\mathsf T}x_i}\big).
$$

The last step uses $1/\sigma(t) = (1 + e^{t})/e^{t} = 1 + e^{-t}$. Each term is a
function of the margin alone. It is near 0 when $y_i\,w^{\mathsf T}x_i$ is large and
positive (correct and confident), $\log 2$ at the boundary, and it grows roughly linearly
in the margin when the example is misclassified. So minimizing it pushes $w$ to classify
each $x_i$ correctly, with a penalty proportional to how badly each point is missed.
L4's [loss-shapes figure](note.html?course=CSCI-UA-473&note=04-feasibility-of-learning)
drew exactly this curve next to the 0-1 step.

The same slide also writes the loss in its better-known form, **binary cross-entropy**:

$$
E_{\text{in}}(w) = -\sum_{i=1}^{N} \Big[y_i \log \sigma(w^{\mathsf T}x_i) + (1 - y_i)\log\big(1 - \sigma(w^{\mathsf T}x_i)\big)\Big].
$$

Taken literally, the slide's two formulas disagree in two ways:

1. **The labels change.** This form only makes sense for $y_i \in \{0, 1\}$: with
   $y_i = -1$, the factor $(1 - y_i) = 2$ doubles the second term, and the first term
   turns into a reward. The rest of the deck uses $\pm 1$. Substitute
   $t_i = (1 + y_i)/2$, which maps $-1 \mapsto 0$ and $+1 \mapsto 1$, and the two
   forms agree term by term. When $t_i = 1$ the bracket is $\log \sigma(s)$, and when
   $t_i = 0$ it is $\log(1 - \sigma(s)) = \log \sigma(-s)$. Both equal
   $-\log(1 + e^{-y_i s})$. L4's loss table already wrote cross-entropy with $0/1$ labels.
2. **The $\frac1N$ is missing** from the second form. It does not change the minimizer,
   but the two lines on the slide are not equal as written.

## Why there is no closed form

*Slide 11.* Linear regression set the gradient to zero and solved: $\hat w =
(X^{\mathsf T}X)^{-1}X^{\mathsf T}y$. PLA had its own update rule,
$w(t+1) \leftarrow w(t) + y(t)\,x(t)$. Neither works here. The gradient of the logistic
loss is

$$
\nabla E_{\text{in}}(w) = -\frac1N \sum_{i=1}^{N} \frac{y_i\, x_i}{1 + e^{\,y_i\, w^{\mathsf T}x_i}}
= -\frac1N \sum_{i=1}^{N} y_i\, x_i\ \sigma(-y_i\, w^{\mathsf T}x_i),
$$

and $w$ sits inside the $\sigma$'s. Setting this to zero gives $d + 1$ equations that are
transcendental in $w$, with no formula for the solution. PLA does not apply either, because
it is built for the hard threshold. Hence gradient descent.

Two facts the deck does not state, both of which decide what gradient descent can do here:

- **$E_{\text{in}}$ is convex.** Differentiating once more gives the Hessian
  $\frac1N \sum_i \sigma(s_i)\big(1 - \sigma(s_i)\big)\, x_i x_i^{\mathsf T}$, with
  $s_i = w^{\mathsf T}x_i$. Every term is a non-negative number times $x_i x_i^{\mathsf T}$,
  which is positive semi-definite. So there are no spurious local minima: wherever the
  descent starts, if it converges it converges to a global minimum. The deck's step-size
  slides talk about "local minima". For this loss the local minimum is also the global one.
- **On linearly separable data there is no minimizer at all.** Take $w^\ast$ with
  $y_i\,w^{\ast\mathsf T}x_i > 0$ for every $i$. Scaling $w^\ast$ by a growing $c$ sends every
  margin to $+\infty$ and $E_{\text{in}}(c\,w^\ast)$ to 0, but no finite $w$ reaches 0. Gradient
  descent then runs $\|w\|$ off to infinity, and $\sigma$ hardens toward PLA's step. This is
  one reason to regularize logistic regression, since the $\lambda\|w\|^2$ of L5 and L6 restores a
  minimizer. It also affects slide 21's example below, which *is* separable after
  the transform.

## Gradient descent

*Slide 12.* The algorithm in outline: start at $w(0)$, then repeatedly find a direction
$\hat v$ in which the loss decreases, and step along it,

$$
w(1) = w(0) + \eta\,\hat v .
$$

$\eta$ is the **learning rate**. On the slide's picture, $E_{\text{in}}$ is a bowl over the
weights and each step rolls the point downhill.

*Slide 13.* Which direction? Take a first-order Taylor expansion of the change in loss for a
unit vector $\hat v$:

$$
\Delta E_{\text{in}} = E_{\text{in}}\big(w(0) + \eta\hat v\big) - E_{\text{in}}\big(w(0)\big)
= \eta\, \nabla E_{\text{in}}\big(w(0)\big)^{\mathsf T}\hat v + O(\eta^2)
\approx \eta\, \nabla E_{\text{in}}\big(w(0)\big)^{\mathsf T}\hat v .
$$

We want the $\hat v$ with the most negative change. The slide gives the answer without the
one-line reason, which is Cauchy-Schwarz: for a unit $\hat v$,

$$
\nabla E_{\text{in}}^{\mathsf T}\hat v \ \ge\ -\|\nabla E_{\text{in}}\|,
$$

with equality exactly when $\hat v$ points opposite the gradient:

$$
\hat v = -\frac{\nabla E_{\text{in}}\big(w(0)\big)}{\big\|\nabla E_{\text{in}}\big(w(0)\big)\big\|}
\qquad\text{(direction of steepest descent).}
$$

Keep the $O(\eta^2)$ in mind. The whole argument is first-order, so it holds only for
steps small enough that the linear approximation is good. The next slide is about what
happens when it isn't.

### Choosing $\eta$

*Slides 14-15.* LFD's three panels:

| $\eta$ | What happens |
|---|---|
| too small | many tiny steps: it gets there, slowly |
| too large | the step overshoots the bottom, lands on the far wall, and bounces; it can diverge |
| variable | large steps far from the minimum, small steps near it |

The heuristic that gives the third panel is to make the step length proportional to the
slope, $\eta_t = \eta\,\|\nabla E_{\text{in}}(w(t))\|$. Substituting into the update with
the unit direction $\hat v$ above:

$$
w(t+1) = w(t) + \eta\,\|\nabla E_{\text{in}}\|\cdot\left(-\frac{\nabla E_{\text{in}}}{\|\nabla E_{\text{in}}\|}\right)
= w(t) - \eta\,\nabla E_{\text{in}}\big(w(t)\big).
$$

The norms cancel, which is why the deck calls the result a **fixed learning rate**
algorithm. The rate on the *gradient* is fixed, but the *step length*
$\eta\|\nabla E_{\text{in}}\|$ still shrinks automatically as the slope flattens near the
minimum. **The slide writes $\Delta w = \eta\,\nabla E_{\text{in}}$ and drops the minus
sign.** That update would step uphill. The correct update is
$\Delta w = -\eta\,\nabla E_{\text{in}}$, and it is what slide 16 actually uses.

### The algorithm

*Slide 16.* Logistic regression, trained by gradient descent:

1. Initialize the weights at $t = 0$ to $w(0)$.
2. For $t = 0, 1, 2, \dots$:
   1. Compute the gradient
      $g_t = -\frac1N \sum_{i=1}^{N} \dfrac{y_i\, x_i}{1 + e^{\,y_i\, w(t)^{\mathsf T}x_i}}$.
   2. Set the direction $v_t = -g_t$.
   3. Update $w(t+1) = w(t) + \eta\, v_t$.
3. Return the final $w$.

Step 2 has no stopping rule on the slide. LFD's are: stop when the gradient is small, or
when a maximum number of iterations is reached, or both. The first alone is unreliable on
flat regions, and the second alone ignores convergence. On separable data (above), the
gradient only approaches zero as $\|w\| \to \infty$, so only the iteration cap stops it.

It is worth reading $g_t$ as a weighted PLA. Each example contributes $-y_i x_i$, which is
PLA's update direction with the sign flipped for descent, weighted by
$\sigma(-y_i\,w^{\mathsf T}x_i)$. That weight is the probability the model currently
gives to the *wrong* label. Badly misclassified points weigh nearly 1, confidently correct
ones nearly 0. PLA gives weight 1 to one misclassified point at a time and 0 to all the
others.

## Batch, stochastic and mini-batch

*Slides 17-19.* The three variants share the update $w \leftarrow w - \eta\, g$. They differ
only in how many examples $g$ averages over.

| Variant | $g$ averages over | Gradient evaluations per update | Updates per pass over the data |
|---|---|---|---|
| **Batch** (slide 17) | all $N$ | $N$ | 1 |
| **Stochastic** (SGD, slide 18) | 1 example, picked at random | 1 | $N$ |
| **Mini-batch** (slide 19) | $M$ examples, picked at random | $M$ | $N/M$ |

SGD's single-example gradient is
$\nabla e_i(w) = -\dfrac{y_i x_i}{1 + e^{\,y_i\, w^{\mathsf T}x_i}}$, one term of the batch
sum. Why following it works at all: with $i$ uniform on $\{1, \dots, N\}$,

$$
\mathbb E_i\big[\nabla e_i(w)\big] = \frac1N \sum_{i=1}^{N} \nabla e_i(w) = \nabla E_{\text{in}}(w).
$$

Each SGD step is an **unbiased** but noisy estimate of the batch step. That is L6's
validation argument ($\mathbb E[E_{\text{val}}] = E_{\text{out}}$) applied to gradients. A
mini-batch averages $M$ such terms, so it has the same mean and a smaller variance.
For independent draws the variance falls like $1/M$, just as $E_{\text{val}}$'s did with $K$.

Two consequences, both visible in slide 20's picture:

- **The zigzag.** Batch descent follows the true gradient and heads straight downhill.
  SGD follows a noisy estimate and zigzags, and mini-batch zigzags less.
- **No settling down at a fixed $\eta$.** At the minimum the batch gradient is zero, but
  the individual $\nabla e_i$ are not. SGD with a constant $\eta$ keeps jittering in a
  cloud around $w^\ast$ whose size scales with $\eta$. The fix is to decay $\eta$ over
  time, which the deck does not cover.

What SGD buys is cheapness. One SGD update costs one gradient evaluation instead of $N$,
so in the time batch descent takes one careful step, SGD takes $N$ rough ones, and early
in training rough is good enough.

Two notation slips on slide 19. The gradient's sum runs over "$(x_j, y_i) \in B$", which
should be $(x_j, y_j)$. The batch is written
$B = (x_i, y_i), \dots, (x_{i+M}, y_{i+M})$, which lists $M + 1$ examples; the intent is
$M$. A symbol warning as well: this $M$ is a **batch size**. L4's $M$ counted hypotheses and
L6's counted models.

The three variants on the same data, with $\eta$ on a slider. The horizontal axis on the
right is **epochs** (gradient evaluations divided by $N$), the fair comparison, because
one batch step costs as much as $N$ SGD steps.

```artifact src=demos/logistic-gd.jsx
```

What the figure shows, starting at $E_{\text{in}} = 1.48$ with a minimum of $0.50$:

- **Early, the cheap steps win.** At the default $\eta = 0.5$, one epoch brings batch
  descent to 1.28, mini-batch to 0.87 and SGD to 0.55: forty rough steps beat one
  careful one.
- **Late, the noise costs.** At $\eta = 2$, batch descent reaches the minimum within the
  twelve epochs. SGD at the same $\eta$ ends at 1.6, because a step sized for the average
  gradient is too big for a single example's.
- **Too large.** From $\eta = 8$ up, the batch path bounces from wall to wall across the
  valley, which is slide 14's middle panel.
- **Separable data.** The toggle swaps in data that a threshold on $x$ separates. There is
  no $w^\ast$ any more; $E_{\text{in}}$ keeps falling and $\|w\|$ keeps growing, faster the
  larger $\eta$ ($\|w\| \approx 6$ after twelve epochs at $\eta = 8$).

## Non-linear transformations

*Slides 21-22.* A dataset that no line separates: one class inside a circle, the other
outside. LFD's example uses the circle $x_1^2 + x_2^2 = 0.6$, and the hypothesis

$$
h(x) = \operatorname{sign}\big(-0.6 + x_1^2 + x_2^2\big)
$$

separates it perfectly, giving $+1$ outside the circle and $-1$ inside. The hypothesis is
not linear in $x$, but it *is* linear in new features. Define

$$
z = \Phi(x) = [1,\ x_1^2,\ x_2^2],
\qquad
\tilde w = [-0.6,\ 1,\ 1],
$$

and $h(x) = \operatorname{sign}(\tilde w^{\mathsf T}z)$. In $z$-space the circle becomes the
line $z_1 + z_2 = 0.6$, and every tool in this lecture applies unchanged: PLA,
logistic regression, gradient descent. This is
[L5](note.html?course=CSCI-UA-473&note=05-linear-regression)'s basis expansion, now for
classification. The model stays linear in the weights, which is the only linearity the
algorithms need.

```artifact src=demos/feature-transform.jsx static
```

Slide 22 carries two warnings in red:

- **Choose the transformation before looking at the data.** If you look at the scatter,
  notice a circle, and pick $\Phi$ to match, the three-parameter model you end up with
  does not have a three-parameter generalization bound. The hypothesis set you actually
  searched includes every transform you considered while looking. That is
  [L4](note.html?course=CSCI-UA-473&note=04-feasibility-of-learning)'s $M$ growing without
  anyone writing it down, and LFD calls it **data snooping**.
- **Domain knowledge is allowed.** Knowledge that does not come from *this* $D$ does not
  enlarge the search, so it costs nothing in the bound.

*Slide 23.* The price of transforming. The left panel is a linear fit that misclassifies a
couple of points, $E_{\text{in}} > 0$. The right panel is the full fourth-order polynomial
transform,

$$
\Phi(x) = [1,\ x_1,\ x_2,\ x_1^2,\ x_1x_2,\ x_2^2,\ x_1^3,\ x_1^2x_2,\ x_1x_2^2,\ x_2^3,\ x_1^4,\ x_1^3x_2,\ x_1^2x_2^2,\ x_1x_2^3,\ x_2^4],
$$

15 features in all ($1 + 2 + 3 + 4 + 5$). It reaches $E_{\text{in}} = 0$ with a boundary
that wraps islands around individual points. The slide's list prints $x_1^3x_2$ twice
and omits $x_1x_2^3$; the version above is corrected. The slide's conclusion is
[L6](note.html?course=CSCI-UA-473&note=06-overfitting-validation)'s: balance the complexity
of the hypothesis set against the data, rather than reaching for whatever transform
separates the sample. Going from 3 weights to 15 is exactly the move from
$\mathbb H_2$ to $\mathbb H_{10}$ in L6's slide 6 table.

## From probabilities to classes

*Slide 24.* Once trained, logistic regression outputs a probability for a new input $x'$,
$P(y \mid x') = \sigma(w^{\mathsf T}x')$. To make a decision, pick a **threshold**
$\theta$: predict one class above it and the other below. The deck calls $0.5$ a natural
choice, "not necessarily optimal", and "sometimes not even the correct one". Slide 40, at the
end of this note, derives which threshold *is* correct for given error costs.

*Slide 25.* The figure behind every metric that follows. It shows two distributions of the
model's output, one for the truly negative examples and one for the truly positive ones,
overlapping in the middle. A vertical threshold cuts both, and the four pieces are the four
outcomes:

| | truly positive | truly negative |
|---|---|---|
| **above threshold** | true positive (TP) | false positive (FP) |
| **below threshold** | false negative (FN) | true negative (TN) |

Sliding the threshold trades one kind of error for the other. Moving it right shrinks FP and
grows FN. The only way to shrink both at once is to pull the two distributions apart, which
means a better model.

## The confusion matrix

*Slide 26.* The same four counts as a table, for a pneumonia detector. Rows are the
prediction and columns are reality, the same orientation as L4's cost matrices, where rows
were $h$ and columns $f$.

| | pneumonia present | pneumonia absent |
|---|---|---|
| **predicted present** | TP | FP: **Type 1 error**, false alarm, overestimation |
| **predicted absent** | FN: **Type 2 error**, missed, underestimation | TN |

L4's fingerprint example used the same matrix under other names. A **false accept** is a
false positive (the verifier says "it's you" and it isn't), and a **false reject** is a false
negative. The supermarket feared FN and the CIA feared FP. The slide's closing line, "set
the threshold that will best serve your purpose", is the same point as L4's "the error measure
is defined by the user".

## Metrics from the confusion matrix

*Slides 27-29.*

| Metric | Formula | Question it answers |
|---|---|---|
| **Precision** | $\dfrac{TP}{TP + FP}$ | of the patients flagged, what fraction are sick? |
| **Recall** = **sensitivity** = TPR | $\dfrac{TP}{TP + FN}$ | of the sick patients, what fraction are flagged? |
| **Specificity** | $\dfrac{TN}{TN + FP}$ | of the healthy people, what fraction are cleared? |
| **F1** | $\dfrac{2\,TP}{2\,TP + FP + FN}$ | harmonic mean of precision and recall |
| **MCC** | $\dfrac{TP\cdot TN - FP\cdot FN}{\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}$ | a correlation between prediction and truth, in $[-1, 1]$ |

Recall and sensitivity are the same number under two names. The deck prints the formula
twice on slide 28, once under each.

Where F1 comes from: with $P = TP/(TP+FP)$ and $R = TP/(TP+FN)$,

$$
\frac{2}{1/P + 1/R} = \frac{2}{\frac{TP + FP}{TP} + \frac{TP + FN}{TP}} = \frac{2\,TP}{2\,TP + FP + FN}.
$$

The harmonic mean is dragged toward the smaller of the two, so a classifier cannot buy a high
F1 by maxing one and ignoring the other. F1 never looks at TN. MCC is the one metric on the
list that uses all four cells symmetrically: swap which class you call positive and MCC is
unchanged, while precision, recall and F1 are not.

A structural point that explains slides 30-31: **the metrics divide along different
directions of the table.** Sensitivity and specificity each stay inside one *column* (one
true class). Precision stays inside one *row* (one prediction), so it mixes the two classes,
and it depends on how common each class is.

## Why accuracy is not enough

*Slide 30.* Accuracy is the fraction of test examples classified correctly, and it can
mislead. The deck's example is a pneumothorax detector advertised as 99.9% accurate, for a
condition with prevalence 0.1%. The classifier that answers "no pneumothorax" for everyone
scores exactly $1 - 0.001 = 99.9\%$ without looking at a single X-ray. Its recall is 0,
its precision is $0/0$ (it never predicts positive), and its MCC is undefined. The
utility of a model depends on the prevalence, and accuracy hides the prevalence.

## ROC and AUC

*Slide 31.* The **receiver operating characteristic** curve comes from radar operators in
WW2, who had to judge whether blips were enemy planes. It plots

$$
\text{TPR} = \text{sensitivity} = \frac{TP}{TP + FN}
\quad\text{against}\quad
\text{FPR} = 1 - \text{specificity} = \frac{FP}{FP + TN}
$$

as the threshold sweeps from one end to the other. A strict threshold sits at $(0, 0)$ and
flags nobody. A lenient one sits at $(1, 1)$ and flags everybody. Every classifier's curve
joins those two corners, and a random classifier lies on the diagonal between them.

"The shape of the curve is independent of the class distribution." This follows from the
structural point above. TPR is computed from the positive column alone and FPR from the
negative column alone. Changing the prevalence rescales each column but leaves each
within-column fraction unchanged. Precision, a row fraction, does change. So the ROC curve
describes the model, and precision describes the model *deployed at a given prevalence*.

*Slide 32.* **Choosing a threshold from the ROC.** Fix the requirement first, for example
"sensitivity 0.95: I can afford to miss only 5% of sick patients." Then move along the
curve to the point with TPR 0.95 and the lowest FPR. That point is the **operating point**,
and the threshold that produces it is your threshold.

*Slide 33.* The **area under the curve** summarizes all thresholds in one number, and it has
a direct reading. AUC is the probability that the model scores a randomly chosen positive
above a randomly chosen negative. So it depends only on how the model *ranks* examples. It is
**scale-invariant**: apply any increasing function to the scores and the AUC does not change.
It is also **threshold-invariant**, because it never picks one threshold.

| AUC | Meaning |
|---|---|
| 1 | every positive ranked above every negative |
| 0.5 | ranking no better than a coin flip |
| 0 | every positive ranked *below* every negative |

The last row needs a comment the slide doesn't give. A model with AUC 0 has perfect
ranking information, reversed: flip its output and the AUC becomes 1. In general, AUC
below 0.5 means the model has learned the signal backwards, not that it has learned nothing.

The figure below brings slides 25 and 30-33 together. The two humps are the model's
scores for each class, and the threshold slider is slide 25's dashed line. The confusion
matrix is slide 26, counted over 10,000 people. The ROC curve with its operating point is
slides 31-32. Move prevalence to slide 30's 0.1% and watch which numbers change.

```artifact src=demos/roc-threshold.jsx
```

What to look for: the ROC curve and AUC do not move when prevalence changes, and
sensitivity and specificity do not move either. Precision collapses. Accuracy is
$\pi\cdot\text{sensitivity} + (1 - \pi)\cdot\text{specificity}$, a prevalence-weighted
average of the two column rates, so as positives get rarer it slides toward specificity
and says less and less about the positives. (At a threshold where sensitivity equals
specificity it does not move at all, which is why the figure opens at $\theta = 0.6$.)

## Probabilistic interpretation

### Bayes' theorem

*Slide 35.* The joint distribution can be factored two ways,
$P(A, B) = P(A \mid B)P(B) = P(B \mid A)P(A)$. Equating them gives

$$
P(B \mid A) = \frac{P(A \mid B)\,P(B)}{P(A)} = \frac{P(A \mid B)\,P(B)}{P(A \mid B)\,P(B) + P(A \mid \bar B)\,P(\bar B)} .
$$

The slide's example: 1% of the population has COVID; the test is positive for 90% of
people with COVID and for 10% of people without. $A$ is testing positive and $B$ is having
COVID. The slide sets it up and stops before the number:

$$
P(B \mid A) = \frac{0.9 \times 0.01}{0.9 \times 0.01 + 0.1 \times 0.99} = \frac{0.009}{0.108} = \frac{1}{12} \approx 0.083 .
$$

A positive result means about an 8% chance of having COVID. This example is the
precision calculation from the previous section. The test has sensitivity 0.9 and
specificity 0.9, and at prevalence 1% its precision is $1/12$. In general,

$$
\text{precision} = \frac{\pi\cdot\text{TPR}}{\pi\cdot\text{TPR} + (1 - \pi)\cdot\text{FPR}},
$$

with $\pi$ the prevalence: Bayes' theorem with the ROC coordinates plugged in. That is
why precision moved in the figure and the ROC did not. The figure's "COVID test" button
builds this test: it sets the separation so that sensitivity and specificity are both 0.90
at $\theta = 0.5$, and the prevalence to 1%. Precision reads 0.083.

### Bayesian decision theory

*Slide 36.* A robot sorts apples from oranges on a conveyor belt. The obvious approach, with
what this lecture has built so far: collect 100,000 images of each, train logistic
regression by minimizing $\frac1N\sum_i \log\big(1 + e^{-y_i w^{\mathsf T}x_i}\big)$, and run the
trained model on each new image. The deck then asks whether the *decision* itself can be
formalized probabilistically.

*Slide 37.* The vocabulary:

| Symbol | Name | Meaning |
|---|---|---|
| $c_1, c_2$ | states of nature | apple, orange |
| $P(c_1), P(c_2)$ | **priors** | how common each is, before looking at the image |
| $x$ | feature | a measurement from the image, e.g. object size |
| $P(x \mid c_1), P(x \mid c_2)$ | **class-conditional densities** | how the feature is distributed within each class |

*Slide 38.* Given a new observation $\hat x$, Bayes' rule turns these into the **posterior**:

$$
P(c_j \mid \hat x) = \frac{P(\hat x \mid c_j)\,P(c_j)}{P(\hat x)},
\qquad
P(\hat x) = \sum_{i=1}^{2} P(\hat x \mid c_i)\,P(c_i),
$$

read as posterior = likelihood × prior / evidence. Where the probabilities come from depends
on your school of thought. A **frequentist** takes them only from actual experiments. A
**Bayesian** reads them as degrees of belief, which can rest on opinion.

*Slide 39.* **The decision rule.** Assigning $\hat x$ to $c_2$ is an error with probability
$P(c_1 \mid \hat x)$, and vice versa, so

$$
P(\text{error} \mid \hat x) = \min\big[P(c_1 \mid \hat x),\ P(c_2 \mid \hat x)\big],
$$

and the rule that minimizes it is to pick the larger posterior:

$$
\text{decide } c_1 \iff P(c_1 \mid \hat x) > P(c_2 \mid \hat x) \iff P(\hat x \mid c_1)\,P(c_1) > P(\hat x \mid c_2)\,P(c_2).
$$

The evidence $P(\hat x)$ cancels, since it is the same on both sides. The rule minimizes the
error at every $\hat x$ separately, so it also minimizes the overall error rate
$\int P(\text{error} \mid x)\,P(x)\,dx$.

The slide's two plots are the classic Duda-Hart pair. On the left are the class-conditional
densities, and on the right the posteriors, which sum to 1 at every $x$. The
curve tags read "$P(c_1)$" and "$P(c_2)$" in both plots. They only mark which class each
curve belongs to; they are not the priors. The axis labels, $P(\hat x \mid c_j)$ on
the left and $P(c_j \mid \hat x)$ on the right, say what is actually plotted. Comparing
the two plots shows the priors at work. Near $x \approx 10.5$, the left plot favours
$c_1$ (red is higher), but the right plot favours $c_2$. A larger prior on $c_2$ outweighed
a likelihood ratio that pointed the other way.

The link to logistic regression. Logistic regression is **discriminative**: it models
the posterior $P(y \mid x)$ directly and never touches the priors or the class-conditionals.
Bayesian decision theory as presented here is **generative**: it builds the posterior from
those pieces. They can describe the same thing. With Gaussian class-conditionals that share a
covariance matrix, $\log\frac{P(c_1 \mid x)}{P(c_2 \mid x)}$ works out linear in $x$, so the
posterior is *exactly* $\sigma(w^{\mathsf T}x)$ for some $w$ (a standard result, not in the
deck). Thresholding logistic regression at 0.5 is then the rule on slide 39.

One practical catch in slide 36's own setup, also not in the deck. The training set is
balanced, 100,000 of each class, so the model learns posteriors under priors of
$\tfrac12$. If apples are actually rarer on the belt, the learned probabilities are wrong
by exactly the prior ratio. Posterior odds are likelihood ratio times prior odds, so the
correction is to add $\log\frac{P(c_1)}{P(c_2)}$ to $w^{\mathsf T}x$. This assumes each
class looks the same in the training images as on the belt.

### Risk: the threshold, derived

*Slide 40.* The general version: observations $x \in \mathbb R^d$; classes
$\{c_1, \dots, c_k\}$; actions $\{\alpha_1, \dots, \alpha_a\}$, which can include
something other than classifying, such as **rejection** (refusing to decide and handing the
case to a human); and a loss $\lambda(\alpha_i \mid c_j) = \lambda_{ij}$ for taking action
$\alpha_i$ when the truth is $c_j$. The **conditional risk** of an action is its expected
loss given what was observed:

$$
R(\alpha_i \mid x) = \sum_{j=1}^{k} \lambda(\alpha_i \mid c_j)\,P(c_j \mid x).
$$

(The slide's wording, "when the true state of nature is $c_j$", fits a single $\lambda_{ij}$.
The sum averages over the true state, weighted by the posterior.) For a decision rule
$\alpha(x)$, the **overall risk** is $R = \int R(\alpha(x) \mid x)\,P(x)\,dx$. The **Bayes
decision rule** computes $R(\alpha_i \mid x)$ for every action and takes the smallest,
pointwise, which minimizes $R$. No rule does better.

This answers slide 24's question: which threshold is correct? Take two classes and
two actions, with zero loss for correct decisions. Write $p = P(c_1 \mid x)$, and let
$\lambda_{12}$ be the cost of choosing $c_1$ when the truth is $c_2$ (a false positive, if
$c_1$ is the positive class) and $\lambda_{21}$ the cost of a false negative. Then

$$
R(\alpha_1 \mid x) = \lambda_{12}(1 - p),
\qquad
R(\alpha_2 \mid x) = \lambda_{21}\,p,
$$

and choosing $c_1$ has lower risk exactly when

$$
p > \theta^\ast = \frac{\lambda_{12}}{\lambda_{12} + \lambda_{21}} .
$$

With equal costs, $\theta^\ast = \tfrac12$. That is the deck's "natural" threshold, and it
is correct only when the two errors cost the same. Now apply this to L4's cost matrices, with
$c_1$ = "it's you":

| | false accept costs | false reject costs | accept when $P(\text{you} \mid x) >$ |
|---|---|---|---|
| Supermarket | 1 | 10 | $\tfrac{1}{11} \approx 0.09$ |
| CIA | 1000 | 10 | $\tfrac{1000}{1010} \approx 0.99$ |

L4 described the two operating points as opposite. This formula puts numbers on them:
same model, same probabilities, thresholds at 0.09 and 0.99. It also holds only if
$\sigma(w^{\mathsf T}x)$ is a well-calibrated probability. When it isn't, slide 32's
method of reading the operating point off a validation ROC is the practical substitute.

## Practice

Questions keyed to the places the deck is easiest to misread.

```artifact src=demos/practice-07.jsx math
```

---

> Next up: the syllabus puts error metrics (from probabilities to classes, the confusion
> matrix, ROC and AUC) on 10/01 and the probabilistic interpretation on 10/06, so the
> second half of this note is probably what the next two lectures cover. Lab 3 on 10/02
> codes logistic regression and softmax, and PA 1 is due that day.
