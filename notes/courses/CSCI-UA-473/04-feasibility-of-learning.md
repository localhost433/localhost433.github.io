---
title: "4 - Feasibility of Learning: Hoeffding & Error Measures"
date: "2026-09-15"
---

## Roadmap

*Slide 2.* Six items, and they are in causal order rather than topical order - each one
exists because the previous one left a hole:

1. Why is the feasibility of learning questionable?
2. The bin experiment
3. The Hoeffding inequality
4. Two primary questions in learning
5. How to answer these questions in practice
6. Error measures (loss functions)

The recap slides (3-4) replay the components figure and the PLA picture from
[L3](note.html?course=CSCI-UA-473&note=03-components-of-learning), then add one thing to
the PLA picture that was not there before: an **unseen data point**, dropped onto the plot
next to the learned boundary, under the question *what are the guarantees that the learned
decision boundary will generalize to new unseen data?* That question is the lecture.

## The (un)feasibility argument

*Slides 5-7.* A deliberately brutal setup. Let $f : \mathcal X \to \mathcal Y$ be a Boolean
target function on three Boolean variables - $\mathcal X = \{0,1\}^3$, $\mathcal Y =
\{0,1\}$, so $\mathcal X$ has exactly 8 points. The training set is 5 of them:

$$
D_{\text{Tr}} = \{([000],0),\; ([001],1),\; ([010],1),\; ([011],0),\; ([100],1)\}.
$$

The remaining three inputs - $101$, $110$, $111$ - are unseen. Take $\mathbb H$ to be
**all** Boolean functions on three Boolean variables. The counting:

| Quantity | Value | Why |
|---|---|---|
| $\lvert\mathbb H\rvert$ | $2^{2^3} = 256$ | one bit of output per each of the 8 inputs |
| Consistent with $D_{\text{Tr}}$ | $2^3 = 8$ | the 5 seen outputs are pinned; the 3 unseen ones are free |

The eight survivors agree perfectly on everything you have seen and **completely disagree
with each other** on everything you have not. The slide states the consequence without
softening it:

> No matter what hypothesis space or the function within it you choose based on its
> performance on $D_{\text{Tr}}$, it makes no difference whatsoever as far as the
> performance outside of $D_{\text{Tr}}$ is concerned. Yet, all we care about is the
> performance of the chosen hypothesis outside of $D_{\text{Tr}}$!

This is the same object as the No Free Lunch discussion in L3, run with concrete numbers
instead of a slogan - the `nfl-boolean-cube` figure in
[L3](note.html?course=CSCI-UA-473&note=03-components-of-learning) draws exactly this
256-function grid and shades the consistent subset. Worth re-opening it here, because L4's
answer only makes sense once you accept that the L3 version of the problem is genuinely
unsolvable as stated.

The trap to avoid: reading this as "learning is impossible." What it proves is narrower and
sharper - **with no assumptions, the training data constrains nothing off the training
set.** Every fix in the rest of the lecture is an assumption being added back.

## Is learning doomed?

*Slides 8-9.* "The answer is No!" - but only because assumptions get made. The four the
slide lists:

- How are the data samples drawn?
- What hypothesis set to choose from?
- What can the chosen hypothesis accomplish?
- How to find the best hypothesis?

And the pivot: **probability is the savior here.**

Slide 9 states the price of that pivot precisely, and it is the sentence to memorize
because the true/false questions are built out of it:

> No matter what we do, we cannot claim that we have found a function $g$ which
> **deterministically** replicates the performance of $f$. We can only give probability
> estimates: "$g$ approximates the behavior of $f$ on unseen examples with a certain
> probability, so long as the unseen examples are drawn in the same way as the seen
> examples."

Two hedges in one sentence - *with a certain probability*, and *so long as drawn the same
way*. Neither is decoration. Drop the first and you have a guarantee that does not exist;
drop the second and the bound below is simply false.

## The ball and bin experiment

*Slides 10-15.* A bin holds red and blue balls, in proportions

$$
\mathbb P(\text{red}) = \mu, \qquad \mathbb P(\text{blue}) = 1 - \mu,
$$

