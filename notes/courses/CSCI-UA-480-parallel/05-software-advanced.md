---
title: "5 - Parallel Software: Advanced"
date: "2026-09-24"
---

*No reading is assigned for this lecture. Per the schedule, that means the slides are the
material. The pipeline example (slides 42-43) is credited on the slide to a futurechips.org
post.*

## Concurrency is not parallelism

[L4](note.html?course=CSCI-UA-480-parallel&note=04-software-basics) ended on how to design
a parallel program. This deck opens by separating two words that get used as if they meant
the same thing (slide 2):

| | Definition | Needs |
|---|---|---|
| **Concurrency** | at least two tasks make progress in the same time frame, not necessarily at the same instant | one processing unit is enough; time-slicing counts |
| **Parallelism** | at least two tasks execute literally at the same time | hardware with multiple processing units |

Concurrency is the more general concept. Slide 7 draws it as nested sets: all programs
contain the concurrent programs, which contain the parallel programs. Every parallel program
is concurrent; a concurrent program on one core is not parallel.

### Concurrency alone can help

Slides 3-5: one server, two requests arriving at $t = 0$. Request 1 needs 6 time units,
request 2 needs 2.

| Schedule | Order | r1 done | r2 done | Average completion |
|---|---|---|---|---|
| Serial | r1 six times, then r2 twice | 6 | 8 | 7 |
| Concurrent | r1, r2, r1, r2, then r1 four times | 8 | 4 | 6 |

Same single unit, same 8 units of total work, and the average drops from 7 to 6. Nothing ran
in parallel; the short request stopped waiting behind the long one. The price is on the
same table: r1 now finishes at 8 instead of 6. Concurrency moved latency from r2 to r1, and
the average improved because r2 gained more than r1 lost.

Put the two together and you get slide 8's formula: **concurrency + parallelism = high
performance.**

## Do 2 cores give 2x? Amdahl's law

Does unlimited hardware buy unlimited parallelism, and do 2 cores give a 2x speedup
(slide 9)? No, and Amdahl's law (1967) is the first reason why.

The derivation (slide 11), with $T_{seq}$ the sequential time, $p$ the number of cores and
$F$ the fraction of the program that is sequential:

$$T_{par} = F \cdot T_{seq} + (1-F)\frac{T_{seq}}{p}$$

$$\text{Speedup} = \frac{T_{seq}}{T_{par}} = \frac{1}{F + \frac{1-F}{p}}$$

Slide 10 draws it: the sequential block keeps its full length at 1, 2, 3 and 4 CPUs, and
only the parallelizable block gets sliced.

Not on the slide, but it follows in one line: as $p \to \infty$ the second term vanishes and
the speedup approaches $1/F$. With $F = 0.1$:

| $p$ | 2 | 4 | 8 | 16 | $\infty$ |
|---|---|---|---|---|---|
| Speedup | 1.82 | 3.08 | 4.71 | 6.40 | 10 |

Going from 8 to 16 cores buys 1.36x, not 2x. And $F$ is a fraction of *execution time* on
the sequential machine, not of lines of code, which is part of why slide 12 says it is not
easy to find.

What Amdahl was saying (slide 12): **don't invest blindly in a large number of processors**;
in some cases a faster core makes more sense than many. Was he right? In 1967 many programs
had long sequential parts. That is not necessarily the case now.

### What the law leaves out

Slide 13's figure shows execution alternating between sequential and parallel regions, and
marks two costs the formula has no term for:

- **Sequential-to-parallel synchronization**, paid at every fork and every join.
- **Inter-core communication** inside the parallel regions.

Slides 14-15 turn that into advice:

- These costs become more significant as parallelism grows.
- With a high degree of data sharing, and so intense inter-core communication, run the
  workload on a **smaller number of larger cores**.
- Tasks with high inter-core communication belong on a small number of cores **even if the
  parallel fraction is close to 1**.
