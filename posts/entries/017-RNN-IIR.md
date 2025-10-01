---
title: RNNs as IIR Filters
date: 2025-07-23
tags: [ai, linguistics]
author: R
location: Shenzhen, Guangdong, China
---

Today while/after reading some papers about LSTM, GRU, and GAT, I suddenly realized: since we have convolution which performs so well, why don't we apply it to RNNs so that they get to work the same way? I guess the states and gates are not that simple to do locally via convolution, but there must be some way to get close to it, because it's so tempting to have the properties of convolution applied to it in many aspects.

> Sidenote: There are just soooo many initialisms in this field; it's disproportionate and I probably should look into that.
> > Acronym:= Pronounced as a word (e.g., NASA); Initialism:= Pronounced as letters (e.g., NYU).
> > And then you've got things like GCASL (238 Thompson St, **G**lobal **C**enter for **A**cademic and **S**piritual **L**ife), being both (d͡ʒi si e͡ɪ ɛs ɛl (G-C-A-S-L), or d͡ʒi.kæsəl (G-castle)) at the same time.

So I searched it up; it turns out I've come to this idea of **linear RNNs as an Infinite‑Impulse‑Response (IIR) filter**, which **is essentially what the entire field of RNNs has been working on**...