import { useCaseRelation } from "@course";

/* note 12 — «include»: the included use case ALWAYS runs as part of the base; it
   factors out common behaviour several bases share. Slide example: both Update
   grades and Generate output «include» Verify student ID. */

export default useCaseRelation({
  kind: "include",
  focal: "Verify student ID",
  satellites: ["Update grades", "Generate output"],
  caption: "the included step ALWAYS runs — shared, mandatory behaviour",
});
