import { mcq } from "@course";

/* note 22 practice — Visitor's dispatch rules, drilled on their own before the pattern
   naming pass. Every question here is decided by ONE fact: overload resolution is a
   compile-time rule that uses the DECLARED type of the argument, while virtual dispatch
   is a run-time rule that uses the actual type of the receiver. Java gives you late
   binding on the receiver and nowhere else.

   Q1 and Q2 are the two the exam actually asks, because both look like they should
   work. Q4 is the trade — the half of Visitor that gets left out of summaries. */

export default mcq({
  questions: [
    {
      stem: "`Visitor` declares the three overloads below and nothing else. What happens at the last line?",
      figure: {
        lang: "java",
        code: `abstract class Shape { }                  // no accept()
class Circle extends Shape { }

interface Visitor {
    void visit(Circle c);
    void visit(Rectangle r);
    void visit(Triangle t);
}

Shape   s = new Circle();
Visitor v = new Rotator();
v.visit(s);`,
      },
      choices: [
        { text: "It does not compile — no overload accepts a `Shape`", correct: true },
        { text: "It compiles, and the overload is chosen at run time" },
        { text: "It compiles, and `Rotator.visit(Circle)` then runs" },
        { text: "It compiles, and throws a `ClassCastException`" },
      ],
      why: "Overload resolution happens at **compile time** and can only use the *declared* type of the argument. `s` is declared `Shape`, and there is no `visit(Shape)` — so the program never gets far enough to have a run-time type. Java late-binds the **receiver** of a call and nothing else; an argument's dynamic type is never consulted. Giving `Shape` an `accept` method is precisely what moves the call to a place where the compiler can see a `Circle`.",
    },
    {
      stem: "A tidier design writes `accept` once in the base class instead of repeating it in every subclass. What breaks?",
      figure: {
        lang: "java",
        code: `abstract class Shape {
    void accept(Visitor v) { v.visit(this); }   // ONE accept, in the base
}
class Circle    extends Shape { }
class Rectangle extends Shape { }`,
      },
      choices: [
        { text: "`this` is statically a `Shape` — no overload fits", correct: true },
        { text: "The call is ambiguous between the three overloads" },
        { text: "`accept` is not inherited, so subclasses lose it" },
        { text: "`Visitor` must be abstract for this to compile" },
      ],
      why: "This is why the one-line `accept` is copied into every element class rather than factored up, and it is the least obvious thing about the pattern. Inside `Shape.accept` the compiler sees `this` as a `Shape`, so it is back to needing a `visit(Shape)` — the concrete type is lost *before* the visitor is called. The identical line inside `Circle.accept` is a different line, because there `this` is statically a `Circle`. **The duplication is load-bearing.**",
    },
    {
      stem: "How many run-time dispatches does `s.accept(v)` perform, and on which objects?",
      choices: [
        { text: "Two — one on the shape, one on the visitor", correct: true },
        { text: "Three — the shape, the visitor, the overload" },
        { text: "One — on the shape; `visit` is overloaded" },
        { text: "One — on the visitor; `accept` is not virtual" },
      ],
      why: "`accept` dispatches on the shape's run-time type; the `visit` call inside it dispatches on the visitor's. Two receivers, consulted one at a time — which is where the name **double dispatch** comes from. Choosing the overload is not a third dispatch: it was settled by the compiler before the program ran.",
    },
    {
      stem: "A stable `Shape` hierarchy with three visitors gains a `Pentagon`. What has to change?",
      choices: [
        { text: "The `Visitor` interface and all its implementers", correct: true },
        { text: "Nothing — `accept` already handles any new shape" },
        { text: "Only the `Visitor` interface; visitors inherit it" },
        { text: "Only `Pentagon` — it supplies its own `accept`" },
      ],
      why: "Visitor's trade, stated plainly. A new **operation** is free: one class, and nothing existing is reopened. A new **element** is expensive: the interface gains a declaration and every implementer must supply a body for it. So Visitor buys Open–Closed along one axis by spending it along the other — reach for it when the hierarchy is settled and the list of things you do to it is not.",
    },
  ],
});
