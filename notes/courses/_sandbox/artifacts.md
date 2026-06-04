---
title: Artifact Sandbox
date: 2026-06-04
---

Test page for interactive artifacts. Not linked from the public course list.

## Inline counter

```artifact
import { Card, CardContent, Button } from '@kit';
export default function App() {
  const [n, setN] = React.useState(0);
  return (
    <Card>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <Button variant="outline" size="icon" onClick={() => setN(n - 1)}>−</Button>
          <span style={{ fontSize: 32, fontWeight: 600, minWidth: 56, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{n}</span>
          <Button variant="outline" size="icon" onClick={() => setN(n + 1)}>+</Button>
        </div>
      </CardContent>
    </Card>
  );
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
import { Card, CardHeader, CardTitle, CardContent, useTheme } from '@kit';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const data = Array.from({ length: 24 }, (_, i) => ({ x: i, y: Math.round((Math.sin(i / 3) * 10 + 12) * 10) / 10 }));
export default function App() {
  const dark = useTheme() === "dark";
  const line = dark ? "#a78bfa" : "#6d28d9";
  const grid = dark ? "#2c2f33" : "#e5e7eb";
  const axis = dark ? "#9aa0a6" : "#6b7280";
  return (
    <Card>
      <CardHeader><CardTitle>Sine wave</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="x" stroke={axis} tickLine={false} fontSize={12} />
            <YAxis stroke={axis} tickLine={false} fontSize={12} />
            <Tooltip contentStyle={{ background: dark ? "#15171a" : "#fff", border: "1px solid " + grid, borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="y" stroke={line} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

## File-based artifact

```artifact src=demos/hello.jsx
```
