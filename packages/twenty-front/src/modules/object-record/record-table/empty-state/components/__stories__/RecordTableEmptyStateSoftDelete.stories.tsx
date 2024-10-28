import { Meta, StoryObj } from '@storybook/react';

import { RecordTableEmptyStateSoftDelete } from '@/object-record/record-table/empty-state/components/RecordTableEmptyStateSoftDelete';
import { RecordTableScope } from '@/object-record/record-table/scopes/RecordTableScope';
import { SnackBarProviderScope } from '@/ui/feedback/snack-bar-manager/scopes/SnackBarProviderScope';
import { ComponentDecorator } from 'twenty-ui';
import { MemoryRouterDecorator } from '~/testing/decorators/MemoryRouterDecorator';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { RecordTableDecorator } from '~/testing/decorators/RecordTableDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';

const meta: Meta = {
  title: 'Modules/ObjectRecord/RecordTable/RecordTableEmptyStateSoftDelete',
  component: RecordTableEmptyStateSoftDelete,
  decorators: [
    ComponentDecorator,
    MemoryRouterDecorator,
    ObjectMetadataItemsDecorator,
    RecordTableDecorator,
    (Story) => (
      <SnackBarProviderScope snackBarManagerScopeId="snack-bar-manager">
        <RecordTableScope recordTableId="persons" onColumnsChange={() => {}}>
          <Story />
        </RecordTableScope>
      </SnackBarProviderScope>
    ),
  ],
  parameters: {
    msw: graphqlMocks,
  },
};

export default meta;
type Story = StoryObj<typeof RecordTableEmptyStateSoftDelete>;

export const Default: Story = {};
