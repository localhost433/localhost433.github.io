---
title: "3 - Components of Learning & the Perceptron"
date: "2026-09-10"
---

## Roadmap

1. **Components of a learning system** - training data, hypothesis set, learning algorithm
2. **A simple linear model** - the Perceptron Learning Algorithm (PLA)
3. **Paradigms of learning** - supervised, unsupervised, self-supervised, reinforcement

## The credit card approval problem

*Slides 3-4.* A bank receives thousands of applications daily and wants two answers per
application: whether to extend a card, and if so what the limit should be. It already has a
large customer base with age, gender, income, debt, credit scores, what cars they drive,
where they shop for clothes and groceries, what television they watch - plus, crucially,
whether the bank made money from each customer's card use, and how much.

The data table fixes the notation for the rest of the course:

- $x^i$ - the input variables (**features**) of the $i$-th customer. Note the
  **superscript** indexes the example.
- $x^i_j$ - the $j$-th feature of the $i$-th customer.
- $x^i = [x^i_1, x^i_2, \dots, x^i_d]$.
- $y^i$ - the output variable (**label**) of the $i$-th customer. Continuous gives
  regression, discrete gives classification.
- $D = \{(x^1,y^1), (x^2,y^2), \dots, (x^N,y^N)\}$ - the input-output pairs, called
  **data points** or **examples**. The part of $D$ used to fit the model is the
  **training data**.

Note that the two questions the bank asks are of different kinds: approve-or-not is
classification, the credit line is regression. Same features, same customers, different
output space - which is the first hint that $\mathcal Y$ is a modeling choice rather than a
property of the world.

## Formalizing it

*Slides 5-6.* Let $\mathcal X$ be the entire space of inputs, potentially infinite and
very high-dimensional, and $\mathcal Y$ the entire space of outputs - $\{+1,-1\}$ for the
binary credit decision, the positive reals for the credit line.

Assume there exists a function, **unknown to us**,
$$
f : \mathcal X \to \mathcal Y,
$$
the **target function**, defining the true relationship between inputs and outputs. Then
the training data $D \subset \{\mathcal X, \mathcal Y\}$ satisfies $y^i = f(x^i)$ for all
$i$.

But we do not know $f$. So the goal of learning is to use $D$ to find a
$g : \mathcal X \to \mathcal Y$ such that **$g$ approximates $f$**. Let $\mathbb H$ denote
the universe of functions within which we believe $g$ (and hence $f$) lies - the
**hypothesis set**. The learning algorithm chooses $g$ from $\mathbb H$, and the decision
for a new customer is $g$'s output.

The deck's closing caveat on slide 6: this makes sense *so long as the learned $g$ is
faithful to $f$ on the training data*. That "so long as" is the entire generalization
problem, and slides 44-54 come back to it.

## Components of a learning system

*Slides 7-17,* built up incrementally - the same figure (adapted from *Learning from Data:
A Short Course*) is redrawn with one more box each pass. The figure below replays that
build, with one addition the deck does not draw: the boundary around what the algorithm
can actually see. The i.i.d. annotation arrives alongside the training data from slide 10
onward and stays.

```artifact src=demos/components-diagram.jsx static math
```

The structural point is what $\mathcal A$ does and does not see. It sees $D$ and
$\mathbb H$. It never sees $f$. Everything it can possibly know about $f$ arrives through
$N$ samples, which is why the i.i.d. assumption is doing real work rather than being
bookkeeping - it is the bridge that lets finite $D$ say anything about unseen $\mathcal X$.

That chart is accurate and every box on it is a *name*. It says $\mathbb H$ is the
hypothesis set without saying what kind of object a hypothesis is, and the answer turns
out to be two different pictures that the rest of the course switches between without
announcing the switch. The figure below draws one example in both.

```artifact src=demos/hypothesis-space-two-views.jsx static math
```

