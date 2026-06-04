---
title: Artifact Sandbox
date: 2026-06-04
---

Test page for interactive artifacts. Not linked from the public course list.

## Inline counter

```artifact
import { Card, CardContent, Stepper } from '@kit';
export default function App() {
  const [n, setN] = React.useState(0);
  return (
    <Card>
      <CardContent>
        <div className="ui-row ui-row--center">
          <Stepper value={n} onChange={setN} />
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
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, ButtonGroup, Badge, Input, Field, Slider, Switch, Stat } from '@kit';
export default function App() {
  const [v, setV] = React.useState(50);
  const [on, setOn] = React.useState(true);
  const [name, setName] = React.useState("");
  const [range, setRange] = React.useState("week");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Component showcase <Badge variant="secondary">kit</Badge></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="ui-stack">
          <div className="ui-row ui-row--wrap">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <ButtonGroup>
            <Button variant={range === "day" ? "default" : "outline"} onClick={() => setRange("day")}>Day</Button>
            <Button variant={range === "week" ? "default" : "outline"} onClick={() => setRange("week")}>Week</Button>
            <Button variant={range === "month" ? "default" : "outline"} onClick={() => setRange("month")}>Month</Button>
          </ButtonGroup>
          <Field label="Name" htmlFor="nm">
            <Input id="nm" placeholder="Type here…" value={name} onChange={e => setName(e.target.value)} />
          </Field>
          <div className="ui-row">
            <Switch checked={on} onCheckedChange={setOn} />
            <span>Notifications {on ? "on" : "off"}</span>
          </div>
          <div className="ui-row ui-row--between">
            <Stat label="Slider" value={v} />
            <div className="ui-fill"><Slider min="0" max="100" value={v} onChange={e => setV(+e.target.value)} /></div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Badge>{name ? "Hi, " + name : "no name"}</Badge>
        <Badge variant="outline">{range}</Badge>
      </CardFooter>
    </Card>
  );
}
```

## Library import (recharts)

```artifact
import { Card, CardHeader, CardTitle, CardContent, useChartTheme } from '@kit';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const data = Array.from({ length: 24 }, (_, i) => ({
  x: i,
  sin: Math.round((Math.sin(i / 3) * 10 + 12) * 10) / 10,
  cos: Math.round((Math.cos(i / 3) * 10 + 12) * 10) / 10,
}));
export default function App() {
  const c = useChartTheme();
  return (
    <Card>
      <CardHeader><CardTitle>Trig waves</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid stroke={c.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="x" stroke={c.axis} tickLine={false} fontSize={12} />
            <YAxis stroke={c.axis} tickLine={false} fontSize={12} />
            <Tooltip contentStyle={c.tooltip} />
            <Legend />
            <Line type="monotone" dataKey="sin" stroke={c.colors[0]} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="cos" stroke={c.colors[1]} strokeWidth={2} dot={false} />
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
