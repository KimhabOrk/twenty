import { MouseEvent, useContext } from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import {
  RecoilValueReadOnly,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

import { sortsScopedState } from '@/ui/data/sort/states/sortsScopedState';
import { entityCountInCurrentViewState } from '@/ui/data/view-bar/states/entityCountInCurrentViewState';
import { filtersScopedState } from '@/ui/data/view-bar/states/filtersScopedState';
import { savedFiltersFamilyState } from '@/ui/data/view-bar/states/savedFiltersFamilyState';
import {
  IconChevronDown,
  IconList,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@/ui/display/icon';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { StyledDropdownButtonContainer } from '@/ui/layout/dropdown/components/StyledDropdownButtonContainer';
import { useDropdown } from '@/ui/layout/dropdown/hooks/useDropdown';
import { DropdownScope } from '@/ui/layout/dropdown/scopes/DropdownScope';
import { MenuItem } from '@/ui/navigation/menu-item/components/MenuItem';
import { MOBILE_VIEWPORT } from '@/ui/theme/constants/theme';
import { HotkeyScope } from '@/ui/utilities/hotkey/types/HotkeyScope';
import { useRecoilScopedState } from '@/ui/utilities/recoil-scope/hooks/useRecoilScopedState';
import { useRecoilScopedValue } from '@/ui/utilities/recoil-scope/hooks/useRecoilScopedValue';
import { useRecoilScopeId } from '@/ui/utilities/recoil-scope/hooks/useRecoilScopeId';
import { useView } from '@/views/hooks/useView';
import { currentViewIdScopedState } from '@/views/states/currentViewIdScopedState';
import { savedSortsScopedFamilyState } from '@/views/states/savedViewSortsScopedFamilyState';
import { currentViewScopedSelector } from '@/views/states/selectors/currentViewScopedSelector';
import { viewEditModeState } from '@/views/states/viewEditModeScopedState';
import { viewsScopedState } from '@/views/states/viewsScopedState';
import { assertNotNull } from '~/utils/assert';

import { useSort } from '../../sort/hooks/useSort';
import { ViewsDropdownId } from '../constants/ViewsDropdownId';
import { ViewBarContext } from '../contexts/ViewBarContext';
import { useRemoveView } from '../hooks/useRemoveView';

const StyledBoldDropdownMenuItemsContainer = styled(DropdownMenuItemsContainer)`
  font-weight: ${({ theme }) => theme.font.weight.regular};
`;

const StyledDropdownLabelAdornments = styled.span`
  align-items: center;
  color: ${({ theme }) => theme.grayScale.gray35};
  display: inline-flex;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(1)};
`;

const StyledViewIcon = styled(IconList)`
  margin-right: ${({ theme }) => theme.spacing(1)};
`;

const StyledViewName = styled.span`
  display: inline-block;
  max-width: 130px;
  @media (max-width: 375px) {
    max-width: 90px;
  }
  @media (min-width: 376px) and (max-width: ${MOBILE_VIEWPORT}px) {
    max-width: 110px;
  }
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
`;

export type ViewsDropdownButtonProps = {
  hotkeyScope: HotkeyScope;
  onViewEditModeChange?: () => void;
};

export const ViewsDropdownButton = ({
  hotkeyScope,
  onViewEditModeChange,
}: ViewsDropdownButtonProps) => {
  const theme = useTheme();

  const { defaultViewName, onViewSelect, ViewBarRecoilScopeContext } =
    useContext(ViewBarContext);

  const recoilScopeId = useRecoilScopeId(ViewBarRecoilScopeContext);

  const currentView = useRecoilScopedValue(
    currentViewScopedSelector,
    ViewBarRecoilScopeContext,
  );

  const [views] = useRecoilScopedState(
    viewsScopedState,
    ViewBarRecoilScopeContext,
  );

  const entityCount = useRecoilValue(
    entityCountInCurrentViewState as RecoilValueReadOnly<number>,
  );

  const { isDropdownOpen, closeDropdown } = useDropdown({
    dropdownScopeId: ViewsDropdownId,
  });

  const setViewEditMode = useSetRecoilState(viewEditModeState);

  const { scopeId: viewScopeId } = useView();

  const { scopeId: sortScopeId } = useSort();

  const handleViewSelect = useRecoilCallback(
    ({ set, snapshot }) =>
      async (viewId: string) => {
        await onViewSelect?.(viewId);

        const savedFilters = await snapshot.getPromise(
          savedFiltersFamilyState(viewId),
        );
        const savedSorts = await snapshot.getPromise(
          savedSortsScopedFamilyState({
            scopeId: viewScopeId,
            familyKey: viewId,
          }),
        );

        set(filtersScopedState(recoilScopeId), savedFilters);
        set(sortsScopedState({ scopeId: sortScopeId }), savedSorts);
        set(currentViewIdScopedState({ scopeId: recoilScopeId }), viewId);
        closeDropdown();
      },
    [onViewSelect, recoilScopeId, closeDropdown, viewScopeId, sortScopeId],
  );

  const handleAddViewButtonClick = () => {
    setViewEditMode({ mode: 'create', viewId: undefined });
    onViewEditModeChange?.();
    closeDropdown();
  };

  const handleEditViewButtonClick = (
    event: MouseEvent<HTMLButtonElement>,
    viewId: string,
  ) => {
    event.stopPropagation();
    setViewEditMode({ mode: 'edit', viewId });
    onViewEditModeChange?.();
    closeDropdown();
  };

  const { removeView } = useRemoveView();

  const handleDeleteViewButtonClick = async (
    event: MouseEvent<HTMLButtonElement>,
    viewId: string,
  ) => {
    event.stopPropagation();

    await removeView(viewId);
    closeDropdown();
  };

  return (
    <DropdownScope dropdownScopeId={ViewsDropdownId}>
      <Dropdown
        dropdownHotkeyScope={hotkeyScope}
        clickableComponent={
          <StyledDropdownButtonContainer isUnfolded={isDropdownOpen}>
            <StyledViewIcon size={theme.icon.size.md} />
            <StyledViewName>
              {currentView?.name || defaultViewName}
            </StyledViewName>
            <StyledDropdownLabelAdornments>
              · {entityCount} <IconChevronDown size={theme.icon.size.sm} />
            </StyledDropdownLabelAdornments>
          </StyledDropdownButtonContainer>
        }
        dropdownComponents={
          <>
            <DropdownMenuItemsContainer>
              {views.map((view) => (
                <MenuItem
                  key={view.id}
                  iconButtons={[
                    {
                      Icon: IconPencil,
                      onClick: (event: MouseEvent<HTMLButtonElement>) =>
                        handleEditViewButtonClick(event, view.id),
                    },
                    views.length > 1
                      ? {
                          Icon: IconTrash,
                          onClick: (event: MouseEvent<HTMLButtonElement>) =>
                            handleDeleteViewButtonClick(event, view.id),
                        }
                      : null,
                  ].filter(assertNotNull)}
                  onClick={() => handleViewSelect(view.id)}
                  LeftIcon={IconList}
                  text={view.name}
                />
              ))}
            </DropdownMenuItemsContainer>
            <DropdownMenuSeparator />
            <StyledBoldDropdownMenuItemsContainer>
              <MenuItem
                onClick={handleAddViewButtonClick}
                LeftIcon={IconPlus}
                text="Add view"
              />
            </StyledBoldDropdownMenuItemsContainer>
          </>
        }
      />
    </DropdownScope>
  );
};
