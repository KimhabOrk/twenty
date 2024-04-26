import {
  ExpandableList,
  ExpandableListProps,
} from '@/object-record/record-field/meta-types/display/components/ExpandableList.tsx';
import { useMultiSelectField } from '@/object-record/record-field/meta-types/hooks/useMultiSelectField';
import { Tag } from '@/ui/display/tag/components/Tag';

type MultiSelectFieldDisplayProps = ExpandableListProps;
export const MultiSelectFieldDisplay = ({
  isHovered,
  reference,
}: MultiSelectFieldDisplayProps) => {
  const { fieldValues, fieldDefinition } = useMultiSelectField();

  const selectedOptions = fieldValues
    ? fieldDefinition.metadata.options.filter((option) =>
        fieldValues.includes(option.value),
      )
    : [];

  return selectedOptions ? (
    <ExpandableList isHovered={isHovered} reference={reference}>
      {selectedOptions.map((selectedOption, index) => (
        <Tag
          key={index}
          color={selectedOption.color}
          text={selectedOption.label}
        />
      ))}
    </ExpandableList>
  ) : (
    <></>
  );
};
