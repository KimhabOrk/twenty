import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useFilter } from '@/ui/object/object-filter-dropdown/hooks/useFilter';
import { ViewFilterOperand } from '@/views/types/ViewFilterOperand';

import { tasksFilterDefinitions } from './tasks-filter-definitions';

type TasksEffectProps = {
  filterId: string;
};

export const TasksEffect = ({ filterId }: TasksEffectProps) => {
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);
  const { setSelectedFilter, setAvailableFilterDefinitions } = useFilter({
    filterScopeId: filterId,
  });

  useEffect(() => {
    setAvailableFilterDefinitions(tasksFilterDefinitions);
  }, [setAvailableFilterDefinitions]);

  useEffect(() => {
    if (currentWorkspaceMember) {
      setSelectedFilter({
        fieldMetadataId: 'assigneeId',
        value: currentWorkspaceMember.id,
        operand: ViewFilterOperand.Is,
        displayValue:
          currentWorkspaceMember.name?.firstName +
          ' ' +
          currentWorkspaceMember.name?.lastName,
        displayAvatarUrl: currentWorkspaceMember.avatarUrl ?? undefined,
        definition: tasksFilterDefinitions[0],
      });
    }
  }, [currentWorkspaceMember, setSelectedFilter]);
  return <></>;
};
