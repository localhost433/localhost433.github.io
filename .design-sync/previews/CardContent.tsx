import { Card, CardHeader, CardTitle, CardContent } from 'kit';

export const InCard = () => (
  <Card style={{ maxWidth: 340 }}>
    <CardHeader>
      <CardTitle>Release notes</CardTitle>
    </CardHeader>
    <CardContent>
      <p style={{ margin: '0 0 .5rem', fontSize: 14 }}>The padded body region of a card.</p>
      <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: 14, lineHeight: 1.6 }}>
        <li>Fixed slider focus ring</li>
        <li>Added Stepper bounds</li>
      </ul>
    </CardContent>
  </Card>
);
