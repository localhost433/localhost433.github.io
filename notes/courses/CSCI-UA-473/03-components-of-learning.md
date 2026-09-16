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
A Short Course*) is redrawn with one more box each pass. The final state:

| Component | Symbol | In the credit problem |
|---|---|---|
| Unknown target function | $f : \mathcal X \to \mathcal Y$ | the ideal credit approval formula - the true relation between a customer's characteristics and the money the bank can make from them |
| Training data | $D = \{(x^1,y^1),\dots,(x^N,y^N)\}$ | historical records of current customers: the **only window** onto the ideal formula |
| Hypothesis set | $\mathbb H$ | the family of functions believed to best approximate $f$; the set of candidate predictive functions |
| Learning algorithm | $\mathcal A$ | the procedure that picks one member of $\mathbb H$ |
| Final hypothesis | $g \approx f$ | the learned credit approval function |

The annotation carried alongside the figure from slide 10 onward: **data points are
typically assumed to be independent and identically distributed (i.i.d.).**

The structural point is what $\mathcal A$ does and does not see. It sees $D$ and
$\mathbb H$. It never sees $f$. Everything it can possibly know about $f$ arrives through
$N$ samples, which is why the i.i.d. assumption is doing real work rather than being
bookkeeping - it is the bridge that lets finite $D$ say anything about unseen $\mathcal X$.

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

```artifact src=demos/perceptron-2d.jsx
```

The final hypothesis $h$ at convergence is the $g$ that best approximates $f$. Slide 43
states the guarantee: **so long as the data is linearly separable, the algorithm will find
a separating hyperplane.**

### Why the update helps

The four-line argument the update is designed around. Take a misclassified
$(x(t), y(t))$ and apply one step:

$$
y(t)\,w(t+1)^{\mathsf T}x(t)
= y(t)\big(w(t) + y(t)x(t)\big)^{\mathsf T}x(t)
= y(t)\,w(t)^{\mathsf T}x(t) + y(t)^2\,x(t)^{\mathsf T}x(t).
$$

Since $y(t) \in \{+1,-1\}$ we have $y(t)^2 = 1$, and
$x(t)^{\mathsf T}x(t) = \|x(t)\|^2 > 0$ for any nonzero input. So
$$
y(t)\,w(t+1)^{\mathsf T}x(t) = y(t)\,w(t)^{\mathsf T}x(t) + \|x(t)\|^2 > y(t)\,w(t)^{\mathsf T}x(t).
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

```artifact src=demos/nfl-boolean-cube.jsx
```

## Learning paradigms

*Slides 55-67.*

| Paradigm | Training data | Supervision |
|---|---|---|
| **Supervised** | input examples with annotations (labels) | explicit labels |
| **Unsupervised** | inputs only | none |
| **Semi-supervised** | small labeled subset + large unlabeled remainder | partial |
| **Self-supervised** | unlabeled data with indirect labels inferred from its own structure | derived from the data |
| **Transfer** | large auxiliary-task data + small final-task data | labels on the auxiliary task |
| **Reinforcement** | no input-output pairs; trial and error against an environment | scalar reward |

**Supervised** (slides 56-57). Examples: bank customers with their creditworthiness; images
of apples and oranges each marked with what it contains; natural scenes with every pixel
marked with a category (segmentation); audio waveforms each with the text of the audio
(speech-to-text). Two variants get their own slide:

- *Online learning* - the algorithm does not have all the data upfront; examples arrive one
  at a time in a stream. Streaming news, streaming stock prices.
- *Active learning* - labels are expensive and there is a budget, so the algorithm queries
  for the examples that give the biggest bang for the buck.

**Unsupervised** (slides 58-62). Only inputs, no labels. Used primarily to understand the
underlying data and build concise representations of it. The deck's three illustrations:
clustering images by content; embedding images so that similar images get nearby
coordinates (from thousands or millions of pixels down to a coordinate); embedding words;
and topic modeling.

**Semi-supervised** (slide 63). Labels for a subset, none for the typically much larger
remainder; both are used in training. For scenarios with lots of data where labeling is
expensive - speech recognition, healthcare, text document classification.

