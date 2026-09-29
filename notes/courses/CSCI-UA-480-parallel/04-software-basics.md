---
title: "4 - Parallel Software: Basics"
date: "2026-09-17"
---

*Reading: Pacheco & Malensek §2.4-2.4.4. The histogram example at the end of the deck is
that book's §2.7.1 worked through slide by slide. Where the reading goes past the slides,
the paragraph names its section.*

## The burden moves

[L3](note.html?course=CSCI-UA-480-parallel&note=03-hardware-advanced) ended on the claim
that communication and memory access are the expensive operations, not computation. This
deck opens by naming who is responsible for acting on that. The title of slide 2 is the
whole framing: **the burden is on software.**

From here on, the execution model is one of three shapes, or a mix:

| System | What you start | What carries out tasks |
|---|---|---|
| Shared memory | a single process, then fork threads | threads |
| Distributed memory | multiple processes | processes |
| Accelerators (GPUs) | a process with one or more threads | the thread launches a task onto the GPU, which runs it over different data |

The GPU row is SIMD from L3 wearing a programming model: *the same task on different data*.
And the combination case is the real one on a cluster - processes across nodes, threads
within a node, a GPU under each thread.

## The three jobs

Slide 3, and everything after it is an elaboration of these:

1. **Divide the work** among processes/threads so each gets roughly the same amount.
2. **Synchronize** them if needed.
3. **Arrange communication** among them - and *reduce it as much as possible*.

The deck's example of software that makes all three trivial:

```c
double x[n], y[n];
...
for (i = 0; i < n; i++)
    x[i] += y[i];
```

Every iteration is independent, nothing is shared, no order matters. Note what makes it
easy - not that it is short, but that **no two iterations touch the same location**. The
rest of the lecture is about what happens when that stops being true.

*§2.4.2 names the pieces.* Giving each process/thread roughly the same amount of work is
**load balancing**; a program that parallelizes by simply dividing the work is
**embarrassingly parallel** (the book objects to the name: a parallel solution to anything
is a cause for rejoicing). The other two jobs are intertwined: distributed-memory programs
often synchronize implicitly by communicating, and shared-memory programs often communicate
by synchronizing.

*§2.4.1* also names the style almost every program in the course uses: **SPMD**, single
program, multiple data. One executable acts like several programs by branching on its rank
(`if (I'm thread/process 0) do this; else do that;`), which covers both data parallelism
(each rank takes part of an array) and task parallelism (each rank takes a different task).

## Shared memory: managing threads

Two strategies, and the tradeoff is resources against latency:

| | How | Upside | Downside |
|---|---|---|---|
| **Dynamic threads** | master waits for work, forks new threads, threads terminate when done | efficient use of resources | thread creation and termination is time consuming |
| **Static threads** | pool created up front, allocated work, do not terminate until cleanup | better performance | potential waste of system resources |

"Waste of system resources" is the pool sitting idle while holding its stacks and
scheduler slots. On a shared machine that is a real cost; on a node you own for the
duration, static wins nearly always.

*§2.4.3 adds* two points. In shared memory, variables are **shared** (any thread can read or
write them) or **private** (normally one thread), and communication goes through shared
variables, so it is implicit. And the book prefers static threads partly because the
paradigm is close to how distributed-memory programs are written, so one mindset carries
over to the other.

## Nondeterminism

The setup on slide 6:

```c
...
printf("Thread %d: my_val = %d\n", my_rank, my_x);
...
```

executed by several threads. The deck shows two possible outputs side by side, differing
only in which thread's line lands first. Nothing is wrong, and nothing is fixable: the
**order of output is not determined by the program.**

That is benign. Slide 7 gives the version that is not:

- **Race condition** - the result depends on the interleaving.
- **Critical section** - the region that must not be entered by two threads at once.
- **Mutual exclusion** - the property you need over that region.
- Enforced with **locks**: mutex, semaphore, and so on.