with $\mu$ **fixed but unknown**. Draw a ball at random, record its color, replace it,
repeat $N$ times. Let $\nu$ be the fraction of red balls in the sample. We know $\nu$; we
want $\mu$.

The deck walks three scenarios (slides 12-14):

| Sample | Possible? | Likely? |
|---|---|---|
| all red, $\nu = 1$ | yes | highly unlikely |
| all blue, $\nu = 0$ | yes | highly unlikely |
| sample proportions resemble bin proportions | yes | highly likely |

Formally (slide 15), the **Hoeffding inequality**:

$$
\boxed{\;\mathbb P\big[\,\lvert \nu - \mu \rvert > \epsilon\,\big] \le 2e^{-2\epsilon^2 N}\;}
$$

The three readings the slide attaches:

- For large $N$, the probability that $\mu$ and $\nu$ are close is high.
- There is a tradeoff between sample size $N$ and closeness of approximation $\epsilon$ -
  the exponent is $\epsilon^2 N$, so halving the tolerance costs you four times the data.
- **The bound does not depend on $\mu$**, whose value we still do not know.

That last bullet is the whole trick and is the most commonly mis-stated fact on this deck.
The bound is useful *because* it is free of the unknown. It buys a statement of the form
"$\nu$ is close to $\mu$" without ever needing to know $\mu$ - which is exactly the
situation learning is in.

Note also what the inequality is a statement *about*. The randomness is in the **sample**,
not in $\mu$. $\mu$ is a fixed number; $\nu$ is the random variable. A reading like "$\mu$
has a 95% chance of lying near $\nu$" is Bayesian and is not what this says.

The experiment, with the bound drawn over it. Drag $\mu$ and watch the bound sit still; then take the two presets in turn to feel what the $\epsilon^2 N$ exponent costs.

```artifact src=demos/hoeffding-bin.jsx
```

## Connecting the bin to learning

*Slides 16-20.* The translation table, element by element:

| Bin experiment | Learning |
|---|---|
| unknown $\mu$ | unknown $f : \mathcal X \to \mathcal Y$ |
| a ball | a data point $x \in \mathcal X$ |
| the bin | the entire input space $\mathcal X$ |
| ball is **red** | $h(x) \ne f(x)$ |
| ball is **blue** | $h(x) = f(x)$ |
| the drawn sample | the training set, drawn independently under some $P$ |
| $\nu$ | fraction of training points where $h$ differs from $f$ |

which renames the two quantities:

$$
\mu = \mathbb P[h(x) \ne f(x)] \equiv E_{\text{out}}(h)
\qquad \text{(out-of-sample error)},
$$
$$
\nu = \frac{1}{N}\sum_{i=1}^{N} \big[h(x_i) \ne f(x_i)\big] \equiv E_{\text{in}}(h)
\qquad \text{(in-sample error)}.
$$

Substituting into Hoeffding (slide 20):

$$
\mathbb P\big[\,\lvert E_{\text{in}}(h) - E_{\text{out}}(h) \rvert > \epsilon\,\big]
\le 2e^{-2\epsilon^2 N},
$$

stated on the slide with its two conditions spelled out: **for a hypothesis $h$ fixed
before looking at the data**, and **so long as the data points are drawn independently
using some probability distribution $P$**.

The definitional point the practice quiz went after directly: $E_{\text{out}}$ is the error
on the *whole input space* - the probability of disagreement under $P$ - not the error on
the test set and certainly not the error on the training set. The test set is a finite
sample used to *estimate* $E_{\text{out}}$; $E_{\text{out}}$ itself is a population
quantity you never observe.

The whole correspondence in one place, picture included:

```artifact src=demos/bin-to-learning-map.jsx static math
```

## So are we done? No - one bin is verification, not learning

*Slide 21.* The bound above is for a **single, fixed** $h$. But we have a hypothesis *set*
$\mathbb H$, and the learning algorithm *chooses* from it after seeing the data. The
slide's phrasing:

> With a single given hypothesis, it's more like "verification" than "learning".

