# CSCI-UA-473 demo kit — API index

What already exists, so a new figure starts from a spec rather than from an empty
`<svg>`. Grep the export name in `_kit.jsx` for the full signature.

**Two rules before you touch anything:**

1. **Edit the `.jsx`, never the generated `.js`.** Each `demos/*.jsx` has a sibling
   `*.js` compiled by `npm run build:artifacts`. The runtime prefers the `.js` and
   falls back to in-browser Babel on the `.jsx`, so a `.jsx`-only change *appears*
   to work locally while shipping stale code. Rebuild before you finish.
2. **This course has no `.mm-*` tier.** `note.js` injects `theme.css` plus *this
   course's* `_shared.css`, and ours defines no custom properties at all. Anything
   from `@kit` that resolves `--mm-*` or `--seg-*` (`DiagramSvg`, `diagramPalette`)
   is therefore broken here and deliberately not re-exported. Colours come from
   `useClassColors()`.

## Imports available inside a demo

| Specifier | Resolves to |
|---|---|
| `@course` | `demos/_kit.jsx` — everything on this page |
| `@course/logic` | `demos/_logic.mjs` — the pure maths, covered by `_logic.test.js` |
| `@kit` | `notes/artifacts/kit.jsx` — the shared UI primitives |
| `react` | provided by the host; do not bundle |

## Colours

`useClassColors()` returns `{ pos, neg, acc, mid, fg, muted, border, bg }`, resolved
to literals per theme. `pos`/`neg` are the two classes, `acc` is "the object under
discussion", `mid` is the neutral midpoint of the pos↔neg scale. The four theme
tokens are read as literals because **canvas silently ignores `hsl(var(--token))`**
and keeps its previous colour — the bug that once drew every grid in the last bar's
orange.

`toneOf(C, name)` maps a semantic tone to `{stroke, fill, fillOpacity, text, marker}`.
Tones: `plain`, `acc`, `pos`, `neg`, `mid`, `solid` (filled, white text), `ghost`.

## Figure shell

- `Figure({ title, caption, children })` — the sr-only `<h2>` (a sentence, not a
  label: the note reads it back) plus an optional caption below the drawing.
  Captions take `renderCaption` markup: `` `code` ``, `**bold**`, `*italic*`.

## SVG surface and primitives

- `FigureSvg({ viewBox, ariaLabel, maxWidth, children })` — the surface. Defines one
  arrowhead marker per palette role; that is why `Arrow`'s `tone` is a role name.
- `Box({ x, y, w, h, shape, tone, C, lines, align, at, step, dash })` — a labelled
  rect or ellipse. `lines` is `[{ t, size, weight, fill, italic, mono, math }]`,
  centred as a block, or left-aligned with `align="left"`.
- `Lines({ x, y, lines, size, lh, fill, anchor, italic, at, step })` — free text,
  wrapped by hand: SVG has no flow layout.
- `Sym({ x, y, text, size, fill, anchor })` — one line of marked-up text.
- `Arrow({ from, to, C, tone, dash, width, at, step, head })`, and
  `port(node, "top"|"bottom"|"left"|"right")` for endpoints on a `Box`'s geometry.
- `Bracket({ x, y, h, w, side, C })` — a matrix delimiter, drawn as three strokes.
- `TableGrid({ x, y, cw, ch, cells, colHead, rowHead, corner, C, ... })` — a grid of
  `{ t, tone, alpha, bold, fg }` cells. Behind the design matrix, both cost matrices
  and the joint-probability table.

### Writing TeX: one backslash or two

The same string needs different escaping depending on where it sits, and getting it
wrong fails silently — `\text` becomes a tab plus "ext", and the figure renders
"fext: accept".

| Context | Write |
|---|---|
| a plain JSX attribute: `tex="..."` | **one** backslash — attribute values are literal |
| any JS expression: `tex={...}`, `colHead={[...]}`, `labels={[...]}`, a `const` array | **two** — normal JS string escapes apply |

Grep for `(?<!\\)\\[a-zA-Z]` inside a `{...}` context to find the broken ones.

### Markup inside figure text

`symRuns` parses `E_{in}`, `x_i`, `2e^{−2ε²N}` into baseline-shifted tspans, and every
text primitive above runs it. Do **not** reach for the Unicode subscript letters: they
are spread over three blocks and resolve from different fallback fonts, so `Eₒᵤₜ`
renders with the `u` visibly higher than its neighbours. **The blackboard-bold letters
are worse and the escape hatch is different.** `ℍ 𝕏 𝕐 𝒜` have no glyph in the UI sans
face and fall back to something broken — `ℍ` prints as `IH`. In SVG, route them through
`TeX`. On a **canvas** there is no `TeX` to route them through, because `Plot.label` and
`Scene3D.text` are `fillText` calls: write a plain `H` there and keep the notation for the
prose around the figure, where MathJax handles it. Set `math: true` on a `Box`
line for `𝕏 𝕐 ℍ 𝒜`, which have the same problem.

## TeX

Figures that need real notation carry `math` on their fence, which makes the host load
MathJax for that artifact. The bundle is `tex-mml-chtml`, so the output is HTML — there
is no `tex2svg`.

- `TeX({ x, y, tex, size, fill, anchor, w, dy, at, step })` — a `<foreignObject>` inside
  the figure's SVG. Contents are in user units, so it scales with the viewBox. Boxes are
  sized generously because a foreignObject clips.
