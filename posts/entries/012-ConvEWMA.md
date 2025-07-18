---
title: Conv-EWMA Convolutional Exponentially Weighted Moving Average
date: 2025-07-10
tags: [cs, ai]
author: R
location: Futian district, Shenzhen, Guangdong, China
---

# Conv-EWMA: Convolutional Exponentially Weighted Moving Average

## Task
Build a 1-D convolutional layer using pytorch, with learnable smoothing factor. Constraint of kernel $\leq 32$.

Input: A 2-D tensor X of shape ($N$, $T$), each of the $N$ rows is a time series $x_i(t)$

So I'm building a class that inherits from torch.nn.Module that could be used as a convolutional layer.

## Fundamentals: EWMA and Convolution

### Exponentially Weighted Moving Average (EWMA)
For a scalar series $x_t$, the EWMA $s$ at time $t$ is
$$
s_t = \alpha x_t + (1-\alpha) s_{t-1}
$$
where $\alpha \in (0, 1)$ is the smoothing factor, this can be expanded into  
$$
s_t = \sum_{k=0}^{t}\alpha (1-\alpha)^k x_{t-k}.
$$
Illustrating that older observations decay geometrically with time. A naïve EWMA would be written as a loop or something which is inherently sequential.

### Convolution 

#### Tensor layout
PyTorch’s `conv1d` expects input of shape **(N, C, L)**.
> In this setting:
> - **N** is the number of independent time series (batches) processed in parallel.
> - **C** is the number of channels per series. For a single (univariate) series, use `C=1` and reshape input from shape `(N, T)` to `(N, 1, T)`.
> - **L** corresponds to the sequence length `T` (the number of time steps).

#### Sliding dot-product  
A general causal convolution with kernel $w \in \R^K$, stride $s$, dilation $d$, and padding $p$ computes:
$$
y_{n,c,t}
= \sum_{k=0}^{K-1} w_k x_{n,c, t \cdot s - k \cdot d + p},
$$
where $x_{n,c,m}=0$ if $m<0$. Setting $s=1$ and $d=1$ (PyTorch’s default) recovers the standard sliding dot-product:
$$
y_{n,c,t}
= \sum_{k=0}^{K-1} w_k x_{n,c,t-k}.
$$
Note: PyTorch’s `dilation` parameter must be an integer $\geq 1$; a dilation of $1$ means contiguous kernel elements (no dilation). In PyTorch one can pass `stride=s` and `dilation=d` to `F.conv1d`, according to the documents:

```python
y = F.conv1d(x_padded, w, stride=s, dilation=d, groups=C)
y = F.conv1d(input, weight, bias=None, stride=1, padding=0, dilation=1, groups=1)
```