- Tasks with low arithmetic intensity may be better off on **one core**, again even if the
  parallel fraction is close to 1.

Arithmetic intensity is computation per byte of data moved. A low-intensity task is mostly
moving data, and that is [L3](note.html?course=CSCI-UA-480-parallel&note=03-hardware-advanced)'s
closing line again: communication and memory access are what cost. When there is little
computation to divide, dividing it mostly adds communication.

Slide 16's summary:

- Decreasing the serialized portion matters more than adding cores blindly.
- Only when a program is mostly parallelized does adding processors help more than
  parallelizing the rest.
- Amdahl ignores the overhead of synchronization, communication, the OS, and so on, and
  assumes the load is balanced.
- So use it as a **guideline and theoretical bound only**. A real program does no better
  than the law predicts, and usually worse.

## Analyzing without running: the DAG model

Can we judge a parallel algorithm without executing it (slide 17)? The DAG model (slide 18)
is the tool for that: modeling, analyzing and optimizing a parallel algorithm or workflow.

- A **vertex** is a unit of execution: an instruction, a basic block, a function, any
  granularity you decide on. The following slides take it to be an instruction.
- An **edge** from A to B is a dependency: A must execute first, then B.

Two quantities, and a law for each (slides 20-21), with $T_P$ the fastest possible execution
time on $P$ processors:

| | Definition | Law |
|---|---|---|
| **Work** $T_1$ | total time spent on all instructions | $T_P \ge T_1 / P$ |
| **Span** $T_\infty$ | the longest path of dependence in the DAG | $T_P \ge T_\infty$ |

Why each holds: $P$ processors do at most $P$ units of work per step, so $T_1$ units of work
need at least $T_1/P$ steps. And no number of processors can start a vertex before its
predecessors finish, so the longest chain runs one vertex at a time.

Slide 22 defines **parallelism** as $T_1 / T_\infty$, the ratio of work to span. Slide 23's
example is a fork vertex, eight independent chains of six, and a join vertex, each one cycle:

$$T_1 = 50, \quad T_\infty = 8, \quad T_1/T_\infty = 6.25$$

**Reading the ratio (derived from the span law, not stated on the slide).** Speedup is
$T_1 / T_P$, and the span law gives $T_1/T_P \le T_1/T_\infty$. So parallelism is the ceiling
on speedup no matter how many processors you add. On slide 23, eight processors finish in 8
cycles, which is the span, for a speedup of 6.25; a ninth processor has nothing to do.

Amdahl's sequential time $F \cdot T_{seq}$ is span of exactly this kind: no number of cores
shortens it. The DAG model finds that chain in the dependence structure instead of asking you
to estimate $F$.

## Programming model

Slide 24: the languages and libraries that create an abstract view of the machine. A model
answers three sets of questions:

| Axis | Questions |
|---|---|
| **Control** | how is parallelism created? how are dependencies enforced? |
| **Data** | shared or private? how is shared data accessed, or private data communicated? |
| **Synchronization** | what operations coordinate parallelism? which operations are atomic (indivisible)? |

Slide 25 adds that the hardware itself can be **heterogeneous**, and boxes the sentence the
course keeps returning to:

> The whole challenge of parallel programming is to make the best use of the underlying
> hardware to exploit the different type of parallelisms, and hence, reach the highest
> performance.

## Where performance is lost

Slide 27 is the list the rest of the deck works through:

1. **Extra overhead**: synchronization and communication.
2. **Artificial dependencies.**
3. **Contention** for hardware resources.
4. **Coherence.**
5. **Load imbalance.**

### Artificial dependencies

Slide 28:

```c
int result;                       // global variable
main() {
    ...
    for (...) {                   // the OUTER loop
        modify_result(...);
        if (result > threshold)
            break;
    }
    ...
}
void modify_result(...) {
    ...
    result = ...
}
```

> *What is wrong with that program when we try to parallelize the iterations?*

