---
title: "1 - Why Parallel Computing?"
date: "2026-09-03"
---

*Reading: Pacheco & Malensek §1.1-1.4.*

## How to study, per the instructor

Slide 15, stated as a ranking rather than advice:

1. Slides only - "will most probably get you a bad grade. Because slides do not contain
   everything."
2. Slides + reading material - better than the above.
3. Slides + reading + attending (or listening to recordings of) the lectures - "much
   better than the above two."

This matters for how to use these notes. The Brightspace schedule says the slides may hold
more than the assigned reading but never less, so slides cover the reading. But Zahran's
own claim is that the *spoken lecture* carries material the slides do not. Since every
lecture is recorded, the recording is the authoritative source, and a note built from
slides alone - like this one - is a scaffold to hang the recording on, not a replacement
for it.

## Moore's law and what broke in 2002

The implicit assumption was: more transistors per chip means more performance. Measured
single-processor performance growth:

| Period | Performance increase per year |
|---|---|
| ~1986-2002 | 50% |
| 2002 onward | ~20% |

The thing that changed is **Dennard scaling**, not Moore's law. Moore's law kept
delivering transistors; Dennard scaling was the reason those transistors turned into
speed. Named for Robert Dennard (1932-2024), it says that scaling transistor dimensions
down:

- reduces circuit delay
- increases operating frequency
- reduces operating voltage, and therefore reduces power

That last clause is the load-bearing one. It stopped holding around 2002, and the
consequence is the power-density plot (slide 24, credited to Patrick Gelsinger at Intel)
that tracks 4004 → 8008 → 8080 → 8086 → 8085 → 286 → 386 → 486 → Pentium → P6 climbing
toward the reference lines for a hot plate, a nuclear reactor, a rocket nozzle and the
sun's surface. The summary on the slide: **Moore's law is giving us more transistors than
we can afford.** Scaling clock speed as usual will not work.

## Why power became the constraint

Power per chip is consumed (doing the calculations your program needs) and dissipated (as
temperature). More power means an exponential increase in packaging cost, a high
electricity bill at scale, and shorter battery life on portable machines. It rises from two
factors: more transistors per chip (once Dennard scaling stopped paying for them) and
higher frequency.

### The multicore power argument

The derivation on slide 26, which is the analytical core of the whole lecture:

$$
\text{Power} = C V^2 F, \qquad \text{Performance} = \text{Cores} \times F.
$$

Take two cores instead of one:

$$
\text{Power} = 2C V^2 F, \qquad \text{Performance} = 2\,\text{Cores} \times F.
$$

Now halve the frequency, noting $V \propto F$ so $V \to V/2$ and $V^2 \to V^2/4$:

$$
\text{Power} = 2C \cdot \frac{V^2}{4} \cdot \frac{F}{2} = C\,\frac{V^2}{4}\,F,
\qquad
\text{Performance} = 2\,\text{Cores} \times \frac{F}{2} = \text{Cores} \times F.
$$

Compare that against the one-core baseline: **identical performance at one quarter the
power.** The asymmetry comes from the exponent - performance is linear in $F$, but power is
cubic in it once you account for $V \propto F$. Halving frequency costs you a factor of two
in speed and buys a factor of eight in power, so you can afford to spend some of that
saving on more cores.

Hence: more cores at a slower clock beat one big fat core at a high clock - **if we can
make good use of them.** That conditional is the rest of the course.

## The case for multiple processors

- exploits several kinds of parallelism at once: among instructions, among
  tasks/threads/processes, and across data
- reduces power (above)
- an effective way to hide memory latency
- simpler cores are easier to design and test, which means higher yield, which means lower
  cost

Multicore comes in **homogeneous** and **heterogeneous** flavors. Terminology fixed on
slide 32: a **core** is a CPU, a **chip** sits in a **socket**, and multicore means several
cores per chip.

## Why it is now the programmer's problem

Adding cores does not help if programmers are unaware of them or do not know how to use
them, and serial programs mostly do not benefit. Three attempts to avoid that conclusion,
with the verdict on each:

| Idea | Result so far |
|---|---|
| The right language would make parallel programming straightforward | some languages made it easier, but none as fast, efficient and flexible as sequential programming |
| Design the hardware properly and parallel programming becomes easy | no one has yet succeeded |
| Write software that automatically parallelizes existing sequential programs | "success here is inversely proportional to the number of cores" |

The third verdict is the sharpest: auto-parallelization does not merely fail to scale, it
gets *worse* as the hardware gets better, which is precisely the regime that matters.

Parallelizing is not about parallelizing every step of a sequential program, only the ones
taking most of the time. Sometimes a totally new algorithm is needed, and the strategy
depends on the software being parallelized.

## The global sum example

Compute $n$ values and add them. With $p$ cores, $p \ll n$, each core takes a partial sum
over roughly $n/p$ values using its own private variables, independently.

**Naive collection.** Every core sends its `my_sum` to a designated master, which adds them
all.

**Tree collection.** Pair the cores - core 0 adds core 1's result, core 2 adds core 3's,
and so on - then repeat with only the even-numbered cores, and again.

| Cores | Naive: master receives + adds | Tree: master receives + adds |
|---|---|---|
| 8 | 7 + 7 | 3 + 3 |
| 1000 | 999 + 999 | 10 + 10 |

Better than a factor of 2 at eight cores, almost a factor of 100 at a thousand. The reason
is the shape: the master's work is $O(p)$ in the naive version and $O(\log_2 p)$ in the
tree, so the gap widens without bound. Note that the *total* number of additions is
unchanged - what changed is the critical path, and that is the quantity that sets the
running time.

## Two ways of thinking, one strategy

- **Strategy:** partitioning.
- **Two ways of thinking:** task-parallelism and data-parallelism.
- **Constraints that bound what you get:** communication, memory access, load balancing,
  synchronization.

## What to retain from L1

| Topic | Key point |
|---|---|
| The break | Dennard scaling stopped ~2002, not Moore's law; transistors kept coming, free speed did not |
| Dennard scaling | smaller transistors → less delay, higher frequency, lower voltage → lower power |
| Growth rates | 50%/yr until ~2002, ~20%/yr after |
| Power identity | $P = CV^2F$, $\text{Perf} = \text{Cores} \times F$, with $V \propto F$ |
| The multicore result | two cores at half clock = same performance, one quarter the power |
| Why it works | perf is linear in $F$, power is cubic in $F$ |
| Case for multicore | parallelism (instruction/task/data), power, latency hiding, simpler cores → yield → cost |
| Vocabulary | core = CPU; chip in a socket; homogeneous vs. heterogeneous multicore |
| Three failed escapes | better language, better hardware, auto-parallelizing compilers - the last gets worse with more cores |
| Global sum | master does $O(p)$ work naively, $O(\log p)$ in a tree; 999 vs. 10 at 1000 cores |
| What the tree changes | the critical path, not the total operation count |
| Strategy | partitioning; task- vs. data-parallelism |
| The four constraints | communication, memory access, load balancing, synchronization |
| Slogan | the free lunch is over for software programmers |
