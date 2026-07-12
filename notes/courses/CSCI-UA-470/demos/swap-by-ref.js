/* AUTO-GENERATED from swap-by-ref.jsx by `npm run build:artifacts` — do not edit. */
import { scene, stack, obj } from "@course";

/* Java passes references BY VALUE. The `pass` knob toggles two swap strategies:

   - "val" (by value): the method rebinds the local parameter copies (x, y). The
     caller's p1/p2 are untouched — the classic "swap does nothing" outcome.
   - "ref" (by reference): the method aliases the caller's objects through the
     references and swaps their FIELDS, so the caller sees swapped state.

   Both are faithful to how Java executes; the two code panels toggle via
   step.code and all explanation lives in captions. */

const codeVal = `static void swap(Person x, Person y) {
    Person tmp = x;
    x = y;
    y = tmp;
}`;
const codeRef = `static void swap(Person x, Person y) {
    int tmp = x.age;    String s = x.name;
    x.age = y.age;      x.name = y.name;
    y.age = tmp;        y.name = s;
}`;
const person = obj("Person", [{
  name: "name",
  type: "String",
  size: 32
}, {
  name: "age",
  type: "int"
}], {
  region: "heap",
  header: 12
});
const A = (nameVal, ageVal, hl) => person("objA", {
  name: nameVal,
  age: ageVal
}, {
  hl
});
const B = (nameVal, ageVal, hl) => person("objB", {
  name: nameVal,
  age: ageVal
}, {
  hl
});
const P1 = hl => stack("p1", "Person", "", {
  id: "p1",
  to: "objA",
  link: "ptr",
  size: 8,
  hl
});
const P2 = hl => stack("p2", "Person", "", {
  id: "p2",
  to: "objB",
  link: "ptr",
  size: 8,
  hl
});
const X = (target, hl) => stack("x", "Person", "", {
  id: "x",
  to: target,
  link: "ptr",
  size: 8,
  hl
});
const Y = (target, hl) => stack("y", "Person", "", {
  id: "y",
  to: target,
  link: "ptr",
  size: 8,
  hl
});
const TMP = (target, hl) => stack("tmp", "Person", "", {
  id: "tmp",
  to: target,
  link: "ptr",
  size: 8,
  hl
});

/* Shared opening: p1/p2 reference two heap objects before swap is called. */
const intro = code => ({
  line: [1, 2, 3, 4, 5],
  code,
  cells: [P1(), P2(), A('"James"', "20"), B('"Maya"', "18")],
  caption: {
    java: "`p1` and `p2` are **reference** variables — each holds a reference to a heap `Person` object, not the object itself.",
    intuition: "Variables hold references (handles to objects). `p1`→A(James,20), `p2`→B(Maya,18)."
  }
});

/* Shared call step: swap(p1, p2) copies the reference VALUES into x and y. */
const call = code => ({
  line: 1,
  code,
  cells: [P1(), P2(), X("objA", true), Y("objB", true), A('"James"', "20"), B('"Maya"', "18")],
  caption: {
    java: "`swap(p1, p2)` copies the **reference values** into fresh parameters `x` and `y`. Both `x`→A and `y`→B — the **same** heap objects `p1`/`p2` point to.",
    intuition: "`x` is not `p1`; it is an independent copy of the same reference. Java passes references **by value**."
  }
});

/* --------------------------------------------------------------------------
   by value: rebind the local parameter copies. Caller's p1/p2 unchanged.
   -------------------------------------------------------------------------- */
const valSteps = [intro(codeVal), call(codeVal), {
  line: [2, 3, 4],
  code: codeVal,
  cells: [P1(), P2(), TMP("objA"), X("objB", true), Y("objA", true), A('"James"', "20"), B('"Maya"', "18")],
  caption: {
    java: "`tmp = x; x = y; y = tmp;` rebinds the **local** copies: `x`→B, `y`→A. The heap objects A and B are **unchanged**. `p1` still points to A; `p2` still points to B.",
    intuition: "Reassigning `x` or `y` only changes which object that local variable refers to — the caller's `p1`/`p2` are separate variables and are never touched."
  }
}, {
  line: [1, 2, 3, 4, 5],
  code: codeVal,
  cells: [P1(), P2(), A('"James"', "20"), B('"Maya"', "18")],
  caption: {
    java: "`swap` returns; the stack frame (with `x`, `y`, `tmp`) is popped. `p1`→A(James,20) and `p2`→B(Maya,18) — **no visible change**.",
    intuition: "Passing references by value, then swapping the handles, is a no-op outside the method. The contents are left untouched."
  },
  outputs: [{
    expr: "p1.name",
    result: '"James"'
  }, {
    expr: "p1.age",
    result: "20"
  }, {
    expr: "p2.name",
    result: '"Maya"'
  }, {
    expr: "p2.age",
    result: "18"
  }]
}];

/* --------------------------------------------------------------------------
   by reference: alias the caller's objects and swap their FIELDS.
   Caller's p1/p2 see swapped state.
   -------------------------------------------------------------------------- */
const refSteps = [intro(codeRef), call(codeRef), {
  line: [2, 3, 4],
  code: codeRef,
  cells: [P1(), P2(), X("objA", true), Y("objB", true), A('"James"', "20", true), B('"Maya"', "18", true)],
  caption: {
    java: "`x.age = y.age; x.name = y.name; ...` write **through** the references into the heap objects. Both fields of A and B are swapped; `x` and `y` still point to A and B.",
    intuition: "Change the **contents**, not the handles. Mutating a field via a reference is visible everywhere that reference is reachable."
  }
}, {
  line: [1, 2, 3, 4, 5],
  code: codeRef,
  cells: [P1(), P2(), A('"Maya"', "18"), B('"James"', "20")],
  caption: {
    java: "After the by-reference `swap`: A now holds (Maya,18) and B holds (James,20). `p1`→A reads Maya/18; `p2`→B reads James/20. The **references never moved**; the state did.",
    intuition: "Same objects, swapped contents — the pattern for exchanging Java objects is to swap their fields, not their references."
  },
  outputs: [{
    expr: "p1.name",
    result: '"Maya"'
  }, {
    expr: "p1.age",
    result: "18"
  }, {
    expr: "p2.name",
    result: '"James"'
  }, {
    expr: "p2.age",
    result: "20"
  }]
}];
export default scene({
  title: "Swapping Java objects: reassign the handles, or mutate the fields?",
  code: codeVal,
  lang: "java",
  knobs: [{
    id: "pass",
    label: "Swap by",
    options: [{
      value: "val",
      label: "reassigning handles"
    }, {
      value: "ref",
      label: "mutating fields"
    }],
    default: "val"
  }],
  steps: k => k.pass === "ref" ? refSteps : valSteps
});