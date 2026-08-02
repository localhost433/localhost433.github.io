---
title: "Copy, Operators & Dynamic Attributes"
date: "2026-05-27/06-01"
---

## The one attribute that changes everything

Most of a class's attributes are plain values -- a `string color`, a `double radius` -- and they live *inside* the object, copied and destroyed with it for free. One kind of attribute breaks that comfort: a **pointer member that owns heap memory**, allocated with `new` or `new[]` in the constructor ([note 02](note.html?course=CSCI-UA-470&note=02-pointers-memory)). The object then holds only the *pointer*; the real data sits elsewhere on the heap, and the object is responsible for it.

```cpp
class Circle {
    string color;
    int*   radius;                      // owns heap memory
public:
    Circle() { color = "Red"; radius = new int(0); }
    ~Circle() { delete radius; radius = nullptr; }   // clean up what we own
};
```

The destructor is now doing real work -- without the `delete`, every `Circle` that dies leaks its `int`. But a destructor alone is not enough, and that is the whole story of this note.

## Why the compiler defaults betray you

When you write none of the special members, the compiler supplies a copy constructor and a copy-assignment operator that copy members **one slot at a time** -- a *shallow copy*. For a pointer member that copies the *pointer*, not the data it points to. Two objects now hold the same address:

```cpp
Circle a;
Circle b = a;      // shallow copy: b.radius == a.radius (same heap int)
```

The copy constructor runs in three situations -- initializing one object from another (`Circle b(a);` and `Circle b = a;` both count), passing an object to a function **by value**, and returning an object **by value**. Every one of them hits the same shallow default.

Two failures follow, both because the objects secretly share one allocation:

- **Double free.** When `a` and `b` both go out of scope, both destructors run `delete radius` on the *same* pointer. The second `delete` frees memory that is already gone -- undefined behavior.
- **Dangling / shared state.** Writing through `a.radius` silently changes `b`; freeing one leaves the other pointing at reclaimed memory.

Watch a shallow copy share one allocation, the double free that follows, and the deep copy that fixes it:

```artifact src=demos/mem-copy.jsx
```

## The deep-copy pattern

The fix is to give every copy its **own** allocation. That means writing three members by hand -- the destructor, the copy constructor, and the copy-assignment operator:

```cpp
class Circle {
    string color;
    int*   radius;
public:
    Circle() { color = "Red"; radius = new int(0); }

    Circle(const Circle& o) {           // (1) copy constructor -- DEEP
        color  = o.color;
        radius = new int(*o.radius);    // its own separate allocation
    }

    Circle& operator=(const Circle& o) {// (2) copy-assignment -- DEEP
        if (this != &o) {               // guard self-assignment (a = a)
            delete radius;              // free what we already hold
            color  = o.color;
            radius = new int(*o.radius);
        }
        return *this;                   // return *this so a = b = c chains
    }

    ~Circle() { delete radius; radius = nullptr; }  // (3) destructor
};
```

The two copy operations differ in one respect: the copy constructor builds a **brand-new** object, so it only allocates; `operator=` replaces an object that **already exists**, so it must `delete` its old allocation first, and guard against `a = a` (which would `delete` the very thing it is about to read). The two strategies stepped side by side:

```artifact src=demos/mem-copy-compare.jsx
```

## Why all three, together

This is the **Rule of Three**: if a class needs any one of destructor, copy constructor, or copy-assignment, it almost certainly needs all three. The reason is ownership. The author of the class cannot see how future users will copy, assign, or destroy their objects -- the moment anyone writes `Circle x = a;` or `b = a;`, the shallow default strikes. Owning heap memory means taking responsibility for *every* way an object can be duplicated or destroyed, not just one.

> Rule of thumb: if a class owns heap memory, define the destructor, the copy constructor, and the assignment operator together -- or none of them.

## Operators are just methods

