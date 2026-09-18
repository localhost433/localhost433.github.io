---
title: "2 - Math Primer: Linear Algebra & Probability"
date: "2026-09-08"
---

## Scope

27 slides: linear algebra (3-15), probability (16-26). Vector calculus was listed on the
outline as "likely not today" and did not fit.

You have already had Honors Linear Algebra (MATH-UA 148), Theory of Probability
(MATH-UA 333) and Mathematical Statistics (MATH-UA 334), so none of this is new. The
value of this note is **notation reconciliation**, not the mathematics: an open-book quiz
is won on lookup speed, and the cost of a mismatch between this course's conventions and
the ones you were taught is paid later, in the gradient derivations.

The conventions worth pinning down now are collected in the retention table at the bottom.

## Vectors

*Slides 3-4.* A vector has magnitude and direction. Magnitude is written $|x|$ or
$\|x\|$; the default is column-oriented,
$$
x = \begin{bmatrix} x_1 \\ x_2 \end{bmatrix},
\qquad
x^{\mathsf T} = [x_1, x_2],
$$
with the transpose converting between row and column, elements and order intact. An
$n$-component vector is $x^{\mathsf T} = [x_1, x_2, \dots, x_n]$.

The framing line: in machine learning, vectors represent *pretty much everything* - data,
parameters, hidden units.

Basic operations, for $x = [x_1, x_2]$, $y = [y_1, y_2]$ and scalar $a$:

$$
x + y = [x_1 + y_1,\; x_2 + y_2],
\qquad
x - y = [x_1 - y_1,\; x_2 - y_2],
\qquad
ax = [ax_1,\; ax_2],
$$

with scalar multiplication changing length but not direction, and the dot product
$x \cdot y = x_1 y_1 + x_2 y_2$ producing a scalar.

## Norms

*Slide 5.* Length is
$\|x\| = \sqrt{x_1^2 + x_2^2}$, equivalently $\|x\|^2 = x \cdot x$. This is the $L_2$ or
Euclidean norm, and it is the default meaning of unadorned $|x|$ in this deck.

Generally, for positive integer $p$,

$$
\lVert x \rVert_p = \left( \sum_{i=1}^{n} |x_i|^p \right)^{1/p}.
$$

So $\|x\|_1 = \sum |x_i|$ is the sum of absolute values, $\|x\|_2 = \sqrt{\sum |x_i|^2}$,
and so on. The $L_1$ / $L_2$ distinction returns as the two standard regularizers, so the
shape of each is worth having in your head rather than looked up.

The unit balls are worth looking at rather than deriving, because it is their *shape* that later arguments use. Sweep p and watch the corners appear.

```artifact src=demos/norm-balls.jsx
```

## Dot product and angle

*Slide 6.* The dot product is the cosine of the angle between two vectors times their
lengths:
$$
x^{\mathsf T} y = |x|\,|y| \cos\theta,
\qquad
\cos\theta = \frac{x \cdot y}{|x|\,|y|}.
$$

| $\cos\theta$ | Meaning |
|---|---|
| $=1$ | $\theta = 0$, same direction |
| $=0$ | $\theta = 90^\circ$, perpendicular (orthogonal) |
| $>0$ | acute |
| $<0$ | obtuse |

This is the table behind every "is this point on the positive side of the boundary"
question in L3: $w^{\mathsf T}x > 0$ is precisely "the angle between $w$ and $x$ is acute."

## Unit vectors

*Slide 7.* When only direction matters, normalize. A unit vector $u$ has $\|u\| = 1$;
any $v$ becomes one by dividing by its length,
$$
\hat v = \frac{v}{\|v\|} = \frac{v}{\sqrt{v^{\mathsf T}v}},
\qquad \lambda = \frac{1}{\sqrt{v^{\mathsf T}v}}.
$$

## Vector projections

*Slide 8.* Project a data point $x$ onto a line spanned by unit vector $a$, losing as
little of the original information as possible. Any point on the line is $p = \alpha a$,
and the closest such point is the one where the residual $y = x - \alpha a$ is orthogonal
to $a$:
$$
a^{\mathsf T}(x - \alpha a) = 0
\;\Longrightarrow\;
a^{\mathsf T}x = \alpha\, a^{\mathsf T}a
\;\Longrightarrow\;
\alpha = \frac{a^{\mathsf T}x}{a^{\mathsf T}a},
$$
giving
$$
\operatorname{proj}_a(x) = \frac{a^{\mathsf T}x}{a^{\mathsf T}a}\,a.
$$

