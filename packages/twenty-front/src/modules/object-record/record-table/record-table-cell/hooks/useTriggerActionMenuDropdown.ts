import { useRecoilCallback } from 'recoil';

import { actionMenuDropdownPositionState } from '@/action-menu/states/actionMenuDropdownPositionState';
import { isRowSelectedComponentFamilyState } from '@/object-record/record-table/record-table-row/states/isRowSelectedComponentFamilyState';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { getScopeIdFromComponentId } from '@/ui/utilities/recoil-scope/utils/getScopeIdFromComponentId';
import { getSnapshotValue } from '@/ui/utilities/recoil-scope/utils/getSnapshotValue';
import { extractComponentFamilyState } from '@/ui/utilities/state/component-state/utils/extractComponentFamilyState';

export const useTriggerActionMenuDropdown = ({
  recordTableId,
}: {
  recordTableId: string;
}) => {
  const { openDropdown: openActionMenuDropdown } = useDropdown(
    'action-menu-dropdown',
  );
  const triggerActionMenuDropdown = useRecoilCallback(
    ({ set, snapshot }) =>
      (event: React.MouseEvent, recordId: string) => {
        event.preventDefault();

        const tableScopeId = getScopeIdFromComponentId(recordTableId);

        set(actionMenuDropdownPositionState, {
          x: event.clientX,
          y: event.clientY,
        });
        openActionMenuDropdown();

        const isRowSelectedFamilyState = extractComponentFamilyState(
          isRowSelectedComponentFamilyState,
          tableScopeId,
        );

        const isRowSelected = getSnapshotValue(
          snapshot,
          isRowSelectedFamilyState(recordId),
        );

        if (isRowSelected !== true) {
          set(isRowSelectedFamilyState(recordId), true);
        }
      },
    [openActionMenuDropdown, recordTableId],
  );

  return { triggerActionMenuDropdown };
};