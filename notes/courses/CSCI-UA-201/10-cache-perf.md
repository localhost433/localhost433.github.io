---
title: Cache Organization and Performance
date: 2025-11-11/18
---

## Why caches are needed

The CPU is much faster than main memory. To reduce waiting time, systems use several levels of cache between the CPU and RAM.

The core problem: CPUs can execute instructions in sub-nanoseconds, but RAM can take 100+ CPU cycles to respond. Without cache, CPUs would spend most of their time stalled waiting for memory.

Approximate access costs:

- CPU operation: ~0.5 ns
- L1 cache access: 1-3 cycles (~1-2 ns)
- L2 cache access: 10-20 cycles (~5-10 ns)
- RAM access: 100-500 cycles (~50-250 ns)
- Hard disk: ~5-10 ms (orders of magnitude slower)

### Principles of locality

Caches work because typical programs reuse data in predictable patterns:

- **Temporal locality (time):** if data is accessed now, it is likely accessed again soon (loop counters, stack variables, repeated function calls).
- **Spatial locality (space):** if address `X` is accessed, nearby addresses `X+1, X+2, ...` are likely accessed soon (array traversal, sequential instruction execution).

Caches exploit temporal and spatial locality to keep useful data close to the processor.

## Address decomposition

A memory address is divided into three fields:

- `TAG` bits: identify which memory block is currently stored.
- `INDEX` bits: select a cache line or set.
- `OFFSET` bits: select a byte within a block.

You can visualize the split as:

- `[ TAG | INDEX | OFFSET ]`

If

- the block size is `B` bytes,
- the cache has `L` lines (direct mapped) or `S` sets (set associative),
- the machine uses `A`-bit addresses,

then:

- number of offset bits = `log2(B)`
- number of index bits = `log2(L)` (direct-mapped) or `log2(S)` (set-associative)
- number of tag bits = `A - index_bits - offset_bits`
- (sanity check) `tag_bits + index_bits + offset_bits = A`

Step-by-step process:

1. Determine offset bits: `log2(block size)`
2. Determine index bits: `log2(# lines)` or `log2(# sets)`
3. Determine tag bits: `address width - index_bits - offset_bits`
4. Verify the bits add up

Example:

- 32-bit addresses,
- 128-line direct-mapped cache,
- 64-byte blocks.

Then:

- offset bits = `log2(64) = 6`,
- index bits = `log2(128) = 7`,
- tag bits = `32 - 7 - 6 = 19`.

The address fields `[TAG | INDEX | OFFSET]` are used during every cache lookup.

## Cache line contents

Each cache line stores:

- a valid bit `V`,
- the tag bits,
- a data block (for example 32, 64, or 128 bytes),
- possibly a dirty bit `D` (for write-back caches),
- sometimes a reference bit `R` (for replacement policies).

Often shown as:

- `[ V bit | Tag | Data Block | D bit | R bit ]`

Lookup procedure:

1. Extract fields from the address (tag, index, offset).
2. Use the index bits to locate the correct line (direct-mapped) or set (set-associative).
3. Check the valid bit.
   - If `V = 0`: automatic miss (line is invalid).
4. Compare tags.
   - If `V = 1` and tags match: hit.
   - Otherwise: miss.
5. On a hit, use the offset to read or write the correct bytes.
6. On a miss, fetch the block from the next memory level, update the cache line, then retry/return data.

## Direct-mapped vs set-associative caches

### Direct-mapped

- Each block of memory can map to exactly one cache line.
- Cache is simple and fast.
- Conflict misses can be bad if multiple active blocks map to the same index.

### Set-associative

- Cache lines are grouped into sets.
- Each address maps to exactly one set but can be stored in any line within that set.
- For `N`-way associativity, each set has `N` ways.

Why this helps: it reduces conflict misses by giving each block multiple candidate slots (the `N` ways) within its indexed set, instead of exactly one slot.

Relationship:

- total blocks = cache size / block size,
- number of sets = total blocks / number of ways.

In set-associative caches, the index selects a *set* (not a single line), and then the cache checks all ways in that set (in parallel hardware comparisons).

Example:

- 2 KB cache, 4-way set associative, 32-byte blocks, 16-bit addresses.

Then:

