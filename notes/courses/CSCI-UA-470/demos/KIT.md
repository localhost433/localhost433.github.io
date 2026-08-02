# Demo kit — API index

An index of what already exists, so you don't have to read `_kit.jsx` (3,600 lines) to
find out. Grep the export name in `_kit.jsx` for the full signature and comments.

**Two rules before you touch anything:**

1. **Edit the `.jsx`, never the generated `.js`.** Each `demos/*.jsx` has a sibling
   `*.js` compiled by `npm run build:artifacts` (Babel, `presets:["react"]`). The
   runtime prefers the `.js` and falls back to in-browser Babel on the `.jsx`, so a
   `.jsx`-only change *appears* to work locally while shipping stale code. Rebuild
   before you finish.
2. **Prefer an existing export over a new component.** Almost every figure in this
   course is a data spec passed to something below. If you're writing SVG by hand,
   check this list first.

## Imports available inside a demo

| Specifier | Resolves to |
|---|---|
| `@course` | `demos/_kit.jsx` — everything on this page |
| `@course/seq-order` | `notes/js/seq-order-logic.mjs` — `seededShuffle`, `gradeOrder`, `hashSeed` |
| `@kit` | `notes/artifacts/kit.jsx` — the shadcn-style UI primitives (bottom of this page) |
| `react` | provided by the host; do not bundle |

Anything else is rewritten to an ESM CDN URL by `notes/js/artifact-utils.js`.

---

## Entry-point factories

A demo's default export is a component. These wrap a pure data spec into one, which is
how most figures are written — no JSX in the demo file at all.

| Export | Wraps |
|---|---|
| `scene(config)` | `MemoryScene` |
| `dualScene(config)` | `MemoryDualScene` |
| `sizes(config)` | `SizeCompare` |
| `compare(config)` | `MemoryCompare` |
| `mcq(config)` | `Mcq` |
| `useCaseDiagram(cfg)` | `UseCaseDiagram` |
| `useCaseRelation(cfg)` | `UseCaseRelation` |
| `useCaseWalkthrough(cfg)` | `UseCaseWalkthrough` |
| `sequenceDiagram(cfg)` | `SequenceDiagram` |
| `sequenceOrder(cfg)` | `SequenceOrderBuilder` |
| `classBuild(cfg)` | `ClassBoxBuilder` |
| `matchBuild(cfg)` | `MatchBuilder` |
| `useCaseBuild(cfg)` | `UseCaseBuilder` |
| `patternFigure(cfg)` | `PatternFigure` |

## Memory model

The canonical 4-segment diagram (Stack / Heap / Global-Static / Code) plus the stepper
that pairs it with a code panel.

- `MemoryModel({ cells, axis, regions, legend, segments, active })` — the diagram itself.
- `MemoryScene({ title, code, steps, lang, asm, asmMap, asmLabel, asmLang, knobs, segments, axis, outLabel })` — stepper: code panel + model, one entry per step.
- `MemoryDualScene({ title, left, right })` — two scenes side by side.
- `MemoryCompare({ title, stages, punch, hint, lang })` — staged before/after comparison.
- `ObjectLayout({ title, slots, pointers, note })` — one object's slots with pointer arrows.
- `SizeLayout({ title, fields, lang, header, vptr })` / `SizeCompare({ items, lang })` — byte-level struct layout; `SizeCompare` stacks several cards.
- `sizeLayout(fields, opts)` — the layout computation behind `SizeLayout`.

**Cell factories** — `stack`, `heap`, `glob`, `text`, and the JVM runtime areas
`methodArea`, `opstack`, `pcreg`. Each is `mkCell(region)`.

**Cell builders**

- `obj(type, fields, base)` — an object/struct cell from a reusable field spec; values positional or keyed by name.
- `derived(layers, base)` — one object laid out as its inheritance chain, byte strip colour-grouped by subobject.
- `part(label, type, fields, id, region)` — a sub-object card for construction/destruction order.
- `spotlight(cells)` — returns `hl(id)` highlighting one cell and dimming the rest.
- `ladder(lines)` — accumulating console output; `ladder([...])(n)` = first `n` lines.

**Prebuilt scenes** — `l06VtableScene({ predict })` (vptr → vtable → function),
`l02HeapScene({ predict })`. Both shared between an explanatory demo and a practice.

## Code panels

