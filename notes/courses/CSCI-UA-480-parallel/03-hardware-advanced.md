---
title: "3 - Parallel Hardware: Advanced"
date: "2026-09-10"
---

*Reading: Pacheco & Malensek §2.3. The schedule note for this lecture: "You can neglect the
discussion about bisection width in section 2.3." Some slides are adapted from the Barlas
and Pacheco books.*

## Where L2 left off

The ILP techniques from [L2](note.html?course=CSCI-UA-480-parallel&note=02-hardware-basics)
- pipelining, superscalar, out-of-order execution, speculative execution, and simultaneous
multithreading. The framing line:

> All the above, **except hyperthreading**, require very little, if at all, work from the
> side of the programmer to make use of.

That exception is where this course begins.

## The memory wall

Historic growth rates, and they do not match:

| | Rate |
|---|---|
| CPU (µProc) | 60% / year |
| DRAM | 7% / year |
| Processor-memory performance gap | grows 50% / year |
| Disk capacity | 2× / year, 1997-2015, slowing but still increasing |

**Most of the single-core performance loss is on the memory system.** Memory access remains
a big problem on parallel machines, and cache coherence (below) has its own large negative
effect on performance.

This is the quiet thesis of the whole lecture, and it is restated as the last line of the
deck: communication and memory access are the expensive operations, *not* computation.

## Flynn's taxonomy

Classified by how instruction and data streams are used. A **PU** (processing unit) is any
piece of hardware that can compute.

| | Single data stream | Multiple data streams |
|---|---|---|
| **Single instruction stream** | SISD | **SIMD** |
| **Multiple instruction streams** | MISD | **MIMD** |

## SIMD

Parallelism achieved by dividing **data** among the processors, applying the same
instruction (or group of instructions) to multiple data items at once. This is **data
parallelism**. Examples: GPUs, vector processors.

The canonical shape, with $n$ data items and $n$ execution units under one control unit:

```c
for (i = 0; i < n; i++)
    x[i] += y[i];
```

When there are fewer execution units than data items, divide the work and process
iteratively - 4 execution units and 15 data items takes 4 rounds, the last one only
three-quarters full.

**Drawbacks.** All execution units must execute the same instruction or sit idle; in the
classic design they must also operate synchronously. Efficient for large data-parallel
problems, but not for more complex kinds of parallelism.

### Vector processors

Instructions whose operands are vectors rather than scalars. Requires **vector registers**
(storing a vector of operands and operating on their contents simultaneously) and
**vectorized execution units** (the same operation applied to each element, or to pairs).

| Pros | Cons |
|---|---|
| Fast | Do not handle irregular data structures |
| Easy to use | A hard limit on scalability - finitely many vectorized execution units |
| Vectorizing compilers are good at identifying exploitable code | ...and finitely many vectorized registers |
| Compilers also report what *cannot* be vectorized, helping you re-evaluate | |
| Best use of memory bandwidth - fetching a batch beats fetching one value at a time | |
| Uses every item in a cache line | |

The last two pros are the memory wall showing up again: the vector win is as much about
bandwidth utilization as about arithmetic throughput.

## MIMD

Multiple simultaneous instruction streams operating on multiple data streams, typically a
collection of fully independent processors or cores. Examples: multicore processors,
multiprocessor systems.

Flynn classifies by instruction and data streams. MIMD then subdivides by **how memory is
used**:

**Shared memory.** Autonomous processors/cores connected to a memory system via an
interconnection network. Each can access every memory location, and they usually
communicate **implicitly**, by accessing shared data.

> The slide poses this and leaves it: if one CPU accesses `addr1` and another accesses
> `addr2`, do they see the same delay? Hint: **banks.** Worth answering from the recording -
> it is the seed of NUMA at the end of the deck.

**Distributed memory.** A cluster of nodes connected by an interconnection network, where a
node nowadays is typically multicore processors plus accelerators. Either all nodes are the
same - **SMP**, symmetric multi-processing - or one node is more important than the others.

## Interconnection networks

Affects the performance of both shared and distributed memory systems, because
communication is very expensive. Two categories.

**Shared memory interconnects**

- **Bus** - parallel communication wires plus hardware controlling access, with the wires
  shared by every connected device. As devices are added: contention rises, communication
  becomes unreliable due to noise, and performance falls.
- **Switched** - switches route data among devices, wired together into a topology. A
  **crossbar** allows simultaneous communication between different devices and is faster
  than a bus, but the switches and links cost relatively more.

**Distributed memory interconnects**

- **Direct** - each switch is directly connected to a node, and the switches connect to
  each other. Examples: ring, toroidal mesh.
