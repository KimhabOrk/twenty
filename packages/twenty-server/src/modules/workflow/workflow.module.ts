import { Module } from '@nestjs/common';

import { WorkflowTriggerModule } from 'src/modules/workflow/workflow-trigger/workflow-trigger.module';

@Module({
  imports: [WorkflowTriggerModule],
})
export class WorkflowModule {}
