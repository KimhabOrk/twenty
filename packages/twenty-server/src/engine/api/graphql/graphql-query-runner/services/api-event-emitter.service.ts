import { Injectable } from '@nestjs/common';

import { ObjectRecord } from 'src/engine/api/graphql/workspace-query-builder/interfaces/object-record.interface';
import { ObjectMetadataInterface } from 'src/engine/metadata-modules/field-metadata/interfaces/object-metadata.interface';

import { DatabaseEventAction } from 'src/engine/api/graphql/graphql-query-runner/enums/database-event-action';
import { AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { objectRecordChangedValues } from 'src/engine/core-modules/event-emitter/utils/object-record-changed-values';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';

@Injectable()
export class ApiEventEmitterService {
  constructor(private readonly workspaceEventEmitter: WorkspaceEventEmitter) {}

  public emitCreateEvents<T extends ObjectRecord>(
    records: T[],
    authContext: AuthContext,
    objectMetadataItem: ObjectMetadataInterface,
  ): void {
    this.workspaceEventEmitter.emitDatabaseEvents({
      objectMetadataNameSingular: objectMetadataItem.nameSingular,
      action: DatabaseEventAction.CREATED,
      events: records.map((record) => ({
        userId: authContext.user?.id,
        recordId: record.id,
        objectMetadata: objectMetadataItem,
        properties: {
          before: null,
          after: this.removeGraphQLAndNestedProperties(record),
        },
      })),
      workspaceId: authContext.workspace.id,
    });
  }

  public emitUpdateEvents<T extends ObjectRecord>(
    existingRecords: T[],
    records: T[],
    updatedFields: string[],
    authContext: AuthContext,
    objectMetadataItem: ObjectMetadataInterface,
  ): void {
    const mappedExistingRecords = existingRecords.reduce(
      (acc, { id, ...record }) => ({
        ...acc,
        [id]: record,
      }),
      {},
    );

    this.workspaceEventEmitter.emitDatabaseEvents({
      objectMetadataNameSingular: objectMetadataItem.nameSingular,
      action: DatabaseEventAction.UPDATED,
      events: records.map((record) => {
        const before = this.removeGraphQLAndNestedProperties(
          mappedExistingRecords[record.id],
        );
        const after = this.removeGraphQLAndNestedProperties(record);
        const diff = objectRecordChangedValues(
          before,
          after,
          updatedFields,
          objectMetadataItem,
        );

        return {
          userId: authContext.user?.id,
          recordId: record.id,
          objectMetadata: objectMetadataItem,
          properties: {
            before,
            after,
            updatedFields,
            diff,
          },
        };
      }),
      workspaceId: authContext.workspace.id,
    });
  }

  public emitDeletedEvents<T extends ObjectRecord>(
    records: T[],
    authContext: AuthContext,
    objectMetadataItem: ObjectMetadataInterface,
  ): void {
    this.workspaceEventEmitter.emitDatabaseEvents({
      objectMetadataNameSingular: objectMetadataItem.nameSingular,
      action: DatabaseEventAction.DELETED,
      events: records.map((record) => {
        return {
          userId: authContext.user?.id,
          recordId: record.id,
          objectMetadata: objectMetadataItem,
          properties: {
            before: this.removeGraphQLAndNestedProperties(record),
            after: null,
          },
        };
      }),
      workspaceId: authContext.workspace.id,
    });
  }

  public emitDestroyEvents<T extends ObjectRecord>(
    records: T[],
    authContext: AuthContext,
    objectMetadataItem: ObjectMetadataInterface,
  ): void {
    this.workspaceEventEmitter.emitDatabaseEvents({
      objectMetadataNameSingular: objectMetadataItem.nameSingular,
      action: DatabaseEventAction.DESTROYED,
      events: records.map((record) => {
        return {
          userId: authContext.user?.id,
          recordId: record.id,
          objectMetadata: objectMetadataItem,
          properties: {
            before: this.removeGraphQLAndNestedProperties(record),
            after: null,
          },
        };
      }),
      workspaceId: authContext.workspace.id,
    });
  }

  private removeGraphQLAndNestedProperties<T extends ObjectRecord>(record: T) {
    if (!record) {
      return {};
    }

    const sanitizedRecord = {};

    for (const [key, value] of Object.entries(record)) {
      if (value && typeof value === 'object' && value['edges']) {
        continue;
      }

      if (key === '__typename') {
        continue;
      }

      sanitizedRecord[key] = value;
    }

    return sanitizedRecord;
  }
}