- **Indirect** - switches may not be directly connected to a node. Example: crossbar.

### Latency and bandwidth

- **Latency** - the time between the source beginning to transmit and the destination
  starting to receive the first byte.
- **Bandwidth** - the rate (bytes/sec) at which the destination receives data *after* it
  has started receiving the first byte.

With one wire sending 4 bits: latency is the time for bit 1 to arrive, bandwidth is how
many bits arrive per cycle (one, with one wire). Then

$$
\text{message transmission time} = l + \frac{n}{b}
$$

for latency $l$ seconds, message length $n$ bytes, bandwidth $b$ bytes/second. The two terms
have different sensitivities: latency is paid once per message regardless of size, so many
small messages are dominated by $l$ and a few large ones by $n/b$. That asymmetry is why
message aggregation is a standard optimization in MPI.

## Cache coherence

Between the cores and the memory modules sit one or more levels of cache, and that
introduces the challenge. Programmers have no control over the caches or when they are
updated - **but they can write cache-friendly code.**

The problem, from slide 34: `x = 2` is shared, `y0` is privately owned by core 0, `y1` and
`z1` by core 1. `y0` eventually ends up 2, `y1` eventually ends up 6, and `z1` is
indeterminate. "Such a situation is a big mess and must not happen as it leads to buggy
code."

**Snooping.** The cores share a bus or other broadcasting interconnect, so any signal on it
is visible to all. When a core updates its cached copy of `x` it broadcasts that fact; a
core snooping the bus sees the update and marks its own copy invalid.

**Directory-based.** A hardware structure - the directory - stores the status of each cache
line. On an update the directory is consulted, and the cache controllers of exactly those
cores holding that line are invalidated.

| Axis | Options |
|---|---|
| Mechanism | snoopy protocols vs. directory-based protocols |
| Update policy | write-invalidate vs. write-update |
| Named protocols | MESI, MSI, MOESI, ... |

**Directory-based is far more scalable than snoopy and hence more widely used.** The reason
is in the two mechanisms: snooping requires a broadcast every core must observe, which is
$O(p)$ traffic per update, while a directory notifies only the sharers.

## A machine at the top

The deck's closing example, from the November 2025 Top500 list: 11,340,000 cores (AMD 4th
Gen EPYC 24C at 1.8 GHz), 43,808 AMD Instinct MI300A GPUs, 128 GB HBM3 per node,
$R_{\max}$ 1.809 exaFLOP/s, $R_{\text{peak}}$ 2.8211 exaFLOP/s, 29.684 MW.

> Slide inconsistency worth checking against the recording: the slide is titled **Frontier**
> but its source link is `asc.llnl.gov/exascale/el-capitan` and the specs given are El
> Capitan's. Do not memorize the pairing without confirming which machine Zahran named.

## Conclusions

The trend: more cores per chip, more heterogeneity, non-bus interconnect, and **NUMA** and
**NUCA** (non-uniform memory / cache access). And the line the whole deck was building to:

> Communication and memory access are the two most expensive operations, **NOT**
> computations.

## What to retain from L3

| Topic | Key point |
|---|---|
| The programmer's line | every ILP technique except hyperthreading is free to the programmer |
| Memory wall | CPU 60%/yr vs. DRAM 7%/yr; the gap grows 50%/yr |
| Where performance is lost | the memory system, not the arithmetic |
| Flynn | SISD / SIMD / MISD / MIMD, classified by instruction and data streams |
| SIMD | data parallelism; same instruction, many data; GPUs and vector processors |
| SIMD cost | all EUs run the same instruction or idle; classically synchronous |
| Vector pros | bandwidth utilization and full cache lines, as much as raw speed |
| Vector cons | irregular data structures; finite EUs and registers cap scalability |
| MIMD split | by memory use: shared (implicit communication) vs. distributed (cluster of nodes) |
| SMP | all nodes the same |
| Bus vs. switched | contention/noise/falling performance vs. simultaneous communication at higher cost |
| Direct vs. indirect | switch attached to a node (ring, toroidal mesh) vs. not (crossbar) |
| Latency vs. bandwidth | time to *first* byte vs. rate *after* the first byte |
| Transmission time | $l + n/b$; small messages are latency-bound, large ones bandwidth-bound |
| Coherence mechanisms | snooping (broadcast, $O(p)$) vs. directory (notify sharers only) |
| Coherence policies | write-invalidate vs. write-update; MESI / MSI / MOESI |
| Which scales | directory-based, and that is why it is what gets used |
| Excluded | bisection width in §2.3 - explicitly dropped from the reading |
| The thesis | communication and memory access cost, computation does not |
