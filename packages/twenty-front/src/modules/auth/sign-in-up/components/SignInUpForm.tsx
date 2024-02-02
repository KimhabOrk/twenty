import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import { IconGoogle } from '@/ui/display/icon/components/IconGoogle';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { Button } from '@/ui/input/button/components/Button';
import { MainButton } from '@/ui/input/button/components/MainButton';
import { TextInput } from '@/ui/input/components/TextInput';
import { AnimatedEaseIn } from '@/ui/utilities/animation/components/AnimatedEaseIn';
import { useEmailPasswordResetLinkMutation } from '~/generated/graphql';

import { Logo } from '../../components/Logo';
import { Title } from '../../components/Title';
import { SignInUpMode, SignInUpStep, useSignInUp } from '../hooks/useSignInUp';

import { FooterNote } from './FooterNote';
import { HorizontalSeparator } from './HorizontalSeparator';

const StyledContentContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(8)};
  margin-top: ${({ theme }) => theme.spacing(4)};
  width: 200px;
`;

const StyledFooterNote = styled(FooterNote)`
  max-width: 280px;
`;

const StyledForm = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledFullWidthMotionDiv = styled(motion.div)`
  width: 100%;
`;

const StyledInputContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const StyledForgotPasswordButton = styled(Button)`
  border: none;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
`;

export const SignInUpForm = () => {
  const {
    authProviders,
    signInWithGoogle,
    signInUpStep,
    signInUpMode,
    showErrors,
    setShowErrors,
    continueWithCredentials,
    continueWithEmail,
    submitCredentials,
    form: {
      control,
      watch,
      handleSubmit,
      getValues,
      formState: { isSubmitting },
    },
    workspace,
  } = useSignInUp();

  const [emailPasswordResetLink] = useEmailPasswordResetLinkMutation();
  const { enqueueSnackBar } = useSnackBar();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (signInUpStep === SignInUpStep.Init) {
        continueWithEmail();
      } else if (signInUpStep === SignInUpStep.Email) {
        continueWithCredentials();
      } else if (signInUpStep === SignInUpStep.Password) {
        setShowErrors(true);
        handleSubmit(submitCredentials)();
      }
    }
  };

  const handleResetPasswordClick = async () => {
    const emailInput = getValues('email');

    if (!emailInput) {
      enqueueSnackBar('Invalid email', {
        variant: 'error',
      });
      return;
    }

    try {
      const { data } = await emailPasswordResetLink({
        variables: {
          email: emailInput,
        },
      });

      if (data?.emailPasswordResetLink?.success) {
        enqueueSnackBar('Password reset link has been sent to the email', {
          variant: 'success',
        });
      } else {
        enqueueSnackBar('There was some issue', {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackBar((error as Error).message, {
        variant: 'error',
      });
    }
  };

  const buttonTitle = useMemo(() => {
    if (signInUpStep === SignInUpStep.Init) {
      return 'Continue With Email';
    }

    if (signInUpStep === SignInUpStep.Email) {
      return 'Continue';
    }

    return signInUpMode === SignInUpMode.SignIn ? 'Sign in' : 'Sign up';
  }, [signInUpMode, signInUpStep]);

  const title = useMemo(() => {
    if (signInUpMode === SignInUpMode.Invite) {
      return `Join ${workspace?.displayName ?? ''} team`;
    }

    return signInUpMode === SignInUpMode.SignIn
      ? 'Sign in to Twenty'
      : 'Sign up to Twenty';
  }, [signInUpMode, workspace?.displayName]);

  const theme = useTheme();

  return (
    <>
      <AnimatedEaseIn>
        <Logo workspaceLogo={workspace?.logo} />
      </AnimatedEaseIn>
      <Title animate>{title}</Title>
      <StyledContentContainer>
        {authProviders.google && (
          <>
            <MainButton
              Icon={() => <IconGoogle size={theme.icon.size.lg} />}
              title="Continue with Google"
              onClick={signInWithGoogle}
              fullWidth
            />
            <HorizontalSeparator />
          </>
        )}

        <StyledForm
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          {signInUpStep !== SignInUpStep.Init && (
            <StyledFullWidthMotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{
                type: 'spring',
                stiffness: 800,
                damping: 35,
              }}
            >
              <Controller
                name="email"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <StyledInputContainer>
                    <TextInput
                      autoFocus
                      value={value}
                      placeholder="Email"
                      onBlur={onBlur}
                      onChange={(value: string) => {
                        onChange(value);
                        if (signInUpStep === SignInUpStep.Password) {
                          continueWithEmail();
                        }
                      }}
                      error={showErrors ? error?.message : undefined}
                      onKeyDown={handleKeyDown}
                      fullWidth
                      disableHotkeys
                    />
                  </StyledInputContainer>
                )}
              />
            </StyledFullWidthMotionDiv>
          )}
          {signInUpStep === SignInUpStep.Password && (
            <StyledFullWidthMotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{
                type: 'spring',
                stiffness: 800,
                damping: 35,
              }}
            >
              <Controller
                name="password"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <StyledInputContainer>
                    <TextInput
                      autoFocus
                      value={value}
                      type="password"
                      placeholder="Password"
                      onBlur={onBlur}
                      onChange={onChange}
                      onKeyDown={handleKeyDown}
                      error={showErrors ? error?.message : undefined}
                      fullWidth
                      disableHotkeys
                    />
                  </StyledInputContainer>
                )}
              />
            </StyledFullWidthMotionDiv>
          )}

          <MainButton
            variant="secondary"
            title={buttonTitle}
            type="submit"
            onClick={() => {
              if (signInUpStep === SignInUpStep.Init) {
                continueWithEmail();
                return;
              }
              if (signInUpStep === SignInUpStep.Email) {
                continueWithCredentials();
                return;
              }
              setShowErrors(true);
              handleSubmit(submitCredentials)();
            }}
            disabled={
              SignInUpStep.Init
                ? false
                : signInUpStep === SignInUpStep.Email
                  ? !watch('email')
                  : !watch('email') || !watch('password') || isSubmitting
            }
            fullWidth
          />
        </StyledForm>
      </StyledContentContainer>
      {signInUpStep === SignInUpStep.Password ? (
        <StyledForgotPasswordButton
          title="Forgot your password?"
          variant="secondary"
          onClick={handleResetPasswordClick}
        />
      ) : (
        <StyledFooterNote>
          By using Twenty, you agree to the Terms of Service and Data Processing
          Agreement.
        </StyledFooterNote>
      )}
    </>
  );
};
