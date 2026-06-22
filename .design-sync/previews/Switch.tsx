import { Switch } from 'kit';

export const States = () => (
  <div className="ui-row" style={{ gap: '2rem' }}>
    <div className="ui-row">
      <Switch checked={true} onCheckedChange={() => {}} />
      <span style={{ fontSize: 14 }}>Notifications on</span>
    </div>
    <div className="ui-row">
      <Switch checked={false} onCheckedChange={() => {}} />
      <span style={{ fontSize: 14 }}>Notifications off</span>
    </div>
  </div>
);