Read left to right, a hypothesis is a **boundary drawn on the input space** and
$\mathbb H$ is a family of such boundaries. That is the reading behind every sentence of
the form "we use a linear model", and it is the one the perceptron section below needs,
because the update moves a line.

Read right to left, a hypothesis is a **single point**, $\mathbb H$ is the region those
points fill, and choosing $g$ means choosing a coordinate. This is the reading that every
later optimization argument silently assumes: "search $\mathbb H$ for the $h$ minimizing
$E_{\text{in}}$" is not a meaningful instruction until $\mathbb H$ has a geometry to
search. The parametric/non-parametric split in the next section is a statement about that
geometry - parametric means the region has a fixed, finite number of coordinates.

Both pictures place $f$ *outside* $\mathbb H$, and that is not a drafting choice. Nothing
in the setup promises $f \in \mathbb H$, and when it is not, there is a floor on
$E_{\text{out}}$ that no amount of data touches. Slides 44-54 come at that floor from the
No Free Lunch side; the next lecture's bias-variance decomposition measures it.

## Hypothesis space

*Slide 13.* The examples of $\mathbb H$, split on whether the parameter count depends on
$N$:

**Parametric** - the number of parameters of $h \in \mathbb H$ is fixed and does not depend
on the training set size $N$.

- *Linear models*, where the output is a linear function of the parameters: linear
  regression, linear classification, support vector machines.
- *Non-linear models*, where the output is a non-linear function of the parameters: neural
  networks, convolutional neural networks, random forests.

**Non-parametric** - the number of parameters is not fixed and does depend on $N$: nearest
neighbors, Parzen window classifiers.

Read the definition carefully, because the intuitive reading is wrong. "Non-parametric"
does not mean "no parameters"; it means the parameter count grows with the data. Nearest
neighbors stores the training set, so its description length is $O(N)$. This is exactly the
kind of definitional inversion a true/false question is built from.

Note also that "linear model" is defined as linear *in the parameters*, not in the inputs -
which is what makes basis expansion legal later without leaving the linear family.

## Representing data

*Slide 18.* Let $\mathcal X \subset \mathbb R^d$. Coordinates of $x = [x_1,\dots,x_d]$
correspond to different attributes - income, age, debt. Attributes come in two kinds:

- **Continuous**: income, debt-to-income ratio, FICO score.
- **Categorical**: gender, occupation type.

Categorical attributes get a **one-hot** encoding, the deck's example being education:

| Level | Encoding |
|---|---|
| High School | `1 0 0 0 0` |
| Undergraduate | `0 1 0 0 0` |
| Masters | `0 0 1 0 0` |
| PhD | `0 0 0 1 0` |
| Post-doc | `0 0 0 0 1` |

And the output space $\mathcal Y = \{+1,-1\}$ for the yes/no decision.

One-hot is used rather than integer coding (High School = 1, ..., Post-doc = 5) because a
linear model reads integer codes as an ordered, evenly-spaced scale, asserting that the gap
between High School and Undergraduate equals the gap between PhD and Post-doc and that
"Masters = 3" is meaningfully three times "High School = 1". One-hot buys a free parameter
per level instead, at the cost of $d$ growing.

## A simple learning model

*Slides 19-24.* Take $\mathbb H$ to be all linear functions,
$$
h_w(x) = w^{\mathsf T}x = \sum_{i=1}^{d} w_i x_i,
\qquad w = [w_1, \dots, w_d] \in \mathbb R^d.
$$

Each setting of $w$ *is* one hypothesis $h_w \in \mathbb H$ - the weight vector and the
hypothesis are the same object, which is why "searching $\mathbb H$" and "optimizing over
$w$" are the same sentence. The weighted attributes combine into a **score** for a data
point.

The decision rule, with threshold $\mathrm{th}$:

$$
\sum_{i=1}^{d} w_i x_i > \mathrm{th} \;\Rightarrow\; \text{approve},
\qquad
\sum_{i=1}^{d} w_i x_i < \mathrm{th} \;\Rightarrow\; \text{reject}.
$$

