import { Button } from 'kit';

export const Variants = () => (
  <div className="ui-row ui-row--wrap">
    <Button>Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
  </div>
);

export const Sizes = () => (
  <div className="ui-row ui-row--wrap">
    <Button size="sm">Small</Button>
    <Button size="default">Default</Button>
    <Button size="lg">Large</Button>
    <Button size="icon" aria-label="Add">+</Button>
  </div>
);

export const Disabled = () => (
  <div className="ui-row ui-row--wrap">
    <Button disabled>Disabled</Button>
    <Button variant="outline" disabled>Disabled outline</Button>
  </div>
);