**Self-supervised** (slide 64). Infer *indirect* labels from a large unlabeled collection
by exploiting other properties of the dataset. The example: exploit the temporal
correlation of video frames to deduce that images from nearby frames are similar to each
other.

**Transfer learning** (slide 65). Train on one or more auxiliary tasks and use the
knowledge to solve the final task. The example: a large dataset of cat and dog images
trains a model to distinguish cats from dogs; that knowledge transfers to a small dataset
of Swedish Vallhund images to build a Vallhund identifier. Task 1 (the final task) has
little data; task 2 (the auxiliary task) has a lot.

**Reinforcement learning** (slides 66-67). Training data does not come as input-output
pairs; the algorithm learns by trial and error. There is an environment (the world the
robot exists in), the agent observes it, takes an action based on that observation, and
receives $+/-$ feedback (reward), which it uses to improve. The illustration: a toddler
learning not to touch a hot cup - touching yields a large negative reward (burnt fingers),
not touching a small negative one (unsatisfied curiosity), and after a few trials the
toddler learns it is better off not touching.

The axis that actually separates these is *where the supervision signal comes from*, not
how much data there is: a human annotator (supervised), nowhere (unsupervised), the data's
own structure (self-supervised), a different task (transfer), or the environment's response
to your own actions (reinforcement). Sorting a described scenario onto that axis is the
standard MCQ.

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

## What to retain from L3

| Topic | Key point |
|---|---|
| $f$ | the unknown target function $\mathcal X \to \mathcal Y$; never observed, only sampled |
| $D$ | $\{(x^i,y^i)\}_{i=1}^N$, assumed i.i.d.; the only window onto $f$ |
| $\mathbb H$ | the hypothesis set - candidate functions, chosen *before* seeing data |
| $\mathcal A$ | the learning algorithm; sees $D$ and $\mathbb H$, never $f$ |
| $g$ | the final hypothesis, $g \approx f$ |
| Parametric vs. non-parametric | whether the parameter count depends on $N$ - *not* whether parameters exist |
| "Linear model" | linear in the **parameters**, not in the inputs |
| One-hot | avoids imposing a false ordering and false spacing on categorical levels |
| Perceptron | $h(x) = \operatorname{sign}(w^{\mathsf T}x + b)$; $w^{\mathsf T}x + b = 0$ is a hyperplane with normal $w$ |
| Bias absorption | prepend 1 to $x$, prepend $b$ to $w$; one update rule covers the bias |
| PLA update | $w(t+1) \leftarrow w(t) + y(t)x(t)$, applied to a **misclassified** example |
| PLA guarantee | terminates **iff** the data is linearly separable; says nothing about *which* separator |
| Why the update works | $y w^{\mathsf T}x$ increases by $\|x\|^2$ on that example - locally, not globally |
| Inductive bias | structure posited to hold in both seen and unseen data |
| No Free Lunch | an inductive bias that works well on one set of targets works badly on the complement |
| The slogan | there is no machine learning without assumptions |
| Paradigms | separated by *where supervision comes from*: annotator / nowhere / the data itself / another task / the environment |

## Practice

On paper, cold, before quiz 1:

1. Reproduce the components figure from memory, all five boxes labeled, and say in one line
   what $\mathcal A$ can and cannot see.
2. Re-derive bias absorption: start from $\operatorname{sign}(\sum w_i x_i + b)$ and reach
   $\operatorname{sign}(w^{\mathsf T}x)$, stating what changed about $\mathcal X$.
3. Re-derive the one-step PLA improvement above without looking, and then state precisely
   what it does *not* prove.
4. Take a 2D dataset of four points, two per class, initialize $w = [0,0,0]$, and run PLA
   by hand until it converges. Then perturb one label to make the set non-separable and
   confirm the loop cannot terminate.
5. Classify five described scenarios by paradigm, forcing yourself to name the supervision
   source rather than pattern-matching on the application domain.

---

> Related: [note 00](note.html?course=CSCI-UA-473&note=00) carries the same setup further
> than the slides do - from the population objective as an integral, through the Monte
> Carlo approximation, to empirical risk minimization and regularization. The slides give
> the picture and note 00 gives the algebra; read them together.
