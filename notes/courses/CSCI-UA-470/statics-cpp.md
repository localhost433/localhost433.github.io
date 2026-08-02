---
title: "Statics in C++"
date: "2026-05-27"
---

## One `static`, three meanings

The keyword `static` shows up in three places in C++, and they are only loosely related. Two are about a class; one is about a function. Keeping them apart is the whole game.

| Where | What `static` means |
|---|---|
| Data member | one copy shared by **all** objects of the class |
| Member function | a method with **no `this`**, called on the class |
| Local variable | a function variable that **persists across calls** |

## Static data members

A `static` attribute belongs to the **class**, not to any single object: every instance shares the one copy. The classic use is a live count of how many objects currently exist.

```cpp
class Phone {
private:
    static int counter;              // shared by ALL Phone objects
    string color;
    int    height;
public:
    Phone()                { counter++; }
    Phone(string c, int h) { color = c; height = h; counter++; }
    ~Phone()               { counter--; }

    static int getCounter() { return counter; }   // static method
};

int Phone::counter = 0;              // define/initialize ONCE, outside the class
```

The trap: a static member is *declared* inside the class but must be **defined once outside it** (`int Phone::counter = 0;`). Skip that line and the linker complains -- the class body only announces the member; the out-of-class definition is what actually allocates it. It lives in Global/Static storage, outside every object, so `sizeof(Phone)` does not include it.

## Static member functions

A `static` method has **no `this` pointer** -- it is not called on any particular object, so it can only touch other static members. Reach it through the class name:

```cpp
Phone::getCounter();     // no object needed
```

Because there is no `this`, a static method cannot read `color` or `height` (those belong to *an* object, and it has none). It can read and write `counter`, because that belongs to the class. Step through the layout -- the shared static in Global/Static storage, the static method as a plain Code-segment function with no `this`:

```artifact src=demos/mem-static.jsx
```

## Static local variables

A `static` inside a function is a different beast from a static class member. A function-scope `static` is **initialized once** and keeps its value between calls -- it lives in Global/Static storage, not on the stack, so it is *not* re-created each time the function runs:

```cpp
void f1() {
    static int x = 0;    // initialized ONCE, persists across calls
    x++;
    cout << x;
}

f1();   // prints 1
f1();   // prints 2  <- resumed from last value, not reset
```

Each call resumes from the last value. A different function gets its own independent static. (This is the one form Java has no equivalent for -- see below.)

## Contrast with Java

Java has `static` on **attributes and methods**, but not on local variables the way C++ allows. The class-level rules are otherwise identical in both languages:

- A static method has no `this`.
- A static method cannot use non-static members.
- A non-static method *can* use static members.

The full side-by-side is in [C++ vs. Java](note.html?course=CSCI-UA-470&note=08-cpp-vs-java) and [the Java/C++ comparison (L11)](note.html?course=CSCI-UA-470&note=17-java-cpp-systematic-comparison).

## The SRP tie-in

A static member is the right home for a **class-level fact** -- something true of the whole fleet, not of any one object. This is exactly the Single Responsibility cut from [SOLID](note.html?course=CSCI-UA-470&note=16-solid): a `Car` should not carry `totalSales`, because "how many cars have been sold" is a fact about the fleet, not about *this* car. Move it to a `static counter` (class-level bookkeeping) and each `Car` object stays about being a car. Per-object state goes in the object; shared state goes in a static.

## What to retain

- `static` has three unrelated uses: **shared data member**, **`this`-less member function**, **persistent local variable**.
- A static data member is *declared* in the class but **defined once outside it** -- forgetting that line is a linker error.
- A static method has **no `this`**, so it can only use static members; call it through the class name.
- A static **local** variable initializes once and survives across calls (lives in static storage, not the stack).
- Java has class statics with the same rules but **no static locals**.
- Design-wise, a static holds **fleet-level facts** (a shared counter), keeping per-object state out of the object -- the SRP cut from [note 16](note.html?course=CSCI-UA-470&note=16-solid).

## Practice

The static-member and storage-model questions live with the copy/operator drills:

```artifact src=demos/practice-04-mcq.jsx
```

---

> Where this sits in the course: the class-level storage story, on its own page. It leans on the stack/heap/static storage model of [note 02](note.html?course=CSCI-UA-470&note=02-pointers-memory), contrasts with Java in [note 08](note.html?course=CSCI-UA-470&note=08-cpp-vs-java), and pays off as a design tool in [note 16](note.html?course=CSCI-UA-470&note=16-solid).
