import { scene, l02HeapScene } from "@course";

/* L02 dynamic memory (from the L02-02 slide): new / delete / dangling.
   The scene's cells + code live in the shared `l02HeapScene` factory (@course),
   which the note-02 predict practice reuses — one definition, two artifacts. */

export default scene(l02HeapScene());
