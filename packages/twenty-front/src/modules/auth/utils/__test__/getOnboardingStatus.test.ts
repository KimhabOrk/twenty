import { CurrentUser } from '@/auth/states/currentUserState';
import { CurrentWorkspace } from '@/auth/states/currentWorkspaceState';
import { OnboardingStep } from '~/generated/graphql';

import { getOnboardingStatus } from '../getOnboardingStatus';

describe('getOnboardingStatus', () => {
  it('should return the correct status', () => {
    const ongoingUserCreation = getOnboardingStatus({
      isLoggedIn: false,
      currentWorkspace: null,
      currentUser: null,
      isBillingEnabled: false,
    });

    const ongoingWorkspaceActivation = getOnboardingStatus({
      isLoggedIn: true,
      currentWorkspace: {
        id: '1',
        activationStatus: 'inactive',
      } as CurrentWorkspace,
      currentUser: {
        onboardingStep: OnboardingStep.WorkspaceActivation,
      } as CurrentUser,
      isBillingEnabled: false,
    });

    const ongoingProfileCreation = getOnboardingStatus({
      isLoggedIn: true,
      currentWorkspace: {
        id: '1',
        activationStatus: 'active',
      } as CurrentWorkspace,
      currentUser: {
        onboardingStep: OnboardingStep.ProfileCreation,
      } as CurrentUser,
      isBillingEnabled: false,
    });

    const ongoingSyncEmail = getOnboardingStatus({
      isLoggedIn: true,
      currentWorkspace: {
        id: '1',
        activationStatus: 'active',
      } as CurrentWorkspace,
      currentUser: {
        onboardingStep: OnboardingStep.SyncEmail,
      } as CurrentUser,
      isBillingEnabled: false,
    });

    const ongoingInviteTeam = getOnboardingStatus({
      isLoggedIn: true,
      currentWorkspace: {
        id: '1',
        activationStatus: 'active',
      } as CurrentWorkspace,
      currentUser: {
        onboardingStep: OnboardingStep.InviteTeam,
      } as CurrentUser,
      isBillingEnabled: false,
    });

    const completed = getOnboardingStatus({
      isLoggedIn: true,
      currentWorkspace: {
        id: '1',
        activationStatus: 'active',
      } as CurrentWorkspace,
      currentUser: {
        onboardingStep: null,
      } as CurrentUser,
      isBillingEnabled: false,
    });

    const incomplete = getOnboardingStatus({
      isLoggedIn: true,
      currentWorkspace: {
        id: '1',
        activationStatus: 'active',
        subscriptionStatus: 'incomplete',
      } as CurrentWorkspace,
      currentUser: {
        onboardingStep: null,
      } as CurrentUser,
      isBillingEnabled: true,
    });

    const incompleteButBillingDisabled = getOnboardingStatus({
      isLoggedIn: true,
      currentWorkspace: {
        id: '1',
        activationStatus: 'active',
        subscriptionStatus: 'incomplete',
      } as CurrentWorkspace,
      currentUser: {
        onboardingStep: null,
      } as CurrentUser,
      isBillingEnabled: false,
    });

    const canceled = getOnboardingStatus({
      isLoggedIn: true,
      currentWorkspace: {
        id: '1',
        activationStatus: 'active',
        subscriptionStatus: 'canceled',
      } as CurrentWorkspace,
      currentUser: {
        onboardingStep: null,
      } as CurrentUser,
      isBillingEnabled: true,
    });

    expect(ongoingUserCreation).toBe('ongoing_user_creation');
    expect(ongoingWorkspaceActivation).toBe('ongoing_workspace_activation');
    expect(ongoingProfileCreation).toBe('ongoing_profile_creation');
    expect(ongoingSyncEmail).toBe('ongoing_sync_email');
    expect(ongoingInviteTeam).toBe('ongoing_invite_team');
    expect(completed).toBe('completed');
    expect(incomplete).toBe('incomplete');
    expect(canceled).toBe('canceled');
    expect(incompleteButBillingDisabled).toBe('completed');
  });
});
