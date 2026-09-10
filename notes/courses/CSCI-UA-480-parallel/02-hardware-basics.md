---
title: "2 - Parallel Hardware: Basics"
date: "2026-09-08"
---

*Reading: Pacheco & Malensek §2.1-2.2. The schedule note for this lecture: "Now is a good
time to review what you learned about caches in CSO" - see
[CSO 09](note.html?course=CSCI-UA-201&note=09-func-cache) and
[CSO 10](note.html?course=CSCI-UA-201&note=10-cache-perf).*

## Where the hardware came from

The lecture is mostly a history, but the history is the argument: each generation added a
different *kind* of parallelism, and the fourth one is where the programmer starts having
to participate.

| Machine | Year | Notable |
|---|---|---|
| ENIAC (Eckert & Mauchly) | 1946 | first working electronic computer; 18,000 vacuum tubes, 1,800 instructions/sec, 3,000 ft³; reprogrammed by rearranging cords |
| EDSAC 1 (Wilkes, from von Neumann's concept) | 1949 | first **stored-program** computer; 650 instructions/sec, 1,400 ft³ |
| UNIVAC | 1950s | 2nd generation - transistors (invented 1947) replace vacuum tubes |
| - | 1960s | 3rd generation - integrated circuits; hundreds, then thousands, then millions, then billions of transistors per IC |

Note the direction of the ENIAC → EDSAC step: reprogramming stopped being a hardware
operation and became a data operation. Everything after is scaling.

| Processor | Year | Transistors | Area | Clock | First to... |
|---|---|---|---|---|---|
| Intel 4004 | 1970 | 2,250 | 12 mm² | 108 KHz | be a microprocessor |
| Intel 8086 | 1979 | 29,000 | 33 mm² | 5 MHz | define the basic IA32 architecture |
| Intel 80486 | 1989 | 1,200,000 | 81 mm² | 25 MHz | pipeline IA32; carry on-chip cache |
| Pentium | 1993 | 3,100,000 | 296 mm² | 60 MHz | be a superscalar IA32 |
| Pentium 4 | - | - | - | - | be the **last single-core** |

And where it landed: AMD Threadripper (32 cores), IBM Power10 (15-30), Intel Xeon (28),
Apple M5 Max (18-core CPU, up to 40-core GPU, 16-core Neural Engine, up to 614 GB/s memory
bandwidth), Intel Panther Lake (Core Ultra Series 3 mobile).

## The four generations of architecture

| Gen | Era | Mechanism | Kind of parallelism |
|---|---|---|---|
| 1st | 1970s | single-cycle implementation | none |
| 2nd | 1980s | pipelining | **temporal** |
| 3rd | 1990s | superscalar / ILP | **spatial** |
| 4th | 2000s | simultaneous multithreading | across threads |

**2nd - pipelining.** The hardware is divided into stages (fetch, decode, issue, execute,
commit), and the number of stages grows each generation. Minimum CPI (cycles per
instruction) is 1. In many cases CPI exceeds 1, because of conditional branches and because
of dependencies among instructions - an instruction must wait for another's result.

*Enhancements alongside:* cache memory, virtual memory, multi-level caches, the TLB.

**3rd - instruction-level parallelism.** Executing several instructions at once is
**superscalar** capability, and performance is now measured as instructions *per* cycle
(IPC) rather than cycles per instruction. **Speculative execution** - predicting branch
direction - is introduced to keep the superscalar width fed, and it lets some instructions
execute **out of order**.

**4th - simultaneous multithreading** (Intel's hyperthreading). Double or triple some
pipeline resources so several programs occupy the pipeline at once, which uses the
execution resources better.

The break between the third and fourth rows is the one to hold onto. Pipelining,
superscalar, out-of-order and speculation all extract parallelism the programmer never
wrote; SMT is the first that needs more than one thread to exist before it does anything.
L3 makes this explicit.

## Processes, multitasking, threads

**Process** - an instance of a program being executed. Its components:

- the executable machine language program
- a block of memory
- descriptors of the resources the OS has allocated to it
- security information
- information about its state

**Multitasking** - the illusion that a single-processor system runs multiple programs
simultaneously. Each process takes a turn (a time slice) and then waits for another. With
several cores, a few processes genuinely run in parallel.

**Threading** - threads live inside processes and let a program be divided into more or
less independent tasks. The hope is that when one thread blocks waiting on a resource,
another has work to do.

So: several processes run multitasked, and each process may consist of several threads.
Multitasking is a scheduling illusion on one core and real parallelism on several; the
distinction is worth keeping straight because "concurrent" and "parallel" are not the same
claim.

## The status quo

- We moved from single core to multicore for the technological reasons in
  [L1](note.html?course=CSCI-UA-480-parallel&note=01-why-parallel).
- The free lunch is over: software will not get faster by itself with each new processor
  generation.
- There is not enough experience in parallel programming. Parallel programs used to be
  restricted to a few elite applications with very few programmers; now many different
  applications need them.

## How advances happen

A three-way loop rather than a chain (slide 26): the **software community** supplies wishes
(performance) and restrictions, **computer architecture** supplies design, and **process
technology** supplies restrictions and capabilities. Each constrains the other two.

## What to retain from L2

| Topic | Key point |
|---|---|
| ENIAC → EDSAC | the stored-program concept: reprogramming becomes data, not rewiring |
| 80486 | first pipelined IA32 and first with on-chip cache |
| Pentium | first superscalar IA32 |
| Pentium 4 | the last single-core processor |
| Pipelining | temporal parallelism; min CPI = 1; CPI > 1 from branches and dependencies |
| Superscalar | spatial parallelism; measured in IPC, not CPI |
| Speculative execution | branch prediction feeding superscalar width; enables out-of-order |
| SMT / hyperthreading | duplicate pipeline resources to host several programs at once |
| The dividing line | everything before SMT is invisible to the programmer; SMT needs threads to exist |
| Process | program instance + memory + OS resource descriptors + security info + state |
| Multitasking vs. threading | time-sliced processes vs. independent tasks inside one process |
| Driver of evolution | exploiting parallelism, and dealing with memory latency and capacity |