Move the threshold across:
$$
\sum_i w_i x_i - \mathrm{th} > 0 \;\Rightarrow\; \text{approve},
\qquad
h(x) = \operatorname{sign}\!\left(\sum_{i=1}^d w_i x_i - \mathrm{th}\right),
$$
where $\operatorname{sign}(s) = +1$ if $s > 0$ and $-1$ if $s < 0$. Denote
$b = -\mathrm{th}$, the **bias**:
$$
h(x) = \operatorname{sign}\!\left(\sum_{i=1}^{d} w_i x_i + b\right),
$$
with $h(x) = +1 \Rightarrow$ approve credit and $h(x) = -1 \Rightarrow$ reject.

**This model is called the Perceptron.** Geometrically (slide 25) the equation
$w^{\mathsf T}x + b = 0$ is a hyperplane, $w$ is its normal, and the two classes are the
two sides.

## Bias absorption

*Slide 27.* The bias is folded into the weight vector by prepending a constant 1 to every
input:
$$
h(x) = \operatorname{sign}(w^{\mathsf T}x),
\qquad
w = [b, w_1, w_2, \dots, w_d],
\qquad
x = [1, x_1, x_2, \dots, x_d].
$$

This is legitimate because $w^{\mathsf T}x = b \cdot 1 + \sum_i w_i x_i$ reproduces the
previous expression exactly. The payoff is that the update rule below has no special case
for $b$ - the bias is learned by the same line of code as every weight. The cost is that
the input space is now $d+1$ dimensional, and the separating surface in that space passes
through the origin.

Use the figure to see what bias absorption does geometrically.

```artifact src=demos/bias-absorption-3d.jsx
```

## The Perceptron Learning Algorithm

*Slides 26-43,* built one line at a time. The complete algorithm:

> Let $w(t)$ be the weight vector at iteration $t$. Initialize $t = 0$.
> Repeat until no example is misclassified (convergence):
> - Pick a random example $(x(t), y(t))$ from $D$ that is misclassified.
> - If $y(t) = +1$ and $w(t)^{\mathsf T}x(t) < 0$, update $w(t+1) \leftarrow w(t) + x(t)$.
> - If $y(t) = -1$ and $w(t)^{\mathsf T}x(t) > 0$, update $w(t+1) \leftarrow w(t) - x(t)$.

The two cases collapse into one line (slide 42):
$$
\boxed{\,w(t+1) \leftarrow w(t) + y(t)\,x(t)\,}
$$

Use the figure to step through the update and watch what changes. The small hollow
markers are a held-out set drawn from the same hidden rule; the algorithm never sees them.

```artifact src=demos/perceptron-2d.jsx
```

Three experiments the controls are there for, each one a quiz question in disguise:

- **Random start w**, then run to convergence, twice. Both runs end at zero training
  error - the stopping condition guarantees it - but the two lines are different lines,
  and the held-out error tells them apart. Same performance on $D$ does not mean same
  performance off it.
- **Inputs ×2**, with *Lowest index* picking so the run is deterministic, and compare the
  update count against the unscaled run from the same start. For a perceptron through the
  origin the count is identical: $w$ after $t$ updates is exactly doubled, so every
  $\operatorname{sign}(w^{\mathsf T}x)$ is unchanged and the same mistakes are made in the
  same order. With the bias absorbed as an unscaled $x_0 = 1$ that argument breaks, and the
  count usually shifts - the geometry is the same, the arithmetic is not.
- **Non-separable**, then run. The count never reaches zero and the misclassification
  curve does not trend anywhere; an infinite run is the *only* symptom PLA gives you of
  non-separability.

The final hypothesis $h$ at convergence is the $g$ that best approximates $f$. Slide 43
states the guarantee: **so long as the data is linearly separable, the algorithm will find
a separating hyperplane.**

### Why the update helps

