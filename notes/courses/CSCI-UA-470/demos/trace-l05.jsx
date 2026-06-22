import { scene, part, ladder } from "@course";

/* Traces code/lectures/L05/main.cpp: multi-level inheritance
   (person -> student -> gradStudent). Real run prints construction
   base-first, destruction in the exact reverse:
     person/student/gradStudent constructed
     ==============================
     gradStudent/student/person destroyed   */

const code =
`class person {
public:
    string name = "no name";
    person() {
        cout << "person constructed";
    }
    ~person() {
        cout << "person destroyed";
    }
};
class student : public person {
public:
    int id = 0;
    student() {
        cout << "student constructed";
    }
    ~student() {
        cout << "student destroyed";
    }
};
class gradStudent : public student {
public:
    string researchTopic = "no topic";
    gradStudent() {
        cout << "gradStudent constructed";
    }
    ~gradStudent() {
        cout << "gradStudent destroyed";
    }
};

int main() {
    gradStudent gs;
    cout << "==============================";
}`;

// the single `gs` object is built from three sub-object parts
const PP = part("(person)",      "base part", [{ name: "name", type: "string", size: 32, value: '"no name"' }], "pp");
const SP = part("(student)",     "part",      [{ name: "id", type: "int", value: "0" }], "sp");
const GP = part("(gradStudent)", "part",      [{ name: "researchTopic", type: "string", size: 32, value: '"no topic"' }], "gp");

const out = ladder([
  "person constructed",
  "student constructed",
  "gradStudent constructed",
  "==============================",
  "gradStudent destroyed",
  "student destroyed",
  "person destroyed",
]);

const steps = [
  { line: [4, 5], cells: [PP(true)], outputs: out(1),
    caption: {
      cpp: "`person()` is the leaf base constructor — it has no base class to delegate to.",
      asm: "`person::person:` opens the body; after the print it executes `ret` immediately — **no base `call`** needed.",
      intuition: "The root class is the first to finish constructing, so every derived class can build on top of it.",
    },
  },
  { line: [14, 15], cells: [PP(), SP(true)], outputs: out(2),
    caption: {
      cpp: "`student()` must ensure the `person` sub-object exists before it does its own work.",
      asm: "`student::student:` opens, then **`call person::person`** fires at the **top** of the body — base ctor runs first.",
      intuition: "The base `call` is at the **top**: base finishes before derived body — that is why construction goes base → derived.",
    },
  },
  { line: [24, 25], cells: [PP(), SP(), GP(true)], outputs: out(3),
    caption: {
      cpp: "`gradStudent()` must ensure both the `person` and `student` sub-objects exist first.",
      asm: "`gradStudent::gradStudent:` opens, then **`call student::student`** fires at the **top** — which in turn called `person::person`.",
      intuition: "Each derived ctor delegates upward immediately, so the **entire base chain** completes before the derived body runs.",
    },
  },
  { line: [33, 34], cells: [PP(), SP(), GP()], outputs: out(4),
    caption: {
      cpp: "`gs` is fully constructed; `main` prints the separator line.",
      asm: "`main:` calls **`call gradStudent::gradStudent`**, then the separator print, then **`call gradStudent::~gradStudent`** — destruction starts here.",
      intuition: "When `gs` goes out of scope at `}`, the compiler inserts the dtor call automatically — you never write it.",
    },
  },
  { line: [27, 28], cells: [PP(), SP(), GP(true, true)], outputs: out(5),
    caption: {
      cpp: "`~gradStudent()` is the first destructor to run — the most-derived class dies first.",
      asm: "`gradStudent::~gradStudent:` prints, then **`call student::~student`** fires at the **bottom** — base dtor runs last.",
      intuition: "The base `call` is at the **bottom**: derived body runs first, then base — that is why destruction is **reverse** of construction.",
    },
  },
  { line: [17, 18], cells: [PP(), SP(true, true), GP(false, true)], outputs: out(6),
    caption: {
      cpp: "`~student()` runs after `~gradStudent()` has already finished.",
      asm: "`student::~student:` prints, then **`call person::~person`** fires at the **bottom** — base dtor is always last.",
      intuition: "Each destructor cleans up its own layer, then delegates downward, unwinding the chain in exact reverse order.",
    },
  },
  { line: [7, 8], cells: [PP(true, true), SP(false, true), GP(false, true)], outputs: out(7),
    caption: {
      cpp: "`~person()` is the leaf base destructor — it runs last of all.",
      asm: "`person::~person:` prints then executes `ret` — **no base `call`** because there is no further base to destroy.",
      intuition: "The base class is destroyed **last** — a perfect mirror of construction where the base was built **first**.",
    },
  },
];

// Curated x86-64 Intel syntax (idealized). Prologue/epilogue and cout bodies
// are elided. asm line numbers below are 1-based, counting every line.
const asm =
`person::person:
… cout << "person constructed"
  ret
person::~person:
… cout << "person destroyed"
  ret
student::student:
  call person::person
… cout << "student constructed"
  ret
student::~student:
… cout << "student destroyed"
  call person::~person
  ret
gradStudent::gradStudent:
  call student::student
… cout << "gradStudent constructed"
  ret
gradStudent::~gradStudent:
… cout << "gradStudent destroyed"
  call student::~student
  ret
main:
  call gradStudent::gradStudent
… cout << separator
  call gradStudent::~gradStudent
  ret`;

// source line -> asm line numbers (1-based; no elision rows targeted)
const asmMap = {
  4:  [1, 3],              // person ctor: label + ret (leaf, no base call)
  14: [7, 8, 10],          // student ctor: label + call person::person + ret
  24: [15, 16, 18],        // gradStudent ctor: label + call student::student + ret
  34: [23, 24, 26, 27],    // main: label + both ctor/dtor calls + ret
  27: [19, 21, 22],        // ~gradStudent: label + call student::~student + ret
  17: [11, 13, 14],        // ~student: label + call person::~person + ret
  7:  [4, 6],              // ~person: label + ret (leaf, no base call)
};

const asmLabel = "x86-64 · Intel (idealized)";

export default scene({ title: "L05 — construction & destruction order (person -> student -> gradStudent)", code, steps, asm, asmMap, asmLabel });
