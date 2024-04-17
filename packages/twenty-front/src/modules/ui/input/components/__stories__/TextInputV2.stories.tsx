import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentDecorator } from 'twenty-ui';

import { TextInputV2 } from '@/ui/input/components/TextInputV2';

type RenderProps = TextInputComponentProps;

const Render = (args: RenderProps) => {
  const [value, setValue] = useState(args.value);
  const handleChange = (text: string) => {
    args.onChange?.(text);
    setValue(text);
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <TextInputV2 {...args} value={value} onChange={handleChange} />;
};

const meta: Meta<typeof TextInputV2> = {
  title: 'UI/Input/TextInputV2',
  component: TextInputV2,
  decorators: [ComponentDecorator],
  args: { placeholder: 'Tim' },
  render: Render,
};

export default meta;
type Story = StoryObj<typeof TextInputV2>;

export const Default: Story = {};

export const Filled: Story = {
  args: { value: 'Tim' },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Tim' },
};
