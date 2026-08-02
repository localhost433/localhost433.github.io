import { mcq } from "@course";

/* note 07 practice — templates as compile-time monomorphization: a template emits
   no code by itself, each type argument stamps out a separate concrete function or
   class, resolved entirely at compile time with no runtime cost — and the
   one-type-parameter constraint that forces every argument to the same type. */

export default mcq({
  questions: [
    {
      stem: "What does the compiler do the first time you call `max<T>` with `int`, then with `double`?",
      choices: [
        { text: "**Stamps out** separate concrete functions at compile time", correct: true },
        { text: "Compiles one generic function that inspects the type at runtime" },
        { text: "Boxes each argument into a shared base type at runtime" },
        { text: "Emits template machine code once and uses casts at runtime" },
      ],
      why: "This is **monomorphization**. A template emits **no machine code by itself**; each distinct type argument makes the compiler generate a separate concrete instantiation (`max<int>`, `max<double>`, …), all resolved at **compile time**. Calling again with a type already seen reuses that instantiation.",
    },
    {
      stem: "What is the **runtime** cost of using a template versus a hand-written function for that type?",
      choices: [
        { text: "None — templates are fully resolved at compile-time", correct: true },
        { text: "A vtable lookup on every call, like virtual dispatch" },
        { text: "A boxing/unboxing step for each argument passed" },
        { text: "A dynamic type check that throws on mismatch" },
      ],
      why: "Templates are a **compile-time** mechanism. Each instantiation is fully type-checked and generates concrete code with **no runtime cost** — it is exactly as if you had written the type-specific function yourself.",
    },
    {
      stem: "With `template <class T> void f(T x1, T x2)`, which call is an error?",
      figure: { code: "template <class T> void f(T x1, T x2) { }\nPerson p1, p2;  Circle c1;\nf(p1, p2);   // (1)\nf(p1, c1);   // (2)", lang: "cpp" },
      choices: [
        { text: "(2) — one `T` forces both arguments to a single type", correct: true },
        { text: "(1) — a template cannot take two arguments" },
        { text: "Neither — `T` deduces separately per argument" },
        { text: "Both — templates reject all class types" },
      ],
      why: "A single type parameter `T` binds to **one** type for the whole call, so `f(p1, p2)` is fine but `f(p1, c1)` fails — `T` can't be `Person` and `Circle` at once. To allow different types, use two parameters: `template <class T1, class T2> void f(T1, T2)`.",
    },
    {
      stem: "For a class template `Box<T>`, how do `Box<int>` and `Box<double>` relate?",
      choices: [
        { text: "Separate, unrelated classes with different layouts", correct: true },
        { text: "The same class; `T` is only a runtime tag on it" },
        { text: "`Box<int>` is the base class of `Box<double>`" },
        { text: "Interchangeable, since `int` converts to `double`" },
      ],
      why: "A class template is a **recipe for a family of types**: each distinct type argument stamps out a **separate, unrelated** concrete class with its own object layout and size. `Box<int>` and `Box<double>` share no inheritance relationship and are **not assignable** to each other.",
    },
    {
      stem: "In `template <typename T>` vs `template <class T>`, what is the difference?",
      choices: [
        { text: "None — `typename` and `class` are interchangeable here", correct: true },
        { text: "`class` accepts only class types; `typename` only primitives" },
        { text: "`typename` allows several parameters; `class` allows only one" },
        { text: "`class` instantiates at compile time; `typename` at run time" },
      ],
      why: "When declaring a template type parameter, `typename` and `class` mean exactly the **same thing** — the choice is stylistic. (`class` there does *not* restrict the argument to class types; `f<int>` is still fine.)",
    },
  ],
});
