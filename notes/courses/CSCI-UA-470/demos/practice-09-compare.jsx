import { compare, stack } from "@course";

/* Static side-by-side: C++ virtual opt-in vs Java's always-on dispatch. Both
   columns show the same call; the right column adds the vtable the vptr follows. */
const handle = (type) => stack("s", type, "→ obj", { id: "s" });
// non-virtual: a plain object with NO vptr (a non-polymorphic C++ class carries none)
const plainObject = () => stack("obj", "Circle", "", { id: "obj" });
// virtual: the object gains a hidden class/vtable pointer
const object = (klass) => stack("obj", "object", "", { id: "obj", fields: [
  { name: "class", type: "ptr", size: 8, value: "→ " + klass },
]});
const vtable = (body) => stack("vt", "Circle vtable", "", { id: "vt", fields: [
  { name: "draw", type: "ptr", size: 8, value: body },
]});

export default compare({
  title: "C++ dispatch: virtual opt-in vs Java's always-on",
  lang: "cpp",
  stages: [
    {
      code: "Shape* s = new Circle();\ns->draw();   // non-virtual",
      cells: [handle("Shape*"), plainObject()],
      tag: { kind: "cpp", text: "early binding" },
      note: "Non-virtual → the object has **no vptr**; the call is resolved at **compile time** from the static type `Shape`, so `Shape::draw` runs.",
    },
    {
      code: "Shape* s = new Circle();\ns->draw();   // virtual",
      cells: [handle("Shape*"), object("Circle"), vtable("Circle::draw")],
      tag: { kind: "cpp", text: "late binding" },
      note: "`virtual` → follows the object's vptr to the `Circle` vtable, so `Circle::draw` runs — like Java always does.",
    },
  ],
  punch: "C++ dispatches statically unless you write `virtual`; Java is **always** virtual.",
});
