---
title: Artifact Sandbox
date: 2026-06-04
---

Test page for interactive artifacts. Not linked from the public course list.

## Inline counter

```artifact
export default function App() {
  const [n, setN] = React.useState(0);
  return <button onClick={() => setN(n + 1)}>clicked {n} times</button>;
}
```

## Error handling (intentional)

```artifact
export default function App() {
  return <div>{this.is.broken}</div>;
}
```

## Kit usage (shadcn-style components)

```artifact
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge, Input, Label, Slider, Switch } from '@kit';
export default function App() {
  const [v, setV] = React.useState(50);
  const [on, setOn] = React.useState(true);
  const [name, setName] = React.useState("");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Component showcase <Badge variant="secondary">kit</Badge></CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label htmlFor="nm">Name</Label>
          <Input id="nm" placeholder="Type here…" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Switch checked={on} onCheckedChange={setOn} />
          <span>Switch is {on ? "on" : "off"}</span>
        </div>
        <Label>Slider: {v}</Label>
        <Slider min="0" max="100" value={v} onChange={e => setV(+e.target.value)} />
      </CardContent>
      <CardFooter>
        <Badge>{name ? "Hi, " + name : "no name"}</Badge>
      </CardFooter>
    </Card>
  );
}
```

## Library import (recharts)

```artifact
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
const data = Array.from({ length: 20 }, (_, i) => ({ x: i, y: Math.round(Math.sin(i / 3) * 10 + 10) }));
export default function App() {
  return (
    <LineChart width={360} height={200} data={data}>
      <XAxis dataKey="x" /><YAxis /><Tooltip />
      <Line dataKey="y" dot={false} />
    </LineChart>
  );
}
```

## File-based artifact

```artifact src=demos/hello.jsx
```
