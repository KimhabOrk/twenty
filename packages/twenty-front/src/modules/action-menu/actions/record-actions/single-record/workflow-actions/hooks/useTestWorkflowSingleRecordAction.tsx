import { useActionMenuEntries } from '@/action-menu/hooks/useActionMenuEntries';
import {
  ActionMenuEntryScope,
  ActionMenuEntryType,
} from '@/action-menu/types/ActionMenuEntry';
import { useRunWorkflowVersion } from '@/workflow/hooks/useRunWorkflowVersion';
import { useWorkflowWithCurrentVersion } from '@/workflow/hooks/useWorkflowWithCurrentVersion';
import { IconPlayerPlay, isDefined } from 'twenty-ui';

export const useTestWorkflowSingleRecordAction = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const { addActionMenuEntry, removeActionMenuEntry } = useActionMenuEntries();

  const workflowWithCurrentVersion = useWorkflowWithCurrentVersion(workflowId);

  const { runWorkflowVersion } = useRunWorkflowVersion();

  const registerTestWorkflowSingleRecordAction = ({
    position,
  }: {
    position: number;
  }) => {
    if (
      !isDefined(workflowWithCurrentVersion) ||
      !isDefined(workflowWithCurrentVersion.currentVersion.trigger)
    ) {
      return;
    }

    if (
      workflowWithCurrentVersion.currentVersion.trigger.type !== 'MANUAL' ||
      isDefined(
        workflowWithCurrentVersion.currentVersion.trigger.settings.objectType,
      )
    ) {
      return;
    }

    addActionMenuEntry({
      key: 'test-workflow',
      label: 'Test workflow',
      position,
      type: ActionMenuEntryType.Standard,
      scope: ActionMenuEntryScope.RecordSelection,
      Icon: IconPlayerPlay,
      onClick: () => {
        runWorkflowVersion({
          workflowVersionId: workflowWithCurrentVersion.currentVersion.id,
          workflowName: workflowWithCurrentVersion.name,
        });
      },
    });
  };

  const unregisterTestWorkflowSingleRecordAction = () => {
    removeActionMenuEntry('test-workflow');
  };

  return {
    registerTestWorkflowSingleRecordAction,
    unregisterTestWorkflowSingleRecordAction,
  };
};