```c
my_val = Compute_val(my_rank);
Lock(&add_my_val_lock);
x += my_val;
Unlock(&add_my_val_lock);
```

`x += my_val` is the critical section because it is *three* operations - load `x`, add,
store `x` - and a second thread can load between the first thread's load and store. Both
then write back a value computed from the same starting point, and one update vanishes.

*§2.4.3 works it with numbers:* `x` starts at 0, thread 0 computes 7 and thread 1 computes
19, and in the book's schedule both load 0, so the final store leaves `x = 19` instead of
26. Step it yourself below: "The book's order" replays that schedule, and the count at the
bottom comes from trying every interleaving.

```artifact src=demos/race-stepper.jsx
```

The book's vocabulary for the fix: an update is **atomic** if, once a thread finishes it, it
looks as if no other thread modified the location in between. A **mutex** (lock) has
hardware support; while one thread owns it, others calling `Lock` wait. The lock imposes no
order - either thread may go first - and it **serializes** the critical section, so keep
critical sections few and short. Alternatives: busy-waiting (below), **semaphores** (similar
to mutexes, easier for some kinds of synchronization) and **monitors** (objects whose
methods only one thread can run at a time).

## The question the deck poses and does not answer

Slide 8, titled "Important!!", asks two questions and moves on:

> What is the relationship between cache coherence and nondeterminism?
>
> Isn't cache coherence enough to ensure determinism?

**The answer, which is mine and not the slide's - confirm it against the recording.** No,
and the reason is that the two mechanisms are about different things:

- **Coherence** is a guarantee about a *single* location: all cores eventually agree on
  the value of `x`, and writes to `x` are seen in a single order. L3's snooping and
  directory protocols deliver exactly that.
- A race needs neither of those to be violated. `x += my_val` is a **read-modify-write**,
  and coherence says nothing about atomicity of a compound operation. Both threads may
  legally read a coherent `x = 5`, both compute 5 + their value, both write back. Every
  individual read and write was coherent; the update was still lost.

So coherence is necessary and nowhere near sufficient. It fixes *stale data*; mutual
exclusion fixes *interleaving*. Ordering **across** locations is a third thing again - the
memory consistency model - which this deck does not open.

## Busy-waiting

Slide 9, with the assumption that `ok_for_1` is shared and `my_rank`/`my_val` are private:

```c
ok_for_1 = false;
my_val = Compute_val(my_rank);
if (my_rank == 1)
    while (!ok_for_1);      /* busy-wait loop */
x += my_val;                /* critical section */
if (my_rank == 0)
    ok_for_1 = true;        /* let thread 1 update x */
```

> *What is wrong with the above piece of code?*

The slide leaves it as an exercise. Four things, roughly in order of how badly they bite:

1. **It only orders threads 0 and 1.** Every other thread falls straight through to
   `x += my_val` with no guard at all. With more than two threads the race is untouched -
   the code protects the one pair it happens to name.
2. **`ok_for_1 = false` is executed by every thread.** A thread arriving late can reset
   the flag *after* thread 0 has set it, and thread 1 spins forever.
3. **The compiler may defeat it.** `ok_for_1` is an ordinary variable the loop body never
   modifies, so the compiler is entitled to hoist the load out of the loop and spin on a
   register that never changes. This needs `volatile` or a proper atomic; coherence at the
   hardware level cannot help with a read the program never re-issues.
4. **Spinning burns a core.** Thread 1 occupies a processor doing nothing. Fine if the
   wait is a few hundred cycles and a core is free; wasteful otherwise, which is why locks
   that block exist.

## Thread safety

*§2.4.3, not on the slides.* Most serial functions are safe to call from threads, with a
notable C exception: functions with `static` local variables. Ordinary locals live on each
thread's own stack and are private, but a `static` local persists across calls and is
effectively **shared** by every thread that calls the function. `strtok` keeps the string
being split in a `static char*`, so if thread 1 starts splitting its string while thread 0
is partway through, thread 0's string is lost and it may get thread 1's substrings. Such a
function is **not thread safe**, and the usual cause is threads reaching shared data.

