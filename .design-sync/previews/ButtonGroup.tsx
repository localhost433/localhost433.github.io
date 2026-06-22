import { ButtonGroup, Button } from 'kit';

export const Segmented = () => (
  <ButtonGroup>
    <Button variant="default">Day</Button>
    <Button variant="outline">Week</Button>
    <Button variant="outline">Month</Button>
  </ButtonGroup>
);

export const Toolbar = () => (
  <ButtonGroup>
    <Button variant="outline" aria-label="Bold"><strong>B</strong></Button>
    <Button variant="outline" aria-label="Italic"><em>I</em></Button>
    <Button variant="outline" aria-label="Underline"><u>U</u></Button>
  </ButtonGroup>
);
