---
title: "6 - Performance Analysis"
date: "2026-09-29"
---

*Reading: book §2.6-2.6.4 (speedup and efficiency, Amdahl's law, scalability, taking
timings). The deck goes further than the reading in one direction, down to the single
thread: execution time as instruction count × cycles per instruction × cycle time.*

## What "performance" means

Slide 2 asks which of four airplanes performs best, and the answer depends on the axis:
the 747 carries the most passengers, the DC-8 flies furthest, the Concorde is fastest, and
passengers × mph (throughput) puts the 747 on top again. A single word, several defensible
rankings. The first thing a performance claim needs is the metric it is ranked on.

The deck's standard definition (slide 3), for a program on machine X:

$$\text{Performance}_X = \frac{1}{\text{Execution time}_X}$$

Faster means higher performance, and "X is $n$ times faster than Y" means
$\text{ET}_Y / \text{ET}_X = n$.

## Speedup and efficiency

With $p$ cores, a serial run-time $T_{serial}$ and a parallel run-time $T_{parallel}$
(slide 4):

$$S(p) = \frac{T_{serial}}{T_{parallel}} \qquad\qquad E = \frac{S}{p} = \frac{T_{serial}}{p \cdot T_{parallel}}$$

The best case is dividing the work equally and adding no work: $T_{parallel} = T_{serial}/p$,
so $S = p$ and $E = 1$. The book calls that **linear speedup**. $p$ can count threads,
processes or cores (slide 9).

Slides 5-6 draw one 100-unit job on four processors in four ways. The figure puts the
four on one scale and splits every column into useful work, overhead, and time spent
idle waiting for the slowest processor:

```artifact src=demos/speedup-overheads.jsx
```

| Scenario | Each processor | $T_{parallel}$ | $S$ | $E$ |
|---|---|---|---|---|
| Perfect parallelization | 25 | 25 | 4.0 | 1.00 |
| Perfect load balance, synchronization cost | 35 | 35 | 2.86 | 0.71 |
| Load imbalance | 30, 20, 40, 10 | 40 | 2.5 | 0.63 |
| Load imbalance and synchronization cost | 50 | 50 | 2.0 | 0.50 |

(The slide prints 2.85 for $100/35$, which is 2.857.) Slide 6 labels the last case
"closest to real life parallel programs". The first case is the one the slide asks
"does it ever occur?" about.

The two middle rows get to a similar place by different routes. With synchronization cost
every core is busy the whole time but some of that time is not the original problem. With
load imbalance every unit of work is useful, but three cores finish early and idle. Speedup
cannot tell these apart, because it only sees the tallest column.

### Efficiency as utilization

The book (§2.6.1) reads efficiency as the fraction of the parallel run-time each core
spends, on average, on the original problem. Multiply it out:

$$E \cdot T_{parallel} = \frac{T_{serial}}{p \cdot T_{parallel}} \cdot T_{parallel} = \frac{T_{serial}}{p}$$

The rest, $T_{parallel} - T_{serial}/p$, is overhead. The book's example: $T_{serial} = 24$ ms,
$p = 8$, $T_{parallel} = 4$ ms, so $E = 24/(8 \cdot 4) = 3/4$. Each core spends 3 ms of its
4 ms on the problem and 1 ms on overhead.

When a program is built by splitting serial work and adding the coordination it needs,
the book writes

$$T_{parallel} = \frac{T_{serial}}{p} + T_{overhead}$$

and efficiency is exactly the share of $T_{parallel}$ that is not $T_{overhead}$.

### Where the overhead comes from

Slide 8's list:

- Communication
- Memory access
- Creating threads or processes
- Synchronization
- Load imbalance
- Extra computation (work the serial program never did, such as each thread recomputing
  its own loop bounds)

All six grow, or at least do not shrink, as $p$ grows: more threads means more of them
queued at a critical section, and more processes means more data crossing the network
(book §2.6.1). So in practice $S$ falls further below $p$, and $E$ falls, as $p$ rises.

### Speedup depends on the problem size too

Slides 11-12 plot the book's matrix-vector multiplication run (Tables 2.4-2.5) at half,
the original and double the problem size:

| $p$ | 1 | 2 | 4 | 8 | 16 |
|---|---|---|---|---|---|
| Half size: $S$ | 1.0 | 1.9 | 3.1 | 4.8 | 6.2 |
| Half size: $E$ | 1.0 | 0.95 | 0.78 | 0.60 | 0.39 |
| Original: $S$ | 1.0 | 1.9 | 3.6 | 6.5 | 10.8 |
| Original: $E$ | 1.0 | 0.95 | 0.90 | 0.81 | 0.68 |
| Double size: $S$ | 1.0 | 1.9 | 3.9 | 7.5 | 14.2 |
| Double size: $E$ | 1.0 | 0.95 | 0.98 | 0.94 | 0.89 |