The derivation is three lines and generalizes verbatim from a line (1D) to a plane (2D) to
a hyperplane ($>2$D). It is also the geometric content of least squares, so it will be
back.

Drag either vector. The readout that never moves is the point: the residual stays orthogonal to $a$ whatever you do, and that is the entire definition.

```artifact src=demos/projection-2d.jsx
```

## Vector spaces and subspaces

*Slides 9-10.* A vector space is a set with addition $+ : V \otimes V \to V$ and scalar
multiplication $\cdot : \mathbb R \otimes V \to V$, satisfying closure, associativity,
distributivity, a zero, and additive inverses. Example: $\mathbb R^2$.

A subspace is a subset that is itself a vector space under the same operations, which
reduces to three conditions: contains the zero vector, closed under addition, closed under
scalar multiplication. Example: $\{(x,0)\} \subset \mathbb R^2$, the $x$-axis.

## Matrices

*Slide 11.* $A \in \mathbb R^{n \times m}$ has $n$ rows and $m$ columns, entries
$a_{ij} \in \mathbb R$. The named types:

| Type | Condition |
|---|---|
| Square | $n = m$ |
| Symmetric | $A^{\mathsf T} = A$ |
| Diagonal | all off-diagonal entries zero |
| Identity $I$ | diagonal, with all diagonal entries 1 |
| Orthogonal | square, rows and columns are orthonormal, $A^{-1} = A^{\mathsf T}$ |

## Matrix-vector multiplication

*Slides 12-14.* $Ax = y$. Matrices are linear transformations: multiplying stretches and
rotates the vector, with the entries governing how much of each. Dimensions must match -
$A \in \mathbb R^{n \times m}$ requires $x \in \mathbb R^{m \times 1}$.

The deck's concrete example (slide 12) is worth keeping because it makes the *units*
argument, and slide 14's **column view** - $Ax$ is a linear combination of the columns of
$A$, with the entries of $x$ as coefficients - is the reading note 05 needs later. Both, on
the deck's own numbers:

```artifact src=demos/matvec-column-view.jsx static math
```

One more reading: **orthogonal matrices** (slide 13) only rotate, leaving magnitudes and
the angles between vectors unchanged. Example, the 2D rotation
$A = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$.

## Linear independence and rank

*Slide 15.* $\{x_1, \dots, x_n\} \in \mathbb R^m$ is linearly independent if no vector is
a linear combination of the others; dependent if some $x_n = \sum_{i=1}^{n-1}\alpha_i x_i$.

Column rank is the size of the largest linearly independent subset of columns, row rank the
same for rows, and the two are equal - collectively, the rank.

## Probability basics

*Slides 17-18.* Sample space $\Omega$ (all outcomes of a random experiment, e.g.
$\{1,\dots,6\}$ for a die), event space $\mathcal F$ whose elements $A \subseteq \Omega$
are events (e.g. the evens $\{2,4,6\}$), and a probability measure
$P : \mathcal F \to \mathbb R$ satisfying the axioms:

1. $P(A) \ge 0$ for all $A \in \mathcal F$
2. $P(\Omega) = 1$
3. countable additivity - for disjoint $A_1, A_2, \dots$, $P(\cup_i A_i) = \sum_i P(A_i)$

Derived properties: $A \subseteq B \Rightarrow P(A) \le P(B)$;
$P(A \cap B) \le \min(P(A), P(B))$; $P(A \cup B) \le P(A) + P(B)$;
$P(\Omega \setminus A) = 1 - P(A)$; and for disjoint $A_1,\dots,A_k$ covering $\Omega$,
$\sum_{i=1}^k P(A_i) = 1$ (law of total probability).

Conditional probability, for $P(B) \ne 0$:
$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)},
$$
the measure of $A$ after observing $B$. If $A$ and $B$ are independent then
$P(A \cap B) = P(A)P(B)$, hence $P(A \mid B) = P(A)$.

## Random variables

*Slides 19-20.* A random variable is a real-valued function of outcomes,
$X : \Omega \to \mathbb R$, written uppercase and **not bold** - bold is reserved for
vectors, which matters in a course where $x$ is usually a feature vector.

Discrete: $P(X = k) = P(\{\omega : X(\omega) = k\})$.
Continuous: $P(a \le X \le b) = P(\{\omega : a \le X(\omega) \le b\})$.

Three ways to specify the measure:

| Object | Definition | Applies to |
|---|---|---|
| CDF $F_X : \mathbb R \to [0,1]$ | $F_X(x) \triangleq P(X \le x)$ | both |
| PMF $p_X$ | $p_X(x) \triangleq P(X = x)$ | discrete (finite value set) |
| PDF $f_X$ | $f_X(x) \triangleq \dfrac{dF_X(x)}{dx}$ | continuous, where $F_X$ is differentiable |

The warning the slide makes explicit: at a given point $f_X(x) \ne P(X = x)$, and $f_X(x)$
can exceed 1. What it gives is relative likelihood -
$P(x \le X \le x + \Delta x) \approx f_X(x)\,\Delta x$. A PDF need not exist, if $F_X$ is
not differentiable everywhere.

## Expectation and variance

*Slide 21.* For $g : \mathbb R \to \mathbb R$, the expectation of $g(X)$ is a weighted
average of $g$ weighted by the distribution:
$$
\mathbb E[g(X)] \triangleq \sum_x g(x)\,p_X(x)
\qquad\text{(discrete)},
\qquad
\mathbb E[g(X)] \triangleq \int_{-\infty}^{\infty} g(x)\,f_X(x)\,dx
\qquad\text{(continuous)}.
$$

Taking $g(x) = x$ recovers the mean. Variance measures concentration about the mean:
$$
\operatorname{Var}[X] \triangleq \mathbb E\big[(X - \mathbb E[X])^2\big] = \mathbb E[X^2] - \mathbb E[X]^2.
$$

The $\mathbb E[g(X)]$ form, rather than $\mathbb E[X]$, is the one that matters: the whole
empirical-risk construction in [note 00](note.html?course=CSCI-UA-473&note=00) is an
expectation of a loss function of the data, which is exactly $g$.

## Common distributions

*Slides 22-23.*

**Discrete**

| Distribution | Parameters | pmf | Models |
|---|---|---|---|
| Bernoulli$(p)$ | $0 \le p \le 1$ | $p$ if $x=1$, $1-p$ if $x=0$ | one flip of a coin with heads probability $p$ |
| Binomial$(n,p)$ | $0 \le p \le 1$ | $\binom{n}{x} p^x (1-p)^{n-x}$ | heads in $n$ independent flips |
| Geometric$(p)$ | $p > 0$ | $p(1-p)^{x-1}$ | flips until the first heads |
| Poisson$(\lambda)$ | $\lambda > 0$ | $e^{-\lambda}\lambda^x / x!$ | frequency of rare events over the nonnegative integers |

**Continuous**

| Distribution | Parameters | pdf |
|---|---|---|
| Uniform$(a,b)$ | $a < b$ | $1/(b-a)$ on $[a,b]$, else 0 |
| Exponential$(\lambda)$ | $\lambda > 0$ | $\lambda e^{-\lambda x}$ for $x \ge 0$, else 0 |
| Normal$(\mu, \sigma^2)$ | - | $\dfrac{1}{\sqrt{2\pi}\,\sigma}\exp\!\left(-\dfrac{(x-\mu)^2}{2\sigma^2}\right)$ |

## Two random variables

*Slides 24-25.* Joint CDF $F_{XY}(x,y) \triangleq P(X \le x, Y \le y)$, from which any
event involving $X$ and $Y$ can be computed. Marginals come from limits,
$F_X(x) = \lim_{y \to \infty} F_{XY}(x,y)$.

Joint and marginal pmf / pdf:
$$
p_{XY}(x,y) \triangleq P(X = x, Y = y),
\qquad
p_X(x) = \sum_y p_{XY}(x,y),
$$
$$
f_{XY}(x,y) = \frac{\partial^2 F_{XY}(x,y)}{\partial x\, \partial y},
\qquad
f_X(x) = \int_{-\infty}^{\infty} f_{XY}\,dy.
$$

Conditionals:
$$
p_{Y|X}(y \mid x) = \frac{p_{XY}(x,y)}{p_X(x)}
\quad (p_X(x) \ne 0),
\qquad
f_{Y|X}(y \mid x) = \frac{f_{XY}(x,y)}{f_X(x)}
\quad (f_X(x) \ne 0),
$$
with the slide flagging that the continuous case is delicate because
$P(X = x) = 0$ exactly.

And $\mathbb E[g(X,Y)] = \sum\sum g(x,y)\,p_{XY}(x,y)$ (slide 26).

Joint, marginal and conditional are three operations on one table:

```artifact src=demos/joint-marginal-grid.jsx static math
```

## Deferred

Vector calculus. It is the piece the optimization lectures assume, so it matters more than
either section above - fill this in when it is actually covered.
