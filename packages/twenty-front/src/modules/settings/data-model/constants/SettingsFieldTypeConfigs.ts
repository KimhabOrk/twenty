import {
  IconCalendarEvent,
  IconCheck,
  IconCoins,
  IconComponent,
  IconKey,
  IconLink,
  IconMail,
  IconNumbers,
  IconPhone,
  IconRelationManyToMany,
  IconTag,
  IconTextSize,
  IconTwentyStar,
  IconUser,
} from 'twenty-ui';

import { CurrencyCode } from '@/object-record/record-field/types/CurrencyCode';
import { DEFAULT_DATE_VALUE } from '@/settings/data-model/constants/DefaultDateValue';
import { SettingsSupportedFieldType } from '@/settings/data-model/types/SettingsSupportedFieldType';
import { FieldMetadataType } from '~/generated-metadata/graphql';

DEFAULT_DATE_VALUE.setFullYear(DEFAULT_DATE_VALUE.getFullYear() + 2);

export type SettingsFieldTypeConfig = {
  label: string;
  Icon: IconComponent;
  defaultValue?: unknown;
};

export const SETTINGS_FIELD_TYPE_CONFIGS: Record<
  SettingsSupportedFieldType,
  SettingsFieldTypeConfig
> = {
  [FieldMetadataType.Uuid]: {
    label: 'Unique ID',
    Icon: IconKey,
    defaultValue: '00000000-0000-0000-0000-000000000000',
  },
  [FieldMetadataType.Text]: {
    label: 'Text',
    Icon: IconTextSize,
    defaultValue:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum magna enim, dapibus non enim in, lacinia faucibus nunc. Sed interdum ante sed felis facilisis, eget ultricies neque molestie. Mauris auctor, justo eu volutpat cursus, libero erat tempus nulla, non sodales lorem lacus a est.',
  },
  [FieldMetadataType.Numeric]: {
    label: 'Numeric',
    Icon: IconNumbers,
    defaultValue: 2000,
  },
  [FieldMetadataType.Number]: {
    label: 'Number',
    Icon: IconNumbers,
    defaultValue: 2000,
  },
  [FieldMetadataType.Link]: {
    label: 'Link',
    Icon: IconLink,
    defaultValue: { url: 'www.twenty.com', label: '' },
  },
  [FieldMetadataType.Boolean]: {
    label: 'True/False',
    Icon: IconCheck,
    defaultValue: true,
  },
  [FieldMetadataType.DateTime]: {
    label: 'Date & Time',
    Icon: IconCalendarEvent,
    defaultValue: DEFAULT_DATE_VALUE.toISOString(),
  },
  [FieldMetadataType.Select]: {
    label: 'Select',
    Icon: IconTag,
  },
  [FieldMetadataType.MultiSelect]: {
    label: 'MultiSelect',
    Icon: IconTag,
  },
  [FieldMetadataType.Currency]: {
    label: 'Currency',
    Icon: IconCoins,
    defaultValue: { amountMicros: 2000000000, currencyCode: CurrencyCode.USD },
  },
  [FieldMetadataType.Relation]: {
    label: 'Relation',
    Icon: IconRelationManyToMany,
  },
  [FieldMetadataType.Email]: { label: 'Email', Icon: IconMail },
  [FieldMetadataType.Phone]: { label: 'Phone', Icon: IconPhone },
  [FieldMetadataType.Probability]: {
    label: 'Rating',
    Icon: IconTwentyStar,
    defaultValue: '3',
  },
  [FieldMetadataType.Rating]: {
    label: 'Rating',
    Icon: IconTwentyStar,
    defaultValue: '3',
  },
  [FieldMetadataType.FullName]: {
    label: 'Full Name',
    Icon: IconUser,
    defaultValue: { firstName: 'John', lastName: 'Doe' },
  },
};