Bigger problems parallelize better, and this is the common case: at a fixed $p$, the
overhead usually grows much more slowly with the problem size than the useful work does.
So a speedup quoted without its problem size is only half a number.

### What the fastest machines achieve

Slide 7 lists the top five of the June 2026 Top500. Each row gives Rmax, the rate the
machine sustained on the list's benchmark (the LINPACK dense solve), and Rpeak, its
theoretical peak. Their ratio is an efficiency in exactly the sense above: work achieved
over what the hardware could do if nothing were lost.

| Rank | System | Cores | Rmax (PFlop/s) | Rpeak (PFlop/s) | Rmax / Rpeak | Power (kW) |
|---|---|---|---|---|---|---|
| 1 | LineShine | 13,789,440 | 2,198.40 | 2,735.82 | 0.80 | 42,220 |
| 2 | El Capitan | 11,340,000 | 1,809.00 | 2,821.10 | 0.64 | 29,685 |
| 3 | Frontier | 9,066,176 | 1,353.00 | 2,055.72 | 0.66 | 24,607 |
| 4 | Aurora | 9,264,128 | 1,012.00 | 1,980.01 | 0.51 | 38,698 |
| 5 | JUPITER Booster | 4,801,344 | 1,000.00 | 1,226.28 | 0.82 | 15,794 |

El Capitan has the highest peak on the list and ranks second, because it converts less of
that peak into delivered work than LineShine does. And this is a benchmark built to
parallelize well; ordinary programs typically do worse.

### Be careful about T

Both times are wall-clock times, and slide 10 lists what moves them besides the algorithm:
the programmer's skill, the compiler (GNU C++ versus Intel C++), its switches (optimization
on or off), the operating system, the filesystem holding the input, and even the time of
day, through other workloads and network traffic.

There is also the question of which $T_{serial}$ to divide by (book §2.6.1). One camp uses
the fastest serial program on the fastest processor available; the other uses the serial
program the parallel one was built from, on one core of the same machine. The book takes
the second, which makes $E$ read as the utilization of that machine's
cores. A parallel shell sort is compared with a serial shell sort, not with the best serial
sort anywhere.

## Amdahl's law, from the reading

[L5](note.html?course=CSCI-UA-480-parallel&note=05-software-advanced) derived the law:
with a fraction $r$ of the serial run-time that cannot be parallelized, the speedup can
never exceed $1/r$, however many cores are added. The book's numbers (§2.6.2): parallelize
90% of a 20-second program perfectly and

$$S = \frac{20}{18/p + 2} \le \frac{20}{2} = 10$$

even with a thousand cores.

The reading adds what L5 did not: three reasons not to give up.

1. **The law holds the problem size fixed.** For many problems the inherently serial
   fraction shrinks as the problem grows; the mathematical form of this is **Gustafson's
   law**. It is the same effect as the problem-size table above.
2. Scientists and engineers routinely get huge speedups on large distributed-memory
   systems.
3. A speedup of 5 or 10 is often more than enough, especially when the parallel version
   was not expensive to write.

## Scalability

Slide 13: scalability is the ability of a system to handle a growing amount of work
efficiently; the course means software. Two special cases:

- **Strongly scalable:** $E$ stays fixed as the number of processes or threads grows,
  **with the problem size fixed**.
- **Weakly scalable:** $E$ stays fixed when the problem size grows **at the same rate** as
  the number of processes or threads.

The book's general definition (§2.6.3) sits between them: a program is scalable if, when
$p$ grows, some rate of growth in the problem size keeps $E$ constant.

Its example: $T_{serial} = n$ and $T_{parallel} = n/p + 1$ (units of microseconds, $n$ the
problem size), so

$$E = \frac{n}{p\,(n/p + 1)} = \frac{n}{n + p}$$

Multiply $p$ by $k$ and look for the factor $x$ on $n$ that keeps $E$:

$$\frac{xn}{xn + kp} = \frac{n}{n+p} \quad\text{holds for } x = k, \text{ since } \frac{kn}{k(n+p)} = \frac{n}{n+p}$$

Growing the problem as fast as the core count holds the efficiency, so the program is
weakly scalable. It is not strongly scalable: at fixed $n$, $E = n/(n+p)$ falls as $p$
grows.

The matrix-vector table reads the same way. Down any row $E$ falls with $p$, so the
program is not strongly scalable; moving to a bigger problem as $p$ grows recovers it.

