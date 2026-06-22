---
title: Polymorphism & Abstract Classes
date: "2026-06-17"
---

Picking up where note 08 left off (inheritance in Java), this note is the *payoff* of OOP: write code against a **base type** and let each object supply its own behavior. We build it up the way the lecture did -- a concrete, type-specific program refactored, version by version, into a polymorphic design -- and finish with how to **shape the hierarchy** itself.

Running example: a `Game` that draws a screen full of random shapes.

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

The next step past an abstract class -- where *every* method is abstract -- is an **interface**. For its definition and a side-by-side concrete/abstract/interface comparison, see [OOP: The Four Pillars](note.html?course=CSCI-UA-470&note=10-oop-pillars#concrete-vs-abstract-vs-interface).

## v5 -- designing the hierarchy

Polymorphism is only as good as the **tree** you put classes in. Dumping every class as a direct child of one base is a flat list, not a design:

```
Shape <- Circle, Rectangle, Triangle, Car, Bike, Student, Employee   // wrong: a Car is not a Shape
```

Group by genuine **"is-a"** relationships and introduce intermediate (often abstract) bases:

```
        Shape (abstract)        Vehicle (abstract)     Person (abstract)
        |-- Circle              |-- Car                |-- Student
        |-- Rectangle           `-- Bike               `-- Employee
        `-- Triangle
```

```artifact src=demos/uml-v5.jsx static
```

**The test for an edge:** "*is* a `Student` a `Person`?" yes $\to$ `Student extends Person`. "*is* a `Car` a `Shape`?" no $\to$ different tree. Shared behavior (`draw()`, `move()`, `speak()`) lives on the **base**; specifics live on the leaves.

## C++ <-> Java quick reference

| Concept | C++ | Java |
|---|---|---|
| Inherit | `class D : public B` | `class D extends B` |
| Virtual dispatch | `virtual` (opt-in) | always on |
| Override marker | `override` | `@Override` |
| Pure virtual / abstract method | `virtual f() = 0;` | `abstract f();` |
| Abstract class | has a pure virtual | `abstract class` |
| Base handle to a derived object | pointer/reference (`B*`, `B&`) | reference (`B b = new D();`) |
