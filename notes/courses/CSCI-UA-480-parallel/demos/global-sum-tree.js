/* AUTO-GENERATED from global-sum-tree.jsx by `npm run build:artifacts`. Do not edit. */
import React from "react";
import { useColors, Figure, SumTree, buttonStyle, labelStyle, readoutStyle } from "@course";
import { treeSum, naiveSum, masterWork } from "@course/logic";

/* The global sum from L1 (note 01; L1 slides 37-45, book Fig 1.1), with the slide's
   numbers. Two ways to collect eight partial sums at core 0: every core sends to
   core 0, which adds them one after another; or the tree. Both are drawn at the
   same vertical scale, so the naive version is visibly taller, and height is the
   point: it is the chain of additions core 0 has to wait through (the critical
   path), not the total number of additions, which is 7 either way. */

const L1_VALUES = [8, 19, 7, 15, 7, 13, 12, 14];
export default function GlobalSumTree() {
  const C = useColors();
  const [mode, setMode] = React.useState("naive");
  const tree = React.useMemo(() => treeSum(L1_VALUES), []);
  const naive = React.useMemo(() => naiveSum(L1_VALUES), []);
  const w8 = masterWork(8),
    w1000 = masterWork(1000);
  return /*#__PURE__*/React.createElement(Figure, {
    title: "The global sum of eight cores' values, collected naively by core 0 or in a tree, drawn at the same vertical scale.",
    caption: `L1 slide 43's numbers. Both versions do 7 additions in total and reach ${tree.total}; they differ in how many of those additions core 0 must do one after another. Naively that is every one of them, 7 steps; in the tree the other additions happen in parallel with core 0's, and core 0 waits through only 3 rounds. At 1000 cores it is ${w1000.naive} steps against ${w1000.tree}: $p - 1$ against $\\lceil \\log_2 p \\rceil$.`
  }, /*#__PURE__*/React.createElement("span", {
    "data-artifact-title": true,
    hidden: true
  }, "The global sum: one master core or a tree"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: labelStyle(C)
  }, "collect at core 0"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, mode === "naive"),
    "aria-pressed": mode === "naive",
    onClick: () => setMode("naive")
  }, "every core sends to core 0"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: buttonStyle(C, mode === "tree"),
    "aria-pressed": mode === "tree",
    onClick: () => setMode("tree")
  }, "tree")), /*#__PURE__*/React.createElement(SumTree, {
    C: C,
    mode: mode,
    rounds: tree.rounds,
    steps: naive.steps,
    values: L1_VALUES
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      ...readoutStyle(C),
      margin: 0
    }
  }, mode === "naive" ? `core 0: ${w8.naive} receives and ${w8.naive} additions, one after another` : `core 0: ${w8.tree} receives and ${w8.tree} additions; the other ${w8.naive - w8.tree} additions run on other cores at the same time`));
}