- `CodeBlock({ code, activeLine, lang, onHoverLine, onPickLine, pickable })` — line-numbered, highlighted C++/Java/asm. `activeLine` may be a number, array, or Set.
- `CodeAsmPane({ code, lang, asm, asmMap, asmLabel, asmLang, ... })` — side-by-side source/assembly with synchronized highlighting.
- `cppBuildPipeline` — the standard preprocess → compile → assemble → link step data.

## Diagram primitives

Shared SVG building blocks; every concept diagram sits on these.

- `DiagramSvg({ viewBox, ariaLabel, maxWidth, children })` — the `<svg>` wrapper; defines the shared arrowhead marker once. **Every figure starts here.**
- `DiagramBox({ cx, cy, w, h, label, note, sub, neutral })` — rounded box centred at `(cx,cy)`; `sub` picks a palette role, `neutral` = colourless.
- `DiagramEdge({ from, to, label, dashed })` — arrow between two `{x,y}` points.
- `DiagramCard({ x, y, w, title, sections, sub, neutral, abstract, dashed, underline })` — a compartmented UML card. `abstract` italicises the title, `underline` gives the object-diagram `name : Class` form. A row is a string or `{ text, italic, underline }` — italic = abstract member, underline = **static**.
- `SvgCode({ x, y, lines, title, w })` / `svgCodeSize(lines, title)` — the pattern decks' pseudocode callout parked beside the card that owns it (Singleton's lazy init, Flyweight's cache, Proxy's guard). Size it first when you need to place it.
- `diagramCardHeight(sections, opts)` — height of such a card before you place it.
- `diagramPalette(i)` — the 4-role theme-token palette (reuses the segment hues).
- `CrossOut({ x, y, w, h, size, strokeWidth, opacity })` — the shared "this is wrong" X.
- `Pipeline({ steps, maxWidth, ariaLabel })` — a linear box-and-arrow chain.

## UML — class & object diagrams

- `cls(title, attrs, methods)` — the standard two-compartment class spec.
- `ab(text)` — an italic (abstract) member row, e.g. `ab("+ draw()")`.
- `st(text)` — an underlined (static) member row, e.g. `st("+ getInstance() : Singleton")`.
- `treeLayout({ cx, topY, parent, children, cardW, gap, forkGap })` — lays out a one-parent tree; returns rects with `cx/top/bottom`.
- `ClassTree({ layout, relation })` — renders a `treeLayout` result plus its fork connector.
- `InheritFork({ parentCx, parentBottomY, childCxs, childTopY, busY, relation })` — one inheritance fork: hollow-triangle arrow, horizontal bus, drop to each child.

## Design-pattern figures (notes 19–21)

The three pattern decks draw every pattern the same way, so that shape is a factory
rather than eighteen hand-placed SVGs.

- `PatternFigure({ title, intent, bad, badTag, good, goodTag, client, caption, maxWidth })` — the
  chrome: intent line, the rejected half, the pattern half, the client code, and a
  `CompareCaption`. `bad` / `good` are either `{ code, lang, note }` (a `CodeBlock`) or
  `{ node, viewBox, width, height, ariaLabel, maxWidth, note }` (a `DiagramSvg`); a diagram
  `bad` is stamped with `CrossOut`, a code one is not.
- `patternTree({ context, edge, edgeLabel, contextW, place, parent, children, relation, cardW, gap, note })`
  — the picture most patterns reduce to: a context card joined by one `UmlLink` to an
  abstract parent that forks into its children. `place: "left"` (default) puts the context
  beside the parent, `"above"` stacks it (cheaper in width for a five-subclass fork).
  Returns `{ node, viewBox, width, height, layout }`, so it drops straight into
  `PatternFigure`'s `good`, or into your own `DiagramSvg` with extra elements appended.

Figures the decks draw only once — Facade's subsystem, Bridge's two hierarchies,
Adapter's out-of-hierarchy adaptee — skip `patternTree` and pass their own `{ node, viewBox }`.

## UML — use case diagrams

