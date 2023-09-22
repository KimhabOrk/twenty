import { useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { CompanyChip } from '@/companies/components/CompanyChip';
import { PersonChip } from '@/people/components/PersonChip';
import { entityFieldsFamilySelector } from '@/ui/field/states/selectors/entityFieldsFamilySelector';
import { Entity } from '@/ui/input/relation-picker/types/EntityTypeForSelect';
import { UserChip } from '@/users/components/UserChip';
import { getLogoUrlFromDomainName } from '~/utils';

import { FieldDefinition } from '../../field/types/FieldDefinition';
import { FieldRelationMetadata } from '../../field/types/FieldMetadata';
import { EditableFieldDefinitionContext } from '../contexts/EditableFieldDefinitionContext';
import { EditableFieldEntityIdContext } from '../contexts/EditableFieldEntityIdContext';

export const GenericEditableRelationFieldDisplayMode = () => {
  const currentEditableFieldEntityId = useContext(EditableFieldEntityIdContext);
  const currentEditableFieldDefinition = useContext(
    EditableFieldDefinitionContext,
  ) as FieldDefinition<FieldRelationMetadata>;

  const fieldValue = useRecoilValue<any | null>(
    entityFieldsFamilySelector({
      entityId: currentEditableFieldEntityId ?? '',
      fieldName: currentEditableFieldDefinition
        ? currentEditableFieldDefinition.metadata.fieldName
        : '',
    }),
  );

  switch (currentEditableFieldDefinition.metadata.relationType) {
    case Entity.Person: {
      return (
        <PersonChip
          id={fieldValue?.id ?? ''}
          name={fieldValue?.displayName ?? ''}
          pictureUrl={fieldValue?.avatarUrl ?? ''}
        />
      );
    }
    case Entity.User: {
      return (
        <UserChip
          id={fieldValue?.id ?? ''}
          name={fieldValue?.displayName ?? ''}
          pictureUrl={fieldValue?.avatarUrl ?? ''}
        />
      );
    }
    case Entity.Company: {
      return (
        <CompanyChip
          id={fieldValue?.id ?? ''}
          name={fieldValue?.name ?? ''}
          pictureUrl={
            fieldValue?.domainName
              ? getLogoUrlFromDomainName(fieldValue.domainName)
              : ''
          }
        />
      );
    }
    default:
      console.warn(
        `Unknown relation type: "${currentEditableFieldDefinition.metadata.relationType}"
          in GenericEditableRelationField`,
      );
      return <> </>;
  }
};
