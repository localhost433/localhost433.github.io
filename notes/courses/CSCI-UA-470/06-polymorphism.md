---
title: Polymorphism & Virtual Functions
date: "2026-06-03/08"
---

## Early (static) binding

When you call a method through an object or pointer, **which** implementation runs is decided at **compile time** by the *declared* type -- this is **early binding** (the default in C++).

```cpp
class Person  { public: void intro() { cout << "I am a person"; } };
class Student : public Person {
public: void intro() { cout << "I am a student"; } };

Person  p1;
Student s1;
p1.intro();        // "I am a person"
s1.intro();        // "I am a student"

Person* ptr = &p1;
ptr->intro();      // "I am a person" -- chosen by ptr's type (Person*)
```

The catch: a `Person*` that actually points at a `Student` still calls `Person::intro()`, because the decision used the *pointer's* type, not the object's. To dispatch on the **runtime** type we need `virtual` -- the subject of the rest of this note.

## Late (dynamic) binding with `virtual`

In the previous section, calling through a `Person*` always ran `Person::intro()` -- the choice was made at compile time (**early binding**). Mark the method `virtual` and the choice moves to **runtime**, based on the object the pointer actually points at (**late binding**).

```cpp
class Person {
public:
    virtual void intro() { cout << "I am a person"; }
};
class Student : public Person {
public:
    virtual void intro() { cout << "I am a student"; }  // overrides
};

Person* ptr = &p1;     // p1 is a Person
ptr->intro();          // "I am a person"

Student s1;
ptr = &s1;             // same pointer, now a Student
ptr->intro();          // "I am a student"  <- runtime type wins
```

Mechanically, a class with virtual methods gets a hidden **vtable** (one per class) and each object stores a pointer to it. The call dereferences that pointer at runtime to find the right implementation.

Step through the actual `L06/p1.cpp` -- watch the dispatch follow *object -> vptr -> vtable -> function*, so a `person*` still runs `student::intro`:

```artifact src=demos/mem-vtable.jsx
```

But a vtable isn't a single pointer -- it's an **array**, one slot per virtual function, indexed by a fixed compile-time offset. With two virtuals and an override, watch the slots, the shared Code-segment bodies, and how each call indexes by offset:

```artifact src=demos/vtable-internals.jsx
```

That vptr isn't free: the first virtual function adds a hidden 8-byte pointer to **every** object of the class (the vtable itself is shared, one per class):

```artifact src=demos/size-vptr.jsx static
```

## Polymorphism

> **Polymorphism:** the ability to hold objects of different types through a common base pointer, and call one method they all share -- each running its own implementation.

```cpp
class Person   { public: virtual void intro() = 0; };
class Student  : public Person { public: void intro() { cout << "student";  } };
class Employee : public Person { public: void intro() { cout << "employee"; } };
class Teacher  : public Person { public: void intro() { cout << "teacher";  } };

Person* people[] = { new Student(), new Teacher(), new Employee() };
for (Person* p : people)
    p->intro();        // each prints its own message -- different impl per type
```

This is the payoff of `virtual`: write the loop once against `Person*`, and every subclass behaves correctly.

## Pure virtual methods and abstract classes

A **pure virtual** method has no body -- it's set to `0`:

```cpp
class Person {
public:
    virtual void myMethod() = 0;   // pure virtual
};
```

A class with at least one pure virtual method is **abstract**:

- You **cannot** create objects of it -- only **pointers** (or references).
- It **forces** every concrete subclass to provide an implementation.

```cpp
Person   p;     // ERROR -- abstract, no objects
Person*  pp;    // OK -- pointer is fine

Employee  e;    // OK only if Employee implements every pure virtual
Employee& er = e;   // OK
Teacher*  t;        // OK
```

This is C++'s tool for **abstraction**: define the interface in the base, defer the details to subclasses.

## Resolving inherited members

**Inherited attributes:**

| | Single inheritance | Multiple inheritance |
|---|---|---|
| Change visibility (`using`) | optional | optional |
| Redefine with same name | optional | **must**, to avoid ambiguity |

**Inherited methods:**

| | Single inheritance | Multiple inheritance |
|---|---|---|
| Early binding | default | default |
| Late binding | `virtual` | `virtual` |

## The diamond problem

