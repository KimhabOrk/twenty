import { useCallback } from 'react';

import { useAvailableScopeIdOrThrow } from '@/ui/utilities/recoil-scope/scopes-internal/hooks/useAvailableScopeId';
import { useScopeInternalContextOrThrow } from '@/ui/utilities/recoil-scope/scopes-internal/hooks/useScopeInternalContextOrThrow';

import { ObjectFilterDropdownScopeInternalContext } from '../scopes/scope-internal-context/ObjectFilterDropdownScopeInternalContext';
import { Filter } from '../types/Filter';

import { useFilterStates } from './useFilterStates';

type UseFilterProps = {
  filterScopeId?: string;
};

export const useFilter = (props?: UseFilterProps) => {
  console.log(props?.filterScopeId);
  const scopeId = useAvailableScopeIdOrThrow(
    ObjectFilterDropdownScopeInternalContext,
    props?.filterScopeId,
  );

  const {
    availableFilterDefinitions,
    setAvailableFilterDefinitions,
    filterDefinitionUsedInDropdown,
    setFilterDefinitionUsedInDropdown,
    objectFilterDropdownSearchInput,
    setObjectFilterDropdownSearchInput,
    objectFilterDropdownSelectedEntityId,
    setObjectFilterDropdownSelectedEntityId,
    isObjectFilterDropdownOperandSelectUnfolded,
    setIsObjectFilterDropdownOperandSelectUnfolded,
    isObjectFilterDropdownUnfolded,
    setIsObjectFilterDropdownUnfolded,
    selectedFilter,
    setSelectedFilter,
    selectedOperandInDropdown,
    setSelectedOperandInDropdown,
  } = useFilterStates(scopeId);

  const { onFilterSelect } = useScopeInternalContextOrThrow(
    ObjectFilterDropdownScopeInternalContext,
  );

  const selectFilter = useCallback(
    (filter: Filter) => {
      setSelectedFilter(filter);
      onFilterSelect?.(filter);
    },
    [setSelectedFilter, onFilterSelect],
  );

  const resetFilter = useCallback(() => {
    setObjectFilterDropdownSearchInput('');
    setObjectFilterDropdownSelectedEntityId(null);
    setSelectedFilter(undefined);
    setFilterDefinitionUsedInDropdown(null);
    setSelectedOperandInDropdown(null);
  }, [
    setFilterDefinitionUsedInDropdown,
    setObjectFilterDropdownSearchInput,
    setObjectFilterDropdownSelectedEntityId,
    setSelectedFilter,
    setSelectedOperandInDropdown,
  ]);

  return {
    scopeId,
    availableFilterDefinitions,
    setAvailableFilterDefinitions,
    filterDefinitionUsedInDropdown,
    setFilterDefinitionUsedInDropdown,
    objectFilterDropdownSearchInput,
    setObjectFilterDropdownSearchInput,
    objectFilterDropdownSelectedEntityId,
    setObjectFilterDropdownSelectedEntityId,
    isObjectFilterDropdownOperandSelectUnfolded,
    setIsObjectFilterDropdownOperandSelectUnfolded,
    isObjectFilterDropdownUnfolded,
    setIsObjectFilterDropdownUnfolded,
    selectedFilter,
    setSelectedFilter,
    selectedOperandInDropdown,
    setSelectedOperandInDropdown,
    selectFilter,
    resetFilter,
  };
};
