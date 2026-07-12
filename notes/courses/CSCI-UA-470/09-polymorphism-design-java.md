---
title: Polymorphism & Abstract Classes
date: "2026-06-17"
---

## v1 -- concrete and type-specific

The first cut knows about exactly one kind of shape.

```java
class Circle {
    private String color;
    private int x, y, radius;
    Circle(String c, int x, int y, int r) {
        this.color = c; this.x = x; this.y = y; this.radius = r;
    }
    public void draw() { /* draw a circle */ }
}

class Game {
    public static void main(String[] args) {
        String[] colors = {"Red", "yellow", "blue"};
        Random r = new Random();
        for (int i = 0; i < 100; i++) {
            int x = r.nextInt(10), y = r.nextInt(10), rad = r.nextInt(10);
            int c = r.nextInt(3);
            Circle circle = new Circle(colors[c], x, y, rad);
            circle.draw();
        }
    }
}
```

It works, but the moment you want rectangles and triangles too, every line that mentions `Circle` has to be duplicated. The program is **welded to one concrete type**.

## v2 -- a hierarchy with a `type` tag (and its smell)

Factor the shared state (`color`, `x`, `y`) into a `Shape` base class and let each kind extend it:

```java
class Shape {
    String color;
    int x, y;
    public void draw() { /* generic / empty */ }
}
class Circle    extends Shape { int radius; }
class Rectangle extends Shape { int width, length; }
class Triangle  extends Shape { int base, height; }
```

Now the `Game` can hold a `Shape` reference -- but it still decides *which* subclass to build with an `if`/`else` chain keyed on a `type`:

```java
int type = r.nextInt(3);
Shape s;
if      (type == 1) s = new Circle(colors[c], x, y, rad);
else if (type == 2) s = new Triangle(/* ... */);
else if (type == 3) s = new Rectangle(/* ... */);
s.draw();
```

> **The smell.** That `if`/`else` ladder grows by one branch *every* time you add a shape. Code that must be edited whenever the data changes is fragile -- and if you also branched on `type` to choose *how to draw*, you'd have a second ladder to maintain.

```artifact src=demos/uml-v2.jsx static
```

## v3 -- polymorphism: let the object decide

Give each subclass its **own** `draw()`:

```java
class Circle extends Shape {
    int radius;
    public void draw() { /* draw a circle */ }
}
class Rectangle extends Shape { /* ... */ public void draw() { /* draw a rectangle */ } }
class Triangle  extends Shape { /* ... */ public void draw() { /* draw a triangle */ } }
```

Then the entire drawing logic is **one line**:

```java
Shape s = /* some Circle, Rectangle, or Triangle */;
s.draw();   // dispatches to the object's actual runtime type
```

`s` is *declared* `Shape`, but at run time it **is** a `Circle` (or ...), so `s.draw()` runs `Circle.draw()`. To add a `Pentagon`, you write a `Pentagon extends Shape` with its own `draw()` -- and the drawing loop **never changes**. The behavior travels with the object, not with a `switch`.

```artifact src=demos/uml-v3.jsx static
```

```artifact src=demos/draw-dispatch.jsx
```

**Two C++ contrasts worth flagging:**

| | C++ | Java |
|---|---|---|
| Overridable methods | opt-in: must mark `virtual` | **every** method is virtual by default |
| Marking an override | `override` (optional) | `@Override` (optional, recommended) |
| Base reference to derived | `Shape*` / `Shape&` | a plain `Shape` variable (references only) |

So in Java you get polymorphic dispatch *for free* -- there is no `virtual` keyword because it's always on.

**What polymorphism did NOT remove:** the **construction** `if`/`else` (deciding which subclass to `new`) is still there. Choosing *which* object to create from data is a separate problem, usually solved with a **factory** -- a topic for later.

The machinery behind "always on" is a per-class **method table**: each object header carries a pointer to its class's table, and a call resolves to a fixed slot in it. Overriding swaps just that one slot, so the object's class decides which body runs:

```artifact src=demos/java-dispatch.jsx
```

## v4 -- abstract classes & methods

In v3, `Shape` itself is meaningless -- there is no such thing as a generic "shape" you can draw. Make that explicit:

```java
abstract class Shape {
    String color;
    int x, y;
    public abstract void draw();   // no body -- subclasses MUST provide one
}
```

- An **abstract method** has no body; declaring one forces the class to be `abstract`.
- An **abstract class cannot be instantiated** -- `new Shape()` is a compile error. You can only `new` a *concrete* subclass that implements every abstract method.

