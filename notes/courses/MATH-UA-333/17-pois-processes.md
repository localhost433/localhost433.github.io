---
title: Poisson Processes
date: 2025-12-04
---

## Discrete motivation (binomial, Poisson, and exponential waiting times)

Recall: if $X \sim \mathrm{Bin}(n,p)$ with $n$ large and $np=\lambda$ fixed, then $X$ is well-approximated by $\mathrm{Pois}(\lambda)$.

A standard “rare events in small time bins” model:

- Divide the interval $[0,1]$ into $n$ subintervals
  $$
  I_{n,k} = \Big[\frac{k}{n}, \frac{k+1}{n}\Big), \qquad k=0,1,\dots,n-1.
  $$
- Assume that, independently for each $k$, an event happens during $I_{n,k}$ with probability $\lambda/n$.

Let $N(1)$ be the number of events in $[0,1]$. Then
$$
N(1) \sim \mathrm{Bin}\Big(n,\frac{\lambda}{n}\Big) \approx \mathrm{Pois}(\lambda).
$$

Let $T_1$ be the time of the first event. For $a>0$ with $a=k/n$,
$$
\mathbb{P}(T_1>a)
= \Big(1-\frac{\lambda}{n}\Big)^k
= \Big(1-\frac{\lambda}{n}\Big)^{an}
\longrightarrow e^{-\lambda a}.
$$
So $T_1$ is close to an $\mathrm{Exp}(\lambda)$ random variable. This is the heuristic bridge from “discrete rare events” to a continuous-time model.

---

## Poisson process: axiomatic definition

A collection of random variables $\{N(t): t\ge 0\}$, intended to count the number of events in $[0,t]$, is called a **Poisson process with rate (parameter) $\lambda>0$** if it satisfies:

1. **Starts at $0$:**
   $$
   N(0)=0.
   $$
2. **Independent increments:**
   if $(t_1,t_1'),\dots,(t_n,t_n')$ are disjoint time intervals, then
   $$
   N(t_1')-N(t_1),\ \dots,\ N(t_n')-N(t_n)
   $$
   are independent.
