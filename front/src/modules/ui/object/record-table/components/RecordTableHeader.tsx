import { useEffect, useRef } from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { IconPlus } from '@/ui/display/icon';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownScope } from '@/ui/layout/dropdown/scopes/DropdownScope';
import { RecordTableHeaderCell } from '@/ui/object/record-table/components/RecordTableHeaderCell';
import { tableColumnWidthsState } from '@/ui/object/record-table/states/tableColumnWidths';

import { useRecordTableScopedStates } from '../hooks/internal/useRecordTableScopedStates';

import { RecordTableHeaderPlusButtonContent } from './RecordTableHeaderPlusButtonContent';
import { SelectAllCheckbox } from './SelectAllCheckbox';

const StyledTableHead = styled.thead`
  cursor: pointer;
`;

const StyledPlusIconHeaderCell = styled.th`
  ${({ theme }) => {
    return `
  &:hover {
    background: ${theme.background.transparent.light};
  };
  padding-left: ${theme.spacing(3)};
  `;
  }};
  border-bottom: none !important;
  border-left: none !important;
  min-width: 32px;
  position: relative;
  z-index: 1;
`;

const StyledPlusIconContainer = styled.div`
  align-items: center;
  display: flex;
  height: 32px;
  justify-content: center;
  width: 32px;
`;

const HIDDEN_TABLE_COLUMN_DROPDOWN_SCOPE_ID =
  'hidden-table-columns-dropdown-scope-id';

const HIDDEN_TABLE_COLUMN_DROPDOWN_HOTKEY_SCOPE_ID =
  'hidden-table-columns-dropdown-hotkey-scope-id';

export const RecordTableHeader = ({
  createRecord,
}: {
  createRecord: () => void;
}) => {
  const { hiddenTableColumnsSelector, visibleTableColumnsSelector } =
    useRecordTableScopedStates();

  const hiddenTableColumns = useRecoilValue(hiddenTableColumnsSelector);
  const visibleTableColumns = useRecoilValue(visibleTableColumnsSelector);

  const theme = useTheme();

  // eslint-disable-next-line twenty/no-state-useref
  const headerRef = useRef<HTMLTableRowElement>(null);

  const setColumnWidths = useSetRecoilState(tableColumnWidthsState);

  useEffect(() => {
    if (headerRef.current) {
      const widths = Array.from(headerRef.current.children).map(
        (th) => th.getBoundingClientRect().width - 1,
      );
      setColumnWidths(widths);
    }
  }, [setColumnWidths, visibleTableColumns]);

  return (
    <StyledTableHead data-select-disable>
      <tr ref={headerRef}>
        <th
          style={{
            width: 30,
            minWidth: 30,
            maxWidth: 30,
          }}
        >
          <SelectAllCheckbox />
        </th>
        {visibleTableColumns.map((column) => (
          <RecordTableHeaderCell
            key={column.fieldMetadataId}
            column={column}
            createRecord={createRecord}
          />
        ))}
        {hiddenTableColumns.length > 0 && (
          <StyledPlusIconHeaderCell>
            <DropdownScope
              dropdownScopeId={HIDDEN_TABLE_COLUMN_DROPDOWN_SCOPE_ID}
            >
              <Dropdown
                clickableComponent={
                  <StyledPlusIconContainer>
                    <IconPlus size={theme.icon.size.md} />
                  </StyledPlusIconContainer>
                }
                dropdownComponents={<RecordTableHeaderPlusButtonContent />}
                dropdownPlacement="bottom-start"
                dropdownHotkeyScope={{
                  scope: HIDDEN_TABLE_COLUMN_DROPDOWN_HOTKEY_SCOPE_ID,
                }}
              />
            </DropdownScope>
          </StyledPlusIconHeaderCell>
        )}
      </tr>
    </StyledTableHead>
  );
};
