import { useCallback, useContext, useRef, useState } from 'react';
import { OnDragEndResponder } from '@hello-pangea/dnd';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Key } from 'ts-key-enum';
import { v4 } from 'uuid';

import { BoardContext } from '@/companies/states/contexts/BoardContext';
import {
  IconBaselineDensitySmall,
  IconChevronLeft,
  IconLayoutKanban,
  IconPlus,
  IconTag,
} from '@/ui/display/icon';
import { DropdownMenuHeader } from '@/ui/layout/dropdown/components/DropdownMenuHeader';
import { DropdownMenuInput } from '@/ui/layout/dropdown/components/DropdownMenuInput';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DropdownMenuSearchInput } from '@/ui/layout/dropdown/components/DropdownMenuSearchInput';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { MenuItem } from '@/ui/navigation/menu-item/components/MenuItem';
import { MenuItemNavigate } from '@/ui/navigation/menu-item/components/MenuItemNavigate';
import { MenuItemToggle } from '@/ui/navigation/menu-item/components/MenuItemToggle';
import { ThemeColor } from '@/ui/theme/constants/colors';
import { useScopedHotkeys } from '@/ui/utilities/hotkey/hooks/useScopedHotkeys';
import { useRecoilScopedValue } from '@/ui/utilities/recoil-scope/hooks/useRecoilScopedValue';
import { ViewFieldsVisibilityDropdownSection } from '@/views/components/ViewFieldsVisibilityDropdownSection';
import { useViewScopedStates } from '@/views/hooks/internal/useViewScopedStates';
import { useViewBar } from '@/views/hooks/useViewBar';

import { useBoardCardFields } from '../../hooks/useBoardCardFields';
import { boardColumnsState } from '../../states/boardColumnsState';
import { isCompactViewEnabledScopedState } from '../../states/isCompactViewEnabledScopedState';
import { hiddenBoardCardFieldsScopedSelector } from '../../states/selectors/hiddenBoardCardFieldsScopedSelector';
import { visibleBoardCardFieldsScopedSelector } from '../../states/selectors/visibleBoardCardFieldsScopedSelector';
import { BoardColumnDefinition } from '../../types/BoardColumnDefinition';
import { BoardOptionsHotkeyScope } from '../../types/BoardOptionsHotkeyScope';

export type BoardOptionsDropdownContentProps = {
  onStageAdd?: (boardColumn: BoardColumnDefinition) => void;
};

type BoardOptionsMenu = 'fields' | 'stage-creation' | 'stages';

type ColumnForCreate = {
  id: string;
  colorCode: ThemeColor;
  position: number;
  title: string;
};