## Distributed memory: message passing

No shared address space, so communication becomes explicit:

```c
char message[100];
...
my_rank = Get_rank();
if (my_rank == 1) {
    sprintf(message, "Greetings from process 1");
    Send(message, MSG_CHAR, 100, 0);    /* 100 chars to process 0 */
} else if (my_rank == 0) {
    Receive(message, MSG_CHAR, 100, 1);
    printf("Process 0 > Received: %s\n", message);
}
```

Everything the shared-memory version left implicit is written down here: who sends, who
receives, how much, and to whom. That is the trade the deck then draws as a picture
(slide 12, sourced to Tim Mattson): **distributed memory takes more programmer effort up
front, shared memory less** - but shared memory hides the races that the explicit version
cannot have, because nothing is shared to race over.

Read it together with L3's `l + n/b`: a message costs latency once plus size over
bandwidth, which is why "reduce communication" in job 3 means *fewer* messages at least as
much as *smaller* ones.

*§2.4.4 fills in the rest:*

- The example is SPMD, and `message` names a different block of memory in each process.
- Distributed-memory APIs run on shared-memory hardware too; the programs start
  **processes**, because the nodes may run separate operating systems.
- `Send` may **block** until the matching `Receive` starts, or copy the message into its own
  storage and return. `Receive` usually blocks until the message arrives.
- APIs add **collectives**: a **broadcast** (one process sends the same data to all) and a
  **reduction** (results combined into one, for example summed). The standard API is
  **MPI**.
- Message passing is called "the assembly language of parallel programming": parallelizing
  usually means rewriting most of the program, data structures must be replicated or
  distributed explicitly, and the rewrite cannot be done piece by piece.

Two alternatives the book describes:

- **One-sided communication** (remote memory access): one process updates another's memory
  or reads from it, with no matching call. That saves synchronizing two processes and one
  function call, but the writer must know when it is safe to write and the reader when the
  value has arrived, which brings back synchronization or a flag to poll, and bugs are hard
  to trace.
- **PGAS** (partitioned global address space) languages give shared-memory syntax on
  distributed hardware, but let the programmer control where each part of a shared array
  lives, because a remote access can cost hundreds or thousands of times a local one.
  Private variables live in the local memory of the core running the process.

## Foster's methodology (PCAM)

Slide 13 is honest about the starting point: you have a serial program, you know you need
to divide work, balance load, synchronize and reduce communication, and **there is no
mechanical process** for getting there. What you do first is *profile* to find the
hotspots, then parallelize those. Ian Foster's framework, from *Designing and Building
Parallel Programs*, is the structure for the second half.

**1. Partitioning.** Divide the computation and the data into small independent tasks,
*disregarding any hardware limitations*. The focus is identifying what can run in
parallel - this step brings out the parallelism in the algorithm.

- Does the partition define at least an **order of magnitude more tasks than processors**?
  If not, the design may not be scalable.
- Does it avoid redundant computation and storage?
- Does the number of tasks **scale with problem size**? An increase in problem size should
  increase the *number* of tasks, not the size of each.
- Have you identified several alternative partitions?

**2. Communication.** Determine what communication the tasks need; they must coordinate,
share data, or synchronize to produce a correct global result.

- Do all tasks perform about the same number of communication operations? Unbalanced
  communication suggests a nonscalable construct.
- Does each task communicate with only a **small number of neighbors**? If it must talk to
  many, look for a local structure that expresses the same global communication.
- Can the communication operations proceed **concurrently**? If not, expect inefficiency.

**3. Agglomeration.** Combine tasks and their communications into larger tasks. If A must
run before B, it may make sense to fuse them.

- Has agglomeration reduced communication cost by **increasing locality**?
- Have you explored replicating data or computation to cut communication, and weighed the
  cost?
- Has it hurt **load balancing**? Check several alternatives.

