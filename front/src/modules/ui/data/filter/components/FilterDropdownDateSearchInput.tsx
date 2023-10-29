import { InternalDatePicker } from '@/ui/input/components/internal/date/components/InternalDatePicker';

import { useFilter } from '../hooks/useFilter';

export const FilterDropdownDateSearchInput = () => {
  const {
    filterDefinitionUsedInDropdown,
    selectedOperandInDropdown,
    setIsFilterDropdownUnfolded,
    selectFilter,
  } = useFilter();

  const handleChange = (date: Date) => {
    if (!filterDefinitionUsedInDropdown || !selectedOperandInDropdown) return;

    selectFilter?.({
      fieldId: filterDefinitionUsedInDropdown.fieldId,
      value: date.toISOString(),
      operand: selectedOperandInDropdown,
      displayValue: date.toLocaleDateString(),
      definition: filterDefinitionUsedInDropdown,
    });

    setIsFilterDropdownUnfolded(false);
  };

  return (
    <InternalDatePicker
      date={new Date()}
      onChange={handleChange}
      onMouseSelect={handleChange}
    />
  );
};
