---
title: Basic Combinatorics
date: 2025-09-04
---

## Counting principles

Let $n_1,\dots,n_k$ be the numbers of options in $k$ independent choices (e.g. rice, protein, beans, vegetables). The multiplication principle says that the total number of possible outcomes is
$$
n_1 \times n_2 \times \cdots \times n_k.
$$

When different cases must be considered separately, the addition principle says that if there are $m_1,\dots,m_\ell$ possibilities in each case, then the total number is $m_1 + \cdots + m_\ell$.  

## Permutations

A **permutation** of $n$ distinct objects is an ordering. There are $n! = n\times(n-1)\times\cdots\times 1$ ways to arrange $n$ objects.
> Example: five people solving five exam problems can assign problems to people in $5!=120$ ways.

## Combinations and binomial coefficients

To choose $k$ objects from $n$ without regard to order, count the ordered selections and then divide by $k!$. The number of subsets of size $k$ is
$$
{n \choose k} = \frac{n!}{k!\,(n-k)!},
$$

called a **binomial coefficient**.
> Example: from 30 students, the number of ways to choose 3 for a presentation is ${30 \choose 3}$.  

The binomial theorem expands $(a+b)^n$ as
$$
(a+b)^n=\sum_{k=0}^{n} {n\choose k} a^{n-k} b^{k}.
$$

Useful identities include ${n \choose k}={n \choose n-k}$ and the recursive sum $\sum_{i=0}^{k-1} {n-i\choose k-i-1}={n\choose k}$.

## Multinomial coefficients

To divide $n$ items into $r$ groups of sizes $n_1,\dots,n_r$ with $n_1+\cdots+n_r=n$, the number of ways is 
$$
\frac{n!}{n_1!n_2!\cdots n_r!}.
$$

For instance, arranging 30 students into ten presentation groups of three has ${30 \choose 3,3,\dots,3} = \tfrac{30!}{(3!)^{10}}$ possibilities.  

## Multiset permutations

If a word has repeated letters, e.g.\ P,E,P,P,E,R, the number of distinct rearrangements is $\tfrac{6!}{3!\,2!}$; count all $6!$ permutations and divide by the $3!$ ways to reorder the three P’s and $2!$ ways to reorder the two E’s.

## Stars and bars: integer partitions

To distribute $n$ identical candies among $r$ kids so each gets at least one, find the number of positive integer solutions to $x_1+\cdots+x_r=n$. Imagine placing $r-1$ dividers into $n-1$ slots to separate $n$ candies; there are ${n-1 \choose r-1}$ solutions. If zero candies are allowed, give each child one candy first and then distribute the remaining $n+r-1$ candies; the answer becomes ${n+r-1\choose r-1}$.