The slide leaves it open. **My reading, to confirm against the recording.** Two things chain
each iteration to the one before it:

1. Every iteration writes the same global `result`. Parallel iterations race on it (L4's
   critical section), and a lock around it serializes them again.
2. The `break` reads `result` after every call. Whether iteration $i+1$ should run at all is
   not known until iteration $i$ finishes, so starting iterations together means running some
   that the serial program never would.

The dependency is *artificial* when it comes from how the code is written and not from the
computation. If each iteration's value does not actually depend on the earlier ones, the
shared global is the only thing linking them: give each iteration its own local result, run
them in parallel, then take the first one that crosses the threshold and discard the rest.
If `modify_result` really accumulates (`result = result + ...`), the dependency is real and
no rewrite removes it. "Artificial" is a claim about the computation, not the syntax.

### Contention and coherence

**Contention** gets no slide of its own. L3 showed the basic case: a bus is shared by every
connected device, and contention rises as devices are added. Threads competing for any shared
hardware resource pay the same way.

**Coherence** (slide 29) costs performance three ways:

- Extra bandwidth, which is a scarce resource.
- Latency due to the protocol.
- False sharing.

The protocols themselves (snooping, directory, write-invalidate, MESI) are in L3 and the
§2.3 reading.

### Load imbalance

Slide 30's figure: four threads start at a synchronization point, each does a different
amount of work, and all of them wait at the next synchronization point for the slowest.
Everything below the shorter bars is idle time. The slide's line under it:

> Load imbalance is more severe as the number of synchronization points increases.

