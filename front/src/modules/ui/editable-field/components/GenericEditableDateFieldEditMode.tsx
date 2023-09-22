import { useContext } from 'react';
import { useRecoilState } from 'recoil';

import { entityFieldsFamilySelector } from '@/ui/field/states/selectors/entityFieldsFamilySelector';
import { DateInput } from '@/ui/input/components/DateInput';
import { Nullable } from '~/types/Nullable';

import { FieldDefinition } from '../../field/types/FieldDefinition';
import { FieldDateMetadata } from '../../field/types/FieldMetadata';
import { EditableFieldDefinitionContext } from '../contexts/EditableFieldDefinitionContext';
import { EditableFieldEntityIdContext } from '../contexts/EditableFieldEntityIdContext';
import { useFieldInputEventHandlers } from '../hooks/useFieldInputEventHandlers';
import { useUpdateGenericEntityField } from '../hooks/useUpdateGenericEntityField';
import { EditableFieldHotkeyScope } from '../types/EditableFieldHotkeyScope';

export const GenericEditableDateFieldEditMode = () => {
  const currentEditableFieldEntityId = useContext(EditableFieldEntityIdContext);
  const currentEditableFieldDefinition = useContext(
    EditableFieldDefinitionContext,
  ) as FieldDefinition<FieldDateMetadata>;

  // TODO: we could use a hook that would return the field value with the right type
  const [fieldValue, setFieldValue] = useRecoilState<string>(
    entityFieldsFamilySelector({
      entityId: currentEditableFieldEntityId ?? '',
      fieldName: currentEditableFieldDefinition
        ? currentEditableFieldDefinition.metadata.fieldName
        : '',
    }),
  );

  const updateField = useUpdateGenericEntityField();

  const handleSubmit = (newDate: Nullable<Date>) => {
    if (!newDate) {
      setFieldValue('');

      if (currentEditableFieldEntityId && updateField) {
        updateField(
          currentEditableFieldEntityId,
          currentEditableFieldDefinition,
          '',
        );
      }
    }

    const newDateISO = newDate?.toISOString();

    if (newDateISO === fieldValue || !newDateISO) return;

    setFieldValue(newDateISO);

    if (currentEditableFieldEntityId && updateField) {
      updateField(
        currentEditableFieldEntityId,
        currentEditableFieldDefinition,
        newDateISO,
      );
    }
  };

  const { handleEnter, handleEscape, handleClickOutside } =
    useFieldInputEventHandlers({
      onSubmit: handleSubmit,
    });

  return (
    <DateInput
      hotkeyScope={EditableFieldHotkeyScope.EditableField}
      onClickOutside={handleClickOutside}
      onEnter={handleEnter}
      onEscape={handleEscape}
      value={fieldValue ? new Date(fieldValue) : null}
    />
  );
};
