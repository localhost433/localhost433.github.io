import { matchBuild } from "@course";

/* note 16 practice — classify the violation. Five fresh mini-designs (none copied
   from the note's figures): stamp the principle each one breaks. The pair built to
   confuse is I vs L — both smell of unkept promises — and the whys draw the line
   the note draws: stubs forced by a fat interface vs a subclass breaking an
   inherited contract. One-shot grading: Check locks the board, Reset to retry. */

export default matchBuild({
  prompt: "Five designs, five smells. Stamp the SOLID principle each one violates — every letter is used exactly once.",
  options: [
    { value: "S", label: "S — Single Responsibility" },
    { value: "O", label: "O — Open–Closed" },
    { value: "L", label: "L — Liskov Substitution" },
    { value: "I", label: "I — Interface Segregation" },
    { value: "D", label: "D — Dependency Inversion" },
  ],
  items: [
    {
      code: "class Employee {\n    String name;  double salary;\n    void save() { /* opens the payroll DB, writes SQL */ }\n    String reportRow() { /* formats the annual report */ }\n}",
      answer: "S",
      why: "Count **reasons to change**: a schema change touches `save()`, a report redesign touches `reportRow()`, a pay policy touches the data — three owners editing one class. That is SRP, not ISP: there is no interface forcing anything here, the class simply hoards jobs.",
    },
    {
      code: "double shipping(Order o) {\n    if (o.carrier.equals(\"ups\"))        return 4.99;\n    else if (o.carrier.equals(\"fedex\")) return 5.99;\n    // new carrier? reopen and edit this method\n}",
      answer: "O",
      why: "A type-string if-chain is a hand-rolled dispatch table: every new carrier means **reopening and editing** working code. OCP wants the table that extends itself — a `Carrier` hierarchy where a new case is a new subclass with one override and no edits to existing classes.",
    },
    {
      code: "class Square extends Rectangle {\n    @Override void setWidth(int w) {\n        throw new UnsupportedOperationException();\n    }\n}",
      answer: "L",
      why: "This **compiles** — the break is semantic. Code written against `Rectangle` may call `setWidth` on any rectangle; a `Square` that throws is a subclass refusing an inherited promise, so it cannot substitute for its parent. That is LSP: the parent over-promised, and the fix moves the promise, not the stub.",
    },
    {
      code: "interface Machine { void print(); void scan(); void fax(); }\n\nclass BasicPrinter implements Machine {\n    public void print() { /* works */ }\n    public void scan()  { }   // stub\n    public void fax()   { }   // stub\n}",
      answer: "I",
      why: "The empty stubs are the smell, and their **source** is the fat `Machine` contract: `BasicPrinter` was forced to sign for methods it cannot honour. ISP splits the interface (`Printable`, `Scannable`, `Faxable`) so every class implements exactly what it can keep — fixing the broken promise before it is ever made.",
    },
    {
      code: "class ReportService {\n    private MySqlDatabase db = new MySqlDatabase();\n    void export(Report r) { db.insert(r.rows()); }\n}",
      answer: "D",
      why: "A high-level policy class **names a concrete low-level detail** — swap MySQL for Postgres and `ReportService` must be edited. DIP inserts an abstraction (`«interface» Database`) and flips the arrows: the service depends on the interface, and the concrete databases point up into it with realization edges.",
    },
  ],
});
