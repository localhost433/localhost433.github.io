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
