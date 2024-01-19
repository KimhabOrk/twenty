import { Injectable } from '@nestjs/common';

import { WorkspaceSyncContext } from 'src/workspace/workspace-sync-metadata/interfaces/workspace-sync-context.interface';
import { PartialObjectMetadata } from 'src/workspace/workspace-sync-metadata/interfaces/partial-object-metadata.interface';
import { FeatureFlagMap } from 'src/core/feature-flag/interfaces/feature-flag-map.interface';

import { BaseObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/base.object-metadata';
import { standardObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects';
import { TypedReflect } from 'src/utils/typed-reflect';
import { isGatedAndNotEnabled } from 'src/workspace/workspace-sync-metadata/utils/is-gate-and-not-enabled.util';

@Injectable()
export class StandardObjectFactory {
  create(
    context: WorkspaceSyncContext,
    workspaceFeatureFlagsMap: FeatureFlagMap,
  ): PartialObjectMetadata[] {
    return standardObjectMetadata
      .map((metadata) =>
        this.createObjectMetadata(metadata, context, workspaceFeatureFlagsMap),
      )
      .filter((metadata): metadata is PartialObjectMetadata => !!metadata);
  }

  private createObjectMetadata(
    metadata: typeof BaseObjectMetadata,
    context: WorkspaceSyncContext,
    workspaceFeatureFlagsMap: FeatureFlagMap,
  ): PartialObjectMetadata | undefined {
    const objectMetadata = TypedReflect.getMetadata('objectMetadata', metadata);
    const fieldMetadata =
      TypedReflect.getMetadata('fieldMetadata', metadata) ?? {};

    if (!objectMetadata) {
      throw new Error(
        `Object metadata decorator not found, can\'t parse ${metadata.name}`,
      );
    }

    if (isGatedAndNotEnabled(objectMetadata, workspaceFeatureFlagsMap)) {
      return undefined;
    }

    const fields = Object.values(fieldMetadata).filter(
      (field) => !isGatedAndNotEnabled(field, workspaceFeatureFlagsMap),
    );

    return {
      ...objectMetadata,
      workspaceId: context.workspaceId,
      dataSourceId: context.dataSourceId,
      fields: fields.map((field) => ({
        ...field,
        workspaceId: context.workspaceId,
        isSystem: objectMetadata.isSystem || field.isSystem,
      })),
    };
  }
}
