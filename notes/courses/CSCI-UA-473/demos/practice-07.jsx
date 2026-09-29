import { mcq } from "@course";

/* Note 07 practice. Keyed to the places the deck is easiest to misread: the two
   cross-entropy forms, slide 15's sign, what SGD does at a fixed rate, separable data,
   data snooping, what prevalence does and does not change, AUC below one half, the
   cost-derived threshold, the COVID example as a precision, and the gradient read as
   a weighted PLA. */

export default mcq({
  questions: [
    {
      stem: "Slide 10 writes binary cross-entropy as $-\\sum_i \\big[y_i \\log \\sigma(w^{\\mathsf T}x_i) + (1-y_i)\\log(1-\\sigma(w^{\\mathsf T}x_i))\\big]$. The rest of the deck labels classes $\\pm 1$. What happens to an example's term if you plug in $y_i = -1$?",
      choices: [
        { text: "The first term becomes a reward and the second term counts twice", correct: true },
        { text: "Nothing changes: the bracket reads the same under either label coding" },
        { text: "It turns into the margin form $\\log(1 + e^{-y_i w^{\\mathsf T}x_i})$ term for term" },
        { text: "Only the scale changes, by the missing $\\tfrac1N$; the minimizer stays" },
      ],
      why: "This form assumes labels in $\\{0, 1\\}$. With $y_i = -1$ and $s_i = w^{\\mathsf T}x_i$, the bracket is $-\\log\\sigma(s_i) + 2\\log(1 - \\sigma(s_i))$, so after the leading minus the $\\log\\sigma$ term *lowers* the loss (a **reward**) and the $\\log(1 - \\sigma)$ term counts **twice**. The margin form only comes back after recoding $t_i = (1 + y_i)/2$, which maps $-1 \\mapsto 0$. The missing $\\tfrac1N$ is a separate, harmless slip.",
    },
    {
      stem: "Slide 15 ends with the update $\\Delta w = \\eta\\,\\nabla E_{\\text{in}}$. What does that update do?",
      choices: [
        { text: "It steps uphill: the minus sign of steepest descent was dropped", correct: true },
        { text: "It steps downhill, since $\\eta$ is taken to be negative by convention" },
        { text: "It steps downhill, because $\\nabla E_{\\text{in}}$ itself already points downhill" },
        { text: "It takes a unit-length step, since $\\eta_t$ divides out the gradient norm" },
      ],
      why: "Substituting $\\eta_t = \\eta\\|\\nabla E_{\\text{in}}\\|$ and $\\hat v = -\\nabla E_{\\text{in}}/\\|\\nabla E_{\\text{in}}\\|$ gives $\\Delta w = -\\eta\\,\\nabla E_{\\text{in}}$. The gradient points in the direction of steepest **increase**, so without the minus the step climbs; slide 16's algorithm has the correct sign. The norms cancel rather than leaving a unit step, which is why the step *length* still shrinks near the minimum.",
    },
    {
      stem: "SGD runs with a small constant learning rate on a logistic loss that has a minimizer $w^\\ast$. After many steps, what does $w$ do?",
      choices: [
        { text: "Never settles: jitters around $w^\\ast$, where single gradients are not 0", correct: true },
        { text: "Settles at $w^\\ast$ exactly, because each step is an unbiased estimate" },
        { text: "Settles at a local minimum of $E_{\\text{in}}$ that differs from $w^\\ast$" },
        { text: "Diverges, because the noise in the steps accumulates without bound" },
      ],
      why: "Unbiased means $\\mathbb E_i[\\nabla e_i(w)] = \\nabla E_{\\text{in}}(w)$: right **on average**, not zero at every step. At $w^\\ast$ the average is zero but the individual $\\nabla e_i$ are not, so each step still moves by about $\\eta$ times a nonzero vector and $w$ wanders in a cloud whose size scales with $\\eta$. Decaying $\\eta$ removes the cloud. The loss is convex, so there is no other local minimum to settle in.",
    },
    {
      stem: "Batch gradient descent with a small fixed $\\eta$ runs on data that some line separates perfectly. What happens as $t \\to \\infty$?",
      choices: [
        { text: "$\\|w\\|$ grows without bound while $E_{\\text{in}}$ approaches 0", correct: true },
        { text: "$w$ stops changing once every point is classified correctly" },
        { text: "$w$ converges to a finite minimizer at which $E_{\\text{in}} = 0$" },
        { text: "$E_{\\text{in}}$ levels off at $\\log 2$, where every margin is zero" },
      ],
      why: "If $y_i\\,w^{\\mathsf T}x_i > 0$ for all $i$, scaling $w$ up sends every margin to $+\\infty$ and $E_{\\text{in}}$ to 0, but **no finite $w$ reaches 0**, so there is no minimizer and the iterates run off to infinity. Stopping once everything is correct is PLA's rule. Here every point keeps a positive weight $\\sigma(-y_i\\,w^{\\mathsf T}x_i)$ in the gradient, correct or not, so the gradient never vanishes. Adding $\\lambda\\|w\\|^2$ restores a minimizer.",
    },
    {
      stem: "You plot the training data, see a ring, choose $\\Phi(x) = (1, x_1^2, x_2^2)$, and fit 3 weights. Why is the 3-parameter generalization bound too optimistic?",
      choices: [
        { text: "Picking $\\Phi$ by eye enlarged the hypothesis set you really searched", correct: true },
        { text: "Any hand-picked $\\Phi$ voids the bound, even one from domain knowledge" },
        { text: "Squared features make $E_{\\text{in}}$ non-convex in $w$, so the bound fails" },
        { text: "A non-linear $\\Phi$ makes the model non-linear in $w$, which the bound excludes" },
      ],
      why: "Slide 22's rule: choose $\\Phi$ **before** looking at the data. Every transform you weighed while looking belongs to the hypothesis set you really searched, which is L4's $M$ growing off the books (LFD: *data snooping*). The same slide says **domain knowledge is allowed**, because knowledge that does not come from this $D$ adds nothing to the search. The model also stays linear in $w$, so the loss is still convex.",
    },
    {
      stem: "At a fixed threshold a classifier has sensitivity 0.80 and specificity 0.95 at a clinic with 20% prevalence. It is deployed as is in a screening program with 1% prevalence, where its score distributions for sick and for healthy patients are unchanged. Which three quantities stay the same?",
      choices: [
        { text: "Sensitivity, specificity and the AUC", correct: true },
        { text: "Precision, sensitivity and the AUC" },
        { text: "Accuracy, specificity and the AUC" },
        { text: "Sensitivity, specificity and precision" },
      ],
      why: "Sensitivity and specificity are fractions **within one column** (one true class), so rescaling the columns leaves them, and the ROC and AUC they trace, alone. Precision is a fraction within a **row**, which mixes the classes: $\\pi\\,\\text{TPR}/(\\pi\\,\\text{TPR} + (1 - \\pi)\\,\\text{FPR})$ falls from 0.80 to 0.14. Accuracy, $\\pi\\cdot\\text{sens} + (1 - \\pi)\\cdot\\text{spec}$, moves too, from 0.92 *up* to 0.95, while most positive calls become false alarms.",
    },
    {
      stem: "A model has AUC 0.2 on a test set. What is the most useful conclusion?",
      choices: [
        { text: "Negating its scores gives AUC 0.8: it ranks the classes backwards", correct: true },
        { text: "It is worse than random guessing, so it carries no usable signal" },
        { text: "Its threshold is set too high; lowering it would lift the AUC above 0.5" },
        { text: "It is miscalibrated; rescaling its probabilities would raise the AUC" },
      ],
      why: "AUC is $P(\\text{random positive scored above random negative})$. At 0.2, a negative outranks a positive 80% of the time, so flipping the scores gives **0.8**. \"Worse than random\" is the tempting reading, but chance is 0.5, and 0.2 is as far from chance as 0.8. AUC does not depend on any threshold, and rescaling the scores by any increasing function (Platt scaling, say) leaves it unchanged.",
    },
    {
      stem: "Missing a sick patient (false negative) costs 9 times as much as a false alarm. With zero cost for correct calls, above what posterior $P(\\text{sick} \\mid x)$ should you predict sick?",
      choices: [
        { text: "0.1", correct: true },
        { text: "0.5" },
        { text: "0.9" },
        { text: "1/9" },
      ],
      why: "Predicting sick risks a false alarm with probability $1 - p$; predicting healthy risks a miss with probability $p$. Predict sick when $\\lambda_{FP}(1 - p) < \\lambda_{FN}\\,p$, i.e. $p > \\lambda_{FP}/(\\lambda_{FP} + \\lambda_{FN}) = 1/(1 + 9) = 0.1$. **Expensive misses lower the bar** for predicting sick, so 0.9 (the costs swapped) goes the wrong way. Equal costs give the deck's 0.5, and $1/9$ is the cost ratio, not the threshold.",
    },
    {
      stem: "A test has sensitivity 0.9 and specificity 0.9. In a population where 1% have the disease, a randomly chosen person tests positive. What is the probability that they have it?",
      choices: [
        { text: "0.083", correct: true },
        { text: "0.900" },
        { text: "0.009" },
        { text: "0.108" },
      ],
      why: "Bayes: $P(\\text{sick} \\mid +) = \\frac{0.9 \\times 0.01}{0.9 \\times 0.01 + 0.1 \\times 0.99} = \\frac{0.009}{0.108} = \\frac{1}{12} \\approx 0.083$. This is the test's **precision** at 1% prevalence. The tempting 0.900 is $P(+ \\mid \\text{sick})$, the sensitivity, with the conditional turned around (**base-rate neglect**). 0.009 is the joint $P(+, \\text{sick})$ and 0.108 is $P(+)$, the numerator and denominator of the fraction.",
    },
    {
      stem: "Slide 16's gradient is $g_t = -\\frac1N\\sum_i y_i x_i\\,\\sigma(-y_i\\,w^{\\mathsf T}x_i)$. Which training points get the largest weight $\\sigma(-y_i\\,w^{\\mathsf T}x_i)$?",
      choices: [
        { text: "Points the model classifies wrongly and with high confidence", correct: true },
        { text: "Points the model classifies correctly and with high confidence" },
        { text: "Points right on the boundary, where the sigmoid is steepest" },
        { text: "Every point equally, since $g_t$ is a plain average over $i$" },
      ],
      why: "The weight is the probability the model currently gives the **wrong** label: near 1 for a confidently misclassified point, $\\tfrac12$ on the boundary, near 0 for a confidently correct one. So the gradient is a **soft PLA**: every point pushes along $y_i x_i$, in proportion to how wrong it is. The boundary is where $\\sigma$ is *steepest*, which is tempting, but steepness is $\\sigma'$; the weight here is $\\sigma$ itself, and it keeps rising past the boundary.",
    },
  ],
});
