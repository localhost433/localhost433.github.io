---
title: Cache Organization and Performance
date:
---

## Why caches are needed

The CPU is much faster than main memory. To reduce waiting time, systems use several levels of cache between the CPU and RAM.

Approximate access costs:

- CPU operation: on the order of 1 cycle.
- L1 cache: a few cycles.
- L2 cache: tens of cycles.
- RAM: hundreds of cycles.
- Disk: millions of cycles.

Caches exploit temporal and spatial locality to keep useful data close to the processor.

## Address decomposition

A memory address is divided into three fields:

- `TAG` bits: identify which memory block is currently stored.
- `INDEX` bits: select a cache line or set.
- `OFFSET` bits: select a byte within a block.

If

- the block size is `B` bytes,
- the cache has `L` lines (direct mapped) or `S` sets (set associative),
- the machine uses `A`-bit addresses,

then:

- number of offset bits = `log2(B)`,
- number of index bits = `log2(L)` or `log2(S)`,
- number of tag bits = `A - index_bits - offset_bits`.

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

Lookup procedure:

1. Use the index bits to locate the correct line or set.
2. Check the valid bit.
3. Compare tags.
   - If valid and tags match: hit.
   - Otherwise: miss.
4. On a hit, use the offset to read or write the correct bytes.

## Direct-mapped vs set-associative caches

### Direct-mapped

- Each block of memory can map to exactly one cache line.
- Cache is simple and fast.
- Conflict misses can be bad if multiple active blocks map to the same index.

### Set-associative

- Cache lines are grouped into sets.
- Each address maps to exactly one set but can be stored in any line within that set.
- For `N`-way associativity, each set has `N` ways.

Relationship:

- total blocks = cache size / block size,
- number of sets = total blocks / number of ways.

Example:

- 2 KB cache, 4-way set associative, 32-byte blocks, 16-bit addresses.

Then:

- total blocks = `2048 / 32 = 64`,
- sets = `64 / 4 = 16`,
- offset bits = `log2(32) = 5`,
- index bits = `log2(16) = 4`,
- tag bits = `16 - 4 - 5 = 7`.

Higher associativity reduces conflict misses but increases hardware cost and hit time.

Fully associative caches have just one set; any block can go anywhere, so there are no conflict misses but hardware is expensive.

## Replacement policies

When a miss occurs and the target set is full, the cache must choose which line to evict.

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

## Performance metrics

Let

- `T_hit` be the hit time,
- `T_miss` be the miss penalty,
- `p_miss` be the miss rate.

The average memory access time (AMAT) is

$$
\text{AMAT} = T_\text{hit} + p_\text{miss} T_\text{miss}.
$$

Reducing miss rate, hit time, or miss penalty all help performance, but often trade off against each other and against hardware cost.

Designing caches is about balancing:

- size (capacity),
- associativity,
- block size,
- replacement policy,
- write policy,

to get good performance on typical workloads.
