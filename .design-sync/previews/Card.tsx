import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from 'kit';

export const Composed = () => (
  <Card style={{ maxWidth: 360 }}>
    <CardHeader>
      <CardTitle>Deploy project</CardTitle>
      <CardDescription>Push your latest changes to production.</CardDescription>
    </CardHeader>
    <CardContent>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
        Your last deploy finished 4 minutes ago. 3 commits are ready to ship.
      </p>
    </CardContent>
    <CardFooter>
      <Button>Deploy</Button>
      <Button variant="outline">Cancel</Button>
    </CardFooter>
  </Card>
);

export const TitleShorthand = () => (
  <Card title="Storage used" style={{ maxWidth: 360 }}>
    <div className="ui-row ui-row--between">
      <span style={{ fontSize: 14 }}>42.8 GB of 100 GB</span>
      <Badge variant="secondary">43%</Badge>
    </div>
  </Card>
);
