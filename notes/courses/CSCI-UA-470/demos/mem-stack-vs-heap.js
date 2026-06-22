/* AUTO-GENERATED from mem-stack-vs-heap.jsx by `npm run build:artifacts` — do not edit. */
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
const cppCells = [stack("p1", "Person", "", {
  id: "c1",
  fields: [{
    name: "name",
    type: "string",
    size: 32,
    value: '"James"'
  }, {
    name: "age",
    type: "int",
    value: "20"
  }]
}), stack("p2", "Person*", "0x7ff…", {
  id: "c2",
  to: "ch",
  link: "ptr"
}), heap("", "Person", "", {
  id: "ch",
  fields: [{
    name: "name",
    type: "string",
    size: 32,
    value: '"Maya"'
  }, {
    name: "age",
    type: "int",
    value: "18"
  }]
})];

// --- Java : two references on the stack, every object on the heap ---
// each Person is a heap object (header + int + a String REFERENCE); the String it
// names is itself a separate heap object. Heap order pairs each Person with its
// String so the reference arrows stay short.
const javaPerson = (id, age, strId) => heap("", "Person", "", {
  id,
  header: 12,
  fields: [{
    name: "age",
    type: "int",
    value: age
  }, {
    name: "name",
    type: "String",
    size: 8,
    to: strId
  }]
});
const javaStr = (id, val) => heap("", "String", "", {
  id,
  header: 12,
  fields: [{
    name: "chars",
    type: "char[]",
    size: 4,
    value: val
  }]
});
const javaCells = [stack("p1", "Person", "0x4a…", {
  id: "j1",
  to: "jo1",
  size: 8
}), stack("p2", "Person", "0x4b…", {
  id: "j2",
  to: "jo2",
  size: 8
}), javaPerson("jo1", "20", "js1"), javaStr("js1", '"James"'), javaPerson("jo2", "18", "js2"), javaStr("js2", '"Maya"')];
const cppCode = `Person  p1("James", 20);
Person* p2 = new Person("Maya", 18);`;
const javaCode = `Person p1 = new Person("James", 20);
Person p2 = new Person("Maya", 18);`;
function Panel({
  lang,
  tag,
  title,
  sub,
  code,
  cells,
  flex
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: ".82rem",
      margin: "0 0 .4rem"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mm-cap-tag mm-cap-tag--" + tag
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: "var(--mm-muted)",
      marginLeft: ".45rem"
    }
  }, sub)), /*#__PURE__*/React.createElement(CodeBlock, {
    code: code,
    lang: lang
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: ".5rem"
    }
  }, /*#__PURE__*/React.createElement(MemoryModel, {
    cells: cells,
    axis: false
  })));
}
export default function MemStackVsHeap() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    style: {
      display: "none"
    }
  }, "Object placement \u2014 C++ (stack or heap) vs Java (always the heap)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    lang: "cpp",
    tag: "cpp",
    title: "C++",
    sub: "stack or heap \u2014 your choice",
    flex: "0 1 322px",
    code: cppCode,
    cells: cppCells
  }), /*#__PURE__*/React.createElement(Panel, {
    lang: "java",
    tag: "java",
    title: "Java",
    sub: "always the heap",
    flex: "1 1 350px",
    code: javaCode,
    cells: javaCells
  })), /*#__PURE__*/React.createElement("div", {
    className: "mm-scene__caption mm-scene__caption--struct",
    style: {
      margin: ".9rem 0 0"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mm-cap-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mm-cap-tag mm-cap-tag--cpp"
  }, "C++"), /*#__PURE__*/React.createElement("span", {
    className: "mm-cap-txt"
  }, "An object lives ", /*#__PURE__*/React.createElement("strong", null, "on the stack"), " (", /*#__PURE__*/React.createElement("code", {
    className: "mm-ic"
  }, "Person p1"), " \u2014 fields inline in the frame) or ", /*#__PURE__*/React.createElement("strong", null, "on the heap"), " (", /*#__PURE__*/React.createElement("code", {
    className: "mm-ic"
  }, "new Person"), ", via a", " ", /*#__PURE__*/React.createElement("code", {
    className: "mm-ic"
  }, "Person*"), " you must ", /*#__PURE__*/React.createElement("code", {
    className: "mm-ic"
  }, "delete"), ").")), /*#__PURE__*/React.createElement("p", {
    className: "mm-cap-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mm-cap-tag mm-cap-tag--java"
  }, "Java"), /*#__PURE__*/React.createElement("span", {
    className: "mm-cap-txt"
  }, /*#__PURE__*/React.createElement("strong", null, "No stack objects."), " Every ", /*#__PURE__*/React.createElement("code", {
    className: "mm-ic"
  }, "new"), " allocates ", /*#__PURE__*/React.createElement("strong", null, "on the heap"), "; the variable holds only a ", /*#__PURE__*/React.createElement("strong", null, "reference"), ". Even ", /*#__PURE__*/React.createElement("code", {
    className: "mm-ic"
  }, "String name"), " is its own heap object, reclaimed by the ", /*#__PURE__*/React.createElement("strong", null, "garbage collector"), ", not ", /*#__PURE__*/React.createElement("code", {
    className: "mm-ic"
  }, "delete"), "."))));
}