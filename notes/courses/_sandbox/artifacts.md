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

## Kit usage (shared components)

```artifact
import { Card, Slider } from '@kit';
export default function App() {
  const [v, setV] = React.useState(50);
  return (
    <Card title="Slider demo">
      <Slider min="0" max="100" value={v} onChange={e => setV(+e.target.value)} />
      <p>value: {v}</p>
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
