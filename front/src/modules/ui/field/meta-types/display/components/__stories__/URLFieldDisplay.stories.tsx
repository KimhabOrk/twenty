import { useEffect } from 'react';
import { MemoryRouter } from 'react-router';
import { Meta, StoryObj } from '@storybook/react';

import { ComponentDecorator } from '~/testing/decorators/ComponentDecorator';

import { useURLField } from '../../../hooks/useURLField';
import { URLFieldDisplay } from '../URLFieldDisplay';

import { FieldDisplayContextProvider } from './FieldDisplayContextProvider';

const URLFieldValueSetterEffect = ({ value }: { value: string }) => {
  const { setFieldValue } = useURLField();

  useEffect(() => {
    setFieldValue(value);
  }, [setFieldValue, value]);

  return <></>;
};

type URLFieldDisplayWithContextProps = {
  value: string;
  entityId?: string;
};

const URLFieldDisplayWithContext = ({
  value,
  entityId,
}: URLFieldDisplayWithContextProps) => {
  return (
    <FieldDisplayContextProvider
      fieldDefinition={{
        key: 'URL',
        name: 'URL',
        type: 'url',
        metadata: {
          fieldName: 'URL',
          placeHolder: 'URL',
        },
      }}
      entityId={entityId}
    >
      <MemoryRouter>
        <URLFieldValueSetterEffect value={value} />
        <URLFieldDisplay />
      </MemoryRouter>
    </FieldDisplayContextProvider>
  );
};

const meta: Meta = {
  title: 'UI/Field/URLFieldDisplay',
  component: URLFieldDisplayWithContext,
};

export default meta;

type Story = StoryObj<typeof URLFieldDisplayWithContext>;

export const Default: Story = {
  args: {
    value: 'https://github.com/GitStartHQ',
  },
};

export const Elipsis: Story = {
  args: {
    value: 'https://www.instagram.com/gitstart/',
  },
  argTypes: {
    value: { control: true },
  },
  parameters: {
    container: {
      width: 200,
    },
  },
  decorators: [ComponentDecorator],
};
