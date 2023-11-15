import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useUpdateOneObjectRecord } from '@/object-record/hooks/useUpdateOneObjectRecord';
import { ColorScheme, useUpdateUserMutation } from '~/generated/graphql';

export const useColorScheme = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [currentWorkspaceMember, setCurrentWorkspaceMember] = useRecoilState(
    currentWorkspaceMemberState,
  );

  const [updateUser] = useUpdateUserMutation();
  const { updateOneObject: updateOneWorkspaceMember } =
    useUpdateOneObjectRecord({
      objectNamePlural: 'workspaceMembersV2',
    });
  const colorScheme = currentWorkspaceMember?.colorScheme ?? ColorScheme.System;

  const setColorScheme = useCallback(async (value: ColorScheme) => {
    try {
      // connect settings to workspace member if not already connected
      // await updateWorkspaceMember({
      //   variables: {
      //     where: { id: currentUser?.workspaceMember.id },
      //     data: { settings: { connect: { id: currentUser?.settings.id } } },
      //   },
      // });
      // const result = await updateUser({
      //   variables: {
      //     where: {
      //       id: currentUser?.id,
      //     },
      //     data: {
      //       settings: {
      //         update: {
      //           colorScheme: value,
      //         },
      //       },
      //     },
      //   },
      //   optimisticResponse: currentUser
      //     ? {
      //         __typename: 'Mutation',
      //         updateUser: {
      //           __typename: 'User',
      //           ...currentUser,
      //           workspaceMember: {
      //             ...currentUser.workspaceMember,
      //             settings: {
      //               __typename: 'UserSettings',
      //               id: currentUser.settings.id,
      //               colorScheme: value,
      //               locale: currentUser.settings.locale,
      //             },
      //           },
      //           settings: {
      //             __typename: 'UserSettings',
      //             id: currentUser.settings.id,
      //             colorScheme: value,
      //             locale: currentUser.settings.locale,
      //           },
      //         },
      //       }
      //     : undefined,
      //   update: (_cache, { data }) => {
      //     if (
      //       data?.updateUser.workspaceMember?.settings?.colorScheme &&
      //       currentUser
      //     ) {
      //       setCurrentUser({
      //         ...currentUser,
      //         workspaceMember: {
      //           ...currentUser.workspaceMember,
      //           settings: {
      //             ...currentUser.workspaceMember.settings,
      //             colorScheme:
      //               data.updateUser.workspaceMember.settings.colorScheme,
      //           },
      //         },
      //         settings: {
      //           ...currentUser.settings,
      //           colorScheme:
      //             data.updateUser.workspaceMember.settings.colorScheme,
      //         },
      //       });
      //     }
      //   },
      // });
      // if (!result.data || result.errors) {
      //   throw result.errors;
      // }
    } catch (err) {}
  }, []);

  return {
    colorScheme,
    setColorScheme,
  };
};