You have already met one overloaded operator: `operator=` above. C++ lets a class define what any built-in operator means for its own type -- `c1 + c2` is nothing more than method-call syntax. The `circle` class overloads arithmetic so you can "add" two circles:

```cpp
circle operator+(circle c) {
    circle temp;
    temp.set_radius(radius + c.radius);
    temp.set_color(color + " and " + c.color);
    return temp;
}
```

Writing `c3 = c1 + c2;` is shorthand for `c3 = c1.operator+(c2);`. The left operand is the object the method runs on, and the right operand is the argument.

The course's `circle` overloads `+`, `-`, `*`, `/`, and `%`, each returning a brand-new `circle`. Guard partial operations: `operator/` checks for a zero radius before dividing.

```cpp
circle operator/(circle c) {
    circle temp;
    if (c.radius != 0) temp.set_radius(radius / c.radius);
    temp.set_color("white");
    return temp;
}
```

Trace the actual `code/lectures/L03/main.cpp`: two circles `c1 = {red, 10}` and `c2 = {blue, 5}`, then a chain of overloaded operators. The console shows what the compiled program prints:

```artifact src=demos/trace-l03.jsx
```

### A container motivates the operators

Overloading also applies outside arithmetic. Consider a `List` you build up and then query:

```cpp
List l1;
l1.add(5);
l1.add(6);
l1.add(10);
l1.add(15);
int x = l1.pop();     // removes/returns the last element (15)
```

After the four adds and one `pop`, the remaining elements form a chain:

```
5 -> 6 -> 10
```

The natural operations on a list all want overloaded operators:

- `l1 == l2` -- overload `operator==` to compare contents (returns `true`/`false`),
- `l1 != l2` -- overload `operator!=` for the negation,
- `cout << l1;` -- overload `operator<<` to print the whole list.

Without these, `==` would compare objects member-by-member (or fail to compile) and `cout << l1` would have no meaning, so a real container class defines them. The stream pair `<<`/`>>` needs one more ingredient -- `friend` -- and lives in [Access Specifiers & Friendship](note.html?course=CSCI-UA-470&note=access-and-friendship).

## What to retain

- A **pointer member that owns `new`/`new[]` memory** is what forces the special members; plain value attributes never do.
- The compiler defaults do a **shallow copy** -- they duplicate the pointer, not the data -- so two objects share one allocation.
- That sharing causes **double free** (two destructors `delete` the same pointer) and **dangling/shared state** (a write through one is seen by the other).
- The fix is a **deep copy**: each object gets its own allocation, via a hand-written copy constructor and `operator=`, plus a destructor to release it.
- `operator=` must `delete` the old resource first and guard `this != &o`; the copy constructor allocates fresh into a new object.
- The copy constructor runs on **initialization, pass-by-value, and return-by-value** -- three doors into the same code.
- The **Rule of Three**: needing one of the three means needing all three.
- An overloaded operator is an ordinary method with a special name: `c1 + c2` is `c1.operator+(c2)`, and a good `operator/` guards its edge case.
- Container types overload `==`, `!=`, and `<<` themselves, because the member-wise defaults are wrong (or missing) for them.

## Practice

Predict what a heap-owning class prints under copy and assignment, then pin down the reason:

```artifact src=demos/practice-04-predict.jsx
```

```artifact src=demos/practice-04-mcq.jsx
```

---

> Where this sits in the course: the L04 story -- ownership and the operator machinery that grows out of it. The stream pair `<<`/`>>` continues in [Access Specifiers & Friendship](note.html?course=CSCI-UA-470&note=access-and-friendship); the underlying `new`/`delete` and heap model are in [note 02](note.html?course=CSCI-UA-470&note=02-pointers-memory), and the destructor basics in [Classes & Objects](note.html?course=CSCI-UA-470&note=03-classes-objects). Java sidesteps the whole problem -- no destructors, garbage-collected heap ([note 08](note.html?course=CSCI-UA-470&note=08-cpp-vs-java)).
