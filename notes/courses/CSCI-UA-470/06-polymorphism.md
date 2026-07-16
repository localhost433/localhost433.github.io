---
title: Polymorphism & Virtual Functions
date: "2026-06-03/08"
---

## Early (static) binding

A call made through an object or a pointer is resolved at compile time, from the declared type of the expression. C++ calls this early binding and uses it by default.

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

The catch: a `Person*` that actually points at a `Student` still calls `Person::intro()`, because the decision used the declared type of the pointer rather than the type of the object. Dispatching on the runtime type takes `virtual`, which the rest of this note covers.

## Late (dynamic) binding with `virtual`

Without `virtual`, a call through a `Person*` always runs `Person::intro()`, because the compiler fixes the target at compile time. That is early binding. Marking the method `virtual` moves the choice to run time, where it depends on the object the pointer actually points at. That is late binding.

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

Mechanically, a class with virtual methods gets a hidden vtable, one per class, and each object stores a pointer to it. The call dereferences that pointer at runtime to find the right implementation.

Step through the actual `L06/p1.cpp`. The dispatch follows object -> vptr -> vtable -> function, so a `person*` still runs `student::intro`:

```artifact src=demos/mem-vtable.jsx
```

A vtable is an array, one slot per virtual function, indexed by a fixed compile-time offset. The next demo has two virtuals and an override: the slots, the shared Code-segment bodies, and how each call indexes by offset.

```artifact src=demos/vtable-internals.jsx
```

The vptr costs space. The first virtual function adds a hidden 8-byte pointer to every object of the class, while the vtable itself is shared, one per class:

```artifact src=demos/size-vptr.jsx static
```

## Polymorphism

- **Polymorphism** — the ability to hold objects of different types through a common base pointer, and call one method they all share, each running its own implementation.
- **Overriding** — providing a different implementation for an inherited method. It is what lets each subclass supply its own version of the shared method above.

```cpp
class Person   { public: virtual void intro() = 0; };
class Student  : public Person { public: void intro() { cout << "student";  } };
class Employee : public Person { public: void intro() { cout << "employee"; } };
class Teacher  : public Person { public: void intro() { cout << "teacher";  } };

Person* people[] = { new Student(), new Teacher(), new Employee() };
for (Person* p : people)
    p->intro();        // each prints its own message -- different impl per type
```

`virtual` is what makes that loop work. It is written once against `Person*`, and every subclass runs its own implementation.

## Pure virtual methods and abstract classes

A pure virtual method has no body; it is set to `0`:

```cpp
class Person {
public:
    virtual void myMethod() = 0;   // pure virtual
};
```

A class with at least one pure virtual method is abstract:

- No objects of it can be created, only pointers (or references).
- Every subclass is forced into one of two choices:
  1. Provide an implementation for the method, which makes that subclass concrete and instantiable, or
  2. Re-declare the method as pure virtual (`= 0`), which leaves that subclass abstract too ("no objects can be created from this subclass").

```cpp
Person   p;     // ERROR -- abstract, no objects
Person*  pp;    // OK -- pointer is fine

Employee  e;    // OK only if Employee implements every pure virtual
Employee& er = e;   // OK
Teacher*  t;        // OK
```

A subclass that leaves the pure virtual unimplemented is itself abstract. If `Student` inherits `intro() = 0` and never gives it a body, `Student` is still abstract, so it has the same object-vs-pointer split as the base:

| Declaration | Legal? | Why |
|---|---|---|
| `Person p;` | no | `Person` is abstract |
| `Person* p;` | yes | pointer/reference handle is fine |
| `Student s;` | no | `Student` still has an unimplemented pure virtual -- also abstract |
| `Student* t;` | yes | pointer is fine |
| `Employee e;` | yes | only if `Employee` implements every pure virtual |
| `Employee& er = e;` | yes | reference is fine |
| `Teacher t;` | yes | `Teacher` implements `intro()` |

This is C++'s tool for abstraction: the base defines the interface, the subclasses supply the details.

## Resolving inherited members

For inherited attributes:

| | Single inheritance | Multiple inheritance |
|---|---|---|
| Change visibility (`using`) | optional | optional |
| Redefine with same name | optional | must, to avoid ambiguity |

For inherited methods:

| | Single inheritance | Multiple inheritance |
|---|---|---|
| Early binding | default | default |
| Late binding | `virtual` | `virtual` |

## The diamond problem