When a class inherits from two bases that **share a common ancestor**, the ancestor's members get duplicated:

```cpp
class Person  { public: string name; int age = 0; };
class Teacher : public Person { public: int age = 25; };
class Student : public Person { public: int age = 20; };

class TA : public Teacher, public Student { public: int age = 27; };
```

Why "diamond"? `Teacher` and `Student` both derive from `Person`, and `TA` derives from both -- the four classes meet at the top and the bottom. But *plain* multiple inheritance doesn't give you the single-apex diamond you might picture: each branch drags along **its own** `Person`, so what you really get is a forked tree with **two** `Person`s. Virtual inheritance (next section) is what restores the true shared apex:

```artifact src=demos/diamond-chart.jsx static
```

*Each box is a class; arrows mean "inherits from." Node colours match the byte-layout demos below -- Person (blue), Teacher (green), Student (amber), TA (purple).*

Building a `TA` makes it "a Teacher" *and* "a Student" -- so it ends up with **two** copies of everything in `Person`. See the two separate `Person` subobjects in the object, and why `t.name` then won't compile:

```artifact src=demos/mem-diamond-plain.jsx
```

So how do you fix it? Several things you might reach for -- and why only the last one actually works:

| Attempt | Compiles? | One `Person`? | Verdict |
|---|---|---|---|
| **Plain multiple inheritance** | no `t.name` is ambiguous (so is `Person* p = &t;`) | no -- two copies | **fails outright** -- you can't even name the member |
| **Disambiguate by scope** -- `t.Teacher::name` | yes | no -- still two | **band-aid** -- silences the error but you keep *two* independent `Person`s (two `name`s, two `age`s); upcasting to `Person*` stays ambiguous. Usually a bug. |
| **Redefine `name` in `TA`** | yes for `t.name` | no -- two underneath | **hides, doesn't fix** -- the two `Person` subobjects are still there, so base-class pointers and shared state stay broken |
| **Virtual inheritance** -- `virtual public Person` | yes | **yes -- one shared** | **the real fix** -- a single `Person` subobject; cost is a hidden `vbptr` + a run-time offset (below) |

The first three only treat the *symptom* (the name clash); only `virtual` removes the *cause* -- the duplicated base.

## Virtual inheritance -- the fix

Declare the shared base **`virtual`** in each intermediate class. The common ancestor is then stored **once** and shared, reached through a hidden **`vbptr`** (virtual-base pointer) in each branch.

```cpp
class Teacher : virtual public Person { /* ... */ };
class Student : virtual public Person { /* ... */ };

class TA : public Teacher, public Student { /* ... */ };
```

With virtual inheritance the `TA` carries a **single** `Person` subobject; both `Teacher` and `Student` point to it via their `vbptr`, so `t.name` is unambiguous.

But *where* is that shared `Person`? It's relocated to the **end** of the object, and each branch finds it through its `vbptr` -- which stores a **run-time offset**, not a fixed compile-time number. Watch the bytes: the same `Person` is reached from two different `vbptr`s with two different stored offsets, both landing on the one copy. (The `+N` badges are byte offsets.)

```artifact src=demos/mem-diamond.jsx
```

The offset has to be looked up at run time because it depends on the *complete* object: a standalone `Student` keeps its `Person` close by, but inside a `TA` the shared `Person` sits much further along. Same `this->name`, different offset.

**And `age`?** `t.name` is clean only because virtual inheritance leaves **one** shared `Person` for it to live in. `age` is different: it's declared separately in `Teacher` (`25`), `Student` (`20`), *and* `TA` (`27`) -- not in `Person`. So `t.age` is unambiguous for a different reason: `TA::age` (`27`) **hides** the inherited `Teacher::age` and `Student::age`, and you reach the others with `t.Teacher::age` / `t.Student::age`. Had `age` instead lived in `Person`, virtual inheritance would again give one shared copy (fine) -- but a *non-virtual* diamond would give **two** `Person`s, making `t.age` ambiguous and forcing the same qualification you saw break `t.name` above.

The L06 program (`code/lectures/L06/main.cpp`) prints from every constructor/destructor. Step through it to see the shared `Person` built **once, first, by the most-derived class** -- and destroyed last:

```artifact src=demos/trace-l06-diamond.jsx
```
