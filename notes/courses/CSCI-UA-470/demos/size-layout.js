/* AUTO-GENERATED from size-layout.jsx by `npm run build:artifacts` — do not edit. */
import { sizes } from "@course";

/* Builds on the L01 data-type sizes (char 1, int 4, double 8): how those
   bytes actually pack into an object. Scalars align to their own size, and
   the struct's size rounds up to its largest member — so field ORDER changes
   sizeof because of padding. */

export default sizes({
  items: [{
    title: "struct A { char a; double b; char c; };",
    fields: [{
      name: "a",
      type: "char"
    }, {
      name: "b",
      type: "double"
    }, {
      name: "c",
      type: "char"
    }]
  }, {
    title: "struct B { char a; char c; double b; };",
    fields: [{
      name: "a",
      type: "char"
    }, {
      name: "c",
      type: "char"
    }, {
      name: "b",
      type: "double"
    }]
  }]
});