**4. Mapping.** Assign the composite tasks to processes/threads so that communication is
minimized and each gets roughly the same amount of work. The mechanisms are the ones
already named - dynamic threads, static threads, or **SPMD** - plus the structural choice:
one process with several threads, several processes with one thread each, or several with
several.

The split worth memorizing, from slide 23:

| Stage | Concern |
|---|---|
| **P** and **C** | machine-**independent**: concurrency and scalability |
| **A** and **M** | machine-**dependent**: tweak for the underlying hardware |

That is why partitioning is told to ignore hardware. Hardware enters at agglomeration, and
not before.

## The histogram example

Twenty measurements, and the serial program is four lines:

```c
int bin = 0;
for (i = 0; i < data_count; i++) {
    bin = find_bin(data[i], ...);
    bin_counts[bin]++;
}
```

Inputs: `data_count`, the `data` array, `min_meas`, `max_meas`, `bin_count`. Outputs:
`bin_maxes` (upper bound of each bin) and `bin_counts`. For the deck's data with
`data_count = 20`, `min_meas = 0.3`, `max_meas = 4.9`, `bin_count = 5`, the bins come out
`bin_maxes = [0.9, 1.7, 2.9, 3.9, 4.9]` and `bin_counts = [6, 3, 2, 3, 6]`.

**A boundary detail the deck and the book settle differently.** Six of the twenty values
(0.9, 1.7, 2.9, 3.9 and both 4.9s) sit exactly on a bin edge, so `Find_bin` has to decide
which side an edge belongs to. The deck's counts come out only if each bin *includes* its
upper bound (0.9 goes in bin 0). The book (§2.7.1) uses the opposite rule,
`bin_maxes[b-1] <= x < bin_maxes[b]`, and on this data that gives `[5, 3, 2, 3, 5]` with
the two 4.9s in no bin at all, since they equal `max_meas`. Neither is wrong, but the rule
has to be stated, and the last bin has to include `max_meas` either way.

**First partition (slide 31).** One `Find_bin` task per element, one increment task per
bin, and an arrow from each element to the bin it lands in:

```artifact src=demos/histogram-first-partition.jsx static
```

The partition is fine and the communication is the problem: **many `Find_bin` tasks
converge on one increment task**, so every shared bin is a critical section. The
communication checklist flags it directly - each task does not communicate with a small
number of neighbors, and the increments cannot proceed concurrently.

*§2.7.1 on when this partition is the right one:* on a GPU, whose thousands of threads
could not each afford a private copy of the counts, the book keeps it and makes each
increment an **atomic** operation, which GPUs implement fast.

**Alternative partition (slide 32).** Give each thread a **local** count array, and add a
second layer:

```artifact src=demos/histogram-local-arrays.jsx static
```

Now the contended increment is gone: each thread increments only its own array, and the
global array is touched once per thread per bin at the end. This is agglomeration doing its
job - replicating data (`bin_count` extra integers per thread) to buy locality, which is
exactly the second agglomeration checklist item.

**Adding the local arrays (slide 33).** The merge is drawn as a binary tree over eight
threads: 1 into 0, 3 into 2, 5 into 4, 7 into 6; then 2 into 0 and 6 into 4; then 4 into 0.
Three rounds rather than seven sequential additions - $\lceil \log_2 p \rceil$ rounds for
$p$ threads, and the halving is why the final reduction does not become the new bottleneck.

```artifact src=demos/local-array-tree.jsx math
```

*§2.7.1* treats the tree as one of three options for this last step: with few threads and
few bins, one thread does all the additions; with many more bins than threads, the bins are
divided among the threads the way the data was; the tree is for many threads.

## Conclusions

The deck closes on the four stages - partition, determine communication, aggregate if
needed, map - and one piece of advice:

> It is better to spend time considering alternative algorithms rather than just
> implementing the first thing that comes to mind.

The histogram is the argument for it in miniature. Both partitions are correct. The first
one serializes on the bins and the second one does not, and the difference was found by
running the checklist, not by writing code.
