import { useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { useSetRecoilState } from 'recoil';
import { ComponentDecorator } from 'twenty-ui';

import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { RelationFieldDisplay } from '@/object-record/record-field/meta-types/display/components/RelationFieldDisplay';
import {
  RecordFieldValueSelectorContextProvider,
  useSetRecordValue,
} from '@/object-record/record-store/contexts/RecordFieldValueSelectorContext';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { RecordTableContext } from '@/object-record/record-table/contexts/RecordTableContext';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { MemoryRouterDecorator } from '~/testing/decorators/MemoryRouterDecorator';
import { getProfilingStory } from '~/testing/profiling/utils/getProfilingStory';
import { getLogoUrlFromDomainName } from '~/utils';

import { relationFieldDisplayMock } from './mock';

const RelationFieldValueSetterEffect = () => {
  const setEntity = useSetRecoilState(
    recordStoreFamilyState(relationFieldDisplayMock.entityId),
  );

  const setRelationEntity = useSetRecoilState(
    recordStoreFamilyState(relationFieldDisplayMock.relationEntityId),
  );

  const setRecordValue = useSetRecordValue();

  useEffect(() => {
    setEntity(relationFieldDisplayMock.entityValue);
    setRelationEntity(relationFieldDisplayMock.relationFieldValue);

    setRecordValue(
      relationFieldDisplayMock.entityValue.id,
      relationFieldDisplayMock.entityValue,
    );
    setRecordValue(
      relationFieldDisplayMock.relationFieldValue.id,
      relationFieldDisplayMock.relationFieldValue,
    );
  }, [setEntity, setRelationEntity, setRecordValue]);

  return null;
};

const meta: Meta = {
  title: 'UI/Data/Field/Display/RelationFieldDisplay',
  decorators: [
    MemoryRouterDecorator,
    (Story) => (
      <RecordFieldValueSelectorContextProvider>
        <RecordTableContext.Provider
          value={
            {
              recordChipDataGeneratorPerFieldName: {
                company: (objectRecord: ObjectRecord) => ({
                  name: objectRecord.name,
                  avatarType: 'rounded',
                  avatarUrl: getLogoUrlFromDomainName(objectRecord.domainName),
                  linkToShowPage: '/object-record/company',
                }),
              },
            } as any
          }
        >
          <FieldContext.Provider
            value={{
              entityId: relationFieldDisplayMock.entityId,
              basePathToShowPage: '/object-record/',
              isLabelIdentifier: false,
              fieldDefinition: {
                ...relationFieldDisplayMock.fieldDefinition,
              },
              hotkeyScope: 'hotkey-scope',
            }}
          >
            <RelationFieldValueSetterEffect />
            <Story />
          </FieldContext.Provider>
        </RecordTableContext.Provider>
      </RecordFieldValueSelectorContextProvider>
    ),
    ComponentDecorator,
  ],
  component: RelationFieldDisplay,
  argTypes: { value: { control: 'date' } },
  args: {},
};

export default meta;

type Story = StoryObj<typeof RelationFieldDisplay>;

export const Default: Story = {};

export const Performance = getProfilingStory({
  componentName: 'RelationFieldDisplay',
  averageThresholdInMs: 0.4,
  numberOfRuns: 20,
  numberOfTestsPerRun: 100,
});
