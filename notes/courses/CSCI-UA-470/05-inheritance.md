---
title: Inheritance
date: "2026-06-03"
---

## Inherited attributes

A subclass gets a copy of every base-class attribute *plus* its own. If a name is reused, **both** versions exist -- you disambiguate with the scope-resolution operator.

```cpp
class Person {
public:
    int    id   = 0;
    string name = "James";
};

class Student : public Person {   // Student IS-A Person
public:
    int    id  = 5;               // shadows Person::id
    double gpa = 3.0;
};

Student s;
```

The object `s` physically holds **four** slots -- `Person::id`, `Person::name`, `id`, `gpa`:

| Access | Resolves to |
|---|---|
| `s.id` | `5` (the subclass's own) |
| `s.Person::id` | `0` (the inherited one) |
| `s.name` | `"James"` |
| `s.Person::name` | `"James"` |
| `s.gpa` | `3.0` |

## How a derived object is laid out in memory

Inheritance isn't magic -- under the hood it's just **struct embedding**. A derived object begins with the *entire* base subobject laid out inline at **offset 0**, then appends its own members after it. So a `student` is literally "a `person`, followed by the extra `student` fields."

The payoff is that **`&derived` and `(base*)&derived` are the same address**: upcasting to a base pointer costs nothing and moves nothing -- it just narrows which members are visible. Step through the layout and the two pointers:

```artifact src=demos/mem-inheritance.jsx
```

(The hidden `vptr` appears here only because `person` has a `virtual` function -- see [polymorphism](note.html?course=CSCI-UA-470&note=06-polymorphism). Whether the inheritance is `public`, `protected`, or `private` changes *access*, not these bytes.)

## Construction and destruction order

When a derived object is created, its sub-objects are built **base-first** -- the most-derived constructor body runs *last*. Destruction is the exact reverse. The L05 program (`code/lectures/L05`) makes this visible by printing from every constructor and destructor; step through what it actually prints:

```artifact src=demos/trace-l05.jsx
```

## Changing the visibility of an inherited member

Suppose `Person::name` becomes **private** in the base (or the subclass uses non-public inheritance) and you want `name` visible again in the subclass. Two options:

**Option 1 -- `using` (re-expose the same member):**

```cpp
class Student : private Person {
public:
    double gpa = 3.0;
    using Person::name;          // bring Person::name back into public scope
};
```

**Option 2 -- redefine (declare a new attribute with the same name):**

```cpp
class Student : private Person {
public:
    double gpa  = 3.0;
    string name = "James";       // a brand-new attribute, separate from Person's
};
```

The difference: `using` keeps **one** shared member; redefining creates a **second**, independent slot in the object.

## Multiple inheritance

C++ lets a class inherit from more than one base at once.

```cpp
class Student { public: string name; };
class Teacher { public: double salary; };

class TA : public Student, public Teacher {
public:
    string course_name;
};

TA t;
// t has: Student::name, Teacher::salary, course_name
```

`t` accumulates the members of every base, in order, plus its own.

In memory that ordering has a consequence worth seeing: the bases are laid out one after another, so only the **first** base shares the object's starting address. A pointer to a *later* base must be **adjusted** to point at that base's subobject -- `(B*)&obj` is not the same address as `&obj`. Step through it:

```artifact src=demos/mem-multi.jsx
```

## Ambiguity

When two bases declare the **same** name, an unqualified reference is ambiguous and won't compile:

```cpp
class Student { public: int id = 0; string name; };
class Teacher { public: int id = 1; double salary; };

class TA : public Student, public Teacher { /* ... */ };

TA t;
t.Student::id;   // 0  -- OK, qualified
t.Teacher::id;   // 1  -- OK, qualified
t.id;            // ERROR: ambiguous -- which id?
```

Resolve it the same two ways as before:

- **`using`** to pick one: `using Student::id;` inside `TA` makes the bare `t.id` mean `Student::id`.
- **Redefine** `id` in `TA` (e.g. `int id = 7;`) so `t.id` refers to `TA`'s own member; the base versions remain reachable as `t.Student::id` / `t.Teacher::id`.

## The map of class relations

Two classes can relate in two broad ways:

- **Friendship** -- function-class or class-class (`friend`, see [Resource Management](note.html?course=CSCI-UA-470&note=04-resource-management)).
- **Inheritance**:
  - **Single** -- one base. *Single-level* (A -> B) or *multi-level* (A -> B -> C).
  - **Multiple** -- several bases. Also single- or multi-level.

Each inheritance link carries a **mode** -- `private`, `protected`, or `public` -- controlling how the base's members surface in the subclass. Multiple inheritance is what eventually leads to the *diamond problem* (covered under **Polymorphism & Virtual Functions**).

The two inheritance shapes at a glance:

```artifact src=demos/class-relations.jsx static
```
