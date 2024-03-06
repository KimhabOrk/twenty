import { createContext } from 'react';

import { SettingsObjectFieldCurrencyFormValues } from '@/settings/data-model/components/SettingsObjectFieldCurrencyForm';

import { FieldDefinition } from '../types/FieldDefinition';
import { FieldMetadata } from '../types/FieldMetadata';

export type RecordUpdateHookParams = {
  variables: {
    where: Record<string, unknown>;
    updateOneRecordInput: Record<string, unknown>;
  };
};

export type RecordUpdateHookReturn = {
  loading?: boolean;
};

export type RecordUpdateHook = () => [
  (params: RecordUpdateHookParams) => void,
  RecordUpdateHookReturn,
];

export type GenericFieldContextType = {
  fieldDefinition: FieldDefinition<FieldMetadata>;
  useUpdateRecord?: RecordUpdateHook;
  entityId: string;
  recoilScopeId?: string;
  hotkeyScope: string;
  isLabelIdentifier: boolean;
  basePathToShowPage?: string;
  clearable?: boolean;
  maxWidth?: number;
  showCurrencySymbol?: boolean;
  currencyValues?: SettingsObjectFieldCurrencyFormValues;
};

export const FieldContext = createContext<GenericFieldContextType>(
  {} as GenericFieldContextType,
);
