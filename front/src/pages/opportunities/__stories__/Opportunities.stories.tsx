import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';

import {
  PageDecorator,
  type PageDecoratorArgs,
} from '~/testing/decorators/PageDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

import { Opportunities } from '../Opportunities';

const meta: Meta<PageDecoratorArgs> = {
  title: 'Pages/Opportunities/Default',
  component: Opportunities,
  decorators: [PageDecorator],
  args: { currentPath: '/opportunities' },
  parameters: {
    msw: graphqlMocks,
  },
};

export default meta;

export type Story = StoryObj<typeof Opportunities>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('All opportunities');
  },
};
