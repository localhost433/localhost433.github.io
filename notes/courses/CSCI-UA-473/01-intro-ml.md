---
title: "1 - Introduction & What Machine Learning Is"
date: "2026-09-03"
---

## Prerequisites and references

*Slides 16-17.* Assumed going in: linear algebra and vector calculus, probability theory,
and proficiency in Python 3 and PyTorch.

There is no official textbook. Six are recommended, the same six listed on the
**Resources > Books** page in Brightspace:

| Tag | Book |
|---|---|
| ML concepts | *An Introduction to Statistical Learning with Applications in Python* - James, Witten, Hastie, Tibshirani & Taylor |
| ML concepts | *Probabilistic Machine Learning: An Introduction* - Murphy |
| ML concepts | *Learning from Data* - Abu-Mostafa, Magdon-Ismail & Lin |
| ML concepts | *Pattern Recognition and Machine Learning* - Bishop |
| Math | *Mathematics for Machine Learning* - Deisenroth, Faisal & Ong |
| Coding | *Introduction to Machine Learning with Python* - Müller & Guido |

*Learning from Data* is the one to notice: the components-of-learning figure in
[L3](note.html?course=CSCI-UA-473&note=03-components-of-learning) is credited to it, and
the $f$ / $g$ / $\mathbb H$ / $D$ / $\mathcal A$ notation the slides use is its notation.
Deisenroth also supplies one of the four definitions quoted below.

Alongside the book list, Resources carries Cho's 65-page lecture note - see
[note 00](note.html?course=CSCI-UA-473&note=00) for what it covers and how its notation
differs.

## What machine learning is

The deck stacks four definitions rather than committing to one:

- **Arthur Samuel (1959)** - the field of study that gives computers the ability to learn
  without being explicitly programmed.
- **Tom Mitchell (1997)** - a model learns from data if its performance on a given task
  improves after the data is taken into account.
- **Daniel Bourke (2020)** - using computers to find patterns in data.
- **Marc Deisenroth (2021)** - designing algorithms that automatically extract valuable
  information from data, with the emphasis on *automatic*.

The synthesis the lecture lands on: **teaching computers to infer patterns from data
without the need to design an explicit program.**

The load-bearing word across all four is *explicit*. The contrast is not
"program vs. no program" but who authors the decision rule - a human enumerating
conditions, or a fitting procedure that recovers them from examples. Mitchell's version is
the one worth memorizing, because it is the only one that is operational: it names a task,
a performance measure, and an improvement criterion, which is exactly the triple the rest
of the course formalizes.

## The fruit sorter

*Slides 23-27.* A conveyor belt, a camera and a robot arm that sorts apples from oranges
into two baskets. The lecture solves it twice.

**Explicitly programmed.** Write out a description of an apple (red or green with streaks,
possibly a small stem, circular with a flat top and bottom) and of an orange (orange,
circular, small bumps on the surface). Run each camera image through that program, infer
the fruit type, and guide the arm.

**Learned from data.** Collect 100,000 images of apples and 100,000 of oranges - the
*training set*. Use them to train a model (a parametric or non-parametric function) that
takes an image and infers apple or orange. Apply the trained function to the camera feed
and guide the arm.

This is the whole course in one slide pair. The hand-written description is a hypothesis
authored by a person; the trained model is a hypothesis selected by an algorithm from a
family the person chose. Neither escapes having to pick the family - a point the No Free
Lunch discussion in [L3](note.html?course=CSCI-UA-473&note=03-components-of-learning)
makes precise.

## The example problems

*Slides 28-35.* Six more problems, and the reason for the list is that they are the same
problem wearing different clothes. What changes between them is only what the training
data looks like.

| Problem | Training data |
|---|---|
| Spam filtering | a collection of spam and non-spam emails |
| Face recognition | facial images of the people you want to recognize |
| Weather prediction | satellite images labeled with the weather pattern actually observed |
| Stock price prediction | historic prices of the stock, possibly plus prices of other stocks that influence it |
| Ranking (web search) | the search query plus the results users clicked in the past |
| Ranking (image similarity) | query images plus the images users judged visually similar |
| Recommender systems | users plus the items they bought or liked in the past |

The stock example carries an aside the others don't (slide 32): *what type of dataset to
collect depends on the problem, and it is part of the ML designer's job*. That sentence is
the first appearance of a theme the course returns to in the closing slide of L3 - dataset
design is a modeling decision, not a preliminary to modeling.

Notice also that the supervision signal gets progressively less explicit down the table.
Spam labels are annotations someone wrote; click logs and purchase histories are behavior
recorded for another purpose and repurposed as labels. That distinction becomes the
supervised / self-supervised split in L3.

## Why now

*Slides 36-47.* The argument is carried almost entirely by images (screenshots of
capabilities) rather than text, so the deck alone will not reconstruct it. The one
extractable piece is the table of 2022 releases:

| System | Purpose | Date |
|---|---|---|
| DALL·E 2 | text-to-image | April 2022 |
| Imagen | text-to-image | May 2022 |
| Midjourney | text-to-image | July 2022 |
| Stable Diffusion | text-to-image | August 2022 |
| Make-a-Video | text-to-video | September 2022 |
| AlphaTensor | matrix multiplication | October 2022 |
| ChatGPT | chatbot | November 2022 |
| AlphaCode | text-to-code | December 2022 |
| Dramatron | script writing | December 2022 |

Followed by a slide on exponential growth in market size and revenue (slide 47).

## Where it goes wrong

*Slides 48-60.* "Everything is not hunky-dory though" - ML has also seen many spectacular
failures. Again, the failures themselves are images; the text carries only the framing,
which is slide 55: **one needs to be very careful when developing and deploying these
powerful models.**

The worked case is dermatologist-level classification of skin cancer with deep neural
networks (slides 56-60), diagrammed as model input (a photograph of a lesion) to model
output (malignant or non-malignant). The extractable text stops there, so what the lecture
concluded from it is in the images and in what was said aloud - worth checking against
your recollection before the quiz, because a "why did this deployed model fail" question is
exactly the shape an MCQ takes.

## Course overview

*Slide 61.* The map for the semester, and a useful thing to have on the printed sheet
because it tells you which bucket any given method belongs to:

Framing questions: **why does machine learning work, and under what assumptions?** Then
training / validation / testing data.

| Supervised | Unsupervised |
|---|---|
| **Parametric models**: linear models, max-margin models, non-linear models | dimensionality reduction |
| **Non-parametric models**: nearest neighbors, decision trees, mixture models | clustering models |
| **Ensemble models**: random forests, boosting and bagging | auto-encoders |

Plus self-supervised learning and reinforcement learning as their own headings.
