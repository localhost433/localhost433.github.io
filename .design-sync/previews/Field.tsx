import { Field, Input, Slider } from 'kit';

export const TextField = () => (
  <Field label="Full name" htmlFor="name" style={{ maxWidth: 280 }}>
    <Input id="name" placeholder="Ada Lovelace" />
  </Field>
);

export const RangeField = () => (
  <Field label="Volume" htmlFor="vol" style={{ maxWidth: 280 }}>
    <Slider id="vol" min={0} max={100} defaultValue={70} />
  </Field>
);
