import { Stat } from 'kit';

export const Single = () => <Stat label="Total revenue" value="$48,210" />;

export const Row = () => (
  <div className="ui-row" style={{ gap: '2.5rem' }}>
    <Stat label="Active users" value="12,840" />
    <Stat label="Conversion" value="3.6%" />
    <Stat label="Avg. session" value="4m 12s" />
  </div>
);
