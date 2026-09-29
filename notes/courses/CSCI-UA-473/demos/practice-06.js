/* AUTO-GENERATED from practice-06.jsx by `npm run build:artifacts`. Do not edit. */
import { mcq } from "@course";

/* Note 06 practice. Keyed to the quartic-through-five-points picture, the
   slide 6 table, the ridge objective's N convention, what validation does and
   does not estimate, fold-back, model selection, leave-one-out, diagnosing high
   bias from high variance, and the bias-variance derivation with the sin(pi x)
   example. */

export default mcq({
  questions: [{
    stem: "Five noisy points from a quadratic target are fitted by least squares with a quartic. Which statement about $E_{\\text{in}}$ is right?",
    choices: [{
      text: "It is $0$ for any noise draw, since five coefficients meet five points",
      correct: true
    }, {
      text: "It is small but positive, since a polynomial cannot fit random noise"
    }, {
      text: "It equals the noise variance, the error floor that no model can remove"
    }, {
      text: "It is $0$ when the noise is zero and positive when noise is present"
    }],
    why: "A quartic has **five coefficients**, so with five points the design matrix is square and the fit interpolates, whatever $y$ values landed. Noise changes the curve between the points, never the training error. The noise variance is a floor for $E_{\\text{out}}$, not for $E_{\\text{in}}$, which is exactly why this fit looks perfect and predicts badly."
  }, {
    stem: "In the slide 6 table, the 50th-order target has no noise, yet the 10th-order fit gets $E_{\\text{in}} \\approx 10^{-5}$ and $E_{\\text{out}} = 7680$. What explains this?",
    choices: [{
      text: "The part of $f$ that $\\mathbb H_{10}$ cannot represent acts on the fit just like noise",
      correct: true
    }, {
      text: "A 10th-order fit has too few parameters to match the target in-sample"
    }, {
      text: "The target lies outside $\\mathbb H_{10}$, so every fit from it has $E_{\\text{out}}$ this high"
    }, {
      text: "With no noise the error is pure bias, since variance needs noise to arise"
    }],
    why: "From $\\mathbb H_{10}$'s point of view, whatever part of the 50th-order target it cannot represent is **indistinguishable from noise**, and the fit chases it as it would chase random error (LFD's deterministic noise). The in-sample fit is nearly perfect, so it is not short of parameters. And being outside $\\mathbb H_{10}$ sets no such floor: the 2nd-order fit to the same target reaches 0.120."
  }, {
    stem: "Slide 7 writes ridge as $E_{\\text{in}}(w) + \\tfrac{\\lambda}{N}w^{\\mathsf T}w$, with LFD's $E_{\\text{in}} = \\tfrac1N\\operatorname{RSS}$. How does its $\\lambda$ compare with L5's $\\operatorname{RSS} + \\lambda w^{\\mathsf T}w$?",
    choices: [{
      text: "Same $\\lambda$ and same minimizer, since the objective is L5's divided by $N$",
      correct: true
    }, {
      text: "This $\\lambda$ is $N$ times L5's, since here the penalty is divided by $N$"
    }, {
      text: "This $\\lambda$ is L5's divided by $N$, since here $E_{\\text{in}}$ carries a $\\tfrac1N$"
    }, {
      text: "Same $\\lambda$ but a new minimizer, since the $\\tfrac1N$ rescales the fit term"
    }],
    why: "$\\tfrac1N\\operatorname{RSS} + \\tfrac{\\lambda}{N}w^{\\mathsf T}w = \\tfrac1N(\\operatorname{RSS} + \\lambda w^{\\mathsf T}w)$, and **a positive constant factor does not move the minimizer**, so $\\lambda$ means the same number in both lectures. The \"$N$ times\" answer is what you get by reading the slide's first line literally, with a bare RSS; that reading contradicts the second line."
  }, {
    stem: "In the proof that $\\mathbb E[E_{\\text{val}}(g^-)] = E_{\\text{out}}(g^-)$, which step fails if $g^-$ was trained on some of the validation points?",
    choices: [{
      text: "Setting $\\mathbb E[e(g^-(x_n), y_n)] = E_{\\text{out}}(g^-)$ for each validation point",
      correct: true
    }, {
      text: "Moving the expectation over $D_{\\text{val}}$ inside the sum over the points"
    }, {
      text: "Collapsing the $K$ equal terms $\\tfrac1K\\sum E_{\\text{out}}(g^-)$ into one term"
    }, {
      text: "Summing the $K$ pointwise variances, which needs independent errors"
    }],
    why: "The middle equality needs $(x_n, y_n)$ to be a **fresh draw that $g^-$ never saw**; on a point it trained on, its expected error is lower than $E_{\\text{out}}$. Moving an expectation inside a finite sum is linearity and always holds. Summing variances belongs to the variance calculation, not to this proof of the mean."
  }, {
    stem: "With 0-1 error and $E_{\\text{out}}(g^-) = 0.1$, what is the standard deviation of $E_{\\text{val}}(g^-)$ at $K = 100$ and at $K = 400$?",
    choices: [{
      text: "$0.030$ at $K = 100$ and $0.015$ at $K = 400$",
      correct: true
    }, {
      text: "$0.030$ at $K = 100$ and $0.0075$ at $K = 400$"
    }, {
      text: "$0.032$ at $K = 100$ and $0.016$ at $K = 400$"
    }, {
      text: "$0.0009$ at $K = 100$ and $0.000225$ at $K = 400$"
    }],
    why: "A 0-1 error is **Bernoulli**, so $\\sigma^2 = 0.1 \\times 0.9 = 0.09$ and the standard deviation of $E_{\\text{val}}$ is $\\sqrt{0.09/K}$: $0.03$, then $0.015$. It scales as $1/\\sqrt K$, so quadrupling $K$ halves it rather than quartering it. The $0.032$ option takes the variance to be the mean $0.1$, and the $0.0009$ option reports variances, not standard deviations."
  }, {
    stem: "$N = 100$, and a classmate argues for $K = 80$ because more validation points give a tighter estimate. What is wrong with the argument?",
    choices: [{
      text: "$g^-$ now learns from only 20 points, so the tight estimate is of a poor hypothesis",
      correct: true
    }, {
      text: "$E_{\\text{val}}(g^-)$ becomes a biased estimate of $E_{\\text{out}}(g^-)$ as soon as $K$ exceeds $N/2$"
    }, {
      text: "After fold-back, the reported number turns optimistic about the shipped $g$"
    }, {
      text: "Nothing, since a tighter estimate of $g^-$ is also a tighter one of the final $g$"
    }],
    why: "$K$ comes out of $N$, so a large $K$ leaves **only $N - K$ points to train $g^-$**, and $E_{\\text{out}}(g^-)$ rises. The estimate stays unbiased for any $K$; it is just an estimate of a worse model. After fold-back the report becomes more pessimistic about $g$, not optimistic, which is why the 20% rule of thumb exists."
  }, {
    stem: "You validate, fold $D_{\\text{val}}$ back in, and retrain with the hyperparameters fixed. What do you ship and report, and how does the report relate to what you ship?",
    choices: [{
      text: "Ship $g$, report $E_{\\text{val}}(g^-)$, and expect it to be pessimistic for $g$",
      correct: true
    }, {
      text: "Ship $g$, report $E_{\\text{val}}(g^-)$, and expect it to be optimistic for $g$"
    }, {
      text: "Ship $g$, report $E_{\\text{val}}(g)$, and expect it to be unbiased for $g$"
    }, {
      text: "Ship $g^-$, report $E_{\\text{val}}(g^-)$, since retraining would void the estimate"
    }],
    why: "The report is unbiased for $g^-$, and it carries over to $g$ under the **learning-curve assumption** that more training data does not raise $E_{\\text{out}}$. If $E_{\\text{out}}(g) \\le E_{\\text{out}}(g^-)$, the number is, if anything, pessimistic about what you shipped. $E_{\\text{val}}(g)$ is useless because $g$ trained on those very points, and shipping $g^-$ would throw away data for no gain in honesty."
  }, {
    stem: "You train $M = 10$ values of $\\lambda$, keep the one with the smallest $E_{\\text{val}}$ on one validation set, and report that $E_{\\text{val}}$. As an estimate of the winner's $E_{\\text{out}}(g^-)$, the report is:",
    choices: [{
      text: "Optimistic, with an extra error term that grows like $\\sqrt{\\ln M / K}$",
      correct: true
    }, {
      text: "Unbiased, since each $E_{\\text{val}}(g_m^-)$ is always unbiased for its own $g_m^-$"
    }, {
      text: "Optimistic, with an extra error term that grows like $\\sqrt{M / K}$"
    }, {
      text: "Unbiased, but with $M$ times the variance of a single $E_{\\text{val}}$ estimate"
    }],
    why: "Each $E_{\\text{val}}(g_m^-)$ is unbiased on its own, but **the minimum of $M$ noisy estimates is biased low**: this is L4's $M$-bins problem one level up. The price in the bound is $O\\big(\\sqrt{\\ln M / K}\\big)$, only logarithmic in $M$, which is why choosing among a handful of $\\lambda$ values costs little. It is also why the test set stays out of the selection loop."
  }, {
    stem: "Leave-one-out averages $N$ errors $e_j$, each unbiased for its own $g_j^-$. Why is $\\sigma^2/N$ the wrong variance for $E_{\\text{cv}}$?",
    choices: [{
      text: "The $e_j$ are correlated, since two training sets share $N - 2$ points",
      correct: true
    }, {
      text: "The $e_j$ are biased, since each $g_j^-$ is trained on $N - 1$ points, not $N$"
    }, {
      text: "Each $e_j$ scores a single point, so the variance stays at the full $\\sigma^2$"
    }, {
      text: "The $e_j$ are independent, but each $g_j^-$ comes with a different $\\sigma^2$"
    }],
    why: "Summing variances to get $\\sigma^2/K$ needs **independent** terms. Two leave-one-out training sets differ in only two points, so $g_j^-$ and $g_k^-$ are nearly the same model and their errors move together. The average of $N$ correlated errors is still far steadier than one held-out point, so the variance is well below $\\sigma^2$, just not $\\sigma^2/N$."
  }, {
    stem: "Two models on a task whose noise variance is about 0.01. A: $E_{\\text{in}} = 0.30$, $E_{\\text{out}} = 0.32$. B: $E_{\\text{in}} = 0.02$, $E_{\\text{out}} = 0.35$. Which diagnosis and fix fit?",
    choices: [{
      text: "A has high bias, so enlarge $\\mathbb H$; B has high variance, so add data",
      correct: true
    }, {
      text: "A has high variance, so add data; B has high bias, so enlarge $\\mathbb H$"
    }, {
      text: "A has high bias, so add data; B has high variance, so enlarge $\\mathbb H$"
    }, {
      text: "Both have high variance, since each $E_{\\text{out}}$ sits above its own $E_{\\text{in}}$"
    }],
    why: "A's $E_{\\text{in}}$ is far above the noise floor with a **small gap**: the fits agree and are all wrong, so it needs a bigger $\\mathbb H$, and more data would barely help. B's $E_{\\text{in}}$ is near the floor with a **large gap**: the fits disagree from sample to sample, which more data, regularization or a smaller $\\mathbb H$ fixes. A gap of 0.02 is normal for any model and is not a sign of high variance."
  }, {
    stem: "With noisy targets $y = f(x) + \\varepsilon$ ($\\mathbb E[\\varepsilon] = 0$, variance $\\sigma^2$), where does $\\sigma^2$ appear in $\\mathbb E_D[E_{\\text{out}}]$?",
    choices: [{
      text: "As a separate added term, so that $\\mathbb E_D[E_{\\text{out}}] = \\text{bias} + \\text{var} + \\sigma^2$",
      correct: true
    }, {
      text: "Inside var, which is zero without noise and grows as $\\sigma^2$ grows"
    }, {
      text: "Inside bias, since $\\bar g$ averages the noise into the target"
    }, {
      text: "Nowhere, since averaging over $D$ cancels the zero-mean noise"
    }],
    why: "Expanding $(g - f - \\varepsilon)^2$ gives a cross term whose expectation is zero ($\\varepsilon$ has mean zero and is independent of the training data) and **one extra term, $\\sigma^2$**, a floor no choice of $\\mathbb H$ gets under. The var option fails because variance does not need noise: the noiseless $\\sin(\\pi x)$ example has a variance of about 1.68, all of it from the random draw of the two $x$'s."
  }, {
    stem: "$\\mathbb H_0$ ($h(x) = b$, fitted as the mean of the $y$'s) learns noiseless $\\sin(\\pi x)$ from $N$ points, $x$ uniform on $[-1, 1]$. In the deck's convention, what are bias and var?",
    choices: [{
      text: "bias $= \\tfrac12$ and var $= \\tfrac{1}{2N}$",
      correct: true
    }, {
      text: "bias $= 0$ and var $= \\tfrac{1}{2N}$"
    }, {
      text: "bias $= \\tfrac12$ and var $= \\tfrac{1}{2}$"
    }, {
      text: "bias $= \\tfrac{1}{2N}$ and var $= \\tfrac12$"
    }],
    why: "$\\bar g = \\mathbb E[b] = 0$ because $\\mathbb E[\\sin(\\pi x)] = 0$, so bias $= \\mathbb E[\\sin^2(\\pi x)] = \\tfrac12$ (the deck's bias is **already squared**). And $b$ is the mean of $N$ values each with variance $\\tfrac12$, so var $= \\tfrac{1}{2N}$, which is $0.25$ at $N = 2$. The zero-bias option mistakes $\\bar g = 0$ for a good fit: zero is the average hypothesis, and it misses the target by $\\tfrac12$."
  }, {
    stem: "$\\mathbb H_1$'s bias at $N = 2$ is about 0.207, while its best line ($a = 3/\\pi$, $b = 0$) has error about 0.196. Why do they differ?",
    choices: [{
      text: "$\\bar g$ is the average of lines learned from two points, not the best line in $\\mathbb H_1$",
      correct: true
    }, {
      text: "The bias includes some of the variance, which is why it comes out the larger"
    }, {
      text: "They are the same quantity, and the gap is rounding in the slide's simulation"
    }, {
      text: "The best line is fitted without noise, while $\\bar g$ averages fits to noisy data"
    }],
    why: "The best line minimizes error over all of $\\mathbb H_1$ given unlimited data. Bias is measured for **$\\bar g$, the average of what learning actually produces** from two points, and nothing forces that average to be the best line. Both numbers come from integrals computed in the note, not from a simulation, and the example is noiseless throughout."
  }, {
    stem: "Suppose bias$(M) = 1/M^2$ and var$(M) = M/8$. Where is bias $+$ var smallest?",
    choices: [{
      text: "$M = 16^{1/3} \\approx 2.52$, where var is twice bias",
      correct: true
    }, {
      text: "$M = 2$, where var and bias are equal"
    }, {
      text: "$M = 4^{1/3} \\approx 1.59$, where bias is twice var"
    }, {
      text: "$M = 32^{1/3} \\approx 3.17$, where var is four times bias"
    }],
    why: "The derivative $-2/M^3 + 1/8$ vanishes at $M^3 = 16$, where var $= 2/M^2 =$ twice bias and the sum is about $0.47$. The curves **cross** at $M = 2$, but the sum is still falling there ($0.5$), so \"pick the crossing\" is the wrong rule: the minimum is where the **slopes cancel**, not where the values match."
  }, {
    stem: "At $N = 2$ on $\\sin(\\pi x)$, $\\mathbb H_0$ beats $\\mathbb H_1$ (0.75 against about 1.9), although $\\mathbb H_1$ contains a far better line. Which change flips the verdict?",
    choices: [{
      text: "Training on four points per dataset rather than two",
      correct: true
    }, {
      text: "Averaging the estimate over many more simulated datasets"
    }, {
      text: "Adding zero-mean noise to the two training $y$ values"
    }, {
      text: "Fitting each $\\mathbb H_1$ line more precisely to its two points"
    }],
    why: "Bias barely moves with $N$, but **variance falls as $N$ grows**, and by $N = 4$ $\\mathbb H_1$ wins (0.55 against 0.625). More simulated datasets only sharpen the estimate of the same expectation, noise inflates $\\mathbb H_1$'s variance further, and a line through two points already fits them exactly. Hence the banner: match model complexity to the data, not to the target."
  }]
});