3. **Stationary increments:**
   the law of $N(t')-N(t)$ depends only on $t'-t$.
4. **One jump in a small interval:**
   for small $h$,
   $$
   \mathbb{P}(N(h)=1)=\lambda h + o(h).
   $$
5. **Two or more jumps are negligible:**
   for small $h$,
   $$
   \mathbb{P}(N(h)\ge 2)=o(h).
   $$

Here $o(h)$ means a quantity $r(h)$ such that $r(h)/h \to 0$ as $h\downarrow 0$.

---

## Alternative formulation (arrival times and exponential gaps)

A very useful equivalent viewpoint is in terms of **arrival times**.

Assume:

- $N(t)$ is integer-valued, nondecreasing in $t$, and $N(0)=0$.
- Define the $k$-th arrival time
  $$
  T_k := \inf\{t>0: N(t)=k\}, \qquad T_0:=0.
  $$
- Define the interarrival gaps
  $$
  X_k := T_k - T_{k-1}, \qquad k\ge 1.
  $$

If $(X_k)_{k\ge 1}$ are **independent and identically distributed** with
$$
X_k \sim \mathrm{Exp}(\lambda),
$$
then the counting process $N(t)$ defined by these arrival times is a Poisson process with rate $\lambda$.

Intuition: “events happen with constant hazard $\lambda$”, so the waiting time to the next event is memoryless and exponential.

---

## Distribution of $N(t)$

A key fact is:
$$
N(t) \sim \mathrm{Pois}(\lambda t).
$$

One way to see this from the interarrival-time model:

- Note that
  $$
  N(t)=k \quad \Longleftrightarrow \quad T_k \le t < T_{k+1}.
  $$
- Since $T_k = X_1+\cdots+X_k$ is a sum of $k$ i.i.d. $\mathrm{Exp}(\lambda)$ variables, it has a Gamma (Erlang) distribution:
  $$
  T_k \sim \mathrm{Gamma}(k,\lambda),
  \qquad
  f_{T_k}(s) = \frac{\lambda^k s^{k-1} e^{-\lambda s}}{(k-1)!},\quad s>0.
  $$

A standard computation (carried out by integrating over $\{x_1+\cdots+x_k\le t\}$ and using the exponential density) yields
$$
\mathbb{P}(N(t)=k) = \frac{(\lambda t)^k}{k!}e^{-\lambda t},
\qquad k=0,1,2,\dots
$$
which is exactly $\mathrm{Pois}(\lambda t)$.

---

## Independent increments (and why this is the defining feature)

Let $s,t>0$. The Poisson process satisfies
$$
N(s) \ \perp\perp \big(N(s+t)-N(s)\big),
\qquad
N(s)\sim\mathrm{Pois}(\lambda s),\quad
N(s+t)-N(s)\sim\mathrm{Pois}(\lambda t).
$$
Equivalently, for $k,\ell\in \mathbb{N}$,
$$
\mathbb{P}\big(N(s)=k,\ N(s+t)-N(s)=\ell\big)
= \mathbb{P}(N(s)=k)\,\mathbb{P}(N(t)=\ell)
= \frac{(\lambda s)^k}{k!}e^{-\lambda s}\cdot \frac{(\lambda t)^\ell}{\ell!}e^{-\lambda t}.
$$
More generally, for $0<t_1<\cdots<t_n$, the increments
$$
N(t_1),\quad N(t_2)-N(t_1),\quad \dots,\quad N(t_n)-N(t_{n-1})
$$
are independent, and each increment is Poisson with parameter $\lambda$ times the corresponding interval length.

---

## Some basic properties

### Markov property

From independent (and stationary) increments, $\{N(t)\}_{t\ge 0}$ is Markov:

for $t_1<\cdots<t_{n+1}$ and integers $k_1\le \cdots \le k_{n+1}$,
$$
\mathbb{P}\big(N(t_{n+1})=k_{n+1}\mid N(t_n)=k_n,\dots,N(t_1)=k_1\big) = \mathbb{P}\big(N(t_{n+1})=k_{n+1}\mid N(t_n)=k_n\big),
$$
and the right-hand side depends only on the increment $k_{n+1}-k_n$ over length $t_{n+1}-t_n$.

### Additivity (superposition)

If $\{N_1(t)\}\_{t\ge 0}$ and $\{N_2(t)\}\_{t\ge 0}$ are independent Poisson processes with rates $\lambda_1$ and $\lambda_2$, then
$$
N(t):=N_1(t)+N_2(t)
$$
is a Poisson process with rate $\lambda_1+\lambda_2$.

> **Example (two subway lines).**  
> $N_1(t)$ counts line A trains, $N_2(t)$ counts line E trains, independently.  
> Then total trains $N_1(t)+N_2(t)$ form a Poisson process with rate $\lambda_1+\lambda_2$.  
> This matches the fact that if $X_1\sim\mathrm{Exp}(\lambda_1)$ and $X_2\sim\mathrm{Exp}(\lambda_2)$ are independent, then
> $$
> \min\{X_1,X_2\}\sim \mathrm{Exp}(\lambda_1+\lambda_2).
> $$

### Division (thinning)

Let $\{N(t)\}_{t\ge 0}$ be a Poisson process with rate $\lambda$. Independently mark each event as “type 1” with probability $p$ and “type 2” with probability $1-p$.

Define:
- $N_1(t)$ = number of type 1 events up to time $t$,
- $N_2(t)$ = number of type 2 events up to time $t$.

Then:
- $\{N_1(t)\}$ is Poisson with rate $\lambda p$,
- $\{N_2(t)\}$ is Poisson with rate $\lambda(1-p)$,
- and the two processes are independent.

---

## Poisson point processes (geometric version)

Let $S\subset \mathbb{R}^n$ and let $\Theta$ be a random collection of points in $S$.

We say $\Theta$ is a **Poisson point process on $S$ with intensity $\lambda>0$** if:

1. For any (reasonable) set $A\subset S$,
   $$
   \mathrm{card}(A\cap \Theta) \sim \mathrm{Pois}\big(\lambda\cdot \mathrm{Area}(A)\big),
   $$
   where “Area” means $n$-dimensional volume (Lebesgue measure).
2. If $A,B\subset S$ are disjoint, then $\mathrm{card}(A\cap\Theta)$ and $\mathrm{card}(B\cap\Theta)$ are independent.

A key example: if $\{N(t)\}$ is a Poisson process with rate $\lambda$, then the set of arrival times $\{T_k\}_{k\ge 1}$ is a Poisson point process on $(0,\infty)$ with intensity $\lambda$.

Poisson point processes are common models for spatially scattered “rare” events, like raindrop impacts on a region.
