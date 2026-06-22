import { Card, CardHeader, CardTitle, CardDescription, CardContent } from 'kit';

export const InCard = () => (
  <Card style={{ maxWidth: 340 }}>
    <CardHeader>
      <CardTitle>Account settings</CardTitle>
      <CardDescription>Manage your profile and preferences.</CardDescription>
    </CardHeader>
    <CardContent>
      <p style={{ margin: 0, fontSize: 14 }}>The header groups the title and description above the content.</p>
    </CardContent>
  </Card>
);
