import { sequenceDiagram, converterSeqMerged } from "@course";

/* note 14 — the merged interaction on its own, for reference. What began as two
   parallel sequences is one. The four participants on the top row (`User`,
   `MainGUI`, `ConverterGUI`, `Converter`) are exactly the types the class diagram
   is about to declare: the interaction discovers the structure. */

export default sequenceDiagram({
  ...converterSeqMerged,
  caption: { text: "the participants on this top row become the classes", color: "--mm-muted" },
});
