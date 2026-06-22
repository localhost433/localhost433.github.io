# design-sync notes — Notes Artifact Kit

Repo-specific gotchas for syncing the in-note React kit to claude.ai/design.

## What this DS is

- The "kit" is the React component library used inside note **artifacts** (interactive
  demos embedded in markdown notes). Source: `notes/artifacts/kit.jsx`. Styles:
  `notes/artifacts/theme.css` (shadcn-inspired HSL tokens + `ui-*` classes).
- This is **not** a conventional npm package — there is no `dist/`, no `.d.ts`, and the
  site itself doesn't depend on React (the artifact iframe loads React 18.3.1 from
  esm.sh at runtime). So the build runs the converter's **package shape in synth-entry
  mode**, pointed at `kit.jsx`.

## Build setup (off-script)

- Run everything from the **repo root** (`localhost433.github.io/`), not from a course
  subdir — `.design-sync/` and `ds-bundle/` resolve relative to cwd.
- React/react-dom are NOT in the repo's `node_modules`. A scratch install supplies them:
  `react@18.3.1 react-dom@18.3.1` (match the artifact host's esm.sh pin in
  `notes/artifact-host.html`) in `.design-sync/.cache/scratch/node_modules`. Pass that as
  `--node-modules`.
- Converter deps (`esbuild`, `ts-morph`, `@types/react`) install into `.ds-sync/`.
- Invocation pins `--entry ./notes/artifacts/kit.jsx` so `PKG_DIR` walks up to the repo
  root (where the only named `package.json` lives). Discovery comes from
  `cfg.componentSrcMap` (all 16 components → `kit.jsx`), since there is no `.d.ts`.
- Component contracts (`<Name>.d.ts`) come entirely from `cfg.dtsPropsFor` — hand-written
  from `kit.jsx`, since there are no shipped types. Keep them in sync with `kit.jsx`.

## Fresh-clone / re-sync tooling (all gitignored — reinstall each clone)

Run from the repo root:

- Converter deps: `npm i --prefix .ds-sync esbuild ts-morph @types/react typescript playwright`
  - `typescript` is required for validate's `.d.ts` parse check to actually run (it's
    skipped otherwise — and the `.d.ts` here are hand-written, so you want them checked).
  - `playwright` + chromium for the render check: `./.ds-sync/node_modules/.bin/playwright install chromium`
    (installs to `~/Library/Caches/ms-playwright`; do NOT use `PLAYWRIGHT_BROWSERS_PATH=0`
    — it tries an in-package install that hit a `__dirlock` stale-lock error).
- Scratch React (the `--node-modules` target): `npm i --prefix .design-sync/.cache/scratch react@18.3.1 react-dom@18.3.1 @types/react@18`

Build / validate / capture commands (repo root):

```
node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules .design-sync/.cache/scratch/node_modules --entry ./notes/artifacts/kit.jsx --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle
node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules .design-sync/.cache/scratch/node_modules --entry ./notes/artifacts/kit.jsx --out ./ds-bundle   # first sync: no --remote
```

First sync (2026-06-18): all 16 components authored + graded good, 0 floor cards,
validate clean. Uploaded to project 82d15967-a95a-4668-9885-3551f4f5d8fc.

## Components (16)

Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge,
Input, Label, Slider, Switch, Field, Stat, ButtonGroup, Stepper.

Not components (intentionally excluded from cards — still bundled / on `window.Kit`):
`useTheme`, `useChartTheme` (hooks), `cn` (classnames util).

## Styling / theming

- `theme.css` is self-contained: system fonts (no `@font-face` → no `[FONT_MISSING]`),
  HSL tokens at `:root`, dark variants under `html.dark-mode`. Preview cards render the
  light theme (no theme toggle in the preview env; `useTheme` falls back to "light").
- Layout helpers live in `theme.css` too (`ui-row`, `ui-stack`, `ui-fill`, `ui-stat`,
  modifiers `--wrap`/`--center`/`--between`) — use these for preview layout glue.
- `#root` carries the base background/foreground/font. Component classes carry their own
  colors, so they style correctly even outside `#root`.

## Re-sync risks

- `cfg.dtsPropsFor` is hand-authored — if `kit.jsx` gains/changes props, the `.d.ts`
  contracts will silently go stale. Re-check against `kit.jsx` on every sync.
- The React version is pinned by hand to match the artifact host's esm.sh URL. If
  `notes/artifact-host.html` bumps React, update the scratch install to match.
- `cssEntry` ships the whole `theme.css`. If site-only styles ever get mixed into that
  file, they'd reach every design built with the kit — keep `theme.css` kit-only.
