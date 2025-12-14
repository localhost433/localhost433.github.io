---
title: Intro to Information Theory, Entropy, and Coding
date: 2025-12-09
---

## Entropy of a discrete random variable

We only consider entropy for **discrete** random variables.

Let $X$ be a discrete random variable taking values in a set $\{a\_i\}\_\text{i\in I}$ (distinct values), with p.m.f.
$$
p_i := \mathbb{P}(X=a_i).
$$
The **entropy** of $X$ (in bits) is
$$
H(X) := \sum_{i\in I} \big(-p_i \log_2 p_i\big),
$$
with the convention $0\log_2 0 := 0$.

Interpretation: $H(X)$ measures the “uncertainty” in $X$, or equivalently the average number of **yes/no bits** needed to specify an outcome of $X$.

### Examples

1. **$n$ fair coin flips.**  
   Each outcome has probability $2^{-n}$, and there are $2^n$ outcomes, so
   $$
   H(X)=2^n\Big(-2^{-n}\log_2(2^{-n})\Big)=n.
   $$

2. **Geometric with parameter $1/2$.**  
   If $X\sim\mathrm{Geom}(1/2)$ with $\mathbb{P}(X=n)=2^{-n}$ for $n\ge 1$, then
   $$
   H(X)=\sum_{n=1}^\infty \big(-2^{-n}\log_2(2^{-n})\big)
   =\sum_{n=1}^\infty n2^{-n}
   =2.
   $$

---

## Joint entropy

Let $X,Y$ be discrete with joint p.m.f.
$$
p_{ij} := \mathbb{P}(X=x_i,\ Y=y_j).
$$
The **joint entropy** of $(X,Y)$ is
$$
H(X,Y) := \sum_{i,j} \big(-p_{ij}\log_2 p_{ij}\big).
$$
This is the same as the entropy of the single random variable $Z=(X,Y)$.

If $X$ and $Y$ are independent, then $p_{ij}=p_i q_j$ and
$$
H(X,Y)=H(X)+H(Y).
$$

---

## Conditional entropy

Fix a value $y_j$ with $\mathbb{P}(Y=y_j)>0$. Let the conditional p.m.f. be
$$
p(x_i\mid y_j):=\mathbb{P}(X=x_i\mid Y=y_j).
$$
Define the **conditional entropy given $Y=y_j$** by
$$
H_{Y=y_j}(X):=\sum_i \big(-p(x_i\mid y_j)\log_2 p(x_i\mid y_j)\big).
$$
Then the **conditional entropy of $X$ given $Y$** is the average over $Y$:
$$
H_Y(X):=\sum_j H_{Y=y_j}(X)\, \mathbb{P}(Y=y_j).
$$

Note the contrast:

- $\mathbb{E}[X\mid Y]$ is a random variable (a function of $Y$).
- $H_Y(X)$ is a single number.

---

## Chain rule for entropy

For any discrete $X,Y$,
$$
H(X,Y)=H_Y(X)+H(Y)=H_X(Y)+H(X).
$$

Sketch (algebraic proof idea): use $p_{ij}=p(x_i\mid y_j)p_Y(y_j)$ and expand
$$
-\log_2 p_{ij}= -\log_2 p(x_i\mid y_j) - \log_2 p_Y(y_j),
$$
then sum against $p_{ij}$ and rearrange.

### Example (two dice)

Roll two fair dice. Let $Y$ be the first die, and let $X$ be the sum.

- The pair $(X,Y)$ is uniform over $36$ outcomes, so
  $$
  H(X,Y)=\log_2 36.
  $$
- $Y$ is uniform on $\{1,\dots,6\}$, so $H(Y)=\log_2 6$.
- Given $Y=j$, the sum $X$ is uniform on $\{j+1,\dots,j+6\}$, so
  $$
  H_{Y=j}(X)=\log_2 6
  \quad\Rightarrow\quad
  H_Y(X)=\log_2 6.
  $$
Thus $H(X,Y)=H_Y(X)+H(Y)=\log_2 6+\log_2 6=\log_2 36$.

---

## Conditioning reduces entropy

For any discrete $X,Y$,
$$
H_Y(X)\le H(X),
$$
with equality if and only if $X$ and $Y$ are independent.

Interpretation: having more information (knowing $Y$) cannot increase your uncertainty about $X$.

Proof idea (what is used): consider the convex function
$$
f(x)=-x\log_2 x \quad (x\in[0,1]),
$$
and apply Jensen’s inequality to an appropriate average of conditional probabilities (this yields the inequality, and equality forces all the conditionals to be the same, which is exactly independence).

---

## Maximum entropy (uniform is most uncertain)

If $X$ takes values in a finite set of size $n$, then
$$
H(X)\le \log_2 n,
$$
with equality if and only if $X$ is uniform on those $n$ outcomes.

Intuition: entropy is maximized when probability mass is spread out as evenly as possible.

---

## Entropy and coding (the “20 questions” viewpoint)

Think of learning the value of $X$ by asking yes/no questions (equivalently, encoding outcomes using bits 0/1).

A **binary code** assigns to each possible value $x_k$ a distinct finite 0/1 string. Let $n_k$ be the length (number of bits) used for $x_k$. The expected code length is
$$
\mathbb{E}[\text{bits}]=\sum_k \mathbb{P}(X=x_k)\, n_k.
$$

### Shannon’s coding theorem (as stated in lecture)

- For any such binary encoding, the expected number of bits satisfies
  $$
  \sum_k \mathbb{P}(X=x_k)\, n_k \ \ge\ H(X).
  $$
- There exists an encoding (a good one) for which
  $$
  \sum_k \mathbb{P}(X=x_k)\, n_k \ \le\ H(X)+1.
  $$

Interpretation: $H(X)$ is the fundamental lower bound (in bits) for average description length, and you can get within $1$ bit of it.

---

## Huffman coding (constructing a near-optimal code)

Huffman coding builds a binary tree bottom-up from symbol probabilities.

Algorithm (high level):

1. Start with $m$ leaf nodes for outcomes $x_1,\dots,x_m$, with weights $p_k=\mathbb{P}(X=x_k)$.
2. Repeatedly pick the two nodes with smallest weights, merge them into a new node whose weight is the sum.
3. Continue until one connected tree remains.
4. Read off the 0/1 code by labeling the two edges out of each internal node with 0 and 1. The codeword for a leaf is the sequence of labels from root to that leaf.

Fact: Huffman codes achieve expected length at most $H(X)+1$ (so they match the theorem’s guarantee).

### Example (one fair die)

If $X$ is uniform on $\{1,2,3,4,5,6\}$, then
$$
H(X)= -6\cdot\frac{1}{6}\log_2\Big(\frac{1}{6}\Big)=\log_2 6\approx 2.58.
$$
A Huffman code can achieve expected length
$$
\mathbb{E}[\text{bits}]=\frac{8}{3}\approx 2.6667,
$$
which is within $1$ bit of $H(X)$, as promised.

---

## Intuition and how to use this

- Entropy is an average of “surprisal” $-\log_2 p(X)$, so rare outcomes contribute many bits, common outcomes contribute few bits.
- Joint entropy behaves like “total uncertainty”, conditional entropy behaves like “remaining uncertainty after you learn $Y$”.
- The chain rule $H(X,Y)=H(Y)+H(X\mid Y)$ is the entropy analogue of “total = first part + leftover”.
- The coding theorem turns these probability concepts into a concrete operational statement: you cannot compress, on average, below $H(X)$ bits, and Huffman coding is a constructive way to get close.
