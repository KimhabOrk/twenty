import { useApolloClient } from '@apollo/client';

import { triggerDeleteRecordsOptimisticEffect } from '@/apollo/optimistic-effect/utils/triggerDeleteRecordsOptimisticEffect';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { useGetRecordFromCache } from '@/object-record/cache/hooks/useGetRecordFromCache';
import { useDeleteManyRecordsMutation } from '@/object-record/hooks/useDeleteManyRecordsMutation';
import { getDeleteManyRecordsMutationResponseField } from '@/object-record/utils/getDeleteManyRecordsMutationResponseField';
import { isDefined } from '~/utils/isDefined';
import { capitalize } from '~/utils/string/capitalize';

type useDeleteOneRecordProps = {
  objectNameSingular: string;
  refetchFindManyQuery?: boolean;
};

type DeleteManyRecordsOptions = {
  skipOptimisticEffect?: boolean;
};

export const useDeleteManyRecords = ({
  objectNameSingular,
}: useDeleteOneRecordProps) => {
  const apolloClient = useApolloClient();

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const getRecordFromCache = useGetRecordFromCache({
    objectNameSingular,
  });

  const { deleteManyRecordsMutation } = useDeleteManyRecordsMutation({
    objectNameSingular,
  });

  const { objectMetadataItems } = useObjectMetadataItems();

  const mutationResponseField = getDeleteManyRecordsMutationResponseField(
    objectMetadataItem.namePlural,
  );

  const deleteManyRecords = async (
    idsToDelete: string[],
    options?: DeleteManyRecordsOptions,
    chunkSize = 30,
  ) => {
    const chunkedIds = idsToDelete.reduce<string[][]>((acc, id, index) => {
      const chunkIndex = Math.floor(index / chunkSize);
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = [];
      }
      acc[chunkIndex].push(id);
      return acc;
    }, []);

    const res = await Promise.all(
      chunkedIds.map(async (ids) => {
        const deletedRecords = await apolloClient.mutate({
          mutation: deleteManyRecordsMutation,
          variables: {
            filter: { id: { in: ids } },
          },
          optimisticResponse: options?.skipOptimisticEffect
            ? undefined
            : {
                [mutationResponseField]: ids.map((idToDelete) => ({
                  __typename: capitalize(objectNameSingular),
                  id: idToDelete,
                })),
              },
          update: options?.skipOptimisticEffect
            ? undefined
            : (cache, { data }) => {
                const records = data?.[mutationResponseField];

                if (!records?.length) return;

                const cachedRecords = records
                  .map((record) => getRecordFromCache(record.id, cache))
                  .filter(isDefined);

                triggerDeleteRecordsOptimisticEffect({
                  cache,
                  objectMetadataItem,
                  recordsToDelete: cachedRecords,
                  objectMetadataItems,
                });
              },
        });

        return deletedRecords.data?.[mutationResponseField] ?? null;
      }),
    );

    return res;
  };

  return { deleteManyRecords };
};
