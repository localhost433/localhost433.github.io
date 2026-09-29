import { mcq } from "@course";

/* Note 03 practice. Keyed to the three figures on the page, to the two gaps the note
   itself flags as quiz-shaped (one update proves nothing about the other examples,
   and PLA gives no control over which separator you get), and to the two
   definitions the note calls MCQ-shaped: non-parametric, and who supervises. */

export default mcq({
  questions: [
    {
      stem: "The perceptron figure opens at $w = [0,0,0]$ and reports all 20 points misclassified. Why?",
      choices: [
        { text: "Every margin $y\\,w^{\\mathsf T}x$ is 0, and a margin $\\le 0$ counts as an error", correct: true },
        { text: "Every margin $y\\,w^{\\mathsf T}x$ is 0, and a margin of 0 counts as half an error" },
        { text: "Every margin $y\\,w^{\\mathsf T}x$ is negative until the first update is made" },
        { text: "$\\operatorname{sign}(0)$ is read as $-1$, so every point is predicted as $-1$" },
      ],
      why: "With $w = 0$ the margin $y\\,w^{\\mathsf T}x$ is exactly **0** for every point, and the figure counts $y\\,w^{\\mathsf T}x \\le 0$ as misclassified, so all 20 qualify. Reading $\\operatorname{sign}(0)$ as $-1$ would flag only the $y = +1$ points, and half-errors would not give a count of 20. The $\\le$ is deliberate: under a strict $<$, the zero vector would pass for a perfect classifier.",
    },
    {
      stem: "One PLA update is applied to a misclassified point $x(t)$. What does the note's four-line argument establish, and nothing more?",
      choices: [
        { text: "The margin on $x(t)$ itself rises by exactly $\\|x(t)\\|^2$", correct: true },
        { text: "The margin on every point rises by exactly $\\|x(t)\\|^2$" },
        { text: "The margin on $x(t)$ turns positive, so $x(t)$ is fixed" },
        { text: "The misclassified count falls by at least one point" },
      ],
      why: "The algebra gives $y\\,w(t+1)^{\\mathsf T}x(t) = y\\,w(t)^{\\mathsf T}x(t) + \\|x(t)\\|^2$: a gain on **$x(t)$ only**. If the old margin was more negative than $-\\|x(t)\\|^2$, the point is still wrong after the update, and other points' margins can fall, so the misclassified count can go *up*. That is why Novikoff's proof bounds the number of updates instead of showing the error falls each step.",
    },
    {
      stem: "PLA halts on linearly separable data. Which separating line does it return?",
      choices: [
        { text: "The first separator its sequence of updates happens to reach", correct: true },
        { text: "The separator with the largest margin to the nearest point" },
        { text: "The separator with the least total distance to the points" },
        { text: "The same separator on every run, since the data determine it" },
      ],
      why: "The stopping condition is only *no misclassified points remain*, and infinitely many lines satisfy it, so PLA returns **whichever it reaches first**. Which one that is depends on the start and on which misclassified point is picked, so two runs on the same data usually end on different lines (the figure's random-start experiment). Choosing the largest-margin separator is what SVMs add; PLA has no notion of a best one.",
    },
    {
      stem: "In the perceptron figure, choose \"Non-separable · planted contradiction\" and run. What happens?",
      choices: [
        { text: "It stops only at the 1500-update cap, with errors left", correct: true },
        { text: "It stops once the misclassified count stops falling" },
        { text: "It stops at the best line the data admit, one error left" },
        { text: "It converges, but after many more updates than usual" },
      ],
      why: "The planted point is the midpoint of two same-class points with the opposite label. Any line that puts both endpoints on one side puts their midpoint there too, so **no line separates the data** and the stopping condition can never be met. PLA has no notion of a best line with one error (that would take a different algorithm, the pocket variant), so it runs until the figure's safety cap.",
    },
    {
      stem: "In the lift figure, each input sits on the shelf $x_0 = 1$, and the plane through the origin meets the shelf along a line. What is that line?",
      choices: [
        { text: "The 2D boundary $b + w_1x_1 + w_2x_2 = 0$, bias included", correct: true },
        { text: "The 2D boundary $w_1x_1 + w_2x_2 = 0$, through the origin" },
        { text: "The set of shelf points at which $w^{\\mathsf T}x$ equals 1" },
        { text: "The shadow of the normal $w$ cast onto the shelf" },
      ],
      why: "The plane is $w^{\\mathsf T}x = 0$ with $x = (x_0, x_1, x_2)$. Setting $x_0 = 1$ gives $b + w_1x_1 + w_2x_2 = 0$, the **2D decision boundary with its bias**, which is why absorbing the bias loses nothing. The plane passes through the 3D origin, but its trace on the shelf passes through $(x_1, x_2) = (0, 0)$ only when $b = 0$, as the figure's readout says.",
    },
    {
      stem: "In the cube figure, set the target to \"None\" so no corner is labelled, and pick \"All 256 functions\". At any one corner, what fraction of the 256 functions output +1?",
      choices: [
        { text: "Half, at every corner alike, so every vote reads 0.50", correct: true },
        { text: "All of them, since no label has ruled any function out" },
        { text: "None of them, since no label supports any function yet" },
        { text: "A fraction set by how many 1 bits the corner's code has" },
      ],
      why: "Each function is a choice of $\\pm 1$ at all 8 corners. Fix one corner's value and the other 7 are free, so **128 of the 256** say +1 there, whatever the corner. Bit counts matter only once a target like majority is chosen, and with no labels the 104 linear thresholds also split 52 to 52 at every corner. The votes move off 0.50 only when labels and a restricted hypothesis set act together, which is the No Free Lunch point.",
    },
    {
      stem: "The deck calls nearest neighbors non-parametric and a neural network parametric. What separates the two?",
      choices: [
        { text: "Whether the parameter count grows with training set size $N$", correct: true },
        { text: "Whether the model has any trainable parameters at all" },
        { text: "Whether the output is a linear function of the parameters" },
        { text: "Whether the model can draw a non-linear decision boundary" },
      ],
      why: "Parametric means the number of parameters is **fixed, independent of $N$**; non-parametric means it **grows with $N$**. Nearest neighbors keeps the whole training set, so its description is $O(N)$. \"No parameters\" is the tempting reading of the name, and it is wrong. Linearity in the parameters splits the *parametric* family into linear and non-linear models, and both families can draw curved boundaries.",
    },
    {
      stem: "A model trains on millions of unlabelled sentences by hiding one word at a time and predicting it from the words around it. Where does the deck's taxonomy put this?",
      choices: [
        { text: "Self-supervised learning", correct: true },
        { text: "Unsupervised learning" },
        { text: "Supervised learning" },
        { text: "Reinforcement learning" },
      ],
      why: "The targets exist, but nobody annotated them. They are **inferred from the data itself** (the hidden word is in the sentence), which is the deck's definition of self-supervised learning, like its video frames that supervise each other. Unsupervised is the tempting answer because no human labels were collected, but unsupervised learning has no targets at all. Sort by *who supervises*: here, the data.",
    },
  ],
});
