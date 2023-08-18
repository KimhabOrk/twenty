import { useRef } from 'react';
import styled from '@emotion/styled';

import type {
  ViewFieldDefinition,
  ViewFieldMetadata,
} from '@/ui/editable-field/types/ViewField';
import { SelectedSortType, SortType } from '@/ui/filter-n-sort/types/interface';
import { DragSelect } from '@/ui/utilities/drag-select/components/DragSelect';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';
import {
  StyledAnimatedScrollBarContainer,
  useListenToScroll,
} from '@/ui/utilities/scroll/hooks/useListenToScroll';

import { EntityUpdateMutationContext } from '../contexts/EntityUpdateMutationHookContext';
import { useLeaveTableFocus } from '../hooks/useLeaveTableFocus';
import { useMapKeyboardToSoftFocus } from '../hooks/useMapKeyboardToSoftFocus';
import { useResetTableRowSelection } from '../hooks/useResetTableRowSelection';
import { useSetRowSelectedState } from '../hooks/useSetRowSelectedState';
import type { TableView } from '../states/tableViewsState';
import { TableHeader } from '../table-header/components/TableHeader';

import { EntityTableBody } from './EntityTableBody';
import { EntityTableHeader } from './EntityTableHeader';

const StyledTable = styled.table`
  border-collapse: collapse;

  border-radius: ${({ theme }) => theme.border.radius.sm};
  border-spacing: 0;
  margin-left: ${({ theme }) => theme.table.horizontalCellMargin};
  margin-right: ${({ theme }) => theme.table.horizontalCellMargin};
  table-layout: fixed;

  width: calc(100% - ${({ theme }) => theme.table.horizontalCellMargin} * 2);

  th {
    border: 1px solid ${({ theme }) => theme.border.color.light};
    border-collapse: collapse;
    color: ${({ theme }) => theme.font.color.tertiary};
    padding: 0;
    text-align: left;

    :last-child {
      border-right-color: transparent;
    }
    :first-of-type {
      border-left-color: transparent;
      border-right-color: transparent;
    }
    :last-of-type {
      min-width: fit-content;
      width: 100%;
    }
  }

  td {
    border: 1px solid ${({ theme }) => theme.border.color.light};
    border-collapse: collapse;
    color: ${({ theme }) => theme.font.color.primary};
    padding: 0;

    text-align: left;

    :last-child {
      border-right-color: transparent;
    }
    :first-of-type {
      border-left-color: transparent;
      border-right-color: transparent;
    }
    :last-of-type {
      min-width: fit-content;
      width: 100%;
    }
  }
`;

const StyledTableWithHeader = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
`;

const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
`;

const StyledTableWrapper = styled(StyledAnimatedScrollBarContainer)`
  flex: 1;
`;

type OwnProps<SortField> = {
  viewName: string;
  viewIcon?: React.ReactNode;
  availableSorts?: Array<SortType<SortField>>;
  onColumnsChange?: (columns: ViewFieldDefinition<ViewFieldMetadata>[]) => void;
  onSortsUpdate?: (sorts: Array<SelectedSortType<SortField>>) => void;
  onViewsChange?: (views: TableView[]) => void;
  onImport?: () => void;
  updateEntityMutation: any;
};

export function EntityTable<SortField>({
  viewName,
  availableSorts,
  onColumnsChange,
  onSortsUpdate,
  onViewsChange,
  onImport,
  updateEntityMutation,
}: OwnProps<SortField>) {
  const tableBodyRef = useRef<HTMLDivElement>(null);

  const setRowSelectedState = useSetRowSelectedState();
  const resetTableRowSelection = useResetTableRowSelection();

  useMapKeyboardToSoftFocus();

  const leaveTableFocus = useLeaveTableFocus();

  useListenClickOutside({
    refs: [tableBodyRef],
    callback: () => {
      leaveTableFocus();
    },
  });

  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const handleScrolling = useListenToScroll({
    ref: tableWrapperRef,
  });

  return (
    <EntityUpdateMutationContext.Provider value={updateEntityMutation}>
      <StyledTableWithHeader>
        <StyledTableContainer ref={tableBodyRef}>
          <TableHeader
            viewName={viewName}
            availableSorts={availableSorts}
            onColumnsChange={onColumnsChange}
            onSortsUpdate={onSortsUpdate}
            onViewsChange={onViewsChange}
            onImport={onImport}
          />
          <StyledTableWrapper ref={tableWrapperRef} onScroll={handleScrolling}>
            <StyledTable>
              <EntityTableHeader onColumnsChange={onColumnsChange} />
              <EntityTableBody />
            </StyledTable>
          </StyledTableWrapper>
          <DragSelect
            dragSelectable={tableBodyRef}
            onDragSelectionStart={resetTableRowSelection}
            onDragSelectionChange={setRowSelectedState}
          />
        </StyledTableContainer>
      </StyledTableWithHeader>
    </EntityUpdateMutationContext.Provider>
  );
}
