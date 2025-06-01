---
title: A Glimpse into Googology
date: 2024-02-14
tags: [math]
author: R
location: St. Catharines, ON
---

This is a problem really gets me wonder 'What is Googology?' during the summer, and I ended up reading about it. When I wrote this I was in my last days of high school, coming across a instagram reel gives the question of comparing $2^{100!}$ and $(2^{100})!$ (the reel was just making fun about math), we ended up arguing about this and come up with different methods to proof our ideas. 

## Numerical Method

### Stirling's Approximation

According to [Stirling's Approximation](https://en.wikipedia.org/wiki/Stirling%27s_approximation):

$$
n! \sim \sqrt{2\pi n} \left(\frac{n}{e}\right)^n
$$

"$\sim$" here means that the two quantities are asymptotic, i.e., the ratio between these two terms tends to 1 as $n \to \infty$.

So:

### For $2^{100!}$

$$
100! \sim \sqrt{2\pi \cdot 100} \left(\frac{100}{e}\right)^{100}
\approx 9.3 \times 10^{57}
$$

$$
2^{100!} \approx 2^{9.3 \times 10^{57}}
$$

### For $\left(2^{100}\right)!$

$$
2^{100}! \sim \sqrt{\pi \cdot 2^{101}} \left(\frac{2^{100}}{e}\right)^{2^{100}} \approx 2.82 \times 10^{15} \cdot \left(4.66 \times 10^{29}\right)^{1.26 \times 10^{30}}
$$

Both numbers are in the form of tetration (operation based on iterated exponentiation), so it's difficult to compare them directly by hand.

## Logarithm Approach

### $\log_2(2^{100!})$
$$
\log_2(2^{100!}) = 100!
$$

Using Stirling again:

$$
100! \sim \sqrt{2\pi \cdot 100} \left(\frac{100}{e}\right)^{100} > 25 \cdot \left(\frac{100}{e}\right)^{100} = 25 \cdot \frac{100^{100}}{e^{100}}
$$

Which approximates to:

$$ > 9.3 \times 10^{57} $$

### $\log_2((2^{100})!)$ (code attached in [Appendix](#appendix))
Using Stirling again:

$$
(2^{100})! \sim \sqrt{2\pi \cdot 2^{100}} \left(\frac{2^{100}}{e}\right)^{2^{100}}
$$

Take log base 2:

$$
\log_2((2^{100})!) \sim \log_2 \sqrt{2\pi \cdot 2^{100}} + 2^{100} \log_2 \left(\frac{2^{100}}{e}\right)
$$

Breaking this down:

$$
= \frac{1}{2}(\log_2 2\pi + 100) + 2^{100}(100 - \log_2 e)
\approx 1.25 \times 10^{32}
$$

### Conclusion

Since:

$$
9.3 \times 10^{57} > 1.25 \times 10^{32}
$$

We conclude:

$$
2^{100!} > (2^{100})!
$$

## Michael’s Method (Xiao 2024)

Ngl, I think Michael make the best argument out of us all...

For $a \in \mathbb{Z}^+$, $a > 6$, we know:

$$
\begin{align*}
        a! &> a \cdot 2^a\\
    2^{a!} &> 2^{a \cdot 2^a}\\
           &> (2^a)^{2^a}\\
           &= \underbrace{2^a \cdot 2^a \cdot \dots \cdot 2^a}_{2^a \text{ terms}}.
\end{align*}
$$

Then there is:

$$
(2^a)! = \underbrace{2^a \cdot (2^a - 1) \cdot \dots \cdot 1}_{2^a \text{ terms}}
$$

Clearly:

$$
2^{a!} > 2^{a \cdot 2^a} > (2^a)!
$$

## Alex’s Method (Li and Cheung 2024)

$$
100! \sim \sqrt{2\pi \cdot 100} \left(\frac{100}{e}\right)^{100} \sim 100^{100}
$$

And:

$$
(2^{100})! \sim \sqrt{2\pi \cdot 2^{100}} \left(\frac{2^{100}}{e}\right)^{2^{100}}
$$

Comparing growth rates, it's evident:

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