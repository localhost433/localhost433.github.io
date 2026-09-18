import React from "react";
import { useClassColors, Figure, FigureSvg, Box, Lines } from "@course";

/* The six learning paradigms, sorted by where the supervision comes from
   (note 03, L3 slides 55-67).

   The deck spends thirteen slides walking through them one at a time, and the
   note's table lists them down a column. Neither arrangement shows the thing the
   note says at the end of the section: the axis that actually separates these is
   the SOURCE of the supervision signal, not how much data there is. Six cards with
   that line first make the axis the organising fact, which is also the form the
   standard MCQ takes — you are given a scenario and asked which one it is.

   Colour is deliberately not the code here: six categories would need six hues,
   the palette has four, and inventing two more would imply relationships between
   the cards that do not exist. */

const CARDS = [
  {
    t: "Supervised",
    from: "a human annotator",
    data: ["inputs with labels attached"],
    eg: ["customers labelled creditworthy;", "pixels labelled with a category", "(online and active are variants)"],
  },
  {
    t: "Unsupervised",
    from: "nowhere",
    data: ["inputs only"],
    eg: ["clustering images by content;", "word and image embeddings;", "topic modelling"],
  },
  {
    t: "Semi-supervised",
    from: "a labelled subset",
    data: ["few labelled, many not"],
    eg: ["speech, healthcare, documents:", "anywhere labelling is the", "expensive part"],
  },
  {
    t: "Self-supervised",
    from: "the data's own structure",
    data: ["unlabelled, labels inferred"],
    eg: ["nearby video frames are", "similar to each other, so the", "video supervises itself"],
  },
  {
    t: "Transfer",
    from: "a different task",
    data: ["big auxiliary + small final"],
    eg: ["cats vs dogs on a large set,", "then Swedish Vallhunds on a", "small one"],
  },
  {
    t: "Reinforcement",
    from: "the environment's response",
    data: ["no pairs; trial and error"],
    eg: ["a toddler and a hot cup:", "touching earns a large", "negative reward"],
  },
];

const W = 238, H = 126, GX = 250, GY = 144;

export default function ParadigmsTree() {
  const C = useClassColors();
  return (
    <Figure
      title="The six learning paradigms as cards, each naming where its supervision signal comes from, what its training data looks like and the lecture's example."
      caption="Sorted by **where the signal comes from**, which is the axis that actually separates them — not by how much data each one needs. A described scenario can always be placed by asking who or what is doing the supervising."
    >
      <FigureSvg viewBox="0 0 764 326" maxWidth={764}
        ariaLabel="Six cards: supervised, unsupervised, semi-supervised, self-supervised, transfer and reinforcement learning, each with the source of its supervision signal, the shape of its training data and an example from the lecture.">
        <Lines x={12} y={22} size={12.5} fill={C.fg}
          lines={["The question that sorts them: where does the supervision signal come from?"]} />
        {CARDS.map((c, i) => {
          const x = 12 + (i % 3) * GX, y = 44 + Math.floor(i / 3) * GY;
          return (
            <g key={c.t}>
              <Box x={x} y={y} w={W} h={H} C={C} align="left" tone="plain" lines={[
                { t: c.t, size: 13, weight: 600 },
                { t: "signal: " + c.from, size: 11, fill: C.acc },
                ...c.data.map((d) => ({ t: d, size: 10.5, fill: C.muted })),
                ...c.eg.map((e) => ({ t: e, size: 10.5, fill: C.muted, italic: true })),
              ]} />
            </g>
          );
        })}
      </FigureSvg>
    </Figure>
  );
}