The four-line argument the update is designed around. Take a misclassified
$(x(t), y(t))$, apply one step, and read the signed margin $y\,w^{\mathsf T}x$ line by
line:

$$
\begin{aligned}
y(t)\,w(t+1)^{\mathsf T}x(t)
  &= y(t)\big(w(t) + y(t)x(t)\big)^{\mathsf T}x(t)
     && \text{substitute the update} \\[2pt]
  &= y(t)\,w(t)^{\mathsf T}x(t) \;+\; y(t)^2\,x(t)^{\mathsf T}x(t)
     && \text{expand} \\[2pt]
  &= y(t)\,w(t)^{\mathsf T}x(t) \;+\; \lVert x(t)\rVert^2
     && y(t)^2 = 1 \text{ since } y(t) \in \{+1,-1\} \\[2pt]
  &> y(t)\,w(t)^{\mathsf T}x(t)
     && \lVert x(t)\rVert^2 > 0 \text{ for any nonzero input.}
\end{aligned}
$$

The quantity $y\,w^{\mathsf T}x$ is positive exactly when the example is classified
correctly, so one update strictly increases the margin *on the example it was applied to*.

Two things this argument does **not** establish, and both are quiz-shaped:

1. It says nothing about the other examples - an update that fixes $x(t)$ can break
   previously-correct points. Convergence is not monotone in total error, and the proper
   convergence proof (Novikoff) bounds the number of updates rather than showing error
   decreases each step.
2. It says nothing about which separating hyperplane you get. Any of infinitely many will
   satisfy the stopping condition, and PLA returns whichever it happens to reach - there is
   no notion of the *best* separator here. That gap is what max-margin methods (SVMs, on
   the course map) exist to close.

If the data is **not** linearly separable, the stopping condition is never met and the loop
does not terminate.

## Will this work on unseen data?

*Slides 44-54.* The chain of reasoning, in the order the deck builds it:

1. The actual target $f$ is unknown.
2. We only approximated it with $g$ by looking at the limited data $D$.
3. So what guarantee is there that $g$ is a good approximation of $f$ and will work on
   unseen examples?
4. **Probability will come to the rescue** - the answer, deferred to the next lecture.
5. We have to make additional assumptions about what kinds of functions to consider: we
   must posit structure that exists in both the data we have seen and the data we have not.
   This is **inductive bias**.
6. There is no "general inductive bias" that is the right one across all universes.
7. **No Free Lunch Theorem** - for any set of target functions on which an inductive bias
   works well, it will work badly on the complement of that set.
8. **There is no machine learning without assumptions.**

The step to hold onto is 5-to-7. Choosing $\mathbb H$ looked earlier like a practical
convenience (linear models are easy to fit). No Free Lunch reframes it as the thing that
makes learning possible at all: restricting $\mathbb H$ is what lets finite data say
anything about unseen inputs, and no restriction is universally correct. So the hypothesis
set is not a shortcut around the problem, it *is* the assumption, and every method later in
the course is a different bet about which structure the world has.

The figure makes that concrete on the smallest interesting input space, $\{0,1\}^3$: eight
possible inputs, so $2^8 = 256$ possible targets, and a training set is a subset of the
eight corners you have been told the answer for. It opens with four corners labelled and
the hypothesis set restricted to linear thresholds, which is a bias that suits the target
it is aimed at - three of the four unseen corners come out right, an off-training error of
$0.25$ against $0.50$ for a coin.

Two switches are worth throwing, in this order:

1. **Hypothesis set → All 256 functions.** Every unseen corner drops to a vote of exactly
   $0.50$ and the off-training error becomes exactly $0.50$. This is not a quirk of the
   sample: for every surviving hypothesis that says $+1$ at an unlabelled corner there is
   another, fitting the labelled corners equally well, that says $-1$. **Labelling more
   corners does not help**, because it only ever removes hypotheses in matched pairs. An
   unrestricted $\mathbb H$ has nothing to say about anything it was not shown.
