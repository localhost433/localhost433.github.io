import { Input } from 'kit';

export const Default = () => (
  <div style={{ maxWidth: 280 }}>
    <Input placeholder="you@example.com" />
  </div>
);

export const States = () => (
  <div className="ui-stack" style={{ maxWidth: 280 }}>
    <Input defaultValue="Ada Lovelace" />
    <Input type="password" defaultValue="secret123" />
    <Input disabled defaultValue="Disabled field" />
  </div>
);
