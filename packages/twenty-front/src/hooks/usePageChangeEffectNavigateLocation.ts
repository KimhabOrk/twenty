import { useOnboardingStatus } from '@/auth/hooks/useOnboardingStatus';
import { OnboardingStatus } from '@/auth/utils/getOnboardingStatus';
import { AppPath } from '@/types/AppPath';
import { SettingsPath } from '@/types/SettingsPath';
import { useDefaultHomePagePath } from '~/hooks/useDefaultHomePagePath';
import { useIsMatchingLocation } from '~/hooks/useIsMatchingLocation';
import { isDefined } from '~/utils/isDefined';

export const usePageChangeEffectNavigateLocation = () => {
  const isMatchingLocation = useIsMatchingLocation();
  const onboardingStatus = useOnboardingStatus();
  const { defaultHomePagePath } = useDefaultHomePagePath();

  const isMatchingOpenRoute =
    isMatchingLocation(AppPath.Invite) ||
    isMatchingLocation(AppPath.ResetPassword);

  const isMatchingOngoingUserCreationRoute =
    isMatchingOpenRoute ||
    isMatchingLocation(AppPath.SignInUp) ||
    isMatchingLocation(AppPath.Verify);

  const isMatchingOnboardingRoute =
    isMatchingOngoingUserCreationRoute ||
    isMatchingLocation(AppPath.CreateWorkspace) ||
    isMatchingLocation(AppPath.CreateProfile) ||
    isMatchingLocation(AppPath.PlanRequired) ||
    isMatchingLocation(AppPath.PlanRequiredSuccess);

  if (
    onboardingStatus === OnboardingStatus.OngoingUserCreation &&
    !isMatchingOngoingUserCreationRoute
  ) {
    return AppPath.SignInUp;
  } else if (
    onboardingStatus === OnboardingStatus.Incomplete &&
    !isMatchingLocation(AppPath.PlanRequired)
  ) {
    return AppPath.PlanRequired;
  } else if (
    isDefined(onboardingStatus) &&
    [OnboardingStatus.Unpaid, OnboardingStatus.Canceled].includes(
      onboardingStatus,
    ) &&
    !(
      isMatchingLocation(AppPath.SettingsCatchAll) ||
      isMatchingLocation(AppPath.PlanRequired)
    )
  ) {
    return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
      SettingsPath.Billing
    }`;
  } else if (
    onboardingStatus === OnboardingStatus.OngoingWorkspaceActivation &&
    !isMatchingLocation(AppPath.CreateWorkspace) &&
    !isMatchingLocation(AppPath.PlanRequiredSuccess)
  ) {
    return AppPath.CreateWorkspace;
  } else if (
    onboardingStatus === OnboardingStatus.OngoingProfileCreation &&
    !isMatchingLocation(AppPath.CreateProfile)
  ) {
    return AppPath.CreateProfile;
  } else if (
    onboardingStatus === OnboardingStatus.Completed &&
    isMatchingOnboardingRoute &&
    !isMatchingOpenRoute
  ) {
    return defaultHomePagePath;
  } else if (
    onboardingStatus === OnboardingStatus.CompletedWithoutSubscription &&
    isMatchingOnboardingRoute &&
    !isMatchingOpenRoute &&
    !isMatchingLocation(AppPath.PlanRequired)
  ) {
    return defaultHomePagePath;
  } else if (isMatchingLocation(AppPath.Index)) {
    return defaultHomePagePath;
  }
  return;
};
