/* AUTO-GENERATED from practice-05-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 05 practice — inheritance mechanics, with the EARLY-BINDING trap as the
   headline (a base pointer to a derived object calls the BASE method without
   `virtual`), plus layout (upcast is free), construction order, multiple-
   inheritance pointer adjustment, shadowing, and using-vs-redefine. */

export default mcq({
  questions: [{
    stem: "`ptr` points at a `Student`, but `intro()` is **not** `virtual`. What prints?",
    figure: {
      code: "struct Person  { void intro(){ cout << \"person\";  } };\nstruct Student : Person { void intro(){ cout << \"student\"; } };\n\nStudent s1;\nPerson* ptr = &s1;   // base pointer, Student object\nptr->intro();        // ?",
      lang: "cpp"
    },
    choices: [{
      text: "\"person\" — without `virtual`, the call binds to the pointer's **static type** `Person*`",
      correct: true
    }, {
      text: "\"student\" — the object really is a `Student`"
    }, {
      text: "A compile error — `intro` is ambiguous"
    }, {
      text: "\"personstudent\" — both run, base first"
    }],
    why: "This is **early (static) binding**: with no `virtual`, the compiler picks the method from the expression's **declared type**, `Person*`, ignoring that the object is actually a `Student`. So `Person::intro` runs and the override is never reached. Making it dispatch on the runtime type is exactly what `virtual` (note 06) is for."
  }, {
    stem: "A `Student` derives from `Person`, each with a constructor and destructor. In what order do they run for one `Student` object?",
    choices: [{
      text: "Construct `Person` then `Student`; destroy `Student` then `Person` (destruction is the reverse of construction)",
      correct: true
    }, {
      text: "Construct `Student` then `Person`; destroy `Person` then `Student`"
    }, {
      text: "Construct and destroy both in the same order: `Person` then `Student`"
    }, {
      text: "Only the most-derived constructor and destructor run"
    }],
    why: "A derived object is built **base-first** — the base subobject is fully constructed before the derived constructor body runs — because the derived part may depend on the base being ready. **Destruction is the exact reverse**: most-derived first, base last."
  }, {
    stem: "Under **single** inheritance, how does `&d` (a `Derived*`) relate to `(Base*)&d`?",
    choices: [{
      text: "Same address — the base subobject sits at offset 0, so upcasting moves nothing; it just narrows which members are visible",
      correct: true
    }, {
      text: "Different addresses — the base is stored after the derived members"
    }, {
      text: "Same value only if `Base` has no attributes"
    }, {
      text: "The cast is illegal without `dynamic_cast`"
    }],
    why: "Inheritance is struct embedding: a `Derived` begins with the **entire** `Base` subobject at **offset 0**, then appends its own members. So `&d` and `(Base*)&d` are the **same address** — upcasting to a base pointer costs nothing and moves nothing."
  }, {
    stem: "With **multiple** inheritance, `class TA : public Student, public Teacher`. Is `(Teacher*)&t` the same address as `&t`?",
    figure: {
      code: "class TA : public Student, public Teacher { ... };\nTA t;\n(Student*)&t;   // == &t ?\n(Teacher*)&t;   // == &t ?",
      lang: "cpp"
    },
    choices: [{
      text: "No — only the **first** base (`Student`) shares `&t`; a pointer to a **later** base is adjusted to that subobject's offset",
      correct: true
    }, {
      text: "Yes — every base pointer equals `&t`"
    }, {
      text: "No — neither base pointer equals `&t`"
    }, {
      text: "Yes, but only because the bases have the same size"
    }],
    why: "The bases are laid out one after another, so only the **first** (`Student`) starts at the object's address. `Teacher`'s subobject sits further in, so `(Teacher*)&t` is **adjusted** by that offset — it is *not* `&t`. This pointer fix-up is a real cost of multiple inheritance."
  }, {
    stem: "`Student` shadows `Person`'s `id` with its own. Given `Student s;`, what are `s.id` and `s.Person::id`?",
    figure: {
      code: "struct Person  { int id = 0; };\nstruct Student : Person { int id = 5; };\nStudent s;",
      lang: "cpp"
    },
    choices: [{
      text: "`s.id` is 5 (the subclass's own); `s.Person::id` is 0 — both slots physically exist",
      correct: true
    }, {
      text: "Both are 5 — the derived `id` replaces the base one"
    }, {
      text: "Both are 0 — the base `id` wins"
    }, {
      text: "`s.id` is ambiguous and will not compile"
    }],
    why: "When a derived class reuses an attribute name, **both** slots exist in the object. The unqualified `s.id` refers to the derived member (5); the inherited one is still reachable via the scope-resolution operator, `s.Person::id` (0)."
  }, {
    stem: "To re-expose a base member hidden by `private` inheritance, what is the difference between `using Person::name;` and redefining `string name;` in the subclass?",
    choices: [{
      text: "`using` keeps **one** shared member (the base's); redefining creates a **second, independent** slot",
      correct: true
    }, {
      text: "They are equivalent — both alias the base member"
    }, {
      text: "`using` creates a new slot; redefining aliases the base one"
    }, {
      text: "Only redefining compiles; `using` is not valid for attributes"
    }],
    why: "`using Person::name;` brings the **same** base member back into scope — one shared slot. Redefining `string name;` declares a **brand-new** attribute that shadows the base's, so the object now holds **two** independent `name` slots."
  }]
});