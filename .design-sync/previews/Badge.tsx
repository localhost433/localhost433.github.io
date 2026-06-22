import { Badge } from 'kit';

export const Variants = () => (
  <div className="ui-row ui-row--wrap">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="outline">Outline</Badge>
  </div>
);

export const InContext = () => (
  <div className="ui-row ui-row--wrap">
    <Badge variant="secondary">New</Badge>
    <Badge>3 updates</Badge>
    <Badge variant="destructive">Overdue</Badge>
    <Badge variant="outline">v1.0.0</Badge>
  </div>
);