This is the conceptual hinge of the lecture. Fixing $h$ in advance and checking it on data
is verification - you are testing a hypothesis someone handed you. Learning means $g$ is
*selected* using $D$, so $g$ is not fixed before looking at the data, and the hypothesis of
the theorem is violated. The selection is itself a search for a hypothesis that looks good
in-sample, which is precisely a search for a bin that came up unusually blue.

## Generalizing to multiple hypotheses

*Slides 22-24.* One bin per hypothesis: $M$ bins, each with its own $E_{\text{in}}(h_m)$
and $E_{\text{out}}(h_m)$. We want the guarantee to cover whichever $g \in \{h_1, \dots,
h_M\} = \mathbb H$ the algorithm lands on, so the bound is paid $M$ times over (a union
bound):

$$
\boxed{\;\mathbb P\big[\,\lvert E_{\text{in}}(g) - E_{\text{out}}(g) \rvert > \epsilon\,\big]
\le 2M e^{-2\epsilon^2 N}\;}
$$

The slide states the factor of $M$ without deriving it. It is four lines, and they are
worth having because every line is a place the argument could have been tighter and was
not - which is the same reason VC dimension exists.

> Write $B_m$ for the event that hypothesis $h_m$ is *bad on this sample*:
>
> $$
> B_m \;=\; \big\{\, \lvert E_{\text{in}}(h_m) - E_{\text{out}}(h_m) \rvert > \epsilon \,\big\}.
> $$
>
> The algorithm's output $g$ is one of the $h_m$, but *which* one depends on $D$, so $g$ is
> not fixed in advance and Hoeffding does not apply to it directly. What is true is that if
> $g$ is bad, then some $h_m$ is bad:
>
> $$
> \begin{aligned}
> \mathbb P\big[\,\lvert E_{\text{in}}(g) - E_{\text{out}}(g) \rvert > \epsilon \,\big]
>   &\le \mathbb P\!\left[\, \bigcup_{m=1}^{M} B_m \right]
>      && \text{the bad-}g\text{ event is contained in the union} \\[2pt]
>   &\le \sum_{m=1}^{M} \mathbb P[B_m]
>      && \text{union bound: no independence assumed} \\[2pt]
>   &\le \sum_{m=1}^{M} 2 e^{-2\epsilon^2 N}
>      && \text{Hoeffding on each } h_m,\ \text{which } \textit{is} \text{ fixed} \\[2pt]
>   &= 2M e^{-2\epsilon^2 N}.
> \end{aligned}
> $$
>
> Two places this is loose, and both are the point. The union bound assumes nothing about
> how the $B_m$ overlap, and in a real $\mathbb H$ they overlap enormously - two nearly
> identical hypotheses are bad on nearly the same samples, so the sum double-counts almost
> everything. And the containment in the first line is generous: it charges you for every
> hypothesis that *could* have been chosen, not the one that was. VC dimension is the repair
> for the first; nothing in this course repairs the second.

The slide's annotations:

- **The bound gets loose by $M$ times.**
- $M$ can be seen as the **complexity of the hypothesis space**.
- The bound is valid **only when $\mathbb H$ is finite**.
- For infinite $\mathbb H$ (usually the case) complexity is measured by the **VC
  dimension**, a generalization of this idea.

Sanity-check the direction with the L3 perceptron: $w \in \mathbb R^d$ gives uncountably
many hypotheses, so $M = \infty$ and $2Me^{-2\epsilon^2 N}$ is vacuous. That is not a
statement that perceptrons do not generalize - it is a statement that this particular
bounding technique has run out, which is the gap VC dimension closes.

Every bin below has the same $\mu$, so every difference is luck. Raising $M$ makes the luckiest bin look better and better, which is exactly what the factor of $M$ is paying for.

```artifact src=demos/union-bound-bins.jsx
```

## To summarize

*Slide 25,* the deck's own recap, worth keeping in its own order because it is the chain of
assumptions in sequence:

