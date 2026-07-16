---
title: C++ vs. Java
date: "2026-06-10/15"
---

## Compilation model

This is the headline difference between the two languages.

| | C++ | Java |
|---|---|---|
| Portability | platform-dependent / not portable | platform-independent / portable |
| Source | `.cpp` + `.h` | `.java` |
| Build step | `g++` -> assembly (`.s`) -> machine code (`a.out` / `.exe`) | `javac` -> bytecode (`.class`) |
| Run step | run the native binary directly | a JVM interprets the `.class` on each OS |

- C++ compiles all the way down to machine code for one specific platform. You must recompile, producing a different binary (`a.out` on macOS/Linux, `.exe` on Windows), for each target.
- Java compiles once to bytecode, and then the JVM on each machine (macOS, Linux, Windows) interprets it. Write once, run anywhere.

```artifact src=demos/platform-fanout.jsx
```

## Java data types

| Category | Types (size in bytes) | Operators |
|---|---|---|
| whole numbers | `byte` (1), `short` (2), `int` (4), `long` (8) | `+ - * / % ++ --` |
| floats | `float` (4), `double` (8) | `+ - * /` |
| boolean | `boolean` | |
| char | `char` | |

### Wrapper classes

Every primitive has an object wrapper with useful static helpers:

```java
Integer, Double, Character, ...

Integer.parseInt("42");        // String -> int
Integer.toString(intValue);    // int -> String
```

### Strings

```java
String s1 = "welcome";                 // string literal
String s2 = new String("welcome");     // explicit object
```

Both are objects, unlike a C++ `std::string` value on the stack.

### Casting

Widening conversions happen automatically along `byte → short → int → long → float → double`:

```java
int x = 10;
double y = x;          // implicit; int -> double is exact
```

Caution: `int`/`long → float` and `long → double` are automatic but may lose precision.

Narrowing conversions go the other way (`double → float → long → int → short → byte`) and require an explicit cast:

```java
double x = 3.5;
int y = (int) x;       // explicit cast required
```

## Basic Java instructions

```java
System.out.print(txt);

Scanner s = new Scanner(System.in);
String t = s.next();
int    i = s.nextInt();
double d = s.nextDouble();
```

Control statements (`if`, `for`, `while`, `do while`, `break`, `continue`) mirror C++. Arrays are objects created with `new`:

```java
double[]   d = new double[7];
int[][]    i = new int[2][3];
int[][]    a = { {10, 20, 30}, {40, 50, 60} };
```

## Classes in Java

- Classes are organized into packages.
- Every class is ultimately a subclass of `Object`.
- One public class per file, and the file is named after it.
- No standalone functions, only methods. C++ allows free functions; Java does not.

### Special methods

- **Constructors** — with parameters, without parameters, and the copy constructor.
- **Getters and setters**.
- **`toString()`** — returns a string representation of the object.
- **No destructor** — unlike C++, Java has none; the garbage collector reclaims memory.

### Statics (true in both C++ and Java)

- `static` applies to attributes and methods, not to local variables in functions the way C++ allows.
- A static method cannot use non-static members.
- A static method has no `this`.
- A non-static method can use static members.

## Access specifiers

C++ has three levels; Java adds a package level and a `none` (default).

C++, where the default is `private`:

| | class | subclass | world |
|---|---|---|---|
| `private` | yes | no | no |
| `protected` | yes | yes | no |
| `public` | yes | yes | yes |

Java, where the default is `none` (package-private):

| | class | package | subclass | world |
|---|---|---|---|---|
| `private` | yes | no | no | no |
| `none` (default) | yes | yes | no | no |
| `protected` | yes | yes | yes | no |
| `public` | yes | yes | yes | yes |

## Creating objects

In Java, all objects are created with `new`. There are no stack objects and no constructor-call-by-declaration.

```cpp
// C++ -- many forms
Person  p1;                          // stack, default ctor
Person  p2("James", 20);             // stack, parameterized ctor
Person* p3 = new Person();           // heap
Person* p4 = new Person("Maya", 19); // heap
delete p3; p3 = nullptr;             // you free heap memory
delete p4; p4 = nullptr;
```

```java
// Java -- only 'new', only reference variables
Person p3 = new Person();
Person p4 = new Person("Maya", 19);
// no 'delete' -- the garbage collector handles it
```

The C++ forms `Person p1;` and `Person p2("James", 20)` have no Java equivalent.

Where each object actually lives, inline on the stack or on the heap with a handle pointing at it:

```artifact src=demos/mem-stack-vs-heap.jsx static
```

## Pointer vs. reference

A C++ pointer and a Java reference look similar but differ in keyword and freedom:

```cpp
// C++
Person* p1;                 // define a pointer
p1 = new Person();          // allocate
```

```java
// Java
Person p1;                  // define a reference
p1 = new Person();          // create on the heap
```

Both leave the object on the heap with a stack variable pointing at it. The Java consequence to remember is that assignment copies the reference, not the object:

```java
Person p1 = new Person("James", 20);
Person p2 = new Person("Maya", 18);

p1 = p2;            // p1 now points at the SAME object as p2

p2.age = 30;
p1.age;             // 30   -- same object
p1.name;            // "Maya"
```

After `p1 = p2`, the original `"James"` object has no reference and becomes garbage; both names alias the `"Maya"` object.

## Exercise: swapping two objects

> Write a static method that takes two objects and swaps their contents (attribute values).

A naive swap of the references does nothing useful outside the method. Java passes references by value, so reassigning the parameters only rebinds the local copies:

```java
// WRONG -- swaps the local references, callers see no change
static void swap(Person x, Person y) {
    Person tmp = x;
    x = y;
    y = tmp;
}
```

Swap the attributes instead, so the two heap objects actually exchange state:

```java
// CORRECT
static void swap(Person x, Person y) {
    int    tmp = x.age;   String s = x.name;
    x.age  = y.age;       x.name = y.name;
    y.age  = tmp;         y.name = s;
}

Person p1 = new Person("James", 20);
Person p2 = new Person("Maya", 18);
util.swap(p1, p2);

p1.age;  // 18      p1.name; // "Maya"
p2.age;  // 20      p2.name; // "James"
```

Step through why the naive reference swap is a no-op and the field swap works:

```artifact src=demos/swap-by-ref.jsx
```

## Inheritance: C++ vs. Java

| | C++ | Java |
|---|---|---|
| Method binding | `virtual` / non-virtual (non-virtual default) | always virtual by default |
| Inheritance modes | `private`, `protected`, `public` | `public` only |
| Single | yes | yes |
| Multi-level | yes | yes |
| Multiple | yes (risks the diamond problem) | no, not allowed for classes |
| Multi-level + multiple (the diamond) | yes | no, not allowed for classes |

The slide draws inheritance as four shapes (single, multi-level, multiple, and multi-level + multiple, the diamond) and crosses out the last two for Java: both multiple inheritance and the diamond are forbidden for classes.

Java forbids multiple class inheritance precisely to avoid the diamond problem. Instead a class may implement multiple interfaces.

The slide also gives the one-line C++ to Java mapping: a C++ class with a pure virtual method corresponds to an `abstract` class in Java, and a C++ class with all methods pure virtual corresponds to an `interface`. The full concrete/abstract/interface comparison is laid out in [OOP: The Four Pillars](note.html?course=CSCI-UA-470&note=16-oop-pillars-roadmap#concrete-vs-abstract-vs-interface).

## Practice

The contrasts that trip people up are Java's reference-by-value semantics and the object/inheritance model. Work through them:

```artifact src=demos/practice-08-mcq.jsx
```
