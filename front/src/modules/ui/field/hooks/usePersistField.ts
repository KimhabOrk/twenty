import { useContext } from 'react';
import { useRecoilCallback } from 'recoil';

import { FieldContext } from '../contexts/FieldContext';
import { entityFieldsFamilySelector } from '../states/selectors/entityFieldsFamilySelector';
import { isFieldDate } from '../types/guards/isFieldDate';
import { isFieldDateValue } from '../types/guards/isFieldDateValue';
import { isFieldNumber } from '../types/guards/isFieldNumber';
import { isFieldNumberValue } from '../types/guards/isFieldNumberValue';
import { isFieldRelation } from '../types/guards/isFieldRelation';
import { isFieldRelationValue } from '../types/guards/isFieldRelationValue';
import { isFieldText } from '../types/guards/isFieldText';
import { isFieldTextValue } from '../types/guards/isFieldTextValue';

export const usePersistField = () => {
  const { entityId, fieldDefinition, useUpdateEntityMutation } =
    useContext(FieldContext);

  const [updateEntity] = useUpdateEntityMutation();

  const persistField = useRecoilCallback(
    ({ set }) =>
      (valueToPersist: unknown) => {
        if (
          isFieldRelation(fieldDefinition) &&
          isFieldRelationValue(valueToPersist)
        ) {
          const fieldName = fieldDefinition.metadata.fieldName;

          set(
            entityFieldsFamilySelector({ entityId, fieldName }),
            valueToPersist,
          );

          updateEntity({
            variables: {
              where: { id: entityId },
              data: {
                [fieldName]: valueToPersist
                  ? { connect: { id: valueToPersist.id } }
                  : { disconnect: true },
              },
            },
          });
        } else if (
          (isFieldText(fieldDefinition) && isFieldTextValue(valueToPersist)) ||
          (isFieldDate(fieldDefinition) && isFieldDateValue(valueToPersist)) ||
          (isFieldNumber(fieldDefinition) && isFieldNumberValue(valueToPersist))
        ) {
          const fieldName = fieldDefinition.metadata.fieldName;

          set(
            entityFieldsFamilySelector({ entityId, fieldName }),
            valueToPersist,
          );

          updateEntity({
            variables: {
              where: { id: entityId },
              data: {
                [fieldDefinition.metadata.fieldName]: valueToPersist,
              },
            },
          });
        } else {
          throw new Error(
            `Invalid value to persist: ${valueToPersist} for type : ${fieldDefinition.type}`,
          );
        }
      },
    [entityId, fieldDefinition, updateEntity],
  );

  return persistField;
};
