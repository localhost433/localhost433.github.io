# Notes Artifact Kit — conventions for building with this design system

A small shadcn-inspired React kit. Components are plain functions you read off
`window.Kit` and compose — there is **no provider to wrap** and **no theme object to
pass**. Styling comes entirely from the shipped stylesheet (`styles.css`, which
`@import`s `_ds_bundle.css`); link that one file and every component is styled.

## Theming

Design tokens are HSL CSS custom properties defined at `:root` and consumed as
`hsl(var(--token))`. Dark mode is opt-in: add the class `dark-mode` to the root
`<html>` element and the same tokens flip to their dark values — components need no
changes. The tokens:

`--background` `--foreground` · `--card` `--card-foreground` · `--primary`
`--primary-foreground` · `--secondary` `--secondary-foreground` · `--muted`
`--muted-foreground` · `--accent` `--accent-foreground` · `--destructive`
`--destructive-foreground` · `--border` · `--input` · `--ring` · `--radius`

Style your own layout glue with these vars (e.g. `color: hsl(var(--muted-foreground))`),
never hard-coded hex — that is what keeps custom markup on-theme in both light and dark.

## The styling idiom

Two layers, both already in the bundle:

1. **Variant props, not classes.** Components carry their design language through props,
   not utility classes you compose. `Button` takes `variant`
   (`default | secondary | destructive | outline | ghost | link`) and `size`
   (`default | sm | lg | icon`); `Badge` takes `variant`
   (`default | secondary | destructive | outline`). Reach for the prop — don't restyle
   with classes.

2. **Layout helper classes** for arranging components — use these for your own glue:

   | Class | Purpose |
   |---|---|
   | `ui-row` | horizontal flex row (gap + vertical centering) |
   | `ui-row--wrap` / `ui-row--center` / `ui-row--between` | wrap / center / space-between modifiers |
   | `ui-stack` | vertical flex stack with gap |
   | `ui-fill` | `flex: 1`, fills remaining row space |

   These are the only class names the kit defines. Don't invent new `ui-*` names —
   they won't resolve.

## Where the truth lives

Read `styles.css` and its import `_ds_bundle.css` for the exact tokens and component
styles, and each component's `<Name>.prompt.md` (usage) and `<Name>.d.ts` (props)
before composing it. Cards build from `Card` + `CardHeader` / `CardTitle` /
`CardDescription` / `CardContent` / `CardFooter`, or pass `Card`'s `title` prop for the
common header shorthand. The hooks `useTheme()` and `useChartTheme()` are also on
`window.Kit` for theme-aware rendering (e.g. chart colors that follow light/dark).

## One idiomatic example

```jsx
const { Card, CardHeader, CardTitle, CardContent, CardFooter, Field, Input, Button } = window.Kit;

function SignupCard() {
  return (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader><CardTitle>Create account</CardTitle></CardHeader>
      <CardContent>
        <div className="ui-stack">
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" placeholder="you@example.com" />
          </Field>
          <Field label="Password" htmlFor="pw">
            <Input id="pw" type="password" />
          </Field>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Sign up</Button>
        <Button variant="ghost">Cancel</Button>
      </CardFooter>
    </Card>
  );
}
```
