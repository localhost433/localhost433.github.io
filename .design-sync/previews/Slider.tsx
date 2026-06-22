import { Slider } from 'kit';

export const Default = () => (
  <div style={{ maxWidth: 320 }}>
    <Slider min={0} max={100} defaultValue={60} />
  </div>
);

export const Levels = () => (
  <div className="ui-stack" style={{ maxWidth: 320 }}>
    <Slider min={0} max={100} defaultValue={25} />
    <Slider min={0} max={100} defaultValue={50} />
    <Slider min={0} max={100} defaultValue={90} />
  </div>
);