I interpret dilation as a way to extract data feature by sampling sparesely (it's pretty hard to explain without a diagram in hand but I'm sure there's a lot out there), as stride is straightforward the number of pixels (elements) each time the kernel proceed forward. with dilation $d > 1$ the effective receptive field is $(K−1)d+1$.

#### Padding
To keep the output length equal to the input length while remaining causal, the left side of every channel is padded with $K-1$ zeros:

```python
x_pad = F.pad(x, (K-1, 0))  # adds zeros only before t=0
```

> Padding is the process of adding extra values (zeros here) around the boundaries of the input tensor making the output adhere to the dimensions.
> - In causal convolution, we prepend zeros so that early outputs only depend on current and past inputs—never future ones. Concretely, the output at time $t$ is $y_t = \sum_{k=0}^{K-1}w_k x_{t-k}$, and since $t-k \leq t$, no future input $x_{t+\ell}$ with $\ell>0$ is used.
> - By adding $K-1$ zeros to the left, the convolution window at time $t=0$ becomes $[0,0,\dots,x_0]$, providing a full-length window without accessing negative indices. Again, it would be very helpful to attach an image here but I'm just lazy to do so.
> - In PyTorch’s `F.pad`, the arg `pad` is a tuple `(pad_left, pad_right)` specifies how many values to add at the start and end of the last dimension.

#### Channels and depth
- Standard convolution mixes information across channels with a weight tensor of size $(C_\text{out}, C_\text{in}, K)$.
- Depth-wise convolution sets `groups=C_in`, forcing each output channel to use exactly one input channel and its own kernel; the weight tensor becomes $(C,1,K)$.

> **Detailed comparison:**  
> - **Standard convolution:**
>   - For each output channel $c_\text{out}$, the filter has weights $w[c_\text{out}, c_\text{in}, k]$ across all input channels $c_\text{in}=1\dots C_\text{in}$ and lags $k=0\dots K-1$.  
>   - The output is computed as  
>     $$
>     y_{n,c_\text{out},t} = \sum_{c_\text{in}=1}^{C_\text{in}} \sum_{k=0}^{K-1} w[c_\text{out}, c_\text{in}, k] x_{n,c_\text{in},t-k}.
>     $$
>   - **Parameters:** $C_\text{out}\times C_\text{in}\times K$ weights.  
>   - **Computation:** $O(C_\text{out} C_\text{in} K)$ multiplications/per timestep/per batch.
>   - **Behavior:** mixes and cross-correlates channels, learning inter-channel features.
>  
> - **Depth-wise convolution:**
>   - Sets `groups=C_in`, so each output channel equals one input channel ($C_\text{out}=C_\text{in}$) and uses only its own filter $w[c,1,k]$ (instead of going through the whole filter for each channel).
>   - The output is  
>     $$
>     y_{n,c,t} = \sum_{k=0}^{K-1} w[c,1,k] x_{n,c,t-k}.
>     $$
>   - **Parameters:** $C_\text{in}\times 1\times K = C_\text{in} K$ weights.
>   - **Computation:** $O(C_\text{in} K)$ multiplications/per timestep/per batch, greatly reduced compared to standard convolution.
>   - **Behavior:** processes each channel independently, preserving channel separation while learning channel-wise features.
>
> 

#### One-Dimensional Causal Convolution
For a kernel $w \in \R^K$ and a padded input $x \in \R^L$,
$$
y_t=\sum_{k=0}^{K-1}w_k x_{t-k}, \qquad x_{t-k}=0 \quad \text{for }t-k<0.
$$
In `torch.nn.functional`, the call

```python
y = F.conv1d(x_padded, w.unsqueeze(0).unsqueeze(0))
```
computes all $y_t$ in parallel on the GPU. 

## Why ConvEWMA?
- **Parallelism** – Converting EWMA to a convolution lets every timestep, batch element and channel be processed at once.
- **Parameter efficiency** – Depth-wise structure needs only $C \times K$ weights versus $C^2 \times K$ for a full convolution.
- **Adaptive memory** – Each channel learns its own decay rate $\alpha_c$.
- **End-to-end learning** – Gradients flow through $\alpha_c$, allowing the model to tune smoothing jointly with downstream loss functions.

## Implementation

### From EWMA to a Convolution Kernel
Choosing
$$
w_k=\alpha (1-\alpha)^k, \quad k=0, \dots, K-1,
$$
and (optionally) normalising so $\sum_k w_k=1$ reproduces a truncated EWMA when used as a convolution filter. (The raw truncated sum is $1 - (1 - \alpha)^K$, and dividing by that.) Flipping the kernel (`w.flip(-1)`) makes it causal in PyTorch’s convention. (This is where I got it wrong and unrealized.)

### Learnable smoothing coefficients
Each channel $c$ stores a logit $\ell_c$.  During the forward pass

$$
\alpha_c = \sigma(\ell_c), \qquad 0 < \alpha_c < 1.
$$

In code:

```python
eps = 1e-6
a = (1 - 2 * eps) * torch.sigmoid(self.alpha_logit) + eps
# shape (C,)
```

Constraining $\alpha$ away from the extremes, using epsilon avoid exploding gradients when $\alpha \to 0$ and $1$

### Kernel construction and normalisation
For lags $k=0 \dots K-1$,

$$
\begin{align*}
    w_{c,k} &= \alpha_c(1-\alpha_c)^k\\
    \widetilde w_{c,k} &= \frac{w_{c,k}}{\sum_{j} w_{c,j}}
\end{align*}
$$

Implemented as

```python
k = torch.arange(K, device=x.device, dtype=x.dtype)
w = a.unsqueeze(1) * (1 - a).unsqueeze(1).pow(k)       # (C,K)
w = (w / w.sum(1, keepdim=True)).unsqueeze(1).flip(-1) # (C,1,K)
# flip for causal ordering
```

### Causal depth-wise convolution
Pad the input by $K - 1$ zeros on the left:

```python
x_pad = F.pad(x, (K-1, 0))           # (N, C, L + K - 1)
y = F.conv1d(x_pad, w, groups=C)     # (N, C, L)
```

Each $y_{n,c,t}$ equals the truncated EWMA of channel $c$ over the last $K$ timesteps.

### (optional) Channel dropout
During training,

```python
mask = (torch.rand(C, device=y.device) > p).view(1,-1,1)
y = y * mask / (1.0 - p)
```

to discourage the model from relying too heavily on any single smoothed channel.

## Summary
With these steps ConvEWMA turns a sequential statistic into a learnable vectorised layer that slots into PyTorch pipelines. After doing this I think maybe I could do SGD (Since I was using it) using a convolutional layer, but I have put it on the [next post](https://robinc.vercel.app/posts/014-ConvSGD.md).