import { scene, part, ladder } from "@course";

/* Traces code/lectures/L06/main.cpp: the diamond with VIRTUAL inheritance
   (teacher & student : virtual person; TA : teacher, student). Real run:
     Person / Teacher / Student / TA constructor called
     ==============================
     TA / Student / Teacher / Person destructor called
   Key: Person is constructed ONCE, first, by the most-derived class (TA). */

const code =
`class person {
public:
    string name = "james";
    person()  { cout << "Person constructor called."; }
    ~person() { cout << "Person destructor called."; }
};
class teacher : virtual public person {
public:
    int age = 25;
    teacher()  { cout << "Teacher constructor called."; }
    ~teacher() { cout << "Teacher destructor called."; }
};
class student : virtual public person {
public:
    int age = 20;
    student()  { cout << "Student constructor called."; }
    ~student() { cout << "Student destructor called."; }
};
class TA : public teacher, public student {
public:
    int age = 27;
    TA()  { cout << "TA constructor called."; }
    ~TA() { cout << "TA destructor called."; }
};

int main() {
    TA ta;
    cout << "==============================";
}`;

const PP = part("(person)",  "virtual base", [{ name: "name", type: "string", size: 32, value: '"james"' }], "pp");
const TP = part("(teacher)", "part", [{ name: "age", type: "int", value: "25" }], "tp");
const SP = part("(student)", "part", [{ name: "age", type: "int", value: "20" }], "sp");
const AP = part("(TA)",      "part", [{ name: "age", type: "int", value: "27" }], "ap");

const out = ladder([
  "Person constructor called.",
  "Teacher constructor called.",
  "Student constructor called.",
  "TA constructor called.",
  "==============================",
  "TA destructor called.",
  "Student destructor called.",
  "Teacher destructor called.",
  "Person destructor called.",
]);

const steps = [
  { line: [3, 4], cells: [PP(true)], outputs: out(1),
    caption: {
      cpp: "The shared `person` base is built **first**, by the most-derived class `TA`, because `teacher` and `student` both inherit it `virtual`ly.",
      intuition: "A `virtual` base is constructed **once** by the most-derived object, not separately by each branch of the diamond.",
    },
  },
  { line: [9, 10], cells: [PP(), TP(true)], outputs: out(2),
    caption: {
      cpp: "Next the `teacher` sub-object is constructed.",
      intuition: "After the virtual base, branches build in **base-list order** — `teacher` comes before `student`.",
    },
  },
  { line: [15, 16], cells: [PP(), TP(), SP(true)], outputs: out(3),
    caption: {
      cpp: "Then the `student` sub-object is constructed, and `person` is **not** built again.",
      intuition: "Virtual inheritance shares one `person`; a **non-virtual** diamond would build it **twice**.",
    },
  },
  { line: [21, 22], cells: [PP(), TP(), SP(), AP(true)], outputs: out(4),
    caption: {
      cpp: "Finally `TA`'s own part is constructed, completing the object.",
      intuition: "With one shared `person`, `ta.name` is **unambiguous** — no diamond ambiguity.",
    },
  },
  { line: 28, cells: [PP(), TP(), SP(), AP()], outputs: out(5),
    caption: {
      cpp: "`ta` is fully built, and `main` prints the separator line.",
      intuition: "Construction is done; the object now lives until the end of its scope.",
    },
  },
  { line: 23, cells: [PP(), TP(), SP(), AP(true, true)], outputs: out(6),
    caption: {
      cpp: "`~TA()` runs first as `ta` is destroyed.",
      intuition: "Destruction **reverses** construction, so the most-derived class dies first.",
    },
  },
  { line: 17, cells: [PP(), TP(), SP(true, true), AP(false, true)], outputs: out(7),
    caption: {
      cpp: "Then `~student()` runs.",
      intuition: "Branches are destroyed in **reverse** base-list order — `student` before `teacher`.",
    },
  },
  { line: 11, cells: [PP(), TP(true, true), SP(false, true), AP(false, true)], outputs: out(8),
    caption: {
      cpp: "Then `~teacher()` runs.",
      intuition: "Each branch unwinds in reverse, mirroring the order in which it was built.",
    },
  },
  { line: 5, cells: [PP(true, true), TP(false, true), SP(false, true), AP(false, true)], outputs: out(9),
    caption: {
      cpp: "The shared `person` base is destroyed **last**, exactly once.",
      intuition: "The virtual base dies **last** — a perfect mirror of being constructed **first**, just once.",
    },
  },
];

export default scene({ title: "L06 — virtual-inheritance diamond: order of construction & destruction", code, steps });
