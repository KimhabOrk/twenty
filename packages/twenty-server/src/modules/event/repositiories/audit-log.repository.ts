import { Injectable } from '@nestjs/common';

import { WorkspaceDataSourceService } from 'src/engine/workspace-datasource/workspace-datasource.service';

@Injectable()
export class AuditLogRepository {
  constructor(
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
  ) {}

  public async insert(
    name: string,
    properties: string,
    workspaceMemberId: string | null,
    objectName: string,
    objectId: string,
    workspaceId: string,
  ): Promise<void> {
    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    await this.workspaceDataSourceService.executeRawQuery(
      `INSERT INTO ${dataSourceSchema}."auditLog"
      ("name", "properties", "workspaceMemberId", "objectName", "objectId")
      VALUES ($1, $2, $3, $4, $5)`,
      [name, properties, workspaceMemberId, objectName, objectId],
      workspaceId,
    );
  }
}
