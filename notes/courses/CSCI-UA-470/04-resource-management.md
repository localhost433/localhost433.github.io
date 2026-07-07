---
title: Copy, Operators & Resource Management
date: "2026-05-27/06-01"
---

## Where objects live

An object can be created on the **stack**, on the **heap**, or as a **global**, and a reference can alias any of them.

```cpp
class Circle { public: string color; int radius; };

Circle  c1;                 // stack
Circle& c2 = c1;            // reference (alias for c1)
Circle* c3 = new Circle();  // heap
delete c3;                  // free the heap object
c3 = nullptr;
```

## Static members

A `static` attribute belongs to the **class**, not to any single object -- every object shares the one copy. A common use is counting how many instances currently exist.

```cpp
class Phone {
private:
    static int counter;   // shared by ALL Phone objects
    string color;
    int    height;
public:
    Phone()                  { counter++; }
    Phone(string c, int h)   { color = c; height = h; counter++; }
    ~Phone()                 { counter--; }

    static int getCounter()  { return counter; }   // static method
};

int Phone::counter = 0;   // define/initialize once, OUTSIDE the class
```

- Access static members through the class name: `Phone::getCounter()`.
- A `static` method has **no `this`**, so it can only use other static members.

You can also add utility methods like `resetCounter` -- for example, in a `Circle` counter:

```cpp
class Circle {
    static int counter;                 // one copy for the whole class
public:
    Circle() { counter++; }
    static void resetCounter() { counter = 0; }
};

int Circle::counter = 0;                // initialize once, outside the class
```

- Accessed through the class: `Circle::counter`, `Circle::resetCounter()`.

Where do these actually live in memory? Step through it -- the static members sit in Global/Static, *outside* every object, and the static method is a plain Code-segment function with no `this`:

```artifact src=demos/mem-static.jsx
```

### Static *local* variables

A `static` inside a **function** is a different thing from a static class member. A function-scope `static` lives in Global/Static storage -- *not* on the stack -- so it is initialized once and **keeps its value between calls**:

```cpp
void f1() {
    static int x = 0;   // initialized ONCE, persists across calls
    x++;
    cout << x;
}

int main() {
    f1();   // 1
    f1();   // 2
    f2();   // (f2 has its own separate static)
}
```

Each call to `f1` resumes from the last value -- the two calls print `1` then `2` -- because the variable is not re-created on the stack each time the function runs. A different function `f2` gets its own independent static variable.

## Operator overloading

C++ lets you define what built-in operators mean for *your* types. The `circle` class overloads arithmetic so you can "add" two circles:

```cpp
circle operator+(circle c) {
    circle temp;
    temp.set_radius(radius + c.radius);
    temp.set_color(color + " and " + c.color);
    return temp;
}
```

Writing `c3 = c1 + c2;` is shorthand for `c3 = c1.operator+(c2);` -- the **left** operand is the object the method runs on, and the **right** operand is the argument.

The course's `circle` overloads `+`, `-`, `*`, `/`, and `%`, each returning a brand-new `circle`. Guard partial operations -- for example, `operator/` checks for a zero radius before dividing:

```cpp
circle operator/(circle c) {
    circle temp;
    if (c.radius != 0) temp.set_radius(radius / c.radius);
    temp.set_color("white");
    return temp;
}
```

Trace the actual `code/lectures/L03/main.cpp`: two circles `c1 = {red, 10}` and `c2 = {blue, 5}`, then a chain of overloaded operators. The console shows exactly what the compiled program prints:

```artifact src=demos/trace-l03.jsx
```

### A container motivates the operators

Overloading isn't just for arithmetic. Consider a `List` you build up and then query:

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

Now the natural things to *do* with a list all want overloaded operators:

- `l1 == l2` -- overload `operator==` to compare contents (returns `true`/`false`),
- `l1 != l2` -- overload `operator!=` for the negation,
- `cout << l1;` -- overload `operator<<` to print the whole list.

Without these, `==` would compare objects member-by-member (or not compile) and `cout << l1` would have no meaning at all -- so a real container class defines them.

## Default copy semantics

The statement `c1 = c2;` invokes the **assignment operator** `operator=`. The compiler gives you a default that copies members one by one. That default -- together with the default **copy constructor** -- is fine for value attributes but dangerous once a class holds a **pointer** -- exactly the problem the copy constructor and deep-copy sections below tackle.

## The copy constructor

The **copy constructor** builds a new object as a copy of an existing one. It takes a `const` reference to the source:

```cpp
Circle(const Circle& other) {
    color  = other.color;
    radius = other.radius;
}
```

It runs whenever you:

- initialize one object from another -- both `Circle c2(c1);` (direct-init) and `Circle c2 = c1;` (copy-init) invoke the copy constructor,
- pass an object **by value** to a function, or
- **return** an object by value.