2. **Target → Parity of bits,** with linear thresholds still selected. Now the bias is
   decisive and *wrong*: all four unseen corners are predicted, and all four are wrong -
   an off-training error of $1.00$, worse than the coin.

Read together, those two states are the theorem. A hypothesis set has to be restricted
before it can generalize at all, and any restriction that beats chance on one set of
targets is beaten by chance on the complement. The training data cannot tell you which of
the two situations you are in, which is why "there is no machine learning without
assumptions" is a statement about your assumptions rather than about your data.

```artifact src=demos/nfl-boolean-cube.jsx
```

## Learning paradigms

*Slides 55-67.*

```artifact src=demos/paradigms-tree.jsx static
```

The six cards are the section. What the figure cannot carry, and what the deck spends its
thirteen slides on, is the following:

- **Supervised** has two named variants of its own (slides 56-57), and they are about
  *when* the labels arrive rather than where they come from. *Online learning*: the
  examples arrive one at a time in a stream rather than all upfront - streaming news,
  streaming stock prices. *Active learning*: labels are expensive and there is a budget,
  so the algorithm chooses which examples to ask about.
- **Unsupervised** (slides 58-62) gets five slides because the deck wants the three
  distinct uses on the record: clustering, embedding (images *and* words - thousands of
  pixels down to a coordinate, with similar inputs landing near each other), and topic
  modelling. The purpose is stated as understanding the data and building concise
  representations of it, not prediction.
- **Self-supervised** (slide 64) turns on the word *indirect*: the labels are not absent,
  they are inferred from a property of the data the collector never annotated. The
  example is temporal correlation - frames near each other in a video are of the same
  thing, so the video supervises itself.
- **Transfer** (slide 65) is the one with an asymmetry worth remembering: the *final*
  task is the small one (Swedish Vallhunds) and the *auxiliary* task is the large one
  (cats versus dogs). Getting that backwards is the easy mistake.
- **Reinforcement** (slides 66-67) is the only one with no input-output pairs at all.
  Environment, observation, action, $+/-$ reward, repeat. The toddler and the hot cup:
  touching is a large negative reward, not touching a small one, and a few trials settle
  it.

The axis is the answer, not the list: sorting a described scenario by *who or what is
doing the supervising* is the standard MCQ, and it is the only question you need to ask.

## Important questions in machine learning

*Slides 68-69.* The closing list, which doubles as the syllabus for the theory half - all
of these are answered in this course:

- What data set to collect?
- What labels to collect?
- How to collect labels?
- What parametric function to choose to train?
- How to train the parameters of the function?
- How to know that the function has been trained?
- How to measure the usefulness of the trained function?
- What's the guarantee that a trained function that does well on the training data actually
  works on unseen data when deployed?

## Practice

Six questions on the figures above and on the two gaps the note flags as quiz-shaped.

```artifact src=demos/practice-03.jsx math
```

Then two things to try in the figures themselves, each under a minute:

- **Perceptron, "Empty · click to add points".** Place four points, two per class, and
  step until it converges. Watch $y\,w^{\mathsf T}x$ climb by $\|x\|^2$ on each update,
  and watch the misclassified count go *up* on some steps - that is convergence failing
  to be monotone, which is the thing the four-line argument does not promise.
- **Cube, target "None".** Clear the seeded sample and label corners yourself, one at a
  time, under **All 256 functions**. Watch "consistent with D" halve on every label while
  "unseen vertices decided" stays at zero - the sample is doing real work on $\mathbb H$
  and none at all on generalization. Switch to **Linear threshold (104)** without touching
  a label and the votes move off $0.50$ immediately. The bias is doing the work; nothing
  about the data changed.

---

> Related: [note 00](note.html?course=CSCI-UA-473&note=00) carries the same setup further
> than the slides do - from the population objective as an integral, through the Monte
> Carlo approximation, to empirical risk minimization and regularization. The slides give
> the picture and note 00 gives the algebra; read them together.