1. The goal of learning is to approximate the behavior of the unknown $f$.
2. We are given a finite set of examples respecting $f$ - the training set.
3. **Assumption 1:** each example is drawn independently from the sample space under some
   probability distribution $P$ - i.i.d.
4. We identify $\mathbb H$ and pick $g$ from it, wanting $g \approx f$ on unseen data.
5. **Assumption 2:** the unseen samples are drawn with the *same* $P$ as the seen ones.
6. Under these, $\mathbb P[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon]
   \le 2Me^{-2\epsilon^2 N}$.
7. So if we can drive $E_{\text{in}}$ towards zero, we can *probabilistically* guarantee
   $E_{\text{out}}$ will not be large either - $g$ probabilistically approximates $f$.

Step 7 is the payload, and it is a conditional with two antecedents: *if* $E_{\text{in}}$
is small **and** the gap is small, *then* $E_{\text{out}}$ is small. Hoeffding delivers the
second conjunct only. Nothing here makes $E_{\text{in}}$ small on its own - which is
exactly what the next section separates out.

## Two primary questions about learning

*Slides 26-27.* The split that organizes everything after this lecture:

> 1. Can we make sure that $E_{\text{in}}(g)$ is close to $E_{\text{out}}(g)$?
> 2. Can we make $E_{\text{in}}(g)$ small enough?

**Hoeffding only addresses the first.** The second is addressed by actually choosing a
hypothesis set, running the learning algorithm, and seeing how low $E_{\text{in}}(g)$ goes.

And the two questions pull $\mathbb H$ in opposite directions:

| | Effect of a more complex $\mathbb H$ |
|---|---|
| Question 2 | a complex $\mathbb H$ lets you pick a complex $g$, raising the chance of $E_{\text{in}}(g) \approx 0$ - **helps** |
| Question 1 | a complex $\mathbb H$ raises $M$, making $2Me^{-2\epsilon^2 N}$ loose, so the $E_{\text{in}}$-$E_{\text{out}}$ gap can be large - **hurts** |

Slide 27 draws this as the standard U: complexity of $\mathbb H$ on the $x$-axis, error on
the $y$-axis, $E_{\text{in}}$ falling monotonically, $E_{\text{out}}$ falling then rising,
and an optimum $d^\star$ where the two effects balance. Alongside it, a second axis the
slide is careful to keep separate - the **complexity of $f$**. A more complex $f$ is harder
to learn, needs a more complex $g$, and hence a more complex $\mathbb H$; it acts on
question 2, not on the bound.

Do not collapse those two complexities into one. $M$ is a property of the *hypothesis set
you chose*; the complexity of $f$ is a property of the *world*, which you do not control
and cannot observe. The tradeoff curve is drawn over the first.

The slide's own picture, with the second complexity put on a slider - because the way to
keep the two apart is to move one and watch the other stay still:

```artifact src=demos/complexity-tradeoff.jsx
```

Take the slider to the right and read the three curves in order. In-sample error rises at
every complexity of $\mathbb H$: a harder target is harder to fit, which is question 2
getting worse. The model-complexity curve does not move at all, because it comes from
$2Me^{-2\epsilon^2 N}$, and that expression contains $M$ and $N$ and nothing about $f$ -
question 1 has not noticed that the world changed. Their sum therefore bottoms out further
right, which is the conclusion the slide states in words: **a more complex $f$ forces a more
complex $\mathbb H$.**

Two things worth taking from the picture that the sentence does not carry:

- The optimum also moves **up**. The extra capacity does not recover what the harder target
  cost you - it only stops you paying a second time for being underpowered. There is a floor
  here that no choice of $\mathbb H$ gets under, and the next lecture's bias-variance
  decomposition is the thing that names it.
- The move is forced, not chosen. You cannot observe the complexity of $f$, so you cannot
  read $d^\star$ off this picture in practice. What you can do is the thing slide 31 is
  about: hold out data and find the minimum empirically.

The same shape again, but measured rather than asserted - real fits to real points, with
real errors on both axes. Read it against the schematic above: the U is in the same place
for the same reason, and everything here is a number you could have computed.

