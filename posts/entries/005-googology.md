---
title: A Glimpse into Googology
date: 2024-02-14
tags: [math]
author: R
location: St. Catharines, ON
---

This is a problem that really got me wondering "What is Googology?" during the summer, and I ended up reading about it. When I wrote this I was in my last days of high school, I came across an Instagram reel posing the question of comparing $2^{100!}$ and $(2^{100})!$ (the reel was just a joke, btw). We ended up arguing about this and came up with different methods to prove our ideas. 

## Numerical Method

### Stirling's Approximation

According to [Stirling's Approximation](https://en.wikipedia.org/wiki/Stirling%27s_approximation):

$$
n! \sim \sqrt{2\pi n} \left(\frac{n}{e}\right)^n
$$

"$\sim$" here means that the two quantities are asymptotic, i.e., the ratio between these two terms tends to 1 as $n \to \infty$. For one fixed $n$ it is an approximation, written $\approx$ below; the relative error is about $1/(12n)$, under 0.1% at $n = 100$. It is also a lower bound for every $n \geq 1$: $n! > \sqrt{2\pi n}\,(n/e)^n$.

So:

### For $2^{100!}$

$$
100! \approx \sqrt{2\pi \cdot 100} \left(\frac{100}{e}\right)^{100}
\approx 9.3 \times 10^{157}
$$

$$
2^{100!} \approx 2^{9.3 \times 10^{157}}
$$

### For $\left(2^{100}\right)!$

$$
(2^{100})! \approx \sqrt{\pi \cdot 2^{101}} \left(\frac{2^{100}}{e}\right)^{2^{100}} \approx 2.82 \times 10^{15} \cdot \left(4.66 \times 10^{29}\right)^{1.27 \times 10^{30}}
$$

Both numbers are far too large to write out, so it's difficult to compare them directly by hand. Their logarithms are not.

## Logarithm Approach

### $\log_2(2^{100!})$
$$
\log_2(2^{100!}) = 100!
$$

Using Stirling again:

$$
100! > \sqrt{2\pi \cdot 100} \left(\frac{100}{e}\right)^{100} > 25 \cdot \left(\frac{100}{e}\right)^{100} = 25 \cdot \frac{100^{100}}{e^{100}}
$$

Which approximates to:

$$ > 9.3 \times 10^{157} $$

### $\log_2((2^{100})!)$ (code attached in the [Appendix](#appendix))
Using Stirling again:

$$
(2^{100})! \approx \sqrt{2\pi \cdot 2^{100}} \left(\frac{2^{100}}{e}\right)^{2^{100}}
$$

Take log base 2:

$$
\log_2((2^{100})!) \approx \log_2 \sqrt{2\pi \cdot 2^{100}} + 2^{100} \log_2 \left(\frac{2^{100}}{e}\right)
$$

Breaking this down:

$$
= \frac{1}{2}(\log_2 2\pi + 100) + 2^{100}(100 - \log_2 e)
\approx 1.25 \times 10^{32}
$$

A bound needs no Stirling at all: $(2^{100})!$ is a product of $2^{100}$ factors, none larger than $2^{100}$, so $(2^{100})! < (2^{100})^{2^{100}}$ and $\log_2((2^{100})!) < 100 \cdot 2^{100} \approx 1.27 \times 10^{32}$.

### Conclusion

Since:

$$
9.3 \times 10^{157} > 1.27 \times 10^{32}
$$

We conclude:

$$
2^{100!} > (2^{100})!
$$

## Michael’s Method (Xiao 2024)

Not gonna lie, I think Michael made the best argument out of us all...

For $a \in \mathbb{Z}^+$, $a > 6$, we know $a! > a \cdot 2^a$ (at $a = 7$ it is $5040 > 896$, and going from $a$ to $a + 1$ multiplies the left side by $a + 1$ but the right side only by $2(a+1)/a < a + 1$). So:

$$
\begin{align*}
    2^{a!} &> 2^{a \cdot 2^a}\\
           &= (2^a)^{2^a}\\
           &= \underbrace{2^a \cdot 2^a \cdot \dots \cdot 2^a}_{2^a \text{ terms}}.
\end{align*}
$$

Then there is:

$$
(2^a)! = \underbrace{2^a \cdot (2^a - 1) \cdot \dots \cdot 1}_{2^a \text{ terms}}
$$

Each of the $2^a$ factors of $(2^a)!$ is at most $2^a$, and all but one are smaller, so:

$$
2^{a!} > (2^a)^{2^a} > (2^a)!
$$

and $a = 100$ is the original question.

## Alex’s Method (Li and Cheung 2024)

Compare growth rates through the exponents. On the left the exponent of 2 is a factorial; on the right, the bound above makes it at most $100 \cdot 2^{100}$:

$$
\log_2\left(2^{100!}\right) = 100! \approx 9.3 \times 10^{157},
\qquad
\log_2\left((2^{100})!\right) < 100 \cdot 2^{100} \approx 1.27 \times 10^{32}.
$$

A factorial outgrows any exponential, and here it is ahead by more than 125 orders of magnitude, so:

$$
2^{100!} > (2^{100})!
$$

## Appendix

```python
from sympy import pi, log, E

expression = (1/2) * (log(2*pi, 2) + 100) + 2**100 * (100 - log(E, 2))
evaluation = expression.evalf()
print(evaluation)
```