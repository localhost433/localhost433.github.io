import { sizes } from "@course";

/* The cost of going polymorphic: a single virtual function adds a hidden
   8-byte vptr to every object (one per object, shared vtable per class). */

export default sizes({
  items: [
    {
      title: "struct Plain { int id; };",
      fields: [{ name: "id", type: "int" }],
    },
    {
      title: "struct Poly { virtual void f(); int id; };",
      vptr: true,
      fields: [{ name: "id", type: "int" }],
    },
  ],
});
