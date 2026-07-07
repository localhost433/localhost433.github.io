/* AUTO-GENERATED from jvm-object-lifecycle.jsx by `npm run build:artifacts` — do not edit. */
import { scene, obj, heap, methodArea, opstack, pcreg } from "@course";

/* L11 - JVM object lifecycle (workshop Program A).
   new Point() -> x=3 -> y=4 -> print. Shows the JVM runtime *regions* as boxes
   that light up per opcode: the Method Area holds the class blueprint, the Heap
   holds the allocated object, the Operand Stack holds the working reference, and
   the PC names the current opcode. NEW reads the blueprint (Method Area) and
   allocates on the Heap, pushing a reference the STORE ops then use. Friendly
   opcode names (NEW/STORE/DESCRIBE) mirror the workshop, not real javac
   mnemonics. */

const REGIONS = [{
  key: "method",
  label: "Method Area",
  hint: "class blueprints"
}, {
  key: "heap",
  label: "Heap",
  hint: "objects"
}, {
  key: "opstack",
  label: "Operand Stack",
  hint: "per-frame work"
}, {
  key: "pc",
  label: "PC",
  hint: "current opcode"
}];
const code = `0: NEW Point
1: STORE x 3
2: STORE y 4
3: DESCRIBE`;

// reusable cell shapes, stamped per step
const point = obj("Point", [{
  name: "x",
  type: "int"
}, {
  name: "y",
  type: "int"
}], {
  region: "heap",
  header: 12
});
const BP = hl => methodArea("Point", "class", "{ x:int, y:int }", {
  id: "blueprint",
  hl
});
const OBJ = (x, y, hl, opts = {}) => point("pointobj", {
  x,
  y
}, {
  addr: "heap@0x100",
  hl,
  ...opts
});
const REF = hl => opstack("operand[top]", "ref", "Point@0x100", {
  id: "ref",
  to: "pointobj",
  link: "ref",
  hl
});
const PC = (txt, hl) => pcreg("PC", "opcode", txt, {
  id: "pc",
  hl
});
const steps = [{
  active: ["method"],
  cells: [BP(true), PC("before 0")],
  caption: {
    jvm: "The class `Point` is already loaded: its blueprint (field names and types) lives in the **Method Area**. The Heap and operand stack are empty; the PC sits before the first opcode.",
    intuition: "A class is loaded once as a blueprint; individual objects are stamped from it later."
  }
}, {
  line: 1,
  active: ["method", "heap", "opstack"],
  cells: [BP(true), OBJ(0, 0, true), REF(true), PC("0: NEW Point", true)],
  caption: {
    jvm: "`NEW Point` does three things at once: it reads the blueprint from the **Method Area**, allocates a fresh `Point{x=0, y=0}` on the **Heap**, and pushes a **reference** to it onto the operand stack.",
    intuition: "This is the Method Area → Heap handshake: the class says how big the object is and what fields it has; the heap provides the storage; the stack gets a handle to it."
  }
}, {
  line: 2,
  active: ["opstack", "heap"],
  cells: [BP(), OBJ(3, 0, true), REF(), PC("1: STORE x 3", true)],
  caption: {
    jvm: "`STORE x 3` follows the reference on the operand stack to the heap object and writes field `x = 3`.",
    intuition: "Field writes go through the reference: the stack holds the handle, the heap holds the data."
  }
}, {
  line: 3,
  active: ["opstack", "heap"],
  cells: [BP(), OBJ(3, 4, true), REF(), PC("2: STORE y 4", true)],
  caption: {
    jvm: "`STORE y 4` writes field `y = 4` on the same heap object.",
    intuition: "The object on the heap is mutated in place; the reference never changed."
  }
}, {
  line: 4,
  active: ["heap"],
  cells: [BP(), OBJ(3, 4, true), REF(), PC("3: DESCRIBE", true)],
  outputs: [{
    expr: "DESCRIBE",
    result: "Point{x=3, y=4}"
  }],
  caption: {
    jvm: "`DESCRIBE` reads the object's fields from the **Heap** and prints `Point{x=3, y=4}` — the workshop's Program A checkpoint.",
    intuition: "Reading is the mirror of writing: same reference, same heap object, values now populated."
  }
}, {
  active: ["heap"],
  cells: [BP(), OBJ(3, 4, false, {
    reclaimed: true
  }), PC("(reference dropped)", true)],
  caption: {
    jvm: "Once the frame's reference is gone, nothing points at the `Point`. It is now **unreachable**, so the garbage collector may reclaim its heap memory.",
    intuition: "The heap object outlives no one: reachability, not an explicit `free`, decides its fate. This is the GC story the reachability demo tells in full."
  }
}];
export default scene({
  title: "JVM object lifecycle - NEW, STORE, DESCRIBE across Method Area, Heap, operand stack",
  code,
  lang: "java",
  segments: REGIONS,
  axis: false,
  outLabel: "Output (System.out)",
  steps
});