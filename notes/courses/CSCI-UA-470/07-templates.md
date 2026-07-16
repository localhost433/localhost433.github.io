---
title: Templates
date: "2026-06-10"
---

## Generics with templates

Without generics, a function is tied to one parameter type:

```cpp
void f(int x) { cout << "You have passed " << x; }

f(10);      // OK
f(10.3);    // truncates to 10 — lossy
f("Ten");   // ERROR
```

A **template** lets the compiler generate a version of the function for whatever type is passed:

```cpp
template <typename myType>
void f(myType x) { cout << "You have passed " << x; }

f(10);      // OK — myType = int
f(10.3);    // OK — myType = double
f("Ten");   // OK — myType = const char*
```

### How templates compile: monomorphization

A template emits no machine code by itself. The first time you call it with a given type, the compiler **stamps out** a separate concrete function for that type — `max<int>`, `max<double>`, and `max<string>` become three independent functions in the Code segment, generated from one source pattern and resolved entirely at compile time. Calling again with a type the compiler has already seen reuses that instantiation. Step through it:

```artifact src=demos/templates-mono.jsx
```

### Generic by class type

The same works when the parameter is a class. A plain `void f(Person p)` rejects a `Circle`; a template accepts both:

```cpp
template <class T>          // 'class' and 'typename' are interchangeable here
void f(T p) { /* ... */ }

Person p1;  f(p1);   // OK
Circle c1;  f(c1);   // OK
```

### Multiple type parameters

One type parameter forces **every** argument to the same type. Use several when they may differ:

```cpp
template <class T>
void f(T x1, T x2) { /* ... */ }

f(p1, p2);   // OK — both Person
f(p1, c1);   // ERROR — T can't be both Person and Circle

template <class T1, class T2>
void f(T1 x1, T2 x2) { /* ... */ }

f(p1, p2);   // OK
f(p1, c1);   // OK — T1 = Person, T2 = Circle
```

### Class templates

The same pattern works for whole **classes**, not just functions. A class template is a recipe for a *family of types*: each distinct type argument stamps out a separate, unrelated concrete class with its own object layout -- `Box<int>` is 4 bytes, `Box<double>` 8, `Box<string>` 32, and none is assignable to another.[^stringsize]

[^stringsize]: `sizeof(std::string)` is implementation-defined. These notes assume the 64-bit GNU libstdc++ value of **32** (Linux / typical `g++`). On Clang's libc++ -- the default on macOS -- `std::string` is **24** bytes, so anything sized through a `string` member differs there (the diamond figures in [note 06](note.html?course=CSCI-UA-470&note=06-polymorphism) shift from 80/64 to 64/56). If you measure a different number on your machine, that's why. Like function-template monomorphization, every instantiation is resolved at compile time, with full type-checking and no runtime cost.

```artifact src=demos/templates-class.jsx
```

## Practice

Templates are a compile-time mechanism — monomorphization, not runtime generics. Check the model:

```artifact src=demos/practice-07-mcq.jsx
```

> The second half of this lecture pivots from C++ to Java -- the compilation-to-bytecode model, Java's primitive types and wrappers, `String`, casting, and basic I/O. That material is developed in [C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java).
