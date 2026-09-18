import React from "react";
import { useClassColors, Figure, FigureSvg, TableGrid, Lines, TeX, useTypeset } from "@course";

/* Joint, marginal and conditional on one grid (note 02, L2 slides 24-25).

   The deck gives the definitions as formulas: p_X(x) = Σ_y p_XY(x,y), and
   p_{Y|X} = p_XY / p_X. Both are operations on a table, and on a table they are
   obvious — marginalizing is summing along a direction, conditioning is taking one
   line and rescaling it so it sums to one. In Σ notation neither is obvious, which
   is why "sum out the variable you don't want" is a thing people memorize instead
   of see.

   The numbers are chosen so every margin is a round number and the conditional
   comes out exact; nothing here is estimated from data. */

const JOINT = [
  [0.08, 0.12, 0.04, 0.06],
  [0.04, 0.20, 0.12, 0.04],
  [0.02, 0.08, 0.16, 0.04],
];
const PICK = 1;                              // the row that gets conditioned on
const rowSum = (r) => r.reduce((a, b) => a + b, 0);
const colSum = (j) => JOINT.reduce((a, r) => a + r[j], 0);
const f2 = (v) => v.toFixed(2);

export default function JointMarginalGrid() {
  const C = useClassColors();
  useTypeset([C]);

  const cells = JOINT.map((row, i) => [
    ...row.map((v) => ({ t: f2(v), tone: i === PICK ? "acc" : null, alpha: 0.15 })),
    { t: f2(rowSum(row)), tone: "mid", alpha: i === PICK ? 0.3 : 0.14, bold: i === PICK },
  ]);
  cells.push([
    ...JOINT[0].map((_, j) => ({ t: f2(colSum(j)), tone: "mid", alpha: 0.14 })),
    { t: "1.00", tone: "mid", alpha: 0.26, bold: true },
  ]);

  const cond = [JOINT[PICK].map((v) => ({ t: f2(v / rowSum(JOINT[PICK])), tone: "acc", alpha: 0.15 }))];

  return (
    <Figure
      title="A joint probability table with its margins: row sums give the marginal of X, column sums give the marginal of Y, and dividing one row by its own margin gives the conditional distribution of Y given that value of X."
      caption="Marginalizing is **summing along a direction**; conditioning is **taking one line and rescaling it to sum to 1**. The sum in the definition of a marginal is doing nothing more exotic than the right-hand column of this table."
    >
      <FigureSvg viewBox="0 0 764 262" maxWidth={764}
        ariaLabel="A three by four joint probability table with a margin column of row sums 0.30, 0.40, 0.30 and a margin row of column sums 0.15, 0.40, 0.30, 0.15 totalling 1.00; beside it the middle row divided by 0.40 to give a conditional distribution summing to 1.">

        <TableGrid x={64} y={48} cw={58} ch={32} cells={cells} C={C} size={11.5} texHead
          corner="p(x,y)" colHead={["y_1", "y_2", "y_3", "y_4", "p_X(x)"]}
          rowHead={["x_1", "x_2", "x_3", "p_Y(y)"]} />

        {/* The labels sit against the margin they describe. An arrow drawn through the
            table would have to cross the numbers it is talking about. */}
        <Lines x={412} y={26} size={11.5} fill={C.mid} anchor="end"
          lines={["sum a row → the marginal of X"]} />
        <Lines x={64} y={236} size={11.5} fill={C.mid}
          lines={["sum a column → the marginal of Y"]} />

        {/* the conditional */}
        <TeX x={470} y={62} w={260} size={12.5} fill={C.acc} tex="\text{condition on } X = x_2:" />
        <TeX x={470} y={84} w={300} size={11.5} fill={C.muted}
          tex="\text{divide the row by its own margin, } 0.40" />
        <TableGrid x={470} y={100} cw={58} ch={32} cells={cond} C={C} size={11.5} texHead
          colHead={["y_1", "y_2", "y_3", "y_4"]} />
        <TeX x={470} y={186} w={300} size={12.5} fill={C.fg}
          tex="p_{Y\mid X}(y \mid x_2), \;\text{ and it sums to } 1" />
        <Lines x={470} y={212} size={11.5} fill={C.muted} italic lines={[
          "The row was 0.40 of the table; rescaling",
          "is what makes it a distribution again.",
        ]} />
      </FigureSvg>
    </Figure>
  );
}
