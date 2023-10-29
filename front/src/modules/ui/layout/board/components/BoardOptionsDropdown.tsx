import { useView } from '@/views/hooks/useView';

import { Dropdown } from '../../dropdown/components/Dropdown';
import { DropdownScope } from '../../dropdown/scopes/DropdownScope';
import { BoardOptionsHotkeyScope } from '../types/BoardOptionsHotkeyScope';
import { BoardScopeIds } from '../types/enums/BoardScopeIds';

import { BoardOptionsDropdownButton } from './BoardOptionsDropdownButton';
import {
  BoardOptionsDropdownContent,
  BoardOptionsDropdownContentProps,
} from './BoardOptionsDropdownContent';

type BoardOptionsDropdownProps = Pick<
  BoardOptionsDropdownContentProps,
  'onStageAdd'
>;

export const BoardOptionsDropdown = ({
  onStageAdd,
}: BoardOptionsDropdownProps) => {
  const { setViewEditMode } = useView();

  return (
    <DropdownScope dropdownScopeId={BoardScopeIds.OptionsDropdown}>
      <Dropdown
        clickableComponent={<BoardOptionsDropdownButton />}
        dropdownComponents={
          <BoardOptionsDropdownContent onStageAdd={onStageAdd} />
        }
        dropdownHotkeyScope={{ scope: BoardOptionsHotkeyScope.Dropdown }}
        onClickOutside={() => setViewEditMode('none')}
        dropdownMenuWidth={170}
      />
    </DropdownScope>
  );
};