- `TableGrid(..., texHead)` — headers and corner go through `TeX`; cells stay plain.
- `useTypeset(deps)` — calls the host's `window.typesetMath()`; a no-op without the flag.
- `TexLayer` / `placeLabel`, via the `labels` prop on `Canvas3D` and `PlotFigure` — TeX
  over a canvas, which has no DOM to hang `foreignObject` on. Labels are typeset once and
  then moved by `style.transform`, so a 3D label can track its vector every frame.

House convention: **math is TeX, prose is the UI sans face.** A label that names a thing
("cross-entropy", "0-1 loss") stays sans; an expression is TeX.

## Motion

`static` in a note fence means *no controls*, not *no motion* — the lecturer's own
slides build the components diagram one box per click.

- `useVisible(ref, { once })` — IntersectionObserver, falling back to "visible".
- `useReveal(ref, steps, { ms })` — the current step, 0…steps-1. Starts when the
  figure is scrolled into view; under `prefers-reduced-motion` it returns the last
  step immediately. Pass the index to a primitive's `at` prop and the step to `step`.
- Gating on visibility is not only good manners: `artifact-host.html` documents that
  an off-screen iframe may never paint, so `rAF` never fires there, while
  `setInterval` runs regardless and would burn the whole sequence unseen.

## Canvas surfaces

- `Plot` — the 2D drawing surface. `grid`, `axes`, `curve`, `polyline`, `dot`,
  `band`, `hband`, `vline`, `label`, `labelAt`. `HistogramPlot` adds `bins`.
  `grid({ edges: false })` drops the first and last line of each family: without it
  a canvas narrower than the card it sits in closes into a faint rectangle, and that
  rectangle reads as a second background colour rather than as the edge of a plot.
  Pair it with `alignSelf: "center"` on the canvas, or the panel sits off to the left
  of a wide card, which is the other half of the same complaint.
- `PlotFigure({ width, height, draw, plotClass, plotOpts, ariaLabel })` — a still
  plot: the canvas, dpr and theme wiring around a `draw(plot)`.
- `Scene3D` — the camera, shared by `bias-absorption-3d` and `ls-projection`. A point
  is `[x1, x2, z]`; yaw rotates about the vertical, pitch tilts. `project`, `poly`,
  `seg`, `arrow`, `dot`, `ring`, `rightAngle`, `text`. Depth is painter order.
  `center` puts a scene-space point at the middle of the canvas.
- `Canvas3D({ height, draw, spin, sway, interactive, view, onView, initialView,
  sceneOpts, ariaLabel })` — the React side. `sway: { amp, seconds }` is a small
  oscillation about the pose (parallax without losing the canonical view); `spin` is
  a turntable; `view`/`onView` make the camera controlled. `sway` and `interactive`
  compose: the sway holds still for the duration of a drag and resumes about whatever
  pose the reader lets go at, so the pose being steered is the pose on screen.
  A scene-anchored caption needs care once a figure is draggable — anchor it to the
  scene's `center` point, not to a corner of the geometry, or it swings off canvas
  the first time someone turns the view.

## Figures in the notes

| File | Note | Ports |
|---|---|---|
| `matvec-column-view` | 02 | L2 slides 12, 14 |
| `joint-marginal-grid` | 02 | L2 slides 24-25 |
| `components-diagram` | 03 | L3 slides 7-13, animated in the deck's build order |
| `hypothesis-space-two-views` | 03 | no slide; the same ℍ as a family of boundaries and as a region of points |
| `paradigms-tree` | 03 | L3 slides 55-67 |
| `bin-to-learning-map` | 04 | L4 slides 16-20 |
| `loss-shapes` | 04 | L4 slide 33 |
| `error-cost-matrices` | 04 | L4 slide 34 |
| `design-matrix-anatomy` | 05 | L5 slides 8-14 |
| `ls-projection` | 05 | L5 slide 15 (ESL 3.2), in 3D |
| `regularization-path` | 05 | no slide; coefficient paths under ridge and lasso as λ grows, interactive |
| `overfitting-causes` | 06 | L6 slides 5-6; degree 2 vs 10 on a Legendre target, N / noise / Q_f sliders, interactive |
| `validation-size` | 06 | L6 slide 14 (LFD), rebuilt: E_val's mean and spread against K, one split at the current K, interactive |
| `cv-folds` | 06 | L6 slides 15, 17-20; K-fold phases, the λ loop, the fold back, leave-one-out |
| `bias-variance` | 06 | L6 slides 25-28; forty fits on fixed x, their average, bias² and variance against M, interactive |
| `h0-vs-h1` | 06 | L6 slides 29-34; constants vs lines on sin(πx), with N on a slider, interactive |
| `erm-objective-anatomy` | 00 | no slide; the supplement's own objective |

Interactive demos (`perceptron-2d`, `hoeffding-bin`, `union-bound-bins`,
`complexity-tradeoff`, `complexity-ucurve`, `ridge-vs-lasso`, `regularization-path`,
`bias-variance`, `overfitting-causes`, `validation-size`, `h0-vs-h1`, `norm-balls`, `projection-2d`, `nfl-boolean-cube`, `bias-absorption-3d`,
`practice-03`) keep their own state and controls and are fenced without `static`.
`poly-overfit` was folded into `complexity-ucurve`'s right-hand panel and deleted.

Captions name colours by what is on screen: the `neg` class is **orange** in both
themes, not red. The bin-to-learning figure keeps the lecture's word "red" for the
marbles, since that is the vocabulary the bound is stated in.

## Tests

`npm test` runs `_logic.test.js` and the shared kit-runtime tests, which import this
kit under a stubbed React with no `document`. Anything added here must survive that:
guard `typeof document`, `typeof IntersectionObserver`, `typeof matchMedia`.