## Taking timings

"What is time?" (slide 15): start to finish, or a segment of interest; CPU time, or wall
clock? They are different numbers, and parallel programs make the difference large.

Slides 16-17 split the **elapsed time** (wall-clock time), which counts everything:

- **CPU time**, when the processor is running this program. It excludes I/O waits and
  time spent running other programs, and splits into **user CPU time** (the program's own
  code, including the libraries it calls) and **system CPU time** (the OS working on its
  behalf).
- Time outside that: waiting on I/O, on the disk, and time the OS gives to other programs.

Not on the slide: a stall on a cache miss is still CPU time. The core is running your
instruction, just slowly, so the memory hierarchy shows up inside CPU time. What leaves CPU
time is the process not running at all: blocked on the disk or the network, or waiting
for its turn.

Slide 16 says the deck's focus is **user CPU time**. That is the right lens for the next
section, one thread's instructions on one core. For a parallel program's run-time, the
book (§2.6.4) and the deck's conclusion both use elapsed time.

### Two tools

From the shell, `time prog` reports all three (slides 18-19): `real` is the wall clock,
`user` and `sys` are the CPU times. Inside a C program, `clock()` from `<time.h>` returns
CPU time used by the program so far, in units of `CLOCKS_PER_SEC`:

```c
#include <time.h>
#include <stdio.h>

int main() {
    clock_t start, end;
    double total;
    int i;

    start = clock();
    for (i = 0; i < 10000000; i++) { }
    end = clock();
    total = (double)(end - start) / CLOCKS_PER_SEC;
    printf("Total time taken by CPU: %f\n", total);
}
```

> **Beyond the slide —** the slide declares `total` as a `clock_t` along with `start` and
> `end`. `clock_t` is an integer type on Linux, so the division's fraction is thrown away
> (anything under a second prints as 0), and passing an integer to `%f` is undefined
> behavior. It needs to be a `double`, as above. Two more traps in the same example: with
> optimization on (`-O2`), the compiler deletes the empty loop, and the program times
> nothing. And `clock()`'s "clock ticks" are ticks of CPU time, not of the wall clock,
> which is why slide 19 labels it CPU time.

Slide 20's warnings, which the next figure acts out:

- For a multithreaded program, `clock()` returns the **sum** of the CPU time of every
  thread.
- It measures CPU time as user plus sys.
- Cores change their frequency, so the OS keeps time for programs with a separate
  constant-rate timer rather than counting core cycles. (`CLOCKS_PER_SEC` is the unit
  `clock()` reports in, fixed at 1,000,000 on POSIX systems; it is not the resolution of
  the timer.)

```artifact src=demos/timing-clocks.jsx
```

Four threads that each compute for 2.25 s finish in 2.25 s of wall clock, and `clock()`
reports 9 s. One of them blocking on a message makes the run take longer without adding a
single second of CPU time. So `clock()` is useless as the $T_{parallel}$ of a speedup, and
the reported run-times of parallel programs are wall-clock times (book §2.6.4).

### How the book takes a parallel time

The book's recipe (§2.6.4):

```c
shared  double global_elapsed;
private double my_start, my_finish, my_elapsed;

Barrier();                         /* start everyone together */
my_start = Get_current_time();
/* code we want to time */
my_finish = Get_current_time();
my_elapsed = my_finish - my_start;

global_elapsed = Global_max(my_elapsed);   /* the slowest thread is the run-time */
if (my_rank == 0)
    printf("The elapsed time = %e seconds\n", global_elapsed);
```

`Get_current_time()` stands for a wall-clock timer: `MPI_Wtime` in MPI, `omp_get_wtime`
in OpenMP. The other rules from the same section:

- **Time the part of interest**, not the whole program: sorting the keys, not reading and
  printing them. That is why `time prog` is often the wrong tool.
- **Check the timer's resolution**, the shortest nonzero duration it can report. A
  millisecond timer needs millions of sub-nanosecond instructions before it moves.
- **Report the minimum** over several runs, not the mean or median: nothing outside the
  program makes it run faster than its best, so the minimum is the least disturbed run.
- **Run at most one thread per core.** More adds scheduling time and makes timings much
  more variable.
- **Leave I/O out** of reported times; these programs are not designed for fast I/O.

## Two kinds of problems

Slide 21. Know which one you are parallelizing:

- **Capacity computing:** solve as many small or medium problems as possible at the same
  time.
- **Capability computing:** solve one highly complex problem as fast as possible, and at
  the lowest cost.

They reward different things, which slide 22 names:

- **Response time** (execution time): from the start of a task to its completion. How long
  did the simulation take?
