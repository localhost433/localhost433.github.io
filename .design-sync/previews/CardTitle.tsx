import { Card, CardHeader, CardTitle, CardContent } from 'kit';

export const InHeader = () => (
  <Card style={{ maxWidth: 340 }}>
    <CardHeader>
      <CardTitle>Monthly report</CardTitle>
    </CardHeader>
    <CardContent>
      <p style={{ margin: 0, fontSize: 14 }}>Rendered as an h3 — the primary heading of a card.</p>
    </CardContent>
  </Card>
);