Both questions at once: the green curve is question two, the shaded gap is question one.
The panel beside it is the polynomial the slider is talking about, fitted to the same ten
points, so that a point on the curve and the curve it summarises move together. Walk $M$
from 0 to 9 and watch the two panels disagree - the left one keeps improving on the
measure you can compute, the right one stops being a description of anything around
$M = 5$.

```artifact src=demos/complexity-ucurve.jsx
```

## Measuring the complexity of $\mathbb H$

*Slide 28.* Two named tools, with their status in this course stated explicitly:

- **VC dimension** - *not covered in this course.* Strongly encouraged to read on your own;
  the slide links a suggested tutorial and invites questions.
- **Bias-variance** - *covered in the next lecture.*

So VC dimension is examinable only to the depth it appears on this slide: it is the
generalization of $M$ to infinite hypothesis sets. Bias-variance is the one that gets a
real treatment.

## The polynomial regression example

*Slides 29-32.* The concretization, borrowed from Bishop. Dataset: 10 $(x,y)$ points
generated from a sine function with noise added to the $y_i$ - and the slide flags that *of
course we do not know the data came from a sine.* Both $x_i$ and $y_i$ are real, so
$\mathcal X = \mathcal Y = \mathbb R$ and the task is regression.

Let $\mathbb H$ be all polynomials of degree $M$, for some fixed $M$. Then **the complexity
of $\mathbb H$ is defined by $M$** - the same letter as the hypothesis count above, reused,
which is the deck's one genuinely confusing notational choice. The four panels shown are
$M = 0, 1, 3, 9$:

| $M$ | Fit |
|---|---|
| 0 | flat line, misses the sine entirely |
| 1 | straight line, still far off |
| 3 | tracks the underlying sine closely |
| 9 | passes through **all 10 points** exactly, wild between them |

$M = 9$ is the deck's labeled **example of overfitting**: with 10 free coefficients and 10
points, $E_{\text{in}} = 0$ exactly, and $E_{\text{out}}$ is terrible. The accompanying
learning curve plots $E_{\text{RMS}}$ against $M$ with two traces - training falling
monotonically to zero, validation/test falling then turning sharply up - which is the same
U as slide 27, now measured rather than asserted.

This is where the two questions become visible in one picture. At $M=9$ question 2 is
answered perfectly and question 1 fails completely. Zero training error is not evidence of
learning; it is evidence about $E_{\text{in}}$ alone, and the deck picked the case where
that distinction costs you everything.

The deck's four panels are the right-hand side of the U-curve figure above, made
continuous in $M$: push its slider to 9 and read the two error numbers against each other.

That figure also carries a third curve the deck's plot does not draw: the error on ten
held-out **validation** points. It is the only one of the three you could compute without
knowing the target, and the button lets it pick $M$. Then compare the validation error at
that degree with the error on a fresh test sample. The validation number is usually the
smaller, because you chose the degree that made it small - which is the next section's
reason for keeping three splits rather than two.

## How to accomplish this in practice

*Slide 31.* Split the available dataset $D$ into three parts:

| Split | Symbol | Role |
|---|---|---|
| Training data | $D_{\text{Tr}}$ | tune the parameters of the model - i.e. search $\mathbb H$ for a hypothesis |
| Validation data | $D_{\text{Vl}}$ | test the goodness of the *running* hypothesis during training |
| Test data | $D_{\text{Te}}$ | measure final performance, **once** |

The slide's own qualifications, each of which is a quiz sentence:

- Validation performance is a **surrogate** for performance on unseen examples - *so long
  as the validation set is drawn from the same distribution as the test set.*
- Throughout learning, you track performance on the validation set.
- Test data is used once you are happy with your chosen hypothesis. **There is no going
  back after this!** Otherwise you are cheating and all bets are off as to whether the
  model generalizes.
- The big assumption: the dataset you start with is representative of the real world.

