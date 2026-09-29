/* AUTO-GENERATED from practice-04.jsx by `npm run build:artifacts`. Do not edit. */
import { mcq } from "@course";

/* Note 04 practice. Keyed to the Boolean counterexample, Hoeffding for one
   bin and for M bins, the "g is not fixed in advance" gap, the two primary
   questions, the three-way split, loss versus error measure, and the two
   costed error measures. */

export default mcq({
  questions: [{
    stem: "Boolean targets on three Boolean inputs, with 5 of the 8 inputs seen. How many functions are in $\\mathbb H$, and how many are consistent with the data?",
    choices: [{
      text: "256 in $\\mathbb H$, of which 8 are consistent with the 5 seen points",
      correct: true
    }, {
      text: "256 in $\\mathbb H$, of which 32 are consistent with the 5 seen points"
    }, {
      text: "64 in $\\mathbb H$, of which 8 are consistent with the 5 seen points"
    }, {
      text: "8 in $\\mathbb H$, of which 3 are consistent with the 5 seen points"
    }],
    why: "A function is one output bit per input, so $|\\mathbb H| = 2^{2^3} = 256$. The 5 seen outputs are pinned and the 3 unseen ones are free, leaving $2^3 = 8$ survivors. The tempting **32** is $2^5$: it counts the pinned points instead of the free ones."
  }, {
    stem: "What does the 256 / 8 counterexample actually establish?",
    choices: [{
      text: "With no assumptions, the training data says nothing about the unseen inputs",
      correct: true
    }, {
      text: "Learning is impossible, whatever assumptions are later added about the data"
    }, {
      text: "Picking the simplest of the 8 survivors recovers $f$ on the unseen inputs"
    }, {
      text: "Any hypothesis that fits all 5 seen points gets the 3 unseen ones wrong"
    }],
    why: "The eight survivors agree on everything seen and split evenly on everything unseen, so **without assumptions** the data constrains nothing off the training set. The note warns against the stronger reading that learning is impossible: every fix later in the lecture is an assumption being added back. Preferring the simplest survivor is one such assumption, and nothing in the counterexample says it recovers $f$."
  }, {
    stem: "Two bins, one with $\\mu = 0.5$ and one with $\\mu = 0.05$, are sampled with the same $N$ and $\\epsilon$. How do their Hoeffding bounds on $\\mathbb P[|\\nu - \\mu| > \\epsilon]$ compare?",
    choices: [{
      text: "They are equal, since the bound depends on $N$ and $\\epsilon$ alone",
      correct: true
    }, {
      text: "Looser at $\\mu = 0.5$, since the spread of $\\nu$ is largest there"
    }, {
      text: "Looser at $\\mu = 0.05$, since rare red balls are hard to estimate"
    }, {
      text: "They can't be compared, since $\\mu$ is unknown in both bins"
    }],
    why: "$2e^{-2\\epsilon^2 N}$ has no $\\mu$ in it, and that is the whole trick: **the bound does not depend on the unknown $\\mu$**, so it can be used without knowing it. The tempting answer confuses the bound with the true deviation probability, which does vary with $\\mu$ (the spread of $\\nu$ peaks at $\\mu = 0.5$); the bound is one worst-case number that covers every bin."
  }, {
    stem: "In the learning form of Hoeffding, $\\mathbb P[\\,|E_{\\text{in}}(h) - E_{\\text{out}}(h)| > \\epsilon\\,] \\le 2e^{-2\\epsilon^2 N}$, which statement is correct?",
    choices: [{
      text: "$E_{\\text{in}}$ is random through the sample; $E_{\\text{out}}$ is fixed; $h$ is fixed first",
      correct: true
    }, {
      text: "$E_{\\text{out}}$ is random through the sample; $E_{\\text{in}}$ is fixed; $h$ is fixed first"
    }, {
      text: "$E_{\\text{in}}$ is random through the sample; $E_{\\text{out}}$ is fixed; $h$ may be chosen after"
    }, {
      text: "$E_{\\text{in}}$ and $E_{\\text{out}}$ are both random through the sample; $h$ is fixed first"
    }],
    why: "The correspondence is $\\nu = E_{\\text{in}}(h)$ and $\\mu = E_{\\text{out}}(h)$, so $E_{\\text{in}}$ carries the sampling randomness and $E_{\\text{out}}$ is a fixed population quantity. The tempting \"$h$ may be chosen after\" gets the randomness right but drops the theorem's condition: **$h$ is fixed before looking at the data**. Choosing $h$ after seeing the sample is exactly what learning does, and it is why the next step needs a factor of $M$."
  }, {
    stem: "A finite $\\mathbb H$ has $M = 100$ hypotheses. With $\\epsilon = 0.1$ and $N = 1000$, what is the bound on $\\mathbb P[|E_{\\text{in}}(g) - E_{\\text{out}}(g)| > \\epsilon]$?",
    choices: [{
      text: "About $4 \\times 10^{-7}$",
      correct: true
    }, {
      text: "About $4 \\times 10^{-9}$"
    }, {
      text: "About $9 \\times 10^{-3}$"
    }, {
      text: "About $3 \\times 10^{-85}$"
    }],
    why: "The exponent is $2\\epsilon^2 N = 2 \\times 0.01 \\times 1000 = 20$, and the union bound multiplies by $M$: $2 \\cdot 100 \\cdot e^{-20} \\approx 4 \\times 10^{-7}$. The tempting $4 \\times 10^{-9}$ is the **single-hypothesis** bound, which does not cover a $g$ picked from $\\mathbb H$. Dropping the 2 in the exponent gives $9 \\times 10^{-3}$, and forgetting to square $\\epsilon$ gives $3 \\times 10^{-85}$."
  }, {
    stem: "At $N = 1000$ the bound is computed for $\\epsilon = 0.1$. What $N$ gives the same bound at $\\epsilon = 0.05$?",
    choices: [{
      text: "$N = 4000$, since $N$ must make up the drop in $\\epsilon^2$",
      correct: true
    }, {
      text: "$N = 2000$, since $N$ must make up the drop in $\\epsilon$"
    }, {
      text: "$N = 250$, since a tighter $\\epsilon$ shrinks the bound too"
    }, {
      text: "$N = 1000$, since the bound is the same for every $\\epsilon$"
    }],
    why: "The exponent is $2\\epsilon^2 N$, so halving $\\epsilon$ divides it by four, and $N$ must grow **four times** to keep it fixed: halving the tolerance costs four times the data. The tempting 2000 treats the exponent as linear in $\\epsilon$. The 250 has the right factor in the wrong direction: a tighter tolerance makes the bad event more likely, so it needs more data, not less."
  }, {
    stem: "Why does the single-hypothesis Hoeffding bound not apply directly to the $g$ that PLA outputs?",
    choices: [{
      text: "$g$ is chosen using the data, so it was not fixed before the sample",
      correct: true
    }, {
      text: "Hoeffding needs $E_{\\text{in}} > 0$, and PLA can drive $E_{\\text{in}}(g)$ to 0"
    }, {
      text: "Hoeffding needs $E_{\\text{out}}$ known, and it is never observed for $g$"
    }, {
      text: "PLA revisits points across updates, so the sample is not independent"
    }],
    why: "Hoeffding needs a hypothesis **fixed before looking at the data**, but which $h_m$ becomes $g$ depends on $D$. Revisiting points during training does not change how the sample was drawn; the dependence that breaks the theorem is between $g$ and $D$, not among the points. What survives is a union bound over all $M$ candidates, giving $2Me^{-2\\epsilon^2 N}$."
  }, {
    stem: "The L3 perceptron has $w \\in \\mathbb R^d$, so $\\mathbb H$ is infinite. What does $2Me^{-2\\epsilon^2 N}$ tell you about its generalization?",
    choices: [{
      text: "Nothing either way, since with $M = \\infty$ the bound is vacuous",
      correct: true
    }, {
      text: "That it cannot generalize, since the bound on the gap is infinite"
    }, {
      text: "That a large enough $N$ still drives the bound down toward zero"
    }, {
      text: "That it generalizes, since each fixed $w$ obeys the one-bin bound"
    }],
    why: "With $M = \\infty$ the right-hand side is infinite at every $N$, and a probability bound above 1 **says nothing**. The tempting reading, that perceptrons cannot generalize, confuses a failed proof with a negative result: this bounding technique has run out, and VC dimension is the repair. The one-bin bound per fixed $w$ does not cover a $w$ chosen from the data."
  }, {
    stem: "Fitting the same 10 points, you switch from degree 3 to degree 9 polynomials. How does that act on the two primary questions?",
    choices: [{
      text: "Helps Question 2 (lower $E_{\\text{in}}$), hurts Question 1 (looser bound)",
      correct: true
    }, {
      text: "Helps Question 1 (tighter bound), hurts Question 2 (higher $E_{\\text{in}}$)"
    }, {
      text: "Helps both questions (lower $E_{\\text{in}}$, and a tighter bound)"
    }, {
      text: "Hurts both questions (higher $E_{\\text{in}}$, and a looser bound)"
    }],
    why: "Degree 9 contains every degree-3 polynomial, so $E_{\\text{in}}$ can only fall (here to exactly 0), which **helps Question 2**. The richer $\\mathbb H$ also raises the complexity $M$, loosening $2Me^{-2\\epsilon^2 N}$, which **hurts Question 1**. The reversed option describes moving toward a simpler model; the opposition between the two is why $E_{\\text{out}}$ traces a U."
  }, {
    stem: "Note 04 calls ERM, minimizing $E_{\\text{in}}$ over $\\mathbb H$, an attack on Question 2. Adding a regularizer $\\lambda C(g)$ to that objective is aimed at which question?",
    choices: [{
      text: "Question 1: it limits complexity, trading some $E_{\\text{in}}$ for a smaller gap",
      correct: true
    }, {
      text: "Question 2: it adds to the objective, pushing $E_{\\text{in}}$ below plain ERM's"
    }, {
      text: "Both: it gets a lower $E_{\\text{in}}$ than plain ERM and a smaller gap as well"
    }, {
      text: "Neither: it only rescales the objective, so plain ERM's $g$ still wins"
    }],
    why: "Plain ERM already finds the lowest $E_{\\text{in}}$ in $\\mathbb H$, so the penalty can only leave $E_{\\text{in}}$ where it is or raise it; it cannot push it lower. What it buys is **restrained complexity**, which is the lever on the $E_{\\text{in}}$-$E_{\\text{out}}$ gap, Question 1. The penalty is not a rescaling either: it adds a term that differs across hypotheses, so it changes which $g$ wins."
  }, {
    stem: "You fit each polynomial degree on $D_{\\text{Tr}}$, then keep the degree with the lowest validation error. Why is that validation error no longer a fair estimate of $E_{\\text{out}}$?",
    choices: [{
      text: "The degree was picked to make this score small, so it is biased low",
      correct: true
    }, {
      text: "The validation set is smaller than $D_{\\text{Tr}}$, so the score is too noisy"
    }, {
      text: "The validation points were also used to fit the polynomial coefficients"
    }, {
      text: "The validation data follow a different distribution than the test data"
    }],
    why: "Choosing the degree **with** the validation set is selecting a hypothesis using that set, so its score is the best of several and is biased low: the $M$-bins problem one level up. A small validation set makes the estimate noisy but not biased, and the other two options contradict the setup (the coefficients come from $D_{\\text{Tr}}$, and the validation set is assumed to match the test distribution). This is why the test set is kept apart and used **once**."
  }, {
    stem: "A bank trains its fingerprint model by minimizing cross-entropy, then judges it with its 1000 / 10 cost matrix. Which roles do the two play?",
    choices: [{
      text: "Cross-entropy guides training; the cost matrix scores the result for the bank",
      correct: true
    }, {
      text: "The cost matrix guides training; cross-entropy scores the result for the bank"
    }, {
      text: "Both guide training, being summed into a single objective that is minimized"
    }, {
      text: "Both score the result, while training runs on the 0-1 loss of each point"
    }],
    why: "The **loss** is what optimization drives down during training; the **error measure** is defined by the user to judge the model in problem terms. Cross-entropy is not human-interpretable in the bank's terms, and the cost matrix is the bank's own statement of what mistakes cost. Training on 0-1 loss is the tempting slip: it has zero gradient almost everywhere, which is why a smooth loss like cross-entropy is optimized instead."
  }, {
    stem: "Supermarket (false accept 1, false reject 10) and bank (false accept 1000, false reject 10) each start from a threshold tuned for equal costs. Which way should each move it?",
    choices: [{
      text: "Supermarket accepts more and bank rejects more, each avoiding its costlier error",
      correct: true
    }, {
      text: "Supermarket rejects more and bank accepts more, each avoiding its costlier error"
    }, {
      text: "Both accept more, since both matrices charge 10 for every false reject"
    }, {
      text: "Neither moves, since costs rescale the error but not the best hypothesis"
    }],
    why: "The supermarket's costlier mistake is the **false reject** (10 against 1), so it accepts more and tolerates extra false accepts. The bank's is the **false accept** (1000 against 10), so it rejects more. The shared 10 is a trap: what sets the direction is each matrix's ratio, and the two ratios point opposite ways. Costs do change the chosen hypothesis, since different error measures lead to different hypotheses."
  }, {
    stem: "On one test set, classifier A makes 2 false accepts and 50 false rejects; B makes 20 false accepts and 5 false rejects. Which has the lower total cost under each matrix?",
    choices: [{
      text: "The supermarket's matrix favors B and the bank's favors A",
      correct: true
    }, {
      text: "The supermarket's matrix favors A and the bank's favors B"
    }, {
      text: "Both matrices favor B, the one with fewer errors in total"
    }, {
      text: "Both matrices favor A, the one with fewer false accepts"
    }],
    why: "Supermarket: A costs $2 \\cdot 1 + 50 \\cdot 10 = 502$ and B costs $20 \\cdot 1 + 5 \\cdot 10 = 70$, so B. Bank: A costs $2 \\cdot 1000 + 50 \\cdot 10 = 2500$ and B costs $20 \\cdot 1000 + 5 \\cdot 10 = 20050$, so A. Counting errors (52 against 25) picks B for both, which is exactly what a **user-defined error measure** overrides: same data, same candidates, different winner."
  }]
});