When a class inherits from two bases that share a common ancestor, the ancestor's members get duplicated:

```cpp
class Person  { public: string name; int age = 0; };
class Teacher : public Person { public: int age = 25; };
class Student : public Person { public: int age = 20; };

class TA : public Teacher, public Student { public: int age = 27; };
```

The name comes from the shape: `Teacher` and `Student` both derive from `Person`, and `TA` derives from both, so the four classes meet at the top and at the bottom. Plain multiple inheritance gives each branch its own `Person`, so the real shape is a forked tree with two `Person`s rather than the single-apex diamond of the picture. Virtual inheritance (next section) restores the shared apex:

```artifact src=demos/diamond-chart.jsx static
```

Each box is a class; arrows mean "inherits from." Node colours match the byte-layout demos below -- Person (blue), Teacher (green), Student (amber), TA (purple).

Building a `TA` makes it "a Teacher" and "a Student", so it ends up with two copies of everything in `Person`. The demo shows the two separate `Person` subobjects in the object, and why `t.name` then won't compile:

```artifact src=demos/mem-diamond-plain.jsx
```

Four repairs one might reach for, of which only the last works:

| Attempt | Compiles? | One `Person`? | Verdict |
|---|---|---|---|
| Plain multiple inheritance | no `t.name` is ambiguous (so is `Person* p = &t;`) | no -- two copies | fails outright -- you can't even name the member |
| Disambiguate by scope -- `t.Teacher::name` | yes | no -- still two | band-aid -- silences the error but you keep two independent `Person`s (two `name`s, two `age`s); upcasting to `Person*` stays ambiguous. Usually a bug. |
| Redefine `name` in `TA` | yes for `t.name` | no -- two underneath | hides, doesn't fix -- the two `Person` subobjects are still there, so base-class pointers and shared state stay broken |
| Virtual inheritance -- `virtual public Person` | yes | yes -- one shared | the real fix -- a single `Person` subobject; cost is a hidden `vbptr` + a run-time offset (below) |

The first three treat the symptom, the name clash. Only `virtual` removes the cause, the duplicated base.

## Virtual inheritance -- the fix

Declare the shared base `virtual` in each intermediate class. The common ancestor is then stored once and shared, reached through a hidden `vbptr` (virtual-base pointer) in each branch.

```cpp
class Teacher : virtual public Person { /* ... */ };
class Student : virtual public Person { /* ... */ };

class TA : public Teacher, public Student { /* ... */ };
```

With virtual inheritance the `TA` carries a single `Person` subobject; both `Teacher` and `Student` point to it via their `vbptr`, so `t.name` is unambiguous.

That shared `Person` is relocated to the end of the object, and each branch finds it through its `vbptr`, which stores a run-time offset instead of a fixed compile-time number. In the bytes, the same `Person` is reached from two different `vbptr`s with two different stored offsets, both landing on the one copy. (The `+N` badges are byte offsets.)

```artifact src=demos/mem-diamond.jsx
```

The offset has to be looked up at run time because it depends on the complete object: a standalone `Student` keeps its `Person` close by, but inside a `TA` the shared `Person` sits much further along. Same `this->name`, different offset.

`age` behaves differently from `name`. `t.name` is clean only because virtual inheritance leaves one shared `Person` for it to live in. `age` is declared separately in `Teacher` (`25`), `Student` (`20`), and `TA` (`27`), never in `Person`. So `t.age` is unambiguous for another reason: `TA::age` (`27`) hides the inherited `Teacher::age` and `Student::age`, and you reach the others with `t.Teacher::age` / `t.Student::age`. Had `age` instead lived in `Person`, virtual inheritance would again give one shared copy (fine), while a non-virtual diamond would give two `Person`s, making `t.age` ambiguous and forcing the same qualification you saw break `t.name` above.

The L06 program (`code/lectures/L06/main.cpp`) prints from every constructor and destructor. Step through it to see the shared `Person` built once, first, by the most-derived class, and destroyed last:

```artifact src=demos/trace-l06-diamond.jsx
```

## Practice

First predict the dispatch itself. Step to the `ptr->intro()` call and, before revealing it, decide which body runs when a `person*` points at a `student`:

```artifact src=demos/practice-06-predict.jsx
```

Then the conceptual round — virtual dispatch, abstract classes, and the diamond are the core of the C++ OOP material:

```artifact src=demos/practice-06-mcq.jsx
```