```java
Cylinder c = new Cylinder();   // OK  -- Cylinder implements draw()
Shape    s = new Shape();      // ERROR -- Shape is abstract
Shape    s = new Cylinder();   // OK  -- base reference, concrete object
```

Adding `Cylinder extends Shape` *requires* you to write `draw()`, or the compiler rejects it -- the hierarchy enforces its own contract.

```artifact src=demos/uml-v4.jsx static
```

| | C++ | Java |
|---|---|---|
| Abstract method | pure virtual: `virtual void draw() = 0;` | `abstract void draw();` |
| Abstract class | any class with a pure-virtual method | marked `abstract class` |
| Can instantiate base? | no (has a pure virtual) | no (`abstract`) |

The next step past an abstract class -- where *every* method is abstract -- is an **interface**. For its definition and a side-by-side concrete/abstract/interface comparison, see [OOP: The Four Pillars](note.html?course=CSCI-UA-470&note=15-oop-pillars-roadmap#concrete-vs-abstract-vs-interface).

## v5 -- designing the hierarchy

Polymorphism is only as good as the **tree** you put classes in. Dumping every class as a direct child of one base is a flat list, not a design -- e.g. making `Circle`, `Rectangle`, `Triangle`, `Car`, `Bike`, `Student`, and `Employee` all extend `Shape`, which wrongly claims a `Car` *is a* `Shape`.

Group by genuine **"is-a"** relationships and introduce intermediate (often abstract) bases:

- **`Shape`** (abstract) -- `Circle`, `Rectangle`, `Triangle`
- **`Vehicle`** (abstract) -- `Car`, `Bike`
- **`Person`** (abstract) -- `Student`, `Employee`

```artifact src=demos/uml-v5.jsx static
```

**The test for an edge:** "*is* a `Student` a `Person`?" yes $\to$ `Student extends Person`. "*is* a `Car` a `Shape`?" no $\to$ different tree. Shared behavior (`draw()`, `move()`, `speak()`) lives on the **base**; specifics live on the leaves.

## v6 -- interface polymorphism: many handles onto one object

A subclass gets exactly **one** parent (`extends`), but a class can `implements` **any number** of interfaces. Each interface is a separate *capability* -- a promise to provide certain methods -- and an object can be referenced through **every** interface it declares.

Three tiny capability interfaces:

```java
interface Drawable { void draw(); }
interface Movable  { void move(); }
interface Flyable  { void fly();  }
```

Now wire the existing trees to them. Solid arrows are `extends` (is-a); dashed arrows are `implements` (can-do):

```java
// Shape branch -- Shape implements Drawable, so every shape is Drawable
abstract class Shape implements Drawable { public void draw() { /* ... */ } }
class Circle    extends Shape { }
class Rectangle extends Shape { }
class Triangle  extends Shape { }

// Vehicle branch -- Vehicle implements Movable, so every vehicle is Movable
abstract class Vehicle implements Movable { String model; public void move() { } }
class Car    extends Vehicle implements Drawable { public void draw() { } }
class Bike   extends Vehicle implements Drawable { public void draw() { } }
class Flight extends Vehicle implements Flyable  { public void fly()  { } }

// Person branch -- has draw()/move()/speak() BODIES but implements NOTHING
abstract class Person {
    String name;
    public void draw() { } public void move() { } public void speak() { }
}
class Student  extends Person implements Drawable { }  // opts in to Drawable
class Employee extends Person { }                       // does not

// Animal branch -- has draw()/move() BODIES but implements NOTHING
abstract class Animal { public void draw() { } public void move() { } }
class Bird    extends Animal implements Flyable { public void fly() { } }  // draw, move, fly
class Crawler extends Animal { }                                          // draw, move
```

Which class carries which capability:

| Class | `extends` | `implements` | `Drawable` | `Movable` | `Flyable` |
|---|---|---|---|---|---|
| `Circle` / `Rectangle` / `Triangle` | `Shape` | *(via `Shape`)* | yes | -- | -- |
| `Car` | `Vehicle` | `Drawable` | yes | via `Vehicle` | -- |
| `Bike` | `Vehicle` | `Drawable` | yes | via `Vehicle` | -- |
| `Flight` | `Vehicle` | `Flyable` | -- | via `Vehicle` | yes |
| `Student` | `Person` | `Drawable` | yes | -- | -- |
| `Employee` | `Person` | -- | -- | -- | -- |
| `Bird` | `Animal` | `Flyable` | -- | -- | yes |
| `Crawler` | `Animal` | -- | -- | -- | -- |

> **The subtle runtime point.** `Person` and `Animal` each *have* a `move()` (and `draw()`) method -- yet a `Bird`, `Crawler`, `Student`, or `Employee` is **not** a `Movable`. Java is **not** structurally typed: owning a method with the matching name/signature does not make you the interface. You are that interface only if you (or an ancestor) explicitly declare `implements Movable`. `Student` becomes `Drawable` purely by adding the `implements` clause -- it then satisfies it with the `draw()` body it *inherited* from `Person`.

### Interface-reference assignment

An interface handle can point at **any** object whose class implements that interface -- and at **nothing else**:

```java
Flyable f;
f = new Flight();   // OK -- Flight implements Flyable
f = new Bird();     // OK -- Bird   implements Flyable

Movable m;
m = new Car();      // OK -- via Vehicle
m = new Bike();     // OK -- via Vehicle
m = new Flight();   // OK -- via Vehicle
// m = new Student();  m = new Employee();  m = new Bird();  m = new Crawler();
//   -- all ERRORS: none of these declares `implements Movable`
//      (having a move() method is not enough)

Drawable d;
d = new Circle();    d = new Rectangle();   d = new Triangle();  // via Shape
d = new Car();       d = new Bike();                             // implement Drawable
d = new Student();                                               // implements Drawable
// d = new Vehicle();  d = new Flight();
//   -- ERRORS: Vehicle/Flight do not implement Drawable
```

Through `m`, the only thing you can call is `m.move()` -- the handle exposes exactly the interface's contract, regardless of the object's fuller runtime type. At run time the call still dispatches to the object's actual class body (a `Flight`'s `move()`, a `Car`'s `move()`), so **interface references are just another form of polymorphic dispatch** -- narrowed to one capability.

## Overloading vs. overriding

Two similar-sounding mechanisms that are resolved at **different times** -- keeping them straight is essential to reading polymorphic code.

```java
class Student {
    int    add(int n1, int n2)       { return n1 + n2; }   // \
    double add(double n1, double n2) { return n1 + n2; }   //  > OVERLOADING
    void intro() { System.out.println("I am a student"); }
}

class TA extends Student {
    @Override
    void intro() { System.out.println("I am a Teaching Assistant"); }  // OVERRIDING
}
```

- **Overloading** -- *same method name, different parameter lists*, in the **same** class. The two `add` methods are unrelated bodies that merely share a name. The compiler picks which one to call from the **argument types at the call site**, so overloading is resolved at **compile time** (static / early binding). `add(2, 3)` binds to `add(int,int)`; `add(2.0, 3.0)` binds to `add(double,double)`.
- **Overriding** -- *same signature* (name **and** parameter list), in a **subclass**, replacing the inherited method. `TA.intro()` shadows `Student.intro()`. The JVM picks which body runs from the **object's actual runtime type**, so overriding is resolved at **run time** (dynamic / late binding). A `Student s = new TA(); s.intro();` prints `"I am a Teaching Assistant"`.

| | Overloading | Overriding |
|---|---|---|
| Where | same class (or inherited alongside) | subclass replaces parent method |
| Signature | **different** parameter lists, same name | **identical** signature |
| Return type | may differ | same (or covariant) |
| Resolved | **compile time** -- from argument types | **run time** -- from the object's class |
| Binding | static / early | dynamic / late |
| Enables | convenient same-named variants | polymorphism |

> Overriding is the mechanism every earlier version on this page relied on -- `s.draw()` running `Circle.draw()` is late binding. Overloading is a compile-time convenience and has nothing to do with the object's runtime type.

## C++ <-> Java quick reference

| Concept | C++ | Java |
|---|---|---|
| Inherit | `class D : public B` | `class D extends B` |
| Virtual dispatch | `virtual` (opt-in) | always on |
| Override marker | `override` | `@Override` |
| Pure virtual / abstract method | `virtual f() = 0;` | `abstract f();` |
| Abstract class | has a pure virtual | `abstract class` |
| Base handle to a derived object | pointer/reference (`B*`, `B&`) | reference (`B b = new D();`) |

## Practice

```artifact src=demos/practice-09-compare.jsx
```

```artifact src=demos/practice-09-predict.jsx
```

```artifact src=demos/practice-09-mcq.jsx
```
