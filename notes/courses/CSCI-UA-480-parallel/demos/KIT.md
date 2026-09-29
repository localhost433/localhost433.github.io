# CSCI-UA-480 demo kit — API index

Start here, not in `_kit.jsx`. Edit the `.jsx`, never the generated `.js`, and run
`npm run build:artifacts` before finishing: the runtime prefers the `.js`.

## Imports inside a demo

| Specifier | Resolves to |
|---|---|
| `@course` | `demos/_kit.jsx` — this page |
| `@course/logic` | `demos/_logic.mjs` — the rules each figure animates, tested by `_logic.test.js` |
| `@kit` | `notes/artifacts/kit.jsx` — shared UI; its `DiagramSvg`/`diagramPalette` do **not** work here (they read `--mm-*`, which only 470 defines) |

## Colours

`useColors()` returns `{ pos, neg, acc, mid, T[0..3], ink, fg, muted, border, bg }`.
`T` is thread identity in fixed order (A/0 blue, B/1 orange, C/2 aqua, D/3 violet),
validated for colour-blind separation in both themes. Letters on a thread fill are drawn
in `ink`, never in `fg` (white in dark mode fails on these fills). Never draw text in
`pos`/`neg`/`acc`: put the colour on a mark beside the text.

## SVG primitives (copied from the 473 kit)

`Figure({title, caption})`, `FigureSvg({viewBox, ariaLabel, maxWidth, align})`,
`Box({x,y,w,h,tone,lines,dash,strokeWidth})`, `Lines`, `Sym`, `Arrow({from,to,tone,dash})`,
`port(box, side)`, `toneOf(C, tone)`. Tones: `plain`, `fg`, `acc`, `pos`, `neg`, `mid`,
`t0`..`t3`, `solid`, `ghost`. Pass `mono: true` for code identifiers, or their underscores
become subscripts.

## Math

Captions are HTML, so a fence with the `math` flag gets `$...$` typeset by MathJax
(see `local-array-tree`). Do not use Unicode stand-ins like `log₂`. A caption that changes
with state needs `Figure`'s `captionKey` (so React remounts it instead of patching text
MathJax has rewritten) and `useTypeset(deps)` to typeset the new one.

## Reusable pieces

- `SumTree({ C, mode, rounds, steps, values })` — a reduction drawn as circles and sends;
  `mode="tree"` takes `treeSum(...).rounds`, `mode="naive"` takes `naiveSum(...).steps`.
  Same vertical scale in both modes, so height reads as the critical path.

## How `_logic.mjs` is organized

- **Issue slots:** `HwThread` (a program and where it is in it) plus one `IssuePolicy`
  subclass per scheme (`Superscalar`, `FineGrained`, `CoarseGrained`, `Smt`), each
  overriding `fill(cycle, col)`. A new scheme is a subclass and a line in `ISSUE_POLICIES`.
- **Coherence:** `CacheSystem` does hits and the writer's own line; `NoProtocol`,
  `Snooping` and `Directory` override `missFetch` and `invalidateOthers` (template method).
- **Race:** deliberately functional (`raceStep(state, tid)` returns a new state), because
  React state wants immutable snapshots and the enumerations walk the state tree.

## Figures in the notes

| File | Note | Source |
|---|---|---|
| `issue-slots` | 02 | book §2.2.5-2.2.6, L2 slides 16-19; interactive |
| `coherence-walkthrough` | 03 | L3 slides 33-36, book §2.3.5; stepper |
| `histogram-first-partition` | 04 | L4 slide 31, book Fig 2.21 |
| `histogram-local-arrays` | 04 | L4 slide 32, book Fig 2.22 |
| `local-array-tree` | 04 | L4 slide 33, book Fig 2.23; toggle to L1's numbers; `math` |
| `global-sum-tree` | 01 | L1 slides 37-45, book Fig 1.1; naive vs. tree; `math` |
| `race-stepper` | 04 | L4 slide 7, book §2.4.3; interactive |
| `speedup-overheads` | 06 | L6 slides 5-6, book §2.6.1; scenario buttons |
| `timing-clocks` | 06 | L6 slides 16-20, book §2.6.4; interactive |
