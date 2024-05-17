import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';

import { AuthForm } from '@/auth/sign-in-up/components/AuthForm';
import { useSignInUpForm } from '@/auth/sign-in-up/hooks/useSignInUpForm';
import { useWorkspaceFromInviteHash } from '@/auth/sign-in-up/hooks/useWorkspaceFromInviteHash';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { AppPath } from '@/types/AppPath';
import { Loader } from '@/ui/feedback/loader/components/Loader';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { MainButton } from '@/ui/input/button/components/MainButton';
import { useWorkspaceSwitching } from '@/ui/navigation/navigation-drawer/hooks/useWorkspaceSwitching';
import { AnimatedEaseIn } from '@/ui/utilities/animation/components/AnimatedEaseIn';
import { useAddUserToWorkspaceMutation } from '~/generated/graphql';
import { isDefined } from '~/utils/isDefined';

import { Logo } from '../../components/Logo';
import { Title } from '../../components/Title';

import { FooterNote } from './FooterNote';

const StyledContentContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(8)};
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

export const InviteForm = () => {
  const { enqueueSnackBar } = useSnackBar();
  const navigate = useNavigate();
  const {
    workspace: workspaceFromInviteHash,
    loading: workspaceFromInviteHashLoading,
    workspaceInviteHash,
  } = useWorkspaceFromInviteHash();
  const { form } = useSignInUpForm();
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const [addUserToWorkspace] = useAddUserToWorkspaceMutation();
  const { switchWorkspace } = useWorkspaceSwitching();

  const title = useMemo(() => {
    return `Join ${workspaceFromInviteHash?.displayName ?? ''} team`;
  }, [workspaceFromInviteHash?.displayName]);

  const handleUserJoinWorkspace = async () => {
    if (
      !(isDefined(workspaceInviteHash) && isDefined(workspaceFromInviteHash))
    ) {
      return;
    }
    await addUserToWorkspace({
      variables: {
        inviteHash: workspaceInviteHash,
      },
    });
    await switchWorkspace(workspaceFromInviteHash.id);
  };

  useEffect(() => {
    if (
      !isDefined(workspaceFromInviteHash) &&
      !workspaceFromInviteHashLoading
    ) {
      enqueueSnackBar('workspace does not exist', {
        variant: 'error',
      });
      if (isDefined(currentWorkspace)) {
        navigate(AppPath.Index);
      } else {
        navigate(AppPath.SignInUp);
      }
    }
    if (
      isDefined(currentWorkspace) &&
      currentWorkspace.id === workspaceFromInviteHash?.id
    ) {
      enqueueSnackBar(
        `You already belong to ${workspaceFromInviteHash?.displayName} workspace`,
        {
          variant: 'info',
        },
      );
      navigate(AppPath.Index);
    }
  }, [
    navigate,
    enqueueSnackBar,
    currentWorkspace,
    workspaceFromInviteHash,
    workspaceFromInviteHashLoading,
  ]);

  return (
    !workspaceFromInviteHashLoading && (
      <>
        <AnimatedEaseIn>
          <Logo workspaceLogo={workspaceFromInviteHash?.logo} />
        </AnimatedEaseIn>
        <Title animate>{title}</Title>
        {isDefined(currentWorkspace) && workspaceFromInviteHash ? (
          <>
            <StyledContentContainer>
              <MainButton
                variant="secondary"
                title="Continue"
                type="submit"
                onClick={handleUserJoinWorkspace}
                Icon={() => form.formState.isSubmitting && <Loader />}
                fullWidth
              />
            </StyledContentContainer>
            <FooterNote>
              By using Twenty, you agree to the Terms of Service and Privacy
              Policy.
            </FooterNote>
          </>
        ) : (
          <AuthForm />
        )}
      </>
    )
  );
};
