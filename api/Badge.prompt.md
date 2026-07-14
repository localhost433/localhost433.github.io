Badge from kit. Use via `window.Kit.Badge` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface BadgeProps {
  /** Visual style variant. */
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  children?: React.ReactNode;
  [prop: string]: unknown;
}
```

## Examples

### Variants

```jsx
() => (
  <div className="ui-row ui-row--wrap">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="outline">Outline</Badge>
  </div>
)
```

### InContext

```jsx
() => (
  <div className="ui-row ui-row--wrap">
    <Badge variant="secondary">New</Badge>
    <Badge>3 updates</Badge>
    <Badge variant="destructive">Overdue</Badge>
    <Badge variant="outline">v1.0.0</Badge>
  </div>
)
```
