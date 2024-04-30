import { metadataArgsStorage } from 'src/engine/twenty-orm/storage/metadata-args.storage';
import { convertClassNameToObjectMetadataName } from 'src/engine/workspace-manager/workspace-sync-metadata/utils/convert-class-to-object-metadata-name.util';
import { TypedReflect } from 'src/utils/typed-reflect';

interface WorkspaceObjectOptions {
  standardId: string;
  namePlural: string;
  labelSingular: string;
  labelPlural: string;
  description?: string;
  icon?: string;
}

export function WorkspaceObject(
  options: WorkspaceObjectOptions,
): ClassDecorator {
  return (target) => {
    const isAuditLogged =
      TypedReflect.getMetadata(
        'workspace:is-audit-logged-metadata-args',
        target,
      ) ?? true;
    const isSystem = TypedReflect.getMetadata(
      'workspace:is-system-metadata-args',
      target,
    );
    const gate = TypedReflect.getMetadata(
      'workspace:gate-metadata-args',
      target,
    );
    const objectName = convertClassNameToObjectMetadataName(target.name);

    metadataArgsStorage.objects.push({
      target,
      standardId: options.standardId,
      nameSingular: objectName,
      namePlural: options.namePlural,
      labelSingular: options.labelSingular,
      labelPlural: options.labelPlural,
      description: options.description,
      icon: options.icon,
      isAuditLogged,
      isSystem,
      gate,
    });
  };
}
