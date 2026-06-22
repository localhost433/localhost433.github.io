---
title: Pointers, References & Memory
date: "2026-05-18/20"
---

## Pointers and references: a first look

Every variable has a value *and* an address. C++ gives you three ways to work with them:

```cpp
char x = 5;
char* p = &x;   // pointer: holds the ADDRESS of x   (&  = address-of)
char& v = x;    // reference: an ALIAS for x

cout << x;      // 5
cout << p;      // 0xfA...  (the address)
cout << *p;     // 5        (* = dereference: value at the address)
cout << v;      // 5        (v is just another name for x)
```

### Passing parameters

How you declare a parameter decides whether the function can change the caller's variable:

```cpp
void inc(int x)  { x = x + 1; }   // by value:     caller's copy unchanged
void inc(int* x) { *x = *x + 1; } // by pointer:   caller's variable changes
void inc(int& x) { x = x + 1; }   // by reference: caller's variable changes

int a = 5;
inc(a);    // by value     -> a is still 5
inc(&a);   // by pointer   -> a is 6
inc(a);    // by reference -> a is 7
```

- **By value** copies the argument -- safe but the original is untouched.
- **By pointer** / **by reference** let the function modify the caller's data; references give the cleaner syntax. We dig into the memory model below.

## Variables: C++ vs. Java

- Java has **two** kinds of variables: primitives and object references. It uses pointers *implicitly* (every object is reached through a reference).
- C++ makes **no such distinction**. Any kind of variable can:
  - live on the stack,
  - have a reference (an alias), and
  - have a pointer (a variable that holds its address).

```cpp
int x = 5;
int* p = &x;   // pointer  -> holds the address of x
int& r = x;    // reference -> another name for x
```

A reference is *another name* for the same storage -- not a new object -- while a pointer is its own object holding an address. Read the three declarations side by side -- the highlight marks the storage each one *introduces*, so the reference lights up nothing while the pointer grows a cell of its own:

```artifact src=demos/mem-reference-compare.jsx static
```

## Pointers and the regions of memory

A pointer holds a memory address. What it points *at* can live in different regions:

- **Stack** -- local variables; allocated/freed automatically as functions enter/return.
- **Heap** -- memory you request at runtime with `new`.
- **Code / globals** -- fixed-location data and functions.

A pointer's size depends on the machine architecture (e.g., 8 bytes on a 64-bit CPU). The zero pointer is written `NULL` or, preferably, `nullptr` (the equivalent of Java's `null`).

A pointer is just a variable holding an address -- and that address can sit in **any** of the four segments, including the code segment (a *function pointer*). Step through each case on the textbook memory model:

```artifact src=demos/mem-segments.jsx
```

## Dynamic memory: the `new` operator

`new` allocates space **on the heap** and returns a pointer to it. Unlike Java, it works with *any* type, not just classes.

```cpp
string* s    = new string("sally");
string* ss   = new string[24];
int*    x    = new int;
int*    arr  = new int[10];           // 10 ints
int*    arr2 = new int[10]{4, 5, 2, 1};   // with initializer
```

The whole point of pointers here is **dynamic memory allocation** -- managing data whose size or lifetime you only know at runtime.

A stack array, the pointer its name decays to, and a heap array side by side -- note how `sizeof` differs and where each block lives:

```artifact src=demos/mem-array.jsx
```

## Cleaning up: the `delete` operator

- Stack variables are freed automatically when their function ends.
- Heap memory is **not** -- there is **no garbage collector** like in Java. You must release it yourself:

```cpp
delete ptr;        // free a single object
delete[] arr_ptr;  // free an array
```

`delete` doesn't change the pointer's value or the target's value; it only tells the system the memory is free to reuse.

### Common pointer bugs

- **Double free** -- deleting the same memory twice (two pointers to the same location) raises an error.
- **Dangling pointer** -- a pointer that still points at deleted memory. Reading it sometimes works, sometimes crashes; `delete`-ing it again crashes.
- **Fix:** set the pointer to `nullptr` right after deleting.

```cpp
delete p;
p = nullptr;
```

Walk the full lifecycle on the textbook memory model -- allocate on the heap, use it, free it, and see exactly when a pointer becomes *dangling*:

```artifact src=demos/mem-heap.jsx
```
