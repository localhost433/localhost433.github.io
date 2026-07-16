---
title: Classes & Objects
date: "2026-05-20/27"
---

## From structs to classes

This note is your first brush with all four OOP pillars -- **encapsulation** (classes bundling state with behavior, plus access control), and the seeds of inheritance, abstraction, and polymorphism that follow; the full map of how they fit together lives in [OOP: The Four Pillars](note.html?course=CSCI-UA-470&note=16-oop-pillars-roadmap).

A C-style `struct` is just a bundle of data; a *separate* free function operates on it and receives the data explicitly:

```cpp
typedef struct {
    char name[8];
    int  age;
} PERSON;

void intro(PERSON p) {
    printf("hi, my name is %s\n", p.name);
}

PERSON p1;
strcpy(p1.name, "James");
p1.age = 20;
intro(p1);
```

A C++ **class** bundles the data *and* the behavior together. The method is called *on* the object and receives it implicitly (as `this`) instead of as an explicit parameter:

```cpp
class Person {
public:
    string name;
    int    age;
    void intro() { cout << "hi, my name: " << name << endl; }
};

Person p1;
p1.name = "James";
p1.age  = 20;
p1.intro();
```

## Traditional programming vs. OOP

- **Traditional:** data and the functions that act on it are kept separate.

  ```cpp
  int n1, n2, w;
  cin >> n1; cin >> n2;
  w = n1 + n2;
  cout << w;
  ```

- **OOP:** you model the problem as **objects** that own their data and expose behavior, then ask those objects to do work.

  ```cpp
  Receptionist* v  = new Receptionist();
  Operator*     op = new Operator();
  int n1 = v->ask_number();
  int n2 = v->ask_number();
  int w  = op->add(n1, n2);
  ```

  Here the `Receptionist` gathers the input and the `Operator` owns the computation -- each piece of data lives with the code that acts on it.

Grouping state with behavior is what makes large programs manageable -- the stated goal of this course.

## Classes vs. objects: blueprint and reality

The central idea of OOP, by analogy: a **class is a blueprint** for a house; an **object is an actual house** built from it.

- A **class** is a user-defined type that bundles **attributes** (the data) and **methods** (the behavior). It's a logical definition and occupies no data memory itself.
- An **object** is a concrete instance -- a real entity in memory with its own data.
- One class -> **many** independent objects, each with its own state.

```cpp
class Person {
public:                          // access specifier
    string name;                 // attributes (data)
    int    age;
    void say_hi() { cout << "hi"; }   // method (behavior)
};                               // <-- don't forget the semicolon!

Person p1;                       // instantiate an object
p1.name = "James";               // dot notation accesses public members
p1.age  = 20;
p1.say_hi();

Person p2;                       // a completely separate object
p2.name = "Maria";
p2.age  = 25;                    // changing p1 has no effect on p2
```

> By default, **everything in a C++ class is private.** The `public:` specifier is what lets outside code touch `name` and `age` -- without it, `p1.name` is a compiler error.

| Class | Object |
|---|---|
| Blueprint / template | The thing built from it |
| A definition in code | A physical entity in memory |
| Defined **once** | Instantiated **many** times |
| Occupies no data memory | Has its own data |

The figure shows one blueprint and two independent objects -- same layout, different data. (The figure switches to the course's running `circle` example instead of `Person`, but the idea is identical: one class, many independent instances.)

```artifact src=demos/class-blueprint.jsx static
```

The rest of this note fleshes out a class -- its anatomy, encapsulation, constructors, and destructor.

## Anatomy of a class

A full-featured class is built from these pieces:

- **attributes** (data, living on the stack or heap)
- **constructors** -- with and without parameters
- a **destructor**
- a **copy constructor** and an **assignment operator** (under **Resource Management**)
- **getters & setters** (encapsulation)
- **operators**

We'll develop most of these on the course's running example: a `circle` with a `color` and a `radius`.

## Encapsulation: private data, public interface

Keep attributes `private` and expose controlled access through `public` getters and setters. Setters can **validate** input before storing it.

```cpp
class circle {
private:
    string color  = "no color";
    double radius = 0;
public:
    string get_color()  { return color; }
    double get_radius() { return radius; }

    void set_color(string c) { color = c; }
    void set_radius(double r) {
        if (r < 0) radius = 0;   // reject negative radii
        else       radius = r;
    }
};
```

> **Watch out:** the in-class draft wrote the setter as `if (r < 0) { radius = 0; } radius = r;` -- the final `radius = r;` runs unconditionally, so it *always* overwrites the guard. Use `else` (above) so the validation actually holds. The in-class constructor drafts had the same bug; the versions below are written with the fix.

## Constructors

A **constructor** initializes a new object. It has the **same name as the class**, takes no return type, and can be **overloaded** so objects can be created in several ways.

```cpp
class circle {
private:
    string color  = "no color";
    double radius = 0;
public:
    circle() {                      // default (no parameters)
        color = "no color";
        radius = 0;
    }
    circle(string c, double r) {    // color + radius
        color = c;
        radius = (r < 0) ? 0 : r;
    }
    circle(double r) {              // radius only
        color = "no color";
        radius = (r < 0) ? 0 : r;
    }
    circle(string c) {              // color only
        color = c;
        radius = 0;
    }
};
```

If you define **no** constructor, the compiler supplies a default one. As soon as you write your own, you control exactly how objects start out.

## Destructors

A **destructor** runs automatically when an object is destroyed -- when it goes out of scope, or when you `delete` a heap object. Its name is `~ClassName()`, with no parameters and no return type.

```cpp
~circle() {
    // release any resources the object owns
}
```

For objects whose attributes are plain values there's nothing to clean up. Destructors become essential once an object owns **heap memory** (see **Resource Management**).

> **Static members** (a per-class field or method shared by every object) and the stack/heap/static **storage model** for attributes are covered in [Copy, Operators & Resource Management](note.html?course=CSCI-UA-470&note=04-resource-management), alongside where objects live in memory.

## Practice

Class-vs-object, the private-by-default rule, and the constructor/destructor basics are the encapsulation foundation everything later builds on:

```artifact src=demos/practice-03-mcq.jsx
```