- **Throughput:** work done per unit time. How many threads finished in the last two
  minutes?

Slide 22 asks how the two relate. Run one task at a time and they are reciprocals:
throughput is $1/\text{response time}$. Once tasks overlap they come apart. Running
four independent jobs on four cores quadruples throughput and leaves each job's response
time unchanged; that is capacity computing. Splitting one job across four cores is
aimed at its response time; that is capability computing, and the speedup and
efficiency above measure how well it went. (Sharing caches and memory bandwidth can even
make each job's response time worse while throughput still rises.)

## Inside one thread: ET = IC × CPI × CT

Slide 23 lists measures for one thread running sequentially on one core: instruction
count, CPI, IPC, MIPS and execution time. Slide 24 ties them together:

$$\text{ET} = \frac{\text{seconds}}{\text{program}} = \frac{\text{instructions}}{\text{program}} \times \frac{\text{cycles}}{\text{instruction}} \times \frac{\text{seconds}}{\text{cycle}} = \text{IC} \times \text{CPI} \times \text{CT}$$

IPC is $1/\text{CPI}$, and CT (cycle time) is $1/\text{clock rate}$. The slides' four
examples, worked:

**Clock rate** (slide 25). A program takes 10 s on machine A at 4 GHz. Machine B should
take 6 s, but its design needs 1.2 times as many cycles. With total cycles $\text{IC}
\times \text{CPI}$ written as $N$:

$$10 = \frac{N}{4\,\text{GHz}}, \qquad 6 = \frac{1.2N}{f} \quad\Rightarrow\quad f = \frac{1.2 \times 40 \times 10^9}{6} = 8\,\text{GHz}$$

A 1.67× shorter time needs a 2× faster clock, because every cycle now does less.

**CPI** (slide 26). Same ISA, same program, so the same IC. A: 250 ps cycle, CPI 2.0.
B: 500 ps cycle, CPI 1.2.

$$\text{ET}_A = \text{IC} \times 2.0 \times 250 = 500\,\text{IC ps}, \qquad \text{ET}_B = \text{IC} \times 1.2 \times 500 = 600\,\text{IC ps}$$

A is faster, by $600/500 = 1.2\times$, despite the higher CPI.

**Instruction count** (slides 27-28). Classes A, B and C take 1, 2 and 3 cycles, on the
same machine, so CT is common.

| Sequence | Mix (A, B, C) | IC | Cycles | CPI |
|---|---|---|---|---|
| 1 | 2, 1, 2 | 5 | $2 + 2 + 6 = 10$ | 2.0 |
| 2 | 4, 1, 1 | 6 | $4 + 2 + 3 = 9$ | 1.5 |

The second sequence is faster ($10/9 = 1.11\times$) with more instructions.

**MIPS** (slides 29-30). Two compilers, a 4 GHz machine, the same classes. MIPS is
millions of instructions per second.

| Compiler | Mix (millions) | Cycles | ET | MIPS |
|---|---|---|---|---|
| 1 | 5, 1, 1 (7 M) | $10 \times 10^6$ | 2.5 ms | 2800 |
| 2 | 10, 1, 1 (12 M) | $15 \times 10^6$ | 3.75 ms | 3200 |

MIPS prefers compiler 2 and execution time prefers compiler 1, by 1.5×. Compiler 2
executes more of the cheap instructions, which raises the instruction rate while adding
work. MIPS rewards instruction count, so it can rank backwards; execution time is the
measure that decides.

## Why multithreaded runs are harder to measure

Slide 31, for multithreaded programs:

- **The total number of instructions executed can differ from run to run**, and the
  effect grows with the number of cores. The same program on the same input takes
  different paths through its synchronization: a thread that waits on a lock may spin,
  executing instructions, for longer or shorter depending on timing.
- **System-level code is a significant fraction** of the total execution time: thread
  creation, scheduling, synchronization calls.

So IC, one factor of ET, is not even fixed across runs. Measure several runs, and read
per-thread counts with care.

Slide 32: **your program does not run in a vacuum.** The OS is always there, and multicore
machines usually run several programs or many threads at once. Independent programs still
slow each other down, because they compete for what the cores share: the caches at the
levels they share, memory bandwidth, and the scheduler's time.

## Conclusions

Slide 33:

- Performance evaluation assesses the programming, the architecture, and how they
  interact.
- Execution time is what matters, in all its parts: system time, CPU time, I/O and memory
  time. To know whether a time is good, compare it with something: the sequential code,
  another parallel version.
- Scalability and efficiency measure the quality of the code.

A speedup, then, is only as meaningful as three things stated alongside it: which serial
program it divides, at what problem size, and timed how.
