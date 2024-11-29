import { Module } from '@nestjs/common';

import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';

import { WorkflowCommandModule } from 'src/modules/workflow/common/commands/workflow-command.module';
import { WorkflowQueryHookModule } from 'src/modules/workflow/common/query-hooks/workflow-query-hook.module';
import { WorkflowCommonWorkspaceService } from 'src/modules/workflow/common/workspace-services/workflow-common.workspace-service';
import { WorkflowVersionWorkspaceService } from 'src/modules/workflow/common/workspace-services/workflow-version.workspace-service';
import { WorkflowBuilderModule } from 'src/modules/workflow/workflow-builder/workflow-builder.module';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { ServerlessFunctionModule } from 'src/engine/metadata-modules/serverless-function/serverless-function.module';
import { CodeIntrospectionModule } from 'src/modules/code-introspection/code-introspection.module';

@Module({
  imports: [
    WorkflowQueryHookModule,
    WorkflowCommandModule,
    WorkflowBuilderModule,
    ServerlessFunctionModule,
    CodeIntrospectionModule,
    NestjsQueryTypeOrmModule.forFeature([ObjectMetadataEntity], 'metadata'),
  ],
  providers: [WorkflowCommonWorkspaceService, WorkflowVersionWorkspaceService],
  exports: [WorkflowCommonWorkspaceService, WorkflowVersionWorkspaceService],
})
export class WorkflowCommonModule {}
