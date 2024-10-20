import { AdvancedFilterAddFilterRuleSelect } from '@/object-record/advanced-filter/components/AdvancedFilterAddFilterRuleSelect';
import { AdvancedFilterLogicalOperatorCell } from '@/object-record/advanced-filter/components/AdvancedFilterLogicalOperatorCell';
import { AdvancedFilterRuleOptionsDropdown } from '@/object-record/advanced-filter/components/AdvancedFilterRuleOptionsDropdown';
import { AdvancedFilterViewFilter } from '@/object-record/advanced-filter/components/AdvancedFilterViewFilter';
import { useCurrentViewViewFilterGroup } from '@/object-record/advanced-filter/hooks/useCurrentViewViewFilterGroup';
import styled from '@emotion/styled';

const StyledRow = styled.div`
  display: flex;
  width: 100%;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledContainer = styled.div<{ isGrayBackground?: boolean }>`
  align-items: start;
  background-color: ${({ theme, isGrayBackground }) =>
    isGrayBackground ? theme.background.transparent.lighter : 'transparent'};
  border: ${({ theme }) => `1px solid ${theme.border.color.medium}`};
  border-radius: ${({ theme }) => theme.border.radius.md};
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)};
  overflow: hidden;
`;

type AdvancedFilterViewFilterGroupProps = {
  parentViewFilterGroupId?: string;
  viewBarInstanceId: string;
};

export const AdvancedFilterViewFilterGroup = ({
  parentViewFilterGroupId,
  viewBarInstanceId,
}: AdvancedFilterViewFilterGroupProps) => {
  const { currentViewFilterGroup, childViewFiltersAndViewFilterGroups } =
    useCurrentViewViewFilterGroup({
      parentViewFilterGroupId,
    });

  if (!currentViewFilterGroup) {
    throw new Error(
      `Missing component view filter group for view filter group with parent id of '${parentViewFilterGroupId}'`,
    );
  }

  return (
    <StyledContainer isGrayBackground={!!parentViewFilterGroupId}>
      {childViewFiltersAndViewFilterGroups?.map((child, i) =>
        child.__typename === 'ViewFilterGroup' ? (
          <StyledRow key={child.id}>
            <AdvancedFilterLogicalOperatorCell
              index={i}
              viewFilterGroup={currentViewFilterGroup}
            />
            <AdvancedFilterViewFilterGroup
              viewBarInstanceId={viewBarInstanceId}
              parentViewFilterGroupId={currentViewFilterGroup.id}
            />
            <AdvancedFilterRuleOptionsDropdown viewFilterGroupId={child.id} />
          </StyledRow>
        ) : (
          <StyledRow key={child.id}>
            <AdvancedFilterLogicalOperatorCell
              index={i}
              viewFilterGroup={currentViewFilterGroup}
            />
            <AdvancedFilterViewFilter viewFilter={child} />
            <AdvancedFilterRuleOptionsDropdown viewFilterId={child.id} />
          </StyledRow>
        ),
      )}
      <AdvancedFilterAddFilterRuleSelect
        parentViewFilterGroupId={parentViewFilterGroupId}
      />
    </StyledContainer>
  );
};