- total blocks = `2048 / 32 = 64`,
- sets = `64 / 4 = 16`,
- offset bits = `log2(32) = 5`,
- index bits = `log2(16) = 4`,
- tag bits = `16 - 4 - 5 = 7`.

Higher associativity reduces conflict misses but increases hardware cost and hit time.

Costs of higher associativity include extra tag comparators and more complex replacement, with diminishing returns beyond moderate associativity (often beyond ~8-16 ways).

Fully associative caches have just one set; any block can go anywhere, so there are no conflict misses but hardware is expensive.

## Replacement policies

When a miss occurs and the target set is full, the cache must choose which line to evict.

Goal: minimize future cache misses, while making the decision quickly (replacement must not slow down the cache).

### Priority-based replacement policy (using `V`, `R`, `D`)

In recitation, replacement is described as a strict priority order based on `V` (valid), `R` (reference / recently used), and `D` (dirty):

1. **Invalid block (`V = 0`)**
   - best choice, overwrite with zero penalty (it is “garbage”)
2. **Not recently used and clean (`R = 0`, `D = 0`)**
   - ideal: unlikely to be needed soon, and no write-back needed
3. **Not recently used and dirty (`R = 0`, `D = 1`)**
   - acceptable: unlikely to be needed soon, but eviction must write back
4. **Recently used and clean (`R = 1`, `D = 0`)**
   - last resort: likely needed again (temporal locality), but at least clean
5. **Random selection**
   - tie-breaker when candidates are indistinguishable under available bits

Intuition of the priority:

- Temporal locality wins first: prefer evicting `R = 0` over `R = 1` (avoid immediate re-misses).
- Within the same `R`, prefer evicting `D = 0` over `D = 1` (avoid write-back delay).

Common policies:

- **LRU (least recently used)**: evict the block that has not been used for the longest time.
- **FIFO (first in, first out)**: evict the oldest block in the set.
- **Random**: choose a block to evict at random.

Implementations often approximate LRU for performance reasons.

## Write policies

### Write hit policies

On a write that hits in the cache:

- **Write-through**:
  - Update both cache and memory.
  - Simple and keeps memory consistent.
  - Increases memory traffic and latency.
  - Optimization: use a **write buffer** so the CPU can queue memory writes and continue execution.
- **Write-back**:
  - Update only the cache and set the dirty bit.
  - Memory is updated later, when the line is evicted.
  - Reduces memory traffic and can be faster.
  - Requires keeping track of dirty lines.

### Write miss policies

On a write that misses in the cache:

- **Write-allocate**:
  - Load the block into the cache, then perform the write.
  - Works well with write-back and spatial locality.
- **No-write-allocate**:
  - Write directly to memory without bringing the block into the cache.
  - Often combined with write-through.

### Common policy combinations

- **Write-through + no-write-allocate**: simple, consistent, avoids cache pollution for write-once data.
- **Write-back + write-allocate**: high-performance, exploits locality (treats write misses like read misses).

## Performance metrics

Let

- `T_hit` be the hit time,
- `T_miss` be the miss penalty,
- `p_miss` be the miss rate.

The average memory access time (AMAT) is

$$
\text{AMAT} = T_\text{hit} + p_\text{miss} T_\text{miss}.
$$

Interpretation: most accesses are fast hits, but even a small miss rate can dominate because `T_miss` is huge compared to `T_hit`.

### Multi-level AMAT (cache hierarchy)

Two levels (L1 then L2 then RAM):

$$
\text{AMAT} = T_{\text{hit},1} + p_{\text{miss},1}\Bigl(T_{\text{hit},2} + p_{\text{miss},2}\,T_{\text{penalty}}\Bigr).
$$

Three levels (L1 then L2 then L3 then RAM):

$$
\text{AMAT}= T_{\text{hit},1} + p_{\text{miss},1}\Bigl( T_{\text{hit},2} + p_{\text{miss},2}\bigl(T_{\text{hit},3} + p_{\text{miss},3}\,T_{\text{penalty}} \bigr)
\Bigr)
$$

Reducing miss rate, hit time, or miss penalty all help performance, but often trade off against each other and against hardware cost.

Designing caches is about balancing:

- size (capacity),
- associativity,
- block size,
- replacement policy,
- write policy,

to get good performance on typical workloads.
