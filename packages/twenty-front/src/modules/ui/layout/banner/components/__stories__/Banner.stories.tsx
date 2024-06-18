import { Meta, StoryObj } from '@storybook/react';
import { ComponentDecorator } from 'twenty-ui';

import { Banner } from '../Banner';
import { BannerButton } from '../BannerButton';

const meta: Meta<typeof Banner> = {
  title: 'UI/Layout/Banner/Banner',
  component: Banner,
  decorators: [ComponentDecorator],
  render: (args) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Banner {...args}>
      Sync lost with mailbox hello@twenty.com. Please reconnect for updates:
      <BannerButton>Reconnect</BannerButton>
    </Banner>
  ),
  argTypes: {
    as: { control: false },
    theme: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {};
