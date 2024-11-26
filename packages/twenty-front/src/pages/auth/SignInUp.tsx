import { useRecoilValue } from 'recoil';

import { useSignInUp } from '@/auth/sign-in-up/hooks/useSignInUp';
import { useSignInUpForm } from '@/auth/sign-in-up/hooks/useSignInUpForm';
import { SignInUpStep } from '@/auth/states/signInUpStepState';
import { workspacePublicDataState } from '@/auth/states/workspacePublicDataState';
import {
  isTwentyHomePage,
  isTwentyWorkspaceSubdomain,
} from '~/utils/workspace-url.helper';
import { SignInUpGlobalScopeForm } from '@/auth/sign-in-up/components/SignInUpGlobalScopeForm';
import { FooterNote } from '@/auth/sign-in-up/components/FooterNote';
import { AnimatedEaseIn } from 'twenty-ui';
import { Logo } from '@/auth/components/Logo';
import { Title } from '@/auth/components/Title';
import { SignInUpWorkspaceScopeForm } from '@/auth/sign-in-up/components/SignInUpWorkspaceScopeForm';
import { DEFAULT_WORKSPACE_NAME } from '@/ui/navigation/navigation-drawer/constants/DefaultWorkspaceName';
import { SignInUpSSOIdentityProviderSelection } from '@/auth/sign-in-up/components/SignInUpSSOIdentityProviderSelection';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';

export const SignInUp = () => {
  const { form } = useSignInUpForm();
  const { signInUpStep } = useSignInUp(form);

  const workspacePublicData = useRecoilValue(workspacePublicDataState);
  const isMultiWorkspaceEnabled = useRecoilValue(isMultiWorkspaceEnabledState);

  return (
    <>
      <AnimatedEaseIn>
        <Logo workspaceLogo={workspacePublicData?.logo} />
      </AnimatedEaseIn>
      <Title animate>
        {`Welcome to ${workspacePublicData?.displayName ?? DEFAULT_WORKSPACE_NAME}`}
      </Title>
      {isTwentyHomePage || isMultiWorkspaceEnabled ? (
        <SignInUpGlobalScopeForm />
      ) : (!isMultiWorkspaceEnabled ||
          (isMultiWorkspaceEnabled && isTwentyWorkspaceSubdomain)) &&
        signInUpStep === SignInUpStep.SSOIdentityProviderSelection ? (
        <SignInUpSSOIdentityProviderSelection />
      ) : workspacePublicData &&
        (!isMultiWorkspaceEnabled || isTwentyWorkspaceSubdomain) ? (
        <SignInUpWorkspaceScopeForm />
      ) : null}
      <FooterNote />
    </>
  );
};
