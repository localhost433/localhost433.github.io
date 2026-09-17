/* AUTO-GENERATED from practice-03.jsx by `npm run build:artifacts`. Do not edit. */
import { mcq } from "@course";

/* Note 03 practice. Keyed to the three figures on the page and to the two gaps
   the note itself flags as quiz-shaped: that one update proves nothing about
   the other examples, and that PLA gives no control over which separator you get. */

export default mcq({
  questions: [{
    stem: "The perceptron figure opens at $w = [0,0,0]$ and reports all 20 points misclassified. Why?",
    choices: [{
      text: "$y\\,w^{\\mathsf T}x$ is 0 for every point, and the convention counts $\\le 0$",
      correct: true
    }, {
      text: "$y\\,w^{\\mathsf T}x$ is negative for every point when w is the zero vector"
    }, {
      text: "Only points with $y = -1$ are counted until w becomes nonzero"
    }, {
      text: "The count is undefined before the first update, so it shows 20"
    }],
    why: "The figure counts a point as misclassified when $y\\,w^{\\mathsf T}x \\le 0$, not $< 0$. With $w = 0$ the product is exactly **0** for every point, so all 20 qualify. The $\\le$ is deliberate: it stops the zero weight vector from masquerading as a perfect classifier."
  }, {
    stem: "One PLA update is applied to a misclassified point x(t). What does the note's four-line argument actually establish?",
    choices: [{
      text: "$y\\,w^{\\mathsf T}x$ increases by $\\|x(t)\\|^2$ on the example it was applied to",
      correct: true
    }, {
      text: "$y\\,w^{\\mathsf T}x$ increases by $\\|x(t)\\|^2$ on every example simultaneously"
    }, {
      text: "The total number of misclassified points strictly decreases"
    }, {
      text: "The separator moves measurably closer to the best one"
    }],
    why: "The algebra gives $y\\,w(t+1)^{\\mathsf T}x(t) = y\\,w(t)^{\\mathsf T}x(t) + \\|x(t)\\|^2$, which is strictly larger — but **only for x(t)**. The note flags this as quiz-shaped: an update that fixes one point can break points that were already correct, so convergence is **not** monotone in total error. Novikoff's proof bounds the number of updates instead."
  }, {
    stem: "PLA halts on linearly separable data. Which separating hyperplane does it return?",
    choices: [{
      text: "Whichever one it happens to reach when the loop stops",
      correct: true
    }, {
      text: "The one maximizing the margin to the nearest point"
    }, {
      text: "The one minimizing total distance to all the points"
    }, {
      text: "The one closest to the initial weight vector $w = 0$"
    }],
    why: "The stopping condition is only *no misclassified points remain*, and infinitely many hyperplanes satisfy it. PLA returns whichever it lands on — there is no notion of **best** separator here. Closing that gap is exactly what max-margin methods like SVMs exist to do."
  }, {
    stem: "Run the perceptron on \"Non-separable · planted contradiction\". What happens, and why?",
    choices: [{
      text: "It never terminates; the stopping condition is unreachable",
      correct: true
    }, {
      text: "It terminates once the misclassified count stops falling"
    }, {
      text: "It terminates at the best line the data admits, then halts"
    }, {
      text: "It terminates, but needs far more updates than usual"
    }],
    why: "The figure plants a point at the midpoint of two same-class points and flips its label, so **no line can separate the data**. PLA stops only when nothing is misclassified, so it runs to the figure's 1500-update cap. Non-termination here is a property of the data, not a bug in the algorithm."
  }, {
    stem: "In the lift figure, the plane through the origin meets the shelf $x_0 = 1$ along a line. What is that line?",
    choices: [{
      text: "The 2D decision boundary the weights encode",
      correct: true
    }, {
      text: "The projection of w onto the shelf's plane"
    }, {
      text: "The locus of points at unit distance from w"
    }, {
      text: "The shelf's edge, where $x_1$ and $x_2$ both vanish"
    }],
    why: "Lifting each 2D input to $(1, x_1, x_2)$ turns the bias into an ordinary weight, so $\\operatorname{sign}(w^{\\mathsf T}x)$ with no separate `b` does the same job. The plane's **trace** on the shelf is exactly the 2D boundary $w_1x_1 + w_2x_2 + b = 0$ — which is why setting $b = 0$ drives it through the origin."
  }, {
    stem: "In the cube figure with no vertices labelled, what fraction of the 256 functions vote +1 at a given unseen vertex?",
    choices: [{
      text: "Exactly half, so every unseen vertex ties at 0.50",
      correct: true
    }, {
      text: "All of them, since no labelling has ruled any out"
    }, {
      text: "None of them, since no labelling supports any yet"
    }, {
      text: "It varies by vertex, depending on its bit pattern"
    }],
    why: "For any fixed vertex, exactly 128 of the 256 Boolean functions assign it +1, so the vote is **0.50 everywhere**. That is No Free Lunch itself: with no assumptions, every unseen vertex is a coin flip. Restricting to the 104 linear threshold functions is an inductive bias — and it is what lets the vote commit to an answer."
  }]
});