---
title: Introduction to Markov Chains
date: 2025-11-25
---

## Stochastic processes and Markov chains

A **stochastic process** is a sequence of random variables
$$
(X_n)_{n\ge 0},
$$
where $n$ is usually interpreted as discrete time.

- The process takes values in a **state space** $\mathcal{S}$.
- $\mathcal{S}$ may be finite (e.g. $\{1,\dots,m\}$) or infinite (e.g. $\mathbb{N}$).
- Think of $X_n$ as “the state of the system at time $n$”.

> For a similar reason, here I have used parentheses instead of set brackets which are parsed incorrectly on the web.

### Markov property

We say a process $(X_n)_{n\ge 0}$ with values in $\mathcal{S}$ has the **Markov property** if for every $n\ge 0$ and all states
$$
i_0, i_1, \dots, i_{n-1}, i, j \in \mathcal{S},
$$
we have
$$
\mathbb{P}(X_{n+1} = j \mid X_n = i, X_{n-1} = i_{n-1}, \dots, X_0 = i_0)
= \mathbb{P}(X_{n+1} = j \mid X_n = i).
$$

Informally: the conditional distribution of the next state depends only on the current state, not on the entire past.

If in addition the transition probabilities do not depend on time $n$, so that
$$
\mathbb{P}(X_{n+1} = j \mid X_n = i) = p_{ij}
\quad \text{for all } n,
$$
then $(X_n)$ is called a **time-homogeneous Markov chain**.

---

## Transition matrix (finite state space)

Suppose $\mathcal{S} = \{1,\dots,m\}$ is finite. For a Markov chain with transition probabilities
$$
p_{ij} = \mathbb{P}(X_{n+1}=j \mid X_n=i),
$$
define the **transition matrix**
$$
P = (p_{ij})_{1\le i,j\le m}.
$$

Properties:

- For each $i$,
  $$
  p_{ij} \ge 0, \qquad \sum_{j=1}^m p_{ij} = 1.
  $$
  Thus each row of $P$ is a probability distribution on $\mathcal{S}$.
- In general $p_{ij} \ne p_{ji}$; $P$ need not be symmetric.

---

## Examples

> **Example (Weather chain).**  
> Let the state space be $\{1,2,3\}$ corresponding to $\{\text{sunny}, \text{rainy}, \text{cloudy}\}$.  
> Let $X_n$ denote the weather on day $n$. Assume the weather tomorrow depends only on today’s weather (not on earlier days).  
> Then $(X_n)$ is a Markov chain, and
> $$
> p_{ij} = \mathbb{P}(X_{n+1}=j \mid X_n=i)
> $$
> describes the chance of tomorrow’s weather $j$ given today’s weather $i$.  
> All such probabilities can be recorded in a $3\times 3$ transition matrix $P$.

> **Example (Gambler’s dice game).**  
> You start with $6$ dollars. At each step:
> - Pay $1$ dollar to play.  
> - Roll a fair die:
>   - If you roll a $6$, you win $6$ dollars.  
>   - Otherwise, you win nothing.  
> - You must stop once your money hits $0$.  
>
> Let $X_n$ be the amount of money you have after the $n$-th play. Then $(X_n)_{n\ge 0}$ is a Markov chain with state space $\{0,1,2,\dots\}$.  
> - State $0$ is absorbing: once you have $0$, you stay there,
>   $$
>   p_{00} = 1, \quad p_{0j} = 0 \text{ for } j>0.
>   $$
> - For $i>0$, with probability $1/6$ you gain $5$ dollars (pay $1$, win $6$), so you move from $i$ to $i+5$; with probability $5/6$ you lose $1$ dollar and move from $i$ to $i-1$:
>   $$
>   p_{i,i+5} = \frac{1}{6}, \quad p_{i,i-1} = \frac{5}{6}, \quad p_{ij}=0 \text{ otherwise}.
>   $$

---

## Evolving distributions and matrix multiplication

For a finite state space $\{1,\dots,m\}$, define
$$
v^{(n)}_i = \mathbb{P}(X_n = i), \quad i=1,\dots,m.
$$
Collect these into a row vector
$$
v^{(n)} = \big( v^{(n)}_1, \dots, v^{(n)}_m\big).
$$

We can compute $v^{(n+1)}$ from $v^{(n)}$ using the transition matrix $P$.

For each state $j$,
$$
\mathbb{P}(X_{n+1} = j)
= \sum_{i=1}^m \mathbb{P}(X_{n+1}=j, X_n = i)
= \sum_{i=1}^m \mathbb{P}(X_{n+1}=j \mid X_n=i)\, \mathbb{P}(X_n=i)
= \sum_{i=1}^m v^{(n)}_i p_{ij}.
$$

In matrix form,
$$
v^{(n+1)} = v^{(n)} P.
$$

Iterating,
$$
v^{(n)} = v^{(0)} P^n,
$$
where $v^{(0)}$ is the initial distribution of $X_0$.

---

## $n$-step transition probabilities and Chapman–Kolmogorov

Define the **$n$-step transition probabilities**
$$
p_{ij}^{(n)} = \mathbb{P}(X_n = j \mid X_0 = i).
$$

Let $P^{(n)} = (p_{ij}^{(n)})$ be the matrix whose $(i,j)$-entry is $p_{ij}^{(n)}$.

The **Chapman–Kolmogorov equations** state that for any $n,m \ge 0$,
$$
p_{ik}^{(n+m)} = \sum_{j} p_{ij}^{(n)} p_{jk}^{(m)}.
$$

In matrix form,
$$
P^{(n+m)} = P^{(n)} P^{(m)}.
$$
From this we deduce $P^{(n)} = P^n$ for all $n\ge 0$. Hence
$$
\mathbb{P}(X_n = j \mid X_0 = i) = (P^n)_{ij}.
$$

---

## Stationary distributions and long-term behavior

A probability vector $\pi = (\pi_1,\dots,\pi_m)$ on the state space is called a **stationary distribution** if
$$
\pi P = \pi, \qquad \sum_{j=1}^m \pi_j = 1, \quad \pi_j \ge 0.
$$

Interpretation: if $X_0$ has distribution $\pi$, then
$$
v^{(0)} = \pi \quad \Rightarrow \quad v^{(1)} = \pi P = \pi,
$$
and thus $v^{(n)} = \pi$ for all $n$. So $\pi$ is an invariant distribution of the chain.

For certain Markov chains (e.g. finite, irreducible, aperiodic chains—often called **ergodic**), the stationary distribution is unique and describes the long-term behavior:

- For any initial state $i$,
  $$
  \lim_{n\to\infty} p_{ij}^{(n)} = \pi_j,
  $$
  and thus the distribution of $X_n$ converges to $\pi$ as $n\to\infty$:
  $$
  v^{(n)} \to \pi.
  $$

> **Example (Random walk on a regular graph).**  
> Suppose the chain is a simple random walk on a finite, undirected, $d$-regular graph (each vertex has degree $d$). Then the uniform distribution on the vertices is stationary: starting from the uniform distribution, after one step you remain uniform. Under irreducibility and aperiodicity, this uniform distribution is also the limiting distribution.

In contrast, periodic chains can have stationary distributions but fail to have $P^n$ converge as $n\to\infty$. Understanding irreducibility, recurrence, transience, and periodicity is the next step in Markov chain theory.
