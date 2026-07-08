/* AUTO-GENERATED from serialization-stream-order.jsx by `npm run build:artifacts` — do not edit. */
import { scene, stack, heap, glob } from "@course";

/* L10 - ObjectOutputStream/ObjectInputStream order.
   Implemented as a standard MemoryScene stepper, following the existing demo
   convention: data-only steps, shared code pane, shared navigation, and memory
   cells for stack references, heap objects, and serialized file records. */

const code = `Integer x = 10;
Circle c = new Circle();

os.writeObject(x);
os.writeObject(c);

Integer i = (Integer) is.readObject();
Circle cir = (Circle) is.readObject();

Circle wrong = (Circle) is.readObject(); // wrong if Integer is first`;
const X = hl => stack("x", "Integer ref", "-> Integer(10)", {
  id: "x",
  to: "xobj",
  hl
});
const C = hl => stack("c", "Circle ref", "-> Circle", {
  id: "c",
  to: "cobj",
  hl
});
const XOBJ = hl => heap("Integer object", "Integer", "10", {
  id: "xobj",
  hl
});
const COBJ = hl => heap("Circle object", "Circle", "radius=...", {
  id: "cobj",
  hl
});
const R1 = hl => glob("file[0]", "serialized Integer", "Integer(10)", {
  id: "r1",
  hl
});
const R2 = hl => glob("file[1]", "serialized Circle", "Circle", {
  id: "r2",
  hl
});
const IOBJ = hl => heap("new Integer", "Integer", "10", {
  id: "iobj",
  hl
});
const CIROBJ = hl => heap("new Circle", "Circle", "radius=...", {
  id: "cirobj",
  hl
});
const I = hl => stack("i", "Integer ref", "<- file[0]", {
  id: "i",
  to: "iobj",
  hl
});
const CIR = hl => stack("cir", "Circle ref", "<- file[1]", {
  id: "cir",
  to: "cirobj",
  hl
});
const BAD = hl => stack("wrong", "Circle cast", "ClassCastException", {
  id: "bad",
  hl
});
const steps = [{
  line: [1, 2],
  cells: [X(true), C(true), XOBJ(true), COBJ(true)],
  caption: {
    java: "The program starts with two ordinary heap objects, an `Integer` and a `Circle`, reached through local references `x` and `c`.",
    intuition: "Serialization does not write variable names. It writes object records into a stream."
  }
}, {
  line: 4,
  cells: [X(true), C(), XOBJ(true), COBJ(), R1(true)],
  caption: {
    java: "`os.writeObject(x)` appends the first serialized record. Position `file[0]` now contains the `Integer` object data.",
    intuition: "The stream is ordered like a queue: the first record written will be the first record read."
  }
}, {
  line: 5,
  cells: [X(), C(true), XOBJ(), COBJ(true), R1(), R2(true)],
  caption: {
    java: "`os.writeObject(c)` appends a second record after the first one. The `Circle` does not replace the `Integer`; it follows it.",
    intuition: "Reading later is positional, not name-based."
  }
}, {
  line: 7,
  cells: [X(), C(), XOBJ(), COBJ(), R1(true), R2(), IOBJ(true), I(true)],
  caption: {
    java: "The first `is.readObject()` consumes `file[0]` and reconstructs a **new** `Integer` object from the record. Its static return type is `Object`, so the program casts it to `Integer`.",
    intuition: "Deserialization builds a fresh object; `i` is not the original `x`, even though it holds the same value (`i == x` would be false)."
  }
}, {
  line: 8,
  cells: [X(), C(), XOBJ(), COBJ(), R1(), R2(true), IOBJ(), I(), CIROBJ(true), CIR(true)],
  caption: {
    java: "The second `is.readObject()` consumes `file[1]`, the serialized `Circle`, and builds a new `Circle`, so `(Circle)` is the matching cast.",
    intuition: "Correct deserialization repeats the write order exactly, each read producing a separate reconstructed object."
  }
}, {
  line: 10,
  cells: [X(), C(), XOBJ(true), COBJ(), R1(true), R2(), BAD(true)],
  caption: {
    java: "If the first read is cast to `Circle`, the stream still returns the first record, an `Integer`. The cast is invalid.",
    intuition: "`readObject()` returns `Object`, but the runtime object still has its real class. A wrong cast fails."
  }
}];
export default scene({
  title: "Serialization stream order - write order fixes read order",
  code,
  lang: "java",
  steps
});