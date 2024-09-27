import { FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { SettingsCard } from '@/settings/components/SettingsCard';
import { SETTINGS_FIELD_TYPE_CATEGORIES } from '@/settings/data-model/constants/SettingsFieldTypeCategories';
import { SETTINGS_FIELD_TYPE_CATEGORY_DESCRIPTIONS } from '@/settings/data-model/constants/SettingsFieldTypeCategoryDescriptions';
import {
  SETTINGS_FIELD_TYPE_CONFIGS,
  SettingsFieldTypeConfig,
} from '@/settings/data-model/constants/SettingsFieldTypeConfigs';
import { useBooleanSettingsFormInitialValues } from '@/settings/data-model/fields/forms/boolean/hooks/useBooleanSettingsFormInitialValues';
import { useCurrencySettingsFormInitialValues } from '@/settings/data-model/fields/forms/currency/hooks/useCurrencySettingsFormInitialValues';
import { useSelectSettingsFormInitialValues } from '@/settings/data-model/fields/forms/select/hooks/useSelectSettingsFormInitialValues';
import { SettingsDataModelHotkeyScope } from '@/settings/data-model/types/SettingsDataModelHotKeyScope';
import { SettingsSupportedFieldType } from '@/settings/data-model/types/SettingsSupportedFieldType';
import { TextInput } from '@/ui/input/components/TextInput';
import { useScopedHotkeys } from '@/ui/utilities/hotkey/hooks/useScopedHotkeys';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Section } from '@react-email/components';
import { useCallback, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Key } from 'ts-key-enum';
import { H2Title, IconSearch } from 'twenty-ui';
import { z } from 'zod';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { useHotkeyScopeOnMount } from '~/hooks/useHotkeyScopeOnMount';

export const settingsDataModelFieldTypeFormSchema = z.object({
  type: z.enum(
    Object.keys(SETTINGS_FIELD_TYPE_CONFIGS) as [
      SettingsSupportedFieldType,
      ...SettingsSupportedFieldType[],
    ],
  ),
});

type SettingsDataModelFieldTypeFormValues = z.infer<
  typeof settingsDataModelFieldTypeFormSchema
>;

type SettingsDataModelFieldTypeSelectProps = {
  className?: string;
  excludedFieldTypes?: SettingsSupportedFieldType[];
  fieldMetadataItem?: Pick<
    FieldMetadataItem,
    'defaultValue' | 'options' | 'type'
  >;
  onFieldTypeSelect: () => void;
};

const StyledTypeSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: inherit;
  width: 100%;
`;

const StyledContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
`;

const StyledCardContainer = styled.div`
  display: flex;

  position: relative;
  width: calc(50% - ${({ theme }) => theme.spacing(1)});
`;

const StyledSearchInput = styled(TextInput)`
  width: 100%;
`;

