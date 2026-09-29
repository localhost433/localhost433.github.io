import React from "react";
import { useColors, Figure, FigureSvg, Box, Arrow, Sym, Lines, port } from "@course";

/* The histogram's alternative partition (note 04; L4 slide 32, book Fig 2.22).
   The slide stacks two rows of loc_bin_cts boxes offset from each other and lets
   one arrow pass behind a box, so which counter feeds which global bin takes a
   while to read. Redrawn with the two threads side by side, each in its own
   colour, so the only lines that cross are the ones that should: each thread's
   count for bin b-1 and bin b going to the one shared counter for that bin. */

export default function HistogramLocalArrays() {
  const C = useColors();
  const bw = 158, bh = 32;
  const d = [
    { x: 30, y: 36, w: 128, h: bh, t: "data[i-1]" },
    { x: 180, y: 36, w: 128, h: bh, t: "data[i]" },
    { x: 380, y: 36, w: 128, h: bh, t: "data[i+1]" },
    { x: 530, y: 36, w: 128, h: bh, t: "data[i+2]" },
  ];
  const l = [
    { x: 14, y: 120, w: bw, h: bh, t: "loc_bin_cts[b-1]++", tone: "t0" },
    { x: 182, y: 120, w: bw, h: bh, t: "loc_bin_cts[b]++", tone: "t0" },
    { x: 364, y: 120, w: bw, h: bh, t: "loc_bin_cts[b-1]++", tone: "t1" },
    { x: 532, y: 120, w: bw, h: bh, t: "loc_bin_cts[b]++", tone: "t1" },
  ];
  const g = [
    { x: 162, y: 226, w: 176, h: 34, t: "bin_counts[b-1] +=" },
    { x: 358, y: 226, w: 176, h: 34, t: "bin_counts[b] +=" },
  ];
  const top = (n, dx = 0) => [n.x + n.w / 2 + dx, n.y];
  const bot = (n, dx = 0) => [n.x + n.w / 2 + dx, n.y + n.h];

  return (
    <Figure
      title="Alternative partition of the histogram: each thread increments its own local array of bin counts, and each global bin count receives one addition from each thread."
      caption={"Slide 32. Each thread counts its own elements into a private `loc_bin_cts` array, so `data[i-1]` and `data[i]` landing in the same bin is no longer contention: only thread 0 touches that counter. The shared `bin_counts` array is touched only at the end, once per thread per bin. The book gives three ways to organize those additions: one thread does them all (few threads and few bins), the bins are divided among the threads (many more bins than threads), or a tree (many threads), which is slide 33."}
    >
      <FigureSvg viewBox="-70 0 770 290" maxWidth={720}
        ariaLabel="Thread 0 owns data[i-1] and data[i], both of which increment thread 0's loc_bin_cts[b-1]; thread 0 also has loc_bin_cts[b]. Thread 1 owns data[i+1], which increments its loc_bin_cts[b-1], and data[i+2], which increments its loc_bin_cts[b]. Each thread's b-1 counter adds into bin_counts[b-1] and each thread's b counter adds into bin_counts[b].">
        <line x1={350} y1={6} x2={350} y2={170} stroke={C.border} strokeWidth="1.2" strokeDasharray="4 3" />
        <Sym x={14} y={18} text="thread 0" size={12.5} fill={C.fg} weight={600} />
        <rect x={80} y={9} width={11} height={11} rx={2} fill={C.T[0]} />
        <Sym x={364} y={18} text="thread 1" size={12.5} fill={C.fg} weight={600} />
        <rect x={430} y={9} width={11} height={11} rx={2} fill={C.T[1]} />
        <Sym x={8} y={57} text="…" size={14} fill={C.muted} />
        <Sym x={680} y={57} text="…" size={14} fill={C.muted} />

        {d.map((n, i) => <Box key={i} {...n} C={C} tone={i < 2 ? "t0" : "t1"} lines={[{ t: n.t, mono: true }]} />)}
        {l.map((n, i) => <Box key={i} {...n} C={C} lines={[{ t: n.t, mono: true, size: 12.5 }]} />)}
        {g.map((n, i) => <Box key={i} {...n} C={C} tone="acc" lines={[{ t: n.t, mono: true }]} />)}

        <Arrow from={bot(d[0])} to={top(l[0], -24)} C={C} tone="t0" />
        <Arrow from={bot(d[1])} to={top(l[0], 24)} C={C} tone="t0" />
        <Arrow from={[l[1].x + l[1].w / 2, 92]} to={top(l[1])} C={C} tone="t0" dash="3 3" />
        <Sym x={l[1].x + l[1].w / 2} y={88} text="…" size={13} fill={C.muted} anchor="middle" />
        <Arrow from={bot(d[2])} to={top(l[2])} C={C} tone="t1" />
        <Arrow from={bot(d[3])} to={top(l[3])} C={C} tone="t1" />

        <Arrow from={bot(l[0])} to={top(g[0], -40)} C={C} tone="t0" />
        <Arrow from={bot(l[1])} to={top(g[1], -40)} C={C} tone="t0" />
        <Arrow from={bot(l[2])} to={top(g[0], 40)} C={C} tone="t1" />
        <Arrow from={bot(l[3])} to={top(g[1], 40)} C={C} tone="t1" />

        <Lines x={-66} y={56} lines={["Find_bin"]} size={12.5} fill={C.muted} mono />
        <Lines x={-66} y={133} lines={["private", "counts"]} size={12.5} fill={C.muted} lh={1.25} />
        <Lines x={-66} y={239} lines={["shared", "counts"]} size={12.5} fill={C.muted} lh={1.25} />
      </FigureSvg>
    </Figure>
  );
}
