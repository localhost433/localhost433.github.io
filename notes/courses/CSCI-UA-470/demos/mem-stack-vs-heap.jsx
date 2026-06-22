import React from "react";
import { MemoryModel, CodeBlock, stack, heap } from "@course";

/* L08 — object placement: where does an object actually live?
   C++ gives a choice: `Person p1(...)` builds the whole object ON THE STACK (its
   fields inline in the frame); `new Person(...)` builds one on the HEAP, reached
   through a pointer you must later `delete`. Java removes the choice — there are
   no stack objects: every `new` allocates on the heap and the variable holds only
   a REFERENCE; even a `String` field is a reference to another heap object, and
   the garbage collector (not `delete`) reclaims it. Two memory-model panels side
   by side; the asymmetry is the lesson. */

// --- C++ : one stack object, one heap object reached by a pointer ---
const cppCells = [
  stack("p1", "Person", "", { id: "c1", fields: [
    { name: "name", type: "string", size: 32, value: '"James"' },
    { name: "age",  type: "int",    value: "20" },
  ]}),
  stack("p2", "Person*", "0x7ff…", { id: "c2", to: "ch", link: "ptr" }),
  heap("", "Person", "", { id: "ch", fields: [
    { name: "name", type: "string", size: 32, value: '"Maya"' },
    { name: "age",  type: "int",    value: "18" },
  ]}),
];

// --- Java : two references on the stack, every object on the heap ---
// each Person is a heap object (header + int + a String REFERENCE); the String it
// names is itself a separate heap object. Heap order pairs each Person with its
// String so the reference arrows stay short.
const javaPerson = (id, age, strId) => heap("", "Person", "", { id, header: 12, fields: [
  { name: "age",  type: "int",    value: age },
  { name: "name", type: "String", size: 8, to: strId },
]});
const javaStr = (id, val) => heap("", "String", "", { id, header: 12, fields: [
  { name: "chars", type: "char[]", size: 4, value: val },
]});
const javaCells = [
  stack("p1", "Person", "0x4a…", { id: "j1", to: "jo1", size: 8 }),
  stack("p2", "Person", "0x4b…", { id: "j2", to: "jo2", size: 8 }),
  javaPerson("jo1", "20", "js1"), javaStr("js1", '"James"'),
  javaPerson("jo2", "18", "js2"), javaStr("js2", '"Maya"'),
];

const cppCode =
`Person  p1("James", 20);
Person* p2 = new Person("Maya", 18);`;
const javaCode =
`Person p1 = new Person("James", 20);
Person p2 = new Person("Maya", 18);`;

function Panel({ lang, tag, title, sub, code, cells, flex }) {
  return (
    <div style={{ flex, minWidth: 0 }}>
      <div style={{ fontSize: ".82rem", margin: "0 0 .4rem" }}>
        <span className={"mm-cap-tag mm-cap-tag--" + tag}>{title}</span>
        <span style={{ fontWeight: 600, color: "var(--mm-muted)", marginLeft: ".45rem" }}>{sub}</span>
      </div>
      <CodeBlock code={code} lang={lang} />
      <div style={{ marginTop: ".5rem" }}><MemoryModel cells={cells} axis={false} /></div>
    </div>
  );
}

export default function MemStackVsHeap() {
  return (
    <div>
      <span data-artifact-title style={{ display: "none" }}>
        Object placement — C++ (stack or heap) vs Java (always the heap)
      </span>
      {/* The high/low axis is dropped here (axis={false}) to reclaim width: C++ is a
          fixed column just wide enough for its code + widest 40 B cell, and Java grows
          to fill the rest so each Person + its String pair on one row. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-start" }}>
        <Panel lang="cpp"  tag="cpp"  title="C++"  sub="stack or heap — your choice" flex="0 1 322px" code={cppCode}  cells={cppCells} />
        <Panel lang="java" tag="java" title="Java" sub="always the heap"            flex="1 1 350px" code={javaCode} cells={javaCells} />
      </div>
      <div className="mm-scene__caption mm-scene__caption--struct" style={{ margin: ".9rem 0 0" }}>
        <p className="mm-cap-row">
          <span className="mm-cap-tag mm-cap-tag--cpp">C++</span>
          <span className="mm-cap-txt">
            An object lives <strong>on the stack</strong> (<code className="mm-ic">Person p1</code> — fields inline in the
            frame) or <strong>on the heap</strong> (<code className="mm-ic">new Person</code>, via a
            {" "}<code className="mm-ic">Person*</code> you must <code className="mm-ic">delete</code>).
          </span>
        </p>
        <p className="mm-cap-row">
          <span className="mm-cap-tag mm-cap-tag--java">Java</span>
          <span className="mm-cap-txt">
            <strong>No stack objects.</strong> Every <code className="mm-ic">new</code> allocates <strong>on the heap</strong>;
            the variable holds only a <strong>reference</strong>. Even <code className="mm-ic">String name</code> is its own
            heap object, reclaimed by the <strong>garbage collector</strong>, not <code className="mm-ic">delete</code>.
          </span>
        </p>
      </div>
    </div>
  );
}
