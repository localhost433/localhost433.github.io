import { Card, CardHeader, CardTitle, CardDescription, CardContent } from 'kit';

export const InHeader = () => (
  <Card style={{ maxWidth: 340 }}>
    <CardHeader>
      <CardTitle>Invoices</CardTitle>
      <CardDescription>A muted supporting line beneath the title.</CardDescription>
    </CardHeader>
    <CardContent>
      <p style={{ margin: 0, fontSize: 14 }}>Use it to add context without competing with the title.</p>
    </CardContent>
  </Card>
);
