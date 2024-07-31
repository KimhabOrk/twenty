import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { ColorScheme } from '@/workspace-member/types/WorkspaceMember';

export const useColorScheme = () => {
  const [currentWorkspaceMember, setCurrentWorkspaceMember] = useRecoilState(
    currentWorkspaceMemberState,
  );

  const { updateOneRecord: updateOneWorkspaceMember } = useUpdateOneRecord({
    objectNameSingular: CoreObjectNameSingular.WorkspaceMember,
  });

  const [colorScheme, setColorScheme] = useState<ColorScheme | 'System'>(
    'System',
  );
  useEffect(() => {
    if (currentWorkspaceMember?.colorScheme !== undefined) {
      setColorScheme(currentWorkspaceMember.colorScheme);
      localStorage.setItem('app-theme', currentWorkspaceMember.colorScheme);
    }
  }, [currentWorkspaceMember]);

  const updateColorScheme = useCallback(
    async (value: ColorScheme) => {
      if (!currentWorkspaceMember) {
        return;
      }
      setCurrentWorkspaceMember((current) => {
        if (!current) {
          return current;
        }
        return {
          ...current,
          colorScheme: value,
        };
      });
      await updateOneWorkspaceMember?.({
        idToUpdate: currentWorkspaceMember?.id,
        updateOneRecordInput: {
          colorScheme: value,
        },
      });
    },
    [
      currentWorkspaceMember,
      setCurrentWorkspaceMember,
      updateOneWorkspaceMember,
    ],
  );

  return {
    colorScheme,
    setColorScheme: updateColorScheme,
  };
};
