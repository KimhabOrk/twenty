import { Module } from '@nestjs/common';

import { QuickActionsService } from 'src/core/quick-actions/quick-actions.service';
import { WorkspaceQueryRunnerModule } from 'src/workspace/workspace-query-runner/workspace-query-runner.module';

@Module({
  imports: [WorkspaceQueryRunnerModule],
  controllers: [],
  providers: [QuickActionsService],
  exports: [QuickActionsService],
})
export class QuickActionsModule {}
