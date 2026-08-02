---
title: "Access Specifiers & Friendship"
date: "2026-06-01"
---

## The encapsulation surface

Encapsulation is the first OOP pillar: bundle state with behavior, then **control who can touch the state**. In C++ the control knobs are three access specifiers. The default matters -- **everything in a C++ class is `private` until you say otherwise**.

| Specifier | Same class | Subclass | Outside world |
|---|---|---|---|
| `private` | yes | no | no |
| `protected` | yes | yes | no |
| `public` | yes | yes | no → **yes** |

The standard shape is *private data, public interface*: keep attributes `private`, expose controlled `public` getters and setters, and let a setter **validate** before it stores.

```cpp
class circle {
private:
    string color  = "no color";
    double radius = 0;
public:
    string get_color()  { return color; }
    void   set_radius(double r) {
        if (r < 0) radius = 0;    // reject bad input at the boundary
        else       radius = r;
    }
};
```

Outside code can only go through `set_radius`, so the invariant "radius ≥ 0" holds no matter who calls. `protected` is the in-between: invisible to the outside world, but visible to subclasses -- the specifier that exists *for* inheritance.

## Inheritance changes inherited visibility

An inheritance link carries a **mode** -- `public`, `protected`, or `private` -- that caps how the base's members surface in the subclass. Separately, you can *re-expose* an inherited member whose visibility was lowered. Suppose `Student` inherits privately but wants `Person::name` public again:

**Option 1 -- `using` (re-expose the same member):**

```cpp
class Student : private Person {
public:
    using Person::name;      // bring Person::name back into public scope
};
```

**Option 2 -- redefine (a brand-new member with the same name):**

```cpp
class Student : private Person {
public:
    string name = "James";   // a second, independent slot
};
```

The difference is one member vs. two: `using` keeps the **single** inherited member and just changes its access; redefining creates a **separate** slot that shadows the inherited one. (More in [Inheritance](note.html?course=CSCI-UA-470&note=05-inheritance).)

## `friend`: the granted exception

Privacy is the default, but sometimes one function or class genuinely needs inside access. `friend` is the **deliberate, granted** exception: the class names who may see its privates.

```cpp
class Person {
private:
    string SSN;             // private
    int    age;             // private
public:
    string name;            // public
    friend void f();        // a friend function
    friend class Manager;   // a friend class: Manager sees SSN and age
};
```

| Accessor | `p.SSN` | `p.age` | `p.name` |
|---|---|---|---|
| Non-friend | ✗ | ✗ | ✓ |
| Friend `f()` / `Manager` | ✓ | ✓ | ✓ |

Use friendship sparingly -- it *is* a hole in encapsulation -- but it is the standard tool for tightly-coupled helpers (a `Manager` evaluating a `Person`) and, above all, for stream operators.

## Stream operators: the canonical friend

To make `cout << c` and `cin >> c` work, overload the stream operators. They **can't be members**, because the left operand is the stream and not your object -- so they are free functions, declared `friend` so they may read private data:

```cpp
class Circle {
    string color;
    double radius;
public:
    Circle()                   { color = ""; radius = 0; }
    Circle(string c, double r) { color = c;  radius = r; }

    friend ostream& operator<<(ostream& os, const Circle& c);
    friend istream& operator>>(istream& is, Circle& c);
};

ostream& operator<<(ostream& os, const Circle& c) {
    os << "I am a circle, my details are: " << c.color << "," << c.radius;
    return os;                  // return the stream so calls can chain
}
istream& operator>>(istream& is, Circle& c) {
    cout << "Enter color and radius: ";
    is >> c.color >> c.radius;
    return is;
}

// usage:
Circle c3;
cin  >> c3;            // operator>>(cin, c3)
cout << c3 << endl;    // operator<<(cout, c3)
```

This is adapted from `code/lectures/L04/main.cpp` (which also overloads `+`, `-`, and `*` -- the arithmetic side is in [Copy, Operators & Dynamic Attributes](note.html?course=CSCI-UA-470&note=dynamic-attributes)). Trace it, typing `green 4.5` at the prompt, to see the friend operators read into and print from `c3`:

```artifact src=demos/trace-l04.jsx
```

## The exam trap: friendship is neither inherited nor mutual

Two properties of `friend` catch people out:

- **Not inherited.** If `Manager` is a friend of `Person`, a subclass of `Manager` is **not** automatically a friend of `Person`, and a subclass of `Person` does **not** inherit `Person`'s friends.
- **Not mutual.** `A` granting friendship to `B` does **not** let `A` see `B`'s privates. Friendship is one-directional and must be granted explicitly by each class that offers it.

Friendship is granted, per-class, per-direction -- never assumed.

## Java differs

Java has no `friend`. Its access ladder adds a **package** level and a **default** (package-private, when you write no specifier at all):

| | class | package | subclass | world |
|---|---|---|---|---|
| `private` | yes | no | no | no |
| default | yes | yes | no | no |
| `protected` | yes | yes | yes | no |
| `public` | yes | yes | yes | yes |

Note Java's `protected` also grants **package** access, unlike C++'s. The full comparison is in [C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java) and [the Java/C++ comparison (L11)](note.html?course=CSCI-UA-470&note=17-java-cpp-systematic-comparison).

## What to retain

- C++ has **three** access levels; the class default is **`private`**. Standard shape: private data, public validating interface.
- `protected` = hidden from the world, visible to subclasses -- the inheritance-specific level.
- Inheritance mode (`public`/`protected`/`private`) caps inherited visibility; `using` re-exposes **one** member, redefining makes a **second**.
- `friend` is the **granted** exception to privacy -- the standard tool for stream operators (`operator<<` can't be a member).
- Stream operators **return the stream** (`return os;`) so calls chain: `cout << a << b`.
- Exam trap: `friend` is **not inherited** and **not mutual** -- each class grants it explicitly, in one direction.
- Java has **no `friend`**, adds **package** and default levels, and its `protected` includes package access.

## Practice

Encapsulation and the private-by-default rule underpin everything after:

```artifact src=demos/practice-03-mcq.jsx
```

The `friend` and stream-operator questions ride with the copy/operator drills:

```artifact src=demos/practice-04-mcq.jsx
```

---

> Where this sits in the course: the encapsulation surface, consolidated. The private/public interface comes from [Classes & Objects](note.html?course=CSCI-UA-470&note=03-classes-objects), the arithmetic-operator half of L04 lives in [Copy, Operators & Dynamic Attributes](note.html?course=CSCI-UA-470&note=dynamic-attributes), and inherited-member visibility comes from [Inheritance](note.html?course=CSCI-UA-470&note=05-inheritance). It is the access-control layer that access specifiers on a UML class diagram (`+`/`-`/`#`) stand for in [note 14](note.html?course=CSCI-UA-470&note=14-uml-class-diagrams).
