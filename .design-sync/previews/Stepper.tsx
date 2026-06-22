import { Stepper } from 'kit';

export const Default = () => <Stepper value={3} onChange={() => {}} />;

export const Bounded = () => (
  <div className="ui-row" style={{ gap: '2rem' }}>
    <Stepper value={0} min={0} max={10} onChange={() => {}} />
    <Stepper value={10} min={0} max={10} onChange={() => {}} />
  </div>
);
