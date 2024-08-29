import { WorkflowStep } from '@/workflow/types/Workflow';
import { findStepPositionOrThrow } from '@/workflow/utils/findStepPositionOrThrow';

export const insertStep = ({
  steps: stepsInitial,
  stepToAdd,
  parentStepId,
}: {
  steps: Array<WorkflowStep>;
  parentStepId: string | undefined;
  stepToAdd: WorkflowStep;
}): Array<WorkflowStep> => {
  // Make a deep copy of the nested object to prevent unwanted side effects.
  const steps = structuredClone(stepsInitial);

  const parentStepPosition = findStepPositionOrThrow({
    steps,
    stepId: parentStepId,
  });

  parentStepPosition.steps.splice(
    parentStepPosition.index + 1, // The "+ 1" means that we add the step after its parent and not before.
    0,
    stepToAdd,
  );

  return steps;
};
