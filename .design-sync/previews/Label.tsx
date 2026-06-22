import { Label, Input } from 'kit';

export const WithInput = () => (
  <div className="ui-field" style={{ maxWidth: 280 }}>
    <Label htmlFor="email">Email address</Label>
    <Input id="email" placeholder="you@example.com" />
  </div>
);

export const Standalone = () => <Label>Display name</Label>;
