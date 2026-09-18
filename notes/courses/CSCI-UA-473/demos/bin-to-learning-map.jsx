import React from "react";
import { useClassColors, Figure, FigureSvg, Box, Lines, Arrow, TeX, useTypeset } from "@course";

/* The bin-to-learning dictionary (note 04, L4 slides 16-20).

   The deck relabels one picture: a bin of marbles becomes the input space, a red
   marble becomes h(x) ≠ f(x), μ and ν become E_out and E_in. Note 04 carries that
   as running prose, which is the one form where a correspondence is hard to read —
   you have to hold both columns in your head at once. Drawn, it is a table with the
   picture still attached, so the symbol you are being handed still has the marble
   behind it.

   The marble pattern is fixed, not sampled: this figure is a legend, and a legend
   that reshuffles on every load makes two readings disagree for no reason. The
   hoeffding-bin demo above it is where the sampling actually varies. */

const COLS = 9, ROWS = 6, GAP = 25, R = 8.5;
const BIN_RED = new Set([0, 15, 20, 30, 38, 46, 52]);      // 7 of 54
const SAMPLE_RED = new Set([2, 7]);                         // 2 of 10
const SAMPLE = 10;

const ROWS_MAP = [
  ["\\text{one marble}", "\\text{one input point } x \\in \\mathcal X"],
  ["\\text{the whole bin}", "\\text{the whole input space } \\mathcal X"],
  ["\\text{the marble is red}", "h(x) \\neq f(x)"],
  ["\\mu\\text{, the fraction red in the bin}", "E_{\\text{out}}(h) = \\mathbb P\\big[h(x) \\neq f(x)\\big]"],
  ["\\text{a drawn sample of } N \\text{ marbles}", "\\text{the training set } D"],
  ["\\nu\\text{, the fraction red in it}", "E_{\\text{in}}(h) = \\tfrac{1}{N}\\sum_i \\big[h(x_i) \\neq f(x_i)\\big]"],
  ["\\mu \\text{ is what we cannot see}", "f \\text{ is what we cannot see}"],
];

export default function BinToLearningMap() {
  const C = useClassColors();
  useTypeset([C]);
  const marble = (cx, cy, red, key) => (
    <circle key={key} cx={cx} cy={cy} r={R} fill={red ? C.neg : C.acc} />
  );

  const bin = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      bin.push(marble(30 + c * GAP, 54 + r * GAP, BIN_RED.has(i), "b" + i));
    }
  }

  return (
    <Figure
      title="The ball-and-bin experiment relabelled as learning: a marble is an input point, a red marble means the hypothesis disagrees with the target, the bin's red fraction is the out-of-sample error and the sample's red fraction is the in-sample error."
      caption="Same picture, two vocabularies. Everything Hoeffding says about the bin it says about the errors — **for one hypothesis fixed before the data is drawn**, which is the clause the next section spends itself on."
    >
      <FigureSvg viewBox="0 0 764 436" maxWidth={764}
        ariaLabel="Left: a bin of 54 marbles, 7 red, above a drawn sample of 10 marbles of which 2 are red. Right: a table mapping each part of the bin experiment onto its counterpart in learning.">

        <text x={20} y={30} fontSize="12.5" fill={C.muted}>the bin</text>
        <rect x={16} y={38} width={COLS * GAP + 6} height={ROWS * GAP + 6} rx={4}
          fill="none" stroke={C.fg} strokeWidth="1.5" />
        {bin}

        <Arrow from={[92, 20]} to={[36, 46]} C={C} tone="neg" width={1.2} />
        <TeX x={96} y={22} w={120} size={12} fill={C.neg} tex="h(x) \neq f(x)" />
        <Arrow from={[204, 20]} to={[137, 46]} C={C} tone="acc" width={1.2} />
        <TeX x={208} y={22} w={120} size={12} fill={C.acc} tex="h(x) = f(x)" />

        <Arrow from={[120, 200]} to={[104, 236]} C={C} width={1.4} />
        <Lines x={128} y={222} size={11} fill={C.muted} italic
          lines={["draw N independently, using P"]} />
        {Array.from({ length: SAMPLE }, (_, i) =>
          marble(30 + i * GAP, 262, SAMPLE_RED.has(i), "s" + i))}
        <TeX x={16} y={300} w={320} size={13} fill={C.fg}
          tex="\text{the sample: } \nu = \tfrac{2}{10} \qquad\quad \text{the bin: } \mu = \tfrac{7}{54}" />
        <TeX x={16} y={322} w={360} size={11.5} fill={C.muted}
          tex="\nu \text{ is observed and random;} \quad \mu \text{ is fixed and unknown}" />

        <text x={520} y={28} textAnchor="end" fontSize="12" fill={C.muted} fontStyle="italic">ball and bin</text>
        <text x={560} y={28} fontSize="12" fill={C.muted} fontStyle="italic">learning</text>
        <line x1={300} y1={36} x2={756} y2={36} stroke={C.border} strokeWidth="1" />
        {ROWS_MAP.map(([a, b], i) => {
          const y = 62 + i * 32;
          return (
            <g key={i}>
              <TeX x={520} y={y} anchor="end" w={290} size={12} fill={C.fg} tex={a} />
              <Arrow from={[528, y - 4]} to={[552, y - 4]} C={C} width={1.2} />
              <TeX x={560} y={y} w={210} size={12} fill={C.fg} tex={b} />
            </g>
          );
        })}

        <Box x={16} y={350} w={732} h={68} tone="acc" C={C} />
        <TeX x={382} y={382} anchor="middle" w={700} size={14} fill={C.fg}
          tex="\mathbb P\big[\,|\nu - \mu| > \epsilon\,\big] \le 2e^{-2\epsilon^2 N} \quad\Longrightarrow\quad \mathbb P\big[\,|E_{\text{in}}(h) - E_{\text{out}}(h)| > \epsilon\,\big] \le 2e^{-2\epsilon^2 N}" />
        <text x={382} y={406} textAnchor="middle" fontSize="11.5" fill={C.muted} fontStyle="italic">
          for a single h fixed before the data is drawn
        </text>
      </FigureSvg>
    </Figure>
  );
}
