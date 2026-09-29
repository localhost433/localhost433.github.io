/* AUTO-GENERATED from local-array-tree.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useColors, Figure, SumTree, buttonStyle, labelStyle, useTypeset } from "@course";
import { treeSum } from "@course/logic";

/* Adding the local arrays (note 04; L4 slide 33, book Fig 2.23): eight threads
   merge their loc_bin_cts arrays in a binary tree. The same drawing as the slide,
   with the rounds labelled, plus one toggle: run L1's global-sum numbers (L1 slide
   43) through the same tree, so the partial sums show that each round really halves
   the number of values still being combined. It is labelled as L1's scalar example:
   slide 33 adds whole arrays, element by element, in the same pattern. */

const L1_VALUES = [8, 19, 7, 15, 7, 13, 12, 14];
export default function LocalArrayTree() {
  const C = useColors();
  const [numbers, setNumbers] = React.useState(false);
  const {
    rounds
  } = React.useMemo(() => treeSum(L1_VALUES), []);
  useTypeset([numbers]);
  return /*#__PURE__*/React.createElement(Figure, {
    captionKey: numbers ? "numbers" : "slide",
    title: "Adding the local arrays of eight threads in a binary tree: three rounds of pairwise additions, ending at thread 0.",
    caption: numbers ? "The same tree on L1's global sum (L1 slide 43): the eight cores hold 8, 19, 7, 15, 7, 13, 12 and 14. Round 1 leaves four partial sums (27, 22, 20, 26), round 2 two (49, 46), round 3 one (95). On slide 33 each circle holds a whole local array instead of a number, and a send adds two arrays element by element; the pattern of sends is identical." : "Slide 33. In round 1, threads 1, 3, 5 and 7 send their local arrays to 0, 2, 4 and 6, which add them in (an arrow is a send, a dashed line a thread keeping its running sum). Round 2 halves the survivors again, and round 3 leaves the total at thread 0: **3 rounds instead of 7 sequential additions**, and $\\lceil \\log_2 p \\rceil$ rounds for $p$ threads."
  }, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    hidden: true
  }, "Adding the local arrays in a tree"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "show"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, !numbers),
    "aria-pressed": !numbers,
    onClick: () => setNumbers(false)
  }, "slide 33 (thread numbers)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, numbers),
    "aria-pressed": numbers,
    onClick: () => setNumbers(true)
  }, "L1's numbers flowing through it")), /*#__PURE__*/React.createElement(SumTree, {
    C: C,
    mode: "tree",
    rounds: rounds,
    values: numbers ? L1_VALUES : null
  }));
}