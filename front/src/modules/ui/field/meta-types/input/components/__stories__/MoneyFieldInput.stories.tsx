import { useEffect } from 'react';
import { expect } from '@storybook/jest';
import { jest } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';

import { useSetHotkeyScope } from '@/ui/utilities/hotkey/hooks/useSetHotkeyScope';

import { FieldContextProvider } from '../../../__stories__/FieldContextProvider';
import { useMoneyField } from '../../../hooks/useMoneyField';
import { MoneyFieldInput, MoneyFieldInputProps } from '../MoneyFieldInput';

const MoneyFieldValueSetterEffect = ({ value }: { value: number }) => {
  const { setFieldValue } = useMoneyField();

  useEffect(() => {
    setFieldValue(value);
  }, [setFieldValue, value]);

  return <></>;
};

type MoneyFieldInputWithContextProps = MoneyFieldInputProps & {
  value: number;
  entityId?: string;
};

const MoneyFieldInputWithContext = ({
  entityId,
  value,
  onEnter,
  onEscape,
  onClickOutside,
  onTab,
  onShiftTab,
}: MoneyFieldInputWithContextProps) => {
  const setHotKeyScope = useSetHotkeyScope();

  useEffect(() => {
    setHotKeyScope('hotkey-scope');
  }, [setHotKeyScope]);

  return (
    <div>
      <FieldContextProvider
        fieldDefinition={{
          key: 'moneyAmount',
          name: 'MoneyAmout',
          type: 'moneyAmount',
          metadata: {
            fieldName: 'moneyAmount',
            placeHolder: 'Enter Amount',
          },
        }}
        entityId={entityId}
      >
        <MoneyFieldValueSetterEffect value={value} />
        <MoneyFieldInput
          {...{ onEnter, onEscape, onClickOutside, onTab, onShiftTab }}
        />
      </FieldContextProvider>
    </div>
  );
};

const enterJestFn = jest.fn();
const escapeJestfn = jest.fn();
const clickOutsideJestFn = jest.fn();
const tabJestFn = jest.fn();
const shiftTabJestFn = jest.fn();

const meta: Meta = {
  title: 'UI/Field/Input/MoneyFieldInput',
  component: MoneyFieldInputWithContext,
  args: {
    value: 1000,
    isPositive: true,
    onEnter: enterJestFn,
    onEscape: escapeJestfn,
    onClickOutside: clickOutsideJestFn,
    onTab: tabJestFn,
    onShiftTab: shiftTabJestFn,
  },
  argTypes: {
    onEnter: { control: false },
    onEscape: { control: false },
    onClickOutside: { control: false },
    onTab: { control: false },
    onShiftTab: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof MoneyFieldInputWithContext>;

export const Default: Story = {};

export const Enter: Story = {
  play: async () => {
    await expect(enterJestFn).toHaveBeenCalledTimes(0);

    await userEvent.keyboard('{enter}');

    await expect(enterJestFn).toHaveBeenCalledTimes(1);
  },
};

export const Escape: Story = {
  play: async () => {
    await expect(escapeJestfn).toHaveBeenCalledTimes(0);

    await userEvent.keyboard('{esc}');

    await expect(escapeJestfn).toHaveBeenCalledTimes(1);
  },
};

export const ClickOutside: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(clickOutsideJestFn).toHaveBeenCalledTimes(0);

    const emptyDiv = canvas.getByTestId('data-field-input-click-outside-div');
    await userEvent.click(emptyDiv);

    await expect(clickOutsideJestFn).toHaveBeenCalledTimes(1);
  },
};

export const Tab: Story = {
  play: async () => {
    await expect(tabJestFn).toHaveBeenCalledTimes(0);

    await userEvent.keyboard('{tab}');

    await expect(tabJestFn).toHaveBeenCalledTimes(1);
  },
};

export const ShiftTab: Story = {
  play: async () => {
    await expect(shiftTabJestFn).toHaveBeenCalledTimes(0);

    await userEvent.keyboard('{shift+tab}');

    await expect(shiftTabJestFn).toHaveBeenCalledTimes(1);
  },
};
