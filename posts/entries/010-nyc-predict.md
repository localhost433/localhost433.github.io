---
title: NYC Mayoral Prediction
date: 2025-06-15
tags: [cs, life]
author: R
location: New York, NY
---

## What's the idea?

Build a quick model to forecast the NYC mayoral primary using polls, signals, and some reasonable priors. The goal isn't to beat FiveThirtyEight-just to see if the curve lines up with reality and learn what breaks first.

## Where did the idea come from?

In the recent two weeks I've been bombarded with ads on social media about the Democratic primary, a noisy dataset, and curiosity about whether a small model can recover the election's direction of travel. The "why" is half technical: elections are messy, and it's addictive to coax structure out of the mess.

## What we did

We built something that produces sensible predictions most of the time. Early on, it leaned toward Cuomo; later, the polling and model revisions pulled toward Mandani, which turned out to match the outcome. Not perfect, but not random either.

The interesting parts:

- Feature choice matters more than fancy architecture when time is short.
- Revising while watching new polls is a mind game...

It didn't predict the race with elegance (neighborhood by neighborhood, well it probably can). It did teach me how quickly "plausible" becomes "useful" with careful constraints and a bit of humility.