export const BoardOptionsDropdownContent = ({
  onStageAdd,
}: BoardOptionsDropdownContentProps) => {
  const { setViewEditMode, handleViewNameSubmit } = useViewBar();
  const { viewEditModeState, currentViewSelector } = useViewScopedStates();
  const { BoardRecoilScopeContext } = useContext(BoardContext);

  const viewEditMode = useRecoilValue(viewEditModeState);
  const currentView = useRecoilValue(currentViewSelector);

  const stageInputRef = useRef<HTMLInputElement>(null);
  const viewEditInputRef = useRef<HTMLInputElement>(null);

  const [currentMenu, setCurrentMenu] = useState<
    BoardOptionsMenu | undefined
  >();

  const [boardColumns, setBoardColumns] = useRecoilState(boardColumnsState);
  const [isCompactViewEnabled, setIsCompactViewEnabled] = useRecoilState(
    isCompactViewEnabledScopedState,
  );

  const hiddenBoardCardFields = useRecoilScopedValue(
    hiddenBoardCardFieldsScopedSelector,
    BoardRecoilScopeContext,
  );

  const hasHiddenFields = hiddenBoardCardFields.length > 0;
  const visibleBoardCardFields = useRecoilScopedValue(
    visibleBoardCardFieldsScopedSelector,
    BoardRecoilScopeContext,
  );
  const hasVisibleFields = visibleBoardCardFields.length > 0;

  const handleStageSubmit = () => {
    if (currentMenu !== 'stage-creation' || !stageInputRef?.current?.value)
      return;

    const columnToCreate: ColumnForCreate = {
      id: v4(),
      colorCode: 'gray',
      position: boardColumns.length,
      title: stageInputRef.current.value,
    };

    setBoardColumns((previousBoardColumns) => [
      ...previousBoardColumns,
      columnToCreate,
    ]);
    onStageAdd?.(columnToCreate);
  };

  const resetMenu = () => setCurrentMenu(undefined);

  const handleMenuNavigate = (menu: BoardOptionsMenu) => {
    handleViewNameSubmit();
    setCurrentMenu(menu);
  };

  const { handleFieldVisibilityChange, handleFieldsReorder } =
    useBoardCardFields();

  const { closeDropdown } = useDropdown();

  const handleReorderField: OnDragEndResponder = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const reorderFields = [...visibleBoardCardFields];
      const [removed] = reorderFields.splice(result.source.index - 1, 1);
      reorderFields.splice(result.destination.index - 1, 0, removed);

      handleFieldsReorder(reorderFields);
    },
    [handleFieldsReorder, visibleBoardCardFields],
  );

  useScopedHotkeys(
    Key.Escape,
    () => {
      setViewEditMode('none');
      closeDropdown();
    },
    BoardOptionsHotkeyScope.Dropdown,
  );

  useScopedHotkeys(
    Key.Enter,
    () => {
      const name = viewEditInputRef.current?.value;
      resetMenu();
      setViewEditMode('none');
      closeDropdown();
      handleStageSubmit();
      handleViewNameSubmit(name);
      closeDropdown();
    },
    BoardOptionsHotkeyScope.Dropdown,
  );

  return (
    <>
      {!currentMenu && (
        <>
          <DropdownMenuInput
            ref={viewEditInputRef}
            autoFocus={viewEditMode !== 'none'}
            placeholder={
              viewEditMode === 'create'
                ? 'New view'
                : viewEditMode === 'edit'
                ? 'View name'
                : ''
            }
            defaultValue={viewEditMode === 'create' ? '' : currentView?.name}
          />
          <DropdownMenuSeparator />
          <DropdownMenuItemsContainer>
            <MenuItemNavigate
              onClick={() => handleMenuNavigate('fields')}
              LeftIcon={IconTag}
              text="Fields"
            />
            <MenuItemNavigate
              onClick={() => handleMenuNavigate('stages')}
              LeftIcon={IconLayoutKanban}
              text="Stages"
            />
          </DropdownMenuItemsContainer>
          <DropdownMenuSeparator />
          <DropdownMenuItemsContainer>
            <MenuItemToggle
              LeftIcon={IconBaselineDensitySmall}
              onToggleChange={setIsCompactViewEnabled}
              toggled={isCompactViewEnabled}
              text="Compact view"
              toggleSize="small"
            />
          </DropdownMenuItemsContainer>
        </>
      )}
      {currentMenu === 'stages' && (
        <>
          <DropdownMenuHeader StartIcon={IconChevronLeft} onClick={resetMenu}>
            Stages
          </DropdownMenuHeader>
          <DropdownMenuSeparator />
          <DropdownMenuItemsContainer>
            <MenuItem
              onClick={() => setCurrentMenu('stage-creation')}
              LeftIcon={IconPlus}
              text="Add stage"
            />
          </DropdownMenuItemsContainer>
        </>
      )}
      {currentMenu === 'stage-creation' && (
        <DropdownMenuSearchInput
          autoFocus
          placeholder="New stage"
          ref={stageInputRef}
        />
      )}
      {currentMenu === 'fields' && (
        <>
          <DropdownMenuHeader StartIcon={IconChevronLeft} onClick={resetMenu}>
            Fields
          </DropdownMenuHeader>
          <DropdownMenuSeparator />
          {hasVisibleFields && (
            <ViewFieldsVisibilityDropdownSection
              title="Visible"
              fields={visibleBoardCardFields}
              isVisible={true}
              onVisibilityChange={handleFieldVisibilityChange}
              isDraggable={true}
              onDragEnd={handleReorderField}
            />
          )}
          {hasVisibleFields && hasHiddenFields && <DropdownMenuSeparator />}
          {hasHiddenFields && (
            <ViewFieldsVisibilityDropdownSection
              title="Hidden"
              fields={hiddenBoardCardFields}
              isVisible={false}
              onVisibilityChange={handleFieldVisibilityChange}
              isDraggable={false}
            />
          )}
        </>
      )}
    </>
  );
};
