---
title: Linked Lists and Bitwise Operators
date: 2025-09-25/30
---

## Bitwise operators in C

Integer values are stored as bits. Bitwise operators operate on each bit position.

Assume 8-bit examples for clarity.

### AND `&`

- Result bit is 1 only if both input bits are 1.

Example:

- $00000111_2 \quad \\& \quad 00000100_2 = 00000100_2$

Truth table:

- $0 \\& 0 = 0$
- $0 \\& 1 = 0$
- $1 \\& 0 = 0$
- $1 \\& 1 = 1$

Typical uses:

- Masking to zero out some bits.
- Testing whether specific bits are set.

### OR `|`

- Result bit is 1 if at least one input bit is 1.

Example:

- $00000111_2 \mid 00000100_2 = 00000111_2$

### XOR `^`

- Result bit is 1 if the input bits are different.

Truth table:

- $0 \oplus 0 = 0$
- $0 \oplus 1 = 1$
- $1 \oplus 0 = 1$
- $1 \oplus 1 = 0$

> Using $\oplus$ here means XOR.

Typical uses:

- Flipping bits under a mask.
- Simple parity or checksum calculations.
- Toy "encryption" where the same key applied twice recovers the original.

### NOT `~`

- Flips every bit (0 becomes 1 and 1 becomes 0).

If we consider 8 bits, then

- $\sim 00000101_2 = 11111010_2.$

In two's complement, this is closely related to negation: $-x = \sim x + 1$.

### Shift operators `<<` and `>>`

- `x << k` shifts bits of `x` left by $k$ positions (fills with zeros on the right).
- `x >> k` shifts bits right. For unsigned values this fills with zeros on the left; for signed values it may copy the sign bit.

Shifting left by $k$ is equivalent to multiplying by $2^k$ when there is no overflow.

Example:

- $00000101_2 << 1 = 00001010_2$ which is $5$ shifted to $10$.

## Linked lists in C

A linked list is a dynamic data structure built from nodes that point to one another.

### Node (cell) structure

A typical definition:

```c
typedef struct cell {
    int value;           // data
    struct cell *next;   // pointer to next node
} CELL;
```

- `value` stores the payload.
- `next` points to the next node, or is `NULL` at the end of the list.

The list as a whole is represented by a pointer to the first node, often called `head`:

```c
CELL *head = NULL;   // empty list
```

### Adding nodes at the front

This operation runs in constant time.

Steps:

1. Allocate a new node.
2. Fill its `value`.
3. Set its `next` to the current `head`.
4. Update `head` to point to the new node.

Example implementation:

```c
void add_to_front(int v) {
    CELL *p = malloc(sizeof(CELL));
    if (p == NULL) {
        // handle allocation failure
        return;
    }
    p->value = v;
    p->next = head;
    head = p;
}
```

After successive calls, the most recently added element appears at the front of the list.

### Adding nodes at the end

This operation is linear in the list length if you do not keep a tail pointer.

Steps:

1. Allocate a new node with `value = v` and `next = NULL`.
2. If the list is empty, set `head` to the new node.
3. Otherwise, traverse from `head` until you reach the last node.
4. Set the last node's `next` to the new node.

Key traversal pattern:

```c
CELL *q = head;
while (q->next != NULL) {
    q = q->next;
}
q->next = p;
```

The condition `q->next != NULL` ensures you stop at the last node, where you can safely modify `next`.

### Traversing and printing

You typically use a local pointer so you do not lose the head:

```c
void print_list(CELL *head) {
    CELL *current = head;
    while (current != NULL) {
        printf("%d ", current->value);
        current = current->next;
    }
    printf("\n");
}
```

### Common linked list mistakes

- Overwriting `head` while traversing, then losing access to the list.
- Forgetting to initialize `next` for new nodes.
- Failing to `free` nodes eventually, causing memory leaks.
