import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from 'kit';

export const InCard = () => (
  <Card style={{ maxWidth: 340 }}>
    <CardHeader>
      <CardTitle>Discard changes?</CardTitle>
    </CardHeader>
    <CardContent>
      <p style={{ margin: 0, fontSize: 14 }}>The footer holds the card's actions, aligned in a row.</p>
    </CardContent>
    <CardFooter>
      <Button variant="destructive">Discard</Button>
      <Button variant="outline">Keep editing</Button>
    </CardFooter>
  </Card>
);
