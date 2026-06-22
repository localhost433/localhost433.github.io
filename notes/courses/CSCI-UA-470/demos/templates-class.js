/* AUTO-GENERATED from templates-class.jsx by `npm run build:artifacts` — do not edit. */
import { scene, obj } from "@course";
const code = `template <class T>
class Box {
    T value;
public:
    T get() { return value; }
};

int main() {
    Box<int>    bi;
    Box<double> bd;
    Box<string> bs;
}`;
const mkBoxInt = obj("Box<int>", [{
  name: "value",
  type: "int",
  size: 4
}], {
  region: "stack"
});
const mkBoxDouble = obj("Box<double>", [{
  name: "value",
  type: "double",
  size: 8
}], {
  region: "stack"
});
const mkBoxString = obj("Box<string>", [{
  name: "value",
  type: "string",
  size: 32
}], {
  region: "stack"
});
const BI = hl => mkBoxInt("bi", [], {
  id: "bi",
  hl
});
const BD = hl => mkBoxDouble("bd", [], {
  id: "bd",
  hl
});
const BS = hl => mkBoxString("bs", [], {
  id: "bs",
  hl
});
const steps = [{
  line: [1, 2, 3, 4, 5, 6],
  cells: [],
  caption: {
    cpp: "`template <class T>` declares a **pattern**, not a class. The compiler parses the definition but emits **no concrete type** — the Code and Stack segments are empty.",
    intuition: "A class template is a **recipe for a family of types**. Nothing exists until you name a concrete `T`."
  }
}, {
  line: 9,
  cells: [BI(true)],
  caption: {
    cpp: "`Box<int> bi;` fixes `T = int`, stamping out a concrete class whose sole member `value` is an **`int` (4 bytes)**. `bi` is constructed on the stack.",
    intuition: "The first use with `int` **instantiates** one distinct class — `Box<int>` — with its own 4-byte layout."
  }
}, {
  line: 10,
  cells: [BI(), BD(true)],
  caption: {
    cpp: "`Box<double> bd;` fixes `T = double`, stamping a **separate, unrelated class** with `value` as a **`double` (8 bytes)**. `Box<double>` is not `Box<int>` — you cannot assign one to the other.",
    intuition: "A new `T` means a **new, independent type** with its own layout. The two classes share no relationship at all."
  }
}, {
  line: 11,
  cells: [BI(), BD(), BS(true)],
  caption: {
    cpp: "`Box<string> bs;` stamps `Box<string>`, whose `value` member is a **`std::string` (32 bytes)** — visibly wider than the previous two. Same template, dramatically larger object.",
    intuition: "Each instantiation's layout **follows its `T`**. The width contrast — 4 B, 8 B, 32 B — is the point: the template produces types, not just functions."
  }
}, {
  line: [1, 2, 3, 4, 5, 6],
  cells: [BI(true), BD(true), BS(true)],
  caption: {
    cpp: "One template produced **three distinct classes** — `Box<int>`, `Box<double>`, `Box<string>` — each with its own size, each resolved at **compile time**. None is assignable to another.",
    intuition: "Class templates **monomorphize** just like function templates (see *Monomorphization* above), but the stamped artifact is a **type with its own layout**, not a function body."
  }
}];
export default scene({
  title: "Class templates: one pattern, three distinct types and layouts",
  code,
  steps,
  lang: "cpp"
});