**Why, in one inequality (mine, not the slide's).** Let $w_{i,k}$ be thread $i$'s work in
phase $k$. With a synchronization point after every phase, each phase costs its slowest
thread, so the total is $\sum_k \max_i w_{i,k}$. With only one synchronization point at the
end, the total is $\max_i \sum_k w_{i,k}$. A sum of maxima is never smaller than the maximum
of the sums, and it is strictly larger unless one thread is the slowest in every phase.
Each extra synchronization point stops the imbalance from averaging out.

If you cannot eliminate it, at least reduce it (slide 31).

| | How | Cost |
|---|---|---|
| **Static assignment** | a fixed number of threads from the start, each given a predefined amount of work | nothing adjusts if the estimate was wrong |
| **Dynamic assignment** | number of threads and amount of work not known in advance; threads are created and given work as the program runs | has its overhead |

The same split as L4's static and dynamic threads, now seen from the load side rather than
the resource side.

## Patterns

There are several ways to parallelize an algorithm, depending on the problem (slide 32).
Slide 33 lists them:

- **Task-level** (for example, embarrassingly parallel)
- **Divide and conquer**
- **Pipeline**
- **Iterations** (loops)
- **Client-server** (repository model)
- **Geometric** (usually domain dependent)
- **Hybrid**: different program phases need different kinds of parallelization.

Iterations, geometric and hybrid get no slides of their own.

### Task level

Here the application is broken into tasks decided **offline**, a priori (slides 34-35). The
figure has five independent tasks of different lengths, A to E, spread over four cores, with
C and E sharing one core. The slide's verdict: generally, this scheme **does not have strong
scalability**. The number of tasks is fixed when the program is written, so it does not grow
with the number of cores.

Slide 36's example computes the minimum (T1), average (T2) and maximum (T3) of a large
array. The sequential version does all three in one loop; the parallel version splits them
into three loops, one per task:

```c
int i; int min = m[0];            // T1
for (i = 1; i < maxN; i++)
    if (m[i] < min) min = m[i];

int j; double avrg = m[0];        // T2
for (j = 1; j < maxN; j++)
    avrg = avrg + m[j];
avrg = avrg / maxN;

int k; int max = m[0];            // T3
for (k = 1; k < maxN; k++)
    if (m[k] > max) max = m[k];
```

**Worth noticing (mine).** With `maxN` at $10^9$, the sequential version reads the array
once and the task version reads it three times, once per core. By L3's thesis, the memory
traffic is the expensive part and it just tripled. The split buys three cores' worth of
arithmetic and pays for it in memory bandwidth.

### Divide and conquer

Slide 37's figure is a tree: split the problem into subproblems, split those, compute the
leaves, then merge back up to a solution. The parallel version (slide 39):

```c
DnD(A) {
    if (isBaseCase(A))
        return solution(A);
    else {
        if (bigEnoughForSplit(A)) {           // if problem is big enough
            split A into N subproblems B[N];
            for (int i = 0; i < N; i++)
                task[i] = newTask(DnD(B[i])); // non-blocking
            for (int i = 0; i < N; i++)
                sol[i] = getTaskResult(task[i]); // blocking: wait for results
            return mergeSolution(sol);
        }
        else {                                // else solve sequentially
            return solution(A);
        }
    }
}
```

Three things differ from the sequential version on slide 38:

- `newTask` does not wait, so all $N$ subproblems start before any result is collected.
- `getTaskResult` blocks. Every merge is a join, which is slide 13's
  sequential-to-parallel synchronization, at every level of the tree.
- `bigEnoughForSplit` is a cutoff. Below it, creating a task costs more than it saves
  (L4: thread creation and termination is time consuming), so small problems run
  sequentially.

### Pipeline

A pipeline applies a series of ordered but independent stages to data (slides 40-41).
Iteration $i$'s
stage C2 overlaps iteration $i+1$'s stage C1, and so on down the diagonal.

How:

1. Split each loop iteration into independent stages C1, C2, C3, ...
2. Assign each stage to a thread: T1 does C1, T2 does C2, ...
3. When a thread finishes its stage for one iteration, it starts the same stage for the next.

Useful for **streaming workloads** and for **loops that are hard to parallelize because of
dependences between iterations**. The advantages the slide gives: it exposes parallelism
*inside* an iteration, and locality increases for variables used across stages.

The example (slides 42-43) is a read-compress-write loop over 8 blocks, with read and write
taking 1 time unit each and compress taking 4:

```c
while (!done) {
    Read block;
    Compress the block;
    Write block;
}
```

| Cores | Allocation | Finish time | Speedup |
|---|---|---|---|
| 1 | one core does everything | 48 | 1 |
| 3 | one core per stage | 34 | 1.41 |
| 6 | two cores per stage | about 19 (from the figure) | about 2.5 |

**Why 3 cores give 1.41 and not 3 (mine).** Compress is 4 of every 6 units, so the compress
core runs flat out and the other two wait on it: $34 = 1 + 8 \times 4 + 1$, the first read,
eight compressions back to back, the last write. The read and write cores are each busy 8
units out of 34. That is load imbalance again, across stages instead of across threads, and
a pipeline's throughput is set by its slowest stage.

### Repository model

Slide 44: a central repository of tasks, with compute threads around it making asynchronous
function calls. Whenever a thread is done with its task, it takes another one from the
repository.

This is slide 31's dynamic assignment built into the design: a thread that finishes early
simply takes more work, so the load balances itself. The cost is the repository, which every
thread touches. It is a shared structure, and every take is a synchronization on it, the
same shape as L4's histogram, where many tasks converged on one bin.

## Conclusions

Slide 45 puts the pieces together as six steps:

1. Problem definition
2. Partitioning
3. Communication: DAG analysis, Amdahl's law
4. Aggregation: DAG analysis (yes, you can use it here too!)
5. Mapping: processes, threads, or a mix
6. Implementation in a parallel language: pick the parallel pattern; decide static threads,
   dynamic threads, or SPMD

This is L4's PCAM with a step before it and a step after it, and with this deck's two
analysis tools placed where they apply: Amdahl and the DAG at communication, the DAG again
at aggregation.