If you write none, the compiler supplies a **default** copy constructor that copies the members one by one -- a **shallow copy**.

### Shallow vs. deep copy -- why it matters

If an attribute is a **pointer**, a shallow copy duplicates the *pointer*, not the data it points to. Now two objects share one heap allocation -- and both destructors will try to `delete` it (double free / dangling pointer).

```cpp
class Circle {
    string color;
    int*   radius;                       // owns heap memory
public:
    Circle() { color = "Red"; radius = new int(0); }

    Circle(const Circle& o) {            // DEEP copy
        color  = o.color;
        radius = new int(*o.radius);     // its own separate allocation
    }

    ~Circle() {                          // clean up what we own
        delete radius;
        radius = nullptr;
    }
};
```

> **Rule of thumb:** if a class owns heap memory, define the **destructor**, the **copy constructor**, *and* the **assignment operator** together.

Watch a shallow copy share one heap allocation -- and the double free that follows -- then the deep copy that fixes it:

```artifact src=demos/mem-copy.jsx
```

See the two strategies stepped through side by side -- the same operation on the left (shallow) and right (deep):

```artifact src=demos/mem-copy-compare.jsx
```

### Why all three special members exist

Think about who *uses* a class. **Programmer-1** authors `circle` with a heap-owning `int* radius`, a constructor that allocates it, `// copy constructor` and `// assignment operator` left as stubs, and a destructor that frees it:

```cpp
class circle {
public:
    string color;
    int*   radius;
    circle() { color = "Red"; radius = new int(0); }
    // copy constructor          (left empty by programmer-1)
    // assignment operator       (left empty by programmer-1)
    ~circle() { delete radius; radius = nullptr; }
};
```

Now several *other* programmers use it independently, each writing whatever they need:

```cpp
circle c1;                                   // programmer-2
circle c2;                                   // programmer-3
circle* c3 = new circle(); delete c3;        // programmer-4
```

Programmer-1 can't see how each of them will copy, assign, or destroy circles. The moment someone writes `circle a = c1;` or `c2 = c1;`, the compiler-supplied shallow copy makes two objects share one `radius` allocation -- and both destructors will `delete` it. Because the class **owns heap memory**, programmer-1 must define all three -- the copy constructor, the assignment operator, *and* the destructor -- so it stays safe for every independent user.

## The assignment operator

`c1 = c2;` calls `operator=`. The default does a member-wise (shallow) copy -- the same pitfall as the copy constructor for pointer members.

```cpp
Circle& operator=(const Circle& o) {
    if (this != &o) {            // guard against self-assignment (c1 = c1)
        delete radius;           // free the memory we already hold
        color  = o.color;
        radius = new int(*o.radius);
    }
    return *this;                // return *this so a = b = c can chain
}
```

The difference from the copy constructor: the copy constructor builds a **brand-new** object, while `operator=` replaces the contents of an object that **already exists** -- so it must release its old resources first.

## Overloading `<<` and `>>` with friend functions

To make `cout << c` and `cin >> c` work, overload the stream operators. They can't be members (the **left** operand is the stream, not your object), so they're free functions -- declared `friend` so they may read private data:

```cpp
class Circle {
    string color;
    double radius;
public:
    Circle(string c, double r) : color(c), radius(r) {}

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

This is exactly `code/lectures/L04/main.cpp`. Trace it -- typing `green 4.5` at the prompt -- to see the friend operators read into and print from `c3`:

```artifact src=demos/trace-l04.jsx
```

## `friend` functions and classes

A `friend` may access the **private** members of the class that grants the friendship.

```cpp
class Person {
private:
    string SSN;                 // private
    int    age;                 // private
public:
    string name;                // public
    friend void f();            // a friend function
    friend class Manager;       // a friend class: Manager can see SSN and age
};
```

Only `name` is public; `SSN` and `age` are both private. That shapes what code outside the class may read:

| Accessor | `p.SSN` (private) | `p.age` (private) | `p.name` (public) |
| --- | --- | --- | --- |
| Non-friend `f()` | ✗ | ✗ | ✓ |
| Friend `f()` / `Manager` | ✓ | ✓ | ✓ |

A non-friend function can only reach `name`; reading `SSN` or `age` fails to compile. Once `f` (or a `Manager` class) is declared a `friend`, it reads all three -- SSN, age, and name.

Use friendship sparingly -- it deliberately breaks encapsulation -- but it's the standard tool for stream operators like `<<` and for tightly-coupled helpers (e.g., a `Manager` that evaluates a `Person`).

The other way classes relate -- one class *deriving* from another and inheriting its members -- is covered in [Inheritance](note.html?course=CSCI-UA-470&note=05-inheritance).

## Practice

```artifact src=demos/practice-04.jsx
```
