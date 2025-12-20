---
title: Arrays, Pointers, and Dynamic Memory
date: 2025-09-16/18/23
---

## Stack vs heap memory

C programs use two main regions for ordinary data.

### Stack

- Used for local variables inside functions.
- Memory is allocated and freed automatically when functions are called and return.
- Very fast and structured like a stack of frames.
- Limited total size.

Example:

```c
void f(void) {
    int x = 10;    // x lives on the stack
}
```

When `f` returns, its stack frame (and `x`) disappears.

### Heap

- Used for dynamically allocated objects via `malloc`, `calloc`, `realloc`.
- Memory persists until it is explicitly freed.
- Can hold large data structures.
- Access is slightly slower and management is manual.

Example:

```c
void g(void) {
    int *p = malloc(sizeof(int));  // p lives on the stack, *p on the heap
    if (p != NULL) {
        *p = 20;
        free(p);
        p = NULL;                 // avoid dangling pointer
    }
}
```

## Arrays in C

### Traditional (static) arrays

- Fixed size known at compile time or at function entry.
- Usually allocated on the stack when they are local variables.

Example:

```c
int a[3] = {10, 20, 30};
```

Access is by index or via pointer arithmetic:

- `a[0]` is the first element.
- `*a` is the same as `a[0]`.
- `*(a + 1)` is the same as `a[1]`.

Memory layout for `int a[3] = {10, 20, 30};` might be:

- Address: `0xf0`, `0xf4`, `0xf8`
- Values: `10`, `20`, `30`

So `a` points at `0xf0`, and `*(a + 2)` reads the element at `0xf8`.

### Dynamic arrays

Dynamic arrays are allocated on the heap using pointers.

Example:

```c
int *a = malloc(3 * sizeof(int));
if (a == NULL) {
    // handle allocation failure
}
a[0] = 10;
a[1] = 20;
a[2] = 30;

// resize to 4 elements
int *tmp = realloc(a, 4 * sizeof(int));
if (tmp == NULL) {
    // handle reallocation failure
    free(a);
    return;
}
a = tmp;
a[3] = 40;

free(a);
a = NULL;
```

Key points:

- You must check whether `malloc` and `realloc` return `NULL`.
- You must eventually `free` any block allocated on the heap.
- After `free`, set the pointer to `NULL` to avoid dangling references.

### 2D arrays

For a fixed-size 2D array:

```c
int a[2][2] = {{10, 20}, {40, 50}};
```

- `a[0][0]` is the first row, first column (10).
- `a[1][1]` is the second row, second column (50).

Memory is still one linear block:

- `a[0][0]`, `a[0][1]`, `a[1][0]`, `a[1][1]` appear in order.

Pointer expressions such as `*(*(a + 1))` also access `a[1][0]`.

## Pointer fundamentals

A pointer variable holds a memory address.

Example:

```c
char x = 5;
char *p = &x;   // p points to x
printf("%d\n", *p);   // prints 5
```

- `p` lives on the stack.
- `*p` refers to the value stored at the address stored in `p`.

With dynamic allocation:

```c
char *q = malloc(sizeof(char));
if (q != NULL) {
    *q = 7;
    printf("%d\n", *q);   // prints 7
    free(q);
    q = NULL;
}
```

### Common pointer mistakes

- Forgetting to `free` dynamically allocated memory leads to leaks.
- Using a pointer after `free` leads to a dangling pointer.
- Not initializing pointers before use leads to undefined behavior.

## Traditional vs dynamic arrays summary

| Feature            | Traditional array     | Dynamic array           |
|--------------------|----------------------|-------------------------|
| Declaration        | `int a[3];`          | `int *a;` then `malloc` |
| Storage location   | Usually stack        | Heap                    |
| Size               | Fixed                | Chosen at runtime       |
| Lifetime           | Function scope       | Until `free`           |
| Management         | Automatic            | Manual                  |
| Typical use        | Small fixed buffers  | Large or resizable data |