export const SettingsDataModelFieldTypeSelect = ({
  className,
  excludedFieldTypes = [],
  fieldMetadataItem,
  onFieldTypeSelect,
}: SettingsDataModelFieldTypeSelectProps) => {
  const theme = useTheme();
  const { control, getValues, setValue } =
    useFormContext<SettingsDataModelFieldTypeFormValues>();
  const [searchQuery, setSearchQuery] = useState('');

  const fieldTypeConfigs = Object.entries<SettingsFieldTypeConfig>(
    SETTINGS_FIELD_TYPE_CONFIGS,
  ).filter(
    ([key, config]) =>
      !excludedFieldTypes.includes(key as SettingsSupportedFieldType) &&
      config.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getFlattenedConfigs = useCallback(() => {
    return SETTINGS_FIELD_TYPE_CATEGORIES.flatMap((category) =>
      fieldTypeConfigs.filter(([, config]) => config.category === category),
    );
  }, [fieldTypeConfigs]);

  const initialType = getValues('type');

  const getInitialFocusedIndex = useCallback(() => {
    const flattenedConfigs = getFlattenedConfigs();
    return flattenedConfigs.findIndex(([key]) => key === initialType);
  }, [getFlattenedConfigs, initialType]);

  const [focusedIndex, setFocusedIndex] = useState(getInitialFocusedIndex());

  useHotkeyScopeOnMount(
    SettingsDataModelHotkeyScope.SettingsDataModelFieldTypeSelect,
  );

  useScopedHotkeys(
    Key.Tab,
    (keyboardEvent) => {
      keyboardEvent.preventDefault();
      const flattenedConfigs = getFlattenedConfigs();
      setFocusedIndex((prevIndex) => (prevIndex + 1) % flattenedConfigs.length);
    },
    SettingsDataModelHotkeyScope.SettingsDataModelFieldTypeSelect,
    [fieldTypeConfigs],
  );

  useScopedHotkeys(
    `${Key.Shift} + ${Key.Tab}`,
    (keyboardEvent) => {
      keyboardEvent.preventDefault();
      const flattenedConfigs = getFlattenedConfigs();
      setFocusedIndex(
        (prevIndex) =>
          (prevIndex - 1 + flattenedConfigs.length) % flattenedConfigs.length,
      );
    },
    SettingsDataModelHotkeyScope.SettingsDataModelFieldTypeSelect,
    [fieldTypeConfigs],
  );

  useScopedHotkeys(
    Key.Enter,
    (keyboardEvent) => {
      keyboardEvent.preventDefault();
      if (focusedIndex !== null) {
        const flattenedConfigs = getFlattenedConfigs();
        const [key] = flattenedConfigs[focusedIndex];
        handleSelectFieldType(key as SettingsSupportedFieldType);
      }
    },
    SettingsDataModelHotkeyScope.SettingsDataModelFieldTypeSelect,
    [focusedIndex, fieldTypeConfigs],
  );

  const handleSelectFieldType = (key: SettingsSupportedFieldType) => {
    setValue('type', key);
    resetDefaultValueField(key);
    onFieldTypeSelect();
  };

  const { resetDefaultValueField: resetBooleanDefaultValueField } =
    useBooleanSettingsFormInitialValues({ fieldMetadataItem });

  const { resetDefaultValueField: resetCurrencyDefaultValueField } =
    useCurrencySettingsFormInitialValues({ fieldMetadataItem });

  const { resetDefaultValueField: resetSelectDefaultValueField } =
    useSelectSettingsFormInitialValues({ fieldMetadataItem });

  const resetDefaultValueField = (nextValue: SettingsSupportedFieldType) => {
    switch (nextValue) {
      case FieldMetadataType.Boolean:
        resetBooleanDefaultValueField();
        break;
      case FieldMetadataType.Currency:
        resetCurrencyDefaultValueField();
        break;
      case FieldMetadataType.Select:
      case FieldMetadataType.MultiSelect:
        resetSelectDefaultValueField();
        break;
      default:
        break;
    }
  };

  return (
    <Controller
      name="type"
      control={control}
      render={({ field: { value } }) => (
        <StyledTypeSelectContainer className={className}>
          <Section>
            <StyledSearchInput
              LeftIcon={IconSearch}
              placeholder="Search a type"
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </Section>
          {SETTINGS_FIELD_TYPE_CATEGORIES.map((category) => (
            <Section key={category}>
              <H2Title
                title={category}
                description={
                  SETTINGS_FIELD_TYPE_CATEGORY_DESCRIPTIONS[category]
                }
              />
              <StyledContainer>
                {fieldTypeConfigs
                  .filter(([, config]) => config.category === category)
                  .map(([key, config]) => {
                    const flatIndex = getFlattenedConfigs().findIndex(
                      ([k]) => k === key,
                    );
                    const isActive = value === key;
                    const isFocused = focusedIndex === flatIndex;
                    return (
                      <StyledCardContainer key={key}>
                        <SettingsCard
                          onClick={() => {
                            handleSelectFieldType(
                              key as SettingsSupportedFieldType,
                            );
                            setFocusedIndex(flatIndex);
                            onFieldTypeSelect();
                          }}
                          Icon={
                            <config.Icon
                              size={theme.icon.size.xl}
                              stroke={theme.icon.stroke.sm}
                            />
                          }
                          title={config.label}
                          isActive={isActive}
                          isFocused={isFocused}
                        />
                      </StyledCardContainer>
                    );
                  })}
              </StyledContainer>
            </Section>
          ))}
        </StyledTypeSelectContainer>
      )}
    />
  );
};
