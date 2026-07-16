/* AUTO-GENERATED from practice-06-mcq.jsx by `npm run build:artifacts` — do not edit. */
import { mcq } from "@course";

/* note 06 practice — the heart of the C++ OOP material: virtual → late binding,
   the vtable/vptr mechanism and its cost, abstract classes and pure virtuals, and
   the diamond problem with virtual inheritance as its only real fix. */

export default mcq({
  questions: [{
    stem: "Same base pointer as the early-binding trap, but `intro()` is now `virtual`. What prints?",
    figure: {
      code: "struct Person  { virtual void intro(){ cout << \"person\";  } };\nstruct Student : Person { void intro(){ cout << \"student\"; } };\n\nStudent s1;\nPerson* ptr = &s1;\nptr->intro();        // ?",
      lang: "cpp"
    },
    choices: [{
      text: "\"student\" — `virtual` moves the choice to run time, so the object's actual type wins",
      correct: true
    }, {
      text: "\"person\" — the pointer's static type still decides"
    }, {
      text: "A compile error — you cannot override a virtual"
    }, {
      text: "\"personstudent\" — both bodies run"
    }],
    why: "Marking the method `virtual` switches from early to **late (dynamic) binding**: the call is resolved at **run time** from the object the pointer actually references. `ptr` points at a `Student`, so `Student::intro` runs. This is the one change that makes polymorphism work."
  }, {
    stem: "Mechanically, how does a `virtual` call find the right function, and what does it cost per object?",
    choices: [{
      text: "object → **vptr** → **vtable** → function; the first virtual adds one hidden 8-byte `vptr` to **every object**, while the vtable is shared **one per class**",
      correct: true
    }, {
      text: "Each object stores a full copy of the vtable; no per-object pointer is added"
    }, {
      text: "The compiler inlines the correct function, so there is no runtime cost or extra storage"
    }, {
      text: "Each call does a linear search of the class hierarchy by method name"
    }],
    why: "A class with virtuals has one **vtable** (an array of function pointers, indexed by a fixed compile-time offset). Each **object** stores a hidden **vptr** to its class's vtable. A virtual call dereferences the vptr, indexes the slot, and jumps. Cost: **8 bytes per object** for the vptr; the vtable itself is shared per class."
  }, {
    stem: "What makes a C++ class **abstract**, and what can you do with an abstract type?",
    figure: {
      code: "class Person { public: virtual void intro() = 0; };",
      lang: "cpp"
    },
    choices: [{
      text: "At least one **pure virtual** (`= 0`) method makes it abstract: you can declare **pointers/references** to it but cannot create **objects**",
      correct: true
    }, {
      text: "The keyword `abstract` on the class; objects are still allowed"
    }, {
      text: "Any class with a virtual method; objects are forbidden"
    }, {
      text: "A class with no constructor; only the compiler can instantiate it"
    }],
    why: "A **pure virtual** method — `virtual void intro() = 0;` — has no body and makes its class **abstract**. `Person p;` is an error, but `Person* p;` and `Person& r = ...;` are fine. Abstraction: the base defines the interface, subclasses supply the bodies."
  }, {
    stem: "`Student` inherits a pure virtual `intro() = 0` from `Person` but never gives it a body. Can you write `Student s;`?",
    choices: [{
      text: "No — an inherited pure virtual left unimplemented keeps `Student` **abstract** too; only a subclass that implements *every* pure virtual becomes instantiable",
      correct: true
    }, {
      text: "Yes — any subclass of an abstract class is automatically concrete"
    }, {
      text: "Yes — `Student` inherits `Person`'s (empty) implementation"
    }, {
      text: "No — subclasses of abstract classes can never be instantiated"
    }],
    why: "A subclass is concrete only once it **implements every** inherited pure virtual. `Student`, having left `intro()` unimplemented, is **still abstract** — `Student s;` is an error, though `Student* t;` is fine. A subclass can also *re-declare* the method `= 0` to stay abstract on purpose."
  }, {
    stem: "In a plain (non-virtual) diamond — `TA : Teacher, Student`, both deriving from `Person` — why does `t.name` fail to compile?",
    figure: {
      code: "struct Person  { string name; };\nstruct Teacher : Person {};\nstruct Student : Person {};\nstruct TA : Teacher, Student {};\nTA t;\nt.name;   // ?",
      lang: "cpp"
    },
    choices: [{
      text: "`TA` contains **two** separate `Person` subobjects, so `name` is **ambiguous** — which copy? (`Person* p = &t;` is ambiguous too)",
      correct: true
    }, {
      text: "`name` is private in `Person`"
    }, {
      text: "`TA` forgot to declare `name`"
    }, {
      text: "It compiles fine and reads Teacher's copy"
    }],
    why: "Plain multiple inheritance gives each branch its **own** `Person`, so a `TA` holds **two** `Person` subobjects — two `name`s, two `age`s. An unqualified `t.name` cannot say which, so it is **ambiguous**. Even upcasting `Person* p = &t;` is ambiguous. Qualifying (`t.Teacher::name`) silences the error but keeps two copies — usually a bug."
  }, {
    stem: "Which repair actually gives the `TA` a **single, shared** `Person` subobject?",
    choices: [{
      text: "**Virtual inheritance** — `Teacher`/`Student` derive `virtual public Person`; the one `Person` is shared, reached through a hidden `vbptr` with a run-time offset",
      correct: true
    }, {
      text: "Qualifying every access as `t.Teacher::name`"
    }, {
      text: "Redefining `name` inside `TA`"
    }, {
      text: "Making `name` `public` in `Person`"
    }],
    why: "Only **virtual inheritance** removes the *cause* — the duplicated base. With `virtual public Person`, `TA` carries **one** shared `Person`, relocated to the end of the object; each branch finds it via a `vbptr` storing a **run-time** offset (it depends on the complete object). Qualifying and redefining only treat the name-clash symptom while two `Person`s remain."
  }]
});