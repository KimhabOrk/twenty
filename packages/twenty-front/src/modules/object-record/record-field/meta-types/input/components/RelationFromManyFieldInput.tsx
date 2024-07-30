import { useContext } from 'react';

import { ObjectMetadataItemsRelationPickerEffect } from '@/object-metadata/components/ObjectMetadataItemsRelationPickerEffect';
import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { RelationFromManyFieldInputMultiRecordsEffect } from '@/object-record/record-field/meta-types/input/components/RelationFromManyFieldInputMultiRecordsEffect';
import { useUpdateRelationFromManyFieldInput } from '@/object-record/record-field/meta-types/input/hooks/useUpdateRelationFromManyFieldInput';
import { FieldInputEvent } from '@/object-record/record-field/types/FieldInputEvent';
import { MultiRecordSelect } from '@/object-record/relation-picker/components/MultiRecordSelect';
import { useAddNewRecordAndOpenRightDrawer } from '@/object-record/relation-picker/hooks/useAddNewRecordAndOpenRightDrawer';
import { RelationPickerScope } from '@/object-record/relation-picker/scopes/RelationPickerScope';

export type RelationFromManyFieldInputProps = {
  onSubmit?: FieldInputEvent;
};

export const RelationFromManyFieldInput = ({
  onSubmit,
}: RelationFromManyFieldInputProps) => {
  const { fieldDefinition, entityId } = useContext(FieldContext);
  const relationPickerScopeId = `relation-picker-${fieldDefinition.fieldMetadataId}`;
  const { updateRelation } = useUpdateRelationFromManyFieldInput({
    scopeId: relationPickerScopeId,
  });

  const handleSubmit = () => {
    onSubmit?.(() => {});
  };

  console.log(fieldDefinition);

  const { createNewRecordAndOpenRightDrawer } =
    useAddNewRecordAndOpenRightDrawer({
      relationObjectMetadataNameSingular:
        fieldDefinition.metadata.relationObjectMetadataNameSingular,
      // relationObjectMetadataItem,
      // relationFieldMetadataItem,
      entityId,
    });

  return (
    <>
      <RelationPickerScope relationPickerScopeId={relationPickerScopeId}>
        <ObjectMetadataItemsRelationPickerEffect />
        <RelationFromManyFieldInputMultiRecordsEffect />
        <MultiRecordSelect onSubmit={handleSubmit} onChange={updateRelation} />
      </RelationPickerScope>
    </>
  );
};
