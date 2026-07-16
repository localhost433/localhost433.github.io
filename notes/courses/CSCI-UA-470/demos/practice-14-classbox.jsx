// notes/courses/CSCI-UA-470/demos/practice-14-classbox.jsx
import { classBuild } from "@course";

/* note 14 practice — build the class box the note's notation section describes.
   The three marks exams lose are all here: the visibility symbol on the left, the
   type AFTER the colon (the reverse of the Java/C++ order the course drilled for
   thirteen notes), and which of the five lines joins Circle to Shape. `radius` is
   private data; `area()` and `describe()` are the public interface; a Circle IS-A
   Shape, so the line is generalization (the hollow triangle pointing at the
   parent), not aggregation or association. The names are given — you supply the
   visibility, the types, and the relationship. */

export default classBuild({
  prompt: "Build the UML class box for Circle: stamp each member's visibility, drop its type after the colon, then pick the line to Shape.",
  className: "Circle",
  abstract: false,
  attributes: [
    { vis: "-", name: "radius", type: "double",
      whyVis: "`radius` is hidden data → `-` private, not `+` public.",
      whyType: "The type goes AFTER the colon: `radius : double`, not `double radius` — the reverse of Java/C++." },
  ],
  operations: [
    { vis: "+", name: "area()", ret: "double",
      whyVis: "`area()` is part of the interface callers use → `+` public.",
      whyType: "A UML operation writes its return type after the colon: `area() : double`." },
    { vis: "+", name: "describe()", ret: "void",
      whyVis: "`describe()` is a public operation → `+`.",
      whyType: "A method that returns nothing writes `: void` — it is not omitted and does not move to the front." },
  ],
  typeDistractors: ["int", "String", "boolean"],
  relationship: {
    to: "Shape",
    kind: "generalize",
    parentAbstract: true,
    parentSections: [{ rows: [] }, { rows: [{ text: "+ area() : double", italic: true }] }],
    why: "A Circle IS-A Shape, so the line is generalization — a hollow triangle pointing at the parent. Aggregation/composition (the diamonds) are has-a; association is a plain use link.",
  },
});
