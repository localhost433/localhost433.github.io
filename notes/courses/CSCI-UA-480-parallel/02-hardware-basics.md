---
title: "2 - Parallel Hardware: Basics"
date: "2026-09-08"
---

*Reading: Pacheco & Malensek §2.1-2.2. The schedule note for this lecture: "Now is a good
time to review what you learned about caches in CSO" - see
[CSO 09](note.html?course=CSCI-UA-201&note=09-func-cache) and
[CSO 10](note.html?course=CSCI-UA-201&note=10-cache-perf).*

*The slides skip most of §2.2, and homework answers may come from the slides or the
assigned reading. The lecture's own argument comes first; the reading-only material (the
von Neumann bottleneck, caches, virtual memory, the pipeline arithmetic) is collected in
[From the reading](#from-the-reading) at the end. Paragraphs that mix the two name their
section.*

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
L3 makes this explicit, and the book draws the same line (§2.3): it counts as *parallel
hardware* only what the programmer can see, meaning code has to change to exploit it, so
pipelining and multiple issue are treated as extensions of the von Neumann model rather
than as parallel hardware.

## Hardware multithreading

*§2.2.6.* ILP runs out on dependent code; the book's example is
`f[i] = f[i-1] + f[i-2]`, where no two iterations can overlap. **Thread-level parallelism**
(TLP) instead keeps the core busy with a different thread when the current one stalls, which
needs thread switching to be very fast. Three schemes:

| Scheme | When it switches | Upside | Downside |
|---|---|---|---|
| **Fine-grained** | after each instruction, skipping stalled threads | stalls get hidden | a thread with a long run of ready instructions waits for its turn on every one |
| **Coarse-grained** | only when a thread stalls on something slow, such as a load from main memory | switching need not be instantaneous | the core idles on short stalls, and each switch costs time |
| **Simultaneous (SMT)** | a variant of fine-grained: several threads issue into the superscalar core's functional units in the same cycle | uses the superscalar width | thread slowdown, eased by giving "preferred" threads priority |

The figure below runs all of them on the same four threads. **One liberty, mine and not the
book's:** on a core that can issue four instructions per cycle, "switch after each
instruction" becomes "switch after each cycle", which is how the standard textbook picture
of these schemes draws it; on a single-issue pipeline the two are the same thing.

```artifact src=demos/issue-slots.jsx
```

Three things to read off it:

1. **Two kinds of unused slot.** A whole empty cycle means every thread the core can use is
   stalled; a slot left over in a busy cycle means the thread that issued ran out of
   independent instructions. Fine-grained and coarse-grained multithreading only fill empty
   cycles, and with four threads they actually leave *more* slots over (12 for superscalar,
   22 for fine-grained), because the threads they switch in rarely have four instructions
   ready. SMT is the only scheme that can shrink both, since it is the only one that takes
   instructions from several threads in the same cycle; with four threads it does (9 left
   over), while with two the outlines stay about level.
2. **Threads per cycle.** SMT is the only scheme with more than one thread in a column,
   which is what "hyperthreading executes several threads at the same time" means in HW1's
   terms.
3. **One thread.** At one thread every grid is the superscalar grid: hardware
   multithreading does nothing for a program that has only one thread to give it, which is
   this lecture's dividing line again.

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

*§2.1.2 adds:* threads of one process share its executable, memory and I/O devices; each
needs only its own **program counter** and its own **call stack**. That is why switching
between threads is much faster than switching between processes ("lighter weight"). A
thread **forks** off the process when it starts and **joins** it when it ends.

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

## From the reading

Material from §2.1-2.2 that the slides leave out or hand to CSO. It is part of the
assigned reading, so it is fair game for homework.

### The von Neumann bottleneck

*§2.1.1.* The classical machine is main memory, a CPU (control unit plus datapath, with
registers and a program counter), and an interconnect between them, traditionally a bus.
It executes one instruction at a time on a few pieces of data. The separation of memory and
CPU is the **von Neumann bottleneck**: the interconnect limits how fast instructions and
data arrive, and in 2021 CPUs could execute instructions more than a hundred times faster
than they could fetch from main memory. The book's analogy is a factory (the CPU) and a
warehouse (memory) joined by one two-lane road. Caching, virtual memory and low-level
parallelism are the three modifications §2.2 looks at, and the first two are aimed at that
road. It is the same gap L3 calls the memory wall.

### Caches

*§2.2.1-2.2.3; the schedule sends you to CSO for this.*

**Locality.** Programs tend to access locations near ones they just used (**spatial**
locality) and to reuse them soon (**temporal** locality). So memory is moved in **cache
lines**, blocks typically 8 to 16 times the size of one location: reading `z[0]` of a
`float` array can bring in `z[0]` through `z[15]`. Caches come in levels, L1 smallest and
fastest; the CPU checks L1, then L2, and so on, then main memory. A **hit** finds the data,
a **miss** does not, and a read miss can stall the processor until the line arrives.

**Writes.** After a write the cache and memory disagree. **Write-through** updates memory
at the same time; **write-back** marks the line **dirty** and writes it to memory only when
the line is evicted.

**Where a line goes.** With a 16-line memory and a 4-line cache (the book's Table 2.1):

| Scheme | Memory line $i$ may go to | Example: line 5 |
|---|---|---|
| Fully associative | any cache location | 0, 1, 2 or 3 |
| Direct mapped | exactly one location, $i \bmod 4$ | 1 |
| $n$-way set associative (here 2-way) | one of $n$ locations in set $i \bmod 2$ | 2 or 3 |

When there is a choice, the line to evict is usually the **least recently used** one.

**Why loop order matters.** C stores a 2D array in **row-major** order, row 0 then row 1.
The book's example is `y[i] += A[i][j]*x[j]` with the loops in two orders, `MAX = 4`, a
cache line holding one row of four `double`s, and a direct-mapped cache holding only two
lines. Looping `i` outside and `j` inside walks each row in order: **4 misses**, one per
row. Swapping the loops walks down columns, and every access touches a different row, and
rows 2 and 3 evict rows 0 and 1 before they are reused: **16 misses**, every access. At
`MAX = 1000` the book measured the first order at about three times faster. The programmer
never controls the cache directly, but controls this.

### Virtual memory

*§2.2.4.* Main memory acts as a cache for secondary storage. Programs are divided into
**pages** (commonly 4 to 16 KB) and compiled with **virtual** page numbers. At run time a
**page table** maps them to physical addresses, which also keeps programs from overwriting
each other. With 32-bit addresses and 4 KB pages, the low 12 bits ($2^{12} = 4096$) are
the byte offset and the rest is the virtual page number. Consulting the page table can
double the cost of a memory access, so a small, fast cache of page-table entries, the
**TLB** (typically 16 to 512 entries), handles most translations. A page that is not in
memory at all causes a **page fault**. Because disk is so slow, virtual memory is always
write-back, and the OS shares the management with the hardware.

### Pipelining and multiple issue

*§2.2.5.* The book's pipelining example is a floating-point adder split into seven stages
(fetch operands, compare exponents, shift, add, normalize, round, store). At 1 ns per stage,
1000 additions take 7000 ns unpipelined. Pipelined, the first result appears after 7 ns and
then one completes every nanosecond, for $7 + 999 = 1006$ ns: a speedup of about 6.96, not
7. In general $k$ stages do not give a $k$-fold speedup, because the pipeline runs at the
speed of its slowest stage and stalls when an operand is not ready.

**Multiple issue** replicates functional units instead. If they are scheduled at compile
time it is **static** multiple issue; at run time, **dynamic** multiple issue, which is what
*superscalar* means. Finding instructions to issue together relies on **speculation**:
guess the outcome of a branch (or that a pointer does not alias), execute on the guess, and
undo it if the guess was wrong. Hardware speculation keeps results in a buffer until the
guess is confirmed. Even when instructions execute out of order, current processors
**load and commit them in program order**. Optimizing compilers, however, may reorder
instructions, which will matter for shared-memory programs (see the busy-waiting example in
[L4](note.html?course=CSCI-UA-480-parallel&note=04-software-basics)).
