---
title: "3 - Parallel Hardware: Advanced"
date: "2026-09-15"
---

*Reading: Pacheco & Malensek §2.3. The schedule note for this lecture: "You can neglect the
discussion about bisection width in section 2.3." Some slides are adapted from the Barlas
and Pacheco books. Where the reading goes past the slides, the paragraph names its
section.*

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

*§2.3.2's example of "or sit idle":*

```c
for (i = 0; i < n; i++)
    if (y[i] > 0.0) x[i] += y[i];
```

Every datapath loads its `y[i]` and tests it; the ones holding a non-positive value then sit
idle while the others add. A classical SIMD datapath also has no instruction storage, so it
cannot hold an instruction back to run it later.

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

*§2.3.2 adds* three memory features that make that bandwidth possible: **interleaved
memory** (multiple banks accessed more or less independently, so successive elements come
from different banks and none waits for a bank to recover), **strided access** (every
fourth element, say) and hardware **scatter/gather** (elements at irregular positions).
Vector lengths run from 4 to 256 64-bit elements, and systems scale by adding vector
processors, not by lengthening vectors.

**GPUs** (*§2.3.2*) use SIMD within each core, with many datapaths per core, and lean
heavily on hardware multithreading to hide memory stalls: some keep the state of more than a
hundred suspended threads per executing thread. So they need a lot of threads and a lot of
data to be busy, and do relatively poorly on small problems. They are not pure SIMD: a core
can run more than one instruction stream, so a GPU is neither purely SIMD nor purely MIMD.

## MIMD

Multiple simultaneous instruction streams operating on multiple data streams, typically a
collection of fully independent processors or cores. Examples: multicore processors,
multiprocessor systems.

Flynn classifies by instruction and data streams. MIMD then subdivides by **how memory is
used**. (*§2.3.3:* MIMD systems are usually **asynchronous**: there may be no global clock,
and without imposed synchronization two cores running the same code are at different
statements at any given instant.)

**Shared memory.** Autonomous processors/cores connected to a memory system via an
interconnection network. Each can access every memory location, and they usually
communicate **implicitly**, by accessing shared data.

> The slide poses this and leaves it: if one CPU accesses `addr1` and another accesses
> `addr2`, do they see the same delay? Hint: **banks.** Worth answering from the recording -
> it is the seed of NUMA at the end of the deck.

*§2.3.3 gives the two names.* If the interconnect connects every processor directly to all
of main memory, every location takes the same time to reach: **UMA**, uniform memory access.
If each processor is directly attached to its own block of memory and reaches the others'
blocks through special hardware on the chips, local memory is faster than remote memory:
**NUMA**. UMA is easier to program, since access time does not depend on where the data
lives; NUMA offers faster local access and can support more memory in total.

**Distributed memory.** A cluster of nodes connected by an interconnection network, where a
node nowadays is typically multicore processors plus accelerators. Either all nodes are the
same - **SMP**, symmetric multi-processing - or one node is more important than the others.

*§2.3.3:* since a cluster's nodes are themselves shared-memory machines, clusters are
sometimes called **hybrid** systems. A **grid** joins geographically distributed computers
into one distributed-memory system, usually heterogeneous.

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

*§2.3.4 goes further than the slides.* Bisection width is left out here, as the schedule
allows; everything else:

| Network | Kind | Cost in the reading | What it buys |
|---|---|---|---|
| Ring | direct | $p$ switch-to-switch links; switches with 3 links | several simultaneous messages, unlike a bus, but easy to make processors wait on each other |
| Toroidal mesh (2D) | direct | $2p$ links; switches with 5 links | more simultaneous communication patterns than a ring |
| Fully connected | direct | $p^2/2 - p/2$ links; every switch connects to all others | the theoretical best, impractical beyond a few nodes; a yardstick |
| Hypercube, dimension $d$ | direct | $p = 2^d$ nodes; each switch has $1 + \log_2 p$ wires | more connectivity than a mesh, at a higher price |
| Crossbar (distributed memory) | indirect | $p^2$ switches | all processors can send at once, unless two target the same processor |
| Omega network | indirect | $\tfrac{1}{2}p\log_2 p$ two-by-two crossbars, $2p\log_2 p$ switches | cheaper than a crossbar, but some pairs block: if 0 sends to 6, 1 cannot send to 7 |

Link counts leave out the processor-to-switch links, which may run at a different speed.
A hypercube is built inductively: two $(d-1)$-dimensional hypercubes with corresponding
switches joined.

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

*§2.3.4's warning:* the terms are not used consistently. "Latency" sometimes means the whole
transmission time, and sometimes the fixed overhead of assembling a message (data plus
destination, size and error-correction information) and taking it apart at the other end.

## Cache coherence

Between the cores and the memory modules sit one or more levels of cache, and that
introduces the challenge. Programmers have no control over the caches or when they are
updated - **but they can write cache-friendly code.**

The problem, from slide 34: `x = 2` is shared, `y0` is privately owned by core 0, `y1` and
`z1` by core 1. `y0` eventually ends up 2, `y1` eventually ends up 6, and `z1` is
indeterminate. "Such a situation is a big mess and must not happen as it leads to buggy
code."

Why `z1` is indeterminate (*§2.3.5*): at time 0 core 1 cached `x = 2`. Core 0's write at
time 1 changes core 0's cached copy and, with write-through, main memory too, but nothing
changes core 1's copy. Unless that copy happens to be evicted and reloaded, core 1 computes
$4 \times 2 = 8$ instead of $4 \times 7 = 28$, **whichever write policy the caches use.**
The figure steps through the three times with no protocol, with snooping, and with a
directory, on four cores so that a broadcast and a targeted message look different.

```artifact src=demos/coherence-walkthrough.jsx
```

**Snooping.** The cores share a bus or other broadcasting interconnect, so any signal on it
is visible to all. When a core updates its cached copy of `x` it broadcasts that fact; a
core snooping the bus sees the update and marks its own copy invalid.

*§2.3.5 sharpens this:* the broadcast says the **cache line** containing `x` was updated,
not `x` itself. The interconnect need not be a bus, only something that can broadcast.
Snooping works with write-through and write-back caches; with write-back an extra message
is needed, since the update does not go to memory. And since it needs a broadcast on every
update, it is not scalable: on a large network broadcasts are slow.

**Directory-based.** A hardware structure - the directory - stores the status of each cache
line. On an update the directory is consulted, and the cache controllers of exactly those
cores holding that line are invalidated.

*§2.3.5:* the directory is typically distributed, each core/memory pair keeping the entries
for the lines in its own memory. It takes substantial extra storage, but an update only has
to contact the cores that hold the variable.

| Axis | Options |
|---|---|
| Mechanism | snoopy protocols vs. directory-based protocols |
| Update policy | write-invalidate vs. write-update |
| Named protocols | MESI, MSI, MOESI, ... |

**Directory-based is far more scalable than snoopy and hence more widely used.** The reason
is in the two mechanisms: snooping requires a broadcast every core must observe, which is
$O(p)$ traffic per update, while a directory notifies only the sharers.

## Why not make everything shared memory?

*§2.3.6.* Most programmers find shared data structures easier than explicit messages, so
why are most large MIMD systems distributed-memory? The main hardware reason is **the cost
of scaling the interconnect.** Buses suit only a few processors, since conflicts rise sharply
as processors are added, and large crossbars are very expensive. Distributed-memory
interconnects such as the hypercube and toroidal mesh are relatively cheap, and systems with
thousands of processors have been built on them.

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