Why three and not two: the moment you use a set to *choose* something - a degree $M$, a
regularization strength - you have selected a hypothesis using that set, and by the
verification-versus-learning argument above its error is no longer an unbiased estimate of
$E_{\text{out}}$. The validation set absorbs that bias so the test set can stay clean. It
is the same $M$-bins problem, one level up: selecting among models re-inflates the bound in
exactly the way selecting among hypotheses did.

## Loss functions

*Slide 33.* $h$ only approximates $f$; the goodness of the approximation during training is
measured by a **loss function** $L(h,f)$, whose optimization guides training. Even when the
sample space is continuous, in almost every practical case the loss is defined
**point-wise** and summed:

$$
L(h,f) = \sum_{i=1}^{N} \ell\big(h(x_i),\, f(x_i)\big).
$$

The three the slide names:

| Loss | Form | Used for |
|---|---|---|
| Binary classification (0-1) | $\ell(h,f) = [\,h(x) \ne f(x)\,]$ | classification; this is the $E_{\text{in}}$ of the bin experiment |
| Squared | $e(h,f) = (h(x) - f(x))^2$ | regression - the choice in the polynomial example |
| Cross-entropy | $-\big[y \log p_\theta(x) + (1-y)\log(1 - p_\theta(x))\big]$ | classification with $p_\theta(x)$ the predicted probability of the positive class |

Note that the 0-1 loss is what the entire Hoeffding story was written in: $E_{\text{in}}$
as the fraction of misclassified points *is* the average 0-1 loss. Squared and
cross-entropy are what you actually optimize, because 0-1 loss has zero gradient almost
everywhere - the deck does not say this yet, but it is why the list has three entries
instead of one.

```artifact src=demos/loss-shapes.jsx static math
```

## Error measures

*Slide 34.* Distinct from the loss, and the distinction is the point:

- The **error measure** evaluates model performance, often in a **human-interpretable** way.
- It is **defined by the user**, and is **problem-dependent**: a numerical penalty for
  making a mistake.
- **Different error measures on the same task can lead to different hypotheses.**

The worked example is a fingerprint verifier: the model outputs $+1$ if it is you, $-1$ if
it is not, giving a $2 \times 2$ table of no-error / **false accept** / **false reject** /
no-error. The same confusion structure, costed two ways:

```artifact src=demos/error-cost-matrices.jsx static math
```

The supermarket fears **false rejects** - annoying a loyal customer costs 10 against a
false accept's 1, because a wrongly-denied discount loses a customer while a wrongly-given
one costs a few dollars. The bank fears **false accepts** - letting in an intruder costs
1000 against a false reject's 10. Same classifier architecture, same data, opposite
operating points.

That asymmetry is the practical content of "defined by the user, problem-dependent." The
error measure is not something the data tells you; it encodes what the deployment actually
costs, and it belongs to the same category as the choice of $\mathbb H$ - an assumption
imported from outside, made by the ML designer. Which closes the loop with L1's aside that
*deciding what data to collect is part of the ML designer's job.*

## Practice

On paper, cold, before quiz 1:

1. Write the Boolean counterexample from memory with the correct counts (256 / 8), and
   state in one sentence what it does *not* prove.
2. Write Hoeffding in both forms - bin and learning - and label which symbol is random and
   which is fixed.
3. Given $\epsilon = 0.1$ and $N = 1000$, compute $2e^{-2\epsilon^2 N}$; then find the $N$
   needed to get the same bound at $\epsilon = 0.05$. Confirm it is $4\times$.
4. Explain in two sentences why the single-hypothesis bound does not apply to the output of
   PLA.
5. State which of the two primary questions each of the following addresses: adding more
   training data; switching from degree 3 to degree 9; adding a regularizer; choosing a
   different loss function.
6. Redraw the supermarket and bank cost matrices and say, for each, which direction the
   decision threshold should move relative to the symmetric-cost case.

---

> Next up: bias-variance (slide 28 defers it explicitly), then linear models for
> regression. Note 00's
> [ERM and regularization](note.html?course=CSCI-UA-473&note=00) covers the empirical-risk
> construction that this lecture's $E_{\text{in}}$ is a special case of - read it against
> the "two primary questions" split, since ERM is entirely an attack on question 2.
