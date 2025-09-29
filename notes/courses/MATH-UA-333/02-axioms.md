---
title: Axioms of Probability
date: 2025-09-06
---

## Sample space, events and set operations

A **sample space** $S$ is the set of all possible outcomes, and an **event** is a subset of $S$.  Sets can be combined using intersection ($A\cap B$), union ($A\cup B$), complement ($A^c$) and difference ($B\setminus A$); De Morgan’s laws $(A\cap B)^c=A^c\cup B^c$ and $(A\cup B)^c=A^c\cap B^c$ help relate complements.

## Probability measure axioms

A probability measure $P$ assigns numbers to events such that $0\le P(E)\le 1$, $P(\emptyset)=0$, $P(S)=1$, and $P(E_1\cup E_2\cup\cdots)=P(E_1)+P(E_2)+\cdots$ for disjoint events. Probabilities can be interpreted as areas in a Venn diagram.

### Identities and the inclusion–exclusion principle

From additivity one derives useful identities:

- Complement: $P(A^c)=1-P(A)$.
- Decomposition: $P(B)=P(A\cap B)+P(B\setminus A)$.
- Union: $P(A\cup B)=P(A)+P(B)-P(A\cap B)$, and more generally for $n$ events the inclusion–exclusion formula sums intersections of increasing size with alternating signs. The union bound states $P(E_1\cup\cdots\cup E_n)\le P(E_1)+\cdots+P(E_n)$.

## Uniform probability on finite spaces

If $S$ has finitely many equally likely outcomes, then
$$
P(E)=\frac{\text{Number of elements in } E}{\text{Number of elements in } S}.
$$

> Example: two dice have $36$ equally likely outcomes; the event “sum = 7” contains six outcomes, so the probability is $6/36=1/6$.  Drawing 7 cards from a 52‑card deck, the probability of getting a four‑of‑a‑kind is 
> $$
> P(E)=\frac{13\cdot {48\choose 3}}{{52\choose 7}}.
> $$

In the birthday problem with 23 people, the probability that at least two share a birthday is $1-\frac{365\cdot364\cdots(365-22)}{365^{23}}$, which exceeds $\tfrac{1}{2}$.

## Examples and applications

- **Coin‑flip experiment:** sample space $\{HH,HT,TH,TT\}$; event “flips differ” has two outcomes, so $P=2/4=1/2$.
- **Presentation order:** the six permutations of three presenters form the sample space; the event “Alice goes first” has two outcomes, giving probability $1/3$.
- **Derangements:** permuting $n$ students’ seats, let $A_k$ be the event that student $k$ stays put.  By inclusion–exclusion, the probability at least one student remains fixed is $\sum_{k=1}^n(-1)^{k-1}{n\choose k}\frac{(n-k)!}{n!}$.

