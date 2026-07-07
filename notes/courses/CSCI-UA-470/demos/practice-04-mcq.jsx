import { mcq } from "@course";

/* Discrete-fact MCQ on C++ resource management. No score. */
export default mcq({
  questions: [
    {
      stem: "The **Rule of Three**: if a class needs one of these, it usually needs all three. Which set?",
      choices: [
        { text: "Destructor, copy constructor, copy assignment operator", correct: true },
        { text: "Constructor, destructor, `main`" },
        { text: "Copy constructor, move constructor, destructor" },
        { text: "Getter, setter, constructor" },
      ],
      why: "A class that manages a resource (owns a heap allocation) needs a **destructor** to free it, a **copy constructor** and **copy assignment operator** to copy it deeply — otherwise the compiler's shallow defaults cause double-frees.",
    },
    {
      stem: "If you write no special members, which does the compiler generate for you?",
      choices: [
        { text: "A default constructor, copy constructor, copy assignment, and destructor", correct: true },
        { text: "Only a default constructor" },
        { text: "Nothing — you must write all of them" },
        { text: "Only a destructor" },
      ],
      why: "The compiler synthesizes a default constructor (if you declare no constructor), plus a copy constructor, copy assignment operator, and destructor — all **memberwise / shallow**, which is exactly why owning classes must define their own.",
    },
    {
      stem: "What's the difference between the copy constructor and the copy assignment operator?",
      figure: { code: "Circle b = a;   // (1)\nCircle c;\nc = a;          // (2)", lang: "cpp" },
      choices: [
        { text: "(1) constructs a new object from `a`; (2) replaces an already-constructed `c`", correct: true },
        { text: "They are the same thing with different syntax" },
        { text: "(1) is shallow, (2) is always deep" },
        { text: "(2) constructs a new object; (1) replaces an existing one" },
      ],
      why: "Line (1) **initializes** a brand-new object → the **copy constructor**. Line (2) **assigns** to an already-existing `c` → the **copy assignment operator**, which must also release `c`'s old resource first.",
    },
    {
      stem: "True or false: dereferencing a pointer after `delete` (a dangling pointer) is well-defined and simply returns the old value.",
      choices: [
        { text: "True" },
        { text: "False", correct: true },
      ],
      why: "Using a pointer after `delete` is **undefined behavior** — the memory may be reused or unmapped. It might appear to \"work,\" crash, or corrupt data; none of it is guaranteed.",
    },
  ],
});
