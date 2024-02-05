import { ApolloCache, StoreObject } from '@apollo/client';

import { isCachedObjectRecordConnection } from '@/apollo/optimistic-effect/utils/isCachedObjectRecordConnection';
import { triggerUpdateRelationsOptimisticEffect } from '@/apollo/optimistic-effect/utils/triggerUpdateRelationsOptimisticEffect';
import { CachedObjectRecord } from '@/apollo/types/CachedObjectRecord';
import { CachedObjectRecordEdge } from '@/apollo/types/CachedObjectRecordEdge';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { getEdgeTypename } from '@/object-record/cache/utils/getEdgeTypename';

/*
  TODO: for now new records are added to all cached record lists, no matter what the variables (filters, orderBy, etc.) are.
  We need to refactor how the record creation works in the RecordTable so the created record row is temporarily displayed with a local state,
  then we'll be able to uncomment the code below so the cached lists are updated coherently with the variables.
*/
export const triggerCreateRecordsOptimisticEffect = ({
  cache,
  objectMetadataItem,
  records: recordsToCreate,
  objectMetadataItems,
}: {
  cache: ApolloCache<unknown>;
  objectMetadataItem: ObjectMetadataItem;
  records: CachedObjectRecord[];
  objectMetadataItems: ObjectMetadataItem[];
}) => {
  const objectEdgeTypeName = getEdgeTypename({
    objectNameSingular: objectMetadataItem.nameSingular,
  });

  recordsToCreate.forEach((record) =>
    triggerUpdateRelationsOptimisticEffect({
      cache,
      relationSourceObjectMetadataItem: objectMetadataItem,
      currentRelationSourceRecord: null,
      updatedRelationSourceRecord: record,
      objectMetadataItems,
    }),
  );

  cache.modify<StoreObject>({
    fields: {
      [objectMetadataItem.namePlural]: (
        rootQueryCachedResponse,
        {
          DELETE: _DELETE,
          readField,
          storeFieldName: _storeFieldName,
          toReference,
        },
      ) => {
        const rootQueryCachedResponseIsNotACachedObjectRecordConnection =
          !isCachedObjectRecordConnection(
            objectMetadataItem.nameSingular,
            rootQueryCachedResponse,
          );

        if (rootQueryCachedResponseIsNotACachedObjectRecordConnection) {
          return rootQueryCachedResponse;
        }

        const rootQueryCachedObjectRecordConnection = rootQueryCachedResponse;

        const rootQueryCachedRecordEdges = readField<CachedObjectRecordEdge[]>(
          'edges',
          rootQueryCachedObjectRecordConnection,
        );
        const nextRootQueryCachedRecordEdges = rootQueryCachedRecordEdges
          ? [...rootQueryCachedRecordEdges]
          : [];

        const hasAddedRecords = recordsToCreate
          .map((recordToCreate) => {
            if (recordToCreate.id) {
              const recordToCreateReference = toReference(recordToCreate);

              if (!recordToCreateReference) {
                throw new Error(
                  `Failed to create reference for record with id: ${recordToCreate.id}`,
                );
              }

              const recordAlreadyInCache = rootQueryCachedRecordEdges?.some(
                (cachedEdge) => {
                  return (
                    cache.identify(recordToCreateReference) ===
                    cache.identify(cachedEdge.node)
                  );
                },
              );

              if (recordToCreateReference && !recordAlreadyInCache) {
                nextRootQueryCachedRecordEdges.unshift({
                  __typename: objectEdgeTypeName,
                  node: recordToCreateReference,
                  cursor: '',
                });

                return true;
              }
            }

            return false;
          })
          .some((hasAddedRecord) => hasAddedRecord);

        if (!hasAddedRecords) {
          return rootQueryCachedObjectRecordConnection;
        }

        return {
          ...rootQueryCachedObjectRecordConnection,
          edges: nextRootQueryCachedRecordEdges,
        };
      },
    },
  });
};
