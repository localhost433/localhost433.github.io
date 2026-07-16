/* AUTO-GENERATED from mem-vtable.jsx by `npm run build:artifacts` — do not edit. */
import { scene, l06VtableScene } from "@course";

/* Traces code/lectures/L06/p1.cpp: virtual dispatch via vptr + vtable.
   A class with a virtual function gets a hidden vptr (its first member); each
   object's vptr points to its class's vtable, whose entries point to the actual
   function bodies. A base pointer still reaches the override.

   The scene's cells + code live in the shared `l06VtableScene` factory (@course),
   which the note-06 predict practice reuses — one definition, two artifacts. */

export default scene(l06VtableScene());