import { mcq } from "@course";

/* Discrete-fact MCQ on Java polymorphism & design. No score — pick shows ✓/✗ + why. */
export default mcq({
  questions: [
    {
      stem: "Overriding vs overloading: which is resolved at **run time**?",
      choices: [
        { text: "Overriding (same signature in a subclass)", correct: true },
        { text: "Overloading (same name, different parameters)" },
        { text: "Both are resolved at run time" },
        { text: "Both are resolved at compile time" },
      ],
      why: "**Overriding** is dynamic dispatch — the runtime class picks the body. **Overloading** is chosen by the compiler from the static argument types, so it's resolved at compile time.",
    },
    {
      stem: "Given `Drawable d = new Circle();`, what must be true for this to compile?",
      figure: { code: "interface Drawable { void draw(); }\nclass Circle implements Drawable { public void draw() {} }", lang: "java" },
      choices: [
        { text: "`Circle` must `implements Drawable`", correct: true },
        { text: "`Circle` just needs a `draw()` method with the right signature" },
        { text: "`Drawable` must be an abstract class, not an interface" },
        { text: "`Circle` must extend `Drawable`" },
      ],
      why: "Java is **nominally** typed: a handle of interface type accepts an object only if its class actually **`implements`** that interface — having a matching method by coincidence is not enough.",
    },
    {
      stem: "True or false: a class with an `abstract` method can still be instantiated with `new`.",
      choices: [
        { text: "True" },
        { text: "False", correct: true },
      ],
      why: "A class with any `abstract` method is itself `abstract` and **cannot** be instantiated. Only a concrete subclass that implements every abstract method can be `new`-ed.",
    },
    {
      stem: "What does the `@Override` annotation do?",
      choices: [
        { text: "Makes the compiler check the method actually overrides a supertype method", correct: true },
        { text: "Forces the method to be dispatched dynamically (otherwise it wouldn't be)" },
        { text: "Marks the method `final` so it can't be overridden further" },
        { text: "Nothing — it's required syntax for every override" },
      ],
      why: "`@Override` is a **compile-time check**: if the method doesn't match a supertype method (e.g. a typo'd signature), compilation fails. It doesn't change dispatch — Java methods are already virtual by default.",
    },
  ],
});
