CardFooter from kit. Use via `window.Kit.CardFooter` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface CardFooterProps {
  className?: string;
  children?: React.ReactNode;
  [prop: string]: unknown;
}
```

## Examples

### InCard

```jsx
() => (
  <Card style={{ maxWidth: 340 }}>
    <CardHeader>
      <CardTitle>Discard changes?</CardTitle>
    </CardHeader>
    <CardContent>
      <p style={{ margin: 0, fontSize: 14 }}>The footer holds the card's actions, aligned in a row.</p>
    </CardContent>
    <CardFooter>
      <Button variant="destructive">Discard</Button>
      <Button variant="outline">Keep editing</Button>
    </CardFooter>
  </Card>
)
```
