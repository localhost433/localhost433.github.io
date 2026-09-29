import { mcq } from "@course";

/* Note 05 practice. Keyed to noisy targets, categorical coding, the
   linear-in-w test, the shape bookkeeping and geometry of the normal
   equations, the two ways X^T X goes singular and the lambda I repair, the
   degrees-of-freedom counts behind sigma-hat, Z and F, interpolation by a
   polynomial, and the ridge / lasso / L-infinity comparison. */

export default mcq({
  questions: [
    {
      stem: "Two customers have identical features, yet one repays and one defaults. Where does that uncertainty live, and can a richer $\\mathbb H$ remove it?",
      choices: [
        { text: "In $P(y \\mid x)$; no, one input still gets one prediction", correct: true },
        { text: "In $P(y \\mid x)$; yes, a rich enough $\\mathbb H$ fits both labels" },
        { text: "In $P(x)$; no, the inputs were drawn from a noisy source" },
        { text: "In $\\mathbb H$; yes, the noise is the gap between $\\mathbb H$ and $f$" },
      ],
      why: "The label is random given the features, so the uncertainty sits in the **target distribution $P(y \\mid x)$**. Any $h \\in \\mathbb H$ is a function of $x$, so two identical inputs get the same prediction but carry different labels, whatever the capacity. The gap between $\\mathbb H$ and $f$ is approximation error, a different thing: it shrinks with capacity, the noise does not.",
    },
    {
      stem: "A 5-level categorical feature is coded as a single numeric column holding the integers 1 to 5. What goes wrong?",
      choices: [
        { text: "It imposes an order and equal gaps the levels need not have", correct: true },
        { text: "It adds one weight per level, so the model tends to overfit" },
        { text: "It makes $X^{\\mathsf T}X$ singular, being collinear with the bias" },
        { text: "Nothing, since the one weight can learn any gap between levels" },
      ],
      why: "One column means one weight $w$, so level $k$ contributes $w \\cdot k$: every step between neighbouring levels is forced to be the **same size**, in a fixed order. The note's example: nothing supports Doctoral minus Graduate equalling Graduate minus Undergraduate. The column is not constant, so it is not collinear with the bias; the per-level weights belong to one-hot coding, which is the fix.",
    },
    {
      stem: "Which of these models is NOT a linear model in the sense of the lecture?",
      choices: [
        { text: "$h(x) = w_0 + w_1 x_1 + w_2 x_2^{w_3}$", correct: true },
        { text: "$h(x) = w_0 + w_1 x_1 + w_2 x_2^{3}$" },
        { text: "$h(x) = w_0 + w_1 \\log x_1 + w_2 x_2$" },
        { text: "$h(x) = w_0 + w_1 x_1 x_2 + w_2 e^{x_2}$" },
      ],
      why: "The test is **linearity in $w$**; the features may be any fixed non-linear functions of $x$ (basis expansion). A cube, a log, a product $x_1x_2$ and $e^{x_2}$ are all fixed transforms, so those three models are linear and the normal equations apply. Only $x_2^{w_3}$ puts a weight in the exponent, which is non-linear in $w$.",
    },
    {
      stem: "$N = 4$ examples, $d = 2$ features, bias absorbed into $X$. What are the shapes of $X^{\\mathsf T}X$, $X^{\\mathsf T}y$ and $\\hat w$?",
      choices: [
        { text: "$3 \\times 3$, a 3-vector, and a 3-vector", correct: true },
        { text: "$4 \\times 4$, a 4-vector, and a 4-vector" },
        { text: "$3 \\times 3$, a 4-vector, and a 3-vector" },
        { text: "$2 \\times 2$, a 2-vector, and a 2-vector" },
      ],
      why: "With the bias absorbed, $X$ is $4 \\times 3$ (rows are examples, one column per feature plus the constant), so $X^{\\mathsf T}X$ is **$(d+1) \\times (d+1) = 3 \\times 3$**, not $N \\times N$. Getting $4 \\times 4$ means $XX^{\\mathsf T}$ was formed instead, and every later shape goes wrong. Dropping the bias column gives the $2 \\times 2$ answer.",
    },
    {
      stem: "At the least-squares optimum, which condition says that $\\hat y$ is the orthogonal projection of $y$ onto the column space of $X$?",
      choices: [
        { text: "$X^{\\mathsf T}(y - \\hat y) = 0$: residual $\\perp$ each column of $X$", correct: true },
        { text: "$X(y - \\hat y) = 0$: residual $\\perp$ each row of $X$" },
        { text: "$X^{\\mathsf T}\\hat y = 0$: prediction $\\perp$ each column of $X$" },
        { text: "$y - \\hat y = 0$: the fit passes through each point" },
      ],
      why: "Setting the gradient $-2X^{\\mathsf T}(y - Xw)$ to zero gives $X^{\\mathsf T}(y - \\hat y) = 0$: the **residual is orthogonal to every column** of $X$, hence to the whole column space, which is the definition of orthogonal projection. $X(y - \\hat y)$ does not even have matching shapes unless $N = d+1$. The residual is generally not zero, only orthogonal.",
    },
    {
      stem: "A model keeps its bias column and adds a 5-level feature as 5 one-hot columns (one per level, as in the note's table). $N = 1000$, every level present. What is true of $X^{\\mathsf T}X$?",
      choices: [
        { text: "Singular, since the five one-hot columns sum to the bias column", correct: true },
        { text: "Singular, since each one-hot column is orthogonal to the bias" },
        { text: "Invertible, since $N = 1000$ far exceeds the six parameters" },
        { text: "Invertible, since one-hot columns are orthogonal to each other" },
      ],
      why: "Every row has exactly one 1 among the five one-hot columns, so they **add up to the all-ones bias column**: an exact collinearity, and $X^{\\mathsf T}X$ is rank 5 of 6 however large $N$ is. More data fixes only the $N < d+1$ kind of singularity. The one-hot columns are indeed mutually orthogonal, but that says nothing about their relation to the bias; the usual repair is to drop one level (5 levels, 4 columns) or use ridge.",
    },
    {
      stem: "$X^{\\mathsf T}X$ is singular. What does replacing it with $X^{\\mathsf T}X + \\lambda I$ do?",
      choices: [
        { text: "Makes it invertible for any $\\lambda > 0$, whatever the rank of $X$", correct: true },
        { text: "Makes it invertible only once $\\lambda$ exceeds its largest eigenvalue" },
        { text: "Makes it invertible only when the cause was $N < d + 1$" },
        { text: "Leaves it singular, since $\\lambda I$ keeps the null space" },
      ],
      why: "$X^{\\mathsf T}X$ is positive semidefinite, so its eigenvalues are $\\ge 0$; adding $\\lambda I$ shifts **every eigenvalue up by $\\lambda$**, making all of them positive. Only the smallest eigenvalue (the zero one) needs lifting, so $\\lambda$ need not beat the largest. This works for both kinds of singularity and gives ridge a unique solution where least squares has infinitely many.",
    },
    {
      stem: "$N = 50$ and $d = 9$ (plus a bias). What is the denominator in $\\hat\\sigma^2$?",
      choices: [
        { text: "$40$, from $N - d - 1$", correct: true },
        { text: "$41$, from $N - d$" },
        { text: "$50$, from $N$ alone" },
        { text: "$39$, from $N - d - 2$" },
      ],
      why: "The RSS is divided by $N - d - 1 = 50 - 9 - 1 = 40$. The correction is for **degrees of freedom**: $d + 1 = 10$ parameters (nine weights and the bias) were fitted from the same data. Dividing by $N - d$ forgets that the bias was fitted too.",
    },
    {
      stem: "Features A and B have the same $\\hat w_j$, but $v_A = 0.01$ and $v_B = 1$, where $v_j = [(X^{\\mathsf T}X)^{-1}]_{jj}$. How do their Z-scores compare?",
      choices: [
        { text: "$|z_A|$ is 10 times $|z_B|$, so A looks more important", correct: true },
        { text: "$|z_B|$ is 10 times $|z_A|$, so B looks more important" },
        { text: "$|z_A|$ is 100 times $|z_B|$, so A looks more important" },
        { text: "$|z_A|$ equals $|z_B|$, as both share the same $\\hat w_j$" },
      ],
      why: "Since $z_j = \\hat w_j / (\\hat\\sigma\\sqrt{v_j})$, the ratio is $\\sqrt{v_B / v_A} = \\sqrt{100} = $ **10**, in A's favour. Forgetting the square root gives 100. A large $v_j$ means an unstable estimate, which is exactly why reading the raw coefficient alone misleads.",
    },
    {
      stem: "$N = 100$. A model with $d_1 = 9$ features is compared with a nested model using 4 of them. What are the numerator and denominator degrees of freedom of $F$?",
      choices: [
        { text: "$5$ and $90$", correct: true },
        { text: "$5$ and $91$" },
        { text: "$6$ and $90$" },
        { text: "$4$ and $90$" },
      ],
      why: "The numerator divides by $d_1 - d_0 = 9 - 4 = 5$, the parameters added; the bias is in **both** models, so it cancels and is not an extra parameter. The denominator is $N - d_1 - 1 = 100 - 9 - 1 = 90$, the residual degrees of freedom of the bigger model, where the bias does count. $91$ forgets it there.",
    },
    {
      stem: "Four points with distinct $x$ values are fitted by a degree-3 polynomial using the normal equations. What is the training RSS?",
      choices: [
        { text: "Zero, since the $4 \\times 4$ design matrix is invertible", correct: true },
        { text: "Zero, but only when the four targets are noise-free" },
        { text: "Positive, since four points rarely lie on one cubic" },
        { text: "Undefined, since $X^{\\mathsf T}X$ is singular at $N = d + 1$" },
      ],
      why: "Four weights $w_0, \\dots, w_3$ and four points make $X$ a **square Vandermonde matrix**, invertible when the $x$ values are distinct, so the cubic interpolates and RSS is exactly zero, noise or not. Singularity needs $N < d + 1$; here $N = d + 1 = 4$, the boundary case where the fit is exact. Zero training error with noisy targets is the overfitting L6 picks up.",
    },
    {
      stem: "Which of ridge and lasso has a closed-form minimizer, and why?",
      choices: [
        { text: "Ridge, since its gradient stays linear in $w$ with the penalty", correct: true },
        { text: "Lasso, since $\\lvert w_j\\rvert$ is piecewise linear, so easy to minimize" },
        { text: "Both, since each objective is convex and so has a formula" },
        { text: "Neither, since any penalty makes the gradient non-linear" },
      ],
      why: "Ridge adds $\\lambda w^{\\mathsf T}w$, so the gradient stays **linear in $w$** and setting it to zero gives $\\hat w = (X^{\\mathsf T}X + \\lambda I)^{-1}X^{\\mathsf T}y$. The lasso's $\\lvert w_j \\rvert$ has a kink at zero, so there is no gradient equation to solve in one step. Convexity guarantees a global minimum, not a formula for it.",
    },
    {
      stem: "Why does the lasso's $L_1$ constraint produce exact zeros while ridge's $L_2$ constraint does not?",
      choices: [
        { text: "The diamond's corners lie on the axes, where contours usually touch", correct: true },
        { text: "The diamond is smaller than the circle, so it shrinks weights further" },
        { text: "The lasso penalty is not convex, so its minimum jumps to exact zeros" },
        { text: "The circle's corners lie off the axes, so contours touch away from 0" },
      ],
      why: "The diamond $\\lvert w_1\\rvert + \\lvert w_2\\rvert \\le t$ has its corners **on the axes**, where one coefficient is exactly zero, and an elliptical RSS contour typically touches a corner first. The circle has no corners, so contact is at a generic point and coefficients shrink without vanishing. Shrinking harder is not the same as hitting zero: sparsity comes from the shape, not the size, and the $L_1$ penalty is convex.",
    },
    {
      stem: "The $L_\\infty$ constraint $\\max_j \\lvert w_j\\rvert \\le t$ is a square in 2-D, so it has corners too. Why does it not zero coefficients the way the $L_1$ diamond does?",
      choices: [
        { text: "Its corners sit at $(\\pm t, \\pm t)$, where no coefficient is zero", correct: true },
        { text: "Its corners sit at $(\\pm t, 0)$ and $(0, \\pm t)$, but it is too large" },
        { text: "Its corners sit on the axes, but a square is not a convex region" },
        { text: "It has no corners at all, so contours meet it smoothly like a circle" },
      ],
      why: "The square's corners are at $(\\pm t, \\pm t)$, **off the axes**, so a contour that touches a corner lands where $\\lvert w_1\\rvert = \\lvert w_2\\rvert = t$: equal magnitudes, not zeros. On an edge one coordinate is pinned at $\\pm t$ and the other is generic, so still no zero. Having corners is not enough; the diamond's sit on the axes, and that is why the lasso zeros coefficients.",
    },
  ],
});
