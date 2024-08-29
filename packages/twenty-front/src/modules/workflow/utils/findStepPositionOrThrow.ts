import { WorkflowStep } from '@/workflow/types/Workflow';

/**
 * This function returns the reference of the array where the step should be positioned
 * and at which index.
 */
export const findStepPositionOrThrow = ({
  steps,
  stepId,
}: {
  steps: Array<WorkflowStep>;
  stepId: string | undefined;
}): { steps: Array<WorkflowStep>; index: number } => {
  if (stepId === undefined) {
    return {
      steps,
      index: 0,
    };
  }

  for (const [index, step] of steps.entries()) {
    if (step.id === stepId) {
      return {
        steps,
        index,
      };
    }

    // TODO: When condition will have been implemented, put recursivity here.
    // if (step.type === "CONDITION") {
    //     return findNodePosition({
    //         workflowSteps: step.conditions,
    //         stepId,
    //     })
    // }
  }

  throw new Error(`Couldn't locate the step. Unreachable step id: ${stepId}.`);
};
