---
title: Conditional Probability and Independence
date: 2025-09-11
---

## Conditional probability

For events $E$ and $F$ with $P(F)>0$, the **conditional probability** of $E$ given $F$ is
$$
P(E\mid F)=\frac{P(E\cap F)}{P(F)}.
$$

Thinking of $F$ as a new sample space helps interpret $P(\cdot\mid F)$.  The product rule follows immediately: $P(E\cap F)=P(E\mid F)P(F)$, and more generally for events $E_1,\dots,E_n$ one can write
$$
P(E_1\cap\cdots\cap E_n)=P(E_1\mid E_2\cap\cdots\cap E_n)\,P(E_2\mid E_3\cap\cdots\cap E_n)\cdots P(E_n).
$$

The **law of total probability** states that if $F_1,\dots,F_m$ form a partition of $S$, then
$$
P(E)=\sum_{i=1}^m P(E\mid F_i)\,P(F_i).
$$

**Bayes’ formula** expresses the reversed conditional:
$$
P(F\mid E)=\frac{P(E\mid F)\,P(F)}{P(E)}=\frac{P(E\mid F)\,P(F)}{P(E\mid F)\,P(F)+P(E\mid F^c)\,P(F^c)}.
$$

> Examples
> - Alice flips a fair coin to decide between two classes; the probability she gets an A overall is $0.9\cdot 0.5 + 0.8\cdot 0.5=0.85$.
> - In a Covid test with 50% prevalence, sensitivity 96% and false‑positive rate 2%, if you test positive then $P(\text{Covid}\mid\text{positive}) = \frac{0.96\cdot 0.5}{0.96\cdot 0.5+0.02\cdot 0.5} = \frac{48}{49}$.
> - From an urn containing two unusual dice, drawing and rolling a 3 gives probability $P(\text{dice A}\mid\text{roll 3})=2/3$.

## Independence

Events $E$ and $F$ are **independent** if 
$$
P(E\cap F)=P(E)\,P(F).
$$
This means that knowing $F$ does not change the probability of $E$.  Independence is distinct from disjointness (mutually exclusive events): independent events can both occur.  If $E$ and $F$ are disjoint and independent, then one must have probability zero.  Independence extends to families of events: events $A_1,\dots,A_n$ are *pairwise independent* if every pair is independent, and *mutually independent* if $P(A_{i_1}\cap\cdots\cap A_{i_k})=P(A_{i_1})\cdots P(A_{i_k})$ for every $k\ge 2$.  Pairwise independence does not imply mutual independence; for three coins, the events “first flip is heads,” “second flip is tails” and “all flips are the same” are pairwise independent but not mutually independent.

## Applications

- **Product law**: rolling two dice, the event “sum=8” and the event “first roll is 2” are not independent since $P(E\cap F)=\tfrac{1}{36}\ne \tfrac{5}{36}\cdot \tfrac{1}{6}$; but “sum=7” and “first roll is 2” are independent.
- **Law of total probability and Bayes’ rule** appear in computing disease tests or decision trees as above.
- **Repeated trials**: if you repeatedly roll a die, the probability that the first 6 appears on the $n$‑th roll is $(5/6)^{\,n-1}\,(1/6)$ and the probability of exactly $k$ successes in $n$ rolls is given by the binomial distribution${n \choose k}(1/6)^k(5/6)^{\,n-k}$.

