import React from "react";
import { useClassColors, Figure, FigureSvg, TableGrid, Lines, Arrow, useTypeset } from "@course";

/* The fingerprint error measure, costed two ways (note 04, L4 slide 34).

   The deck builds this in three clicks: the confusion structure, then the
   supermarket's costs, then the bank's. The note reproduces all three as markdown
   tables, which renders the numbers accurately and the point invisibly — that the
   two matrices are the same classifier with opposite fears. Shading each cell by
   its cost puts the asymmetry where it belongs: in the picture, not in the reader's
   arithmetic.

   The bottom row is the note's own addition and the thing practice question 6
   asks for: which way the decision threshold moves relative to symmetric costs. */

const CW = 104, CH = 42, CW2 = 86, CH2 = 40;

// Cost -> tint. Linear in the cost would make the bank's 10 invisible next to its
// 1000, so this is a rank tint: what matters is which cell you are afraid of.
const shade = (c, max) => (c === 0 ? 0 : 0.14 + 0.44 * (c / max));

function costCells(C, m, max) {
  return m.map((row) => row.map((c) => ({
    t: String(c), tone: c === 0 ? null : "neg", alpha: shade(c, max),
    bold: c === max,
  })));
}

export default function ErrorCostMatrices() {
  const C = useClassColors();
  useTypeset([C]);
  const structure = [
    [{ t: "no error", tone: "pos", alpha: 0.12 }, { t: "false accept", tone: "neg", alpha: 0.12 }],
    [{ t: "false reject", tone: "neg", alpha: 0.12 }, { t: "no error", tone: "pos", alpha: 0.12 }],
  ];

  return (
    <Figure
      title="The fingerprint verifier's error measure: the two-by-two confusion structure, then the same structure costed for a supermarket and for a bank, showing opposite asymmetries."
      caption="Same classifier, same data, opposite operating points. The error measure is **not something the data tells you** — it encodes what a mistake costs where the model is deployed, which puts it in the same category as the choice of `ℍ`: an assumption imported from outside by the designer."
    >
      <FigureSvg viewBox="0 0 760 428" maxWidth={760}
        ariaLabel="Top: a two by two table of no error, false accept, false reject, no error. Bottom: the supermarket cost matrix with 0, 1, 10, 0 and the bank cost matrix with 0, 1000, 10, 0, each cell shaded by its cost.">

        <text x={20} y={20} fontSize="12.5" fill={C.muted}>the verifier outputs +1 if it is you, −1 if it is not</text>
        <TableGrid x={20} y={34} cw={CW} ch={CH} cells={structure} C={C} size={12} mono={false} texHead
          colHead={["f\\text{: accept}", "f\\text{: reject}"]}
          rowHead={["h\\text{: accept}", "h\\text{: reject}"]} />

        <Lines x={368} y={52} size={12.5} fill={C.fg} lines={[
          "Two of the four cells are mistakes,",
          "and nothing so far says what either",
          "one costs.",
        ]} />
        <Lines x={368} y={116} size={12.5} fill={C.muted} italic lines={[
          "The error measure is defined by the user",
          "and is problem-dependent. Different error",
          "measures on the same task lead to",
          "different hypotheses.",
        ]} />

        <line x1={20} y1={206} x2={740} y2={206} stroke={C.border} strokeWidth="1" />

        {/* supermarket */}
        <text x={20} y={236} fontSize="12.5" fill={C.fg} fontWeight="600">Supermarket — discounts for loyal customers</text>
        <TableGrid x={20} y={248} cw={CW2} ch={CH2} cells={costCells(C, [[0, 1], [10, 0]], 10)} C={C} texHead
          colHead={["f\\text{: accept}", "f\\text{: reject}"]}
          rowHead={["h\\text{: accept}", "h\\text{: reject}"]} />
        <Arrow from={[40, 400]} to={[104, 400]} C={C} tone="neg" width={1.4} />
        <Lines x={112} y={404} size={11.5} fill={C.neg}
          lines={["fears the false reject: lean toward accepting"]} />

        {/* bank */}
        <text x={400} y={236} fontSize="12.5" fill={C.fg} fontWeight="600">Bank — security access</text>
        <TableGrid x={400} y={248} cw={CW2} ch={CH2} cells={costCells(C, [[0, 1000], [10, 0]], 1000)} C={C} texHead
          colHead={["f\\text{: accept}", "f\\text{: reject}"]}
          rowHead={["h\\text{: accept}", "h\\text{: reject}"]} />
        <Arrow from={[484, 400]} to={[420, 400]} C={C} tone="neg" width={1.4} />
        <Lines x={492} y={404} size={11.5} fill={C.neg}
          lines={["fears the false accept: lean toward rejecting"]} />
      </FigureSvg>
    </Figure>
  );
}