- `UseCaseDiagram({ system, actors, cases, associations, relations, caption, showRoles, maxWidth, visible, ry, rowGap, onPick, pickedId })` — the full diagram.
- `UseCaseRelation({ focal, satellites, kind, caption, maxWidth, ry })` — one focal case with `«include»` / `«extend»` / generalization satellites.
- `UseCaseWalkthrough({ title, spec, steps, maxWidth })` — stepped reveal of a diagram.
- `Actor({ x, y, label, active })` — stick figure; returns its geometry for linking.
- `UseCaseOval({ cx, cy, rx, ry, label, sub, dashed })` — a behaviour pill; `label` may be an array of lines.
- `SystemBoundary({ x, y, w, h, label })` — the rounded frame with top-centred title.
- `UmlLink({ from, to, kind, label, labelDy, labelDx, orth, elbow })` — association/include/extend/generalize link. `orth` forces H/V elbow routing so no arrow reads diagonal.
- `ovalRx(label, min, padX)` — oval radius wide enough for the longest label line.
- `ovalEdge(cx, cy, rx, ry, tx, ty)` — point on an ellipse rim toward `(tx,ty)`, so links touch the rim not the centre.

**Prebuilt specs** — `librarySystem` / `librarySteps`, `converterUseCase` /
`converterUseCaseSteps`, `soundRecorder`.

## UML — sequence diagrams

- `SequenceDiagram({ participants, messages, activations, fragments, annotations, caption, maxWidth })`.
- **Prebuilt specs** — `converterSeqKgLb`, `converterSeqCmInch`, `converterSeqMerged`.

## Interactive exercises

- `SequenceOrderBuilder({ prompt, participants, messages, activations })` — order the messages.
- `ClassBoxBuilder({ prompt, className, abstract, attributes, operations, typeDistractors, relationship })` — build a class box. `relationship` is optional: omit it (a class that joins nothing, e.g. note 19's Singleton) and the whole edge stage — palette, grading slot, preview target — drops out.
- `MatchBuilder({ prompt, options, items, paletteLabel, slotLabel, slotPlaceholder })` — match items to options. The three wording slots default to note 16's `"Principles" / "violates" / "principle"`; the pattern matchers pass `"Patterns" / "is a" / "pattern"`.
- `UseCaseBuilder({ prompt, system, elements, associations, relations, whyZone, source })` — assemble a use case diagram.
- `Mcq({ questions })` — multiple choice. Choices are seeded-shuffled per question, so **author the correct choice first**; the order never survives into the UI. Put the explanation in `why`.
- `McqFigure({ figure })` — `{ code, lang }` or `{ image, alt }` above a question.

**Exercise chrome**

- `BuilderControls({ status, onCheck, onReset, onReveal, checkDisabled, revealed })` — the shared Check / Reset / Reveal bar.
- `gradedChipState({ revealed, checked, filled, ok })` — the shared grading → colour mapping. Use it; don't reinvent the states.
- `Chip({ state, children, ariaLabel, className })` — one draggable/tappable token.
- `useTapOrDrag({ onMove })` — pointer handling that works for both tap and drag.
- `PredictGate({ predict, onAnswer })` / `Verdict({ predict, pick })` — predict-then-reveal gate and its result line.
- `WhyDot({ n, x, y, active, onToggle, label })` / `WhyNotes({ notes, open })` — numbered marker drawn *inside* the figure's `DiagramSvg`, plus the caption panel it opens.
- `KnobBar({ knobs, value, onChange })` — a row of toggles for scene variants.
- `CompareTitles({ cols })` / `CompareCaption({ cols, punch })` — headers and caption for side-by-side layouts.

---

## `@kit` — global UI primitives

From `notes/artifacts/kit.jsx` (111 lines; read it directly if you need detail):

`Button`, `Card` + `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` /
`CardFooter`, `Badge`, `Input`, `Label`, `Slider`, `Switch`, `Field`, `Stat`,
`ButtonGroup`, `Stepper`, `useTheme`, `useChartTheme`.

## Caption markup

Every caption string that goes through `renderCaption` — `MemoryScene` step captions,
`MatchBuilder`'s `why`, `ClassBoxBuilder`'s `whyVis`/`whyType`, `SvgCode`-adjacent
`note` fields, `PatternHalf`'s `note` — supports **only** `**bold**`, `*italic*`, and
`` `code` ``. **Markdown links do not render** and will show as literal `[text](url)`;
put cross-note links in the note's own markdown, not in a figure caption.

`CompareCaption`'s `punch` is rendered raw, so it takes plain text or JSX — not even
backticks. Its `cols[].children` is JSX, so use `<code className="mm-ic">…</code>` there.

## Styles

`demos/_shared.css` holds the `mm-*` classes and theme tokens. Colour comes from CSS
custom properties (`--seg-*`, `--mm-cell-*`) so figures track light/dark automatically —
never hard-code a hex value in a demo.
